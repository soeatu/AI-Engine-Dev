# QA report

- PPTX package: valid
- Slides: 43
- Rendered slide images: 43
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

### Manual visual review result (2026-10-07, appendix Skill list)

- Render method: 前回と同じく Keynote Creator Studio でPDF化し、pdftoppm(110dpi)で全43枚をPNG化。
- Change: 利用者の依頼で、付録に開発Skill一覧7枚（34〜40: 統合13件、原文の明示9件・自動9件・Productivity 7件・開発途中8件・Miscと補助6件）を追加した（全43枚）。Skill名と使う場面の2列、本文16pt。系統マップ（33）に一覧のページ範囲を追加し、付録の扉の目次では一覧7枚を1行にまとめた。
- Review: 地図（2）、付録の扉（32）、系統マップ（33）、一覧（34〜40）、資料作成Skill（41）、用語（42）、締め（43）を原寸または拡大一覧で確認し、切れ・重なりなし。開発途中の一覧はSkill名の色が薄く読みにくかったため配色を変更して再確認した。1〜31枚目は内容とページ番号が変わらない。
- Data check: 52件は build.ts で件数を検査。使う場面は development/skills/README.md の各表と照合。

### Manual visual review result (2026-10-06〜07, readability restructure)

- Render method: LibreOfficeを導入したが、Claudeの実行環境からはMacにインストール済みのフォントを読めず日本語が欠けたため、Keynote Creator StudioでPDFへ書き出し、pdftoppm(110dpi)で全36枚をPNG化（output/screenshots）。PowerPoint／Google Slidesでの表示は未確認。
- Change: 64枚を36枚に再構成した。章を「1 全体像 / 2 準備する / 3 依頼する / 4 結果を見る / 5 しくみを知る / 付録」に組み替え、2枚目に章の地図、各章の扉にその章のページ一覧を追加した。全スライドを本文16pt以上・カード見出し24pt・タイトル35ptのカスタムスライドで描き直した。2〜3語の5段フローは、実際の依頼文・AIが進める順番・残るファイル名を示す図に置き換えた。Skill索引15枚と分類マップは、系統マップ1枚と資料作成Skill 1枚に置き換えた。
- Review: 全36枚を原寸で確認した。見つけて直した不具合は、見出しラベルが全ページ「この資料の使い方」になる生成コードの不具合、単語の途中での改行（明示的な改行へ変更）、依頼文・カード本文・用語カードの枠からのはみ出し（行間と余白を調整）、付録の扉と地図での「付録」の重複、「診断だけ」の注記の折り返し。修正後に該当ページを原寸で再確認し、36枚の一覧で章扉の位置とページ番号の連続を確認した。
- Data check: 地図・章扉の目次・ページ参照（p.11〜14、p.16）は build.ts の登録順から自動計算している。Skill件数（統合13・原文37・補助2・資料作成5、原文の内訳は明示9・自動9・Productivity 7・開発途中8・Misc 4）は development/skills/README.md と matt-pocock/ 配下を2026-10-06に確認。モデル割り当ては orchestrated-development/SKILL.md の表と一致。
- Warnings above: 表紙はtext-onlyのまま（表紙のため）。
- Not verified: PowerPoint・Google Slidesでの最終表示。Noto Sans JPがない環境での代替フォント表示。

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
