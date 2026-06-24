# Xiaomi MiMo Integration

## Summary

Xiaomi MiMo can be used as an OpenAI-compatible provider by changing three values:

- `base_url`: `https://token-plan-ams.xiaomimimo.com/v1`
- `api_key`: `MIMO_API_KEY`
- `model`: `mimo-v2.5-pro` or `mimo-v2.5`

The MTP provider is available as both:

```python
from mtp.providers import Xiaomi

provider = Xiaomi(model="mimo-v2.5-pro")
```

and:

```python
from mtp.providers import XiaomiToolCallingProvider

provider = XiaomiToolCallingProvider(model="mimo-v2.5")
```

## OpenAI Protocol Mapping

MiMo's OpenAI-compatible chat endpoint follows the standard Chat Completions shape:

- Client sends `Authorization: Bearer <MIMO_API_KEY>`.
- Requests are sent to `/chat/completions` under the configured `/v1` base URL.
- Messages use OpenAI roles: `system`, `user`, `assistant`, and `tool`.
- Tool definitions use `{"type": "function", "function": {...}}`.
- Tool call responses are read from `choices[0].message.tool_calls`.
- Streaming returns server-sent chat completion chunks where text is in `choices[0].delta.content`.
- Token accounting is expected in the standard `usage` object, usually with prompt, completion, and total token fields.

Because this mapping is standard, frameworks that accept an OpenAI SDK/client plus a custom `base_url` should work without a dedicated Xiaomi SDK.

## Agno Compatibility Notes

Agno documents the `provider:model_id` string form and also ships an `OpenAILike` class for custom OpenAI-schema providers. Its OpenRouter provider subclasses `OpenAILike` and changes `base_url`, env-var lookup, and provider-specific extras. Xiaomi fits that same pattern.

For a pure Agno application, the equivalent shape is:

```python
from agno.models.openai.like import OpenAILike

model = OpenAILike(
    id="mimo-v2.5-pro",
    name="Xiaomi",
    api_key=os.environ["MIMO_API_KEY"],
    base_url="https://token-plan-ams.xiaomimimo.com/v1",
)
```

## Implemented MTP Support

The `Xiaomi` provider supports:

- Chat completion requests.
- Tool calling through OpenAI function tools.
- Streaming final responses through `finalize_stream`.
- Text, image, audio, and file inputs where the MiMo endpoint/model accepts OpenAI-compatible content parts.
- Usage extraction through the same `usage` parser used by other OpenAI-compatible providers.

Environment note:

- `Xiaomi(...)` reads `MIMO_API_KEY` from the current process environment unless you pass `api_key=...`.
- `.env` files are only loaded if your application explicitly calls `Agent.load_dotenv_if_available()` and has `python-dotenv` installed.

The TUI/provider registry includes:

- Provider name: `xiaomi`
- Alias: `Xiaomi`
- Env var: `MIMO_API_KEY`
- Models: `mimo-v2.5-pro`, `mimo-v2.5`

## Smoke Tests

Run the direct API smoke test:

```bash
python examples/xiaomi_mimo_smoke_test.py
```

Run only text, streaming, and tool calling:

```bash
python examples/xiaomi_mimo_smoke_test.py --skip-multimodal
```

Run the MTP agent example:

```bash
python examples/xiaomi_agent.py
```

The smoke test prints response content and `usage` for each model so credit consumption can be compared against the MiMo Token Plan dashboard.

## Limitations And Production Notes

- Multimodal support is model-dependent. Treat image/audio/file checks as capability probes rather than guaranteed behavior for every MiMo model.
- TTS models may use OpenAI-compatible audio endpoints rather than chat completions; they are intentionally not routed through this chat provider.
- The Token Plan endpoint is separate from the Anthropic-compatible endpoint. Use this provider only for the OpenAI-compatible `/v1` API.
- For large coding-agent runs, monitor dashboard credits and `usage` closely. Long context windows can consume credits quickly.
- Prefer off-peak windows, 16:00-24:00 UTC, when the account is eligible for lower credit consumption.
- Keep request logging redacted: never log `MIMO_API_KEY`.

## Sources Checked

- Xiaomi MiMo OpenAI-compatible API docs: https://platform.xiaomimimo.com/docs/en-US/api/chat/openai-api
- Xiaomi MiMo Token Plan quick access docs: https://platform.xiaomimimo.com/docs/en-US/tokenplan/quick-access
- Xiaomi MiMo integration docs: https://platform.xiaomimimo.com/docs/en-US/integration/tools-overview
- Xiaomi MiMo subscription docs: https://platform.xiaomimimo.com/docs/en-US/tokenplan/subscription
- Agno model overview: https://docs.agno.com/models/overview
- Agno model-as-string docs: https://docs.agno.com/models/model-as-string
- Agno compatibility docs: https://docs.agno.com/models/compatibility
- Agno model index: https://docs.agno.com/models/providers/model-index
