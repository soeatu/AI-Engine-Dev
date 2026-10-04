# QA report

- PPTX package: valid
- Slides: 62
- Rendered slide images: 0
- Source ledger: present
- Embedded media files: 0
- Asset ledger entries: 0
- Automated result: FAIL

## Automated findings

- Expected 62 rendered slide image(s), found 0.

## Warnings

- Slide 1 has no diagram, chart, table, image, connector, or non-rectangular shape. Confirm that text alone is the clearest form.

## Manual visual review

- Result: NOT RUN
- Reason: LibreOffice is not installed in the 2026-10-03 build environment, so no slide images were rendered and the automated gate fails on the missing images. This is an environment gap, not a confirmed layout defect.
- Change in this revision: added slide 35 (guide-comparison, Brain/Planner vs Worker models) and slide 36 (guide-process-flow, Planner/Worker review loop) after slide 34, and shifted later page numbers by two.
- Checks performed instead: `npm run build` and `npm test` (28/28) passed; `validate --pptx` reports a valid package with 62 slides; text lengths on slides 35–36 were compared against the field widths in `templates/guide-comparison/fields.yml` and `templates/guide-process-flow/fields.yml`, and the bottom shared-rule line and one step label were shortened to fit.
- Remaining: render all 62 slides with LibreOffice and inspect slides 35–36 and the renumbered footers at full size before sharing. Native Microsoft PowerPoint and Google Slides rendering have not been tested.
