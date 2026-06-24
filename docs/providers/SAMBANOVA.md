# SambaNova Provider

SambaNova Cloud provides ultra-fast inference for Llama models using their RDU hardware.

## Install

```bash
pip install "mtpx[sambanova]"
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
   SAMBANOVA_API_KEY=your_key_here
   ```

3. Load it in your code **before** creating the provider:
   ```python
   from mtp import Agent

   Agent.load_dotenv_if_available()  # reads .env file
   ```

Get an API key at [cloud.sambanova.ai](https://cloud.sambanova.ai).

### Option 2: System environment variable

```bash
# Linux/macOS
export SAMBANOVA_API_KEY="..."

# Windows PowerShell
$env:SAMBANOVA_API_KEY="..."
```

## Quick Start

```python
from mtp import Agent
from mtp.providers import SambaNova

Agent.load_dotenv_if_available()  # loads SAMBANOVA_API_KEY from .env

provider = SambaNova(model="Meta-Llama-3.1-70B-Instruct")
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

reply = agent.run_loop("What is 25 * 4 + 10?")
print(reply)
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `str` | `"Meta-Llama-3.1-70B-Instruct"` | SambaNova model ID |
| `api_key` | `str \| None` | `None` | API key (falls back to `SAMBANOVA_API_KEY` env var) |
| `temperature` | `float` | `0.0` | Sampling temperature |
| `tool_choice` | `str \| dict` | `"auto"` | Tool selection strategy |
| `client` | `Any \| None` | `None` | Pre-configured `openai.OpenAI` client instance |

## Capabilities

| Capability | Value |
|---|---|
| Tool calling | Yes (model-dependent) |
| Parallel tool calls | No |
| Input modalities | text, image, audio, file |
| Streaming | Fallback |
| Usage metrics | Rich |
| Reasoning metadata | No |
| Native async | No (uses thread fallback) |

## Recommended Models

- `Meta-Llama-3.1-70B-Instruct` — Best tool calling (default)
- `Meta-Llama-3.1-8B-Instruct` — Fastest
- `Meta-Llama-3.1-405B-Instruct` — Most capable

## Full Example

```python
from mtp import Agent
from mtp.providers import SambaNova

Agent.load_dotenv_if_available()

provider = SambaNova(
    model="Meta-Llama-3.1-70B-Instruct",
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

- SambaNova uses the OpenAI-compatible API at `https://api.sambanova.ai/v1`.
- Model names may change by account/endpoint. Confirm your available model ID before use.
- Tool calling support depends on the model. Llama 3.1 Instruct models support it.

## Source

`src/mtp/providers/sambanova_provider.py`
