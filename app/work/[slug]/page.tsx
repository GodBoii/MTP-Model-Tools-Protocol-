import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CaseModules } from "@/components/CaseModules";
import { TextReveal } from "@/components/TextReveal";
import { caseStudies, getNextProject, getProject } from "@/content/projects";

export function generateStaticParams() {
  return caseStudies.map((project) => ({ slug: project.slug }));
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  const nextProject = getNextProject(slug);
  return (
    <main className="page-shell case-page">
      <section className="case-hero">
        <TextReveal text={project.title} as="h1" />
        <div className="case-hero__info">
          <div><span>Type</span><strong>{project.type}</strong></div>
          <div><span>Year</span><strong>{project.year}</strong></div>
          <div><span>Role</span><strong>{project.role}</strong></div>
          <Link href="/work">All work <ArrowUpRight size={18} /></Link>
        </div>
        <div className="case-tags">{project.tech.map((item) => <span key={item}>{item}</span>)}</div>
        <p>{project.description}</p>
      </section>
      <CaseModules project={project} nextProject={nextProject} />
    </main>
  );
}
