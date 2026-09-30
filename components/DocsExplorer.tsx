"use client";

import { useState } from "react";
import Link from "next/link";
import { docChapters } from "@/content/docs";

const groups = ["All", ...new Set(docChapters.map((chapter) => chapter.group))];
export function DocsExplorer() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const filtered = docChapters.filter((chapter) => (group === "All" || chapter.group === group) && `${chapter.title} ${chapter.summary} ${chapter.track}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <section className="docs-explorer" aria-label="Find documentation">
      <div className="docs-controls">
        <div className="docs-field"><label htmlFor="docs-search">Search the manual</label><input id="docs-search" type="search" placeholder="Try sessions, tools, or local inference" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <div className="docs-field"><label htmlFor="docs-section">Section</label><select id="docs-section" value={group} onChange={(event) => setGroup(event.target.value)}>{groups.map((item) => <option key={item}>{item}</option>)}</select></div>
      </div>
      <p className="docs-results" role="status">{filtered.length} of {docChapters.length} chapters</p>
      <div className="chapter-results">
        {filtered.map((chapter) => <Link href={`/docs/${chapter.slug}`} key={chapter.slug} className="chapter-result"><span>{chapter.order} / {chapter.group}</span><h2>{chapter.title}</h2><p>{chapter.summary}</p><span aria-hidden="true" className="chapter-result__arrow">↗</span></Link>)}
      </div>
      {!filtered.length && <div className="docs-empty"><p>No chapters match this search.</p><button onClick={() => { setQuery(""); setGroup("All"); }}>Clear filters</button></div>}
    </section>
  );
}
