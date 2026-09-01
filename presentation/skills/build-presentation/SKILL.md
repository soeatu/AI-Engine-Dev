---
name: build-presentation
description: Build or revise an editable PowerPoint deck with the presentation harness under presentation/harness. Use when a user asks to create, regenerate, or visually QA a .pptx from a brief, notes, evidence, or an imported template library. Do not use only to import or document templates, or only to change the shared brand system.
---

# Build an editable presentation

Use the local harness to make a deterministic deck from reusable template slides, custom native PowerPoint objects, or both. Preserve source-slide structure when a suitable template exists; create a custom slide only when no library slide supports the communication job cleanly.

## Locate the harness

Resolve `presentation/harness/` from the workspace root and treat it as `HARNESS_ROOT`. Do not edit `src/` during ordinary deck work. Put deck-specific work under `HARNESS_ROOT/projects/<deck-id>/`:

```text
build.ts
brief.txt
source-notes.txt
inputs/
output/
```

Use a stable kebab-case deck id. Never overwrite another project unless the user asked to revise it.

## Before building

1. Confirm or infer the audience, purpose, central takeaway, requested evidence, output name, and deadline or meeting context. Ask only about a missing choice that materially changes the deck.
2. Read [`references/planning-and-sources.md`](references/planning-and-sources.md). Record facts, assumptions, unresolved items, and source URLs or local paths in `source-notes.txt`. Do not invent numbers, quotations, outcomes, people, or implemented capabilities.
3. Read `HARNESS_ROOT/design.md`.
4. Inspect candidate `templates/*/description.md`, `template.yml`, `fields.yml`, and screenshots. Use a template only when its narrative role and content capacity fit.
5. Define one narrative job and one audience-facing takeaway title per slide. Vary slide silhouettes while keeping the visual system coherent.

## Build

Write a deterministic TypeScript `build.ts`. It must not call a model, network service, random generator, or changing clock during rendering.

```ts
import { Presentation, md } from "../../src/index.js";

const deck = new Presentation({
  title: "Deck title",
  templateLibrary: "templates",
  projectDir: "projects/<deck-id>",
});

deck.addSlideFromTemplate({
  templateName: "title-cover",
  variables: {
    "overline-label": "Proposal",
    "your-presentation-title-goes-here": "A concrete decision",
    "a-short-subtitle-that-sets-up-the-st": md("Evidence and next steps"),
  },
});

await deck.render({
  output: "output/deck.pptx",
  report: "output/build-report.md",
  screenshots: "output/screenshots",
});
```

- Use field ids exactly as listed in `fields.yml` and fill every required field.
- Preserve template geometry and typography. Shorten copy, remap the slide, or split it before shrinking text.
- Without a user template, use at least 50 pt for deck titles, 35 pt for slide titles, 24 pt for subheadings or callout titles, and 16 pt for body text. If content does not fit, reduce copy or change the composition instead of dropping below these defaults.
- Use overrides sparingly. When a slide would require several structural overrides, select another template or create `custom.ts` after reading `HARNESS_ROOT/custom-template-instructions.md`.
- Keep charts, tables, shapes, and diagrams editable. Use native charts for chart types PowerPoint supports.
- Add `[Sources]` notes to a custom slide when the source is slide-specific and supported by the slide API. The complete source ledger remains mandatory even when a cloned template cannot accept new speaker notes safely.
- Do not expose prompts, TODOs, timing scaffolds, or production notes in visible slide content.

Run from `HARNESS_ROOT`:

```bash
npm run build
npm run cli -- build --script projects/<deck-id>/build.ts
```

Fix build errors in the deck project. Change `src/` only when evidence shows a reusable engine defect.

## Quality gates

Read and apply [`references/qa.md`](references/qa.md). Then run:

```bash
npm run cli -- validate --pptx projects/<deck-id>/output/deck.pptx
npm run quality-gate -- --project projects/<deck-id>
```

The automated gate requires one rendered PNG per slide, a non-empty `source-notes.txt`, a valid PPTX package, and no common unresolved placeholder text. It does not replace manual inspection. Inspect every slide image at full size, correct defects, rebuild, and rerun the gate.

## Handoff

Return the final PPTX path, build report, QA report, and screenshot directory. Separate verified content and checks, warnings and unresolved facts, and checks not run because a dependency or human review was unavailable.

Do not claim visual QA passed if screenshots were skipped or not inspected.
