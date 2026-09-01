---
name: ingest-slide-templates
description: Import one or more slides from an existing .pptx into presentation/harness/templates as reusable clone-and-fill components. Use when a user supplies a deck and asks to ingest, register, split, or reuse specific slides as templates. Do not use only to build a new deck.
---

# Ingest reusable slide templates

Treat the source slide as the visual source of truth. The harness clones its actual OOXML and extracts stable text field ids; do not redraw the slide from a screenshot.

## Required inputs

Resolve the local source `.pptx` path, slide positions to import or an explicit request to split all slides, and a kebab-case template name or base name.

If a requested position is outside the deck, stop rather than guessing. If a target template folder already exists, do not overwrite it without explicit permission.

## Inspect and ingest

From `presentation/harness/`:

```bash
unzip -l "<source.pptx>"
npm run cli -- ingest --source "<source.pptx>" --template "<name>" --slide <position>
```

Use `--split` instead of `--slide` only when every slide should become a template. For each result, inspect `template.pptx`, `template.yml`, `fields.yml`, `screenshots/slide-01.png`, `ingestion-report.md`, and screenshot warnings.

Run the `describe-slide-template` workflow for every imported template. The import is incomplete while `description.md` is still a TODO stub.

## Validate

```bash
npm run build
npm run cli -- validate --pptx templates/<name>/template.pptx
```

Render and inspect the imported slide when LibreOffice is available. Record unavailable rendering separately from package validation.

Report template name, source slide position, field and font counts, description status, validation result, and warnings. Never claim a source deck's brand or license permits reuse unless that permission was confirmed by the user.
