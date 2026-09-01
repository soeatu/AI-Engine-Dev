# 資料作成Skills

資料作成の作業を4つの責務へ分けています。新しいDeckを作るときは `build-presentation`、再利用部品を増やすときは残り3つを使います。

| Skill | 用途 | 主な成果物 |
|---|---|---|
| [`build-presentation`](build-presentation/SKILL.md) | 構成、テンプレート選択、新規作図、生成、出典、QA | `projects/<deck-id>/output/deck.pptx`、各Report |
| [`ingest-slide-templates`](ingest-slide-templates/SKILL.md) | 既存PPTXをclone-and-fill部品へ変換 | `templates/<name>/` |
| [`describe-slide-template`](describe-slide-template/SKILL.md) | テンプレートの役割・容量・Fieldを記述 | `description.md` |
| [`customize-presentation-design`](customize-presentation-design/SKILL.md) | 新規作図側の共通Design Systemを変更 | `harness/src/design.ts`、`harness/design.md` |

## 分割の理由

- Deck制作ごとの判断と、共通基盤の変更を混ぜない。
- テンプレート取込後に、AIが正しく選べる説明を必ず作る。
- Cloneしたスライドの見た目と、新規作図のDesign Systemを別物として扱う。
- PPTX生成、構造検査、レンダリング、目視QAを別の確認結果として残す。

CodexとClaude Codeへの有効化は [SETUP.md](SETUP.md)、外部参照とライセンスは [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) を参照してください。
