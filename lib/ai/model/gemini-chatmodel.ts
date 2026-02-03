import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { spendixTools } from "../tools";

export const chatModel = new ChatGoogleGenerativeAI({
  model: "gemini-3-flash-preview",
  temperature: 0,
}).bindTools(spendixTools);
