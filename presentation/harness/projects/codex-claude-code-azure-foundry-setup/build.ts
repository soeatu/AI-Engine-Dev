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
  codeFlowSlide,
  codeMappingSlide,
  compareCardsSlide,
  coverSlide,
  endpointMapSlide,
  faultMapSlide,
  fileMapSlide,
  flowSlide,
  hubSlide,
  iconCardsSlide,
  iconListSlide,
  lanesSlide,
  railCodeSlide,
  routeMapSlide,
  sectionSlide,
  sourcesSlide,
  stageFlowSlide,
  statusRowsSlide,
  tableSlide,
  verifyLanesSlide
} from "./custom.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const deck = new Presentation({
  title: "Codex CLI / Claude Code 導入とMicrosoft Foundry接続手順",
  templateLibrary: "templates",
  projectDir: HERE
});

let page = 0;
const next = () => ++page;

// 案内スライドと扉に出すページ範囲。末尾で実際のページと照合する。
const PAGES = {
  prepare: [3, 8],
  codex: [9, 13],
  claude: [14, 19],
  image: [20, 25],
  cu: [26, 32],
  close: [33, 34],
  sources: [35, 36]
} as const;
type Section = keyof typeof PAGES;
const pages = (range: readonly [number, number]) => `p.${range[0]}–${range[1]}`;
const starts: Partial<Record<Section, number>> = {};
const mark = (section: Section) => { starts[section] = page + 1; };

// ── [cover] ─────────────────────────────────────────────
next();
deck.addCustomSlide(coverSlide({
  overline: "Windows 開発者向け手順書",
  title: "Codex CLI・Claude Code\nFoundry接続ガイド",
  subtitle: "Microsoft Foundry（旧 Azure AI Foundry）への接続まで\n2026年9月17日時点の公式ドキュメントに基づく"
}));

// ── [overview] ──────────────────────────────────────────
const OVERVIEW = "全体像";
deck.addCustomSlide(routeMapSlide({
  pageNum: next(),
  label: OVERVIEW,
  title: "必要なPartだけ読めばよい",
  tiers: [
    { who: "全員", boxes: [{ tag: "共通", name: "準備", detail: "全体像・前提・デプロイ・控える値", pages: pages(PAGES.prepare), tone: "ink" }] },
    {
      who: "使うCLIだけ",
      boxes: [
        { tag: "Part 1", name: "Codex CLI", pages: pages(PAGES.codex), tone: "accent" },
        { tag: "Part 2", name: "Claude Code", pages: pages(PAGES.claude), tone: "accent2" }
      ]
    },
    {
      who: "必要な場合",
      boxes: [
        { tag: "Part 3", name: "画像モデル", pages: pages(PAGES.image), tone: "accent3" },
        { tag: "Part 4", name: "Computer Use", pages: pages(PAGES.cu), tone: "ink" }
      ]
    },
    {
      who: "全員",
      boxes: [
        { tag: "最後", name: "確認と運用", pages: pages(PAGES.close), tone: "ink" },
        { tag: "参考", name: "出典", pages: pages(PAGES.sources), tone: "muted" }
      ]
    }
  ]
}));

mark("prepare");
deck.addCustomSlide(tableSlide({
  pageNum: next(),
  label: OVERVIEW,
  title: "どのPartも4ステップで進む",
  header: ["Part", "1 デプロイ", "2 導入", "3 設定", "4 確認"],
  colW: [2.05, 1.95, 1.65, 1.5, 1.6],
  rowH: 0.7,
  rows: [
    ["Part 1\nCodex CLI", "GPT系モデル", "Codex CLI", "config.toml\nAPIキー", "codex exec"],
    ["Part 2\nClaude Code", "Claude系モデル", "Claude Code", "環境変数", "/status"],
    ["Part 3\n画像モデル", "GPT-Image-2.5", "スクリプト", "環境変数", "PNGを保存"],
    ["Part 4\nComputer Use", "GPT-5.6系", "Python\nPlaywright", "環境変数", "ブラウザ操作"]
  ],
  note: "各Partの扉に、そのPartで設定する値をまとめている"
}));

deck.addCustomSlide(endpointMapSlide({
  pageNum: next(),
  label: OVERVIEW,
  title: "接続先のURLは2種類",
  endpoints: [
    {
      heading: "GPT系・画像・Computer Use のデプロイ",
      host: "<resource>.openai.azure.com",
      path: "/openai/v1",
      tone: "accent",
      clients: [
        { tag: "Part 1", name: "Codex CLI" },
        { tag: "Part 3", name: "画像生成" },
        { tag: "Part 4", name: "Computer Use" }
      ]
    },
    {
      heading: "Claude系デプロイ",
      host: "<resource>.services.ai.azure.com",
      path: "/anthropic",
      tone: "accent2",
      clients: [{ tag: "Part 2", name: "Claude Code" }]
    }
  ],
  note: "<resource> は、そのPartで使うFoundryリソース名に置き換える"
}));

// ── [prepare] ───────────────────────────────────────────
const PREPARE = "準備";
deck.addCustomSlide(iconListSlide({
  pageNum: next(),
  label: PREPARE,
  title: "作業前に前提条件を揃える",
  items: [
    { icon: "cloud", heading: "Azure", body: "Foundryを利用できるサブスクリプション" },
    { icon: "shield-check", heading: "作成権限", body: "リソースとデプロイを作成できる権限（Contributor など）" },
    { icon: "user-check", heading: "利用者ロール", body: "Azure AI User または Cognitive Services User" },
    { icon: "monitor", heading: "Windows", tone: "accent2", body: "Claude Code: 10 1809以降 / Codex: Windows 11" },
    { icon: "wrench", heading: "ツール", tone: "accent2", body: "Git for Windows（推奨）、Azure CLI（Entra ID利用時）" },
    { icon: "code", heading: "Python", tone: "accent2", body: "Computer Use: Python 3 と Playwright" }
  ],
  note: "Codex CLIのMS Learn手順はWindowsの前提をWSL2としている"
}));

deck.addCustomSlide(hubSlide({
  pageNum: next(),
  label: PREPARE,
  title: "Foundryでモデルをデプロイする",
  hub: {
    icon: "cloud",
    heading: "Foundry",
    body: "ai.azure.com でプロジェクトを作成"
  },
  rows: [
    { deployment: "GPT系（例: gpt-5.3-codex）", consumer: "Codex CLI", icon: "terminal", tone: "accent" },
    { deployment: "Opus / Sonnet / Haiku\n（特定版）", consumer: "Claude Code", icon: "terminal", tone: "accent2" },
    { deployment: "gpt-image-2.5-flare\nまたは sunburst", consumer: "画像スクリプト", icon: "image", tone: "accent3" },
    { deployment: "gpt-5.6-sol / terra / luna", consumer: "Computer Use", icon: "mouse-pointer-click", tone: "ink" }
  ],
  note: "リソース名と各デプロイ名を控え、キーは「Endpoints and keys」から取得"
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

deck.addCustomSlide(fileMapSlide({
  pageNum: next(),
  label: PREPARE,
  title: "設定とスクリプトの置き場所",
  columns: [
    {
      caption: "ユーザーごとの設定",
      w: 3.7,
      nodes: [
        { name: "%USERPROFILE%\\", depth: 0, folder: true },
        { name: ".codex\\", depth: 1, folder: true },
        { name: "config.toml", depth: 2, tag: "Part 1", tone: "accent" }
      ],
      extra: { heading: "ユーザー環境変数", body: "setx で保存。キー・リソース名・デプロイ名" }
    },
    {
      caption: "作業するProjectの例",
      w: 4.75,
      nodes: [
        { name: "<project>\\", depth: 0, folder: true },
        { name: "AGENTS.md", depth: 1, tag: "Part 3", tone: "accent3" },
        { name: "CLAUDE.md", depth: 1, tag: "Part 3", tone: "accent3" },
        { name: "scripts\\", depth: 1, folder: true },
        { name: "gen-image.ps1", depth: 2, tag: "Part 3", tone: "accent3" },
        { name: "computer_use_loop.py", depth: 1, tag: "Part 4", tone: "ink" },
        { name: ".venv\\", depth: 1, folder: true, tag: "Part 4", tone: "ink" },
        { name: "umbrella.png", depth: 1 }
      ]
    }
  ],
  note: "Claude Codeの設定はファイルではなく環境変数だけ（Part 2）。Projectの配置は一例"
}));

// ── [codex] ─────────────────────────────────────────────
const CODEX = "Part 1  Codex CLI";
mark("codex");
next();
deck.addCustomSlide(sectionSlide({
  part: "Part 1",
  title: "Codex CLI",
  lead: "インストール → config.toml → APIキーと起動 → うまくいかないとき",
  pages: pages(PAGES.codex),
  values: ["%USERPROFILE%\\.codex\\config.toml", "AZURE_OPENAI_API_KEY"]
}));

deck.addCustomSlide(codeFlowSlide({
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
  flow: [
    { text: "PowerShell", icon: "terminal" },
    { text: "インストール", icon: "download" },
    { text: "codex --version", icon: "circle-check", mono: true, weight: 1.35 }
  ],
  note: "ネイティブ環境で問題が出る場合は、WSL2上でLinux向け手順を使う"
}));

deck.addCustomSlide(codeFlowSlide({
  pageNum: next(),
  label: CODEX,
  title: "config.tomlでAzureを指定する",
  lead: "%USERPROFILE%\\.codex\\config.toml に次を記述する",
  lineSpacing: 19,
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
  flow: [
    { text: "config.toml", icon: "file-cog", mono: true },
    { text: "env_key の変数", icon: "key-round" },
    { text: "base_url へ接続", icon: "cloud" }
  ]
}));

deck.addCustomSlide(codeFlowSlide({
  pageNum: next(),
  label: CODEX,
  title: "APIキーを環境変数で渡して起動",
  code: [
    "setx AZURE_OPENAI_API_KEY \"<api-key>\"",
    "",
    "# 新しいPowerShellを開いてから実行",
    "cd <project>",
    "codex",
    "# 非対話で疎通を確認する場合",
    "codex exec \"このリポジトリの構成を説明して\""
  ].join("\n"),
  flow: [
    { text: "setxで保存", icon: "save" },
    { text: "新しいターミナルで起動", icon: "terminal" },
    { text: "Foundry", icon: "cloud" }
  ],
  note: "Codex CLIは現時点でEntra ID認証に非対応（MS Learn）"
}));

deck.addCustomSlide(faultMapSlide({
  pageNum: next(),
  label: CODEX,
  title: "Codexのエラーは設定3点を確認",
  chainLabel: "確認する箇所",
  rows: [
    { part: "プロバイダー", icon: "file-cog", symptom: "Azure設定が無視される → 次の2つがあるか", check: "model_provider = \"azure\" と [model_providers.azure]" },
    { part: "APIキー", icon: "key-round", symptom: "401 / 403", check: "AZURE_OPENAI_API_KEY が設定済みか\nenv_key にキーを直接書いていないか" },
    { part: "base_url", icon: "link", symptom: "ENOTFOUND / 404", check: "base_url のリソース名とドメイン、末尾の /openai/v1" }
  ]
}));

// ── [claude-code] ───────────────────────────────────────
const CLAUDE = "Part 2  Claude Code";
mark("claude");
next();
deck.addCustomSlide(sectionSlide({
  part: "Part 2",
  title: "Claude Code",
  lead: "インストール → 環境変数 → モデル固定 → 認証の選択 → うまくいかないとき",
  pages: pages(PAGES.claude),
  values: ["CLAUDE_CODE_USE_FOUNDRY", "ANTHROPIC_FOUNDRY_RESOURCE", "ANTHROPIC_FOUNDRY_API_KEY", "ANTHROPIC_DEFAULT_*_MODEL"]
}));

deck.addCustomSlide(codeFlowSlide({
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
  flow: [
    { text: "インストール", icon: "download" },
    { text: "claude --version", icon: "circle-check", mono: true, weight: 1.45 },
    { text: "claude doctor", icon: "stethoscope", mono: true, weight: 1.3 }
  ],
  note: "Git for Windowsを入れると、Claude CodeがBashツールを使える"
}));

deck.addCustomSlide(codeFlowSlide({
  pageNum: next(),
  label: CLAUDE,
  title: "環境変数でFoundryを有効にする",
  code: [
    "# Foundry連携を有効化",
    "setx CLAUDE_CODE_USE_FOUNDRY 1",
    "setx ANTHROPIC_FOUNDRY_RESOURCE \"<resource>\"",
    "# APIキー認証（Entra IDを使う場合は設定しない）",
    "setx ANTHROPIC_FOUNDRY_API_KEY \"<api-key>\""
  ].join("\n"),
  flow: [
    { text: "setxで保存", icon: "save" },
    { text: "新しいターミナルで起動", icon: "terminal" },
    { text: "Foundry", icon: "cloud" }
  ],
  note: [
    "Foundryには設定ウィザードがなく、環境変数だけで設定する",
    "リソース名の代わりに ANTHROPIC_FOUNDRY_BASE_URL でURL全体も指定できる"
  ]
}));

deck.addCustomSlide(codeMappingSlide({
  pageNum: next(),
  label: CLAUDE,
  title: "モデルはデプロイ名で固定する",
  code: [
    "setx ANTHROPIC_DEFAULT_OPUS_MODEL \"<opus-deployment>\"",
    "setx ANTHROPIC_DEFAULT_SONNET_MODEL \"<sonnet-deployment>\"",
    "setx ANTHROPIC_DEFAULT_HAIKU_MODEL \"<haiku-deployment>\""
  ].join("\n"),
  mapLabel: { from: "Claude Codeの別名", to: "Foundryのデプロイ名" },
  rows: [
    { from: "opus", to: "<opus-deployment>" },
    { from: "sonnet", to: "<sonnet-deployment>" },
    { from: "haiku", to: "<haiku-deployment>", aside: "タイトル生成などの補助処理に使う" }
  ],
  note: "未設定だと別名のまま呼ばれ、未デプロイなら失敗する（起動時には確認されない）"
}));

deck.addCustomSlide(lanesSlide({
  pageNum: next(),
  label: CLAUDE,
  title: "Entra IDならキー配布が不要",
  lanes: [
    {
      name: "APIキー",
      caption: "キーを配る",
      tone: "muted",
      steps: [
        { text: "Claude Code", icon: "terminal" },
        { text: "環境変数のキー", icon: "key-round" },
        { text: "Foundry", icon: "cloud" }
      ]
    },
    {
      name: "Entra ID",
      caption: "キー不要",
      tone: "accent2",
      steps: [
        { text: "Claude Code", icon: "terminal" },
        { text: "既定の資格情報", icon: "user-check" },
        { text: "Foundry", icon: "cloud" }
      ]
    }
  ],
  stepsLabel: "設定手順",
  steps: ["az login", "キー変数を削除", "ロールを付与"],
  notes: [
    "ロールは Azure AI User などを付与する",
    "トークンの直接指定: ANTHROPIC_FOUNDRY_AUTH_TOKEN（v2.1.203以降）"
  ]
}));

deck.addCustomSlide(faultMapSlide({
  pageNum: next(),
  label: CLAUDE,
  title: "Claude Codeは認証と名前を確認",
  chainLabel: "確認する箇所",
  rows: [
    { part: "ターミナル", icon: "terminal", symptom: "設定が反映されない", check: "setx の後に新しいターミナルを開いたか" },
    { part: "認証", icon: "user-check", symptom: "ChainedTokenCredential authentication failed", check: "az login でEntra IDを構成するか、APIキーを設定する" },
    { part: "リソース名", icon: "cloud", symptom: "接続エラーが続く", check: "ANTHROPIC_FOUNDRY_RESOURCE のリソース名" },
    { part: "デプロイ名", icon: "layers", symptom: "モデル呼び出しが失敗する", check: "デプロイ名と ANTHROPIC_DEFAULT_*_MODEL" }
  ]
}));

// ── [image-model] ───────────────────────────────────────
const IMAGE = "Part 3  画像モデル";
mark("image");
next();
deck.addCustomSlide(sectionSlide({
  part: "Part 3",
  title: "画像モデル",
  lead: "モデルを選ぶ → スクリプト → 環境変数 → CLIから実行 → うまくいかないとき",
  pages: pages(PAGES.image),
  values: ["scripts\\gen-image.ps1", "AZURE_IMAGE_RESOURCE", "AZURE_IMAGE_DEPLOYMENT", "AZURE_IMAGE_API_KEY"]
}));

deck.addCustomSlide(compareCardsSlide({
  pageNum: next(),
  label: IMAGE,
  title: "用途でflareとsunburstを選ぶ",
  cards: [
    { icon: "zap", name: "flare", full: "gpt-image-2.5-flare", body: "高品質な画像を最も速く作る。日常の生成に向く", tone: "accent" },
    { icon: "sparkles", name: "sunburst", full: "gpt-image-2.5-sunburst", body: "最も高性能。編集の精度を重視する場合に向く", tone: "accent2" }
  ],
  common: "共通: quality は xhigh / max / auto も可。サイズは16px単位・長辺3,840pxまで",
  note: "提供リージョンはMS Learnのリージョン一覧で確認する"
}));

deck.addCustomSlide(railCodeSlide({
  pageNum: next(),
  label: IMAGE,
  title: "scripts\\gen-image.ps1 を作成する",
  lineSpacing: 20,
  rail: [
    { line: 1, text: "入力" },
    { line: 3, text: "URL" },
    { line: 5, text: "本文" },
    { line: 7, text: "送信" },
    { line: 11, text: "保存" }
  ],
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

deck.addCustomSlide(codeFlowSlide({
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
  flow: [
    { text: "gen-image.ps1", icon: "file-code", mono: true },
    { text: "Foundry 画像API", icon: "cloud" },
    { text: "umbrella.png", icon: "image", mono: true }
  ],
  note: "flareとsunburstは AZURE_IMAGE_DEPLOYMENT の値で切り替える"
}));

deck.addCustomSlide(stageFlowSlide({
  pageNum: next(),
  label: IMAGE,
  title: "CLIにスクリプトの使い方を伝える",
  stages: [
    {
      caption: "依頼する",
      weight: 1.3,
      boxes: [{ icon: "message-square-text", heading: "依頼例", body: "「gen-image.ps1で\n表紙画像を作って」", tone: "ink" }]
    },
    {
      caption: "使い方を読む",
      weight: 1.6,
      boxes: [
        { heading: "Codex CLI", body: "AGENTS.md に記載", tone: "accent" },
        { heading: "Claude Code", body: "CLAUDE.md に記載", tone: "accent2" }
      ]
    },
    {
      caption: "承認して実行",
      weight: 1.2,
      boxes: [{ icon: "image", heading: "PNG保存", body: "実行内容を見て\n許可すると、\n画像が保存される", tone: "accent3" }]
    }
  ],
  note: "Codex CLIではネット接続を伴う実行で承認を求められる"
}));

deck.addCustomSlide(faultMapSlide({
  pageNum: next(),
  label: IMAGE,
  title: "画像生成はキー・名前・サイズを確認",
  chainLabel: "確認する箇所",
  rows: [
    { part: "起動", icon: "play", symptom: "スクリプトを実行できない", check: "-ExecutionPolicy Bypass -File で起動する" },
    { part: "本文", icon: "file-text", symptom: "日本語が文字化けする", check: "本文をUTF-8のバイト列で送っているか" },
    { part: "サイズ", icon: "maximize", symptom: "400（サイズ）", check: "16px単位、長辺3,840px以下、縦横比1:3〜3:1か" },
    { part: "キーと接続先", icon: "key-round", symptom: "401 / 404", check: "401はキー、404はリソース名とデプロイ名を確認" }
  ]
}));

// ── [computer-use] ──────────────────────────────────────
const CU = "Part 4  Computer Use";
mark("cu");
next();
deck.addCustomSlide(sectionSlide({
  part: "Part 4",
  title: "Computer Use",
  lead: "使える範囲 → 操作ループ → Python準備 → 安全対策 → うまくいかないとき",
  pages: pages(PAGES.cu),
  values: ["computer_use_loop.py", "AZURE_CU_RESOURCE", "AZURE_CU_DEPLOYMENT", "AZURE_CU_API_KEY"]
}));

deck.addCustomSlide(statusRowsSlide({
  pageNum: next(),
  label: CU,
  title: "CLIではなくAPIから使う",
  header: { item: "使い方", status: "Foundryでの利用" },
  rows: [
    { item: "Responses APIで操作ループを自作する", status: "使える", highlight: "この資料の方法", level: "ok" },
    { item: "Agent Service の Computer Use ツール", status: "computer-use-preview のみ", level: "partial" },
    { item: "Codex CLI / Claude Code の組み込み機能", status: "使えない", level: "no" }
  ],
  note: "GPT-5.6系（sol / terra / luna）とGPT-5.5は利用申請なしで使える"
}));

deck.addCustomSlide(flowSlide({
  pageNum: next(),
  label: CU,
  title: "操作ループは自分で実装する",
  steps: [
    { heading: "依頼", body: "依頼文と\n画面の\nスクショを送る", icon: "send" },
    { heading: "提案", body: "モデルが操作を\ncomputer_call\nで返す", icon: "bot" },
    { heading: "実行", body: "Playwrightで\nクリックや\n入力を行う", icon: "mouse-pointer-click" },
    { heading: "返送", body: "操作後の\nスクショを\n返す", icon: "camera" }
  ],
  loopLabel: "提案がなくなるか MAX_STEPS まで繰り返す"
}));

deck.addCustomSlide(codeFlowSlide({
  pageNum: next(),
  label: CU,
  title: "PythonとPlaywrightを準備する",
  lineSpacing: 19,
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
  flow: [
    { text: "キー設定", icon: "key-round" },
    { text: "venv作成", icon: "box" },
    { text: "pip install", icon: "package", mono: true },
    { text: "chromium", icon: "globe", mono: true }
  ],
  note: "スクリプト全文は資料と同じフォルダの computer_use_loop.py"
}));

deck.addCustomSlide(railCodeSlide({
  pageNum: next(),
  label: CU,
  title: "最初の依頼の後、このループを回す",
  lineSpacing: 19,
  rail: [
    { line: 2, text: "提案" },
    { line: 5, text: "実行" },
    { line: 7, text: "画面" },
    { line: 9, text: "返送" }
  ],
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

deck.addCustomSlide(iconListSlide({
  pageNum: next(),
  label: CU,
  title: "安全対策を組み込んで動かす",
  items: [
    { icon: "monitor", heading: "実行環境", body: "機密データのない検証用VMで動かす" },
    { icon: "user-check", heading: "安全チェック", body: "pending_safety_checks は人が確認して承認する" },
    { icon: "octagon-x", heading: "回数の上限", body: "MAX_STEPS で止めて人に制御を戻す" },
    { icon: "maximize", heading: "画面サイズ", tone: "accent2", body: "1440×900 または 1600×900 でクリック精度を保つ" },
    { icon: "coins", heading: "トークン", tone: "accent2", body: "reasoning.context を current_turn にして消費を抑える" },
    { icon: "terminal", heading: "実行", tone: "ink", mono: true, body: "python computer_use_loop.py \"依頼内容\"" }
  ]
}));

deck.addCustomSlide(faultMapSlide({
  pageNum: next(),
  label: CU,
  title: "Computer Useは応答と画面を確認",
  chainLabel: "確認する箇所",
  rows: [
    { part: "接続先", icon: "cloud", symptom: "404", check: "AZURE_CU_RESOURCE とデプロイ名が正しいか" },
    { part: "ツール指定", icon: "wrench", symptom: "computer_call が返らない", check: "tools に computer を指定し、画面操作が必要な依頼か" },
    { part: "画面サイズ", icon: "maximize", symptom: "クリック位置がずれる", check: "画面サイズを1440×900などにしているか" },
    { part: "ループ制御", icon: "repeat", symptom: "途中で止まる", check: "MAX_STEPS の上限や安全チェックで中断していないか" }
  ]
}));

// ── [verify-troubleshoot] ───────────────────────────────
const VERIFY = "確認と運用";
mark("close");
deck.addCustomSlide(verifyLanesSlide({
  pageNum: next(),
  label: VERIFY,
  title: "4つの接続をそれぞれ確認する",
  header: ["対象", "実行すること", "期待する結果"],
  rows: [
    { icon: "terminal", target: "Codex CLI", command: "codex --version\ncodex exec \"hello\"", result: "応答が返る", tone: "accent" },
    { icon: "terminal", target: "Claude Code", command: "claude doctor\n起動して /status", result: "Microsoft Foundry\nと表示", tone: "accent2" },
    { icon: "image", target: "画像モデル", command: "gen-image.ps1\n-Prompt \"test\"", result: "指定したPNGが\n保存される", tone: "accent3" },
    { icon: "mouse-pointer-click", target: "Computer Use", command: "python computer_use_\nloop.py \"依頼内容\"", result: "ブラウザ操作後に\n結果が表示", tone: "ink" }
  ],
  note: "setx の後は、新しく開いたターミナルで確認する"
}));

// ── [security-close] ────────────────────────────────────
deck.addCustomSlide(iconCardsSlide({
  pageNum: next(),
  label: VERIFY,
  title: "キーと権限は最小限で運用する",
  cols: 2,
  cards: [
    { icon: "key-round", heading: "キー", body: "ファイルやリポジトリに書かず、\n漏えい時は再生成する" },
    { icon: "shield-check", heading: "権限", body: "呼び出し用ロールだけ付与し、\nClaude CodeはEntra IDで" },
    { icon: "bot", heading: "自律実行", tone: "accent2", body: "フルアクセスモードは\nサンドボックス等と併用する" },
    { icon: "monitor", heading: "Computer Use", tone: "accent2", body: "検証用VMで動かし、\n安全チェックは人が承認する" }
  ]
}));

mark("sources");
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

for (const [section, range] of Object.entries(PAGES) as Array<[Section, readonly [number, number]]>) {
  if (starts[section] !== range[0]) throw new Error(`${section} starts on page ${starts[section]}, but PAGES says ${range[0]}`);
}
const ends: Record<Section, number> = {
  prepare: (starts.codex ?? 0) - 1,
  codex: (starts.claude ?? 0) - 1,
  claude: (starts.image ?? 0) - 1,
  image: (starts.cu ?? 0) - 1,
  cu: (starts.close ?? 0) - 1,
  close: (starts.sources ?? 0) - 1,
  sources: page
};
for (const [section, range] of Object.entries(PAGES) as Array<[Section, readonly [number, number]]>) {
  if (ends[section] !== range[1]) throw new Error(`${section} ends on page ${ends[section]}, but PAGES says ${range[1]}`);
}

await deck.render({
  output: "output/deck.pptx",
  report: "output/build-report.md",
  screenshots: "output/screenshots"
});
