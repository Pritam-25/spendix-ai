import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { spendixTools } from "./tools";

/* ----------------------------------------
   System Prompt
----------------------------------------- */
const SYSTEM_PROMPT = `
You are Spendix, a focused financial assistant.

Rules:
- You can ONLY report the user's total EXPENSE for last month.
- If the user asks about last month spending, call fetch_last_month_expense.
- Answer numeric-first and concise.
- Never fabricate numbers.
- If the question is outside scope, politely explain the limitation.
`;

/* ----------------------------------------
   Gemini Model
----------------------------------------- */
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  temperature: 0,
}).bindTools(spendixTools);

/* ----------------------------------------
   Agent Node
----------------------------------------- */
async function agentNode(state: typeof MessagesAnnotation.State) {
  console.log("🟢 [AgentNode] Invoked");

  console.log(
    "📩 Incoming messages:",
    state.messages.map((m) => ({ type: m.getType(), content: m.content })),
  );

  const hasSystem = state.messages.some((m) => m.getType() === "system");
  console.log("🧠 Has system prompt:", hasSystem);

  const messages = hasSystem
    ? state.messages
    : [new SystemMessage(SYSTEM_PROMPT), ...state.messages];

  console.log(
    "📤 Messages sent to Gemini:",
    messages.map((m) => ({ type: m.getType(), content: m.content })),
  );

  try {
    const response = await model.invoke(messages);

    console.log("✅ Gemini raw response:", response);
    console.log("🧾 Gemini content:", response.content);
    console.log("🛠️ Gemini tool calls:", response.tool_calls);

    return { messages: [response] };
  } catch (error) {
    console.error("❌ Gemini invocation failed:", error);
    throw error;
  }
}

/* ----------------------------------------
   Tool Node
----------------------------------------- */
// ToolNode automatically handles Command objects returned by tools
const toolNode = new ToolNode(spendixTools);

/* ----------------------------------------
   Tool Router
----------------------------------------- */
function shouldCallTool(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1];
  const hasToolCall =
    "tool_calls" in lastMessage &&
    Array.isArray(lastMessage.tool_calls) &&
    lastMessage.tool_calls.length > 0;
  console.log("🔀 Should call tool?", hasToolCall);
  return hasToolCall ? "tools" : "__end__";
}

/* ----------------------------------------
   Graph
----------------------------------------- */
export const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", agentNode)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldCallTool)
  .addEdge("tools", "agent")
  .compile();

console.log("✅ Spendix StateGraph compiled successfully");
