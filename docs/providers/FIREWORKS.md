# Fireworks AI Provider

Fireworks AI specializes in FAST open-model inference using their FireAttention kernel — often 3-5x faster than competitors.

## Install

```bash
pip install "mtpx[fireworksai]"
```

This installs the `openai` SDK. Alternatively, install the native Fireworks SDK:

```bash
pip install fireworks-ai
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
   FIREWORKS_API_KEY=fw_your_key_here
   ```

3. Load it in your code **before** creating the provider:
   ```python
   from mtp import Agent

   Agent.load_dotenv_if_available()  # reads .env file
   ```

Get a free API key at [fireworks.ai](https://fireworks.ai) (free credits on signup).

### Option 2: System environment variable

```bash
# Linux/macOS
export FIREWORKS_API_KEY="fw_..."

# Windows PowerShell
$env:FIREWORKS_API_KEY="fw_..."
```

## Quick Start

```python
from mtp import Agent
from mtp.providers import FireworksAI

Agent.load_dotenv_if_available()  # loads FIREWORKS_API_KEY from .env

provider = FireworksAI(model="accounts/fireworks/models/llama-v3p3-70b-instruct")
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

reply = agent.run_loop("What is 25 * 4 + 10?")
print(reply)
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `str` | `"accounts/fireworks/models/llama-v3p3-70b-instruct"` | Fireworks model ID (account-qualified) |
| `api_key` | `str \| None` | `None` | API key (falls back to `FIREWORKS_API_KEY` env var) |
| `temperature` | `float` | `0.0` | Sampling temperature |
| `tool_choice` | `str \| dict` | `"auto"` | Tool selection strategy |
| `parallel_tool_calls` | `bool` | `True` | Allow parallel tool calls |
| `max_tokens` | `int` | `4096` | Maximum response tokens |
| `response_format` | `dict \| None` | `None` | Structured output format (JSON schema) |
| `client` | `Any \| None` | `None` | Pre-configured client instance |

## Capabilities

| Capability | Value |
|---|---|
| Tool calling | Yes |
| Parallel tool calls | Yes (configurable) |
| Input modalities | text, image |
| Streaming | Fallback |
| Usage metrics | Rich |
| Reasoning metadata | No |
| Structured output | Native JSON schema (when `response_format` set) |
| Native async | No (uses thread fallback) |

## Recommended Models

- `accounts/fireworks/models/llama-v3p3-70b-instruct` — Best overall (default)
- `accounts/fireworks/models/llama-v3p1-405b-instruct` — Most capable
- `accounts/fireworks/models/qwen2p5-72b-instruct` — Top reasoning
- `accounts/fireworks/models/deepseek-v3` — Best reasoning
- `accounts/fireworks/models/mixtral-8x22b-instruct` — Fast + smart
- `accounts/fireworks/models/firefunction-v2` — Purpose-built for tool calling

## Structured Output

Fireworks supports native JSON schema output:

```python
provider = FireworksAI(
    model="accounts/fireworks/models/llama-v3p3-70b-instruct",
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "result",
            "schema": {
                "type": "object",
                "properties": {
                    "answer": {"type": "number"},
                    "explanation": {"type": "string"},
                },
                "required": ["answer", "explanation"],
            },
        },
    },
)
```

## Full Example

```python
from mtp import Agent
from mtp.providers import FireworksAI

Agent.load_dotenv_if_available()

provider = FireworksAI(
    model="accounts/fireworks/models/llama-v3p3-70b-instruct",
    temperature=0.0,
    max_tokens=4096,
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

- Fireworks prefers the native `fireworks-ai` SDK, falls back to OpenAI client at `https://api.fireworks.ai/inference/v1`.
- Model IDs must be account-qualified (e.g., `accounts/fireworks/models/...`).
- `firefunction-v2` is purpose-built for function/tool calling and may give better results for agent workflows.
- When `response_format` is set, `structured_output_support` reports `native_json_schema` capability.

## Source

`src/mtp/providers/fireworks_provider.py`
