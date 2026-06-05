import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import type { AppWindowProps } from "@/features/desktop/types";
import { useWindowManager } from "@/features/desktop/window-manager/window-manager-context";
import {
  executeTerminalInput,
  type TerminalLine,
  type TerminalLineKind,
} from "@/lib/terminal";
import type { PortfolioCollections, PortfolioDocument } from "@/types";
import { AppGateWithCollections } from "./components/AppGate";

interface HistoryEntry {
  input: string;
  lines: TerminalLine[];
}

function PromptLabel({
  user,
  host,
  suffix,
}: {
  user: string;
  host: string;
  suffix: string;
}) {
  return (
    <>
      <span className="akshaya-terminal__user">{user}</span>
      <span className="akshaya-terminal__prompt">@</span>
      <span className="akshaya-terminal__host">{host}</span>
      <span className="akshaya-terminal__path">:{suffix}</span>
    </>
  );
}

function lineClassName(kind: TerminalLineKind = "default"): string {
  switch (kind) {
    case "system":
      return "akshaya-terminal__line akshaya-terminal__line--system";
    case "success":
      return "akshaya-terminal__line akshaya-terminal__line--success";
    case "error":
      return "akshaya-terminal__line akshaya-terminal__line--error";
    case "muted":
      return "akshaya-terminal__line akshaya-terminal__line--muted";
    case "output":
      return "akshaya-terminal__line akshaya-terminal__output";
    default:
      return "akshaya-terminal__line";
  }
}

function TerminalSession({
  document,
  collections,
  openApp,
}: {
  document: PortfolioDocument;
  collections: PortfolioCollections;
  openApp: (appId: string) => void;
}) {
  const { shell, welcomeLines } = document.terminal;
  const viewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    welcomeLines.map((text) => ({
      input: "",
      lines: [{ text, kind: "system" as const }],
    })),
  );
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const scrollToBottom = useCallback(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const runCommand = useCallback(
    (rawInput: string) => {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      const result = executeTerminalInput(trimmed, {
        document,
        collections,
        openApp,
      });

      if (result.clear) {
        setHistory([]);
        setInput("");
        setHistoryIndex(-1);
        return;
      }

      setHistory((prev) => [
        ...prev,
        {
          input: trimmed,
          lines: result.lines,
        },
      ]);
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
      setInput("");
    },
    [collections, document, openApp],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    runCommand(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex =
        historyIndex < 0
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex] ?? "");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex < 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex] ?? "");
      }
    }
  };

  return (
    <div
      className="akshaya-terminal akshaya-terminal--scanlines h-full"
      onClick={() => inputRef.current?.focus()}
    >
      <header className="akshaya-terminal__header">
        <span className="akshaya-terminal__header-badge">SHELL</span>
        <span>Neural Terminal</span>
      </header>

      <div
        ref={viewportRef}
        className="akshaya-terminal__viewport"
        aria-live="polite"
      >
        {history.map((entry, index) => (
          <div key={`${entry.input}-${index}`}>
            {entry.input && (
              <p className="akshaya-terminal__line">
                <PromptLabel
                  user={shell.user}
                  host={shell.host}
                  suffix={shell.promptSuffix}
                />{" "}
                <span className="akshaya-terminal__command">{entry.input}</span>
              </p>
            )}
            {entry.lines.map((line, lineIndex) => (
              <p
                key={`${line.text}-${lineIndex}`}
                className={lineClassName(line.kind)}
              >
                {line.text}
              </p>
            ))}
          </div>
        ))}
      </div>

      <form
        className="akshaya-terminal__input-row"
        onSubmit={handleSubmit}
      >
        <span className="akshaya-terminal__prompt shrink-0">
          <PromptLabel
            user={shell.user}
            host={shell.host}
            suffix={shell.promptSuffix}
          />
        </span>
        <input
          ref={inputRef}
          className="akshaya-terminal__input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoFocus
          aria-label="Terminal command input"
        />
      </form>
    </div>
  );
}

export function TerminalApp(_props: AppWindowProps) {
  const { openAppFromDock } = useWindowManager();

  return (
    <AppGateWithCollections>
      {({ document, collections }) => (
        <TerminalSession
          document={document}
          collections={collections}
          openApp={openAppFromDock}
        />
      )}
    </AppGateWithCollections>
  );
}
