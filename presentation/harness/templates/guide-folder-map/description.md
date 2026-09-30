# Guide folder map

フォルダ階層と、主要フォルダの責務・入口・境界を一画面で対応付けるスライドです。

## Layout

左側約3分の1に等幅フォントのフォルダツリー、右側に2枚の小カードと1枚の横長カードを配置します。ツリーは約10行、上段カードは短い責務と入口、下段カードは配置境界を説明できます。

## When to use

- リポジトリやワークスペースの全体構成を初めて説明する場合。
- フォルダ名だけでは分かりにくい責務や参照順を補足する場合。

## When not to use

- 10行を大幅に超える深い階層。複数ページへ分割します。
- ファイル単位の完全な一覧。READMEまたは付録表を使用します。

## Fields

- `workspace-map`: 上部の短いカテゴリラベル。
- `folder-roles-become-clear-at-a-glanc`: スライドの結論を示す1行タイトル。
- `workspace-root-development-projects-`: 左側のフォルダツリー。約10行まで。
- `primary-area`: 左上カードの分類ラベル。
- `folder-name`: 左上カードの主要フォルダ名。
- `responsibility-and-entry-point`: 左上カードの短い責務と利用開始条件。最大2行。
- `canonical-entry`: 右上カードの分類ラベル。
- `readme-md`: 右上カードの正本または入口ファイル名。
- `first-document-and-next-action`: 右上カードの最初に読む理由と次の行動。最大2行。
- `boundary`: 下段カードの分類ラベル。
- `what-belongs-elsewhere`: 下段カードの境界タイトル。
- `name-the-nearest-related-area-and-pr`: 下段カードの配置境界説明。最大2行。
- `ai-engine-dev-guide`: フッター左の資料名。
- `00`: フッター右のページ番号。
