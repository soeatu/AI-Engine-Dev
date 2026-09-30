# QA report

- PPTX package: valid
- Slides: 36
- Rendered slide images: 36
- Source ledger: present
- Automated result: PASS

## Automated findings

- None

## Manual visual review

Automated checks do not prove visual quality. Inspect every rendered slide at full size and record clipping, overlap, contrast, alignment, chart accuracy, and source-placement findings before delivery.

### Manual visual review result (2026-09-17, revision 3: computer-use section insertion)

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
