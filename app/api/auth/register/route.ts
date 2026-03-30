import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { success, error } from "@/lib/apiResponse";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return error("All fields are required", 400);
    }

    if (password.length < 6) {
      return error("Password must be at least 6 characters", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return error("Please enter a valid email address", 400);
    }

    const supabase = await createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (authError) {
      logger.warn("Registration failed", { email, error: authError.message });
      return error(authError.message, 400);
    }

    return success({
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name,
      },
      message: "Registration successful",
    });
  } catch (err) {
    logger.error("Registration error", { error: err instanceof Error ? err.message : "Unknown" });
    return error("Internal server error", 500);
  }
}
