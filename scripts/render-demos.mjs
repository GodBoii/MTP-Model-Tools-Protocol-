import { readFile, writeFile, rename, rm, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { createRequire } from "node:module";

// Set NODE_PATH to a runtime containing Playwright and Sharp, or install them locally.
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const sharp = require("sharp");
const root = resolve(import.meta.dirname, "..");
const media = resolve(root, "public/media");
const transcripts = JSON.parse(await readFile(resolve(media, "cli-transcripts.json"), "utf8"));
const source = JSON.parse(await readFile(resolve(root, "content/docs-source.json"), "utf8"));
const screens = ["tui-home", "tui-help", "tui-providers", "tui-setup", "tui-chats", "tui-status"];
for (const name of screens) {
  // Rich's SVG references a web font. Use an installed monospace font for offline rasterization.
  const svg = (await readFile(resolve(media, `${name}.svg`), "utf8"))
    .replace(/@font-face\s*\{[^}]+\}/g, "")
    .replace(/font-family:[^;]+;/g, "font-family: Consolas, monospace;");
  await sharp(Buffer.from(svg)).resize({ width: 1440 }).png().toFile(resolve(media, `${name}.png`));
  await rm(resolve(media, `${name}.svg`));
}
const browser = await chromium.launch({ channel: "chrome", headless: true });
const styles = `body{margin:0;background:#101317;color:#e6e8ec;font:20px/1.5 Consolas,monospace}header{padding:20px 36px;border-bottom:1px solid #383d46;display:flex;justify-content:space-between;color:#bbc2cd;font:16px/1.4 Arial}main{padding:30px 36px}h1{color:#ff5b49;font:20px/1.4 Arial;margin:0 0 24px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:20px/1.5 Consolas,monospace;margin:0}footer{position:fixed;bottom:0;padding:16px 36px;background:#101317;color:#bbc2cd;font:16px Arial;width:100%;box-sizing:border-box;border-top:1px solid #383d46}img{width:100%;height:100%;object-fit:contain}`;
async function record(name, steps) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, recordVideo: { dir: resolve(media, "raw"), size: { width: 1440, height: 960 } } });
  const page = await context.newPage();
  await page.setContent(`<style>${styles}</style><header><span>mtpx / ${source.version}</span><span>Recorded output replay / offline demo</span></header><main><h1></h1><pre></pre></main><footer>Real local MTP output. No cloud inference or API credentials.</footer>`);
  for (const [index, step] of steps.entries()) {
    await page.locator("h1").evaluate((element, text) => { element.textContent = text; }, `$ ${step.command}`);
    await page.locator("pre").evaluate((element) => { element.textContent = ""; });
    const lines = step.output.split("\n");
    for (let end = 1; end <= lines.length; end++) {
      await page.locator("pre").evaluate((element, text) => { element.textContent = text; }, lines.slice(0, end).join("\n"));
      await page.waitForTimeout(65);
    }
    if (index === steps.length - 1) await page.screenshot({ path: resolve(media, `${name}.png`) });
    await page.waitForTimeout(index === steps.length - 1 ? 3500 : 2500);
  }
  const video = page.video();
  await context.close();
  await rename(await video.path(), resolve(media, `${name}.webm`));
}
try {
  await mkdir(resolve(media, "raw"), { recursive: true });
  for (const [name, steps] of Object.entries(transcripts)) await record(name, steps);
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, recordVideo: { dir: resolve(media, "raw"), size: { width: 1440, height: 960 } } });
  const page = await context.newPage();
  await page.setContent(`<style>${styles}main{padding:0;height:850px}h1{padding:12px 36px;margin:0}</style><header><span>mtpx / ${source.version}</span><span>Recorded Textual UI states / offline</span></header><main><img alt="" /></main><footer></footer>`);
  const labels = ["Start the terminal UI", "Read /help", "Choose a provider with /backend", "Open masked key setup with /apikey groq", "Create another chat with Ctrl+N", "Inspect /status"];
  for (const [index, name] of screens.entries()) {
    const bytes = await readFile(resolve(media, `${name}.png`));
    await page.locator("img").evaluate((element, url) => { element.src = url; }, `data:image/png;base64,${bytes.toString("base64")}`);
    await page.locator("footer").evaluate((element, text) => { element.textContent = text; }, labels[index]);
    await page.waitForTimeout(3000);
  }
  const video = page.video();
  await context.close();
  await rename(await video.path(), resolve(media, "tui.webm"));
  await writeFile(resolve(media, "provenance.json"), JSON.stringify({ version: source.version, revision: source.revision, method: "CLI subprocess output and Textual run_test screen exports, recorded as browser replays", cloudInference: false, scripts: ["scripts/capture-demos.py", "scripts/render-demos.mjs"], videos: ["cli.webm", "agent.webm", "memory.webm", "tui.webm"], screens }, null, 2) + "\n");
} finally {
  await browser.close();
}
