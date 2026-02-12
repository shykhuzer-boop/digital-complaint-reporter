
import { GoogleGenAI, Type } from "@google/genai";
import { ComplaintCategory } from "../types";

export async function analyzeComplaint(description: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following civic complaint and suggest the best category and urgency level. 
      Available Categories: ${Object.values(ComplaintCategory).join(', ')}.
      
      Complaint: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "The best fitting category for the complaint.",
            },
            urgency: {
              type: Type.STRING,
              enum: ["Low", "Medium", "High"],
              description: "Estimated urgency based on potential danger or inconvenience.",
            },
            summary: {
              type: Type.STRING,
              description: "A 10-word summary of the issue.",
            }
          },
          required: ["category", "urgency", "summary"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Gemini analysis failed", error);
    return null;
  }
}
