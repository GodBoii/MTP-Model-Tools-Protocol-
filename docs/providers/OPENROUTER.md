# OpenRouter Provider

OpenRouter provides a unified API to access 200+ models from multiple providers. One API key, many models.

## Install

```bash
pip install "mtpx[openrouter]"
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
   OPENROUTER_API_KEY=sk-or-your_key_here
   ```

3. Load it in your code **before** creating the provider:
   ```python
   from mtp import Agent

   Agent.load_dotenv_if_available()  # reads .env file
   ```

Get an API key at [openrouter.ai](https://openrouter.ai).

### Option 2: System environment variable

```bash
# Linux/macOS
export OPENROUTER_API_KEY="sk-or-..."

# Windows PowerShell
$env:OPENROUTER_API_KEY="sk-or-..."
```

## Quick Start

```python
from mtp import Agent
from mtp.providers import OpenRouter

Agent.load_dotenv_if_available()  # loads OPENROUTER_API_KEY from .env

provider = OpenRouter(model="qwen/qwen3.6-plus-preview:free")
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

reply = agent.run_loop("What is 25 * 4 + 10?")
print(reply)
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `str` | `"qwen/qwen3.6-plus-preview:free"` | OpenRouter model ID (format: `provider/model`) |
| `api_key` | `str \| None` | `None` | API key (falls back to `OPENROUTER_API_KEY` env var) |
| `site_url` | `str \| None` | `None` | Your site URL (sent as `HTTP-Referer` header for rankings) |
| `site_name` | `str \| None` | `None` | Your app name (sent as `X-Title` header) |
| `temperature` | `float` | `0.0` | Sampling temperature |
| `tool_choice` | `str \| dict` | `"auto"` | Tool selection strategy |
| `client` | `Any \| None` | `None` | Pre-configured `openai.OpenAI` client instance |

## Capabilities

| Capability | Value |
|---|---|
| Tool calling | Yes (model-dependent) |
| Parallel tool calls | No |
| Input modalities | text, image, audio, video, file |
| Streaming | Fallback |
| Usage metrics | Rich |
| Reasoning metadata | No |
| Native async | No (uses thread fallback) |

## Recommended Models for Tool Calling

- `qwen/qwen3.6-plus-preview:free` — Free, good tool calling (default)
- `anthropic/claude-3.5-sonnet` — Best tool calling
- `google/gemini-2.0-flash` — Fast, cheap
- `meta-llama/llama-3.3-70b-instruct` — Good open-source option
- `deepseek/deepseek-chat` — Strong reasoning

## Full Example

```python
from mtp import Agent
from mtp.providers import OpenRouter

Agent.load_dotenv_if_available()

provider = OpenRouter(
    model="qwen/qwen3.6-plus-preview:free",
    site_url="https://myapp.com",
    site_name="My Agent App",
    temperature=0.0,
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

- OpenRouter uses the OpenAI-compatible API at `https://openrouter.ai/api/v1`.
- Model IDs use the format `provider/model-name` (e.g., `anthropic/claude-3.5-sonnet`).
- Tool calling support and quality depends on the underlying model.
- Free models are available with `:free` suffix.
- The `site_url` and `site_name` parameters help with OpenRouter rankings and attribution.

## Source

`src/mtp/providers/openrouter_provider.py`
