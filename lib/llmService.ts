import Groq from "groq-sdk";
import { HealthProfile, MealRecommendation, generateRecommendations as fallbackRecommendations } from "./recommendationEngine";

// Initialize Groq client
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured in environment variables");
  }

  return new Groq({ apiKey });
};

export interface LLMRecommendationResponse {
  meals: MealRecommendation[];
  insights: {
    bmi: number;
    bmiCategory: string;
    healthTips: string[];
    whyTheseMeals: string;
    nutritionalFocus: string;
  };
  success: boolean;
  usedFallback?: boolean;
}

/**
 * Retry a function with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error instanceof Error ? error.message : error);

      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Generate AI-powered meal recommendations using Groq (Llama 3.3 70B)
 */
export async function generateMealRecommendationsWithLLM(
  profile: HealthProfile
): Promise<LLMRecommendationResponse> {
  try {
    const groq = getGroqClient();

    // Calculate BMI
    const height = parseFloat(profile.height);
    const weight = parseFloat(profile.weight);
    const bmi = calculateBMI(height, weight);
    const bmiCategory = getBMICategory(bmi);

    // Create detailed prompt
    const prompt = createMealRecommendationPrompt(profile, bmi, bmiCategory);

    // Generate recommendations with retry
    const chatCompletion = await withRetry(
      () => groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a professional nutritionist and meal planning expert. Always respond with valid JSON only, no additional text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      }),
      2
    );

    const text = chatCompletion.choices[0]?.message?.content || "";

    // Parse JSON response from LLM
    const parsedResponse = parseLLMResponse(text);

    return {
      meals: parsedResponse.meals,
      insights: {
        bmi,
        bmiCategory,
        healthTips: parsedResponse.healthTips,
        whyTheseMeals: parsedResponse.whyTheseMeals,
        nutritionalFocus: parsedResponse.nutritionalFocus,
      },
      success: true,
      usedFallback: false,
    };
  } catch (error) {
    console.error("Error generating LLM recommendations:", error);

    // Fallback to rule-based recommendations
    return generateFallbackRecommendations(profile);
  }
}

/**
 * Create a detailed prompt for generating personalized meal recommendations
 */
// Map location codes to cuisine context for the AI prompt
function getRegionalCuisineContext(location: string): { region: string; cuisine: string; ingredients: string; examples: string } {
  const regionMap: Record<string, { region: string; cuisine: string; ingredients: string; examples: string }> = {
    "tamil-nadu": {
      region: "Tamil Nadu",
      cuisine: "Tamil",
      ingredients: "rice, lentils, tamarind, curry leaves, coconut, sesame oil, black pepper, mustard seeds",
      examples: "dosa, idli, sambar, rasam, pongal, chettinad chicken, kuzhambu, kootu, appam, uttapam, upma, adai",
    },
    "kerala": {
      region: "Kerala",
      cuisine: "Kerala",
      ingredients: "coconut, coconut oil, curry leaves, tamarind, rice, fish, banana, jackfruit",
      examples: "puttu, appam, stew, fish curry, avial, thoran, sadya, karimeen fry, erissery, olan, payasam",
    },
    "karnataka": {
      region: "Karnataka",
      cuisine: "Karnataka",
      ingredients: "ragi, jowar, rice, coconut, jaggery, curry leaves, urad dal",
      examples: "bisi bele bath, ragi mudde, Mysore masala dosa, akki roti, vangi bath, neer dosa, gojju",
    },
    "andhra-pradesh": {
      region: "Andhra Pradesh",
      cuisine: "Andhra",
      ingredients: "red chillies, tamarind, rice, lentils, curry leaves, mustard seeds, fenugreek",
      examples: "biryani, gongura, pesarattu, pulihora, gutti vankaya, chicken 65, pappu, pachadi",
    },
    "telangana": {
      region: "Telangana",
      cuisine: "Telangana",
      ingredients: "jowar, bajra, sesame, peanuts, tamarind, red chillies, lentils",
      examples: "Hyderabadi biryani, haleem, jonna rotte, sakinalu, bagara baingan, sarva pindi, pachi pulusu",
    },
    "delhi": {
      region: "Delhi / NCR",
      cuisine: "North Indian / Mughlai",
      ingredients: "wheat, ghee, paneer, cream, butter, spices (garam masala, cumin, coriander)",
      examples: "butter chicken, chole bhature, rajma chawal, paratha, biryani, dal makhani, paneer tikka, kebabs",
    },
    "punjab": {
      region: "Punjab",
      cuisine: "Punjabi",
      ingredients: "wheat, ghee, butter, paneer, mustard greens, makhan, cream, legumes",
      examples: "makki di roti with sarson ka saag, butter chicken, chole, dal makhani, lassi, tandoori chicken, rajma",
    },
    "uttar-pradesh": {
      region: "Uttar Pradesh",
      cuisine: "Awadhi / UP",
      ingredients: "wheat, rice, ghee, saffron, spices, lentils, potato",
      examples: "lucknowi biryani, galouti kebab, nihari, bedmi puri, kachori, dum aloo, petha",
    },
    "rajasthan": {
      region: "Rajasthan",
      cuisine: "Rajasthani",
      ingredients: "bajra, jowar, ghee, buttermilk, gram flour, dried lentils, berries (ker sangri)",
      examples: "dal bati churma, gatte ki sabzi, laal maas, ker sangri, bajra roti, papad ki sabzi, pyaaz kachori",
    },
    "west-bengal": {
      region: "West Bengal",
      cuisine: "Bengali",
      ingredients: "rice, fish (rohu, hilsa), mustard oil, panch phoron, poppy seeds, coconut",
      examples: "machher jhol, shorshe ilish, luchi-alur dom, mishti doi, kosha mangsho, chingri malai curry, pitha",
    },
    "maharashtra": {
      region: "Maharashtra",
      cuisine: "Maharashtrian",
      ingredients: "rice, jowar, peanuts, coconut, kokum, jaggery, gram flour",
      examples: "vada pav, misal pav, puran poli, thalipeeth, poha, sabudana khichdi, bharli vangi, pav bhaji",
    },
    "gujarat": {
      region: "Gujarat",
      cuisine: "Gujarati",
      ingredients: "gram flour, buttermilk, jaggery, sesame, peanuts, rice, wheat",
      examples: "dhokla, thepla, undhiyu, khandvi, fafda-jalebi, dal-dhokli, handvo, shrikhand",
    },
    "goa": {
      region: "Goa",
      cuisine: "Goan",
      ingredients: "coconut, kokum, fish, rice, toddy vinegar, tamarind, spices",
      examples: "fish curry rice, vindaloo, xacuti, bebinca, prawn balchao, sorpotel, sannas",
    },
    "odisha": {
      region: "Odisha",
      cuisine: "Odia",
      ingredients: "rice, panch phutana, mustard, curd, coconut, banana flower",
      examples: "dalma, pakhala bhata, chhena poda, machha besara, santula, enduri pitha",
    },
    "bihar": {
      region: "Bihar",
      cuisine: "Bihari",
      ingredients: "sattu, rice, wheat, mustard oil, lentils, vegetables",
      examples: "litti chokha, sattu paratha, dal pitha, thekua, chana ghugni, khaja",
    },
    "assam": {
      region: "Assam",
      cuisine: "Assamese",
      ingredients: "rice, fish, mustard oil, bamboo shoot, bhut jolokia, black sesame",
      examples: "masor tenga, khar, pitha, duck curry, aloo pitika, ou tenga",
    },
    "northeast": {
      region: "Northeast India",
      cuisine: "Northeast Indian",
      ingredients: "rice, bamboo shoot, fermented fish, king chilli, local greens, ginger",
      examples: "momos, thukpa, smoked pork, axone curry, jadoh, bamboo shoot curry",
    },
    "himachal-pradesh": {
      region: "Himachal Pradesh",
      cuisine: "Himachali / Pahari",
      ingredients: "wheat, rice, rajma, madra spice mix, yogurt, ghee",
      examples: "dham, madra, chana madra, siddu, babru, aktori, tudkiya bhath",
    },
    "jammu-kashmir": {
      region: "Jammu & Kashmir",
      cuisine: "Kashmiri",
      ingredients: "rice, saffron, dried fruits, fennel, yogurt, mustard oil, lotus stem",
      examples: "rogan josh, dum aloo, yakhni, haak saag, rajma, modur pulao, kahwa",
    },
    "uttarakhand": {
      region: "Uttarakhand",
      cuisine: "Garhwali / Kumaoni",
      ingredients: "mandua (finger millet), jhangora (barnyard millet), rajma, urad dal, bhatt",
      examples: "kafuli, phaanu, chainsoo, bal mithai, dubuk, bhatt ki churkani",
    },
    "madhya-pradesh": {
      region: "Madhya Pradesh",
      cuisine: "Malwa / Bundelkhandi",
      ingredients: "wheat, gram flour, ghee, jaggery, sev, lentils",
      examples: "poha-jalebi, bhutte ka kees, dal bafla, malpua, chakki ki shaak, mawa bati",
    },
    "chhattisgarh": {
      region: "Chhattisgarh",
      cuisine: "Chhattisgarhi",
      ingredients: "rice, kochai patta, chana dal, mustard oil, tamarind",
      examples: "faraa, muthiya, bore baasi, chila, aamat, angakar roti",
    },
  };

  return regionMap[location] || {
    region: "India",
    cuisine: "Indian",
    ingredients: "rice, wheat, lentils, spices, ghee, coconut, vegetables",
    examples: "dal rice, roti sabzi, biryani, dosa, khichdi, paratha, poha, upma",
  };
}

function createMealRecommendationPrompt(
  profile: HealthProfile,
  bmi: number,
  bmiCategory: string
): string {
  const regional = getRegionalCuisineContext(profile.location);

  return `Based on the user's health profile, generate 5 personalized meal recommendations.

**User Health Profile:**
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- BMI: ${bmi} (${bmiCategory})
- Activity Level: ${profile.activityLevel}
- Health Goal: ${profile.healthGoal}
- Dietary Preference: ${profile.dietaryPreference}
- Allergies: ${profile.allergies || "None"}
- Meals Per Day: ${profile.mealsPerDay}
- Budget: ${profile.budget}
- Cooking Preference: ${profile.cookingPreference}
- Medical Conditions: ${profile.medicalConditions || "None"}
- Location: ${regional.region}

**Task:**
Generate 5 personalized ${regional.cuisine} meal recommendations that align with the user's health goals, dietary preferences, and regional palate. Each meal should:
1. Be authentic ${regional.cuisine} cuisine (examples: ${regional.examples})
2. Use regional ingredients: ${regional.ingredients}
3. Match their dietary preference (${profile.dietaryPreference})
4. Support their health goal (${profile.healthGoal})
5. Be appropriate for their activity level (${profile.activityLevel})
6. Avoid any mentioned allergies
7. Include realistic nutritional information (calories, protein, carbs, fats, fiber, sugar, sodium in grams/mg)
8. Include exact ingredient quantities in grams or standard measures
9. Include step-by-step cooking instructions
10. Include fun facts and practical tips for each meal

**Response Format (MUST BE VALID JSON):**
{
  "meals": [
    {
      "id": 1,
      "name": "Meal Name",
      "description": "Brief appetizing description mentioning the regional touch",
      "calories": 450,
      "protein": 35,
      "carbs": 40,
      "fats": 15,
      "fiber": 8,
      "sugar": 6,
      "sodium": 480,
      "type": "${profile.dietaryPreference.toLowerCase()}",
      "tags": ["relevant", "tags"],
      "image": "emoji",
      "ingredients": [
        { "name": "Ingredient name", "amount": "150g", "calories": 120 },
        { "name": "Another ingredient", "amount": "2 tbsp", "calories": 60 }
      ],
      "instructions": [
        "Step 1: Prepare ingredients by washing and chopping as needed.",
        "Step 2: Heat oil in a pan and add tempering spices.",
        "Step 3: Add main ingredients and cook on medium heat.",
        "Step 4: Season with salt and finish with garnish.",
        "Step 5: Serve hot with accompaniments."
      ],
      "prepTime": "15 min",
      "cookTime": "25 min",
      "servings": 1,
      "funFacts": [
        "A surprising fact about this dish or its key ingredient.",
        "Another interesting cultural or nutritional fact."
      ],
      "tips": [
        "Eat slowly and chew well to improve digestion.",
        "Pair with warm water or a specific drink to enhance nutrient absorption.",
        "A tip about the best time of day to eat this meal."
      ]
    }
  ],
  "healthTips": [
    "Tip 1 based on their health goal",
    "Tip 2 based on their BMI category",
    "Tip 3 based on regional diet wisdom from ${regional.region}"
  ],
  "whyTheseMeals": "2-3 sentence explanation of why these specific meals were chosen, referencing regional cuisine benefits",
  "nutritionalFocus": "Brief statement about the nutritional strategy (e.g., 'High protein, moderate carbs for muscle gain')"
}

**Important Guidelines:**
- ALL meals MUST be authentic ${regional.cuisine} dishes
- Use appropriate emojis for meal images
- Focus on traditional ${regional.region} ingredients: ${regional.ingredients}
- Each meal MUST have 5-8 ingredients with exact gram or cup/tbsp/tsp quantities
- Each meal MUST have 4-6 step-by-step cooking instructions (not generic, specific to the dish)
- Each meal MUST have exactly 2 fun facts (historical, cultural, or surprising nutritional facts)
- Each meal MUST have exactly 3 tips (digestion, consumption timing, or absorption tips)
- Calories should align with activity level and health goals
- If goal is weight-loss, keep meals under 450 calories
- If goal is muscle-gain, prioritize protein (>30g per meal)
- If goal is energy, ensure adequate carbs (>50g per meal)
- Avoid any ingredients related to allergies
- Make descriptions appetizing and culturally authentic
- Include a mix of breakfast, lunch, dinner, and snack options where possible`;
}

/**
 * Parse LLM response and extract meal recommendations
 */
function parseLLMResponse(text: string): {
  meals: MealRecommendation[];
  healthTips: string[];
  whyTheseMeals: string;
  nutritionalFocus: string;
} {
  try {
    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();

    // Remove ```json ... ``` or ``` ... ``` wrappers
    const jsonBlockMatch = cleanedText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (jsonBlockMatch) {
      cleanedText = jsonBlockMatch[1].trim();
    }

    // Try to extract JSON object if there's surrounding text
    if (!cleanedText.startsWith("{")) {
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
    }

    const parsed = JSON.parse(cleanedText);

    // Validate the response structure
    if (!parsed.meals || !Array.isArray(parsed.meals)) {
      throw new Error("Invalid response structure: missing meals array");
    }

    // Ensure each meal has required fields with defaults
    const validatedMeals = parsed.meals.slice(0, 5).map((meal: Record<string, unknown>, index: number) => ({
      id: meal.id || index + 1,
      name: meal.name || `Meal ${index + 1}`,
      description: meal.description || "A nutritious meal tailored for you",
      calories: Number(meal.calories) || 400,
      protein: Number(meal.protein) || 20,
      carbs: Number(meal.carbs) || 40,
      fats: Number(meal.fats) || 15,
      fiber: Number(meal.fiber) || 0,
      sugar: Number(meal.sugar) || 0,
      sodium: Number(meal.sodium) || 0,
      type: meal.type || "balanced",
      tags: Array.isArray(meal.tags) ? meal.tags : [],
      image: meal.image || "🍽️",
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
      instructions: Array.isArray(meal.instructions) ? meal.instructions : [],
      prepTime: (meal.prepTime as string) || "20 min",
      cookTime: (meal.cookTime as string) || "20 min",
      servings: Number(meal.servings) || 1,
      funFacts: Array.isArray(meal.funFacts) ? meal.funFacts : [],
      tips: Array.isArray(meal.tips) ? meal.tips : [],
    }));

    return {
      meals: validatedMeals,
      healthTips: Array.isArray(parsed.healthTips) ? parsed.healthTips : [],
      whyTheseMeals: parsed.whyTheseMeals || "These meals are tailored to your health profile.",
      nutritionalFocus: parsed.nutritionalFocus || "Balanced nutrition for your goals.",
    };
  } catch (error) {
    console.error("Error parsing LLM response:", error);
    console.error("Raw response text:", text.substring(0, 500));
    throw new Error("Failed to parse LLM response");
  }
}

/**
 * Fallback to rule-based recommendations if LLM fails
 */
function generateFallbackRecommendations(profile: HealthProfile): LLMRecommendationResponse {
  const height = parseFloat(profile.height);
  const weight = parseFloat(profile.weight);
  const bmi = calculateBMI(height, weight);
  const bmiCategory = getBMICategory(bmi);

  const meals = fallbackRecommendations(profile);

  return {
    meals,
    insights: {
      bmi,
      bmiCategory,
      healthTips: [
        `Focus on ${profile.healthGoal.replace("-", " ")} with consistent meal planning.`,
        `Your BMI indicates ${bmiCategory.toLowerCase()} - maintain a balanced diet.`,
        `Stay active with ${profile.activityLevel.toLowerCase()} to support your goals.`,
      ],
      whyTheseMeals: `These meals are selected based on your ${profile.dietaryPreference} preference and ${profile.healthGoal.replace("-", " ")} goal using our proven recommendation engine.`,
      nutritionalFocus: getFallbackNutritionalFocus(profile.healthGoal),
    },
    success: true,
    usedFallback: true,
  };
}

/**
 * Get nutritional focus based on health goal
 */
function getFallbackNutritionalFocus(healthGoal: string): string {
  const focusMap: Record<string, string> = {
    "weight-loss": "Low calorie, high protein for sustainable weight management",
    "muscle-gain": "High protein, moderate carbs for muscle building",
    "energy": "Complex carbs, balanced macros for sustained energy",
    "general-health": "Balanced nutrition for overall wellness",
  };

  return focusMap[healthGoal.toLowerCase()] || "Balanced nutrition for your goals";
}

/**
 * Calculate BMI (Body Mass Index)
 */
function calculateBMI(height: number, weight: number): number {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

/**
 * Get BMI category based on BMI value
 */
function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

/**
 * Validate that API key is configured
 */
export function isLLMConfigured(): boolean {
  return !!process.env.GROQ_API_KEY;
}
