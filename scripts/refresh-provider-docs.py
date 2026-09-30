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
    (ROOT / "content/provider-reference-source.json").write_text(json.dumps({"revision": metadata["revision"], "derived": derived}, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {len(derived)} provider references from constructors and capability methods")


if __name__ == "__main__":
    main()
