import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { resolve, relative, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

// Pass a local MTP checkout. No network or credentials are needed.
const source = resolve(process.argv[2] ?? "../MTP");
const root = resolve(import.meta.dirname, "..");
const repository = "https://github.com/GodBoii/Model-Tool-protocol-";
const version = /\nversion = "([^"]+)"/.exec(await readFile(resolve(source, "pyproject.toml"), "utf8"))?.[1];
if (!version) throw new Error("Cannot read the source package version");
const revision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: source, encoding: "utf8" }).trim();
const files = [];
for (const folder of ["docs", "docs/providers"]) {
  for (const entry of await readdir(resolve(source, folder), { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".md")) files.push(`${folder}/${entry.name}`);
  }
}
const manifest = [];
for (const file of files.sort()) {
  const original = await readFile(resolve(source, file), "utf8");
  const markdown = original
    .replace(/\]\(\/c:\/Users\/prajw\/Downloads\/MTP\/([^)]*)\)/gi, `](${repository}/blob/${revision}/$1)`)
    .replace(/model="llama-3\.3-70b-versatile"/g, 'model="openai/gpt-oss-120b"');
  const target = resolve(root, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, markdown);
  manifest.push({ path: relative(root, target).replaceAll("\\", "/"), sha256: createHash("sha256").update(original).digest("hex") });
}
await writeFile(resolve(root, "content/docs-source.json"), JSON.stringify({ version, revision, repository, files: manifest }, null, 2) + "\n");
console.log(`Synced ${manifest.length} manuals from MTPX ${version}, ${revision.slice(0, 7)}`);
execFileSync(process.env.PYTHON ?? "python", [resolve(root, "scripts/refresh-provider-docs.py"), source], { stdio: "inherit" });
