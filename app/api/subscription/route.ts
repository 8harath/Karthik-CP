import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { subscriptionSchema } from "@/lib/validations";
import { success, error } from "@/lib/apiResponse";
import { logger } from "@/lib/logger";

const planDurations: Record<string, number> = {
  weekly: 7,
  monthly: 30,
  quarterly: 90,
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return error("Unauthorized", 401);
    }

    const body = await request.json();
    const parsed = subscriptionSchema.safeParse(body);

    if (!parsed.success) {
      const messages = parsed.error.issues.map((e: { message: string }) => e.message).join("; ");
      return error(messages, 400);
    }

    const durationDays = planDurations[parsed.data.plan] || 30;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    // Upsert subscription
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          plan: parsed.data.plan,
          price: parsed.data.price,
          status: "active",
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (subError) {
      logger.error("Subscription error", { userId: user.id, error: subError.message });
      return error("Failed to create subscription", 500);
    }

    // Create order
    const orderId = `HB${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        subscription_id: subscription.id,
        plan: parsed.data.plan,
        amount: parsed.data.price,
        currency: "INR",
        status: "completed",
        order_id: orderId,
      })
      .select()
      .single();

    if (orderError) {
      logger.error("Order creation error", { userId: user.id, error: orderError.message });
      return error("Failed to create order", 500);
    }

    logger.info("Subscription created", { userId: user.id, plan: parsed.data.plan });
    return success({
      subscription,
      order,
      message: "Subscription created successfully",
    });
  } catch (err) {
    logger.error("Subscription API error", { error: err instanceof Error ? err.message : "Unknown" });
    return error("Internal server error", 500);
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return error("Unauthorized", 401);
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return success({ subscription, orders: orders || [] });
  } catch (err) {
    logger.error("Subscription GET error", { error: err instanceof Error ? err.message : "Unknown" });
    return error("Internal server error", 500);
  }
}
