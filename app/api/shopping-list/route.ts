import { NextRequest, NextResponse } from "next/server";
import { generateShoppingList } from "@/lib/geminiShoppingListService";
import { MealRecommendation } from "@/lib/recommendationEngine";

/**
 * API Route: Generate AI-powered shopping list
 * Status: Prototype (65% complete)
 * TODO: Add user authentication
 * TODO: Integrate with local store APIs for pricing
 * TODO: Add shopping list history
 */
export async function POST(request: NextRequest) {
  try {
    const { meals, servings, budget } = await request.json();

    // Validation
    if (!meals || !Array.isArray(meals) || meals.length === 0) {
      return NextResponse.json(
        { error: "At least one meal is required" },
        { status: 400 }
      );
    }

    // Generate shopping list
    const shoppingList = await generateShoppingList(
      meals as MealRecommendation[],
      servings || 2,
      budget
    );

    return NextResponse.json({
      success: true,
      shoppingList,
      message: "Shopping list generated successfully",
    });

  } catch (error) {
    console.error("Error in shopping list API:", error);

    return NextResponse.json(
      {
        error: "Failed to generate shopping list",
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * TODO: Implement GET endpoint for saved shopping lists
 * TODO: Add shopping list sharing functionality
 * TODO: Add check-off items tracking
 */
export async function GET(request: NextRequest) {
  // Placeholder for future implementation
  return NextResponse.json({
    message: "Shopping list history coming soon",
    status: "prototype",
  });
}

/**
 * TODO: Add PATCH endpoint to update shopping list items
 * TODO: Add DELETE endpoint to remove completed lists
 */
