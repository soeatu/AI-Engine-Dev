# システム開発領域ガイド

このファイルは`development/`配下に適用します。より深い階層に`AGENTS.md`がある場合は、その範囲では局所的な指示を優先します。ルート`AGENTS.md`の共通規則と本ファイルの両方を満たしてください。

この領域では、要求整理、仕様化、設計、計画、調査、実装、テスト、障害調査、レビュー、文書化、デリバリーを扱います。成果物、検証、関連文書を同じ変更単位で整合させます。

## フォルダの役割

- `projects/`: 個別システムまたは機能ごとの成果物とソースコードを置く。
- `skills/`: 開発工程で繰り返し使うAI向け手順を置く。Skillの選択と標準フローは`skills/README.md`を正本とする。
- `scripts/`: Build、Test、解析などを自動化する処理を置く。
- `templates/`: 要求、設計、Test、調査報告などのひな型を置く。
- `tests/`: ワークスペース共通の検証やサンプルTestを置く。

## 作業前に読む資料

- 開発Taskを始める前に、`skills/README.md`の「AI-Engine-Dev統合Skill」と「標準フロー」を読み、必要な工程Skillを選ぶ。
- Skillの有効化、Matt Pocock原文Skillの個別利用、同名Skillの区別が必要な場合は、`skills/matt-pocock/SETUP.md`と`skills/matt-pocock/SKILL_GUIDE.md`を読む。
- 対象Projectの`AGENTS.md`、`README.md`、要件書、仕様書、設計書、ADR、Test方針、Build・運用手順を変更前に読む。
- 外部API、Library、規格、脆弱性、製品仕様など変更し得る情報へ依存する場合は、一次資料を確認し、必要に応じて`research`を使う。

## Agent Skills

独自の開発手順を組み立てる前に、`skills/README.md`から目的に合うSkillを選びます。

### 基本ルーティング

- 標準工程では、`skills/`直下のAI-Engine-Dev統合Skillを使用する。
- 要求が曖昧な場合は`requirements-analysis`、実装可能な振る舞いを確定する場合は`specification`を使う。
- 責務、境界、データ、Interfaceを決める場合は`architecture-design`、実装順序と検証単位を決める場合は`implementation-planning`を使う。
- 外部根拠が必要な場合は`research`、実装変更では`tdd`と`implementation`を使う。
- バグや性能劣化では`debugging`を使い、修正前に再現と根本原因を確定する。
- 完了前は`code-review`でSpecification軸とStandards軸を分けて確認し、関連文書には`documentation`、外部提供には`delivery`を使う。
- 承認済み計画を役割別Agentへ委譲し、Task実装、二軸レビュー、修正、全体レビューまで連続実行する場合は、`skills/orchestrated-development/SKILL.md`を実行Modeとして使う。
- Module境界や責務を深掘りする場合は`codebase-design`、Domain用語を整理する場合は`domain-modeling`、捨てる前提の技術検証には`prototype`を補助Skillとして使う。
- MergeまたはRebaseの競合では`resolving-merge-conflicts`を使い、両側の意図を確認して解消する。

小さく明確な変更では不要な前工程を省略できます。省略する場合も、受け入れ条件、検証方法、権限の境界を実装前に確定し、完了報告で省略した工程と理由を示します。

### Skill利用の原則

- Skillの詳細手順は`AGENTS.md`へ複製せず、`skills/README.md`と各`SKILL.md`を正本とする。
- 同じ目的のSkillを重複して使わない。統合SkillとMatt Pocock原文Skillに同名Skillがある場合は、Pathを確認して選ぶ。
- `skills/README.md`で「明示」とされるユーザー起動型Skillは、利用者が明示的に起動した場合に使う。
- 利用者がSkillを明示した場合は、そのSkillをTask全体のフローへ組み込み、本ファイルと対象Projectの規則も満たす。
- 要件が大きく曖昧で実装判断が変わる場合は、推測で仕様を補完せず、`requirements-analysis`または`specification`で確認事項を整理する。
- SkillとRepository規則が競合する場合は、ルート、本ファイル、対象Projectの順に、より局所的な`AGENTS.md`を優先する。
- Skillの利用は、コミット、push、merge、Issue更新、外部送信、デプロイの権限を与えない。依頼または承認済みTask Briefで明示された範囲だけを実行する。
- Skillの完了判定だけに依存せず、本ファイルと対象Projectの完了条件を確認する。

## 開発の進め方

1. `git status --short --branch`でBranchと既存変更を確認し、依頼外の変更を保持する。
2. 利用者、目的、背景、入力、対象範囲、対象外、制約、受け入れ条件、検証方法、外部変更の権限をTask Briefとして整理する。
3. 現行仕様、実装、Test、環境、ログを調査し、確認済みの事実、推測、未確認事項を分ける。
4. `skills/README.md`から必要な工程Skillを選び、依存関係と検証方法が明確な小さなTaskへ分ける。
5. Test可能な変更では、失敗するTestまたは再現可能なFeedback loopを先に作り、REDを確認する。
6. 最小の一貫した変更を実装してGREENにし、振る舞いを保ったままREFACTORする。
7. 実装で確定した仕様、設計判断、用語、暫定値、運用手順、未実装事項を正本へ反映する。
8. 差分をSpecification軸とStandards軸でレビューし、問題を修正した後に関連Testを再実行する。
9. 単体、結合、E2E、Build、静的解析、実環境確認から変更Riskに対応する検証を実行し、結果を記録する。
10. `git diff --check`と変更対象の差分を確認し、変更内容、根拠、検証結果、未確認事項、残るRisk、文書影響を引き継ぐ。

## 設計と仕様同期

- Architecture境界、Module責務、依存方向を変更する場合は、現行設計と移行先を確認し、`architecture-design`または`codebase-design`を使う。
- コードとドキュメントの仕様同期は、必ず同じ変更単位で行う。コードで仕様、設計、制約値、Schema、Validation、Security規則を変更した場合は、影響する要件書、仕様書、設計書、ADR、README、Testを同時に更新する。
- ドキュメントで仕様を変更した場合も、影響するコードとTestを同じ変更単位で更新する。未実装の将来仕様は現在の仕様と分け、未実装であることを明記する。
- Domain用語、状態遷移、業務規則を変更する場合は、必要に応じて`domain-modeling`を使い、コードとドキュメントで同じ定義を使用する。
- 自動生成物は生成元と生成手順を正本とし、対象Projectが明示的に許可しないかぎり配布先だけを手編集しない。

## Testと検証

- Test可能な実装変更ではTDDを基本とし、RED、GREEN、REFACTORの証拠を残す。
- バグ修正では、修正前に不具合を再現するTestまたは観測可能なFeedback loopを用意し、原因に対応する回帰Testを残す。
- 変更の責務に合うTest levelを選ぶ。単体Testだけで外部連携や利用者操作を証明できない場合は、結合TestまたはE2Eを追加する。
- Test doubleだけでなく、必要に応じて実際のBuild、実行環境、外部連携境界で確認する。
- Test、Preview、開発用実行から本番のDatabase、Analytics、通知、課金、外部APIへ書き込まない。対象ProjectのTest設定、無効化Option、Sandbox、No-op実装を使う。
- UIや操作を変更する場合は、仕様・Mockとの比較、主要画面サイズ、Accessibility、実際の入力操作を変更Riskに応じて確認する。Simulatorや自動Testだけで実機固有の挙動を証明できない場合は、実機未確認と明記する。
- Test成功、Build成功、静的解析成功、画面確認、実機・本番確認は別の証拠として扱う。実行していない確認を成功扱いにしない。
- 文書だけの変更では内容を正本と照合し、参照先の存在と`git diff --check`を確認する。Application Testを省略したことを完了報告へ明記する。

## コードレビュー

実装変更の完了前に`code-review`または同等の差分確認を行います。

- **Specification**: 依頼、受け入れ条件、要件書、仕様書、設計書、ADRに適合しているか。
- **Standards**: ルートと局所`AGENTS.md`、既存Architecture、Security、保守性、Test品質に適合しているか。

片方の評価で他方の不足を相殺しません。指摘を修正した場合は、影響するTestと検査を再実行します。オーケストレーション時は、実装者の自己レビューを独立レビューの代わりにしません。

## Projectドキュメント

- 要求、仕様、設計、ADR、README、Test、実装について、対象Project内の正本を一つに定める。
- READMEは現在の入口、責務、主要ファイル、実行・検証方法を示し、詳細仕様は正本へLinkする。
- `AGENTS.md`は再利用される作業規則と制約を示し、製品仕様や一時的な調査メモの置き場にはしない。
- 実装済み、目標設計、未実装を区別し、将来案を現在の挙動として記載しない。
- Architecture境界や長期的な判断を変更する場合は、対象Projectの方式に従ってADRを作成または更新する。
- READMEは、独立した機能・Subsystem、複数ファイルの関係、データフロー、外部境界、特殊な生成・検証手順を親文書だけで判断できないDirectoryに作成または更新する。
- 局所`AGENTS.md`は、変更禁止・直接編集禁止の対象、固有のArchitecture制約、必須Test、特殊な生成・検証手順があり、上位規則だけでは安全に変更できないDirectoryに作成または更新する。
- 新しい責務、特殊な生成・検証手順、変更禁止対象、局所的なArchitecture制約を導入した場合は、対象DirectoryのREADMEまたは局所`AGENTS.md`へ同じ変更で反映する。
- DirectoryへREADMEや`AGENTS.md`を機械的に増やさない。親文書だけでは次の行動や安全な変更方法を判断できない場合に作成する。

## Gitと外部変更

- コードを編集する場合は、対象Projectが定める基準Branchから新しい作業Branchを作成する。基準Branchや起点が不明な場合は、現在のGit状態を確認してから利用者へ確認する。
- 未コミット変更のため安全に作業Branchを作れない場合は、勝手にcommit、stash、破棄をせず、起点と既存変更の扱いを利用者へ確認する。
- 利用者の未コミット変更と依頼外のファイルを保持し、対象を明示して差分を確認する。
- コミット、push、merge、Pull Request作成、Issue更新、デプロイ、リリースは、利用者が明示的に依頼または承認した場合だけ行う。
- 破壊的なGit操作や依頼外の整理で作業状態を変更せず、競合や既存変更が妨げになる場合は安全な代替手段を調査してから利用者へ確認する。
- MergeまたはRebaseの競合解消では、両側の意図と受け入れ条件を確認し、必要に応じて`resolving-merge-conflicts`を使う。

## 完了条件

次のすべてを満たします。

- 依頼の受け入れ条件を満たす成果物があり、根拠と変更範囲を説明できる。
- 必要な工程Skillまたは同等の標準フローを適用し、省略した工程には理由がある。
- Test可能な変更ではRED、GREEN、REFACTORを確認し、関連Testが成功している。
- Specification軸とStandards軸で差分を確認し、両方の指摘を解消している。
- 必要なBuild、静的解析、結合Test、E2E、実環境確認を実行し、成功した確認と未実施の確認を区別している。
- コードと要件書、仕様書、設計書、ADR、README、Testの仕様が同期され、記述が一致している。
- 生成物がある場合は、正本から必要な配布先へ同期されている。
- 新規または変更したDirectoryについて、READMEと局所`AGENTS.md`の作成・更新要否を判定している。
- `git diff --check`が成功し、依頼外の変更が保持されている。
- コミット、push、merge、Issue更新、デプロイなどの外部変更が、明示された権限の範囲内である。
- 完了報告に、変更内容、根拠、実行済み検証、未実行検証、未確認事項、残るRiskと、`文書影響: <更新した文書と理由>`または`文書影響なし: <更新不要と判断した理由>`がある。
