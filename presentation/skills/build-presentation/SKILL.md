---
name: build-presentation
description: Build or revise an editable PowerPoint deck with the presentation harness under presentation/harness. Use when a user asks to create, add a section to, regenerate, or visually QA a .pptx from a brief, notes, evidence, or an imported template library. Do not use only to import or document templates, or only to change the shared brand system.
---

# Build an editable presentation

Use the local harness to make a deterministic deck from reusable template slides, custom native PowerPoint objects, or both. Preserve source-slide structure when a suitable template exists; create a custom slide only when no library slide supports the communication job cleanly.

## Locate the harness

Resolve `presentation/harness/` from the workspace root and treat it as `HARNESS_ROOT`. Do not edit `src/` during ordinary deck work. Put deck-specific work under `HARNESS_ROOT/projects/<deck-id>/`:

```text
build.ts
brief.txt
source-notes.txt
asset-notes.txt
inputs/
  assets/
output/
```

Use a stable kebab-case deck id. Never overwrite another project unless the user asked to revise it.

## Before building

1. Read [`references/planning-and-sources.md`](references/planning-and-sources.md) and apply its understanding gate. Determine whether this is a new deck or a revision. For a revision, inspect the current `brief.txt`, `build.ts`, source ledger, output deck, and rendered slides before proposing changes.
2. Create or update `brief.txt` with the audience, purpose, use context, expected audience decision or action, central takeaway, scope, constraints, deadline or meeting context, requested evidence, and unresolved items.
3. If the audience, purpose, use context, expected action, central takeaway, or scope is vague, run the clarification loop in `planning-and-sources.md`: ask a few prioritized questions with concrete candidates, restate the updated understanding, and repeat until every core item is clear or an agreed assumption. Then present a concise understanding summary and obtain confirmation before authoring the narrative, slide copy, `build.ts`, or PPTX. Minor details may remain explicitly unresolved.
4. For an inserted section, record its section id, communication job, insertion anchor, transition from the preceding section, transition to the following section, evidence, and expected effect on existing slides. Preserve existing sections unless the user approves broader revision.
5. Record facts, assumptions, unresolved items, and source URLs or local paths in `source-notes.txt`. Do not invent numbers, quotations, outcomes, people, or implemented capabilities.
6. Read [`references/visuals-and-assets.md`](references/visuals-and-assets.md). Plan a diagram or other visual for each content slide, prefer native diagrams and bundled icons, and use external images only under a license that allows commercial use and modification. Record every image and external icon in `asset-notes.txt`.
7. Read `HARNESS_ROOT/design.md`.
8. Inspect candidate `templates/*/description.md`, `template.yml`, `fields.yml`, and screenshots. Use a template only when its narrative role and content capacity fit.
9. Define one communication job per section and one audience-facing takeaway title per slide. Vary slide silhouettes while keeping the visual system coherent.

## Build

Write a deterministic TypeScript `build.ts`. It must not call a model, network service, random generator, or changing clock during rendering.

Keep each section as a contiguous, clearly labeled block in `build.ts`, or move large sections into deck-local functions imported by `build.ts`. The call order is the canonical slide order. To insert a section, place its block or function call at the agreed anchor; do not rewrite unaffected sections only to add new material.

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

The automated gate requires one rendered PNG per slide, a non-empty `source-notes.txt`, a valid PPTX package, no common unresolved placeholder text, and an `asset-notes.txt` entry with a commercial-use license whenever the PPTX embeds media. It also warns about slides without any visual element. It does not replace manual inspection. Inspect every slide image at full size, correct defects, rebuild, and rerun the gate.

## Handoff

Return the final PPTX path, build report, QA report, asset ledger, and screenshot directory. Separate verified content and checks, warnings and unresolved facts, and checks not run because a dependency or human review was unavailable.

Do not claim visual QA passed if screenshots were skipped or not inspected.
