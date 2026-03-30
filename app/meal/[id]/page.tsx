"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { MealRecommendation } from "@/lib/recommendationEngine";

function getExtendedMealData(meal: MealRecommendation) {
  const prepTimes: Record<string, string> = {
    breakfast: "15 min",
    lunch: "25 min",
    dinner: "35 min",
    snack: "10 min",
  };

  const mealTime = meal.tags.find((t) => ["breakfast", "lunch", "dinner", "snack"].includes(t)) || "lunch";

  const baseIngredients = [
    { name: "Primary ingredient", amount: "200g" },
    { name: "Secondary ingredient", amount: "150g" },
    { name: "Vegetables", amount: "100g" },
    { name: "Seasoning & spices", amount: "to taste" },
    { name: "Olive oil", amount: "1 tbsp" },
  ];

  const instructions = [
    "Prepare all ingredients by washing and cutting as needed.",
    "Season the main ingredients with salt, pepper, and your preferred spices.",
    "Cook the primary ingredients until golden and fully prepared.",
    "Add vegetables and other components, cook until tender.",
    "Plate beautifully and garnish. Serve warm and enjoy!",
  ];

  return {
    prepTime: prepTimes[mealTime] || "20 min",
    cookTime: mealTime === "snack" ? "5 min" : "20 min",
    servings: 1,
    difficulty: meal.calories < 300 ? "Easy" : meal.calories < 500 ? "Medium" : "Advanced",
    ingredients: baseIngredients,
    instructions,
  };
}

export default function MealDetailPage() {
  const params = useParams();
  const mealId = params.id as string;
  const [meal, setMeal] = useState<MealRecommendation | null>(null);
  const [allMeals, setAllMeals] = useState<MealRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        // Try cached recommendations
        const response = await fetch("/api/recommendations");
        if (response.ok) {
          const data = await response.json();
          const meals: MealRecommendation[] = data.recommendations || [];
          setAllMeals(meals);
          const found = meals.find((m: MealRecommendation) => String(m.id) === mealId);
          setMeal(found || meals[0] || null);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [mealId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 animate-pulse" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🍽️</p>
          <h2 className="text-2xl font-bold mb-2">Meal Not Found</h2>
          <Link href="/recommendations" className="text-primary-600 hover:underline">
            ← Back to Recommendations
          </Link>
        </div>
      </div>
    );
  }

  const extended = getExtendedMealData(meal);
  const totalMacros = meal.protein + meal.carbs + meal.fats;
  const proteinPct = Math.round((meal.protein / totalMacros) * 100);
  const carbsPct = Math.round((meal.carbs / totalMacros) * 100);
  const fatsPct = 100 - proteinPct - carbsPct;

  const otherMeals = allMeals.filter((m) => m.id !== meal.id).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/recommendations" className="hover:text-primary-600 transition-colors">Meals</Link>
          <span>→</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium truncate">{meal.name}</span>
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="text-7xl md:text-8xl">{meal.image}</div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {meal.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{meal.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">{meal.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">⏱️ Prep: {extended.prepTime}</span>
                  <span className="flex items-center gap-1">🔥 Cook: {extended.cookTime}</span>
                  <span className="flex items-center gap-1">👤 {extended.servings} serving</span>
                  <span className="flex items-center gap-1">📊 {extended.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span>📊</span> Nutritional Breakdown</h2>
            <div className="mb-6">
              <div className="flex rounded-full overflow-hidden h-5 mb-3">
                <div className="bg-blue-500 transition-all" style={{ width: `${proteinPct}%` }} />
                <div className="bg-amber-400 transition-all" style={{ width: `${carbsPct}%` }} />
                <div className="bg-red-400 transition-all" style={{ width: `${fatsPct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full" /> Protein {proteinPct}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full" /> Carbs {carbsPct}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full" /> Fats {fatsPct}%</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Calories", value: meal.calories, unit: "kcal", color: "text-primary-600" },
                { label: "Protein", value: meal.protein, unit: "g", color: "text-blue-600" },
                { label: "Carbs", value: meal.carbs, unit: "g", color: "text-amber-600" },
                { label: "Fats", value: meal.fats, unit: "g", color: "text-red-600" },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.unit}</p>
                  <p className="text-xs text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span>🥘</span> Ingredients</h2>
            <ul className="space-y-3">
              {extended.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{ing.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">{ing.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span>👨‍🍳</span> How to Prepare</h2>
          <ol className="space-y-4">
            {extended.instructions.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {otherMeals.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">You Might Also Like</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {otherMeals.map((m) => (
                <Link
                  key={m.id}
                  href={`/meal/${m.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="text-3xl mb-2">{m.image}</div>
                  <h3 className="font-bold text-sm mb-1">{m.name}</h3>
                  <p className="text-xs text-gray-500">{m.calories} cal · {m.protein}g protein</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
