# MCP Interoperability Adapter

This document explains MCP support in MTP, including sync and async server modes, dedicated MCP HTTP/WebSocket transport adapters, cancellation semantics, and compatibility coverage.

## Overview

MTP keeps orchestration/runtime logic in core modules.
MCP support is provided by protocol adapters around that runtime.

Main components:

- `MCPJsonRpcServer` in `src/mtp/mcp.py`
- `MCPHTTPTransportServer` in `src/mtp/mcp_transport.py`
- `MCPWebSocketTransportServer` in `src/mtp/mcp_transport.py`

## Implemented MCP method coverage

Lifecycle:
- `initialize`
- `notifications/initialized`

Core:
- `ping`
- `tools/list`
- `tools/call`

Resources:
- `resources/list`
- `resources/read`

Prompts:
- `prompts/list`
- `prompts/get`

Progress/Cancellation:
- `notifications/progress`
- `$/cancelRequest`
- `notifications/cancelled`

## Capability negotiation

`initialize` returns:

- `tools.listChanged`
- `resources.listChanged`
- `prompts.listChanged`
- `experimental.progressNotifications`
- `experimental.requestCancellation`

## OAuth-ready auth plugin interface

`MCPJsonRpcServer` now supports pluggable auth providers:

- constructor arg: `auth_provider=...`
- provider contract: `authorize(token, request, context) -> MCPAuthDecision | bool`
- async providers are supported in async path (`ahandle_request`)

`MCPAuthDecision` fields:

- `allowed`
- `error_code` (default `-32001`)
- `message`
- `www_authenticate` (for challenge headers)
- `details` (structured auth metadata)

This enables OAuth-style challenge responses without hard-coding one auth backend into core MCP code.

`require_auth=True` is fail-closed. You must also pass one of:

- `auth_token="shared-secret"`
- `auth_validator=callable`
- `auth_provider=provider`

MTP refuses `require_auth=True` by itself because accepting any non-empty token is not meaningful authentication.

Example:

```python
from mtp import MCPAuthDecision, MCPJsonRpcServer

class OAuthProvider:
    def authorize(self, token, request, context):
        if token == "valid-token":
            return MCPAuthDecision(allowed=True)
        return MCPAuthDecision(
            allowed=False,
            message="Missing OAuth bearer token",
            www_authenticate='Bearer realm="mtp", error="invalid_token"',
        )

server = MCPJsonRpcServer(tools=tools, auth_provider=OAuthProvider())
```

## Sync vs async request handling

`MCPJsonRpcServer` supports:

- sync:
  - `handle_request(...)`
  - `handle_json(...)`
- async:
  - `ahandle_request(...)`
  - `ahandle_json(...)`

Use async handlers when you need stronger in-flight cancellation for long-running async tool calls.

## In-flight cancellation semantics

Cancellation model:

1. Client sends `$/cancelRequest` or `notifications/cancelled`.
2. Request id is marked as cancelled.
3. Async call tasks (if active) are cancelled immediately.
4. Cancelled requests return JSON-RPC error `-32800`.

Important:

- Async tool calls support true in-flight cancellation.
- Synchronous tool handlers are still cooperative at runtime level (`cancel_event`/`cancel_checker`).

## Progress semantics

- inbound `notifications/progress` is accepted and recorded
- outbound progress events are emitted from `tools/call` when `progressToken` is set
- progress events are available via:
  - `MCPJsonRpcServer.progress_events`
  - `progress_handler`
  - registered progress listeners (used by MCP HTTP/WebSocket transport)

## MCP-specific HTTP transport

`MCPHTTPTransportServer(host, port, server)` adds MCP-aware HTTP behavior:

- POST JSON-RPC endpoint: `/rpc` (also `/`)
- batch JSON-RPC request support (array payload)
- session header propagation:
  - request/response header: `MCP-Session-Id`
- bearer token propagation:
  - `Authorization: Bearer <token>` -> `params.auth_token`
  - query-string auth tokens are intentionally ignored; do not put bearer tokens in URLs
- auth challenge propagation:
  - JSON-RPC auth error `error.data.www_authenticate` -> HTTP `WWW-Authenticate` header
- progress event polling endpoint:
  - `GET /events?limit=20`
  - supports resume cursor via query params: `since_id`, `last_event_id`, `resume_token`, or `since`
  - also supports `Last-Event-ID` request header
  - returns `next_resume_token` and `latest_event_id` for reconnect checkpoints
- SSE stream endpoint:
  - `GET /events/stream` (alias: `GET /events/sse`)
  - content type: `text/event-stream`
  - emits `id: <event_id>` + `event: progress` + JSON `data: ...`
  - supports replay from cursor using query params or `Last-Event-ID`
  - includes keepalive comments for long-lived connections
  - event visibility is scoped by request context:
    - `MCP-Session-Id`
    - `Authorization: Bearer ...` (via auth fingerprint)

Reconnect patterns:

1. Polling resume:
   - call `/events?since_id=<last_seen>&limit=...`
   - read `next_resume_token` from response
   - store it client-side as checkpoint

2. SSE resume:
   - call `/events/stream` with `Last-Event-ID: <last_seen>` (or `?since_id=<id>`)
   - on reconnect, resend that cursor
   - continue consuming `id:` values from stream

3. Session-scoped clients:
   - include same `MCP-Session-Id` and bearer token on reconnect
   - this keeps replay visibility bound to that session/auth scope

Example:

```python
from mtp import MCPHTTPTransportServer, MCPJsonRpcServer, ToolRegistry, ToolSpec

tools = ToolRegistry()
tools.register_tool(ToolSpec(name="calc.add", description="Add"), lambda a, b: a + b)

server = MCPJsonRpcServer(tools=tools)
transport = MCPHTTPTransportServer("127.0.0.1", 8081, server)
transport.start()
```

Repository example:
- [mcp_http_server.py](/c:/Users/prajw/Downloads/MTP/examples/mcp_http_server.py)
- [mcp_http_resume_client.py](/c:/Users/prajw/Downloads/MTP/examples/mcp_http_resume_client.py)

## MCP-specific WebSocket transport

`MCPWebSocketTransportServer(host, port, server)`:

- receives JSON-RPC requests over websocket
- uses async request handling (`ahandle_request`)
- sends standard JSON-RPC responses
- broadcasts progress as JSON-RPC notifications:
  - `method: "notifications/progress"`
- supports replay parity with HTTP:
  - connect with `?since_id=<id>` to receive replay on connect
  - call JSON-RPC method `events/replay` with:
    - params: `since_id`, `limit`
    - result: `events`, `next_resume_token`, `latest_event_id`
  - replay/broadcast visibility is scope-aware by session/auth context

Example:

```python
from mtp import MCPWebSocketTransportServer, MCPJsonRpcServer

ws_server = MCPWebSocketTransportServer("127.0.0.1", 8766, MCPJsonRpcServer(tools=tools))
await ws_server.start()
await ws_server.serve_forever()
```

Repository example:
- [mcp_ws_replay_client.py](/c:/Users/prajw/Downloads/MTP/examples/mcp_ws_replay_client.py)

WebSocket replay request example:

```json
{
  "jsonrpc": "2.0",
  "id": "replay-1",
  "method": "events/replay",
  "params": {
    "since_id": 120,
    "limit": 50
  }
}
```

## Error model

Returned error codes:

- `-32700`: parse error
- `-32600`: invalid request
- `-32602`: invalid params
- `-32000`: internal server error
- `-32001`: unauthorized
- `-32002`: server not initialized
- `-32800`: request cancelled

## Compatibility/conformance automation

MTP now includes an automated conformance harness under:

- `tests/conformance/*`
- runner: `tests/conformance/run_conformance.py`

Scenario set executed per client profile:

- initialize lifecycle
- tools list/call
- resources/prompts
- cancellation/progress
- auth challenge behavior

Supported built-in client profiles:

- `direct` (in-process JSON-RPC client)
- `http` (real HTTP transport client)

Optional external third-party wrappers:

- `tests/conformance/clients.py` includes `SubprocessExternalClient`
- lets external client adapters run against local MCP server endpoints
- intended for future integrations with real third-party MCP clients

Artifacts generated:

- machine-readable JSON report (default: `tmp/conformance/report.json`)
- human-readable matrix doc (default: `docs/MCP_COMPATIBILITY_MATRIX.md`)

Failure triage tags:

- `protocol_mismatch`
- `transport_mismatch`
- `auth_mismatch`

Release regression policy:

- Conformance workflow runs in CI matrix:
  - client profile (`direct`, `http`) x server feature set (`core`, `resumable`)
- Critical compatibility failures return non-zero (`--fail-on-critical`)
- CI blocks merge/release on critical breaks.

## Test coverage

- [test_mcp_adapter.py](/c:/Users/prajw/Downloads/MTP/tests/test_mcp_adapter.py)
- [test_mcp_transport.py](/c:/Users/prajw/Downloads/MTP/tests/test_mcp_transport.py)
- [test_mcp_conformance.py](/c:/Users/prajw/Downloads/MTP/tests/test_mcp_conformance.py)
- [MCP compatibility matrix](MCP_COMPATIBILITY_MATRIX.md)

## Remaining MCP work

1. OAuth discovery/scope/refresh integrations beyond provider hook level.
2. Expand third-party client adapters from wrapper contract to concrete upstream clients in CI.
3. Resumable stream depth beyond current event replay window (for example durable event stores across process restarts).
