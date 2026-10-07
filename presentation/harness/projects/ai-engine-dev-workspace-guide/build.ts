/**
 * AI-Engine-Dev 利用ガイド（2026-10-06 改訂）
 *
 *   npx tsx projects/ai-engine-dev-workspace-guide/build.ts
 *
 * 章の順番と各スライドの役割は brief.txt の Section map と一致させる。出典は source-notes.txt。
 * 目次・地図・ページ参照は、下で登録した順番から計算する。
 */
import { Presentation, type CustomSlide } from "../../src/index.js";
import {
  anatomySlide,
  skillTableSlide,
  capabilitySlide,
  chapterSlide,
  checklistSlide,
  closingSlide,
  commandSlide,
  contrastSlide,
  coverSlide,
  familySlide,
  fileFlowSlide,
  forkSlide,
  glossarySlide,
  kitSlide,
  loopSlide,
  mapSlide,
  pairListSlide,
  pickSlide,
  requestSlide,
  rolesSlide,
  routeSlide,
  setupRowsSlide,
  stageSlide,
  stepCardsSlide,
  treeSlide,
  zonesSlide,
  type Tone
} from "./slides.js";

const deck = new Presentation({
  title: "AI-Engine-Dev 利用ガイド",
  templateLibrary: "templates",
  projectDir: "projects/ai-engine-dev-workspace-guide"
});

// ── 章とスライドの登録 ─────────────────────────────────────────

type ChapterKey = "overview" | "setup" | "request" | "result" | "mechanism" | "appendix";
const CHAPTERS: Record<ChapterKey, { no: string; name: string; question: string; desc: string; tone: Tone }> = {
  overview: { no: "1", name: "全体像", question: "AI-Engine-Devで何ができる？", desc: "何ができるか", tone: "accent" },
  setup: { no: "2", name: "準備する", question: "何を準備すればよい？", desc: "使い始める準備", tone: "accent" },
  request: { no: "3", name: "依頼する", question: "AIにどう頼めばよい？", desc: "依頼文の書き方と例", tone: "accent2" },
  result: { no: "4", name: "結果を見る", question: "使った後に何が残る？", desc: "残るものの確認", tone: "accent3" },
  mechanism: { no: "5", name: "しくみを知る", question: "もっと詳しく知りたい人へ", desc: "詳しく知りたい人へ", tone: "ink" },
  appendix: { no: "付録", name: "Skillと用語", question: "名前から探したい人へ", desc: "名前から探したい人へ", tone: "muted" }
};

type Entry = { key?: string; chapter?: ChapterKey; divider?: boolean; title?: string; tocGroup?: string; make: (page: number) => CustomSlide };
const entries: Entry[] = [];
let current: ChapterKey | undefined;

function eyebrow(suffix?: string): string {
  if (!current) return "この資料の使い方";
  const chapter = CHAPTERS[current];
  const head = current === "appendix" ? chapter.no : `${chapter.no} ${chapter.name}`;
  return suffix ? `${head}｜${suffix}` : head;
}

// make はすべての登録が終わってから呼ぶため、登録時点の章を覚えておき、見出しラベルをその章で作る。
function add(title: string, make: (page: number) => CustomSlide, key?: string, tocGroup?: string) {
  const chapterAtAdd = current;
  entries.push({ key, chapter: chapterAtAdd, title, tocGroup, make: (page) => {
    const saved = current;
    current = chapterAtAdd;
    try {
      return make(page);
    } finally {
      current = saved;
    }
  } });
}

function chapter(key: ChapterKey) {
  current = key;
  entries.push({ chapter: key, divider: true, make: () => {
    const info = CHAPTERS[key];
    // 同じ tocGroup が続くページは、目次ではページ範囲付きの1行にまとめる。
    const toc: Array<{ page: string; title: string; group?: string; last: number }> = [];
    for (const item of pagesOf(key).filter((entry) => !entry.divider)) {
      const prev = toc[toc.length - 1];
      if (item.tocGroup && prev?.group === item.tocGroup) {
        prev.last = item.page;
        prev.page = `${prev.page.split("–")[0]}–${item.page}`;
      } else {
        toc.push({ page: `p.${item.page}`, title: item.tocGroup ?? item.title ?? "", group: item.tocGroup, last: item.page });
      }
    }
    return chapterSlide({ no: info.no, title: info.name, question: info.question, pages: range(key), toc: toc.map(({ page, title }) => ({ page, title })) });
  } });
}

function pagesOf(key: ChapterKey) {
  return entries.map((entry, index) => ({ ...entry, page: index + 1 })).filter((entry) => entry.chapter === key);
}

function range(key: ChapterKey): string {
  const pages = pagesOf(key).map((entry) => entry.page);
  return `p.${pages[0]}–${pages[pages.length - 1]}`;
}

function pageOf(key: string): number {
  const index = entries.findIndex((entry) => entry.key === key);
  if (index < 0) throw new Error(`unknown slide key: ${key}`);
  return index + 1;
}

// ── 表紙と地図 ────────────────────────────────────────────────

entries.push({ make: () => coverSlide({
  label: "導入・利用ガイド",
  title: "AI-Engine-Dev\n利用ガイド",
  subtitle: "何ができるか・準備・頼み方・結果の確認まで",
  context: "職場の同僚向け・2026年10月改訂"
}) });

add("この資料の使い方", (page) => mapSlide({
  pageNum: page, eyebrow: eyebrow(), title: "必要な章から読める",
  tiles: (Object.keys(CHAPTERS) as ChapterKey[]).map((key) => ({
    no: CHAPTERS[key].no === "付録" ? "付録" : `第${CHAPTERS[key].no}章`,
    name: CHAPTERS[key].name,
    desc: CHAPTERS[key].desc,
    pages: range(key),
    tone: CHAPTERS[key].tone
  })),
  note: `初めての人は1〜4章を順に。準備ができている人は3章（p.${pagesOf("request")[0].page}）から`
}));

// ── 1 全体像 ─────────────────────────────────────────────────

chapter("overview");

add("AIに渡す作業手順のセット", (page) => kitSlide({
  pageNum: page, eyebrow: eyebrow(), title: "AIに渡す作業手順のセット",
  person: { name: "あなた", request: "「通知時刻を\n変えられる\nようにして」\nと頼む" },
  runner: {
    name: "Codex / Claude Code",
    caption: "AI-Engine-Devを読んで動く",
    items: [
      { icon: "book-open", text: "AGENTS.md：守る規則" },
      { icon: "list-checks", text: "Skill：作業の手順書" },
      { icon: "wrench", text: "テンプレート・検査" }
    ]
  },
  result: {
    name: "残るもの",
    items: [
      { icon: "file-text", text: "要求・仕様書" },
      { icon: "code", text: "実装とテスト" },
      { icon: "circle-check", text: "検証の記録" }
    ]
  },
  note: "単独のアプリではなく、AIに読ませる手順と道具のセット"
}));

add("会話ではなくファイルが残る", (page) => contrastSlide({
  pageNum: page, eyebrow: eyebrow(), title: "会話ではなくファイルが残る",
  left: "ふつうのAIチャット", right: "AI-Engine-Devを使うと",
  rows: [
    ["要望の解釈が人によって違う", "要求と仕様が文書で残る"],
    ["何を確認したか分からない", "実行した検査と結果が残る"],
    ["次の人が会話を読み直す", "未確認事項と次の作業が残る"]
  ],
  note: "価値はAIの回答文ではなく、Projectに残る成果物と検証の記録"
}));

add("開発と資料作成の2つの環境", (page) => forkSlide({
  pageNum: page, eyebrow: eyebrow(), title: "開発と資料作成の2つの環境",
  question: "作りたいものは？",
  branches: [
    {
      label: "DEVELOPMENT", name: "システム開発", icon: "code", tone: "accent2",
      rows: [["対象", "アプリ・Web・業務システム"], ["例", "新機能の追加、不具合の調査"], ["入口", "development/README.md"]]
    },
    {
      label: "PRESENTATION", name: "資料作成", icon: "presentation", tone: "accent3",
      rows: [["対象", "PowerPoint資料"], ["例", "説明資料・提案書・報告書"], ["入口", "presentation/README.md"]]
    }
  ]
}));

add("開発でできること", (page) => capabilitySlide({
  pageNum: page, eyebrow: eyebrow("DEVELOPMENT"), title: "開発でできること",
  labels: { ask: "頼み方", result: "残るもの" },
  cards: [
    { icon: "lightbulb", verb: "考える", ask: "「要望を仕様にまとめて」", result: "要求書・仕様書・設計記録", tone: "accent2" },
    { icon: "hammer", verb: "作る", ask: "「テストから実装して」", result: "コード・テスト・検証記録", tone: "accent2" },
    { icon: "search", verb: "直す", ask: "「保存の不具合を調べて」", result: "原因の説明・回帰テスト", tone: "accent2" },
    { icon: "send", verb: "届ける", ask: "「変更をPRにまとめて」", result: "README・PR・CIの結果", tone: "accent2" }
  ]
}));

add("資料作成でできること", (page) => capabilitySlide({
  pageNum: page, eyebrow: eyebrow("PRESENTATION"), title: "資料作成でできること",
  labels: { ask: "頼み方", result: "残るもの" },
  cards: [
    { icon: "presentation", verb: "作る", ask: "「説明資料を作って」", result: "PPTX・出典・確認結果", tone: "accent3" },
    { icon: "copy", verb: "部品にする", ask: "「既存スライドを部品に」", result: "テンプレート一式", tone: "accent3" },
    { icon: "palette", verb: "そろえる", ask: "「色と書体を統一して」", result: "共通デザインの設定", tone: "accent3" },
    { icon: "scan-eye", verb: "確かめる", ask: "「全ページを確認して」", result: "全ページ画像・QA報告", tone: "accent3" }
  ]
}));

// ── 2 準備する ───────────────────────────────────────────────

chapter("setup");

add("使う場所で準備が変わる", (page) => routeSlide({
  pageNum: page, eyebrow: eyebrow(), title: "使う場所で準備が変わる",
  question: "どこで使う？",
  routes: [
    { name: "このリポジトリで使う", desc: "そのまま開けば使える", page: pageOf("this-repo"), tone: "accent" },
    { name: "新しいProjectで使う", desc: "development/ をコピーする", page: pageOf("new-project"), tone: "accent3" },
    { name: "既存のProjectで使う", desc: "導入用のSkillに頼む", page: pageOf("existing-project"), tone: "accent2" }
  ],
  extra: `資料作成もする場合は、追加の準備（p.${pageOf("presentation-setup")}）`
}));

add("このリポジトリで使う", (page) => stepCardsSlide({
  pageNum: page, eyebrow: eyebrow(), title: "このリポジトリで使う",
  steps: [
    { icon: "folder-open", heading: "開く", body: "Codexか\nClaude Codeで、\nAI-Engine-Devの\nフォルダを開く" },
    { icon: "book-open", heading: "読む", body: "AGENTS.mdと、\n使う領域の\nREADMEを読む" },
    { icon: "list-checks", heading: "確かめる", body: "Skillが一覧に\n出るか確かめる\n（Codexは /skills）" }
  ],
  note: "Skillは .agents/skills と .claude/skills から読み込まれる"
}), "this-repo");

add("新しいProjectで使う", (page) => commandSlide({
  pageNum: page, eyebrow: eyebrow(), title: "新しいProjectで使う",
  lead: "AI-Engine-Devの親フォルダで実行する（空の新規Projectだけ）",
  code: "cp -R /path/to/AI-Engine-Dev/development/. \\\n      /path/to/new-project/",
  cards: [
    { icon: "copy", heading: "末尾は /.", body: "隠しフォルダの\n.agents と .claude も\nコピーされる", tone: "accent3" },
    { icon: "circle-alert", heading: "新規のみ", body: `既存のProjectには\n使わない（p.${pageOf("existing-project")}）`, tone: "accent2" },
    { icon: "list-checks", heading: "動作確認", body: "新しいProjectを開き\nSkillの一覧を\n確かめる", tone: "accent" }
  ]
}), "new-project");

add("既存のProjectで使う", (page) => commandSlide({
  pageNum: page, eyebrow: eyebrow(), title: "既存のProjectで使う",
  lead: "導入用のSkillを指定して頼む（上はCodex、下はClaude Code）",
  code: "$bootstrap-development-harness このProjectに導入して\n/bootstrap-development-harness このProjectに導入して",
  cards: [
    { icon: "search", heading: "調べる", body: "AIが既存の構成・\n規則・文書を読む", tone: "accent" },
    { icon: "file-text", heading: "提案する", body: "AIがREADMEと\nAGENTS.mdの\n案を出す", tone: "accent2" },
    { icon: "user-check", heading: "確認する", body: "あなたが確認して\nから反映する。\n既存は移動しない", tone: "ink" }
  ]
}), "existing-project");

add("資料作成の準備", (page) => setupRowsSlide({
  pageNum: page, eyebrow: eyebrow("PRESENTATION"), title: "資料作成の準備",
  rows: [
    { heading: "Skillを登録", desc: "presentation/ をProject直下に置いて1回実行", code: "./presentation/scripts/setup-skills.sh" },
    { heading: "生成ツールを入れる", desc: "Node.js 20以上が必要", code: "cd presentation/harness\nnpm ci && npm run self-validate" },
    { heading: "表示確認の準備", desc: "LibreOfficeを入れる（全ページを画像にする）" }
  ]
}), "presentation-setup");

add("準備ができたかを確認", (page) => checklistSlide({
  pageNum: page, eyebrow: eyebrow(), title: "準備ができたかを確認",
  items: [
    "対象のProjectをCodexかClaude Codeで開ける",
    "AGENTS.mdと担当領域のREADMEを読んだ",
    "使うSkillが一覧に出る",
    "既存のProjectでは、導入の提案を確認した",
    "資料作成では、Node.jsとLibreOfficeが動く",
    "秘密情報と、外部へ操作してよい範囲を決めた"
  ],
  note: `そろったら「3 依頼する」（p.${pagesOf("request")[0].page}）へ`
}));

// ── 3 依頼する ───────────────────────────────────────────────

chapter("request");

add("依頼文には4つを書く", (page) => anatomySlide({
  pageNum: page, eyebrow: eyebrow(), title: "依頼文には4つを書く",
  parts: [
    { name: "目的", what: "誰の、どんな問題を解決したいか", example: "ユーザーが通知時刻を変更できる機能を追加してください。", tone: "accent" },
    { name: "対象", what: "どのProject・機能・ファイルが範囲か", example: "既存の仕様と実装を確認し、要求と仕様を整理してください。", tone: "accent3" },
    { name: "完了条件", what: "何ができれば完了か、必要な確認は何か", example: "テストを先に作り、READMEも更新してください。", tone: "accent2" },
    { name: "権限", what: "どこまで操作してよいか", example: "commit・pushはしないでください。", tone: "ink" }
  ]
}));

add("例1 新機能を追加する", (page) => requestSlide({
  pageNum: page, eyebrow: eyebrow("開発の例"), title: "例1 新機能を追加する",
  request: [
    "ユーザーが通知時刻を変更できる\n機能を追加してください。",
    "既存の仕様と実装を確認し、\n要求と仕様を整理してください。",
    "テストを先に作り、\nREADMEも更新してください。",
    "commit・pushは\nしないでください。"
  ],
  stepsLabel: "AIが進める順番と、残るファイル",
  steps: [
    { text: "要求を整理する", sub: "docs/requirements/" },
    { text: "仕様を決める", sub: "docs/specs/" },
    { text: "設計して作業を分ける", sub: "docs/plans/" },
    { text: "テストを書いて実装する", sub: "tests/ と src/" },
    { text: "レビューして文書を更新する", sub: "README.md" }
  ]
}));

add("例2 不具合の原因を調べる", (page) => requestSlide({
  pageNum: page, eyebrow: eyebrow("開発の例"), title: "例2 不具合の原因を調べる",
  request: [
    "保存後に画面が古い値へ戻る\n原因を調査してください。",
    "再現条件と根本原因を特定し、\n影響範囲を説明してください。",
    "今は診断だけで、\n修正はしないでください。"
  ],
  stepsLabel: "AIが進める順番（Skill: debugging）",
  steps: [
    { text: "再現の手順を確かめる" },
    { text: "原因の仮説を検証する" },
    { text: "根本原因を説明する" },
    { text: "影響範囲と直し方を示す" },
    { text: "修正（今回は行わない）", stopped: true }
  ],
  stopLabel: "「診断だけ」なのでここまで"
}));

add("例3 説明資料を作る", (page) => requestSlide({
  pageNum: page, eyebrow: eyebrow("資料作成の例"), title: "例3 説明資料を作る",
  request: [
    "職場の同僚向けに、この仕組みの\n利用ガイドを作ってください。",
    "何ができるか、環境の準備、\n使った後に残るものを\n説明してください。",
    "編集できるPPTXと、全ページの\n確認結果を残してください。"
  ],
  stepsLabel: "AIが進める順番と、残るファイル",
  steps: [
    { text: "読者と目的を確認する", sub: "brief.txt" },
    { text: "根拠と章立てを記録する", sub: "source-notes.txt" },
    { text: "図とスライドを組み立てる", sub: "build.ts" },
    { text: "PPTXを生成する", sub: "output/deck.pptx" },
    { text: "全ページを目で確認する", sub: "output/qa-report.md" }
  ]
}));

add("AIが進めること・人が決めること", (page) => zonesSlide({
  pageNum: page, eyebrow: eyebrow(), title: "AIが進めること・人が決めること",
  zones: [
    { icon: "bot", name: "AIが進める", body: "読む・整理する・\nProject内の変更・頼まれた検査", tone: "accent3" },
    { icon: "circle-help", name: "確認してから", body: "仕様が分かれる判断・範囲の追加・\n機密情報の扱い", tone: "accent" },
    { icon: "send", name: "別の許可が必要", body: "commit・push・PR・送信・公開・デプロイ", tone: "accent2" },
    { icon: "user-check", name: "人が決める", body: "本番での採用・社内向けの表現・\n数値・法務やセキュリティ", tone: "ink" }
  ],
  note: "Skillを使っても権限は広がらない。依頼で許可した操作だけを行う"
}));

// ── 4 結果を見る ─────────────────────────────────────────────

chapter("result");

add("完了報告で6つを確認する", (page) => checklistSlide({
  pageNum: page, eyebrow: eyebrow(), title: "完了報告で6つを確認する",
  numbered: true,
  items: [
    "何を作り、何を変えたか",
    "成果物はどこにあるか",
    "どの根拠を使ったか",
    "どの検査（Build・Test・QA）が通ったか",
    "何が未確認で、どんなリスクが残るか",
    "次に人が決めること・することは何か"
  ],
  note: "commit・push・PR・公開をしたかどうかも、必ず分けて確認する"
}));

add("成果物の置き場所", (page) => treeSlide({
  pageNum: page, eyebrow: eyebrow(), title: "成果物の置き場所",
  columns: [
    {
      caption: "開発（例）", w: 3.45,
      nodes: [
        { name: "project-root/", depth: 0, folder: true },
        { name: "docs/", depth: 1, folder: true },
        { name: "requirements/", depth: 2, folder: true, note: "要求", tone: "accent2" },
        { name: "specs/", depth: 2, folder: true, note: "仕様", tone: "accent2" },
        { name: "plans/", depth: 2, folder: true, note: "計画", tone: "accent2" },
        { name: "src/", depth: 1, folder: true, note: "実装", tone: "accent2" },
        { name: "tests/", depth: 1, folder: true, note: "テスト", tone: "accent2" }
      ]
    },
    {
      caption: "資料作成", w: 5.05,
      nodes: [
        { name: "presentation/", depth: 0, folder: true },
        { name: "harness/", depth: 1, folder: true },
        { name: "projects/<deck-id>/", depth: 2, folder: true, note: "作業場所", tone: "accent3" },
        { name: "brief.txt", depth: 3, note: "目的・読者" },
        { name: "source-notes.txt", depth: 3, note: "根拠" },
        { name: "build.ts", depth: 3, note: "生成コード" },
        { name: "output/", depth: 3, folder: true, note: "PPTX・確認結果" },
        { name: "presentations/<deck-id>/", depth: 1, folder: true, note: "完成版", tone: "accent3" }
      ]
    }
  ]
}));

// ── 5 しくみを知る ─────────────────────────────────────────────

chapter("mechanism");

add("フォルダの全体像", (page) => treeSlide({
  pageNum: page, eyebrow: eyebrow(), title: "フォルダの全体像",
  columns: [
    {
      w: 5.05,
      nodes: [
        { name: "AI-Engine-Dev/", depth: 0, folder: true },
        { name: "AGENTS.md", depth: 1, note: "AIが守る共通の規則", tone: "accent" },
        { name: "CLAUDE.md", depth: 1, note: "Claude Codeの入口" },
        { name: "README.md", depth: 1, note: "利用者向けの入口", tone: "accent" },
        { name: "Lerning/", depth: 1, folder: true, note: "初めての人の学習資料" },
        { name: "development/", depth: 1, folder: true, note: "システム開発の環境", tone: "accent2" },
        { name: "presentation/", depth: 1, folder: true, note: "資料作成の環境", tone: "accent3" },
        { name: "docs/", depth: 1, folder: true, note: "作業の記録" },
        { name: ".agents/skills/", depth: 1, folder: true, note: "Codexが読むSkill" },
        { name: ".claude/", depth: 1, folder: true, note: "Claude CodeのSkillとAgent" }
      ]
    }
  ],
  side: {
    heading: "最初に読む",
    items: ["README.md", "AGENTS.md", "各領域の README.md", "skills/README.md"],
    tone: "accent", w: 3.4
  },
  rowH: 0.34
}));

add("Skillは状況で選ぶ", (page) => pickSlide({
  pageNum: page, eyebrow: eyebrow("DEVELOPMENT"), title: "Skillは状況で選ぶ",
  picks: [
    { when: "要望があいまい", skill: "requirements-analysis", tone: "accent2" },
    { when: "振る舞いを決めたい", skill: "specification", tone: "accent2" },
    { when: "設計を決めたい", skill: "architecture-design", tone: "accent2" },
    { when: "作業を分けたい", skill: "implementation-planning", tone: "accent2" },
    { when: "テストから作りたい", skill: "tdd → implementation", tone: "accent2" },
    { when: "不具合を調べたい", skill: "debugging", tone: "accent2" },
    { when: "変更を確かめたい", skill: "code-review", tone: "accent2" },
    { when: "PRやリリースをしたい", skill: "delivery", tone: "accent2" }
  ],
  note: "通常は統合Skill（13件）から選ぶ。使う前にSKILL.mdを最後まで読む"
}));

add("判断と実装でAgentを分ける", (page) => rolesSlide({
  pageNum: page, eyebrow: eyebrow("orchestrated-development"), title: "判断と実装でAgentを分ける",
  roles: [
    {
      name: "判断する役", alias: "Planner", icon: "brain", tone: "accent2",
      models: [["Codex", "Sol"], ["Claude Code", "Opus"]],
      duties: ["設計と実装計画を立てる", "作業指示（Brief）を固める", "タスクごとにレビューして判定", "全部終わったら全体をレビュー"]
    },
    {
      name: "実装する役", alias: "Worker", icon: "hammer", tone: "accent3",
      models: [["Codex", "Luna"], ["Claude Code", "Sonnet"]],
      duties: ["作業指示どおりに実装する", "テストと検証コマンドを実行", "自己レビューして報告する", "判断が要るときは差し戻す"]
    }
  ],
  note: "モデルは既定に任せず、役割ごとに指定して割り当てる"
}));

add("実装とレビューを交互に回す", (page) => loopSlide({
  pageNum: page, eyebrow: eyebrow("orchestrated-development"), title: "実装とレビューを交互に回す",
  steps: [
    { role: "Planner", name: "計画", body: "設計・指示", tone: "accent2" },
    { role: "Worker", name: "実装", body: "実装と検証", tone: "accent3" },
    { role: "Planner", name: "レビュー", body: "仕様と品質", tone: "accent2" },
    { role: "Planner", name: "全体確認", body: "最後に全体", tone: "accent2" }
  ],
  loop: { role: "Worker", name: "修正", body: "指摘を直す", tone: "accent3", at: 2, down: "指摘あり", up: "再レビュー" },
  note: "PlannerとWorkerは別のAgentで、\n別の会話（Context）として動く"
}));

add("資料作成のしくみ", (page) => fileFlowSlide({
  pageNum: page, eyebrow: eyebrow("PRESENTATION"), title: "資料作成のしくみ",
  inputs: [
    { name: "brief.txt", desc: "目的・読者・結論" },
    { name: "source-notes.txt", desc: "根拠と出典" }
  ],
  build: { name: "build.ts", desc: "生成コード" },
  outputs: {
    caption: "output/",
    items: [
      { name: "deck.pptx", desc: "資料" },
      { name: "screenshots/", desc: "全ページ画像" },
      { name: "qa-report.md", desc: "確認結果" }
    ]
  },
  final: { name: "presentations/", desc: "完成版を置く" },
  note: "build.tsを実行し直せば、同じ内容のPPTXを作り直せる"
}));

add("資料は4段階で確かめる", (page) => stageSlide({
  pageNum: page, eyebrow: eyebrow("PRESENTATION"), title: "資料は4段階で確かめる",
  stages: [
    { icon: "play", name: "生成", body: "build.tsで\nPPTXを作る" },
    { icon: "file-check", name: "構造検査", body: "ファイルの\n壊れと枚数を\n調べる" },
    { icon: "images", name: "画像化", body: "全ページを\n画像にする" },
    { icon: "scan-eye", name: "目視確認", body: "1枚ずつ、\n切れ・重なり\n余白を見る" }
  ],
  note: "生成できても完成ではない。目視まで終え、未確認は分けて報告する"
}));

// ── 付録 ─────────────────────────────────────────────────────

chapter("appendix");

add("Skillは系統ごとに探す", (page) => familySlide({
  pageNum: page, eyebrow: eyebrow(), title: "Skillは系統ごとに探す",
  families: [
    { count: "13件", name: "開発の統合Skill", where: "development/skills/README.md", detail: `通常はここから選ぶ（一覧 p.${pageOf("list-integrated")}–${pageOf("list-integrated") + 1}）`, tone: "accent2" },
    { count: "37件", name: "開発の原文Skill", where: "development/skills/matt-pocock/SKILL_GUIDE.md", detail: `明示・自動・Productivityなど（一覧 p.${pageOf("list-explicit")}–${pageOf("list-misc")}）`, tone: "accent2" },
    { count: "2件", name: "開発の補助Skill", where: "development/skills/README.md", detail: `archify・ui-ux-pro-max（一覧 p.${pageOf("list-misc")}）`, tone: "accent" },
    { count: "5件", name: "資料作成のSkill", where: "presentation/skills/README.md", detail: `build-presentationなど（一覧 p.${pageOf("presentation-skills")}）`, tone: "accent3" }
  ]
}));


// 開発Skillの一覧（52件）。内容は development/skills/README.md と matt-pocock/ の各表に合わせる。
type SkillRow = { name: string; when: string };
const SKILL_LISTS: Array<{ key: string; title: string; tone: Tone; rows: SkillRow[] }> = [
  {
    key: "list-integrated", title: "開発の統合Skill（1/2）", tone: "accent2", rows: [
      { name: "bootstrap-development-harness", when: "既存Projectへ初めて導入" },
      { name: "requirements-analysis", when: "要望を要求に整理" },
      { name: "specification", when: "振る舞い・異常系を決める" },
      { name: "architecture-design", when: "責務・境界・APIを設計" },
      { name: "implementation-planning", when: "依存付きの作業に分ける" },
      { name: "research", when: "外部の一次情報が必要" },
      { name: "tdd", when: "テストを先に書いて変更" }
    ]
  },
  {
    key: "list-integrated-2", title: "開発の統合Skill（2/2）", tone: "accent2", rows: [
      { name: "implementation", when: "承認済み仕様を小さく実装" },
      { name: "debugging", when: "不具合・失敗・性能劣化" },
      { name: "code-review", when: "差分を2つの観点で確認" },
      { name: "documentation", when: "利用・設計の知識を同期" },
      { name: "delivery", when: "Git・CI・リリース" },
      { name: "orchestrated-development", when: "役割別Agentで連続実行" }
    ]
  },
  {
    key: "list-explicit", title: "原文Skill：明示して使う", tone: "accent", rows: [
      { name: "ask-matt", when: "使うSkillが分からない" },
      { name: "grill-with-docs", when: "要望を質問で深掘り" },
      { name: "triage", when: "未整理のIssueやPRを分類" },
      { name: "improve-codebase-architecture", when: "Deep module化の候補を調査" },
      { name: "setup-matt-pocock-skills", when: "原文Skillを初期設定" },
      { name: "to-spec", when: "会話を実装できる仕様に" },
      { name: "to-tickets", when: "仕様を依存付きTicketに" },
      { name: "implement", when: "仕様・Ticketを実装" },
      { name: "wayfinder", when: "巨大で不確実な計画" }
    ]
  },
  {
    key: "list-auto", title: "原文Skill：自動で選ばれる", tone: "accent", rows: [
      { name: "prototype", when: "試作で設計の疑問を検証" },
      { name: "diagnosing-bugs", when: "難しい不具合を再現から" },
      { name: "research", when: "一次資料を引用付きで調査" },
      { name: "tdd", when: "縦に薄く切ってテスト先行" },
      { name: "domain-modeling", when: "Domain用語を明確にする" },
      { name: "codebase-design", when: "Deep module・Interface設計" },
      { name: "code-review", when: "標準と仕様の2軸でレビュー" },
      { name: "resolving-merge-conflicts", when: "Merge・Rebaseの衝突" },
      { name: "wizard", when: "人が行う設定を手順化" }
    ]
  },
  {
    key: "list-productivity", title: "原文Skill：Productivity", tone: "accent3", rows: [
      { name: "grill-me", when: "計画や設計を質問で深掘り" },
      { name: "handoff", when: "別のAgentやSessionへ渡す" },
      { name: "teach", when: "複数Sessionで教える" },
      { name: "to-questionnaire", when: "担当者への質問を整理" },
      { name: "wait-what", when: "直前の説明を言い直す" },
      { name: "grilling", when: "判断を質問で検証（自動）" },
      { name: "writing-for-agents", when: "Agent向け文書を書く（自動）" }
    ]
  },
  {
    key: "list-in-progress", title: "原文Skill：開発途中（ベータ）", tone: "accent2", rows: [
      { name: "loop-me", when: "Workflow仕様を自己Interview" },
      { name: "writing-beats", when: "記事をBeat単位で組み立て" },
      { name: "writing-fragments", when: "記事の材料をInterview" },
      { name: "writing-shape", when: "Markdown素材を記事に" },
      { name: "claude-handoff", when: "背景Agentへ引き継ぐ" },
      { name: "setup-ts-deep-modules", when: "TSのモジュール境界を強制" },
      { name: "implement-spec", when: "仕様を複数Agentで並行実装" },
      { name: "retro", when: "Session後の環境改善（現状はStub）" }
    ]
  },
  {
    key: "list-misc", title: "原文Skill：Miscと補助Skill", tone: "ink", rows: [
      { name: "git-guardrails-claude-code", when: "危険なGit操作をHookで阻止" },
      { name: "migrate-to-shoehorn", when: "テストの型Assertionを移行" },
      { name: "scaffold-exercises", when: "演習の構造を作る" },
      { name: "setup-pre-commit", when: "Commit前の検査を追加" },
      { name: "archify（補助）", when: "設計やFlowを図にする" },
      { name: "ui-ux-pro-max（補助）", when: "UI/UXの設計知識を検索" }
    ]
  }
];
if (SKILL_LISTS.reduce((sum, list) => sum + list.rows.length, 0) !== 52) throw new Error("Expected 52 development Skills in the appendix");

for (const list of SKILL_LISTS) {
  add(list.title, (page) => skillTableSlide({
    pageNum: page, eyebrow: eyebrow("開発Skill一覧"), title: list.title, rows: list.rows, tone: list.tone
  }), list.key, "開発Skillの一覧（52件）");
}

add("資料作成の5つのSkill", (page) => pairListSlide({
  pageNum: page, eyebrow: eyebrow(), title: "資料作成の5つのSkill",
  header: ["Skill", "使うとき"],
  nameW: 4.0,
  rows: [
    { icon: "presentation", name: "build-presentation", use: "PPTXを新しく作る・直す" },
    { icon: "copy", name: "ingest-slide-templates", use: "既存スライドを部品にする" },
    { icon: "file-text", name: "describe-slide-template", use: "部品の使い方を書く" },
    { icon: "palette", name: "customize-presentation-design", use: "色・書体・ロゴを変える" },
    { icon: "search", name: "ui-ux-pro-max", use: "デザインの候補を探す（補助）" }
  ],
  note: "入口は presentation/README.md と presentation/skills/README.md"
}), "presentation-skills");

add("この資料の用語", (page) => glossarySlide({
  pageNum: page, eyebrow: eyebrow(), title: "この資料の用語",
  terms: [
    { term: "Skill", meaning: "AIが読む作業の\n手順書。工程ごとに\n用意されている", tone: "accent" },
    { term: "AGENTS.md", meaning: "AIが守る規則の\nファイル。\n領域ごとにもある", tone: "accent" },
    { term: "正本", meaning: "最新の定義や手順を\n1か所で管理し、\nほかはリンクする", tone: "accent2" },
    { term: "成果物", meaning: "スライド・仕様・\nコード・テスト・\n調査報告など", tone: "accent2" },
    { term: "根拠", meaning: "判断を支える\n仕様・実装・ログ・\nテスト・公式文書", tone: "accent3" },
    { term: "未確認事項", meaning: "必要だが、権限・\n環境・情報不足で\n確かめていないこと", tone: "accent3" }
  ]
}));

// ── 締め ─────────────────────────────────────────────────────

current = undefined;
entries.push({ make: () => closingSlide({
  title: "次の依頼はこの順で",
  steps: [
    "対象のProjectをCodexかClaude Codeで開く",
    "AGENTS.mdと担当領域のREADMEを読む",
    "目的・対象・完了条件・権限を書いて頼む",
    "選ばれたSkillと作業範囲を確かめる",
    "完了報告の6点を確認し、次を決める"
  ],
  footnote: "入口：development/README.md ｜ presentation/README.md"
}) });

// ── 生成 ─────────────────────────────────────────────────────

for (const [index, entry] of entries.entries()) deck.addCustomSlide(entry.make(index + 1));

await deck.render({ output: "output/deck.pptx", report: "output/build-report.md", screenshots: "output/screenshots" });
