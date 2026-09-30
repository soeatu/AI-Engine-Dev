# 資料作成

この領域では、根拠のある構成、再利用可能なPowerPoint部品、決定論的な生成、表示確認を一つの流れとして扱います。完成資料だけでなく、テンプレート、生成コード、出典台帳、検証結果を分けて残します。

## 最初に選ぶ入口

| やりたいこと | 入口 |
|---|---|
| PPTXを新規作成・改訂する | [`build-presentation`](skills/build-presentation/SKILL.md) |
| 既存PPTXのスライドを部品化する | [`ingest-slide-templates`](skills/ingest-slide-templates/SKILL.md) |
| 部品の用途・容量・編集項目を記述する | [`describe-slide-template`](skills/describe-slide-template/SKILL.md) |
| 色・書体・ロゴ・グリッドをブランドへ合わせる | [`customize-presentation-design`](skills/customize-presentation-design/SKILL.md) |
| UI/UX設計知識からStyle・Color・Typography・Accessibilityの候補を探す | [`ui-ux-pro-max`](skills/ui-ux-pro-max/SKILL.md) |
| 別ProjectへコピーしてCodex / Claude Codeで使う | [Skillセットアップ](skills/SETUP.md) |
| 実行環境を準備する | [ハーネスREADME](harness/README.md) |

## 標準フロー

```text
新規作成 / 既存資料の改訂を判定
  ↓
対象読者・目的・利用場面・期待する行動・結論・範囲を brief.txt に整理
  ↓
曖昧な項目があれば、候補付きの質問と理解の要約を明確になるまで繰り返す
  ↓
理解確認を利用者と合意
  ↓
根拠とセクション構成を整理（各スライドの図解も計画）
  ├─ 新規作成 → 全体のセクション順を定義
  └─ 途中追加 → 挿入位置と前後のつながりを定義
  ↓
既存テンプレートを選択
  ├─ 適合する → 実スライドをクローンして編集
  └─ 適合しない → 共通Design Systemで新規作図
  ↓
図解・素材を用意（自作図形・同梱アイコン優先、外部素材は商用利用可のみ asset-notes.txt に記録）
  ↓
決定論的なbuild.tsからPPTX生成
  ↓
PPTX構造検査 + 全スライド画像化
  ↓
自動品質ゲート + 目視QA
  ↓
PPTX・Build report・QA report・出典台帳を引き渡し
```

依頼の読み手や伝えたいことが曖昧な場合は、推測で作り始めず、候補を示した質問（1回5問以内）と理解の要約を繰り返し、6つの中心項目（対象読者、目的、利用場面、期待する行動、中心メッセージ、対象範囲）がすべて明確または合意済みの仮定になってから作成します。手順は [`planning-and-sources.md`](skills/build-presentation/references/planning-and-sources.md) の Clarification loop にあります。

資料はなるべく図解で説明します。フロー、比較、構造、推移などは自作のネイティブ図形・グラフで描き、アイコンは同梱のLucide（ISC）を使います。写真など自作できない素材は、商用利用と改変が許可されたライセンスを素材ページで確認できたものだけを使い、`asset-notes.txt` に出典・ライセンス・確認日を記録します。品質ゲートは、画像を埋め込んだのに台帳がない場合や、非商用・改変禁止・不明なライセンスが記録されている場合に失敗します。詳細は [`visuals-and-assets.md`](skills/build-presentation/references/visuals-and-assets.md) を参照してください。

`brief.txt` は資料生成の前提を固定する正本です。対象読者、資料の目的、利用場面、読後に期待する判断または行動、中心メッセージ、対象範囲、期限、未確認事項を記録し、利用者との理解確認が終わってから構成・本文・PPTXを作成します。資料の方向を変える未確認事項がある場合は、推測で作成を開始しません。

作成途中の資料へ新しい内容を差し込む場合は、既存資料を作り直す依頼として扱いません。追加内容を一つのセクションとして定義し、`build.ts` 上の挿入位置、前後のセクションとのつながり、既存内容への影響を確認してから生成順へ追加します。追加後は全スライドを再生成し、構造検査と表示QAをやり直します。

テンプレートがあるという理由だけで使用せず、スライドの役割と情報量が合う場合に選びます。社内テンプレートを利用する場合は、利用権限を確認した原本から必要なスライドを取り込んでください。

`ui-ux-pro-max`は、Style、Color、Typography、Accessibilityなどの候補を検索する補助Skillです。PowerPoint固有の構成判断、Template fidelity、出典管理、PPTX構造検査、全Slideの表示QAは`build-presentation`とハーネスの手順で別に確認します。

## フォルダ

- `harness/`: TypeScriptエンジン、CLI、Design System、テンプレートライブラリ、Deck project。
- `skills/`: 資料作成を用途別に実行するAI向け手順。
- `assets/`: ハーネス外の入力素材。複数Deckで再利用する素材は、出典とライセンスを `assets/asset-notes.txt` に記録する。
- `presentations/`: 完成版またはレビュー対象の成果物。
- [`scripts/`](scripts/README.md): コピー先へのSkill登録など、領域横断の補助処理。
- `tests/`: 領域横断の検証。移植用セットアップは `sh presentation/tests/setup-skills.test.sh` で確認する。

ハーネス固有のテンプレートと生成途中のDeck projectは `harness/` 内に置きます。完成版を共有領域へ移す場合だけ `presentations/` を使用します。

## 設計の参照元

- OpenAIのCodex Presentations Skill: 読者起点の構成、出典、テンプレート忠実性、全スライド表示QA。
- Anthropicの公式PPTX Skill: 作成・編集・読取の入口、PptxGenJS / OOXMLの注意点、構造検査と表示QA。
- [alfonsograziano/pptx-gen](https://github.com/alfonsograziano/pptx-gen): テンプレート取込、clone-and-fill、新規作図、4 Skill分割、決定論的build script。
- [NextLevelBuilder/UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): Style、Color、Typography、Accessibility、Interaction、Stack別UI実装の検索型設計知識。

取り込んだコードと参照Revisionは [Third-Party Notices](skills/THIRD_PARTY_NOTICES.md) に記録しています。
