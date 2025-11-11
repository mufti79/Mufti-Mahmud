
import { GoogleGenAI, Type } from "@google/genai";
import type { Slide } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const slideSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "A concise and engaging title for the slide."
      },
      content: {
        type: Type.ARRAY,
        description: "An array of strings, where each string is a bullet point or a short paragraph for the slide body.",
        items: {
          type: Type.STRING
        }
      }
    },
    required: ["title", "content"]
  }
};

export async function generateSlidesFromText(text: string): Promise<Slide[]> {
  try {
    const prompt = `
      Based on the following text, create a comprehensive and well-structured presentation. 
      The presentation should have a logical flow, with an introduction, main points, and a conclusion.
      Each slide must have a clear title and bullet points summarizing the key information.
      Ensure the content is broken down into digestible slides.
      Generate at least 5 slides, but more if the content warrants it.

      Here is the source text:
      ---
      ${text}
      ---
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: slideSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const slides = JSON.parse(jsonText) as Slide[];
    return slides;

  } catch (error) {
    console.error("Error generating slides:", error);
    throw new Error("Failed to generate presentation slides from Gemini API.");
  }
}
