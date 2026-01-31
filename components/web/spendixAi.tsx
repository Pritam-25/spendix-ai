"use client";

import { useMemo } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { Loader2, MessageCircle } from "lucide-react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";

import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

export function SpendixChatSheet() {
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/agent" }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  const isStreaming = status === "streaming" || status === "submitted";

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: message.text.trim() }],
    });
  };

  const visibleMessages = messages.filter((m) => m.role !== "system");

  return (
    <Sheet>
      {/* Floating Trigger */}
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full max-w-md flex-col p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>Spendix Assistant</SheetTitle>
          <SheetDescription>
            Ask about your expenses and spending habits
          </SheetDescription>
        </SheetHeader>

        {/* Conversation */}
        <Conversation className="flex-1">
          <ConversationContent>
            {visibleMessages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Ask me about your last month&apos;s expenses.
              </p>
            )}

            {visibleMessages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts
                    ?.filter((part) => part.type === "text")
                    .map((part, i) => (
                      <MessageResponse key={`${message.id}-${i}`}>
                        {part.text}
                      </MessageResponse>
                    ))}
                </MessageContent>
              </Message>
            ))}

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
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>

        {/* Prompt Input */}
        <PromptInput onSubmit={handleSubmit} className="border-t px-4 py-3">
          <PromptInputBody>
            <PromptInputTextarea placeholder="Ask Spendix…" />
          </PromptInputBody>

          <PromptInputFooter className="flex justify-end">
            <PromptInputSubmit status={isStreaming ? "streaming" : "ready"} />
          </PromptInputFooter>
        </PromptInput>
      </SheetContent>
    </Sheet>
  );
}
