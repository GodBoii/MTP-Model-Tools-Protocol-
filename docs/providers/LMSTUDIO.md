# LM Studio Provider

LM Studio runs models locally with an OpenAI-compatible server. No cloud API key required.

## Install

```bash
pip install "mtpx[lmstudio]"
```

This installs the `openai` SDK (used for the OpenAI-compatible API).

```bash
pip install openai
```

## Setup

1. Download LM Studio from [lmstudio.ai](https://lmstudio.ai)
2. Download a tool-capable model (e.g., Qwen 3, Llama 3.2)
3. Start the local server (default: `http://127.0.0.1:1234/v1`)
4. Load a model in the LM Studio UI

No API key is required for local usage. A dummy `"lm-studio"` key is used by default. If your LM Studio instance requires auth, set `LMSTUDIO_API_KEY` in your `.env` file.

## Quick Start

```python
from mtp import Agent
from mtp.providers import LMStudio

# No API key needed for local LM Studio
provider = LMStudio(model="qwen3-4b-thinking-2507")
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

reply = agent.run_loop("What is 25 * 4 + 10?")
print(reply)
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `str` | `"qwen3"` | Model name as loaded in LM Studio |
| `base_url` | `str` | `"http://127.0.0.1:1234/v1"` | LM Studio server URL |
| `api_key` | `str \| None` | `None` | API key (falls back to `LMSTUDIO_API_KEY` env var, then `"lm-studio"`) |
| `temperature` | `float` | `0.0` | Sampling temperature |
| `tool_choice` | `str \| dict` | `"auto"` | Tool selection strategy |
| `parallel_tool_calls` | `bool` | `True` | Allow parallel tool calls |
| `client` | `Any \| None` | `None` | Pre-configured `openai.OpenAI` client instance |

## Capabilities

| Capability | Value |
|---|---|
| Tool calling | Yes (if model supports it) |
| Parallel tool calls | Yes (configurable) |
| Input modalities | text, image |
| Streaming | Yes (both `stream_next_action` and `finalize_stream`) |
| Usage metrics | Rich |
| Reasoning metadata | No |
| Native async | No (uses thread fallback) |

## Streaming

LM Studio supports both planning and finalization streaming with reasoning chunk support:

```python
for event in agent.run_loop_events(
    "Calculate 25 * 4",
    max_rounds=2,
    stream_final=True,
):
    if isinstance(event, dict):
        if event.get("type") == "reasoning_chunk":
            print("[thinking]", event["chunk"])
        elif event.get("type") == "text_chunk":
            print(event["chunk"], end="", flush=True)
```

## Full Example

```python
from mtp import Agent
from mtp.providers import LMStudio

provider = LMStudio(
    model="qwen3-4b-thinking-2507",
    base_url="http://127.0.0.1:1234/v1",
    temperature=0.0,
    tool_choice="auto",
    parallel_tool_calls=True,
)

tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools, debug_mode=True)

reply = agent.run_loop(
    "Calculate (25 * 4) + 10",
    max_rounds=3,
)
print(reply)
```

## Notes

- LM Studio uses the OpenAI SDK under the hood, pointed at the local server.
- Tool calling support depends on the loaded model. Use Qwen 3, Llama 3.2, or other tool-capable models.
- The `parallel_tool_calls` parameter may be ignored by some model/SDK versions (handled gracefully with fallback).

## Source

`src/mtp/providers/lmstudio_provider.py`
