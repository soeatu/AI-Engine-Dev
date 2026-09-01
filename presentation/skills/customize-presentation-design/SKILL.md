---
name: customize-presentation-design
description: Customize the shared presentation harness design system for brand colors, fonts, logos, spacing, and slide grid. Use when a user asks generated custom slides to follow a brand or visual system. Do not imply that changing the shared design recolors already-ingested template slides.
---

# Customize the presentation design system

The shared design controls custom slides and newly added objects. It does not repaint cloned template slides; those retain their source appearance. If cloned slides must match a new brand, ingest source slides already designed for that brand.

## Inputs and boundaries

Confirm the authoritative brand guide or supplied values for primary, accent, secondary, background, and text colors; sans, serif, and mono fonts; logo variants; and any required aspect ratio or grid. Do not derive official colors or logos from memory or an unofficial image.

## Update the paired sources

In `presentation/harness/`, change code values in `src/design.ts` while preserving semantic token names; mirror the values and usage rules in `design.md`; place approved logo assets under `assets/` using the names expected by `LOGO_FILES`; and change `LAYOUT` only when the brand or output format requires a different grid.

Use six-digit hexadecimal values without `#` in code. Treat font availability and licensing separately: a font named in PowerPoint is not automatically installed, embedded, or legally redistributable.

## Verify

```bash
npm run build
npm run self-validate
```

Build and render at least one representative custom-slide deck, inspect title, body, contrast, logo variants, spacing, and overflow, and state whether installed fonts matched the requested families. Update template descriptions only when their actual source slides changed.
