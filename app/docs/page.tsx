import type { Metadata } from "next";
import { DocsRows } from "@/components/DocsRows";
import { TextReveal } from "@/components/TextReveal";
import { docChapters } from "@/content/docs";

export const metadata: Metadata = {
  title: "Docs | MTPX",
  description: "MTPX documentation index for planning, DAG execution, runtime, providers, safety, observability, SDK APIs, and examples."
};

export default function DocsIndexPage() {
  return (
    <main className="page-shell">
      <section className="ledger-hero docs-index-hero">
        <TextReveal text="Documentation index" as="h1" />
        <p>
          Browse the MTPX manual as a living catalogue. Hover a row for a preview,
          open the chapter for explanations, use cases, implementation notes, and code.
        </p>
      </section>
      <DocsRows chapters={docChapters} />
    </main>
  );
}
