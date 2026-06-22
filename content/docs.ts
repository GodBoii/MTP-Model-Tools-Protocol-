export type DocSection = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  bullets: string[];
  code?: {
    label: string;
    language: string;
    value: string;
  };
};

export type DocChapter = {
  slug: string;
  title: string;
  group: string;
  track: string;
  order: string;
  summary: string;
  useCase: string;
  explanation: string;
  bullets: string[];
  code: string;
  palette: [string, string, string];
  selected?: boolean;
};

const palettes: [string, string, string][] = [
  ["#101010", "#ff3928", "#ebebeb"],
  ["#151515", "#d9f851", "#ebebeb"],
  ["#101010", "#32d9ff", "#ebebeb"],
  ["#171717", "#ff3928", "#d8d8d8"],
  ["#111111", "#f7f7f7", "#ff3928"]
];

const rawDocChapters = [
  ["introduction", "Introduction", "Start", "Concepts"],
  ["quickstart", "Quickstart", "Start", "Guide"],
  ["installation", "Installation", "Start", "Setup"],
  ["planning", "Planning", "Core runtime", "Planner"],
  ["dag-execution", "DAG Execution", "Core runtime", "Execution"],
  ["runtime-engine", "Runtime Engine", "Core runtime", "Runtime"],
  ["tool-registry", "Tool Registry", "Core runtime", "Tools"],
  ["risk-policies", "Risk Policies", "Core runtime", "Safety"],
  ["stateful-sessions", "Stateful Sessions", "Core runtime", "Memory"],
  ["human-approval", "Human Approval Gates", "Core runtime", "Safety"],
  ["event-streaming", "Event Streaming", "Core runtime", "Events"],
  ["provider-abstraction", "Provider Abstraction", "Core runtime", "Providers"],
  ["execution-lifecycle", "Execution Lifecycle", "Core runtime", "Lifecycle"],
  ["execution-flow", "Execution Flow", "Architecture", "Flow"],
  ["planner-vs-runtime", "Planner vs Runtime", "Architecture", "Boundary"],
  ["dag-resolution", "DAG Resolution", "Architecture", "Graph"],
  ["state-persistence", "State Persistence", "Architecture", "Storage"],
  ["tool-sandboxing", "Tool Sandboxing", "Architecture", "Safety"],
  ["event-bus", "Event Bus", "Architecture", "Events"],
  ["provider-layer", "Provider Layer", "Architecture", "Providers"],
  ["sdk-agent", "Agent", "SDK reference", "Class"],
  ["sdk-runtime", "Runtime", "SDK reference", "Module"],
  ["sdk-tool", "Tool", "SDK reference", "Contract"],
  ["sdk-session", "Session", "SDK reference", "Storage"],
  ["sdk-policies", "Policies", "SDK reference", "Safety"],
  ["sdk-events", "Events", "SDK reference", "Stream"],
  ["sdk-providers", "Providers", "SDK reference", "Adapters"],
  ["sdk-storage", "Storage", "SDK reference", "Stores"],
  ["providers", "Overview", "Providers", "Overview"],
  ["provider-openai", "OpenAI", "Providers", "Cloud"],
  ["provider-anthropic", "Anthropic", "Providers", "Cloud"],
  ["provider-gemini", "Gemini", "Providers", "Cloud"],
  ["provider-groq", "Groq", "Providers", "Cloud"],
  ["provider-ollama", "Ollama", "Providers", "Local"],
  ["provider-custom", "Custom Providers", "Providers", "Extension"],
  ["safety-risk-levels", "Risk Levels", "Safety", "Policy"],
  ["safety-approval", "Approval Gates", "Safety", "Human review"],
  ["safety-sandboxing", "Sandboxing", "Safety", "Isolation"],
  ["safety-permissions", "Tool Permissions", "Safety", "Permissions"],
  ["safety-audit", "Audit Logs", "Safety", "Trace"],
  ["obs-streaming", "Event Streaming", "Observability", "Events"],
  ["obs-tui", "TUI Monitoring", "Observability", "Terminal"],
  ["obs-logs", "Runtime Logs", "Observability", "Logs"],
  ["obs-traces", "Execution Traces", "Observability", "Trace"],
  ["obs-dag-viz", "DAG Visualization", "Observability", "Graph"],
  ["example-research", "Research Agent", "Examples", "Use case"],
  ["example-coding", "Coding Agent", "Examples", "Use case"],
  ["example-filesystem", "File System Agent", "Examples", "Use case"],
  ["example-fallback", "Multi-Provider Fallback", "Examples", "Use case"],
  ["example-approval", "Human Approval Workflow", "Examples", "Use case"],
  ["example-enterprise", "Enterprise Audit Pipeline", "Examples", "Use case"]
] as const;

function chapterSummary(title: string, group: string, track: string) {
  return `${title} explains the ${track.toLowerCase()} layer of MTPX with practical guidance for building inspectable, tool-using agents.`;
}

function chapterCode(slug: string, title: string) {
  if (slug === "installation") {
    return `pip install mtpx
pip install "mtpx[groq,dotenv]"
mtp doctor --provider groq`;
  }
  if (slug.includes("provider")) {
    return `from mtp import Agent
from mtp.providers import Groq

agent = Agent.MTPAgent(
    provider=Groq(model="llama-3.3-70b-versatile"),
    tools=tools,
)`;
  }
  if (slug.includes("event") || slug.includes("obs")) {
    return `for event in agent.run_events("Inspect the repo", max_rounds=5):
    if event["type"] in {"tool_started", "tool_finished", "run_completed"}:
        print(event)`;
  }
  if (slug.includes("session") || slug.includes("storage") || slug.includes("persistence")) {
    return `from mtp import JsonSessionStore

store = JsonSessionStore(db_path="tmp/mtp_json_db")
agent = Agent.MTPAgent(provider=provider, tools=tools, session_store=store)
agent.run("Remember the project name.", session_id="demo", user_id="u1")`;
  }
  if (slug.includes("approval") || slug.includes("risk") || slug.includes("safety") || slug.includes("sandbox")) {
    return `agent = Agent.MTPAgent(
    provider=provider,
    tools=tools,
    strict_dependency_mode=True,
    instructions="Ask for approval before risky tool calls.",
)`;
  }
  if (slug.includes("tool")) {
    return `@Agent.mtp_tool(description="Add two integers.")
def add(a: int, b: int) -> int:
    return a + b

registry.register_toolkit_loader("custom", Agent.toolkit_from_functions("custom", add))`;
  }
  return `from mtp import Agent
from mtp.providers import Groq

agent = Agent.MTPAgent(provider=Groq(), tools=tools)
print(agent.run("${title}: explain the next runtime step.", max_rounds=4))`;
}

export const docChapters: DocChapter[] = rawDocChapters.map(([slug, title, group, track], index) => ({
  slug,
  title,
  group,
  track,
  order: String(index + 1).padStart(3, "0"),
  summary: chapterSummary(title, group, track),
  useCase: `Use this when you need to understand how ${title.toLowerCase()} affects a real MTPX agent before you wire it into an application.`,
  explanation: `${title} belongs to the ${group.toLowerCase()} track. The page breaks the idea into responsibilities, implementation rules, failure modes, and the signals you should expose in a product UI.`,
  bullets: [
    `What ${title.toLowerCase()} owns in the runtime.`,
    `How it connects to planning, tool execution, events, providers, or storage.`,
    "What to log, test, and expose to users when this layer is active.",
    "Common mistakes that make agent systems hard to inspect."
  ],
  code: chapterCode(slug, title),
  palette: palettes[index % palettes.length],
  selected: index < 8
}));

export function getDocChapter(slug: string) {
  return docChapters.find((chapter) => chapter.slug === slug) ?? docChapters[0];
}

export function getNextDocChapter(slug: string) {
  const index = docChapters.findIndex((chapter) => chapter.slug === slug);
  return docChapters[(index + 1) % docChapters.length];
}

export const docStats = [
  { label: "Package", value: "mtpx" },
  { label: "Python", value: "3.10+" },
  { label: "CLI", value: "mtp" },
  { label: "License", value: "MIT" },
  { label: "Status", value: "alpha" }
];

export const docFlow = [
  "messages enter the agent",
  "provider returns text or tool plan",
  "runtime validates batches and refs",
  "tools execute with policy checks",
  "results return to the provider",
  "final text, events, and session data persist"
];

export const providerNames = [
  "OpenAI",
  "Groq",
  "Anthropic",
  "Gemini",
  "OpenRouter",
  "Mistral",
  "Cohere",
  "Cerebras",
  "DeepSeek",
  "SambaNova",
  "Together AI",
  "Fireworks AI",
  "Xiaomi MiMo",
  "Ollama",
  "LM Studio",
  "Mock planner"
];

export const toolkitNames = [
  "calculator.add",
  "calculator.divide",
  "file.list_files",
  "file.search_in_files",
  "python.run_code",
  "shell.run_command",
  "website.read_url",
  "wikipedia.search_wikipedia",
  "newspaper.get_article_text",
  "crawl4ai.web_crawler"
];

export const docApiRows = [
  { name: "Agent.MTPAgent", kind: "runtime", detail: "High-level orchestration wrapper for provider calls, tool plans, sessions, streaming, structured output, and continuation." },
  { name: "Agent.ToolRegistry", kind: "tools", detail: "Registers direct ToolSpec handlers or lazy toolkit loaders under stable namespaces." },
  { name: "Agent.mtp_tool", kind: "decorator", detail: "Converts typed Python functions into model-callable tools with descriptions, risk hints, and cache metadata." },
  { name: "run_events", kind: "stream", detail: "Returns provider-agnostic lifecycle events for frontend logs, terminal output, and observability surfaces." },
  { name: "JsonSessionStore", kind: "memory", detail: "Persists messages and run records locally by session_id and user_id." },
  { name: "MCPJsonRpcServer", kind: "bridge", detail: "Adapts the same tool registry to MCP-compatible JSON-RPC clients." }
];

export const docRecipes = [
  "Start with one provider and one local toolkit, then add session storage only after the first run loop is inspectable.",
  "Keep custom tool names boring and explicit. Models perform better with calc.add than with clever branded verbs.",
  "Use events for UI state instead of parsing final text. Tool started, tool finished, and run paused are product states.",
  "Treat provider swaps as deployment decisions. Capabilities, streaming, media, and structured output are not identical.",
  "Keep destructive tools behind approval policy, even in prototypes. Fast demos should still teach the right trust model.",
  "Write one live provider smoke test per adapter and many deterministic runtime tests around schemas, refs, and policies."
];

export const docReleaseChecklist = [
  "Run fast tests and compileall before publishing.",
  "Run integration tests for transports, MCP adapters, and socket behavior when those surfaces changed.",
  "Run opt-in live provider checks only with explicit credentials and flags.",
  "Verify README, website docs, and CLI help describe the same install extras and commands.",
  "Check reduced-motion behavior, keyboard focus, and form labels on the website."
];

export const docSections: DocSection[] = [
  {
    id: "overview",
    eyebrow: "00 / identity",
    title: "What MTPX is",
    summary:
      "MTPX is a Python SDK and CLI for building agents that use tools through explicit contracts instead of hidden prompt glue.",
    bullets: [
      "It provides a small runtime for model-tool-model loops, dependency-aware tool batches, provider adapters, local toolkits, streaming events, sessions, and MCP-compatible transports.",
      "The core idea is simple: register tools, choose a provider, run the agent, and keep every tool call visible enough to debug.",
      "MCP support is an interoperability surface around the runtime; it does not replace the core MTP agent loop."
    ]
  },
  {
    id: "install",
    eyebrow: "01 / install",
    title: "Install the SDK",
    summary:
      "Install the base package first, then add only the provider, toolkit, UI, or storage extras your application actually needs.",
    bullets: [
      "MTPX does not load .env files automatically. Install python-dotenv and call Agent.load_dotenv_if_available(), or export provider keys in your shell.",
      "Use provider extras such as mtpx[groq], mtpx[openai], mtpx[anthropic], mtpx[ollama], or mtpx[lmstudio] to avoid memorizing SDK packages.",
      "Use mtpx[toolkits-web] for optional web research toolkits and mtpx[stores-db] for PostgreSQL/MySQL session stores."
    ],
    code: {
      label: "terminal",
      language: "bash",
      value: `pip install mtpx
pip install "mtpx[groq,dotenv]"
pip install "mtpx[openai,anthropic,dotenv]"
pip install "mtpx[ollama,lmstudio]"
pip install "mtpx[toolkits-web]"
pip install "mtpx[stores-db]"`
    }
  },
  {
    id: "quickstart",
    eyebrow: "02 / first agent",
    title: "Create an agent",
    summary:
      "A minimal agent needs a provider, a ToolRegistry, optional toolkit loaders, and instructions that tell the model when tools should be used.",
    bullets: [
      "Toolkits can be lazy-loaded, so tools are discoverable before their heavy handlers are needed.",
      "strict_dependency_mode=True rejects same-toolkit multi-call batches that guess intermediate values instead of using refs or depends_on.",
      "Use max_rounds to control normal multi-round chaining. Autoresearch mode has different termination behavior."
    ],
    code: {
      label: "app.py",
      language: "python",
      value: `from mtp import Agent
from mtp.providers import Groq
from mtp.toolkits import CalculatorToolkit, FileToolkit

Agent.load_dotenv_if_available()

tools = Agent.ToolRegistry()
tools.register_toolkit_loader("calculator", CalculatorToolkit())
tools.register_toolkit_loader("file", FileToolkit(base_dir="."))

agent = Agent.MTPAgent(
    provider=Groq(model="llama-3.3-70b-versatile"),
    tools=tools,
    instructions="Use tools when they improve correctness. Keep answers concise.",
    strict_dependency_mode=True,
)

print(agent.run("What is 25 * 4 + 10? Then list the project files.", max_rounds=4))`
    }
  },
  {
    id: "runtime",
    eyebrow: "03 / runtime",
    title: "Understand the loop",
    summary:
      "The runtime owns validation, policy, caching, references, execution plans, and the handoff between model planning and real tool results.",
    bullets: [
      "Agent.run sends messages and tool schemas to the provider.",
      "The provider returns direct text or an execution plan with sequential or parallel batches.",
      "The runtime validates duplicate IDs, missing dependencies, cyclic refs, risk policy, and cache behavior before calling handlers.",
      "Tool results are added back to the conversation until the provider returns final text."
    ]
  },
  {
    id: "api",
    eyebrow: "04 / api",
    title: "Agent API surface",
    summary:
      "The high-level MTPAgent wrapper mirrors the lower-level Agent features while keeping the ergonomic run, stream, event, and continuation methods in one place.",
    bullets: [
      "Core methods include run, arun, run_output, arun_output, run_stream, run_events, arun_events, print_response, cancel_run, continue_run, and acontinue_run.",
      "Constructor options cover debug_mode, strict_dependency_mode, custom instructions, stream chunking, media capability checks, session_store, autoresearch, and orchestration members.",
      "Structured input and output schemas are supported by run_loop, run_output, arun_output, and stream/event wrappers.",
      "Provider capability enforcement fails fast for unsupported modalities or native streaming unless fallback is allowed."
    ]
  },
  {
    id: "providers",
    eyebrow: "05 / providers",
    title: "Swap model providers",
    summary:
      "Providers are explicit adapters. You choose the backend at construction time instead of letting the core agent default to one model vendor.",
    bullets: [
      "Aliases such as Groq, OpenAI, Anthropic, Gemini, Ollama, and LMStudio are available when the matching optional SDK is installed.",
      "Each adapter declares capabilities for tool calling, parallel calls, input modalities, streaming, usage metadata, reasoning metadata, structured output, and async support.",
      "Local providers such as Ollama and LM Studio require local services and models, but no cloud API key."
    ],
    code: {
      label: "provider swap",
      language: "python",
      value: `from mtp.providers import OpenAI, Anthropic, Ollama, LMStudio

cloud = OpenAI(model="gpt-4o")
claude = Anthropic(model="claude-3-5-sonnet-latest")
local_ollama = Ollama(model="qwen3:1.7b", host="http://localhost:11434")
local_lmstudio = LMStudio(model="qwen3-4b-thinking-2507", base_url="http://127.0.0.1:1234/v1")

agent = Agent.MTPAgent(provider=local_ollama, tools=tools)`
    }
  },
  {
    id: "toolkits",
    eyebrow: "06 / tools",
    title: "Use built-in toolkits",
    summary:
      "MTPX includes local no-key toolkits for practical code and file workflows, plus optional web research loaders that install only when needed.",
    bullets: [
      "Calculator, file, Python, and shell toolkits are available for local workflows.",
      "File paths are scoped to base_dir. Python runs isolated subprocesses. Shell runs bare allowlisted commands in base_dir.",
      "WebsiteToolkit blocks private-network targets by default to reduce SSRF risk when models can choose URLs.",
      "Default risk policy allows read-only and write tools, while destructive tools ask for approval."
    ],
    code: {
      label: "toolkit registry",
      language: "python",
      value: `from mtp import Agent
from mtp.toolkits import CalculatorToolkit, FileToolkit, PythonToolkit, ShellToolkit

registry = Agent.ToolRegistry()
registry.register_toolkit_loader("calculator", CalculatorToolkit())
registry.register_toolkit_loader("file", FileToolkit(base_dir="."))
registry.register_toolkit_loader("python", PythonToolkit(base_dir="."))
registry.register_toolkit_loader("shell", ShellToolkit(base_dir=".", allowed_commands=["echo", "dir"]))`
    }
  },
  {
    id: "custom-tools",
    eyebrow: "07 / extension",
    title: "Create custom tools",
    summary:
      "Any typed Python function can become a model-callable tool with metadata, risk level, caching hints, and inferred JSON schema.",
    bullets: [
      "Use Agent.mtp_tool to attach descriptions and risk metadata.",
      "Use toolkit_from_functions to group functions into a namespace such as custom.add.",
      "Keep parameter names stable and descriptions precise because the model reads them as the tool contract."
    ],
    code: {
      label: "custom tool",
      language: "python",
      value: `from mtp import Agent

@Agent.mtp_tool(
    description="Add two integers.",
    risk_level=Agent.ToolRiskLevel.READ_ONLY,
    cache_ttl_seconds=60,
)
def add(a: int, b: int) -> int:
    return a + b

registry = Agent.ToolRegistry()
registry.register_toolkit_loader("custom", Agent.toolkit_from_functions("custom", add))`
    }
  },
  {
    id: "sessions",
    eyebrow: "08 / memory",
    title: "Persist sessions",
    summary:
      "Session storage is opt-in, provider-agnostic, and works across process restarts when a session_id is supplied at runtime.",
    bullets: [
      "Built-in stores include JsonSessionStore, PostgresSessionStore, and MySQLSessionStore.",
      "Stored records include session_id, user_id, metadata, messages, runs, created_at, and updated_at.",
      "If a stored session has a user_id, later reads must provide the same user_id to avoid accidental cross-user reads.",
      "The TUI stores sessions centrally under the user home directory so chat history can survive project deletion."
    ],
    code: {
      label: "json sessions",
      language: "python",
      value: `from mtp import Agent, JsonSessionStore
from mtp.providers import OpenAI

store = JsonSessionStore(db_path="tmp/mtp_json_db")
agent = Agent.MTPAgent(provider=OpenAI(model="gpt-4o"), tools=tools, session_store=store)

agent.run("Remember: project codename is Atlas.", session_id="chat-1", user_id="u1")
agent.run("What is the project codename?", session_id="chat-1", user_id="u1")`
    }
  },
  {
    id: "streaming",
    eyebrow: "09 / events",
    title: "Stream text and events",
    summary:
      "The event stream gives frontend and terminal UIs one provider-agnostic contract for lifecycle, plans, tool activity, text chunks, metrics, retries, pauses, failures, and completion.",
    bullets: [
      "Common events include run_started, round_started, llm_response, plan_received, batch_started, tool_started, tool_finished, text_chunk, run_completed, run_failed, run_paused, and run_terminated.",
      "print_response(..., stream_events=True) defaults to readable terminal logs; event_format='json' prints raw JSON lines.",
      "debug_mode=True expands the trace with plans, tool-call messages, payloads, XML context sections, and metrics blocks."
    ],
    code: {
      label: "events",
      language: "python",
      value: `agent.print_response(
    "Inspect this project and summarize the CLI entry points.",
    max_rounds=6,
    stream=True,
    stream_events=True,
)

for event in agent.run_events("Search the project files.", max_rounds=5):
    if event["type"] == "tool_started":
        print(event["tool_name"], event["arguments"])`
    }
  },
  {
    id: "cli",
    eyebrow: "10 / terminal",
    title: "Use the CLI and TUI",
    summary:
      "The mtp command can scaffold projects, run them, validate environments, list providers, manage codebase memory, and launch the interactive terminal UI.",
    bullets: [
      "mtp new creates templates such as minimal, mcp-http, and session-json.",
      "mtp doctor checks Python version, dotenv availability, provider SDK imports, and provider API key variables.",
      "mtp tui supports cloud and local providers, sessions, file attachments with @path, context and token metrics, provider switching, model management, and optional autoresearch."
    ],
    code: {
      label: "cli",
      language: "bash",
      value: `mtp --help
mtp providers list
mtp doctor --provider groq --provider openai
mtp new my_agent --template minimal
cd my_agent
mtp run
mtp tui --backend groq`
    }
  },
  {
    id: "transports",
    eyebrow: "11 / wire",
    title: "Expose transports and MCP",
    summary:
      "MTP ships envelope transports for stdio, HTTP, and optional WebSocket, plus MCP-compatible JSON-RPC adapters over the same tool runtime.",
    bullets: [
      "MessageEnvelope carries mtp_version, kind, payload, and metadata.",
      "Transport cancellation uses cancel or cancel_request envelopes with a request_id and a handler-level cancel_checker.",
      "MCP coverage includes initialize, ping, tools/list, tools/call, resources/list, resources/read, prompts/list, prompts/get, progress, cancellation, HTTP replay, and SSE streams.",
      "MCP auth is fail-closed: require_auth=True must be paired with auth_token, auth_validator, or auth_provider."
    ],
    code: {
      label: "mcp http",
      language: "python",
      value: `from mtp import MCPHTTPTransportServer, MCPJsonRpcServer, ToolRegistry, ToolSpec

tools = ToolRegistry()
tools.register_tool(ToolSpec(name="calc.add", description="Add"), lambda a, b: a + b)

server = MCPJsonRpcServer(tools=tools)
transport = MCPHTTPTransportServer("127.0.0.1", 8081, server)
transport.start()`
    }
  },
  {
    id: "architecture",
    eyebrow: "12 / internals",
    title: "Know the module map",
    summary:
      "The project is layered so provider parsing, runtime execution, tool definitions, persistence, transports, and MCP adaptation stay in separate ownership boundaries.",
    bullets: [
      "mtp.protocol defines tool metadata, calls, results, execution plans, risk hints, cache TTL, and dependencies.",
      "mtp.schema validates envelopes and plans, including duplicate call IDs, missing dependencies, and cyclic dependency graphs.",
      "mtp.runtime is the single source of truth for lazy loading, caching, refs, policy checks, and execution.",
      "mtp.agent owns orchestration loops, streaming, structured validation, continuation, and delegation modes.",
      "mtp.providers adapts model-native responses into AgentAction without executing tools."
    ]
  },
  {
    id: "testing",
    eyebrow: "13 / confidence",
    title: "Run the checks",
    summary:
      "Tests are separated into fast, integration, and live tiers so local development can stay deterministic while provider checks remain opt-in.",
    bullets: [
      "Fast tests are deterministic and local-only.",
      "Integration tests cover transport, socket, and conformance behavior.",
      "Live provider tests require credentials and explicit environment flags.",
      "CI runs fast tests across Linux, Windows, and macOS, plus representative integration tests on Linux and Windows."
    ],
    code: {
      label: "pytest",
      language: "bash",
      value: `python -m pytest -q -m "not integration and not live"
python -m pytest -q -m "integration and not live"
python -m pytest -q -m "not live"
python -m compileall -q src tests`
    }
  },
  {
    id: "configuration",
    eyebrow: "14 / config",
    title: "Configure deliberately",
    summary:
      "Configuration should be explicit enough that a user can tell which model, keys, stores, and tool policies are active before the first tool call executes.",
    bullets: [
      "Prefer environment variables for provider credentials and project-local config for non-secret defaults.",
      "Use dotenv only as a development convenience, never as an invisible runtime dependency.",
      "Pass base_dir, allowlists, session_store, model names, and provider URLs at construction boundaries so tests can override them cleanly.",
      "Keep debug_mode available in development because readable traces are the fastest way to understand provider-tool behavior."
    ],
    code: {
      label: "env",
      language: "bash",
      value: `GROQ_API_KEY=...
OPENAI_API_KEY=...
MTP_SESSION_DB=tmp/mtp_json_db
MTP_DEBUG=1`
    }
  },
  {
    id: "frontend",
    eyebrow: "15 / ui",
    title: "Wire a frontend",
    summary:
      "A frontend should subscribe to events, render tool activity as state, and avoid pretending an agent is idle while real work is happening.",
    bullets: [
      "Map run_started and round_started to a pending state.",
      "Map tool_started and tool_finished to visible task rows with timestamps and arguments when safe.",
      "Stream text_chunk into the transcript without waiting for final completion.",
      "Surface run_paused and approval requirements as first-class interaction states, not terminal-only messages."
    ],
    code: {
      label: "event mapping",
      language: "ts",
      value: `const eventLabels = {
  run_started: "agent started",
  plan_received: "tool plan received",
  tool_started: "tool running",
  tool_finished: "tool returned",
  run_paused: "approval needed",
  run_completed: "done"
};`
    }
  },
  {
    id: "security",
    eyebrow: "16 / trust",
    title: "Ship with boundaries",
    summary:
      "Agent systems need clear risk boundaries because the model can ask for work that touches files, shells, networks, and external services.",
    bullets: [
      "Scope filesystem tools to a base directory and avoid passing broad home-directory access to model-selected paths.",
      "Keep shell commands allowlisted and require approval for write, destructive, network, or credential-adjacent operations.",
      "Block private-network URL targets for website tools unless the deployment explicitly needs them.",
      "Log tool names, arguments, result summaries, policy decisions, and provider metadata for auditability."
    ]
  },
  {
    id: "deployment",
    eyebrow: "17 / release",
    title: "Deploy the runtime",
    summary:
      "Production deployments should separate provider credentials, tool execution environments, session stores, and public UI streams.",
    bullets: [
      "Run the agent API behind server-side credentials; do not expose provider keys to browsers.",
      "Use JSON sessions for local prototypes and database-backed stores for multi-user deployments.",
      "Constrain long-running tools with timeouts, cancellation, and explicit progress events.",
      "Version transport envelopes and MCP adapter behavior so external clients can upgrade predictably."
    ],
    code: {
      label: "server sketch",
      language: "python",
      value: `def handle_user_message(message: str, session_id: str, user_id: str):
    for event in agent.run_events(message, session_id=session_id, user_id=user_id):
        yield encode_sse(event)`
    }
  }
];
