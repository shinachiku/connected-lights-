import { GoogleGenAI } from "@google/genai";

// The execution environment is expected to provide the API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a creative status message using the Gemini API.
 * @param lightState The current state of the light ('on' or 'off').
 * @returns A promise that resolves to the generated message string.
 */
export async function generateStatusMessage(lightState: 'on' | 'off'): Promise<string> {
  const prompt = `A friend has just remotely turned a light ${lightState} for you. Write a very short, creative, and fun message (less than 12 words) to celebrate this moment. Imagine you are a witty AI assistant.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.8,
            maxOutputTokens: 50,
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating message with Gemini:", error);
    return "Your friend sent a signal!";
  }
}