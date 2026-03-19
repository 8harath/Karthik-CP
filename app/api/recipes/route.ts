import { NextRequest, NextResponse } from "next/server";
import { generateDetailedRecipe } from "@/lib/geminiRecipeService";

/**
 * API Route: Generate detailed recipe with AI
 * Status: Prototype (60% complete)
 * TODO: Add authentication
 * TODO: Add rate limiting
 * TODO: Add caching for popular recipes
 */
export async function POST(request: NextRequest) {
  try {
    const { mealName, dietaryPreference, servings } = await request.json();

    // Validation
    if (!mealName) {
      return NextResponse.json(
        { error: "Meal name is required" },
        { status: 400 }
      );
    }

    // Generate recipe using Gemini
    const recipe = await generateDetailedRecipe(
      mealName,
      dietaryPreference || "non-vegetarian",
      servings || 2
    );

    return NextResponse.json({
      success: true,
      recipe,
      message: "Recipe generated successfully",
    });

  } catch (error) {
    console.error("Error in recipe API:", error);

    return NextResponse.json(
      {
        error: "Failed to generate recipe",
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * TODO: Implement GET endpoint for saved recipes
 * TODO: Add favorite recipes functionality
 * TODO: Add recipe rating system
 */
export async function GET(request: NextRequest) {
  // Placeholder for future implementation
  return NextResponse.json({
    message: "Recipe listing coming soon",
    status: "prototype",
  });
}
