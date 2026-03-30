import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { success, error } from "@/lib/apiResponse";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return error("Email and password are required", 400);
    }

    const supabase = await createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      logger.warn("Login failed", { email, error: authError.message });
      return error(authError.message, 401);
    }

    return success({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name,
      },
      message: "Login successful",
    });
  } catch (err) {
    logger.error("Login error", { error: err instanceof Error ? err.message : "Unknown" });
    return error("Internal server error", 500);
  }
}
