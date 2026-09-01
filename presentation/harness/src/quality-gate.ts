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
};

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
  const reportPath = path.join(projectDir, "output", "qa-report.md");

  await access(pptxPath);
  await validatePackage(pptxPath);

  const pkg = await PptxPackage.load(pptxPath);
  const slides = await getSlideEntries(pkg);
  const screenshots = (await readdir(screenshotDir).catch(() => []))
    .filter((name) => /^slide-\d+\.png$/i.test(name))
    .sort();
  const sources = await readFile(sourcesPath, "utf8").catch(() => "");

  const failures: string[] = [];
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
  }

  const report = [
    "# QA report",
    "",
    `- PPTX package: valid`,
    `- Slides: ${slides.length}`,
    `- Rendered slide images: ${screenshots.length}`,
    `- Source ledger: ${sources.trim() ? "present" : "missing"}`,
    `- Automated result: ${failures.length ? "FAIL" : "PASS"}`,
    "",
    "## Automated findings",
    "",
    ...(failures.length ? failures.map((failure) => `- ${failure}`) : ["- None"]),
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
  if (!projectDir) throw new Error("Usage: quality-gate.ts --project <dir> [--pptx output/deck.pptx]");
  await runQualityGate({
    projectDir,
    pptx: args.get("--pptx"),
    screenshots: args.get("--screenshots"),
    sources: args.get("--sources")
  });
}
