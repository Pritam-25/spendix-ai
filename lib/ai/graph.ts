import {
  StateGraph,
  MessagesAnnotation,
  ConditionalEdgeRouter,
  GraphNode,
} from "@langchain/langgraph";
import { SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { spendixTools } from "./tools";
import { SYSTEM_PROMPT } from "./prompt";

/* ----------------------------------------
   Gemini Model
----------------------------------------- */
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
}).bindTools(spendixTools);

/* ----------------------------------------
   Agent Node
----------------------------------------- */
const agentNode: GraphNode<typeof MessagesAnnotation.State> = async (state) => {
  console.log("🟢 [AgentNode] Invoked");

  console.log(
    "📩 Incoming messages:",
    state.messages.map((m) => ({ type: m.type, content: m.content })),
  );

  const hasSystem = state.messages.some((m) => m.type === "system");
  console.log("🧠 Has system prompt:", hasSystem);

  const messages = hasSystem
    ? state.messages
    : [new SystemMessage(SYSTEM_PROMPT), ...state.messages];

  console.log(
    "📤 Messages sent to Gemini:",
    messages.map((m) => ({ type: m.type, content: m.content })),
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
};

/* ----------------------------------------
   Tool Node
----------------------------------------- */
// ToolNode automatically handles Command objects returned by tools
const toolNode = new ToolNode(spendixTools);

/* ----------------------------------------
   Tool Router
----------------------------------------- */
// Conditional edge function to route to the tool node or end
const shouldContinue: ConditionalEdgeRouter<typeof MessagesAnnotation.State> = (
  state,
) => {
  const lastMessage = state.messages[state.messages.length - 1];
  const hasToolCall =
    "tool_calls" in lastMessage &&
    Array.isArray(lastMessage.tool_calls) &&
    lastMessage.tool_calls.length > 0;

  return hasToolCall ? "toolNode" : "__end__";
};

/* ----------------------------------------
   Graph
----------------------------------------- */
export const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", agentNode)
  .addNode("toolNode", toolNode)

  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue, ["toolNode", "__end__"])
  .addEdge("toolNode", "agent")
  .compile();

console.log("✅ Spendix StateGraph compiled successfully");
