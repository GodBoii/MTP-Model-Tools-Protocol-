# SDK recipes

These patterns use the same provider and tool registry as the [quickstart](QUICKSTART.md). Choose a provider whose capabilities match the requested operation.

## Async execution

```python
import asyncio

async def main():
    result = await agent.arun("What is 25 * 4?", max_rounds=4)
    print(result)

asyncio.run(main())
```

Inside an existing event loop, await `agent.arun` directly. Provider adapters can use native async methods or a worker fallback. Check `provider.capabilities().supports_native_async` before assuming the adapter uses a native async client.

## Structured output

```python
output = agent.run_output(
    "Return the sum of 25 and 17 as JSON with a result key.",
    max_rounds=4,
    output_schema={
        "type": "object",
        "properties": {"result": {"type": "integer"}},
        "required": ["result"],
        "additionalProperties": False,
    },
)
if output.output_validation_error:
    print(output.output_validation_error)
else:
    print(output.output)
```

The runtime parses and validates the final response. A schema does not make every provider emit valid JSON. Check `output_validation_error` before consuming the parsed value. Native provider JSON support and client validation are separate capabilities.

## Limit work

```python
output = agent.run_output(
    "Inspect the project and give a short summary.",
    max_rounds=4,
    tool_call_limit=10,
)
print(output.final_text)
print(output.cancelled, output.paused, output.total_tool_calls)
```

`max_rounds` limits normal model rounds. `tool_call_limit` limits tool calls. Autoresearch has a different completion rule, so add cancellation or an external timeout when enabling it.

## Cancel or steer a live run

```python
run_id = None
for event in agent.run_events("Inspect this project", max_rounds=5):
    if event["type"] == "run_started":
        run_id = event["run_id"]
    if event["type"] == "tool_started" and run_id:
        agent.cancel_run(run_id)
```

`cancel_run` requests cooperative cancellation. Async handlers can be cancelled directly. A synchronous handler that has already started needs to cooperate through supported cancellation parameters; cancellation cannot undo its side effects.

`agent.steer_run(run_id, text)` queues new input for the next provider round. It returns false when the run is no longer active. `take_unapplied_steering` returns messages that arrived too late to apply. In the terminal app, Enter queues another turn and Ctrl+G steers supported MTP backends.

## Resume a paused run

```python
if output.paused:
    resumed = agent.continue_run(run_output=output)
    print(resumed.final_text)
```

Continue only a paused run whose output you have retained. Read the [agent API](../AGENT_API.md) for `StopAgentRun`, `RetryAgentRun`, continuation arguments, and async variants.
