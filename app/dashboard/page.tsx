"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { calculateBMI, getBMICategory } from "@/lib/recommendationEngine";

interface HealthProfile {
  age: number;
  gender: string;
  height: number;
  weight: number;
  activity_level: string;
  health_goal: string;
  dietary_preference: string;
  allergies: string;
  meals_per_day: string;
  budget: string;
  cooking_preference: string;
  medical_conditions: string;
}

interface SubscriptionData {
  plan?: string;
  price?: number;
  status?: string;
}

function MacroRing({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
          <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{value}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">{label}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [bmi, setBmi] = useState(0);
  const [bmiCategory, setBmiCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchData = async () => {
      const supabase = createClient();

      // Fetch profile
      const { data: profileData } = await supabase
        .from("health_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        const calculatedBmi = calculateBMI(profileData.height, profileData.weight);
        setBmi(calculatedBmi);
        setBmiCategory(getBMICategory(calculatedBmi));
      }

      // Fetch subscription
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (subData) {
        setSubscription(subData);
      }

      setLoading(false);
    };

    fetchData();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  const getBmiColor = () => {
    if (bmi < 18.5) return "#3b82f6";
    if (bmi < 25) return "#22c55e";
    if (bmi < 30) return "#eab308";
    return "#ef4444";
  };

  const goalCalories: Record<string, number> = {
    "weight-loss": 1600,
    "muscle-gain": 2800,
    "energy": 2400,
    "maintenance": 2000,
    "general-health": 2000,
  };

  const targetCals = profile ? goalCalories[profile.health_goal] || 2000 : 2000;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{userName}</span> 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here&apos;s your health dashboard at a glance.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">BMI</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold" style={{ color: getBmiColor() }}>
                {bmi || "—"}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{bmiCategory || "Not calculated"}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Goal</p>
            <p className="text-xl font-bold capitalize">
              {profile?.health_goal?.replace("-", " ") || "Not set"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">~{targetCals} cal/day</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Diet</p>
            <p className="text-xl font-bold capitalize">
              {profile?.dietary_preference || "Not set"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {profile?.meals_per_day || "3"} meals/day
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Plan</p>
            <p className="text-xl font-bold capitalize">
              {subscription?.plan || "Free"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subscription?.price ? `₹${subscription.price}/cycle` : "No active plan"}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Target Macros */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="text-xl">🎯</span> Daily Target Macros
              </h2>
              <div className="flex justify-around">
                <MacroRing label="Calories" value={targetCals} max={3000} color="#16a34a" />
                <MacroRing
                  label="Protein (g)"
                  value={profile?.health_goal === "muscle-gain" ? 150 : profile?.health_goal === "weight-loss" ? 120 : 100}
                  max={200}
                  color="#3b82f6"
                />
                <MacroRing
                  label="Carbs (g)"
                  value={profile?.health_goal === "energy" ? 300 : profile?.health_goal === "weight-loss" ? 150 : 200}
                  max={400}
                  color="#f59e0b"
                />
                <MacroRing
                  label="Fats (g)"
                  value={profile?.health_goal === "weight-loss" ? 50 : 70}
                  max={100}
                  color="#ef4444"
                />
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="text-xl">👤</span> Health Profile
                </h2>
                <Link href="/questionnaire" className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  Edit Profile →
                </Link>
              </div>

              {profile ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "Age", value: `${profile.age} years` },
                    { label: "Gender", value: profile.gender },
                    { label: "Height", value: `${profile.height} cm` },
                    { label: "Weight", value: `${profile.weight} kg` },
                    { label: "Activity", value: profile.activity_level },
                    { label: "Cooking", value: profile.cooking_preference },
                    { label: "Budget", value: profile.budget },
                    { label: "Allergies", value: profile.allergies || "None" },
                    { label: "Conditions", value: profile.medical_conditions || "None" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                      <p className="text-sm font-semibold capitalize truncate">{item.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">You haven&apos;t completed your profile yet.</p>
                  <Link href="/questionnaire" className="px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    Complete Profile
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">⚡</span> Quick Actions
              </h2>
              <div className="space-y-3">
                <Link href="/recommendations" className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors group">
                  <span className="text-2xl">🍽️</span>
                  <div>
                    <p className="font-semibold text-sm">View Meal Recommendations</p>
                    <p className="text-xs opacity-70">AI-powered meals for you</p>
                  </div>
                  <span className="ml-auto text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link href="/meal-plan" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold text-sm">Weekly Meal Plan</p>
                    <p className="text-xs opacity-70">Plan your week&apos;s meals</p>
                  </div>
                  <span className="ml-auto text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link href="/subscriptions" className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
                  <span className="text-2xl">💎</span>
                  <div>
                    <p className="font-semibold text-sm">Upgrade Plan</p>
                    <p className="text-xs opacity-70">Get premium meal delivery</p>
                  </div>
                  <span className="ml-auto text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link href="/questionnaire" className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors group">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <p className="font-semibold text-sm">Update Health Profile</p>
                    <p className="text-xs opacity-70">Refine your preferences</p>
                  </div>
                  <span className="ml-auto text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* BMI Scale */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">📏</span> BMI Scale
              </h2>
              {bmi > 0 ? (
                <div>
                  <div className="relative h-4 rounded-full overflow-hidden mb-3 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400">
                    <div
                      className="absolute top-0 w-3 h-4 bg-white border-2 border-gray-800 rounded-sm"
                      style={{ left: `${Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-2xl font-bold" style={{ color: getBmiColor() }}>{bmi}</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{bmiCategory}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Complete your profile to see your BMI
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
