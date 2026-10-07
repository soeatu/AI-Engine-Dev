# AI-Engine-Dev 利用ガイド

職場の同僚向けに、システム開発を扱う`development/`と資料作成を扱う`presentation/`で何ができるか、環境をどう準備するか、最初にどう依頼するか、利用後に何が残るかを説明するPowerPoint資料です。「1 全体像 → 2 準備する → 3 依頼する → 4 結果を見る → 5 しくみを知る → 付録」の順に構成し、2枚目の地図と各章の扉から必要なページへ移れるようにしています。目的・根拠・生成コード・検証結果を同じDeck projectで管理します。

## 主なファイル

- `brief.txt`: 対象読者、目的、範囲、構成、確認状態
- `source-notes.txt`: 確認済み情報、出典、件数の根拠
- `build.ts`: 資料本編43ページの生成コード。スライドの登録順から地図・章扉の目次・ページ参照を自動計算する
- `slides.ts`: 資料本編のスライド部品（本文16pt以上、文字の収まりを生成時に検査する）
- `custom.ts`: `build-templates.ts`が使う再利用Templateの原本
- `build-templates.ts`: この資料用に作成した10種類の再利用Templateを確認するための生成コード
- `output/deck.pptx`: 資料本編。共有用の完成版は`presentation/presentations/ai-engine-dev-workspace-guide/AI-Engine-Dev利用ガイド.pptx`にコピーする
- `output/template-deck.pptx`: Template確認用Deck
- `output/screenshots/`: 資料本編の全ページRender
- `output/build-report.md`: 資料本編のBuild report
- `output/qa-report.md`: 構造検査と目視確認の結果

## 再生成

`presentation/harness/`を作業Directoryとして実行します。

```bash
npx tsx projects/ai-engine-dev-workspace-guide/build.ts
npx tsx projects/ai-engine-dev-workspace-guide/build-templates.ts
```

日本語表示にはNoto Sans JPを使用します。共有先にFontがない場合は代替Fontで表示されるため、最終表示を共有先の環境でも確認してください。

## 検証

```bash
npm run build
npm test
npm run cli -- validate --pptx projects/ai-engine-dev-workspace-guide/output/deck.pptx
npm run quality-gate -- --project projects/ai-engine-dev-workspace-guide
```

構造検査の成功だけでは完了にせず、`output/screenshots/`の全ページを目視し、文字切れ、重なり、余白、順序、対比を確認します。PowerPointやGoogle Slidesでの最終表示は、共有先の環境でも確認してください。

## 正本

- 資料作成ルール: [`../../../AGENTS.md`](../../../AGENTS.md)
- Presentation領域: [`../../../README.md`](../../../README.md)
- Presentation harness: [`../../README.md`](../../README.md)
- Template一覧: [`../../templates/README.md`](../../templates/README.md)
- Development Skill一覧: [`../../../../development/skills/README.md`](../../../../development/skills/README.md)
