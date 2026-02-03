import {
  ConditionalEdgeRouter,
  MessagesAnnotation,
} from "@langchain/langgraph";

export const routeFromAgent: ConditionalEdgeRouter<
  typeof MessagesAnnotation.State
> = (state) => {
  const recentMessages = state.messages.slice(-10);
  const recentToolCalls = recentMessages.filter(
    (message): message is typeof message & { tool_calls: unknown[] } =>
      "tool_calls" in message &&
      Array.isArray((message as { tool_calls?: unknown[] }).tool_calls) &&
      ((message as { tool_calls?: unknown[] }).tool_calls?.length ?? 0) > 0,
  );

  if (recentToolCalls.length >= 3) {
    console.warn("🟠 [RouteFromAgent] Ending due to excessive tool retries");
    return "__end__";
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
