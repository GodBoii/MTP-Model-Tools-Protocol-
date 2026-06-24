# Provider Guides

Detailed documentation for each MTP provider. Each guide covers installation, API key setup, parameters, capabilities, and working examples.

## Cloud Providers

| Provider | Install | Env Var | Default Model | Docs |
|---|---|---|---|---|
| **Groq** | `pip install "mtpx[groq]"` | `GROQ_API_KEY` | `llama-3.3-70b-versatile` | [GROQ.md](GROQ.md) |
| **OpenAI** | `pip install "mtpx[openai]"` | `OPENAI_API_KEY` | `gpt-4o` | [OPENAI.md](OPENAI.md) |
| **Anthropic** | `pip install "mtpx[anthropic]"` | `ANTHROPIC_API_KEY` | `claude-3-5-sonnet-20241022` | [ANTHROPIC.md](ANTHROPIC.md) |
| **Gemini** | `pip install "mtpx[gemini]"` | `GEMINI_API_KEY` | `gemini-2.0-flash` | [GEMINI.md](GEMINI.md) |
| **Mistral** | `pip install "mtpx[mistral]"` | `MISTRAL_API_KEY` | `mistral-large-latest` | [MISTRAL.md](MISTRAL.md) |
| **Cohere** | `pip install "mtpx[cohere]"` | `COHERE_API_KEY` | `command-a-03-2025` | [COHERE.md](COHERE.md) |
| **DeepSeek** | `pip install "mtpx[deepseek]"` | `DEEPSEEK_API_KEY` | `deepseek-chat` | [DEEPSEEK.md](DEEPSEEK.md) |
| **Xiaomi MiMo** | `pip install "mtpx[xiaomi]"` | `MIMO_API_KEY` | `mimo-v2.5-pro` | [XIAOMI.md](XIAOMI.md) |

## OpenAI-Compatible Cloud Providers

These providers use the OpenAI SDK under the hood with custom base URLs.

| Provider | Install | Env Var | Default Model | Docs |
|---|---|---|---|---|
| **OpenRouter** | `pip install "mtpx[openrouter]"` | `OPENROUTER_API_KEY` | `qwen/qwen3.6-plus-preview:free` | [OPENROUTER.md](OPENROUTER.md) |
| **SambaNova** | `pip install "mtpx[sambanova]"` | `SAMBANOVA_API_KEY` | `Meta-Llama-3.1-70B-Instruct` | [SAMBANOVA.md](SAMBANOVA.md) |
| **Cerebras** | `pip install "mtpx[cerebras]"` | `CEREBRAS_API_KEY` | `llama-4-scout-17b-16e-instruct` | [CEREBRAS.md](CEREBRAS.md) |
| **Together AI** | `pip install "mtpx[togetherai]"` | `TOGETHER_API_KEY` | `meta-llama/Llama-4-Scout-17B-16E-Instruct` | [TOGETHER.md](TOGETHER.md) |
| **Fireworks AI** | `pip install "mtpx[fireworksai]"` | `FIREWORKS_API_KEY` | `accounts/fireworks/models/llama-v3p3-70b-instruct` | [FIREWORKS.md](FIREWORKS.md) |

## Local Providers

No cloud API key required. Run models on your own hardware.

| Provider | Install | Default Host | Default Model | Docs |
|---|---|---|---|---|
| **Ollama** | `pip install "mtpx[ollama]"` | `http://localhost:11434` | `qwen3` | [OLLAMA.md](OLLAMA.md) |
| **LM Studio** | `pip install "mtpx[lmstudio]"` | `http://127.0.0.1:1234/v1` | `qwen3` | [LMSTUDIO.md](LMSTUDIO.md) |

## Testing

| Provider | Install | API Key | Docs |
|---|---|---|---|
| **Mock Planner** | None (built-in) | None | [MOCK.md](MOCK.md) |

## Install All Providers

```bash
pip install "mtpx[providers]"
```

This installs SDKs for: OpenAI, Ollama, Groq, Anthropic, Google Gemini, Cohere, and Mistral.

## Usage Pattern

All providers follow the same pattern:

```python
from mtp import Agent
from mtp.providers import <ProviderAlias>

Agent.load_dotenv_if_available()  # loads API key from .env file

provider = <ProviderAlias>(model="...", ...)
tools = Agent.ToolRegistry()
agent = Agent(provider=provider, tools=tools)

reply = agent.run_loop("Your prompt here")
print(reply)
```

## `.env` File Setup (recommended)

1. Install dotenv support:
   ```bash
   pip install python-dotenv
   ```
   Or with the MTP extra:
   ```bash
   pip install "mtpx[dotenv]"
   ```

2. Copy `.env.example` to `.env` and fill in your API keys:
   ```
   GROQ_API_KEY=gsk_your_key_here
   OPENAI_API_KEY=sk-your_key_here
   ANTHROPIC_API_KEY=sk-ant-your_key_here
   GEMINI_API_KEY=AIzaSyour_key_here
   MISTRAL_API_KEY=your_key_here
   COHERE_API_KEY=your_key_here
   DEEPSEEK_API_KEY=sk-your_key_here
   OPENROUTER_API_KEY=sk-or-your_key_here
   SAMBANOVA_API_KEY=your_key_here
   CEREBRAS_API_KEY=csk-your_key_here
   TOGETHER_API_KEY=your_key_here
   FIREWORKS_API_KEY=fw_your_key_here
   MIMO_API_KEY=your_key_here
   ```

3. Call `Agent.load_dotenv_if_available()` **before** creating any provider. This reads the `.env` file and sets environment variables that the provider picks up automatically.

## Provider Aliases

Each provider has a short alias and a full class name:

| Alias | Full Class Name |
|---|---|
| `Groq` | `GroqToolCallingProvider` |
| `OpenAI` | `OpenAIToolCallingProvider` |
| `Anthropic` | `AnthropicToolCallingProvider` |
| `Gemini` | `GeminiToolCallingProvider` |
| `Ollama` | `OllamaToolCallingProvider` |
| `LMStudio` | `LMStudioToolCallingProvider` |
| `Mistral` | `MistralToolCallingProvider` |
| `Cohere` | `CohereToolCallingProvider` |
| `OpenRouter` | `OpenRouterToolCallingProvider` |
| `SambaNova` | `SambaNovaToolCallingProvider` |
| `Cerebras` | `CerebrasToolCallingProvider` |
| `DeepSeek` | `DeepSeekToolCallingProvider` |
| `TogetherAI` | `TogetherAIToolCallingProvider` |
| `FireworksAI` | `FireworksAIToolCallingProvider` |
| `Xiaomi` | `XiaomiToolCallingProvider` |
| `MockPlannerProvider` | `SimplePlannerProvider` |
