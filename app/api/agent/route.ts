import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { createUIMessageStreamResponse, type UIMessage } from "ai";

import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";

import { chatGraph, memoryGraph } from "@/lib/ai/graph";
import { ensureCheckpointerReady } from "@/lib/ai/graph/memory/checkpointer";
import { ensureMemoryStoreReady } from "@/lib/ai/graph/memory/store";

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
    const humanMessages = langchainMessages.filter(
      (message) => message.type === "human",
    );

    try {
      await Promise.all([ensureCheckpointerReady(), ensureMemoryStoreReady()]);
    } catch (initError) {
      console.error("[Spendix AI] Storage initialization failed", initError);
      return NextResponse.json(
        { error: "AI storage is unavailable. Please try again shortly." },
        { status: 503 },
      );
    }

    // Stream from LangGraph
    const stream = await chatGraph.stream(
      { messages: langchainMessages },
      {
        streamMode: ["values", "messages"],
        configurable: {
          thread_id: userId, // 👈 short-term memory key
          userId, // 👈 for tools / auth / DB queries
        },
      },
    );

    if (humanMessages.length > 0) {
      void memoryGraph
        .invoke(
          { messages: humanMessages },
          {
            configurable: {
              thread_id: userId,
              userId,
            },
          },
        )
        .catch((memoryError) =>
          console.error("[Spendix AI] Memory graph failed", memoryError),
        );
    }

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
