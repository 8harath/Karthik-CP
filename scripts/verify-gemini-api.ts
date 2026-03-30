/**
 * Standalone Groq API Verification Script
 *
 * This script tests the Groq API key directly without running the full application.
 * It verifies:
 * 1. API key is configured
 * 2. Groq API is accessible
 * 3. API can generate meal recommendations
 * 4. Response parsing works correctly
 *
 * Usage: npx tsx scripts/verify-gemini-api.ts
 */

import Groq from "groq-sdk";
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
  const icon = result.status === 'PASS' ? '\u2713' : result.status === 'FAIL' ? '\u2717' : '\u26A0';
  const color = result.status === 'PASS' ? '\x1b[32m' : result.status === 'FAIL' ? '\x1b[31m' : '\x1b[33m';
  const reset = '\x1b[0m';

  console.log(`${color}${icon}${reset} ${result.test}: ${result.message}${result.duration ? ` (${result.duration}ms)` : ''}`);
  results.push(result);
}

async function test1_CheckAPIKey(): Promise<void> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    log({
      test: 'API Key Configuration',
      status: 'FAIL',
      message: 'GROQ_API_KEY not found in .env.local'
    });
    return;
  }

  if (apiKey === 'your-groq-api-key-here') {
    log({
      test: 'API Key Configuration',
      status: 'FAIL',
      message: 'GROQ_API_KEY is still set to placeholder value'
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

async function test2_InitializeClient(): Promise<Groq | null> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    log({
      test: 'Groq Client Initialization',
      status: 'FAIL',
      message: 'Cannot initialize without API key'
    });
    return null;
  }

  try {
    const groq = new Groq({ apiKey });
    log({
      test: 'Groq Client Initialization',
      status: 'PASS',
      message: 'Groq client created successfully'
    });
    return groq;
  } catch (error) {
    log({
      test: 'Groq Client Initialization',
      status: 'FAIL',
      message: `Failed to create client: ${error instanceof Error ? error.message : String(error)}`
    });
    return null;
  }
}

async function test3_SimpleAPICall(groq: Groq): Promise<void> {
  const startTime = Date.now();

  try {
    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Say 'Hello, HealthyBite!' in exactly 3 words." }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 50,
    });

    const text = result.choices[0]?.message?.content || "";
    const duration = Date.now() - startTime;

    log({
      test: 'Simple API Call',
      status: 'PASS',
      message: `API responded successfully: "${text.trim()}"`,
      duration
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;

    log({
      test: 'Simple API Call',
      status: 'FAIL',
      message: `API call failed: ${error.message || String(error)}`,
      duration
    });
  }
}

async function test4_MealRecommendationGeneration(groq: Groq): Promise<void> {
  const startTime = Date.now();

  try {
    const result = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a nutritionist. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: `Generate a JSON object with 2 meal recommendations for a person who wants to lose weight.

Response format:
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
      "image": "salad"
    }
  ]
}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    });

    const text = result.choices[0]?.message?.content || "";
    const parsed = JSON.parse(text);

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

    if (parsed.meals.length > 0) {
      const meal = parsed.meals[0];
      console.log(`\n  Sample Meal: ${meal.name}`);
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

async function main() {
  console.log('\n========================================');
  console.log('Groq API Verification Tests');
  console.log('========================================\n');

  await test1_CheckAPIKey();

  if (!process.env.GROQ_API_KEY) {
    console.log('\nCannot proceed without API key. Please configure GROQ_API_KEY in .env.local\n');
    process.exit(1);
  }

  const groq = await test2_InitializeClient();

  if (!groq) {
    console.log('\nCannot proceed without Groq client.\n');
    process.exit(1);
  }

  await test3_SimpleAPICall(groq);
  await test4_MealRecommendationGeneration(groq);

  console.log('\n========================================');
  console.log('Test Summary');
  console.log('========================================\n');

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const warned = results.filter(r => r.status === 'WARN').length;

  console.log(`Total Tests: ${results.length}`);
  console.log(`\x1b[32mPassed: ${passed}\x1b[0m`);
  console.log(`\x1b[31mFailed: ${failed}\x1b[0m`);
  console.log(`\x1b[33mWarnings: ${warned}\x1b[0m`);

  if (failed === 0) {
    console.log('\nAll tests passed! Your Groq API integration is working.\n');
    process.exit(0);
  } else {
    console.log('\nSome tests failed. Please review the errors above.\n');
    process.exit(1);
  }
}

main();
