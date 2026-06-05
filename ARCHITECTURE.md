# Portfolio Neural — Architecture Foundation

Frontend-only futuristic AI Operating System portfolio for an ML Engineer. **All portfolio content flows from `portfolio_data.json`** at the project root; runtime fetch uses `public/portfolio_data.json` (kept in sync via `npm run sync:portfolio`).

---

## 1. `portfolio_data.json` analysis

### Document shape

| Property | Value |
|----------|--------|
| Format | JSON **array** (18 entries) |
| Discriminator | `type` field on every object |
| Ordering | Projects first, then experience, skills, achievements, education |

### Entry types and counts

| `type` | Count | Purpose |
|--------|-------|---------|
| `project` | 6 | Showcase builds with stack, impact, category |
| `experience` | 3 | Internships with company and duration |
| `skill` | 7 | Grouped skill categories |
| `achievement` | 1 | Hackathons and certifications |
| `education` | 1 | Degree summary (single `details` string) |

### Field schemas

**`project`** (required unless noted)

- `title`, `tags[]`, `stack[]`, `description`, `impact`, `details`, `category`
- Optional: `challenges`, `solutions` (present on 2 of 6 projects)

**`experience`**

- `title`, `company`, `duration`, `details`

**`skill`**

- `name`, `details` (comma-separated list in a string)

**`achievement`**

- `title`, `details`

**`education`**

- `details` only (no separate degree/school fields)

### Derived metadata (computed at load time)

- **Project categories**: AI Systems, AI + Healthcare, Full Stack (×2), DevOps, Data Analytics
- **Unique tags**: 24 across projects
- **Unique stack items**: 28 across projects

### Gaps (for future JSON extensions)

No profile block (name, bio, email, social links, resume URL). The OS shell will need either JSON schema v2 fields or a separate `profile` object—**not hardcoded in components**.

---

## 2. Folder structure

```
Portfolio-Neural/
├── portfolio_data.json          # Canonical data source (edit here)
├── public/
│   └── portfolio_data.json      # Served at /portfolio_data.json
├── scripts/
│   └── sync-portfolio.mjs       # Root → public copy
├── ARCHITECTURE.md
├── components.json              # shadcn/ui config (UI phase)
├── src/
│   ├── app/
│   │   ├── App.tsx              # Root mount (UI attaches later)
│   │   └── providers/
│   │       ├── AppProviders.tsx
│   │       └── PortfolioProvider.tsx
│   ├── components/
│   │   ├── graph/               # React Flow model builders
│   │   ├── panels/              # Entry detail panels (empty)
│   │   ├── registry/            # type → panel component map
│   │   ├── shell/               # OS module descriptors
│   │   └── ui/                  # shadcn components (UI phase)
│   ├── config/
│   │   ├── app.config.ts        # Shell branding only
│   │   └── portfolio.config.ts  # Fetch URL / options
│   ├── hooks/
│   ├── lib/
│   │   ├── portfolio/           # Load, parse, validate, selectors
│   │   └── utils.ts             # cn() for shadcn
│   ├── store/
│   │   ├── portfolio-context.ts
│   │   └── portfolio-reducer.ts
│   ├── styles/
│   │   └── globals.css          # Tailwind + CSS variables
│   └── types/
│       └── portfolio.ts         # Discriminated unions
└── vite.config.ts
```

---

## 3. Component architecture (planned layers)

```
┌─────────────────────────────────────────────────────────┐
│  AppProviders (PortfolioProvider + future Theme/Motion) │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│  Shell (future) — OS chrome, module nav, command palette │
│  Uses: buildShellModules(meta), usePortfolioData()       │
└─────────────┬───────────────────────────┬─────────────────┘
              │                           │
┌─────────────▼─────────────┐   ┌─────────▼─────────────────┐
│  Graph (React Flow)       │   │  Panels (detail views)    │
│  buildPortfolioGraphModel │   │  getEntryPanel(type)      │
│  Custom node types/project│   │  registry per entry type  │
└───────────────────────────┘   └───────────────────────────┘
```

| Layer | Responsibility | Status |
|-------|----------------|--------|
| **Data** | Fetch, validate, partition JSON | Implemented |
| **Store** | Load state, collections, meta | Implemented |
| **Registry** | Map `type` → panel component | Stub |
| **Shell** | Module list from entry types | Config only |
| **Graph** | Nodes/edges from entries | Model builder only |
| **Panels** | Render one `PortfolioEntry` | Empty |
| **UI** | shadcn primitives | Folder + `cn()` only |

**Rule:** Components never embed titles, companies, or project copy—only read `entry` props or hooks.

---

## 4. State management strategy

### Approach: React Context + `useReducer`

| Concern | Location |
|---------|----------|
| Remote JSON | `fetchPortfolioData()` |
| Normalized state | `PortfolioState` in context |
| Actions | `LOAD_START`, `LOAD_SUCCESS`, `LOAD_ERROR`, `RESET` |
| Derived lists | Built once on load (`collections`, `meta`) |
| Ad-hoc queries | Pure selectors in `lib/portfolio/selectors.ts` |
| Component access | `usePortfolio()`, `usePortfolioData()`, `usePortfolioSelector()` |

### Why not Zustand/Redux yet

- Single JSON blob, read-mostly
- No cross-tab sync or server mutations
- Context keeps the foundation simple; migrate if UI state (selection, filters, layout) grows

### Future UI state (local or separate slice)

- Active shell module, selected node/entry id
- Graph viewport, panel open/close
- Command palette query string  
Keep **portfolio content** in `PortfolioProvider`; **interaction state** in colocated `useState` or a `useShellStore` hook later.

### Data flow

```
portfolio_data.json
       → fetch (public URL)
       → parsePortfolioEntry (per item)
       → partitionPortfolioData + buildPortfolioMeta
       → LOAD_SUCCESS → context
       → hooks → future UI components
```

---

## 5. TypeScript interfaces

Defined in `src/types/portfolio.ts`:

- `PortfolioEntryType` — union of five `type` strings
- Discriminated entries: `ProjectEntry`, `ExperienceEntry`, `SkillEntry`, `AchievementEntry`, `EducationEntry`
- `PortfolioEntry` — union of all entries
- `PortfolioData` — `PortfolioEntry[]`
- `PortfolioCollections` — partitioned arrays
- `PortfolioMeta` — counts, categories, tags, stack
- `PortfolioState` / `PortfolioAction` — store contract

Runtime validation mirrors types in `src/lib/portfolio/type-guards.ts`.

---

## 6. Data loading system

| Step | Module | Function |
|------|--------|----------|
| Config | `portfolio.config.ts` | `PORTFOLIO_DATA_URL`, fetch options |
| Fetch | `load-portfolio.ts` | `fetchPortfolioData()` |
| Parse | `type-guards.ts` | `parsePortfolioEntry()` |
| Validate | `type-guards.ts` | `isPortfolioData()` |
| Partition | `selectors.ts` | `partitionPortfolioData()` |
| Meta | `selectors.ts` | `buildPortfolioMeta()` |
| Provide | `PortfolioProvider.tsx` | auto-load on mount |
| Consume | hooks | `usePortfolioData()`, `usePortfolioSelector(fn)` |

### Sync workflow

After editing root `portfolio_data.json`:

```bash
npm run sync:portfolio
```

### Error handling

`PortfolioLoadError` wraps network, HTTP, JSON, and schema errors. UI phase should surface `state.error` from context.

---

## 7. Tech stack (installed, UI deferred)

- React 19 + TypeScript + Vite 6
- Tailwind CSS v4 (`@tailwindcss/vite`)
- shadcn/ui ready (`components.json`, `cn()`, CSS variables)
- Framer Motion + `@xyflow/react` in dependencies for next phase

---

## 8. Next steps (UI phase)

1. Run `npm install` and `npm run sync:portfolio`
2. Add shadcn components: `npx shadcn@latest add button card dialog ...`
3. Implement shell layout + Framer Motion transitions
4. Register custom React Flow node types per `PortfolioEntryType`
5. Implement panels and `registerEntryPanel()` for each type
6. Optional: extend JSON with `profile` object
