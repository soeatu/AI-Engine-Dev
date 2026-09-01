import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runQualityGate } from "./quality-gate.js";

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
