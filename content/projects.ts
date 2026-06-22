export type Project = {
  slug: string;
  title: string;
  client: string;
  type: string;
  year: string;
  category: string;
  awards: string[];
  tone: string;
  palette: [string, string, string];
  selected?: boolean;
};

export const projects: Project[] = [
  { slug: "acquire", title: "Acquire", client: "MTP", type: "Startup marketplace agent", year: "2026", category: "Marketplace", awards: ["Protocol x 1", "CLI x 4", "UX x 2"], tone: "brokerless startup discovery for builders", palette: ["#101010", "#ff3928", "#e7e7e7"], selected: true },
  { slug: "evergreen", title: "Evergreen", client: "MTP", type: "Persistent session memory", year: "2026", category: "Memory", awards: ["Storage x 3", "Docs x 1"], tone: "long-lived context without ceremony", palette: ["#15251d", "#9dc88d", "#eeeeea"], selected: true },
  { slug: "8finance", title: "8Finance", client: "MTP", type: "Multi-provider routing", year: "2025", category: "Providers", awards: ["Routing x 8", "Tests x 6"], tone: "model switching without losing the plot", palette: ["#0e1225", "#ff3928", "#d7dcf2"], selected: true },
  { slug: "gentlerain", title: "Gentlerain.ai", client: "MTP", type: "Streaming agent runtime", year: "2025", category: "Runtime", awards: ["Events x 9", "TUI x 2"], tone: "quiet event streams with visible thinking", palette: ["#18202a", "#88bde6", "#e8ecef"], selected: true },
  { slug: "brightmark", title: "Brightmark", client: "MTP", type: "Tool orchestration UI", year: "2025", category: "Tooling", awards: ["MCP x 5", "Policy x 2"], tone: "permissions, tools, and intent in one place", palette: ["#211b16", "#ff3928", "#f0e6dc"], selected: true },
  { slug: "motion", title: "Motion", client: "MTP", type: "Thinking animation system", year: "2025", category: "Motion", awards: ["TUI x 3"], tone: "the interface breathes while work happens", palette: ["#151515", "#c7c7c7", "#ff3928"] },
  { slug: "tle", title: "TL/E", client: "MTP", type: "Transport layer explorer", year: "2025", category: "Protocol", awards: ["WS x 2"], tone: "stdio, http, websocket, one nervous system", palette: ["#161616", "#ff3928", "#d5d5d5"] },
  { slug: "journey", title: "Journey", client: "MTP", type: "Conversation flow map", year: "2024", category: "Flows", awards: ["Diagrams x 4"], tone: "from prompt spark to tool-backed resolution", palette: ["#121212", "#f7f7f7", "#ff3928"] },
  { slug: "bioage", title: "Bioage", client: "MTP", type: "Provider health console", year: "2024", category: "Ops", awards: ["Checks x 7"], tone: "status signals for model ecosystems", palette: ["#1f2320", "#ff3928", "#dce3db"] },
  { slug: "grid", title: "Grid", client: "MTP", type: "Context board", year: "2024", category: "Workspace", awards: ["UX x 2"], tone: "files, notes, and tools arranged with intent", palette: ["#111111", "#ff3928", "#ebebeb"] },
  { slug: "optikka", title: "Optikka", client: "MTP", type: "Prompt inspection lens", year: "2026", category: "Analysis", awards: ["Eval x 2"], tone: "see where instruction, context, and action meet", palette: ["#161a1d", "#ff3928", "#e5e5e5"] },
  { slug: "up-order", title: "Up Order", client: "MTP", type: "Command palette redesign", year: "2026", category: "Interface", awards: ["Speed x 3"], tone: "fast commands, fewer detours", palette: ["#171717", "#d6d6d6", "#ff3928"] },
  { slug: "mosey", title: "Mosey", client: "MTP", type: "Policy control system", year: "2025", category: "Safety", awards: ["Policy x 5"], tone: "guardrails that still let the product move", palette: ["#201f1b", "#ff3928", "#ded9cc"] },
  { slug: "explicit", title: "Explicit", client: "MTP", type: "Schema-first calls", year: "2025", category: "Schema", awards: ["Types x 8"], tone: "make tool intent inspectable", palette: ["#160d12", "#ff3928", "#eee2e8"] },
  { slug: "idle", title: "Idle", client: "MTP", type: "Local inference standby", year: "2024", category: "Local AI", awards: ["Offline x 2"], tone: "work continues when the network does not", palette: ["#111516", "#93a7a8", "#ff3928"] },
  { slug: "asm", title: "ASM", client: "MTP", type: "Agent state machine", year: "2024", category: "Runtime", awards: ["States x 6"], tone: "predictable loops for unpredictable requests", palette: ["#101010", "#ff3928", "#dadada"] },
  { slug: "origami", title: "Origami", client: "MTP", type: "Scaffold generator", year: "2024", category: "CLI", awards: ["Templates x 3"], tone: "fold a working project from a single idea", palette: ["#181818", "#ff3928", "#f2f2f2"] },
  { slug: "ooki", title: "Ooki", client: "MTP", type: "OpenRouter bridge", year: "2023", category: "Providers", awards: ["APIs x 6"], tone: "one entry point, many model moods", palette: ["#13131a", "#ff3928", "#e0e3ff"] },
  { slug: "biomsense", title: "Biomsense", client: "MTP", type: "Media input pipeline", year: "2023", category: "Multimodal", awards: ["Vision x 2"], tone: "images and text treated as first-class context", palette: ["#101516", "#b8d5ca", "#ff3928"] },
  { slug: "crappy-explanation", title: "Crappy Explanation", client: "MTP", type: "Debug story mode", year: "2023", category: "Debug", awards: ["Logs x 9"], tone: "turn confusing failures into readable trails", palette: ["#17130f", "#ff3928", "#e6d9cc"] },
  { slug: "maslo", title: "Maslo", client: "MTP", type: "Companion agent shell", year: "2022", category: "Agent OS", awards: ["Chat x 4"], tone: "software that can be worked with, not merely used", palette: ["#141414", "#ff3928", "#eeeeee"] },
  { slug: "windmills", title: "Windmills", client: "MTP", type: "Streaming transport demo", year: "2022", category: "Transport", awards: ["HTTP x 2"], tone: "events moving in visible, honest sequence", palette: ["#121416", "#ff3928", "#d9e2ea"] },
  { slug: "altruus", title: "Altruus", client: "MTP", type: "Toolkit marketplace", year: "2022", category: "Tools", awards: ["Plugins x 4"], tone: "extend the agent without bending the core", palette: ["#1a1715", "#ff3928", "#eadfd6"] },
  { slug: "signal", title: "Signal", client: "MTP", type: "Events dashboard", year: "2021", category: "Telemetry", awards: ["Signals x 7"], tone: "every decision leaves a readable pulse", palette: ["#111", "#ff3928", "#ebebeb"] }
];

export const caseStudies = projects.slice(0, 6).map((project, index) => ({
  ...project,
  timeframe: project.slug === "acquire" ? "Since Sept 2019" : `${Number(project.year) - 1} / ${project.year}`,
  role: project.slug === "acquire" ? "Full-cycle product development" : "Strategy, interface, motion, development",
  link: "Visit Site",
  tech: project.slug === "acquire" ? ["React", "MobX", "GSAP", "Firebase", "Lottie"] : ["Next.js", "TypeScript", "GSAP", "MCP", "Local JSON"],
  description:
    project.slug === "acquire"
      ? "Acquire is an innovative startup acquisition marketplace that simplifies the process of connecting startups with potential buyers. For MTP, it becomes an agent-led marketplace format for finding, evaluating, and moving through opportunities without brokers, fees, or hassle."
      : `${project.title} turns a dense MTP capability into a calm, highly legible product experience. The interface favors sharp labels, direct motion, and enough empty space for complex work to feel approachable.`,
  outcome:
    project.slug === "acquire"
      ? "The outcome is a unified marketplace that offers a seamless business experience without intermediaries or complex procedures. Anonymous matching, clear metadata, and fast product motion make the experience feel direct and unusually human."
      : "The outcome is a product surface that makes technical depth feel precise, navigable, and ready for real work."
}));

export function getProject(slug: string) {
  return caseStudies.find((project) => project.slug === slug) ?? caseStudies[0];
}

export function getNextProject(slug: string) {
  const index = caseStudies.findIndex((project) => project.slug === slug);
  return caseStudies[(index + 1) % caseStudies.length];
}
