import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = resolve(import.meta.dirname, "..");
const base = process.argv[2] ?? "http://localhost:3000";
const output = resolve(root, "output/verification");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const failures = [];
const report = { base, routes: [], interactions: [], viewports: [], videos: [] };
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  await page.goto(`${base}/docs`);
  await page.locator(".loader").waitFor({ state: "detached" });
  const routes = await page.locator(".docs-row").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  assert.equal(routes.length, 50);
  for (const route of routes) {
    const response = await context.request.get(`${base}${route}`);
    assert.equal(response.status(), 200, route);
    const html = await response.text();
    assert(!html.includes("/c:/Users"), `Local-machine link in ${route}`);
    assert(html.includes("doc-primer") && html.includes("doc-manual"), `Original chapter layout missing in ${route}`);
    report.routes.push(route);
  }
  assert.equal((await context.request.get(`${base}/docs/no-such-chapter`)).status(), 404);
  report.interactions.push("50 updated chapters retain the original primer and manual layout; unknown slugs return 404");
  const first = page.locator(".docs-row").first();
  await first.hover();
  await page.locator(".floating-preview.is-active .visual__canvas").waitFor();
  const transform = await page.locator(".floating-preview").evaluate((preview) => preview.style.transform);
  assert(transform.includes("translate3d"));
  await page.mouse.move(1300, 60);
  assert.equal(await page.locator(".floating-preview.is-active").count(), 0);
  await first.focus();
  await page.locator(".floating-preview.is-active").waitFor();
  report.interactions.push("Original pointer-following hover preview and keyboard-focus preview");
  await first.click();
  await page.waitForURL("**/docs/quickstart");
  await page.waitForFunction(() => getComputedStyle(document.querySelector("main")).visibility === "visible");
  report.interactions.push("Original animated route transition and chapter layout");
  await page.goto(base);
  await page.locator(".loader").waitFor({ state: "detached" });
  const trigger = page.getByRole("button", { name: "play showreel / runtime study" });
  await trigger.click();
  await page.locator(".video-modal").waitFor();
  await page.locator(".video-modal video").evaluate(async (video) => { video.muted = true; await video.play(); });
  await page.waitForFunction(() => document.querySelector(".video-modal video").currentTime > .15);
  await page.keyboard.press("Escape");
  await page.locator(".video-modal").waitFor({ state: "detached" });
  assert(await trigger.evaluate((button) => button === document.activeElement));
  await trigger.click();
  await page.getByRole("button", { name: "Close video" }).click();
  await page.locator(".video-modal").waitFor({ state: "detached" });
  report.interactions.push("Original showreel popup, real video playback, Escape and close button");
  for (const name of ["cli", "agent", "memory", "tui"]) {
    const meta = await page.evaluate(async (name) => {
      const video = document.createElement("video");
      video.src = `/media/${name}.webm`;
      await new Promise((resolve, reject) => { video.onloadedmetadata = resolve; video.onerror = () => reject(new Error(`Cannot decode ${name}`)); });
      return { name, duration: video.duration, width: video.videoWidth, height: video.videoHeight };
    }, name);
    assert(meta.duration > 1 && meta.width > 0);
    assert.equal((await context.request.get(`${base}/media/${name}.vtt`)).status(), 200);
    report.videos.push(meta);
  }
  for (const [name, width, height] of [["desktop", 1440, 1000], ["tablet", 768, 1024], ["mobile", 390, 844]]) {
    await page.setViewportSize({ width, height });
    for (const [label, route] of [["home", "/"], ["docs", "/docs"], ["guide", "/docs/tui-operating-guide"]]) {
      await page.goto(`${base}${route}`);
      await page.locator(".loader").waitFor({ state: "detached" });
      await page.locator("img").evaluateAll((images) => images.forEach((image) => { image.loading = "eager"; }));
      await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth }));
      assert(dimensions.width <= dimensions.viewport, `${label} overflow at ${width}px`);
      await page.screenshot({ path: resolve(output, `${label}-${name}.png`), fullPage: true });
      report.viewports.push({ label, name, ...dimensions });
    }
  }
  assert.deepEqual(failures, []);
  await writeFile(resolve(output, "report.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ routes: report.routes.length, interactions: report.interactions, viewports: report.viewports.length, videos: report.videos, errors: failures }, null, 2));
} finally {
  await browser.close();
}
