import Groq from "groq-sdk";
import { HealthProfile, MealRecommendation, generateRecommendations as fallbackRecommendations } from "./recommendationEngine";

// Initialize Groq client
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured in environment variables");
  }

  return new Groq({ apiKey });
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
 * Retry a function with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error instanceof Error ? error.message : error);

      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Generate AI-powered meal recommendations using Groq (Llama 3.3 70B)
 */
export async function generateMealRecommendationsWithLLM(
  profile: HealthProfile
): Promise<LLMRecommendationResponse> {
  try {
    const groq = getGroqClient();

    // Calculate BMI
    const height = parseFloat(profile.height);
    const weight = parseFloat(profile.weight);
    const bmi = calculateBMI(height, weight);
    const bmiCategory = getBMICategory(bmi);

    // Create detailed prompt
    const prompt = createMealRecommendationPrompt(profile, bmi, bmiCategory);

    // Generate recommendations with retry
    const chatCompletion = await withRetry(
      () => groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a professional nutritionist and meal planning expert. Always respond with valid JSON only, no additional text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: "json_object" },
      }),
      2
    );

    const text = chatCompletion.choices[0]?.message?.content || "";

    // Parse JSON response from LLM
    const parsedResponse = parseLLMResponse(text);

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
 * Create a detailed prompt for generating personalized meal recommendations
 */
function createMealRecommendationPrompt(
  profile: HealthProfile,
  bmi: number,
  bmiCategory: string
): string {
  return `Based on the user's health profile, generate 5 personalized meal recommendations.

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
Generate 5 personalized South Indian meal recommendations that align with the user's health goals and dietary preferences. Each meal should:
1. Be EXCLUSIVELY from South Indian cuisine (e.g., dosa, idli, sambar, rasam, biryani, chettinad, upma, appam, uttapam, pongal, etc.)
2. Match their dietary preference (${profile.dietaryPreference})
3. Support their health goal (${profile.healthGoal})
4. Be appropriate for their activity level (${profile.activityLevel})
5. Avoid any mentioned allergies
6. Include realistic nutritional information (calories, protein, carbs, fats in grams)

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
      "image": "emoji"
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
- ALL meals MUST be authentic South Indian dishes only
- Use appropriate emojis for meal images
- Focus on traditional South Indian ingredients: rice, lentils, coconut, curry leaves, tamarind, etc.
- Calories should align with activity level and health goals
- If goal is weight-loss, keep meals under 450 calories
- If goal is muscle-gain, prioritize protein (>30g per meal)
- If goal is energy, ensure adequate carbs (>50g per meal)
- Avoid any ingredients related to allergies
- Make descriptions appetizing and motivating
- Include regional variations (Kerala, Tamil Nadu, Karnataka, Andhra Pradesh cuisines)`;
}

/**
 * Parse LLM response and extract meal recommendations
 */
function parseLLMResponse(text: string): {
  meals: MealRecommendation[];
  healthTips: string[];
  whyTheseMeals: string;
  nutritionalFocus: string;
} {
  try {
    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();

    // Remove ```json ... ``` or ``` ... ``` wrappers
    const jsonBlockMatch = cleanedText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (jsonBlockMatch) {
      cleanedText = jsonBlockMatch[1].trim();
    }

    // Try to extract JSON object if there's surrounding text
    if (!cleanedText.startsWith("{")) {
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
    }

    const parsed = JSON.parse(cleanedText);

    // Validate the response structure
    if (!parsed.meals || !Array.isArray(parsed.meals)) {
      throw new Error("Invalid response structure: missing meals array");
    }

    // Ensure each meal has required fields with defaults
    const validatedMeals = parsed.meals.slice(0, 5).map((meal: Record<string, unknown>, index: number) => ({
      id: meal.id || index + 1,
      name: meal.name || `Meal ${index + 1}`,
      description: meal.description || "A nutritious meal tailored for you",
      calories: Number(meal.calories) || 400,
      protein: Number(meal.protein) || 20,
      carbs: Number(meal.carbs) || 40,
      fats: Number(meal.fats) || 15,
      type: meal.type || "balanced",
      tags: Array.isArray(meal.tags) ? meal.tags : [],
      image: meal.image || "plate",
    }));

    return {
      meals: validatedMeals,
      healthTips: Array.isArray(parsed.healthTips) ? parsed.healthTips : [],
      whyTheseMeals: parsed.whyTheseMeals || "These meals are tailored to your health profile.",
      nutritionalFocus: parsed.nutritionalFocus || "Balanced nutrition for your goals.",
    };
  } catch (error) {
    console.error("Error parsing LLM response:", error);
    console.error("Raw response text:", text.substring(0, 500));
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
  return !!process.env.GROQ_API_KEY;
}
