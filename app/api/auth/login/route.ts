import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Mock authentication - in production, validate against database
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Mock successful login
    const user = {
      id: "mock-user-id",
      email: email,
      name: "Mock User",
    };

    return NextResponse.json({
      success: true,
      user,
      message: "Login successful",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
