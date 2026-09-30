# Create your first agent

MTPX is the `mtpx` Python package. Import it as `mtp`, and use `mtp` as the command name. Python 3.10 or later is required. The base install includes the Textual terminal UI.

## Install in a virtual environment

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install mtpx
mtp --help
```

On macOS or Linux, activate the environment with `source .venv/bin/activate`.

## Run without an API key

Download [offline_agent.py](/downloads/offline_agent.py) into a new working directory, then run it:

```bash
python offline_agent.py
```

This example uses a deterministic provider to return a fixed tool plan. MTP executes `demo.add` through the real runtime and returns 42. It makes no cloud requests.

```text
Offline provider. Real MTP runtime and Python tool. No network requests.
run_started
plan_received
tool_started demo.add
tool_finished demo.add 42
run_completed Tool result: 42
```

The provider is a repeatable teaching fixture. Connect an LLM provider for open-ended prompts.

## Scaffold a cloud agent

```bash
mtp new my_agent --template minimal
cd my_agent
python -m pip install -e ".[groq]"
```

The scaffold contains `app.py`, `.env.example`, `pyproject.toml`, and `README.md`. It uses Groq with a calculator toolkit. Install the provider SDK in the same environment as the CLI, configure `GROQ_API_KEY`, then run:

```bash
mtp doctor --provider groq
mtp run
```

Doctor's nonzero exit status means at least one check reported a warning. A saved key confirms configuration exists. It does not prove inference permission.

## Build the agent in Python

```python
from mtp import Agent
from mtp.providers import Groq
from mtp.toolkits import CalculatorToolkit

tools = Agent.ToolRegistry()
tools.register_toolkit_loader("calculator", CalculatorToolkit())

agent = Agent.MTPAgent(
    provider=Groq(model="openai/gpt-oss-120b"),
    tools=tools,
    instructions="Use calculator tools for arithmetic.",
    strict_dependency_mode=True,
)
print(agent.run("What is 25 * 4 + 10?", max_rounds=4))
```

The model ID matches this source release's Groq default. Use the provider's current model catalog or `/model` in the TUI to choose an ID available to your account.

For `.env` files, install `mtpx[dotenv]` and call `Agent.load_dotenv_if_available()` before constructing the provider. The SDK does not automatically load `.env`. A `.env.example` is a template, not a credential source.

## Watch tool execution

```python
for event in agent.run_events("What is 25 * 4?", max_rounds=4):
    if event["type"] in {"tool_started", "tool_finished", "run_completed"}:
        print(event)
```

Events have a `run_id`, `sequence`, timestamp, and a type-specific payload. Use them for tool activity and UI status. See the [event contract](../EVENTS.md).

## Open the terminal app

```bash
mtp tui
```

Choose a provider with `/backend`, enter credentials with `/apikey`, and choose a model with `/model`. Ctrl+N creates another chat, F1 through F9 switch chats, and Ctrl+X stops the active reply. Read the [TUI operating guide](../TUI_OPERATING_GUIDE.md) for local endpoints, prompt queues, attachments, and sessions.

## Add persistence

```python
from mtp import JsonSessionStore

store = JsonSessionStore(db_path="./sessions")
agent = Agent.MTPAgent(provider=provider, tools=tools, session_store=store)
agent.run("Remember the project name is Atlas.", session_id="demo", user_id="u1")
agent.run("What is the project name?", session_id="demo", user_id="u1")
```

Use the same `user_id` for later reads of a session owned by that user. JSON, PostgreSQL, and MySQL stores enforce ownership. See [storage](../STORAGE.md).

## Next steps

- [Create a custom tool](../CREATING_TOOLS.md).
- [Choose a provider](../PROVIDERS.md).
- [Connect a local server](../LOCAL_INFERENCE.md).
- [Read the agent API](../AGENT_API.md).
- [Index a workspace](CODEBASE_MEMORY.md).

Autoresearch changes completion behavior. The model explicitly terminates through `agent.terminate`; normal `max_rounds` does not bound that loop. Use cancellation, `tool_call_limit`, or an external timeout. Start with a normal bounded run before enabling it.
