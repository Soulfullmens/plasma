
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getResearchResponse = async (prompt: string, history: { role: string; content: string }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: `You are an expert plasma physicist assistant for the PlasmaMind-LD project. 
        Context: Phase 1 focus is 1D-1V Vlasov-Poisson, Hermite spectral method, RK4, and MLP closure.
        Research Goal: Correcting the recurrence problem in truncated moment hierarchies.
        Current Paper Anchoring: Zhou et al. (2023).
        
        Strict Guidelines:
        1. Be rigorous and surgical.
        2. No hyped claims.
        3. Use LaTeX for math.
        4. Focus on TRL-3 execution.
        
        User Query: ${prompt}` }] }
      ],
      config: {
        systemInstruction: "You are a professional research physicist assistant.",
        temperature: 0.1,
      }
    });

    return response.text || "No response received.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Error connecting to Gemini: ${error instanceof Error ? error.message : String(error)}`;
  }
};
