# Archify

Archifyは、システム開発で使うArchitecture、Workflow、Sequence、Data Flow、Lifecycle図を、型付きJSONから検証済みの自己完結HTML/SVGへ変換する補助Skillです。標準の`architecture-design`を置き換えず、設計判断や実装前後の構造を共有する成果物を作るときに使用します。

## 収録内容

- `SKILL.md`: Agentが読む正本の手順
- `bin/`: JSONの検証、HTML生成、比較、ブラウザ確認のCLI
- `schemas/`: 5種類の図のJSON Schema
- `renderers/`: HTML/SVGレンダラーと検証処理
- `references/`: 作図、配置、Delivery、Viewerの詳細契約
- `examples/`、`test/`: 形状例と回帰検証

上流のパッケージ構造を保つ必要があるため、`SKILL.md`だけを別コピーして使用しません。

## 使用場面

標準フローでは次の位置で補助的に使います。

```text
architecture-design
  → archify（設計図・構造図・設計差分が必要な場合）
  → implementation-planning / tdd / implementation
  → code-review（必要に応じてArchifyの図と実装差分を照合）
```

実装や運用の事実を図へ反映する場合は、推測で補完せず、対象Projectのコード、仕様、設定、固定Commitを根拠にします。図の検証成功は、設計の正しさや本番構成を証明するものではありません。

## 利用方法

このワークスペースでは、このディレクトリを正本として次のファイルを明示参照します。

```text
development/skills/archify/SKILL.md
```

CLIを実行するときは、このSkillディレクトリを作業Directoryとして実行します。

```bash
cd development/skills/archify
node bin/archify.mjs doctor
node bin/archify.mjs demo /tmp/archify-demo
```

Node.js 18以上が必要です。候補JSONの編集後は`validate`、HTMLを納品するときは`deliver`、納品後のブラウザ挙動確認が必要な場合は`visual-check`を使います。ブラウザ確認と人による視覚レビューは別の証拠として記録します。

上流Skillの更新確認は固定マニフェストへの任意のHTTP GETを行います。ネットワークアクセスと更新確認を無効にする場合は、`ARCHIFY_UPDATE_CHECK_DISABLED=1`を設定します。更新確認は自動更新やインストールを行いません。

## 固定版

- Upstream: https://github.com/tt-a1i/archify
- Version: `v2.16.0`
- Revision: `c826e6c3a7abad19c0f3cd1ca57207d54b1ad8de`
- License: MIT

更新時は、上流のリリース、`SKILL.md`、ランタイム、Schema、Examples、Tests、ライセンスを確認し、一覧と`THIRD_PARTY_NOTICES.md`を同じ変更単位で更新します。
