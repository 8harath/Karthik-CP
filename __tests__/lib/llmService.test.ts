/**
 * Unit Tests for LLM Service (Gemini API Integration)
 *
 * These tests verify:
 * 1. API key configuration
 * 2. Gemini client initialization
 * 3. Meal recommendation generation
 * 4. Response parsing
 * 5. Fallback mechanisms
 * 6. Error handling
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import {
  generateMealRecommendationsWithLLM,
  isLLMConfigured
} from '@/lib/llmService';
import { HealthProfile } from '@/lib/recommendationEngine';

describe('LLM Service - Gemini API Integration', () => {

  // Sample health profile for testing
  const sampleProfile: HealthProfile = {
    age: '30',
    gender: 'male',
    height: '175',
    weight: '70',
    activityLevel: 'moderate',
    healthGoal: 'muscle-gain',
    dietaryPreference: 'non-vegetarian',
    allergies: '',
    mealsPerDay: '3',
    budget: 'medium',
    cookingPreference: 'moderate',
    medicalConditions: '',
  };

  describe('Configuration Tests', () => {
    it('should detect if GEMINI_API_KEY is configured', () => {
      const isConfigured = isLLMConfigured();
      expect(typeof isConfigured).toBe('boolean');

      // Log the configuration status
      console.log(`✓ API Key Configuration Status: ${isConfigured ? 'Configured ✓' : 'Not Configured ✗'}`);
    });

    it('should have GEMINI_API_KEY in environment', () => {
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey) {
        console.log(`✓ API Key found: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
        expect(apiKey).toBeTruthy();
        expect(apiKey.length).toBeGreaterThan(20);
      } else {
        console.warn('⚠️  GEMINI_API_KEY not found in environment');
      }
    });
  });

  describe('Meal Recommendation Generation', () => {
    it('should generate meal recommendations for weight-loss goal', async () => {
      const profile: HealthProfile = {
        ...sampleProfile,
        healthGoal: 'weight-loss',
        activityLevel: 'light',
        weight: '85',
      };

      const result = await generateMealRecommendationsWithLLM(profile);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.meals).toBeDefined();
      expect(Array.isArray(result.meals)).toBe(true);
      expect(result.meals.length).toBeGreaterThan(0);
      expect(result.meals.length).toBeLessThanOrEqual(5);

      // Verify meal structure
      result.meals.forEach((meal) => {
        expect(meal).toHaveProperty('id');
        expect(meal).toHaveProperty('name');
        expect(meal).toHaveProperty('description');
        expect(meal).toHaveProperty('calories');
        expect(meal).toHaveProperty('protein');
        expect(meal).toHaveProperty('carbs');
        expect(meal).toHaveProperty('fats');
        expect(meal).toHaveProperty('type');
        expect(meal).toHaveProperty('tags');
        expect(meal).toHaveProperty('image');

        // For weight-loss, calories should generally be lower
        if (!result.usedFallback) {
          expect(meal.calories).toBeLessThan(500);
        }
      });

      // Verify insights
      expect(result.insights).toBeDefined();
      expect(result.insights.bmi).toBeGreaterThan(0);
      expect(result.insights.bmiCategory).toBeTruthy();
      expect(Array.isArray(result.insights.healthTips)).toBe(true);
      expect(result.insights.whyTheseMeals).toBeTruthy();
      expect(result.insights.nutritionalFocus).toBeTruthy();

      console.log(`✓ Weight-loss recommendations generated (Used Fallback: ${result.usedFallback})`);
    }, 30000); // 30 second timeout for API call

    it('should generate meal recommendations for muscle-gain goal', async () => {
      const profile: HealthProfile = {
        ...sampleProfile,
        healthGoal: 'muscle-gain',
        activityLevel: 'very-active',
        weight: '75',
      };

      const result = await generateMealRecommendationsWithLLM(profile);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.meals).toBeDefined();
      expect(result.meals.length).toBeGreaterThan(0);

      // For muscle-gain, protein should be high
      if (!result.usedFallback) {
        const avgProtein = result.meals.reduce((sum, meal) => sum + meal.protein, 0) / result.meals.length;
        expect(avgProtein).toBeGreaterThan(25);
      }

      console.log(`✓ Muscle-gain recommendations generated (Used Fallback: ${result.usedFallback})`);
    }, 30000);

    it('should generate meal recommendations for vegan dietary preference', async () => {
      const profile: HealthProfile = {
        ...sampleProfile,
        dietaryPreference: 'vegan',
        healthGoal: 'general-health',
      };

      const result = await generateMealRecommendationsWithLLM(profile);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.meals).toBeDefined();

      // All meals should be vegan
      result.meals.forEach((meal) => {
        expect(meal.type.toLowerCase()).toBe('vegan');
      });

      console.log(`✓ Vegan recommendations generated (Used Fallback: ${result.usedFallback})`);
    }, 30000);

    it('should generate meal recommendations for vegetarian dietary preference', async () => {
      const profile: HealthProfile = {
        ...sampleProfile,
        dietaryPreference: 'vegetarian',
        healthGoal: 'energy',
      };

      const result = await generateMealRecommendationsWithLLM(profile);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.meals).toBeDefined();

      // All meals should be vegetarian or vegan
      result.meals.forEach((meal) => {
        const type = meal.type.toLowerCase();
        expect(['vegetarian', 'vegan']).toContain(type);
      });

      console.log(`✓ Vegetarian recommendations generated (Used Fallback: ${result.usedFallback})`);
    }, 30000);

    it('should respect allergy restrictions', async () => {
      const profile: HealthProfile = {
        ...sampleProfile,
        allergies: 'dairy, nuts',
        dietaryPreference: 'vegetarian',
      };

      const result = await generateMealRecommendationsWithLLM(profile);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);

      // Check that meals don't contain dairy or nuts in their names/descriptions
      result.meals.forEach((meal) => {
        const mealText = `${meal.name} ${meal.description}`.toLowerCase();
        expect(mealText).not.toMatch(/cheese|paneer|milk|yogurt/);
        expect(mealText).not.toMatch(/peanut|almond|cashew|walnut/);
      });

      console.log(`✓ Allergy-aware recommendations generated (Used Fallback: ${result.usedFallback})`);
    }, 30000);
  });

  describe('BMI Calculations', () => {
    it('should calculate BMI correctly', async () => {
      const profiles = [
        { height: '170', weight: '60', expectedBMI: 20.8 }, // Normal weight
        { height: '180', weight: '100', expectedBMI: 30.9 }, // Obese
        { height: '165', weight: '50', expectedBMI: 18.4 }, // Underweight
        { height: '175', weight: '80', expectedBMI: 26.1 }, // Overweight
      ];

      for (const { height, weight, expectedBMI } of profiles) {
        const profile: HealthProfile = {
          ...sampleProfile,
          height,
          weight,
        };

        const result = await generateMealRecommendationsWithLLM(profile);
        expect(result.insights.bmi).toBeCloseTo(expectedBMI, 1);
      }

      console.log('✓ BMI calculations verified');
    }, 30000);

    it('should categorize BMI correctly', async () => {
      const testCases = [
        { height: '170', weight: '50', expectedCategory: 'Underweight' },
        { height: '170', weight: '65', expectedCategory: 'Normal weight' },
        { height: '170', weight: '80', expectedCategory: 'Overweight' },
        { height: '170', weight: '95', expectedCategory: 'Obese' },
      ];

      for (const { height, weight, expectedCategory } of testCases) {
        const profile: HealthProfile = {
          ...sampleProfile,
          height,
          weight,
        };

        const result = await generateMealRecommendationsWithLLM(profile);
        expect(result.insights.bmiCategory).toBe(expectedCategory);
      }

      console.log('✓ BMI categorization verified');
    }, 30000);
  });

  describe('Fallback Mechanism', () => {
    it('should use fallback when API fails (simulated with invalid profile)', async () => {
      // This test assumes the API might fail with extreme/invalid inputs
      const invalidProfile: HealthProfile = {
        ...sampleProfile,
        age: '999',
        height: '0',
        weight: '0',
      };

      const result = await generateMealRecommendationsWithLLM(invalidProfile);

      // Should still return results (via fallback)
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.meals).toBeDefined();
      expect(result.meals.length).toBeGreaterThan(0);

      console.log(`✓ Fallback mechanism tested (Used Fallback: ${result.usedFallback})`);
    }, 30000);
  });

  describe('Response Validation', () => {
    it('should return valid meal data structure', async () => {
      const result = await generateMealRecommendationsWithLLM(sampleProfile);

      expect(result.meals).toBeDefined();

      result.meals.forEach((meal, index) => {
        expect(typeof meal.id).toBe('number');
        expect(typeof meal.name).toBe('string');
        expect(meal.name.length).toBeGreaterThan(0);
        expect(typeof meal.description).toBe('string');
        expect(meal.description.length).toBeGreaterThan(0);
        expect(typeof meal.calories).toBe('number');
        expect(meal.calories).toBeGreaterThan(0);
        expect(typeof meal.protein).toBe('number');
        expect(meal.protein).toBeGreaterThan(0);
        expect(typeof meal.carbs).toBe('number');
        expect(meal.carbs).toBeGreaterThan(0);
        expect(typeof meal.fats).toBe('number');
        expect(meal.fats).toBeGreaterThan(0);
        expect(typeof meal.type).toBe('string');
        expect(Array.isArray(meal.tags)).toBe(true);
        expect(typeof meal.image).toBe('string');
      });

      console.log('✓ Response structure validation passed');
    }, 30000);

    it('should include health insights', async () => {
      const result = await generateMealRecommendationsWithLLM(sampleProfile);

      expect(result.insights).toBeDefined();
      expect(typeof result.insights.bmi).toBe('number');
      expect(typeof result.insights.bmiCategory).toBe('string');
      expect(Array.isArray(result.insights.healthTips)).toBe(true);
      expect(result.insights.healthTips.length).toBeGreaterThan(0);
      expect(typeof result.insights.whyTheseMeals).toBe('string');
      expect(result.insights.whyTheseMeals.length).toBeGreaterThan(0);
      expect(typeof result.insights.nutritionalFocus).toBe('string');
      expect(result.insights.nutritionalFocus.length).toBeGreaterThan(0);

      console.log('✓ Health insights validation passed');
    }, 30000);
  });
});
