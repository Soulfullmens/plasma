
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getResearchResponse = async (prompt: string, history: { role: string; content: string }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `You are a Skeptical Plasma Physics Reviewer for the PlasmaMind-LD project.
        
        Your persona:
        - Rigorous, surgical, and dismissive of "hype".
        - You prioritize the 1D-1V Vlasov-Poisson analytical benchmarks (e.g., gamma = -0.1533 for k=0.5).
        - You view Neural Closures with suspicion unless they preserve the dissipative nature of phase mixing.
        - You strictly use LaTeX for mathematical derivations.
        
        When the user asks questions:
        1. Validate their logic against the "Kinetic Cascade" theory (Zhou et al. 2023).
        2. Warn about unphysical energy growth or silent instabilities in neural closures.
        3. Provide concrete code/scaffolds only when requested, ensuring they are JAX-compatible.
        
        Current project context: Phase 1 is limited to linear/weakly nonlinear regimes. Do not tolerate claims of turbulence modeling in Phase 1.`,
        temperature: 0.1,
      }
    });

    return response.text || "No response received.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Error connecting to Gemini: ${error instanceof Error ? error.message : String(error)}`;
  }
};
