import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { spendixTools } from "../tools";

export const chatModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
}).bindTools(spendixTools);
