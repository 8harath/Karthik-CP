# HealthyBite - Complete Team Guide

> **Your one-stop reference for understanding, running, and deploying HealthyBite**

---

## Table of Contents

1. [What is HealthyBite?](#what-is-healthybite)
2. [Quick Start (5 Minutes)](#quick-start-5-minutes)
3. [Understanding the Project](#understanding-the-project)
4. [Technology Stack Explained](#technology-stack-explained)
5. [Project Architecture](#project-architecture)
6. [Running the Demo Locally](#running-the-demo-locally)
7. [Complete User Flow Walkthrough](#complete-user-flow-walkthrough)
8. [How the AI Works](#how-the-ai-works)
9. [API Endpoints Reference](#api-endpoints-reference)
10. [Deployment Guide](#deployment-guide)
11. [Common Issues & Solutions](#common-issues--solutions)
12. [Development Guidelines](#development-guidelines)
13. [FAQ](#faq)

---

## What is HealthyBite?

### The Problem We're Solving

Most people struggle with:
- Generic diet plans that don't consider individual health needs
- Time-consuming meal planning
- Not accounting for allergies, dietary restrictions, or health goals
- Finding convenient, healthy meal delivery services

### Our Solution

**HealthyBite** is an AI-powered web application that provides:

1. **Personalized Meal Recommendations** - Based on 12 comprehensive health inputs
2. **AI-Driven Insights** - Using Google Gemini 1.5 Flash to analyze your health profile
3. **Subscription Meal Delivery** - Three flexible plans (Weekly, Monthly, Quarterly)
4. **Nutritional Intelligence** - BMI calculations, health tips, and macro-nutrient strategies

### Key Features at a Glance

- **12-Input Health Questionnaire**: Age, gender, height, weight, activity level, health goals, dietary preferences, allergies, budget, cooking preferences, meals per day, medical conditions
- **AI-Powered Engine**: Generates 5 personalized meals with full nutritional breakdowns
- **Smart Fallback**: If AI is unavailable, switches to rule-based recommendation engine
- **Dark/Light Mode**: Full theme support with system preference detection
- **Mobile-First Design**: Responsive UI that works on all devices
- **Mock Payment System**: Complete e-commerce flow for demonstration

---

## Quick Start (5 Minutes)

### Prerequisites

- **Node.js 18+** (Check: `node --version`)
- **npm** or **yarn** package manager
- **Git** (for cloning the repository)
- **Google Account** (for free Gemini API key)

### Installation Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd karthik-cp

# 2. Install dependencies (takes ~2 minutes)
npm install

# 3. Set up environment variables
cp .env.local.example .env.local

# 4. Get your FREE Gemini API key
# Visit: https://aistudio.google.com/app/apikey
# Sign in, click "Create API Key", copy it

# 5. Open .env.local and add your API key
# GEMINI_API_KEY=paste-your-key-here

# 6. Start the development server
npm run dev

# 7. Open your browser
# Navigate to: http://localhost:3000
```

**Demo Credentials:**
- Email: `demo@healthybite.com`
- Password: `demo123`

You're ready to go! Proceed to the [Demo Walkthrough](#running-the-demo-locally) section.

---

## Understanding the Project

### High-Level Concept

Think of HealthyBite as having three main layers:

```
┌─────────────────────────────────────┐
│   USER INTERFACE (React/Next.js)   │
│  Landing, Login, Questionnaire,     │
│  Recommendations, Subscriptions     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   BUSINESS LOGIC (API Routes)      │
│  Authentication, Profile Storage,   │
│  AI Recommendation Engine           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   EXTERNAL SERVICES & STORAGE       │
│  Google Gemini AI, localStorage     │
│  (In production: Database, Payment) │
└─────────────────────────────────────┘
```

### What Makes This an MVP?

This is a **Minimum Viable Product** designed to demonstrate functionality:

**What's Real:**
- ✅ Full UI/UX with professional design
- ✅ Complete user flow from registration to checkout
- ✅ Real AI integration (Google Gemini 1.5 Flash)
- ✅ Intelligent recommendation engine with fallback
- ✅ Responsive design for all devices

**What's Mocked (For Demo):**
- ⚠️ Authentication (demo credentials, localStorage-based)
- ⚠️ Database (uses browser localStorage)
- ⚠️ Payment processing (no real transactions)
- ⚠️ Email notifications (not implemented)

**Production-Ready Enhancements Needed:**
- Real database (PostgreSQL, MongoDB, or Firebase)
- JWT-based authentication with secure sessions
- Payment gateway integration (Stripe, Razorpay)
- Email service (SendGrid, AWS SES)
- User dashboard with order history

---

## Technology Stack Explained

### Frontend Technologies

| Technology | Version | Why We Use It |
|------------|---------|---------------|
| **Next.js** | 15.0.0 | Full-stack React framework with built-in routing, API routes, and excellent performance. App Router provides modern server/client component architecture. |
| **React** | 18.3.1 | Industry-standard UI library for building interactive components with hooks and state management. |
| **TypeScript** | 5.x | Adds static typing to JavaScript, catching errors at compile-time and improving code reliability. |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework that speeds up development with pre-built classes and responsive design. |
| **next-themes** | 0.4.4 | Handles dark/light mode theming with system preference detection and seamless switching. |

### Backend & AI

| Technology | Version | Why We Use It |
|------------|---------|---------------|
| **Next.js API Routes** | 15.0.0 | Built-in serverless backend functions - no separate backend server needed. |
| **Google Gemini 1.5 Flash** | via @google/generative-ai 0.24.1 | Free AI model (1,500 requests/day) that generates personalized meal recommendations based on user health profiles. |
| **Node.js** | 20+ | JavaScript runtime for executing server-side code. |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code quality and style enforcement |
| **tsx** | TypeScript script execution for testing |
| **dotenv** | Environment variable management |
| **PostCSS** | CSS processing and optimization |

### Why These Choices?

1. **Next.js**: One framework for both frontend and backend, excellent performance, easy deployment to Vercel
2. **TypeScript**: Prevents bugs, improves developer experience with autocomplete
3. **Tailwind**: Rapid UI development without writing custom CSS
4. **Gemini API**: Free tier is generous (1,500 requests/day), fast responses, excellent quality

---

## Project Architecture

### Directory Structure

```
healthybite/
│
├── app/                          # Next.js App Router (Pages & API)
│   │
│   ├── api/                      # Backend API Routes
│   │   ├── auth/
│   │   │   ├── login/route.ts           # POST: User login
│   │   │   └── register/route.ts        # POST: User registration
│   │   ├── profile/route.ts             # POST/GET: Save/retrieve health profile
│   │   ├── recommendations/route.ts     # POST: Generate meal recommendations
│   │   └── subscription/route.ts        # POST: Create subscription
│   │
│   ├── forgot-password/page.tsx         # Password recovery page
│   ├── login/page.tsx                   # Login page
│   ├── payment/
│   │   └── success/page.tsx             # Payment confirmation page
│   ├── questionnaire/page.tsx           # 4-step health questionnaire
│   ├── recommendations/page.tsx         # Display AI-generated meals
│   ├── register/page.tsx                # User registration
│   ├── subscriptions/page.tsx           # Subscription plans
│   │
│   ├── layout.tsx                       # Root layout (header, footer, theme)
│   ├── page.tsx                         # Landing page (home)
│   └── globals.css                      # Global styles
│
├── components/                   # Reusable React Components
│   ├── Header.tsx                       # Navigation header with mobile menu
│   ├── Footer.tsx                       # Footer component
│   ├── ThemeProvider.tsx                # Dark/light theme wrapper
│   └── ThemeToggle.tsx                  # Theme switcher button
│
├── lib/                          # Utility Libraries & Business Logic
│   ├── llmService.ts                    # Google Gemini AI integration
│   │                                    # - generateMealRecommendationsWithLLM()
│   │                                    # - calculateBMI()
│   │                                    # - getBMICategory()
│   │
│   ├── recommendationEngine.ts          # Rule-based fallback engine
│   │                                    # - generateRecommendations()
│   │                                    # - 12 pre-configured meals
│   │
│   └── currency.ts                      # Currency formatting (INR/USD)
│
├── public/                       # Static Assets (images, icons)
│
├── scripts/                      # Testing scripts
│   ├── verify-gemini-api.ts             # Test Gemini API connectivity
│   └── test-fallback.ts                 # Test fallback engine
│
├── .env.local.example           # Environment variables template
├── .env.local                   # Your actual environment variables (gitignored)
│
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS customization
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies & scripts
│
└── Documentation Files
    ├── README.md                        # Project overview
    ├── SETUP.md                         # Setup instructions
    ├── CAPSTONE.md                      # Detailed capstone documentation
    ├── PRESENTATION.md                  # Presentation slides
    └── TEAM_GUIDE.md                    # This file!
```

### Key Files Explained

**Critical Files You'll Interact With:**

1. **`app/questionnaire/page.tsx`** (300+ lines)
   - 4-step health profile form
   - Validates user input
   - Stores data in localStorage
   - Redirects to recommendations page

2. **`lib/llmService.ts`** (250 lines)
   - Main AI integration logic
   - Sends user profile to Gemini
   - Parses AI response
   - Falls back to rule-based engine on error

3. **`lib/recommendationEngine.ts`** (269 lines)
   - Fallback recommendation logic
   - Database of 12 meals
   - Filters by dietary preference, goal, activity, allergies
   - Returns top 5 matches

4. **`app/api/recommendations/route.ts`** (48 lines)
   - API endpoint that connects frontend to AI
   - Receives health profile
   - Returns recommendations + insights

5. **`app/recommendations/page.tsx`** (200+ lines)
   - Displays AI-generated meal cards
   - Shows nutritional information
   - Presents health tips and BMI

### Data Flow

```
USER FILLS QUESTIONNAIRE
        ↓
Data stored in localStorage
        ↓
User clicks "Get Recommendations"
        ↓
Frontend sends POST to /api/recommendations
        ↓
API checks if GEMINI_API_KEY exists
        ↓
    ┌───┴───┐
    ↓       ↓
  YES      NO
    ↓       ↓
Call AI   Use fallback
    ↓       ↓
    └───┬───┘
        ↓
Return 5 meals + insights
        ↓
Display on recommendations page
```

---

## Running the Demo Locally

### Step-by-Step Demo Guide

#### 1. Start the Application

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

#### 2. Navigate to the Landing Page

Open **http://localhost:3000** in your browser.

**What You'll See:**
- Hero section with "Get Started" button
- Features overview
- Subscription plans preview
- Dark/light mode toggle in header

#### 3. Login with Demo Credentials

Click **"Sign In"** in the header.

**Enter:**
- Email: `demo@healthybite.com`
- Password: `demo123`

Click **"Sign In"** button.

**What Happens:**
- Frontend sends POST to `/api/auth/login`
- API validates credentials against `DEMO_EMAIL` and `DEMO_PASSWORD` in `.env.local`
- On success, user object stored in `localStorage`
- Redirects to `/questionnaire`

#### 4. Complete the Health Questionnaire

You'll go through **4 steps**:

**Step 1: Basic Information**
- Age: 30 (example)
- Gender: Male
- Height: 175 cm
- Weight: 70 kg

Click **"Next"**

**Step 2: Lifestyle**
- Activity Level: Moderate
- Health Goal: Muscle Gain
- Meals Per Day: 3

Click **"Next"**

**Step 3: Dietary Preferences**
- Dietary Type: Non-Vegetarian

Click **"Next"**

**Step 4: Restrictions & Preferences**
- Allergies: (leave blank or enter "None")
- Budget: Moderate
- Cooking Preference: Both
- Medical Conditions: (leave blank or enter "None")

Click **"Submit"**

**What Happens:**
- All data saved to `localStorage.healthProfile`
- Frontend sends POST to `/api/recommendations` with health profile
- API calls Gemini AI (or fallback)
- Returns 5 personalized meals

#### 5. View AI-Generated Recommendations

**What You'll See:**

1. **Health Overview Card**
   - Your BMI: 22.9 (Normal weight)
   - Health tips (3-5 personalized tips)

2. **Meal Recommendations (5 Cards)**

   Each card shows:
   - Meal name (e.g., "Grilled Chicken Breast with Quinoa")
   - Description
   - Calories (e.g., 450 kcal)
   - Macros: Protein (30g), Carbs (40g), Fats (10g)

3. **Insights Section**
   - "Why These Meals?" - AI explanation
   - "Nutritional Strategy" - e.g., "High protein, moderate carbs"

4. **Action Button**
   - "View Subscription Plans" - Proceed to next step

#### 6. Explore Subscription Plans

Click **"View Subscription Plans"**

**What You'll See:**

Three pricing cards:

1. **Weekly Plan**: ₹4,100/week (7 meals)
2. **Monthly Plan**: ₹14,900/month (28 meals) - **Popular**
3. **Quarterly Plan**: ₹41,500/quarter (84 meals) - **Best Value**

Click **"Subscribe Now"** on any plan.

#### 7. Complete Mock Payment

**What You'll See:**
- Payment form (name, card number, expiry, CVV)
- Order summary with selected plan

Click **"Complete Payment"**

**What Happens:**
- Frontend sends POST to `/api/subscription`
- API creates mock subscription object
- Redirects to `/payment/success`

#### 8. View Success Page

**What You'll See:**
- Confirmation message
- Order details
- Subscription plan summary
- "Return to Home" button

---

## How the AI Works

### The AI Recommendation Engine

#### Architecture

```
User Health Profile
        ↓
lib/llmService.ts
        ↓
generateMealRecommendationsWithLLM()
        ↓
    Calculate BMI
        ↓
    Build detailed prompt
        ↓
    Send to Google Gemini 1.5 Flash
        ↓
    Parse JSON response
        ↓
    Return meals + insights
        ↓
    (On error: fall back to rule-based engine)
```

#### What the AI Receives (Example Prompt)

```javascript
You are a professional nutritionist. Generate 5 personalized meal recommendations.

User Profile:
- Age: 30, Gender: Male
- Height: 175cm, Weight: 70kg
- BMI: 22.9 (Normal weight)
- Activity: Moderate
- Goal: Muscle Gain
- Diet: Non-Vegetarian
- Allergies: None
- Budget: Moderate

Requirements:
- Each meal must include: name, description, calories, protein, carbs, fats
- Provide 3-5 health tips
- Explain why these meals were chosen
- Define nutritional strategy

Return JSON format.
```

#### What the AI Returns

```json
{
  "recommendations": [
    {
      "name": "Grilled Chicken Breast with Quinoa",
      "description": "Lean protein with complex carbs for muscle recovery",
      "calories": 450,
      "protein": 35,
      "carbs": 40,
      "fats": 10
    },
    // ... 4 more meals
  ],
  "insights": {
    "bmi": 22.9,
    "bmiCategory": "Normal weight",
    "healthTips": [
      "Consume 1.6-2.2g protein per kg body weight for muscle gain",
      "Stay hydrated with 3-4 liters of water daily",
      "Include compound exercises 4-5 times per week"
    ],
    "whyTheseMeals": "High-protein meals to support muscle synthesis...",
    "nutritionalFocus": "High protein (30-40g per meal), moderate carbs"
  }
}
```

#### Fallback System

If the AI is unavailable (no API key, rate limit, error), the app automatically uses the **rule-based engine**:

**How It Works:**

1. **Filter by Dietary Preference**
   - Vegan → Only plant-based meals
   - Vegetarian → Exclude meat/fish
   - Pescatarian → Exclude meat, include fish
   - Non-Vegetarian → All meals

2. **Filter by Health Goal**
   - Weight Loss → Low-calorie meals (<400 kcal)
   - Muscle Gain → High-protein meals (>25g)
   - Energy → Moderate calories, balanced macros
   - General Health → Balanced nutrition

3. **Filter by Activity Level**
   - Sedentary → Lower calories
   - Very Active → Higher calories

4. **Remove Allergens**
   - Checks meal ingredients against user's allergies

5. **Return Top 5**
   - Sorted by relevance to health goal

**Pre-Configured Meal Database (12 Meals):**
- Grilled Chicken Breast with Quinoa
- Paneer Tikka with Brown Rice
- Tofu Stir-Fry with Vegetables
- Grilled Salmon with Steamed Broccoli
- Greek Salad with Chickpeas
- Zucchini Noodles with Marinara
- Chicken Burrito Bowl
- Vegetable Khichdi
- Beef Steak with Sweet Potato
- Peanut Butter Protein Smoothie Bowl
- Oatmeal with Berries and Almonds
- Whole Grain Pasta with Vegetables

### Testing the AI

**Test if Gemini API is working:**

```bash
npm run test:gemini
```

**Test the fallback engine:**

```bash
npm run test:fallback
```

### API Usage & Limits

**Gemini 1.5 Flash Free Tier:**
- **Daily Limit**: 1,500 requests
- **Rate Limit**: 15 requests per minute
- **Cost**: FREE (no credit card required)

**What happens when you exceed limits:**
- App automatically falls back to rule-based engine
- User still gets recommendations (just not AI-generated)
- No errors or service disruption

**If you need more:**
- Upgrade to paid tier: $0.075 per 1M input tokens
- Estimated: ~5,000+ recommendations per $1

---

## API Endpoints Reference

### Authentication Endpoints

#### POST `/api/auth/login`

**Purpose:** Authenticate user with demo credentials

**Request:**
```json
{
  "email": "demo@healthybite.com",
  "password": "demo123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "demo-user-123",
    "email": "demo@healthybite.com",
    "name": "Demo User"
  },
  "message": "Login successful"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**How It Works:**
1. Compares email/password with `DEMO_EMAIL`/`DEMO_PASSWORD` from `.env.local`
2. If match, returns user object
3. Frontend stores user in `localStorage`

---

#### POST `/api/auth/register`

**Purpose:** Register new user (stored in localStorage)

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- Email must be valid format
- Password must be at least 6 characters

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user-abc123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Registration successful"
}
```

---

### Profile Endpoints

#### POST `/api/profile`

**Purpose:** Save user's health profile

**Request:**
```json
{
  "age": "30",
  "gender": "male",
  "height": "175",
  "weight": "70",
  "activityLevel": "moderate",
  "healthGoal": "muscle-gain",
  "mealsPerDay": "3",
  "dietaryType": "non-vegetarian",
  "allergies": "",
  "budget": "moderate",
  "cookingPreference": "both",
  "medicalConditions": ""
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile saved successfully",
  "profile": { /* saved profile */ }
}
```

---

#### GET `/api/profile`

**Purpose:** Retrieve saved health profile

**Success Response (200):**
```json
{
  "success": true,
  "profile": { /* user's profile */ }
}
```

---

### Recommendations Endpoint

#### POST `/api/recommendations`

**Purpose:** Generate personalized meal recommendations

**Request:** (Same as health profile)

**Success Response (200) - AI Mode:**
```json
{
  "success": true,
  "recommendations": [
    {
      "name": "Grilled Chicken Breast with Quinoa",
      "description": "Lean protein with complex carbs",
      "calories": 450,
      "protein": 35,
      "carbs": 40,
      "fats": 10
    }
    // ... 4 more meals
  ],
  "insights": {
    "bmi": 22.9,
    "bmiCategory": "Normal weight",
    "healthTips": [
      "Tip 1",
      "Tip 2",
      "Tip 3"
    ],
    "whyTheseMeals": "Explanation...",
    "nutritionalFocus": "High protein, moderate carbs"
  },
  "usedFallback": false
}
```

**Success Response (200) - Fallback Mode:**
```json
{
  "success": true,
  "recommendations": [ /* 5 meals */ ],
  "insights": { /* basic insights */ },
  "usedFallback": true,
  "message": "Using rule-based recommendations (AI not configured)"
}
```

**How It Works:**
1. Check if `GEMINI_API_KEY` is set
2. If yes: Call `generateMealRecommendationsWithLLM()`
3. If no or error: Call `generateRecommendations()` (fallback)
4. Return recommendations + insights

---

### Subscription Endpoint

#### POST `/api/subscription`

**Purpose:** Create mock subscription

**Request:**
```json
{
  "planId": "monthly",
  "userId": "user-123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "subscription": {
    "id": "sub-abc123",
    "planId": "monthly",
    "userId": "user-123",
    "createdAt": "2025-01-15T10:30:00.000Z"
  },
  "message": "Subscription created successfully"
}
```

---

## Deployment Guide

### Deploying to Vercel (Recommended)

**Why Vercel?**
- Built by the creators of Next.js
- Automatic deployments from Git
- Free tier for personal projects
- Built-in HTTPS and CDN
- Zero configuration needed

#### Step-by-Step Deployment

**1. Prepare Your Code**

```bash
# Ensure your code is committed to Git
git add .
git commit -m "Ready for deployment"

# Push to GitHub
git push origin main
```

**2. Create Vercel Account**

1. Visit [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

**3. Import Project**

1. Click **"New Project"**
2. Select your repository (e.g., `karthik-cp`)
3. Vercel auto-detects Next.js configuration
4. Click **"Deploy"**

**4. Add Environment Variables**

Before deploying, add your environment variables:

1. Go to **Project Settings** → **Environment Variables**
2. Add the following:

| Key | Value | Environment |
|-----|-------|-------------|
| `GEMINI_API_KEY` | your-gemini-api-key | Production |
| `DEMO_EMAIL` | demo@healthybite.com | Production |
| `DEMO_PASSWORD` | demo123 | Production |

3. Click **"Save"**
4. Trigger a new deployment (or redeploy)

**5. Access Your Live Site**

Your app will be live at:
```
https://your-project-name.vercel.app
```

**6. Custom Domain (Optional)**

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

---

### Deploying to Other Platforms

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

**Environment Variables:**
- Set in **Site Settings** → **Build & Deploy** → **Environment**

---

#### AWS Amplify

1. Connect your Git repository
2. Amplify auto-detects Next.js
3. Add environment variables in **App Settings**
4. Deploy

---

#### Self-Hosted Server

**Requirements:**
- Linux server with Node.js 20+
- PM2 or systemd for process management

```bash
# On your server
git clone <repository-url>
cd karthik-cp

# Install dependencies
npm install

# Create .env.local
nano .env.local
# Add GEMINI_API_KEY and other variables

# Build for production
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "healthybite" -- start

# Make it start on boot
pm2 startup
pm2 save
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All environment variables are set
- [ ] `.env.local` is in `.gitignore` (NEVER commit it)
- [ ] Build completes without errors (`npm run build`)
- [ ] No console errors in production build
- [ ] Demo credentials work
- [ ] AI recommendations work
- [ ] Fallback works if AI key is removed
- [ ] Mobile responsive design tested
- [ ] Dark/light mode works
- [ ] All links functional

**Test Production Build Locally:**

```bash
npm run build
npm start
# Visit http://localhost:3000
```

---

## Common Issues & Solutions

### Issue 1: AI Recommendations Not Working

**Symptom:**
- Message: "Using rule-based recommendations (AI not configured)"
- Fallback meals displayed instead of AI-generated ones

**Causes & Solutions:**

1. **Missing API Key**
   ```bash
   # Check .env.local
   cat .env.local
   # Should contain: GEMINI_API_KEY=AIza...

   # If missing, add it
   echo "GEMINI_API_KEY=your-key-here" >> .env.local
   ```

2. **Invalid API Key**
   - Test your key at [Google AI Studio](https://aistudio.google.com)
   - Generate a new key if needed

3. **Server Not Restarted**
   ```bash
   # Kill the dev server (Ctrl+C)
   # Restart
   npm run dev
   ```

4. **API Rate Limit Exceeded**
   - Free tier: 15 requests/minute
   - Wait 1 minute and try again
   - Or upgrade to paid tier

**Verify AI is Working:**
```bash
npm run test:gemini
```

---

### Issue 2: Login Not Working

**Symptom:**
- "Invalid email or password" error

**Solutions:**

1. **Check Demo Credentials**
   - Email: `demo@healthybite.com` (exact)
   - Password: `demo123` (exact)
   - Case-sensitive!

2. **Verify Environment Variables**
   ```bash
   cat .env.local
   # Should show:
   # DEMO_EMAIL=demo@healthybite.com
   # DEMO_PASSWORD=demo123
   ```

3. **Clear Browser Cache**
   ```
   Chrome: F12 → Application → Clear Storage
   ```

4. **Try Registration Instead**
   - Click "Sign Up"
   - Create new account
   - Data stored in localStorage

---

### Issue 3: Build Errors

**Symptom:**
```
Error: Cannot find module...
Type error: ...
```

**Solutions:**

1. **Clear Cache & Reinstall**
   ```bash
   # Remove cache and dependencies
   rm -rf .next node_modules

   # Reinstall
   npm install

   # Rebuild
   npm run build
   ```

2. **Check Node Version**
   ```bash
   node --version
   # Should be 18+ or 20+

   # Upgrade if needed
   nvm install 20
   nvm use 20
   ```

3. **Check for TypeScript Errors**
   ```bash
   npx tsc --noEmit
   ```

---

### Issue 4: Page Not Found (404)

**Symptom:**
- Clicking links shows 404 error

**Solutions:**

1. **Check URL**
   - Correct: `http://localhost:3000/questionnaire`
   - Wrong: `http://localhost:3000/Questionnaire` (capital Q)

2. **Verify File Exists**
   ```bash
   # Check if page exists
   ls app/questionnaire/page.tsx
   ```

3. **Restart Development Server**
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

---

### Issue 5: Dark Mode Not Working

**Symptom:**
- Theme toggle doesn't change appearance
- Stuck in light/dark mode

**Solutions:**

1. **Check ThemeProvider**
   - Open browser console (F12)
   - Look for errors related to `next-themes`

2. **Clear localStorage**
   ```javascript
   // In browser console
   localStorage.clear()
   location.reload()
   ```

3. **Check Tailwind Config**
   - `tailwind.config.ts` should have `darkMode: 'class'`

---

### Issue 6: Data Lost After Refresh

**Symptom:**
- Need to re-login after refreshing
- Health profile lost

**Explanation:**
- This is **expected behavior** for the MVP
- Data stored in browser `localStorage`
- Cleared when:
  - Browser cache cleared
  - Incognito mode
  - Different browser

**Solutions (For Production):**
- Implement real database
- Use JWT tokens for authentication
- Store user data server-side

---

## Development Guidelines

### Code Style

**TypeScript Best Practices:**

```typescript
// Use interfaces for objects
interface HealthProfile {
  age: string;
  gender: string;
  // ...
}

// Type function parameters
function calculateBMI(height: number, weight: number): number {
  return weight / (height / 100) ** 2;
}

// Use const for immutable values
const BMI_CATEGORIES = {
  UNDERWEIGHT: 'Underweight',
  NORMAL: 'Normal weight',
  // ...
};
```

**React Best Practices:**

```typescript
// Use functional components with hooks
export default function Page() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    // Side effects here
  }, []);

  return <div>...</div>;
}

// Extract reusable components
function MealCard({ meal }: { meal: Meal }) {
  return <div>...</div>;
}
```

**Tailwind Best Practices:**

```tsx
// Use semantic grouping
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Hover states
<button className="bg-green-600 hover:bg-green-700 transition-colors">
```

---

### File Organization

**When to create a new file:**

- **New page**: Add to `app/` directory
  - Example: `app/dashboard/page.tsx`

- **New component**: Add to `components/` directory
  - Example: `components/MealCard.tsx`

- **New utility**: Add to `lib/` directory
  - Example: `lib/dateUtils.ts`

- **New API**: Add to `app/api/` directory
  - Example: `app/api/orders/route.ts`

**Naming conventions:**

- Components: PascalCase (e.g., `MealCard.tsx`)
- Utilities: camelCase (e.g., `calculateBMI.ts`)
- API routes: always `route.ts`
- Pages: always `page.tsx`

---

### Git Workflow

**Branch naming:**

```bash
# Feature branches
git checkout -b feature/user-dashboard

# Bug fixes
git checkout -b fix/login-validation

# Documentation
git checkout -b docs/update-readme
```

**Commit messages:**

```bash
# Good
git commit -m "Add BMI calculation to recommendations"
git commit -m "Fix: Login form validation"
git commit -m "Docs: Update setup guide"

# Bad
git commit -m "changes"
git commit -m "fix bug"
```

---

### Testing

**Manual Testing Checklist:**

Before committing code, test:

- [ ] Login flow works
- [ ] Registration works
- [ ] Questionnaire saves data
- [ ] Recommendations display correctly
- [ ] Subscription plans load
- [ ] Payment flow completes
- [ ] Dark mode toggle works
- [ ] Mobile responsive on all pages
- [ ] No console errors

**API Testing:**

```bash
# Test Gemini API
npm run test:gemini

# Test fallback engine
npm run test:fallback

# Test build
npm run build
```

---

## FAQ

### General Questions

**Q: Is this production-ready?**

A: It's an MVP (Minimum Viable Product). It's ready for:
- Demos and presentations
- User testing and feedback
- Proof of concept

Not ready for:
- Real users (needs database, real auth, payment gateway)
- Production traffic (uses localStorage)

---

**Q: How much does it cost to run?**

A: For MVP:
- Development: **FREE** (uses Gemini free tier)
- Hosting on Vercel: **FREE** (hobby tier)
- Total: **$0/month**

For production:
- Database: $5-20/month (Supabase, MongoDB Atlas, etc.)
- Hosting: $0-20/month (Vercel Pro if needed)
- AI: ~$0.01 per recommendation if you exceed free tier

---

**Q: Can I use a different AI model?**

A: Yes! Modify `lib/llmService.ts`:
- OpenAI GPT: Use `openai` npm package
- Anthropic Claude: Use `@anthropic-ai/sdk`
- Local LLM: Use Ollama or similar

---

**Q: Why localStorage instead of a database?**

A: This is an MVP focused on demonstrating functionality quickly:
- No server setup required
- No database costs
- Easier for teammates to run locally
- Perfect for demos

For production, migrate to PostgreSQL, MongoDB, or Firebase.

---

### Technical Questions

**Q: How do I add a new page?**

```bash
# Create new page file
mkdir -p app/dashboard
touch app/dashboard/page.tsx

# Add content
echo 'export default function Dashboard() {
  return <div>Dashboard</div>
}' > app/dashboard/page.tsx

# Access at http://localhost:3000/dashboard
```

---

**Q: How do I add a new API endpoint?**

```bash
# Create endpoint
mkdir -p app/api/orders
touch app/api/orders/route.ts

# Add handler
echo 'import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ orders: [] })
}' > app/api/orders/route.ts

# Access at http://localhost:3000/api/orders
```

---

**Q: How do I customize the color scheme?**

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#e6f7f0',   // Lightest
        100: '#b3e7d6',
        // ... customize colors
        900: '#003d1f',  // Darkest
      }
    }
  }
}
```

---

**Q: How do I add more meals to the database?**

Edit `lib/recommendationEngine.ts`:

```typescript
const meals: Meal[] = [
  // Existing meals...

  // Add new meal
  {
    name: "Your New Meal",
    description: "Description here",
    calories: 400,
    protein: 25,
    carbs: 30,
    fats: 15,
    dietaryType: ["vegetarian"], // or "vegan", "pescatarian", "non-vegetarian"
    healthGoal: ["general-health"], // or "weight-loss", "muscle-gain", "energy"
    allergies: [] // e.g., ["nuts", "dairy"]
  }
];
```

---

**Q: Can I remove the demo credentials?**

Yes, for production:

1. Remove demo login logic from `app/api/auth/login/route.ts`
2. Implement real authentication (JWT, NextAuth.js, etc.)
3. Connect to a database for user storage

---

**Q: How do I change from INR to USD pricing?**

Edit `app/subscriptions/page.tsx`:

```typescript
// Change prices
const plans = [
  {
    name: "Weekly Plan",
    price: "$49",        // Was ₹4,100
    originalPrice: "$59" // Was ₹4,600
  },
  // ...
];
```

---

## Additional Resources

### Documentation

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **Google Gemini API**: https://ai.google.dev/docs

### Tools

- **Vercel**: https://vercel.com
- **Google AI Studio**: https://aistudio.google.com
- **VS Code Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Error Translator

### Project-Specific Docs

- **README.md**: Project overview and quick start
- **SETUP.md**: Detailed setup instructions
- **CAPSTONE.md**: Comprehensive architecture documentation
- **PRESENTATION.md**: Presentation slides and talking points

---

## Getting Help

### Troubleshooting Steps

1. **Check this guide first** - Most issues covered above
2. **Review error messages** - Often self-explanatory
3. **Check browser console** (F12 → Console tab)
4. **Check terminal output** - Server logs show errors
5. **Try restarting the dev server**
6. **Clear browser cache and localStorage**

### When Asking for Help

Include:

1. **What you were trying to do**
2. **What happened instead**
3. **Error messages** (exact text or screenshot)
4. **What you've tried already**
5. **Your environment**:
   ```bash
   node --version
   npm --version
   # OS (Windows, Mac, Linux)
   ```

---

## Summary

You now have everything you need to:

- ✅ Understand what HealthyBite is and what problem it solves
- ✅ Set up the project locally in 5 minutes
- ✅ Run a complete demo from login to checkout
- ✅ Understand the architecture and code structure
- ✅ Work with the AI recommendation engine
- ✅ Deploy to production (Vercel or other platforms)
- ✅ Troubleshoot common issues
- ✅ Make code changes and extend functionality

### Quick Reference Card

**Start Development:**
```bash
npm run dev
```

**Demo Credentials:**
- Email: `demo@healthybite.com`
- Password: `demo123`

**Test AI:**
```bash
npm run test:gemini
```

**Build for Production:**
```bash
npm run build
npm start
```

**Key Files:**
- Health Form: `app/questionnaire/page.tsx`
- AI Logic: `lib/llmService.ts`
- API: `app/api/recommendations/route.ts`

**Environment Variables:**
```bash
GEMINI_API_KEY=required-for-ai
DEMO_EMAIL=demo@healthybite.com
DEMO_PASSWORD=demo123
```

---

**Welcome to the HealthyBite team! Happy coding!** 🚀
