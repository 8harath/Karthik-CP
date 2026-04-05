"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface HealthProfile {
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
  location: string;
}

export default function QuestionnairePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [formData, setFormData] = useState<HealthProfile>({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    healthGoal: "",
    dietaryPreference: "",
    allergies: "",
    mealsPerDay: "",
    budget: "",
    cookingPreference: "",
    medicalConditions: "",
    location: "",
  });

  const totalSteps = 4;

  const validateStep = (currentStep: number): string[] => {
    const errors: string[] = [];

    switch (currentStep) {
      case 1:
        if (!formData.age || parseInt(formData.age) < 10 || parseInt(formData.age) > 120) {
          errors.push("Please enter a valid age (10-120)");
        }
        if (!formData.gender) errors.push("Please select your gender");
        if (!formData.height || parseInt(formData.height) < 100 || parseInt(formData.height) > 250) {
          errors.push("Please enter a valid height (100-250 cm)");
        }
        if (!formData.weight || parseInt(formData.weight) < 30 || parseInt(formData.weight) > 300) {
          errors.push("Please enter a valid weight (30-300 kg)");
        }
        if (!formData.location) errors.push("Please select your location");
        break;
      case 2:
        if (!formData.activityLevel) errors.push("Please select your activity level");
        if (!formData.healthGoal) errors.push("Please select your health goal");
        if (!formData.mealsPerDay) errors.push("Please select meals per day");
        break;
      case 3:
        if (!formData.dietaryPreference) errors.push("Please select your dietary preference");
        break;
      case 4:
        if (!formData.budget) errors.push("Please select your budget preference");
        if (!formData.cookingPreference) errors.push("Please select your cooking preference");
        break;
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(step);
    setStepErrors(errors);
    if (errors.length > 0) return;

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStepErrors([]);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateStep(step);
    setStepErrors(errors);
    if (errors.length > 0) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setStepErrors([data.error || "Failed to save profile"]);
        setSubmitting(false);
        return;
      }

      // Show transition animation before navigating
      setShowTransition(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/recommendations");
    } catch {
      setStepErrors(["An error occurred. Please try again."]);
      setSubmitting(false);
    }
  };

  const updateField = (field: keyof HealthProfile, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (stepErrors.length > 0) {
      setStepErrors([]);
    }
  };

  if (showTransition) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center space-y-6 px-4">
          {/* Animated rings */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-800" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-green-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            <div className="absolute inset-0 flex items-center justify-center text-3xl">
              🍽️
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Profile Saved!</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Crafting your personalized meal plan...
            </p>
          </div>
          {/* Animated dots */}
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-3 h-3 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Health Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Help us understand your needs to provide personalized meal recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          {/* Validation Errors */}
          {stepErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="font-semibold text-red-800 dark:text-red-200 text-sm mb-2">
                Please fix the following:
              </p>
              <ul className="list-disc list-inside space-y-1">
                {stepErrors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => updateField("age", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Enter your age"
                      min="10"
                      max="120"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Height (cm) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => updateField("height", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="e.g., 170"
                      min="100"
                      max="250"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Weight (kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => updateField("weight", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="e.g., 70"
                      min="30"
                      max="300"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">
                    Location / Region <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select your region</option>
                    <optgroup label="South India">
                      <option value="tamil-nadu">Tamil Nadu</option>
                      <option value="kerala">Kerala</option>
                      <option value="karnataka">Karnataka</option>
                      <option value="andhra-pradesh">Andhra Pradesh</option>
                      <option value="telangana">Telangana</option>
                    </optgroup>
                    <optgroup label="North India">
                      <option value="delhi">Delhi / NCR</option>
                      <option value="uttar-pradesh">Uttar Pradesh</option>
                      <option value="punjab">Punjab</option>
                      <option value="haryana">Haryana</option>
                      <option value="rajasthan">Rajasthan</option>
                      <option value="himachal-pradesh">Himachal Pradesh</option>
                      <option value="jammu-kashmir">Jammu & Kashmir</option>
                      <option value="uttarakhand">Uttarakhand</option>
                    </optgroup>
                    <optgroup label="East India">
                      <option value="west-bengal">West Bengal</option>
                      <option value="odisha">Odisha</option>
                      <option value="bihar">Bihar</option>
                      <option value="jharkhand">Jharkhand</option>
                      <option value="assam">Assam</option>
                      <option value="northeast">Other Northeast</option>
                    </optgroup>
                    <optgroup label="West India">
                      <option value="maharashtra">Maharashtra</option>
                      <option value="gujarat">Gujarat</option>
                      <option value="goa">Goa</option>
                    </optgroup>
                    <optgroup label="Central India">
                      <option value="madhya-pradesh">Madhya Pradesh</option>
                      <option value="chhattisgarh">Chhattisgarh</option>
                    </optgroup>
                    <optgroup label="Other">
                      <option value="other-india">Other (India)</option>
                      <option value="international">International</option>
                    </optgroup>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    We use this to recommend regional cuisine that suits your palate
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Lifestyle & Goals */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Lifestyle & Goals</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Activity Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) => updateField("activityLevel", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="light">Light (exercise 1-3 days/week)</option>
                    <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                    <option value="active">Active (exercise 6-7 days/week)</option>
                    <option value="very-active">Very Active (physical job or training twice per day)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Health Goal <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.healthGoal}
                    onChange={(e) => updateField("healthGoal", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select your goal</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="maintenance">Maintain Current Weight</option>
                    <option value="general-health">General Health & Wellness</option>
                    <option value="energy">Increase Energy Levels</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Meals Per Day <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.mealsPerDay}
                    onChange={(e) => updateField("mealsPerDay", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select meals per day</option>
                    <option value="2">2 meals</option>
                    <option value="3">3 meals</option>
                    <option value="4">4 meals</option>
                    <option value="5">5+ meals</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Dietary Preferences */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Dietary Preferences</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dietary Preference <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.dietaryPreference}
                    onChange={(e) => updateField("dietaryPreference", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select preference</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="pescatarian">Pescatarian</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="no-preference">No Preference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Allergies or Food Restrictions
                  </label>
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => updateField("allergies", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="e.g., peanuts, dairy, gluten, shellfish... (leave empty if none)"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Medical Conditions
                  </label>
                  <textarea
                    value={formData.medicalConditions}
                    onChange={(e) => updateField("medicalConditions", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="e.g., diabetes, hypertension, cholesterol... (leave empty if none)"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Budget & Cooking */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Budget & Preferences</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Budget Preference <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => updateField("budget", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select budget</option>
                    <option value="budget">Budget-Friendly</option>
                    <option value="moderate">Moderate</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cooking Preference <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.cookingPreference}
                    onChange={(e) => updateField("cookingPreference", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select preference</option>
                    <option value="ready-to-eat">Ready-to-Eat Meals</option>
                    <option value="meal-kits">Meal Kits (Some Cooking Required)</option>
                    <option value="both">Both Options</option>
                  </select>
                </div>

                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Almost done!</strong> Click &quot;Complete Profile&quot; to get your personalized meal recommendations.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving..." : "Complete Profile"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
