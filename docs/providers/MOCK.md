# Mock / Simple Planner Provider

A tiny deterministic planner for local demos and testing. Not a real LLM — returns hardcoded plans and responses.

## Install

No additional packages required. Part of the MTP core.

## Quick Start

```python
from mtp import Agent
from mtp.providers import MockPlannerProvider

provider = MockPlannerProvider()
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

# Triggers a deterministic tool plan when "profile" is in the prompt
reply = agent.run_loop("Get my profile")
print(reply)

# Returns a direct text response for other prompts
reply = agent.run_loop("Hello")
print(reply)
```

## Behavior

The mock provider follows these rules:

- If the user message contains `"profile"`: executes `github.get_user` then `github.create_issue` (sequential batch with `$ref` dependency).
- Otherwise: returns `"Planner has no tool plan for this prompt yet."`

## Parameters

None. The provider takes no constructor arguments.

## Capabilities

| Capability | Value |
|---|---|
| Tool calling | Yes (deterministic) |
| Parallel tool calls | No |
| Input modalities | text |
| Streaming | No |
| Usage metrics | None |
| Reasoning metadata | No |
| Structured output | None |
| Native async | No |

## Use Cases

- Unit tests and integration tests
- Deterministic demos of the MTP execution pipeline
- Debugging tool execution flow without an LLM
- Example scripts that run without API keys

## Aliases

```python
from mtp.providers import MockPlannerProvider
from mtp.providers import SimplePlannerProvider

# Both are the same class
assert MockPlannerProvider is SimplePlannerProvider
```

## Full Example

```python
from mtp import Agent
from mtp.providers import MockPlannerProvider

provider = MockPlannerProvider()
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools, debug_mode=True)

# This triggers the deterministic plan
reply = agent.run_loop("Get my profile", max_rounds=2)
print(reply)

# This returns a text response
reply = agent.run_loop("Hello world")
print(reply)
```

## Source

`src/mtp/providers/simple_planner.py` (implementation)
`src/mtp/providers/mock.py` (alias)
