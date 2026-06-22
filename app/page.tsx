import { Showreel } from "@/components/Showreel";
import { TextReveal } from "@/components/TextReveal";
import { Visual } from "@/components/Visual";
import { DocsRows } from "@/components/DocsRows";
import { docChapters } from "@/content/docs";

export default function Home() {
  const selected = docChapters.filter((chapter) => chapter.selected);
  return (
    <main className="page-shell">
      <section className="home-hero">
        <h1 className="mtp-wordmark" aria-label="mtpx">
          <span className="mtp-letter mtp-letter--m">m</span>
          <span className="mtp-letter mtp-letter--t">t</span>
          <span className="mtp-letter mtp-letter--p">p</span>
          <span className="mtp-letter mtp-letter--x">x</span>
        </h1>
        <div className="home-hero__media">
          <Visual title="multi tool protocol" colors={["#1a1a1a", "#ff3928", "#ebebeb"]} />
          <Showreel />
        </div>
      </section>

      <section className="split-section">
        <TextReveal text="Docs" as="h2" className="section-title" />
        <p>MTPX is a runtime and SDK for inspectable agent systems: planning, DAG execution, tools, sessions, provider abstraction, policy, event streaming, and human approval gates.</p>
      </section>
      <DocsRows chapters={selected} compact />
    </main>
  );
}
