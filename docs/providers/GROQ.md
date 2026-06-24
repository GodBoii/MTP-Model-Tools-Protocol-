# Groq Provider

Groq provides ultra-fast cloud inference using their custom LPU hardware. Best for low-latency agent workflows with OpenAI-compatible tool schemas.

## Install

```bash
pip install "mtpx[groq]"
```

Or install the SDK directly:

```bash
pip install groq
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
   GROQ_API_KEY=gsk_your_key_here
   ```

3. Load it in your code **before** creating the provider:
   ```python
   from mtp import Agent

   Agent.load_dotenv_if_available()  # reads .env file
   ```

Get a free API key at [console.groq.com](https://console.groq.com).

### Option 2: System environment variable

```bash
# Linux/macOS
export GROQ_API_KEY="gsk_..."

# Windows PowerShell
$env:GROQ_API_KEY="gsk_..."
```

## Quick Start

```python
from mtp import Agent
from mtp.providers import Groq

Agent.load_dotenv_if_available()  # loads GROQ_API_KEY from .env

provider = Groq(model="llama-3.3-70b-versatile")
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

reply = agent.run_loop("What is 25 * 4 + 10?")
print(reply)
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `model` | `str` | `"llama-3.3-70b-versatile"` | Groq model ID |
| `api_key` | `str \| None` | `None` | API key (falls back to `GROQ_API_KEY` env var) |
| `system_prompt` | `str \| None` | `None` | System prompt prepended to all requests |
| `temperature` | `float` | `0.0` | Sampling temperature (0.0 = deterministic) |
| `tool_choice` | `str \| dict` | `"auto"` | Tool selection strategy: `"auto"`, `"none"`, `"required"`, or specific tool |
| `parallel_tool_calls` | `bool` | `True` | Allow model to call multiple tools in parallel |
| `encourage_batch_tool_calls` | `bool` | `True` | Inject system hint to batch independent tool calls |
| `strict_dependency_mode` | `bool` | `False` | Enable `$ref` based dependency tracking between tool calls |
| `include_reasoning` | `bool \| None` | `None` | Include reasoning in response (for supported models) |
| `reasoning_format` | `str \| None` | `None` | Format for reasoning output |
| `reasoning_effort` | `str \| None` | `None` | Reasoning effort level |
| `stream_include_usage` | `bool` | `True` | Include token usage in streaming responses |
| `client` | `Any \| None` | `None` | Pre-configured `groq.Groq` client instance |

## Capabilities

| Capability | Value |
|---|---|
| Tool calling | Yes |
| Parallel tool calls | Yes (configurable) |
| Input modalities | text, image |
| Streaming | Yes |
| Usage metrics | Rich |
| Reasoning metadata | Yes |
| Native async | No (uses thread fallback) |

## Recommended Models

- `llama-3.3-70b-versatile` — Best balance of speed and tool calling (default)
- `llama-3.1-8b-instant` — Fastest, good for simple tasks
- `mixtral-8x7b-32768` — Large context window
- `gemma2-9b-it` — Lightweight option

## Full Example with Streaming

```python
from mtp import Agent
from mtp.providers import Groq

Agent.load_dotenv_if_available()

provider = Groq(
    model="llama-3.3-70b-versatile",
    temperature=0.0,
    parallel_tool_calls=True,
    encourage_batch_tool_calls=True,
    strict_dependency_mode=True,
)

tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools, debug_mode=True)

# Streaming events
for event in agent.run_loop_events(
    "Calculate (25 * 4) + 10",
    max_rounds=3,
    stream_final=True,
):
    print(event)
```

## Source

`src/mtp/providers/groq_provider.py`
