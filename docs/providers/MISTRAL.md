# Mistral Provider

Mistral AI provides fast, capable models with native tool calling support.

## Install

```bash
pip install "mtpx[mistral]"
```

Or install the SDK directly:

```bash
pip install mistralai
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
   MISTRAL_API_KEY=your_key_here
   ```

3. Load it in your code **before** creating the provider:
   ```python
   from mtp import Agent

   Agent.load_dotenv_if_available()  # reads .env file
   ```

Get an API key at [console.mistral.ai](https://console.mistral.ai).

### Option 2: System environment variable

```bash
# Linux/macOS
export MISTRAL_API_KEY="..."

# Windows PowerShell
$env:MISTRAL_API_KEY="..."
```

## Quick Start

```python
from mtp import Agent
from mtp.providers import Mistral

Agent.load_dotenv_if_available()  # loads MISTRAL_API_KEY from .env

provider = Mistral(model="mistral-large-latest")
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

reply = agent.run_loop("What is 25 * 4 + 10?")
print(reply)
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `str` | `"mistral-large-latest"` | Mistral model ID |
| `api_key` | `str \| None` | `None` | API key (falls back to `MISTRAL_API_KEY` env var) |
| `temperature` | `float` | `0.0` | Sampling temperature |
| `tool_choice` | `str` | `"auto"` | Tool selection: `"auto"`, `"none"`, `"any"`, or specific tool name |
| `parallel_tool_calls` | `bool` | `True` | Allow parallel tool calls |
| `client` | `Any \| None` | `None` | Pre-configured `Mistral` client instance |

## Capabilities

| Capability | Value |
|---|---|
| Tool calling | Yes |
| Parallel tool calls | No |
| Input modalities | text |
| Streaming | Fallback |
| Usage metrics | Basic |
| Reasoning metadata | No |
| Native async | No (uses thread fallback) |

## Recommended Models

- `mistral-large-latest` — Best tool calling (default)
- `mistral-small-latest` — Fast, cheaper
- `codestral-latest` — Code-focused

## Full Example

```python
from mtp import Agent
from mtp.providers import Mistral

Agent.load_dotenv_if_available()

provider = Mistral(
    model="mistral-large-latest",
    temperature=0.0,
    tool_choice="auto",
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

- Mistral uses the `mistralai` SDK with `client.chat.complete()` API.
- Text-only input (no image/audio/video/file support).
- Usage metrics extraction is basic (prompt/completion/total tokens).

## Source

`src/mtp/providers/mistral_provider.py`
