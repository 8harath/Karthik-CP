import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI-Powered Recipe Generator using Gemini
 * Status: 60% Complete - Prototype Implementation
 */

export interface RecipeInstruction {
  step: number;
  instruction: string;
  timing?: string;
  tips?: string;
}

export interface DetailedRecipe {
  mealName: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: {
    name: string;
    amount: string;
    notes?: string;
  }[];
  instructions: RecipeInstruction[];
  nutritionInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  cookingTips: string[];
  storageInstructions?: string;
}

/**
 * Generate detailed recipe with AI
 * TODO: Add image generation for recipe steps
 * TODO: Add video tutorial links
 * TODO: Add substitution suggestions
 */
export async function generateDetailedRecipe(
  mealName: string,
  dietaryPreference: string,
  servings: number = 2
): Promise<DetailedRecipe> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate a detailed recipe for "${mealName}" (${dietaryPreference} diet) for ${servings} servings.

Return a JSON object with this exact structure:
{
  "mealName": "${mealName}",
  "prepTime": 15,
  "cookTime": 30,
  "servings": ${servings},
  "difficulty": "Easy",
  "ingredients": [
    {
      "name": "ingredient name",
      "amount": "2 cups",
      "notes": "optional notes"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "instruction": "detailed instruction",
      "timing": "5 minutes",
      "tips": "helpful tip"
    }
  ],
  "nutritionInfo": {
    "calories": 450,
    "protein": 35,
    "carbs": 40,
    "fats": 15
  },
  "cookingTips": [
    "tip 1",
    "tip 2",
    "tip 3"
  ],
  "storageInstructions": "How to store leftovers"
}

Make it detailed and realistic. Return ONLY the JSON.`;

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

    const recipe: DetailedRecipe = JSON.parse(cleanedText);
    return recipe;

  } catch (error) {
    console.error("Error generating recipe:", error);

    // TODO: Implement better fallback with pre-defined recipes
    // For now, return a basic template
    return generateFallbackRecipe(mealName, servings);
  }
}

/**
 * Fallback recipe generator
 * TODO: Add more pre-defined recipes
 * TODO: Add recipe database
 */
function generateFallbackRecipe(mealName: string, servings: number): DetailedRecipe {
  return {
    mealName,
    prepTime: 15,
    cookTime: 30,
    servings,
    difficulty: "Medium",
    ingredients: [
      { name: "Main ingredient", amount: "500g", notes: "Fresh" },
      { name: "Vegetables", amount: "2 cups", notes: "Chopped" },
      { name: "Spices", amount: "To taste" },
    ],
    instructions: [
      {
        step: 1,
        instruction: "Prepare all ingredients by washing and chopping as needed.",
        timing: "10 minutes",
      },
      {
        step: 2,
        instruction: "Cook according to your preference.",
        timing: "20 minutes",
      },
      {
        step: 3,
        instruction: "Season and serve hot.",
        timing: "5 minutes",
      },
    ],
    nutritionInfo: {
      calories: 400,
      protein: 30,
      carbs: 35,
      fats: 15,
    },
    cookingTips: [
      "Use fresh ingredients for best results",
      "Adjust spices to taste",
      "Can be prepared ahead of time",
    ],
  };
}

/**
 * TODO: Implement batch recipe generation for meal plans
 * TODO: Add recipe difficulty customization
 * TODO: Add cuisine-specific instructions
 * TODO: Add equipment requirements list
 */
export async function generateMultipleRecipes(
  mealNames: string[],
  dietaryPreference: string
): Promise<DetailedRecipe[]> {
  // Placeholder for batch processing
  const recipes: DetailedRecipe[] = [];

  for (const mealName of mealNames) {
    const recipe = await generateDetailedRecipe(mealName, dietaryPreference);
    recipes.push(recipe);
  }

  return recipes;
}

/**
 * TODO: Implement recipe customization based on available ingredients
 */
export async function customizeRecipe(
  recipe: DetailedRecipe,
  availableIngredients: string[]
): Promise<DetailedRecipe> {
  // Placeholder - needs implementation
  return recipe;
}
