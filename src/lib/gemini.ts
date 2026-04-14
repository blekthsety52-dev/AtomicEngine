import { GoogleGenAI, Type } from "@google/genai";
import { AtomicObject, BrandKit } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateAtomicObjects(
  prompt: string,
  brandKit: BrandKit,
  context: string = ""
): Promise<AtomicObject[]> {
  const systemInstruction = `
    You are the AtomicEngine AI, a sophisticated production engine.
    Your task is to generate a set of structured, layered "Atomic Objects" for a canvas based on a user prompt.
    
    Current Brand Kit:
    - Primary Color: ${brandKit.primaryColor}
    - Secondary Color: ${brandKit.secondaryColor}
    - Accent Color: ${brandKit.accentColor}
    - Sans Font: ${brandKit.fontSans}
    - Display Font: ${brandKit.fontDisplay}
    
    Context: ${context}
    
    Return a list of objects that form a cohesive design (e.g., a presentation slide, a social media post, a business card).
    Each object must follow the AtomicObject structure.
    Coordinates are 0-1000 (percentage based for responsiveness).
    Types: 'text', 'image', 'shape', 'chart', 'logo'.
    
    For 'text': content is { text: string }.
    For 'shape': content is { shapeType: 'rect'|'circle'|'triangle' }.
    For 'chart': content is { chartType: 'bar'|'line'|'pie', data: [{label: string, value: number}] }.
    For 'image': content is { keyword: string }.
    For 'logo': content is { logoType: 'default' }.
    
    Ensure the design is professional and follows the brand kit.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['text', 'image', 'shape', 'chart', 'logo'] },
            x: { type: Type.NUMBER },
            y: { type: Type.NUMBER },
            width: { type: Type.NUMBER },
            height: { type: Type.NUMBER },
            rotation: { type: Type.NUMBER },
            zIndex: { type: Type.NUMBER },
            content: { type: Type.OBJECT },
            style: { type: Type.OBJECT },
          },
          required: ['id', 'type', 'x', 'y', 'width', 'height', 'content', 'style'],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
}
