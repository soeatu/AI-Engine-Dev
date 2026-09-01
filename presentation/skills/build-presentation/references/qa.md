# Presentation QA

Run content, package, and visual checks. A pass in one category does not imply the others passed.

## Content

- Confirm slide order, requested topics, numbers, names, dates, and calls to action.
- Search for placeholder text, production notes, duplicated claims, and unsupported conclusions.
- Confirm charts and tables match their source data and labels.
- Confirm `source-notes.txt` covers externally sourced non-trivial claims and assets.

## Package

- Run the harness validator and quality gate.
- Treat missing templates, fields, assets, invalid override targets, corrupt relationships, and slide-count mismatches as failures.
- Read the build report. A warning must be resolved or explicitly handed off.

## Visual

Inspect every rendered slide individually at full size, then review the file sequence for deck-level rhythm. Check clipped or overflowing text; unintended overlap; connectors crossing labels; one-line titles wrapping; inconsistent margins, alignment, spacing, footers, or page numbers; low contrast; weak hierarchy; blurry images; incorrect crops; leftover template objects; empty placeholders; and illegible charts or tables.

Fix the source build, regenerate the PPTX and all screenshots, and rerun the automated gate. Do not patch only the rendered image.
