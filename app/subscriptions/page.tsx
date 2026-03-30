"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/currency";

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  meals: number;
  features: string[];
  popular?: boolean;
  savings?: string;
}

const plans: Plan[] = [
  {
    id: "weekly",
    name: "Weekly Plan",
    price: 4100,
    duration: "per week",
    meals: 7,
    features: [
      "7 personalized meals per week",
      "Fresh ingredients delivered",
      "Nutritionist-approved recipes",
      "Flexible delivery schedule",
      "Cancel anytime",
    ],
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    price: 14900,
    originalPrice: 16300,
    duration: "per month",
    meals: 28,
    popular: true,
    savings: "Save 9%",
    features: [
      "28 personalized meals per month",
      "Fresh ingredients delivered",
      "Nutritionist-approved recipes",
      "Priority delivery slots",
      "Exclusive meal options",
      "Cancel anytime",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly Plan",
    price: 41500,
    originalPrice: 48900,
    duration: "per 3 months",
    meals: 84,
    savings: "Save 15%",
    features: [
      "84 personalized meals per quarter",
      "Fresh ingredients delivered",
      "Nutritionist-approved recipes",
      "Priority delivery slots",
      "Exclusive meal options",
      "Free nutrition consultation",
      "24/7 customer support",
      "Cancel anytime",
    ],
  },
];

export default function SubscriptionsPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleProceedToPayment = () => {
    if (!selectedPlan) return;
    const plan = plans.find((p) => p.id === selectedPlan);
    if (!plan) return;
    router.push(`/payment?plan=${selectedPlan}&price=${plan.price}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 px-2">
            Select the perfect subscription plan for your healthy eating journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg border-2 transition-all cursor-pointer ${
                selectedPlan === plan.id
                  ? "border-primary-600 ring-2 md:ring-4 ring-primary-200 dark:ring-primary-800 md:scale-105"
                  : "border-gray-200 dark:border-gray-700 hover:border-primary-400"
              } ${plan.popular ? "md:scale-105 border-primary-300" : ""}`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-600 to-green-600 text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {plan.savings && (
                <div className="absolute top-3 md:top-4 right-3 md:right-4">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 md:px-3 py-1 rounded-full text-xs font-semibold">
                    {plan.savings}
                  </span>
                </div>
              )}

              <div className="p-5 md:p-6 lg:p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-5 md:mb-6">
                  <div className="flex items-baseline gap-1 md:gap-2 flex-wrap">
                    <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-600">
                      {formatCurrency(plan.price)}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-base md:text-lg lg:text-xl text-gray-400 line-through">
                        {formatCurrency(plan.originalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">{plan.duration}</p>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-500 mt-1">{plan.meals} meals included</p>
                </div>

                <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 md:gap-3">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={(e) => { e.stopPropagation(); handleSelectPlan(plan.id); }}
                  className={`w-full py-3 md:py-3.5 rounded-lg font-semibold transition-all text-sm md:text-base ${
                    selectedPlan === plan.id
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="text-center">
            <button
              onClick={handleProceedToPayment}
              className="w-full md:w-auto px-8 md:px-12 py-3.5 md:py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl md:transform md:hover:scale-105 text-base md:text-lg"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Features Grid */}
        <div className="mt-12 md:mt-16 lg:mt-20 pt-8 md:pt-10 lg:pt-12 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10 lg:mb-12 px-4">Why Choose HealthyBite?</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center px-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-2xl md:text-3xl">🥗</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Personalized Nutrition</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Every meal is tailored to your unique health profile and goals</p>
            </div>
            <div className="text-center px-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-2xl md:text-3xl">🚚</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Convenient Delivery</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Fresh ingredients and meals delivered right to your doorstep</p>
            </div>
            <div className="text-center px-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-2xl md:text-3xl">💪</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Achieve Your Goals</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Whether it&apos;s weight loss, muscle gain, or better health, we&apos;ve got you covered</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 px-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold mb-2 text-sm md:text-base">Can I cancel anytime?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Yes! All our plans are flexible. You can cancel or pause your subscription at any time with no penalties.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold mb-2 text-sm md:text-base">How fresh are the ingredients?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">We source fresh, high-quality ingredients and deliver them within 24-48 hours to ensure maximum freshness.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold mb-2 text-sm md:text-base">Can I customize my meals?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Absolutely! Your meals are already personalized based on your profile. You can also swap meals or adjust preferences anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
