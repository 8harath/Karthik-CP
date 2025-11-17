# HealthyBite - Personalized Meal Plans & Subscriptions

A modern, responsive web application that provides personalized meal recommendations and subscription-based food delivery services. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### ✨ Core Functionality

- **User Authentication**: Simple registration, login, and password recovery (mock implementation)
- **Health Questionnaire**: 12-input comprehensive health profile form covering:
  - Basic information (age, gender, height, weight)
  - Lifestyle metrics (activity level, health goals, meals per day)
  - Dietary preferences (vegetarian, vegan, keto, etc.)
  - Allergies and medical conditions
  - Budget and cooking preferences
- **AI-Powered Meal Recommendations**: Gemini 1.5 Flash generates personalized meal suggestions based on:
  - Dietary preferences and restrictions
  - Health goals (weight loss, muscle gain, energy, general health)
  - Activity levels and BMI
  - Allergies and food restrictions
  - Personalized health tips and nutritional insights
  - Fallback to rule-based engine if AI unavailable
- **Subscription Plans**: Three tiers (Weekly, Monthly, Quarterly) with pricing cards
- **Mock Payment System**: Secure-looking payment flow for MVP demonstration
- **Dark/Light Mode**: Full theme support with system preference detection
- **Responsive Design**: Mobile-first, works perfectly on all devices

### 🎨 UI/UX Features

- Clean, modern interface with health/wellness aesthetic
- Smooth animations and transitions
- Accessible and user-friendly forms
- Progress tracking for multi-step questionnaire
- Interactive pricing cards with plan comparison

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Theme Management**: next-themes
- **State Management**: React hooks + localStorage (MVP)
- **API**: Next.js API Routes (mock backend)

## Project Structure

```
healthybite/
├── app/
│   ├── api/               # API routes (mock backend)
│   │   ├── auth/          # Authentication endpoints
│   │   ├── profile/       # Health profile management
│   │   ├── recommendations/ # Meal recommendations
│   │   └── subscription/  # Subscription management
│   ├── forgot-password/   # Password recovery page
│   ├── login/             # Login page
│   ├── payment/           # Payment pages
│   │   └── success/       # Payment success page
│   ├── questionnaire/     # Health profile questionnaire
│   ├── recommendations/   # Meal recommendations display
│   ├── register/          # Registration page
│   ├── subscriptions/     # Subscription plans page
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── lib/                   # Utility functions
│   └── recommendationEngine.ts  # Meal recommendation logic
└── public/                # Static assets

```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Karthik-CP
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Add your Gemini API key to .env.local
```

4. Get your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**

### Build for Production

```bash
npm run build
npm start
```

## Deployment on Vercel

This project is optimized for Vercel deployment:

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and configure build settings
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables

**Required for AI Features:**
```bash
GEMINI_API_KEY=your-gemini-api-key-here
```

**Optional (Demo Defaults):**
```bash
DEMO_EMAIL=demo@healthybite.com
DEMO_PASSWORD=demo123
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See [SETUP.md](./SETUP.md) for detailed configuration guide.

## User Flow

1. **Landing Page** → User learns about HealthyBite
2. **Registration** → User creates an account
3. **Health Questionnaire** → User completes 12-question profile (4 steps)
4. **Recommendations** → User sees personalized meal suggestions with nutritional info
5. **Subscription Plans** → User selects a plan (Weekly/Monthly/Quarterly)
6. **Payment** → User enters payment details (mock)
7. **Success** → User receives confirmation and order details

## Key Components

### AI Recommendation Engine

The AI-powered recommendation system (`lib/llmService.ts`) uses Google Gemini 1.5 Flash to:
- Generate 5 personalized meal recommendations with full nutritional data
- Provide health tips tailored to user's BMI and goals
- Explain why specific meals were chosen
- Define nutritional strategy (high protein, low carb, etc.)
- Calculate BMI and categorize health status
- Fallback to rule-based engine (`lib/recommendationEngine.ts`) if AI unavailable

**Free tier:** 1,500 AI requests per day with Gemini 1.5 Flash

### API Routes

All API routes are mock implementations ready to be connected to a real backend:
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/profile` - Save health profile
- `GET /api/profile` - Retrieve health profile
- `POST /api/recommendations` - Generate meal recommendations
- `POST /api/subscription` - Create subscription

## Future Enhancements

- [x] AI-powered meal recommendations ✅ (Gemini 1.5 Flash)
- [x] Demo authentication with credentials ✅
- [ ] Real database integration (PostgreSQL/MongoDB)
- [ ] JWT-based authentication
- [ ] Real payment gateway (Stripe/Razorpay)
- [ ] User dashboard with order tracking
- [ ] Meal customization and swapping
- [ ] Weekly meal calendar
- [ ] Push notifications
- [ ] Email confirmations
- [ ] Admin panel for meal management

## MVP Limitations

This is an MVP (Minimum Viable Product):
- Authentication uses demo credentials + localStorage (not secure for production)
- Payment is mocked (no real transactions)
- AI recommendations limited to Gemini free tier (1,500 requests/day)
- No real database (data stored in localStorage)
- No email notifications

**Demo Credentials:**
- Email: demo@healthybite.com
- Password: demo123

## Performance

- **Build Size**: ~102 kB shared JS
- **Static Pages**: All pages are statically generated for optimal performance
- **Load Time**: <2 seconds on average
- **Lighthouse Score**: Optimized for performance, accessibility, and SEO

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is private and proprietary.

## Support

For questions or issues, please contact the development team.

---

**Built with ❤️ for healthy living**
