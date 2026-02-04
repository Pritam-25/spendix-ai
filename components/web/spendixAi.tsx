"use client";

import { useMemo } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import {
  Loader2,
  BotMessageSquareIcon,
  BarChart3Icon,
  LayersIcon,
  WalletIcon,
  PieChartIcon,
  BrainIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";

import { Suggestion } from "@/components/ai-elements/suggestion";

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
  ConversationEmptyState,
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

  const handleSuggestionClick = (suggestion: string) => {
    if (!suggestion || isStreaming) return;

    handleSubmit({
      text: suggestion,
      files: [],
    });
  };

  const visibleMessages = messages.filter((m) => m.role !== "system");
  const hasMessages = visibleMessages.length > 0;

  return (
    <Sheet>
      {/* Floating Trigger */}
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        >
          <BotMessageSquareIcon className="size-7" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full max-w-md flex-col p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>Spendix Copilot</SheetTitle>
          <SheetDescription>
            Your personalised AI finance assistant.
          </SheetDescription>
        </SheetHeader>

        {/* Conversation */}
        <Conversation className="flex-1">
          <ConversationContent
            className={cn(
              !hasMessages && "flex h-full items-center justify-center",
            )}
          >
            {hasMessages ? (
              <>
                {visibleMessages.map((message) => (
                  <Message key={message.id} from={message.role}>
                    <MessageContent>
                      {message.role === "assistant" ? (
                        <MessageResponse>
                          {message.parts
                            ?.filter((part) => part.type === "text")
                            .map((part) => part.text)
                            .join("")}
                        </MessageResponse> //  Wrap AI messages in MessageResponse
                      ) : (
                        message.parts?.map(
                          (part) => part.type === "text" && part.text,
                        )
                      )}
                    </MessageContent>
                  </Message>
                ))}

                {isStreaming && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BrainIcon className="h-3.5 w-3.5 animate-pulse" />
                    Thinking…
                  </div>
                )}

                {error && (
                  <p className="text-xs text-destructive">
                    {error.message || "Something went wrong"}
                  </p>
                )}
              </>
            ) : (
              <ConversationEmptyState className="mx-auto w-full max-w-sm space-y-5 px-4 text-center">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Spendix Copilot
                  </p>
                  <p className="text-2xl font-semibold">
                    Your AI finance copilot
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get instant answers about spend, budgets, and runway.
                  </p>
                </div>

                <p className="text-xs text-muted-foreground/80">
                  Ask a question or choose a suggestion below.
                </p>

                <div className="space-y-2 text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Suggested prompts
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {suggestions.map((suggestion) => (
                      <Suggestion
                        key={suggestion.prompt}
                        suggestion={suggestion.prompt}
                        onClick={handleSuggestionClick}
                        disabled={isStreaming}
                        className="w-full justify-start text-left text-xs"
                      >
                        {suggestion.label}
                      </Suggestion>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground/70">
                  Spendix only uses your data. Nothing is shared or trained
                  externally.
                </p>
              </ConversationEmptyState>
            )}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>

        {/* Prompt Input */}
        <PromptInput onSubmit={handleSubmit} className="border-t px-4 py-4">
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Ask about spend, budgets..."
              disabled={isStreaming}
            />
          </PromptInputBody>

          <PromptInputFooter className="flex justify-end">
            <PromptInputSubmit
              status={isStreaming ? "streaming" : "ready"}
              disabled={isStreaming}
            />
          </PromptInputFooter>
        </PromptInput>
      </SheetContent>
    </Sheet>
  );
}

const suggestions = [
  {
    label: (
      <>
        <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
        <span>Financial summary of this month</span>
      </>
    ),
    prompt:
      "Give me a financial summary for this month including income and expenses",
  },
  {
    label: (
      <>
        <LayersIcon className="h-4 w-4 text-muted-foreground" />
        <span>Top spending categories of last month</span>
      </>
    ),
    prompt:
      "What are my top spending categories last month and how much did I spend in each?",
  },
  {
    label: (
      <>
        <WalletIcon className="h-4 w-4 text-muted-foreground" />
        <span>Budget overview of account</span>
      </>
    ),
    prompt:
      "Analyze my budgets and highlight any overspending, risks, or unusual patterns",
  },
];
