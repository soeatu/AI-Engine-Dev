# Guide routing guide

依頼内容から担当領域を選び、対応するSkillの入口へ進む分岐を示すスライドです。

## Layout

左の開始カードから中央の上下2カードへ分岐し、右のSkillカードへ合流します。各カードは短い分類ラベル、1語程度の見出し、最大2行の補足を持ちます。矢印とカードはすべて編集可能です。

## When to use

- DevelopmentとPresentationなど、作業領域を選ぶ判断基準を示す場合。
- 質問からSkillの正本へ誘導する簡潔なルーターを説明する場合。

## When not to use

- 3つ以上の複雑な分岐や循環がある場合。専用のフロー図へ分割します。
- 各Skillの詳細手順を説明する場合。手順または一覧レイアウトを使用します。

## Fields

- `routing-guide`: 上部のカテゴリラベル。
- `routing-title-with-one-clear-takeawa`: ルーティングの結論タイトル。
- `start`: 左カードの分類ラベル。
- `task`: 左カードの見出し。
- `required-outcome`: 左カードの判断開始点。最大2行。
- `development`: 上段分岐の分類ラベル。
- `build`: 上段分岐の見出し。
- `requirements-designcode-tests`: 上段分岐の代表的な対象。最大2行。
- `presentation`: 下段分岐の分類ラベル。
- `explain`: 下段分岐の見出し。
- `brief-decksources-visual-qa`: 下段分岐の代表的な対象。最大2行。
- `next`: 右カードの分類ラベル。
- `skill`: 右カードの見出し。
- `read-matching-skill-md`: 右カードの次の行動。最大2行。
- `ai-engine-dev-guide`: フッター左の資料名。
- `00`: フッター右のページ番号。
