import {
  ConditionalEdgeRouter,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { MEMORY_CONFIG } from "../memory/memory.config";

export const routeFromAgent: ConditionalEdgeRouter<
  typeof MessagesAnnotation.State
> = (state) => {
  if (state.messages.length > MEMORY_CONFIG.SUMMARIZE_TRIGGER) {
    console.log(
      "🟠 [RouteFromAgent] Routing to summarize due to message count",
    );
    return "summarize";
  }

  const lastMessage = state.messages[state.messages.length - 1];

  const hasToolCall =
    "tool_calls" in lastMessage &&
    Array.isArray(lastMessage.tool_calls) &&
    lastMessage.tool_calls.length > 0;

  console.log(
    `🟠 [RouteFromAgent] Routing to ${
      hasToolCall ? "toolNode" : "__end__"
    } based on tool call presence`,
  );

  return hasToolCall ? "toolNode" : "__end__";
};
