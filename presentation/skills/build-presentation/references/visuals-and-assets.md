# Visuals and assets

Decks in this workspace explain with diagrams first. Text-only slides are the exception and need a reason.

## Visual plan

While planning the section map, give every content slide a `Visual:` line before writing copy:

```text
Slide: <takeaway title>
Visual: <visual type> | text-only (<reason>)
Asset: native | icon | self-made-image | external | user-provided | placeholder
```

Pick the visual from the message the slide must carry:

| Message | Visual |
|---|---|
| Steps, procedure, workflow | Flow with numbered steps and arrows |
| Before and after, options, pros and cons | Side-by-side columns or comparison table |
| Structure, roles, components | Hierarchy, layered stack, or box-and-arrow architecture |
| Cause and effect, dependencies | Relationship diagram with labeled connectors |
| Trend, share, magnitude | Native chart |
| Schedule, milestones | Timeline or roadmap |
| Several parallel points | Icon grid or card layout |
| Real place, product, person, screen | Photo or screenshot with rights confirmed |

Aim for a visual on at least 70% of content slides. Title, agenda, and closing slides may stay typographic. `text-only` is acceptable only when a diagram would add no understanding, such as a verbatim quotation or legal wording.

## Source priority

Use the first option that serves the slide:

1. **Native diagram built by the agent.** Build flows, comparisons, hierarchies, timelines, and charts from native shapes, connectors, text, tables, and charts, following `HARNESS_ROOT/custom-template-instructions.md`. They stay editable and carry no license risk.
2. **Bundled icons.** Use `helpers.addIcon` / `helpers.addVectorIcon` with the Lucide set in `HARNESS_ROOT/assets/icons/` (ISC license, recorded in `assets/icons/LICENSE`).
3. **Self-made illustration.** When a native diagram is not enough, write an original SVG and place it as described in the custom-template instructions. Record it as `self-made`.
4. **External free asset.** Search only sites that publish a license allowing commercial use and modification, and confirm the license on the asset's own page.
5. **User-provided asset.** Use it after the user confirms they hold the rights for this use.

When a real photo or screenshot is needed and none of the above can supply it, use `helpers.addImagePlaceholder` with a specific caption and list it as unresolved in the handoff. Never invent a screenshot or photo of a real product, place, or person.

## Allowed external licenses

An external asset is allowed only when all of these hold:

- Commercial use is permitted.
- Modification (crop, recolor, overlay) is permitted.
- The license is stated on the asset page or the site's license page, and you read it at download time.

| Usually allowed | Condition |
|---|---|
| CC0, Public Domain Mark | None, but record the source anyway |
| Unsplash License, Pexels License, Pixabay Content License | Do not redistribute the file as a standalone asset |
| Open-source icon sets under MIT, ISC, or Apache-2.0 (Lucide, Heroicons, Tabler Icons, Material Symbols) | Keep the license text in the project |
| CC BY 4.0 | Put the required credit on the slide or a credits slide |

Not allowed: CC BY-NC (non-commercial), CC BY-ND (no derivatives), "editorial use only", "personal use only", unknown or missing licenses, images taken from general image search results, third-party website screenshots without permission, and generated images from a service whose terms do not grant commercial use. Ask the user before using CC BY-SA or any license not listed above.

Even under a permissive license, avoid recognizable people, logos, trademarks, and private property unless the user confirms releases or permission, and never imply that a person or brand endorses the content.

Download only with the permission required by the agent environment. Store deck-specific files under `projects/<deck-id>/inputs/assets/` and reusable shared files under `presentation/assets/`.

## Asset ledger

Create `projects/<deck-id>/asset-notes.txt` whenever the deck uses any image or externally sourced icon. Record self-made SVGs and template media too. One block per asset:

```text
[A1]
File: inputs/assets/<file name>
Origin: self-made | bundled | external | user-provided | template
Source: <asset page URL, local path, or "created for this deck">
Author: <creator name or organization>
License: <license name>
License URL: <URL of the license terms>
Commercial use: yes
Attribution: not required | required: <exact credit text and where it is shown>
Modified: no | yes: <crop, recolor, overlay>
Checked: <YYYY-MM-DD>
Used on: <slide numbers>
```

`Commercial use:` must be `yes` for every entry. The quality gate fails when the PPTX embeds media without ledger entries, when any entry lacks `Origin` or `License`, when an external entry lacks a source URL, or when a license looks non-commercial, no-derivative, editorial, or unknown. It warns when slides contain no visual element; review those slides and either add a diagram or keep the `text-only` reason in the visual plan.
