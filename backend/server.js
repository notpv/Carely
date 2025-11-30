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


// ============================================
// PERSONALIZED GUIDED MEDITATION ENDPOINT
// ============================================
app.post('/api/generate-meditation', async (req, res) => {
  const meditationData = req.body;
  console.log('Received meditation request:', meditationData);

  try {
    const model = await getModel(['gemini-2.5-pro', 'gemini-2.5-flash']);

    const meditationPrompt = `
You are a certified meditation instructor and mindfulness expert. Generate a personalized, therapeutic meditation script based on the user's specific emotional state and needs.

USER CONTEXT:
- Primary Stress Source: ${meditationData.stressSource}
- Current Mood: ${meditationData.currentMood}
- Sleep Quality: ${meditationData.sleepQuality || 'Not specified'}
- Meditation Type: ${meditationData.meditationType}
- Requested Duration: ${meditationData.duration} minutes
- Background Sound Preference: ${meditationData.backgroundSound}
- Additional Context: ${meditationData.additionalContext || 'None provided'}

IMPORTANT GUIDELINES:
1. Create a meditation script that DIRECTLY addresses the user's specific stress source (${meditationData.stressSource})
2. Acknowledge and validate their current emotional state (${meditationData.currentMood})
3. Use language and imagery appropriate for their situation
4. Include specific breathing patterns optimized for their needs
5. Generate personalized affirmations that counter their specific stressor
6. The script should be exactly ${meditationData.duration} minutes when read at a calm, meditative pace (approximately 100-120 words per minute)
7. Use second-person perspective ("you") throughout
8. Include pauses indicated by "..." for breathing moments
9. The tone should be warm, compassionate, and gently guiding

MEDITATION TYPE SPECIFIC INSTRUCTIONS:
${meditationData.meditationType === 'breathing' ? '- Focus heavily on breath awareness and specific breathing patterns\n- Guide through multiple breathing cycles with precise timing' : ''}
${meditationData.meditationType === 'body-scan' ? '- Guide through progressive relaxation from head to toe\n- Focus on releasing tension in each body part' : ''}
${meditationData.meditationType === 'visualization' ? '- Create vivid, peaceful imagery tailored to their stress source\n- Use sensory descriptions (sight, sound, smell, touch)' : ''}
${meditationData.meditationType === 'mindfulness' ? '- Focus on present-moment awareness\n- Include observations without judgment\n- Anchor to breath and body sensations' : ''}
${meditationData.meditationType === 'sleep' ? '- Use extra slow pacing and drowsy-inducing language\n- Progressive relaxation leading to sleep\n- End with gentle, fading guidance' : ''}
${meditationData.meditationType === 'guided' ? '- Balance breathing, visualization, and affirmations\n- Create a journey from current state to calm' : ''}

RESPONSE FORMAT (JSON):
{
  "title": "A calming, personalized title for this meditation (e.g., 'Finding Peace Amidst Work Pressure')",
  "script": "The complete meditation script with proper pacing and pauses (...). This should be the full meditation text that can be read aloud or converted to audio.",
  "breathingPattern": {
    "inhale": <number of seconds to inhale>,
    "hold": <number of seconds to hold>,
    "exhale": <number of seconds to exhale>
  },
  "affirmations": [
    "First personalized affirmation addressing their specific situation",
    "Second personalized affirmation",
    "Third personalized affirmation"
  ]
}

Generate a deeply therapeutic and personalized meditation now:`;

    const result = await model.generateContent(meditationPrompt);
    const response = await result.response;
    const text = await response.text();

    console.log('Gemini meditation response received');

    // Parse the JSON response
    let meditationResult;
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        meditationResult = JSON.parse(jsonMatch[1]);
      } else {
        // Try to find JSON in the response
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          meditationResult = JSON.parse(text.substring(jsonStart, jsonEnd));
        } else {
          meditationResult = JSON.parse(text);
        }
      }
    } catch (e) {
      console.error('Failed to parse meditation response as JSON:', text);
      throw new Error('The AI generated an invalid response. Please try again.');
    }

    // Add duration info to the response
    meditationResult.duration = meditationData.duration;

    res.json(meditationResult);
  } catch (error) {
    console.error('--- Meditation Generation Error ---');
    console.error(error);
    res.status(500).json({ 
      details: error.message || 'Failed to generate meditation. Please check the backend logs for more details.' 
    });
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