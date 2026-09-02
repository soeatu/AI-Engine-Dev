# Orchestration Ledger: portable-development-root

## Run

- Goal: `development/`の内容を空の新規Project rootへ展開し、CodexまたはClaude Codeで利用できる自己完結したDevelopment harnessにする。
- Specification: `task-1-brief.md`
- Implementation plan: 単一の垂直Taskとして、portable layout、参照Path、導入文書、検証Scriptを同時に整合させる。
- Work directory: `/Users/soenoa/Documents/ChatGPT/AI-Engine-Dev`
- Base commit / baseline: `1bcc8fa73bb75ec6afcc010ab0613664970cc512`。開始時点にArchify統合の未コミット変更があり、依頼外変更として保持する。
- Controller platform and model: Codex / Sol
- Authorization boundaries: ローカルファイル変更と検証のみ。commit、push、PR、外部送信、デプロイは未許可。

## Tasks

| ID | Task | Depends on | Implementer model | Reviewer model | State | Brief | Report | Review | Fix round |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Development harnessをProject rootへ展開可能にする | なし | Luna medium | Controller review | COMPLETE | `task-1-brief.md` | `task-1-implementation-report.md` | `task-1-review.md` | 1 |

State: `READY` / `IMPLEMENTING` / `REVIEWING` / `FIXING` / `BLOCKED` / `COMPLETE`

## Rulings

- Date/time: 2026-09-02
  - Decision: 対応対象は空の新規Projectへの展開とし、既存Projectへの上書き導入は`bootstrap-development-harness`を使う別経路として維持する。
  - Evidence: `README.md`と`AGENTS.md`は既存Projectで競合し、`scripts/`、`tests/`、`templates/`も無条件Mergeできない。
  - Cost if wrong: 既存成果物を上書きする危険、または新規Projectで余分な手作業が残る。
- Date/time: 2026-09-02
  - Decision: `development/`自体をportable rootの正本にし、隠し設定も含む`development/.`をコピーする。
  - Evidence: CodexとClaude Codeの自動検出には`.agents/`、`.claude/`が必要で、`development/*`では隠しDirectoryがコピーされない。
  - Cost if wrong: SkillまたはClaude Agentがコピー先で検出されない。
- Date/time: 2026-09-02
  - Decision: 統合13 SkillとArchifyだけを既定で有効化し、Matt Pocock原文Skillは同名衝突を避けるため選択式のままにする。
  - Evidence: `tdd`、`research`、`code-review`などに同名Skillがある。
  - Cost if wrong: 曖昧なSkill解決または意図しない原文Skillの起動が発生する。

## Unverified and residual risks

- Codex／Claude Code実アプリでの検出はローカル構造検査後も別途Human確認が必要。
- Archifyの完全なupstream testとBrowser visual checkは本Taskの対象外。
- macOS以外のOSにおける`cp -R`とSymbolic linkの挙動は未確認。
- bundled `quick_validate.py`は`bootstrap-development-harness`で使用している`disable-model-invocation`を未対応Keyとして拒否するため、この1 Skillだけ同validatorでは確認できない。Codex用`agents/openai.yaml`とportable linkは確認済み。
