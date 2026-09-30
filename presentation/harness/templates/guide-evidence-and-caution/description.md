# Guide evidence and caution

確認済み事実、仮定、未決事項、権限境界の4区分を並べ、情報の扱い方を明確にするスライドです。

## Layout

上部にカテゴリと結論タイトル、中央に2列2段のカードを配置します。各カードは状態ラベル、短い名称、最大2行の説明を持ち、色で区分を補助します。

## When to use

- 調査結果、設計判断、AI生成物の確実性を分けて説明する場合。
- Skill利用と外部操作権限の違いを注意事項として示す場合。

## When not to use

- 個別リスクを多数管理する場合。リスク一覧表または台帳を使用します。
- 4区分すべてが不要な場合。必要なカードだけを持つ別レイアウトを使用します。

## Fields

- `evidence-and-caution`: 上部のカテゴリラベル。
- `evidence-and-authority`: 4区分から導く結論タイトル。
- `confirmed`: 左上カードの状態ラベル。
- `fact`: 左上カードの名称。
- `verified-by-a-current-source-or-chec`: 左上カードの説明。最大2行。
- `assumption`: 右上カードの状態ラベル。
- `assumption-2`: 右上カードの名称。
- `useful-for-progress-but-clearly-labe`: 右上カードの説明。最大2行。
- `open`: 左下カードの状態ラベル。
- `unresolved`: 左下カードの名称。
- `needs-user-input-or-later-verificati`: 左下カードの説明。最大2行。
- `boundary`: 右下カードの状態ラベル。
- `permission`: 右下カードの名称。
- `skills-do-not-expand-authority`: 右下カードの説明。最大2行。
- `ai-engine-dev-guide`: フッター左の資料名。
- `00`: フッター右のページ番号。
