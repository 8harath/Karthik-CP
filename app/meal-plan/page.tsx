"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { MealRecommendation } from "@/lib/recommendationEngine";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;

interface DayPlan {
  [key: string]: MealRecommendation | null;
}

interface WeeklyPlan {
  [day: string]: DayPlan;
}

export default function MealPlanPage() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>({});
  const [allMeals, setAllMeals] = useState<MealRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; type: string } | null>(null);

  const generateWeeklyPlan = useCallback((meals: MealRecommendation[]) => {
    const plan: WeeklyPlan = {};
    let mealIndex = 0;

    DAYS.forEach((day) => {
      plan[day] = {};
      MEAL_TYPES.forEach((type) => {
        const typeMeals = meals.filter((m) => m.tags.includes(type.toLowerCase()));
        const pool = typeMeals.length > 0 ? typeMeals : meals;
        plan[day][type] = pool[mealIndex % pool.length];
        mealIndex++;
      });
    });

    return plan;
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        // Try cached recommendations first
        const cachedRes = await fetch("/api/recommendations");
        if (cachedRes.ok) {
          const cachedData = await cachedRes.json();
          if (cachedData.recommendations) {
            setAllMeals(cachedData.recommendations);
            setWeeklyPlan(generateWeeklyPlan(cachedData.recommendations));
            setLoading(false);
            return;
          }
        }

        // Generate new if none cached
        const response = await fetch("/api/recommendations", { method: "POST" });
        if (response.ok) {
          const data = await response.json();
          setAllMeals(data.recommendations || []);
          setWeeklyPlan(generateWeeklyPlan(data.recommendations || []));
        }
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [generateWeeklyPlan]);

  const swapMeal = (day: string, mealType: string, newMeal: MealRecommendation) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: { ...prev[day], [mealType]: newMeal },
    }));
    setSelectedSlot(null);
  };

  const getDayTotals = (day: string) => {
    const dayPlan = weeklyPlan[day];
    if (!dayPlan) return { calories: 0, protein: 0, carbs: 0, fats: 0 };

    return Object.values(dayPlan).reduce(
      (acc, meal) => {
        if (meal) {
          acc.calories += meal.calories;
          acc.protein += meal.protein;
          acc.carbs += meal.carbs;
          acc.fats += meal.fats;
        }
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-80 mb-8 animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="mr-2">📅</span>Weekly Meal Plan
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Click any meal to swap it with an alternative</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/recommendations"
              className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors border border-primary-200 dark:border-primary-800"
            >
              View AI Recommendations
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {DAYS.map((day) => {
            const totals = getDayTotals(day);
            return (
              <div key={day} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-lg">{day}</h3>
                  <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span><strong className="text-primary-600">{totals.calories}</strong> cal</span>
                    <span><strong className="text-blue-600">{totals.protein}g</strong> protein</span>
                    <span className="hidden sm:inline"><strong className="text-amber-600">{totals.carbs}g</strong> carbs</span>
                    <span className="hidden sm:inline"><strong className="text-red-600">{totals.fats}g</strong> fats</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700">
                  {MEAL_TYPES.map((type) => {
                    const meal = weeklyPlan[day]?.[type];
                    const isSelected = selectedSlot?.day === day && selectedSlot?.type === type;

                    return (
                      <div key={type} className="relative">
                        <button
                          onClick={() => setSelectedSlot(isSelected ? null : { day, type })}
                          className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isSelected ? "bg-primary-50 dark:bg-primary-900/20" : ""}`}
                        >
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{type}</p>
                          {meal ? (
                            <>
                              <div className="text-xl mb-1">{meal.image}</div>
                              <p className="text-sm font-semibold leading-tight mb-1 line-clamp-2">{meal.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{meal.calories} cal</p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-400">No meal</p>
                          )}
                        </button>

                        {isSelected && (
                          <div className="absolute z-20 top-full left-0 w-64 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto animate-scale-in">
                            <p className="px-3 py-2 text-xs font-bold text-gray-500 uppercase border-b border-gray-100 dark:border-gray-700">
                              Swap with...
                            </p>
                            {allMeals.map((m) => (
                              <button
                                key={m.id}
                                onClick={() => swapMeal(day, type, m)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                              >
                                <span className="text-lg">{m.image}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{m.name}</p>
                                  <p className="text-xs text-gray-500">{m.calories} cal · {m.protein}g protein</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
