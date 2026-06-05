import type { PortfolioEntry, PortfolioEntryType } from "./portfolio";

export const PORTFOLIO_SCHEMA_VERSION = "2.0.0" as const;
export type PortfolioSchemaVersion = typeof PORTFOLIO_SCHEMA_VERSION;

export type AvailabilityState = "available" | "busy" | "offline";

export interface PortfolioDocumentMeta {
  lastUpdated: string;
  locale: string;
}

export interface AvatarAsset {
  src: string;
  alt: string;
}

export interface NeuralCoreStatus {
  label: string;
  state: AvailabilityState;
}

export interface NeuralCoreProfile {
  name: string;
  role: string;
  headline: string;
  tagline: string;
  location: string;
  timezone: string;
  avatar: AvatarAsset;
  status: NeuralCoreStatus;
  bio: string;
}

export type UiActionType =
  | "open-app"
  | "navigate"
  | "external-link"
  | "scroll";

export interface UiAction {
  type: UiActionType;
  label: string;
  appId?: string;
  target?: PortfolioEntryType | "overview" | "graph";
  url?: string;
  anchor?: string;
}

export interface NeuralCoreHero {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  primaryAction: UiAction;
  secondaryAction: UiAction;
}

export interface CurrentFocusItem {
  label: string;
  detail: string;
  priority: number;
}

export interface CurrentFocus {
  title: string;
  summary: string;
  items: CurrentFocusItem[];
}

export interface NeuralCore {
  profile: NeuralCoreProfile;
  hero: NeuralCoreHero;
  currentFocus: CurrentFocus;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  availability: string;
  responseTime: string;
  preferredChannels: string[];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  handle?: string;
  icon: string;
  primary?: boolean;
}

export interface ResumeFile {
  url: string;
  mimeType: string;
  label: string;
}

export interface ResumeAsset {
  title: string;
  file: ResumeFile;
  lastUpdated: string;
  languages: string[];
}

export interface AssistantPrompt {
  label: string;
  prompt: string;
}

export interface AssistantContext {
  includeSections: PortfolioEntryType[];
  maxEntriesPerSection: number;
}

export interface AiAssistantConfig {
  id: string;
  name: string;
  persona: string;
  greeting: string;
  disclaimer: string;
  suggestedPrompts: AssistantPrompt[];
  context: AssistantContext;
}

export interface TerminalShell {
  user: string;
  host: string;
  promptSuffix: string;
}

export type TerminalAction =
  | { type: "builtin"; command: string }
  | { type: "navigate"; target: PortfolioEntryType | "overview" | "graph" }
  | { type: "open-app"; appId: string }
  | { type: "query"; query: string };

export interface TerminalCommand {
  name: string;
  description: string;
  usage: string;
  action: TerminalAction;
  aliases?: string[];
}

export interface TerminalConfig {
  shell: TerminalShell;
  welcomeLines: string[];
  commands: TerminalCommand[];
}

export interface AppWindowSize {
  width: number;
  height: number;
}

export interface AppWindowConfig {
  defaultSize: AppWindowSize;
}

export type ContactFormFieldType = "text" | "email" | "textarea" | "select";

export interface ContactFormField {
  name: string;
  label: string;
  type: ContactFormFieldType;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  options?: string[];
}

export interface MailtoSubmitAction {
  type: "mailto";
  to: string;
  subject: string;
}

export interface ContactFormConfig {
  submitAction: MailtoSubmitAction;
  fields: ContactFormField[];
}

export interface ContactApplication {
  id: "contact";
  title: string;
  icon: string;
  description: string;
  enabled: boolean;
  window?: AppWindowConfig;
  form: ContactFormConfig;
}

export type ResumeViewerMode = "embed" | "new-tab";

export interface ResumeViewerConfig {
  mode: ResumeViewerMode;
  assetRef: "resume";
  allowDownload: boolean;
}

export interface ResumeApplication {
  id: "resume";
  title: string;
  icon: string;
  description: string;
  enabled: boolean;
  window?: AppWindowConfig;
  viewer: ResumeViewerConfig;
}

export interface AssistantApplication {
  id: "assistant";
  title: string;
  icon: string;
  description: string;
  enabled: boolean;
  window?: AppWindowConfig;
  configRef: "assistant";
}

export interface PortfolioApplications {
  contact: ContactApplication;
  resume: ResumeApplication;
  assistant: AssistantApplication;
}

/** Full v2 portfolio document */
export interface PortfolioDocument {
  schemaVersion: PortfolioSchemaVersion;
  meta: PortfolioDocumentMeta;
  neuralCore: NeuralCore;
  contact: ContactInfo;
  social: SocialLink[];
  resume: ResumeAsset;
  assistant: AiAssistantConfig;
  terminal: TerminalConfig;
  applications: PortfolioApplications;
  entries: PortfolioEntry[];
}

/** v1 on-disk format (legacy) */
export type PortfolioDataV1 = PortfolioEntry[];

export type RawPortfolioJson = PortfolioDataV1 | PortfolioDocument;
