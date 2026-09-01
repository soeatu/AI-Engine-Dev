# Presentation harness

既存PowerPointスライドのクローンと、新規の編集可能な図形・表・グラフを一つのDeckへ組み合わせる実行基盤です。通常の利用者は `src/` を変更せず、`templates/` と `projects/<deck-id>/` を使います。

## 必要環境

- Node.js 20以上。
- npm。
- LibreOffice: PPTXを画像化して目視QAするために必要。生成だけなら任意ですが、本番引き渡しのVisual QAでは必須です。

## 初期確認

```bash
cd presentation/harness
npm ci
npm run build
npm test
npm run self-validate
```

`self-validate` はテンプレート取込、文字差し替え、PPTX生成、構造検査を一時領域で確認します。LibreOfficeがない環境ではスクリーンショット警告が出るため、最終資料では別途レンダリング環境が必要です。

## 主な操作

```bash
# 既存スライドをテンプレートへ取り込む
npm run cli -- ingest --source "<source.pptx>" --template "<name>" --slide <number>

# Deck projectを生成する
npm run cli -- build --script projects/<deck-id>/build.ts

# PPTXの構造を検査する
npm run cli -- validate --pptx projects/<deck-id>/output/deck.pptx

# レンダリング枚数、出典台帳、プレースホルダーを含む品質ゲート
npm run quality-gate -- --project projects/<deck-id>
```

品質ゲートは目視QAを代替しません。成功後も `output/screenshots/` の全画像を1枚ずつ確認し、結果を `output/qa-report.md` に追記します。

## テンプレート契約

`templates/<name>/` の `template.pptx` が見た目の正本、`fields.yml` が編集契約、`description.md` が選択契約です。原本変更時は3つを同時に再確認します。

## Deck project

```text
projects/<deck-id>/
├── build.ts
├── custom.ts             # 必要な場合のみ
├── brief.txt
├── source-notes.txt
├── inputs/
└── output/
    ├── deck.pptx
    ├── build-report.md
    ├── qa-report.md
    └── screenshots/
```

通常の資料作成手順は [build-presentation Skill](../skills/build-presentation/SKILL.md) を参照してください。
