/**
 * Standalone Gemini API Verification Script
 *
 * This script tests the Gemini API key directly without running the full application.
 * It verifies:
 * 1. API key is configured
 * 2. Gemini API is accessible
 * 3. API can generate meal recommendations
 * 4. Response parsing works correctly
 *
 * Usage: npx tsx scripts/verify-gemini-api.ts
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  duration?: number;
}

const results: TestResult[] = [];

function log(result: TestResult) {
  const icon = result.status === 'PASS' ? '✓' : result.status === 'FAIL' ? '✗' : '⚠';
  const color = result.status === 'PASS' ? '\x1b[32m' : result.status === 'FAIL' ? '\x1b[31m' : '\x1b[33m';
  const reset = '\x1b[0m';

  console.log(`${color}${icon}${reset} ${result.test}: ${result.message}${result.duration ? ` (${result.duration}ms)` : ''}`);
  results.push(result);
}

async function test1_CheckAPIKey(): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    log({
      test: 'API Key Configuration',
      status: 'FAIL',
      message: 'GEMINI_API_KEY not found in .env.local'
    });
    return;
  }

  if (apiKey === 'your-gemini-api-key-here') {
    log({
      test: 'API Key Configuration',
      status: 'FAIL',
      message: 'GEMINI_API_KEY is still set to placeholder value'
    });
    return;
  }

  const maskedKey = `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`;
  log({
    test: 'API Key Configuration',
    status: 'PASS',
    message: `API Key found: ${maskedKey}`
  });
}

async function test2_InitializeClient(): Promise<GoogleGenerativeAI | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    log({
      test: 'Gemini Client Initialization',
      status: 'FAIL',
      message: 'Cannot initialize without API key'
    });
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    log({
      test: 'Gemini Client Initialization',
      status: 'PASS',
      message: 'GoogleGenerativeAI client created successfully'
    });
    return genAI;
  } catch (error) {
    log({
      test: 'Gemini Client Initialization',
      status: 'FAIL',
      message: `Failed to create client: ${error instanceof Error ? error.message : String(error)}`
    });
    return null;
  }
}

async function test3_SimpleAPICall(genAI: GoogleGenerativeAI): Promise<void> {
  const startTime = Date.now();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Say 'Hello, HealthyBite!' in exactly 3 words.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const duration = Date.now() - startTime;

    log({
      test: 'Simple API Call',
      status: 'PASS',
      message: `API responded successfully: "${text.trim()}"`,
      duration
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;

    if (error.message?.includes('API_KEY_INVALID')) {
      log({
        test: 'Simple API Call',
        status: 'FAIL',
        message: '❌ INVALID API KEY - Please check your GEMINI_API_KEY',
        duration
      });
    } else if (error.message?.includes('PERMISSION_DENIED')) {
      log({
        test: 'Simple API Call',
        status: 'FAIL',
        message: '❌ PERMISSION DENIED - API key may lack necessary permissions',
        duration
      });
    } else if (error.message?.includes('RESOURCE_EXHAUSTED')) {
      log({
        test: 'Simple API Call',
        status: 'WARN',
        message: '⚠️  API quota exhausted - Wait and try again later',
        duration
      });
    } else {
      log({
        test: 'Simple API Call',
        status: 'FAIL',
        message: `API call failed: ${error.message || String(error)}`,
        duration
      });
    }
  }
}

async function test4_MealRecommendationGeneration(genAI: GoogleGenerativeAI): Promise<void> {
  const startTime = Date.now();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a nutritionist. Generate a JSON object with 2 meal recommendations for a person who wants to lose weight.

Response format (MUST BE VALID JSON):
{
  "meals": [
    {
      "id": 1,
      "name": "Meal Name",
      "description": "Brief description",
      "calories": 400,
      "protein": 30,
      "carbs": 35,
      "fats": 12,
      "type": "vegetarian",
      "tags": ["weight-loss"],
      "image": "🥗"
    }
  ]
}

Return ONLY the JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the response
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(cleanedText);

    if (!parsed.meals || !Array.isArray(parsed.meals)) {
      throw new Error('Response missing meals array');
    }

    const duration = Date.now() - startTime;

    log({
      test: 'Meal Recommendation Generation',
      status: 'PASS',
      message: `Generated ${parsed.meals.length} meal recommendations successfully`,
      duration
    });

    // Log sample meal
    if (parsed.meals.length > 0) {
      const meal = parsed.meals[0];
      console.log(`\n  Sample Meal: ${meal.image} ${meal.name}`);
      console.log(`  Description: ${meal.description}`);
      console.log(`  Nutrition: ${meal.calories} cal | ${meal.protein}g protein | ${meal.carbs}g carbs | ${meal.fats}g fats\n`);
    }

  } catch (error: any) {
    const duration = Date.now() - startTime;

    log({
      test: 'Meal Recommendation Generation',
      status: 'FAIL',
      message: `Failed to generate recommendations: ${error.message || String(error)}`,
      duration
    });
  }
}

async function test5_FullHealthProfileRecommendation(genAI: GoogleGenerativeAI): Promise<void> {
  const startTime = Date.now();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a professional nutritionist. Based on the health profile below, generate 3 personalized meal recommendations.

**User Health Profile:**
- Age: 30
- Gender: male
- Height: 175 cm
- Weight: 80 kg
- BMI: 26.1 (Overweight)
- Activity Level: moderate
- Health Goal: weight-loss
- Dietary Preference: vegetarian
- Allergies: None
- Meals Per Day: 3
- Budget: medium
- Medical Conditions: None

**Response Format (MUST BE VALID JSON):**
{
  "meals": [
    {
      "id": 1,
      "name": "Meal Name",
      "description": "Brief appetizing description",
      "calories": 400,
      "protein": 25,
      "carbs": 40,
      "fats": 12,
      "type": "vegetarian",
      "tags": ["weight-loss", "vegetarian"],
      "image": "🥗"
    }
  ],
  "healthTips": [
    "Tip 1 for weight loss",
    "Tip 2 for activity level",
    "Tip 3 for overall health"
  ],
  "whyTheseMeals": "Brief explanation",
  "nutritionalFocus": "Strategy statement"
}

Return ONLY the JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse response
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(cleanedText);

    if (!parsed.meals || !Array.isArray(parsed.meals)) {
      throw new Error('Response missing meals array');
    }

    if (!parsed.healthTips || !Array.isArray(parsed.healthTips)) {
      throw new Error('Response missing healthTips array');
    }

    const duration = Date.now() - startTime;

    log({
      test: 'Full Health Profile Recommendation',
      status: 'PASS',
      message: `Generated complete recommendation with ${parsed.meals.length} meals and ${parsed.healthTips.length} health tips`,
      duration
    });

    // Display results
    console.log(`\n  Nutritional Focus: ${parsed.nutritionalFocus}`);
    console.log(`  Why These Meals: ${parsed.whyTheseMeals}`);
    console.log(`\n  Health Tips:`);
    parsed.healthTips.forEach((tip: string, i: number) => {
      console.log(`    ${i + 1}. ${tip}`);
    });
    console.log('');

  } catch (error: any) {
    const duration = Date.now() - startTime;

    log({
      test: 'Full Health Profile Recommendation',
      status: 'FAIL',
      message: `Failed: ${error.message || String(error)}`,
      duration
    });
  }
}

async function main() {
  console.log('\n========================================');
  console.log('🧪 Gemini API Verification Tests');
  console.log('========================================\n');

  // Test 1: Check API Key
  await test1_CheckAPIKey();

  if (!process.env.GEMINI_API_KEY) {
    console.log('\n❌ Cannot proceed without API key. Please configure GEMINI_API_KEY in .env.local\n');
    process.exit(1);
  }

  // Test 2: Initialize Client
  const genAI = await test2_InitializeClient();

  if (!genAI) {
    console.log('\n❌ Cannot proceed without Gemini client.\n');
    process.exit(1);
  }

  // Test 3: Simple API Call
  await test3_SimpleAPICall(genAI);

  // Test 4: Meal Recommendation Generation
  await test4_MealRecommendationGeneration(genAI);

  // Test 5: Full Health Profile Recommendation
  await test5_FullHealthProfileRecommendation(genAI);

  // Summary
  console.log('\n========================================');
  console.log('📊 Test Summary');
  console.log('========================================\n');

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const warned = results.filter(r => r.status === 'WARN').length;

  console.log(`Total Tests: ${results.length}`);
  console.log(`\x1b[32m✓ Passed: ${passed}\x1b[0m`);
  console.log(`\x1b[31m✗ Failed: ${failed}\x1b[0m`);
  console.log(`\x1b[33m⚠ Warnings: ${warned}\x1b[0m`);

  if (failed === 0 && warned === 0) {
    console.log('\n🎉 All tests passed! Your Gemini API integration is working perfectly.\n');
    process.exit(0);
  } else if (failed === 0) {
    console.log('\n⚠️  All tests passed with warnings. Your API integration works but has minor issues.\n');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Please review the errors above.\n');
    process.exit(1);
  }
}

main();
