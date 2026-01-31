import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { createUIMessageStreamResponse, type UIMessage } from "ai";

import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";

import { graph } from "@/lib/ai/graph";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = (await req.json()) as {
      messages?: UIMessage[];
    };

    if (!body.messages || body.messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    // Convert Vercel UI messages → LangChain messages
    const langchainMessages = await toBaseMessages(body.messages);

    // Stream from LangGraph
    const stream = await graph.stream(
      { messages: langchainMessages },
      {
        streamMode: ["values", "messages"],
        configurable: { userId },
      },
    );

    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (error) {
    console.error("[Spendix AI] Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
