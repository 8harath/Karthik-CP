import { z } from "zod";

export const healthProfileSchema = z.object({
  age: z.string().refine((v) => {
    const n = Number(v);
    return !isNaN(n) && n >= 10 && n <= 120;
  }, "Valid age (10-120) is required"),
  gender: z.string().min(1, "Gender is required"),
  height: z.string().refine((v) => {
    const n = Number(v);
    return !isNaN(n) && n >= 100 && n <= 250;
  }, "Valid height (100-250 cm) is required"),
  weight: z.string().refine((v) => {
    const n = Number(v);
    return !isNaN(n) && n >= 30 && n <= 300;
  }, "Valid weight (30-300 kg) is required"),
  activityLevel: z.string().min(1, "Activity level is required"),
  healthGoal: z.string().min(1, "Health goal is required"),
  dietaryPreference: z.string().min(1, "Dietary preference is required"),
  allergies: z.string().default(""),
  mealsPerDay: z.string().min(1, "Meals per day is required"),
  budget: z.string().min(1, "Budget preference is required"),
  cookingPreference: z.string().min(1, "Cooking preference is required"),
  medicalConditions: z.string().default(""),
});

export const subscriptionSchema = z.object({
  plan: z.enum(["weekly", "monthly", "quarterly"]),
  price: z.number().positive(),
});

export type HealthProfileInput = z.infer<typeof healthProfileSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
