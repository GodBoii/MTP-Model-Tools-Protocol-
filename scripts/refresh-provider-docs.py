"""Generate provider constructor references from the source AST, without importing SDKs."""
from __future__ import annotations

import ast
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    source = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT.parent / "MTP").resolve()
    metadata = json.loads((ROOT / "content/docs-source.json").read_text(encoding="utf-8"))
    # ProviderInfo metadata has no credential reads. Parse it rather than importing the module.
    catalog = ast.parse((source / "src/mtp/cli/providers.py").read_text(encoding="utf-8"))
    provider_rows = next(node.value.elts for node in catalog.body if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name) and node.target.id == "PROVIDERS")
    filenames = {"togetherai": "together", "fireworksai": "fireworks"}
    derived = []
    directory_rows = []
    for row in provider_rows:
        name, alias, class_name, sdk, env, *_ = [ast.literal_eval(value) for value in row.args]
        if name == "mock":
            continue
        module = filenames.get(name, name)
        file = source / f"src/mtp/providers/{module}_provider.py"
        tree = ast.parse(file.read_text(encoding="utf-8"))
        cls = next(node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == class_name)
        init = next(node for node in cls.body if isinstance(node, ast.FunctionDef) and node.name == "__init__")
        parameters = list(zip(init.args.kwonlyargs, init.args.kw_defaults))
        positional = init.args.args[1:]
        defaults = [None] * (len(positional) - len(init.args.defaults)) + init.args.defaults
        parameters = list(zip(positional, defaults)) + parameters
        model_default = next((ast.unparse(value) for arg, value in parameters if arg.arg == "model" and value is not None), "set an available ID")
        directory_rows.append(f"| {alias} | `mtpx[{name}]` | `{env or 'local server'}` | `{model_default}` | [{module.upper()}.md]({module.upper()}.md) |")
        table = []
        for arg, default in parameters:
            annotation = ast.unparse(arg.annotation) if arg.annotation else "Any"
            value = ast.unparse(default) if default else "required"
            annotation = annotation.replace("|", "\\|")
            value = value.replace("|", "\\|")
            table.append(f"| `{arg.arg}` | `{annotation}` | `{value}` |")
        capabilities = next((node for node in cls.body if isinstance(node, ast.FunctionDef) and node.name == "capabilities"), None)
        capability_code = ast.get_source_segment(file.read_text(encoding="utf-8"), capabilities) if capabilities else None
        credential = f"Set `{env}` in your process environment before constructing the provider. The SDK does not automatically load `.env`. To use a `.env` file, install `mtpx[dotenv]` and call `Agent.load_dotenv_if_available()` first." if env else "Start the local inference server before making a request. Use `host` or `base_url` as listed below to select its endpoint. A local server normally needs no cloud API key."
        model_note = "Constructor model defaults below come from this release's code. They are offline defaults, not a guarantee of current provider availability or account access. Enter an available model ID, or use `/model` in the terminal UI to discover models."
        guide = f'''# {alias} provider

`{alias}` is the public alias for `{class_name}`. This guide derives its constructor from MTPX {metadata['version']}.

## Install and configure

```bash
python -m pip install "mtpx[{name}]"
mtp doctor --provider {name}
```

{credential}

{model_note}

## Create an agent

```python
from mtp import Agent
from mtp.providers import {alias}
from mtp.toolkits import CalculatorToolkit

tools = Agent.ToolRegistry()
tools.register_toolkit_loader("calculator", CalculatorToolkit())
provider = {alias}()
agent = Agent.MTPAgent(provider=provider, tools=tools)
print(agent.run("What is 25 * 4 + 10?", max_rounds=4))
```

This example makes a provider request. The [offline quickstart](../website/QUICKSTART.md) needs no credentials.

## Constructor reference

| Parameter | Annotation | Source default |
| --- | --- | --- |
{chr(10).join(table)}

## Inspect capabilities

```python
print(provider.capabilities())
```

Capabilities describe the adapter's tools, streaming, media, structured output, and async behavior. The selected model and account can impose further restrictions. See the [provider contract](../PROVIDERS.md).
'''
        if capability_code:
            guide += f"\nThe adapter declares the following contract in this source release:\n\n```python\n{capability_code}\n```\n"
        relative = f"src/mtp/providers/{module}_provider.py"
        guide += f"\n## Source and related guides\n\n- [Adapter source]({metadata['repository']}/blob/{metadata['revision']}/{relative}).\n- [Provider setup and model selection](../TUI_OPERATING_GUIDE.md).\n- [Runtime events](../EVENTS.md).\n- [Agent API](../AGENT_API.md).\n"
        target = ROOT / f"docs/providers/{module.upper()}.md"
        target.write_text(guide, encoding="utf-8")
        derived.append({"path": str(target.relative_to(ROOT)).replace("\\", "/"), "source": relative})
    directory = "# Provider directory\n\nThese defaults derive from MTPX " + metadata["version"] + " constructors. Choose a model available to your account. The terminal model picker can discover provider metadata or accept a custom ID.\n\n## Cloud and local adapters\n\n| Adapter alias | Install extra | Credential or endpoint | Source model default | Guide |\n| --- | --- | --- | --- | --- |\n" + "\n".join(directory_rows)
    directory += "\n\nInstall an extra with `python -m pip install \"mtpx[groq]\"`, replacing `groq` with the provider's name. The `providers` aggregate installs a subset of common SDKs; use the specific extras above for an exact adapter.\n\n## Offline testing\n\n[MockPlannerProvider](MOCK.md) requires no external SDK. The [offline agent example](../website/QUICKSTART.md) executes a real Python tool through a deterministic provider.\n\n## Configuration\n\nThe SDK reads environment variables. To load `.env`, install `mtpx[dotenv]` and call `Agent.load_dotenv_if_available()`. The TUI has its own masked credential form, model catalog, and local endpoint setup. Read the [TUI operating guide](../TUI_OPERATING_GUIDE.md).\n"
    (ROOT / "docs/providers/README.md").write_text(directory, encoding="utf-8")
    mock = '''# Mock planner provider

`MockPlannerProvider` is an alias for a small deterministic planner. It needs no provider SDK or API key.

## Run a text-only fixture

```python
from mtp import Agent
from mtp.providers import MockPlannerProvider

agent = Agent.MTPAgent(
    provider=MockPlannerProvider(), tools=Agent.ToolRegistry()
)
print(agent.run("Hello"))
```

The reply is `Planner has no tool plan for this prompt yet.` This provider follows fixed rules; it does not answer general questions or calculate arbitrary expressions.

## Tool-plan fixture

A prompt containing `profile` requests `github.get_user` followed by `github.create_issue`, with a dependency and a result reference. Those names are demo contracts. Register both handlers before using that prompt. The built-in planner itself does not connect to GitHub.

For a complete offline example that registers and executes its own tool, use the [quickstart](../website/QUICKSTART.md) and [download offline_agent.py](/downloads/offline_agent.py).

## Capabilities

The planner supports deterministic sequential tool plans and text input. It declares no native finalize streaming, usage metrics, reasoning metadata, structured output, or native async client. The runtime can use its declared finalize fallback.

## Import the underlying class

```python
from mtp.providers.simple_planner import SimplePlannerProvider
```

The public package alias is `MockPlannerProvider`. The underlying class lives in `simple_planner.py`.
'''
    (ROOT / "docs/providers/MOCK.md").write_text(mock, encoding="utf-8")
    (ROOT / "content/provider-reference-source.json").write_text(json.dumps({"revision": metadata["revision"], "derived": derived}, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {len(derived)} provider references from constructors and capability methods")


if __name__ == "__main__":
    main()
