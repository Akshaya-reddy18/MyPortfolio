import {
  PORTFOLIO_ENTRY_TYPES,
  PORTFOLIO_SCHEMA_VERSION,
  type AiAssistantConfig,
  type ContactApplication,
  type ContactFormField,
  type ContactFormFieldType,
  type ContactInfo,
  type CurrentFocus,
  type NeuralCore,
  type NeuralCoreHero,
  type NeuralCoreProfile,
  type PortfolioApplications,
  type PortfolioDocument,
  type PortfolioDocumentMeta,
  type PortfolioEntryType,
  type ResumeApplication,
  type ResumeAsset,
  type SocialLink,
  type TerminalAction,
  type TerminalCommand,
  type TerminalConfig,
  type UiAction,
} from "@/types";
import { parsePortfolioEntry } from "./type-guards";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function requireString(
  obj: Record<string, unknown>,
  key: string,
  label: string,
): string {
  const value = obj[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label}: missing or invalid "${key}"`);
  }
  return value;
}

function optionalString(
  obj: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = obj[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new Error(`Invalid optional field "${key}"`);
  }
  return value;
}

function requireNumber(
  obj: Record<string, unknown>,
  key: string,
  label: string,
): number {
  const value = obj[key];
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${label}: missing or invalid "${key}"`);
  }
  return value;
}

function requireBoolean(
  obj: Record<string, unknown>,
  key: string,
  label: string,
): boolean {
  const value = obj[key];
  if (typeof value !== "boolean") {
    throw new Error(`${label}: missing or invalid "${key}"`);
  }
  return value;
}

function parseMeta(raw: unknown): PortfolioDocumentMeta {
  if (!isRecord(raw)) throw new Error("meta: expected object");
  return {
    lastUpdated: requireString(raw, "lastUpdated", "meta"),
    locale: requireString(raw, "locale", "meta"),
  };
}

function parseNeuralCoreProfile(raw: unknown): NeuralCoreProfile {
  if (!isRecord(raw)) throw new Error("neuralCore.profile: expected object");
  const label = "neuralCore.profile";
  const avatarRaw = raw.avatar;
  if (!isRecord(avatarRaw)) {
    throw new Error(`${label}: avatar must be an object`);
  }
  const statusRaw = raw.status;
  if (!isRecord(statusRaw)) {
    throw new Error(`${label}: status must be an object`);
  }
  const state = statusRaw.state;
  if (state !== "available" && state !== "busy" && state !== "offline") {
    throw new Error(`${label}: invalid status.state`);
  }

  return {
    name: requireString(raw, "name", label),
    role: requireString(raw, "role", label),
    headline: requireString(raw, "headline", label),
    tagline: requireString(raw, "tagline", label),
    location: requireString(raw, "location", label),
    timezone: requireString(raw, "timezone", label),
    avatar: {
      src: requireString(avatarRaw, "src", `${label}.avatar`),
      alt: requireString(avatarRaw, "alt", `${label}.avatar`),
    },
    status: {
      label: requireString(statusRaw, "label", `${label}.status`),
      state,
    },
    bio: requireString(raw, "bio", label),
  };
}

function parseUiAction(raw: unknown, label: string): UiAction {
  if (!isRecord(raw)) throw new Error(`${label}: expected object`);
  const type = raw.type;
  if (
    type !== "open-app" &&
    type !== "navigate" &&
    type !== "external-link" &&
    type !== "scroll"
  ) {
    throw new Error(`${label}: invalid action type`);
  }

  const action: UiAction = {
    type,
    label: requireString(raw, "label", label),
  };

  if (type === "open-app") {
    action.appId = requireString(raw, "appId", label);
  }
  if (type === "navigate") {
    const target = raw.target;
    if (typeof target !== "string") {
      throw new Error(`${label}: navigate requires target`);
    }
    action.target = target as UiAction["target"];
  }
  if (type === "external-link") {
    action.url = requireString(raw, "url", label);
  }
  if (type === "scroll") {
    action.anchor = requireString(raw, "anchor", label);
  }

  return action;
}

function parseNeuralCoreHero(raw: unknown): NeuralCoreHero {
  if (!isRecord(raw)) throw new Error("neuralCore.hero: expected object");
  if (!isStringArray(raw.highlights)) {
    throw new Error("neuralCore.hero: highlights must be a string array");
  }

  return {
    eyebrow: requireString(raw, "eyebrow", "neuralCore.hero"),
    title: requireString(raw, "title", "neuralCore.hero"),
    subtitle: requireString(raw, "subtitle", "neuralCore.hero"),
    description: requireString(raw, "description", "neuralCore.hero"),
    highlights: raw.highlights,
    primaryAction: parseUiAction(raw.primaryAction, "neuralCore.hero.primaryAction"),
    secondaryAction: parseUiAction(
      raw.secondaryAction,
      "neuralCore.hero.secondaryAction",
    ),
  };
}

function parseCurrentFocus(raw: unknown): CurrentFocus {
  if (!isRecord(raw)) throw new Error("currentFocus: expected object");
  if (!Array.isArray(raw.items)) {
    throw new Error("currentFocus: items must be an array");
  }

  const items = raw.items.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`currentFocus.items[${index}]: expected object`);
    }
    return {
      label: requireString(item, "label", `currentFocus.items[${index}]`),
      detail: requireString(item, "detail", `currentFocus.items[${index}]`),
      priority: requireNumber(item, "priority", `currentFocus.items[${index}]`),
    };
  });

  return {
    title: requireString(raw, "title", "currentFocus"),
    summary: requireString(raw, "summary", "currentFocus"),
    items,
  };
}

function parseNeuralCore(raw: unknown): NeuralCore {
  if (!isRecord(raw)) throw new Error("neuralCore: expected object");
  return {
    profile: parseNeuralCoreProfile(raw.profile),
    hero: parseNeuralCoreHero(raw.hero),
    currentFocus: parseCurrentFocus(raw.currentFocus),
  };
}

function parseContact(raw: unknown): ContactInfo {
  if (!isRecord(raw)) throw new Error("contact: expected object");
  const preferred = raw.preferredChannels;
  if (!isStringArray(preferred)) {
    throw new Error("contact: preferredChannels must be a string array");
  }

  return {
    email: requireString(raw, "email", "contact"),
    phone: optionalString(raw, "phone"),
    availability: requireString(raw, "availability", "contact"),
    responseTime: requireString(raw, "responseTime", "contact"),
    preferredChannels: preferred,
  };
}

function parseSocial(raw: unknown): SocialLink[] {
  if (!Array.isArray(raw)) throw new Error("social: expected array");
  return raw.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`social[${index}]: expected object`);
    }
    const label = `social[${index}]`;
    return {
      id: requireString(item, "id", label),
      platform: requireString(item, "platform", label),
      url: requireString(item, "url", label),
      handle: optionalString(item, "handle"),
      icon: requireString(item, "icon", label),
      primary:
        item.primary === undefined
          ? undefined
          : requireBoolean(item, "primary", label),
    };
  });
}

function parseResume(raw: unknown): ResumeAsset {
  if (!isRecord(raw)) throw new Error("resume: expected object");
  const fileRaw = raw.file;
  if (!isRecord(fileRaw)) throw new Error("resume.file: expected object");
  if (!isStringArray(raw.languages)) {
    throw new Error("resume: languages must be a string array");
  }

  return {
    title: requireString(raw, "title", "resume"),
    file: {
      url: requireString(fileRaw, "url", "resume.file"),
      mimeType: requireString(fileRaw, "mimeType", "resume.file"),
      label: requireString(fileRaw, "label", "resume.file"),
    },
    lastUpdated: requireString(raw, "lastUpdated", "resume"),
    languages: raw.languages,
  };
}

function parseAssistant(raw: unknown): AiAssistantConfig {
  if (!isRecord(raw)) throw new Error("assistant: expected object");
  if (!Array.isArray(raw.suggestedPrompts)) {
    throw new Error("assistant: suggestedPrompts must be an array");
  }

  const contextRaw = raw.context;
  if (!isRecord(contextRaw)) {
    throw new Error("assistant.context: expected object");
  }
  const includeSections = contextRaw.includeSections;
  if (!Array.isArray(includeSections)) {
    throw new Error("assistant.context.includeSections must be an array");
  }
  for (const section of includeSections) {
    if (
      typeof section !== "string" ||
      !(PORTFOLIO_ENTRY_TYPES as readonly string[]).includes(section)
    ) {
      throw new Error("assistant.context.includeSections: invalid entry type");
    }
  }

  const suggestedPrompts = raw.suggestedPrompts.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`assistant.suggestedPrompts[${index}]: expected object`);
    }
    const label = `assistant.suggestedPrompts[${index}]`;
    return {
      label: requireString(item, "label", label),
      prompt: requireString(item, "prompt", label),
    };
  });

  return {
    id: requireString(raw, "id", "assistant"),
    name: requireString(raw, "name", "assistant"),
    persona: requireString(raw, "persona", "assistant"),
    greeting: requireString(raw, "greeting", "assistant"),
    disclaimer: requireString(raw, "disclaimer", "assistant"),
    suggestedPrompts,
    context: {
      includeSections: includeSections as PortfolioEntryType[],
      maxEntriesPerSection: requireNumber(
        contextRaw,
        "maxEntriesPerSection",
        "assistant.context",
      ),
    },
  };
}

function parseTerminalAction(raw: unknown, label: string): TerminalAction {
  if (!isRecord(raw)) throw new Error(`${label}: expected object`);
  const type = raw.type;
  if (type === "builtin") {
    return {
      type: "builtin",
      command: requireString(raw, "command", label),
    };
  }
  if (type === "navigate") {
    const target = requireString(raw, "target", label);
    return { type: "navigate", target } as Extract<
      TerminalAction,
      { type: "navigate" }
    >;
  }
  if (type === "open-app") {
    return {
      type: "open-app",
      appId: requireString(raw, "appId", label),
    };
  }
  if (type === "query") {
    return {
      type: "query",
      query: requireString(raw, "query", label),
    };
  }
  throw new Error(`${label}: invalid terminal action type`);
}

function parseTerminal(raw: unknown): TerminalConfig {
  if (!isRecord(raw)) throw new Error("terminal: expected object");
  const shellRaw = raw.shell;
  if (!isRecord(shellRaw)) throw new Error("terminal.shell: expected object");
  if (!isStringArray(raw.welcomeLines)) {
    throw new Error("terminal: welcomeLines must be a string array");
  }
  if (!Array.isArray(raw.commands)) {
    throw new Error("terminal: commands must be an array");
  }

  const commands: TerminalCommand[] = raw.commands.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`terminal.commands[${index}]: expected object`);
    }
    const label = `terminal.commands[${index}]`;
    const aliases = item.aliases;
    if (aliases !== undefined && !isStringArray(aliases)) {
      throw new Error(`${label}: aliases must be a string array`);
    }

    return {
      name: requireString(item, "name", label),
      description: requireString(item, "description", label),
      usage: requireString(item, "usage", label),
      action: parseTerminalAction(item.action, `${label}.action`),
      aliases,
    };
  });

  return {
    shell: {
      user: requireString(shellRaw, "user", "terminal.shell"),
      host: requireString(shellRaw, "host", "terminal.shell"),
      promptSuffix: requireString(shellRaw, "promptSuffix", "terminal.shell"),
    },
    welcomeLines: raw.welcomeLines,
    commands,
  };
}

function parseContactApplication(raw: unknown): ContactApplication {
  if (!isRecord(raw)) throw new Error("applications.contact: expected object");
  const formRaw = raw.form;
  if (!isRecord(formRaw)) throw new Error("applications.contact.form: expected object");
  const submitRaw = formRaw.submitAction;
  if (!isRecord(submitRaw)) {
    throw new Error("applications.contact.form.submitAction: expected object");
  }
  if (submitRaw.type !== "mailto") {
    throw new Error("applications.contact.form.submitAction.type must be mailto");
  }
  if (!Array.isArray(formRaw.fields)) {
    throw new Error("applications.contact.form.fields must be an array");
  }

  const fields: ContactFormField[] = formRaw.fields.map((field, index) => {
    if (!isRecord(field)) {
      throw new Error(`applications.contact.form.fields[${index}]: expected object`);
    }
    const label = `applications.contact.form.fields[${index}]`;
    const fieldType = field.type;
    if (
      fieldType !== "text" &&
      fieldType !== "email" &&
      fieldType !== "textarea" &&
      fieldType !== "select"
    ) {
      throw new Error(`${label}: invalid field type`);
    }

    return {
      name: requireString(field, "name", label),
      label: requireString(field, "label", label),
      type: fieldType as ContactFormFieldType,
      required:
        field.required === undefined
          ? undefined
          : requireBoolean(field, "required", label),
      rows:
        field.rows === undefined
          ? undefined
          : requireNumber(field, "rows", label),
      placeholder: optionalString(field, "placeholder"),
      options:
        field.options === undefined
          ? undefined
          : isStringArray(field.options)
            ? field.options
            : (() => {
                throw new Error(`${label}: options must be a string array`);
              })(),
    };
  });

  return {
    id: "contact",
    title: requireString(raw, "title", "applications.contact"),
    icon: requireString(raw, "icon", "applications.contact"),
    description: requireString(raw, "description", "applications.contact"),
    enabled: requireBoolean(raw, "enabled", "applications.contact"),
    form: {
      submitAction: {
        type: "mailto",
        to: requireString(submitRaw, "to", "applications.contact.form.submitAction"),
        subject: requireString(
          submitRaw,
          "subject",
          "applications.contact.form.submitAction",
        ),
      },
      fields,
    },
  };
}

function parseResumeApplication(raw: unknown): ResumeApplication {
  if (!isRecord(raw)) throw new Error("applications.resume: expected object");
  const viewerRaw = raw.viewer;
  if (!isRecord(viewerRaw)) {
    throw new Error("applications.resume.viewer: expected object");
  }
  const mode = viewerRaw.mode;
  if (mode !== "embed" && mode !== "new-tab") {
    throw new Error("applications.resume.viewer.mode must be embed or new-tab");
  }
  if (viewerRaw.assetRef !== "resume") {
    throw new Error('applications.resume.viewer.assetRef must be "resume"');
  }

  return {
    id: "resume",
    title: requireString(raw, "title", "applications.resume"),
    icon: requireString(raw, "icon", "applications.resume"),
    description: requireString(raw, "description", "applications.resume"),
    enabled: requireBoolean(raw, "enabled", "applications.resume"),
    viewer: {
      mode,
      assetRef: "resume",
      allowDownload: requireBoolean(
        viewerRaw,
        "allowDownload",
        "applications.resume.viewer",
      ),
    },
  };
}

function parseAssistantApplication(raw: unknown) {
  if (!isRecord(raw)) throw new Error("applications.assistant: expected object");
  if (raw.configRef !== "assistant") {
    throw new Error('applications.assistant.configRef must be "assistant"');
  }

  return {
    id: "assistant" as const,
    title: requireString(raw, "title", "applications.assistant"),
    icon: requireString(raw, "icon", "applications.assistant"),
    description: requireString(raw, "description", "applications.assistant"),
    enabled: requireBoolean(raw, "enabled", "applications.assistant"),
    configRef: "assistant" as const,
  };
}

function parseApplications(raw: unknown): PortfolioApplications {
  if (!isRecord(raw)) throw new Error("applications: expected object");

  return {
    contact: parseContactApplication(raw.contact),
    resume: parseResumeApplication(raw.resume),
    assistant: parseAssistantApplication(raw.assistant),
  };
}

function parseEntries(raw: unknown) {
  if (!Array.isArray(raw)) {
    throw new Error("entries: expected array");
  }
  return raw.map((item, index) => parsePortfolioEntry(item, index));
}

export function parsePortfolioDocument(raw: unknown): PortfolioDocument {
  if (!isRecord(raw)) {
    throw new Error("Portfolio document must be a JSON object");
  }

  const schemaVersion = raw.schemaVersion;
  if (schemaVersion !== PORTFOLIO_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported schemaVersion "${String(schemaVersion)}". Expected "${PORTFOLIO_SCHEMA_VERSION}".`,
    );
  }

  return {
    schemaVersion: PORTFOLIO_SCHEMA_VERSION,
    meta: parseMeta(raw.meta),
    neuralCore: parseNeuralCore(raw.neuralCore),
    contact: parseContact(raw.contact),
    social: parseSocial(raw.social),
    resume: parseResume(raw.resume),
    assistant: parseAssistant(raw.assistant),
    terminal: parseTerminal(raw.terminal),
    applications: parseApplications(raw.applications),
    entries: parseEntries(raw.entries),
  };
}

export function isPortfolioDocument(value: unknown): value is PortfolioDocument {
  try {
    parsePortfolioDocument(value);
    return true;
  } catch {
    return false;
  }
}
