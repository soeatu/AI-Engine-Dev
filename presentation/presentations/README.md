# 完成資料一覧

完成版またはレビュー対象のPowerPoint資料を、資料ごとのフォルダに置きます。PPTXを開くだけならこのフォルダを見れば足ります。修正・再生成は生成元のDeck projectで行います。

| 資料 | 対象読者 | ファイル | 生成元 |
|---|---|---|---|
| AI-Engine-Dev 利用ガイド（43枚） | AI-Engine-Devを使い始める職場の同僚 | [`AI-Engine-Dev利用ガイド.pptx`](ai-engine-dev-workspace-guide/AI-Engine-Dev利用ガイド.pptx) | [`harness/projects/ai-engine-dev-workspace-guide/`](../harness/projects/ai-engine-dev-workspace-guide/) |
| Codex CLI・Claude Code Foundry接続ガイド（36枚） | Codex CLI・Claude Codeを初めて導入するWindows開発者 | [`Codex-ClaudeCode-Foundry接続ガイド.pptx`](codex-claude-code-azure-foundry-setup/Codex-ClaudeCode-Foundry接続ガイド.pptx)、付属スクリプト [`computer_use_loop.py`](codex-claude-code-azure-foundry-setup/computer_use_loop.py) | [`harness/projects/codex-claude-code-azure-foundry-setup/`](../harness/projects/codex-claude-code-azure-foundry-setup/) |

## 置き方

```text
presentations/
├── README.md                      # この一覧
└── <deck-id>/                     # 生成元の harness/projects/<deck-id>/ と同じ名前
    ├── <資料タイトル>.pptx        # output/deck.pptx のコピー
    └── 付属ファイル               # 資料から参照するスクリプトなど（必要な場合のみ）
```

- フォルダ名は生成元のDeck project名と揃え、どの`build.ts`から作られたかを辿れるようにする。
- PPTXのファイル名は、開く人が中身を判断できる資料タイトルにする。
- 資料が「同じフォルダにある」と案内する付属ファイルは、PPTXと同じフォルダに置く。
- 再生成したら`output/deck.pptx`をここへコピーし直し、この一覧の枚数と説明を更新する。
- 根拠、Build report、QA reportは生成元の`output/`に残し、ここには複製しない。
