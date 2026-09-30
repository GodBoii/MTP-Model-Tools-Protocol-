# What changed in 0.1.37

This website documents the local MTPX 0.1.37 source snapshot. The package requires Python 3.10 or later and includes Textual in the base install. Provider SDKs, web toolkits, database drivers, and Streamlit remain optional extras.

## 0.1.37

Provider setup now keeps its actions visible when the terminal resizes. Cloud credentials use a masked entry form. Local setup validates endpoint URLs and supports loading models from the configured server. Provider model discovery preserves custom IDs and keeps a cached list if discovery fails.

Command selection executes completed slash commands. Chat navigation uses F1 through F9 and previous/next shortcuts. Background notices preserve the active chat. Doctor reads the same credential settings as the TUI without printing keys.

## 0.1.36

Codex model, reasoning, and subscription information follow the installed CLI's metadata. Command selection no longer loops on a completed suggestion.

## 0.1.35

The SDK, CLI, and TUI shipped together with aligned package metadata. Changes included chat-specific codebase scans, lossless Agent OS streaming, and transcript context when rebuilding agents.

## Current terminal behavior

Each open chat has its own draft, cursor, attachments, history, and run state. Enter queues a prompt while a reply runs. Ctrl+X stops the active reply. MTP backends that support steering accept Ctrl+G or `/steer`; Codex replies use the queue.

Use the [operating guide](../TUI_OPERATING_GUIDE.md) for exact commands and controls. Read the [source changelog](https://github.com/GodBoii/Model-Tool-protocol-/blob/main/CHANGELOG.md) for the longer improvement history and remaining work.
