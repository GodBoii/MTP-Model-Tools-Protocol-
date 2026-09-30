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
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", permissions: ["clipboard-read", "clipboard-write"] });
  const page = await context.newPage();
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  await page.goto(`${base}/docs`);
  const routes = await page.locator(".chapter-result").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  for (const route of routes) {
    const response = await context.request.get(`${base}${route}`);
    assert.equal(response.status(), 200, route);
    const html = await response.text();
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.has(match[1]), `Missing anchor ${route}#${match[1]}`);
    assert(!html.includes("/c:/Users"), `Local-machine link in ${route}`);
    report.routes.push(route);
  }
  assert.equal((await context.request.get(`${base}/docs/no-such-chapter`)).status(), 404);
  report.interactions.push("Unknown documentation slug returns 404");
  await page.getByLabel("Search the manual").fill("codebase");
  assert(await page.locator(".chapter-result").count() > 0);
  await page.getByLabel("Search the manual").fill("no-such-chapter-xyz");
  await page.getByText("No chapters match this search.").waitFor();
  await page.getByRole("button", { name: "Clear filters" }).click();
  assert.equal(await page.locator(".chapter-result").count(), routes.length);
  await page.getByLabel("Section", { exact: true }).selectOption("Providers");
  assert(await page.locator(".chapter-result").count() < routes.length);
  report.interactions.push("Search, empty result, reset, and section filter");
  await page.goto(`${base}/docs/quickstart`);
  await page.getByRole("button", { name: "Copy code" }).first().click();
  await page.getByRole("button", { name: "Copied", exact: true }).waitFor();
  assert((await page.evaluate(() => navigator.clipboard.readText())).includes("pip install mtpx"));
  await page.getByRole("navigation", { name: "On this page" }).getByRole("link", { name: "Watch tool execution" }).click();
  assert.equal(new URL(page.url()).hash, "#watch-tool-execution");
  report.interactions.push("Copy real code and navigate a table-of-contents anchor");
  await page.goto(base);
  const trigger = page.getByRole("button", { name: "Watch the terminal walkthrough" });
  await trigger.click();
  await page.getByRole("dialog").waitFor();
  await page.locator("dialog video").evaluate(async (video) => { video.muted = true; await video.play(); });
  await page.waitForFunction(() => document.querySelector("dialog video").currentTime > .15);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").evaluate((dialog) => dialog.open), false);
  assert(await trigger.evaluate((button) => button === document.activeElement));
  assert(await page.locator("dialog video").evaluate((video) => video.paused));
  report.interactions.push("Modal video playback, Escape close, pause, and focus return");
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
      // Scroll through the page to load the same lazy media a reader sees.
      await page.locator("img").evaluateAll((images) => images.forEach((image) => { image.loading = "eager"; }));
      await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth }));
      assert(dimensions.width <= dimensions.viewport, `${label} overflow at ${width}px`);
      await page.screenshot({ path: resolve(output, `${label}-${name}.png`), fullPage: true });
      report.viewports.push({ label, name, ...dimensions });
    }
  }
  // Normal motion remains usable, including intercepted route navigation.
  const motion = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  motion.on("pageerror", (error) => failures.push(error.message));
  await motion.goto(base);
  await motion.locator(".loader").waitFor({ state: "detached" });
  await motion.getByRole("link", { name: "Start building" }).click();
  await motion.waitForURL("**/docs/quickstart");
  await motion.waitForFunction(() => getComputedStyle(document.querySelector("main")).visibility === "visible");
  report.interactions.push("Normal-motion homepage to quickstart route transition");
  assert.deepEqual(failures, []);
  await writeFile(resolve(output, "report.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ routes: report.routes.length, interactions: report.interactions.length, viewports: report.viewports.length, videos: report.videos, errors: failures }, null, 2));
} finally {
  await browser.close();
}
