# Claude Codeでの実行

Project Rootの`.claude/agents/`にある役割定義を使用する。

| Agent | 用途 | model / effort |
|---|---|---|
| `architecture-designer` | 設計と実装計画 | Opus / high |
| `implementation-worker` | Task実装と検証 | Sonnet / medium |
| `task-reviewer` | Taskの二軸レビュー | Opus / high |
| `final-reviewer` | 全体レビュー | Opus / high |

Taskが複数ファイルの統合や難しいデバッグを含む場合は、`implementation-worker`の呼び出し時effortを`high`へ上げる。Architecture判断が残るTaskは実装担当へ渡さず、`architecture-designer`へ戻す。

Agentを呼び出すときは、要求をPromptへ展開せず、Brief、報告先、差分または基準点の絶対パスを渡す。モデルの実効値が組織のallowlistや環境設定により置換された場合は、その表示を確認して`ledger.md`へ記録する。

並列実装では各Agentへ`isolation: worktree`相当の分離を与える。逐次実行でも、Reviewerは実装担当とは別の新しいContextで起動する。
