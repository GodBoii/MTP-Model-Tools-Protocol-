# Ollama Provider

Ollama runs open-source models locally. No cloud API key required. Supports tool calling, streaming, and thinking/reasoning traces.

## Install

```bash
pip install "mtpx[ollama]"
```

Or install the SDK directly:

```bash
pip install ollama
```

## Setup

1. Install Ollama from [ollama.com](https://ollama.com)
2. Pull a model:
   ```bash
   ollama pull qwen3:1.7b
   ```
3. Verify the server is running:
   ```bash
   ollama list
   ```

No API key is required for local usage. For secured remote hosts, set `OLLAMA_API_KEY` in your `.env` file.

## Quick Start

```python
from mtp import Agent
from mtp.providers import Ollama

# No API key needed for local Ollama
provider = Ollama(model="qwen3:1.7b")
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

reply = agent.run_loop("What is 25 * 4 + 10?")
print(reply)
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `str` | `"qwen3"` | Ollama model name (must be pulled first) |
| `host` | `str \| None` | `None` | Ollama server URL (default: `http://localhost:11434`) |
| `api_key` | `str \| None` | `None` | Optional API key for secured hosts (falls back to `OLLAMA_API_KEY` env var) |
| `options` | `dict \| None` | `None` | Ollama-specific options (e.g., `{"temperature": 0, "num_ctx": 4096}`) |
| `format` | `dict \| str \| None` | `None` | Output format constraint (e.g., `"json"` or a JSON schema dict) |
| `keep_alive` | `float \| str \| None` | `None` | How long to keep model in memory (e.g., `"5m"`, `300`) |
| `think` | `bool \| None` | `None` | Enable thinking/reasoning traces (for models that support it) |
| `client` | `Any \| None` | `None` | Pre-configured `ollama.Client` instance |

## Capabilities

| Capability | Value |
|---|---|
| Tool calling | Yes |
| Parallel tool calls | Yes |
| Input modalities | text, image |
| Streaming | Yes (both `stream_next_action` and `finalize_stream`) |
| Usage metrics | Rich |
| Reasoning metadata | Yes (when `think=True`) |
| Native async | No (uses thread fallback) |

## Recommended Models

- `qwen3:1.7b` — Lightweight, fast, good tool calling
- `qwen3:4b` — Better quality, still fast
- `qwen3:8b` — Strong tool calling
- `llama3.2:3b` — Good general purpose
- `mistral:7b` — Solid alternative
- `deepseek-r1:1.5b` — Reasoning model with thinking traces

## Thinking/Reasoning

Enable thinking traces for models that support it:

```python
provider = Ollama(
    model="qwen3:1.7b",
    think=True,
    options={"temperature": 0},
)
```

When `think=True`, the provider:
- Captures thinking tokens from the model
- Surfaces them in `action_meta["reasoning"]`
- Reports `supports_reasoning_metadata=True` in capabilities

## Streaming

Ollama supports both planning and finalization streaming:

```python
for event in agent.run_loop_events(
    "Calculate 25 * 4",
    max_rounds=2,
    stream_final=True,
):
    print(event)
```

## Full Example

```python
from mtp import Agent
from mtp.providers import Ollama

provider = Ollama(
    model="qwen3:1.7b",
    host="http://localhost:11434",
    think=True,
    options={"temperature": 0},
)

tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools, debug_mode=True)

reply = agent.run_loop(
    "Calculate (25 * 4) + 10",
    max_rounds=3,
)
print(reply)
```

## Troubleshooting

- **Model not found**: Run `ollama pull <model>` first.
- **Connection refused**: Ensure Ollama is running (`ollama serve`).
- **No tool calls**: Use a model that supports tool calling (Qwen 3, Llama 3.2+).
- **Slow first request**: Model loading into memory takes time on first call.

## Source

`src/mtp/providers/ollama_provider.py`
