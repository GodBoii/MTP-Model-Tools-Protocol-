# Storage and Session Persistence

This guide explains how to persist conversations and runs in MTP using the built-in session stores.

## Overview

MTP session persistence is opt-in and provider-agnostic.

When you configure a `session_store` and pass a `session_id` at runtime:
- prior messages for that `session_id` are loaded into agent context
- new messages and run metadata are saved after the run
- conversation continuity works across process restarts

Core classes:
- `SessionStore` (protocol/interface)
- `JsonSessionStore`
- `PostgresSessionStore`
- `MySQLSessionStore`

## Stored data model

Each session record stores:
- `session_id`
- `user_id`
- `metadata`
- `messages`
- `runs`
- `created_at`
- `updated_at`

Each run entry stores:
- `run_id`
- `input`
- `final_text`
- `cancelled`
- `paused`
- `total_tool_calls`
- `created_at`

## JSON store (local/dev)

Use JSON for demos and local development.

```python
from mtp import Agent, JsonSessionStore
from mtp.providers import OpenAI

session_store = JsonSessionStore(
    db_path="tmp/mtp_json_db",
    session_table="mtp_sessions",
)

agent = Agent.MTPAgent(
    provider=OpenAI(model="gpt-4o"),
    tools=tools,
    session_store=session_store,
)

agent.run("Remember my codename is Atlas.", session_id="chat-1", user_id="u1")
agent.run("What is my codename?", session_id="chat-1", user_id="u1")
```

When a stored session has `user_id`, later reads must provide the same `user_id`.
This applies to JSON, PostgreSQL, and MySQL stores and prevents accidental
cross-user reads when session IDs are reused or exposed.

**TUI Default Storage:**
The MTP TUI uses centralized JSON storage by default:
- **Location**: `~/.mtp/sessions/` (user home directory)
- **Benefits**: 
  - All sessions from all projects in one place
  - Sessions accessible from any directory
  - Sessions persist even if project directories are deleted
- **Session Metadata**: Includes working directory (`cwd`) for directory-based grouping
- **Auto-Generated Titles**: Session titles automatically created from first user message

## PostgreSQL store

Install dependency:

```bash
pip install "mtpx[store-postgres]"
```

Usage:

```python
from mtp import Agent, PostgresSessionStore

session_store = PostgresSessionStore(
    db_url="postgresql://user:pass@localhost:5432/mtp",
    session_table="mtp_sessions",
)

agent = Agent.MTPAgent(provider=provider, tools=tools, session_store=session_store)
agent.run("hello", session_id="pg-session-1", user_id="u1")
```

Notes:
- session table is auto-created on first use
- `metadata/messages/runs` are stored as JSONB

## MySQL store

Install one dependency:

```bash
pip install "mtpx[store-mysql]"
```

or:

```bash
pip install mysql-connector-python
```

Install both DB driver families:

```bash
pip install "mtpx[stores-db]"
```

Usage:

```python
from mtp import Agent, MySQLSessionStore

session_store = MySQLSessionStore(
    host="localhost",
    user="root",
    password="secret",
    database="mtp",
    port=3306,
    session_table="mtp_sessions",
)

agent = Agent.MTPAgent(provider=provider, tools=tools, session_store=session_store)
agent.run("hello", session_id="mysql-session-1", user_id="u1")
```

Notes:
- session table is auto-created on first use
- JSON payloads are stored as serialized text fields

## Runtime API integration

The following APIs support `session_id`/`user_id`/`metadata`:
- `Agent.run(...)`
- `Agent.arun(...)`
- `Agent.run_loop(...)`
- `Agent.arun_loop(...)`
- `MTPAgent.run(...)`
- `MTPAgent.arun(...)`
- `MTPAgent.print_response(...)` (event and non-event modes)

For structured runs:
- `run_output(...)` / `arun_output(...)` already support `session_id` and save full run records.

## Examples

- [openai_agent_json_session.py](/c:/Users/prajw/Downloads/MTP/examples/openai_agent_json_session.py)
- [groq_agent_json_session.py](/c:/Users/prajw/Downloads/MTP/examples/groq_agent_json_session.py)
- [postgres_agent_session.py](/c:/Users/prajw/Downloads/MTP/examples/postgres_agent_session.py)
- [mysql_agent_session.py](/c:/Users/prajw/Downloads/MTP/examples/mysql_agent_session.py)

## Troubleshooting

- `ImportError: psycopg is required for PostgresSessionStore`
  - install: `pip install psycopg`

- `MySQLSessionStore requires either pymysql or mysql-connector-python`
  - install: `pip install pymysql`

- table name validation error
  - `session_table` must be a safe SQL identifier: letters/numbers/underscore only

- no session continuity
  - ensure the same `session_id` is used across runs
  - ensure `session_store=` is set on the same agent instance or re-created with same DB settings

## Design notes

- Storage is intentionally separate from providers and tool runtime.
- Without `session_store`, behavior is unchanged (in-memory message history only).
- JSON store is best for local workflows; PostgreSQL/MySQL are recommended for multi-process apps.
