# Agent OS

Agent OS is MTP's optional Streamlit browser interface. It shares the Python runtime and supports provider selection, conversation history, tool activity, and streamed replies.

## Install and launch

```bash
pip install "mtpx[ui-streamlit,groq,dotenv]"
mtp agent-os
```

Launch from the workspace you want the agent to use. The launcher passes that directory to the app through `MTP_AGENT_OS_CWD` and starts Streamlit's local server. Open the local URL printed by Streamlit.

## Configure a conversation

Choose a provider and model in the app. Configure the matching SDK and credentials before making a request. A local Ollama or LM Studio provider needs a running server. The terminal UI has a separate setup flow described in the [TUI operating guide](../TUI_OPERATING_GUIDE.md).

Agent OS streams provider text and displays runtime tool events. The browser app keeps a conversation history and can use session storage. For an application integration, consume [runtime events](../EVENTS.md) directly and use the [agent API](../AGENT_API.md).

## If startup fails

Install `mtpx[ui-streamlit]` in the same Python environment as the `mtp` command. If the launcher reports a missing Streamlit package, installing it in another environment will not fix that command. Check the terminal for the server URL and runtime errors.
