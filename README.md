# MTPX documentation website

Documentation and recorded demos for MTPX 0.1.37, the Model Tool Protocol Python SDK and CLI. The site has 50 documentation chapters, four videos, nine product screenshots, the original animated document rows and hover previews.

## Run locally

Use Node.js 22 or later. Install the locked dependency set, then start Next.js:

```bash
npm ci
npm run dev
```

For a production preview:

```bash
npm run build
npm run start
```

The application uses Next.js 16, React 18, and TypeScript. The original GSAP and Lenis animations, hover previews, popup styling, navigation, and document layouts are preserved. Only documentation content and recorded media have been added or updated.

## Routes and content

| Route | Contents |
| --- | --- |
| `/` | Original hero and selected document rows, followed by recorded examples |
| `/docs` | Original document rows and animated hover previews for 50 chapters |
| `/docs/quickstart` | Install, offline example, scaffolding, and a first cloud agent |
| `/docs/tui-operating-guide` | Provider setup, models, keyboard controls, queues, and sessions |
| `/docs/codebase-memory` | Local indexing and search |
| `/docs/agent-os` | Optional Streamlit browser interface |
| `/docs/tool-policy` | Risk decisions and registry approval callbacks |
| `/docs/sdk-recipes` | Async calls, structured output, cancellation, and continuation |
| `/docs/release-notes` | Changes in releases 0.1.35 through 0.1.37 |
| `/docs/provider-*` | Provider constructor and capability references |

The complete registry is `content/docs.ts`. Unknown chapter slugs return 404. The original chapter layout uses current source paragraphs, section headings, and actual code examples for its introduction and primer.

## Update the manuals

The authoritative MTP source checkout is separate from this website. Sync from its local path:

```bash
npm run docs:sync -- ../MTP
```

This reads 45 source manuals and stores the package version, source commit, and original file hashes in `content/docs-source.json`. It converts local-machine source links to GitHub links and updates Groq examples to the source release's default model. It then calls `scripts/refresh-provider-docs.py` to derive 15 provider guides from actual constructor signatures and capability methods. Python is required for this step, but provider SDKs and API keys are not.

Generated provider-reference provenance lives in `content/provider-reference-source.json`. Website-specific guides live in `docs/website/`, which syncing does not overwrite. After a package release, review the website-specific release notes and screenshots as well as syncing the source manuals.

Model defaults describe this source snapshot. They do not guarantee current account access. The TUI's model catalog and custom-ID field remain the way to choose a model available to an account.

## Recreate the demos

The committed media came from local commands and Textual's real `run_test` screen exports. The videos record replays of those outputs and UI states at a readable pace. They are silent and include WebVTT captions. No cloud inference, user credentials, or existing chat history was captured.

1. Install the matching MTP source into a Python environment with Textual.
2. Use an installed Chrome browser. Playwright and Sharp are included as development dependencies.
3. Install Playwright's video encoder if it is absent.
4. Capture and render:

```bash
python -m pip install -e ../MTP
npx playwright install ffmpeg
npm run demos:capture
npm run demos:render
```

The Python script uses a temporary project and session store. It removes provider API-key variables from the capture process, scaffolds an agent, runs the downloadable offline example, indexes the demo workspace, and captures six terminal states. It checks the installed MTP version against the website's snapshot before capturing.

`public/media/cli-transcripts.json` contains the captured stdout, with only the temporary machine path replaced. `public/media/provenance.json` records the source revision and method. `public/downloads/offline_agent.py` is the executable offline example linked from the quickstart. It uses a deterministic provider and a real runtime tool call.

## Verify a change

```bash
npm run lint
npm run typecheck
npm run build
```

Start the production server in another terminal, then run browser checks:

```bash
npm run start
npm run verify:browser
```

By default, browser verification uses `http://localhost:3000`. Pass the URL of your running server explicitly when it uses another port:

```bash
npm run verify:browser -- http://localhost:3100
```

The browser script checks all documentation routes, original chapter layouts, pointer-following hover previews, keyboard-focus previews, animated route navigation, the original video popup and its close controls, playback and captions, image loading, and desktop/tablet/mobile overflow. It writes screenshots and a report to ignored `output/verification/`.

## Project layout

```text
app/                      Next.js routes, metadata, and global CSS
components/               Original previews, recorded media, navigation, and motion
content/docs.ts           Chapter registry and topic summaries
content/docs-source.json  Source version, revision, and hashes
content/demos.ts          Demo descriptions and output summaries
docs/                     Synced and derived manuals
docs/website/             Website-specific guides
lib/docsMarkdown.ts       Original Markdown parsing, file loading, and source-link resolution
public/media/             Videos, captions, screenshots, and provenance
public/downloads/         Runnable offline agent
scripts/                  Sync, reference generation, capture, render, verification
```

Source snapshots can contain historical implementation notes, changelogs, and plans. The current operating guide, source-derived provider references, and website-specific guides describe the current workflows. Cloud inference was not part of the offline verification.
