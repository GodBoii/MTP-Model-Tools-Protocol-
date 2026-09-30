# Website refresh verification

The documentation refresh uses MTP source commit `72ffb74440f1620fdd71dd097198380fe12433fc`, package version 0.1.37. Website work stays on `main`.

## Source review

The review covered CLI parsing and scaffolds, public agent methods, provider factories and aliases, model discovery, terminal commands and shortcuts, conversation state, live events, persistence, tool metadata, registry risk decisions, codebase indexing, Agent OS streaming, and the existing architecture and MCP manuals.

Provider references derive parameters and capability declarations from the source AST. They do not instantiate provider clients or infer capabilities from marketing copy. Source manuals carry their original file hashes. This is a documentation and website update; the MTP runtime checkout is unchanged.

## Documentation and media changes

- Add CLI help, agent scaffolding and execution, codebase indexing, and TUI walkthrough recordings.
- Add nine screenshots from captured CLI output and actual Textual states.
- Add a runnable offline agent example that returns 42 through a real tool call.
- Sync 45 source manuals, replace 15 provider references, and add six focused website guides.
- Use current source paragraphs, section headings, and code for the existing chapter introductions.
- Put recordings and screenshots inside the existing manual-section layout.
- Put a real video inside the existing showreel popup.

## Original interface preserved

The homepage hero, document rows, hover overlays, pointer-following previews, Three.js visuals, navigation, page transitions, popup styling, chapter hero, primer, and manual layout match the original interface. Global styles match the original stylesheet apart from four media-fitting rules. Updated chapters retain the original order and color palettes; new chapters follow the existing ones.

The documentation search, filters, code-copy controls, new navigation links, new homepage layout, and redesigned chapter layout have been removed at the user's request.

## Checks

Browser verification checks the original hover and focus previews, animated navigation, the original video popup and close controls, all 50 documentation routes, media loading, all four video files, and desktop, tablet, and mobile layouts. Its screenshots and structured report are in ignored `output/verification/`.

The production build, TypeScript check, and ESLint are run before publishing. The MTP source tests for CLI offline flows, docs consistency, simple agents, TUI UX flows, and Agent OS streaming previously passed with 57 tests. The standalone offline example returned 42.

## Limits

The demos replay captured stdout and Textual screen exports. They do not claim to show a live cloud model reply. Cloud providers and local inference servers were not called during this refresh. Model defaults describe the checked-in adapter code; availability still depends on the chosen provider and account.

The existing audit and roadmap chapters remain historical source documents. The current terminal guide and release notes distinguish shipped behavior from remaining work. GitHub pushes alone do not confirm a hosting deployment; check the deployment separately when publishing.
