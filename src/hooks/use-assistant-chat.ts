import { useCallback, useMemo, useState } from "react";
import {
  buildKnowledgeBase,
  buildRetrievalQuery,
  composeAssistantResponse,
} from "@/lib/assistant";
import type { PortfolioDocument } from "@/types";

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

let messageCounter = 0;

function nextMessageId(): string {
  messageCounter += 1;
  return `msg-${messageCounter}`;
}

export function useAssistantChat(document: PortfolioDocument) {
  const assistantConfig = document.assistant;
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: nextMessageId(),
      role: "system",
      content: assistantConfig.disclaimer,
    },
    {
      id: nextMessageId(),
      role: "assistant",
      content: assistantConfig.greeting,
    },
  ]);

  const knowledgeBase = useMemo(
    () => buildKnowledgeBase(document, assistantConfig.context),
    [assistantConfig.context, document],
  );

  const sendMessage = useCallback(
    (rawText: string) => {
      const text = rawText.trim();
      if (!text || isThinking) return;

      const userMessage: ChatMessage = {
        id: nextMessageId(),
        role: "user",
        content: text,
      };

      setMessages((prev) => {
        const next = [...prev, userMessage];
        setIsThinking(true);

        window.setTimeout(() => {
          const recentUserMessages = next
            .filter((message) => message.role === "user")
            .map((message) => message.content);

          const retrievalQuery = buildRetrievalQuery(text, recentUserMessages);
          const response = composeAssistantResponse(knowledgeBase, retrievalQuery);

          setMessages((current) => [
            ...current,
            {
              id: nextMessageId(),
              role: "assistant",
              content: response,
            },
          ]);
          setIsThinking(false);
        }, 400);

        return next;
      });

      setInput("");
    },
    [isThinking, knowledgeBase],
  );

  return {
    assistantConfig,
    messages,
    input,
    setInput,
    isThinking,
    sendMessage,
  };
}
