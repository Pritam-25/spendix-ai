import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const memoryModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  maxOutputTokens: 1024,
  
});
