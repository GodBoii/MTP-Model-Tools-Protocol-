# Quickstart

This guide shows how to create and run an MTP agent quickly.

## 1) Install

## From PyPI

```bash
pip install mtpx
```

Common optional installs:

```bash
# Groq + dotenv helper
pip install "mtpx[groq,dotenv]"

# Local inference (Ollama + LM Studio)
pip install "mtpx[ollama,lmstudio]"

# OpenAI + Anthropic providers
pip install "mtpx[openai,anthropic,dotenv]"

# Web toolkits
pip install "mtpx[toolkits-web]"

# DB session stores
pip install "mtpx[stores-db]"

# Common provider SDKs
pip install "mtpx[providers,dotenv]"
```

`python-dotenv` is optional. MTP does not auto-load `.env` files unless you explicitly call `Agent.load_dotenv_if_available()`.

## Or from source

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -e .
```

Install provider and env helpers separately (equivalent):

```bash
pip install "mtpx[groq,dotenv]"
```

## 2) Configure API key (Cloud Providers)

For cloud providers, either create `.env` and load it explicitly, or set the variables in your shell/session:

```env
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
MIMO_API_KEY=your_mimo_api_key_here
```

For local providers (Ollama, LM Studio), no API key needed!

Important:

- `Agent.load_dotenv_if_available()` is a convenience helper, not automatic behavior.
- If you do not call it, providers only use environment variables already present in the process.

## Local Inference Setup (Optional)

### Ollama

```bash
# Install Ollama
# Visit: https://ollama.com

# Pull a model
ollama pull llama3.2:3b

# Verify
ollama list
```

### LM Studio

1. Download from: https://lmstudio.ai
2. Install and launch
3. Download a model
4. Load the model
5. Start local server: Developer → Local Server → Start

See [TUI Local Inference Guide](TUI_LOCAL_INFERENCE.md) for detailed setup.

## CLI bootstrap (optional)

You can scaffold a starter project instead of building manually:

```bash
mtp new my_agent --template minimal
cd my_agent
mtp run
```

See full CLI reference:
- [CLI](CLI.md)

## 3) Build your first agent

```python
from mtp import Agent
from mtp.providers import Groq
from mtp.toolkits import CalculatorToolkit, FileToolkit, PythonToolkit, ShellToolkit

Agent.load_dotenv_if_available()

tools = Agent.ToolRegistry()
tools.register_toolkit_loader("calculator", CalculatorToolkit())
tools.register_toolkit_loader("file", FileToolkit(base_dir="."))
tools.register_toolkit_loader("python", PythonToolkit(base_dir="."))
tools.register_toolkit_loader("shell", ShellToolkit(base_dir="."))

provider = Groq(model="llama-3.3-70b-versatile")

agent = Agent.MTPAgent(
    provider=provider,
    tools=tools,
    instructions="Use tools when useful and be concise.",
    debug_mode=True,
    strict_dependency_mode=True,
)

result = agent.run(
    "Calculate (25*4)+10 and list current directory files in one short summary.",
    max_rounds=4,
)
print(result)

# Async usage (inside existing asyncio apps):
# result = await agent.arun(
#     "Calculate (25*4)+10 and list current directory files in one short summary.",
#     max_rounds=4,
# )

# Or stream tokens to terminal:
agent.print_response(
    "Share a short summary of current directory files.",
    max_rounds=4,
    stream=True,
)

# Stream structured runtime events (readable terminal logs by default):
agent.print_response(
    "Calculate (25*4)+10 and list current directory files in one short summary.",
    max_rounds=4,
    stream=True,
    stream_events=True,
)

# For raw JSON lines:
agent.print_response(
    "Calculate (25*4)+10 and list current directory files in one short summary.",
    max_rounds=4,
    stream=True,
    stream_events=True,
    event_format="json",
)
```

## 4) Understand runtime behavior

`run`/`run_loop` does:
1. send messages + tool schemas to provider
2. provider returns direct text or tool plan
3. runtime executes tools (parallel/sequential by plan)
4. tool results are added back to conversation
5. loop continues until provider returns final text

Built-in MTP system instructions are appended automatically by the framework.
Your `instructions=` are added on top of those internal instructions.

Event stream includes:
- `run_started`
- `round_started`
- `plan_received`
- `batch_started`
- `tool_started`
- `tool_finished`
- `text_chunk`
- `run_completed`

Full schema:
- [Events Contract](EVENTS.md)
- [Agent API Reference](AGENT_API.md)

## 4.1) Autoresearch mode (optional)

Use autoresearch mode when you want persistent execution where the model should keep working until it explicitly terminates.

```python
agent = Agent.MTPAgent(
    provider=provider,
    tools=tools,
    autoresearch=True,
    research_instructions=(
        "Stay in persistent work mode. Validate with tools and call agent.terminate "
        "only after requirements are fully met."
    ),
    debug_mode=True,
)

agent.print_response(
    "Finish the task completely and terminate only when done.",
    stream=True,
    stream_events=True,
)
```

Notes:
- In autoresearch mode, direct assistant text is treated as intermediate progress (not immediate completion).
- Completion is expected via internal tool `agent.terminate(reason, summary)`.
- `max_rounds` does not cap autoresearch loops; use cancellation, `tool_call_limit`, external timeouts, or `agent.terminate`.
- Event stream includes `run_terminated` before `run_completed` when the model terminates explicitly.

## 5) Try the Interactive TUI

The MTP TUI provides an interactive terminal interface with support for both cloud and local providers:

```bash
# Launch TUI
mtp tui

# Use cloud provider (requires API key)
/backend groq
> Calculate 25 * 4 + 10

# Or use local inference (no API key needed!)
/backend ollama
> What is the factorial of 5? Think step by step.
```

**TUI Features**:
- Multi-provider support (cloud + local)
- Real-time metrics display
- Thinking tokens visualization (Ollama)
- Context window tracking
- Session persistence
- File attachments with `@path/to/file`
- **Modern Aesthetics**: Textual-based chat layout with live tool activity, thinking traces, metrics, and session persistence.

**Example Output with Metrics**:
```
> Calculate 15 * 23

  ctx [█░░░░░░░░░░░░░░░░░░░] 200/32,768 (0.6%)
  💭 thinking Let me calculate: 15 * 20 = 300, 15 * 3 = 45, 300 + 45 = 345
  tokens(in/out/total/reasoning)=120/80/200/30  llm_calls=1  duration=1.50s  speed=133.3 tokens/s

The answer is 345.
```

See [TUI Local Inference Guide](TUI_LOCAL_INFERENCE.md) for detailed TUI documentation.

## 6) Next steps

- Enable persistent sessions:
  - [Storage and Sessions](STORAGE.md)
- Use local inference providers:
  - [Local Inference](LOCAL_INFERENCE.md)
  - [TUI Local Inference Guide](TUI_LOCAL_INFERENCE.md)
- Add your own provider adapter under `src/mtp/providers/`
- Add your own toolkit under `src/mtp/toolkits/`
- Add a transport layer integration under `src/mtp/transport/`
- Build custom tools from Python functions:
  - [Creating Tools](CREATING_TOOLS.md)

## Strict dependency mode

When `strict_dependency_mode=True`, MTP enforces explicit dependency wiring for same-toolkit multi-call batches.

Example expectation:
- good: second call argument uses `{"$ref":"<tool_call_id>"}` or has `depends_on`
- rejected: second call hardcodes an inferred intermediate value

## Session persistence quick example

```python
from mtp import Agent, JsonSessionStore

store = JsonSessionStore(db_path="tmp/mtp_json_db")
agent = Agent.MTPAgent(provider=provider, tools=tools, session_store=store)

agent.run("Remember: project codename is Atlas.", session_id="dev-session", user_id="u1")
agent.run("What is the codename?", session_id="dev-session", user_id="u1")
```
