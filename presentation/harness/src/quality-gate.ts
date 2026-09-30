import { access, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSlideEntries, validatePackage } from "./ooxml.js";
import { PptxPackage } from "./pptx-package.js";

export type QualityGateOptions = {
  projectDir: string;
  pptx?: string;
  screenshots?: string;
  sources?: string;
  assets?: string;
};

export type AssetEntry = {
  id: string;
  fields: Map<string, string>;
};

const DISALLOWED_LICENSE_PATTERNS = [
  /\bNC\b/i,
  /non-?commercial/i,
  /\bND\b/i,
  /no-?deriv/i,
  /editorial/i,
  /unknown/i,
  /不明/,
  /非営利/,
  /改変禁止/
];

const PLACEHOLDER_PATTERNS = [
  /\blorem\b/i,
  /\bipsum\b/i,
  /\bTODO\b/i,
  /\[insert[^\]]*\]/i,
  /click to add (?:title|text)/i
];

export async function runQualityGate(options: QualityGateOptions): Promise<void> {
  const projectDir = path.resolve(options.projectDir);
  const pptxPath = path.resolve(projectDir, options.pptx ?? "output/deck.pptx");
  const screenshotDir = path.resolve(projectDir, options.screenshots ?? "output/screenshots");
  const sourcesPath = path.resolve(projectDir, options.sources ?? "source-notes.txt");
  const assetsPath = path.resolve(projectDir, options.assets ?? "asset-notes.txt");
  const reportPath = path.join(projectDir, "output", "qa-report.md");

  await access(pptxPath);
  await validatePackage(pptxPath);

  const pkg = await PptxPackage.load(pptxPath);
  const slides = await getSlideEntries(pkg);
  const screenshots = (await readdir(screenshotDir).catch(() => []))
    .filter((name) => /^slide-\d+\.png$/i.test(name))
    .sort();
  const sources = await readFile(sourcesPath, "utf8").catch(() => "");
  const assetNotes = await readFile(assetsPath, "utf8").catch(() => "");
  const assetEntries = parseAssetNotes(assetNotes);
  const mediaFiles = pkg.files("ppt/media/").filter((file) => !file.endsWith("/"));

  const failures: string[] = [];
  const warnings: string[] = [];
  if (slides.length === 0) failures.push("The deck contains no slides.");
  if (screenshots.length !== slides.length) {
    failures.push(`Expected ${slides.length} rendered slide image(s), found ${screenshots.length}.`);
  }
  if (!sources.trim()) failures.push("source-notes.txt is missing or empty.");

  for (const [index, entry] of slides.entries()) {
    const xml = await pkg.text(`ppt/slides/slide${entry.slideNumber}.xml`);
    const text = [...xml.matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g)]
      .map((match) => decodeXml(match[1]))
      .join(" ");
    const found = PLACEHOLDER_PATTERNS.find((pattern) => pattern.test(text));
    if (found) failures.push(`Slide ${index + 1} contains unresolved placeholder text matching ${found}.`);
    if (!hasVisualElement(xml)) {
      warnings.push(`Slide ${index + 1} has no diagram, chart, table, image, connector, or non-rectangular shape. Confirm that text alone is the clearest form.`);
    }
  }

  if (mediaFiles.length > 0 && assetEntries.length === 0) {
    failures.push(`The deck embeds ${mediaFiles.length} media file(s), but asset-notes.txt is missing or has no [A<n>] entries.`);
  }
  if (assetEntries.length > 0 && assetEntries.length < mediaFiles.length) {
    warnings.push(`The deck embeds ${mediaFiles.length} media file(s), but asset-notes.txt records ${assetEntries.length} asset(s). Confirm every embedded image is recorded.`);
  }
  failures.push(...checkAssetEntries(assetEntries));

  const report = [
    "# QA report",
    "",
    `- PPTX package: valid`,
    `- Slides: ${slides.length}`,
    `- Rendered slide images: ${screenshots.length}`,
    `- Source ledger: ${sources.trim() ? "present" : "missing"}`,
    `- Embedded media files: ${mediaFiles.length}`,
    `- Asset ledger entries: ${assetEntries.length}`,
    `- Automated result: ${failures.length ? "FAIL" : "PASS"}`,
    "",
    "## Automated findings",
    "",
    ...(failures.length ? failures.map((failure) => `- ${failure}`) : ["- None"]),
    "",
    "## Warnings",
    "",
    ...(warnings.length ? warnings.map((warning) => `- ${warning}`) : ["- None"]),
    "",
    "## Manual visual review",
    "",
    "Automated checks do not prove visual quality. Inspect every rendered slide at full size and record clipping, overlap, contrast, alignment, chart accuracy, and source-placement findings before delivery.",
    ""
  ].join("\n");

  await writeFile(reportPath, report, "utf8");
  if (failures.length) throw new Error(`Quality gate failed. See ${reportPath}`);

  console.log(`Quality gate passed: ${reportPath}`);
}

export function parseAssetNotes(text: string): AssetEntry[] {
  const entries: AssetEntry[] = [];
  let current: AssetEntry | undefined;
  for (const line of text.split(/\r?\n/)) {
    const header = line.match(/^\[(A\d+)\]\s*$/);
    if (header) {
      current = { id: header[1], fields: new Map() };
      entries.push(current);
      continue;
    }
    const field = line.match(/^([A-Za-z][A-Za-z ]*):\s*(.*)$/);
    if (current && field) current.fields.set(field[1].trim().toLowerCase(), field[2].trim());
  }
  return entries;
}

export function checkAssetEntries(entries: AssetEntry[]): string[] {
  const failures: string[] = [];
  for (const entry of entries) {
    const origin = entry.fields.get("origin") ?? "";
    const license = entry.fields.get("license") ?? "";
    const commercial = entry.fields.get("commercial use") ?? "";
    if (!origin) failures.push(`${entry.id} in asset-notes.txt has no Origin.`);
    if (!license) failures.push(`${entry.id} in asset-notes.txt has no License.`);
    if (!/^yes\b/i.test(commercial)) {
      failures.push(`${entry.id} in asset-notes.txt must state "Commercial use: yes"; found "${commercial || "missing"}".`);
    }
    const disallowed = DISALLOWED_LICENSE_PATTERNS.find((pattern) => pattern.test(license));
    if (disallowed) failures.push(`${entry.id} in asset-notes.txt uses a license that is not allowed: "${license}".`);
    if (/^external\b/i.test(origin) && !/^https?:\/\//i.test(entry.fields.get("source") ?? "")) {
      failures.push(`${entry.id} in asset-notes.txt is external but has no Source URL.`);
    }
  }
  return failures;
}

function hasVisualElement(slideXml: string): boolean {
  if (/<p:pic[\s>]|<p:graphicFrame[\s>]|<p:cxnSp[\s>]|<a:custGeom[\s>]/.test(slideXml)) return true;
  return [...slideXml.matchAll(/<a:prstGeom\s+prst="([^"]+)"/g)].some((match) => match[1] !== "rect");
}

function decodeXml(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  const args = new Map<string, string>();
  for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);
  const projectDir = args.get("--project");
  if (!projectDir) throw new Error("Usage: quality-gate.ts --project <dir> [--pptx output/deck.pptx] [--assets asset-notes.txt]");
  await runQualityGate({
    projectDir,
    pptx: args.get("--pptx"),
    screenshots: args.get("--screenshots"),
    sources: args.get("--sources"),
    assets: args.get("--assets")
  });
}
