"""Run a real MTP tool call with a deterministic provider, without an API key."""
from typing import Any

from mtp import Agent, AgentAction, ExecutionPlan, ToolBatch, ToolCall, ToolResult, ToolSpec


@Agent.mtp_tool(description="Add two integers.")
def add(a: int, b: int) -> int:
    return a + b


class OfflineProvider:
    """A fixed plan for a repeatable runtime demo. This provider is not an LLM."""

    def next_action(self, messages: list[dict[str, Any]], tools: list[ToolSpec]) -> AgentAction:
        if messages[-1]["role"] == "tool":
            return AgentAction(response_text=f"Tool result: {messages[-1]['content']}")
        return AgentAction(plan=ExecutionPlan(batches=[ToolBatch(
            mode="sequential",
            calls=[ToolCall(id="sum", name="demo.add", arguments={"a": 25, "b": 17})],
        )]))

    def finalize(self, messages: list[dict[str, Any]], tool_results: list[ToolResult]) -> str:
        return f"25 + 17 = {tool_results[-1].output}"


def main() -> None:
    tools = Agent.ToolRegistry()
    tools.register_toolkit_loader("demo", Agent.toolkit_from_functions("demo", add))
    agent = Agent.MTPAgent(provider=OfflineProvider(), tools=tools)
    print("Offline provider. Real MTP runtime and Python tool. No network requests.")
    for event in agent.run_events("Add 25 and 17", max_rounds=2):
        if event["type"] in {"run_started", "plan_received", "tool_started", "tool_finished", "run_completed"}:
            print(event["type"], event.get("tool_name", ""), event.get("output", event.get("final_text", "")))


if __name__ == "__main__":
    main()
