# Project Direction

This document is the canonical direction for this repository.
If other docs conflict with this file, this file should be treated as the source of truth.

## TL;DR

This repo contains two related but different things:

1. **MTP Protocol**
- A protocol model for tool orchestration (tool schemas, calls, plans, dependencies, policy, execution semantics).
- This is the core "Model Tools Protocol" idea.

2. **MTP Agent SDK**
- A Python framework that uses MTP protocol primitives to build production agents.
- Includes providers, toolkits, storage, transport, events, and higher-level agent APIs.

MCP is important, but it is **not** the product identity.
MCP interoperability is a capability of this SDK, not the definition of MTP.

## Product identity

`MTP` is the primary product and protocol identity.

`MTP Agent SDK` is the implementation layer around the protocol.

`MCP` is an interoperability target and integration surface.

Think of the architecture like this:
- **MTP protocol**: what gets modeled and executed.
- **MTP SDK**: how developers build apps with that model.
- **MCP adapter/transports**: how MTP can communicate with MCP ecosystems.

## What we are building

We are building a protocol-first agent system that is:

- More than an MCP wrapper.
- More than a provider SDK.
- More than just an agent loop.

It combines:
- protocol semantics (`mtp.protocol`, `mtp.schema`)
- deterministic runtime (`mtp.runtime`)
- agent orchestration (`mtp.agent`, `mtp.simple_agent`)
- provider adapters (`mtp.providers`)
- tool ecosystem (`mtp.toolkits`, `mtp.tools`)
- persistence (`mtp.session_store`)
- transports (`mtp.transport`, `mtp.mcp_transport`)
- observability and events (`mtp.events`)

## Design principles

1. **Protocol-first, framework-enabled**
- Protocol contracts should stay explicit and stable.
- Framework features should build on protocol contracts, not bypass them.

2. **Interoperability without identity loss**
- MCP compatibility should be first-class.
- But MTP should not be reduced to "MCP adapter only."

3. **Clear layer boundaries**
- Runtime executes plans/tools.
- Agent orchestrates provider/runtime loops.
- Providers translate model APIs into agent actions.
- Toolkits define capability implementations.
- Transports move envelopes/messages only.

4. **Practical production focus**
- cancellation semantics
- policy controls
- session persistence
- streaming/events
- auth extensibility

## Scope boundaries (important for contributors)

## In scope

- Evolving MTP protocol entities and semantics.
- Improving SDK ergonomics and reliability.
- Strengthening provider parity and toolkit quality.
- MCP interoperability and transport quality.
- Observability and operational safety.

## Out of scope

- Rebranding MTP as "just MCP."
- Adding provider-specific shortcuts that bypass runtime semantics.
- Coupling protocol design to one provider or one transport.

## MCP relationship (exact stance)

MCP support is intentional and strategic:

- MTP supports MCP method surfaces for interoperability.
- MTP includes dedicated MCP transports.
- MTP includes MCP auth/cancellation/progress support.

But:

- MTP protocol remains a first-class protocol model.
- SDK features that are beyond MCP baseline (for example strict dependency enforcement, dynamic tool mutation, output refinement, orchestration mode) remain part of MTP's value.

## Near-term implementation direction

Priority areas for next contributors:

1. Provider capability parity matrix and consistent behavior guarantees.
2. Transport maturity (resumability, streaming robustness).
3. Session analytics/tracing APIs.
4. CLI/project scaffolding (`mtp new`).
5. External conformance matrix (including MCP clients).

## Naming and messaging guidelines

Use these terms consistently in docs and PRs:

- "MTP protocol" for protocol-layer concepts.
- "MTP Agent SDK" for framework/runtime/tooling layer.
- "MCP interoperability" for adapter/transport compatibility.

Avoid phrasing like:
- "MTP is MCP"
- "MTP is only an MCP adapter"

Preferred phrasing:
- "MTP is protocol-first and MCP-compatible."
- "MTP SDK includes MCP interoperability as one integration surface."

## Contributor checklist for new features

When implementing a feature, verify:

1. Which layer does this belong to: protocol, runtime, agent, provider, toolkit, transport, or MCP adapter?
2. Does it preserve existing layer boundaries?
3. Does it improve MTP directly, or only MCP integration?
4. Is documentation updated in:
- this file (`PROJECT_DIRECTION.md`) if direction changes,
- `ARCHITECTURE.md` for structure,
- `ROADMAP.md` for status,
- topic docs for usage examples.

## Final statement

We are building:

- **MTP** as a protocol and execution model,
- **MTP Agent SDK** as a practical developer framework,
- with **MCP compatibility** as a major interoperability feature.

That is the intended direction of this project.
