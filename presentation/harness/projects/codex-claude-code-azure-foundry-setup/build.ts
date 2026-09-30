/**
 * Codex CLI / Claude Code 導入とMicrosoft Foundry（旧Azure AI Foundry）接続手順
 *
 *   npm run cli -- build --script projects/codex-claude-code-azure-foundry-setup/build.ts
 *
 * セクション順は brief.txt のセクションマップと一致させる。出典は source-notes.txt。
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Presentation } from "../../src/index.js";
import {
  cardsSlide,
  codeBulletsSlide,
  codeSlide,
  connectionSlide,
  coverSlide,
  flowSlide,
  sectionSlide,
  sourcesSlide,
  stepsSlide,
  tableSlide
} from "./custom.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const deck = new Presentation({
  title: "Codex CLI / Claude Code 導入とMicrosoft Foundry接続手順",
  templateLibrary: "templates",
  projectDir: HERE
});

let page = 0;
const next = () => ++page;

// ── [cover] ─────────────────────────────────────────────
next();
deck.addCustomSlide(coverSlide({
  overline: "Windows 開発者向け手順書",
  title: "Codex CLI・Claude Code\nFoundry接続ガイド",
  subtitle: "Microsoft Foundry（旧 Azure AI Foundry）への接続まで\n2026年9月17日時点の公式ドキュメントに基づく"
}));

// ── [overview] ──────────────────────────────────────────
const OVERVIEW = "全体像";
deck.addCustomSlide(flowSlide({
  pageNum: next(),
  label: OVERVIEW,
  title: "4ステップで両CLIを接続する",
  steps: [
    { heading: "デプロイ", body: "GPT系\nClaude系\n画像モデル\nを配置" },
    { heading: "導入", body: "PowerShellで\n2つのCLIを\nインストール" },
    { heading: "接続設定", body: "Codex:\nconfig.toml\nClaude Code:\n環境変数" },
    { heading: "動作確認", body: "codex exec\n/status\nで応答を確認" }
  ]
}));

deck.addCustomSlide(connectionSlide({
  pageNum: next(),
  label: OVERVIEW,
  title: "CLIごとに接続先URLが異なる",
  rows: [
    {
      cli: "Codex CLI",
      via: "config.toml",
      target: "GPT系デプロイ",
      host: "<resource>.openai.azure.com",
      path: "/openai/v1",
      tone: "accent"
    },
    {
      cli: "Claude Code",
      via: "環境変数",
      target: "Claude系デプロイ",
      host: "<resource>.services.ai.azure.com",
      path: "/anthropic",
      tone: "accent2"
    }
  ],
  note: "<resource> は自分のFoundryリソース名に置き換える"
}));

// ── [prepare] ───────────────────────────────────────────
const PREPARE = "準備";
deck.addCustomSlide(tableSlide({
  pageNum: next(),
  label: PREPARE,
  title: "作業前に前提条件を揃える",
  header: ["項目", "必要なもの"],
  colW: [1.9, 6.85],
  rowH: 0.48,
  rows: [
    ["Azure", "Foundryを利用できるサブスクリプション"],
    ["作成権限", "リソースとデプロイを作成できる権限（Contributor など）"],
    ["利用者ロール", "Azure AI User または Cognitive Services User"],
    ["Windows", "Claude Code: Windows 10 1809以降 / Codex: Windows 11"],
    ["ツール", "Git for Windows（推奨）、Azure CLI（Entra ID利用時）"],
    ["Python", "Computer Use: Python 3 と Playwright"]
  ],
  note: "Codex CLIのMS Learn手順はWindowsの前提をWSL2としている"
}));

deck.addCustomSlide(stepsSlide({
  pageNum: next(),
  label: PREPARE,
  title: "Foundryでモデルをデプロイする",
  steps: [
    "ai.azure.com でプロジェクトを作成し、リソース名を控える",
    "Codex用: GPT系モデル（例: gpt-5.3-codex）をデプロイ",
    "Claude Code用: Opus / Sonnet / Haiku（特定版）をデプロイ",
    "画像用: gpt-image-2.5-flare または sunburst をデプロイ",
    "Computer Use用: gpt-5.6-sol / terra / luna をデプロイ"
  ],
  note: "各デプロイ名を控え、キーは「Endpoints and keys」から取得"
}));

deck.addCustomSlide(tableSlide({
  pageNum: next(),
  label: PREPARE,
  title: "設定に使う4つの値を控える",
  header: ["値", "Codex CLIでの用途", "Claude Codeでの用途"],
  colW: [1.85, 2.9, 4.0],
  rowH: 0.58,
  rows: [
    ["リソース名", "base_url の一部", "ANTHROPIC_FOUNDRY_RESOURCE"],
    ["デプロイ名", "model", "ANTHROPIC_DEFAULT_*_MODEL"],
    ["APIキー", "AZURE_OPENAI_API_KEY", "ANTHROPIC_FOUNDRY_API_KEY"],
    ["エンドポイント", "base_url", "リソース名で代替できる"]
  ],
  note: "APIキーは資料・チャット・リポジトリに貼らず、環境変数だけに設定する"
}));

// ── [codex] ─────────────────────────────────────────────
const CODEX = "Part 1  Codex CLI";
next();
deck.addCustomSlide(sectionSlide({
  part: "Part 1",
  title: "Codex CLI",
  lead: "インストール → config.toml → APIキー → 起動"
}));

deck.addCustomSlide(codeSlide({
  pageNum: next(),
  label: CODEX,
  title: "Codex CLIをインストールする",
  lead: "PowerShellで次のどちらかを実行し、バージョン表示で確認する",
  code: [
    "# 推奨: スタンドアロンインストーラー",
    "powershell -ExecutionPolicy ByPass -c `",
    "  \"irm https://chatgpt.com/codex/install.ps1 | iex\"",
    "# 代替: npm（Node.jsが必要）",
    "npm install -g @openai/codex",
    "codex --version"
  ].join("\n"),
  notes: [
    "ネイティブ環境で問題が出る場合は、WSL2上でLinux向け手順を使う"
  ]
}));

deck.addCustomSlide(codeSlide({
  pageNum: next(),
  label: CODEX,
  title: "config.tomlでAzureを指定する",
  lead: "%USERPROFILE%\\.codex\\config.toml に次を記述する",
  code: [
    "model = \"<deployment>\"",
    "model_provider = \"azure\"",
    "model_reasoning_effort = \"medium\"",
    "[model_providers.azure]",
    "name = \"Azure OpenAI\"",
    "base_url = \"https://<resource>.openai.azure.com/openai/v1\"",
    "env_key = \"AZURE_OPENAI_API_KEY\"",
    "wire_api = \"responses\""
  ].join("\n"),
  notes: [
    "env_key にはキーではなく環境変数名、base_url の末尾は /openai/v1"
  ]
}));

deck.addCustomSlide(codeSlide({
  pageNum: next(),
  label: CODEX,
  title: "APIキーを環境変数で渡して起動",
  lead: "setx はユーザー環境変数に保存し、新しいターミナルから有効になる",
  code: [
    "setx AZURE_OPENAI_API_KEY \"<api-key>\"",
    "",
    "# 新しいPowerShellを開いてから実行",
    "cd <project>",
    "codex",
    "# 非対話で疎通を確認する場合",
    "codex exec \"このリポジトリの構成を説明して\""
  ].join("\n"),
  notes: [
    "Codex CLIは現時点でEntra ID認証に非対応（MS Learn）"
  ]
}));

// ── [claude-code] ───────────────────────────────────────
const CLAUDE = "Part 2  Claude Code";
next();
deck.addCustomSlide(sectionSlide({
  part: "Part 2",
  title: "Claude Code",
  lead: "インストール → 環境変数 → モデル固定 → 認証の選択"
}));

deck.addCustomSlide(codeSlide({
  pageNum: next(),
  label: CLAUDE,
  title: "Claude Codeをインストールする",
  lead: "PowerShellで実行する（管理者権限は不要）",
  code: [
    "# 推奨: ネイティブインストーラー（自動更新）",
    "irm https://claude.ai/install.ps1 | iex",
    "# 代替: WinGet（自動更新されない）",
    "winget install Anthropic.ClaudeCode",
    "claude --version",
    "claude doctor"
  ].join("\n"),
  notes: [
    "Git for Windowsを入れると、Claude CodeがBashツールを使える"
  ]
}));

deck.addCustomSlide(codeSlide({
  pageNum: next(),
  label: CLAUDE,
  title: "環境変数でFoundryを有効にする",
  lead: "ユーザー環境変数に設定し、新しいターミナルで claude を起動する",
  code: [
    "# Foundry連携を有効化",
    "setx CLAUDE_CODE_USE_FOUNDRY 1",
    "setx ANTHROPIC_FOUNDRY_RESOURCE \"<resource>\"",
    "# APIキー認証（Entra IDを使う場合は設定しない）",
    "setx ANTHROPIC_FOUNDRY_API_KEY \"<api-key>\""
  ].join("\n"),
  notes: [
    "リソース名の代わりに ANTHROPIC_FOUNDRY_BASE_URL でURL全体も指定できる",
    "Foundryには対話式の設定ウィザードがなく、環境変数だけで設定する"
  ]
}));

deck.addCustomSlide(codeBulletsSlide({
  pageNum: next(),
  label: CLAUDE,
  title: "モデルはデプロイ名で固定する",
  code: [
    "setx ANTHROPIC_DEFAULT_OPUS_MODEL \"<opus-deployment>\"",
    "setx ANTHROPIC_DEFAULT_SONNET_MODEL \"<sonnet-deployment>\"",
    "setx ANTHROPIC_DEFAULT_HAIKU_MODEL \"<haiku-deployment>\""
  ].join("\n"),
  bullets: [
    "未設定だと opus などの別名が既定モデルになり、未デプロイなら失敗する",
    "Foundryは起動時にモデルを確認しないため、事前に固定しておく",
    "Haikuを設定すると、タイトル生成などの補助処理に使われる"
  ]
}));

deck.addCustomSlide(cardsSlide({
  pageNum: next(),
  label: CLAUDE,
  title: "Entra IDならキー配布が不要",
  cards: [
    {
      heading: "設定手順",
      tone: "accent2",
      bullets: [
        "az login を実行する",
        "APIキーの環境変数を削除する",
        "Azure AI User などを付与する"
      ]
    },
    {
      heading: "動作のしくみ",
      tone: "accent3",
      bullets: [
        "キー未設定時はAzureの既定資格情報を使う",
        "トークンの直接指定も可能"
      ]
    }
  ],
  note: "トークンの直接指定: ANTHROPIC_FOUNDRY_AUTH_TOKEN（v2.1.203以降）"
}));

// ── [image-model] ───────────────────────────────────────
const IMAGE = "Part 3  画像モデル";
next();
deck.addCustomSlide(sectionSlide({
  part: "Part 3",
  title: "画像モデル",
  lead: "GPT-Image-2.5 をデプロイ → スクリプト → 環境変数 → CLIから実行"
}));

deck.addCustomSlide(tableSlide({
  pageNum: next(),
  label: IMAGE,
  title: "用途でflareとsunburstを選ぶ",
  header: ["モデル", "向いている用途"],
  colW: [3.3, 5.45],
  rowH: 0.8,
  rows: [
    ["gpt-image-2.5-flare", "高品質な画像を最も速く作る日常の生成"],
    ["gpt-image-2.5-sunburst", "最も高性能。編集の精度を重視する場合"],
    ["共通の指定", "quality は xhigh / max / auto も指定可。\nサイズは16px単位で長辺3,840pxまで"]
  ],
  note: "提供リージョンはMS Learnのリージョン一覧で確認する"
}));

deck.addCustomSlide(connectionSlide({
  pageNum: next(),
  label: IMAGE,
  title: "CLIはスクリプト経由で画像APIを呼ぶ",
  rows: [
    {
      cli: "Codex CLI\nClaude Code",
      via: "gen-image.ps1",
      target: "画像デプロイ（GPT-Image-2.5）",
      host: "<resource>.openai.azure.com",
      path: "/openai/v1/images/generations",
      tone: "accent"
    }
  ],
  note: "どちらのCLIも同じスクリプトを実行するため、設定は1回で済む"
}));

deck.addCustomSlide(codeSlide({
  pageNum: next(),
  label: IMAGE,
  title: "scripts\\gen-image.ps1 を作成する",
  lineSpacing: 20,
  code: [
    "param([string]$Prompt, [string]$Out = \"image.png\")",
    "$r = $env:AZURE_IMAGE_RESOURCE",
    "$uri = \"https://$r.openai.azure.com/openai/v1\" +",
    "  \"/images/generations?api-version=2025-04-01-preview\"",
    "$body = @{ model = $env:AZURE_IMAGE_DEPLOYMENT",
    "  prompt = $Prompt; size = \"1024x1024\" } | ConvertTo-Json",
    "$res = Invoke-RestMethod -Method Post -Uri $uri `",
    "  -Body ([Text.Encoding]::UTF8.GetBytes($body)) `",
    "  -ContentType \"application/json\" `",
    "  -Headers @{ \"api-key\" = $env:AZURE_IMAGE_API_KEY }",
    "[IO.File]::WriteAllBytes($Out,",
    "  [Convert]::FromBase64String($res.data[0].b64_json))"
  ].join("\n")
}));

deck.addCustomSlide(codeSlide({
  pageNum: next(),
  label: IMAGE,
  title: "環境変数を設定して試す",
  lead: "画像用リソースの値を設定し、新しいターミナルで実行する",
  code: [
    "setx AZURE_IMAGE_RESOURCE \"<resource>\"",
    "setx AZURE_IMAGE_DEPLOYMENT \"<image-deployment>\"",
    "setx AZURE_IMAGE_API_KEY \"<api-key>\"",
    "# 新しいPowerShellで実行",
    ".\\scripts\\gen-image.ps1 -Prompt \"浜辺の傘\" -Out umbrella.png"
  ].join("\n"),
  notes: [
    "flareとsunburstは AZURE_IMAGE_DEPLOYMENT の値で切り替える"
  ]
}));

deck.addCustomSlide(cardsSlide({
  pageNum: next(),
  label: IMAGE,
  title: "CLIにスクリプトの使い方を伝える",
  cards: [
    {
      heading: "Codex CLI",
      tone: "accent",
      bullets: [
        "AGENTS.md に gen-image.ps1 の使い方を書く",
        "ネット接続を伴う実行は承認を求められる"
      ]
    },
    {
      heading: "Claude Code",
      tone: "accent2",
      bullets: [
        "CLAUDE.md に同じ使い方を書く",
        "コマンド実行の許可を内容を見て承認する"
      ]
    }
  ],
  note: "依頼例:「gen-image.ps1 で表紙画像を作って」"
}));

// ── [computer-use] ──────────────────────────────────────
const CU = "Part 4  Computer Use";
next();
deck.addCustomSlide(sectionSlide({
  part: "Part 4",
  title: "Computer Use",
  lead: "GPT-5.6系をデプロイ → Python準備 → 操作ループ → 安全対策"
}));

deck.addCustomSlide(tableSlide({
  pageNum: next(),
  label: CU,
  title: "CLIではなくAPIから使う",
  header: ["使い方", "Foundryでの利用"],
  colW: [5.6, 3.15],
  rowH: 0.8,
  rows: [
    ["Responses APIで操作ループを自作する", "使える"],
    ["Foundry Agent Service のComputer Useツール", "computer-use-preview のみ"],
    ["Codex CLI / Claude Code の組み込み機能", "使えない"]
  ],
  note: "GPT-5.6系（sol / terra / luna）とGPT-5.5は利用申請なしで使える"
}));

deck.addCustomSlide(flowSlide({
  pageNum: next(),
  label: CU,
  title: "操作ループは自分で実装する",
  steps: [
    { heading: "依頼", body: "依頼文と\n画面の\nスクショを送る" },
    { heading: "提案", body: "モデルが\n操作を\ncomputer_call\nで返す" },
    { heading: "実行", body: "Playwrightで\nクリックや\n入力を行う" },
    { heading: "返送", body: "操作後の\nスクショを返し\n繰り返す" }
  ]
}));

deck.addCustomSlide(codeSlide({
  pageNum: next(),
  label: CU,
  title: "PythonとPlaywrightを準備する",
  lead: "GPT-5.6系のデプロイ名とキーを設定してから環境を作る",
  code: [
    "setx AZURE_CU_RESOURCE \"<resource>\"",
    "setx AZURE_CU_DEPLOYMENT \"<gpt-5.6-deployment>\"",
    "setx AZURE_CU_API_KEY \"<api-key>\"",
    "# 新しいPowerShellで実行",
    "py -m venv .venv",
    ".venv\\Scripts\\Activate.ps1",
    "pip install openai playwright",
    "playwright install chromium"
  ].join("\n"),
  notes: [
    "スクリプト全文は資料と同じフォルダの computer_use_loop.py"
  ]
}));

deck.addCustomSlide(codeSlide({
  pageNum: next(),
  label: CU,
  title: "最初の依頼で画面を渡す",
  lineSpacing: 20,
  code: [
    "client = OpenAI(",
    "    api_key=os.environ[\"AZURE_CU_API_KEY\"],",
    "    base_url=f\"https://{RESOURCE}.openai.azure.com\"",
    "             \"/openai/v1/\")",
    "",
    "response = client.responses.create(",
    "    model=MODEL,  # GPT-5.6系のデプロイ名",
    "    tools=[{\"type\": \"computer\"}],",
    "    input=[{\"role\": \"user\", \"content\": [",
    "        {\"type\": \"input_text\", \"text\": task},",
    "        {\"type\": \"input_image\",",
    "         \"image_url\": screenshot(page)}]}])"
  ].join("\n")
}));

deck.addCustomSlide(codeSlide({
  pageNum: next(),
  label: CU,
  title: "computer_callを実行して返す",
  lineSpacing: 19,
  code: [
    "for step in range(MAX_STEPS):",
    "    calls = [o for o in response.output",
    "             if o.type == \"computer_call\"]",
    "    if not calls: break  # 提案がなければ完了",
    "    for action in calls[0].actions:",
    "        run_action(page, action)  # Playwrightで実行",
    "    shot = {\"type\": \"computer_screenshot\",",
    "            \"image_url\": screenshot(page)}",
    "    response = client.responses.create(",
    "        model=MODEL, previous_response_id=response.id,",
    "        tools=[{\"type\": \"computer\"}], input=[{",
    "            \"type\": \"computer_call_output\",",
    "            \"call_id\": calls[0].call_id, \"output\": shot}])"
  ].join("\n")
}));

deck.addCustomSlide(tableSlide({
  pageNum: next(),
  label: CU,
  title: "安全対策を組み込んで動かす",
  header: ["対策", "内容"],
  colW: [2.3, 6.45],
  rowH: 0.58,
  rows: [
    ["実行環境", "機密データのない検証用VMで動かす"],
    ["安全チェック", "pending_safety_checks は人が確認して承認する"],
    ["回数の上限", "MAX_STEPS で止めて人に制御を戻す"],
    ["画面サイズ", "1440×900 または 1600×900 でクリック精度を保つ"],
    ["トークン", "reasoning.context を current_turn にして消費を抑える"]
  ],
  note: "実行: python computer_use_loop.py \"依頼内容\""
}));

// ── [verify-troubleshoot] ───────────────────────────────
const VERIFY = "確認と対処";
deck.addCustomSlide(tableSlide({
  pageNum: next(),
  label: VERIFY,
  title: "4つの接続をそれぞれ確認する",
  header: ["対象", "実行すること", "期待する結果"],
  colW: [1.75, 3.5, 3.5],
  rowH: 0.7,
  rows: [
    ["Codex CLI", "codex --version\ncodex exec \"hello\"", "応答が返る"],
    ["Claude Code", "claude doctor\n起動して /status", "Microsoft Foundry と表示"],
    ["画像モデル", "gen-image.ps1 -Prompt \"test\"", "指定したPNGが保存される"],
    ["Computer Use", "python computer_use_loop.py\n\"依頼内容\"", "ブラウザ操作後に結果が表示"]
  ],
  note: "setx の後は、新しく開いたターミナルで確認する"
}));

deck.addCustomSlide(tableSlide({
  pageNum: next(),
  label: VERIFY,
  title: "Codexのエラーは設定3点を確認",
  header: ["症状", "確認すること"],
  colW: [2.6, 6.15],
  rowH: 0.95,
  rows: [
    ["401 / 403", "AZURE_OPENAI_API_KEY が設定済みか。env_key にキーを直接書いていないか"],
    ["ENOTFOUND / 404", "base_url のリソース名とドメイン、末尾の /openai/v1"],
    ["Azure設定が無視される", "model_provider = \"azure\" と [model_providers.azure] があるか"]
  ]
}));

deck.addCustomSlide(tableSlide({
  pageNum: next(),
  label: VERIFY,
  title: "Claude Codeは認証と名前を確認",
  header: ["症状", "確認すること"],
  colW: [2.9, 5.85],
  rowH: 0.72,
  rows: [
    ["ChainedTokenCredential authentication failed", "az login でEntra IDを構成するか、APIキーを設定する"],
    ["接続エラーが続く", "リソース名（ANTHROPIC_FOUNDRY_RESOURCE）"],
    ["モデル呼び出しが失敗する", "デプロイ名と ANTHROPIC_DEFAULT_*_MODEL"],
    ["設定が反映されない", "setx の後に新しいターミナルを開いたか"]
  ]
}));

deck.addCustomSlide(tableSlide({
  pageNum: next(),
  label: VERIFY,
  title: "画像生成はキー・名前・サイズを確認",
  header: ["症状", "確認すること"],
  colW: [2.9, 5.85],
  rowH: 0.62,
  rows: [
    ["401", "AZURE_IMAGE_API_KEY が画像用リソースのキーか"],
    ["404", "AZURE_IMAGE_RESOURCE とデプロイ名が正しいか"],
    ["400（サイズ）", "16px単位、長辺3,840px以下、縦横比1:3〜3:1か"],
    ["日本語が文字化けする", "本文をUTF-8のバイト列で送っているか"],
    ["スクリプトを実行できない", "-ExecutionPolicy Bypass -File で起動する"]
  ]
}));

deck.addCustomSlide(tableSlide({
  pageNum: next(),
  label: VERIFY,
  title: "Computer Useは応答と画面を確認",
  header: ["症状", "確認すること"],
  colW: [3.6, 5.15],
  rowH: 0.8,
  rows: [
    ["computer_call が返らない", "tools に computer を指定し、画面操作が必要な依頼か"],
    ["404", "AZURE_CU_RESOURCE とデプロイ名が正しいか"],
    ["クリック位置がずれる", "画面サイズを1440×900などにしているか"],
    ["途中で止まる", "MAX_STEPS の上限や安全チェックで中断していないか"]
  ]
}));

// ── [security-close] ────────────────────────────────────
deck.addCustomSlide(tableSlide({
  pageNum: next(),
  label: "運用",
  title: "キーと権限は最小限で運用する",
  header: ["観点", "実践すること"],
  colW: [1.9, 6.85],
  rowH: 0.7,
  rows: [
    ["キー", "ファイルやリポジトリに書かず、漏えい時は再生成する"],
    ["権限", "呼び出し用ロールだけ付与し、Claude CodeはEntra IDで"],
    ["自律実行", "フルアクセスモードはサンドボックス等と併用する"],
    ["Computer Use", "検証用VMで動かし、安全チェックは人が承認する"]
  ]
}));

deck.addCustomSlide(sourcesSlide({
  pageNum: next(),
  title: "出典（1/2・9月17日確認）",
  sources: [
    { name: "Claude Code on Microsoft Foundry", url: "code.claude.com/docs/en/microsoft-foundry" },
    { name: "Claude Code Advanced setup", url: "code.claude.com/docs/en/setup" },
    { name: "Codex with Azure OpenAI in Microsoft Foundry Models", url: "learn.microsoft.com/azure/foundry/openai/how-to/codex" },
    { name: "openai/codex README", url: "github.com/openai/codex" },
    { name: "Codex Advanced configuration", url: "learn.chatgpt.com/docs/config-file/config-advanced" }
  ]
}));

deck.addCustomSlide(sourcesSlide({
  pageNum: next(),
  title: "出典（2/2・9月17日確認）",
  sources: [
    { name: "How to use image generation models from OpenAI", url: "learn.microsoft.com/azure/foundry/openai/how-to/dall-e" },
    { name: "Computer Use in Azure OpenAI (classic)", url: "learn.microsoft.com/azure/ai-foundry/openai/how-to/computer-use" },
    { name: "Azure OpenAI reasoning models", url: "learn.microsoft.com/azure/foundry/openai/how-to/reasoning" },
    { name: "Use the computer use tool for agents", url: "learn.microsoft.com/azure/foundry/agents/how-to/tools/computer-use" },
    { name: "Claude Code computer use", url: "code.claude.com/docs/en/computer-use" }
  ]
}));

await deck.render({
  output: "output/deck.pptx",
  report: "output/build-report.md",
  screenshots: "output/screenshots"
});
