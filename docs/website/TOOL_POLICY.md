# Tool policy and approvals

MTP checks a tool's declared risk before calling its handler. Instructions in a prompt do not enforce approval. Configure the registry's `RiskPolicy` and `approval_handler` for that behavior.

## Default decisions

| Tool risk | Default decision |
| --- | --- |
| `READ_ONLY` | Allow |
| `WRITE` | Allow |
| `DESTRUCTIVE` | Ask |

When a decision is `ASK` and there is no approval handler, the registry refuses the call. A tool-specific decision in `by_tool_name` overrides the risk decision. The tool author's risk declaration matters, so mark writes and destructive actions accurately.

## Ask before writes

```python
from mtp import Agent, PolicyDecision, RiskPolicy, ToolRiskLevel

policy = RiskPolicy(by_risk={
    ToolRiskLevel.READ_ONLY: PolicyDecision.ALLOW,
    ToolRiskLevel.WRITE: PolicyDecision.ASK,
    ToolRiskLevel.DESTRUCTIVE: PolicyDecision.DENY,
})

def approve(spec, call, arguments):
    answer = input(f"Allow {spec.name} with {arguments}? [y/N] ")
    return answer.strip().lower() == "y"

tools = Agent.ToolRegistry(policy=policy, approval_handler=approve)
```

This callback is for a terminal program. An application can provide an async callback and show its own approval UI. A true result permits the call; a false result denies it.

## Declare risk on a custom tool

```python
@Agent.mtp_tool(
    description="Write a project note.",
    risk_level=ToolRiskLevel.WRITE,
    side_effects="writes a file inside the workspace",
)
def write_note(text: str) -> str:
    from pathlib import Path
    Path("note.txt").write_text(text, encoding="utf-8")
    return "Saved note.txt"

tools.register_toolkit_loader(
    "notes", Agent.toolkit_from_functions("notes", write_note)
)
```

The example writes only after policy approval. For general file paths, validate the resolved path against the intended workspace. The risk policy controls permission to invoke a handler. It does not isolate the operating system or stop a handler from accessing arbitrary paths.

## Inspect the outcome

`tool_finished` events include `success`, `error`, `approval`, `cached`, and `skipped` where applicable. Use the [event contract](../EVENTS.md) to render the result. Tool argument schemas and dependency references still need validation even after approval.

See [creating tools](../CREATING_TOOLS.md), [local toolkits](../LOCAL_TOOLKITS.md), and the [runtime source](https://github.com/GodBoii/Model-Tool-protocol-/blob/main/src/mtp/runtime.py).
