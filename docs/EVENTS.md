# Event Stream Contract

MTP exposes a provider-agnostic event stream through:

```python
agent.run_events(prompt, max_rounds=5, stream_final=True)
```

or:

```python
agent.print_response(prompt, stream=True, stream_events=True)
```

All providers map into the same event shape.

`print_response(..., stream_events=True)` now defaults to human-readable terminal formatting.
Use `event_format="json"` to print raw JSON lines.
Pretty logs use explicit level prefixes such as `INFO |`, `DEBUG |`, and `ERROR |`.

Event verbosity follows `debug_mode`:
- `debug_mode=False` (normal): concise lifecycle logs (`run_started`, `round_started`, streamed text, completion/cancel/pause/retry, strict violations).
- `debug_mode=True` (debug): full trace, including plans, batch starts, assistant tool-call messages, and tool start/end payloads.
  - Debug trace includes only top-level XML sections for separation of concerns (`<tools>`, `<team_members>`, `<system_instructions>`, `<user_instructions>`, `<orchestration_instructions>`), plus metrics blocks.

## Base fields

Every event includes:
- `type`: event kind
- `timestamp`: ISO 8601 UTC timestamp
- `run_id`: stable id for the run
- `sequence`: monotonic event index within the run
- Optional run context fields on `run_started`: `user_id`, `session_id`, `metadata`
- Optional validation field on `run_started`: `input_validation_error`

## Event types

- `run_started`
  - `user_message`
  - `max_rounds`
  - `tools_available`
  - `tool_names`
  - `direct_tool_names`
  - `delegation_tool_names`
  - `system_instructions`
  - `user_instructions`
  - `autoresearch`
  - `research_instructions`
  - `orchestration_instructions`
  - `member_agents`: list of `{id, mode, delegation_tool, role, tools}`
  - `stream_tool_events`
  - `stream_tool_results`

- `round_started`
  - `round`

- `llm_response`
  - `round`
  - `stage`: optional (`"finalize"` for final response generation)
  - `provider`
  - `model`
  - `usage`: optional `{input_tokens, output_tokens, total_tokens, reasoning_tokens}`
  - `duration_seconds`
  - `has_plan`
  - `has_response`

- `plan_received`
  - `round`
  - `batches`: list of `{mode, calls, call_ids}`

- `strict_violations`
  - `round`
  - `violations`: list of `{call_id, tool_name, message}`

- `assistant_tool_message`
  - `round`
  - `message`: raw assistant tool call message

- `batch_started`
  - `round`
  - `batch_index`
  - `mode`
  - `call_ids`

- `tool_started`
  - `round`
  - `batch_index`
  - `call_id`
  - `tool_name`
  - `arguments`
  - `depends_on`
  - `reasoning` (optional concise rationale summary)

- `tool_finished`
  - `round`
  - `call_id`
  - `tool_name`
  - `success`
  - `cached`
  - `approval`
  - `output` (present only when tool-result streaming is enabled)
  - `error` (present only when tool-result streaming is enabled)
  - `reasoning` (optional concise rationale summary)

- `text_chunk`
  - `chunk`
  - `source`: `direct | finalize_stream | finalize_fallback`

- `run_completed`
  - `final_text`
  - `rounds`
  - `total_tool_calls`

- `run_terminated`
  - `round`
  - `reason`
  - `tool_name`

- `run_cancelled`
  - `round`

- `run_failed`
  - `round`
  - `error_type`
  - `error`

- `tool_retry_requested`
  - `round`
  - `tool_name`
  - `feedback`

- `run_paused`
  - `round`
  - `reason`
  - `tool_name`

## Why this is provider-agnostic

Providers only produce actions/plans and optional token streams.  
The Agent owns event emission, so frontend code can consume one stable event model regardless of provider.

Related:
- [Storage and Sessions](STORAGE.md)
