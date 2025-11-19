import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSearchQuery = async (query: string) => {
  try {
    const ai = getAI();
    const prompt = `
    You are a helper for a file system catalog.
    The user is searching for files using natural language in Portuguese or English.
    Convert the user's query into structured search parameters.

    User Query: "${query}"

    Available parameters:
    - query: keywords to search in filename (string)
    - type: one of ['imagem', 'video', 'audio', 'documento', 'arquivo', 'executavel', 'codigo', 'outros'] (string)
    - minSizeMB: minimum size in Megabytes (number)
    - minSizeGB: minimum size in Gigabytes (number)

    Return JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING },
            type: { type: Type.STRING },
            minSizeMB: { type: Type.NUMBER },
            minSizeGB: { type: Type.NUMBER },
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const suggestFileOrganization = async (filesSample: string[]) => {
  try {
    const ai = getAI();
    const prompt = `
      I have a list of files on my hard drive. Analyze them and suggest a folder structure or cleanup strategy in Portuguese.
      
      Files:
      ${filesSample.slice(0, 50).join('\n')}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Organization Error:", error);
    return "Não foi possível gerar sugestões no momento.";
  }
};
