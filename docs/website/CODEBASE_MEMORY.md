# Codebase memory

MTP stores a project index in `.mtp/memory/codebase.sqlite`. This is a local SQLite index of file metadata, chunks, deterministic embeddings, and conversation summaries. It does not require an embedding API.

## Enable and inspect

```bash
mtp codebase memory --path ./my_agent --on
mtp codebase status --path ./my_agent
mtp codebase memory --path ./my_agent --off
```

The scan skips generated folders such as `.git`, `.venv`, `node_modules`, `dist`, and caches, along with secret-like files. Turning memory off changes the enabled flag. It does not delete the index.

## Use it in a terminal chat

```text
/codebase memory on
/codebase status
```

When memory is enabled, `project.inspect`, `fs.search`, `fs.grep`, and `codebase.search` use the index and refresh changed files before retrieval. Each chat uses its own workspace. Switching chats restores its workspace and draft, and a background scan does not replace the conversation view.

## Troubleshooting

Check `/cd` and `/codebase status` if search results describe the wrong project. Run another scan after a large checkout change. Keep the index inside the intended project root. Deterministic matching helps retrieve relevant chunks, but it does not guarantee that every relevant file appears in a result.

See [CLI](../CLI.md) and [TUI operating guide](../TUI_OPERATING_GUIDE.md).
