# Template contract

Each reusable template folder contains one source slide and its selection metadata:

```text
template.pptx
template.yml
fields.yml
description.md
screenshots/slide-01.png
ingestion-report.md
```

`template.pptx` is the visual source of truth. `fields.yml` is the editing contract. `description.md` is the routing contract used by deck builders. Keep these three consistent; if the source slide changes, re-ingest and re-review the fields and description.
