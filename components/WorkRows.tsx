"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Project } from "@/content/projects";
import { Visual } from "@/components/Visual";

export function WorkRows({ projects, compact = false }: { projects: Project[]; compact?: boolean }) {
  const preview = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, currentX: 0, currentY: 0, raf: 0 });
  const [active, setActive] = useState<Project | null>(null);

  function move(event: React.MouseEvent) {
    pointer.current.x = event.clientX + 28;
    pointer.current.y = event.clientY - 170;
    if (pointer.current.raf) return;
    const follow = () => {
      const state = pointer.current;
      state.currentX += (state.x - state.currentX) * 0.16;
      state.currentY += (state.y - state.currentY) * 0.16;
      if (preview.current) preview.current.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0)`;
      if (Math.abs(state.x - state.currentX) + Math.abs(state.y - state.currentY) > 0.4) state.raf = requestAnimationFrame(follow);
      else state.raf = 0;
    };
    pointer.current.raf = requestAnimationFrame(follow);
  }

  return (
    <div className={compact ? "work-list work-list--compact" : "work-list"} onMouseMove={move} onMouseLeave={() => setActive(null)}>
      <div className="work-list__head">
        <span>projects</span>
        <span>client</span>
        <span>work type</span>
        <span>year</span>
      </div>
      <div className="work-list__rows">
        {projects.map((project, index) => (
          <Link
            className="work-row"
            href={`/work/${project.slug}`}
            key={project.slug}
            onMouseEnter={() => setActive(project)}
            onFocus={() => setActive(project)}
          >
            <span>No.{String(index + 1).padStart(3, "0")}</span>
            <span>{project.title}</span>
            <span>{project.type}</span>
            <span>{project.year}</span>
            <span className="work-row__overlay" aria-hidden="true">
              <span>No.{String(index + 1).padStart(3, "0")}</span>
              <span>{project.title}</span>
              <span>{project.type}</span>
              <span>{project.year}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className={`floating-preview ${active ? "is-active" : ""}`} ref={preview} aria-hidden="true">
        {active && <Visual title={active.title} colors={active.palette} tall />}
      </div>
    </div>
  );
}
