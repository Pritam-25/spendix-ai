"use client";

import { useMemo, useState } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { Send, Loader2, MessageCircle } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/cn";

export function SpendixChatSheet() {
  const [draft, setDraft] = useState("");

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/agent" }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  const isStreaming = status === "streaming" || status === "submitted";
  const canSend = draft.trim().length > 0 && !isStreaming;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) return;

    await sendMessage({
      role: "user",
      parts: [{ type: "text", text: draft.trim() }],
    });

    setDraft("");
  };

  const visibleMessages = messages.filter(
    (message) => message.role !== "system",
  );

  return (
    <Sheet>
      {/* Trigger */}
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      {/* Sheet Content */}
      <SheetContent side="right" className="flex w-full max-w-md flex-col p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>Spendix Assistant</SheetTitle>
          <SheetDescription>
            Ask about your expenses and spending habits
          </SheetDescription>
        </SheetHeader>

        {/* Messages */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
          {visibleMessages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Ask me about your last month&apos;s expenses.
            </p>
          )}

          {visibleMessages.map((message) => {
            const text =
              message.parts
                ?.map((part) =>
                  part.type === "text" ? part.text : "",
                )
                .join("\n") ?? "";

            return (
              <div
                key={message.id}
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                  message.role === "assistant"
                    ? "self-start bg-secondary text-secondary-foreground"
                    : "self-end bg-primary text-primary-foreground",
                )}
              >
                {text}
              </div>
            );
          })}

          {isStreaming && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Thinking…
            </div>
          )}

          {error && (
            <p className="text-xs text-destructive">
              {error.message || "Something went wrong"}
            </p>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t px-4 py-3"
        >
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask Spendix…"
            className="mb-2 min-h-[80px] resize-none"
          />

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!canSend}>
              Send
              {isStreaming ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
