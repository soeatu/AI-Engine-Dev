# Matt Pocock Skills ガイド

この文書は、AI-Engine-Devに収録した37個のSkillについて、目的、利用場面、呼び出し方法、注意点をまとめたものです。導入と有効化は[セットアップガイド](SETUP.md)を参照してください。

## 呼び出し方法の見方

- **明示**: 利用者がSkill名を指定した場合だけ実行されます。Codexでは`$skill-name`、Claude Codeでは`/skill-name`で呼び出します。
- **自動可**: 依頼内容がSkillの`description`と一致した場合、AIが自動選択できます。名前を指定して呼び出すこともできます。
- **ベータ**: 仕様変更や削除の可能性がある開発途中のSkillです。
- **補助**: 上流で正式提供セットに含まれない、用途限定のSkillです。

## まず選ぶSkill

| 状況 | 最初に使うSkill | 次の候補 |
|---|---|---|
| どのSkillが適切か分からない | `ask-matt` | 提案されたフローへ進む |
| 要望や設計を深掘りしたい | `grill-with-docs` | `to-spec`または`implement` |
| 作業ディレクトリがない相談を深掘りしたい | `grill-me` | 会話結果を文書化する |
| 難しい不具合を調査したい | `diagnosing-bugs` | `tdd`、`code-review` |
| 小さな機能をテスト駆動で作りたい | `tdd` | `code-review` |
| 複数セッションの開発を計画したい | `to-spec` | `to-tickets`、`implement` |
| 巨大で不明点の多い計画を整理したい | `wayfinder` | `to-spec` |
| ブランチやPRをレビューしたい | `code-review` | 指摘の修正と再確認 |
| 人にしかできない設定手順を作りたい | `wizard` | 生成された手順を人が実行 |

## 推奨フロー

### 小規模な機能開発

```text
grill-with-docs → implement
                       ├── tdd
                       └── code-review
```

### 複数セッションにまたがる開発

```text
grill-with-docs → to-spec → to-tickets → implement（Ticketごと）
                                                ├── tdd
                                                └── code-review
```

### 難しい不具合

```text
diagnosing-bugs → 再現・原因特定 → tddで回帰テスト → 修正 → code-review
```

### 巨大で不確実な取り組み

```text
wayfinder → 意思決定Ticketを解決 → to-spec → to-tickets → implement
```

## Engineering: 明示呼び出し

### `ask-matt`

- **目的**: 現在の状況に合うSkillまたはSkillの流れを案内するルーターです。
- **使う場面**: 37個の中から何を使うべきか分からないとき、複数工程をどうつなぐか迷うとき。
- **呼び出し**: 明示。
- **主な出力**: 推奨Skill、実行順、分岐条件。
- **注意**: 実作業そのものではなく、進め方を選ぶためのSkillです。

### `grill-with-docs`

- **目的**: 要望や設計を厳しく質問しながら明確化し、用語や判断を`CONTEXT.md`とADRへ反映します。
- **使う場面**: リポジトリ内で機能要件、設計、仕様の曖昧さを解消したいとき。
- **呼び出し**: 明示。
- **主な出力**: 解消された論点、Domain用語、必要なADR。
- **注意**: 作業ディレクトリがない相談では`grill-me`を使います。

### `triage`

- **目的**: 外部から届いたIssueやPRを、調査・追加情報・AI対応・人間対応・対応不要の状態へ分類します。
- **使う場面**: 未整理の不具合報告や機能要望が蓄積しているとき。
- **呼び出し**: 明示。
- **主な出力**: 分類、検証結果、追加質問、エージェント向けBrief。
- **注意**: `to-tickets`が作成したTicketは既に作業可能なため、通常は再triageしません。

### `improve-codebase-architecture`

- **目的**: コードベースを調査し、より深いModuleへ改善できる候補をHTMLレポートで示します。
- **使う場面**: 保守性、変更容易性、AIによる理解しやすさを継続的に改善したいとき。
- **呼び出し**: 明示。
- **主な出力**: 改善候補の可視化、選択した候補への質問と設計材料。
- **注意**: 大規模リファクタリングを自動完了するSkillではなく、候補を発見して次の設計へ渡すSkillです。

### `setup-matt-pocock-skills`

- **目的**: Engineering Skillが前提とするIssue管理先、triageラベル、Domain文書の配置を設定します。
- **使う場面**: リポジトリでMatt Pocock Skillを初めて使うとき、Issue管理方法を変更するとき。
- **呼び出し**: 明示。リポジトリごとに原則1回。
- **主な出力**: `docs/agents/`の設定文書、`AGENTS.md`または`CLAUDE.md`の案内。
- **注意**: 対話と確認を経て書き込むSkillであり、無条件に設定を生成するスクリプトではありません。

### `to-spec`

- **目的**: それまでの会話を、追加インタビューなしで実装可能な仕様へまとめ、設定済みIssue管理先へ公開します。
- **使う場面**: 論点が会話で解決済みで、複数セッションへ渡せる仕様が必要なとき。
- **呼び出し**: 明示。
- **主な出力**: 仕様書または仕様Issue。
- **注意**: 未解決の要件を深掘りするSkillではありません。曖昧さが残る場合は先に`grill-with-docs`を使います。

### `to-tickets`

- **目的**: 計画、仕様、会話を、依存関係を持つ小さなTracer bullet Ticketへ分割します。
- **使う場面**: 複数の作業単位に分け、並行または順次実装できる形にしたいとき。
- **呼び出し**: 明示。
- **主な出力**: Blocking edgeを明記したTicket群。
- **注意**: 設定済みのIssue管理先へ書き込むため、外部Issue作成の権限と依頼範囲を確認します。

### `implement`

- **目的**: 仕様またはTicketを実装し、合意したSeamでTDDを行い、最後にコードレビューします。
- **使う場面**: 実装対象と受け入れ条件が明確なとき。
- **呼び出し**: 明示。
- **主な出力**: 実装、テスト結果、二軸レビュー結果。
- **注意**: Skillの利用だけではコミットやpushの許可になりません。

### `wayfinder`

- **目的**: 1セッションに収まらない巨大で不確実な取り組みを、意思決定Ticketの地図として整理します。
- **使う場面**: Greenfield開発、大規模機能、到達経路がまだ見えない計画。
- **呼び出し**: 明示。
- **主な出力**: 意思決定Ticket、依存関係、解決済み判断の共有地図。
- **注意**: 実装物を作るSkillではありません。地図が明確になったら`to-spec`へ渡します。

## Engineering: 自動選択可能

### `prototype`

- **目的**: 状態、ロジック、UIに関する設計上の疑問を、破棄可能な試作で検証します。
- **使う場面**: 文書や会話だけでは使い勝手や動作を判断できないとき。
- **呼び出し**: 自動可。
- **主な出力**: 単一HTMLまたは切り替え可能なUI案、検証で得た回答。
- **注意**: 本番品質の実装ではなく、設計判断の一次資料です。

### `diagnosing-bugs`

- **目的**: 難しい不具合や性能劣化を、再現 → 最小化 → 仮説 → 計測 → 修正 → 回帰テストの順で調査します。
- **使う場面**: 原因不明、断続的、再発する、単純な修正で直らない不具合。
- **呼び出し**: 自動可。
- **主な出力**: 再現手順、根本原因、修正、回帰テスト。
- **注意**: 再現できるFeedback loopを作る前に推測で修正しません。

### `research`

- **目的**: 信頼性の高い一次資料を調査し、引用付きMarkdownとしてリポジトリへ残します。
- **使う場面**: API、標準、技術選定、外部仕様の確認が必要なとき。
- **呼び出し**: 自動可。
- **主な出力**: 出典と結論を含む調査文書。
- **注意**: 調査結果は意思決定材料であり、要件整理の代替ではありません。

### `tdd`

- **目的**: RED → GREEN → REFACTORを、垂直スライス単位で繰り返します。
- **使う場面**: 新機能や不具合修正をテストファーストで進めたいとき。
- **呼び出し**: 自動可。
- **主な出力**: 先に失敗するテスト、最小実装、リファクタリング結果。
- **注意**: 実装詳細へ密結合したテストより、公開Interfaceや適切なSeamを通したテストを重視します。

### `domain-modeling`

- **目的**: Domain用語を明確にし、曖昧語や多義語を解消し、重要な判断をADRへ記録します。
- **使う場面**: 用語が人やModuleによって異なる、`CONTEXT.md`やADRを整備したいとき。
- **呼び出し**: 自動可。
- **主な出力**: 用語定義、具体例、`CONTEXT.md`、ADR。
- **注意**: 実装詳細ではなく、Domainの共通言語を扱います。

### `codebase-design`

- **目的**: 小さなInterfaceの背後に多くの機能を隠す「深いModule」の語彙と設計原則を提供します。
- **使う場面**: Module境界、Interface、Seam、Adapter、テスト容易性を設計するとき。
- **呼び出し**: 自動可。
- **主な出力**: Moduleの責務、Interface、境界案、設計比較。
- **注意**: 開発工程を進めるSkillではなく、設計判断の共通語彙です。

### `code-review`

- **目的**: 差分を「Repository標準」と「仕様適合」の二軸で独立にレビューします。
- **使う場面**: ブランチ、PR、作業中差分を固定時点からレビューするとき。
- **呼び出し**: 自動可。
- **主な出力**: Standards指摘とSpec指摘を分けたレビュー結果。
- **注意**: 基準点となるCommit、Branch、TagまたはMerge baseが必要です。

### `resolving-merge-conflicts`

- **目的**: 進行中のmergeまたはrebase conflictを、両側の意図と一次資料に基づいて解消します。
- **使う場面**: 既にconflict状態に入り、各Hunkの正しい統合が必要なとき。
- **呼び出し**: 自動可。
- **主な出力**: 解消済みConflict、検証結果、完了したmergeまたはrebase。
- **注意**: 行を機械的に選ばず、`--abort`で逃げずに意図を確認します。

### `wizard`

- **目的**: 人にしか実行できない手順を、対話型Bash Wizardとして作成します。
- **使う場面**: 認証情報、CI Secret、外部Dashboard、MigrationやCutoverの手順。
- **呼び出し**: 自動可。
- **主な出力**: URL案内、入力取得、設定反映を含む対話型スクリプト。
- **注意**: AI自身が実行できる作業には使いません。秘密情報をログや生成物へ残さない設計が必要です。

## Productivity

### `grill-me`

- **目的**: 計画や設計の全分岐が解決するまで、利用者へ厳しく質問します。
- **使う場面**: 作業ディレクトリを持たないアイデア、計画、文章などを深掘りするとき。
- **呼び出し**: 明示。
- **主な出力**: 解決済みの判断と未解決のFrontier。
- **注意**: `CONTEXT.md`やADRは更新しません。リポジトリ内では`grill-with-docs`を優先します。

### `handoff`

- **目的**: 現在の会話を、別のエージェントやセッションが継続できる引き継ぎ文書へ圧縮します。
- **使う場面**: 作業環境、Directory、担当者、Agentを切り替えるとき。
- **呼び出し**: 明示。
- **主な出力**: 目的、進捗、判断、根拠、次の行動を含むHandoff文書。
- **注意**: 同じContextで継続できる場合に、不要な引き継ぎを増やさないようにします。

### `teach`

- **目的**: 現在のDirectoryを学習Workspaceとして使い、複数セッションにわたり概念やSkillを教えます。
- **使う場面**: 継続的な学習、演習、理解度の記録が必要なとき。
- **呼び出し**: 明示。
- **主な出力**: 学習目標、教材、演習、学習記録。
- **注意**: 作業Directoryへ学習状態を保存します。

### `to-questionnaire`

- **目的**: 自分だけでは答えられない判断を、適切な相手へ渡すMarkdown質問票にします。
- **使う場面**: Domain expert、顧客、運用担当者などの回答が必要なとき。
- **呼び出し**: 明示。
- **主な出力**: 非同期回答またはMeetingで使用できる質問票。
- **注意**: 質問の内容だけでなく、誰へ送り何を得たいかを先に明確にします。

### `wait-what`

- **目的**: 直前の説明が伝わらなかったとき、前提と共有語彙を補って説明し直します。
- **使う場面**: 説明が難しすぎる、前提不足、用語が分からないと感じた直後。
- **呼び出し**: 明示。
- **主な出力**: より平易で文脈を補った再説明。
- **注意**: 新しい調査ではなく、直前のメッセージの再構成です。

### `grilling`

- **目的**: 計画、判断、アイデアを質問でStress testする共通Interview primitiveです。
- **使う場面**: Wrapperなしで質問セッションだけを実施したいとき、他Skillから呼ばれるとき。
- **呼び出し**: 自動可。
- **主な出力**: 事実、判断、未解決分岐の整理。
- **注意**: 通常は`grill-me`または`grill-with-docs`を入口にします。

### `writing-for-agents`

- **目的**: Skill、`AGENTS.md`、`CLAUDE.md`など、AIが読む文書を明確に書くための規律を提供します。
- **使う場面**: Agent向け指示文書を作成・更新するとき。
- **呼び出し**: 自動可。
- **主な出力**: Scope、Trigger、手順、権限境界が明確なAgent向け文書。
- **注意**: 一般利用者向け説明書ではなく、Agentが実行時に読む文書を対象にします。

## In progress（ベータ）

### `loop-me`

- **目的**: 複数セッションを使い、作りたいWorkflowを実装可能な仕様になるまで自己Interviewします。
- **使う場面**: Workflow設計を継続的に深掘りしたいとき。
- **呼び出し**: 明示、ベータ。
- **注意**: 現在のDirectoryへ状態を保存し、上流で仕様変更される可能性があります。

### `writing-beats`

- **目的**: 記事をBeatの旅として組み立て、一つずつ書き進めます。
- **使う場面**: 読者の理解順序や展開を重視して記事を構成するとき。
- **呼び出し**: 明示、ベータ。
- **注意**: 最初から全文を生成せず、各Beatの選択と接続を反復します。

### `writing-fragments`

- **目的**: 将来の記事材料となる断片的な考え、例、主張をInterviewで掘り出します。
- **使う場面**: 構成前の素材収集をしたいとき。
- **呼び出し**: 明示、ベータ。
- **注意**: この段階では文章構造を決めません。

### `writing-shape`

- **目的**: Markdownの素材を、形式の選択理由を検討しながら段落単位で記事へ整えます。
- **使う場面**: 断片やメモは揃っているが、完成記事へ変換したいとき。
- **呼び出し**: 明示、ベータ。
- **注意**: 入力となる素材ファイルが必要です。

### `claude-handoff`

- **目的**: 現在の会話を要約し、`claude --bg`で新しいBackground agentへ直ちに引き継ぎます。
- **使う場面**: Claude Codeで作業を別Agentへ移すとき。
- **呼び出し**: 明示、ベータ。
- **注意**: Claude CLIとBackground agent機能に依存します。Codex向けの一般Handoffには`handoff`を使います。

### `setup-ts-deep-modules`

- **目的**: dependency-cruiserをTypeScript Repositoryへ導入し、各Packageの内部実装をEntry pointの背後へ隠します。
- **使う場面**: Deep module境界を静的に強制し、Testも公開Entry point経由にしたいとき。
- **呼び出し**: 明示、ベータ。
- **注意**: 依存設定、Package構造、Test importを変更するため、既存Architectureとの適合確認が必要です。

### `implement-spec`

- **目的**: 一つの仕様をTask graphとして扱い、準備できたTaskを複数Agentで並行実装し、一つのPRへまとめます。
- **使う場面**: 依存関係が定義された大きな仕様を一Branchで実装するとき。
- **呼び出し**: 明示、ベータ。
- **注意**: Multi-agent、Branch、PR作成を前提とします。利用環境と外部変更の承認範囲を確認してください。

### `retro`

- **目的**: Coding session後に、指示ファイル、Coding standard、自動検査、Toolingの改善案を出します。
- **使う場面**: 作業環境の継続的改善を検討するとき。
- **呼び出し**: 明示、ベータ。
- **注意**: 現リビジョンでは設計メモだけのStubで、機能は未完成です。

## Misc（用途限定）

### `git-guardrails-claude-code`

- **目的**: Claude Code Hookを設定し、`push`、`reset --hard`、`clean`、Branch強制削除など危険なGit操作を阻止します。
- **使う場面**: Claude CodeのGit操作へ事前Guardrailを設けたいとき。
- **呼び出し**: 自動可、補助。
- **注意**: Claude Code固有です。既存Hookと対象Commandを確認してから導入します。

### `migrate-to-shoehorn`

- **目的**: Test codeの`as`型Assertionを`@total-typescript/shoehorn`へ移行します。
- **使う場面**: TypeScript Testで部分Fixtureを安全に作りたいとき。
- **呼び出し**: 自動可、補助。
- **注意**: 対象Testと依存Packageを確認し、機械的置換後にType checkとTestを実行します。

### `scaffold-exercises`

- **目的**: Section、Problem、Solution、Explainerを持つ演習Directory構造を作成します。
- **使う場面**: CourseやTraining教材の演習雛形を追加するとき。
- **呼び出し**: 自動可、補助。
- **注意**: Repository固有のLint、Naming、Directory規則との一致を確認します。

### `setup-pre-commit`

- **目的**: Husky、lint-staged、Prettier、型検査、Testを使うpre-commit Hookを設定します。
- **使う場面**: Node.js RepositoryへCommit前の品質検査を追加するとき。
- **呼び出し**: 自動可、補助。
- **注意**: 既存Hook、Package manager、CIとの重複や実行時間を確認します。

## Deprecated

現リビジョンの`deprecated`カテゴリには、Skill本体はありません。廃止されたSkillは削除され、置き換え先は上流のChangesetで案内される方針です。

## 選択時の注意

- AI-Engine-Devの社内Skillを標準工程として使い、Matt原文Skillは明示的な比較・個別利用に使うのが基本です。
- `in-progress`と`misc`は上流の正式プラグインに含まれません。
- Skillの選択は、Commit、push、Issue作成、PR作成、外部サービス更新の許可を広げません。
- 同名Skillが複数表示される場合は、Skillのパスが`development/skills/matt-pocock/`を指しているか確認します。
- 詳細な手順と制約は、各Skillの`SKILL.md`を正本として確認してください。

## 参照

- [セットアップガイド](SETUP.md)
- [収録物README](README.md)
- [Engineering一覧](engineering/README.md)
- [Productivity一覧](productivity/README.md)
- [In progress一覧](in-progress/README.md)
- [Misc一覧](misc/README.md)
- [OpenAI公式: Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Matt Pocock — skills](https://github.com/mattpocock/skills)
