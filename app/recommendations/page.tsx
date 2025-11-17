"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  generateRecommendations,
  calculateBMI,
  getBMICategory,
  type MealRecommendation,
  type HealthProfile,
} from "@/lib/recommendationEngine";

export default function RecommendationsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [recommendations, setRecommendations] = useState<MealRecommendation[]>([]);
  const [bmi, setBmi] = useState<number>(0);
  const [bmiCategory, setBmiCategory] = useState<string>("");

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }

    // Load health profile
    const savedProfile = localStorage.getItem("healthProfile");
    if (!savedProfile) {
      router.push("/questionnaire");
      return;
    }

    const healthProfile = JSON.parse(savedProfile);
    setProfile(healthProfile);

    // Calculate BMI
    const height = parseFloat(healthProfile.height);
    const weight = parseFloat(healthProfile.weight);
    const calculatedBMI = calculateBMI(height, weight);
    setBmi(calculatedBMI);
    setBmiCategory(getBMICategory(calculatedBMI));

    // Generate recommendations
    const meals = generateRecommendations(healthProfile);
    setRecommendations(meals);
  }, [router]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Your Personalized Meal Plan</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Based on your health profile and goals
          </p>
        </div>

        {/* Health Summary */}
        <div className="bg-gradient-to-r from-primary-50 to-green-50 dark:from-primary-900/20 dark:to-green-900/20 rounded-xl p-6 mb-8 border border-primary-200 dark:border-primary-800">
          <h2 className="text-xl font-semibold mb-4">Your Health Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">BMI</p>
              <p className="text-2xl font-bold text-primary-600">
                {bmi}
              </p>
              <p className="text-xs text-gray-500">{bmiCategory}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Goal</p>
              <p className="text-lg font-semibold capitalize">
                {profile.healthGoal.replace("-", " ")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Diet</p>
              <p className="text-lg font-semibold capitalize">
                {profile.dietaryPreference}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Activity</p>
              <p className="text-lg font-semibold capitalize">
                {profile.activityLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Recommended Meals for You</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((meal) => (
              <div
                key={meal.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="text-5xl mb-3">{meal.image}</div>
                  <h3 className="text-xl font-bold mb-2">{meal.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {meal.description}
                  </p>

                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Calories</p>
                      <p className="font-bold text-primary-600">{meal.calories}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Protein</p>
                      <p className="font-bold">{meal.protein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Carbs</p>
                      <p className="font-bold">{meal.carbs}g</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {meal.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold mb-3">Ready to Start Your Journey?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Choose a subscription plan and get these delicious, healthy meals delivered to your doorstep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/subscriptions"
              className="px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              View Subscription Plans
            </Link>
            <Link
              href="/questionnaire"
              className="px-8 py-4 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
