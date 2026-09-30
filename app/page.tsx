import { Showreel } from "@/components/Showreel";
import { TextReveal } from "@/components/TextReveal";
import Image from "next/image";
import Link from "next/link";
import { DemoGallery } from "@/components/DemoGallery";
import { DocsRows } from "@/components/DocsRows";
import { docChapters, docsSource } from "@/content/docs";

export default function Home() {
  const selected = docChapters.filter((chapter) => chapter.selected);
  return (
    <main className="page-shell" id="main-content">
      <section className="home-hero">
        <h1 className="mtp-wordmark" aria-label="mtpx">
          <span className="mtp-letter">m</span><span className="mtp-letter">t</span><span className="mtp-letter">p</span><span className="mtp-letter mtp-letter--x">x</span>
        </h1>
        <div className="home-intro">
          <div><span className="release-tag">Model Tool Protocol / {docsSource.version}</span><h2>Build an agent.<br />Follow every tool call.</h2><p>A Python SDK and terminal app for provider planning, dependency-aware tools, live events, and saved sessions.</p><div className="home-actions"><Link href="/docs/quickstart">Start building ↗</Link><Link href="/docs">Browse the manual ↗</Link></div><code className="install-line">pip install mtpx</code></div>
          <figure className="home-capture"><Image src="/media/tui-home.png" alt="MTP terminal UI showing the startup workspace, chat tab, composer, and status bar" width={1440} height={960} sizes="(max-width: 900px) 100vw, 58vw" priority /><figcaption>mtp tui / captured from the current Textual app</figcaption><Showreel /></figure>
        </div>
      </section>
      <DemoGallery />
      <section className="terminal-guide" aria-labelledby="terminal-title"><div className="section-heading"><span>02 / terminal workflow</span><h2 id="terminal-title">Set up. Then send.</h2><p>Choose a provider and model before the first request. Each chat keeps its own draft, attachments, history, and running reply.</p><Link href="/docs/tui-operating-guide">Open the operating guide ↗</Link></div><div className="capture-grid"><figure><Image src="/media/tui-setup.png" alt="Groq provider setup with masked credentials and model controls" width={1440} height={960} sizes="(max-width: 900px) 100vw, 45vw" /><figcaption><code>/backend</code> and <code>/apikey</code> open provider setup.</figcaption></figure><figure><Image src="/media/tui-chats.png" alt="Two MTP conversation tabs with an independent draft in the second chat" width={1440} height={960} sizes="(max-width: 900px) 100vw, 45vw" /><figcaption>Ctrl+N creates a chat. F1 through F9 switch chats.</figcaption></figure></div></section>
      <section className="runtime-explainer" aria-labelledby="runtime-title"><div className="section-heading"><span>03 / runtime</span><h2 id="runtime-title">The tool loop, in view.</h2></div><ol className="runtime-flow"><li><span>01</span><h3>Register</h3><p>Typed Python functions become tools with schemas and risk metadata.</p></li><li><span>02</span><h3>Plan</h3><p>The provider returns text or a plan of tool batches and dependencies.</p></li><li><span>03</span><h3>Execute</h3><p>The runtime validates arguments, resolves references, checks policy, and calls handlers.</p></li><li><span>04</span><h3>Observe</h3><p>Stream tool events, return results to the provider, and persist the session.</p></li></ol><Link href="/docs/architecture">Read the architecture ↗</Link></section>
      <section className="split-section">
        <TextReveal text="Keep building." as="h2" className="section-title" />
        <p>Start with a working example, then add custom tools, persistence, and provider-specific behavior. {docChapters.length} chapters cover the current SDK and CLI.</p>
      </section>
      <DocsRows chapters={selected} compact />
      <div className="docs-end-link"><Link href="/docs">All documentation ↗</Link><Link href="/docs/release-notes">What&apos;s new in {docsSource.version} ↗</Link></div>
    </main>
  );
}
