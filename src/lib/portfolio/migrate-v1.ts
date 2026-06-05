import { PORTFOLIO_SCHEMA_VERSION } from "@/types";
import type {
  PortfolioDataV1,
  PortfolioDocument,
  PortfolioEntry,
} from "@/types";

function isEducationEntry(
  entry: PortfolioEntry,
): entry is Extract<PortfolioEntry, { type: "education" }> {
  return entry.type === "education";
}

function inferHeadlineFromEducation(details: string): string {
  const degreeMatch = details.match(/B\.?Tech[^,]*/i);
  return degreeMatch?.[0]?.trim() ?? details.split(",")[0]?.trim() ?? details;
}

function buildDefaultDocument(entries: PortfolioDataV1): PortfolioDocument {
  const education = entries.find(isEducationEntry);
  const educationDetails = education?.details ?? "";
  const headline = educationDetails
    ? inferHeadlineFromEducation(educationDetails)
    : "ML Engineer Portfolio";

  const projectCount = entries.filter((e) => e.type === "project").length;
  const skillCount = entries.filter((e) => e.type === "skill").length;

  return {
    schemaVersion: PORTFOLIO_SCHEMA_VERSION,
    meta: {
      lastUpdated: new Date().toISOString().slice(0, 10),
      locale: "en",
    },
    neuralCore: {
      profile: {
        name: "YOUR_NAME",
        role: "ML Engineer",
        headline,
        tagline: "Neural Core · Configure in portfolio_data.json",
        location: "YOUR_LOCATION",
        timezone: "Asia/Kolkata",
        avatar: {
          src: "/avatar.jpg",
          alt: "Profile avatar",
        },
        status: {
          label: "Available for opportunities",
          state: "available",
        },
        bio: educationDetails || "Add your bio in neuralCore.profile.bio",
      },
      hero: {
        eyebrow: "Neural OS",
        title: "AI Systems Portfolio",
        subtitle: "ML Engineer · Full-Stack · MLOps",
        description:
          "Explore projects, experience, and skills through a JSON-driven neural operating system.",
        highlights: [
          `${projectCount} featured projects`,
          `${skillCount} skill domains`,
          "RAG, agents, and production ML",
        ],
        primaryAction: {
          type: "open-app",
          appId: "resume",
          label: "Open Resume",
        },
        secondaryAction: {
          type: "open-app",
          appId: "contact",
          label: "Contact",
        },
      },
      currentFocus: {
        title: "Current Focus",
        summary: "Update neuralCore.currentFocus in portfolio_data.json",
        items: [
          {
            label: "Configure profile",
            detail: "Replace YOUR_NAME, contact, and social links",
            priority: 1,
          },
        ],
      },
    },
    contact: {
      email: "you@example.com",
      availability: "Open to opportunities",
      responseTime: "Within 48 hours",
      preferredChannels: ["email"],
    },
    social: [
      {
        id: "github",
        platform: "GitHub",
        url: "https://github.com/YOUR_HANDLE",
        handle: "@YOUR_HANDLE",
        icon: "github",
        primary: true,
      },
      {
        id: "linkedin",
        platform: "LinkedIn",
        url: "https://linkedin.com/in/YOUR_HANDLE",
        handle: "YOUR_HANDLE",
        icon: "linkedin",
      },
    ],
    resume: {
      title: "Resume",
      file: {
        url: "/resume.pdf",
        mimeType: "application/pdf",
        label: "Download PDF",
      },
      lastUpdated: new Date().toISOString().slice(0, 10),
      languages: ["en"],
    },
    assistant: {
      id: "neural-assistant",
      name: "NEURAL",
      persona: "Portfolio copilot for ML engineering work",
      greeting:
        "Neural assistant online. Ask about projects, skills, or experience.",
      disclaimer:
        "Frontend-only assistant — responses use loaded portfolio data.",
      suggestedPrompts: [
        {
          label: "Top AI projects",
          prompt: "Summarize my strongest AI systems projects and their impact.",
        },
        {
          label: "ML stack",
          prompt: "What ML frameworks and tools do I use?",
        },
      ],
      context: {
        includeSections: ["project", "experience", "skill"],
        maxEntriesPerSection: 12,
      },
    },
    terminal: {
      shell: {
        user: "neural",
        host: "portfolio",
        promptSuffix: "~$",
      },
      welcomeLines: [
        `Neural OS ${PORTFOLIO_SCHEMA_VERSION}`,
        "Type 'help' to list commands.",
      ],
      commands: [
        {
          name: "help",
          aliases: ["?"],
          description: "List available commands",
          usage: "help",
          action: { type: "builtin", command: "help" },
        },
        {
          name: "projects",
          description: "Open projects module",
          usage: "projects",
          action: { type: "navigate", target: "project" },
        },
        {
          name: "skills",
          description: "Open skills module",
          usage: "skills",
          action: { type: "navigate", target: "skill" },
        },
        {
          name: "experience",
          description: "Open experience module",
          usage: "experience",
          action: { type: "navigate", target: "experience" },
        },
        {
          name: "contact",
          description: "Launch Contact app",
          usage: "contact",
          action: { type: "open-app", appId: "contact" },
        },
        {
          name: "resume",
          description: "Launch Resume app",
          usage: "resume",
          action: { type: "open-app", appId: "resume" },
        },
        {
          name: "whoami",
          description: "Show profile identity",
          usage: "whoami",
          action: { type: "builtin", command: "whoami" },
        },
        {
          name: "clear",
          description: "Clear terminal output",
          usage: "clear",
          action: { type: "builtin", command: "clear" },
        },
      ],
    },
    applications: {
      contact: {
        id: "contact",
        title: "Contact",
        icon: "mail",
        description: "Send a message",
        enabled: true,
        window: { defaultSize: { width: 480, height: 560 } },
        form: {
          submitAction: {
            type: "mailto",
            to: "{{contact.email}}",
            subject: "Portfolio inquiry from Neural OS",
          },
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            {
              name: "message",
              label: "Message",
              type: "textarea",
              required: true,
              rows: 6,
            },
          ],
        },
      },
      resume: {
        id: "resume",
        title: "Resume",
        icon: "file-text",
        description: "View and download resume",
        enabled: true,
        window: { defaultSize: { width: 720, height: 840 } },
        viewer: {
          mode: "embed",
          assetRef: "resume",
          allowDownload: true,
        },
      },
      assistant: {
        id: "assistant",
        title: "NEURAL Assistant",
        icon: "bot",
        description: "AI copilot powered by portfolio context",
        enabled: true,
        window: { defaultSize: { width: 560, height: 640 } },
        configRef: "assistant",
      },
    },
    entries,
  };
}

/**
 * Upgrades legacy v1 array JSON to a full v2 document without modifying entry objects.
 */
export function migrateV1ToV2(entries: PortfolioDataV1): PortfolioDocument {
  return buildDefaultDocument(structuredClone(entries));
}
