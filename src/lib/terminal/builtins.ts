import type { TerminalContext } from "./execute-command";
import type { TerminalResult } from "./types";

export function runBuiltin(
  command: string,
  ctx: TerminalContext,
): TerminalResult {
  switch (command) {
    case "help":
      return formatHelp(ctx);
    case "whoami":
      return formatWhoami(ctx);
    case "clear":
      return { lines: [], clear: true };
    case "list-modules":
      return formatListModules(ctx);
    case "show-focus":
      return formatFocus(ctx);
    default:
      return {
        lines: [
          {
            text: `Unknown builtin command: ${command}`,
            kind: "error",
          },
        ],
      };
  }
}

function formatHelp(ctx: TerminalContext): TerminalResult {
  const lines = ctx.document.terminal.commands.flatMap((cmd) => {
    const aliases =
      cmd.aliases && cmd.aliases.length > 0
        ? ` (${cmd.aliases.join(", ")})`
        : "";
    return [
      {
        text: `${cmd.name.padEnd(12)} ${cmd.description}${aliases}`,
        kind: "output" as const,
      },
    ];
  });

  return {
    lines: [
      { text: "Available commands:", kind: "system" },
      ...lines,
    ],
  };
}

function formatWhoami(ctx: TerminalContext): TerminalResult {
  const { profile } = ctx.document.neuralCore;
  const { user } = ctx.document.terminal.shell;

  return {
    lines: [
      { text: `user     ${user}`, kind: "output" },
      { text: `name     ${profile.name}`, kind: "output" },
      { text: `role     ${profile.role}`, kind: "output" },
      { text: `location ${profile.location}`, kind: "output" },
      { text: `status   ${profile.status.label} (${profile.status.state})`, kind: "output" },
      { text: profile.headline, kind: "muted" },
    ],
  };
}

function formatListModules(_ctx: TerminalContext): TerminalResult {
  const modules = [
    "profile",
    "projects",
    "skills",
    "experience",
    "contact",
    "resume",
    "assistant",
    "terminal",
  ];

  return {
    lines: [
      { text: "OS modules:", kind: "system" },
      ...modules.map((name) => ({
        text: `  ${name}`,
        kind: "output" as const,
      })),
    ],
  };
}

function formatFocus(ctx: TerminalContext): TerminalResult {
  const { currentFocus } = ctx.document.neuralCore;
  const sorted = [...currentFocus.items].sort(
    (a, b) => a.priority - b.priority,
  );

  return {
    lines: [
      { text: currentFocus.title, kind: "system" },
      { text: currentFocus.summary, kind: "muted" },
      ...sorted.flatMap((item) => [
        {
          text: `[P${item.priority}] ${item.label}`,
          kind: "output" as const,
        },
        {
          text: `         ${item.detail}`,
          kind: "muted" as const,
        },
      ]),
    ],
  };
}
