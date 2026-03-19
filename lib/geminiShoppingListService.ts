import { GoogleGenerativeAI } from "@google/generative-ai";
import { MealRecommendation } from "./recommendationEngine";

/**
 * AI-Powered Shopping List Generator
 * Status: 65% Complete - Prototype Implementation
 */

export interface ShoppingListItem {
  name: string;
  quantity: string;
  category: "Produce" | "Protein" | "Dairy" | "Grains" | "Spices" | "Other";
  estimated_cost?: string;
  notes?: string;
  priority?: "Essential" | "Optional";
}

export interface ShoppingList {
  meals: string[];
  servings: number;
  budget?: string;
  items: ShoppingListItem[];
  totalEstimatedCost?: string;
  shoppingTips: string[];
  storageAdvice: string[];
}

/**
 * Generate shopping list from meal recommendations
 * TODO: Add price estimation from local stores
 * TODO: Add store location suggestions
 * TODO: Implement smart grouping by store sections
 */
export async function generateShoppingList(
  meals: MealRecommendation[],
  servings: number = 2,
  budget?: string
): Promise<ShoppingList> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const mealNames = meals.map(m => m.name).join(", ");
    const budgetInfo = budget ? `Budget: ${budget}` : "No specific budget";

    const prompt = `Generate a consolidated shopping list for these meals: ${mealNames}

Requirements:
- Servings: ${servings} people
- ${budgetInfo}
- Combine duplicate ingredients
- Organize by category
- Include estimated costs in INR

Return JSON in this format:
{
  "meals": ["meal1", "meal2"],
  "servings": ${servings},
  "budget": "${budget || 'flexible'}",
  "items": [
    {
      "name": "ingredient name",
      "quantity": "500g",
      "category": "Produce",
      "estimated_cost": "₹50",
      "notes": "optional notes",
      "priority": "Essential"
    }
  ],
  "totalEstimatedCost": "₹500",
  "shoppingTips": [
    "Buy seasonal vegetables for better prices",
    "Check local markets for fresh produce"
  ],
  "storageAdvice": [
    "Store leafy greens in refrigerator",
    "Keep dry ingredients in airtight containers"
  ]
}

Return ONLY the JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse response
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    const shoppingList: ShoppingList = JSON.parse(cleanedText);
    return shoppingList;

  } catch (error) {
    console.error("Error generating shopping list:", error);

    // Fallback to basic shopping list
    return generateFallbackShoppingList(meals, servings, budget);
  }
}

/**
 * Fallback shopping list generator
 * TODO: Improve with actual ingredient database
 */
function generateFallbackShoppingList(
  meals: MealRecommendation[],
  servings: number,
  budget?: string
): ShoppingList {
  const basicItems: ShoppingListItem[] = [
    {
      name: "Fresh Vegetables",
      quantity: "1kg",
      category: "Produce",
      estimated_cost: "₹100",
      priority: "Essential",
    },
    {
      name: "Protein Source",
      quantity: "500g",
      category: "Protein",
      estimated_cost: "₹200",
      priority: "Essential",
    },
    {
      name: "Rice/Grains",
      quantity: "500g",
      category: "Grains",
      estimated_cost: "₹50",
      priority: "Essential",
    },
    {
      name: "Cooking Oil",
      quantity: "200ml",
      category: "Other",
      estimated_cost: "₹50",
      priority: "Essential",
    },
    {
      name: "Spices",
      quantity: "As needed",
      category: "Spices",
      estimated_cost: "₹100",
      priority: "Optional",
    },
  ];

  return {
    meals: meals.map(m => m.name),
    servings,
    budget: budget || "flexible",
    items: basicItems,
    totalEstimatedCost: "₹500",
    shoppingTips: [
      "Buy fresh ingredients for best results",
      "Check local markets for better prices",
      "Consider buying in bulk to save money",
    ],
    storageAdvice: [
      "Store vegetables in refrigerator",
      "Keep grains in airtight containers",
      "Use fresh ingredients within 3-5 days",
    ],
  };
}

/**
 * TODO: Implement smart list optimization
 * - Remove items user already has
 * - Suggest substitutions for expensive items
 * - Find deals and discounts
 */
export async function optimizeShoppingList(
  list: ShoppingList,
  pantryItems: string[]
): Promise<ShoppingList> {
  // Placeholder - needs implementation
  const optimizedItems = list.items.filter(
    item => !pantryItems.includes(item.name.toLowerCase())
  );

  return {
    ...list,
    items: optimizedItems,
  };
}

/**
 * TODO: Add store-specific shopping lists
 * TODO: Implement price comparison across stores
 */
export interface StoreSpecificList {
  storeName: string;
  items: ShoppingListItem[];
  estimatedTotal: string;
  distance?: string;
}

export async function generateStoreSpecificLists(
  list: ShoppingList,
  userLocation?: string
): Promise<StoreSpecificList[]> {
  // Placeholder - needs implementation with actual store APIs
  return [
    {
      storeName: "Local Market",
      items: list.items.filter(i => i.category === "Produce"),
      estimatedTotal: "₹200",
      distance: "0.5 km",
    },
    {
      storeName: "Supermarket",
      items: list.items.filter(i => i.category !== "Produce"),
      estimatedTotal: "₹300",
      distance: "1.2 km",
    },
  ];
}
