---
name: bootstrap-development-harness
description: 既存ProjectへAI-Engine-Devのdevelopmentハーネスを初回導入し、実物に基づくREADME.mdとAGENTS.mdを整備する。
disable-model-invocation: true
---

# Bootstrap Development Harness

ユーザーが明示した既存Projectを調査し、そのProjectでAI-Engine-Devの開発フローを安全に始められる文書入口を作る。明確な対象Pathを伴う起動は、そのProject内のREADMEと`AGENTS.md`を作成・更新する依頼として扱う。

このSkillは初回導入専用である。導入後の機能変更に伴う文書同期には`documentation`を使う。

## 成果

- Project rootの`README.md`が、利用者向けに目的、構成、Setup、実行、検証、関連文書への入口を示す。
- Project rootの`AGENTS.md`が、Agent向けに適用範囲、参照順、Project固有規則、検証、文書同期、権限境界を示す。
- 親文書だけでは判断できないDirectoryに限り、局所READMEまたは局所`AGENTS.md`がある。
- 記載した事実、Path、Command、Linkを実物で確認でき、未確認事項が区別されている。

## 進め方

### 1. 対象を確定する

ユーザーが指定したPathを対象Project rootとする。指定がなく、現在のGit rootが一つに定まる場合はそこを使う。候補が複数ある場合だけ、書き込み前に対象を確認する。

開始時にGit状態を確認し、既存変更を保持する。対象Projectに適用される上位から局所までの`AGENTS.md`、既存のREADME、`CLAUDE.md`、要件書、設計書、ADR、検証手順を先に読む。

**完了条件:** 対象root、適用される規則、既存変更、編集可能な範囲が一意である。

### 2. Projectの実物を調査する

次の根拠から現在の構成と実行方法を確認する。

- Source、Test、docs、scripts、generated artifactsのDirectory構成
- Package manifest、Build設定、Task runner、CI、Container設定
- 実行、Build、Test、Lint、Format、生成に使われるCommand
- 外部API、Database、認証、課金、通知などの境界
- 直接編集禁止、機密情報、Production書き込みなどの安全制約

確認済みの事実、合理的な推測、未確認事項を分ける。Project名、目的、Command、Architecture、対応環境を推測だけで確定しない。

**完了条件:** READMEと`AGENTS.md`の各記載候補に、実装、設定、既存文書のいずれかの根拠があるか、未確認と明示できる。

### 3. 文書配置を決める

Project rootには`README.md`と`AGENTS.md`の両方を用意する。既存ファイルがある場合は、その構成と人が書いた内容を維持し、同じ意味のSectionを更新する。再実行でSectionや規則を重複させない。

局所READMEは、独立した機能またはSubsystem、複数ファイルの関係、Data flow、外部境界、特殊な生成・検証手順を親READMEだけで判断できないDirectoryに作る。

局所`AGENTS.md`は、変更禁止対象、固有のArchitecture制約、依存方向、必須Test、特殊な生成・検証手順があり、上位規則だけでは安全に変更できないDirectoryに作る。

素材だけのLeaf、生成物専用Directory、親文書で役割と安全な変更方法を判断できるDirectoryには追加しない。

**完了条件:** Project rootと、調査対象の主要Directoryごとに、作成、更新、省略の判断理由がある。

### 4. READMEを作成または更新する

READMEは利用者が次の行動を選べる入口にする。Projectの実物に存在する範囲で、次を記載する。

- 目的、対象利用者、現在の実装状態
- 主要Directoryと責務
- Setup、実行、Build、Test、静的解析などのCommand
- Architecture、仕様、運用、Contribution文書へのLink
- 未確認の環境依存事項または実環境確認

設定ファイルから容易に確認できる一覧を重複させず、詳細仕様は正本へLinkする。将来案を現在の機能として書かない。

**完了条件:** 初めて読む利用者が、Projectの目的、開始方法、検証方法、詳細情報の所在を判断できる。

### 5. AGENTS.mdを作成または更新する

`AGENTS.md`はAgentが安全に変更するためのProject固有規則に絞る。必要な範囲で次を記載する。

- 適用範囲と、より局所的な`AGENTS.md`の優先関係
- 作業前に読む正本と、主要Directoryの責務
- 受け入れ条件、根拠調査、TDDまたはFeedback loop、二軸Review、検証、文書同期の流れ
- Project固有のArchitecture、Security、生成物、Test、外部連携の制約
- Commit、push、merge、Issue更新、外部送信、Deployには個別の明示許可が必要であること
- 完了報告で、検証済み、未実施、未確認、Risk、文書影響を分けること

上位`AGENTS.md`の規則を複製せず、このProjectでAgentの判断が変わる情報と参照先を記載する。`CLAUDE.md`がある場合も保持し、役割が重なる記述は正本を一つにしてLinkする。

**完了条件:** Agentが変更前の参照先、守る境界、必要な検証、許可されていない外部操作を判断できる。

### 6. 検証して報告する

変更したMarkdownのLocal linkと記載したPathを確認する。Commandは設定との一致を確認し、安全で軽量な確認を実行できる場合は実行する。Application Testを実行しない場合は、文書導入のみで省略したことを明記する。

Git Repositoryでは`git diff --check`と対象差分を確認する。非Git Projectでは変更ファイル一覧を確認する。最後に次を報告する。

- 作成・更新した文書と根拠
- 主要Directoryごとの文書要否
- 実行した検証と結果
- 未実行・未確認事項と残るRisk
- `文書影響: <更新した文書と理由>`

Commit、push、merge、Issue更新、外部送信、Deploy、依存PackageのInstallは、ユーザーが別途明示した場合だけ実行する。

**完了条件:** 文書が実物と整合し、Linkと差分の検査結果を示し、依頼外の変更が保持されている。
