# UI/UX Pro Max

UI/UX設計、実装、レビューを支援する検索型Skillです。79 searchable styles（50 active）、192 product palettes / reasoning profiles、74 font pairings、119 UX guidelines、25 chart types、22 technology stacksを、Python 3標準ライブラリだけで検索できます。

## 配布元

- Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Version: `2.13.0`
- Reference revision: `b2ac9b2aa1c3bd6bb748b4b0f79c90319d50e0da`（2026-09-06確認）
- License: MIT（[`LICENSE`](LICENSE)）

`SKILL.md`、検索Runtime、データ、参照文書、保守Script、Fixtureを含むTestを一つのPackageとして収録しています。上流のPlugin専用Pathは、配置先に依存せず利用できる`<skill-directory>`基準へ調整しています。

## 使い方

Agentからは[`SKILL.md`](SKILL.md)を呼び出します。検索Runtimeを直接確認する場合は、`<skill-directory>`をこのREADMEがあるDirectoryの絶対Pathへ置き換えます。

```bash
python3 "<skill-directory>/scripts/search.py" "accessible dashboard" --domain ux
python3 "<skill-directory>/scripts/search.py" "responsive layout" --stack react
python3 "<skill-directory>/scripts/search.py" "finance dashboard trusted" --design-system -p "Finance Dashboard"
```

Design systemを保存する操作はProject内へFileを作成します。既存の`MASTER.md`を更新する`--force`は、利用者の明示承認なしに実行しません。

## 検証

```bash
python3 "<skill-directory>/scripts/validate_data.py"
python3 -m unittest discover -s "<skill-directory>/scripts/tests" -p 'test_*.py'
```

このSkillの検索結果は設計候補とチェック観点です。要求・仕様、一次資料、実装Test、実機確認、PowerPointの構造検査や表示QAを置き換えません。
