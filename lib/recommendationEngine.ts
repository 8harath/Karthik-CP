export interface MealRecommendation {
  id: number;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  type: string;
  tags: string[];
  image: string;
}

export interface HealthProfile {
  age: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  healthGoal: string;
  dietaryPreference: string;
  allergies: string;
  mealsPerDay: string;
  budget: string;
  cookingPreference: string;
  medicalConditions: string;
}

const mealDatabase: MealRecommendation[] = [
  // High Protein Meals
  {
    id: 1,
    name: "Grilled Chicken Breast with Quinoa",
    description: "Lean protein with complex carbs and mixed vegetables",
    calories: 450,
    protein: 45,
    carbs: 35,
    fats: 12,
    type: "non-vegetarian",
    tags: ["high-protein", "low-fat", "muscle-gain"],
    image: "🍗",
  },
  {
    id: 2,
    name: "Paneer Tikka with Brown Rice",
    description: "Indian cottage cheese with whole grains and spices",
    calories: 420,
    protein: 25,
    carbs: 40,
    fats: 15,
    type: "vegetarian",
    tags: ["high-protein", "vegetarian", "muscle-gain"],
    image: "🧀",
  },
  {
    id: 3,
    name: "Tofu Stir-Fry with Vegetables",
    description: "Plant-based protein with colorful veggies",
    calories: 350,
    protein: 20,
    carbs: 30,
    fats: 14,
    type: "vegan",
    tags: ["vegan", "low-calorie", "weight-loss"],
    image: "🥗",
  },

  // Weight Loss Meals
  {
    id: 4,
    name: "Grilled Salmon with Steamed Broccoli",
    description: "Omega-3 rich fish with nutrient-dense vegetables",
    calories: 380,
    protein: 35,
    carbs: 15,
    fats: 20,
    type: "pescatarian",
    tags: ["low-carb", "weight-loss", "high-protein"],
    image: "🐟",
  },
  {
    id: 5,
    name: "Greek Salad with Chickpeas",
    description: "Fresh Mediterranean salad with plant protein",
    calories: 320,
    protein: 15,
    carbs: 28,
    fats: 16,
    type: "vegetarian",
    tags: ["low-calorie", "vegetarian", "weight-loss"],
    image: "🥗",
  },
  {
    id: 6,
    name: "Zucchini Noodles with Marinara",
    description: "Low-carb pasta alternative with tomato sauce",
    calories: 180,
    protein: 8,
    carbs: 20,
    fats: 7,
    type: "vegan",
    tags: ["low-carb", "vegan", "weight-loss", "low-calorie"],
    image: "🍝",
  },

  // Balanced Meals
  {
    id: 7,
    name: "Chicken Burrito Bowl",
    description: "Balanced meal with rice, beans, and lean protein",
    calories: 520,
    protein: 38,
    carbs: 55,
    fats: 15,
    type: "non-vegetarian",
    tags: ["balanced", "maintenance", "moderate"],
    image: "🥙",
  },
  {
    id: 8,
    name: "Vegetable Khichdi",
    description: "Indian comfort food with lentils and rice",
    calories: 380,
    protein: 18,
    carbs: 60,
    fats: 8,
    type: "vegetarian",
    tags: ["vegetarian", "comfort-food", "general-health"],
    image: "🍲",
  },

  // High Calorie for Muscle Gain
  {
    id: 9,
    name: "Beef Steak with Sweet Potato",
    description: "High-quality protein with complex carbs",
    calories: 650,
    protein: 50,
    carbs: 45,
    fats: 28,
    type: "non-vegetarian",
    tags: ["high-protein", "muscle-gain", "high-calorie"],
    image: "🥩",
  },
  {
    id: 10,
    name: "Peanut Butter Protein Smoothie Bowl",
    description: "Calorie-dense smoothie with nuts and fruits",
    calories: 580,
    protein: 32,
    carbs: 65,
    fats: 22,
    type: "vegetarian",
    tags: ["high-calorie", "muscle-gain", "energy"],
    image: "🥣",
  },

  // Energy Boosting
  {
    id: 11,
    name: "Oatmeal with Berries and Almonds",
    description: "Sustained energy with fiber and healthy fats",
    calories: 420,
    protein: 15,
    carbs: 58,
    fats: 14,
    type: "vegan",
    tags: ["energy", "breakfast", "vegan"],
    image: "🥣",
  },
  {
    id: 12,
    name: "Whole Grain Pasta with Vegetables",
    description: "Complex carbs for sustained energy",
    calories: 480,
    protein: 18,
    carbs: 72,
    fats: 12,
    type: "vegan",
    tags: ["energy", "vegan", "moderate"],
    image: "🍝",
  },
];

export function generateRecommendations(profile: HealthProfile): MealRecommendation[] {
  let recommendations: MealRecommendation[] = [];

  // Filter by dietary preference
  let filteredMeals = mealDatabase.filter((meal) => {
    const pref = profile.dietaryPreference.toLowerCase();

    if (pref === "vegan") return meal.type === "vegan";
    if (pref === "vegetarian") return meal.type === "vegetarian" || meal.type === "vegan";
    if (pref === "pescatarian") return meal.type === "pescatarian" || meal.type === "vegetarian" || meal.type === "vegan";
    if (pref === "non-vegetarian") return true; // All meals allowed

    return true; // No preference
  });

  // Filter by health goal
  const goal = profile.healthGoal.toLowerCase();
  filteredMeals = filteredMeals.filter((meal) => {
    if (goal === "weight-loss") {
      return meal.calories < 400 || meal.tags.includes("weight-loss");
    }
    if (goal === "muscle-gain") {
      return meal.protein > 25 || meal.tags.includes("muscle-gain");
    }
    if (goal === "energy") {
      return meal.tags.includes("energy") || meal.carbs > 50;
    }
    return true; // General health - all meals OK
  });

  // Filter by activity level (adjust calorie range)
  const activity = profile.activityLevel.toLowerCase();
  if (activity.includes("sedentary") || activity.includes("light")) {
    filteredMeals = filteredMeals.filter((meal) => meal.calories < 500);
  } else if (activity.includes("very-active")) {
    filteredMeals = filteredMeals.filter((meal) => meal.calories > 350);
  }

  // Remove meals with allergens
  if (profile.allergies) {
    const allergyKeywords = profile.allergies.toLowerCase().split(",").map(a => a.trim());
    filteredMeals = filteredMeals.filter((meal) => {
      const mealLower = `${meal.name} ${meal.description}`.toLowerCase();
      return !allergyKeywords.some(allergen =>
        mealLower.includes(allergen) ||
        (allergen.includes("dairy") && mealLower.includes("cheese")) ||
        (allergen.includes("gluten") && mealLower.includes("pasta"))
      );
    });
  }

  // Sort by relevance (prioritize meals that match goal)
  filteredMeals.sort((a, b) => {
    const aScore = a.tags.includes(goal) ? 1 : 0;
    const bScore = b.tags.includes(goal) ? 1 : 0;
    return bScore - aScore;
  });

  // Return top 5 recommendations
  recommendations = filteredMeals.slice(0, 5);

  // If we don't have enough recommendations, add some balanced meals
  if (recommendations.length < 5) {
    const balanced = mealDatabase
      .filter(m => !recommendations.includes(m))
      .slice(0, 5 - recommendations.length);
    recommendations = [...recommendations, ...balanced];
  }

  return recommendations;
}

export function calculateBMI(height: number, weight: number): number {
  // Height in meters, weight in kg
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}
