---
name: describe-slide-template
description: Write or repair a presentation template's description.md from its rendered slide and extracted fields. Use when an imported template needs an accurate purpose, layout, capacity, selection guidance, and editable-field inventory. Do not use to change the slide design itself.
---

# Describe a slide template

Resolve `presentation/harness/templates/<name>/`. Use `screenshots/slide-01.png` as the primary visual evidence and `fields.yml` plus `template.yml` as structural evidence. If the screenshot is missing, state that the description is based on fields rather than a render.

Write `description.md` with only evidence-backed guidance:

```markdown
# <Human-readable name>

<One sentence explaining the slide's narrative role.>

## Layout
<Visible structure, hierarchy, and approximate content capacity.>

## When to use
- <Concrete fitting use case>

## When not to use
- <Real mismatch and a better template type, if useful>

## Fields
- `<field-id>`: <what it holds and practical capacity>
```

Describe title placement, columns, repeated elements, charts, images, and emphasis only when visible or confirmed. Give useful capacity estimates such as “two short columns” or “up to four brief points.” List every editable field id exactly. Do not infer intent from the folder name when the slide evidence disagrees.

After writing, confirm there are no TODOs and that every `fields.yml` id appears in the description. Report whether visual evidence was available.
