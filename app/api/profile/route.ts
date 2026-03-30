import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { healthProfileSchema } from "@/lib/validations";
import { success, error } from "@/lib/apiResponse";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return error("Unauthorized", 401);
    }

    const body = await request.json();
    const parsed = healthProfileSchema.safeParse(body);

    if (!parsed.success) {
      const messages = parsed.error.issues.map((e: { message: string }) => e.message).join("; ");
      return error(messages, 400);
    }

    const profileData = {
      user_id: user.id,
      age: parseInt(parsed.data.age),
      gender: parsed.data.gender,
      height: parseFloat(parsed.data.height),
      weight: parseFloat(parsed.data.weight),
      activity_level: parsed.data.activityLevel,
      health_goal: parsed.data.healthGoal,
      dietary_preference: parsed.data.dietaryPreference,
      allergies: parsed.data.allergies,
      meals_per_day: parsed.data.mealsPerDay,
      budget: parsed.data.budget,
      cooking_preference: parsed.data.cookingPreference,
      medical_conditions: parsed.data.medicalConditions,
    };

    const { data, error: dbError } = await supabase
      .from("health_profiles")
      .upsert(profileData, { onConflict: "user_id" })
      .select()
      .single();

    if (dbError) {
      logger.error("Profile save error", { userId: user.id, error: dbError.message });
      return error("Failed to save profile", 500);
    }

    logger.info("Profile saved", { userId: user.id });
    return success({ message: "Health profile saved successfully", profile: data });
  } catch (err) {
    logger.error("Profile API error", { error: err instanceof Error ? err.message : "Unknown" });
    return error("Internal server error", 500);
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return error("Unauthorized", 401);
    }

    const { data: profile, error: dbError } = await supabase
      .from("health_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (dbError || !profile) {
      return success({ profile: null, message: "No profile found" });
    }

    return success({ profile });
  } catch (err) {
    logger.error("Profile GET error", { error: err instanceof Error ? err.message : "Unknown" });
    return error("Internal server error", 500);
  }
}
