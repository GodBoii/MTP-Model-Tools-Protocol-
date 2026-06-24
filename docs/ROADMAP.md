# MTP Roadmap (Python)

Direction alignment:
- Roadmap items should be evaluated against the protocol-vs-SDK boundaries in
  [Project Direction](PROJECT_DIRECTION.md).

## Current implementation snapshot (2026-04-06)

Implemented in codebase:
- Protocol objects, plan validation, risk policy, and runtime caching.
- Lazy toolkit loading with tool-spec preview.
- Sync + async agent APIs, multi-round loops, streaming text/events.
- Pause/resume (`StopAgentRun`) and retry (`RetryAgentRun`) control flow.
- Structured input validation and structured output pipeline.
- Session persistence (`JsonSessionStore`, `PostgresSessionStore`, `MySQLSessionStore`).
- MCP compatibility adapter for `initialize`, `ping`, `tools/list`, `tools/call`.
- MCP adapter coverage now also includes resources/prompts/progress/cancellation surfaces.
- MCP dedicated transports now include HTTP and WebSocket adapters with session/auth semantics and progress delivery hooks.
- MCP HTTP transport now supports resumable progress replay (`event_id`/`resume_token` cursor) and SSE (`/events/stream`, `/events/sse`) for browser/server streaming clients.
- MCP replay retention controls now include bounded size/time windows and optional file-backed durable replay store (`replay_store_path`).
- MCP replay visibility is now scope-aware by session/auth context, including websocket replay parity (`events/replay`).
- MCP auth now supports pluggable provider hooks with structured OAuth-style challenge metadata.
- Provider adapters: Groq, OpenAI, OpenRouter, Gemini, Anthropic, SambaNova, Cerebras, DeepSeek, Mistral, Cohere, TogetherAI, FireworksAI.
- Local toolkits and optional web/scrape toolkits.
- Delegation/orchestration mode (`mode="delegator"`/`"orchestration"` with member agents as tools).
- Transport primitives: stdio + HTTP + optional WebSocket, with shared cancel control envelope semantics.
- Runtime in-flight cancellation checks for running tool execution (async direct, sync cooperative).

Still missing from roadmap goals:
- MCP auth ecosystem integrations beyond auth-provider hook level (OAuth discovery endpoints, scope negotiation standards, refresh lifecycle workflows).
- External MCP client compatibility matrix automation and broader conformance harness (real third-party client runs in CI).
- Durable resumability beyond single-node file-backed replay (for example shared/distributed event stores for clustered deployments).
- Provider capability matrix and deeper per-provider structured-output feature parity guarantees.
- First-party CLI scaffolding (`mtp new`) and template generation.
- Centralized tracing/analytics query APIs over persisted run data.
- Broader integration matrix/benchmarks across optional provider SDKs.
- Packaging ergonomics (extras groups for provider/toolkit/database optional dependencies).
- Test harness hardening for mixed local environments (ignoring transient `tmp/` dirs during discovery, sandbox-aware temp path strategy).

## Phase 0 (current)
- Protocol objects for tools, calls, results, and plans.
- Runtime for lazy loading, parallel/sequential batches, call dependencies.
- TTL caching for repeat calls.
- Provider adapter interface and local planner.
- Basic tests and quickstart.

## Phase 1 (implemented)
- Versioned wire schema baseline:
  - `mtp_version` envelope (`MessageEnvelope`)
- Deterministic plan validator:
  - no duplicate call IDs
  - cycle detection
  - dependency edge validation
- Approval policy hooks:
  - allow / ask / deny by risk level
  - per-tool override via `by_tool_name`
- Provider adapter baseline:
  - model-native tool calls
  - dotenv loading support
  - adapters for Groq/OpenAI/OpenRouter/Gemini/Anthropic/SambaNova and additional optional providers
- Local toolkit package:
  - calculator
  - file
  - python
  - shell
- Agent multi-round execution:
  - `run_loop(max_rounds=N)`
- Run continuation:
  - `continue_run(...)` / `acontinue_run(...)`
- Structured input/output:
  - `input_schema` validation
  - `output_schema` parsing/validation
- Output refinement pipeline:
  - `output_model` + `parser_model`
- Dynamic tool mutation:
  - `add_tool(...)` / `set_tools(...)`
- Tool control-flow exceptions:
  - `RetryAgentRun`
  - `StopAgentRun`
- Async provider hooks:
  - `anext_action(...)`
  - `afinalize(...)`
- Transport scaffolding:
  - stdio envelope transport
  - HTTP envelope transport
- Persistent session store:
  - `JsonSessionStore`
  - `PostgresSessionStore`
  - `MySQLSessionStore`

## Phase 2
- Provider depth:
  - richer per-provider feature flags
  - native structured output modes where available
  - advanced token/usage/trace metadata
  - explicit capability metadata contract (what each provider guarantees: tools, multimodal input/output, streaming finalize, structured output strictness)
- Planner modes:
  - direct model-native tool calls
  - model-generated MTP plan mode
- advanced multi-round policies:
  - adaptive stop conditions
  - budget-aware continuation

## Phase 3
- Advanced transport and remote execution:
  - remote tool servers and cross-process execution patterns
  - streamable transport upgrades (for long-running workflows and resumability)
  - SSE endpoint option for MCP and non-MCP transport consumers
  - pluggable transport expansion beyond current stdio/HTTP envelope primitives
- Unified tracing events for all tool calls.
- Rich analytics/query APIs on top of persisted session data.

## Phase 4
- Developer experience:
  - `mtp new` project template
  - tool decorator package (`@mtp_tool`)
  - docs site with runnable examples and cookbook
  - integration test matrix across providers
  - published provider/toolkit capability matrix and conformance badges
