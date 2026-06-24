# OpenAI Provider

OpenAI provides GPT-4o, GPT-4, and GPT-3.5-turbo with native tool/function calling support.

## Install

```bash
pip install "mtpx[openai]"
```

Or install the SDK directly:

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
   OPENAI_API_KEY=sk_your_key_here
   ```

3. Load it in your code **before** creating the provider:
   ```python
   from mtp import Agent

   Agent.load_dotenv_if_available()  # reads .env file
   ```

Get an API key at [platform.openai.com](https://platform.openai.com).

### Option 2: System environment variable

```bash
# Linux/macOS
export OPENAI_API_KEY="sk-..."

# Windows PowerShell
$env:OPENAI_API_KEY="sk-..."
```

## Quick Start

```python
from mtp import Agent
from mtp.providers import OpenAI

Agent.load_dotenv_if_available()  # loads OPENAI_API_KEY from .env

provider = OpenAI(model="gpt-4o")
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

reply = agent.run_loop("What is 25 * 4 + 10?")
print(reply)
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `str` | `"gpt-4o"` | OpenAI model ID |
| `api_key` | `str \| None` | `None` | API key (falls back to `OPENAI_API_KEY` env var) |
| `temperature` | `float` | `0.0` | Sampling temperature |
| `tool_choice` | `str \| dict` | `"auto"` | Tool selection: `"auto"`, `"none"`, `"required"`, or `{"type": "function", "function": {"name": "..."}}` |
| `parallel_tool_calls` | `bool` | `True` | Allow parallel tool calls |
| `client` | `Any \| None` | `None` | Pre-configured `openai.OpenAI` client instance |

## Capabilities

| Capability | Value |
|---|---|
| Tool calling | Yes |
| Parallel tool calls | Yes (configurable) |
| Input modalities | text, image, audio, file |
| Streaming | Fallback |
| Usage metrics | Rich |
| Reasoning metadata | No |
| Native async | No (uses thread fallback) |

## Recommended Models

- `gpt-4o` — Best overall tool calling and multimodal (default)
- `gpt-4o-mini` — Fast, cheaper, good tool support
- `gpt-4-turbo` — Strong reasoning
- `gpt-3.5-turbo` — Fastest, cheapest

## Full Example

```python
from mtp import Agent
from mtp.providers import OpenAI

Agent.load_dotenv_if_available()

provider = OpenAI(
    model="gpt-4o",
    temperature=0.0,
    tool_choice="auto",
    parallel_tool_calls=True,
)

tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools, debug_mode=True)

reply = agent.run_loop(
    "Calculate (25 * 4) + 10 and list files in the current directory.",
    max_rounds=4,
    tool_call_limit=12,
)
print(reply)
```

## Rate Limit Tracking

The OpenAI provider automatically extracts rate limit headers (`x-ratelimit-*`, `retry-after`) from responses and includes them in action metadata.

## Source

`src/mtp/providers/openai_provider.py`
