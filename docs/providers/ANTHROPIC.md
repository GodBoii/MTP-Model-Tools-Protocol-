# Anthropic Provider

Anthropic Claude models with native tool-use API support. Uses Anthropic's block-based message format internally.

## Install

```bash
pip install "mtpx[anthropic]"
```

Or install the SDK directly:

```bash
pip install anthropic
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
   ANTHROPIC_API_KEY=sk-ant-your_key_here
   ```

3. Load it in your code **before** creating the provider:
   ```python
   from mtp import Agent

   Agent.load_dotenv_if_available()  # reads .env file
   ```

Get an API key at [console.anthropic.com](https://console.anthropic.com).

### Option 2: System environment variable

```bash
# Linux/macOS
export ANTHROPIC_API_KEY="sk-ant-..."

# Windows PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-..."
```

## Quick Start

```python
from mtp import Agent
from mtp.providers import Anthropic

Agent.load_dotenv_if_available()  # loads ANTHROPIC_API_KEY from .env

provider = Anthropic(model="claude-3-5-sonnet-20241022")
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

reply = agent.run_loop("What is 25 * 4 + 10?")
print(reply)
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `str` | `"claude-3-5-sonnet-20241022"` | Anthropic model ID |
| `api_key` | `str \| None` | `None` | API key (falls back to `ANTHROPIC_API_KEY` env var) |
| `max_tokens` | `int` | `1024` | Maximum tokens in the response |
| `temperature` | `float` | `0.0` | Sampling temperature |
| `client` | `Any \| None` | `None` | Pre-configured `anthropic.Anthropic` client instance |

## Capabilities

| Capability | Value |
|---|---|
| Tool calling | Yes |
| Parallel tool calls | Yes |
| Input modalities | text, image, file |
| Streaming | Fallback |
| Usage metrics | Rich |
| Reasoning metadata | No |
| Native async | No (uses thread fallback) |

## Recommended Models

- `claude-3-5-sonnet-20241022` — Best balance of speed and capability (default)
- `claude-3-5-haiku-20241022` — Fastest, cheapest
- `claude-3-opus-20240229` — Most capable, slowest

## Multimodal Support

Anthropic supports images and files (PDFs, documents) natively:

```python
from mtp.media import Image, File

provider = Anthropic(model="claude-3-5-sonnet-20241022")
agent = Agent(provider=provider, tools=tools)

# With image
reply = agent.run_loop({
    "content": "Describe this image",
    "images": [Image(filepath="photo.jpg")],
})

# With PDF document
reply = agent.run_loop({
    "content": "Summarize this document",
    "files": [File(filepath="report.pdf")],
})
```

## Full Example

```python
from mtp import Agent
from mtp.providers import Anthropic

Agent.load_dotenv_if_available()

provider = Anthropic(
    model="claude-3-5-sonnet-20241022",
    max_tokens=4096,
    temperature=0.0,
)

tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools, debug_mode=True)

reply = agent.run_loop(
    "Calculate (25 * 4) + 10 and explain the steps.",
    max_rounds=4,
)
print(reply)
```

## Notes

- Anthropic uses a different internal message format (block-based with `tool_use` and `tool_result` content types), but MTP normalizes everything to the same event stream and `ExecutionPlan` semantics.
- System prompts are sent as the `system` parameter, not as a message role.

## Source

`src/mtp/providers/anthropic_provider.py`
