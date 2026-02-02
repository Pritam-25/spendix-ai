import { RemoveMessage, SystemMessage } from "@langchain/core/messages";
import { GraphNode, MessagesAnnotation } from "@langchain/langgraph";
import { model } from "../../model/gemini";

export const summarizeNode: GraphNode<typeof MessagesAnnotation.State> = async (
  state,
) => {
  console.log("🟡 [SummarizeNode] Running");

  const messages = state.messages;

  // first 60 messages → summarize
  const toSummarize = messages.slice(0, 60);

  const summaryPrompt = [
    new SystemMessage(
      "Summarize the conversation. Preserve financial, budget, and transaction context.",
    ),
    ...toSummarize,
  ];

  const summaryResponse = await model.invoke(summaryPrompt);

  const summaryMessage = new SystemMessage(
    `Conversation summary:\n${summaryResponse.content}`,
  );

  // delete summarized messages from memory
  const messagesWithIds = toSummarize.filter(
    (m): m is typeof m & { id: string } => Boolean(m.id),
  );

  const removals = messagesWithIds.map((m) => new RemoveMessage({ id: m.id }));

  return {
    messages: [...removals, summaryMessage],
  };
};
