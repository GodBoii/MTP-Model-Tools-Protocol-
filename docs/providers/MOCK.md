# Mock planner provider

`MockPlannerProvider` is an alias for a small deterministic planner. It needs no provider SDK or API key.

## Run a text-only fixture

```python
from mtp import Agent
from mtp.providers import MockPlannerProvider

agent = Agent.MTPAgent(
    provider=MockPlannerProvider(), tools=Agent.ToolRegistry()
)
print(agent.run("Hello"))
```

The reply is `Planner has no tool plan for this prompt yet.` This provider follows fixed rules; it does not answer general questions or calculate arbitrary expressions.

## Tool-plan fixture

A prompt containing `profile` requests `github.get_user` followed by `github.create_issue`, with a dependency and a result reference. Those names are demo contracts. Register both handlers before using that prompt. The built-in planner itself does not connect to GitHub.

For a complete offline example that registers and executes its own tool, use the [quickstart](../website/QUICKSTART.md) and [download offline_agent.py](/downloads/offline_agent.py).

## Capabilities

The planner supports deterministic sequential tool plans and text input. It declares no native finalize streaming, usage metrics, reasoning metadata, structured output, or native async client. The runtime can use its declared finalize fallback.

## Import the underlying class

```python
from mtp.providers.simple_planner import SimplePlannerProvider
```

The public package alias is `MockPlannerProvider`. The underlying class lives in `simple_planner.py`.
