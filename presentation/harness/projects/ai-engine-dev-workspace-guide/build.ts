import { Presentation, type SlideVariables } from "../../src/index.js";
import {
  authoritySpectrumSlide,
  beforeAfterSlide,
  capabilityCardsSlide,
  commandPipelineSlide,
  compositionSlide,
  copyTreeSlide,
  folderTreeSlide,
  forkSlide,
  iconStepsSlide,
  kitArchitectureSlide,
  nodeMapSlide,
  questionJourneySlide,
  requestAnatomySlide,
  requestFlowSlide,
  skillFamilyMapSlide,
  stageMapSlide,
  staircaseSlide
} from "./diagrams.js";

const FONT = "Noto Sans JP";
const MONO = "Arial";
const FOOTER = "AI-ENGINE-DEV 利用ガイド";

const deck = new Presentation({
  title: "AI-Engine-Dev 利用ガイド",
  templateLibrary: "templates",
  projectDir: "projects/ai-engine-dev-workspace-guide"
});

type FontMap = Record<string, number>;
type FaceMap = Record<string, string>;

function page(value: number): string {
  return String(value).padStart(2, "0");
}

function addTemplate(templateName: string, variables: SlideVariables, fontSizes: FontMap = {}, fontFaces: FaceMap = {}) {
  const overrides = Object.keys(variables).map((target) => ({
    op: "styleText" as const,
    target,
    fontFace: fontFaces[target] ?? FONT,
    ...(fontSizes[target] ? { fontSize: fontSizes[target] } : {})
  }));
  deck.addSlideFromTemplate({ templateName, variables, overrides });
}

type SkillRow = { category: string; name: string; when: string; output: string };

function addCatalog(title: string, rows: SkillRow[], currentPage: number, label = "SKILL一覧") {
  const padded = [...rows];
  while (padded.length < 4) padded.push({ category: "—", name: "—", when: "—", output: "—" });
  const variables: SlideVariables = {
    "skill-catalog": label,
    "catalog-title-with-one-clear-takeawa": title,
    category: "区分", skill: "Skill", "use-when": "使う場面", "primary-output": "主な成果物",
    "category-one": padded[0].category, "skill-name": padded[0].name, "when-this-skill-fits": padded[0].when, "primary-output-2": padded[0].output,
    "category-two": padded[1].category, "skill-name-2": padded[1].name, "when-this-skill-fits-2": padded[1].when, "primary-output-3": padded[1].output,
    "category-three": padded[2].category, "skill-name-3": padded[2].name, "when-this-skill-fits-3": padded[2].when, "primary-output-4": padded[2].output,
    "category-four": padded[3].category, "skill-name-4": padded[3].name, "when-this-skill-fits-4": padded[3].when, "primary-output-5": padded[3].output,
    "ai-engine-dev-guide": FOOTER, "00": page(currentPage)
  };
  const bodyFields = [
    "category-one", "skill-name", "when-this-skill-fits", "primary-output-2",
    "category-two", "skill-name-2", "when-this-skill-fits-2", "primary-output-3",
    "category-three", "skill-name-3", "when-this-skill-fits-3", "primary-output-4",
    "category-four", "skill-name-4", "when-this-skill-fits-4", "primary-output-5"
  ];
  const fontSizes: FontMap = Object.fromEntries(bodyFields.map((field) => [field, 11]));
  Object.assign(fontSizes, {
    "catalog-title-with-one-clear-takeawa": 28,
    category: 11, skill: 11, "use-when": 11, "primary-output": 11, "skill-catalog": 11,
    "ai-engine-dev-guide": 8, "00": 8
  });
  addTemplate("guide-skill-catalog", variables, fontSizes);
}

function addSection(number: string, title: string, outcome: string) {
  addTemplate("guide-section-divider", {
    "01": number,
    "section-title": title,
    "what-the-reader-will-understand-in-t": outcome,
    "ai-engine-dev-guide": FOOTER
  }, { "section-title": 38, "what-the-reader-will-understand-in-t": 20, "ai-engine-dev-guide": 8 });
}

function addProcess(title: string, steps: Array<[string, string]>, currentPage: number, label = "標準フロー") {
  const fields = [
    ["input", "goal-audience-evidence"], ["select", "folder-and-skill"], ["work", "artifact-and-source"],
    ["verify", "tests-and-visual-qa"], ["handoff", "results-and-risks"]
  ];
  const variables: SlideVariables = {
    workflow: label, "five-stage-workflow": title,
    "01": "01", "02": "02", "03": "03", "04": "04", "05": "05",
    "ai-engine-dev-guide": FOOTER, "00": page(currentPage)
  };
  fields.forEach(([heading, body], index) => {
    variables[heading] = steps[index][0];
    variables[body] = steps[index][1];
  });
  addTemplate("guide-process-flow", variables, {
    "five-stage-workflow": 28,
    input: 16, select: 16, work: 16, verify: 16, handoff: 16,
    "goal-audience-evidence": 12, "folder-and-skill": 12, "artifact-and-source": 12,
    "tests-and-visual-qa": 12, "results-and-risks": 12,
    "ai-engine-dev-guide": 8, "00": 8
  });
}

// 1. Capabilities
addTemplate("guide-cover", {
  "guide-category": "導入・利用ガイド",
  "workspace-guide-title": "AI-Engine-Dev は何ができるのか",
  "a-concise-subtitle-describing-the-au": "環境準備から利用後に残る成果物まで、順番に説明する",
  "version-or-context": "職場の同僚向け・改訂版"
}, { "workspace-guide-title": 34, "a-concise-subtitle-describing-the-au": 18 });

deck.addCustomSlide(questionJourneySlide({
  pageNum: 2, eyebrow: "この資料の読み方", title: "4つの疑問に順番に答える",
  steps: [
    { icon: "sparkles", question: "何ができる？", answer: "開発と資料作成で、どんな依頼を成果物へ変えられるか。", chapter: "はじめに" },
    { icon: "wrench", question: "何を準備する？", answer: "新規・既存Project別の配置、Skill登録、必要Tool。", chapter: "01 環境を準備する" },
    { icon: "message-square-text", question: "どう頼む？", answer: "最初の依頼文、選ばれるSkill、途中で確認される内容。", chapter: "02 最初の依頼" },
    { icon: "package-check", question: "使うとどうなる？", answer: "生成されるFile、Test・QA、未確認事項、次の行動。", chapter: "05 結果を引き継ぐ" }
  ],
  note: "各章の冒頭で、その章が答える疑問を確認してから読み進める"
}));

deck.addCustomSlide(kitArchitectureSlide({
  pageNum: 3, eyebrow: "まず理解すること", title: "AI-Engine-DevはAI作業の再利用キット",
  kit: {
    label: "WHAT IT IS", title: "含まれるもの",
    items: [
      { icon: "list-checks", text: "AI向けの工程手順（Skill）" },
      { icon: "book-open", text: "Project内の作業規則（AGENTS.md）" },
      { icon: "file-text", text: "要求・仕様・資料のTemplate" },
      { icon: "presentation", text: "PPTX生成Engineと再利用Slide" },
      { icon: "shield-check", text: "Test・構造検査・目視QAの手順" }
    ]
  },
  runner: {
    label: "HOW IT RUNS", title: "Codex / Claude Code",
    steps: ["対象Projectの実物を読む", "依頼に合うSkillを選ぶ", "成果物を作り、検証する"]
  },
  result: {
    label: "RESULT", title: "Projectに残る",
    items: [
      { icon: "package-check", text: "成果物" },
      { icon: "circle-check", text: "検証結果" },
      { icon: "circle-help", text: "未確認事項" }
    ]
  },
  note: "AI-Engine-Dev単体を起動するのではなく、対象Project内のAI作業へ組み込む"
}));

deck.addCustomSlide(folderTreeSlide({
  pageNum: 4, eyebrow: "フォルダ構成", title: "Repositoryは開発と資料作成の2つの環境を持つ",
  caption: "AI-Engine-Dev/（Repository root）",
  nodes: [
    { name: "AI-Engine-Dev/", depth: 0, folder: true },
    { name: "AGENTS.md", depth: 1, note: "AIが守る共通規則" },
    { name: "CLAUDE.md", depth: 1, note: "Claude Codeの入口" },
    { name: "README.md", depth: 1, note: "利用者向けの入口" },
    { name: "Lerning/", depth: 1, folder: true, note: "初めての人の学習資料" },
    { name: "development/", depth: 1, folder: true, note: "システム開発の環境", tone: "accent2" },
    { name: "presentation/", depth: 1, folder: true, note: "資料作成の環境", tone: "accent3" },
    { name: "docs/", depth: 1, folder: true, note: "orchestrationの記録" },
    { name: ".agents/skills/", depth: 1, folder: true, note: "Codex用のSkill Link" },
    { name: ".claude/skills/", depth: 1, folder: true, note: "Claude用のSkill Link" }
  ],
  cards: [
    { label: "DEVELOPMENT", title: "development/", body: "要求・仕様・実装・Testの手順とSkill", tone: "accent2" },
    { label: "PRESENTATION", title: "presentation/", body: "PPTX生成Engine、Template、完成資料", tone: "accent3" },
    { label: "はじめて", title: "Lerning/README.md", body: "全体像を学ぶ任意の入口。", tone: "accent" }
  ]
}));

deck.addCustomSlide(capabilityCardsSlide({
  pageNum: 5, eyebrow: "できること：DEVELOPMENT", title: "Developmentは要望を検証済み変更へ変える",
  cards: [
    { icon: "lightbulb", verb: "考える", name: "要求・仕様・設計", when: "要望が曖昧、設計判断が必要", output: "要求書・仕様書・ADR", tone: "accent" },
    { icon: "hammer", verb: "作る", name: "TDD・実装", when: "仕様をCodeへ変えたい", output: "実装・Test・検証記録", tone: "accent" },
    { icon: "search", verb: "直す", name: "障害調査・Review", when: "Bug、性能劣化、差分確認", output: "根本原因・回帰Test・指摘", tone: "accent2" },
    { icon: "send", verb: "届ける", name: "文書化・Delivery", when: "利用手順、PR、Release", output: "README・PR・CI結果", tone: "accent3" }
  ]
}));

deck.addCustomSlide(capabilityCardsSlide({
  pageNum: 6, eyebrow: "できること：PRESENTATION", title: "Presentationは根拠付きPPTXを再生成できる",
  cards: [
    { icon: "presentation", verb: "作る", name: "build-presentation", when: "新規Deck・既存Deck改訂", output: "PPTX・出典・QA report", tone: "accent" },
    { icon: "copy", verb: "再利用", name: "Template取込・説明", when: "既存Slideを部品化", output: "template.pptx・fields.yml", tone: "accent" },
    { icon: "palette", verb: "整える", name: "Design System調整", when: "色・書体・Logoを統一", output: "design.ts・design.md", tone: "accent2" },
    { icon: "scan-eye", verb: "確かめる", name: "構造検査・全枚QA", when: "共有可能か確認", output: "画像・Build/QA report", tone: "accent3" }
  ]
}));

addProcess("要望を、Reviewできる開発成果物へ変える", [
  ["入力", "要望・Issue\n既存Code"], ["整理", "要求・仕様\n設計・計画"], ["実行", "Test先行\n小さく実装"],
  ["検証", "Build・Test\n二軸Review"], ["結果", "Code・文書\n未確認事項"]
], 7, "DEVELOPMENTの変換");

addProcess("説明したい内容を、再生成できるPPTXへ変える", [
  ["入力", "目的・読者\n根拠・素材"], ["合意", "Brief\n構成・結論"], ["生成", "Template\nbuild.ts"],
  ["検証", "PPTX構造\n全枚Render"], ["結果", "Deck・出典\nQA report"]
], 8, "PRESENTATIONの変換");

deck.addCustomSlide(beforeAfterSlide({
  pageNum: 9, eyebrow: "利用前と利用後", title: "会話で終わらず、次の人が確認できる状態を残す",
  before: { label: "BEFORE", title: "依頼した時点" },
  after: { label: "AFTER", title: "作業完了時" },
  pairs: [
    ["要望の解釈が人によって違う", "要求・仕様・判断が文書化される"],
    ["根拠と推測が混ざる", "事実・仮定・未確認を区別する"],
    ["何をTestするか不明", "実施した検証を具体的に記録する"],
    ["成果物の置き場所が不統一", "正本と成果物の場所が決まる"],
    ["次の担当者が会話を再読する", "Riskと次の行動を引き継げる"]
  ],
  note: "価値はAIの回答文ではなく、Projectに残る成果物と検証可能性"
}));

// 2. Environment setup
addSection("01", "環境を準備する", "利用場所を選び、Skill登録と実行環境を確認する");

addTemplate("guide-routing-guide", {
  "routing-guide": "最初の分岐", "routing-title-with-one-clear-takeawa": "利用場所によって準備方法を選ぶ",
  start: "START", task: "どこで使う？", "required-outcome": "このRepositoryか、別のProjectかを決める。",
  development: "THIS REPO", build: "そのまま利用", "requirements-designcode-tests": "AI-Engine-Dev rootを\nCodex / Claudeで開く",
  presentation: "OTHER PROJECT", explain: "コピー利用", "brief-decksources-visual-qa": "新規はportable copy\n既存はbootstrap",
  next: "VERIFY", skill: "Skill一覧", "read-matching-skill-md": "検出されたSkillとProject規則を確認する。",
  "ai-engine-dev-guide": FOOTER, "00": page(11)
}, { "routing-title-with-one-clear-takeawa": 28, "required-outcome": 12, "requirements-designcode-tests": 12, "brief-decksources-visual-qa": 12, "read-matching-skill-md": 12, "ai-engine-dev-guide": 8, "00": 8 });

deck.addCustomSlide(iconStepsSlide({
  pageNum: 12, eyebrow: "このRepositoryで使う", title: "AI-Engine-Dev自体はすでに利用可能な構成",
  steps: [
    { icon: "folder-open", heading: "Repositoryを開く", body: "AI-Engine-Dev rootをCodexまたはClaude Codeで開く。" },
    { icon: "book-open", heading: "規則を確認", body: "AGENTS.mdと担当領域のREADMEを先に読む。" },
    { icon: "list-checks", heading: "Skill一覧を見る", body: "Codexは/skills、ClaudeではSkill名を確認する。", code: "/skills" },
    { icon: "link", heading: "名前とPathを確認", body: "Link先のPathを確認する。", code: ".agents/skills\n.claude/skills" }
  ]
}));

deck.addCustomSlide(copyTreeSlide({
  pageNum: 13, eyebrow: "空の新規Project", title: "development/.をProject rootへコピーする",
  source: {
    caption: "コピー元",
    nodes: [
      { name: "AI-Engine-Dev/", depth: 0, folder: true },
      { name: "development/", depth: 1, folder: true, tone: "accent2" },
      { name: ".agents/", depth: 2, folder: true },
      { name: ".claude/", depth: 2, folder: true },
      { name: "AGENTS.md", depth: 2 },
      { name: "README.md", depth: 2 },
      { name: "skills/", depth: 2, folder: true },
      { name: "scripts/", depth: 2, folder: true },
      { name: "templates/", depth: 2, folder: true },
      { name: "tests/", depth: 2, folder: true }
    ]
  },
  command: "cp -R\ndevelopment/.\n../new-project/",
  target: {
    caption: "コピー先 = Project root",
    nodes: [
      { name: "new-project/", depth: 0, folder: true, tone: "accent3" },
      { name: ".agents/", depth: 1, folder: true, tone: "accent3" },
      { name: ".claude/", depth: 1, folder: true, tone: "accent3" },
      { name: "AGENTS.md", depth: 1 },
      { name: "README.md", depth: 1 },
      { name: "skills/", depth: 1, folder: true },
      { name: "scripts/", depth: 1, folder: true },
      { name: "templates/", depth: 1, folder: true },
      { name: "tests/", depth: 1, folder: true }
    ]
  },
  cards: [
    { label: "重要", title: "末尾の . を残す", body: "隠しDirectoryの.agentsと.claudeもコピーされる。", tone: "accent2" },
    { label: "コピー後", title: "Project rootとして使う", body: "既存のsrc等をprojects/へ移す必要はない。", tone: "accent3" },
    { label: "確認", title: "verify script", body: "development/scripts/の検証Scriptを使う。", tone: "accent" }
  ]
}));

deck.addCustomSlide(stageMapSlide({
  pageNum: 14, eyebrow: "既存Project", title: "一括コピーせずbootstrapを明示して依頼する",
  stages: [
    {
      caption: "1 既存Projectを開く", weight: 1.05,
      boxes: [{ label: "そのまま保持", title: "既存Project", body: "実装・設定・既存READMEを保持した状態でAIに見せる。", tone: "ink" }]
    },
    {
      caption: "2 Skillを明示して依頼", weight: 1.15,
      boxes: [{ label: "依頼文に書く", title: "$bootstrap-development-harness", body: "このSkillを使うよう明示する。", dark: true }]
    },
    {
      caption: "3 調査結果を確認", weight: 1,
      boxes: [{ label: "人が確認", title: "提案をReview", body: "既存構造、規則、必要な入口文書の提案を確認する。", tone: "accent2" }]
    },
    {
      caption: "4 追加内容をReview", weight: 1,
      boxes: [{ label: "追加されるもの", title: "必要な文書", body: "README・AGENTS.mdなど。既存Fileは移動しない。", tone: "accent3" }]
    }
  ],
  note: "development/ を丸ごとコピーするのは空の新規Projectだけ"
}));

deck.addCustomSlide(nodeMapSlide({
  pageNum: 15, eyebrow: "Presentation Skill登録", title: "セットアップScriptで5 Skillを検出可能にする",
  nodes: [
    { id: "src", x: 0.75, y: 2.05, w: 2.35, h: 1.55, label: "1 配置", title: "presentation/", body: "Project rootの直下に置く。skills/に5 Skill。", tone: "accent2" },
    { id: "script", x: 3.6, y: 2.2, w: 2.35, h: 1.25, label: "2 1回実行", title: "setup-skills.sh", body: "./presentation/scripts/", dark: true },
    { id: "codex", x: 6.45, y: 1.6, w: 3.05, h: 0.95, label: "3 相対Link（Codex）", title: ".agents/skills/", tone: "accent" },
    { id: "claude", x: 6.45, y: 3.1, w: 3.05, h: 0.95, label: "3 相対Link（Claude Code）", title: ".claude/skills/", tone: "accent" }
  ],
  edges: [
    { from: "src", to: "script" },
    { from: "script", to: "codex" },
    { from: "script", to: "claude" }
  ],
  note: "4 一覧に出ない場合だけ、CodexまたはClaude Codeを再起動する"
}));

deck.addCustomSlide(commandPipelineSlide({
  pageNum: 16, eyebrow: "PowerPoint生成Engine", title: "Node.js 20以上とLibreOfficeを準備する",
  prerequisite: { title: "Node.js 20以上 と npm", body: "全枚画像化にはLibreOfficeも必要。" },
  commands: [
    { command: "npm ci", caption: "依存をInstall" },
    { command: "npm run build", caption: "型検査" },
    { command: "npm test", caption: "Test" },
    { command: "npm run\nself-validate", caption: "一時PPTXを生成" }
  ],
  result: { title: "すべて成功", body: "必要なら画像も生成される。" }
}));

deck.addCustomSlide(staircaseSlide({
  pageNum: 17, eyebrow: "任意：Matt原文Skill", title: "専門Skillは必要な範囲だけ追加する",
  steps: [
    { icon: "layers", heading: "まず安定版25件", body: "engineeringとproductivityだけをLinkする構成が推奨。" },
    { icon: "terminal", heading: "初回設定", body: "$setup-matt-pocock-skills を明示して実行する。" },
    { icon: "settings", heading: "設定内容を決める", body: "Issue管理先、Label、CONTEXT.md、ADR配置を確認する。" }
  ],
  caution: { title: "重複を避ける", body: "統合Skillと同名の場合は、名前だけでなくPathも確認する。" }
}));

addTemplate("guide-checklist", {
  "final-check": "環境準備の完了条件", "the-reader-is-ready-when-these-six-c": "次の6項目を確認できれば最初の依頼へ進める",
  "text-3": "✓", "i-know-which-folder-owns-the-work": "対象ProjectをCodexまたはClaude Codeで開ける",
  "text-6": "✓", "i-selected-only-the-skills-required-": "AGENTS.mdと担当領域READMEを読める",
  "text-9": "✓", "facts-assumptions-and-unresolved-ite": "利用するSkillが一覧またはPathで確認できる",
  "text-12": "✓", "outputs-and-canonical-documents-agre": "既存Projectではbootstrap方針を確認した",
  "text-15": "✓", "completed-and-uncompleted-checks-are": "PPTX作成時はNode・npm・LibreOfficeを確認した",
  "text-18": "✓", "external-actions-stay-within-explici": "秘密情報や外部操作の権限境界を確認した",
  "reference-links-or-next-action": "成功の目安：Skillを選べる／Project規則を読める／必要な検証Commandが動く"
}, { "the-reader-is-ready-when-these-six-c": 27, "i-know-which-folder-owns-the-work": 13, "i-selected-only-the-skills-required-": 13, "facts-assumptions-and-unresolved-ite": 13, "outputs-and-canonical-documents-agre": 13, "completed-and-uncompleted-checks-are": 13, "external-actions-stay-within-explici": 13, "reference-links-or-next-action": 10 });

// 3. First use
addSection("02", "最初の依頼をする", "依頼文、選ばれる工程、生成物、利用者の確認点を具体例で理解する");

deck.addCustomSlide(forkSlide({
  pageNum: 20, eyebrow: "最初に選ぶ環境", title: "このProjectには2つの作業環境がある",
  question: "依頼したい成果物は？",
  branches: [
    {
      when: "System変更", label: "DEVELOPMENT", title: "システム開発", icon: "code", tone: "accent2",
      rows: [["対象", "アプリ・Web・業務System"], ["扱うこと", "要求、仕様、設計、実装"], ["確認", "Test、Build、Code review"], ["入口", "development/README.md"], ["例", "新機能追加、不具合調査"]]
    },
    {
      when: "PowerPoint資料", label: "PRESENTATION", title: "資料作成", icon: "presentation", tone: "accent3",
      rows: [["対象", "PowerPoint資料"], ["扱うこと", "Brief、構成、Template、生成"], ["確認", "PPTX構造、全ページ目視QA"], ["入口", "presentation/README.md"], ["例", "説明資料、提案書、報告資料"]]
    }
  ],
  note: "依頼する前に、成果物がSystem変更かPowerPoint資料かで環境を選ぶ"
}));

deck.addCustomSlide(requestAnatomySlide({
  pageNum: 21, eyebrow: "依頼文の型", title: "4要素を伝えると作業範囲が安定する",
  parts: [
    { name: "目的", question: "誰の、どんな問題を解決したいか。", example: "ユーザーが通知時刻を変更できる機能を追加してください。", tone: "accent" },
    { name: "対象", question: "Project、機能、資料、既存Fileなど作業範囲。", example: "既存仕様と実装を確認し、要求と仕様を整理してください。", tone: "accent3" },
    { name: "完了条件", question: "何ができれば完了か、必要なTestや表示確認。", example: "Testを先に作り、READMEも同期してください。", tone: "accent2" },
    { name: "権限", question: "変更のみか、commit・PR・公開まで許可するか。", example: "commit・pushはしないでください。", tone: "ink" }
  ],
  note: "例文は次の「Development 例1」と同じ依頼を4要素に分けたもの"
}));

addSection("A", "Developmentへ依頼する", "システム開発の新機能追加と不具合調査を具体例で確認する");

deck.addCustomSlide(requestFlowSlide({
  pageNum: 23, eyebrow: "DEVELOPMENT 例1：新機能", title: "要望だけでなく、完了条件と権限を一緒に伝える",
  request: {
    label: "REQUEST", title: "依頼例",
    body: "ユーザーが通知時刻を変更できる機能を追加してください。\n既存仕様と実装を確認し、要求と仕様を整理してください。\nTestを先に作り、READMEも同期してください。\ncommit・pushはしないでください。"
  },
  flow: {
    label: "ROUTED WORK", title: "AIが選ぶ工程", mono: true,
    steps: ["requirements-analysis", "specification", "architecture-design / planning", "tdd → implementation", "code-review → documentation"]
  },
  note: "途中で仕様判断が必要なら、AIは実装前に確認を求める"
}));

addProcess("新機能の利用後は、実装・文書・検証が残る", [
  ["要求", "docs/requirements\n受入条件"], ["仕様", "docs/specs\n異常系"], ["実装", "Source code\nTest code"],
  ["検証", "Build・Test\nReview結果"], ["引継", "README\nRisk・次の行動"]
], 24, "DEVELOPMENT 例1：利用後");

deck.addCustomSlide(requestFlowSlide({
  pageNum: 25, eyebrow: "DEVELOPMENT 例2：不具合", title: "修正を急がず、再現と根本原因から始める",
  request: {
    label: "REQUEST", title: "依頼例",
    body: "保存後に画面が古い値へ戻る原因を調査してください。\n再現条件と根本原因を特定し、影響範囲を説明してください。\n今は診断だけで、修正はしないでください。"
  },
  flow: {
    label: "RESULT", title: "利用後に残るもの",
    steps: ["再現手順と観測結果", "原因仮説と検証結果", "根本原因の説明", "影響範囲と安全な修正方針"],
    stopLabel: "「診断だけ」なのでここで止まる",
    stoppedSteps: ["未実施の修正・実機確認"]
  },
  note: "「診断だけ」と指定すれば、原因説明までで止まり、修正権限は広がらない"
}));

addSection("B", "Presentationへ依頼する", "PowerPoint資料の依頼と、残る成果物を確認する");

deck.addCustomSlide(requestFlowSlide({
  pageNum: 27, eyebrow: "PRESENTATION 例：説明資料", title: "読者と読後の行動を指定すると構成判断が変わる",
  request: {
    label: "REQUEST", title: "依頼例",
    body: "職場の同僚向けに、この仕組みの利用ガイドを作ってください。\n何ができるか、環境準備、利用後の成果を説明してください。\n編集可能なPPTXと全ページQA結果を残してください。"
  },
  flow: {
    label: "ROUTED WORK", title: "AIが行うこと",
    steps: ["Briefで理解を合意", "根拠とSection順を記録", "Templateまたは新規作図を選択", "決定論的にPPTXを生成", "構造検査と全枚目視QA"]
  },
  note: "資料の価値は枚数ではなく、読者が次の行動を判断できること"
}));

addProcess("資料を使った後は、PPTXを再生成・検証できる", [
  ["目的", "brief.txt\n理解確認"], ["根拠", "source-notes\n出典・仮定"], ["生成", "build.ts\nTemplate"],
  ["表示", "deck.pptx\n全Slide画像"], ["証拠", "Build report\nQA report"]
], 28, "PRESENTATION：利用後");

deck.addCustomSlide(folderTreeSlide({
  pageNum: 29, eyebrow: "成果物の場所", title: "作業後は会話ではなくProject内のFileを正本にする",
  caption: "作業後のProject（例）",
  noteColumn: 2.75,
  nodes: [
    { name: "project-root/", depth: 0, folder: true },
    { name: "docs/requirements/", depth: 1, folder: true, note: "要求", tone: "accent2" },
    { name: "docs/specs/", depth: 1, folder: true, note: "仕様", tone: "accent2" },
    { name: "docs/plans/", depth: 1, folder: true, note: "計画", tone: "accent2" },
    { name: "src/ と tests/", depth: 1, folder: true, note: "実装とTest", tone: "accent2" },
    { name: "presentation/harness/", depth: 1, folder: true },
    { name: "projects/<deck-id>/", depth: 2, folder: true, tone: "accent3" },
    { name: "brief.txt", depth: 3, note: "目的・読者" },
    { name: "source-notes.txt", depth: 3, note: "出典・仮定" },
    { name: "output/", depth: 3, folder: true, note: "PPTX・QA結果" }
  ],
  cards: [
    { label: "DEVELOPMENT", title: "docs / src / tests", body: "仕様・実装・Test・ADRを既存構造へ置く。", tone: "accent2" },
    { label: "PRESENTATION", title: "projects/<deck-id>/", body: "PPTX・生成Code・出典・QA結果をまとめる。", tone: "accent3" },
    { label: "引き継ぎ", title: "結果を分離", body: "実施済み、未確認、Risk、次の行動を明示する。", tone: "accent" }
  ]
}));

deck.addCustomSlide(authoritySpectrumSlide({
  pageNum: 30, eyebrow: "人が決めること", title: "外部操作と最終判断は、人が承認する",
  axis: { left: "AIが進める", right: "人が決める" },
  zones: [
    { label: "AUTO", title: "AIが進められる", body: "読取、整理、Project内の変更、依頼範囲のTest・生成・検査。", icon: "bot", tone: "accent3" },
    { label: "ASK", title: "確認が必要", body: "仕様が分岐する判断、復元、追加範囲、機密情報の扱い。", icon: "circle-help", tone: "accent" },
    { label: "EXTERNAL", title: "別の権限", body: "commit、push、PR、Issue、送信、公開、deploy。", icon: "send", tone: "accent2" },
    { label: "HUMAN", title: "最終判断", body: "本番採用、社内表現、数値、法務・Security、公開可否。", icon: "user-check", tone: "ink" }
  ],
  note: "Skillを使っても権限は広がらない。依頼で許可した操作だけを行う"
}));

// 4. Development reference
addSection("03", "Developmentを詳しく見る", "実務例の裏側にあるFolder、Skill選択、標準工程を確認する");

deck.addCustomSlide(folderTreeSlide({
  pageNum: 32, eyebrow: "DEVELOPMENT", title: "READMEとSkill一覧が開発作業の入口になる",
  caption: "development/",
  nodes: [
    { name: "development/", depth: 0, folder: true },
    { name: "AGENTS.md", depth: 1, note: "AIが守るProject規則", tone: "accent" },
    { name: "README.md", depth: 1, note: "利用者向けの使い方", tone: "accent" },
    { name: "projects/", depth: 1, folder: true, note: "複数Projectを管理する時だけ" },
    { name: "skills/", depth: 1, folder: true, note: "統合Skill", tone: "accent2" },
    { name: "README.md", depth: 2, note: "Skillの選び方" },
    { name: "matt-pocock/", depth: 2, folder: true, note: "原文Skill" },
    { name: "scripts/", depth: 1, folder: true, note: "検証Script" },
    { name: "templates/", depth: 1, folder: true, note: "文書Template" },
    { name: "tests/", depth: 1, folder: true }
  ],
  cards: [
    { label: "入口", title: "README・AGENTS.md", body: "利用者向けの使い方とAIが守る規則。", tone: "accent" },
    { label: "Skill選択", title: "skills/README.md", body: "やりたいことから必要なSkillだけを選ぶ。", tone: "accent2" },
    { label: "PORTABLE", title: "既存構造を維持", body: "コピー先では既存のsrc・docs・testsを使う。", tone: "accent3" }
  ]
}));

addTemplate("guide-routing-guide", {
  "routing-guide": "SKILL選択", "routing-title-with-one-clear-takeawa": "今の状態と必要な成果物から選ぶ",
  start: "START", task: "困りごと", "required-outcome": "曖昧な要望、実装、Bug、提供のどこかを確認する。",
  development: "BEFORE CODE", build: "整理する", "requirements-designcode-tests": "requirements → spec\narchitecture → plan",
  presentation: "CODE EXISTS", explain: "実行・確認", "brief-decksources-visual-qa": "tdd / implementation\ndebug / review / docs",
  next: "READ", skill: "SKILL.md", "read-matching-skill-md": "Trigger、手順、完了条件、権限境界を最後まで読む。",
  "ai-engine-dev-guide": FOOTER, "00": page(33)
}, { "routing-title-with-one-clear-takeawa": 28, "required-outcome": 11, "requirements-designcode-tests": 11, "brief-decksources-visual-qa": 11, "read-matching-skill-md": 11, "ai-engine-dev-guide": 8, "00": 8 });

addProcess("全工程を毎回使わず、依頼に必要な部分だけ通す", [
  ["上流", "要求 → 仕様\n設計 → 計画"], ["調査", "外部仕様や\n選定が必要な時"], ["実装", "TDD → 実装\nBugはDebug"],
  ["確認", "二軸Review\n文書同期"], ["提供", "Delivery\nHuman Review"]
], 34, "DEVELOPMENT FLOW");

deck.addCustomSlide(compositionSlide({
  pageNum: 35, eyebrow: "SKILLの系統", title: "通常は統合Skillから始め、専門Skillを必要時に足す",
  total: "Development Skill 52件の内訳",
  parts: [
    { count: 13, label: "STANDARD", title: "統合Skill 13件", body: "初回導入からDeliveryまでの標準工程。成果物と完了条件が明確で、skills/直下に配置。通常はこちらから選ぶ。", tone: "accent", icon: "layers" },
    { count: 39, label: "SPECIALIZED", title: "原文・補助Skill 39件", body: "Matt原文Skill 37件、設計図のarchify、UI/UX知識のui-ux-pro-max。目的と安定度を確認し、同名SkillはPathを確認する。", tone: "accent2", icon: "puzzle" }
  ],
  note: "52件すべてを有効活用する必要はなく、1つの依頼には必要なSkillだけを使う"
}));

// 5. Presentation reference
addSection("04", "Presentationを詳しく見る", "Deck作成、Template再利用、生成Engine、品質確認の役割を確認する");

deck.addCustomSlide(folderTreeSlide({
  pageNum: 37, eyebrow: "PRESENTATION", title: "完成資料と再利用基盤を分けて管理する",
  caption: "presentation/",
  nodes: [
    { name: "presentation/", depth: 0, folder: true },
    { name: "AGENTS.md", depth: 1, note: "資料作成の規則" },
    { name: "README.md", depth: 1, note: "入口と標準Flow" },
    { name: "assets/", depth: 1, folder: true, note: "共有素材" },
    { name: "presentations/", depth: 1, folder: true, note: "完成版・Review対象", tone: "accent3" },
    { name: "skills/", depth: 1, folder: true, note: "Presentation Skill" },
    { name: "scripts/", depth: 1, folder: true, note: "Skill登録Script" },
    { name: "harness/", depth: 1, folder: true, note: "PPTX生成Engine" },
    { name: "projects/", depth: 2, folder: true, note: "資料ごとの作業場所", tone: "accent2" },
    { name: "templates/", depth: 2, folder: true, note: "再利用Slide", tone: "accent" }
  ],
  cards: [
    { label: "作成中", title: "harness/projects/", body: "資料ごとのBrief・生成Code・出典・出力。", tone: "accent2" },
    { label: "再利用", title: "harness/templates/", body: "実Slide・編集Field・用途説明を部品化。", tone: "accent" },
    { label: "共有", title: "presentations/", body: "完成版またはReview対象を共有領域へ置く。", tone: "accent3" }
  ]
}));

deck.addCustomSlide(nodeMapSlide({
  pageNum: 38, eyebrow: "PRESENTATION SKILL", title: "5つのPresentation Skillは役割ごとに選ぶ",
  nodes: [
    { id: "ingest", x: 0.75, y: 1.45, w: 2.55, h: 0.95, label: "1 部品化", title: "ingest-slide-templates", body: "既存PPTXを再利用する", tone: "accent2" },
    { id: "describe", x: 0.75, y: 2.75, w: 2.55, h: 0.95, label: "2 部品説明", title: "describe-slide-template", body: "AIが選べる説明を作る", tone: "accent2" },
    { id: "templates", x: 3.75, y: 2.72, w: 2.0, h: 1.0, label: "部品置き場", title: "templates/", body: "template.pptx・description.md", dashed: true },
    { id: "build", x: 6.25, y: 1.45, w: 3.25, h: 1.25, label: "Deck制作", title: "build-presentation", body: "PPTXを作る・直す → Deck project一式", dark: true },
    { id: "design", x: 6.25, y: 3.15, w: 3.25, h: 0.58, title: "customize-presentation-design", tone: "accent" },
    { id: "uiux", x: 6.25, y: 3.85, w: 3.25, h: 0.58, title: "ui-ux-pro-max（UI/UX補助）", tone: "accent3" }
  ],
  edges: [
    { from: "ingest", to: "describe", fromSide: "b", toSide: "t" },
    { from: "describe", to: "templates" },
    { from: "templates", to: "build", fromSide: "t", toSide: "l" },
    { from: "design", to: "build", fromSide: "t", toSide: "b" }
  ],
  note: "共通Design（色・書体・Logo）とUI/UX補助は、build-presentationの判断を支える"
}));

deck.addCustomSlide(nodeMapSlide({
  pageNum: 39, eyebrow: "DECK PROJECT", title: "目的・根拠・生成・結果を別Fileで残す",
  nodes: [
    { id: "brief", x: 0.75, y: 1.45, w: 2.7, h: 1.25, label: "1 目的", title: "brief.txt", body: "読者、目的、期待する行動、結論、範囲、確認状態。", tone: "accent" },
    { id: "notes", x: 0.75, y: 2.95, w: 2.7, h: 1.25, label: "2 根拠", title: "source-notes.txt", body: "事実、仮定、未確認、出典、支持する主張。", tone: "accent2" },
    { id: "build", x: 3.95, y: 2.1, w: 2.2, h: 1.45, label: "3 生成", title: "build.ts", body: "Slide順と内容を決定論的なCodeで再生成可能にする。", dark: true },
    { id: "deck", x: 6.65, y: 1.45, w: 2.85, h: 0.8, label: "4 結果 output/", title: "deck.pptx", tone: "accent3" },
    { id: "shots", x: 6.65, y: 2.42, w: 2.85, h: 0.8, label: "4 結果 output/", title: "全枚画像", tone: "accent3" },
    { id: "reports", x: 6.65, y: 3.39, w: 2.85, h: 0.8, label: "4 結果 output/", title: "Build report・QA report", tone: "accent3" }
  ],
  edges: [
    { from: "brief", to: "build" },
    { from: "notes", to: "build" },
    { from: "build", to: "deck" },
    { from: "build", to: "shots" },
    { from: "build", to: "reports" }
  ],
  note: "build.tsを再実行すれば、同じ入力から同じPPTXを再生成できる"
}));

addProcess("PPTX生成成功と資料品質を別々に確認する", [
  ["Build", "TypeScript\nPPTX生成"], ["構造", "Package・Field\nSlide数"], ["画像化", "全Slideを\n同じ条件でRender"],
  ["目視", "切れ・重なり\n余白・対比"], ["引渡", "実施済み\n未実施を分離"]
], 40, "PRESENTATION QA");

// 6. Outcome and handoff
addSection("05", "使った結果を引き継ぐ", "成果物、検証、未確認事項、次の人の行動を一つにまとめる");

addTemplate("guide-comparison", {
  comparison: "作業完了の意味", "two-area-comparison": "生成しただけではなく、確認できる状態までを成果とする",
  "left-area": "NOT ENOUGH", development: "AIの回答だけ",
  "purposeprimary-inputstypical-skillsm": "会話に説明があるだけ\nFileの場所が不明\nどのTestを実行したか不明\n未確認事項が埋もれる\n外部操作の有無が不明",
  "right-area": "READY TO REVIEW", presentation: "引き継げる状態",
  "purposeprimary-inputstypical-skillsm-2": "成果物へのPathがある\n正本文書と変更が一致する\n検証Commandと結果がある\n未確認・Riskが分離される\n次のHuman actionが明確",
  "shared-rule-evidence-canonical-sourc": "利用後に確認するもの：成果物・根拠・検証・未確認・次の行動",
  "ai-engine-dev-guide": FOOTER, "00": page(42)
}, { "two-area-comparison": 27, "purposeprimary-inputstypical-skillsm": 12, "purposeprimary-inputstypical-skillsm-2": 12, "shared-rule-evidence-canonical-sourc": 11, "ai-engine-dev-guide": 8, "00": 8 });

addTemplate("guide-checklist", {
  "final-check": "引き継ぎCHECK", "the-reader-is-ready-when-these-six-c": "AIの完了報告では次の6点を見る",
  "text-3": "1", "i-know-which-folder-owns-the-work": "何を変更・作成したか",
  "text-6": "2", "i-selected-only-the-skills-required-": "成果物はどこにあるか",
  "text-9": "3", "facts-assumptions-and-unresolved-ite": "どの根拠を使ったか",
  "text-12": "4", "outputs-and-canonical-documents-agre": "どのBuild・Test・QAが成功したか",
  "text-15": "5", "completed-and-uncompleted-checks-are": "何が未確認で、どんなRiskが残るか",
  "text-18": "6", "external-actions-stay-within-explici": "人が次に判断・実行することは何か",
  "reference-links-or-next-action": "commit・push・PR・公開・deployは、実施したかどうかを必ず分けて確認する"
}, { "the-reader-is-ready-when-these-six-c": 28, "i-know-which-folder-owns-the-work": 14, "i-selected-only-the-skills-required-": 14, "facts-assumptions-and-unresolved-ite": 14, "outputs-and-canonical-documents-agre": 14, "completed-and-uncompleted-checks-are": 14, "external-actions-stay-within-explici": 14, "reference-links-or-next-action": 10 });

// 7. Appendix
addSection("06", "Skill索引", "ここからは必要なSkillを名前で探すための参照資料");

deck.addCustomSlide(skillFamilyMapSlide({
  pageNum: 45, eyebrow: "APPENDIX：SKILL MAP", title: "Skill索引は8つの系統で探す",
  groups: [
    { area: "DEV・統合", tone: "accent", families: [{ name: "統合Skill", count: 13, examples: "requirements-analysis\nspecification / tdd", pages: "索引 1〜4" }] },
    {
      area: "DEV・Matt原文", tone: "accent2", families: [
        { name: "明示して使う", count: 9, examples: "ask-matt / triage\nto-spec / to-tickets", pages: "索引 4〜6" },
        { name: "自動で選択", count: 9, examples: "prototype / research\ndiagnosing-bugs", pages: "索引 6〜8" },
        { name: "Productivity", count: 7, examples: "grill-me / handoff\nteach / grilling", pages: "索引 8〜10" },
        { name: "Beta", count: 8, examples: "loop-me / retro\nimplement-spec", pages: "索引 10〜12" },
        { name: "Misc", count: 4, examples: "setup-pre-commit\nscaffold-exercises", pages: "索引 12〜13" }
      ]
    },
    { area: "DEV・補助", tone: "accent3", families: [{ name: "補助Skill", count: 2, examples: "archify\nui-ux-pro-max", pages: "索引 13" }] },
    { area: "PRESENTATION", tone: "ink", families: [{ name: "資料作成Skill", count: 5, examples: "build-presentation\ningest-slide-templates", pages: "Presentation索引" }] }
  ],
  note: "名前が分かる場合は索引で探し、分からない場合はskills/README.mdから選ぶ"
}));

const developmentSkills: SkillRow[] = [
  { category: "統合・初回", name: "bootstrap-development-harness", when: "既存Projectへ初導入", output: "README・AGENTS.md" },
  { category: "統合・要求", name: "requirements-analysis", when: "要望を要求へ整理", output: "要求文書" },
  { category: "統合・仕様", name: "specification", when: "振る舞い・異常系を確定", output: "仕様書" },
  { category: "統合・設計", name: "architecture-design", when: "責務・境界・APIを設計", output: "設計記録・ADR" },
  { category: "統合・計画", name: "implementation-planning", when: "依存付き作業へ分解", output: "計画・Ticket" },
  { category: "統合・調査", name: "research", when: "外部一次情報が必要", output: "調査文書" },
  { category: "統合・Test", name: "tdd", when: "Test先行で振る舞い変更", output: "RED/GREEN/REFACTOR" },
  { category: "統合・実装", name: "implementation", when: "承認済み仕様を小さく実装", output: "垂直Slice" },
  { category: "統合・障害", name: "debugging", when: "Bug・Build・性能劣化", output: "根本原因・回帰Test" },
  { category: "統合・Review", name: "code-review", when: "差分を二軸で確認", output: "指摘と判定" },
  { category: "統合・文書", name: "documentation", when: "利用・設計知識を同期", output: "README・ADR等" },
  { category: "統合・提供", name: "delivery", when: "Git・CI・Release", output: "PR・CI・Rollback" },
  { category: "統合・実行", name: "orchestrated-development", when: "役割別Agentで連続実行", output: "Task・Review台帳" },
  { category: "Matt・明示", name: "ask-matt", when: "使うSkillが不明", output: "推奨Flow" },
  { category: "Matt・明示", name: "grill-with-docs", when: "要望を文書と質問で深掘り", output: "論点・用語・ADR" },
  { category: "Matt・明示", name: "triage", when: "未整理Issue・外部PRを分類", output: "分類・Brief" },
  { category: "Matt・明示", name: "improve-codebase-architecture", when: "Deep module候補を調査", output: "HTML report" },
  { category: "Matt・明示", name: "setup-matt-pocock-skills", when: "原文Skillを初期設定", output: "docs/agents設定" },
  { category: "Matt・明示", name: "to-spec", when: "解決済み会話を仕様化", output: "仕様Issue・文書" },
  { category: "Matt・明示", name: "to-tickets", when: "仕様を依存付きTicket化", output: "Ticket群" },
  { category: "Matt・明示", name: "implement", when: "仕様・Ticketを実装", output: "実装・Test・Review" },
  { category: "Matt・明示", name: "wayfinder", when: "巨大で不確実な計画", output: "意思決定地図" },
  { category: "Matt・自動", name: "prototype", when: "捨てる試作で疑問を検証", output: "Prototype・回答" },
  { category: "Matt・自動", name: "diagnosing-bugs", when: "難しい不具合を再現から調査", output: "原因・修正・回帰Test" },
  { category: "Matt・自動", name: "research", when: "一次資料を引用付きで調査", output: "Markdown調査" },
  { category: "Matt・自動", name: "tdd", when: "正しいSeamでTest先行", output: "Testと実装" },
  { category: "Matt・自動", name: "domain-modeling", when: "Domain用語を明確化", output: "CONTEXT・ADR" },
  { category: "Matt・自動", name: "codebase-design", when: "Deep moduleとInterface設計", output: "設計語彙・境界" },
  { category: "Matt・自動", name: "code-review", when: "仕様・標準の二軸Review", output: "差分指摘" },
  { category: "Matt・自動", name: "resolving-merge-conflicts", when: "Merge/Rebase conflict", output: "意図を保つ解消" },
  { category: "Matt・自動", name: "wizard", when: "人専用設定を対話手順化", output: "Bash wizard" },
  { category: "Productivity", name: "grill-me", when: "Directoryなしの相談を深掘り", output: "判断・未決事項" },
  { category: "Productivity", name: "handoff", when: "別Agent・Sessionへ移す", output: "引継ぎ文書" },
  { category: "Productivity", name: "teach", when: "複数Sessionで学習", output: "教材・学習記録" },
  { category: "Productivity", name: "to-questionnaire", when: "専門家への質問を整理", output: "質問票" },
  { category: "Productivity", name: "wait-what", when: "直前説明を平易に再構成", output: "再説明" },
  { category: "Productivity", name: "grilling", when: "判断を質問でStress test", output: "事実・分岐" },
  { category: "Productivity", name: "writing-for-agents", when: "Agent向け文書を作る", output: "Skill・AGENTS.md" },
  { category: "Beta", name: "loop-me", when: "複数SessionでWorkflow設計", output: "状態付き仕様" },
  { category: "Beta", name: "writing-beats", when: "記事を展開単位で構成", output: "Beatと本文" },
  { category: "Beta", name: "writing-fragments", when: "記事材料をInterview収集", output: "断片素材" },
  { category: "Beta", name: "writing-shape", when: "Markdown素材を記事化", output: "完成記事" },
  { category: "Beta", name: "claude-handoff", when: "Claude背景Agentへ移す", output: "即時Handoff" },
  { category: "Beta", name: "setup-ts-deep-modules", when: "TS境界を静的強制", output: "dependency設定" },
  { category: "Beta", name: "implement-spec", when: "Task graphを並行実装", output: "1 Branch・PR" },
  { category: "Beta", name: "retro", when: "Session後の環境改善検討", output: "現状はStub" },
  { category: "Misc", name: "git-guardrails-claude-code", when: "危険なGit操作をHookで阻止", output: "Claude Hook" },
  { category: "Misc", name: "migrate-to-shoehorn", when: "TS Testのasを移行", output: "安全なFixture" },
  { category: "Misc", name: "scaffold-exercises", when: "演習Directoryを作る", output: "問題・解答・解説" },
  { category: "Misc", name: "setup-pre-commit", when: "Commit前検査を追加", output: "Husky等の設定" },
  { category: "補助", name: "archify", when: "設計・Flow・差分を図示", output: "図・検証記録" },
  { category: "補助", name: "ui-ux-pro-max", when: "UI/UX知識を検索", output: "候補・QA観点" }
];

if (developmentSkills.length !== 52) throw new Error(`Expected 52 development Skills, found ${developmentSkills.length}.`);

for (let index = 0; index < developmentSkills.length; index += 4) {
  addCatalog(`Development Skill索引 ${index / 4 + 1}/13`, developmentSkills.slice(index, index + 4), 46 + index / 4, "APPENDIX：52 SKILLS");
}

addCatalog("Presentation Skill索引 1/2", [
  { category: "制作", name: "build-presentation", when: "PPTX新規作成・改訂", output: "Deck project一式" },
  { category: "取込", name: "ingest-slide-templates", when: "既存Slideを部品化", output: "Template一式" },
  { category: "説明", name: "describe-slide-template", when: "Template用途を記述", output: "description.md" },
  { category: "Design", name: "customize-presentation-design", when: "共通Designを変更", output: "design.ts・design.md" }
], 59, "APPENDIX：PRESENTATION");

addCatalog("Presentation Skill索引 2/2", [
  { category: "UI/UX補助", name: "ui-ux-pro-max", when: "設計知識・候補を検索", output: "候補・確認観点" },
  { category: "正本", name: "presentation/skills/README.md", when: "Skillを選ぶ", output: "入口と境界" },
  { category: "設定", name: "presentation/skills/SETUP.md", when: "Codex/Claudeへ登録", output: "Linkと検証手順" },
  { category: "実行", name: "presentation/harness/README.md", when: "依存・Commandを確認", output: "生成・QA手順" }
], 60, "APPENDIX：PRESENTATION");

addTemplate("guide-evidence-and-caution", {
  "evidence-and-caution": "用語", "evidence-and-authority": "4つの用語を同じ意味で使う",
  confirmed: "CANONICAL", fact: "正本", "verified-by-a-current-source-or-chec": "最新の定義や手順を一か所で管理し、他はLinkする。",
  assumption: "OUTPUT", "assumption-2": "成果物", "useful-for-progress-but-clearly-labe": "利用されるSlide、仕様、Code、Test、調査報告など。",
  open: "EVIDENCE", unresolved: "根拠", "needs-user-input-or-later-verificati": "判断を支える仕様、実装、Log、Test、公式文書。",
  boundary: "OPEN", permission: "未確認事項", "skills-do-not-expand-authority": "必要だが権限・環境・情報不足で確認できないこと。",
  "ai-engine-dev-guide": FOOTER, "00": page(61)
}, { "evidence-and-authority": 30, "verified-by-a-current-source-or-chec": 12, "useful-for-progress-but-clearly-labe": 12, "needs-user-input-or-later-verificati": 12, "skills-do-not-expand-authority": 12, "ai-engine-dev-guide": 8, "00": 8 });

addTemplate("guide-checklist", {
  "final-check": "最初の一歩", "the-reader-is-ready-when-these-six-c": "次の依頼はこの順番で始める",
  "text-3": "1", "i-know-which-folder-owns-the-work": "対象ProjectをCodexまたはClaude Codeで開く",
  "text-6": "2", "i-selected-only-the-skills-required-": "AGENTS.mdと担当領域READMEを読む",
  "text-9": "3", "facts-assumptions-and-unresolved-ite": "目的・対象・完了条件・権限を伝える",
  "text-12": "4", "outputs-and-canonical-documents-agre": "選ばれたSkillと作業範囲を確認する",
  "text-15": "5", "completed-and-uncompleted-checks-are": "成果物と検証結果を確認する",
  "text-18": "6", "external-actions-stay-within-explici": "未確認・Risk・次のHuman actionを判断する",
  "reference-links-or-next-action": "入口：development/README.md｜presentation/README.md｜各skills/README.md"
}, { "the-reader-is-ready-when-these-six-c": 29, "i-know-which-folder-owns-the-work": 13, "i-selected-only-the-skills-required-": 13, "facts-assumptions-and-unresolved-ite": 13, "outputs-and-canonical-documents-agre": 13, "completed-and-uncompleted-checks-are": 13, "external-actions-stay-within-explici": 13, "reference-links-or-next-action": 10 });

await deck.render({ output: "output/deck.pptx", report: "output/build-report.md", screenshots: "output/screenshots" });
