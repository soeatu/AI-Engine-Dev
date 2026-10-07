/**
 * 利用ガイドのスライド部品（2026-10-06 改訂）。
 * 本文16pt・見出し24pt・タイトル35ptを下限にし、1枚に載せる要素を絞る。
 * 書体（Noto Sans JP）と配色（harness共通トークン）は従来の利用ガイドを引き継ぐ。
 */
import { C, CustomSlide, LAYOUT, type CustomSlideContext } from "../../src/index.js";

const { LM, CW } = LAYOUT;
const RIGHT = LM + CW;
const FONT = "Noto Sans JP";
const MONO = "JetBrains Mono";
const DECK = "AI-Engine-Dev 利用ガイド";
const SIZE = { deckTitle: 50, title: 35, chapter: 44, sub: 24, lead: 20, body: 16, label: 12, footer: 9 } as const;
const TOP = 1.45;
const BOTTOM = 4.98;
const SKY = "93C5FD";

type Ctx = CustomSlideContext;
type Pt = { x: number; y: number };
export type Tone = "accent" | "accent2" | "accent3" | "ink" | "muted";

function tone(value: Tone | undefined): string {
  if (value === "accent2") return C.accent2;
  if (value === "accent3") return C.accent3;
  if (value === "ink") return C.ink;
  if (value === "muted") return C.faint;
  return C.accent;
}

// ── 文字幅の見積もりと収まりの検査 ───────────────────────────────

// 1文字あたりの幅（em）。和文は全角、欧文はNoto Sans JPの字幅を細い字・広い字・その他に分けて見積もる。
function textWidth(text: string, size: number = SIZE.body, mono = false): number {
  let em = 0;
  for (const ch of text) {
    if (/[　-ヿ㐀-鿿＀-￯]/.test(ch)) em += 1;
    else if (mono) em += 0.6;
    else if (ch === " ") em += 0.28;
    else if (/[ijlft.,:;'|!()[\]/-]/.test(ch)) em += 0.36;
    else if (/[mwMW@]/.test(ch)) em += 0.85;
    else if (/[A-Z0-9]/.test(ch)) em += 0.64;
    else em += 0.56;
  }
  return (em * size) / 72 * 1.04;
}

function lineCount(text: string, width: number, size: number = SIZE.body, mono = false): number {
  return text.split("\n").reduce((sum, part) => sum + Math.max(1, Math.ceil(textWidth(part, size, mono) / width)), 0);
}

// 改行を入れた文は、各行が1行に収まることも確かめる。
function fit(where: string, text: string, width: number, size: number = SIZE.body, maxLines = 1, mono = false) {
  if (text.includes("\n")) {
    for (const part of text.split("\n")) {
      if (textWidth(part, size, mono) > width) throw new Error(`${where}: line "${part}" is wider than ${width.toFixed(2)}in at ${size}pt`);
    }
  }
  const lines = lineCount(text, width, size, mono);
  if (lines > maxLines) throw new Error(`${where}: "${text}" needs ${lines} line(s) at ${size}pt in ${width.toFixed(2)}in (max ${maxLines})`);
}

function assertBottom(where: string, bottom: number) {
  if (bottom > BOTTOM + 0.001) throw new Error(`${where}: content bottom ${bottom.toFixed(2)}in overlaps the footer`);
}

// ── 共通部品 ─────────────────────────────────────────────────

function header(ctx: Ctx, eyebrow: string, title: string) {
  const { slide } = ctx;
  slide.background = { color: C.white };
  slide.addText(eyebrow, {
    x: LM, y: 0.3, w: CW, h: 0.26, fontFace: FONT, fontSize: SIZE.label, bold: true, color: C.accent, charSpacing: 1, margin: 0
  });
  fit("title", title, CW, SIZE.title);
  slide.addText(title, {
    x: LM, y: 0.6, w: CW, h: 0.66, fontFace: FONT, fontSize: SIZE.title, bold: true, color: C.ink, valign: "middle", margin: 0
  });
}

function footer(ctx: Ctx, pageNum: number) {
  const { slide } = ctx;
  slide.addShape("line", { x: LM, y: 5.08, w: CW, h: 0, line: { color: C.grey30, width: 1 } });
  slide.addText(DECK, { x: LM, y: 5.15, w: 4, h: 0.22, fontFace: FONT, fontSize: SIZE.footer, color: C.muted, margin: 0 });
  slide.addText(String(pageNum).padStart(2, "0"), {
    x: RIGHT - 0.6, y: 5.15, w: 0.6, h: 0.22, fontFace: FONT, fontSize: SIZE.footer, color: C.muted, align: "right", margin: 0
  });
}

// 白地の角丸カード。左端の色帯で系統を示す。
function card(ctx: Ctx, box: { x: number; y: number; w: number; h: number }, accent: string = C.accent, fill: string = C.white) {
  const { slide, pptx } = ctx;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: box.x, y: box.y, w: box.w, h: box.h, fill: { color: fill }, line: { color: C.grey30, width: 1 }, rectRadius: 0.06
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: box.x, y: box.y, w: 0.08, h: box.h, fill: { color: accent }, line: { color: accent, width: 0 }
  });
}

function badge(ctx: Ctx, text: string, x: number, y: number, size: number, fill: string = C.ink, color: string = C.white) {
  ctx.slide.addShape("ellipse", { x, y, w: size, h: size, fill: { color: fill }, line: { color: fill, width: 0 } });
  ctx.slide.addText(text, {
    x, y, w: size, h: size, fontFace: FONT, fontSize: SIZE.body, bold: true, color, align: "center", valign: "middle", margin: 0
  });
}

async function icon(ctx: Ctx, name: string, x: number, y: number, size: number, color: string) {
  await ctx.helpers.addIcon(ctx.slide, name, { x, y, w: size, h: size }, { color });
}

// 線の向きが左→右・上→下でない場合は、始点側に矢印を付けて同じ見た目にする。
function arrow(ctx: Ctx, from: Pt, to: Pt, color: string = C.accent, dashed = false, head = true) {
  const reversed = to.x < from.x || to.y < from.y;
  ctx.helpers.addArrow(ctx.slide, {
    from: reversed ? to : from,
    to: reversed ? from : to,
    color, width: 1.75, dashed,
    beginArrowType: head && reversed ? "triangle" : "none",
    endArrowType: head && !reversed ? "triangle" : "none"
  });
}

// 水平・垂直の線だけで a から b へつなぐ。
function elbow(ctx: Ctx, a: Pt, b: Pt, color: string = C.accent) {
  const midX = (a.x + b.x) / 2;
  const points: Pt[] = Math.abs(a.y - b.y) < 0.01 ? [a, b] : [a, { x: midX, y: a.y }, { x: midX, y: b.y }, b];
  for (let index = 1; index < points.length; index += 1) {
    arrow(ctx, points[index - 1], points[index], color, false, index === points.length - 1);
  }
}

function pill(ctx: Ctx, text: string, y: number, w: number = CW) {
  const { slide, pptx } = ctx;
  fit("pill", text, w - 0.3);
  const x = LM + (CW - w) / 2;
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h: 0.44, fill: { color: C.accentSoft }, line: { color: C.accentSoft, width: 0 }, rectRadius: 0.08
  });
  slide.addText(text, {
    x: x + 0.15, y, w: w - 0.3, h: 0.44, fontFace: FONT, fontSize: SIZE.body, color: C.ink, align: "center", valign: "middle", margin: 0
  });
  return y + 0.44;
}

function codePanel(ctx: Ctx, code: string, box: { x: number; y: number; w: number }) {
  const { slide, pptx } = ctx;
  const lines = code.split("\n");
  for (const line of lines) fit("code", line, box.w - 0.4, SIZE.body, 1, true);
  const lineH = 0.3;
  const h = lines.length * lineH + 0.3;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: box.x, y: box.y, w: box.w, h, fill: { color: C.ink }, line: { color: C.ink, width: 0 }, rectRadius: 0.06
  });
  slide.addText(lines.map((line, index) => ({
    text: line === "" ? " " : line,
    options: { color: line.trimStart().startsWith("#") ? SKY : C.white, breakLine: index < lines.length - 1 }
  })), {
    x: box.x + 0.2, y: box.y + 0.15, w: box.w - 0.4, h: h - 0.3,
    fontFace: MONO, fontSize: SIZE.body, lineSpacing: lineH * 72, valign: "top", margin: 0
  });
  return h;
}

function text(ctx: Ctx, value: string, box: { x: number; y: number; w: number; h: number }, opts: Record<string, unknown> = {}) {
  ctx.slide.addText(value, { ...box, fontFace: FONT, fontSize: SIZE.body, color: C.ink, valign: "middle", margin: 0, ...opts });
}

// ── 表紙・地図・扉・締め ─────────────────────────────────────────

export function coverSlide(input: { label: string; title: string; subtitle: string; context: string }): CustomSlide {
  return new CustomSlide({
    name: "guide-cover",
    requiredFonts: [FONT],
    draw(ctx) {
      const { slide, pptx } = ctx;
      slide.background = { color: C.ink };
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.14, h: 5.625, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });
      text(ctx, input.label, { x: LM, y: 1.0, w: CW, h: 0.4 }, { fontSize: SIZE.body, bold: true, color: SKY });
      slide.addText(input.title, {
        x: LM, y: 1.45, w: CW, h: 1.8, fontFace: FONT, fontSize: SIZE.deckTitle, bold: true, color: C.white,
        valign: "top", lineSpacingMultiple: 1.0, margin: 0
      });
      fit("cover subtitle", input.subtitle, CW, SIZE.lead);
      text(ctx, input.subtitle, { x: LM, y: 3.45, w: CW, h: 0.45 }, { fontSize: SIZE.lead, color: C.grey30 });
      text(ctx, input.context, { x: LM, y: 4.5, w: CW, h: 0.35 }, { fontSize: SIZE.body, color: C.grey30 });
    }
  });
}

export type MapTile = { no: string; name: string; desc: string; pages: string; tone: Tone };

export function mapSlide(input: { pageNum: number; eyebrow: string; title: string; tiles: MapTile[]; note: string }): CustomSlide {
  return new CustomSlide({
    name: "guide-map",
    requiredFonts: [FONT],
    draw(ctx) {
      header(ctx, input.eyebrow, input.title);
      const cols = 3;
      const gap = 0.25;
      const w = (CW - gap * (cols - 1)) / cols;
      const h = 1.25;
      input.tiles.forEach((tile, index) => {
        const x = LM + (index % cols) * (w + gap);
        const y = TOP + Math.floor(index / cols) * (h + 0.2);
        const color = tone(tile.tone);
        card(ctx, { x, y, w, h }, color);
        text(ctx, tile.no, { x: x + 0.25, y: y + 0.12, w: w - 0.4, h: 0.32 }, { bold: true, color });
        text(ctx, tile.pages, { x: x + 0.25, y: y + 0.12, w: w - 0.4, h: 0.32 }, { color: C.muted, align: "right" });
        fit(`map ${tile.name}`, tile.name, w - 0.4, SIZE.sub);
        text(ctx, tile.name, { x: x + 0.25, y: y + 0.46, w: w - 0.4, h: 0.44 }, { fontSize: SIZE.sub, bold: true });
        fit(`map ${tile.desc}`, tile.desc, w - 0.4);
        text(ctx, tile.desc, { x: x + 0.25, y: y + 0.9, w: w - 0.4, h: 0.3 }, { color: C.muted });
      });
      const rows = Math.ceil(input.tiles.length / cols);
      const bottom = pill(ctx, input.note, TOP + rows * (h + 0.2) + 0.1);
      assertBottom(input.title, bottom);
      footer(ctx, input.pageNum);
    }
  });
}

export function chapterSlide(input: { no: string; title: string; question: string; pages: string; toc: Array<{ page: string; title: string }> }): CustomSlide {
  return new CustomSlide({
    name: "guide-chapter",
    requiredFonts: [FONT],
    draw(ctx) {
      const { slide } = ctx;
      slide.background = { color: C.ink };
      text(ctx, input.no, { x: LM, y: 0.8, w: 3.85, h: 0.8 }, { fontSize: 54, bold: true, color: C.accent, valign: "top" });
      fit(`chapter ${input.title}`, input.title, 3.85, SIZE.chapter);
      text(ctx, input.title, { x: LM, y: 1.7, w: 3.85, h: 0.8 }, { fontSize: SIZE.chapter, bold: true, color: C.white });
      fit(`chapter question`, input.question, 3.85, SIZE.lead, 2);
      text(ctx, input.question, { x: LM, y: 2.65, w: 3.85, h: 0.9 }, { fontSize: SIZE.lead, color: C.grey30, valign: "top" });
      text(ctx, input.pages, { x: LM, y: 3.75, w: 3.85, h: 0.36 }, { color: SKY });
      slide.addShape("line", { x: 4.8, y: 0.95, w: 0, h: 3.7, line: { color: C.grey80, width: 1.25 } });
      text(ctx, "この章のページ", { x: 5.05, y: 0.9, w: 4.45, h: 0.36 }, { color: C.grey30 });
      if (input.toc.length > 6) throw new Error(`chapter ${input.title}: too many pages for the table of contents`);
      input.toc.forEach((item, index) => {
        const y = 1.35 + index * 0.5;
        const pageW = Math.max(0.7, textWidth(item.page) + 0.15);
        text(ctx, item.page, { x: 5.05, y, w: pageW, h: 0.4 }, { bold: true, color: C.accent });
        fit(`toc ${item.title}`, item.title, 4.45 - pageW);
        text(ctx, item.title, { x: 5.05 + pageW, y, w: 4.45 - pageW, h: 0.4 }, { color: C.white });
      });
    }
  });
}

export function closingSlide(input: { title: string; steps: string[]; footnote: string }): CustomSlide {
  return new CustomSlide({
    name: "guide-closing",
    requiredFonts: [FONT],
    draw(ctx) {
      const { slide } = ctx;
      slide.background = { color: C.ink };
      text(ctx, "最初の一歩", { x: LM, y: 0.45, w: CW, h: 0.3 }, { fontSize: SIZE.label, bold: true, color: SKY, charSpacing: 1 });
      fit("closing title", input.title, CW, SIZE.title);
      text(ctx, input.title, { x: LM, y: 0.8, w: CW, h: 0.66 }, { fontSize: SIZE.title, bold: true, color: C.white });
      input.steps.forEach((step, index) => {
        const y = 1.75 + index * 0.52;
        badge(ctx, String(index + 1), LM, y, 0.38, C.accent);
        fit("closing step", step, CW - 0.6);
        text(ctx, step, { x: LM + 0.6, y, w: CW - 0.6, h: 0.38 }, { color: C.white });
      });
      fit("closing footnote", input.footnote, CW);
      text(ctx, input.footnote, { x: LM, y: 4.6, w: CW, h: 0.36 }, { color: C.grey30 });
    }
  });
}

// ── 1 全体像 ─────────────────────────────────────────────────

export function kitSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  person: { name: string; request: string };
  runner: { name: string; caption: string; items: Array<{ icon: string; text: string }> };
  result: { name: string; items: Array<{ icon: string; text: string }> };
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-kit",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const y = TOP + 0.05;
      const h = 2.75;
      const sideW = 2.3;
      const gap = 0.35;
      const midX = LM + sideW + gap;
      const midW = CW - 2 * (sideW + gap);
      const rightX = midX + midW + gap;
      // 依頼する人
      card(ctx, { x: LM, y, w: sideW, h }, C.ink);
      await icon(ctx, "user", LM + 0.25, y + 0.22, 0.42, C.ink);
      text(ctx, input.person.name, { x: LM + 0.8, y: y + 0.18, w: sideW - 0.95, h: 0.5 }, { fontSize: SIZE.sub, bold: true });
      fit("kit request", input.person.request, sideW - 0.45, SIZE.body, 4);
      text(ctx, input.person.request, { x: LM + 0.25, y: y + 0.9, w: sideW - 0.45, h: 1.6 }, { valign: "top" });
      // Codex / Claude Code と手順セット
      slide.addShape(pptx.ShapeType.roundRect, {
        x: midX, y, w: midW, h, fill: { color: C.ink }, line: { color: C.ink, width: 0 }, rectRadius: 0.06
      });
      fit("kit runner", input.runner.name, midW - 0.4, SIZE.lead);
      text(ctx, input.runner.name, { x: midX + 0.2, y: y + 0.15, w: midW - 0.4, h: 0.42 }, { fontSize: SIZE.lead, bold: true, color: C.white });
      text(ctx, input.runner.caption, { x: midX + 0.2, y: y + 0.58, w: midW - 0.4, h: 0.32 }, { color: SKY });
      for (const [index, item] of input.runner.items.entries()) {
        const iy = y + 1.02 + index * 0.55;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: midX + 0.2, y: iy, w: midW - 0.4, h: 0.46, fill: { color: C.grey80 }, line: { color: C.grey80, width: 0 }, rectRadius: 0.05
        });
        await icon(ctx, item.icon, midX + 0.32, iy + 0.08, 0.3, SKY);
        fit("kit item", item.text, midW - 0.95);
        text(ctx, item.text, { x: midX + 0.75, y: iy, w: midW - 0.95, h: 0.46 }, { color: C.white });
      }
      // 残るもの
      card(ctx, { x: rightX, y, w: sideW, h }, C.accent3);
      text(ctx, input.result.name, { x: rightX + 0.25, y: y + 0.18, w: sideW - 0.4, h: 0.5 }, { fontSize: SIZE.sub, bold: true });
      for (const [index, item] of input.result.items.entries()) {
        const iy = y + 0.95 + index * 0.55;
        await icon(ctx, item.icon, rightX + 0.25, iy + 0.06, 0.34, C.accent3);
        fit("kit result", item.text, sideW - 0.85);
        text(ctx, item.text, { x: rightX + 0.7, y: iy, w: sideW - 0.85, h: 0.46 });
      }
      arrow(ctx, { x: LM + sideW + 0.06, y: y + h / 2 }, { x: midX - 0.06, y: y + h / 2 });
      arrow(ctx, { x: midX + midW + 0.06, y: y + h / 2 }, { x: rightX - 0.06, y: y + h / 2 });
      const bottom = pill(ctx, input.note, y + h + 0.25);
      assertBottom(input.title, bottom);
      footer(ctx, input.pageNum);
    }
  });
}

export function contrastSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  left: string; right: string; rows: Array<[string, string]>; note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-contrast",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const leftW = 3.9;
      const gap = 0.6;
      const rightX = LM + leftW + gap;
      const rightW = RIGHT - rightX;
      text(ctx, input.left, { x: LM, y: TOP, w: leftW, h: 0.36 }, { bold: true, color: C.muted });
      text(ctx, input.right, { x: rightX, y: TOP, w: rightW, h: 0.36 }, { bold: true, color: C.accent });
      const rowH = 0.66;
      const rowGap = 0.14;
      for (const [index, [before, after]] of input.rows.entries()) {
        const y = TOP + 0.5 + index * (rowH + rowGap);
        slide.addShape(pptx.ShapeType.roundRect, {
          x: LM, y, w: leftW, h: rowH, fill: { color: C.surface }, line: { color: C.grey30, width: 1 }, rectRadius: 0.06
        });
        await icon(ctx, "circle-x", LM + 0.2, y + rowH / 2 - 0.17, 0.34, C.faint);
        fit("contrast before", before, leftW - 0.8);
        text(ctx, before, { x: LM + 0.65, y, w: leftW - 0.8, h: rowH }, { color: C.muted });
        slide.addShape(pptx.ShapeType.roundRect, {
          x: rightX, y, w: rightW, h: rowH, fill: { color: C.accentSoft }, line: { color: C.accent, width: 1.25 }, rectRadius: 0.06
        });
        await icon(ctx, "circle-check", rightX + 0.2, y + rowH / 2 - 0.17, 0.34, C.accent);
        fit("contrast after", after, rightW - 0.8);
        text(ctx, after, { x: rightX + 0.65, y, w: rightW - 0.8, h: rowH }, { bold: true });
        arrow(ctx, { x: LM + leftW + 0.08, y: y + rowH / 2 }, { x: rightX - 0.08, y: y + rowH / 2 });
      }
      let bottom = TOP + 0.5 + input.rows.length * (rowH + rowGap) - rowGap;
      if (input.note) bottom = pill(ctx, input.note, bottom + 0.22);
      assertBottom(input.title, bottom);
      footer(ctx, input.pageNum);
    }
  });
}

export function forkSlide(input: {
  pageNum: number; eyebrow: string; title: string; question: string;
  branches: Array<{ label: string; name: string; icon: string; tone: Tone; rows: Array<[string, string]> }>;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-fork",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const qW = 3.2;
      const qX = LM + (CW - qW) / 2;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: qX, y: TOP, w: qW, h: 0.55, fill: { color: C.ink }, line: { color: C.ink, width: 0 }, rectRadius: 0.08
      });
      text(ctx, input.question, { x: qX, y: TOP, w: qW, h: 0.55 }, { fontSize: SIZE.lead, bold: true, color: C.white, align: "center" });
      const gap = 0.35;
      const w = (CW - gap) / 2;
      const y = TOP + 0.95;
      const h = BOTTOM - y;
      for (const [index, branch] of input.branches.entries()) {
        const x = LM + index * (w + gap);
        const color = tone(branch.tone);
        elbowDown(ctx, { x: LM + CW / 2, y: TOP + 0.55 }, { x: x + w / 2, y }, color);
        card(ctx, { x, y, w, h }, color);
        await icon(ctx, branch.icon, x + 0.25, y + 0.2, 0.46, color);
        text(ctx, branch.label, { x: x + 0.85, y: y + 0.12, w: w - 1.0, h: 0.28 }, { fontSize: SIZE.label, bold: true, color, charSpacing: 1 });
        text(ctx, branch.name, { x: x + 0.85, y: y + 0.38, w: w - 1.0, h: 0.42 }, { fontSize: SIZE.sub, bold: true });
        for (const [rowIndex, [label, value]] of branch.rows.entries()) {
          const ry = y + 1.0 + rowIndex * 0.5;
          text(ctx, label, { x: x + 0.25, y: ry, w: 0.7, h: 0.42 }, { bold: true, color });
          fit("fork value", value, w - 1.15);
          text(ctx, value, { x: x + 0.95, y: ry, w: w - 1.15, h: 0.42 });
        }
        assertBottom(input.title, y + 1.0 + branch.rows.length * 0.5);
      }
      footer(ctx, input.pageNum);
    }
  });
}

// 上の中央から下の箱の上辺へ、縦→横→縦でつなぐ。
function elbowDown(ctx: Ctx, from: Pt, to: Pt, color: string) {
  const midY = (from.y + to.y) / 2;
  arrow(ctx, from, { x: from.x, y: midY }, color, false, false);
  arrow(ctx, { x: from.x, y: midY }, { x: to.x, y: midY }, color, false, false);
  arrow(ctx, { x: to.x, y: midY }, to, color);
}

export function capabilitySlide(input: {
  pageNum: number; eyebrow: string; title: string;
  labels: { ask: string; result: string };
  cards: Array<{ icon: string; verb: string; ask: string; result: string; tone: Tone }>;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-capability",
    requiredFonts: [FONT],
    async draw(ctx) {
      header(ctx, input.eyebrow, input.title);
      const gap = 0.25;
      const w = (CW - gap) / 2;
      const h = (BOTTOM - TOP - gap) / 2;
      for (const [index, item] of input.cards.entries()) {
        const x = LM + (index % 2) * (w + gap);
        const y = TOP + Math.floor(index / 2) * (h + gap);
        const color = tone(item.tone);
        card(ctx, { x, y, w, h }, color);
        await icon(ctx, item.icon, x + 0.25, y + 0.2, 0.42, color);
        text(ctx, item.verb, { x: x + 0.8, y: y + 0.14, w: w - 1.0, h: 0.52 }, { fontSize: SIZE.sub, bold: true });
        const labelW = 1.0;
        for (const [rowIndex, [label, value]] of [[input.labels.ask, item.ask], [input.labels.result, item.result]].entries()) {
          const ry = y + 0.78 + rowIndex * 0.4;
          text(ctx, label, { x: x + 0.25, y: ry, w: labelW, h: 0.36 }, { bold: true, color });
          fit("capability value", value, w - labelW - 0.4);
          text(ctx, value, { x: x + 0.25 + labelW, y: ry, w: w - labelW - 0.4, h: 0.36 }, rowIndex === 1 ? { color: C.muted } : {});
        }
      }
      footer(ctx, input.pageNum);
    }
  });
}

// ── 2 準備する ───────────────────────────────────────────────

export function routeSlide(input: {
  pageNum: number; eyebrow: string; title: string; question: string;
  routes: Array<{ name: string; desc: string; page: number; tone: Tone }>;
  extra: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-route",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const rowH = 0.82;
      const rowGap = 0.14;
      const total = input.routes.length * rowH + (input.routes.length - 1) * rowGap;
      const qW = 2.15;
      const qH = 1.0;
      const qY = TOP + total / 2 - qH / 2;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: LM, y: qY, w: qW, h: qH, fill: { color: C.ink }, line: { color: C.ink, width: 0 }, rectRadius: 0.08
      });
      fit("route question", input.question, qW - 0.2, SIZE.lead);
      text(ctx, input.question, { x: LM + 0.1, y: qY, w: qW - 0.2, h: qH }, { fontSize: SIZE.lead, bold: true, color: C.white, align: "center" });
      const rowX = LM + qW + 0.6;
      const rowW = RIGHT - rowX;
      for (const [index, route] of input.routes.entries()) {
        const y = TOP + index * (rowH + rowGap);
        const color = tone(route.tone);
        elbow(ctx, { x: LM + qW + 0.04, y: qY + qH / 2 }, { x: rowX - 0.05, y: y + rowH / 2 }, color);
        card(ctx, { x: rowX, y, w: rowW, h: rowH }, color);
        fit("route name", route.name, rowW - 1.45, SIZE.sub);
        text(ctx, route.name, { x: rowX + 0.25, y: y + 0.06, w: rowW - 1.45, h: 0.44 }, { fontSize: SIZE.sub, bold: true });
        fit("route desc", route.desc, rowW - 1.45);
        text(ctx, route.desc, { x: rowX + 0.25, y: y + 0.5, w: rowW - 1.45, h: 0.3 }, { color: C.muted });
        slide.addShape(pptx.ShapeType.roundRect, {
          x: rowX + rowW - 1.1, y: y + rowH / 2 - 0.22, w: 0.9, h: 0.44, fill: { color: C.accentSoft }, line: { color: C.accentSoft, width: 0 }, rectRadius: 0.08
        });
        text(ctx, `p.${route.page}`, { x: rowX + rowW - 1.1, y: y + rowH / 2 - 0.22, w: 0.9, h: 0.44 }, { bold: true, color: C.accent, align: "center" });
      }
      const bottom = pill(ctx, input.extra, TOP + total + 0.2);
      assertBottom(input.title, bottom);
      footer(ctx, input.pageNum);
    }
  });
}

export function stepCardsSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  steps: Array<{ icon: string; heading: string; body: string }>;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-step-cards",
    requiredFonts: [FONT],
    async draw(ctx) {
      header(ctx, input.eyebrow, input.title);
      const gap = 0.45;
      const n = input.steps.length;
      const w = (CW - gap * (n - 1)) / n;
      const y = TOP + 0.05;
      const h = input.note ? 2.75 : 3.4;
      for (const [index, step] of input.steps.entries()) {
        const x = LM + index * (w + gap);
        card(ctx, { x, y, w, h }, C.accent);
        badge(ctx, String(index + 1), x + 0.25, y + 0.22, 0.44);
        await icon(ctx, step.icon, x + w - 0.7, y + 0.22, 0.44, C.accent);
        fit("step heading", step.heading, w - 0.45, SIZE.sub);
        text(ctx, step.heading, { x: x + 0.25, y: y + 0.72, w: w - 0.45, h: 0.48 }, { fontSize: SIZE.sub, bold: true });
        fit("step body", step.body, w - 0.45, SIZE.body, 4);
        text(ctx, step.body, { x: x + 0.25, y: y + 1.24, w: w - 0.45, h: h - 1.3 }, { valign: "top" });
        if (index < n - 1) arrow(ctx, { x: x + w + 0.06, y: y + h / 2 }, { x: x + w + gap - 0.06, y: y + h / 2 });
      }
      let bottom = y + h;
      if (input.note) bottom = pill(ctx, input.note, bottom + 0.2);
      assertBottom(input.title, bottom);
      footer(ctx, input.pageNum);
    }
  });
}

export function commandSlide(input: {
  pageNum: number; eyebrow: string; title: string; lead: string; code: string;
  cards: Array<{ icon: string; heading: string; body: string; tone: Tone }>;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-command",
    requiredFonts: [FONT, MONO],
    async draw(ctx) {
      header(ctx, input.eyebrow, input.title);
      fit("command lead", input.lead, CW);
      text(ctx, input.lead, { x: LM, y: TOP, w: CW, h: 0.34 }, { color: C.muted });
      const codeH = codePanel(ctx, input.code, { x: LM, y: TOP + 0.42, w: CW });
      const gap = 0.25;
      const n = input.cards.length;
      const w = (CW - gap * (n - 1)) / n;
      const y = TOP + 0.42 + codeH + 0.22;
      const h = BOTTOM - y;
      for (const [index, item] of input.cards.entries()) {
        const x = LM + index * (w + gap);
        const color = tone(item.tone);
        card(ctx, { x, y, w, h }, color);
        await icon(ctx, item.icon, x + 0.25, y + 0.2, 0.4, color);
        fit("command card heading", item.heading, w - 1.0, SIZE.sub);
        text(ctx, item.heading, { x: x + 0.78, y: y + 0.12, w: w - 0.95, h: 0.5 }, { fontSize: SIZE.sub, bold: true });
        fit("command card body", item.body, w - 0.45, SIZE.body, 3);
        text(ctx, item.body, { x: x + 0.25, y: y + 0.68, w: w - 0.45, h: h - 0.74 }, { valign: "top" });
      }
      footer(ctx, input.pageNum);
    }
  });
}

export function requestSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  request: string[];
  stepsLabel: string;
  steps: Array<{ text: string; sub?: string; stopped?: boolean }>;
  stopLabel?: string;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-request",
    requiredFonts: [FONT, MONO],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const leftW = 4.25;
      const rightX = LM + leftW + 0.55;
      const rightW = RIGHT - rightX;
      const areaBottom = input.note ? 4.32 : BOTTOM;
      // 依頼文
      card(ctx, { x: LM, y: TOP, w: leftW, h: areaBottom - TOP }, C.ink, C.surface);
      await icon(ctx, "message-square-text", LM + 0.25, TOP + 0.16, 0.36, C.ink);
      text(ctx, "依頼文", { x: LM + 0.72, y: TOP + 0.12, w: leftW - 0.9, h: 0.44 }, { fontSize: SIZE.lead, bold: true });
      const body = input.request.map((line) => `「${line}」`).join("\n");
      const lines = lineCount(body, leftW - 0.45);
      const maxLines = Math.floor((areaBottom - TOP - 0.75) / 0.33);
      if (lines > maxLines) throw new Error(`${input.title}: request needs ${lines} lines, room for ${maxLines}`);
      slide.addText(input.request.map((line, index) => ({
        text: `「${line}」`, options: { breakLine: index < input.request.length - 1 }
      })), {
        x: LM + 0.25, y: TOP + 0.68, w: leftW - 0.45, h: areaBottom - TOP - 0.8,
        fontFace: FONT, fontSize: SIZE.body, color: C.ink, valign: "top", lineSpacingMultiple: 1.0, margin: 0
      });
      arrow(ctx, { x: LM + leftW + 0.08, y: TOP + 1.2 }, { x: rightX - 0.1, y: TOP + 1.2 });
      // AIが進める順番
      fit("steps label", input.stepsLabel, rightW);
      text(ctx, input.stepsLabel, { x: rightX, y: TOP, w: rightW, h: 0.34 }, { bold: true, color: C.muted });
      let y = TOP + 0.45;
      let stopDrawn = false;
      for (const [index, step] of input.steps.entries()) {
        if (step.stopped && !stopDrawn && input.stopLabel) {
          fit("stop label", input.stopLabel, rightW - 0.6);
          slide.addShape("line", { x: rightX, y: y + 0.18, w: rightW, h: 0, line: { color: C.accent2, width: 1.5, dashType: "dash" } });
          slide.addShape(pptx.ShapeType.rect, { x: rightX + 0.45, y: y + 0.02, w: textWidth(input.stopLabel) + 0.2, h: 0.32, fill: { color: C.white }, line: { color: C.white, width: 0 } });
          text(ctx, input.stopLabel, { x: rightX + 0.55, y: y + 0.02, w: rightW - 0.55, h: 0.32 }, { bold: true, color: C.accent2 });
          y += 0.46;
          stopDrawn = true;
        }
        const rowH = step.sub ? 0.54 : 0.46;
        const color = step.stopped ? C.faint : C.ink;
        badge(ctx, String(index + 1), rightX, y + 0.04, 0.36, step.stopped ? C.grey30 : C.ink, step.stopped ? C.muted : C.white);
        fit("request step", step.text, rightW - 0.55);
        text(ctx, step.text, { x: rightX + 0.55, y, w: rightW - 0.55, h: step.sub ? 0.32 : 0.44 }, { bold: !step.stopped, color });
        if (step.sub) {
          fit("request step sub", step.sub, rightW - 0.55, SIZE.body, 1, true);
          text(ctx, step.sub, { x: rightX + 0.55, y: y + 0.3, w: rightW - 0.55, h: 0.28 }, { fontFace: MONO, color: C.muted });
        }
        y += rowH + (step.sub ? 0.06 : 0.04);
      }
      assertBottom(input.title, Math.max(y, areaBottom));
      if (input.note) pill(ctx, input.note, 4.5);
      footer(ctx, input.pageNum);
    }
  });
}

export function setupRowsSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  rows: Array<{ heading: string; desc: string; code?: string }>;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-setup-rows",
    requiredFonts: [FONT, MONO],
    draw(ctx) {
      header(ctx, input.eyebrow, input.title);
      let y = TOP;
      const indent = 0.6;
      for (const [index, row] of input.rows.entries()) {
        badge(ctx, String(index + 1), LM, y + 0.02, 0.4);
        const headW = textWidth(row.heading, SIZE.sub) + 0.2;
        text(ctx, row.heading, { x: LM + indent, y, w: headW, h: 0.44 }, { fontSize: SIZE.sub, bold: true });
        fit("setup desc", row.desc, CW - indent - headW - 0.1);
        text(ctx, row.desc, { x: LM + indent + headW + 0.1, y: y + 0.04, w: CW - indent - headW - 0.1, h: 0.4 }, { color: C.muted });
        y += 0.5;
        if (row.code) y += codePanel(ctx, row.code, { x: LM + indent, y, w: CW - indent }) + 0.16;
        else y += 0.1;
      }
      assertBottom(input.title, y);
      footer(ctx, input.pageNum);
    }
  });
}

export function checklistSlide(input: {
  pageNum: number; eyebrow: string; title: string; items: string[]; numbered?: boolean; note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-checklist",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const rowH = 0.44;
      const gap = 0.05;
      for (const [index, item] of input.items.entries()) {
        const y = TOP + index * (rowH + gap);
        slide.addShape(pptx.ShapeType.roundRect, {
          x: LM, y, w: CW, h: rowH, fill: { color: index % 2 === 0 ? C.surface : C.white }, line: { color: C.grey10, width: 0.75 }, rectRadius: 0.05
        });
        if (input.numbered) badge(ctx, String(index + 1), LM + 0.15, y + 0.05, 0.34, C.accent);
        else await icon(ctx, "circle-check", LM + 0.17, y + 0.06, 0.32, C.accent);
        fit("checklist item", item, CW - 0.8);
        text(ctx, item, { x: LM + 0.7, y, w: CW - 0.8, h: rowH });
      }
      let bottom = TOP + input.items.length * (rowH + gap) - gap;
      if (input.note) bottom = pill(ctx, input.note, bottom + 0.14);
      assertBottom(input.title, bottom);
      footer(ctx, input.pageNum);
    }
  });
}

// ── 3 依頼する ───────────────────────────────────────────────

export function anatomySlide(input: {
  pageNum: number; eyebrow: string; title: string;
  parts: Array<{ name: string; what: string; example: string; tone: Tone }>;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-anatomy",
    requiredFonts: [FONT],
    draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const rowH = 0.8;
      const gap = 0.1;
      const chipW = 1.25;
      for (const [index, part] of input.parts.entries()) {
        const y = TOP + index * (rowH + gap);
        const color = tone(part.tone);
        slide.addShape(pptx.ShapeType.roundRect, {
          x: LM, y, w: chipW, h: rowH, fill: { color }, line: { color, width: 0 }, rectRadius: 0.06
        });
        text(ctx, part.name, { x: LM, y, w: chipW, h: rowH }, { fontSize: SIZE.lead, bold: true, color: C.white, align: "center" });
        slide.addShape(pptx.ShapeType.roundRect, {
          x: LM + chipW + 0.15, y, w: CW - chipW - 0.15, h: rowH, fill: { color: C.white }, line: { color: C.grey30, width: 1 }, rectRadius: 0.06
        });
        const w = CW - chipW - 0.55;
        fit("anatomy what", part.what, w);
        text(ctx, part.what, { x: LM + chipW + 0.35, y: y + 0.07, w, h: 0.32 }, { bold: true });
        fit("anatomy example", `「${part.example}」`, w);
        text(ctx, `「${part.example}」`, { x: LM + chipW + 0.35, y: y + 0.41, w, h: 0.32 }, { color: C.muted });
      }
      assertBottom(input.title, TOP + input.parts.length * (rowH + gap) - gap);
      footer(ctx, input.pageNum);
    }
  });
}

export function zonesSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  zones: Array<{ icon: string; name: string; body: string; tone: Tone }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-zones",
    requiredFonts: [FONT],
    async draw(ctx) {
      header(ctx, input.eyebrow, input.title);
      const gap = 0.25;
      const w = (CW - gap) / 2;
      const h = 1.36;
      const rowGap = 0.14;
      for (const [index, zone] of input.zones.entries()) {
        const x = LM + (index % 2) * (w + gap);
        const y = TOP + Math.floor(index / 2) * (h + rowGap);
        const color = tone(zone.tone);
        card(ctx, { x, y, w, h }, color);
        badge(ctx, String(index + 1), x + 0.25, y + 0.16, 0.38, color);
        await icon(ctx, zone.icon, x + w - 0.6, y + 0.16, 0.38, color);
        text(ctx, zone.name, { x: x + 0.8, y: y + 0.1, w: w - 1.5, h: 0.48 }, { fontSize: SIZE.sub, bold: true });
        fit("zone body", zone.body, w - 0.45, SIZE.body, 2);
        text(ctx, zone.body, { x: x + 0.25, y: y + 0.6, w: w - 0.45, h: 0.7 }, { valign: "top" });
      }
      const rows = Math.ceil(input.zones.length / 2);
      const bottom = pill(ctx, input.note, TOP + rows * (h + rowGap) - rowGap + 0.2);
      assertBottom(input.title, bottom);
      footer(ctx, input.pageNum);
    }
  });
}

// ── フォルダツリー ─────────────────────────────────────────────

export type TreeNode = { name: string; depth: number; folder?: boolean; note?: string; tone?: Tone };

async function tree(ctx: Ctx, nodes: TreeNode[], box: { x: number; y: number; w: number }, rowH = 0.36) {
  const { slide } = ctx;
  const indent = 0.32;
  const iconSize = 0.26;
  nodes.forEach((node, index) => {
    if (node.depth === 0) return;
    let parent = index - 1;
    while (parent >= 0 && nodes[parent].depth >= node.depth) parent -= 1;
    const lineX = box.x + (node.depth - 1) * indent + iconSize / 2;
    const y1 = box.y + parent * rowH + rowH / 2 + iconSize / 2;
    const y2 = box.y + index * rowH + rowH / 2;
    slide.addShape("line", { x: lineX, y: y1, w: 0, h: y2 - y1, line: { color: C.faint, width: 1 } });
    slide.addShape("line", { x: lineX, y: y2, w: indent - iconSize / 2 - 0.04, h: 0, line: { color: C.faint, width: 1 } });
  });
  for (const [index, node] of nodes.entries()) {
    const y = box.y + index * rowH;
    const x = box.x + node.depth * indent;
    const color = node.tone ? tone(node.tone) : node.folder ? C.accent : C.muted;
    await icon(ctx, node.folder ? "folder" : "file-text", x, y + rowH / 2 - iconSize / 2, iconSize, color);
    const runs = [{ text: node.name, options: { fontFace: MONO, color: C.ink, bold: Boolean(node.tone) } }];
    if (node.note) runs.push({ text: `  ${node.note}`, options: { fontFace: FONT, color: C.muted, bold: false } });
    const need = textWidth(node.name, SIZE.body, true) + (node.note ? textWidth(`  ${node.note}`) : 0);
    const available = box.x + box.w - x - iconSize - 0.1;
    if (need > available) throw new Error(`tree row is too wide: ${node.name} ${node.note ?? ""} (${need.toFixed(2)} > ${available.toFixed(2)})`);
    slide.addText(runs, {
      x: x + iconSize + 0.1, y, w: available, h: rowH, fontSize: SIZE.body, valign: "middle", margin: 0
    });
  }
  return box.y + nodes.length * rowH;
}

export function treeSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  columns: Array<{ caption?: string; w: number; nodes: TreeNode[] }>;
  side?: { heading: string; items: string[]; tone: Tone; w: number };
  rowH?: number;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-tree",
    requiredFonts: [FONT, MONO],
    async draw(ctx) {
      header(ctx, input.eyebrow, input.title);
      const used = input.columns.reduce((sum, column) => sum + column.w, 0) + (input.side ? input.side.w : 0);
      const parts = input.columns.length + (input.side ? 1 : 0);
      const gap = parts > 1 ? (CW - used) / (parts - 1) : 0;
      if (gap < 0.2 && parts > 1) throw new Error(`${input.title}: columns are too wide`);
      const hasCaption = input.columns.some((column) => column.caption);
      const treeTop = hasCaption ? TOP + 0.45 : TOP;
      let x = LM;
      let bottom = TOP;
      for (const column of input.columns) {
        if (column.caption) text(ctx, column.caption, { x, y: TOP, w: column.w, h: 0.34 }, { bold: true, color: C.muted });
        bottom = Math.max(bottom, await tree(ctx, column.nodes, { x, y: treeTop, w: column.w }, input.rowH));
        x += column.w + gap;
      }
      if (input.side) {
        const side = input.side;
        const color = tone(side.tone);
        const itemH = 0.42;
        const h = 0.7 + side.items.length * itemH;
        card(ctx, { x, y: treeTop, w: side.w, h }, color);
        fit("tree side heading", side.heading, side.w - 0.45, SIZE.lead);
        text(ctx, side.heading, { x: x + 0.25, y: treeTop + 0.12, w: side.w - 0.4, h: 0.42 }, { fontSize: SIZE.lead, bold: true });
        side.items.forEach((item, index) => {
          fit("tree side item", item, side.w - 0.85);
          const iy = treeTop + 0.62 + index * itemH;
          badge(ctx, String(index + 1), x + 0.25, iy + 0.04, 0.3, color);
          text(ctx, item, { x: x + 0.65, y: iy, w: side.w - 0.85, h: 0.38 });
        });
        bottom = Math.max(bottom, treeTop + h);
      }
      if (input.note) bottom = pill(ctx, input.note, Math.max(bottom + 0.2, 4.5));
      assertBottom(input.title, bottom);
      footer(ctx, input.pageNum);
    }
  });
}

// ── 5 しくみを知る ─────────────────────────────────────────────

export function pickSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  picks: Array<{ when: string; skill: string; tone: Tone }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-pick",
    requiredFonts: [FONT, MONO],
    draw(ctx) {
      header(ctx, input.eyebrow, input.title);
      const gap = 0.25;
      const w = (CW - gap) / 2;
      const rows = Math.ceil(input.picks.length / 2);
      const h = 0.68;
      const rowGap = 0.08;
      for (const [index, pick] of input.picks.entries()) {
        const x = LM + (index % 2) * (w + gap);
        const y = TOP + Math.floor(index / 2) * (h + rowGap);
        const color = tone(pick.tone);
        card(ctx, { x, y, w, h }, color);
        fit("pick when", pick.when, w - 0.4);
        text(ctx, pick.when, { x: x + 0.25, y: y + 0.04, w: w - 0.4, h: 0.3 }, { bold: true });
        fit("pick skill", pick.skill, w - 0.4, SIZE.body, 1, true);
        text(ctx, pick.skill, { x: x + 0.25, y: y + 0.34, w: w - 0.4, h: 0.3 }, { fontFace: MONO, color });
      }
      const bottom = pill(ctx, input.note, TOP + rows * (h + rowGap) - rowGap + 0.1);
      assertBottom(input.title, bottom);
      footer(ctx, input.pageNum);
    }
  });
}

export function rolesSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  roles: Array<{ name: string; alias: string; models: Array<[string, string]>; duties: string[]; tone: Tone; icon: string }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-roles",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide } = ctx;
      header(ctx, input.eyebrow, input.title);
      const gap = 0.35;
      const w = (CW - gap) / 2;
      const h = 2.85;
      for (const [index, role] of input.roles.entries()) {
        const x = LM + index * (w + gap);
        const color = tone(role.tone);
        card(ctx, { x, y: TOP, w, h }, color);
        await icon(ctx, role.icon, x + 0.25, TOP + 0.18, 0.42, color);
        const nameW = textWidth(role.name, SIZE.sub) + 0.15;
        text(ctx, role.name, { x: x + 0.8, y: TOP + 0.12, w: nameW, h: 0.5 }, { fontSize: SIZE.sub, bold: true });
        if (0.8 + nameW + textWidth(role.alias) > w - 0.2) throw new Error(`roles: header is too wide for ${role.name}`);
        text(ctx, role.alias, { x: x + 0.8 + nameW, y: TOP + 0.2, w: w - 1.0 - nameW, h: 0.38 }, { bold: true, color });
        role.models.forEach(([tool, model], modelIndex) => {
          const my = TOP + 0.72 + modelIndex * 0.32;
          text(ctx, tool, { x: x + 0.3, y: my, w: 1.6, h: 0.3 }, { color: C.muted });
          text(ctx, model, { x: x + 1.9, y: my, w: w - 2.1, h: 0.3 }, { bold: true, color });
        });
        slide.addShape("line", { x: x + 0.3, y: TOP + 1.42, w: w - 0.55, h: 0, line: { color: C.grey30, width: 0.75 } });
        role.duties.forEach((duty, dutyIndex) => {
          fit("role duty", duty, w - 0.8);
          const dy = TOP + 1.55 + dutyIndex * 0.3;
          slide.addShape("ellipse", { x: x + 0.32, y: dy + 0.1, w: 0.09, h: 0.09, fill: { color }, line: { color, width: 0 } });
          text(ctx, duty, { x: x + 0.52, y: dy, w: w - 0.8, h: 0.3 });
        });
        if (TOP + 1.55 + role.duties.length * 0.3 > TOP + h - 0.05) throw new Error(`roles: duties overflow for ${role.name}`);
      }
      const bottom = pill(ctx, input.note, TOP + h + 0.16);
      assertBottom(input.title, bottom);
      footer(ctx, input.pageNum);
    }
  });
}

export function loopSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  steps: Array<{ role: string; name: string; body: string; tone: Tone }>;
  loop: { role: string; name: string; body: string; tone: Tone; at: number; down: string; up: string };
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-loop",
    requiredFonts: [FONT],
    draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const gap = 0.45;
      const n = input.steps.length;
      const w = (CW - gap * (n - 1)) / n;
      const y = TOP;
      const h = 1.35;
      const box = (x: number, top: number, item: { role: string; name: string; body: string; tone: Tone }, height: number) => {
        const color = tone(item.tone);
        card(ctx, { x, y: top, w, h: height }, color);
        slide.addShape(pptx.ShapeType.roundRect, {
          x: x + 0.22, y: top + 0.14, w: textWidth(item.role) + 0.3, h: 0.34, fill: { color }, line: { color, width: 0 }, rectRadius: 0.08
        });
        text(ctx, item.role, { x: x + 0.22, y: top + 0.14, w: textWidth(item.role) + 0.3, h: 0.34 }, { bold: true, color: C.white, align: "center" });
        fit("loop name", item.name, w - 0.4, SIZE.sub);
        text(ctx, item.name, { x: x + 0.22, y: top + 0.55, w: w - 0.35, h: 0.46 }, { fontSize: SIZE.sub, bold: true });
        fit("loop body", item.body, w - 0.4);
        text(ctx, item.body, { x: x + 0.22, y: top + 1.0, w: w - 0.35, h: 0.3 });
      };
      input.steps.forEach((step, index) => {
        const x = LM + index * (w + gap);
        box(x, y, step, h);
        if (index < n - 1) arrow(ctx, { x: x + w + 0.06, y: y + h / 2 }, { x: x + w + gap - 0.06, y: y + h / 2 });
      });
      // 指摘があれば修正に回し、再レビューへ戻す。
      const loopX = LM + input.loop.at * (w + gap);
      const loopY = y + h + 0.5;
      const loopH = 1.35;
      box(loopX, loopY, input.loop, loopH);
      const color = tone(input.loop.tone);
      arrow(ctx, { x: loopX + w * 0.3, y: y + h + 0.05 }, { x: loopX + w * 0.3, y: loopY - 0.05 }, color);
      arrow(ctx, { x: loopX + w * 0.7, y: loopY - 0.05 }, { x: loopX + w * 0.7, y: y + h + 0.05 }, color);
      text(ctx, input.loop.down, { x: loopX - 1.65, y: y + h + 0.1, w: 1.6 + w * 0.3 - 0.1, h: 0.36 }, { bold: true, color, align: "right" });
      text(ctx, input.loop.up, { x: loopX + w * 0.7 + 0.12, y: y + h + 0.1, w: 1.8, h: 0.36 }, { bold: true, color });
      fit("loop note", input.note, loopX - LM - 0.3, SIZE.body, 3);
      text(ctx, input.note, { x: LM, y: loopY + 0.1, w: loopX - LM - 0.3, h: 1.2 }, { color: C.muted, valign: "top" });
      assertBottom(input.title, loopY + loopH);
      footer(ctx, input.pageNum);
    }
  });
}

export function fileFlowSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  inputs: Array<{ name: string; desc: string }>;
  build: { name: string; desc: string };
  outputs: { caption: string; items: Array<{ name: string; desc: string }> };
  final: { name: string; desc: string };
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-file-flow",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const gap = 0.32;
      const widths = [2.2, 1.55, 1.9, CW - 2.2 - 1.55 - 1.9 - 3 * gap];
      const xs = widths.map((_, index) => LM + widths.slice(0, index).reduce((sum, w) => sum + w, 0) + index * gap);
      const top = TOP + 0.4;
      const bottomLimit = 4.3;
      const node = (x: number, y: number, w: number, h: number, item: { name: string; desc: string }, color: string, dark = false) => {
        if (dark) {
          slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: C.ink }, line: { color: C.ink, width: 0 }, rectRadius: 0.06 });
        } else {
          card(ctx, { x, y, w, h }, color);
        }
        fit("file node name", item.name, w - 0.35);
        fit("file node desc", item.desc, w - 0.35);
        text(ctx, item.name, { x: x + 0.2, y: y + h / 2 - 0.34, w: w - 0.3, h: 0.34 }, { bold: true, color: dark ? C.white : C.ink });
        text(ctx, item.desc, { x: x + 0.2, y: y + h / 2, w: w - 0.3, h: 0.32 }, { color: dark ? SKY : C.muted });
      };
      text(ctx, "入力", { x: xs[0], y: TOP, w: widths[0], h: 0.32 }, { bold: true, color: C.muted });
      text(ctx, "生成", { x: xs[1], y: TOP, w: widths[1], h: 0.32 }, { bold: true, color: C.muted });
      text(ctx, input.outputs.caption, { x: xs[2], y: TOP, w: widths[2], h: 0.32 }, { bold: true, color: C.muted });
      text(ctx, "完成版", { x: xs[3], y: TOP, w: widths[3], h: 0.32 }, { bold: true, color: C.muted });
      const span = bottomLimit - top;
      const inH = 0.95;
      const inGap = span - inH * input.inputs.length;
      const inYs = input.inputs.map((_, index) => top + index * (inH + inGap / Math.max(1, input.inputs.length - 1)));
      input.inputs.forEach((item, index) => node(xs[0], inYs[index], widths[0], inH, item, C.accent));
      const buildY = top + span / 2 - 0.55;
      node(xs[1], buildY, widths[1], 1.1, input.build, C.ink, true);
      const outH = 0.78;
      const outGap = (span - outH * input.outputs.items.length) / Math.max(1, input.outputs.items.length - 1);
      const outYs = input.outputs.items.map((_, index) => top + index * (outH + outGap));
      input.outputs.items.forEach((item, index) => node(xs[2], outYs[index], widths[2], outH, item, C.accent3));
      const finalY = top + span / 2 - 0.55;
      node(xs[3], finalY, widths[3], 1.1, input.final, C.accent2);
      inYs.forEach((y) => elbow(ctx, { x: xs[0] + widths[0] + 0.04, y: y + inH / 2 }, { x: xs[1] - 0.05, y: buildY + 0.55 }));
      outYs.forEach((y) => elbow(ctx, { x: xs[1] + widths[1] + 0.04, y: buildY + 0.55 }, { x: xs[2] - 0.05, y: y + outH / 2 }, C.accent3));
      arrow(ctx, { x: xs[2] + widths[2] + 0.06, y: finalY + 0.55 }, { x: xs[3] - 0.06, y: finalY + 0.55 }, C.accent2);
      const bottom = pill(ctx, input.note, bottomLimit + 0.18);
      assertBottom(input.title, bottom);
      footer(ctx, input.pageNum);
    }
  });
}

export function stageSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  stages: Array<{ icon: string; name: string; body: string }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-stages",
    requiredFonts: [FONT],
    async draw(ctx) {
      header(ctx, input.eyebrow, input.title);
      const gap = 0.38;
      const n = input.stages.length;
      const w = (CW - gap * (n - 1)) / n;
      const h = 2.6;
      for (const [index, stage] of input.stages.entries()) {
        const x = LM + index * (w + gap);
        card(ctx, { x, y: TOP, w, h }, C.accent);
        badge(ctx, String(index + 1), x + 0.22, TOP + 0.2, 0.4);
        await icon(ctx, stage.icon, x + w - 0.62, TOP + 0.2, 0.4, C.accent);
        fit("stage name", stage.name, w - 0.4, SIZE.sub);
        text(ctx, stage.name, { x: x + 0.22, y: TOP + 0.76, w: w - 0.35, h: 0.46 }, { fontSize: SIZE.sub, bold: true });
        fit("stage body", stage.body, w - 0.4, SIZE.body, 3);
        text(ctx, stage.body, { x: x + 0.22, y: TOP + 1.3, w: w - 0.35, h: h - 1.4 }, { valign: "top" });
        if (index < n - 1) arrow(ctx, { x: x + w + 0.05, y: TOP + h / 2 }, { x: x + w + gap - 0.05, y: TOP + h / 2 });
      }
      const bottom = pill(ctx, input.note, TOP + h + 0.3);
      assertBottom(input.title, bottom);
      footer(ctx, input.pageNum);
    }
  });
}

// ── 付録 ─────────────────────────────────────────────────────

export function familySlide(input: {
  pageNum: number; eyebrow: string; title: string;
  families: Array<{ count: string; name: string; where: string; detail: string; tone: Tone }>;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-families",
    requiredFonts: [FONT],
    draw(ctx) {
      header(ctx, input.eyebrow, input.title);
      const rowH = 0.8;
      const gap = 0.09;
      const leftW = 2.45;
      for (const [index, family] of input.families.entries()) {
        const y = TOP + index * (rowH + gap);
        const color = tone(family.tone);
        card(ctx, { x: LM, y, w: CW, h: rowH }, color);
        text(ctx, family.count, { x: LM + 0.25, y: y + 0.05, w: leftW - 0.3, h: 0.4 }, { fontSize: SIZE.sub, bold: true, color });
        fit("family name", family.name, leftW - 0.3);
        text(ctx, family.name, { x: LM + 0.25, y: y + 0.45, w: leftW - 0.3, h: 0.3 }, { bold: true });
        const w = CW - leftW - 0.3;
        fit("family where", family.where, w);
        text(ctx, family.where, { x: LM + leftW, y: y + 0.08, w, h: 0.32 }, { color: C.muted });
        fit("family detail", family.detail, w);
        text(ctx, family.detail, { x: LM + leftW, y: y + 0.42, w, h: 0.32 });
      }
      assertBottom(input.title, TOP + input.families.length * (rowH + gap) - gap);
      footer(ctx, input.pageNum);
    }
  });
}

export function pairListSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  header: [string, string];
  rows: Array<{ icon: string; name: string; use: string }>;
  nameW: number;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-pair-list",
    requiredFonts: [FONT, MONO],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      text(ctx, input.header[0], { x: LM + 0.7, y: TOP, w: input.nameW, h: 0.32 }, { bold: true, color: C.muted });
      text(ctx, input.header[1], { x: LM + 0.7 + input.nameW, y: TOP, w: CW - 0.7 - input.nameW, h: 0.32 }, { bold: true, color: C.muted });
      const rowH = 0.46;
      const gap = 0.06;
      for (const [index, row] of input.rows.entries()) {
        const y = TOP + 0.38 + index * (rowH + gap);
        slide.addShape(pptx.ShapeType.roundRect, {
          x: LM, y, w: CW, h: rowH, fill: { color: index % 2 === 0 ? C.surface : C.white }, line: { color: C.grey10, width: 0.75 }, rectRadius: 0.05
        });
        await icon(ctx, row.icon, LM + 0.2, y + rowH / 2 - 0.16, 0.32, C.accent3);
        fit("pair name", row.name, input.nameW - 0.15);
        text(ctx, row.name, { x: LM + 0.7, y, w: input.nameW - 0.1, h: rowH }, { bold: true });
        fit("pair use", row.use, CW - 0.8 - input.nameW);
        text(ctx, row.use, { x: LM + 0.7 + input.nameW, y, w: CW - 0.8 - input.nameW, h: rowH });
      }
      let bottom = TOP + 0.38 + input.rows.length * (rowH + gap) - gap;
      if (input.note) bottom = pill(ctx, input.note, bottom + 0.14);
      assertBottom(input.title, bottom);
      footer(ctx, input.pageNum);
    }
  });
}

export function glossarySlide(input: {
  pageNum: number; eyebrow: string; title: string;
  terms: Array<{ term: string; meaning: string; tone: Tone }>;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-glossary",
    requiredFonts: [FONT],
    draw(ctx) {
      header(ctx, input.eyebrow, input.title);
      const cols = 3;
      const gap = 0.25;
      const w = (CW - gap * (cols - 1)) / cols;
      const rows = Math.ceil(input.terms.length / cols);
      const h = (BOTTOM - TOP - gap * (rows - 1)) / rows;
      for (const [index, item] of input.terms.entries()) {
        const x = LM + (index % cols) * (w + gap);
        const y = TOP + Math.floor(index / cols) * (h + gap);
        card(ctx, { x, y, w, h }, tone(item.tone));
        fit("glossary term", item.term, w - 0.4, SIZE.sub);
        text(ctx, item.term, { x: x + 0.25, y: y + 0.1, w: w - 0.4, h: 0.46 }, { fontSize: SIZE.sub, bold: true });
        fit("glossary meaning", item.meaning, w - 0.45, SIZE.body, 3);
        text(ctx, item.meaning, { x: x + 0.25, y: y + 0.58, w: w - 0.45, h: h - 0.62 }, { valign: "top" });
      }
      footer(ctx, input.pageNum);
    }
  });
}

// 付録のSkill一覧表。1行1件、Skill名と使う場面を16ptで並べる。
export function skillTableSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  rows: Array<{ name: string; when: string }>;
  tone: Tone;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-skill-table",
    requiredFonts: [FONT],
    draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const color = tone(input.tone);
      const cols = [3.95, CW - 3.95];
      const xs = [LM, LM + cols[0]];
      const headH = 0.34;
      const rowH = 0.35;
      ["Skill", "使う場面"].forEach((label, index) => {
        text(ctx, label, { x: xs[index] + 0.15, y: TOP, w: cols[index] - 0.2, h: headH }, { bold: true, color: C.muted });
      });
      slide.addShape("line", { x: LM, y: TOP + headH, w: CW, h: 0, line: { color, width: 1.5 } });
      input.rows.forEach((row, index) => {
        const y = TOP + headH + 0.04 + index * rowH;
        if (index % 2 === 0) {
          slide.addShape(pptx.ShapeType.rect, { x: LM, y, w: CW, h: rowH, fill: { color: C.surface }, line: { color: C.surface, width: 0 } });
        }
        [row.name, row.when].forEach((value, col) => {
          fit(`skill table ${row.name}`, value, cols[col] - 0.25);
          text(ctx, value, { x: xs[col] + 0.15, y, w: cols[col] - 0.2, h: rowH }, col === 0 ? { bold: true, color } : {});
        });
      });
      assertBottom(input.title, TOP + headH + 0.04 + input.rows.length * rowH);
      footer(ctx, input.pageNum);
    }
  });
}
