import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMealRecommendationsWithLLM, isLLMConfigured } from "@/lib/llmService";
import { generateRecommendations, calculateBMI, getBMICategory } from "@/lib/recommendationEngine";
import type { HealthProfile } from "@/lib/recommendationEngine";
import { logger } from "@/lib/logger";

// Rate limiting with automatic cleanup
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 1000;

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts) {
    if (now > value.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 5 * 60 * 1000);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// GET: Load latest stored recommendations
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: rec } = await supabase
      .from("recommendations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!rec) {
      return NextResponse.json({ success: true, recommendations: null });
    }

    return NextResponse.json({
      success: true,
      recommendations: rec.meals,
      insights: rec.insights,
      source: rec.source,
      generatedAt: rec.created_at,
    });
  } catch (error) {
    logger.error("Recommendations GET error", { error: error instanceof Error ? error.message : "Unknown" });
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST: Generate new recommendations
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded",
          message: "Too many requests. Please wait a moment before trying again.",
        },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Load health profile from DB
    const { data: dbProfile } = await supabase
      .from("health_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!dbProfile) {
      return NextResponse.json(
        { success: false, error: "Health profile not found. Please complete the questionnaire first." },
        { status: 404 }
      );
    }

    // Map DB profile to HealthProfile type
    const healthProfile: HealthProfile = {
      age: String(dbProfile.age),
      gender: dbProfile.gender,
      height: String(dbProfile.height),
      weight: String(dbProfile.weight),
      activityLevel: dbProfile.activity_level,
      healthGoal: dbProfile.health_goal,
      dietaryPreference: dbProfile.dietary_preference,
      allergies: dbProfile.allergies || "",
      mealsPerDay: dbProfile.meals_per_day,
      budget: dbProfile.budget,
      cookingPreference: dbProfile.cooking_preference,
      medicalConditions: dbProfile.medical_conditions || "",
      location: dbProfile.location || "other-india",
    };

    let recommendations;
    let insights;
    let usedFallback = false;
    let source = "groq";

    if (!isLLMConfigured()) {
      logger.warn("GROQ_API_KEY not configured - using fallback engine");
      const recs = generateRecommendations(healthProfile);
      const height = parseFloat(healthProfile.height);
      const weight = parseFloat(healthProfile.weight);
      const bmi = calculateBMI(height, weight);
      const bmiCategory = getBMICategory(bmi);

      recommendations = recs;
      insights = {
        bmi,
        bmiCategory,
        healthTips: [
          `Focus on ${healthProfile.healthGoal.replace("-", " ")} with consistent meal planning.`,
          `Your BMI indicates ${bmiCategory.toLowerCase()} — maintain a balanced diet.`,
          `Stay active with your ${healthProfile.activityLevel} lifestyle to support your goals.`,
        ],
        whyTheseMeals: `These meals are selected based on your ${healthProfile.dietaryPreference} preference and ${healthProfile.healthGoal.replace("-", " ")} goal using our recommendation engine.`,
        nutritionalFocus: healthProfile.healthGoal === "weight-loss"
          ? "Low calorie, high protein for sustainable weight management"
          : healthProfile.healthGoal === "muscle-gain"
            ? "High protein, moderate carbs for muscle building"
            : healthProfile.healthGoal === "energy"
              ? "Complex carbs, balanced macros for sustained energy"
              : "Balanced nutrition for overall wellness",
      };
      usedFallback = true;
      source = "fallback";
    } else {
      const result = await generateMealRecommendationsWithLLM(healthProfile);
      recommendations = result.meals;
      insights = result.insights;
      usedFallback = result.usedFallback || false;
      source = usedFallback ? "fallback" : "groq";
    }

    // Store recommendations in DB
    await supabase.from("recommendations").insert({
      user_id: user.id,
      meals: recommendations,
      insights,
      source,
    });

    logger.info("Recommendations generated", { userId: user.id, source, mealCount: recommendations.length });

    return NextResponse.json({
      success: true,
      recommendations,
      insights,
      message: usedFallback
        ? "Recommendations generated using fallback engine"
        : "AI-powered recommendations generated successfully",
      usedFallback,
    });
  } catch (error) {
    logger.error("Recommendations API error", { error: error instanceof Error ? error.message : "Unknown" });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate recommendations",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
