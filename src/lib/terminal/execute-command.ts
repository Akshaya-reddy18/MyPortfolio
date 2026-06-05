import type { PortfolioCollections, PortfolioDocument } from "@/types";
import type { TerminalAction, TerminalCommand } from "@/types/portfolio-document";
import { runBuiltin } from "./builtins";
import type { TerminalLine, TerminalResult } from "./types";

const NAVIGATE_APP_MAP: Record<string, string> = {
  project: "projects",
  skill: "skills",
  experience: "experience",
  overview: "profile",
  graph: "profile",
};

export interface TerminalContext {
  document: PortfolioDocument;
  collections: PortfolioCollections;
  openApp: (appId: string) => void;
}

function findCommand(
  input: string,
  commands: TerminalCommand[],
): TerminalCommand | undefined {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return undefined;

  return commands.find(
    (cmd) =>
      cmd.name.toLowerCase() === normalized ||
      cmd.aliases?.some((alias) => alias.toLowerCase() === normalized),
  );
}

function dispatchAction(
  action: TerminalAction,
  ctx: TerminalContext,
): TerminalResult {
  switch (action.type) {
    case "builtin":
      return runBuiltin(action.command, ctx);
    case "open-app": {
      ctx.openApp(action.appId);
      return {
        lines: [
          {
            text: `Opening ${action.appId}…`,
            kind: "success",
          },
        ],
      };
    }
    case "navigate": {
      const appId = NAVIGATE_APP_MAP[action.target];
      if (!appId) {
        return {
          lines: [
            {
              text: `Unknown navigation target: ${action.target}`,
              kind: "error",
            },
          ],
        };
      }
      ctx.openApp(appId);
      return {
        lines: [
          {
            text: `Opening ${appId}…`,
            kind: "success",
          },
        ],
      };
    }
    case "query":
      ctx.openApp("assistant");
      return {
        lines: [
          {
            text: "Opening NEURAL Assistant…",
            kind: "success",
          },
          {
            text: `Query: ${action.query}`,
            kind: "muted",
          },
        ],
      };
    default:
      return {
        lines: [{ text: "Unsupported command action.", kind: "error" }],
      };
  }
}

export function executeTerminalInput(
  input: string,
  ctx: TerminalContext,
): TerminalResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const command = findCommand(trimmed, ctx.document.terminal.commands);
  if (!command) {
    return {
      lines: [
        {
          text: `Command not found: ${trimmed}`,
          kind: "error",
        },
        {
          text: "Type 'help' for available commands.",
          kind: "muted",
        },
      ],
    };
  }

  return dispatchAction(command.action, ctx);
}

export function formatPrompt(document: PortfolioDocument): TerminalLine[] {
  const { user, host, promptSuffix } = document.terminal.shell;
  return [
    {
      text: `${user}@${host}:${promptSuffix}`,
      kind: "default",
    },
  ];
}
