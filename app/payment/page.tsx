"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/currency";

const planDetails: Record<string, { name: string; price: number; duration: string }> = {
  weekly: { name: "Weekly Plan", price: 4100, duration: "per week" },
  monthly: { name: "Monthly Plan", price: 14900, duration: "per month" },
  quarterly: { name: "Quarterly Plan", price: 41500, duration: "per 3 months" },
};

export default function PaymentPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    zipCode: "",
  });

  useEffect(() => {
    // Check if user selected a plan
    const plan = localStorage.getItem("selectedPlan");
    if (!plan) {
      router.push("/subscriptions");
      return;
    }
    setSelectedPlan(plan);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Mock payment processing
    setTimeout(() => {
      // Save order info
      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          plan: selectedPlan,
          date: new Date().toISOString(),
          orderId: `HB${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        })
      );

      setProcessing(false);
      router.push("/payment/success");
    }, 2000);
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const plan = planDetails[selectedPlan];

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 lg:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Secure checkout - Your information is protected
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-lg p-5 md:p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl md:text-2xl font-bold mb-5 md:mb-6">Payment Information</h2>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 lg:space-y-6">
                {/* Card Number */}
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 16) {
                        setFormData({
                          ...formData,
                          cardNumber: value.replace(/(\d{4})/g, "$1 ").trim(),
                        });
                      }
                    }}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardName}
                    onChange={(e) =>
                      setFormData({ ...formData, cardName: e.target.value })
                    }
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="John Doe"
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + "/" + value.slice(2, 4);
                        }
                        if (value.length <= 5) {
                          setFormData({ ...formData, expiryDate: value });
                        }
                      }}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2">CVV</label>
                    <input
                      type="text"
                      required
                      value={formData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 3) {
                          setFormData({ ...formData, cvv: value });
                        }
                      }}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2">
                    Billing Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.billingAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billingAddress: e.target.value,
                      })
                    }
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="123 Main Street, City, State"
                  />
                </div>

                {/* Zip Code */}
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) {
                        setFormData({ ...formData, zipCode: value });
                      }
                    }}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="12345"
                    maxLength={6}
                  />
                </div>

                {/* Mock Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 md:p-4">
                  <p className="text-xs md:text-sm text-blue-800 dark:text-blue-300">
                    <strong>Demo Mode:</strong> This is a mock payment page. No actual payment will be processed. Use any test data to proceed.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3 md:py-4 text-base md:text-lg bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Pay ${formatCurrency(plan.price)}`
                  )}
                </button>
              </form>

              {/* Security Badge */}
              <div className="mt-4 md:mt-6 flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure encrypted payment</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-lg p-5 md:p-6 border border-gray-200 dark:border-gray-700 lg:sticky lg:top-24">
              <h2 className="text-lg md:text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 md:space-y-4 mb-5 md:mb-6">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600 dark:text-gray-400">Plan</span>
                  <span className="font-semibold">{plan.name}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600 dark:text-gray-400">Duration</span>
                  <span className="font-semibold capitalize">{plan.duration}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 md:pt-4">
                  <div className="flex justify-between text-base md:text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatCurrency(plan.price)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 md:p-4">
                <h3 className="font-semibold text-sm md:text-base text-green-900 dark:text-green-100 mb-2">
                  What&apos;s Included:
                </h3>
                <ul className="space-y-1 text-xs md:text-sm text-green-800 dark:text-green-300">
                  <li>✓ Personalized meal plans</li>
                  <li>✓ Fresh ingredients</li>
                  <li>✓ Flexible delivery</li>
                  <li>✓ Cancel anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
