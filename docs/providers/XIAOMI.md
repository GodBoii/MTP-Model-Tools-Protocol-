# Xiaomi MiMo Provider

Xiaomi MiMo provides an OpenAI-compatible API with built-in thinking/reasoning support. Features adaptive thinking mode management.

## Install

```bash
pip install "mtpx[xiaomi]"
```

This installs the `openai` SDK:

```bash
pip install openai
```

## API Key Setup

### Option 1: `.env` file (recommended)

1. Install dotenv support:
   ```bash
   pip install python-dotenv
   ```
   Or with the MTP extra:
   ```bash
   pip install "mtpx[dotenv]"
   ```

2. Create a `.env` file in your project root:
   ```
   MIMO_API_KEY=your_key_here
   ```

3. Load it in your code **before** creating the provider:
   ```python
   from mtp import Agent

   Agent.load_dotenv_if_available()  # reads .env file
   ```

### Option 2: System environment variable

```bash
# Linux/macOS
export MIMO_API_KEY="..."

# Windows PowerShell
$env:MIMO_API_KEY="..."
```

## Quick Start

```python
from mtp import Agent
from mtp.providers import Xiaomi

Agent.load_dotenv_if_available()  # loads MIMO_API_KEY from .env

provider = Xiaomi(model="mimo-v2.5-pro")
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

reply = agent.run_loop("What is 25 * 4 + 10?")
print(reply)
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `str` | `"mimo-v2.5-pro"` | MiMo model ID |
| `api_key` | `str \| None` | `None` | API key (falls back to `MIMO_API_KEY` env var) |
| `base_url` | `str \| None` | `None` | API endpoint URL; falls back to `MIMO_BASE_URL`, then the Xiaomi Token Plan endpoint |
| `temperature` | `float` | `0.0` | Sampling temperature |
| `tool_choice` | `str \| dict` | `"auto"` | Tool selection strategy |
| `parallel_tool_calls` | `bool` | `True` | Allow parallel tool calls |
| `thinking_mode` | `str` | `"adaptive"` | Thinking mode for planning: `"adaptive"`, `"enabled"`, `"disabled"` |
| `final_thinking_mode` | `str \| None` | `"enabled"` | Thinking mode for finalization: `"adaptive"`, `"enabled"`, `"disabled"`, or `None` |
| `timeout_seconds` | `float` | `60.0` | Request timeout passed to the OpenAI-compatible client |
| `client` | `Any \| None` | `None` | Pre-configured `openai.OpenAI` client instance |

## Capabilities

| Capability | Value |
|---|---|
| Tool calling | Yes |
| Parallel tool calls | Yes (configurable) |
| Input modalities | text, image, audio, file |
| Streaming | Yes (both `stream_next_action` and `finalize_stream`) |
| Usage metrics | Rich |
| Reasoning metadata | Yes |
| Native async | No (uses thread fallback) |

## Thinking Modes

Xiaomi MiMo has adaptive thinking that automatically manages when reasoning is active:

- **`"adaptive"`** (default): Thinking is enabled for initial planning, disabled after tool rounds. Finalization uses `final_thinking_mode`.
- **`"enabled"`**: Thinking is always on.
- **`"disabled"`**: Thinking is always off.

```python
# Adaptive thinking (recommended)
provider = Xiaomi(
    model="mimo-v2.5-pro",
    thinking_mode="adaptive",
    final_thinking_mode="enabled",
)

# Always thinking
provider = Xiaomi(
    model="mimo-v2.5-pro",
    thinking_mode="enabled",
)

# No thinking
provider = Xiaomi(
    model="mimo-v2.5-pro",
    thinking_mode="disabled",
)
```

## Streaming

Xiaomi supports both planning and finalization streaming with reasoning chunks:

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
from mtp.providers import Xiaomi

Agent.load_dotenv_if_available()

provider = Xiaomi(
    model="mimo-v2.5-pro",
    temperature=0.0,
    thinking_mode="adaptive",
    final_thinking_mode="enabled",
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

- Uses OpenAI-compatible API at `https://token-plan-ams.xiaomimimo.com/v1`.
- Thinking/reasoning content is captured from `reasoning_content` field on response messages.
- The adapter automatically disables thinking after tool rounds when in adaptive mode to save tokens.
- Supports `extra_body` parameter for passing thinking configuration to the API.

## Source

`src/mtp/providers/xiaomi_provider.py`
