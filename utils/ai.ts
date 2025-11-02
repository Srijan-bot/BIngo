import { GoogleGenAI } from "@google/genai";
import { PlayerState } from "../types";

let ai: GoogleGenAI | null = null;
const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing from environment.");
      return null;
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

export const getAIPersonalityResponse = async (
  aiState: PlayerState,
  playerState: PlayerState,
  lastCalledNumber: number | null,
  isAIsTurn: boolean,
): Promise<string> => {
    const genAI = getAI();
    if (!genAI) {
        return "Thinking...";
    }

  const prompt = `You are a bingo-playing AI named Gemini. 
    Your board has ${aiState.lines} completed lines.
    The human player's board has ${playerState.lines} completed lines.
    ${isAIsTurn ? `It's your turn now. You just chose the number ${lastCalledNumber} from your board.` : `The human just chose ${lastCalledNumber} from their board.`}
    Keep your response to 15 words or less. Be witty, a bit sassy, and confident.
    What do you say?`;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.replace(/"/g, ''); // Remove quotes from response
  } catch (error) {
    console.error("Error fetching AI personality:", error);
    return "Let's see...";
  }
};