import { GoogleGenerativeAI } from "@google/generative-ai";
import { HealthProfile, MealRecommendation } from "./recommendationEngine";

/**
 * AI-Powered Meal Planner using Gemini
 * Status: 70% Complete - Prototype Implementation
 */

export interface DailyMealPlan {
  day: string;
  date: string;
  meals: {
    breakfast?: MealRecommendation;
    lunch?: MealRecommendation;
    dinner?: MealRecommendation;
    snacks?: MealRecommendation[];
  };
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  hydrationGoal: string;
  activitySuggestion: string;
}

export interface WeeklyMealPlan {
  weekStartDate: string;
  weekEndDate: string;
  dailyPlans: DailyMealPlan[];
  weeklyGoals: string[];
  shoppingListSummary?: string;
  nutritionalBalance: {
    averageCalories: number;
    proteinIntake: number;
    carbIntake: number;
    fatIntake: number;
  };
}

/**
 * Generate weekly meal plan with AI
 * TODO: Add meal variety tracking to avoid repetition
 * TODO: Implement leftover optimization
 * TODO: Add seasonal ingredient preferences
 */
export async function generateWeeklyMealPlan(
  profile: HealthProfile,
  startDate: Date,
  preferences?: {
    mealsPerDay?: number;
    includeSnacks?: boolean;
    cookingDays?: string[]; // Days user wants to cook
  }
): Promise<WeeklyMealPlan> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const mealsPerDay = preferences?.mealsPerDay || profile.mealsPerDay || 3;
    const includeSnacks = preferences?.includeSnacks ?? false;

    const prompt = createMealPlanPrompt(profile, startDate, mealsPerDay, includeSnacks);

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

    const mealPlan: WeeklyMealPlan = JSON.parse(cleanedText);
    return mealPlan;

  } catch (error) {
    console.error("Error generating meal plan:", error);

    // Fallback to basic meal plan
    return generateFallbackMealPlan(profile, startDate);
  }
}

/**
 * Create detailed prompt for weekly meal planning
 */
function createMealPlanPrompt(
  profile: HealthProfile,
  startDate: Date,
  mealsPerDay: number,
  includeSnacks: boolean
): string {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  return `Create a 7-day meal plan for a user with this profile:

**User Profile:**
- Age: ${profile.age}
- Gender: ${profile.gender}
- Weight: ${profile.weight}kg, Height: ${profile.height}cm
- Activity Level: ${profile.activityLevel}
- Health Goal: ${profile.healthGoal}
- Dietary Preference: ${profile.dietaryPreference}
- Allergies: ${profile.allergies || "None"}
- Meals per day: ${mealsPerDay}
- Budget: ${profile.budget}

**Requirements:**
- Plan from ${startDate.toDateString()} to ${endDate.toDateString()}
- Include ${mealsPerDay} main meals per day
- ${includeSnacks ? "Include healthy snacks" : "No snacks"}
- Ensure nutritional balance
- Variety in meals (no repetition)
- Match dietary preferences
- Align with health goals

**Response Format (JSON):**
{
  "weekStartDate": "${startDate.toISOString()}",
  "weekEndDate": "${endDate.toISOString()}",
  "dailyPlans": [
    {
      "day": "Monday",
      "date": "2025-01-01",
      "meals": {
        "breakfast": {
          "name": "Meal name",
          "description": "Description",
          "calories": 400,
          "protein": 20,
          "carbs": 50,
          "fats": 15,
          "type": "${profile.dietaryPreference.toLowerCase()}",
          "tags": ["breakfast", "healthy"],
          "image": "🍳"
        },
        "lunch": { /* similar structure */ },
        "dinner": { /* similar structure */ }
        ${includeSnacks ? ', "snacks": [{ /* snack structure */ }]' : ''}
      },
      "totalNutrition": {
        "calories": 1800,
        "protein": 90,
        "carbs": 200,
        "fats": 60
      },
      "hydrationGoal": "8-10 glasses of water",
      "activitySuggestion": "30 min light exercise"
    }
  ],
  "weeklyGoals": [
    "Maintain balanced nutrition",
    "Stay within calorie goals",
    "Try new healthy recipes"
  ],
  "nutritionalBalance": {
    "averageCalories": 1800,
    "proteinIntake": 90,
    "carbIntake": 200,
    "fatIntake": 60
  }
}

Return ONLY the JSON.`;
}

/**
 * Fallback meal plan generator
 * TODO: Improve with better meal database
 */
function generateFallbackMealPlan(
  profile: HealthProfile,
  startDate: Date
): WeeklyMealPlan {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dailyPlans: DailyMealPlan[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    dailyPlans.push({
      day: days[i],
      date: date.toISOString().split('T')[0],
      meals: {
        breakfast: {
          id: i * 3 + 1,
          name: "Healthy Breakfast",
          description: "Nutritious start to your day",
          calories: 400,
          protein: 20,
          carbs: 50,
          fats: 15,
          type: profile.dietaryPreference.toLowerCase(),
          tags: ["breakfast", "healthy"],
          image: "🍳",
        },
        lunch: {
          id: i * 3 + 2,
          name: "Balanced Lunch",
          description: "Midday energy boost",
          calories: 600,
          protein: 35,
          carbs: 60,
          fats: 20,
          type: profile.dietaryPreference.toLowerCase(),
          tags: ["lunch", "balanced"],
          image: "🥗",
        },
        dinner: {
          id: i * 3 + 3,
          name: "Light Dinner",
          description: "Evening nutrition",
          calories: 500,
          protein: 30,
          carbs: 45,
          fats: 18,
          type: profile.dietaryPreference.toLowerCase(),
          tags: ["dinner", "light"],
          image: "🍽️",
        },
      },
      totalNutrition: {
        calories: 1500,
        protein: 85,
        carbs: 155,
        fats: 53,
      },
      hydrationGoal: "8 glasses of water",
      activitySuggestion: "30 minutes of activity",
    });
  }

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  return {
    weekStartDate: startDate.toISOString(),
    weekEndDate: endDate.toISOString(),
    dailyPlans,
    weeklyGoals: [
      `Focus on ${profile.healthGoal.replace("-", " ")}`,
      "Maintain consistent meal timing",
      "Stay hydrated throughout the week",
    ],
    nutritionalBalance: {
      averageCalories: 1500,
      proteinIntake: 85,
      carbIntake: 155,
      fatIntake: 53,
    },
  };
}

/**
 * TODO: Implement smart meal prep suggestions
 * - Identify meals that can be batch cooked
 * - Suggest meal prep days
 * - Calculate time savings
 */
export async function generateMealPrepPlan(
  weeklyPlan: WeeklyMealPlan
): Promise<{
  prepDays: string[];
  batchMeals: string[];
  timeEstimate: string;
  instructions: string[];
}> {
  // Placeholder - needs implementation
  return {
    prepDays: ["Sunday"],
    batchMeals: ["Grilled Chicken", "Quinoa", "Roasted Vegetables"],
    timeEstimate: "2-3 hours",
    instructions: [
      "Prepare proteins in bulk",
      "Cook grains and store in portions",
      "Chop vegetables and store properly",
    ],
  };
}

/**
 * TODO: Implement meal plan adjustments based on progress
 */
export async function adjustMealPlan(
  currentPlan: WeeklyMealPlan,
  userFeedback: {
    likedMeals: string[];
    dislikedMeals: string[];
    energyLevels: "low" | "normal" | "high";
    weightChange?: number;
  }
): Promise<WeeklyMealPlan> {
  // Placeholder - needs AI integration for adaptive planning
  return currentPlan;
}

/**
 * TODO: Add calendar export functionality
 * - Export to Google Calendar
 * - Export to Apple Calendar
 * - Generate PDF calendar
 */
export async function exportMealPlanToCalendar(
  mealPlan: WeeklyMealPlan,
  format: "google" | "apple" | "pdf"
): Promise<string> {
  // Placeholder - needs implementation
  return "Export functionality coming soon";
}
