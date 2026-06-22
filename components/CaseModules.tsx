import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/content/projects";
import { Visual } from "@/components/Visual";

export function CaseModules({ project, nextProject }: { project: Project & { outcome: string }; nextProject: Project }) {
  return (
    <>
      <section className="case-module case-module--full">
        <Visual title={`${project.title} 01`} colors={project.palette} />
      </section>
      <section className="case-module case-module--two">
        <Visual title="system" colors={project.palette} tall />
        <Visual title="motion" colors={[project.palette[2], project.palette[0], project.palette[1]]} />
      </section>
      <section className="case-module case-module--text">
        <h2>Designed for movement without noise.</h2>
        <p>Metadata, service rows, visual proof, and outcome statements are separated into calm modules. Each one enters through a mask so the page keeps an editorial rhythm rather than becoming a slideshow.</p>
      </section>
      <section className="case-stats">
        {["response", "clarity", "handoff", "launch"].map((item, index) => (
          <div key={item}>
            <span>0{index + 1}</span>
            <strong>{index === 0 ? "2.4x" : index === 1 ? "98%" : index === 2 ? "4 min" : "live"}</strong>
            <p>{item}</p>
          </div>
        ))}
      </section>
      <section className="case-quote">
        <p>{project.outcome}</p>
      </section>
      <section className="case-process">
        {["Discovery", "Prototype", "Motion", "Build", "Ship"].map((step, index) => (
          <div key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step}</h3>
            <p>{step.toLowerCase()} handled as a visible, reviewable product decision.</p>
          </div>
        ))}
      </section>
      <section className="case-cta">
        <span>Contact</span>
        <Link href="/contact">Let&apos;s collaborate <ArrowUpRight /></Link>
      </section>
      <section className="next-project">
        <span>Next Project</span>
        <Link href={`/work/${nextProject.slug}`}>{nextProject.title}</Link>
      </section>
    </>
  );
}
