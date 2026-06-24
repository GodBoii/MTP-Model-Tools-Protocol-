# Transport Layer

MTP provides transport primitives that are shared across the ecosystem (not only MCP):

- stdio envelope transport
- HTTP envelope transport
- optional WebSocket envelope transport

All use `MessageEnvelope` JSON serialization.

## Envelope model

`MessageEnvelope` fields:
- `mtp_version`
- `kind`
- `payload`
- `metadata`

Helpers:
- `to_dict()` / `from_dict()`
- `to_json()` / `from_json()`

## Stdio transport

`run_stdio_transport(handler)`:
- reads one JSON envelope per stdin line
- writes one JSON envelope per stdout line

```python
from mtp.schema import MessageEnvelope
from mtp.transport import run_stdio_transport

def handler(env: MessageEnvelope, cancel_checker=None) -> MessageEnvelope:
    if callable(cancel_checker) and cancel_checker():
        return MessageEnvelope.create(kind="cancelled", payload={"message": "request cancelled"})
    return MessageEnvelope.create(kind="pong", payload={"echo": env.payload})

run_stdio_transport(handler)
```

## HTTP transport

`HTTPTransportServer(host, port, handler)`:
- accepts POST requests with JSON envelopes
- responds with JSON envelopes
- supports control envelopes for cancellation (`kind="cancel"` / `kind="cancel_request"`)

```python
from mtp.schema import MessageEnvelope
from mtp.transport import HTTPTransportServer

def handler(env: MessageEnvelope, cancel_checker=None) -> MessageEnvelope:
    if callable(cancel_checker) and cancel_checker():
        return MessageEnvelope.create(kind="cancelled", payload={"request_id": env.metadata.get("request_id")})
    return MessageEnvelope.create(kind="ok", payload={"kind": env.kind})

server = HTTPTransportServer("127.0.0.1", 8080, handler)
server.start()
```

## WebSocket transport (optional dependency)

Install dependency:

```bash
pip install websockets
```

Use:

```python
from mtp.schema import MessageEnvelope
from mtp.transport import WebSocketTransportServer

async def handler(env: MessageEnvelope, cancel_checker=None) -> MessageEnvelope:
    if callable(cancel_checker) and cancel_checker():
        return MessageEnvelope.create(kind="cancelled", payload={"message": "stopped"})
    return MessageEnvelope.create(kind="ok", payload={"kind": env.kind})

server = WebSocketTransportServer("127.0.0.1", 8765, handler)
await server.start()
await server.serve_forever()
```

## Transport-level cancellation semantics

These transport primitives now support common cancellation control messages:

- `kind="cancel"` or `kind="cancel_request"`
- expected payload: `{"request_id": "<id>"}` (or `{"id": "<id>"}`)

Behavior:

1. transport records the cancelled request id
2. transport returns a `cancel_ack` envelope
3. subsequent envelopes with matching `metadata.request_id` (or equivalent id fields)
   receive a `cancel_checker` callback in handler context

This lets app handlers, tool runners, or agent wrappers stop work consistently across stdio/HTTP/WebSocket transports.

## Runtime-level in-flight cancellation (tool execution)

At runtime level (`ToolRegistry`), cancellation is now checked during in-flight execution:

- async tool handlers can be cancelled directly while running
- sync handlers run in worker threads and can support cooperative cancellation using:
  - `cancel_checker` parameter
  - `cancel_event` parameter

Example cooperative sync tool:

```python
def long_task(cancel_event=None):
    while True:
        if cancel_event is not None and cancel_event.is_set():
            return "cancelled safely"
        # do work chunk
```

## Notes and current limits

- In-flight cancellation is strongest for async handlers.
- For sync handlers, cancellation is cooperative (handler must check `cancel_event` / `cancel_checker`).
- Production concerns like auth hardening, retries, and tracing propagation are still evolving.
- MCP HTTP transport now includes resumable progress event delivery (event IDs + replay cursor) and SSE (`/events/stream`).
- MCP transport replay now supports:
  - size/time bounded retention (`replay_window`, `replay_ttl_seconds`)
  - optional durable replay persistence (`replay_store_path`) across process restarts
  - session/auth scoped replay visibility to avoid cross-session event leakage
- MCP-specific behavior is documented in:
  - [MCP Interop Adapter](MCP_INTEROP.md)

Related:
- [Storage and Sessions](STORAGE.md)
