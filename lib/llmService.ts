import { GoogleGenerativeAI } from "@google/generative-ai";
import { HealthProfile, MealRecommendation, generateRecommendations as fallbackRecommendations } from "./recommendationEngine";

// Initialize Gemini API
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables");
  }

  return new GoogleGenerativeAI(apiKey);
};

export interface LLMRecommendationResponse {
  meals: MealRecommendation[];
  insights: {
    bmi: number;
    bmiCategory: string;
    healthTips: string[];
    whyTheseMeals: string;
    nutritionalFocus: string;
  };
  success: boolean;
  usedFallback?: boolean;
}

/**
 * Generate AI-powered meal recommendations using Gemini 1.5 Flash
 */
export async function generateMealRecommendationsWithLLM(
  profile: HealthProfile
): Promise<LLMRecommendationResponse> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Calculate BMI
    const height = parseFloat(profile.height);
    const weight = parseFloat(profile.weight);
    const bmi = calculateBMI(height, weight);
    const bmiCategory = getBMICategory(bmi);

    // Create detailed prompt for Gemini
    const prompt = createMealRecommendationPrompt(profile, bmi, bmiCategory);

    // Generate recommendations
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response from LLM
    const parsedResponse = parseGeminiResponse(text);

    return {
      meals: parsedResponse.meals,
      insights: {
        bmi,
        bmiCategory,
        healthTips: parsedResponse.healthTips,
        whyTheseMeals: parsedResponse.whyTheseMeals,
        nutritionalFocus: parsedResponse.nutritionalFocus,
      },
      success: true,
      usedFallback: false,
    };
  } catch (error) {
    console.error("Error generating LLM recommendations:", error);

    // Fallback to rule-based recommendations
    return generateFallbackRecommendations(profile);
  }
}

/**
 * Create a detailed prompt for Gemini to generate personalized meal recommendations
 */
function createMealRecommendationPrompt(
  profile: HealthProfile,
  bmi: number,
  bmiCategory: string
): string {
  return `You are a professional nutritionist and meal planning expert. Based on the user's health profile, generate 5 personalized meal recommendations.

**User Health Profile:**
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- BMI: ${bmi} (${bmiCategory})
- Activity Level: ${profile.activityLevel}
- Health Goal: ${profile.healthGoal}
- Dietary Preference: ${profile.dietaryPreference}
- Allergies: ${profile.allergies || "None"}
- Meals Per Day: ${profile.mealsPerDay}
- Budget: ${profile.budget}
- Cooking Preference: ${profile.cookingPreference}
- Medical Conditions: ${profile.medicalConditions || "None"}

**Task:**
Generate 5 personalized meal recommendations that align with the user's health goals and dietary preferences. Each meal should:
1. Match their dietary preference (${profile.dietaryPreference})
2. Support their health goal (${profile.healthGoal})
3. Be appropriate for their activity level (${profile.activityLevel})
4. Avoid any mentioned allergies
5. Include realistic nutritional information (calories, protein, carbs, fats in grams)

**Response Format (MUST BE VALID JSON):**
{
  "meals": [
    {
      "id": 1,
      "name": "Meal Name",
      "description": "Brief appetizing description",
      "calories": 450,
      "protein": 35,
      "carbs": 40,
      "fats": 15,
      "type": "${profile.dietaryPreference.toLowerCase()}",
      "tags": ["relevant", "tags"],
      "image": "🍽️"
    }
  ],
  "healthTips": [
    "Tip 1 based on their health goal",
    "Tip 2 based on their BMI category",
    "Tip 3 based on their activity level"
  ],
  "whyTheseMeals": "2-3 sentence explanation of why these specific meals were chosen for this user",
  "nutritionalFocus": "Brief statement about the nutritional strategy (e.g., 'High protein, moderate carbs for muscle gain')"
}

**Important Guidelines:**
- Use appropriate emojis for meal images (🍗, 🥗, 🍝, 🐟, 🥙, etc.)
- Ensure meals are culturally diverse and appealing
- Calories should align with activity level and health goals
- If goal is weight-loss, keep meals under 450 calories
- If goal is muscle-gain, prioritize protein (>30g per meal)
- If goal is energy, ensure adequate carbs (>50g per meal)
- Avoid any ingredients related to allergies
- Make descriptions appetizing and motivating

Return ONLY the JSON object, no additional text.`;
}

/**
 * Parse Gemini's response and extract meal recommendations
 */
function parseGeminiResponse(text: string): {
  meals: MealRecommendation[];
  healthTips: string[];
  whyTheseMeals: string;
  nutritionalFocus: string;
} {
  try {
    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(cleanedText);

    // Validate the response structure
    if (!parsed.meals || !Array.isArray(parsed.meals)) {
      throw new Error("Invalid response structure: missing meals array");
    }

    return {
      meals: parsed.meals.slice(0, 5), // Ensure max 5 meals
      healthTips: parsed.healthTips || [],
      whyTheseMeals: parsed.whyTheseMeals || "These meals are tailored to your health profile.",
      nutritionalFocus: parsed.nutritionalFocus || "Balanced nutrition for your goals.",
    };
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("Failed to parse LLM response");
  }
}

/**
 * Fallback to rule-based recommendations if LLM fails
 */
function generateFallbackRecommendations(profile: HealthProfile): LLMRecommendationResponse {
  const height = parseFloat(profile.height);
  const weight = parseFloat(profile.weight);
  const bmi = calculateBMI(height, weight);
  const bmiCategory = getBMICategory(bmi);

  const meals = fallbackRecommendations(profile);

  return {
    meals,
    insights: {
      bmi,
      bmiCategory,
      healthTips: [
        `Focus on ${profile.healthGoal.replace("-", " ")} with consistent meal planning.`,
        `Your BMI indicates ${bmiCategory.toLowerCase()} - maintain a balanced diet.`,
        `Stay active with ${profile.activityLevel.toLowerCase()} to support your goals.`,
      ],
      whyTheseMeals: `These meals are selected based on your ${profile.dietaryPreference} preference and ${profile.healthGoal.replace("-", " ")} goal using our proven recommendation engine.`,
      nutritionalFocus: getFallbackNutritionalFocus(profile.healthGoal),
    },
    success: true,
    usedFallback: true,
  };
}

/**
 * Get nutritional focus based on health goal
 */
function getFallbackNutritionalFocus(healthGoal: string): string {
  const focusMap: Record<string, string> = {
    "weight-loss": "Low calorie, high protein for sustainable weight management",
    "muscle-gain": "High protein, moderate carbs for muscle building",
    "energy": "Complex carbs, balanced macros for sustained energy",
    "general-health": "Balanced nutrition for overall wellness",
  };

  return focusMap[healthGoal.toLowerCase()] || "Balanced nutrition for your goals";
}

/**
 * Calculate BMI (Body Mass Index)
 */
function calculateBMI(height: number, weight: number): number {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

/**
 * Get BMI category based on BMI value
 */
function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

/**
 * Validate that API key is configured
 */
export function isLLMConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
