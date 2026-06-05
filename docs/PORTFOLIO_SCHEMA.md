# Portfolio Schema v2.0.0

## Proposed JSON structure

Root changes from a **flat array** (v1) to a **document object** (v2). All existing `project`, `experience`, `skill`, `achievement`, and `education` items move unchanged into `entries`.

```json
{
  "schemaVersion": "2.0.0",
  "meta": {
    "lastUpdated": "2026-06-05",
    "locale": "en"
  },

  "neuralCore": {
    "profile": {
      "name": "Your Name",
      "role": "ML Engineer",
      "headline": "Building intelligent systems with RAG, agents, and production ML",
      "tagline": "Neural Core · Online",
      "location": "India",
      "timezone": "Asia/Kolkata",
      "avatar": {
        "src": "/avatar.jpg",
        "alt": "Portrait"
      },
      "status": {
        "label": "Available for opportunities",
        "state": "available"
      },
      "bio": "Short professional bio sourced only from JSON."
    },
    "hero": {
      "eyebrow": "Neural OS",
      "title": "AI Systems Portfolio",
      "subtitle": "ML Engineer · Full-Stack · MLOps",
      "description": "Explore projects, experience, and skills through an AI-native operating system interface.",
      "highlights": [
        "RAG & LLM systems",
        "Production ML pipelines",
        "Full-stack AI products"
      ],
      "primaryAction": {
        "type": "open-app",
        "appId": "resume",
        "label": "Open Resume"
      },
      "secondaryAction": {
        "type": "open-app",
        "appId": "contact",
        "label": "Contact"
      }
    },
    "currentFocus": {
      "title": "Current Focus",
      "summary": "What I'm building and learning right now.",
      "items": [
        {
          "label": "RAG systems",
          "detail": "Semantic retrieval and evaluation pipelines",
          "priority": 1
        },
        {
          "label": "Agent orchestration",
          "detail": "Multi-agent workflows for real-world domains",
          "priority": 2
        }
      ]
    }
  },

  "contact": {
    "email": "you@example.com",
    "phone": "+91-00000-00000",
    "availability": "Open to internships and ML engineering roles",
    "responseTime": "Within 48 hours",
    "preferredChannels": ["email", "linkedin"]
  },

  "social": [
    {
      "id": "github",
      "platform": "GitHub",
      "url": "https://github.com/your-handle",
      "handle": "@your-handle",
      "icon": "github",
      "primary": true
    },
    {
      "id": "linkedin",
      "platform": "LinkedIn",
      "url": "https://linkedin.com/in/your-handle",
      "handle": "your-handle",
      "icon": "linkedin",
      "primary": false
    }
  ],

  "resume": {
    "title": "Resume",
    "file": {
      "url": "/resume.pdf",
      "mimeType": "application/pdf",
      "label": "Download PDF"
    },
    "lastUpdated": "2026-06-01",
    "languages": ["en"]
  },

  "assistant": {
    "id": "neural-assistant",
    "name": "NEURAL",
    "persona": "Portfolio copilot for ML engineering work",
    "greeting": "Neural assistant online. Ask about projects, skills, or experience.",
    "disclaimer": "Frontend-only assistant — responses use loaded portfolio data.",
    "suggestedPrompts": [
      {
        "label": "Top AI projects",
        "prompt": "Summarize my strongest AI systems projects and their impact."
      },
      {
        "label": "ML stack",
        "prompt": "What ML frameworks and tools do I use?"
      },
      {
        "label": "Recent experience",
        "prompt": "Summarize my most recent internships."
      }
    ],
    "context": {
      "includeSections": ["project", "experience", "skill"],
      "maxEntriesPerSection": 12
    }
  },

  "terminal": {
    "shell": {
      "user": "neural",
      "host": "portfolio",
      "promptSuffix": "~$"
    },
    "welcomeLines": [
      "Neural OS Terminal v2.0.0",
      "Type 'help' to list commands."
    ],
    "commands": [
      {
        "name": "help",
        "aliases": ["?"],
        "description": "List available commands",
        "usage": "help",
        "action": { "type": "builtin", "command": "help" }
      },
      {
        "name": "ls",
        "description": "List OS modules",
        "usage": "ls",
        "action": { "type": "builtin", "command": "list-modules" }
      },
      {
        "name": "projects",
        "description": "List or open projects",
        "usage": "projects",
        "action": { "type": "navigate", "target": "project" }
      },
      {
        "name": "experience",
        "description": "Show experience entries",
        "usage": "experience",
        "action": { "type": "navigate", "target": "experience" }
      },
      {
        "name": "skills",
        "description": "Show skill groups",
        "usage": "skills",
        "action": { "type": "navigate", "target": "skill" }
      },
      {
        "name": "focus",
        "description": "Print current focus items",
        "usage": "focus",
        "action": { "type": "builtin", "command": "show-focus" }
      },
      {
        "name": "contact",
        "description": "Launch Contact application",
        "usage": "contact",
        "action": { "type": "open-app", "appId": "contact" }
      },
      {
        "name": "resume",
        "description": "Launch Resume application",
        "usage": "resume",
        "action": { "type": "open-app", "appId": "resume" }
      },
      {
        "name": "ask",
        "description": "Open AI assistant",
        "usage": "ask [prompt]",
        "action": { "type": "open-app", "appId": "assistant" }
      }
    ]
  },

  "applications": {
    "contact": {
      "id": "contact",
      "title": "Contact",
      "icon": "mail",
      "description": "Send a message via the Contact app",
      "enabled": true,
      "window": {
        "defaultSize": { "width": 480, "height": 560 }
      },
      "form": {
        "submitAction": {
          "type": "mailto",
          "to": "{{contact.email}}",
          "subject": "Portfolio inquiry from Neural OS"
        },
        "fields": [
          { "name": "name", "label": "Name", "type": "text", "required": true },
          { "name": "email", "label": "Email", "type": "email", "required": true },
          {
            "name": "message",
            "label": "Message",
            "type": "textarea",
            "required": true,
            "rows": 6
          }
        ]
      }
    },
    "resume": {
      "id": "resume",
      "title": "Resume",
      "icon": "file-text",
      "description": "View and download resume",
      "enabled": true,
      "window": {
        "defaultSize": { "width": 720, "height": 840 }
      },
      "viewer": {
        "mode": "embed",
        "assetRef": "resume",
        "allowDownload": true
      }
    },
    "assistant": {
      "id": "assistant",
      "title": "NEURAL Assistant",
      "icon": "bot",
      "description": "AI copilot powered by portfolio context",
      "enabled": true,
      "window": {
        "defaultSize": { "width": 560, "height": 640 }
      },
      "configRef": "assistant"
    }
  },

  "entries": [
    {
      "type": "project",
      "title": "…",
      "tags": [],
      "stack": [],
      "description": "…",
      "impact": "…",
      "details": "…",
      "category": "…"
    }
  ]
}
```

See [`portfolio_data.v2.example.json`](./schema/portfolio_data.v2.example.json) for a copy with your current `entries` preserved.

---

## Design principles

| Principle | Implementation |
|-----------|----------------|
| Backward compatible | v1 array still loads; auto-upgraded in memory |
| No entry breakage | `entries[]` keeps exact v1 item shapes |
| OS-ready | `terminal`, `applications`, `assistant` map to future UI apps |
| Single source | All copy lives in JSON — no hardcoded profile in React |
| Extensible | `meta`, optional fields, new `applications.*` keys later |

---

## Section map (UI features)

| Feature | JSON path |
|---------|-----------|
| Neural Core Profile | `neuralCore.profile` |
| Hero | `neuralCore.hero` |
| Current Focus | `neuralCore.currentFocus` |
| Contact | `contact` + `applications.contact` |
| Social Links | `social[]` |
| Resume | `resume` + `applications.resume` |
| AI Assistant | `assistant` + `applications.assistant` |
| Terminal | `terminal.commands[]` |
| Content entries | `entries[]` (unchanged types) |

---

## Migration plan

### Phase 0 — Today (foundation)

- [x] Document v2 schema (`docs/PORTFOLIO_SCHEMA.md`)
- [x] TypeScript types (`src/types/portfolio-document.ts`)
- [x] Validators + v1/v2 loader (`src/lib/portfolio/`)
- [x] Example file (`docs/schema/portfolio_data.v2.example.json`)
- [x] CLI: `npm run migrate:portfolio`

### Phase 1 — Authoring (you)

1. Copy `docs/schema/portfolio_data.v2.example.json` → `portfolio_data.json` **or** run `npm run migrate:portfolio`
2. Fill `neuralCore`, `contact`, `social`, `resume` placeholders
3. Run `npm run sync:portfolio`

### Phase 2 — Runtime (automatic)

- Loader detects format:
  - **Array** → treat as v1, run `migrateV1ToV2()`
  - **Object** with `schemaVersion: "2.0.0"` → validate as v2
- App state exposes `document` (full v2) and `data` (= `document.entries`)

### Phase 3 — UI build

- Shell reads `neuralCore`, `applications`
- Terminal executes `terminal.commands[].action`
- Contact/Resume apps read `applications.*` + `contact` / `resume`

### Phase 4 — Future (optional v2.1)

- `profile.links` aliases, i18n blocks, `entries[].id` stable UUIDs
- `assistant.providers[]` for external LLM APIs (still frontend-configured)

### Rollback

Keep `portfolio_data.v1.json` backup created by migrate script; rename to `portfolio_data.json` to restore array format (loader still works).
