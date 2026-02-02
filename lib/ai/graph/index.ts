import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { agentNode } from "./nodes/agent.node";
import { toolNode } from "./nodes/tool.node";
import { checkpointer } from "./memory/checkpointer";
import { summarizeNode } from "./nodes/summarize.node";
import { routeFromAgent } from "./routers/routeFromAgent";

export const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", agentNode)
  .addNode("summarize", summarizeNode)
  .addNode("toolNode", toolNode)

  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", routeFromAgent, [
    "summarize",
    "toolNode",
    "__end__",
  ])
  .addEdge("summarize", "agent")
  .addEdge("toolNode", "agent")

  .compile({ checkpointer });
