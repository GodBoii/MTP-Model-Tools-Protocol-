import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TextReveal } from "@/components/TextReveal";
import { Visual } from "@/components/Visual";
import { docChapters, getDocChapter, getNextDocChapter } from "@/content/docs";

export function generateStaticParams() {
  return docChapters.map((chapter) => ({ slug: chapter.slug }));
}

export default function DocDetailPage({ params }: { params: { slug: string } }) {
  const chapter = getDocChapter(params.slug);
  const next = getNextDocChapter(params.slug);

  return (
    <main className="page-shell doc-detail">
      <section className="case-hero doc-hero">
        <TextReveal text={chapter.title} as="h1" />
        <div className="case-hero__info">
          <Meta label="Section" value={chapter.group} />
          <Meta label="Track" value={chapter.track} />
          <Meta label="Order" value={`No.${chapter.order}`} />
          <Link href="/docs">All docs <ArrowUpRight size={18} /></Link>
        </div>
        <p>{chapter.summary}</p>
        <Visual title={chapter.title} colors={chapter.palette} />
      </section>

      <section className="case-overview doc-overview">
        <h2>use case</h2>
        <p>{chapter.useCase}</p>
        <ul>{chapter.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="doc-explain">
        <div>
          <span>01 / explanation</span>
          <h2>What this page is responsible for</h2>
        </div>
        <p>{chapter.explanation}</p>
      </section>

      <section className="doc-code-block">
        <div>
          <span>02 / implementation</span>
          <h2>Minimal pattern</h2>
        </div>
        <pre>
          <code>{chapter.code}</code>
        </pre>
      </section>

      <section className="case-process doc-process">
        {["Read", "Wire", "Observe", "Harden"].map((step, index) => (
          <div key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step}</h3>
            <p>{processCopy(step, chapter.title)}</p>
          </div>
        ))}
      </section>

      <section className="next-project doc-next">
        <span>Next doc</span>
        <Link href={`/docs/${next.slug}`}>{next.title}</Link>
      </section>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function processCopy(step: string, title: string) {
  if (step === "Read") return `Understand where ${title} sits in the agent loop before adding abstractions.`;
  if (step === "Wire") return "Connect the smallest useful provider, registry, store, or event stream first.";
  if (step === "Observe") return "Expose events, logs, results, and failure states while the runtime is still moving.";
  return "Add policy, tests, retries, and audit traces after the behavior is visible.";
}
