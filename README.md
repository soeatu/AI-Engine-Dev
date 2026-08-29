# AI-Engine-Dev

AIを活用した資料作成とシステム開発を、成果物、再利用部品、検証手段に分けて管理するワークスペースです。

## はじめに

初めて参加する場合は、[Lerning/README.md](Lerning/README.md)から読み始めてください。

- 資料作成: [`presentation/`](presentation/)
- システム開発: [`development/`](development/)
- システム開発用Skill: [`development/skills/README.md`](development/skills/README.md)

## システム開発用Skillの考え方

システム開発用Skillは、Addy Osmaniの`agent-skills`を「開発プロセスの骨格」、Matt Pocockの`skills`を「各工程のSoftware Engineering品質」として統合した社内版です。要求からデリバリーまでを11の工程Skillに整理し、複数モデルで計画を実行する場合は、これらを束ねるオーケストレーションModeを追加で使用します。

Matt Pocockの原文Skillは、開発途中・補助用途を含む全37個を[`development/skills/matt-pocock/`](development/skills/matt-pocock/README.md)に別枠で収録しています。社内Skillは標準工程、原文Skillは原文確認、個別利用、差分確認に使用します。利用を始めるときは[セットアップガイド](development/skills/matt-pocock/SETUP.md)と[Skillガイド](development/skills/matt-pocock/SKILL_GUIDE.md)を参照してください。

通常の機能開発では、要求分析、仕様化、設計、計画、TDD、実装、デバッグ、コードレビューの中核8 Skillを使います。調査、文書化、デリバリーは、作業内容に応じて追加します。詳しい選び方と成果物は[Skill一覧](development/skills/README.md)を参照してください。

承認済み計画を複数モデルで実行する場合は、[`orchestrated-development`](development/skills/orchestrated-development/SKILL.md)が、設計、Task実装、二軸レビュー、修正ループ、全体レビューを統括します。CodexではSol/Luna等を委譲時に指定し、Claude Codeでは`.claude/agents/`のOpus/Sonnet定義を使用します。

## 共通原則

- 事実、推測、未確認事項を分ける。
- 仕様、実装、ログ、テスト結果、公式文書を根拠にする。
- 変更はレビュー・検証できる小さな単位で進める。
- 実施済みの確認と未確認事項を分けて引き継ぐ。
- 機密情報、個人情報、認証情報を生成物へ残さない。
