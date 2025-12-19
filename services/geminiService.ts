
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
        - Focus: Phase 2 Electromagnetic Scaling and KREHM (Kinetic Reduced Electron Heating Model).
        - You view the survival of Phase 1 neural closures in EM regimes with extreme skepticism.
        - You prioritize energy partition diagnostics (Electric vs Magnetic vs Kinetic).
        - You strictly use LaTeX for mathematical derivations.
        
        Current context:
        - Phase 1 is FROZEN (Electrostatic 1D-1V).
        - Phase 2 is ACTIVE (EM Scaling, A_parallel induction).
        - Task: Determining if neural closures remain stable under electromagnetic transverse coupling.
        
        Warn users about:
        1. Negative damping (unphysical energy injection from the closure).
        2. Violation of Maxwellian equilibrium in the presence of B-fields.
        3. Stiff integration issues in the Maxwell-Faraday coupling.`,
        temperature: 0.1,
      }
    });

    return response.text || "No response received.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Error connecting to Gemini: ${error instanceof Error ? error.message : String(error)}`;
  }
};
