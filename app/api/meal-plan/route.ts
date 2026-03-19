import { NextRequest, NextResponse } from "next/server";
import { generateWeeklyMealPlan } from "@/lib/geminiMealPlannerService";
import { HealthProfile } from "@/lib/recommendationEngine";

/**
 * API Route: Generate weekly meal plan with AI
 * Status: Prototype (70% complete)
 * TODO: Add user authentication
 * TODO: Implement meal plan storage
 * TODO: Add calendar integration
 */
export async function POST(request: NextRequest) {
  try {
    const { profile, startDate, preferences } = await request.json();

    // Validation
    if (!profile) {
      return NextResponse.json(
        { error: "Health profile is required" },
        { status: 400 }
      );
    }

    // Parse start date
    const planStartDate = startDate ? new Date(startDate) : new Date();

    // Generate meal plan
    const mealPlan = await generateWeeklyMealPlan(
      profile as HealthProfile,
      planStartDate,
      preferences
    );

    return NextResponse.json({
      success: true,
      mealPlan,
      message: "Weekly meal plan generated successfully",
    });

  } catch (error) {
    console.error("Error in meal plan API:", error);

    return NextResponse.json(
      {
        error: "Failed to generate meal plan",
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * TODO: Implement GET endpoint for saved meal plans
 * TODO: Add meal plan history
 * TODO: Add meal plan templates
 */
export async function GET(request: NextRequest) {
  // Placeholder for future implementation
  return NextResponse.json({
    message: "Meal plan history coming soon",
    status: "prototype",
  });
}

/**
 * TODO: Add PATCH endpoint to adjust meal plans
 * TODO: Add DELETE endpoint to remove old plans
 * TODO: Implement meal swap functionality
 */
