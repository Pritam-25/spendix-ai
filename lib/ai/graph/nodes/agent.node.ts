import { SystemMessage } from "@langchain/core/messages";
import { GraphNode, MessagesAnnotation } from "@langchain/langgraph";
import { model } from "../../model/gemini";
import { SYSTEM_PROMPT } from "../../prompt";

export const agentNode: GraphNode<typeof MessagesAnnotation.State> = async (
  state,
) => {
  console.log("🟢 [AgentNode] Invoked");

  console.log(
    "📩 Incoming messages:",
    state.messages.map((m) => ({ type: m.type, content: m.content })),
  );

  try {
    const nonSystemMessages = state.messages.filter(
      (message) => message.type !== "system",
    );

    const messages = [new SystemMessage(SYSTEM_PROMPT), ...nonSystemMessages];

    const response = await model.invoke(messages);

    console.log("✅ Gemini raw response:", response);
    console.log("🧾 Gemini content:", response.content);
    console.log("🛠️ Gemini tool calls:", response.tool_calls);

    return { messages: [response] };
  } catch (error) {
    console.error("❌ AgentNode failed", {
      error,
      lastMessage: state.messages.at(-1),
    });

    // 🟢 User-safe fallback (DO NOT leak internals)
    return {
      messages: [toUserSafeMessage()],
    };
  }
};

function toUserSafeMessage() {
  return new SystemMessage(
    "I'm having trouble processing that right now. Please try again in a moment.",
  );
}
