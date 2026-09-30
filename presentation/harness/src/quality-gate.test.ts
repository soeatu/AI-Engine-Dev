import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";
import { checkAssetEntries, parseAssetNotes, runQualityGate } from "./quality-gate.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE = path.join(ROOT, "templates", "title-cover", "template.pptx");

test("quality gate passes with one render and a source ledger", async () => {
  const project = await createProject();
  try {
    await runQualityGate({ projectDir: project });
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("quality gate fails when rendered slide count does not match", async () => {
  const project = await createProject();
  try {
    await rm(path.join(project, "output", "screenshots", "slide-01.png"));
    await assert.rejects(
      runQualityGate({ projectDir: project }),
      /Quality gate failed/
    );
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("quality gate fails when embedded media has no asset ledger", async () => {
  const project = await createProject();
  try {
    await addMedia(project);
    await assert.rejects(
      runQualityGate({ projectDir: project }),
      /Quality gate failed/
    );
    const report = await readFile(path.join(project, "output", "qa-report.md"), "utf8");
    assert.match(report, /asset-notes\.txt is missing/);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("quality gate passes when embedded media is recorded with a commercial-use license", async () => {
  const project = await createProject();
  try {
    await addMedia(project);
    await writeFile(
      path.join(project, "asset-notes.txt"),
      [
        "[A1]",
        "File: inputs/images/team.jpg",
        "Origin: external",
        "Source: https://unsplash.com/photos/example",
        "License: Unsplash License",
        "Commercial use: yes",
        ""
      ].join("\n"),
      "utf8"
    );
    await runQualityGate({ projectDir: project });
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("asset ledger rejects non-commercial, no-derivative, and unknown licenses", () => {
  const entries = parseAssetNotes([
    "[A1]",
    "Origin: external",
    "Source: https://example.com/a",
    "License: CC BY-NC 4.0",
    "Commercial use: no",
    "",
    "[A2]",
    "Origin: external",
    "Source: https://example.com/b",
    "License: CC BY-ND 4.0",
    "Commercial use: yes",
    "",
    "[A3]",
    "Origin: external",
    "License: unknown",
    "Commercial use: yes",
    "",
    "[A4]",
    "Origin: self-made",
    "License: self-made",
    "Commercial use: yes"
  ].join("\n"));
  const failures = checkAssetEntries(entries);
  assert.equal(entries.length, 4);
  assert.ok(failures.some((failure) => failure.startsWith("A1") && /Commercial use: yes/.test(failure)));
  assert.ok(failures.some((failure) => failure.startsWith("A1") && /not allowed/.test(failure)));
  assert.ok(failures.some((failure) => failure.startsWith("A2") && /not allowed/.test(failure)));
  assert.ok(failures.some((failure) => failure.startsWith("A3") && /no Source URL/.test(failure)));
  assert.ok(!failures.some((failure) => failure.startsWith("A4")));
});

async function addMedia(project: string): Promise<void> {
  const deckPath = path.join(project, "output", "deck.pptx");
  const zip = await JSZip.loadAsync(await readFile(deckPath));
  zip.file("ppt/media/fixture-image.png", "fixture");
  await writeFile(deckPath, await zip.generateAsync({ type: "nodebuffer" }));
}

async function createProject(): Promise<string> {
  const project = await mkdtemp(path.join(os.tmpdir(), "presentation-quality-gate-"));
  const output = path.join(project, "output");
  const screenshots = path.join(output, "screenshots");
  await mkdir(screenshots, { recursive: true });
  await cp(TEMPLATE, path.join(output, "deck.pptx"));
  await writeFile(path.join(screenshots, "slide-01.png"), "fixture", "utf8");
  await writeFile(
    path.join(project, "source-notes.txt"),
    "Type: local-file\nSource: test fixture\nStatus: confirmed\n",
    "utf8"
  );
  return project;
}
