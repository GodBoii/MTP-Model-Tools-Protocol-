# Provider directory

These defaults derive from MTPX 0.1.37 constructors. Choose a model available to your account. The terminal model picker can discover provider metadata or accept a custom ID.

## Cloud and local adapters

| Adapter alias | Install extra | Credential or endpoint | Source model default | Guide |
| --- | --- | --- | --- | --- |
| Groq | `mtpx[groq]` | `GROQ_API_KEY` | `'openai/gpt-oss-120b'` | [GROQ.md](GROQ.md) |
| OpenAI | `mtpx[openai]` | `OPENAI_API_KEY` | `'gpt-4o'` | [OPENAI.md](OPENAI.md) |
| OpenRouter | `mtpx[openrouter]` | `OPENROUTER_API_KEY` | `'qwen/qwen3.6-plus-preview:free'` | [OPENROUTER.md](OPENROUTER.md) |
| Anthropic | `mtpx[anthropic]` | `ANTHROPIC_API_KEY` | `'claude-3-5-sonnet-20241022'` | [ANTHROPIC.md](ANTHROPIC.md) |
| Gemini | `mtpx[gemini]` | `GEMINI_API_KEY` | `'gemini-2.0-flash'` | [GEMINI.md](GEMINI.md) |
| SambaNova | `mtpx[sambanova]` | `SAMBANOVA_API_KEY` | `'Meta-Llama-3.1-70B-Instruct'` | [SAMBANOVA.md](SAMBANOVA.md) |
| Cerebras | `mtpx[cerebras]` | `CEREBRAS_API_KEY` | `'llama-4-scout-17b-16e-instruct'` | [CEREBRAS.md](CEREBRAS.md) |
| DeepSeek | `mtpx[deepseek]` | `DEEPSEEK_API_KEY` | `'deepseek-chat'` | [DEEPSEEK.md](DEEPSEEK.md) |
| Mistral | `mtpx[mistral]` | `MISTRAL_API_KEY` | `'mistral-large-latest'` | [MISTRAL.md](MISTRAL.md) |
| Cohere | `mtpx[cohere]` | `COHERE_API_KEY` | `'command-a-03-2025'` | [COHERE.md](COHERE.md) |
| TogetherAI | `mtpx[togetherai]` | `TOGETHER_API_KEY` | `'meta-llama/Llama-4-Scout-17B-16E-Instruct'` | [TOGETHER.md](TOGETHER.md) |
| FireworksAI | `mtpx[fireworksai]` | `FIREWORKS_API_KEY` | `'accounts/fireworks/models/llama-v3p3-70b-instruct'` | [FIREWORKS.md](FIREWORKS.md) |
| Xiaomi | `mtpx[xiaomi]` | `MIMO_API_KEY` | `'mimo-v2.5-pro'` | [XIAOMI.md](XIAOMI.md) |
| Ollama | `mtpx[ollama]` | `local server` | `'qwen3'` | [OLLAMA.md](OLLAMA.md) |
| LMStudio | `mtpx[lmstudio]` | `local server` | `'qwen3'` | [LMSTUDIO.md](LMSTUDIO.md) |

Install an extra with `python -m pip install "mtpx[groq]"`, replacing `groq` with the provider's name. The `providers` aggregate installs a subset of common SDKs; use the specific extras above for an exact adapter.

## Offline testing

[MockPlannerProvider](MOCK.md) requires no external SDK. The [offline agent example](../website/QUICKSTART.md) executes a real Python tool through a deterministic provider.

## Configuration

The SDK reads environment variables. To load `.env`, install `mtpx[dotenv]` and call `Agent.load_dotenv_if_available()`. The TUI has its own masked credential form, model catalog, and local endpoint setup. Read the [TUI operating guide](../TUI_OPERATING_GUIDE.md).
