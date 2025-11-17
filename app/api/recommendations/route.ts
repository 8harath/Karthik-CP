import { NextRequest, NextResponse } from "next/server";
import { generateRecommendations } from "@/lib/recommendationEngine";

export async function POST(request: NextRequest) {
  try {
    const healthProfile = await request.json();

    // Generate recommendations using the rule-based engine
    const recommendations = generateRecommendations(healthProfile);

    return NextResponse.json({
      success: true,
      recommendations,
      message: "Recommendations generated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
