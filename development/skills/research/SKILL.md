---
name: research
description: 外部API、Framework、Library、Architecture選定を一次情報で調査し、実装判断に使える根拠付き結論を残す。記憶だけでは変動し得る技術仕様や複数案の比較に使用する。
---

# Research

外部仕様に依存する判断は、実装前にPrimary Sourceで確認する。検索結果の要約やLLMの記憶を根拠の終点にしない。

## 進め方

1. 調査質問、判断に使う基準、対象Version、期限、成果物の読者を定義する。
2. Lockfile、Manifest、設定、実装から実際の製品名とVersionを特定する。
3. 公式Documentation、仕様書、Repository source、公式Example/Testの順に確認する。技術質問では一次情報を優先する。
4. 主張ごとに根拠を対応付け、事実、推論、未確認事項を分ける。Version差、非推奨、制約、Security上の注意を記録する。
5. 複数案は同じ評価軸で比較し、選択理由と捨てたTrade-offを示す。
6. 実装へ渡す場合は、適用範囲、最小例、検証方法、参照日時を記録する。

## 成果物

既存規約がなければ`docs/research/<topic>.md`へ保存する。各重要な主張の近くにSource URLまたはRepository内の参照位置を置く。

## 完了条件

- 対象Versionと調査質問が明記されている。
- 結論を支える一次情報が追跡可能である。
- 事実と推論、確認できなかった事項が分離されている。
- 実装担当者が追加の推測なしに採用可否と検証方法を判断できる。
