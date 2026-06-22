"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { DocChapter } from "@/content/docs";
import { Visual } from "@/components/Visual";

export function DocsRows({ chapters, compact = false }: { chapters: DocChapter[]; compact?: boolean }) {
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<DocChapter | null>(null);

  function move(event: React.MouseEvent) {
    if (!preview.current) return;
    preview.current.style.transform = `translate3d(${event.clientX + 28}px, ${event.clientY - 170}px, 0)`;
  }

  return (
    <div className={compact ? "work-list docs-list work-list--compact" : "work-list docs-list"} onMouseMove={move} onMouseLeave={() => setActive(null)}>
      <div className="work-list__head">
        <span>docs</span>
        <span>section</span>
        <span>track</span>
        <span>order</span>
      </div>
      <div className="work-list__rows">
        {chapters.map((chapter) => (
          <Link
            className="work-row docs-row"
            href={`/docs/${chapter.slug}`}
            key={chapter.slug}
            onMouseEnter={() => setActive(chapter)}
            onFocus={() => setActive(chapter)}
          >
            <span>No.{chapter.order}</span>
            <span>{chapter.title}</span>
            <span>{chapter.track}</span>
            <span>{chapter.group}</span>
            <span className="work-row__overlay" aria-hidden="true">
              <span>No.{chapter.order}</span>
              <span>{chapter.title}</span>
              <span>{chapter.track}</span>
              <span>{chapter.group}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className={`floating-preview docs-preview ${active ? "is-active" : ""}`} ref={preview} aria-hidden="true">
        {active && (
          <>
            <Visual title={active.title} colors={active.palette} tall />
            <div className="docs-preview__copy">
              <span>{active.group} / {active.track}</span>
              <p>{active.summary}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
