# 資料作成

この領域では、根拠のある構成、再利用可能なPowerPoint部品、決定論的な生成、表示確認を一つの流れとして扱います。完成資料だけでなく、テンプレート、生成コード、出典台帳、検証結果を分けて残します。

## 最初に選ぶ入口

| やりたいこと | 入口 |
|---|---|
| PPTXを新規作成・改訂する | [`build-presentation`](skills/build-presentation/SKILL.md) |
| 既存PPTXのスライドを部品化する | [`ingest-slide-templates`](skills/ingest-slide-templates/SKILL.md) |
| 部品の用途・容量・編集項目を記述する | [`describe-slide-template`](skills/describe-slide-template/SKILL.md) |
| 色・書体・ロゴ・グリッドをブランドへ合わせる | [`customize-presentation-design`](skills/customize-presentation-design/SKILL.md) |
| 実行環境を準備する | [ハーネスREADME](harness/README.md) |
| Codex / Claude CodeへSkillを有効化する | [セットアップ](skills/SETUP.md) |

## 標準フロー

```text
目的・読者・結論・根拠を整理
  ↓
既存テンプレートを選択
  ├─ 適合する → 実スライドをクローンして編集
  └─ 適合しない → 共通Design Systemで新規作図
  ↓
決定論的なbuild.tsからPPTX生成
  ↓
PPTX構造検査 + 全スライド画像化
  ↓
自動品質ゲート + 目視QA
  ↓
PPTX・Build report・QA report・出典台帳を引き渡し
```

テンプレートがあるという理由だけで使用せず、スライドの役割と情報量が合う場合に選びます。社内テンプレートを利用する場合は、利用権限を確認した原本から必要なスライドを取り込んでください。

## フォルダ

- `harness/`: TypeScriptエンジン、CLI、Design System、テンプレートライブラリ、Deck project。
- `skills/`: 資料作成を用途別に実行するAI向け手順。
- `assets/`: ハーネス外の入力素材。
- `presentations/`: 完成版またはレビュー対象の成果物。
- `scripts/`: 領域横断の補助処理。
- `tests/`: 領域横断の検証。

ハーネス固有のテンプレートと生成途中のDeck projectは `harness/` 内に置きます。完成版を共有領域へ移す場合だけ `presentations/` を使用します。

## 設計の参照元

- OpenAIのCodex Presentations Skill: 読者起点の構成、出典、テンプレート忠実性、全スライド表示QA。
- Anthropicの公式PPTX Skill: 作成・編集・読取の入口、PptxGenJS / OOXMLの注意点、構造検査と表示QA。
- [alfonsograziano/pptx-gen](https://github.com/alfonsograziano/pptx-gen): テンプレート取込、clone-and-fill、新規作図、4 Skill分割、決定論的build script。

取り込んだコードと参照Revisionは [Third-Party Notices](skills/THIRD_PARTY_NOTICES.md) に記録しています。
