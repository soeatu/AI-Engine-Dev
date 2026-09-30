import { Presentation, type SlideVariables } from "../../src/index.js";

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

addTemplate("guide-step-by-step", {
  "step-by-step": "この資料の読み方", "four-step-procedure": "4つの疑問に順番に答える",
  "1": "1", "read-the-entrypoint": "何ができる？", "open-the-nearest-readme-and-agents-m": "開発と資料作成で、どんな依頼を成果物へ変えられるか。",
  "2": "2", "fix-the-brief": "何を準備する？", "record-scope-evidence-constraints-an": "新規・既存Project別の配置、Skill登録、必要Tool。",
  "3": "3", "run-the-skill": "どう頼む？", "create-the-artifact-with-its-require": "最初の依頼文、選ばれるSkill、途中で確認される内容。",
  "4": "4", "verify-and-hand-off": "使うとどうなる？", "separate-completed-checks-from-remai": "生成されるFile、Test・QA、未確認事項、次の行動。",
  "ai-engine-dev-guide": FOOTER, "00": page(2)
}, { "four-step-procedure": 29, "read-the-entrypoint": 17, "fix-the-brief": 17, "run-the-skill": 17, "verify-and-hand-off": 17, "ai-engine-dev-guide": 8, "00": 8 });

addTemplate("guide-comparison", {
  comparison: "まず理解すること", "two-area-comparison": "AI-Engine-DevはAI作業の再利用キット",
  "left-area": "WHAT IT IS", development: "含まれるもの",
  "purposeprimary-inputstypical-skillsm": "AI向けの工程手順（Skill）\nProject内の作業規則（AGENTS.md）\n要求・仕様・資料のTemplate\nPPTX生成Engineと再利用Slide\nTest・構造検査・目視QAの手順",
  "right-area": "HOW IT RUNS", presentation: "利用する場所",
  "purposeprimary-inputstypical-skillsm-2": "CodexまたはClaude Codeで開く\n対象Projectの実物を読み取る\n依頼に合うSkillを選ぶ\nProject内へ成果物を作る\n検証結果と未確認事項を返す",
  "shared-rule-evidence-canonical-sourc": "AI-Engine-Dev単体を起動するのではなく、対象Project内のAI作業へ組み込む",
  "ai-engine-dev-guide": FOOTER, "00": page(3)
}, { "two-area-comparison": 27, "purposeprimary-inputstypical-skillsm": 12, "purposeprimary-inputstypical-skillsm-2": 12, "shared-rule-evidence-canonical-sourc": 11, "ai-engine-dev-guide": 8, "00": 8 });

addCatalog("Developmentは要望を検証済み変更へ変える", [
  { category: "考える", name: "要求・仕様・設計", when: "要望が曖昧、設計判断が必要", output: "要求書・仕様書・ADR" },
  { category: "作る", name: "TDD・実装", when: "仕様をCodeへ変えたい", output: "実装・Test・検証記録" },
  { category: "直す", name: "障害調査・Review", when: "Bug、性能劣化、差分確認", output: "根本原因・回帰Test・指摘" },
  { category: "届ける", name: "文書化・Delivery", when: "利用手順、PR、Release", output: "README・PR・CI結果" }
], 4, "できること：DEVELOPMENT");

addCatalog("Presentationは根拠付きPPTXを再生成できる", [
  { category: "作る", name: "build-presentation", when: "新規Deck・既存Deck改訂", output: "PPTX・出典・QA report" },
  { category: "再利用", name: "Template取込・説明", when: "既存Slideを部品化", output: "template.pptx・fields.yml" },
  { category: "整える", name: "Design System調整", when: "色・書体・Logoを統一", output: "design.ts・design.md" },
  { category: "確かめる", name: "構造検査・全枚QA", when: "共有可能か確認", output: "画像・Build/QA report" }
], 5, "できること：PRESENTATION");

addProcess("要望を、Reviewできる開発成果物へ変える", [
  ["入力", "要望・Issue\n既存Code"], ["整理", "要求・仕様\n設計・計画"], ["実行", "Test先行\n小さく実装"],
  ["検証", "Build・Test\n二軸Review"], ["結果", "Code・文書\n未確認事項"]
], 6, "DEVELOPMENTの変換");

addProcess("説明したい内容を、再生成できるPPTXへ変える", [
  ["入力", "目的・読者\n根拠・素材"], ["合意", "Brief\n構成・結論"], ["生成", "Template\nbuild.ts"],
  ["検証", "PPTX構造\n全枚Render"], ["結果", "Deck・出典\nQA report"]
], 7, "PRESENTATIONの変換");

addTemplate("guide-comparison", {
  comparison: "利用前と利用後", "two-area-comparison": "会話で終わらず、次の人が確認できる状態を残す",
  "left-area": "BEFORE", development: "依頼した時点",
  "purposeprimary-inputstypical-skillsm": "要望の解釈が人によって違う\n根拠と推測が混ざる\n何をTestするか不明\n成果物の置き場所が不統一\n次の担当者が会話を再読する",
  "right-area": "AFTER", presentation: "作業完了時",
  "purposeprimary-inputstypical-skillsm-2": "要求・仕様・判断が文書化される\n事実・仮定・未確認を区別する\n実施した検証を具体的に記録する\n正本と成果物の場所が決まる\nRiskと次の行動を引き継げる",
  "shared-rule-evidence-canonical-sourc": "価値はAIの回答文ではなく、Projectに残る成果物と検証可能性",
  "ai-engine-dev-guide": FOOTER, "00": page(8)
}, { "two-area-comparison": 27, "purposeprimary-inputstypical-skillsm": 12, "purposeprimary-inputstypical-skillsm-2": 12, "shared-rule-evidence-canonical-sourc": 11, "ai-engine-dev-guide": 8, "00": 8 });

// 2. Environment setup
addSection("01", "環境を準備する", "利用場所を選び、Skill登録と実行環境を確認する");

addTemplate("guide-routing-guide", {
  "routing-guide": "最初の分岐", "routing-title-with-one-clear-takeawa": "利用場所によって準備方法を選ぶ",
  start: "START", task: "どこで使う？", "required-outcome": "このRepositoryか、別のProjectかを決める。",
  development: "THIS REPO", build: "そのまま利用", "requirements-designcode-tests": "AI-Engine-Dev rootを\nCodex / Claudeで開く",
  presentation: "OTHER PROJECT", explain: "コピー利用", "brief-decksources-visual-qa": "新規はportable copy\n既存はbootstrap",
  next: "VERIFY", skill: "Skill一覧", "read-matching-skill-md": "検出されたSkillとProject規則を確認する。",
  "ai-engine-dev-guide": FOOTER, "00": page(10)
}, { "routing-title-with-one-clear-takeawa": 28, "required-outcome": 12, "requirements-designcode-tests": 12, "brief-decksources-visual-qa": 12, "read-matching-skill-md": 12, "ai-engine-dev-guide": 8, "00": 8 });

addTemplate("guide-step-by-step", {
  "step-by-step": "このRepositoryで使う", "four-step-procedure": "AI-Engine-Dev自体はすでに利用可能な構成",
  "1": "1", "read-the-entrypoint": "Repositoryを開く", "open-the-nearest-readme-and-agents-m": "AI-Engine-Dev rootをCodexまたはClaude Codeで開く。",
  "2": "2", "fix-the-brief": "規則を確認", "record-scope-evidence-constraints-an": "AGENTS.mdと担当領域のREADMEを先に読む。",
  "3": "3", "run-the-skill": "Skill一覧を見る", "create-the-artifact-with-its-require": "Codexは/skills、ClaudeではSkill名を確認する。",
  "4": "4", "verify-and-hand-off": "名前とPathを確認", "separate-completed-checks-from-remai": ".agents/skillsまたは.claude/skillsのLink先を確認する。",
  "ai-engine-dev-guide": FOOTER, "00": page(11)
}, { "four-step-procedure": 27, "ai-engine-dev-guide": 8, "00": 8 });

addTemplate("guide-folder-map", {
  "workspace-map": "空の新規Project", "folder-roles-become-clear-at-a-glanc": "development/.をProject rootへコピーする",
  "workspace-root-development-projects-": "cd AI-Engine-Dev\n\ncp -R development/. \\\n  ../new-project/\n\ncd ../new-project",
  "primary-area": "重要", "folder-name": "末尾の . を残す", "responsibility-and-entry-point": "隠しDirectoryの.agentsと.claudeもコピー対象になる。",
  "canonical-entry": "コピー後", "readme-md": "Project rootとして使う", "first-document-and-next-action": "既存のsrc等をprojects/へ移動する必要はない。",
  boundary: "確認", "what-belongs-elsewhere": "verify script", "name-the-nearest-related-area-and-pr": "元Repositoryではdevelopment/scripts/verify-portable-development-root.shを実行できる。",
  "ai-engine-dev-guide": FOOTER, "00": page(12)
}, { "folder-roles-become-clear-at-a-glanc": 27, "folder-name": 16, "responsibility-and-entry-point": 11, "readme-md": 15, "first-document-and-next-action": 11, "what-belongs-elsewhere": 16, "name-the-nearest-related-area-and-pr": 10, "ai-engine-dev-guide": 8, "00": 8 }, { "workspace-root-development-projects-": MONO });

addTemplate("guide-step-by-step", {
  "step-by-step": "既存Project", "four-step-procedure": "一括コピーせずbootstrapを明示して依頼する",
  "1": "1", "read-the-entrypoint": "既存Projectを開く", "open-the-nearest-readme-and-agents-m": "実装・設定・既存READMEを保持した状態でAIに見せる。",
  "2": "2", "fix-the-brief": "Skillを明示", "record-scope-evidence-constraints-an": "$bootstrap-development-harness を使うよう依頼する。",
  "3": "3", "run-the-skill": "調査結果を確認", "create-the-artifact-with-its-require": "既存構造、規則、必要な入口文書の提案を確認する。",
  "4": "4", "verify-and-hand-off": "追加内容をReview", "separate-completed-checks-from-remai": "README・AGENTS.mdなど必要な文書だけが追加される。",
  "ai-engine-dev-guide": FOOTER, "00": page(13)
}, { "four-step-procedure": 27, "ai-engine-dev-guide": 8, "00": 8 });

addTemplate("guide-step-by-step", {
  "step-by-step": "Presentation Skill登録", "four-step-procedure": "セットアップScriptで5 Skillを検出可能にする",
  "1": "1", "read-the-entrypoint": "presentation/を配置", "open-the-nearest-readme-and-agents-m": "利用するProject rootの直下にpresentation/を置く。",
  "2": "2", "fix-the-brief": "Scriptを実行", "record-scope-evidence-constraints-an": "./presentation/scripts/setup-skills.sh を1回実行する。",
  "3": "3", "run-the-skill": "Linkを確認", "create-the-artifact-with-its-require": ".agents/skillsと.claude/skillsに相対Linkが作られる。",
  "4": "4", "verify-and-hand-off": "再起動", "separate-completed-checks-from-remai": "一覧に出ない場合だけCodexまたはClaude Codeを再起動する。",
  "ai-engine-dev-guide": FOOTER, "00": page(14)
}, { "four-step-procedure": 26, "open-the-nearest-readme-and-agents-m": 11, "record-scope-evidence-constraints-an": 11, "create-the-artifact-with-its-require": 11, "separate-completed-checks-from-remai": 11, "ai-engine-dev-guide": 8, "00": 8 });

addTemplate("guide-step-by-step", {
  "step-by-step": "PowerPoint生成Engine", "four-step-procedure": "Node.js 20以上とLibreOfficeを準備する",
  "1": "1", "read-the-entrypoint": "必要Tool", "open-the-nearest-readme-and-agents-m": "Node.js 20以上とnpm。全枚画像化にはLibreOfficeも必要。",
  "2": "2", "fix-the-brief": "依存をInstall", "record-scope-evidence-constraints-an": "cd presentation/harness → npm ci",
  "3": "3", "run-the-skill": "基盤を確認", "create-the-artifact-with-its-require": "npm run build → npm test → npm run self-validate",
  "4": "4", "verify-and-hand-off": "成功状態", "separate-completed-checks-from-remai": "型検査・Test・一時PPTX生成が成功し、必要なら画像も生成される。",
  "ai-engine-dev-guide": FOOTER, "00": page(15)
}, { "four-step-procedure": 26, "open-the-nearest-readme-and-agents-m": 11, "record-scope-evidence-constraints-an": 11, "create-the-artifact-with-its-require": 11, "separate-completed-checks-from-remai": 11, "ai-engine-dev-guide": 8, "00": 8 });

addTemplate("guide-step-by-step", {
  "step-by-step": "任意：Matt原文Skill", "four-step-procedure": "専門Skillは必要な範囲だけ追加する",
  "1": "1", "read-the-entrypoint": "まず安定版25件", "open-the-nearest-readme-and-agents-m": "engineeringとproductivityだけをLinkする構成が推奨。",
  "2": "2", "fix-the-brief": "初回設定", "record-scope-evidence-constraints-an": "$setup-matt-pocock-skills を明示して実行する。",
  "3": "3", "run-the-skill": "設定内容を決める", "create-the-artifact-with-its-require": "Issue管理先、Label、CONTEXT.md、ADR配置を確認する。",
  "4": "4", "verify-and-hand-off": "重複を避ける", "separate-completed-checks-from-remai": "統合Skillと同名の場合は名前だけでなくPathも確認する。",
  "ai-engine-dev-guide": FOOTER, "00": page(16)
}, { "four-step-procedure": 26, "ai-engine-dev-guide": 8, "00": 8 });

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

addTemplate("guide-comparison", {
  comparison: "最初に選ぶ環境", "two-area-comparison": "このProjectには2つの作業環境がある",
  "left-area": "DEVELOPMENT", development: "システム開発",
  "purposeprimary-inputstypical-skillsm": "対象：アプリ・Web・業務System\n扱うこと：要求、仕様、設計、実装\n確認：Test、Build、Code review\n入口：development/README.md\n例：新機能追加、不具合調査",
  "right-area": "PRESENTATION", presentation: "資料作成",
  "purposeprimary-inputstypical-skillsm-2": "対象：PowerPoint資料\n扱うこと：Brief、構成、Template、生成\n確認：PPTX構造、全ページ目視QA\n入口：presentation/README.md\n例：説明資料、提案書、報告資料",
  "shared-rule-evidence-canonical-sourc": "依頼する前に、成果物がSystem変更かPowerPoint資料かで環境を選ぶ",
  "ai-engine-dev-guide": FOOTER, "00": page(19)
}, { "two-area-comparison": 29, "purposeprimary-inputstypical-skillsm": 12, "purposeprimary-inputstypical-skillsm-2": 12, "shared-rule-evidence-canonical-sourc": 11, "ai-engine-dev-guide": 8, "00": 8 });

addTemplate("guide-step-by-step", {
  "step-by-step": "依頼文の型", "four-step-procedure": "4要素を伝えると作業範囲が安定する",
  "1": "1", "read-the-entrypoint": "目的", "open-the-nearest-readme-and-agents-m": "誰の、どんな問題を解決したいか。",
  "2": "2", "fix-the-brief": "対象", "record-scope-evidence-constraints-an": "Project、機能、資料、既存Fileなど作業範囲。",
  "3": "3", "run-the-skill": "完了条件", "create-the-artifact-with-its-require": "何ができれば完了か、必要なTestや表示確認。",
  "4": "4", "verify-and-hand-off": "権限", "separate-completed-checks-from-remai": "変更のみか、commit・PR・公開まで許可するか。",
  "ai-engine-dev-guide": FOOTER, "00": page(20)
}, { "four-step-procedure": 28, "ai-engine-dev-guide": 8, "00": 8 });

addSection("A", "Developmentへ依頼する", "システム開発の新機能追加と不具合調査を具体例で確認する");

addTemplate("guide-comparison", {
  comparison: "DEVELOPMENT 例1：新機能", "two-area-comparison": "要望だけでなく、完了条件と権限を一緒に伝える",
  "left-area": "REQUEST", development: "依頼例",
  "purposeprimary-inputstypical-skillsm": "ユーザーが通知時刻を変更できる機能を追加してください。\n既存仕様と実装を確認し、要求と仕様を整理してください。\nTestを先に作り、READMEも同期してください。\ncommit・pushはしないでください。",
  "right-area": "ROUTED WORK", presentation: "AIが選ぶ工程",
  "purposeprimary-inputstypical-skillsm-2": "requirements-analysis\nspecification\narchitecture-design / planning\ntdd → implementation\ncode-review → documentation",
  "shared-rule-evidence-canonical-sourc": "途中で仕様判断が必要なら、AIは実装前に確認を求める",
  "ai-engine-dev-guide": FOOTER, "00": page(22)
}, { "two-area-comparison": 27, "purposeprimary-inputstypical-skillsm": 11, "purposeprimary-inputstypical-skillsm-2": 12, "shared-rule-evidence-canonical-sourc": 11, "ai-engine-dev-guide": 8, "00": 8 });

addProcess("新機能の利用後は、実装・文書・検証が残る", [
  ["要求", "docs/requirements\n受入条件"], ["仕様", "docs/specs\n異常系"], ["実装", "Source code\nTest code"],
  ["検証", "Build・Test\nReview結果"], ["引継", "README\nRisk・次の行動"]
], 23, "DEVELOPMENT 例1：利用後");

addTemplate("guide-comparison", {
  comparison: "DEVELOPMENT 例2：不具合", "two-area-comparison": "修正を急がず、再現と根本原因から始める",
  "left-area": "REQUEST", development: "依頼例",
  "purposeprimary-inputstypical-skillsm": "保存後に画面が古い値へ戻る原因を調査してください。\n再現条件と根本原因を特定し、影響範囲を説明してください。\n今は診断だけで、修正はしないでください。",
  "right-area": "RESULT", presentation: "利用後に残るもの",
  "purposeprimary-inputstypical-skillsm-2": "再現手順と観測結果\n原因仮説と検証結果\n根本原因の説明\n影響範囲と安全な修正方針\n未実施の修正・実機確認",
  "shared-rule-evidence-canonical-sourc": "「診断だけ」と指定すれば、原因説明までで止まり、修正権限は広がらない",
  "ai-engine-dev-guide": FOOTER, "00": page(24)
}, { "two-area-comparison": 27, "purposeprimary-inputstypical-skillsm": 11, "purposeprimary-inputstypical-skillsm-2": 12, "shared-rule-evidence-canonical-sourc": 11, "ai-engine-dev-guide": 8, "00": 8 });

addSection("B", "Presentationへ依頼する", "PowerPoint資料の依頼と、残る成果物を確認する");

addTemplate("guide-comparison", {
  comparison: "PRESENTATION 例：説明資料", "two-area-comparison": "読者と読後の行動を指定すると構成判断が変わる",
  "left-area": "REQUEST", development: "依頼例",
  "purposeprimary-inputstypical-skillsm": "職場の同僚向けに、この仕組みの利用ガイドを作ってください。\n何ができるか、環境準備、利用後の成果を説明してください。\n編集可能なPPTXと全ページQA結果を残してください。",
  "right-area": "ROUTED WORK", presentation: "AIが行うこと",
  "purposeprimary-inputstypical-skillsm-2": "Briefで理解を合意\n根拠とSection順を記録\nTemplateまたは新規作図を選択\n決定論的にPPTXを生成\n構造検査と全枚目視QA",
  "shared-rule-evidence-canonical-sourc": "資料の価値は枚数ではなく、読者が次の行動を判断できること",
  "ai-engine-dev-guide": FOOTER, "00": page(26)
}, { "two-area-comparison": 27, "purposeprimary-inputstypical-skillsm": 11, "purposeprimary-inputstypical-skillsm-2": 12, "shared-rule-evidence-canonical-sourc": 11, "ai-engine-dev-guide": 8, "00": 8 });

addProcess("資料を使った後は、PPTXを再生成・検証できる", [
  ["目的", "brief.txt\n理解確認"], ["根拠", "source-notes\n出典・仮定"], ["生成", "build.ts\nTemplate"],
  ["表示", "deck.pptx\n全Slide画像"], ["証拠", "Build report\nQA report"]
], 27, "PRESENTATION：利用後");

addTemplate("guide-folder-map", {
  "workspace-map": "成果物の場所", "folder-roles-become-clear-at-a-glanc": "作業後は会話ではなくProject内のFileを正本にする",
  "workspace-root-development-projects-": "project-root/\n├─ docs/requirements/\n├─ docs/specs/\n├─ docs/plans/\n├─ src/ and tests/\n└─ presentation/harness/\n   └─ projects/<deck-id>/\n      ├─ brief.txt\n      ├─ source-notes.txt\n      └─ output/",
  "primary-area": "Development", "folder-name": "docs / src / tests", "responsibility-and-entry-point": "仕様、実装、Test、ADRなどを既存Project構造へ置く。",
  "canonical-entry": "Presentation", "readme-md": "projects/<deck-id>/", "first-document-and-next-action": "PPTX、生成Code、出典、QA結果を一緒に管理する。",
  boundary: "引き継ぎ", "what-belongs-elsewhere": "結果を分離", "name-the-nearest-related-area-and-pr": "実施済み、未確認、Risk、次の行動を明示する。",
  "ai-engine-dev-guide": FOOTER, "00": page(28)
}, { "folder-roles-become-clear-at-a-glanc": 26, "folder-name": 15, "responsibility-and-entry-point": 11, "readme-md": 15, "first-document-and-next-action": 11, "what-belongs-elsewhere": 17, "name-the-nearest-related-area-and-pr": 11, "ai-engine-dev-guide": 8, "00": 8 }, { "workspace-root-development-projects-": MONO });

addTemplate("guide-evidence-and-caution", {
  "evidence-and-caution": "人が決めること", "evidence-and-authority": "外部操作と最終判断は、人が承認する",
  confirmed: "AUTO", fact: "AIが進められる", "verified-by-a-current-source-or-chec": "読取、整理、Project内の変更、依頼範囲のTest・生成・検査。",
  assumption: "ASK", "assumption-2": "確認が必要", "useful-for-progress-but-clearly-labe": "仕様が分岐する判断、復元、追加範囲、機密情報の扱い。",
  open: "EXTERNAL", unresolved: "別の権限", "needs-user-input-or-later-verificati": "commit、push、PR、Issue、送信、公開、deploy。",
  boundary: "HUMAN", permission: "最終判断", "skills-do-not-expand-authority": "本番採用、社内表現、数値、法務・Security、公開可否。",
  "ai-engine-dev-guide": FOOTER, "00": page(29)
}, { "evidence-and-authority": 27, "verified-by-a-current-source-or-chec": 11, "useful-for-progress-but-clearly-labe": 11, "needs-user-input-or-later-verificati": 11, "skills-do-not-expand-authority": 11, "ai-engine-dev-guide": 8, "00": 8 });

// 4. Development reference
addSection("03", "Developmentを詳しく見る", "実務例の裏側にあるFolder、Skill選択、標準工程を確認する");

addTemplate("guide-folder-map", {
  "workspace-map": "DEVELOPMENT", "folder-roles-become-clear-at-a-glanc": "READMEとSkill一覧が開発作業の入口になる",
  "workspace-root-development-projects-": "development/\n├─ AGENTS.md\n├─ README.md\n├─ projects/\n├─ skills/\n│  └─ matt-pocock/\n├─ scripts/\n├─ templates/\n└─ tests/",
  "primary-area": "入口", "folder-name": "README・AGENTS.md", "responsibility-and-entry-point": "利用者向けの使い方と、AIが守るProject規則。",
  "canonical-entry": "Skill選択", "readme-md": "skills/README.md", "first-document-and-next-action": "やりたいことから必要なSkillだけを選ぶ。",
  boundary: "PORTABLE", "what-belongs-elsewhere": "既存構造を維持", "name-the-nearest-related-area-and-pr": "コピー先では既存のsrc、docs、testsをそのまま使う。",
  "ai-engine-dev-guide": FOOTER, "00": page(31)
}, { "folder-roles-become-clear-at-a-glanc": 27, "folder-name": 15, "responsibility-and-entry-point": 11, "readme-md": 16, "first-document-and-next-action": 11, "what-belongs-elsewhere": 17, "name-the-nearest-related-area-and-pr": 11, "ai-engine-dev-guide": 8, "00": 8 }, { "workspace-root-development-projects-": MONO });

addTemplate("guide-routing-guide", {
  "routing-guide": "SKILL選択", "routing-title-with-one-clear-takeawa": "今の状態と必要な成果物から選ぶ",
  start: "START", task: "困りごと", "required-outcome": "曖昧な要望、実装、Bug、提供のどこかを確認する。",
  development: "BEFORE CODE", build: "整理する", "requirements-designcode-tests": "requirements → spec\narchitecture → plan",
  presentation: "CODE EXISTS", explain: "実行・確認", "brief-decksources-visual-qa": "tdd / implementation\ndebug / review / docs",
  next: "READ", skill: "SKILL.md", "read-matching-skill-md": "Trigger、手順、完了条件、権限境界を最後まで読む。",
  "ai-engine-dev-guide": FOOTER, "00": page(32)
}, { "routing-title-with-one-clear-takeawa": 28, "required-outcome": 11, "requirements-designcode-tests": 11, "brief-decksources-visual-qa": 11, "read-matching-skill-md": 11, "ai-engine-dev-guide": 8, "00": 8 });

addProcess("全工程を毎回使わず、依頼に必要な部分だけ通す", [
  ["上流", "要求 → 仕様\n設計 → 計画"], ["調査", "外部仕様や\n選定が必要な時"], ["実装", "TDD → 実装\nBugはDebug"],
  ["確認", "二軸Review\n文書同期"], ["提供", "Delivery\nHuman Review"]
], 33, "DEVELOPMENT FLOW");

addTemplate("guide-comparison", {
  comparison: "SKILLの系統", "two-area-comparison": "通常は統合Skillから始め、専門Skillを必要時に足す",
  "left-area": "STANDARD", development: "統合Skill 13件",
  "purposeprimary-inputstypical-skillsm": "初回導入からDeliveryまで\nProject共通の標準工程\n成果物と完了条件が明確\nskills/直下に配置\n通常はこちらから選ぶ",
  "right-area": "SPECIALIZED", presentation: "原文・補助Skill 39件",
  "purposeprimary-inputstypical-skillsm-2": "Matt原文Skill 37件\n設計図のarchify\nUI/UX知識のui-ux-pro-max\n目的と安定度を確認して利用\n同名SkillはPathを確認",
  "shared-rule-evidence-canonical-sourc": "52件すべてを有効活用する必要はなく、1つの依頼には必要なSkillだけを使う",
  "ai-engine-dev-guide": FOOTER, "00": page(34)
}, { "two-area-comparison": 27, "purposeprimary-inputstypical-skillsm": 12, "purposeprimary-inputstypical-skillsm-2": 12, "shared-rule-evidence-canonical-sourc": 11, "ai-engine-dev-guide": 8, "00": 8 });

// 5. Presentation reference
addSection("04", "Presentationを詳しく見る", "Deck作成、Template再利用、生成Engine、品質確認の役割を確認する");

addTemplate("guide-folder-map", {
  "workspace-map": "PRESENTATION", "folder-roles-become-clear-at-a-glanc": "完成資料と再利用基盤を分けて管理する",
  "workspace-root-development-projects-": "presentation/\n├─ AGENTS.md\n├─ README.md\n├─ assets/\n├─ presentations/\n├─ skills/\n├─ scripts/\n└─ harness/\n   ├─ projects/\n   └─ templates/",
  "primary-area": "作成中", "folder-name": "harness/projects/", "responsibility-and-entry-point": "資料ごとのBrief、生成Code、出典、出力を管理する。",
  "canonical-entry": "再利用", "readme-md": "harness/templates/", "first-document-and-next-action": "実Slideと編集Field、用途説明を部品として管理する。",
  boundary: "共有", "what-belongs-elsewhere": "presentations/", "name-the-nearest-related-area-and-pr": "完成版またはReview対象を共有領域へ置く。",
  "ai-engine-dev-guide": FOOTER, "00": page(36)
}, { "folder-roles-become-clear-at-a-glanc": 27, "folder-name": 15, "responsibility-and-entry-point": 11, "readme-md": 15, "first-document-and-next-action": 11, "what-belongs-elsewhere": 17, "name-the-nearest-related-area-and-pr": 11, "ai-engine-dev-guide": 8, "00": 8 }, { "workspace-root-development-projects-": MONO });

addCatalog("5つのPresentation Skillは役割ごとに選ぶ", [
  { category: "Deck制作", name: "build-presentation", when: "PPTXを作る・直す", output: "Deck project一式" },
  { category: "部品化", name: "ingest-slide-templates", when: "既存PPTXを再利用", output: "template.pptx等" },
  { category: "部品説明", name: "describe-slide-template", when: "AIが選べる説明を作る", output: "description.md" },
  { category: "共通Design", name: "customize-presentation-design", when: "色・書体・Logo変更", output: "design.ts・design.md" }
], 37, "PRESENTATION SKILL");

addTemplate("guide-step-by-step", {
  "step-by-step": "DECK PROJECT", "four-step-procedure": "目的・根拠・生成・結果を別Fileで残す",
  "1": "1", "read-the-entrypoint": "brief.txt", "open-the-nearest-readme-and-agents-m": "読者、目的、期待する行動、結論、範囲、確認状態。",
  "2": "2", "fix-the-brief": "source-notes.txt", "record-scope-evidence-constraints-an": "事実、仮定、未確認、出典、支持する主張。",
  "3": "3", "run-the-skill": "build.ts", "create-the-artifact-with-its-require": "Slide順と内容を決定論的なCodeで再生成可能にする。",
  "4": "4", "verify-and-hand-off": "output/", "separate-completed-checks-from-remai": "deck.pptx、全枚画像、Build report、QA report。",
  "ai-engine-dev-guide": FOOTER, "00": page(38)
}, { "four-step-procedure": 27, "ai-engine-dev-guide": 8, "00": 8 });

addProcess("PPTX生成成功と資料品質を別々に確認する", [
  ["Build", "TypeScript\nPPTX生成"], ["構造", "Package・Field\nSlide数"], ["画像化", "全Slideを\n同じ条件でRender"],
  ["目視", "切れ・重なり\n余白・対比"], ["引渡", "実施済み\n未実施を分離"]
], 39, "PRESENTATION QA");

// 6. Outcome and handoff
addSection("05", "使った結果を引き継ぐ", "成果物、検証、未確認事項、次の人の行動を一つにまとめる");

addTemplate("guide-comparison", {
  comparison: "作業完了の意味", "two-area-comparison": "生成しただけではなく、確認できる状態までを成果とする",
  "left-area": "NOT ENOUGH", development: "AIの回答だけ",
  "purposeprimary-inputstypical-skillsm": "会話に説明があるだけ\nFileの場所が不明\nどのTestを実行したか不明\n未確認事項が埋もれる\n外部操作の有無が不明",
  "right-area": "READY TO REVIEW", presentation: "引き継げる状態",
  "purposeprimary-inputstypical-skillsm-2": "成果物へのPathがある\n正本文書と変更が一致する\n検証Commandと結果がある\n未確認・Riskが分離される\n次のHuman actionが明確",
  "shared-rule-evidence-canonical-sourc": "利用後に確認するもの：成果物・根拠・検証・未確認・次の行動",
  "ai-engine-dev-guide": FOOTER, "00": page(41)
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
  addCatalog(`Development Skill索引 ${index / 4 + 1}/13`, developmentSkills.slice(index, index + 4), 44 + index / 4, "APPENDIX：52 SKILLS");
}

addCatalog("Presentation Skill索引 1/2", [
  { category: "制作", name: "build-presentation", when: "PPTX新規作成・改訂", output: "Deck project一式" },
  { category: "取込", name: "ingest-slide-templates", when: "既存Slideを部品化", output: "Template一式" },
  { category: "説明", name: "describe-slide-template", when: "Template用途を記述", output: "description.md" },
  { category: "Design", name: "customize-presentation-design", when: "共通Designを変更", output: "design.ts・design.md" }
], 57, "APPENDIX：PRESENTATION");

addCatalog("Presentation Skill索引 2/2", [
  { category: "UI/UX補助", name: "ui-ux-pro-max", when: "設計知識・候補を検索", output: "候補・確認観点" },
  { category: "正本", name: "presentation/skills/README.md", when: "Skillを選ぶ", output: "入口と境界" },
  { category: "設定", name: "presentation/skills/SETUP.md", when: "Codex/Claudeへ登録", output: "Linkと検証手順" },
  { category: "実行", name: "presentation/harness/README.md", when: "依存・Commandを確認", output: "生成・QA手順" }
], 58, "APPENDIX：PRESENTATION");

addTemplate("guide-evidence-and-caution", {
  "evidence-and-caution": "用語", "evidence-and-authority": "4つの用語を同じ意味で使う",
  confirmed: "CANONICAL", fact: "正本", "verified-by-a-current-source-or-chec": "最新の定義や手順を一か所で管理し、他はLinkする。",
  assumption: "OUTPUT", "assumption-2": "成果物", "useful-for-progress-but-clearly-labe": "利用されるSlide、仕様、Code、Test、調査報告など。",
  open: "EVIDENCE", unresolved: "根拠", "needs-user-input-or-later-verificati": "判断を支える仕様、実装、Log、Test、公式文書。",
  boundary: "OPEN", permission: "未確認事項", "skills-do-not-expand-authority": "必要だが権限・環境・情報不足で確認できないこと。",
  "ai-engine-dev-guide": FOOTER, "00": page(59)
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
