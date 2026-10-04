# QA report

- PPTX package: valid
- Slides: 64
- Rendered slide images: 64
- Source ledger: present
- Embedded media files: 0
- Asset ledger entries: 1
- Automated result: PASS

## Automated findings

- None

## Warnings

- Slide 1 has no diagram, chart, table, image, connector, or non-rectangular shape. Confirm that text alone is the clearest form.

## Manual visual review

Automated checks do not prove visual quality. Inspect every rendered slide at full size and record clipping, overlap, contrast, alignment, chart accuracy, and source-placement findings before delivery.

### Manual visual review result (2026-10-04, model-separated Agents)

- Render method: LibreOffice未導入のため、前回と同じくKeynote Creator StudioでPDF化し、pdftoppm(110dpi)で全64枚をPNG化（output/screenshots）。PowerPoint／Google Slidesでの表示は未確認。
- Change: 「03 Developmentを詳しく見る」の末尾（35: Skillの系統の直後）に、36: ブレイン/プランナー（Codex Sol／Claude Code Opus）とワーカー（Codex Luna／Claude Code Sonnet）の役割比較、37: Planner→Worker→Planner→Worker→Plannerのレビューループを追加した。以降のページ番号を2つずつ繰り下げた（全64枚）。
- Review: 36・37枚目を原寸で確認し、見出し・カード本文・下部の共通ルール・工程カードに文字切れ、重なり、孤立文字がないことを確認した。30〜63枚目のフッター番号を切り出して一覧で照合し、Slide位置と一致することを確認した（章扉と最終ページは番号なし）。
- Data check: モデル割り当ては development/skills/orchestrated-development/ の SKILL.md、references/codex.md、references/claude-code.md と .claude/agents/ の定義に一致（source-notes S21）。

### Manual visual review result (2026-10-01〜02, visual brush-up and folder diagrams)

- Render method: LibreOffice未導入のため、Keynote Creator StudioでPDF化し、pdftoppm(110dpi)で全62枚をPNG化（output/screenshots）。PowerPoint／Google Slidesでの表示は未確認。
- Change (10-01): 内容と順序を維持し、19枚を既存テンプレートと同じ見出し・カード・フッターの図解スライドに置き換え、Skill索引の前にSkill分類マップを追加した。
- Change (10-02): 4枚目にRepository全体のフォルダ構成図を追加し、文字ツリーだった4枚（13: 新規Projectへのコピー、29: 成果物の場所、32: development/、37: presentation/）を箱と線のフォルダ構成図に置き換えた。以降のページ番号を1つずつ繰り下げた。
- Review: 新規・変更スライドを原寸で確認し、見出しの折り返し、カード内のはみ出し、斜め矢印の向きの反転（水平・垂直の折れ線に変更）、右カードの本文の孤立文字を修正して再確認した。全62枚を縮小一覧でも確認し、ページ番号の連続とフッターに問題なし。
- Data check: Skill分類マップの件数と索引ページ範囲は build.ts の developmentSkills 配列から照合済み。フォルダ構成図はRepositoryの実ディレクトリ（ls -a）と照合済み。

### Earlier review (2026-09-06)

- Scope: `output/screenshots/slide-01.png` through `slide-60.png`
- Result: PASS
- Section 02 review: slides 18–29 were inspected individually at full size. Slide 19 explicitly distinguishes Development for system development and Presentation for document creation. Slides 21–24 and 25–27 are separated into Development and Presentation subsections, and each example carries its environment label.
- Whole-deck review: checked the regenerated sequence, shifted page numbering, section transitions, clipping, overlap, Japanese line breaks, contrast, alignment, spacing, table legibility, and footer consistency.
- Corrections made during review: shortened subsection markers from `02A` and `02B` to `A` and `B`, and shortened the Presentation subsection description to remove an orphaned final character.
- Remaining display check: native Microsoft PowerPoint and Google Slides rendering have not been tested. LibreOffice-rendered images were used for visual review.
