# Website refresh verification

The documentation refresh uses MTP source commit `72ffb74440f1620fdd71dd097198380fe12433fc`, package version 0.1.37. Website work stays on `main`.

## Source review

The review covered CLI parsing and scaffolds, public agent methods, provider factories and aliases, model discovery, terminal commands and shortcuts, conversation state, live events, persistence, tool metadata, registry risk decisions, codebase indexing, Agent OS streaming, and the existing architecture and MCP manuals.

Provider references derive parameters and capability declarations from the source AST. They do not instantiate provider clients or infer capabilities from marketing copy. Source manuals carry their original file hashes. This is a documentation and website update; the MTP runtime checkout is unchanged.

## What changed

- Replace the placeholder showreel with a native video dialog.
- Add CLI help, agent scaffolding and execution, codebase indexing, and TUI walkthrough recordings.
- Add nine screenshots from captured CLI output and actual Textual states.
- Add a runnable offline agent example that returns 42 through a real tool call.
- Sync 45 source manuals, replace 15 provider references, and add six focused website guides.
- Replace repeated generic chapter copy with topic summaries and a searchable 50-chapter index.
- Render nested Markdown lists, tables, autolinks, and fenced code with maintained Markdown libraries.
- Add copy controls, section anchors, breadcrumbs, source links, and 404 behavior.
- Keep reduced-motion presentation static and preserve native dialog keyboard focus.
- Update the lint command for Next.js 16 and refresh dependencies within their declared ranges.

## Checks performed

The production build, TypeScript check, and ESLint pass. The package audit reports zero vulnerabilities.

The browser checks cover 50 routes, all generated section anchors, search and section filters, empty results and reset, copying real code to the clipboard, modal video playback, Escape close, paused playback after dismissal, restored trigger focus, and normal-motion route navigation. All four WebM recordings decode at 1440 by 960 pixels and have caption files.

Nine page and viewport combinations cover the homepage, docs index, and terminal guide at desktop 1440px, tablet 768px, and mobile 390px. The checks report no horizontal overflow, missing images, page errors, or failed HTTP responses. Screenshots and the structured report are in ignored `output/verification/`.

The MTP source tests for CLI offline flows, docs consistency, simple agents, TUI UX flows, and Agent OS streaming pass with 57 tests. The standalone offline example was executed successfully and its tool result was 42.

## Limits

The demos replay captured stdout and Textual screen exports. They do not claim to show a live cloud model reply. Cloud providers and local inference servers were not called during this refresh. Model defaults describe the checked-in adapter code; availability still depends on the chosen provider and account.

The existing audit and roadmap chapters remain historical source documents. The current terminal guide and release notes distinguish shipped behavior from remaining work. GitHub pushes alone do not confirm a hosting deployment; check the deployment separately when publishing.
