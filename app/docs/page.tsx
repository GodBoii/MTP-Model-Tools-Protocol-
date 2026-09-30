import type { Metadata } from "next";
import Link from "next/link";
import { DocsExplorer } from "@/components/DocsExplorer";
import { TextReveal } from "@/components/TextReveal";
import { docsSource } from "@/content/docs";

export const metadata: Metadata = {
  title: "Docs | MTPX",
  description: "MTPX documentation index for planning, DAG execution, runtime, providers, safety, observability, SDK APIs, and examples."
};

export default function DocsIndexPage() {
  return (
    <main className="page-shell" id="main-content">
      <section className="ledger-hero docs-index-hero">
        <span className="release-tag">MTPX {docsSource.version} / Python 3.10+</span>
        <TextReveal text="The working manual." as="h1" />
        <p>
          Build an agent, configure the terminal, or inspect the runtime. Search the guides and API references below.
        </p>
      </section>
      <div className="docs-start-links"><Link href="/docs/quickstart">Create your first agent ↗</Link><Link href="/docs/tui-operating-guide">Set up the terminal ↗</Link><Link href="/docs/release-notes">Read release notes ↗</Link></div>
      <DocsExplorer />
    </main>
  );
}
