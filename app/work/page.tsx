import { TextReveal } from "@/components/TextReveal";
import { WorkRows } from "@/components/WorkRows";
import { projects } from "@/content/projects";

export default function WorkPage() {
  return (
    <main className="page-shell work-page">
      <section className="ledger-hero work-hero">
        <TextReveal text="Selected systems 2021 / current" as="h1" />
      </section>
      <WorkRows projects={projects} />
    </main>
  );
}
