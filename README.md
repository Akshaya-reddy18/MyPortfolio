# AKSHAYA OS

**Your portfolio, reimagined as a living AI operating system.**

Not a scroll of sections. Not another template with a hero and three cards. This is a **neural desktop** — boot sequence, interactive graph navigation, fullscreen apps, a terminal, and a retrieval-based AI assistant — all driven by a single JSON file.

> *"What if your portfolio felt like opening a machine, not reading a résumé?"*

---

## ✦ What you get

| Experience | What it does |
|------------|--------------|
| **Boot sequence** | Cinematic startup — identity, neural graph init, then *Enter* |
| **Neural network** | Click nodes to explore projects, skills, experience — clusters branch from Projects |
| **Desktop + dock** | OS-style taskbar; dock opens **fullscreen apps**, graph opens **floating windows** |
| **NEURAL Assistant** | Frontend-only copilot with suggested prompts, voice input, portfolio retrieval |
| **Terminal** | `help`, `projects`, `skills`, `whoami`, `clear` — all wired to your data |
| **JSON-driven** | Edit `portfolio_data.json` once; the whole OS updates |

No backend. No API keys. No CMS. Just React, motion, and your content.

---

## ⚡ Quick start

```bash
git clone https://github.com/Akshaya-reddy18/MyPortfolio.git
cd MyPortfolio
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — skip boot or watch the full sequence.

**Production build:**

```bash
npm run build
npm run preview
```

---

## 🧠 Make it yours

All content lives in **`portfolio_data.json`** at the project root.

1. Edit profile, projects, skills, experience, contact, and social links
2. Drop your photo at `public/MYfaceInPortfolio.png`
3. Add your résumé at `public/resume.pdf`
4. Sync to the runtime bundle:

```bash
npm run sync:portfolio
```

Schema reference: [`docs/PORTFOLIO_SCHEMA.md`](docs/PORTFOLIO_SCHEMA.md)

---

## 🖥️ Navigation modes

**Dock → Application mode**  
Apps open edge-to-edge with a **Desktop** back button. One focus, zero overlapping windows.

**Neural graph → Desktop mode**  
Draggable floating windows over the live network. Context stays visible.

**NEURAL button (bottom-right)**  
Always-on assistant panel — chat history, prompts, and optional speech-to-text.

---

## 🛠 Tech stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS v4** + custom AKSHAYA design system
- **Framer Motion** — boot, windows, transitions
- **React Flow** — neural navigation graph
- **Lucide** icons · zero backend dependencies

---

## 📁 Project layout

```
├── portfolio_data.json     # ← Edit this
├── public/                 # Static assets (avatar, resume, synced JSON)
├── src/
│   ├── features/
│   │   ├── boot/           # Boot sequence
│   │   ├── desktop/        # Window manager, taskbar, shell
│   │   ├── neural-network/ # Interactive graph
│   │   ├── apps/           # Profile, Projects, Skills, …
│   │   └── assistant/      # Floating NEURAL copilot
│   ├── lib/
│   │   ├── portfolio/      # Load, parse, validate JSON
│   │   ├── assistant/      # Retrieval-based responses
│   │   └── terminal/       # Command executor
│   └── design-system/      # Tokens, glass, motion
└── docs/                   # Schema & design docs
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run sync:portfolio` | Copy root JSON → `public/` |
| `npm run lint` | ESLint |

---

## 🚀 Deploy

Build output goes to `dist/`. Deploy on **Vercel**, **Netlify**, or **GitHub Pages** — static hosting only, no server required.

```bash
npm run build
# Publish the dist/ folder
```

---

## 📄 License

This project is open for personal portfolio use. Fork it, make it yours, ship something memorable.

---

<p align="center">
  <strong>Built by <a href="https://github.com/Akshaya-reddy18">Akshaya Reddy</a></strong><br>
  <sub>ML Engineer · AI Systems · Neural OS</sub>
</p>
