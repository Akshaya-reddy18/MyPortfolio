# AKSHAYA OS — Design System

Futuristic AI operating system visual language for an ML Engineer portfolio. **Dark mode only.** Neural core identity: `/MYfaceInPortfolio.png`.

---

## File map

| Layer | Path |
|-------|------|
| CSS tokens | `src/design-system/tokens.css` |
| Tailwind v4 theme | `src/design-system/tailwind-theme.css` |
| TypeScript tokens | `src/design-system/tokens.ts` |
| Typography | `src/design-system/typography.css` |
| Glassmorphism | `src/design-system/glass.css` |
| Windows | `src/design-system/windows.css` |
| Neural nodes | `src/design-system/neural-nodes.css` |
| Terminal | `src/design-system/terminal.css` |
| Chatbot | `src/design-system/chatbot.css` |
| Motion | `src/design-system/motion.css` |
| Canvas / desktop | `src/design-system/canvas.css` |
| Entry | `src/design-system/index.css` |

Imported globally via `src/styles/globals.css`.

---

## 1. Color palette

### Void & surfaces

| Token | Hex | Usage |
|-------|-----|--------|
| `--akshaya-void` | `#030508` | App background |
| `--akshaya-surface-0` | `#0a0e17` | Panels |
| `--akshaya-surface-1` | `#0f1520` | Cards |
| `--akshaya-surface-2` | `#141c2b` | Elevated UI |

### Electric blue (primary energy)

| Token | Hex |
|-------|-----|
| `--akshaya-blue-400` | `#1a94ff` |
| `--akshaya-blue-600` | `#0066ff` |
| `--akshaya-blue-glow` | `rgba(0, 102, 255, 0.45)` |

### Neon purple (AI / accent)

| Token | Hex |
|-------|-----|
| `--akshaya-purple-400` | `#933fff` |
| `--akshaya-purple-500` | `#a855f7` |
| `--akshaya-purple-glow` | `rgba(168, 85, 247, 0.4)` |

### Soft cyan (data / terminal / links)

| Token | Hex |
|-------|-----|
| `--akshaya-cyan-300` | `#67e8f9` |
| `--akshaya-cyan-400` | `#22d3ee` |
| `--akshaya-cyan-glow` | `rgba(34, 211, 238, 0.35)` |

### Text

| Role | Token | Hex |
|------|-------|-----|
| Primary | `--akshaya-text-primary` | `#f0f4fc` |
| Secondary | `--akshaya-text-secondary` | `#a8b4cc` |
| Muted | `--akshaya-text-muted` | `#6b7a94` |

### Tailwind utilities

`bg-void`, `bg-surface-1`, `text-blue-600`, `text-purple-500`, `text-cyan-400`, `shadow-glow-blue`, etc.

---

## 2. Typography

| Role | Class | Font |
|------|-------|------|
| Display / OS title | `.akshaya-type-display-lg` | Space Grotesk |
| H1–H3 | `.akshaya-type-h1` … | Space Grotesk |
| Body | `.akshaya-type-body` | Inter |
| Label / overline | `.akshaya-type-label` | Space Grotesk, uppercase |
| Brand gradient | `.akshaya-type-gradient` | Space Grotesk + gradient |
| Terminal / code | `.akshaya-type-mono` | JetBrains Mono |

**Scale:** `--akshaya-text-xs` (12px) → `--akshaya-text-6xl` (60px)

---

## 3. Glassmorphism

| Class | Use |
|-------|-----|
| `.akshaya-glass` | Default panels |
| `.akshaya-glass-elevated` | Modals, active panels |
| `.akshaya-glass-heavy` | Overlays |
| `.akshaya-glass-subtle` | Nested sections |
| `.akshaya-glass-border-gradient` | Hero / featured cards |
| `.akshaya-glass-dock` | Bottom dock |
| `.akshaya-glass-panel` | Sidebars |

**Recipe:** `backdrop-filter: blur(16–24px) saturate(140%)` + semi-transparent surface + inset highlight.

---

## 4. Window styles

| Class | Use |
|-------|-----|
| `.akshaya-window` | Window shell |
| `.akshaya-window--active` | Focused window + blue glow |
| `.akshaya-window__titlebar` | Chrome header |
| `.akshaya-window__traffic-dot--*` | Close / min / max |
| `.akshaya-window__body` | Content area |
| `.akshaya-window__statusbar` | Optional footer |

---

## 5. Neural node styles

| Class | Use |
|-------|-----|
| `.akshaya-neural-core` | Identity hub with avatar |
| `.akshaya-neural-core__avatar` | `MYfaceInPortfolio.png` |
| `.akshaya-neural-core__ring` | Animated conic gradient |
| `.akshaya-node` | Graph nodes |
| `.akshaya-node--project` / `--experience` / `--skill` | Type accents |
| `.akshaya-edge` / `.akshaya-edge--active` | React Flow edges |

**Sizes:** `--akshaya-node-size-sm` (40px) → `--akshaya-node-size-core` (120px)

---

## 6. Terminal styles

| Class | Use |
|-------|-----|
| `.akshaya-terminal` | Container |
| `.akshaya-terminal--scanlines` | CRT effect |
| `.akshaya-terminal__prompt` | Prompt prefix (purple) |
| `.akshaya-terminal__user` / `__host` | `user@host` colors |
| `.akshaya-terminal__cursor` | Blinking block |
| `.akshaya-terminal__line--error` | Error output |

---

## 7. Chatbot styles

| Class | Use |
|-------|-----|
| `.akshaya-chat` | Assistant panel |
| `.akshaya-chat__avatar` | Same neural core image |
| `.akshaya-chat__bubble--user` | Blue glass bubble |
| `.akshaya-chat__bubble--assistant` | Purple-bordered glass |
| `.akshaya-chat__prompt-chip` | Suggested prompts |
| `.akshaya-chat__send` | Gradient send button |

---

## 8. Animation guidelines

### Principles

1. **Purposeful** — Motion signals state (focus, loading, connection), not decoration alone.
2. **Fast UI, slow ambience** — Interactions 150–250ms; ambient glow/orbit 3–8s.
3. **Premium restraint** — One primary motion per viewport (e.g. core ring OR background mesh).
4. **Accessibility** — All looping animations respect `prefers-reduced-motion: reduce`.

### Duration tokens

| Token | ms | Use |
|-------|-----|-----|
| `--akshaya-duration-fast` | 150 | Hover, focus |
| `--akshaya-duration-normal` | 250 | Panel open |
| `--akshaya-duration-slow` | 400 | Window enter |
| `--akshaya-duration-pulse` | 2400 | Node breathe |
| `--akshaya-duration-orbit` | 8000 | Core ring |

### Easing

| Token | Curve | Use |
|-------|-------|-----|
| `--akshaya-ease-out` | cubic-bezier(0.16, 1, 0.3, 1) | Enter |
| `--akshaya-ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | Buttons |
| `--akshaya-ease-smooth` | Material standard | Default transition |

### Keyframes

| Name | Class utility | Use |
|------|---------------|-----|
| `akshaya-pulse` | `.akshaya-animate-pulse` | Nodes, status |
| `akshaya-glow` | `.akshaya-animate-glow` | Core halo |
| `akshaya-orbit` | `.akshaya-animate-orbit` | Core ring |
| `akshaya-float` | `.akshaya-animate-float` | Hero elements |
| `akshaya-fade-in` | `.akshaya-animate-fade-in` | Content mount |
| `akshaya-slide-up` | `.akshaya-animate-slide-up` | Windows, toasts |
| `akshaya-blink` | (terminal cursor) | Input caret |
| `akshaya-dash` | `.akshaya-edge--animated` | Data flow edges |

### Framer Motion (recommended)

```ts
import { AKSHAYA_DURATION, AKSHAYA_EASING } from "@/design-system";

const spring = { type: "spring", duration: AKSHAYA_DURATION.normal / 1000 };
const ease = { duration: AKSHAYA_DURATION.fast / 1000, ease: AKSHAYA_EASING.out };
```

### Do / Don’t

| Do | Don’t |
|----|--------|
| Use token durations | Arbitrary `transition: 0.3s` everywhere |
| Stagger list items 50–80ms | Animate every element on scroll |
| Glow on active/focus only | Full-screen flashing |
| Disable loops when `prefers-reduced-motion` | Ignore a11y |

---

## 9. Usage examples (no components)

```html
<!-- Neural core -->
<div class="akshaya-neural-core">
  <div class="akshaya-neural-core__glow"></div>
  <div class="akshaya-neural-core__ring"><div class="akshaya-neural-core__ring-inner"></div></div>
  <div class="akshaya-neural-core__avatar" role="img" aria-label="Neural core"></div>
</div>

<!-- Glass panel -->
<div class="akshaya-glass akshaya-glass-border-gradient p-6">…</div>

<!-- Window -->
<div class="akshaya-window akshaya-window--active">…</div>
```

```tsx
import { AKSHAYA_COLORS, AKSHAYA_BRAND } from "@/design-system";
// React Flow nodeColor={AKSHAYA_COLORS.blue[600]}
```

---

## 10. Neural core asset

Place portrait at:

```
public/MYfaceInPortfolio.png
```

Referenced by:

- CSS: `--akshaya-neural-core-avatar`
- TS: `AKSHAYA_BRAND.neuralCoreAvatar`
- Classes: `.akshaya-neural-core__avatar`, `.akshaya-chat__avatar`
