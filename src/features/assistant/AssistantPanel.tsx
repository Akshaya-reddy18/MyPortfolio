import {
  useEffect,
  useRef,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Mic, MicOff, Minimize2, Send, X } from "lucide-react";
import { useAssistantChat } from "@/hooks/use-assistant-chat";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import type { PortfolioDocument } from "@/types";
import "./assistant-panel.css";

interface AssistantPanelProps {
  document: PortfolioDocument;
  onClose: () => void;
  onMinimize: () => void;
}

export function AssistantPanel({
  document,
  onClose,
  onMinimize,
}: AssistantPanelProps) {
  const {
    assistantConfig,
    messages,
    input,
    setInput,
    isThinking,
    sendMessage,
  } = useAssistantChat(document);

  const messagesRef = useRef<HTMLDivElement>(null);

  const { isSupported, isListening, startListening } = useSpeechRecognition(
    (transcript) => {
      setInput(transcript);
      sendMessage(transcript);
    },
  );

  useEffect(() => {
    const container = messagesRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="neural-assistant-panel" role="dialog" aria-label="NEURAL Assistant">
      <header className="neural-assistant-panel__header">
        <div className="neural-assistant-panel__identity">
          <div className="neural-assistant-panel__avatar" aria-hidden />
          <div>
            <p className="neural-assistant-panel__title">{assistantConfig.name}</p>
            <p className="neural-assistant-panel__subtitle">System AI · Control Center</p>
          </div>
        </div>
        <div className="neural-assistant-panel__actions">
          <button
            type="button"
            className="neural-assistant-panel__icon-btn"
            onClick={onMinimize}
            aria-label="Minimize assistant"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="neural-assistant-panel__icon-btn"
            onClick={onClose}
            aria-label="Close assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div ref={messagesRef} className="neural-assistant-panel__messages" aria-live="polite">
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "system"
                ? "neural-assistant-panel__bubble neural-assistant-panel__bubble--system"
                : message.role === "user"
                  ? "neural-assistant-panel__bubble neural-assistant-panel__bubble--user"
                  : "neural-assistant-panel__bubble neural-assistant-panel__bubble--assistant"
            }
          >
            {message.content}
          </div>
        ))}

        {isThinking && (
          <div className="neural-assistant-panel__typing" aria-label="Assistant is typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      {assistantConfig.suggestedPrompts.length > 0 && (
        <div className="neural-assistant-panel__prompts">
          {assistantConfig.suggestedPrompts.map((prompt) => (
            <button
              key={prompt.label}
              type="button"
              className="neural-assistant-panel__prompt"
              onClick={() => sendMessage(prompt.prompt)}
              disabled={isThinking}
            >
              {prompt.label}
            </button>
          ))}
        </div>
      )}

      <form className="neural-assistant-panel__composer" onSubmit={handleSubmit}>
        <textarea
          className="neural-assistant-panel__input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleComposerKeyDown}
          placeholder="Ask NEURAL anything about this portfolio…"
          rows={2}
          disabled={isThinking}
          aria-label="Message NEURAL Assistant"
        />
        <div className="neural-assistant-panel__composer-actions">
          {isSupported ? (
            <button
              type="button"
              className={
                isListening
                  ? "neural-assistant-panel__voice neural-assistant-panel__voice--active"
                  : "neural-assistant-panel__voice"
              }
              onClick={startListening}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
              disabled={isThinking}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="neural-assistant-panel__voice-fallback" title="Voice not supported">
              Voice unavailable
            </span>
          )}
          <button
            type="submit"
            className="neural-assistant-panel__send"
            disabled={isThinking || !input.trim()}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
