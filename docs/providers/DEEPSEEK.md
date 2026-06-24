# DeepSeek Provider

DeepSeek offers powerful reasoning models with OpenAI-compatible API. The R1 reasoner exposes chain-of-thought reasoning traces.

## Install

```bash
pip install "mtpx[deepseek]"
```

This installs the `openai` SDK (used for the OpenAI-compatible API):

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
   DEEPSEEK_API_KEY=sk-your_key_here
   ```

3. Load it in your code **before** creating the provider:
   ```python
   from mtp import Agent

   Agent.load_dotenv_if_available()  # reads .env file
   ```

Get an API key at [platform.deepseek.com](https://platform.deepseek.com). Free tier credits available on signup.

### Option 2: System environment variable

```bash
# Linux/macOS
export DEEPSEEK_API_KEY="sk-..."

# Windows PowerShell
$env:DEEPSEEK_API_KEY="sk-..."
```

## Quick Start

```python
from mtp import Agent
from mtp.providers import DeepSeek

Agent.load_dotenv_if_available()  # loads DEEPSEEK_API_KEY from .env

provider = DeepSeek(model="deepseek-chat")
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

reply = agent.run_loop("What is 25 * 4 + 10?")
print(reply)
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `str` | `"deepseek-chat"` | DeepSeek model ID |
| `api_key` | `str \| None` | `None` | API key (falls back to `DEEPSEEK_API_KEY` env var) |
| `temperature` | `float` | `0.0` | Sampling temperature |
| `tool_choice` | `str \| dict` | `"auto"` | Tool selection strategy |
| `parallel_tool_calls` | `bool` | `True` | Allow parallel tool calls |
| `capture_reasoning` | `bool` | `True` | Capture R1 chain-of-thought reasoning trace |
| `client` | `Any \| None` | `None` | Pre-configured `openai.OpenAI` client instance |

## Capabilities

| Capability | Value |
|---|---|
| Tool calling | Yes (V3 only, not R1) |
| Parallel tool calls | Yes (V3 only) |
| Input modalities | text |
| Streaming | Fallback |
| Usage metrics | Rich |
| Reasoning metadata | Yes (R1 models) |
| Native async | No (uses thread fallback) |

## Models

- `deepseek-chat` — DeepSeek-V3, best general-purpose + tool calling (default)
- `deepseek-reasoner` — DeepSeek-R1, chain-of-thought reasoning model

**Important**: `deepseek-reasoner` (R1) does NOT support tool calling. Use `deepseek-chat` (V3) for agent workflows with tools.

## Reasoning Traces

When using `deepseek-reasoner`, the chain-of-thought reasoning is captured automatically:

```python
provider = DeepSeek(
    model="deepseek-reasoner",
    capture_reasoning=True,
)
```

The reasoning trace is available in `action_meta["reasoning"]` and included in serialized tool calls.

## Full Example

```python
from mtp import Agent
from mtp.providers import DeepSeek

Agent.load_dotenv_if_available()

# V3 for tool calling
provider = DeepSeek(
    model="deepseek-chat",
    temperature=0.0,
    parallel_tool_calls=True,
    capture_reasoning=True,
)

tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools, debug_mode=True)

reply = agent.run_loop(
    "Calculate (25 * 4) + 10",
    max_rounds=3,
)
print(reply)
```

## Pricing

DeepSeek is extremely cheap (~$0.07 / 1M input tokens for V3 as of mid-2025). Free tier credits available on signup.

## Source

`src/mtp/providers/deepseek_provider.py`
