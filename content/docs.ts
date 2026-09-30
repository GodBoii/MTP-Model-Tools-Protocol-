import source from "./docs-source.json";

export const docsSource = source;
export type DocChapter = {
  slug: string; title: string; group: string; track: string; order: string;
  sourcePath: string; summary: string; palette: [string, string, string]; selected: boolean;
};
const palettes: [string, string, string][] = [
  ["#101010", "#ff3928", "#ebebeb"],
  ["#151515", "#d9f851", "#ebebeb"],
  ["#101010", "#32d9ff", "#ebebeb"],
  ["#171717", "#ff3928", "#d8d8d8"],
  ["#111111", "#f7f7f7", "#ff3928"]
];
const rawDocChapters = [
  ["quickstart", "Quickstart", "Start", "Guide", "docs/website/QUICKSTART.md"],
  ["agent-api", "Agent API Reference", "SDK reference", "Class", "docs/AGENT_API.md"],
  ["architecture", "MTP Python Architecture", "Architecture", "Runtime", "docs/ARCHITECTURE.md"],
  ["cli", "CLI", "Start", "Terminal", "docs/CLI.md"],
  ["creating-tools", "Creating Custom Tools and Toolkits", "Core runtime", "Tools", "docs/CREATING_TOOLS.md"],
  ["events", "Event Stream Contract", "Observability", "Events", "docs/EVENTS.md"],
  ["groq-integration", "Groq Integration Guide", "Providers", "Cloud", "docs/GROQ_INTEGRATION.md"],
  ["implementation-notes", "Implementation Notes", "Architecture", "Internals", "docs/IMPLEMENTATION_NOTES.md"],
  ["local-inference", "Local Inference", "Providers", "Local", "docs/LOCAL_INFERENCE.md"],
  ["local-toolkits", "Local Toolkits", "Core runtime", "Tools", "docs/LOCAL_TOOLKITS.md"],
  ["mcp-compatibility-matrix", "MCP Compatibility Matrix", "MCP", "Compatibility", "docs/MCP_COMPATIBILITY_MATRIX.md"],
  ["mcp-interop", "MCP Interoperability Adapter", "MCP", "Interop", "docs/MCP_INTEROP.md"],
  ["project-direction", "Project Direction", "Planning", "Roadmap", "docs/PROJECT_DIRECTION.md"],
  ["protocol-spec", "MTP Protocol Spec", "Core runtime", "Protocol", "docs/PROTOCOL_SPEC.md"],
  ["providers", "Providers", "Providers", "Overview", "docs/PROVIDERS.md"],
  ["provider-guides", "Provider Guides", "Providers", "Overview", "docs/PROVIDER_GUIDES.md"],
  ["publishing", "Publishing MTPX To PyPI", "Release", "Publishing", "docs/PUBLISHING.md"],
  ["roadmap", "MTP Roadmap", "Planning", "Roadmap", "docs/ROADMAP.md"],
  ["storage", "Storage and Session Persistence", "Core runtime", "Storage", "docs/STORAGE.md"],
  ["testing", "Testing", "Release", "Quality", "docs/TESTING.md"],
  ["tool-call-syntax", "MTP Native Tool Call Syntax", "Core runtime", "Syntax", "docs/TOOL_CALL_SYNTAX.md"],
  ["transport", "Transport Layer", "Core runtime", "Wire", "docs/TRANSPORT.md"],
  ["tui-changelog", "TUI Changelog", "Observability", "Terminal", "docs/TUI_CHANGELOG.md"],
  ["tui-local-inference", "TUI CLI Local Inference Guide", "Providers", "Local", "docs/TUI_LOCAL_INFERENCE.md"],
  ["xiaomi-mimo-integration", "Xiaomi MiMo Integration", "Providers", "Cloud", "docs/XIAOMI_MIMO_INTEGRATION.md"],
  ["provider-directory", "Provider Directory", "Providers", "Index", "docs/providers/README.md"],
  ["provider-anthropic", "Anthropic Provider", "Providers", "Cloud", "docs/providers/ANTHROPIC.md"],
  ["provider-cerebras", "Cerebras Provider", "Providers", "Cloud", "docs/providers/CEREBRAS.md"],
  ["provider-cohere", "Cohere Provider", "Providers", "Cloud", "docs/providers/COHERE.md"],
  ["provider-deepseek", "DeepSeek Provider", "Providers", "Cloud", "docs/providers/DEEPSEEK.md"],
  ["provider-fireworks", "Fireworks AI Provider", "Providers", "Cloud", "docs/providers/FIREWORKS.md"],
  ["provider-gemini", "Gemini Provider", "Providers", "Cloud", "docs/providers/GEMINI.md"],
  ["provider-groq", "Groq Provider", "Providers", "Cloud", "docs/providers/GROQ.md"],
  ["provider-lmstudio", "LM Studio Provider", "Providers", "Local", "docs/providers/LMSTUDIO.md"],
  ["provider-mistral", "Mistral Provider", "Providers", "Cloud", "docs/providers/MISTRAL.md"],
  ["provider-mock", "Mock / Simple Planner Provider", "Providers", "Testing", "docs/providers/MOCK.md"],
  ["provider-ollama", "Ollama Provider", "Providers", "Local", "docs/providers/OLLAMA.md"],
  ["provider-openai", "OpenAI Provider", "Providers", "Cloud", "docs/providers/OPENAI.md"],
  ["provider-openrouter", "OpenRouter Provider", "Providers", "Cloud", "docs/providers/OPENROUTER.md"],
  ["provider-sambanova", "SambaNova Provider", "Providers", "Cloud", "docs/providers/SAMBANOVA.md"],
  ["provider-together", "Together AI Provider", "Providers", "Cloud", "docs/providers/TOGETHER.md"],
  ["provider-xiaomi", "Xiaomi MiMo Provider", "Providers", "Cloud", "docs/providers/XIAOMI.md"],
  ["tui-operating-guide", "Terminal UI operating guide", "Start", "Terminal", "docs/TUI_OPERATING_GUIDE.md"],
  ["codebase-memory", "Codebase memory", "Core runtime", "Guide", "docs/website/CODEBASE_MEMORY.md"],
  ["agent-os", "Agent OS", "Start", "Browser", "docs/website/AGENT_OS.md"],
  ["release-notes", "What changed in 0.1.37", "Release", "Changelog", "docs/website/RELEASE_NOTES.md"],
  ["tui-ux-audit", "TUI UX audit", "Release", "Quality", "docs/TUI_UX_AUDIT.md"],
  ["tui-ux-verification", "TUI verification", "Release", "Quality", "docs/TUI_UX_VERIFICATION.md"],
  ["tool-policy", "Tool policy and approvals", "Core runtime", "Policy", "docs/website/TOOL_POLICY.md"],
  ["sdk-recipes", "SDK recipes", "SDK reference", "Examples", "docs/website/SDK_RECIPES.md"]
] as const;

const summaries: Record<string, string> = {
  quickstart: "Install mtpx, run an offline tool demo, then connect a provider and build your first agent.",
  "agent-api": "Construct Agent and MTPAgent, run synchronous or async tasks, validate outputs, and resume paused runs.",
  architecture: "Follow a request through provider planning, schema validation, dependency execution, policy, and persistence.",
  cli: "Scaffold projects, run entry scripts, check your environment, list providers, and index a workspace.",
  "tui-operating-guide": "Set up providers, choose current or custom models, switch chats, queue prompts, and read tool activity.",
  "codebase-memory": "Index a project's files locally and reuse the index for code search and conversation context.",
  "agent-os": "Launch the optional Streamlit interface for browser chat, tools, sessions, and streamed replies.",
  "release-notes": "Read the CLI and terminal changes shipped in 0.1.35, 0.1.36, and 0.1.37.",
  "creating-tools": "Turn typed Python functions into tools with schemas, risk metadata, caching, and lazy toolkit loading.",
  "tool-policy": "Enforce allow, ask, or deny decisions through RiskPolicy and a registry approval handler.",
  "sdk-recipes": "Use async calls, structured output, work limits, cancellation, steering, and paused-run continuation.",
  events: "Consume lifecycle events with run IDs, sequence numbers, tool results, and streamed text.",
  "groq-integration": "Configure the Groq adapter, select a model, and run tool calls and event streams.",
  "implementation-notes": "Understand runtime validation, dependency references, caching, async execution, and approval behavior.",
  "local-inference": "Connect MTP agents to local Ollama or LM Studio servers.",
  "local-toolkits": "Use calculator, file, Python, and shell tools with explicit workspace boundaries.",
  "mcp-compatibility-matrix": "Check which MCP methods and transport behaviors the adapter implements.",
  "mcp-interop": "Expose an MTP registry through MCP JSON-RPC, resources, prompts, and authentication hooks.",
  "project-direction": "Read the project's intended scope and boundaries before adding a new integration.",
  "protocol-spec": "Inspect tool calls, batches, result references, dependencies, and message envelopes.",
  providers: "Compare adapter capabilities for tools, streaming, media, structured output, and async calls.",
  "provider-guides": "Find provider-specific installation, credentials, model configuration, and examples.",
  publishing: "Build and validate a distribution, check metadata, and publish a package release.",
  roadmap: "Review planned work alongside the behavior already available in the runtime.",
  storage: "Persist messages and run records with JSON, PostgreSQL, or MySQL session stores.",
  testing: "Run deterministic tests, transport checks, and opt-in live provider tests.",
  "tool-call-syntax": "Wire tool calls with $ref values and depends_on rather than guessed intermediate results.",
  transport: "Carry MTP envelopes over HTTP, stdio, and WebSocket transports.",
  "tui-changelog": "Read the history of terminal UI behavior and local-provider support.",
  "tui-local-inference": "Configure local endpoints, choose installed models, and use local inference in the TUI.",
  "xiaomi-mimo-integration": "Configure Xiaomi MiMo credentials, tool calls, and supported thinking controls.",
  "provider-directory": "Browse cloud, local, and deterministic provider adapters.",
  "tui-ux-audit": "Read reproduced terminal layout, setup, keyboard, and command-flow issues.",
  "tui-ux-verification": "Inspect the terminal audit's checks, captures, and remaining limits."
};
const selected = new Set(["quickstart", "agent-api", "architecture", "cli", "creating-tools", "events", "groq-integration", "implementation-notes"]);
export const docChapters: DocChapter[] = rawDocChapters.map(([slug, title, group, track, sourcePath], index) => ({
  slug, title, group, track, sourcePath,
  order: String(index + 1).padStart(3, "0"),
  summary: summaries[slug] ?? `Install and configure the ${title.replace(/ Provider$/, "")} adapter, then run the Python example and check its capabilities.`,
  palette: palettes[index % palettes.length],
  selected: selected.has(slug)
}));
export function getDocChapter(slug: string) {
  return docChapters.find((chapter) => chapter.slug === slug);
}
export function getNextDocChapter(slug: string) {
  const index = docChapters.findIndex((chapter) => chapter.slug === slug);
  return docChapters[(index + 1) % docChapters.length];
}
