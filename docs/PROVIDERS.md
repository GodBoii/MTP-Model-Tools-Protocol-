# Providers

MTP supports both:
- short ergonomic aliases (Agno-style), for example `Groq`
- explicit provider class names, for example `GroqToolCallingProvider`

Both styles are equivalent.

## Install provider extras

Use official extras instead of remembering each SDK package:

```bash
pip install "mtpx[groq]"
pip install "mtpx[openai]"
pip install "mtpx[lmstudio]"
pip install "mtpx[ollama]"
pip install "mtpx[anthropic]"
pip install "mtpx[gemini]"
pip install "mtpx[cohere]"
pip install "mtpx[mistral]"
```

OpenAI-compatible provider families:

```bash
pip install "mtpx[openrouter]"
pip install "mtpx[sambanova]"
pip install "mtpx[cerebras]"
pip install "mtpx[deepseek]"
pip install "mtpx[togetherai]"
pip install "mtpx[fireworksai]"
pip install "mtpx[xiaomi]"
```

Install most provider SDKs at once:

```bash
pip install "mtpx[providers]"
```

## Capability contract (enforceable)

Each provider adapter exposes:

```python
def capabilities(self) -> ProviderCapabilities
```

`ProviderCapabilities` includes:
- `supports_tool_calling`
- `supports_parallel_tool_calls`
- `input_modalities` (subset of `text`, `image`, `audio`, `video`, `file`)
- `supports_tool_media_output`
- `supports_finalize_streaming`
- `usage_metrics_quality` (`none`, `basic`, `rich`)
- `supports_reasoning_metadata`
- `structured_output_support` (`none`, `client_validated`, `native_json_object`, `native_json_schema`)
- `supports_native_async`
- `allow_finalize_stream_fallback`

Runtime guardrails in `Agent`/`MTPAgent` enforce this contract:
- Unsupported requested input modality => fail fast with clear error.
- Unsupported native finalize streaming => fail fast, unless fallback is explicitly allowed.

This prevents providers from silently over-promising features in production.

## Built-in usage (alias style)

```python
from mtp.providers import Groq

provider = Groq(model="llama-3.3-70b-versatile")
```

## Built-in usage (explicit style)

```python
from mtp.providers import GroqToolCallingProvider

provider = GroqToolCallingProvider(model="llama-3.3-70b-versatile")
```

## Add a new provider

## 1) Create provider file

Example: `src/mtp/providers/anthropic_provider.py`

```python
from mtp.agent import AgentAction, ProviderAdapter

class AnthropicToolCallingProvider(ProviderAdapter):
    def next_action(self, messages, tools) -> AgentAction:
        ...

    def finalize(self, messages, tool_results) -> str:
        ...

    async def anext_action(self, messages, tools) -> AgentAction:
        ...

    async def afinalize(self, messages, tool_results) -> str:
        ...
```

## 2) Export provider class

In `src/mtp/providers/__init__.py`:

```python
from .anthropic_provider import AnthropicToolCallingProvider
```

## 3) Use provider directly

```python
from mtp import Agent
from mtp.providers import AnthropicToolCallingProvider

provider = AnthropicToolCallingProvider(model="claude-...")
registry = Agent.ToolRegistry()
agent = Agent.MTPAgent(provider=provider, tools=registry)
```

## Notes

- Alias names available (when matching optional SDKs are installed):
  - `Groq`, `OpenRouter`, `OpenAI`, `LMStudio`, `Ollama`, `Gemini`, `Anthropic`, `SambaNova`
  - `Cerebras`, `DeepSeek`, `Mistral`, `Cohere`, `TogetherAI`, `FireworksAI`, `Xiaomi`
- Local deterministic planner provider is also available as `MockPlannerProvider` (class alias for `SimplePlannerProvider`).
- Provider exports are dependency-optional: missing SDKs no longer block importing other providers.
- Provider symbols are lazily loaded to avoid import-time circular dependencies.
- Explicit class names remain fully supported and unchanged.
- No provider is defaulted by core `Agent` / `MTPAgent`.
- Different providers can expose different constructor parameters safely.
- Async provider hooks are optional. If omitted, async agent APIs fall back to running sync provider methods in threads.

Related:
- [Storage and Sessions](STORAGE.md)
- [Local Inference](LOCAL_INFERENCE.md)
- [Xiaomi MiMo Integration](XIAOMI_MIMO_INTEGRATION.md)

## Local providers quick reference

## LM Studio

`LMStudio` targets the OpenAI-compatible LM Studio local server.

```python
from mtp.providers import LMStudio

provider = LMStudio(
    model="qwen3-4b-thinking-2507",
    base_url="http://127.0.0.1:1234/v1",
    temperature=0.0,
)
```

Notes:
- No cloud API key is required for local LM Studio usage.
- The LM Studio API server must be started and a model must be loaded.

## Ollama

`Ollama` targets a local Ollama host using the native Ollama client SDK.

```python
from mtp.providers import Ollama

provider = Ollama(
    model="qwen3:1.7b",
    host="http://localhost:11434",
    think=True,
    options={"temperature": 0},
)
```

Notes:
- For local Ollama usage, no cloud API key is required.
- Ensure the model is pulled first (`ollama pull ...`) and the service is running.

Detailed setup and troubleshooting:
- [Local Inference](LOCAL_INFERENCE.md)
