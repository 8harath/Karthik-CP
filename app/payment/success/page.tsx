"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface OrderInfo {
  order_id: string;
  plan: string;
  created_at: string;
  amount: number;
}

const planNames: Record<string, string> = {
  weekly: "Weekly Plan",
  monthly: "Monthly Plan",
  quarterly: "Quarterly Plan",
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: order } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (order) {
          setOrderInfo(order);
        }
      }
      setLoading(false);
    };

    fetchOrder();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Welcome to your healthy eating journey</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Order ID</span>
                <span className="font-mono font-semibold">{orderInfo?.order_id || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Plan</span>
                <span className="font-semibold">{planNames[orderInfo?.plan || planParam || ""] || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Order Date</span>
                <span className="font-semibold">
                  {orderInfo?.created_at ? new Date(orderInfo.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-primary-800 dark:text-primary-300 text-left">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">1.</span>
                <span>You&apos;ll receive a confirmation email with your order details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">2.</span>
                <span>Our team will prepare your personalized meal plan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">3.</span>
                <span>Expect your first delivery within 2-3 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-0.5">4.</span>
                <span>Track your order and manage your subscription in your dashboard</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Go to Dashboard
            </Link>
            <Link href="/recommendations" className="px-8 py-3 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors">
              View My Meal Plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
