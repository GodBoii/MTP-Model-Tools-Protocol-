"""Capture real CLI output and Textual UI states in an isolated temporary workspace."""
from __future__ import annotations

import asyncio
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "media"


def run(command: list[str], cwd: Path) -> str:
    result = subprocess.run(command, cwd=cwd, text=True, encoding="utf-8", capture_output=True, check=True)
    return result.stdout.strip()


async def capture_tui(workspace: Path) -> None:
    from mtp import JsonSessionStore
    from mtp.cli.tui_app import MTPApp
    from mtp.cli.tui_state import TUIState
    from mtp.cli.tui_widgets.input_area import InputArea

    state = TUIState(
        backend="codex", codex_model=None, openai_model="gpt-4o-mini", max_rounds=5,
        cwd=workspace, autoresearch=False, research_instructions=None, reasoning_effort="medium",
        harness_mode="code", codex_sandbox_mode="read-only", last_usage_lines=[], transcript=[],
        session_store=JsonSessionStore(db_path=workspace / "sessions"),
        session_id="website-demo", session_label="Website demo", user_id="demo",
    )
    app = MTPApp(state=state)
    async with app.run_test(size=(120, 38)) as pilot:
        async def snapshot(name: str) -> None:
            await pilot.pause(.25)
            (OUTPUT / f"{name}.svg").write_text(app.export_screenshot(), encoding="utf-8")

        await snapshot("tui-home")
        app._dispatch_command("help", "")
        await snapshot("tui-help")
        await pilot.press("escape")
        app._dispatch_command("backend", "")
        await snapshot("tui-providers")
        await pilot.press("escape")
        app._dispatch_command("apikey", "groq")
        await snapshot("tui-setup")
        await pilot.press("escape", "ctrl+n")
        app.query_one(InputArea).load_text("Review the project files with me")
        await snapshot("tui-chats")
        app._dispatch_command("status", "")
        await snapshot("tui-status")
        assert app._exception is None


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    # Provider keys are intentionally absent. Never load a user's .env or sessions.
    for name in list(os.environ):
        if name.endswith("API_KEY"):
            os.environ.pop(name)
    with tempfile.TemporaryDirectory(prefix="mtp-website-demo-") as directory:
        workspace = Path(directory)
        help_output = run([sys.executable, "-m", "mtp.cli.main", "--help"], workspace)
        new_output = run([sys.executable, "-m", "mtp.cli.main", "new", "first-agent", "--dir", str(workspace)], workspace)
        code = (workspace / "first-agent" / "app.py").read_text()
        demo = (ROOT / "public" / "downloads" / "offline_agent.py").read_text()
        (workspace / "first-agent" / "offline_agent.py").write_text(demo)
        agent_output = run([sys.executable, "-m", "mtp.cli.main", "run", "--path", str(workspace / "first-agent"), "--entry", "offline_agent.py"], workspace)
        memory_output = run([sys.executable, "-m", "mtp.cli.main", "codebase", "memory", "--path", str(workspace / "first-agent"), "--on"], workspace)
        status_output = run([sys.executable, "-m", "mtp.cli.main", "codebase", "status", "--path", str(workspace / "first-agent")], workspace)
        records = {
            "cli": [{"command": "mtp --help", "output": help_output}],
            "agent": [
                {"command": "mtp new first-agent --template minimal", "output": new_output},
                {"command": "Generated app.py", "output": code},
                {"command": "mtp run --path ./first-agent --entry offline_agent.py", "output": agent_output},
            ],
            "memory": [
                {"command": "mtp codebase memory --path ./first-agent --on", "output": memory_output},
                {"command": "mtp codebase status --path ./first-agent", "output": status_output},
            ],
        }
        # Redact only the temporary machine path; preserve the program's output.
        payload = json.dumps(records, indent=2).replace(str(workspace).replace("\\", "\\\\"), "./demo-workspace")
        (OUTPUT / "cli-transcripts.json").write_text(payload + "\n", encoding="utf-8")
        asyncio.run(capture_tui(workspace))
    print("Captured CLI transcripts and six real Textual screens")


if __name__ == "__main__":
    main()
