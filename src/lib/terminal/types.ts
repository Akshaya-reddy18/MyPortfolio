export type TerminalLineKind =
  | "default"
  | "system"
  | "success"
  | "error"
  | "muted"
  | "output";

export interface TerminalLine {
  text: string;
  kind?: TerminalLineKind;
}

export interface TerminalResult {
  lines: TerminalLine[];
  clear?: boolean;
}
