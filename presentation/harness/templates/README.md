# Slide template library

このフォルダには、実際のPowerPointスライドを1枚単位で再利用するclone-and-fillテンプレートを置きます。利用者は、最初に各`description.md`で用途と容量を確認し、内容の役割に合うテンプレートだけを選びます。

各テンプレートでは、`template.pptx`が見た目の正本、`fields.yml`が編集フィールドの契約、`description.md`が選択基準です。原本変更時は3つと`screenshots/slide-01.png`を同時に確認してください。

## 汎用テンプレート

| Template | 用途 |
|---|---|
| [`title-cover`](title-cover/description.md) | 一般的な表紙 |
| [`content-lead-bullets`](content-lead-bullets/description.md) | リード文と要点3件 |

## 説明書・導入ガイド用テンプレート

| Template | 用途 |
|---|---|
| [`guide-cover`](guide-cover/description.md) | 説明書の表紙 |
| [`guide-section-divider`](guide-section-divider/description.md) | 章番号と学習到達点を示す区切り |
| [`guide-folder-map`](guide-folder-map/description.md) | フォルダ階層、責務、入口、境界 |
| [`guide-process-flow`](guide-process-flow/description.md) | 左から右へ進む5段階フロー |
| [`guide-skill-catalog`](guide-skill-catalog/description.md) | 最大4件のSkill分類、利用場面、成果物 |
| [`guide-routing-guide`](guide-routing-guide/description.md) | 依頼内容からフォルダとSkillを選ぶ分岐 |
| [`guide-step-by-step`](guide-step-by-step/description.md) | 4段階の操作手順 |
| [`guide-comparison`](guide-comparison/description.md) | 2領域の比較と共通原則 |
| [`guide-evidence-and-caution`](guide-evidence-and-caution/description.md) | 事実、仮定、未決事項、権限の区別 |
| [`guide-checklist`](guide-checklist/description.md) | 最大6件の完了チェックと次の行動 |

## 選び方

1. スライドの役割を1文で決めます。
2. 上表から候補を選び、リンク先の`When to use`、`When not to use`、容量を確認します。
3. `fields.yml`のIDをそのまま`build.ts`の`variables`へ指定します。
4. PPTXを生成して構造検査と全スライドの表示QAを実施します。

既存テンプレートに合わない図や表を作る場合は、[`../custom-template-instructions.md`](../custom-template-instructions.md)に従い、画像ではなく編集可能なネイティブ図形を優先してください。

## 検証

```bash
cd presentation/harness
npm run build
npm run cli -- validate --pptx templates/<name>/template.pptx
```

構造検査だけでは表示品質を証明しません。各テンプレートの`screenshots/slide-01.png`も原寸で確認します。
