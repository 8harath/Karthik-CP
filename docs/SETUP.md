# HealthyBite Setup Guide

Welcome to HealthyBite! This guide will help you get the application up and running with AI-powered meal recommendations.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your Gemini API key:
   ```bash
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

### 3. Get Your Free Gemini API Key

HealthyBite uses Google's Gemini 1.5 Flash model, which is **FREE** for up to 1,500 requests per day.

**Steps to get your API key:**

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Paste it in your `.env.local` file

**Note:** The Gemini 1.5 Flash model is completely free for the usage limits mentioned above. Perfect for demos and MVPs!

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Credentials

For quick testing, use these demo credentials:

- **Email:** demo@healthybite.com
- **Password:** demo123

---

## 📋 Complete User Flow

### Step-by-Step Guide:

1. **Landing Page**
   - Open http://localhost:3000
   - Click "Get Started" or "Sign In"

2. **Login**
   - Use demo credentials (shown above)
   - Or register a new account (data stored in localStorage)

3. **Health Questionnaire** (4 Steps)
   - Step 1: Basic info (age, gender, height, weight)
   - Step 2: Lifestyle (activity level, health goals, meals per day)
   - Step 3: Dietary preferences (vegetarian, vegan, etc.)
   - Step 4: Restrictions (allergies, budget, cooking preference)

4. **AI-Powered Recommendations**
   - Gemini generates 5 personalized meal suggestions
   - View nutritional insights and health tips
   - See explanation of why these meals were chosen

5. **Subscription Plans**
   - Choose from Weekly, Monthly, or Quarterly plans
   - Proceed to payment

6. **Mock Payment**
   - Enter payment details (demo only - no real transactions)
   - Receive order confirmation

---

## 🎨 Features Implemented

### ✅ AI-Powered Recommendations
- Uses Google Gemini 1.5 Flash for personalized meal generation
- Generates 5 meals based on:
  - Dietary preferences (vegan, vegetarian, pescatarian, etc.)
  - Health goals (weight loss, muscle gain, energy, general health)
  - Activity level
  - Allergies and restrictions
  - BMI and health metrics

### ✅ Enhanced Insights
- **Why These Meals?** - AI explains reasoning
- **Nutritional Strategy** - Macro-nutrient focus
- **Health Tips** - Personalized recommendations
- **BMI Analysis** - Health category and insights

### ✅ Fallback System
- If Gemini API is not configured, app falls back to rule-based engine
- Graceful error handling
- No disruption to user experience

### ✅ Demo Authentication
- Quick login with demo credentials
- Registration available (localStorage-based)
- Session persistence

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **AI:** Google Gemini 1.5 Flash
- **State:** React Hooks + localStorage (MVP)
- **Theme:** Dark/Light mode with next-themes

---

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes (for AI) | None |
| `DEMO_EMAIL` | Demo account email | No | demo@healthybite.com |
| `DEMO_PASSWORD` | Demo account password | No | demo123 |
| `NEXT_PUBLIC_APP_URL` | Application URL | No | http://localhost:3000 |

---

## 🔧 Troubleshooting

### AI Recommendations Not Working

**Symptom:** Seeing "Using rule-based recommendations (AI not configured)" message

**Solutions:**
1. Check that `GEMINI_API_KEY` is set in `.env.local`
2. Verify the API key is valid (test at https://aistudio.google.com)
3. Restart the development server (`npm run dev`)

### Login Not Working

**Symptom:** "Invalid email or password" error

**Solutions:**
1. Use exact demo credentials: `demo@healthybite.com` / `demo123`
2. Check for typos in email or password
3. Try registering a new account instead

### Build Errors

**Symptom:** TypeScript or build errors

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

---

## 🧪 Testing the Application

### Manual Testing Checklist:

- [ ] Landing page loads correctly
- [ ] Login with demo credentials works
- [ ] Registration flow works
- [ ] Health questionnaire (all 4 steps) complete successfully
- [ ] AI recommendations generated with insights
- [ ] BMI calculation displayed correctly
- [ ] Health tips shown
- [ ] Subscription plans page loads
- [ ] Payment flow completes
- [ ] Dark/light mode toggle works
- [ ] Mobile responsive design works

### Test Different Health Profiles:

1. **Weight Loss Profile:**
   - Goal: Weight Loss
   - Activity: Sedentary
   - Diet: Vegetarian
   - Expected: Low-calorie meals (<400 cal)

2. **Muscle Gain Profile:**
   - Goal: Muscle Gain
   - Activity: Very Active
   - Diet: Non-Vegetarian
   - Expected: High-protein meals (>30g protein)

3. **Vegan Profile:**
   - Goal: General Health
   - Activity: Moderate
   - Diet: Vegan
   - Expected: Plant-based meals only

---

## 🚀 Deployment

### Deploy to Vercel (Recommended):

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable in Vercel dashboard:
   - `GEMINI_API_KEY`: Your Gemini API key
4. Deploy!

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

---

## 📊 API Usage & Costs

### Gemini 1.5 Flash Limits:
- **Free tier:** 1,500 requests per day
- **Rate limit:** 15 requests per minute
- **Cost if exceeded:** $0.075 per 1M input tokens, $0.30 per 1M output tokens

### Estimated Usage:
- ~500 tokens per recommendation request
- **~$0.0002 per recommendation** (if you exceed free tier)
- **5,000+ recommendations per $1** (beyond free tier)

---

## 🎯 MVP Limitations

This is an MVP/Prototype with the following limitations:

- **Authentication:** Demo credentials only, localStorage-based (not secure for production)
- **Database:** No persistent database, uses localStorage
- **Payment:** Mock payment system (no real transactions)
- **AI:** Free tier Gemini API (rate limits apply)
- **Email:** No email notifications

---

## 🔮 Future Enhancements

- [ ] Real database (PostgreSQL/MongoDB)
- [ ] JWT-based authentication
- [ ] Real payment gateway (Stripe/Razorpay)
- [ ] User dashboard with order history
- [ ] Meal customization and swapping
- [ ] Weekly meal calendar
- [ ] Email/SMS notifications
- [ ] Admin panel

---

## 📞 Support

For questions or issues:

1. Check this setup guide
2. Review the troubleshooting section
3. Check the browser console for errors
4. Verify environment variables are set correctly

---

## ✅ Success Criteria

Your HealthyBite app is ready when:

- ✅ You can login with demo credentials
- ✅ Complete the health questionnaire
- ✅ See AI-generated meal recommendations
- ✅ View personalized health tips and insights
- ✅ Navigate through subscription and payment flow
- ✅ App works on both desktop and mobile
- ✅ Dark mode works correctly

---

**Built with ❤️ using Next.js and Google Gemini AI**

*Last Updated: 2025*
