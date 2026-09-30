# Anthropic provider

`Anthropic` is the public alias for `AnthropicToolCallingProvider`. This guide derives its constructor from MTPX 0.1.37.

## Install and configure

```bash
python -m pip install "mtpx[anthropic]"
mtp doctor --provider anthropic
```

Set `ANTHROPIC_API_KEY` in your process environment before constructing the provider. The SDK does not automatically load `.env`. To use a `.env` file, install `mtpx[dotenv]` and call `Agent.load_dotenv_if_available()` first.

Constructor model defaults below come from this release's code. They are offline defaults, not a guarantee of current provider availability or account access. Enter an available model ID, or use `/model` in the terminal UI to discover models.

## Create an agent

```python
from mtp import Agent
from mtp.providers import Anthropic
from mtp.toolkits import CalculatorToolkit

tools = Agent.ToolRegistry()
tools.register_toolkit_loader("calculator", CalculatorToolkit())
provider = Anthropic()
agent = Agent.MTPAgent(provider=provider, tools=tools)
print(agent.run("What is 25 * 4 + 10?", max_rounds=4))
```

This example makes a provider request. The [offline quickstart](../website/QUICKSTART.md) needs no credentials.

## Constructor reference

| Parameter | Annotation | Source default |
| --- | --- | --- |
| `model` | `str` | `'claude-3-5-sonnet-20241022'` |
| `api_key` | `str \| None` | `None` |
| `max_tokens` | `int` | `1024` |
| `temperature` | `float` | `0.0` |
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
            provider="anthropic",
            supports_tool_calling=True,
            supports_parallel_tool_calls=True,
            input_modalities=["text", "image", "file"],
            supports_tool_media_output=True,
            supports_finalize_streaming=False,
            usage_metrics_quality=USAGE_METRICS_RICH,
            supports_reasoning_metadata=False,
            structured_output_support=STRUCTURED_OUTPUT_CLIENT_VALIDATED,
            supports_native_async=False,
            allow_finalize_stream_fallback=True,
        )
```

## Source and related guides

- [Adapter source](https://github.com/GodBoii/Model-Tool-protocol-/blob/72ffb74440f1620fdd71dd097198380fe12433fc/src/mtp/providers/anthropic_provider.py).
- [Provider setup and model selection](../TUI_OPERATING_GUIDE.md).
- [Runtime events](../EVENTS.md).
- [Agent API](../AGENT_API.md).
