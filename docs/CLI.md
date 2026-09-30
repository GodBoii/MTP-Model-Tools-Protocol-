# CLI

MTP provides a first-party CLI:

```bash
mtp --help
```

## Commands

## `mtp new <name>`

Create a new project scaffold.

```bash
mtp new my_agent
mtp new my_server --template mcp-http
mtp new my_memory_agent --template session-json
```

Options:
- `--template {minimal,mcp-http,session-json}`
- `--dir <base_dir>`
- `--force`

Generated projects include:
- starter code (`app.py` or `server.py`)
- `.env.example`
- `pyproject.toml` with optional provider extras suggestions
- `README.md`

## `mtp run`

Run a scaffolded project entry script from the current folder (or `--path`).

```bash
mtp run
mtp run --path ./my_agent
mtp run --path ./my_server --entry server.py
```

Default entry resolution order:
1. `app.py`
2. `server.py`
3. `main.py`

## `mtp doctor`

Environment validation tool.

```bash
mtp doctor
mtp doctor --provider groq
mtp doctor --provider groq --session-db ./custom-sessions
mtp doctor --provider openai --provider anthropic
```

Checks include:
- Python version support
- `python-dotenv` availability
- provider SDK import availability
- saved TUI keys and provider API-key environment variables, without printing credentials

Returns non-zero if warnings are detected.

## `mtp providers list`

List known providers and their operational metadata.

```bash
mtp providers list
```

Output columns:
- provider name
- alias/class
- SDK module and install status
- API key env var

## `mtp codebase memory`

Enable or disable project codebase memory and indexing.

```bash
mtp codebase memory
mtp codebase memory --on
mtp codebase memory --off
mtp codebase memory --path ./my_project --on
mtp codebase status
```

When enabled, MTP scans the project root, skips heavy/generated folders such as
`.git`, `.venv`, `venv`, `node_modules`, `dist`, `build`, caches, and secret-like
files, then stores the index in:

```text
<project>/.mtp/memory/codebase.sqlite
```

The index includes file metadata, code/text chunks, deterministic vector-style
embeddings for semantic matching, and conversation summaries recorded after TUI
turns. TUI users can manage the same feature with:

```text
/codebase memory
/codebase memory on
/codebase memory off
/codebase status
```

When memory is on, TUI harness tools such as `project.inspect`, `fs.search`,
`fs.grep`, and `codebase.search` use the stored index and refresh changed files
before retrieval.

## `mtp tui`

Launch the interactive terminal UI:

```powershell
mtp tui
mtp tui --backend groq
mtp tui --backend ollama --cwd C:/projects/my-project
```

Read the [TUI operating guide](TUI_OPERATING_GUIDE.md) for provider setup, masked key entry, current/custom model selection, keyboard controls, command output, sessions, and local inference.

The first useful steps are `/backend` to choose a provider, `/apikey` to configure credentials, and `/model` to choose a model. Selecting an unconfigured provider opens setup with Save, Providers, and Cancel actions. Provider selection does not send a chat request.

Commands dismiss the home banner so output stays above the composer. Ctrl+O focuses output for PageUp/PageDown scrolling; Escape returns to the input. Ctrl+N creates a chat; F1–F9 and Alt+Left/Right switch chats. `/thinking` is the single visible thinking command; `/reasoning` remains a hidden compatibility alias.

Use `mtp tui --help` for launch flags. Settings and sessions default to `~/.mtp/sessions/`. `--session-db` selects another directory. The [audit](TUI_UX_AUDIT.md) records reproduced issues and subsequent verification.
