"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { MealRecommendation } from "@/lib/recommendationEngine";

export default function MealDetailPage() {
  const params = useParams();
  const mealId = params.id as string;
  const [meal, setMeal] = useState<MealRecommendation | null>(null);
  const [allMeals, setAllMeals] = useState<MealRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
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

  const totalMacros = meal.protein + meal.carbs + meal.fats;
  const proteinPct = Math.round((meal.protein / totalMacros) * 100);
  const carbsPct = Math.round((meal.carbs / totalMacros) * 100);
  const fatsPct = 100 - proteinPct - carbsPct;
  const difficulty = meal.calories < 300 ? "Easy" : meal.calories < 500 ? "Medium" : "Advanced";

  const ingredients = meal.ingredients?.length
    ? meal.ingredients
    : null;

  const instructions = meal.instructions?.length
    ? meal.instructions
    : null;

  const otherMeals = allMeals.filter((m) => m.id !== meal.id).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/recommendations" className="hover:text-primary-600 transition-colors">Meals</Link>
          <span>→</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium truncate">{meal.name}</span>
        </nav>

        {/* Header card */}
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
                  <span className="flex items-center gap-1">⏱️ Prep: {meal.prepTime || "20 min"}</span>
                  <span className="flex items-center gap-1">🔥 Cook: {meal.cookTime || "20 min"}</span>
                  <span className="flex items-center gap-1">👤 {meal.servings || 1} serving</span>
                  <span className="flex items-center gap-1">📊 {difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition + Ingredients row */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Nutritional breakdown */}
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
            <div className="grid grid-cols-4 gap-3 mb-4">
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
            {/* Extended nutrition */}
            {(meal.fiber || meal.sugar || meal.sodium) ? (
              <div className="grid grid-cols-3 gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                {meal.fiber ? (
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-lg font-bold text-green-600">{meal.fiber}g</p>
                    <p className="text-xs text-gray-400">Fiber</p>
                  </div>
                ) : null}
                {meal.sugar ? (
                  <div className="text-center p-2 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                    <p className="text-lg font-bold text-pink-600">{meal.sugar}g</p>
                    <p className="text-xs text-gray-400">Sugar</p>
                  </div>
                ) : null}
                {meal.sodium ? (
                  <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <p className="text-lg font-bold text-purple-600">{meal.sodium}mg</p>
                    <p className="text-xs text-gray-400">Sodium</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Ingredients */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span>🥘</span> Ingredients</h2>
            {ingredients ? (
              <ul className="space-y-3">
                {ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{ing.name}</span>
                    <div className="text-right">
                      <span className="text-gray-500 dark:text-gray-400 font-mono text-xs block">{ing.amount}</span>
                      {ing.calories ? <span className="text-gray-400 text-xs">{ing.calories} cal</span> : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 text-sm text-gray-400">
                <p className="mb-2">🤖</p>
                <p>Regenerate recommendations with AI for detailed ingredients.</p>
                <Link href="/recommendations" className="text-primary-600 hover:underline text-xs mt-2 block">
                  Go to Recommendations →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* How to Prepare */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span>👨‍🍳</span> How to Prepare</h2>
          {instructions ? (
            <ol className="space-y-4">
              {instructions.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">
              Regenerate recommendations with AI for step-by-step cooking instructions.
            </p>
          )}
        </div>

        {/* Fun Facts */}
        {meal.funFacts && meal.funFacts.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800 shadow-sm mb-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>✨</span> Fun Facts
            </h2>
            <ul className="space-y-4">
              {meal.funFacts.map((fact, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-yellow-400 dark:bg-yellow-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{fact}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tips & Suggestions */}
        {meal.tips && meal.tips.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800 shadow-sm mb-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>💡</span> Tips & Suggestions
            </h2>
            <ul className="space-y-4">
              {meal.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 dark:bg-green-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* You Might Also Like */}
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
                  {m.funFacts && m.funFacts.length > 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 line-clamp-2">✨ {m.funFacts[0]}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
