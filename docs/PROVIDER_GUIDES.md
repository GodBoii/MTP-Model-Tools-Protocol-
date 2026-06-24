# Provider Guides

This file documents the provider adapters exposed by MTP and how they should be used from Agent OS, the TUI, or regular SDK code.

## Common Rules

All providers are created explicitly and passed into `Agent` or `MTPAgent`.

```python
from mtp import Agent
from mtp.providers import Groq

tools = Agent.ToolRegistry()
provider = Groq(model="llama-3.3-70b-versatile")
agent = Agent.MTPAgent(provider=provider, tools=tools)
```

Provider adapters convert provider-native tool calls into MTP `ExecutionPlan` objects. The runtime, not the provider, executes tools. See [TOOL_CALL_SYNTAX.md](TOOL_CALL_SYNTAX.md) for exact tool-call syntax.

Normal chat should use `autoresearch=False`. Autoresearch is persistent mode: direct model text is progress, and completion is expected through `agent.terminate`.

## Mock

- Alias: `MockPlannerProvider`
- SDK package: none
- API key: none
- Default model label in Agent OS: `simple-planner`
- Best for: deterministic tests and local demos

The mock provider is not a general LLM. It only returns deterministic plans/text for tests.

## Groq

- Alias: `Groq`
- Class: `GroqToolCallingProvider`
- Extra: `pip install "mtpx[groq]"`
- Env var: `GROQ_API_KEY`
- Default model: `llama-3.3-70b-versatile`
- Tool calling: native Groq tool calls only
- Streaming: finalize streaming with usage capture when supported

Recommended when you want fast cloud inference with OpenAI-style tool schemas.

## OpenAI

- Alias: `OpenAI`
- Class: `OpenAIToolCallingProvider`
- Extra: `pip install "mtpx[openai]"`
- Env var: `OPENAI_API_KEY`
- Default model: `gpt-4o`
- Tool calling: native OpenAI function/tool calls
- Streaming: finalize fallback unless the selected adapter path exposes native streaming

Use models that support tool calling. Keep tool arguments strict JSON.

## OpenRouter

- Alias: `OpenRouter`
- Class: `OpenRouterToolCallingProvider`
- Extra: `pip install "mtpx[openrouter]"`
- Env var: `OPENROUTER_API_KEY`
- Default model: `qwen/qwen-2.5-72b-instruct`
- Tool calling: OpenAI-compatible tool calls, model-dependent

OpenRouter routes to many model families. Tool reliability depends on the selected model. Prefer models advertised as tool/function-call capable.

## Anthropic

- Alias: `Anthropic`
- TUI name: `claude`
- Class: `AnthropicToolCallingProvider`
- Extra: `pip install "mtpx[anthropic]"`
- Env var: `ANTHROPIC_API_KEY`
- Default model: `claude-3-5-sonnet-20241022`
- Tool calling: Anthropic tool-use blocks

Anthropic uses a different native message shape internally, but MTP still exposes the same event stream and `ExecutionPlan` runtime semantics.

## Gemini

- Alias: `Gemini`
- Class: `GeminiToolCallingProvider`
- Extra: `pip install "mtpx[gemini]"`
- Env var: `GEMINI_API_KEY`
- Default model: `gemini-2.0-flash-exp`
- Tool calling: Gemini function calls
- Multimodal: supports provider-specific media paths where capability checks allow them

Gemini usage and reasoning metrics are normalized through shared usage extraction where available.

## Mistral

- Alias: `Mistral`
- Class: `MistralToolCallingProvider`
- Extra: `pip install "mtpx[mistral]"`
- Env var: `MISTRAL_API_KEY`
- Default model: `mistral-large-latest`
- Tool calling: Mistral tool calls

Use recent Mistral models for better structured tool output.

## Cohere

- Alias: `Cohere`
- Class: `CohereToolCallingProvider`
- Extra: `pip install "mtpx[cohere]"`
- Env var: `COHERE_API_KEY`
- Default model: `command-r-plus-08-2024`
- Tool calling: Cohere-compatible chat/tool calls

Cohere is useful for command-style reasoning and retrieval-like tasks. Keep schemas small and descriptive.

## SambaNova

- Alias: `SambaNova`
- Class: `SambaNovaToolCallingProvider`
- Extra: `pip install "mtpx[sambanova]"`
- Env var: `SAMBANOVA_API_KEY`
- Default model: `Meta-Llama-3.1-405B-Instruct`
- Tool calling: OpenAI-compatible where model supports it

SambaNova model names can change by account/endpoint. Confirm your available model id before use.

## Cerebras

- Alias: `Cerebras`
- Class: `CerebrasToolCallingProvider`
- Extra: `pip install "mtpx[cerebras]"`
- Env var: `CEREBRAS_API_KEY`
- Default model: `llama3.1-70b`
- Tool calling: OpenAI-compatible

Cerebras is optimized for fast hosted inference. Tool behavior is best with concise tool descriptions.

## DeepSeek

- Alias: `DeepSeek`
- Class: `DeepSeekToolCallingProvider`
- Extra: `pip install "mtpx[deepseek]"`
- Env var: `DEEPSEEK_API_KEY`
- Default model: `deepseek-chat`
- Tool calling: OpenAI-compatible

Prefer `deepseek-chat` or another tool-capable endpoint for agent workflows.

## TogetherAI

- Alias: `TogetherAI`
- Class: `TogetherAIToolCallingProvider`
- Extra: `pip install "mtpx[togetherai]"`
- Env var: `TOGETHER_API_KEY`
- Default model: `meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`
- Tool calling: OpenAI-compatible for supported models

TogetherAI exposes many models. Tool quality varies by model family.

## FireworksAI

- Alias: `FireworksAI`
- Class: `FireworksAIToolCallingProvider`
- Extra: `pip install "mtpx[fireworksai]"`
- Env var: `FIREWORKS_API_KEY`
- Default model: `accounts/fireworks/models/llama-v3p1-70b-instruct`
- Tool calling: OpenAI-compatible for supported models

Use account-qualified model ids when required by Fireworks.

## Xiaomi

- Alias: `Xiaomi`
- Class: `XiaomiToolCallingProvider`
- Extra: `pip install "mtpx[xiaomi]"`
- Env var: `MIMO_API_KEY`
- Default model: `mimo-v2.5-pro`
- Default base URL: `https://token-plan-ams.xiaomimimo.com/v1`
- Tool calling: native OpenAI-compatible calls only
- Reasoning: supports Xiaomi reasoning/thinking metadata where the model returns it

The adapter automatically manages thinking mode for planning/finalization and disables tool calls after a tool round where required by the endpoint.

## Ollama

- Alias: `Ollama`
- Class: `OllamaToolCallingProvider`
- Extra: `pip install "mtpx[ollama]"`
- Env var: optional `OLLAMA_API_KEY` for secured hosts
- Default host: `http://localhost:11434`
- Default model: `llama3.2:3b`
- Tool calling: native Ollama chat tool calls when supported by the local model

Install Ollama, pull a model, and verify the server:

```bash
ollama pull llama3.2:3b
ollama list
```

## LM Studio

- Alias: `LMStudio`
- Class: `LMStudioToolCallingProvider`
- Extra: `pip install "mtpx[lmstudio]"`
- API key: not required for local use; a dummy value is accepted by the local OpenAI-compatible server
- Default base URL: `http://127.0.0.1:1234/v1`
- Default model: `qwen3`
- Tool calling: OpenAI-compatible if the loaded model supports tools

Start the LM Studio local server and load a tool-capable model before launching Agent OS.

## Troubleshooting

- Repeated answers in Agent OS: ensure Persistent Autoresearch Mode is off for ordinary chat.
- Raw `<tool_call>` in the answer: use a tool-capable model/provider and configure native tool calls. MTP does not parse tool calls from assistant text.
- Tool validation failure: compare the model arguments against [TOOL_CALL_SYNTAX.md](TOOL_CALL_SYNTAX.md).
- Missing SDK: install the matching extra, for example `pip install "mtpx[groq]"`.
- Missing API key: set the documented env var or enter the key in Agent OS.
