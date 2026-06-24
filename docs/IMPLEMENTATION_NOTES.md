# Implementation Notes

## Why policy hooks were added now

Your MTP direction includes operational safety and practical adoption. A protocol that only routes tool calls but has no execution-policy layer is hard to ship in production.

Current behavior:
- `read_only` tools: default `allow`
- `write` tools: default `allow`
- `destructive` tools: default `ask` (blocked until approval flow is added)

This is configurable via `RiskPolicy`.

## Why plan validation is strict

If a provider emits invalid plan graphs, runtime errors become hard to debug. We validate before execution to fail fast and clearly.

## Why tool control-flow exceptions were added

Complex tool ecosystems need explicit signals to control the loop:
- `RetryAgentRun`: feed correction guidance back to the model and replan.
- `StopAgentRun`: intentionally stop/pause for continuation or user intervention.

These signals now travel from tool handler -> runtime -> agent loop without being flattened into generic tool errors.

## Why async provider hooks were added

Agent async APIs now support provider-native async paths (`anext_action`, `afinalize`).
If a provider only has sync methods, MTP uses thread fallback automatically.
This keeps compatibility while preventing async app blocking when async hooks are implemented.

## Why run continuation exists

`continue_run()` and `acontinue_run()` enable pause/resume flows with preserved message/tool context.
This is especially useful when a run intentionally pauses via `StopAgentRun`.

## Compatibility with your MTP vision

Implemented now:
- lazy loading support in runtime
- batch execution semantics
- plan format with dependencies
- safety policy hook
- multi-provider adapter set (Groq/OpenAI/OpenRouter/Gemini/Anthropic/SambaNova)
- multi-provider adapter set (Groq/OpenAI/OpenRouter/Gemini/Anthropic/SambaNova/Cerebras/DeepSeek/Mistral/Cohere/TogetherAI/FireworksAI)
- run continuation and pause semantics
- structured input schema validation
- output model/parser model refinement pipeline
- dynamic tool updates (`add_tool`, `set_tools`)
- session persistence (`JsonSessionStore`, `PostgresSessionStore`, `MySQLSessionStore`)

Still needed to reach full ecosystem/library maturity:
- CLI scaffolding
- deeper provider feature parity and capability matrix
- docs site and benchmark suite

Related:
- [Storage and Sessions](STORAGE.md)
