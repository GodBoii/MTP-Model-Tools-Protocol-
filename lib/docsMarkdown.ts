import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import { docChapters, docsSource } from "@/content/docs";

export function readDocMarkdown(sourcePath: string) {
  const docsRoot = path.resolve(process.cwd(), "docs");
  const absolutePath = path.resolve(docsRoot, sourcePath.replace(/^docs[\\/]/, ""));
  const relative = path.relative(docsRoot, absolutePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Invalid documentation path: ${sourcePath}`);
  return fs.readFileSync(absolutePath, "utf8");
}
export function getTableOfContents(markdown: string) {
  const slugger = new GithubSlugger();
  const headings: { id: string; title: string; level: number }[] = [];
  let fenced = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; continue; }
    const match = !fenced && /^(#{1,6})\s+(.+)$/.exec(line);
    if (match) {
      const title = match[2].replace(/`|\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
      const id = slugger.slug(title);
      if (match[1].length === 2) headings.push({ id, title, level: 2 });
    }
  }
  return headings;
}
export function resolveMarkdownHref(href: string, sourcePath: string) {
  if (/^(https?:|mailto:|#|\/)/.test(href)) return href;
  const [target, hash = ""] = href.split("#");
  const normalized = path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), target.replaceAll("\\", "/")));
  const chapter = normalized === "docs/QUICKSTART.md" ? docChapters.find((item) => item.slug === "quickstart") : docChapters.find((item) => item.sourcePath === normalized);
  return chapter ? `/docs/${chapter.slug}${hash ? `#${hash}` : ""}` : `${docsSource.repository}/blob/${docsSource.revision}/${normalized}${hash ? `#${hash}` : ""}`;
}
