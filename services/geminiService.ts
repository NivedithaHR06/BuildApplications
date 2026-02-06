
import { GoogleGenAI, Type } from "@google/genai";
import { MODELS, SYSTEM_INSTRUCTION } from "../constants";
import { AppMode, Quiz, StudyPlan, Summary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getExplanation = async (prompt: string, mode: AppMode) => {
  const model = MODELS.FAST;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + `\n\nCurrent mode: ${mode}. Provide a helpful text explanation with examples.`,
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text || "I'm sorry, I couldn't generate a response.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Source",
      uri: chunk.web?.uri || ""
    })).filter((s: any) => s.uri) || []
  };
};

export const generateQuiz = async (topic: string): Promise<Quiz> => {
  const response = await ai.models.generateContent({
    model: MODELS.FAST,
    contents: `Generate a 5-question multiple choice quiz about: ${topic}. Provide the output in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        },
        required: ["title", "questions"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    throw new Error("Failed to parse quiz data");
  }
};

export const generateStudyPlan = async (goal: string): Promise<StudyPlan> => {
  const response = await ai.models.generateContent({
    model: MODELS.FAST,
    contents: `Create a structured study plan for: ${goal}. Provide the output in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                duration: { type: Type.STRING, description: "e.g. '2 hours' or 'Day 1'" },
                description: { type: Type.STRING },
                resources: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["topic", "duration", "description", "resources"]
            }
          }
        },
        required: ["title", "items"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    throw new Error("Failed to parse study plan data");
  }
};

export const generateSummary = async (text: string): Promise<Summary> => {
  const response = await ai.models.generateContent({
    model: MODELS.FAST,
    contents: `Summarize the following content and provide key takeaways: ${text}. Provide the output in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mainPoint: { type: Type.STRING },
          takeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
          context: { type: Type.STRING, description: "One sentence context" }
        },
        required: ["mainPoint", "takeaways"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    throw new Error("Failed to parse summary data");
  }
};
