import { NextRequest, NextResponse } from "next/server";

// Demo credentials from environment variables
const DEMO_EMAIL = process.env.DEMO_EMAIL || "demo@healthybite.com";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "demo123";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Demo authentication - check against demo credentials
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const user = {
        id: "demo-user-001",
        email: DEMO_EMAIL,
        name: "Demo User",
      };

      return NextResponse.json({
        success: true,
        user,
        message: "Login successful",
      });
    }

    // Invalid credentials
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
