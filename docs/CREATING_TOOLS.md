# Creating Custom Tools and Toolkits

MTP supports custom tools via plain Python functions and toolkit loaders.

This guide mirrors common patterns used in agent frameworks:
- Python functions as tools
- Grouping tools into a toolkit
- Registering toolkit into a `ToolRegistry`

## 1) Python functions as tools

Use `@mtp_tool` to attach metadata and keep definitions explicit:

```python
from mtp import Agent

@Agent.mtp_tool(
    description="Add two integers.",
    risk_level=Agent.ToolRiskLevel.READ_ONLY,
    cache_ttl_seconds=60,
)
def add(a: int, b: int) -> int:
    return a + b
```

If you omit `input_schema`, MTP infers a schema from function signatures/type hints.

## 2) Build a toolkit from functions

```python
from mtp import Agent

toolkit = Agent.toolkit_from_functions("custom", add)
```

This produces tool names like:
- `custom.add`

## 3) Register toolkit in registry

```python
from mtp import Agent

registry = Agent.ToolRegistry()
registry.register_toolkit_loader("custom", toolkit)
```

## 4) Use with agent

```python
from mtp import Agent
from mtp.providers import Groq

provider = Groq(model="llama-3.3-70b-versatile")
agent = Agent.MTPAgent(provider=provider, tools=registry)
print(agent.run("Use custom.add with a=20 and b=22"))
```

## Manual ToolSpec generation (advanced)

If you need explicit control:

```python
from mtp import Agent

spec = Agent.tool_spec_from_callable(add, namespace="custom")
```

## Notes for robust tools

- Write precise docstrings/descriptions. The model reads them.
- Keep parameter names explicit and stable.
- Mark risk level correctly (`read_only`, `write`, `destructive`).
- For side effects, prefer explicit user confirmation policy.

Related:
- [Storage and Sessions](STORAGE.md)
