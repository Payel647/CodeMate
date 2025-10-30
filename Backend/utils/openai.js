import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const getOpenAIAPIResponse= async(message)=>{
    try {
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: message,
    config: {
      systemInstruction: "You are a helpful coding assistant.",
    },
  });
  return response.text;
  } catch (err) {
    console.error("Error:", err);
    return "Error occurred while fetching response from AI.";
  }
}
export default getOpenAIAPIResponse;