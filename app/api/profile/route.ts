import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const healthProfile = await request.json();

    // Mock profile save - in production, save to database
    // Validate required fields
    const requiredFields = [
      "age",
      "gender",
      "height",
      "weight",
      "activityLevel",
      "healthGoal",
      "dietaryPreference",
      "mealsPerDay",
      "budget",
      "cookingPreference",
    ];

    for (const field of requiredFields) {
      if (!healthProfile[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Health profile saved successfully",
      profile: healthProfile,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Mock profile retrieval - in production, fetch from database
    const mockProfile = {
      age: "30",
      gender: "male",
      height: "175",
      weight: "75",
      activityLevel: "moderate",
      healthGoal: "weight-loss",
      dietaryPreference: "vegetarian",
      allergies: "",
      mealsPerDay: "3",
      budget: "moderate",
      cookingPreference: "both",
      medicalConditions: "",
    };

    return NextResponse.json({
      success: true,
      profile: mockProfile,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
