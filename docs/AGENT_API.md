# Agent API Reference

This document is the canonical reference for `Agent` and `MTPAgent`.

## Constructor

Source: [agent.py](/c:/Users/prajw/Downloads/MTP/src/mtp/agent.py)

```python
Agent(
    provider: ProviderAdapter,
    registry: ToolRegistry | None = None,
    *,
    tools: ToolRegistry | None = None,
    debug_mode: bool = False,
    debug_logger: Callable[[str], None] | None = None,
    debug_max_chars: int | None = None,
    strict_dependency_mode: bool = False,
    instructions: str | None = None,
    system_instructions: str | None = None,
    stream_chunk_size: int = 40,
    max_history_messages: int = 200,
    send_media_to_model: bool = True,
    enforce_provider_capabilities: bool = True,
    allow_stream_fallback: bool = True,
    autoresearch: bool = False,
    research_instructions: str | None = None,
    stream_tool_events: bool = True,
    stream_tool_results: bool = True,
    session_store: SessionStore | None = None,
    mode: str = "standalone",
    members: dict[str, Agent] | None = None,
)
```

`mode` options:
- `standalone` (default): regular single-agent behavior.
- `member`: marks this instance as a delegated sub-agent.
- `delegator` / `orchestration`: enables member delegation tools.

When `mode` is `delegator` or `orchestration`, each member is exposed as a tool:
- `agent.member.<member_name>`
- input: `{"task": ..., "max_rounds": 5, "tool_call_limit": ...}`
- output: member agent final text response.

Capability enforcement options:
- `enforce_provider_capabilities=True` (default): fail fast when requested features are unsupported by the active provider.
- `allow_stream_fallback=True` (default): if provider has no native `finalize_stream`, stream APIs degrade safely by chunking the `finalize()` output.
- `send_media_to_model=True` (default): include media payloads in model messages (still subject to capability guardrails).

Autoresearch options:
- `autoresearch=False` (default): normal run-loop completion behavior.
- `autoresearch=True`: persistent run behavior where direct assistant text does not end the run by itself; the model should terminate explicitly via `agent.terminate`, user cancellation, or round/budget limits.
- `research_instructions`: additional system instruction text appended only when `autoresearch=True`.

When `autoresearch=True`, MTP injects:
- internal autoresearch system instructions
- internal tool: `agent.terminate(reason: str, summary: str)`

Tool-event streaming options:
- `stream_tool_events=True` (default): include tool lifecycle events in `run_loop_events` / `run_events`.
- `stream_tool_results=True` (default): include tool output/error payloads in `tool_finished` events.
- If `stream_tool_events=False`, tool lifecycle events are suppressed regardless of `stream_tool_results`.
- `debug_max_chars=None` (default): do not truncate debug payloads. Set an integer limit if you want shorter debug lines.

## Runtime methods

### Basic execution

- `run(user_input: Any) -> str`
- `arun(user_input: Any) -> str`
- `run_loop(user_input: Any, max_rounds: int = 5, *, tool_call_limit: int | None = None, input_schema: dict | None = None) -> str`
- `arun_loop(...) -> str`

`run`/`arun`/`run_loop`/`arun_loop` also accept optional `user_id`, `session_id`, and `metadata`.
When `session_store` is configured and `session_id` is provided, message history is loaded and persisted automatically.

Built-in stores:
- `JsonSessionStore`
- `PostgresSessionStore`
- `MySQLSessionStore`

`user_input` can be a string, dict, list, or model-like object (`model_dump`/`dict` supported).

### Structured input

- `input_schema` is supported on:
  - `run_loop`
  - `arun_loop`
  - `run_output`
  - `arun_output`
  - `run_stream`/events wrappers via `MTPAgent`

If validation fails, run exits early with `RunOutput.output_validation_error`.

### Structured output

- `output_schema` is supported on:
  - `run_output`
  - `arun_output`

When provided, MTP parses final text as JSON and validates against the schema.

### Output model pipeline

`run_output` and `arun_output` support:

- `output_model`
- `output_model_prompt`
- `parser_model`
- `parser_model_prompt`

Pipeline order:
1. primary run generates final text
2. optional `output_model` refines it
3. optional `parser_model` post-processes it
4. optional `output_schema` validation runs

### RunOutput

Source: [agent.py](/c:/Users/prajw/Downloads/MTP/src/mtp/agent.py)

Fields:

- `run_id`
- `input`
- `final_text`
- `messages`
- `tool_results`
- `user_id`
- `session_id`
- `metadata`
- `cancelled`
- `total_tool_calls`
- `output`
- `output_validation_error`
- `paused`
- `pause_reason`
- `terminated`
- `termination_reason`

### Cancellation and continuation

- `cancel_run(run_id: str) -> bool`
- `continue_run(run_output: RunOutput | None = None, run_id: str | None = None, ...) -> RunOutput`
- `acontinue_run(...) -> RunOutput`

Paused runs (for example from `StopAgentRun`) can be resumed by `run_id` or prior `RunOutput`.

### Streaming

- `run_loop_stream(...) -> Iterator[str]`
- `run_loop_events(...) -> Iterator[dict]`
- `arun_loop_events(...) -> AsyncIterator[dict]`

When provider capabilities are enabled:
- media inputs (`images`, `audios`, `videos`, `files`) are validated against provider-declared supported modalities.
- stream requests validate native finalize-stream support and either:
  - fail fast with a clear error, or
  - degrade to finalize-output chunk streaming when fallback is enabled.

`MTPAgent.print_response(..., stream_events=True)` prints readable terminal logs by default.
Use `event_format="json"` for raw JSON lines.
`debug_mode` controls event verbosity for `print_response(..., stream_events=True)`:
- `False`: normal concise logs
- `True`: detailed debug logs (plans, batches, tool lifecycle, payloads, top-level XML context sections, metrics blocks)

In autoresearch mode:
- direct assistant text chunks can appear as intermediate progress updates.
- completion is expected via `agent.terminate` (emitted as `run_terminated` event before `run_completed`).

### Dynamic tool management

- `add_tool(tool: RegisteredTool | Callable) -> None`
- `set_tools(tools: list[RegisteredTool | Callable]) -> None`

This enables post-initialization tool updates without rebuilding the agent.

## Tool control-flow exceptions

Source: [exceptions.py](/c:/Users/prajw/Downloads/MTP/src/mtp/exceptions.py)

- `RetryAgentRun("feedback")`: injects feedback and asks the model to replan.
- `StopAgentRun("reason")`: pauses/stops the current run and returns with `paused=True`.

## Async provider contract

Providers may now implement optional async hooks:

- `anext_action(...)`
- `afinalize(...)`

If not implemented, agent async APIs use thread fallback for sync provider methods.

## MTPAgent wrapper

Source: [simple_agent.py](/c:/Users/prajw/Downloads/MTP/src/mtp/simple_agent.py)

`MTPAgent` mirrors the same features:

- `run`, `arun`
- `run_output`, `arun_output`
- `run_stream`
- `run_events`, `arun_events`
- `continue_run`, `acontinue_run`
- `cancel_run`
- `print_response`

See full persistence examples and provider-specific setup:
- [Storage and Sessions](STORAGE.md)
