# Together AI Provider

Together AI hosts 200+ open-source models with an OpenAI-compatible API. Great for running large open models without vendor lock-in.

## Install

```bash
pip install "mtpx[togetherai]"
```

This installs the `openai` SDK. Alternatively, install the native Together SDK:

```bash
pip install together
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
   TOGETHER_API_KEY=your_key_here
   ```

3. Load it in your code **before** creating the provider:
   ```python
   from mtp import Agent

   Agent.load_dotenv_if_available()  # reads .env file
   ```

Get a free API key at [api.together.ai](https://api.together.ai) ($1 credit on signup).

### Option 2: System environment variable

```bash
# Linux/macOS
export TOGETHER_API_KEY="..."

# Windows PowerShell
$env:TOGETHER_API_KEY="..."
```

## Quick Start

```python
from mtp import Agent
from mtp.providers import TogetherAI

Agent.load_dotenv_if_available()  # loads TOGETHER_API_KEY from .env

provider = TogetherAI(model="meta-llama/Llama-4-Scout-17B-16E-Instruct")
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

reply = agent.run_loop("What is 25 * 4 + 10?")
print(reply)
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `str` | `"meta-llama/Llama-4-Scout-17B-16E-Instruct"` | Together AI model ID (format: `org/model`) |
| `api_key` | `str \| None` | `None` | API key (falls back to `TOGETHER_API_KEY` env var) |
| `temperature` | `float` | `0.0` | Sampling temperature |
| `tool_choice` | `str \| dict` | `"auto"` | Tool selection strategy |
| `parallel_tool_calls` | `bool` | `True` | Allow parallel tool calls |
| `max_tokens` | `int` | `4096` | Maximum response tokens |
| `client` | `Any \| None` | `None` | Pre-configured client instance |

## Capabilities

| Capability | Value |
|---|---|
| Tool calling | Yes (model-dependent) |
| Parallel tool calls | Yes (configurable) |
| Input modalities | text, image |
| Streaming | Fallback |
| Usage metrics | Rich |
| Reasoning metadata | No |
| Native async | No (uses thread fallback) |

## Recommended Models for Tool Calling

- `meta-llama/Llama-4-Scout-17B-16E-Instruct` — Best tool use (default)
- `meta-llama/Llama-3.3-70B-Instruct-Turbo` — Fast, reliable
- `Qwen/Qwen2.5-72B-Instruct-Turbo` — Excellent reasoning
- `deepseek-ai/DeepSeek-V3` — Top-tier reasoning
- `mistralai/Mixtral-8x22B-Instruct-v0.1` — Strong + fast

## Full Example

```python
from mtp import Agent
from mtp.providers import TogetherAI

Agent.load_dotenv_if_available()

provider = TogetherAI(
    model="meta-llama/Llama-4-Scout-17B-16E-Instruct",
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

- Together AI prefers the native `together` SDK when available, falls back to OpenAI client at `https://api.together.xyz/v1`.
- Model IDs use the format `org/model-name` (e.g., `meta-llama/Llama-4-Scout-17B-16E-Instruct`).
- Widest model selection of any provider — great for comparing model performance on the same task.
- Competitive pricing (~$0.18/1M tokens for 70B models).

## Source

`src/mtp/providers/together_provider.py`
