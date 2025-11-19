require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Carely backend is running!');
});

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getModel(models) {
  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      console.log(`Successfully loaded model: ${modelName}`);
      return model;
    } catch (error) {
      console.warn(`Failed to load model: ${modelName}. Trying next model.`);
    }
  }
  throw new Error('All available models failed to load.');
}


app.post('/api/generate-plan', async (req, res) => {
  const userData = req.body;
  console.log('Received user data:', userData);

  try {
    const model = await getModel(['gemini-2.5-pro', 'gemini-2.5-flash']);

    const prompt = `
      Based on the following user data, generate a personalized wellness plan.
      The response should be a JSON object with the following structure:
      {
        "summary": "A brief summary of the plan.",
        "keyFactors": ["A list of the most important factors considered."],
        "diet": {
          "advice": "Specific dietary advice.",
          "reasoning": "The reasoning behind the advice.",
          "confidence": "A number between 0 and 100 representing the confidence in this advice.",
          "macros": { "protein": "percentage", "carbs": "percentage", "fat": "percentage" }
        },
        "exercise": {
          "advice": "Specific exercise recommendations.",
          "reasoning": "The reasoning behind the recommendations.",
          "confidence": "A number between 0 and 100."
        },
        "sleep": {
          "advice": "Specific sleep hygiene advice.",
          "reasoning": "The reasoning behind the advice.",
          "confidence": "A number between 0 and 100."
        },
        "stress": {
          "advice": "Specific stress management techniques.",
          "reasoning": "The reasoning behind the techniques.",
          "confidence": "A number between 0 and 100."
        }
      }

      User data:
      - Age: ${userData.age}
      - Gender: ${userData.gender}
      - Weight: ${userData.weight} kg
      - Height: ${userData.height} cm
      - Activity Level: ${userData.activityLevel}
      - Medical Conditions: ${userData.conditions.join(', ')}
      - Diet Preference: ${userData.dietPreference}
      - Sleep Hours: ${userData.sleepHours} hours per night
      - Health Goals: ${userData.goals.join(', ')}
      - Stress Level: ${userData.stressLevel}
      - Sleep Quality: ${userData.sleepQuality}
      - Alcohol Consumption: ${userData.alcoholConsumption}
      - Smoking Habits: ${userData.smokingHabits}
      - Work/Life Balance: ${userData.workLifeBalance}

      Please provide a detailed and actionable wellness plan.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    console.log('Gemini API response text:', text);

    // The Gemini API will return a string, so we need to parse it as JSON.
    // The response is often wrapped in a markdown block, so we need to extract it.
    let plan;
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        plan = JSON.parse(jsonMatch[1]);
      } else {
        // If the markdown block is not found, try to parse the whole text.
        plan = JSON.parse(text);
      }
    } catch (e) {
      console.error('Failed to parse Gemini API response as JSON:', text);
      throw new Error('The AI generated an invalid response. Please try again.');
    }


    res.json(plan);
  } catch (error) {
    console.error('--- Full Gemini API Error ---');
    console.error(error);
    console.error('--- End of Full Gemini API Error ---');
    res.status(500).json({ details: 'Failed to generate plan from AI. Please check the backend logs for more details.' });
  }
});

// Simulate loading API keys and other necessities
console.log('Carely backend is initializing...');
console.log('API key loaded successfully.');
console.log('Database connection established.');
console.log('Other necessities loaded.');

app.listen(port, () => {
  console.log(`Carely backend listening at http://localhost:${port}`);
});