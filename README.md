# MTPX Documentation Frontend

Motion-led documentation website for MTPX, a multi-tool protocol runtime and SDK for inspectable agent systems.

The site is built as an editorial documentation experience rather than a generic docs template. The homepage introduces the `mtpx` identity, the docs index uses a large typographic row system with hover previews, and each documentation chapter opens into a detailed page with explanation, use cases, implementation notes, and code examples.

## What This Site Contains

- A cinematic landing page for MTPX.
- A documentation index at `/docs`.
- Dynamic documentation pages at `/docs/[slug]`.
- 50+ generated documentation routes covering planning, DAG execution, runtime, tool registry, sessions, providers, safety, observability, SDK APIs, and examples.
- A support/contact page focused on MTPX integration, debugging, providers, sessions, event streams, and MCP bridges.
- Redirects from old portfolio routes (`/work`, `/work/[slug]`, `/studio`) to `/docs`.
- Smooth scrolling, route transitions, text reveals, hover previews, and interactive WebGL-like visual panels.

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- GSAP for motion and route/page reveal choreography
- Lenis for smooth scrolling
- Three.js for kinetic canvas visuals
- CSS Modules-style global editorial CSS in `app/globals.css`
- Lucide React icons

## Project Structure

```text
mtp-frontend/
  app/
    page.tsx              # landing page
    docs/page.tsx         # docs index
    docs/[slug]/page.tsx  # dynamic docs detail pages
    contact/page.tsx      # MTPX contact/support form
    work/                 # redirects to docs
    studio/               # redirects to docs
    globals.css           # visual system, layout, responsive rules
    layout.tsx            # app shell
  components/
    DocsRows.tsx          # docs row index with hover preview
    Providers.tsx         # Lenis, loader, GSAP route transition
    Visual.tsx            # kinetic Three.js visual panel
    Header.tsx
    Footer.tsx
    ContactForm.tsx
    TextReveal.tsx
  content/
    docs.ts               # documentation chapters and page content
    site.ts               # nav, install command, contact options
    projects.ts           # legacy project data retained for old case-study components
  lib/
    motion.ts             # shared motion helpers
  output/playwright/      # verification screenshots
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page with `mtpx` hero and selected docs rows |
| `/docs` | Complete documentation index |
| `/docs/introduction` | Introduction chapter |
| `/docs/quickstart` | Quickstart chapter |
| `/docs/installation` | Installation chapter |
| `/docs/provider-groq` | Provider-specific docs example |
| `/docs/example-research` | Example use-case chapter |
| `/contact` | MTPX support/integration form |
| `/work`, `/studio` | Redirect to `/docs` |

The full documentation route list is defined in `content/docs.ts`.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

If port `3000` is already in use, run another port:

```bash
npm run dev -- --port 3002
```

## Production Build

Create an optimized production build:

```bash
npm run build
```

Start the production server after building:

```bash
npm run start
```

## Useful Commands

```bash
npm run dev      # start local dev server
npm run build    # type-check and create production build
npm run start    # serve production build
npm run lint     # run Next.js lint command
```

## Editing Documentation Content

Most documentation content lives in:

```text
content/docs.ts
```

Key exports:

- `docChapters`: primary source for `/docs` index rows and `/docs/[slug]` pages.
- `getDocChapter(slug)`: resolves a chapter by slug.
- `getNextDocChapter(slug)`: powers the next-doc link on detail pages.

Each chapter includes:

- `slug`
- `title`
- `group`
- `track`
- `summary`
- `useCase`
- `explanation`
- `bullets`
- `code`
- `palette`

To add a new docs page, add an entry to `rawDocChapters` in `content/docs.ts`. The dynamic route will be generated automatically.

## Motion And Interaction Notes

- `components/Providers.tsx` owns the loader, smooth scrolling, page reveal, and route transition curtain.
- `components/DocsRows.tsx` owns the row hover behavior and floating docs preview.
- `components/Visual.tsx` renders the animated canvas-backed visual panels.
- `components/TextReveal.tsx` wraps words for GSAP reveal animations.

Reduced motion is handled in CSS with `prefers-reduced-motion`.

## Design Direction

The site intentionally uses:

- Oversized typography.
- Sparse neutral shell colors.
- Red accent states.
- Typographic list navigation.
- Hover previews instead of card grids.
- Editorial page rhythm.
- Motion as interface feedback rather than decoration only.

The primary package command shown in the shell is:

```bash
pip install mtpx
```

## Verification

The current implementation has been checked with:

```bash
npm run build
```

Screenshots from browser verification are stored in:

```text
output/playwright/
```

## Notes

This frontend is documentation-focused. Older portfolio/studio routes are intentionally redirected to `/docs` so the website does not expose unrelated agency or portfolio context.
