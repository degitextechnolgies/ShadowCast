# PROJECT_INFO.md — ShadowCasting Documentation

> **Last updated:** 2026-11-05
> **Maintained by:** ShadowCasting development team
> **Scope:** Frontend codebase, Cloudflare deployment, UI/3D design, and collaboration guidelines

---

## 1. Project Overview

### 1.1 Identity

| Property        | Value                                   |
|-----------------|-----------------------------------------|
| **Project name** | ShadowCasting / ShadowCast              |
| **Website domain** | `https://shadowcast.in` (claimed/planned) |
| **GitHub repo** | `https://github.com/mcabhishek/ShadowCasting` |
| **Repository owner** | `mcabhishek`                          |
| **Default branch** | `main`                                 |

### 1.2 Purpose

ShadowCasting is a **screen-mirroring / screen-streaming desktop application** presented as a premium gaming-technology brand. The website serves as the public product landing page for:

- Explaining the ShadowCast screen-mirroring product.
- Showcasing a cinematic, interactive 3D hero experience.
- Encouraging visitors to download the Windows desktop application.
- Providing product documentation, how-it-works, features, and support sections.

The project consists of a **React single-page application (SPA)** built with **Vite**, hosted as a **Cloudflare Pages site**, with the desktop application (WPF/.NET) existing separately in the `MirrorMaster` repository.

### 1.3 Main Product Features

| Feature | Status |
|---------|--------|
| Wireless screen mirroring | Implemented (desktop app) |
| USB screen mirroring | Implemented (desktop app) |
| Device discovery | Implemented (desktop app) |
| Screen recording | Implemented (desktop app) |
| Multiple device management | Implemented (desktop app) |
| Connection management | Implemented (desktop app) |
| Streaming performance / decoding | Implemented (desktop app) |
| Connection diagnostics / troubleshooting | Implemented (desktop app) |
| Windows PC as host | Implemented (desktop app) |
| Android / iPhone / tablet mirroring | Implemented (desktop app) |
| Windows app installer download | Not yet (binary not released) |
| Website documentation pages | Partially implemented (features, how it works, compatibility, performance, FAQ, download) |

### 1.4 Frontend Architecture

**Framework:** React 19 + TypeScript, built with **Vite 8**.

**Structure (src/):**

```
src/
├── App.tsx                 # Root layout: Navbar + main sections + Footer
├── main.tsx                # React entry point
├── index.css               # Design tokens (CSS variables)
├── App.css                 # Legacy component CSS (unused by App.tsx)
└── components/
    ├── Navbar.tsx          # Fixed top navigation menu
    ├── Hero.tsx            # Hero section with 3D scene integration
    ├── Hero3D.tsx          # React Three Fiber 3D scene (moon, samurai, temple, fog)
    ├── Features.tsx        # Feature grid (6 items)
    ├── HowItWorks.tsx      # 3-step Connect → Discover → Cast
    ├── Compatibility.tsx   # OS compatibility matrix
    ├── Performance.tsx     # Performance overview
    ├── ProductExperience.tsx # Interface mockup grid
    ├── ProductShowcase.tsx # Tabbed interface demo
    ├── Download.tsx        # Download section
    ├── FAQ.tsx             # Accordion FAQ
    └── Footer.tsx          # Bottom navigation/footer
```

**State & Animation:**

| Library | Purpose |
|---------|---------|
| `framer-motion` | Page/component entrance animations, mobile menu, FAQ accordion |
| `gsap` | Motion library (imported but usage is minimal/planned) |
| `lenis` | Smooth scrolling (imported but usage is minimal/planned) |
| `lucide-react` | Icon library |
| `clsx` | Dynamic className composition |

**Styling:** Tailwind CSS v4 via `@tailwindcss/vite`. Custom CSS variables defined in `src/index.css`.

### 1.5 UI Design and Animation System

**Design system (current):**



### 1.6 Environments

| Environment | Tooling | Status |
|-------------|---------|--------|
| Local development | `npm run dev` → Vite dev server on port 5173 | Ready |
| Production build | `npm run build` → `tsc -b && vite build` → `dist/` | Verified |
| Local preview | `npm run preview` | Ready |
| Automated tests | `npm run test` → Playwright | Running |
| Cloudflare hosting | Cloudflare Pages | Configured |

---

## 2. Technology Stack

### 2.1 Exact Versions (from `package.json`)

| Dependency | Version |
|------------|---------|
| `react` | `^19.3.1` |
| `react-dom` | `^19.3.1` |
| `@react-three/fiber` | `^9.8.2` |
| `@react-three/drei` | `^10.7.9` |
| `@react-three/postprocessing` | `^3.2.2` |
| `three` | `^0.187.0` |
| `framer-motion` | `^14.9.1` |
| `gsap` | `^3.15.1` |
| `lenis` | `^1.3.27` |
| `lucide-react` | `^1.68.0` |
| `clsx` | `^2.1.1` |
| `@tailwindcss/vite` | `^4.3.4` |
| `tailwindcss` | `^4.3.4` |
| `@playwright/test` (dev) | `^1.64.1` |
| `@vitejs/plugin-react` (dev) | `^6.1.2` |
| `typescript` (dev) | `~7.0.2` |
| `vite` (dev) | `^8.3.5` |
| `oxlint` (dev) | `^1.89.0` |
| `@types/react` (dev) | `^19.3.0` |
| `@types/react-dom` (dev) | `^19.3.0` |
| `@types/node` (dev) | `^24.19.2` |

### 2.2 Stack Breakdown

| Category | Technology | Role |
|----------|-----------|------|
| Frontend framework | React 19 | UI rendering |
| Language | TypeScript (~7.0.2) | Type safety |
| Build tool | Vite 8.3.5 | Dev server + production bundler |
| UI component CSS | Tailwind CSS 4.3.4 | Utility-first styles, theme tokens |
| 3D rendering | Three.js 0.187.0 + R3F 9.8.2 + @react-three/drei 10.7.9 + postprocessing 3.2.2 | Hero scene, moon, environment, particles |
| Animation | Framer Motion 14.9.1 | Scroll-triggered UI animation |
| Icons | lucide-react 1.68.0 | SVG icons |
| Deployment | Cloudflare Pages | Hosting |
| Testing | Playwright 1.64.1 | E2E responsive tests |

---

## 3. Cloudflare Deployment Information

**Primary configuration file:** `wrangler.toml`

```toml
name = "shadowcasting"
compatibility_date = "2024-09-23"
pages_build_output_dir = "dist"
```

**Configuration analysis:**

| Item | Status |
|------|--------|
| Pages project | ✅ Intended (static SPA) |
| Workers config | ❌ Incorrect (removed `[assets]` block in later commit) |
| Deploy command | Correctly set to `wrangler pages deploy dist` |
| Worker name | ✅ Matches repo (`shadowcasting`) — fixed from earlier `shadow-cast` |

#### 3.1 Historical Deployment Details (provided in prompt)

| Detail | Value | Notes |
|--------|-------|-------|
| **Build command** | `npm run build` | Verified in production CI |
| **Build process** | `tsc -b && vite build` | TypeScript strict check + Vite production build |
| **Output directory** | `dist/` | Contains `index.html`, `assets/`, `_redirects` |
| **Node.js version** | 24.22.1 | Production runtime |
| **npm version** | 10.9.2 | Production runtime |
| **Vite version** | 8.3.5 | Production bundler |
| **Cloudflare Worker name** | `shadowcasting` | GitHub repo name |
| **Configured name** | `shadow-cast` | ❌ Mismatched (fixed in commit `d5097c8`) |
| **Live deployment URL** | `https://shadowcasting.degitextechnolgies.workers.dev` | Historical worker URL |
| **Deployment version ID** | `ab9ea95f-a004-4e1a-b35f-ac52634d8666` | Historical worker deployment |
| **Deployment result** | Successful | Based on provided build log |

> ⚠️ The build log provided reflects a **historical configuration**. The **current committed configuration** has been fixed to **Cloudflare Pages**.

---

## 4. Deployment Warnings

The following warnings were identified during our analysis of the Cloudflare deployment.

#### ⚠️ Warning 1: Pages / Workers mismatch

**Problem:** The production build log shows `wrangler deploy` being executed on a Pages project. This means a Workers command was used on a Static SPA.

**Current resolved state:** The project is now correctly configured as Cloudflare Pages:
- `wrangler.toml`: Uses only `pages_build_output_dir` (no `[assets]` block)
- `package.json` deploy script: `wrangler pages deploy dist`

**Action required:** Ensure the Cloudflare Pages GitHub app is connected and that the Pages project is configured to use the `main` branch. Do **not** use `wrangler deploy` on a Pages project — use `wrangler pages deploy` or the Cloudflare dashboard GitHub flow.

#### ⚠️ Warning 2: Worker name mismatch

**Problem:** Historical worker name `shadow-cast` did not match the actual Cloudflare project name `shadowcasting`.

**Current resolved state:** `wrangler.toml` now has `name = "shadowcasting"`, which matches the GitHub repo name.

**Action required:** Since the project is **Cloudflare Pages**, the `name` in `wrangler.toml` is effectively ignored. Confirm the Cloudflare Pages project name in the dashboard if it ever needs to change.

#### ⚠️ Warning 3: Large JavaScript chunk (historical)

**Problem:** Hero3D bundle was ~924.57 kB (uncompressed) / 244.50 kB (gzipped).

**Root cause:** All Three.js + R3F + Drei code was packaged into a single lazy chunk.

**Current state:** The chunk splitting reduced the Hero3D lazy chunk to **11.13 kB**, but the `three` chunk remains **932 kB uncompressed / 244.50 kB gzipped**.

**Optimization recommendations (without removing 3D effects):**

| Strategy | Impact | Priority |
|----------|--------|----------|
| ✅ Already implemented: `manualChunks` split | Moderate | Completed |
| Dynamic import of `Hero3D` (already done) | Good | Completed |
| Reduce `@react-three/postprocessing` usage | Good | High |
| Use `dpr={[1, 1.5]}` — already set; consider `[1, 1]` for mobile | Small | Medium |
| Reduce `Stars` count (700 → 400) | Tiny | Low |

| Token | Value |
|-------|-------|
| `--bg` | `#050507` |
| `--bg-2` | `#0B080B` |
| `--deep` | `#020204` |
| `--red` | `#FF1025` |
| `--crimson` | `#D90020` |
| `--bright-red` | `#FF303A` |
| `--dark-crimson` | `#65000F` |
| `--text` | `#FFFFFF` |
| `--text-2` | `#C4C4CC` |
| `--muted` | `#92929E` |
| `--border` | `#1a151a` |

**Visual language:**

- Dark cinematic red-black theme.
- Premium gaming aesthetic with neon red accents.
- Glassmorphism cards (`glass` class with `backdrop-filter: blur`).
- Red gradient buttons (`from-[#FF1025] to-[#D90020]`).
- Animated entrance transitions on scroll (Framer Motion `whileInView`).
- 3D hero scene via React Three Fiber with custom Samurai SVG sprite.

**Animation system:**

- **Framer Motion** for: Navbar scroll-state, Hero entrance, mobile menu, buttons hover, feature cards, tabs, FAQ accordion.


---

## 5. GitHub Collaboration

### 5.1 Repository Visibility & Access

| Property | Value |
|----------|-------|
| **Owner** | `mcabhishek` |
| **Repository** | `ShadowCasting` |
| **Visibility** | Not verified (public/private) |
| **Collaborator invited** | `ppdeekshith-droid` |
| **Invitation status** | **Pending** (NOT verified) |
| **Team size target** | 3–5 developers |
| **Access control** | Owner approval required for `main` branch |

### 5.2 Collaboration Workflow

#### 5.2.1 Cloning the Repository

```bash
# Fork first (recommended for non-owners)
git clone https://github.com/<your-username>/ShadowCasting.git
cd ShadowCasting

# Add the upstream repository as a remote
git remote add upstream https://github.com/mcabhishek/ShadowCasting.git
```

#### 5.2.2 Creating a Feature Branch

```bash
git checkout main
git pull upstream main
git checkout -b feat/your-feature-name
```

Branch naming conventions:

| Type | Example |
|------|---------|
| Feature | `feat/screen-mirroring-opt` |
| Bugfix | `fix/responsive-overflow-320px` |
| Docs | `docs/cloudflare-config` |
| Chore | `chore/update-deps` |

#### 5.2.3 Committing & Pushing



---

## 6. Project Structure

### 6.1 Directory Tree (Excluded `node_modules` and `dist`)

```
ShadowCasting/
├── PROJECT_INFO.md          # This file
├── README.md                # Project overview (if any)
├── wrangler.toml            # Cloudflare Pages config (static SPA)
├── package.json             # Dependencies & scripts
├── package-lock.json        # Lockfile (npm v3)
├── .gitignore               # Git ignore rules
├── .oxlintrc.json           # Lint config
├── playwright.config.ts     # Playwright E2E config
├── vite.config.ts           # Vite bundler config
├── tsconfig.json            # Shared TS config
├── tsconfig.app.json        # App-specific TS config
├── tsconfig.node.json       # Node-specific TS config
├── public/
│   ├── _redirects           # SPA fallback (Cloudflare Pages)
│   ├── favicon.svg          # Standard favicon
│   └── icons.svg            # Vite icon
└── src/
    ├── main.tsx             # React DOM entry
    ├── App.tsx              # Root layout
    ├── index.css            # Design tokens (CSS variables)
    ├── App.css              # Legacy (unused)
    ├── assets/
    │   ├── hero.png         # Deprecated hero image
    │   ├── samurai.svg      # Samurai illustration sprite (for R3F)


### 7.2 Samurai / Shadow Visual Elements

| Element | Implementation | Status |
|---------|----------------|--------|
| Hero 3D scene | R3F scene with moon (sphere + procedural crater texture), Samurai (SVG sprite on a `sprite`), temple (procedural boxes), torii gate (boxes), mountains (cones), fog (billboard planes), maple leaves (particles) | Implemented |
| Character | `samurai.svg` rendered as a Three.js sprite | Implemented |
| Red glow rim light | Procedural radial gradient SVG + emissive materials | Implemented |
| Red particles | Maple leaves (custom canvas texture, additive blending) | Implemented |
| Atmospheric fog | Three layered `FogLayer` planes with thin heavy-blur depth | Implemented |

> ⚠️ Note: The current Hero does NOT contain a 3D Samurai character. The character asset is a 2D SVG sprite placed in the 3D scene with parallax and breathing motion. Not a 3D model (no GLB/GLTF). Intentional design choice to keep the hero lightweight.

### 7.3 3D Effects & Interactions

| Effect | Implementation | Status |
|--------|----------------|--------|
| Mouse parallax | `useThree().pointer` in `useFrame` (controls Samurai speed & rotation) | Implemented |
| Moon float/rotation | `useFrame` rotation Y + pulsing opacity | Implemented |
| Moon glow pulse | Low-opacity sphere scaling + opacity pulsing | Implemented |
| Leaf fall | `useFrame` updating particle positions (Y drift + X sin) | Implemented |
| Fog drift | `useFrame` translating X with modulo wrap | Implemented |
| Stars | @react-three/drei `Stars` component in Canvas | Implemented |

### 7.4 Joystick / Controller Elements

| Element | Status |
|---------|--------|
| Gamepad / controller 3D model | ❌ Not implemented (removed in current Hero3D) |
| Gamepad UI (visual only) | ❌ Not present |
| Joystick-related controls | ❌ Not present |

> `gsap` and `lenis` are installed but not connected to a 3D gamepad or interface. They remain available if a later version of the desktop app requires gamepad/input handling.

### 7.5 Animations & Transitions

| Animation | Technology | Status |
|----------|-----------|--------|
| Hero text stagger reveal | Framer Motion `motion` + `transition` | Implemented |
| Feature cards appear/exit | Framer Motion `whileInView` | Implemented |
| Button hover lift | CSS `hover:-translate-y-1` | Implemented |
| Mobile menu open/close | Framer Motion `AnimatePresence` + height animation | Implemented |
| FAQ accordion | Framer Motion `AnimatePresence` + height | Implemented |
| Scroll parallax (hero scene) | Three.js `useFrame` + `useThree().pointer` | Implemented |
| Button / link hover glow | CSS `shadow-[#FF1025]/40` + `hover:shadow-[#FF1025]/60` | Implemented |

### 7.6 Responsive Design

| Viewport | Handling | Status |
|----------|----------|--------|
| Mobile (320–430px) | `max-w-[480px]` text column, smaller 3D, stacked buttons | Implemented |
| Tablet (768–1024px) | Portrait hero, red 3D scene, smaller UI, stacked buttons | Implemented |
| Desktop (1024px+) | Full hero with left text + right 3D, wide nav, grid layouts | Implemented |
| Touch | Mobile menu (hamburger), stacked CTA, no hover-dependent interactions | Implemented |

**Test coverage:** Playwright runs 9 viewport sizes + 1 mobile menu test → 10 tests, all passing.

### 7.7 Performance Considerations

| Optimization | Status | Notes |
|--------------|--------|-------|
| Lazy-loading `Hero3D` | ✅ Implemented | `React.lazy` + `Suspense` |
| `manualChunks` split of `three` | ✅ Implemented | Hero3D chunk → 11.13 kB |
| `dpr={[1, 1.5]}` | ✅ Implemented | Adaptive DPR for 3D |
| `Stars` count limited to 700 | ✅ Implemented | Lower than original |
| `prefers-reduced-motion` | ✅ Implemented | CSS media query disables animations |
| Cleanup of R3F `useFrame` | ✅ Done | All effects clean up on unmount |
| `depthWrite={false}` for fog/particles | ✅ Implemented | Reduces overdraw |
| Mobile 3D quality | 🔶 Planned | No adaptive `dpr` switch yet |

    │   ├── react.svg        # Legacy Vite react.svg
    │   └── vite.svg         # Legacy Vite vite.svg
    ├── components/
    │   ├── Navbar.tsx       # Navbar (red theme, lightning logo, mobile menu)
    │   ├── Hero.tsx         # Hero section wrapper + lazy 3D
    │   ├── Hero3D.tsx       # R3F scene (moon, samurai, temple, fog, leaves)
    │   ├── Features.tsx     # 6-item feature grid
    │   ├── HowItWorks.tsx   # Connect → Discover → Cast
    │   ├── Compatibility.tsx # OS/device compatibility matrix
    │   ├── Performance.tsx  # Performance overview
    │   ├── ProductExperience.tsx # Interface mockups
    │   ├── ProductShowcase.tsx # Tabbed UI demo
    │   ├── Download.tsx     # Download section / call-to-action
    │   ├── FAQ.tsx          # FAQ accordion
    │   └── Footer.tsx       # Footer
    ├── tests/
    │   └── responsive.spec.ts  # Playwright responsive overflow tests
    └── styles/             # (Not present in current repo)
```

### 6.2 Key Files Explained

| File | Purpose | Dependencies | Connection |
|------|---------|--------------|-------------|
| `package.json` | Dependency manifest & npm scripts | None | Drives `npm install`, `build`, `test` |
| `vite.config.ts` | Vite bundler configuration | `@vitejs/plugin-react`, `@tailwindcss/vite` | Injected into `src/main.tsx` via Vite dev server / build |
| `wrangler.toml` | Cloudflare Pages build config | None | Read by Cloudflare Pages CI |
| `public/_redirects` | SPA fallback for deep links | None | Copied to `dist/_redirects` during build |
| `src/main.tsx` | React DOM render | `react`, `react-dom`, `App`, `index.css` | Root of app |
| `src/App.tsx` | Root layout composition | All `components/*` | Renders `<Navbar />` + all sections + `<Footer />` |
| `src/index.css` | Design tokens + global CSS | `tailwindcss` | Imported by `main.tsx` |
| `src/components/Navbar.tsx` | Navigation | Framer Motion, lucide-react | Fixed on all pages |
| `src/components/Hero3D.tsx` | 3D canvas scene | Three.js, R3F, Drei | Lazy-loaded in `Hero.tsx` |
| `src/components/Hero.tsx` | Hero content (text + buttons) | Framer Motion | Wraps `<Hero3D />` lazily |
| `tests/responsive.spec.ts` | Playwright viewport tests | `@playwright/test` | CI integration |

---

## 7. UI and 3D Design

### 7.1 Theme & Color System

**Current production colors (red-black, Samurai cinematic):**

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#050507` | Page background |
| `--bg-2` | `#0B080B` | Card / subtle background |
| `--deep` | `#020204` | Deepest shadow, footer |
| `--red` | `#FF1025` | Primary accent (logo, buttons, text) |
| `--crimson` | `#D90020` | Secondary accent / shadows |
| `--bright-red` | `#FF303A` | Highlight / glow |
| `--dark-crimson` | `#65000F` | Mid-tone shadows |
| `--text` | `#FFFFFF` | Primary text |
| `--text-2` | `#C4C4CC` | Secondary text (Navbar links) |
| `--muted` | `#92929E` | Tertiary / caption / description |
| `--border` | `#1a151a` | Card borders |

```bash
git add -A
git commit -m "feat: add shader-based fog to hero scene"
git push origin feat/your-feature-name
```

#### 5.2.4 Pull Requests

1. Open a PR from your branch → `mcabhishek`'s `main`.
2. PR must explain **why** the change was made, not just what.
3. UI changes require screenshots or before/after visuals.
4. PR must target the `main` branch.

#### 5.2.5 Owner Review & Merge

- The repository owner (`mcabhishek`) must approve PRs before merging to `main`.
- Squash-and-merge or rebase-merge is recommended for clean `main` history.

### 5.3 Branch Protection & Rulesets (Recommended)

| Rule | Recommended Setting |
|------|---------------------|
| Branch | `main` |
| Required approvals | **1** (or **2** if more collaborators) |
| Dismiss stale PR approvals | ✅ Checked |
| Require status checks to pass | ✅ Build + lint + test |
| Require conversation resolution | ✅ Checked |
| Restrict pushes to `main` | ✅ Checked (only admins) |

Suggested `.github/CODEOWNERS` file at repository root:

```text
*       @mcabhishek
```

- **GSAP** and **Lenis** imported but currently have minimal active usage (considered for future scroll-choreography).

## 8. Cloudflare Pages CI/CD

The website is a **React 19 + Vite SPA** deployed on Cloudflare Pages.

### Commands

- **Build:** `npm run build`  → outputs to `dist/`
- **Deploy:** `wrangler pages deploy`  (Cloudflare Pages)

### Why not `npx wrangler deploy`?

`wrangler deploy` is the **Workers** CLI command. It cannot deploy a Pages site
and fails with:

> Missing entry-point to Worker script or to assets directory
> Unexpected fields found in build field: "upload"

The correct command for this Pages project is `wrangler pages deploy`
(or `npx wrangler pages deploy`). The Cloudflare Pages **Deploy command**
setting in the dashboard must be `npx wrangler pages deploy`.

### `wrangler.toml`

```toml
name = "shadowcasting"
compatibility_date = "2024-09-23"

[build]
command = "npm run build"

[build.upload]
directory = "dist"
```

