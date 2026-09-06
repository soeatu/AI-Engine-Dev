# Planning and source ledger

## Understanding gate

Treat `brief.txt` as the source of truth for why the deck exists. Before writing the narrative, slide copy, build script, or PPTX, record:

```text
Deck: <working title>
Mode: new | revision | section-insertion
Audience: <who will read or hear it, including role and relevant knowledge>
Purpose: <why this material is needed>
Use context: <meeting, review, proposal, report, training, or asynchronous reading>
Expected decision or action: <what the audience should decide, approve, understand, or do>
Central takeaway: <the one conclusion the whole deck must support>
Scope: <included topics and explicit boundaries>
Constraints: <time, slide count, template, tone, confidentiality, accessibility>
Deadline: <date or meeting context>
Requested evidence: <required facts, metrics, sources, or examples>
Unresolved: <questions that remain open, or none>
Confirmation: pending | confirmed <date and user statement or decision>
```

Show the user a concise summary of this understanding and obtain confirmation. Start slide authoring only when `Confirmation` is `confirmed`. If an unresolved choice could change the audience, purpose, expected action, central takeaway, or scope, resolve it first. Preserve smaller unknowns as explicit assumptions or unresolved items.

## Communication job

Write one sentence before choosing slides:

> By the end, [audience] should [understand, decide, approve, or do] because [central takeaway].

Choose a narrative arc that serves that job: context to action, question to answer, problem to recommendation, current to future state, chronology, or learning progression. An agenda alone is not a narrative.

Each slide needs one narrative job and one primary claim. Use takeaway titles that state the point a presenter would plausibly say aloud.

## Section map and insertion

Plan the deck as ordered sections before planning individual slides. Give every section a stable kebab-case id and record:

```text
[section-id]
Job: <what this section contributes to the deck>
Slides: <planned slide roles or current slide numbers>
Enters from: <idea established by the preceding section, or opening>
Hands off to: <idea required by the following section, or close>
Status: existing | new | revised
```

For a section insertion, first map the current deck, then define the new section's insertion anchor as `before <section-id>`, `after <section-id>`, or `replace <section-id>` with explicit user approval for replacement. Check whether the new section duplicates, contradicts, or changes assumptions in existing sections. Update only affected transitions and claims. Preserve the existing section order and content outside that impact radius.

Keep section blocks contiguous in `build.ts`; for larger decks, use one deck-local function per section and call those functions in narrative order. After insertion, rebuild and inspect the entire deck because slide numbers, agenda references, transitions, and source notes may have changed.

## Source ledger

Create `source-notes.txt` in the deck project before authoring. Use this compact format:

```text
Deck: <title>
Checked: <YYYY-MM-DD>

[S1]
Type: URL | local-file | user-provided | calculation | no-external-source
Source: <URL or absolute/local project path>
Supports: <claim, chart, image, or slide number>
Status: confirmed | assumption | unresolved
Notes: <scope, date, formula, or limitation>
```

Use `no-external-source` only for content that is genuinely supplied by the user or created as structure without external claims. If the deck uses external claims or images, record each source separately. Never put credentials, personal information, or confidential raw data into the ledger.

## Evidence rules

- Distinguish facts, calculations, assumptions, and unresolved items.
- Prefer primary or authoritative sources for claims.
- Record the data date and formula for calculated metrics.
- Do not present an unresolved item as a confirmed claim.
- Put concise sources in speaker notes when supported; keep the ledger as the full audit trail.
