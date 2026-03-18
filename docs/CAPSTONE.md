# HealthyBite - Capstone Project Documentation

> **AI-Powered Personalized Meal Planning & Subscription Platform**
> A comprehensive guide for understanding the complete implementation

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & System Design](#architecture--system-design)
4. [Features Implemented](#features-implemented)
5. [Detailed Component Breakdown](#detailed-component-breakdown)
6. [Data Flow & User Journey](#data-flow--user-journey)
7. [AI Integration Details](#ai-integration-details)
8. [Authentication System](#authentication-system)
9. [Payment System](#payment-system)
10. [Styling & Theming](#styling--theming)
11. [What's NOT Implemented](#whats-not-implemented)
12. [Future Scope](#future-scope)
13. [Testing & Verification](#testing--verification)
14. [Common Viva Questions & Answers](#common-viva-questions--answers)

---

## Project Overview

### What is HealthyBite?

HealthyBite is a **modern web application** that provides **AI-powered personalized meal recommendations** and **subscription-based meal delivery services**. The platform uses **Google Gemini 1.5 Flash** (a large language model) to generate customized meal plans based on comprehensive user health profiles.

### Problem Statement

Modern individuals face several challenges:
- **Generic diet plans** that don't account for individual health needs
- Difficulty planning meals that align with **specific health goals** (weight loss, muscle gain, etc.)
- Lack of consideration for **dietary restrictions, allergies, and preferences**
- Time-consuming manual nutrition calculation and meal planning
- No convenient subscription service for healthy meal delivery

### Solution

HealthyBite addresses these challenges by:
1. **Collecting comprehensive health data** through a 12-input questionnaire
2. **Using AI (Google Gemini)** to generate personalized meal recommendations
3. **Providing nutritional insights** including BMI calculation, health tips, and macro breakdown
4. **Offering subscription plans** with flexible weekly, monthly, and quarterly options
5. **Ensuring robust functionality** with a fallback recommendation engine

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.0.0 | React framework with App Router, Server Components, and API routes |
| **React** | 18.3.1 | UI library for building interactive components |
| **TypeScript** | 5.x | Static typing for code reliability and developer experience |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework for responsive design |
| **next-themes** | 0.4.4 | Dark/light theme management with system preference detection |

### Backend & AI

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 15.0.0 | Serverless backend for authentication, recommendations, subscriptions |
| **Google Generative AI** | 0.24.1 | Gemini 1.5 Flash integration for AI-powered recommendations |
| **Node.js** | 20+ | JavaScript runtime for server-side execution |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting and style enforcement |
| **Autoprefixer** | CSS vendor prefixing |
| **PostCSS** | CSS transformation tool |
| **tsx** | TypeScript execution for scripts |
| **dotenv** | Environment variable management |

### Why These Technologies?

1. **Next.js 15**: Provides server-side rendering, automatic code splitting, and API routes in a single framework
2. **TypeScript**: Catches errors during development, improves code maintainability
3. **Tailwind CSS**: Rapid UI development with consistent design system
4. **Gemini 1.5 Flash**: Free tier (1,500 requests/day), fast response times, high-quality AI generation
5. **next-themes**: Seamless dark mode implementation with no flash of incorrect theme

---

## Architecture & System Design

### Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │  Landing   │  │   Login    │  │   Questionnaire     │   │
│  │   Page     │→ │   Page     │→ │   (4 steps)         │   │
│  └────────────┘  └────────────┘  └─────────────────────┘   │
│         │              │                     ↓                │
│         │              │          ┌─────────────────────┐   │
│         │              │          │  Recommendations     │   │
│         │              │          │     Page             │   │
│         │              │          └─────────────────────┘   │
│         │              │                     ↓                │
│         │              │          ┌─────────────────────┐   │
│         │              │          │  Subscriptions       │   │
│         │              │          │     Page             │   │
│         │              │          └─────────────────────┘   │
│         │              │                     ↓                │
│         │              │          ┌─────────────────────┐   │
│         │              │          │  Payment Page        │   │
│         │              │          └─────────────────────┘   │
│         │              │                     ↓                │
│         │              │          ┌─────────────────────┐   │
│         │              │          │  Success Page        │   │
│         │              │          └─────────────────────┘   │
└─────────┼──────────────┼──────────────────────────────────────┘
          │              │
          │              ↓
┌─────────┼──────────────────────────────────────────────────┐
│         │         API ROUTES (SERVER SIDE)                 │
│         │                                                    │
│  ┌──────▼───────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ /api/auth/   │  │ /api/           │  │ /api/        │ │
│  │  - login     │  │  recommendations │  │ subscription │ │
│  │  - register  │  │                  │  │              │ │
│  └──────────────┘  └─────────────────┘  └──────────────┘ │
│         │                   │                              │
│         │                   ↓                              │
│         │          ┌─────────────────┐                    │
│         │          │  LLM Service    │                    │
│         │          │  (lib/          │                    │
│         │          │  llmService.ts) │                    │
│         │          └─────────────────┘                    │
│         │                   │                              │
│         │                   ↓                              │
│         │          ┌─────────────────────┐                │
│         │          │  Google Gemini API  │                │
│         │          │  (1.5 Flash)        │                │
│         │          └─────────────────────┘                │
│         │                   │                              │
│         │                   │ (on error)                   │
│         │                   ↓                              │
│         │          ┌─────────────────────┐                │
│         │          │  Fallback Engine    │                │
│         │          │  (recommendation    │                │
│         │          │   Engine.ts)        │                │
│         │          └─────────────────────┘                │
└──────────────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────┐
│                    DATA STORAGE (MVP)                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │           localStorage (Browser Storage)            │ │
│  │  - user session                                     │ │
│  │  - health profile                                   │ │
│  │  - selected plan                                    │ │
│  │  - order information                                │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Project Structure

```
healthybite/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API route handlers
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts     # POST /api/auth/login
│   │   │   └── register/
│   │   │       └── route.ts     # POST /api/auth/register
│   │   ├── profile/
│   │   │   └── route.ts         # GET/POST /api/profile
│   │   ├── recommendations/
│   │   │   └── route.ts         # POST /api/recommendations
│   │   └── subscription/
│   │       └── route.ts         # POST /api/subscription
│   ├── forgot-password/
│   │   └── page.tsx             # Password recovery page
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── payment/
│   │   ├── success/
│   │   │   └── page.tsx         # Payment success confirmation
│   │   └── page.tsx             # Payment form page
│   ├── questionnaire/
│   │   └── page.tsx             # 4-step health profile form
│   ├── recommendations/
│   │   └── page.tsx             # AI-generated meal recommendations
│   ├── register/
│   │   └── page.tsx             # User registration page
│   ├── subscriptions/
│   │   └── page.tsx             # Subscription plans selection
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Landing page (home)
│   └── globals.css              # Global styles and Tailwind imports
├── components/                   # Reusable React components
│   ├── Footer.tsx               # Footer with links and branding
│   ├── Header.tsx               # Navigation header with mobile menu
│   ├── ThemeProvider.tsx        # next-themes wrapper component
│   └── ThemeToggle.tsx          # Dark/light mode toggle button
├── lib/                          # Utility functions and services
│   ├── currency.ts              # Currency formatting (INR/USD)
│   ├── llmService.ts            # Google Gemini AI integration
│   └── recommendationEngine.ts  # Fallback rule-based recommendation engine
├── scripts/                      # Utility scripts
│   ├── test-fallback.ts         # Test fallback recommendation engine
│   └── verify-gemini-api.ts     # Verify Gemini API connectivity
├── public/                       # Static assets (images, icons)
├── .env.local                    # Environment variables (not in git)
├── .env.local.example           # Example environment file
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies and scripts
```

---

## Features Implemented

### 1. Landing Page (`app/page.tsx`)

**Purpose**: First impression and value proposition

**Components**:
- **Hero Section**: Eye-catching headline with gradient text, value proposition, and CTA buttons
- **Features Grid**: 3 feature cards explaining core benefits (Personalized Plans, Nutritious Meals, Convenient Delivery)
- **How It Works**: 4-step visual flow showing user journey
- **Navigation**: Links to registration and login

**Technologies Used**:
- Next.js Link component for client-side navigation
- Tailwind CSS for responsive grid layouts
- CSS gradients for visual appeal

**Key Code Location**: `app/page.tsx`

---

### 2. Authentication System

#### 2a. Login Page (`app/login/page.tsx`)

**Purpose**: User authentication and session management

**Features**:
- Email and password input fields with validation
- "Remember me" checkbox
- "Forgot password" link
- Demo credentials display banner
- Error message handling
- Loading state during authentication

**Flow**:
1. User enters email and password
2. Form submits to `/api/auth/login`
3. If successful, user data saved to localStorage
4. Redirects to `/questionnaire` (if no profile) or `/recommendations` (if profile exists)

**Demo Credentials**:
- Email: `demo@healthybite.com`
- Password: `demo123`

**Key Code Locations**:
- Frontend: `app/login/page.tsx` (lines 1-168)
- Backend: `app/api/auth/login/route.ts` (lines 1-47)

#### 2b. Registration Page (`app/register/page.tsx`)

**Purpose**: New user account creation

**Features**:
- Name, email, password input fields
- Password confirmation validation
- Terms and conditions checkbox
- API call to registration endpoint
- Automatic login after successful registration

**Key Code Location**: `app/register/page.tsx`

#### 2c. Forgot Password Page (`app/forgot-password/page.tsx`)

**Purpose**: Password recovery interface (mock implementation)

**Key Code Location**: `app/forgot-password/page.tsx`

---

### 3. Health Questionnaire (`app/questionnaire/page.tsx`)

**Purpose**: Collect comprehensive health data for personalized recommendations

**Implementation Details**:

#### Multi-Step Form (4 Steps)

**Step 1: Basic Information** (lines 92-164)
- Age (number input, 10-120)
- Gender (dropdown: male, female, other, prefer-not-to-say)
- Height in cm (number input, 100-250)
- Weight in kg (number input, 30-300)

**Step 2: Lifestyle & Goals** (lines 166-227)
- Activity Level (dropdown):
  - Sedentary (little or no exercise)
  - Light (exercise 1-3 days/week)
  - Moderate (exercise 3-5 days/week)
  - Active (exercise 6-7 days/week)
  - Very Active (physical job or training twice per day)
- Health Goal (dropdown):
  - Weight Loss
  - Muscle Gain
  - Maintain Current Weight
  - General Health & Wellness
  - Increase Energy Levels
- Meals Per Day (dropdown): 2, 3, 4, 5+ meals

**Step 3: Dietary Preferences** (lines 229-281)
- Dietary Preference (dropdown):
  - Non-Vegetarian
  - Vegetarian
  - Vegan
  - Pescatarian
  - Keto
  - Paleo
  - No Preference
- Allergies/Food Restrictions (textarea, optional)
- Medical Conditions (textarea, optional)

**Step 4: Budget & Cooking** (lines 283-328)
- Budget Preference (dropdown):
  - Budget-Friendly
  - Moderate
  - Premium
- Cooking Preference (dropdown):
  - Ready-to-Eat Meals
  - Meal Kits (Some Cooking Required)
  - Both Options

#### Technical Implementation

**State Management**:
```typescript
const [step, setStep] = useState(1); // Current step (1-4)
const [formData, setFormData] = useState<HealthProfile>({
  age: "", gender: "", height: "", weight: "",
  activityLevel: "", healthGoal: "", dietaryPreference: "",
  allergies: "", mealsPerDay: "", budget: "",
  cookingPreference: "", medicalConditions: ""
});
```

**Progress Bar**:
- Visual indicator showing completion percentage
- Formula: `(step / totalSteps) * 100`
- Located at lines 76-87

**Navigation**:
- "Next Step" button (lines 344-351): Advances to next step
- "Previous" button (lines 333-339): Goes back to previous step
- "Complete Profile" button (lines 353-358): Submits form

**Data Persistence**:
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Save to localStorage
  localStorage.setItem("healthProfile", JSON.stringify(formData));
  // Navigate to recommendations
  router.push("/recommendations");
};
```

**Key Code Location**: `app/questionnaire/page.tsx` (lines 1-367)

---

### 4. AI-Powered Meal Recommendations

#### 4a. Recommendations Page (`app/recommendations/page.tsx`)

**Purpose**: Display personalized meal recommendations with nutritional insights

**Layout Sections**:

1. **Header** (lines 112-126)
   - Title: "AI-Powered Meal Recommendations" or "Your Personalized Meal Plan"
   - AI indicator icon (robot emoji)
   - Fallback warning badge (if AI not configured)

2. **Health Summary Card** (lines 128-158)
   - BMI value and category
   - Health goal
   - Dietary preference
   - Activity level
   - Gradient background for visual appeal

3. **AI Insights Grid** (lines 161-185)
   - **Why These Meals?**: AI's explanation of meal selection reasoning
   - **Nutritional Strategy**: Macro-nutrient focus (e.g., "High protein, low carb")
   - Icons for visual hierarchy

4. **Personalized Health Tips** (lines 188-203)
   - 3 tailored health tips based on:
     - User's BMI category
     - Health goals
     - Activity level
   - Bullet point list format

5. **Meal Cards Grid** (lines 206-251)
   - 3-column responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
   - Each card contains:
     - Emoji image (5xl size)
     - Meal name (heading)
     - Description
     - Nutritional macros grid (calories, protein, carbs)
     - Tags (dietary type, health goal alignment)
   - Hover effect with shadow transition

6. **CTA Section** (lines 254-274)
   - "View Subscription Plans" button → `/subscriptions`
   - "Update Profile" button → `/questionnaire`

**Data Flow**:
```typescript
useEffect(() => {
  // 1. Check authentication
  const user = localStorage.getItem("user");
  if (!user) router.push("/login");

  // 2. Load health profile
  const savedProfile = localStorage.getItem("healthProfile");
  if (!savedProfile) router.push("/questionnaire");

  // 3. Generate recommendations
  generateAIRecommendations(healthProfile);
}, [router]);

const generateAIRecommendations = async (healthProfile: HealthProfile) => {
  const response = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(healthProfile),
  });
  const data = await response.json();
  setRecommendations(data.recommendations);
  setInsights(data.insights);
};
```

**Loading State** (lines 77-88):
- Animated spinner
- "Generating your personalized meal recommendations..." message

**Error Handling** (lines 90-106):
- Error display with retry button
- Calls `generateAIRecommendations()` again on retry

**Key Code Location**: `app/recommendations/page.tsx` (lines 1-279)

#### 4b. Recommendations API (`app/api/recommendations/route.ts`)

**Purpose**: Backend endpoint for generating meal recommendations

**Implementation Flow**:

1. **Check LLM Configuration** (lines 9-22)
   ```typescript
   if (!isLLMConfigured()) {
     // Use fallback rule-based engine
     const recommendations = generateRecommendations(healthProfile);
     return NextResponse.json({
       success: true,
       recommendations,
       usedFallback: true
     });
   }
   ```

2. **Generate AI Recommendations** (lines 24-26)
   ```typescript
   const result = await generateMealRecommendationsWithLLM(healthProfile);
   ```

3. **Return Response** (lines 28-35)
   - Meals array
   - Insights object (BMI, health tips, nutritional focus)
   - Success indicator
   - Fallback indicator

**Error Handling** (lines 36-46):
- Catches any errors during generation
- Returns 500 status with error message

**Key Code Location**: `app/api/recommendations/route.ts` (lines 1-48)

---

### 5. LLM Service (AI Integration)

#### File: `lib/llmService.ts`

**Purpose**: Core AI integration using Google Gemini 1.5 Flash

**Key Functions**:

#### 5a. `generateMealRecommendationsWithLLM()` (lines 31-73)

**Purpose**: Main function to generate AI-powered recommendations

**Process**:
1. Initialize Gemini API client
2. Calculate user's BMI
3. Create detailed prompt
4. Send request to Gemini
5. Parse JSON response
6. Return meals and insights
7. Fall back to rule-based engine on error

**Code**:
```typescript
export async function generateMealRecommendationsWithLLM(
  profile: HealthProfile
): Promise<LLMRecommendationResponse> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const bmi = calculateBMI(height, weight);
    const prompt = createMealRecommendationPrompt(profile, bmi, bmiCategory);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const parsedResponse = parseGeminiResponse(text);

    return {
      meals: parsedResponse.meals,
      insights: { bmi, bmiCategory, healthTips, whyTheseMeals, nutritionalFocus },
      success: true,
      usedFallback: false
    };
  } catch (error) {
    // Fallback to rule-based engine
    return generateFallbackRecommendations(profile);
  }
}
```

#### 5b. `createMealRecommendationPrompt()` (lines 78-144)

**Purpose**: Construct detailed prompt for Gemini API

**Prompt Structure**:
1. **System Role**: "You are a professional nutritionist and meal planning expert"
2. **User Health Profile**: All 12 inputs including BMI
3. **Task Instructions**:
   - Generate 5 personalized meals
   - Match dietary preference
   - Support health goal
   - Consider activity level
   - Avoid allergies
   - Include realistic nutrition data
4. **Response Format**: Strict JSON schema
5. **Guidelines**:
   - Calorie ranges based on goals
   - Protein requirements
   - Cultural diversity
   - Appetizing descriptions

**Example Prompt Section**:
```
**User Health Profile:**
- Age: 28
- Gender: male
- Height: 175 cm
- Weight: 75 kg
- BMI: 24.5 (Normal weight)
- Activity Level: moderate
- Health Goal: muscle-gain
- Dietary Preference: vegetarian
- Allergies: None
- Meals Per Day: 3
- Budget: moderate
- Cooking Preference: meal-kits
- Medical Conditions: None
```

**Key Code Location**: `lib/llmService.ts` (lines 78-144)

#### 5c. `parseGeminiResponse()` (lines 149-181)

**Purpose**: Parse and validate Gemini's JSON response

**Process**:
1. Clean markdown code blocks (```json...```)
2. Parse JSON string
3. Validate structure (meals array exists)
4. Limit to 5 meals
5. Extract health tips, reasoning, and nutritional focus

**Error Handling**:
- Throws error if JSON parsing fails
- Throws error if meals array missing
- Provides fallback values for optional fields

**Key Code Location**: `lib/llmService.ts` (lines 149-181)

#### 5d. `generateFallbackRecommendations()` (lines 186-210)

**Purpose**: Fallback mechanism when AI fails

**Process**:
1. Calculate BMI
2. Call rule-based recommendation engine
3. Generate generic health tips
4. Return standardized response format

**Key Code Location**: `lib/llmService.ts` (lines 186-210)

#### 5e. BMI Calculation Functions (lines 229-242)

**BMI Formula**: `weight (kg) / (height (m))²`

```typescript
function calculateBMI(height: number, weight: number): number {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}
```

**Key Code Location**: `lib/llmService.ts` (lines 229-242)

---

### 6. Fallback Recommendation Engine

#### File: `lib/recommendationEngine.ts`

**Purpose**: Rule-based meal recommendation system (used when AI unavailable)

**Meal Database** (lines 29-183):
- 12 pre-configured meals with complete nutritional data
- Categories:
  - High Protein (for muscle gain)
  - Weight Loss (low calorie)
  - Balanced (maintenance)
  - High Calorie (muscle gain)
  - Energy Boosting

**Example Meal**:
```typescript
{
  id: 1,
  name: "Grilled Chicken Breast with Quinoa",
  description: "Lean protein with complex carbs and mixed vegetables",
  calories: 450,
  protein: 45,
  carbs: 35,
  fats: 12,
  type: "non-vegetarian",
  tags: ["high-protein", "low-fat", "muscle-gain"],
  image: "🍗"
}
```

**Recommendation Algorithm** (lines 185-255):

```typescript
export function generateRecommendations(profile: HealthProfile): MealRecommendation[] {
  // Step 1: Filter by dietary preference
  let filteredMeals = mealDatabase.filter((meal) => {
    if (pref === "vegan") return meal.type === "vegan";
    if (pref === "vegetarian") return ["vegetarian", "vegan"].includes(meal.type);
    if (pref === "pescatarian") return ["pescatarian", "vegetarian", "vegan"].includes(meal.type);
    return true; // non-vegetarian: all meals allowed
  });

  // Step 2: Filter by health goal
  if (goal === "weight-loss") {
    filteredMeals = filteredMeals.filter(meal => meal.calories < 400);
  }
  if (goal === "muscle-gain") {
    filteredMeals = filteredMeals.filter(meal => meal.protein > 25);
  }

  // Step 3: Filter by activity level (calorie range)
  if (activity === "sedentary" || activity === "light") {
    filteredMeals = filteredMeals.filter(meal => meal.calories < 500);
  }

  // Step 4: Remove meals with allergens
  if (profile.allergies) {
    // Check meal name and description for allergen keywords
  }

  // Step 5: Sort by relevance
  filteredMeals.sort((a, b) => {
    const aScore = a.tags.includes(goal) ? 1 : 0;
    const bScore = b.tags.includes(goal) ? 1 : 0;
    return bScore - aScore;
  });

  // Step 6: Return top 5 meals
  return filteredMeals.slice(0, 5);
}
```

**Filtering Logic**:

1. **Dietary Preference Hierarchy**:
   - Vegan: Only vegan meals
   - Vegetarian: Vegan + vegetarian meals
   - Pescatarian: Vegan + vegetarian + pescatarian meals
   - Non-vegetarian: All meals

2. **Health Goal Filters**:
   - Weight Loss: calories < 400
   - Muscle Gain: protein > 25g
   - Energy: carbs > 50g
   - General Health: No filter

3. **Activity Level Filters**:
   - Sedentary/Light: calories < 500
   - Very Active: calories > 350

4. **Allergen Detection**:
   - Splits allergy string by commas
   - Checks meal name and description for keywords
   - Special mappings: "dairy" → "cheese", "gluten" → "pasta"

**Key Code Location**: `lib/recommendationEngine.ts` (lines 1-269)

---

### 7. Subscription Plans (`app/subscriptions/page.tsx`)

**Purpose**: Display and select subscription tiers

**Pricing Plans** (lines 19-71):

| Plan | Price (INR) | Duration | Meals | Discount | Features |
|------|-------------|----------|-------|----------|----------|
| **Weekly** | ₹4,100 | per week | 7 | - | 5 features |
| **Monthly** | ₹14,900 | per month | 28 | 9% (was ₹16,300) | 6 features + priority delivery |
| **Quarterly** | ₹41,500 | per 3 months | 84 | 15% (was ₹48,900) | 8 features + consultation |

**Plan Features**:
- Weekly: Basic features, flexible, cancel anytime
- Monthly: **Most Popular**, priority delivery, exclusive meals
- Quarterly: Best value, free nutrition consultation, 24/7 support

**UI Components**:

1. **Pricing Cards** (lines 105-197)
   - 3-column grid (stacks on mobile)
   - "Most Popular" badge on Monthly plan
   - Savings badge (green)
   - Original price strikethrough (for discounted plans)
   - Feature list with checkmarks
   - "Select Plan" button (highlights when selected)
   - Hover and scale effects
   - Click to select

2. **Selected State**:
   ```typescript
   const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
   ```
   - Card border turns primary color
   - Ring effect added
   - Button text changes to "Selected"
   - Proceed button appears

3. **Proceed to Payment Button** (lines 200-209)
   - Only visible when plan selected
   - Saves plan to localStorage
   - Navigates to `/payment`

4. **Why Choose HealthyBite Section** (lines 212-245)
   - 3 benefit cards with icons
   - Personalized Nutrition, Convenient Delivery, Achieve Your Goals

5. **FAQ Section** (lines 247-272)
   - Can I cancel anytime?
   - How fresh are the ingredients?
   - Can I customize my meals?

**Mobile Optimization** (implemented in PR #5):
- Responsive font sizes (text-3xl md:text-4xl lg:text-5xl)
- Responsive padding (p-5 md:p-6 lg:p-8)
- Responsive gaps (gap-4 md:gap-6 lg:gap-8)
- Smaller badges on mobile
- Touch-friendly button sizes (py-3.5 on mobile)

**Key Code Location**: `app/subscriptions/page.tsx` (lines 1-277)

---

### 8. Payment System

#### 8a. Payment Page (`app/payment/page.tsx`)

**Purpose**: Mock payment form and order summary

**Layout**:

1. **Payment Form (Left Side)** (lines 78-249)
   - Card Number (16 digits, auto-formatted with spaces)
   - Cardholder Name (text input)
   - Expiry Date (MM/YY format, auto-formatted)
   - CVV (3 digits)
   - Billing Address (text input)
   - Zip Code (6 digits for India)
   - Demo mode notice (blue banner)

2. **Order Summary (Right Side)** (lines 270-303)
   - Selected plan name
   - Duration
   - Total price (in INR)
   - What's included checklist
   - Sticky positioning on desktop

**Input Validation & Formatting**:

```typescript
// Card number formatting
onChange={(e) => {
  const value = e.target.value.replace(/\D/g, "");
  if (value.length <= 16) {
    setFormData({
      ...formData,
      cardNumber: value.replace(/(\d{4})/g, "$1 ").trim()
    });
  }
}}

// Expiry date formatting (MM/YY)
onChange={(e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2, 4);
  }
  if (value.length <= 5) {
    setFormData({ ...formData, expiryDate: value });
  }
}}
```

**Payment Processing** (lines 36-55):
1. Mock 2-second delay
2. Generate random order ID (format: HB + 9 uppercase alphanumeric)
3. Save order details to localStorage
4. Navigate to success page

**Security UI Elements**:
- Lock icon with "Secure encrypted payment" text
- Professional payment form styling
- Loading spinner during processing

**Key Code Location**: `app/payment/page.tsx` (lines 1-309)

#### 8b. Payment Success Page (`app/payment/success/page.tsx`)

**Purpose**: Order confirmation and next steps

**Content**:
- Success icon (green checkmark)
- Order confirmation message
- Order ID display
- Selected plan summary
- Next steps checklist:
  1. You'll receive confirmation email
  2. First delivery scheduled
  3. Manage subscription in dashboard
- "View Plans" button
- "Back to Home" button

**Key Code Location**: `app/payment/success/page.tsx`

---

### 9. Currency System (`lib/currency.ts`)

**Purpose**: Handle INR/USD currency formatting

**Functions**:

```typescript
// Format price to INR
export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  // USD formatting
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Get currency symbol
export function getCurrencySymbol(currency: Currency = 'INR'): string {
  return currency === 'INR' ? '₹' : '$';
}

// Convert USD to INR
export function convertUsdToInr(usdAmount: number): number {
  const exchangeRate = 83; // Approximate rate
  return Math.round(usdAmount * exchangeRate);
}
```

**Usage**:
- All pricing displays use `formatCurrency()`
- Automatic thousand separator (Indian numbering: ₹41,500)
- No decimal places for INR (Indian convention)

**Key Code Location**: `lib/currency.ts` (lines 1-51)

---

### 10. Theme System

#### 10a. Theme Provider (`components/ThemeProvider.tsx`)

**Purpose**: Wrapper for next-themes library

**Configuration**:
```typescript
<ThemeProvider
  attribute="class"              // Uses class-based dark mode
  defaultTheme="system"          // Respects system preference
  enableSystem                   // Allows system detection
  disableTransitionOnChange      // Prevents flash on mount
>
```

**How it Works**:
- Adds `class="dark"` to `<html>` tag when dark mode active
- Persists theme preference to localStorage
- Detects system preference (Windows/Mac dark mode)

**Key Code Location**: `components/ThemeProvider.tsx` (lines 1-12)

#### 10b. Theme Toggle (`components/ThemeToggle.tsx`)

**Purpose**: Button to switch between light/dark modes

**Features**:
- Sun icon (light mode)
- Moon icon (dark mode)
- Smooth icon transition
- Mounted check to prevent hydration mismatch
- Accessible button with aria-label

**Code**:
```typescript
const { theme, setTheme } = useTheme();
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);

if (!mounted) return null; // Prevent hydration mismatch

return (
  <button
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
    aria-label="Toggle theme"
  >
    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
  </button>
);
```

**Key Code Location**: `components/ThemeToggle.tsx`

#### 10c. Dark Mode Styling

**Tailwind CSS Classes**:
- `dark:bg-gray-900` - Dark background
- `dark:text-gray-100` - Light text in dark mode
- `dark:border-gray-700` - Darker borders
- `bg-white dark:bg-gray-800` - Conditional backgrounds

**Global Styles** (`app/globals.css`):
```css
@layer base {
  :root {
    --primary-600: #059669; /* Green-600 */
  }

  .dark {
    /* Dark mode specific styles */
  }
}
```

---

### 11. Navigation Components

#### 11a. Header (`components/Header.tsx`)

**Purpose**: Main navigation and branding

**Features**:
- Logo with emoji and gradient text
- Desktop navigation menu (hidden on mobile)
- Mobile hamburger menu
- "Sign In" and "Get Started" buttons
- Theme toggle button
- Sticky positioning with backdrop blur
- Active page highlighting

**Navigation Items**:
```typescript
const navItems = [
  { href: "/", label: "Home" },
  { href: "/questionnaire", label: "Questionnaire" },
  { href: "/subscriptions", label: "Plans" },
];
```

**Mobile Menu**:
- Toggle state with useState
- Slide-in animation
- Full-width menu items
- Close on navigation

**Styling**:
- Sticky header with `sticky top-0 z-50`
- Glassmorphism effect: `backdrop-blur bg-white/95`
- Responsive padding and spacing

**Key Code Location**: `components/Header.tsx` (lines 1-129)

#### 11b. Footer (`components/Footer.tsx`)

**Purpose**: Site footer with links and branding

**Content**:
- Copyright notice
- Social media links (placeholder)
- Additional navigation links
- Terms and privacy policy links (placeholder)

**Key Code Location**: `components/Footer.tsx`

---

### 12. Root Layout (`app/layout.tsx`)

**Purpose**: Global layout wrapper for all pages

**Structure**:
```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Key Features**:
- Flexbox layout ensuring footer stays at bottom
- `suppressHydrationWarning` prevents theme flash warning
- `flex-grow` on main content
- Metadata for SEO

**Metadata**:
```typescript
export const metadata: Metadata = {
  title: "HealthyBite - Personalized Meal Plans & Subscriptions",
  description: "Get personalized meal recommendations and hassle-free food delivery subscriptions tailored to your health goals.",
};
```

**Key Code Location**: `app/layout.tsx` (lines 1-38)

---

## Data Flow & User Journey

### Complete User Journey

```
1. Landing Page (/)
   └─> User reads about HealthyBite
   └─> Clicks "Get Started"
       ↓
2. Registration (/register)
   └─> Fills name, email, password
   └─> POST /api/auth/register
   └─> Data saved to localStorage: { user: {...} }
       ↓
3. Login (/login)
   └─> Enters demo credentials
   └─> POST /api/auth/login
   └─> Checks localStorage for healthProfile
       ↓
4. Health Questionnaire (/questionnaire)
   └─> Step 1: Age, gender, height, weight
   └─> Step 2: Activity, goals, meals/day
   └─> Step 3: Diet, allergies, conditions
   └─> Step 4: Budget, cooking preference
   └─> Saves to localStorage: { healthProfile: {...} }
       ↓
5. Recommendations Page (/recommendations)
   └─> Loads healthProfile from localStorage
   └─> POST /api/recommendations with profile
       ↓
   API checks GEMINI_API_KEY
       ├─> IF CONFIGURED:
       │   └─> Call Gemini 1.5 Flash
       │   └─> Parse AI response
       │   └─> Return meals + insights
       │
       └─> IF NOT CONFIGURED:
           └─> Use fallback engine
           └─> Filter meal database
           └─> Return top 5 meals
       ↓
   └─> Display 5 meal cards
   └─> Show BMI, health tips, nutritional strategy
   └─> Click "View Subscription Plans"
       ↓
6. Subscription Plans (/subscriptions)
   └─> View 3 pricing tiers
   └─> Select plan (Weekly/Monthly/Quarterly)
   └─> Saves to localStorage: { selectedPlan: "monthly" }
   └─> Click "Proceed to Payment"
       ↓
7. Payment Page (/payment)
   └─> Loads selectedPlan from localStorage
   └─> Fills payment form (mock data)
   └─> Mock 2-second processing
   └─> Generate order ID
   └─> Saves to localStorage: { lastOrder: {...} }
       ↓
8. Success Page (/payment/success)
   └─> Display order confirmation
   └─> Show order ID and plan details
   └─> "View Plans" or "Back to Home"
```

### Data Storage (localStorage)

**Keys Used**:

1. **`user`** (after login/register)
   ```json
   {
     "id": "demo-user-001",
     "email": "demo@healthybite.com",
     "name": "Demo User"
   }
   ```

2. **`healthProfile`** (after questionnaire)
   ```json
   {
     "age": "28",
     "gender": "male",
     "height": "175",
     "weight": "75",
     "activityLevel": "moderate",
     "healthGoal": "muscle-gain",
     "dietaryPreference": "vegetarian",
     "allergies": "",
     "mealsPerDay": "3",
     "budget": "moderate",
     "cookingPreference": "meal-kits",
     "medicalConditions": ""
   }
   ```

3. **`selectedPlan`** (after plan selection)
   ```json
   "monthly"
   ```

4. **`lastOrder`** (after payment)
   ```json
   {
     "plan": "monthly",
     "date": "2025-01-15T10:30:00.000Z",
     "orderId": "HBA1B2C3D4E"
   }
   ```

5. **`theme`** (managed by next-themes)
   ```json
   "dark" or "light" or "system"
   ```

---

## AI Integration Details

### Google Gemini 1.5 Flash

**Why Gemini 1.5 Flash?**
- **Free Tier**: 1,500 requests per day
- **Fast Response**: 1-3 seconds per generation
- **High Quality**: Understands complex nutritional requirements
- **JSON Mode**: Reliable structured output
- **Context Length**: 1M tokens (more than needed)

**API Configuration**:
```typescript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
```

**Cost** (if exceeding free tier):
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens
- Estimated: ~$0.0002 per recommendation

### Prompt Engineering

**Prompt Structure** (see `lib/llmService.ts:78-144`):

1. **System Role**: Establishes AI as nutritionist
2. **User Context**: Complete health profile with 12 data points
3. **Task Definition**: Generate 5 personalized meals
4. **Constraints**:
   - Match dietary preference exactly
   - Support health goal (weight loss, muscle gain, etc.)
   - Consider activity level for calorie targets
   - Avoid all listed allergies
   - Include realistic macro breakdown
5. **Output Format**: Strict JSON schema
6. **Quality Guidelines**:
   - Weight loss: <450 calories
   - Muscle gain: >30g protein
   - Energy: >50g carbs
   - Cultural diversity in meal selection
   - Appetizing descriptions

**Example Output**:
```json
{
  "meals": [
    {
      "id": 1,
      "name": "Paneer Tikka Protein Bowl",
      "description": "Grilled cottage cheese with quinoa and roasted vegetables",
      "calories": 420,
      "protein": 32,
      "carbs": 38,
      "fats": 15,
      "type": "vegetarian",
      "tags": ["high-protein", "muscle-gain", "vegetarian"],
      "image": "🧀"
    }
  ],
  "healthTips": [
    "Aim for 0.8g protein per kg body weight for muscle gain",
    "Your BMI is in normal range - focus on strength training",
    "Moderate activity requires 2000-2200 calories per day"
  ],
  "whyTheseMeals": "These high-protein vegetarian meals support muscle gain while providing sustained energy for moderate activity. Each meal contains 30+ grams of protein and complex carbohydrates for recovery.",
  "nutritionalFocus": "High protein (30-35g), moderate carbs for muscle building"
}
```

### Error Handling & Fallback

**Failure Scenarios**:
1. `GEMINI_API_KEY` not configured
2. API rate limit exceeded
3. Network error
4. Invalid JSON response from AI
5. Malformed API response

**Fallback Strategy**:
```typescript
try {
  // Attempt AI generation
  const result = await generateMealRecommendationsWithLLM(profile);
  return result;
} catch (error) {
  console.error("AI generation failed:", error);
  // Automatically fall back to rule-based engine
  return generateFallbackRecommendations(profile);
}
```

**Fallback Advantages**:
- 100% uptime guarantee
- No dependency on external API
- Instant responses (no network delay)
- Deterministic results for testing

---

## Authentication System

### Current Implementation (MVP)

**Type**: Demo authentication with localStorage

**Flow**:
1. User enters credentials
2. Frontend validates input
3. POST request to `/api/auth/login`
4. Backend checks against demo credentials
5. If valid, returns user object
6. Frontend saves to localStorage
7. Redirects to questionnaire or recommendations

**Demo Credentials**:
```javascript
DEMO_EMAIL = "demo@healthybite.com"
DEMO_PASSWORD = "demo123"
```

**Backend Logic** (`app/api/auth/login/route.ts`):
```typescript
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Validate against demo credentials
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    const user = {
      id: "demo-user-001",
      email: DEMO_EMAIL,
      name: "Demo User",
    };
    return NextResponse.json({ success: true, user });
  }

  return NextResponse.json(
    { error: "Invalid email or password" },
    { status: 401 }
  );
}
```

**Session Management**:
- Stored in localStorage (key: `user`)
- No expiration (MVP limitation)
- No server-side session
- No JWT tokens

**Security Considerations**:
- **NOT secure for production**
- localStorage accessible via JavaScript
- No encryption
- No session timeout
- No CSRF protection
- No rate limiting

---

## Payment System

### Current Implementation (Mock)

**Purpose**: Demonstrate payment flow without real transactions

**Features**:
- Realistic payment form UI
- Input validation and formatting
- Mock processing delay (2 seconds)
- Order ID generation
- Success confirmation

**Payment Flow**:
1. User selects subscription plan
2. Redirects to `/payment`
3. Fills payment form (any data accepted)
4. Clicks "Pay ₹X,XXX"
5. Loading spinner for 2 seconds
6. Order ID generated: `HB` + random alphanumeric
7. Saved to localStorage
8. Redirects to `/payment/success`

**Order ID Generation**:
```typescript
const orderId = `HB${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
// Example: HBA1B2C3D4E
```

**Mock Notice**:
> "Demo Mode: This is a mock payment page. No actual payment will be processed. Use any test data to proceed."

**What's Missing**:
- Payment gateway integration (Stripe, Razorpay)
- Real card validation
- Payment processing
- Transaction records
- Refund system
- Invoice generation
- Email confirmation

---

## Styling & Theming

### Tailwind CSS Configuration

**Primary Colors**:
```javascript
colors: {
  primary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    // ... (green color palette)
    600: '#059669', // Main brand color
    700: '#047857',
    // ...
  }
}
```

**Custom Styles**:
- Glassmorphism header: `backdrop-blur bg-white/95`
- Gradient text: `bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent`
- Smooth transitions: `transition-all duration-300`
- Hover effects: `hover:scale-105 hover:shadow-lg`

**Responsive Design**:
- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Responsive utilities: `text-base md:text-lg lg:text-xl`

**Dark Mode**:
- Class-based: `.dark` class added to `<html>`
- Conditional styles: `dark:bg-gray-900 dark:text-white`
- System preference detection

**Accessibility**:
- Semantic HTML (`<header>`, `<main>`, `<footer>`)
- ARIA labels on buttons
- Keyboard navigation support
- Focus states: `focus:ring-2 focus:ring-primary-500`

---

## What's NOT Implemented

### Backend & Database

1. **No Real Database**
   - Currently: localStorage (client-side only)
   - Missing: PostgreSQL, MongoDB, or other database
   - Impact: Data lost on browser clear, no multi-device sync

2. **No User Authentication System**
   - Currently: Demo credentials only
   - Missing: JWT tokens, password hashing (bcrypt), session management
   - Impact: Not secure for production, no password reset

3. **No Server-Side Data Persistence**
   - Currently: All data in browser localStorage
   - Missing: Backend storage, server-side sessions
   - Impact: Data not accessible across devices

### Payment Integration

1. **No Real Payment Gateway**
   - Currently: Mock payment form
   - Missing: Stripe, Razorpay, PayPal integration
   - Impact: Cannot process real transactions

2. **No Transaction Records**
   - Currently: Order ID stored locally
   - Missing: Payment history, invoice generation
   - Impact: No order tracking or receipts

### User Features

1. **No User Dashboard**
   - Missing: Profile management, order history, account settings
   - Impact: Limited user account functionality

2. **No Order Tracking**
   - Missing: Delivery status, tracking number, estimated delivery
   - Impact: Users don't know order status

3. **No Meal Customization**
   - Missing: Swap meals, adjust portions, exclude ingredients
   - Impact: Less flexible meal plans

4. **No Weekly Calendar View**
   - Missing: Visual meal schedule for the week
   - Impact: Harder to plan meals in advance

5. **No Saved Meal Plans**
   - Missing: Save favorite meals, repeat previous plans
   - Impact: Must regenerate recommendations each time

### Communication

1. **No Email Notifications**
   - Missing: Order confirmation, delivery updates, welcome emails
   - Impact: No automated communication with users

2. **No SMS Notifications**
   - Missing: Delivery alerts, OTP verification
   - Impact: No mobile notifications

3. **No Push Notifications**
   - Missing: Browser/mobile app notifications
   - Impact: No real-time updates

### Admin & Management

1. **No Admin Panel**
   - Missing: User management, order management, meal database CRUD
   - Impact: Cannot manage platform content

2. **No Analytics Dashboard**
   - Missing: User metrics, popular meals, revenue tracking
   - Impact: No business insights

3. **No Meal Management System**
   - Missing: Add/edit/delete meals, upload images, manage inventory
   - Impact: Static meal database

### Advanced Features

1. **No Multi-Language Support**
   - Currently: English only
   - Missing: Hindi, regional languages
   - Impact: Limited accessibility in India

2. **No Mobile Application**
   - Currently: Web app only
   - Missing: iOS/Android native apps
   - Impact: No app store presence, limited mobile features

3. **No Integration with Fitness Apps**
   - Missing: Connect with Apple Health, Google Fit, Fitbit
   - Impact: No automatic activity tracking

4. **No Social Features**
   - Missing: Share meal plans, follow other users, community
   - Impact: No social engagement

5. **No Meal Reviews & Ratings**
   - Missing: User feedback on meals
   - Impact: No quality indicators for meals

---

## Future Scope

### Phase 1: Production-Ready Backend (Priority: HIGH)

**Timeline**: 1-2 months

1. **Database Integration**
   - **Technology**: PostgreSQL or MongoDB
   - **Tables/Collections**:
     - `users`: User accounts
     - `health_profiles`: User health data
     - `orders`: Subscription orders
     - `meals`: Meal database
     - `payments`: Transaction records
   - **Benefits**: Persistent data, multi-device access

2. **Real Authentication System**
   - **Technology**: JWT (JSON Web Tokens)
   - **Features**:
     - Password hashing with bcrypt
     - Token expiration and refresh
     - Secure password reset via email
     - Session management
   - **Security**: HTTPS, CSRF protection, rate limiting

3. **Payment Gateway Integration**
   - **For India**: Razorpay (recommended)
   - **International**: Stripe
   - **Features**:
     - UPI, cards, net banking
     - Automatic subscription billing
     - Payment webhooks
     - Invoice generation

**Estimated Effort**: 80-100 hours

### Phase 2: Enhanced User Experience (Priority: MEDIUM)

**Timeline**: 2-3 months

1. **User Dashboard**
   - Profile management
   - Order history
   - Upcoming deliveries
   - Billing information
   - Change subscription plan

2. **Meal Customization**
   - Swap meals in plan
   - Adjust portion sizes
   - Exclude specific ingredients
   - Save favorite meals
   - Rate and review meals

3. **Weekly Meal Calendar**
   - Visual calendar view
   - Drag-and-drop meal scheduling
   - Export to Google Calendar
   - Set meal reminders

4. **Email & SMS Notifications**
   - Order confirmation emails
   - Delivery status updates
   - Subscription renewal reminders
   - OTP verification for login

**Estimated Effort**: 100-120 hours

### Phase 3: Admin & Management (Priority: MEDIUM)

**Timeline**: 1-2 months

1. **Admin Panel**
   - User management (view, edit, delete users)
   - Order management (view, update status)
   - Meal database management (CRUD operations)
   - Upload meal images
   - Analytics dashboard

2. **Meal Management System**
   - Add new meals with nutritional data
   - Edit existing meals
   - Categorize by diet type, goal, cuisine
   - Seasonal meal rotation
   - Inventory tracking

3. **Analytics & Reporting**
   - User growth metrics
   - Popular meals and plans
   - Revenue tracking
   - Churn rate analysis
   - AI performance monitoring

**Estimated Effort**: 60-80 hours

### Phase 4: Mobile & Advanced Features (Priority: LOW)

**Timeline**: 3-6 months

1. **Mobile Applications**
   - **Technology**: React Native (code reuse with web app)
   - **Platforms**: iOS and Android
   - **Features**:
     - Native push notifications
     - Barcode scanning for ingredients
     - Camera integration for meal photos
     - Offline mode

2. **Fitness App Integration**
   - Connect with Apple Health
   - Sync with Google Fit
   - Import activity data from Fitbit
   - Auto-adjust meal recommendations based on workouts

3. **Social Features**
   - Share meal plans with friends
   - Community meal ideas
   - Follow other users
   - Meal plan comments and likes

4. **AI Enhancements**
   - Image generation for meals (DALL-E/Stable Diffusion)
   - Voice input for questionnaire
   - Chat-based meal planner
   - Recipe video generation

5. **Multi-Language Support**
   - Hindi, Tamil, Telugu, Marathi, Bengali
   - RTL support for Urdu
   - Localized meal names and descriptions

**Estimated Effort**: 200+ hours

### Phase 5: Scale & Optimization (Priority: LOW)

**Timeline**: Ongoing

1. **Performance Optimization**
   - Redis caching for meal recommendations
   - CDN for static assets
   - Database query optimization
   - Image compression and lazy loading

2. **Advanced AI Features**
   - Fine-tuned model for Indian cuisine
   - Meal photo recognition
   - Personalized recipe generation
   - Nutritionist chatbot

3. **Business Features**
   - Referral program
   - Discount codes and promotions
   - Corporate subscription plans
   - Affiliate program

4. **Compliance**
   - GDPR compliance (for European users)
   - HIPAA compliance (for health data)
   - Food safety certifications
   - Nutritionist verification

**Estimated Effort**: 300+ hours

---

## Testing & Verification

### Testing Scripts

**1. Verify Gemini API** (`scripts/verify-gemini-api.ts`)
- Tests API key validity
- Sends test prompt to Gemini
- Verifies JSON response parsing
- Checks recommendation structure
- **Run**: `npm run verify-api`

**2. Test Fallback Engine** (`scripts/test-fallback.ts`)
- Tests rule-based recommendation engine
- Validates filtering logic
- Checks meal recommendations for different profiles
- **Run**: `npm run test:fallback`

### Manual Testing Checklist

**Authentication Flow**:
- [ ] Login with demo credentials works
- [ ] Invalid credentials show error message
- [ ] Registration creates new user (localStorage)
- [ ] Logout clears session

**Questionnaire**:
- [ ] All 4 steps complete successfully
- [ ] Required field validation works
- [ ] "Next" and "Previous" buttons work
- [ ] Progress bar updates correctly
- [ ] Data saves to localStorage

**Recommendations**:
- [ ] AI recommendations generate (if API key configured)
- [ ] Fallback recommendations work (if API key not configured)
- [ ] 5 meals displayed with nutritional data
- [ ] BMI calculated correctly
- [ ] Health tips shown
- [ ] "View Subscription Plans" button works

**Subscriptions**:
- [ ] All 3 plans display with correct pricing
- [ ] Plan selection highlights card
- [ ] "Proceed to Payment" button appears
- [ ] Plan data saved to localStorage

**Payment**:
- [ ] Payment form loads with selected plan
- [ ] Card number formatting works (spaces added)
- [ ] Expiry date formatting works (MM/YY)
- [ ] CVV limited to 3 digits
- [ ] "Pay" button processes (2-second delay)
- [ ] Order ID generated
- [ ] Success page displays confirmation

**Theme**:
- [ ] Dark mode toggle works
- [ ] Theme persists on page refresh
- [ ] System preference detected

**Responsive Design**:
- [ ] Mobile layout (< 768px) works
- [ ] Tablet layout (768px - 1024px) works
- [ ] Desktop layout (> 1024px) works
- [ ] Mobile menu opens/closes
- [ ] All pages responsive

### Test User Profiles

**Profile 1: Weight Loss**
```
Age: 30, Gender: Female, Height: 165cm, Weight: 75kg
Activity: Light, Goal: Weight Loss
Diet: Vegetarian, Allergies: None
Budget: Budget-Friendly
Expected: Low-calorie (<400 cal) vegetarian meals
```

**Profile 2: Muscle Gain**
```
Age: 25, Gender: Male, Height: 180cm, Weight: 70kg
Activity: Very Active, Goal: Muscle Gain
Diet: Non-Vegetarian, Allergies: None
Budget: Premium
Expected: High-protein (>30g) meals with adequate calories
```

**Profile 3: Vegan**
```
Age: 28, Gender: Female, Height: 160cm, Weight: 55kg
Activity: Moderate, Goal: General Health
Diet: Vegan, Allergies: Gluten, Nuts
Budget: Moderate
Expected: Vegan meals without gluten or nuts
```

---

## Common Viva Questions & Answers

### Architecture & Technology

**Q1: Why did you choose Next.js over plain React?**

**A**: Next.js provides several advantages:
1. **Server-Side Rendering (SSR)**: Improves SEO and initial load time
2. **API Routes**: Built-in backend eliminates need for separate server
3. **File-Based Routing**: Automatic routing based on folder structure
4. **Image Optimization**: Automatic image compression and lazy loading
5. **Zero Configuration**: Works out of the box with minimal setup

For this project, the API routes feature was crucial as it allowed us to create authentication and recommendation endpoints without setting up a separate backend server.

**Q2: Explain the difference between client and server components in Next.js 15.**

**A**:
- **Server Components** (default in Next.js 15):
  - Rendered on the server
  - Can access backend resources directly
  - Reduce client-side JavaScript bundle
  - Cannot use browser APIs or React hooks like `useState`

- **Client Components** (`"use client"` directive):
  - Rendered in the browser
  - Can use React hooks and browser APIs
  - Required for interactivity (forms, buttons)

In our project:
- Pages like questionnaire, login, subscriptions are client components (need forms and state)
- API routes run entirely on server
- Layout components can be server components

**Q3: Why use TypeScript instead of JavaScript?**

**A**: TypeScript provides:
1. **Type Safety**: Catches errors during development, not runtime
2. **Better IDE Support**: Autocomplete, inline documentation
3. **Refactoring Confidence**: Type checking ensures changes don't break code
4. **Self-Documenting**: Types serve as inline documentation
5. **Scalability**: Easier to maintain as project grows

Example:
```typescript
// TypeScript catches this error immediately
interface HealthProfile {
  age: string;
  gender: string;
  // ...
}

// IDE will error if we misspell or miss a property
const profile: HealthProfile = {
  age: "28",
  gneder: "male" // ❌ Error: Property 'gender' is missing
}
```

### AI Integration

**Q4: Why Google Gemini over OpenAI GPT?**

**A**: Gemini 1.5 Flash was chosen for:
1. **Free Tier**: 1,500 requests/day free (OpenAI GPT-4 has no free tier)
2. **Speed**: Flash model is optimized for low latency (1-3 seconds)
3. **Cost**: 10x cheaper than GPT-4 after free tier
4. **JSON Mode**: Reliable structured output
5. **Context Length**: 1M tokens (far exceeds our needs)

For an MVP, the free tier is perfect. We can scale to paid tier or switch to OpenAI later if needed.

**Q5: How does the fallback system work?**

**A**: The fallback system ensures 100% uptime:

1. **Primary Path**: Try AI generation with Gemini
   ```typescript
   try {
     const result = await generateMealRecommendationsWithLLM(profile);
     return result; // ✅ Success with AI
   } catch (error) {
     // AI failed, use fallback
   }
   ```

2. **Fallback Path**: If AI fails (API key missing, rate limit, network error), automatically switch to rule-based engine
   ```typescript
   const meals = fallbackRecommendations(profile);
   return { meals, usedFallback: true };
   ```

3. **User Experience**: User sees recommendations either way, with a subtle indicator if fallback was used

**Benefits**:
- No downtime if API fails
- Deterministic results for testing
- Instant responses (no API latency)
- Cost savings for testing/development

**Q6: What prompt engineering techniques did you use?**

**A**: Several techniques:

1. **Role Assignment**: "You are a professional nutritionist..."
2. **Context Provision**: Full health profile with 12 data points
3. **Clear Constraints**: Specific rules (avoid allergies, match diet type)
4. **Output Format**: Strict JSON schema with examples
5. **Quality Guidelines**: Calorie ranges, protein targets, cultural diversity
6. **Few-Shot Learning**: Examples in prompt (implicitly through format)

Example:
```
If goal is weight-loss, keep meals under 450 calories
If goal is muscle-gain, prioritize protein (>30g per meal)
If goal is energy, ensure adequate carbs (>50g per meal)
```

This guides the AI to generate appropriate recommendations.

### Features & Functionality

**Q7: Walk through the complete data flow from questionnaire to recommendations.**

**A**:
1. **User Input**: 12 fields across 4 steps in questionnaire
2. **Client-Side Storage**: `localStorage.setItem("healthProfile", JSON.stringify(formData))`
3. **Page Navigation**: Router pushes to `/recommendations`
4. **Data Retrieval**: Recommendations page loads profile from localStorage
5. **API Call**: `POST /api/recommendations` with profile data
6. **Backend Processing**:
   - Check if Gemini API key configured
   - If yes: Call `generateMealRecommendationsWithLLM()`
   - If no: Call `generateRecommendations()` (fallback)
7. **AI Processing** (if API key present):
   - Calculate BMI
   - Construct prompt with health profile
   - Send to Gemini 1.5 Flash
   - Parse JSON response
8. **Response**: Return 5 meals + insights (BMI, tips, nutritional focus)
9. **Frontend Rendering**: Display meals in grid, show health insights

**Q8: How does BMI calculation work?**

**A**: BMI (Body Mass Index) formula:
```
BMI = weight (kg) / (height (m))²
```

Implementation:
```typescript
function calculateBMI(height: number, weight: number): number {
  const heightInMeters = height / 100; // Convert cm to meters
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}
```

Example:
- Height: 175 cm → 1.75 m
- Weight: 75 kg
- BMI = 75 / (1.75 × 1.75) = 75 / 3.06 = 24.5
- Category: "Normal weight"

This BMI is used:
1. In AI prompt for context
2. In health summary display
3. For tailored health tips

**Q9: How does the rule-based fallback engine filter meals?**

**A**: Multi-stage filtering:

1. **Dietary Preference Filter**:
   ```typescript
   if (pref === "vegan") return meal.type === "vegan";
   if (pref === "vegetarian") return ["vegetarian", "vegan"].includes(meal.type);
   ```

2. **Health Goal Filter**:
   ```typescript
   if (goal === "weight-loss") return meal.calories < 400;
   if (goal === "muscle-gain") return meal.protein > 25;
   ```

3. **Activity Level Filter**:
   ```typescript
   if (activity === "sedentary") return meal.calories < 500;
   ```

4. **Allergen Filter**:
   ```typescript
   const allergyKeywords = profile.allergies.split(",");
   return !allergyKeywords.some(allergen =>
     mealName.includes(allergen)
   );
   ```

5. **Sort by Relevance**:
   ```typescript
   meals.sort((a, b) => {
     const aScore = a.tags.includes(goal) ? 1 : 0;
     return bScore - aScore;
   });
   ```

6. **Return Top 5**: `filteredMeals.slice(0, 5)`

### Security & Authentication

**Q10: Is the current authentication system secure for production?**

**A**: **No**, the current system is NOT production-ready. Here's why:

**Current Limitations**:
1. **localStorage Storage**: Accessible via JavaScript, vulnerable to XSS
2. **No Encryption**: User data stored in plain text
3. **No Session Expiration**: User stays logged in forever
4. **Demo Credentials**: Hardcoded, anyone can access
5. **No Password Hashing**: Passwords not encrypted
6. **No HTTPS Enforcement**: Data sent in plain text
7. **No CSRF Protection**: Vulnerable to cross-site request forgery
8. **No Rate Limiting**: Vulnerable to brute force attacks

**Production Solution**:
1. **Use JWT (JSON Web Tokens)**:
   - Server signs token with secret key
   - Token includes expiration time
   - Stored in httpOnly cookie (not accessible via JavaScript)
2. **Password Hashing**: Use bcrypt to hash passwords
3. **Database Storage**: Store user data in PostgreSQL/MongoDB
4. **HTTPS**: Enforce SSL/TLS encryption
5. **CSRF Tokens**: Protect against cross-site attacks
6. **Rate Limiting**: Limit login attempts per IP
7. **Two-Factor Authentication**: Optional 2FA for extra security

**Why MVP Doesn't Have This**:
- Focus was on demonstrating AI recommendations and user flow
- Real auth requires backend database (not implemented yet)
- Sufficient for demo and testing purposes

**Q11: How would you implement real authentication?**

**A**: Production authentication flow:

1. **Registration**:
   ```typescript
   // Client: User submits name, email, password
   const hashedPassword = await bcrypt.hash(password, 10);
   await db.users.create({ email, password: hashedPassword, name });
   ```

2. **Login**:
   ```typescript
   // Server: Verify password
   const user = await db.users.findByEmail(email);
   const valid = await bcrypt.compare(password, user.password);

   if (valid) {
     // Generate JWT token
     const token = jwt.sign(
       { userId: user.id, email: user.email },
       process.env.JWT_SECRET,
       { expiresIn: '7d' }
     );

     // Set httpOnly cookie
     response.cookie('authToken', token, {
       httpOnly: true,
       secure: true, // HTTPS only
       sameSite: 'strict',
       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
     });
   }
   ```

3. **Protected Routes**:
   ```typescript
   // Middleware to verify token
   function authenticateToken(req, res, next) {
     const token = req.cookies.authToken;
     if (!token) return res.status(401).json({ error: 'Unauthorized' });

     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
       if (err) return res.status(403).json({ error: 'Invalid token' });
       req.user = user;
       next();
     });
   }
   ```

4. **Logout**:
   ```typescript
   response.clearCookie('authToken');
   ```

### Database & Scalability

**Q12: Why localStorage instead of a database?**

**A**: localStorage was chosen for the MVP because:

**Advantages** (for MVP):
1. **No Backend Setup**: No need to configure database server
2. **Fast Development**: Immediate storage without schema design
3. **Zero Cost**: No database hosting fees
4. **Offline Capability**: Works without internet connection
5. **Simple API**: `localStorage.setItem()` and `getItem()`

**Disadvantages** (why it's not production-ready):
1. **No Multi-Device Sync**: Data only on one browser
2. **Limited Storage**: Max 5-10 MB per domain
3. **No Security**: Anyone with browser access can read/modify
4. **No Relationships**: Can't join data like SQL
5. **Browser-Dependent**: Clearing cache deletes data
6. **No Server-Side Processing**: Can't run background jobs

**Production Solution**: PostgreSQL or MongoDB with proper schema design

**Q13: How would you design the database schema for production?**

**A**: Relational database design (PostgreSQL):

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Health Profiles table (one-to-one with users)
CREATE TABLE health_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  age INTEGER NOT NULL,
  gender VARCHAR(50),
  height DECIMAL(5,2) NOT NULL, -- cm
  weight DECIMAL(5,2) NOT NULL, -- kg
  activity_level VARCHAR(50),
  health_goal VARCHAR(50),
  dietary_preference VARCHAR(50),
  allergies TEXT,
  meals_per_day INTEGER,
  budget VARCHAR(50),
  cooking_preference VARCHAR(50),
  medical_conditions TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id) -- One profile per user
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) NOT NULL, -- 'weekly', 'monthly', 'quarterly'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'cancelled'
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  price DECIMAL(10,2) NOT NULL,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  subscription_id INTEGER REFERENCES subscriptions(id),
  order_id VARCHAR(50) UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'delivered', 'cancelled'
  payment_status VARCHAR(50) DEFAULT 'pending',
  delivery_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Meals table (for meal database)
CREATE TABLE meals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  calories INTEGER NOT NULL,
  protein DECIMAL(5,2) NOT NULL,
  carbs DECIMAL(5,2) NOT NULL,
  fats DECIMAL(5,2) NOT NULL,
  meal_type VARCHAR(50) NOT NULL, -- 'vegetarian', 'vegan', etc.
  tags TEXT[], -- PostgreSQL array
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Recommendations (cache AI results)
CREATE TABLE meal_recommendations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  health_profile_id INTEGER REFERENCES health_profiles(id),
  meals JSONB NOT NULL, -- Store array of meal IDs
  insights JSONB, -- Store BMI, tips, etc.
  generated_by VARCHAR(50), -- 'ai' or 'fallback'
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes for Performance**:
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_id ON orders(order_id);
```

### Mobile Responsiveness

**Q14: How did you ensure mobile responsiveness?**

**A**: Multiple techniques:

1. **Mobile-First Design**:
   ```css
   /* Base styles for mobile */
   .container { padding: 1rem; }

   /* Tablet and up */
   @media (min-width: 768px) {
     .container { padding: 2rem; }
   }
   ```

2. **Tailwind Responsive Utilities**:
   ```jsx
   <h1 className="text-2xl md:text-4xl lg:text-5xl">
     {/* 2xl on mobile, 4xl on tablet, 5xl on desktop */}
   </h1>
   ```

3. **Responsive Grid Layouts**:
   ```jsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
     {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
   </div>
   ```

4. **Mobile Menu**:
   - Hamburger icon visible on mobile
   - Full navigation visible on desktop
   - `md:hidden` and `hidden md:flex` utilities

5. **Touch-Friendly Targets**:
   - Buttons minimum 44x44px (Apple guidelines)
   - Adequate spacing between clickable elements
   - Large tap areas

6. **Viewport Meta Tag**:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

7. **Testing**:
   - Chrome DevTools device emulation
   - Tested on iPhone, Android, iPad
   - Various screen sizes (320px to 1920px)

### Performance & Optimization

**Q15: What performance optimizations did you implement?**

**A**:

1. **Next.js Automatic Optimizations**:
   - Automatic code splitting per page
   - Image optimization with next/image
   - Font optimization with next/font
   - Static page generation where possible

2. **Client-Side Caching**:
   - localStorage caches user data, profile, recommendations
   - Avoids re-fetching on page refresh

3. **CSS Optimization**:
   - Tailwind purges unused CSS in production
   - ~3 KB CSS bundle after optimization

4. **Lazy Loading**:
   - Dynamic imports for heavy components
   - Images load as user scrolls

5. **API Response Time**:
   - Gemini Flash: 1-3 seconds
   - Fallback engine: < 50ms

6. **Bundle Size**:
   - Total JavaScript: ~102 KB
   - Shared across pages for caching

**Q16: How would you scale this application to handle 10,000 users?**

**A**:

**Current Bottlenecks**:
1. localStorage can't sync across devices
2. No server-side caching
3. AI API rate limits (1,500/day free tier)

**Scaling Strategy**:

**1. Database** (most critical):
- Use PostgreSQL with connection pooling
- Index frequently queried fields (user ID, email)
- Implement read replicas for high traffic

**2. Caching Layer**:
- Redis for session storage
- Cache AI-generated recommendations (TTL: 24 hours)
- Cache meal database queries

**3. AI Optimization**:
- Upgrade to Gemini paid tier ($0.0002/request)
- Cache recommendations per health profile combination
- Batch API requests during off-peak hours

**4. CDN** (Content Delivery Network):
- Cloudflare or AWS CloudFront
- Cache static assets (images, CSS, JS)
- Reduce server load

**5. Load Balancing**:
- Multiple server instances
- Distribute traffic evenly
- Auto-scaling based on demand

**6. Async Processing**:
- Queue system (BullMQ, Redis Queue)
- Background jobs for email sending
- Async AI generation for non-critical requests

**Cost Estimate** (10,000 active users):
- Database: $20/month (Supabase/Railway)
- Redis: $10/month
- AI API: $20/month (assuming 50% cache hit rate)
- Hosting: $20/month (Vercel Pro)
- **Total**: ~$70/month

### Project Management

**Q17: How long did it take to build this project?**

**A**: Estimated timeline:

- **Week 1-2**: Planning, tech stack selection, initial setup
  - Next.js project setup
  - Tailwind configuration
  - Page routing structure

- **Week 3-4**: Core features
  - Landing page
  - Authentication pages
  - Questionnaire with 4 steps

- **Week 5-6**: AI Integration
  - Google Gemini API integration
  - Prompt engineering
  - Fallback recommendation engine

- **Week 7**: Subscriptions & Payment
  - Pricing page
  - Payment form
  - Success page

- **Week 8**: Polish & Testing
  - Dark mode implementation
  - Mobile responsiveness
  - Bug fixes
  - Documentation

**Total**: ~8 weeks part-time or ~2-3 weeks full-time

**Q18: What were the biggest challenges?**

**A**:

1. **AI Prompt Engineering**:
   - **Challenge**: Getting consistent JSON output from Gemini
   - **Solution**: Strict schema definition, response parsing with error handling

2. **Mobile Responsiveness**:
   - **Challenge**: Payment page layout breaking on small screens
   - **Solution**: Tailwind responsive utilities, extensive testing on real devices

3. **Theme Flash on Page Load**:
   - **Challenge**: Brief flash of wrong theme before JavaScript loads
   - **Solution**: `suppressHydrationWarning` and `disableTransitionOnChange` props

4. **State Management**:
   - **Challenge**: Syncing localStorage with React state
   - **Solution**: useEffect hooks to load data on mount, careful state updates

5. **Type Safety**:
   - **Challenge**: Ensuring TypeScript types match actual data
   - **Solution**: Shared interfaces between frontend and backend

---

## Conclusion

HealthyBite is a **production-ready MVP** that demonstrates:

1. **Full-Stack Development**: Frontend (React/Next.js), Backend (API routes), AI Integration (Gemini)
2. **Modern UI/UX**: Responsive design, dark mode, smooth animations
3. **AI Integration**: Real-world LLM usage with fallback strategy
4. **Comprehensive Features**: Complete user journey from registration to payment
5. **Scalability**: Clear path to production with identified improvements

**Key Achievements**:
- 100% feature completion for MVP scope
- Robust error handling and fallback mechanisms
- Mobile-first responsive design
- Type-safe implementation with TypeScript
- Clear documentation for handoff

**Production Readiness**: ~60%
- ✅ Core features implemented
- ✅ AI integration working
- ✅ User flow complete
- ⚠️ Authentication needs upgrade
- ⚠️ Database required for production
- ⚠️ Payment gateway integration needed

This project demonstrates strong full-stack development skills, AI integration capabilities, and understanding of modern web development best practices. It serves as a solid foundation for a real-world SaaS product in the health and nutrition space.

---

**Last Updated**: January 2025
**Version**: 1.0
**Maintained By**: Karthik

---
