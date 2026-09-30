# Ollama provider

`Ollama` is the public alias for `OllamaToolCallingProvider`. This guide derives its constructor from MTPX 0.1.37.

## Install and configure

```bash
python -m pip install "mtpx[ollama]"
mtp doctor --provider ollama
```

Start the local inference server before making a request. Use `host` or `base_url` as listed below to select its endpoint. A local server normally needs no cloud API key.

Constructor model defaults below come from this release's code. They are offline defaults, not a guarantee of current provider availability or account access. Enter an available model ID, or use `/model` in the terminal UI to discover models.

## Create an agent

```python
from mtp import Agent
from mtp.providers import Ollama
from mtp.toolkits import CalculatorToolkit

tools = Agent.ToolRegistry()
tools.register_toolkit_loader("calculator", CalculatorToolkit())
provider = Ollama()
agent = Agent.MTPAgent(provider=provider, tools=tools)
print(agent.run("What is 25 * 4 + 10?", max_rounds=4))
```

This example makes a provider request. The [offline quickstart](../website/QUICKSTART.md) needs no credentials.

## Constructor reference

| Parameter | Annotation | Source default |
| --- | --- | --- |
| `model` | `str` | `'qwen3'` |
| `host` | `str \| None` | `None` |
| `api_key` | `str \| None` | `None` |
| `options` | `dict[str, Any] \| None` | `None` |
| `format` | `dict[str, Any] \| str \| None` | `None` |
| `keep_alive` | `float \| str \| None` | `None` |
| `think` | `bool \| None` | `None` |
| `client` | `Any \| None` | `None` |

## Inspect capabilities

```python
print(provider.capabilities())
```

Capabilities describe the adapter's tools, streaming, media, structured output, and async behavior. The selected model and account can impose further restrictions. See the [provider contract](../PROVIDERS.md).

The adapter declares the following contract in this source release:

```python
def capabilities(self) -> ProviderCapabilities:
        return ProviderCapabilities(
            provider="ollama",
            supports_tool_calling=True,
            supports_parallel_tool_calls=True,
            input_modalities=["text", "image"],
            supports_tool_media_output=True,
            supports_finalize_streaming=True,
            usage_metrics_quality=USAGE_METRICS_RICH,
            supports_reasoning_metadata=bool(self.think),
            structured_output_support=STRUCTURED_OUTPUT_CLIENT_VALIDATED,
            supports_native_async=False,
            allow_finalize_stream_fallback=True,
        )
```

## Source and related guides

- [Adapter source](https://github.com/GodBoii/Model-Tool-protocol-/blob/72ffb74440f1620fdd71dd097198380fe12433fc/src/mtp/providers/ollama_provider.py).
- [Provider setup and model selection](../TUI_OPERATING_GUIDE.md).
- [Runtime events](../EVENTS.md).
- [Agent API](../AGENT_API.md).
