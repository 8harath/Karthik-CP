import { describe, it, expect } from "vitest";
import { healthProfileSchema, subscriptionSchema } from "@/lib/validations";

describe("Health Profile Validation", () => {
  const validProfile = {
    age: "25",
    gender: "male",
    height: "175",
    weight: "70",
    activityLevel: "moderate",
    healthGoal: "weight-loss",
    dietaryPreference: "vegetarian",
    allergies: "",
    mealsPerDay: "3",
    budget: "moderate",
    cookingPreference: "both",
    medicalConditions: "",
  };

  it("accepts a valid health profile", () => {
    const result = healthProfileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it("rejects invalid age", () => {
    const result = healthProfileSchema.safeParse({ ...validProfile, age: "5" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid height", () => {
    const result = healthProfileSchema.safeParse({ ...validProfile, height: "50" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid weight", () => {
    const result = healthProfileSchema.safeParse({ ...validProfile, weight: "10" });
    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = healthProfileSchema.safeParse({ age: "25" });
    expect(result.success).toBe(false);
  });
});

describe("Subscription Validation", () => {
  it("accepts valid subscription", () => {
    const result = subscriptionSchema.safeParse({ plan: "monthly", price: 14900 });
    expect(result.success).toBe(true);
  });

  it("rejects invalid plan", () => {
    const result = subscriptionSchema.safeParse({ plan: "yearly", price: 14900 });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = subscriptionSchema.safeParse({ plan: "monthly", price: -100 });
    expect(result.success).toBe(false);
  });
});
