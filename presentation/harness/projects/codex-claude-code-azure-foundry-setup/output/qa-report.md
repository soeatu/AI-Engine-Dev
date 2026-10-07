# QA report

- PPTX package: valid
- Slides: 36
- Rendered slide images: 36
- Source ledger: present
- Embedded media files: 0
- Asset ledger entries: 1
- Automated result: PASS

## Automated findings

- None

## Warnings

- Slide 1 has no diagram, chart, table, image, connector, or non-rectangular shape. Confirm that text alone is the clearest form.
- Slide 35 has no diagram, chart, table, image, connector, or non-rectangular shape. Confirm that text alone is the clearest form.
- Slide 36 has no diagram, chart, table, image, connector, or non-rectangular shape. Confirm that text alone is the clearest form.

## Manual visual review

Automated checks do not prove visual quality. Inspect every rendered slide at full size and record clipping, overlap, contrast, alignment, chart accuracy, and source-placement findings before delivery.

### Manual visual review result (2026-10-06, revision 6: readability and navigation)

- Render method: LibreOfficeを導入したが、Claudeの実行環境からはMacにインストール済みのフォントを読めず日本語が欠けたため、Keynote Creator StudioでPDFへ書き出し、pdftoppm(110dpi)で全36枚をPNG化（output/screenshots）。PowerPoint for Windowsとはフォント代替や行高が異なる可能性がある。
- Change: 37枚を36枚にした。2枚目に「必要なPartだけ読めばよい」案内（ページ範囲付き）を追加し、抽象的な4ステップ図をPart別のデプロイ・導入・設定・確認の対応表に置き換えた。接続先URLの図に画像生成とComputer Useを統合し、画像APIの構成図（旧19）を削除した。トラブル対処（旧31〜34）を各Partの末尾へ移し、Partの扉にページ範囲と設定する値を追加した。Computer Useの最初の依頼のコード（旧27）を削除し、ループのコードに集約した。
- Review: 全36枚を原寸で確認した。見つけて直したのは、接続先URL図の下段の箱の高さ、Codexのエラー対処で「キー」が行をまたいで切れる問題、画像生成のエラー対処5行の詰まり（401と404を1行に統合して4行に整理）、コードの右レールと長い行の接触、運用カードで「漏えい」「Claude Code」が行をまたぐ問題。修正後に該当ページを原寸で再確認した。
- Data check: 案内と扉のページ範囲は build.ts の PAGES と実際のページを照合し、一致しなければ生成を失敗させる。対応表と接続先URLの図は既存スライドの内容を組み替えたもので、新しい技術的主張は追加していない。
- Warnings above: 表紙と出典一覧（35, 36）は計画どおりtext-only。
- Not verified: PowerPoint for Windows・Google Slidesでの最終表示。

### Manual visual review result (2026-10-01〜02, revisions 4–5: visual brush-up and folder diagram)

- Render method: LibreOffice未導入のため、Keynote Creator StudioでPDF化し、pdftoppm(110dpi)で全37枚をPNG化（output/screenshots）。PowerPoint for Windowsとはフォント代替や行高が異なる可能性がある。
- Change (revision 4): 内容と順序を維持し、文章・表だけのスライドを図解へ置き換えた（アイコン付きフロー、ハブ型構成図、コード＋処理フロー帯、コード横の段階レール、2レーン比較、比較カード、ループ図、レーン図、確認箇所と症状の対応図など）。「4つの値」は環境変数名が長いため表を維持。
- Change (revision 5): 7枚目に「設定とスクリプトの置き場所」のフォルダ構成図を追加（以降の番号は1つずつ繰り下げ）。
- Review: 変更・追加した全スライドを原寸で確認し、チップ内の折り返し、コードとラベルの重なり、カード内のはみ出し、ループ矢印の向き、ツリーのファイル名の折り返しを修正して再確認した。全37枚を縮小一覧でも確認した。
- Warnings above: 表紙・区切り・出典一覧は計画どおりtext-only。

### Earlier review result (2026-09-17, revision 3: computer-use section insertion)

- Render method: LibreOffice未導入のため、Keynote Creator StudioでPDF化し、pdftoppm(110dpi)で全36枚をPNG化。PowerPoint for Windowsとはフォント代替や行高が異なる可能性がある。
- Change: [computer-use] セクション(22–28枚目)をimage-modelの後に挿入。関連更新: 4(前提条件にPython)、5(デプロイ手順にGPT-5.6系、5手順用に行間とnote位置を調整)、29(動作確認にComputer Use)、33(Computer Useのエラー対処を追加)、34(運用上の注意に追加)、35–36(出典を2枚に分割)。tableSlideのnoteは表の下端に合わせて自動配置するよう変更。
- Review: 変更・新規の4, 5, 23–29, 33, 34, 36を原寸で確認し、切れ・重なり・はみ出しなし。22, 35を含む全36枚を縮小一覧で確認し、ページ番号変更による既存スライドの崩れなし。
- Observations: 24の手順2でcomputer_callの行間がほかの行と少し異なる、33の確認列が2行になる行がある(可読性に問題なし)。27のコードは行間19pt(文字16pt)で、パネル下端がフッター直上まで近い。
- Companion file: computer_use_loop.py を python3 -m py_compile で構文確認済み。

### Not verified (revision 3)

- computer_use_loop.py の実行: openai / playwright 未導入かつFoundryのGPT-5.6系デプロイがないため未実行。スライドのコード(26, 27)は同スクリプトの抜粋で、安全チェック処理は省略している。
- GPT-5.6系でのComputer Use: MS Learnのモデル一覧で対応と記載されているが、手順記事(classic)のサンプルはgpt-5.4で、GPT-5.6系の公式実行例はない。
- reasoning.context を current_turn にする設定をComputer Useと組み合わせた場合の動作。

### Carried over from earlier reviews

- 初版(20枚)と画像モデル追加版(27枚)で全スライドを原寸確認し、表紙の折り返し、コードパネルの末尾行切れ(旧APIキー設定行を含む)、表と注記の重なり、変数名の途中改行、出典URLと注記の重なりなどを修正済み。gen-image.ps1 は未実行(pwshなし)。
