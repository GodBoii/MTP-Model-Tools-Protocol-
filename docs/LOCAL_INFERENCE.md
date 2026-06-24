# Local Inference (LM Studio + Ollama)

This guide covers running MTP agents against locally hosted LLMs without a cloud API key.

## Overview

MTP currently supports two local inference providers:

- `LMStudio` (`LMStudioToolCallingProvider`)
- `Ollama` (`OllamaToolCallingProvider`)

Both providers implement the same `ProviderAdapter` contract used by cloud providers, so existing `Agent` and toolkit flows stay unchanged.

## Install

Install only what you need:

```bash
pip install "mtpx[lmstudio]"
pip install "mtpx[ollama]"
```

Install both together:

```bash
pip install "mtpx[lmstudio,ollama]"
```

If you are developing from source:

```bash
pip install -e ".[lmstudio,ollama]"
```

## LM Studio

### Prerequisites

1. Install LM Studio desktop app.
2. Download a model.
3. Load the model in LM Studio.
4. Enable/start the local server API.
5. Confirm the server host/port (default: `http://127.0.0.1:1234`).

Important: downloaded models are not automatically served. The model must be loaded and the API server must be running.

### Basic usage

```python
from mtp import Agent
from mtp.providers import LMStudio
from mtp.toolkits import CalculatorToolkit, FileToolkit

tools = Agent.ToolRegistry()
tools.register_toolkit_loader("calculator", CalculatorToolkit())
tools.register_toolkit_loader("file", FileToolkit(base_dir="."))

provider = LMStudio(
    model="qwen3-4b-thinking-2507",       # use your actual loaded model id
    base_url="http://127.0.0.1:1234/v1",  # default LM Studio OpenAI-compatible endpoint
    temperature=0.0,
    parallel_tool_calls=True,
)

agent = Agent(
    provider=provider,
    tools=tools,
    strict_dependency_mode=True,
)

print(agent.run_loop("Calculate (25 * 4) + 10 and list files.", max_rounds=4))
```

### Example file

- [examples/lmstudio_agent.py](../examples/lmstudio_agent.py)

## Ollama

### Prerequisites

1. Install Ollama.
2. Start the Ollama service.
3. Pull a model, for example `ollama pull qwen3:1.7b`.
4. Confirm the server is reachable (default host: `http://localhost:11434`).

### Basic usage

```python
from mtp import Agent
from mtp.providers import Ollama
from mtp.toolkits import CalculatorToolkit, FileToolkit

tools = Agent.ToolRegistry()
tools.register_toolkit_loader("calculator", CalculatorToolkit())
tools.register_toolkit_loader("file", FileToolkit(base_dir="."))

provider = Ollama(
    model="qwen3:1.7b",              # use a model already pulled in Ollama
    host="http://localhost:11434",
    think=True,                      # include reasoning channel when model supports it
    options={"temperature": 0},
)

agent = Agent(
    provider=provider,
    tools=tools,
    strict_dependency_mode=True,
)

print(agent.run_loop("Calculate (25 * 4) + 10 and list files.", max_rounds=4))
```

### Example file

- [examples/ollama_agent.py](../examples/ollama_agent.py)

## Troubleshooting

## 1) Connection refused (`WinError 10061`, `APIConnectionError`, `ConnectError`)

Symptom:

- MTP fails before any model response.
- Stack trace contains connection errors.

Meaning:

- The local server is not reachable at the configured host/port.

Fix:

1. Start LM Studio/Ollama local server.
2. Verify host and port in provider config.
3. Retry.

Quick checks:

```bash
# LM Studio (OpenAI-compatible)
curl http://127.0.0.1:1234/v1/models

# Ollama
curl http://localhost:11434/api/tags
```

On PowerShell:

```powershell
Invoke-WebRequest http://127.0.0.1:1234/v1/models
Invoke-WebRequest http://localhost:11434/api/tags
```

## 2) Model not found / invalid model id

Symptom:

- HTTP error from provider (`400`/`404`) mentioning model id.

Fix:

1. List models from local server.
2. Use exact model id in `provider.model`.

LM Studio model discovery via OpenAI-compatible API:

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:1234/v1", api_key="lm-studio")
print(client.models.list())
```

Ollama model discovery:

```bash
ollama list
```

## 3) Tool calls repeatedly blocked in strict mode

Symptom:

- Logs show strict dependency violations on multi-call same-toolkit plans.

Meaning:

- Model is planning parallel same-toolkit calls without explicit `$ref` or `depends_on`.

Fix options:

1. Keep `strict_dependency_mode=True` and use a model prompt/instructions that enforces explicit dependencies.
2. Temporarily disable strict mode for local testing.

## Provider notes

- `LMStudio` uses OpenAI-compatible chat completions (`/v1/chat/completions`).
- `Ollama` uses native Ollama chat API via the `ollama` Python package.
- Both providers support sync and async agent entrypoints (`run_loop`, `arun_loop`, etc.).

## Related docs

- [TUI CLI Local Inference Guide](TUI_LOCAL_INFERENCE.md) - Using local providers in the interactive TUI
- [Providers](PROVIDERS.md)
- [Quickstart](QUICKSTART.md)
- [Agent API Reference](AGENT_API.md)
