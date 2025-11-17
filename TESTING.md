# Gemini API Integration - Testing Guide

This document provides comprehensive information about testing the Gemini API integration in HealthyBite.

## Table of Contents
1. [Overview](#overview)
2. [API Key Setup](#api-key-setup)
3. [Running Tests](#running-tests)
4. [Test Coverage](#test-coverage)
5. [Troubleshooting](#troubleshooting)

## Overview

The HealthyBite application uses Google's Gemini 1.5 Flash model to generate personalized meal recommendations based on user health profiles. This testing suite verifies that the integration works correctly.

## API Key Setup

### 1. Obtain API Key

Get your free Gemini API key from: https://aistudio.google.com/app/apikey

### 2. Configure Environment

Create a `.env.local` file in the project root:

```bash
# Copy from example
cp .env.local.example .env.local

# Edit the file and add your API key
GEMINI_API_KEY=your-actual-api-key-here
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## Running Tests

### Quick Verification Script

The fastest way to verify your API integration:

```bash
# Install dependencies first
npm install

# Run the verification script
npm run verify-api
```

This standalone script will:
- ✓ Check if API key is configured
- ✓ Initialize Gemini client
- ✓ Test basic API connectivity
- ✓ Generate sample meal recommendations
- ✓ Test full health profile processing

### Expected Output

```
========================================
🧪 Gemini API Verification Tests
========================================

✓ API Key Configuration: API Key found: AIzaSyB051...kf8
✓ Gemini Client Initialization: GoogleGenerativeAI client created successfully
✓ Simple API Call: API responded successfully: "Hello, HealthyBite!" (1234ms)
✓ Meal Recommendation Generation: Generated 2 meal recommendations successfully (2456ms)

  Sample Meal: 🥗 Grilled Chicken Salad
  Description: Fresh greens with lean protein
  Nutrition: 350 cal | 35g protein | 25g carbs | 12g fats

✓ Full Health Profile Recommendation: Generated complete recommendation with 3 meals and 3 health tips (3210ms)

  Nutritional Focus: Low calorie, high protein for sustainable weight management
  Why These Meals: These meals are specifically chosen for weight loss...

  Health Tips:
    1. Focus on portion control and mindful eating
    2. Stay hydrated throughout the day
    3. Combine diet with regular exercise

========================================
📊 Test Summary
========================================

Total Tests: 5
✓ Passed: 5
✗ Failed: 0
⚠ Warnings: 0

🎉 All tests passed! Your Gemini API integration is working perfectly.
```

## Test Coverage

### 1. Configuration Tests
- **API Key Detection**: Verifies GEMINI_API_KEY is present in environment
- **Key Validation**: Checks that the key is not a placeholder value

### 2. Client Initialization Tests
- **Client Creation**: Ensures GoogleGenerativeAI client initializes correctly
- **Model Access**: Verifies access to gemini-1.5-flash model

### 3. API Connectivity Tests
- **Basic API Call**: Simple prompt/response to verify connectivity
- **Error Handling**: Tests API key validity and error messages

### 4. Meal Recommendation Tests
- **Simple Generation**: Tests basic meal recommendation generation
- **JSON Parsing**: Verifies response parsing and structure validation
- **Full Profile**: Tests complete health profile with all parameters

### 5. Feature-Specific Tests
- **Weight Loss Goal**: Verifies low-calorie recommendations
- **Muscle Gain Goal**: Ensures high-protein recommendations
- **Vegan/Vegetarian**: Tests dietary preference filtering
- **Allergy Awareness**: Confirms allergen exclusion
- **BMI Calculations**: Validates BMI computation and categorization

### 6. Fallback Mechanism Tests
- **Fallback Trigger**: Ensures fallback activates on API failures
- **Fallback Quality**: Verifies rule-based recommendations work correctly

## Troubleshooting

### Common Issues

#### ❌ "API Key not found"

**Problem:** `GEMINI_API_KEY not found in .env.local`

**Solution:**
1. Ensure `.env.local` file exists in project root
2. Add `GEMINI_API_KEY=your-key-here` to the file
3. Restart your development server

#### ❌ "API_KEY_INVALID"

**Problem:** `❌ INVALID API KEY - Please check your GEMINI_API_KEY`

**Solution:**
1. Verify your API key at https://aistudio.google.com/app/apikey
2. Ensure you copied the complete key (no spaces or newlines)
3. Generate a new API key if necessary

#### ❌ "PERMISSION_DENIED"

**Problem:** `❌ PERMISSION DENIED - API key may lack necessary permissions`

**Solution:**
1. Check that the Gemini API is enabled for your Google Cloud project
2. Verify API key restrictions in Google Cloud Console
3. Ensure you're using the correct API key

#### ⚠️ "RESOURCE_EXHAUSTED"

**Problem:** `⚠️ API quota exhausted - Wait and try again later`

**Solution:**
1. Wait a few minutes before retrying
2. Check your API usage quota at https://aistudio.google.com/
3. Consider upgrading to a paid plan for higher limits

#### ❌ "Failed to parse LLM response"

**Problem:** Response from Gemini is not valid JSON

**Solution:**
1. This is usually handled automatically with fallback
2. If persistent, check Gemini API service status
3. Report issue to development team

### Testing Without API Key

If you don't have an API key or it's not working, the application will automatically use the fallback rule-based recommendation engine. This provides basic meal recommendations without AI enhancement.

To test fallback mode:
1. Remove or comment out `GEMINI_API_KEY` from `.env.local`
2. Run the application
3. Generate recommendations - you'll see: "Recommendations generated using rule-based engine (LLM not configured)"

## Unit Tests (Optional)

For comprehensive testing with Jest:

```bash
# Install Jest and testing dependencies
npm install --save-dev jest @jest/globals ts-jest @types/jest

# Run unit tests
npm test
```

The unit test suite (`__tests__/lib/llmService.test.ts`) includes:
- Configuration validation
- Meal generation for different goals
- Dietary preference filtering
- Allergy handling
- BMI calculations
- Response validation
- Fallback mechanisms

## Integration with Application

### API Endpoint

The `/api/recommendations` endpoint automatically:
1. Checks if Gemini API is configured
2. Uses AI-powered recommendations if available
3. Falls back to rule-based engine if not

### Monitoring

Check application logs for:
```
⚠️  GEMINI_API_KEY not configured - using fallback rule-based engine
```

Or for successful AI usage:
```
AI-powered recommendations generated successfully
```

## API Rate Limits

**Free Tier:**
- 60 requests per minute
- 1,500 requests per day

**Best Practices:**
1. Cache recommendations when possible
2. Implement retry logic with exponential backoff
3. Monitor usage to avoid hitting limits
4. Consider upgrading for production use

## Security Notes

1. **Never commit API keys** - Always use `.env.local`
2. **Key Rotation** - Regularly rotate API keys
3. **Restrict Keys** - Use API key restrictions in Google Cloud Console
4. **Monitor Usage** - Watch for unusual activity

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review application logs
3. Verify API key at https://aistudio.google.com/
4. Contact development team

---

**Last Updated:** 2025-11-17
**Integration Version:** 1.0.0
**Gemini Model:** gemini-1.5-flash
