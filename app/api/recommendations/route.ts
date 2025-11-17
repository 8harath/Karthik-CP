import { NextRequest, NextResponse } from "next/server";
import { generateMealRecommendationsWithLLM, isLLMConfigured } from "@/lib/llmService";
import { generateRecommendations } from "@/lib/recommendationEngine";

export async function POST(request: NextRequest) {
  try {
    const healthProfile = await request.json();

    // Check if LLM is configured
    if (!isLLMConfigured()) {
      console.warn("⚠️  GEMINI_API_KEY not configured - using fallback rule-based engine");

      // Fallback to rule-based recommendations
      const recommendations = generateRecommendations(healthProfile);

      return NextResponse.json({
        success: true,
        recommendations,
        message: "Recommendations generated using rule-based engine (LLM not configured)",
        usedFallback: true,
      });
    }

    // Generate AI-powered recommendations using Gemini
    const result = await generateMealRecommendationsWithLLM(healthProfile);

    return NextResponse.json({
      success: true,
      recommendations: result.meals,
      insights: result.insights,
      message: result.usedFallback
        ? "Recommendations generated using fallback engine (LLM error)"
        : "AI-powered recommendations generated successfully",
      usedFallback: result.usedFallback,
    });
  } catch (error) {
    console.error("Error in recommendations API:", error);

    return NextResponse.json(
      {
        error: "Failed to generate recommendations",
        message: error instanceof Error ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}
