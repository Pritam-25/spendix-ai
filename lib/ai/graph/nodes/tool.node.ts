import { ToolNode } from "@langchain/langgraph/prebuilt";
import { spendixTools } from "../../tools";

export const toolNode = new ToolNode(spendixTools);
