/**
 * 図解スライド（2026-10-01 ブラッシュアップ）。
 * guide-* テンプレートと同じ見出し・カード・フッターの寸法と書体で、ネイティブ図形の図解を描く。
 */
import { C, CustomSlide, LAYOUT, type CustomSlideContext } from "../../src/index.js";

const { LM, CW } = LAYOUT;
const FONT = "Noto Sans JP";
const MONO = "Arial";
const FOOTER = "AI-ENGINE-DEV 利用ガイド";
const RIGHT = LM + CW;

type Ctx = CustomSlideContext;
export type Tone = "accent" | "accent2" | "accent3" | "ink" | "muted";

function tone(value: Tone | undefined): string {
  if (value === "accent2") return C.accent2;
  if (value === "accent3") return C.accent3;
  if (value === "ink") return C.ink;
  if (value === "muted") return C.faint;
  return C.accent;
}

function page(value: number): string {
  return String(value).padStart(2, "0");
}

function header(ctx: Ctx, eyebrow: string, title: string, titleSize = 27) {
  const { slide } = ctx;
  slide.background = { color: C.white };
  slide.addText(eyebrow, {
    x: LM, y: 0.3, w: CW, h: 0.22,
    fontFace: FONT, fontSize: 11, bold: true, color: C.accent, charSpacing: 1.1, margin: 0
  });
  slide.addText(title, {
    x: LM, y: 0.66, w: CW, h: 0.6,
    fontFace: FONT, fontSize: titleSize, bold: true, color: C.ink, valign: "middle", margin: 0
  });
}

function footer(ctx: Ctx, pageNum: number) {
  const { slide } = ctx;
  slide.addShape("line", { x: LM, y: 5.08, w: CW, h: 0, line: { color: C.grey30, width: 1 } });
  slide.addText(FOOTER, {
    x: LM, y: 5.16, w: 3.0, h: 0.18, fontFace: FONT, fontSize: 8, color: C.muted, margin: 0
  });
  slide.addText(page(pageNum), {
    x: RIGHT - 0.5, y: 5.16, w: 0.5, h: 0.18, fontFace: FONT, fontSize: 8, color: C.muted, align: "right", margin: 0
  });
}

// テンプレートと同じ白カード（左に色帯、ラベル、見出し、本文）。
function card(ctx: Ctx, input: {
  x: number; y: number; w: number; h: number;
  label?: string; title?: string; body?: string; accent?: string;
  titleSize?: number; bodySize?: number; fill?: string; bodyColor?: string; mono?: boolean;
}) {
  const { slide, pptx } = ctx;
  const accent = input.accent ?? C.accent;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: input.x, y: input.y, w: input.w, h: input.h,
    fill: { color: input.fill ?? C.white }, line: { color: C.grey30, width: 1 }, rectRadius: 0.06
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: input.x, y: input.y, w: 0.07, h: input.h, fill: { color: accent }, line: { color: accent, width: 0 }
  });
  let y = input.y + 0.12;
  if (input.label) {
    slide.addText(input.label, {
      x: input.x + 0.2, y, w: input.w - 0.3, h: 0.2, fontFace: FONT, fontSize: 9.5, bold: true, color: accent, margin: 0
    });
    y += 0.24;
  }
  if (input.title) {
    const size = input.titleSize ?? 16;
    const h = size / 72 * 1.45;
    slide.addText(input.title, {
      x: input.x + 0.2, y, w: input.w - 0.3, h, fontFace: FONT, fontSize: size, bold: true, color: C.ink, valign: "middle", margin: 0
    });
    y += h + 0.04;
  }
  if (input.body) {
    slide.addText(input.body, {
      x: input.x + 0.2, y, w: input.w - 0.3, h: input.y + input.h - y - 0.08,
      fontFace: input.mono ? MONO : FONT, fontSize: input.bodySize ?? 12, color: input.bodyColor ?? C.muted,
      valign: "top", margin: 0, lineSpacingMultiple: 1.05
    });
  }
}

async function icon(ctx: Ctx, name: string, x: number, y: number, size: number, color: string) {
  await ctx.helpers.addIcon(ctx.slide, name, { x, y, w: size, h: size }, { color });
}

function arrow(ctx: Ctx, from: { x: number; y: number }, to: { x: number; y: number }, color: string = C.faint, dashed = false) {
  // 負の幅・高さの線は矢印の向きが反転するため、左→右・上→下でない場合は始点側の矢印で描く。
  const reversed = to.x < from.x || to.y < from.y;
  ctx.helpers.addArrow(ctx.slide, {
    from: reversed ? to : from,
    to: reversed ? from : to,
    color, width: 1.75, dashed,
    beginArrowType: reversed ? "triangle" : "none",
    endArrowType: reversed ? "none" : "triangle"
  });
}

type Pt = { x: number; y: number };

// 軸に沿った1本の線。arrowAtEnd が true なら b 側に矢印を付ける。
function segment(ctx: Ctx, a: Pt, b: Pt, color: string, dashed: boolean, arrowAtEnd: boolean) {
  const reversed = b.x < a.x || b.y < a.y;
  const from = reversed ? b : a;
  const to = reversed ? a : b;
  const head = arrowAtEnd ? (reversed ? "begin" : "end") : "none";
  ctx.helpers.addArrow(ctx.slide, {
    from, to, color, width: 1.75, dashed,
    beginArrowType: head === "begin" ? "triangle" : "none",
    endArrowType: head === "end" ? "triangle" : "none"
  });
}

// 斜め線を使わず、水平・垂直の線だけで a から b へつなぐ。
function elbow(ctx: Ctx, a: Pt, b: Pt, horizontalFirst: boolean, color: string, dashed = false) {
  const points: Pt[] = [a];
  if (Math.abs(a.x - b.x) > 0.01 && Math.abs(a.y - b.y) > 0.01) {
    if (horizontalFirst) {
      const midX = (a.x + b.x) / 2;
      points.push({ x: midX, y: a.y }, { x: midX, y: b.y });
    } else {
      const midY = (a.y + b.y) / 2;
      points.push({ x: a.x, y: midY }, { x: b.x, y: midY });
    }
  }
  points.push(b);
  for (let index = 1; index < points.length; index += 1) {
    segment(ctx, points[index - 1], points[index], color, dashed, index === points.length - 1);
  }
}

function pill(ctx: Ctx, text: string, y = 4.62, w = 6.4) {
  const { slide, pptx } = ctx;
  const x = LM + (CW - w) / 2;
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h: 0.36, fill: { color: C.accentSoft }, line: { color: C.accentSoft, width: 0 }, rectRadius: 0.08
  });
  slide.addText(text, {
    x: x + 0.1, y, w: w - 0.2, h: 0.36, fontFace: FONT, fontSize: 11, bold: true, color: C.ink, align: "center", valign: "middle", margin: 0
  });
}

function badge(ctx: Ctx, text: string, x: number, y: number, size: number, fill: string, color: string = C.white) {
  const { slide } = ctx;
  slide.addShape("ellipse", { x, y, w: size, h: size, fill: { color: fill }, line: { color: fill, width: 0 } });
  slide.addText(text, {
    x, y, w: size, h: size, fontFace: FONT, fontSize: 12, bold: true, color, align: "center", valign: "middle", margin: 0
  });
}

// ── 読み方：4つの疑問と章の対応 ────────────────────────────────

export function questionJourneySlide(input: {
  pageNum: number; eyebrow: string; title: string;
  steps: Array<{ icon: string; question: string; answer: string; chapter: string }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-question-journey",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const n = input.steps.length;
      const gap = 0.32;
      const w = (CW - gap * (n - 1)) / n;
      const y = 1.5;
      const h = 2.55;
      for (const [index, step] of input.steps.entries()) {
        const x = LM + index * (w + gap);
        const color = index === n - 1 ? C.accent2 : C.accent;
        card(ctx, { x, y, w, h, accent: color });
        badge(ctx, String(index + 1), x + 0.22, y + 0.2, 0.42, C.ink);
        await icon(ctx, step.icon, x + w - 0.62, y + 0.2, 0.42, color);
        slide.addText(step.question, {
          x: x + 0.22, y: y + 0.78, w: w - 0.3, h: 0.4, fontFace: FONT, fontSize: 14, bold: true, color: C.ink, margin: 0
        });
        slide.addText(step.answer, {
          x: x + 0.22, y: y + 1.25, w: w - 0.35, h: 0.9, fontFace: FONT, fontSize: 12, color: C.muted, valign: "top", margin: 0
        });
        slide.addShape(pptx.ShapeType.roundRect, {
          x: x + 0.22, y: y + h - 0.48, w: w - 0.44, h: 0.32, fill: { color: C.accentSoft }, line: { color: C.accentSoft, width: 0 }, rectRadius: 0.06
        });
        slide.addText(step.chapter, {
          x: x + 0.22, y: y + h - 0.48, w: w - 0.44, h: 0.32, fontFace: FONT, fontSize: 11, bold: true, color: C.ink, align: "center", valign: "middle", margin: 0
        });
        if (index < n - 1) arrow(ctx, { x: x + w + 0.04, y: y + h / 2 }, { x: x + w + gap - 0.04, y: y + h / 2 }, C.accent);
      }
      pill(ctx, input.note, 4.35);
      footer(ctx, input.pageNum);
    }
  });
}

// ── 再利用キット：キット → CLI → 対象Project ─────────────────────

export function kitArchitectureSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  kit: { label: string; title: string; items: Array<{ icon: string; text: string }> };
  runner: { label: string; title: string; steps: string[] };
  result: { label: string; title: string; items: Array<{ icon: string; text: string }> };
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-kit-architecture",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide } = ctx;
      header(ctx, input.eyebrow, input.title);
      const y = 1.42;
      const h = 2.95;
      const kitW = 3.15;
      const runW = 2.55;
      const gap = 0.47;
      const runX = LM + kitW + gap;
      const resX = runX + runW + gap;
      const resW = RIGHT - resX;

      card(ctx, { x: LM, y, w: kitW, h, label: input.kit.label, title: input.kit.title, accent: C.accent2 });
      for (const [index, item] of input.kit.items.entries()) {
        const iy = y + 0.86 + index * 0.4;
        await icon(ctx, item.icon, LM + 0.22, iy + 0.03, 0.26, C.accent2);
        slide.addText(item.text, {
          x: LM + 0.58, y: iy, w: kitW - 0.7, h: 0.32, fontFace: FONT, fontSize: 12, color: C.ink, valign: "middle", margin: 0
        });
      }

      card(ctx, { x: runX, y, w: runW, h, label: input.runner.label, title: input.runner.title, accent: C.ink, fill: C.surface });
      for (const [index, step] of input.runner.steps.entries()) {
        const sy = y + 0.9 + index * 0.68;
        badge(ctx, String(index + 1), runX + 0.2, sy + 0.04, 0.3, C.ink);
        slide.addText(step, {
          x: runX + 0.6, y: sy, w: runW - 0.72, h: 0.4, fontFace: FONT, fontSize: 12, color: C.ink, valign: "middle", margin: 0
        });
        if (index < input.runner.steps.length - 1) {
          arrow(ctx, { x: runX + 0.35, y: sy + 0.36 }, { x: runX + 0.35, y: sy + 0.68 }, C.faint);
        }
      }

      card(ctx, { x: resX, y, w: resW, h, label: input.result.label, title: input.result.title, accent: C.accent3 });
      for (const [index, item] of input.result.items.entries()) {
        const iy = y + 0.9 + index * 0.62;
        await icon(ctx, item.icon, resX + 0.22, iy + 0.05, 0.3, C.accent3);
        slide.addText(item.text, {
          x: resX + 0.62, y: iy, w: resW - 0.72, h: 0.4, fontFace: FONT, fontSize: 12, color: C.ink, valign: "middle", margin: 0
        });
      }

      arrow(ctx, { x: LM + kitW + 0.05, y: y + h / 2 }, { x: runX - 0.05, y: y + h / 2 }, C.accent);
      arrow(ctx, { x: runX + runW + 0.05, y: y + h / 2 }, { x: resX - 0.05, y: y + h / 2 }, C.accent);
      pill(ctx, input.note, 4.55, 7.2);
      footer(ctx, input.pageNum);
    }
  });
}

// ── できること：アイコン付き4カード ─────────────────────────────

export function capabilityCardsSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  cards: Array<{ icon: string; verb: string; name: string; when: string; output: string; tone: Tone }>;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-capability-cards",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const n = input.cards.length;
      const gap = 0.22;
      const w = (CW - gap * (n - 1)) / n;
      const y = 1.42;
      const h = input.note ? 2.95 : 3.4;
      for (const [index, item] of input.cards.entries()) {
        const x = LM + index * (w + gap);
        const color = tone(item.tone);
        card(ctx, { x, y, w, h, accent: color });
        await icon(ctx, item.icon, x + 0.22, y + 0.2, 0.46, color);
        slide.addText(item.verb, {
          x: x + 0.8, y: y + 0.22, w: w - 0.9, h: 0.42, fontFace: FONT, fontSize: 18, bold: true, color: C.ink, valign: "middle", margin: 0
        });
        slide.addText(item.name, {
          x: x + 0.22, y: y + 0.8, w: w - 0.3, h: 0.5, fontFace: FONT, fontSize: 13, bold: true, color: C.ink, valign: "top", margin: 0
        });
        slide.addText([
          { text: "使う場面", options: { fontSize: 9.5, bold: true, color, breakLine: true } },
          { text: item.when, options: { fontSize: 12, color: C.muted } }
        ], { x: x + 0.22, y: y + 1.42, w: w - 0.3, h: 0.75, fontFace: FONT, valign: "top", margin: 0 });
        slide.addShape(pptx.ShapeType.roundRect, {
          x: x + 0.18, y: y + h - 0.78, w: w - 0.36, h: 0.62, fill: { color: C.surface }, line: { color: C.surface, width: 0 }, rectRadius: 0.06
        });
        slide.addText([
          { text: "主な成果物", options: { fontSize: 9.5, bold: true, color, breakLine: true } },
          { text: item.output, options: { fontSize: 11.5, color: C.ink } }
        ], { x: x + 0.28, y: y + h - 0.76, w: w - 0.5, h: 0.58, fontFace: FONT, valign: "middle", margin: 0 });
      }
      if (input.note) pill(ctx, input.note, 4.55, 7.2);
      footer(ctx, input.pageNum);
    }
  });
}

// ── 利用前後：対応する項目の前後比較 ─────────────────────────────

export function beforeAfterSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  before: { label: string; title: string }; after: { label: string; title: string };
  pairs: Array<[string, string]>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-before-after",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const colW = 3.75;
      const afterX = RIGHT - colW;
      const top = 1.4;
      slide.addText([
        { text: `${input.before.label}  `, options: { fontSize: 9.5, bold: true, color: C.accent2 } },
        { text: input.before.title, options: { fontSize: 15, bold: true, color: C.ink } }
      ], { x: LM, y: top, w: colW, h: 0.34, fontFace: FONT, valign: "middle", margin: 0 });
      slide.addText([
        { text: `${input.after.label}  `, options: { fontSize: 9.5, bold: true, color: C.accent3 } },
        { text: input.after.title, options: { fontSize: 15, bold: true, color: C.ink } }
      ], { x: afterX, y: top, w: colW, h: 0.34, fontFace: FONT, valign: "middle", margin: 0 });
      const rowH = 0.46;
      const gap = 0.08;
      for (const [index, [before, after]] of input.pairs.entries()) {
        const y = top + 0.48 + index * (rowH + gap);
        slide.addShape(pptx.ShapeType.roundRect, {
          x: LM, y, w: colW, h: rowH, fill: { color: C.surface }, line: { color: C.grey30, width: 0.75 }, rectRadius: 0.05
        });
        await icon(ctx, "circle-x", LM + 0.14, y + rowH / 2 - 0.12, 0.24, C.faint);
        slide.addText(before, {
          x: LM + 0.48, y, w: colW - 0.58, h: rowH, fontFace: FONT, fontSize: 12, color: C.muted, valign: "middle", margin: 0
        });
        arrow(ctx, { x: LM + colW + 0.1, y: y + rowH / 2 }, { x: afterX - 0.1, y: y + rowH / 2 }, C.accent3);
        slide.addShape(pptx.ShapeType.roundRect, {
          x: afterX, y, w: colW, h: rowH, fill: { color: C.white }, line: { color: C.accent3, width: 1 }, rectRadius: 0.05
        });
        await icon(ctx, "circle-check", afterX + 0.14, y + rowH / 2 - 0.12, 0.24, C.accent3);
        slide.addText(after, {
          x: afterX + 0.48, y, w: colW - 0.58, h: rowH, fontFace: FONT, fontSize: 12, color: C.ink, valign: "middle", margin: 0
        });
      }
      pill(ctx, input.note, 4.62);
      footer(ctx, input.pageNum);
    }
  });
}

// ── 手順：アイコン付きの横フロー ────────────────────────────────

export function iconStepsSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  steps: Array<{ icon: string; heading: string; body: string; code?: string }>;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-icon-steps",
    requiredFonts: [FONT, MONO],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const n = input.steps.length;
      const gap = 0.3;
      const w = (CW - gap * (n - 1)) / n;
      const y = 1.45;
      const h = input.note ? 2.85 : 3.3;
      for (const [index, step] of input.steps.entries()) {
        const x = LM + index * (w + gap);
        card(ctx, { x, y, w, h, accent: index === n - 1 ? C.accent3 : C.accent });
        badge(ctx, String(index + 1), x + 0.22, y + 0.2, 0.38, index === n - 1 ? C.accent3 : C.accent, C.ink);
        await icon(ctx, step.icon, x + w - 0.6, y + 0.18, 0.42, C.ink);
        slide.addText(step.heading, {
          x: x + 0.22, y: y + 0.74, w: w - 0.3, h: 0.36, fontFace: FONT, fontSize: 14, bold: true, color: C.ink, valign: "middle", margin: 0
        });
        slide.addText(step.body, {
          x: x + 0.22, y: y + 1.18, w: w - 0.3, h: step.code ? 0.85 : h - 1.3, fontFace: FONT, fontSize: 12, color: C.muted, valign: "top", margin: 0
        });
        if (step.code) {
          slide.addShape(pptx.ShapeType.roundRect, {
            x: x + 0.18, y: y + h - 0.82, w: w - 0.36, h: 0.64, fill: { color: C.ink }, line: { color: C.ink, width: 0 }, rectRadius: 0.05
          });
          slide.addText(step.code, {
            x: x + 0.28, y: y + h - 0.8, w: w - 0.52, h: 0.6, fontFace: MONO, fontSize: 10, color: C.white, valign: "middle", margin: 0
          });
        }
        if (index < n - 1) arrow(ctx, { x: x + w + 0.04, y: y + h / 2 }, { x: x + w + gap - 0.04, y: y + h / 2 }, C.accent);
      }
      if (input.note) pill(ctx, input.note, 4.55, 7.2);
      footer(ctx, input.pageNum);
    }
  });
}

// ── 左から右への段階図（各段に複数ボックス） ────────────────────────

export type StageBox = { label?: string; title: string; body?: string; tone?: Tone; mono?: boolean; dark?: boolean; dashed?: boolean };

export function stageMapSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  stages: Array<{ caption?: string; weight?: number; boxes: StageBox[]; arrowLabel?: string }>;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-stage-map",
    requiredFonts: [FONT, MONO],
    draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const gap = 0.55;
      const total = input.stages.reduce((sum, stage) => sum + (stage.weight ?? 1), 0);
      const unit = (CW - gap * (input.stages.length - 1)) / total;
      const hasCaption = input.stages.some((stage) => stage.caption);
      const top = hasCaption ? 1.72 : 1.45;
      const bottom = input.note ? 4.42 : 4.9;
      let x = LM;
      for (const [index, stage] of input.stages.entries()) {
        const w = unit * (stage.weight ?? 1);
        if (stage.caption) {
          slide.addText(stage.caption, {
            x, y: top - 0.32, w, h: 0.24, fontFace: FONT, fontSize: 10, bold: true, color: C.muted, charSpacing: 0.5, margin: 0
          });
        }
        const n = stage.boxes.length;
        const boxGap = 0.16;
        const boxH = (bottom - top - boxGap * (n - 1)) / n;
        for (const [boxIndex, box] of stage.boxes.entries()) {
          const y = top + boxIndex * (boxH + boxGap);
          if (box.dark) {
            slide.addShape(pptx.ShapeType.roundRect, {
              x, y, w, h: boxH, fill: { color: C.ink }, line: { color: C.ink, width: 0 }, rectRadius: 0.06
            });
            slide.addText([
              ...(box.label ? [{ text: box.label, options: { fontSize: 9.5, bold: true, color: "93C5FD", breakLine: true } }] : []),
              { text: box.title, options: { fontSize: 15, bold: true, color: C.white, breakLine: Boolean(box.body) } },
              ...(box.body ? [{ text: box.body, options: { fontSize: 11.5, color: C.grey30, fontFace: box.mono ? MONO : FONT } }] : [])
            ], { x: x + 0.2, y: y + 0.08, w: w - 0.32, h: boxH - 0.16, fontFace: FONT, valign: "middle", margin: 0 });
          } else if (box.dashed) {
            slide.addShape(pptx.ShapeType.roundRect, {
              x, y, w, h: boxH, fill: { color: C.white }, line: { color: C.faint, width: 1, dashType: "dash" }, rectRadius: 0.06
            });
            slide.addText([
              ...(box.label ? [{ text: box.label, options: { fontSize: 9.5, bold: true, color: C.muted, breakLine: true } }] : []),
              { text: box.title, options: { fontSize: 13, bold: true, color: C.muted, breakLine: Boolean(box.body) } },
              ...(box.body ? [{ text: box.body, options: { fontSize: 11.5, color: C.muted } }] : [])
            ], { x: x + 0.2, y: y + 0.08, w: w - 0.32, h: boxH - 0.16, fontFace: FONT, valign: "middle", margin: 0 });
          } else {
            card(ctx, {
              x, y, w, h: boxH, label: box.label, title: box.title, body: box.body, accent: tone(box.tone),
              titleSize: n > 2 ? 13 : 15, bodySize: 11.5, mono: box.mono
            });
          }
        }
        if (index < input.stages.length - 1) {
          const midY = (top + bottom) / 2;
          arrow(ctx, { x: x + w + 0.06, y: midY }, { x: x + w + gap - 0.06, y: midY }, C.accent);
          if (stage.arrowLabel) {
            slide.addText(stage.arrowLabel, {
              x: x + w - 0.1, y: midY - 0.36, w: gap + 0.2, h: 0.26, fontFace: FONT, fontSize: 9, color: C.muted, align: "center", margin: 0
            });
          }
        }
        x += w + gap;
      }
      if (input.note) pill(ctx, input.note, 4.6, 7.4);
      footer(ctx, input.pageNum);
    }
  });
}

// ── Commandのパイプライン ────────────────────────────────────

export function commandPipelineSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  prerequisite: { title: string; body: string };
  commands: Array<{ command: string; caption: string }>;
  result: { title: string; body: string };
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-command-pipeline",
    requiredFonts: [FONT, MONO],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      card(ctx, { x: LM, y: 1.42, w: CW, h: 1.05, label: "必要Tool", title: input.prerequisite.title, body: input.prerequisite.body, accent: C.accent2, titleSize: 14 });
      await icon(ctx, "wrench", RIGHT - 0.6, 1.66, 0.4, C.accent2);
      const n = input.commands.length;
      const resultW = 1.95;
      const gap = 0.32;
      const w = (CW - resultW - gap * n) / n;
      const y = 3.0;
      const h = 1.45;
      slide.addText("cd presentation/harness で実行する順番", {
        x: LM, y: y - 0.3, w: CW, h: 0.24, fontFace: FONT, fontSize: 10, bold: true, color: C.muted, margin: 0
      });
      for (const [index, item] of input.commands.entries()) {
        const x = LM + index * (w + gap);
        slide.addShape(pptx.ShapeType.roundRect, {
          x, y, w, h: 0.62, fill: { color: C.ink }, line: { color: C.ink, width: 0 }, rectRadius: 0.06
        });
        slide.addText(item.command, {
          x: x + 0.1, y, w: w - 0.2, h: 0.62, fontFace: MONO, fontSize: 11.5, bold: true, color: C.white, align: "center", valign: "middle", margin: 0
        });
        slide.addText(item.caption, {
          x, y: y + 0.72, w, h: 0.8, fontFace: FONT, fontSize: 11.5, color: C.muted, align: "center", valign: "top", margin: 0
        });
        arrow(ctx, { x: x + w + 0.04, y: y + 0.31 }, { x: x + w + gap - 0.04, y: y + 0.31 }, C.accent);
      }
      const rx = LM + n * (w + gap);
      card(ctx, { x: rx, y, w: resultW, h, label: "成功状態", title: input.result.title, body: input.result.body, accent: C.accent3, titleSize: 13, bodySize: 11.5 });
      if (input.note) pill(ctx, input.note, 4.55, 7.4);
      footer(ctx, input.pageNum);
    }
  });
}

// ── 段階的に追加する階段図 ────────────────────────────────────

export function staircaseSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  steps: Array<{ icon: string; heading: string; body: string }>;
  caution: { title: string; body: string };
}): CustomSlide {
  return new CustomSlide({
    name: "guide-staircase",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide } = ctx;
      header(ctx, input.eyebrow, input.title);
      const n = input.steps.length;
      const stairW = 2.05;
      const gap = 0.12;
      const bottom = 4.9;
      const stepH = 0.62;
      for (const [index, step] of input.steps.entries()) {
        const x = LM + index * (stairW + gap);
        const h = 1.75 + index * stepH;
        const y = bottom - h;
        card(ctx, { x, y, w: stairW, h, accent: C.accent, fill: index === n - 1 ? C.accentSoft : C.white });
        badge(ctx, String(index + 1), x + 0.2, y + 0.18, 0.36, C.ink);
        await icon(ctx, step.icon, x + stairW - 0.55, y + 0.18, 0.36, C.accent);
        slide.addText(step.heading, {
          x: x + 0.2, y: y + 0.66, w: stairW - 0.3, h: 0.36, fontFace: FONT, fontSize: 14, bold: true, color: C.ink, valign: "middle", margin: 0
        });
        slide.addText(step.body, {
          x: x + 0.2, y: y + 1.06, w: stairW - 0.3, h: h - 1.14, fontFace: FONT, fontSize: 11.5, color: C.muted, valign: "top", margin: 0
        });
      }
      const cx = LM + n * (stairW + gap) + 0.1;
      const cw = RIGHT - cx;
      card(ctx, { x: cx, y: 1.45, w: cw, h: 1.75, label: "注意", title: input.caution.title, body: input.caution.body, accent: C.accent2, titleSize: 14, bodySize: 11.5 });
      await icon(ctx, "triangle-alert", cx + cw - 0.52, 1.55, 0.34, C.accent2);
      footer(ctx, input.pageNum);
    }
  });
}

// ── 成果物で分岐する図 ──────────────────────────────────────

export function forkSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  question: string;
  branches: Array<{ when: string; label: string; title: string; icon: string; rows: Array<[string, string]>; tone: Tone }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-fork",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const qW = 3.6;
      const qX = LM + (CW - qW) / 2;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: qX, y: 1.36, w: qW, h: 0.42, fill: { color: C.ink }, line: { color: C.ink, width: 0 }, rectRadius: 0.08
      });
      slide.addText(input.question, {
        x: qX, y: 1.36, w: qW, h: 0.42, fontFace: FONT, fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle", margin: 0
      });
      const gap = 0.45;
      const w = (CW - gap) / 2;
      const cardY = 2.2;
      const cardH = 2.25;
      for (const [index, branch] of input.branches.entries()) {
        const x = LM + index * (w + gap);
        const color = tone(branch.tone);
        const cx = x + w / 2;
        ctx.helpers.addConnector(slide, {
          points: [{ x: LM + CW / 2, y: 1.78 }, { x: LM + CW / 2, y: 1.92 }, { x: cx, y: 1.92 }],
          color: C.faint, width: 1.5, endArrowType: "none"
        });
        arrow(ctx, { x: cx, y: 1.92 }, { x: cx, y: cardY - 0.02 }, color);
        slide.addText(branch.when, {
          x: index === 0 ? cx - 2.05 : cx + 0.08, y: 1.88, w: 1.95, h: 0.3, fontFace: FONT, fontSize: 10.5, bold: true, color, align: index === 0 ? "right" : "left", valign: "middle", margin: 0
        });
        card(ctx, { x, y: cardY, w, h: cardH, label: branch.label, title: branch.title, accent: color, titleSize: 18 });
        await icon(ctx, branch.icon, x + w - 0.6, cardY + 0.16, 0.4, color);
        for (const [rowIndex, [key, value]] of branch.rows.entries()) {
          const ry = cardY + 0.82 + rowIndex * 0.28;
          slide.addText(key, {
            x: x + 0.2, y: ry, w: 0.85, h: 0.26, fontFace: FONT, fontSize: 10, bold: true, color, valign: "middle", margin: 0
          });
          slide.addText(value, {
            x: x + 1.05, y: ry, w: w - 1.15, h: 0.26, fontFace: FONT, fontSize: 11.5, color: C.ink, valign: "middle", margin: 0
          });
        }
      }
      pill(ctx, input.note, 4.6, 7.4);
      footer(ctx, input.pageNum);
    }
  });
}

// ── 依頼文の分解図 ────────────────────────────────────────

export function requestAnatomySlide(input: {
  pageNum: number; eyebrow: string; title: string;
  parts: Array<{ name: string; question: string; example: string; tone: Tone }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-request-anatomy",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const docX = LM;
      const docW = 4.3;
      const top = 1.42;
      const rowH = 0.6;
      const gap = 0.08;
      const docH = input.parts.length * (rowH + gap) + 0.32;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: docX, y: top, w: docW, h: docH, fill: { color: C.white }, line: { color: C.grey30, width: 1 }, rectRadius: 0.06
      });
      await icon(ctx, "message-square-text", docX + 0.16, top + 0.06, 0.22, C.muted);
      slide.addText("依頼文の例", {
        x: docX + 0.45, y: top + 0.04, w: 2.5, h: 0.24, fontFace: FONT, fontSize: 10, bold: true, color: C.muted, margin: 0
      });
      const expX = docX + docW + 0.5;
      const expW = RIGHT - expX;
      for (const [index, part] of input.parts.entries()) {
        const color = tone(part.tone);
        const y = top + 0.32 + index * (rowH + gap);
        slide.addShape(pptx.ShapeType.rect, {
          x: docX + 0.14, y, w: docW - 0.28, h: rowH, fill: { color: C.surface }, line: { color: C.surface, width: 0 }
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: docX + 0.14, y, w: 0.06, h: rowH, fill: { color }, line: { color, width: 0 }
        });
        slide.addText(part.example, {
          x: docX + 0.32, y, w: docW - 0.55, h: rowH, fontFace: FONT, fontSize: 12, color: C.ink, valign: "middle", margin: 0
        });
        arrow(ctx, { x: docX + docW + 0.06, y: y + rowH / 2 }, { x: expX - 0.06, y: y + rowH / 2 }, color, true);
        badge(ctx, String(index + 1), expX, y + rowH / 2 - 0.17, 0.34, color, C.white);
        slide.addText([
          { text: part.name, options: { fontSize: 14, bold: true, color: C.ink, breakLine: true } },
          { text: part.question, options: { fontSize: 11.5, color: C.muted } }
        ], { x: expX + 0.45, y, w: expW - 0.45, h: rowH, fontFace: FONT, valign: "middle", margin: 0 });
      }
      pill(ctx, input.note, 4.62, 7.0);
      footer(ctx, input.pageNum);
    }
  });
}

// ── 依頼文 → AIが進める工程（縦フロー） ───────────────────────────

export function requestFlowSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  request: { label: string; title: string; body: string };
  flow: { label: string; title: string; steps: string[]; mono?: boolean; stopAfter?: number; stopLabel?: string; stoppedSteps?: string[] };
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-request-flow",
    requiredFonts: [FONT, MONO],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const top = 1.4;
      const reqW = 3.85;
      card(ctx, { x: LM, y: top, w: reqW, h: 3.0, label: input.request.label, title: input.request.title, body: input.request.body, accent: C.accent2, titleSize: 18, bodySize: 12, bodyColor: C.ink });
      await icon(ctx, "message-square-text", LM + reqW - 0.55, top + 0.14, 0.36, C.accent2);
      const flowX = LM + reqW + 0.55;
      const flowW = RIGHT - flowX;
      arrow(ctx, { x: LM + reqW + 0.06, y: top + 1.5 }, { x: flowX - 0.06, y: top + 1.5 }, C.accent3);
      slide.addText([
        { text: `${input.flow.label}  `, options: { fontSize: 9.5, bold: true, color: C.accent3 } },
        { text: input.flow.title, options: { fontSize: 14, bold: true, color: C.ink } }
      ], { x: flowX, y: top - 0.04, w: flowW, h: 0.3, fontFace: FONT, valign: "middle", margin: 0 });
      const all = [...input.flow.steps, ...(input.flow.stoppedSteps ?? [])];
      const stopGap = input.flow.stoppedSteps ? 0.3 : 0;
      const stepGap = 0.14;
      const avail = 3.0 - 0.36 - stopGap;
      const stepH = Math.min(0.48, (avail - stepGap * (all.length - 1)) / all.length);
      let y = top + 0.36;
      for (const [index, step] of all.entries()) {
        const stopped = index >= input.flow.steps.length;
        if (stopped && index === input.flow.steps.length) {
          slide.addShape("line", {
            x: flowX - 0.1, y: y - stepGap / 2 + 0.05, w: flowW + 0.1, h: 0, line: { color: C.accent2, width: 1.75, dashType: "dash" }
          });
          slide.addShape(pptx.ShapeType.roundRect, {
            x: RIGHT - 2.45, y: y - stepGap / 2 - 0.08, w: 2.45, h: 0.26, fill: { color: C.white }, line: { color: C.accent2, width: 1 }, rectRadius: 0.05
          });
          slide.addText(input.flow.stopLabel ?? "", {
            x: RIGHT - 2.45, y: y - stepGap / 2 - 0.08, w: 2.45, h: 0.26, fontFace: FONT, fontSize: 9.5, bold: true, color: C.accent2, align: "center", valign: "middle", margin: 0
          });
          y += stopGap;
        }
        slide.addShape(pptx.ShapeType.roundRect, {
          x: flowX, y, w: flowW, h: stepH,
          fill: { color: stopped ? C.white : C.surface },
          line: { color: stopped ? C.faint : C.grey30, width: 1, dashType: stopped ? "dash" : "solid" },
          rectRadius: 0.05
        });
        badge(ctx, String(index + 1), flowX + 0.12, y + stepH / 2 - 0.14, 0.28, stopped ? C.faint : C.accent3, stopped ? C.white : C.ink);
        slide.addText(step, {
          x: flowX + 0.52, y, w: flowW - 0.62, h: stepH,
          fontFace: input.flow.mono && !stopped ? MONO : FONT, fontSize: 12, color: stopped ? C.muted : C.ink, valign: "middle", margin: 0
        });
        const next = index + 1;
        if (next < all.length && !(input.flow.stoppedSteps && next === input.flow.steps.length)) {
          arrow(ctx, { x: flowX + 0.26, y: y + stepH + 0.01 }, { x: flowX + 0.26, y: y + stepH + stepGap - 0.01 }, C.faint);
        }
        y += stepH + stepGap;
      }
      pill(ctx, input.note, 4.6, 7.4);
      footer(ctx, input.pageNum);
    }
  });
}

// ── 権限スペクトラム ─────────────────────────────────────────

export function authoritySpectrumSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  axis: { left: string; right: string };
  zones: Array<{ label: string; title: string; body: string; icon: string; tone: Tone }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-authority-spectrum",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const n = input.zones.length;
      const gap = 0.16;
      const w = (CW - gap * (n - 1)) / n;
      const barY = 1.48;
      slide.addText(input.axis.left, {
        x: LM, y: barY - 0.06, w: 2.2, h: 0.28, fontFace: FONT, fontSize: 10.5, bold: true, color: C.accent3, margin: 0
      });
      slide.addText(input.axis.right, {
        x: RIGHT - 2.2, y: barY - 0.06, w: 2.2, h: 0.28, fontFace: FONT, fontSize: 10.5, bold: true, color: C.accent2, align: "right", margin: 0
      });
      ctx.helpers.addArrow(slide, {
        from: { x: LM + 2.25, y: barY + 0.08 }, to: { x: RIGHT - 2.25, y: barY + 0.08 }, color: C.faint, width: 1.5
      });
      const shades = [C.accent3, C.accent, C.accent2, C.ink];
      for (const [index, zone] of input.zones.entries()) {
        const x = LM + index * (w + gap);
        const color = shades[index] ?? tone(zone.tone);
        slide.addShape(pptx.ShapeType.rect, {
          x, y: barY + 0.36, w, h: 0.12, fill: { color }, line: { color, width: 0 }
        });
        card(ctx, { x, y: barY + 0.62, w, h: 2.2, label: zone.label, title: zone.title, body: zone.body, accent: color, titleSize: 17 });
        await icon(ctx, zone.icon, x + w - 0.52, barY + 0.72, 0.34, color);
      }
      pill(ctx, input.note, 4.62, 7.0);
      footer(ctx, input.pageNum);
    }
  });
}

// ── 構成比バーと説明 ─────────────────────────────────────────

export function compositionSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  total: string;
  parts: Array<{ count: number; label: string; title: string; body: string; tone: Tone; icon: string }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-composition",
    requiredFonts: [FONT],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const sum = input.parts.reduce((acc, part) => acc + part.count, 0);
      const barY = 1.62;
      slide.addText(input.total, {
        x: LM, y: barY - 0.3, w: CW, h: 0.24, fontFace: FONT, fontSize: 10.5, bold: true, color: C.muted, margin: 0
      });
      let x = LM;
      for (const part of input.parts) {
        const w = CW * (part.count / sum);
        const color = tone(part.tone);
        slide.addShape(pptx.ShapeType.rect, { x, y: barY, w, h: 0.5, fill: { color }, line: { color: C.white, width: 1.5 } });
        slide.addText(`${part.count}件`, {
          x, y: barY, w, h: 0.5, fontFace: FONT, fontSize: 15, bold: true, color: C.white, align: "center", valign: "middle", margin: 0
        });
        x += w;
      }
      const gap = 0.3;
      const w = (CW - gap) / input.parts.length;
      for (const [index, part] of input.parts.entries()) {
        const cx = LM + index * (w + gap);
        const color = tone(part.tone);
        card(ctx, { x: cx, y: 2.36, w, h: 2.08, label: part.label, title: part.title, body: part.body, accent: color, titleSize: 17 });
        await icon(ctx, part.icon, cx + w - 0.56, 2.46, 0.38, color);
      }
      pill(ctx, input.note, 4.62, 7.6);
      footer(ctx, input.pageNum);
    }
  });
}

// ── ノードと矢印の関係図 ─────────────────────────────────────

export type MapNode = { id: string; x: number; y: number; w: number; h: number; label?: string; title: string; body?: string; tone?: Tone; dark?: boolean; mono?: boolean; dashed?: boolean };
export type MapEdge = { from: string; to: string; fromSide?: "r" | "l" | "t" | "b"; toSide?: "r" | "l" | "t" | "b"; dashed?: boolean; label?: string };

export function nodeMapSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  nodes: MapNode[];
  edges: MapEdge[];
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-node-map",
    requiredFonts: [FONT, MONO],
    draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const nodes = new Map(input.nodes.map((node) => [node.id, node]));
      const point = (node: MapNode, side: "r" | "l" | "t" | "b") => side === "r"
        ? { x: node.x + node.w + 0.05, y: node.y + node.h / 2 }
        : side === "l"
          ? { x: node.x - 0.05, y: node.y + node.h / 2 }
          : side === "t"
            ? { x: node.x + node.w / 2, y: node.y - 0.05 }
            : { x: node.x + node.w / 2, y: node.y + node.h + 0.05 };
      for (const edge of input.edges) {
        const from = nodes.get(edge.from);
        const to = nodes.get(edge.to);
        if (!from || !to) throw new Error(`unknown node in edge ${edge.from} -> ${edge.to}`);
        const fromSide = edge.fromSide ?? "r";
        const toSide = edge.toSide ?? "l";
        const a = point(from, fromSide);
        let b = point(to, toSide);
        const horizontal = fromSide === "r" || fromSide === "l";
        // 相手の辺の範囲内なら、折れ線にせず真っすぐ入る。
        if (horizontal && (toSide === "r" || toSide === "l") && a.y > to.y + 0.1 && a.y < to.y + to.h - 0.1) b = { x: b.x, y: a.y };
        if (!horizontal && (toSide === "t" || toSide === "b") && a.x > to.x + 0.1 && a.x < to.x + to.w - 0.1) b = { x: a.x, y: b.y };
        elbow(ctx, a, b, horizontal, edge.dashed ? C.faint : C.accent, edge.dashed);
        if (edge.label) {
          slide.addText(edge.label, {
            x: (a.x + b.x) / 2 - 0.8, y: (a.y + b.y) / 2 - 0.27, w: 1.6, h: 0.22, fontFace: FONT, fontSize: 9, color: C.muted, align: "center", margin: 0
          });
        }
      }
      for (const node of input.nodes) {
        if (node.dark) {
          slide.addShape(pptx.ShapeType.roundRect, {
            x: node.x, y: node.y, w: node.w, h: node.h, fill: { color: C.ink }, line: { color: C.ink, width: 0 }, rectRadius: 0.06
          });
          slide.addText([
            ...(node.label ? [{ text: node.label, options: { fontSize: 9.5, bold: true, color: "93C5FD", breakLine: true } }] : []),
            { text: node.title, options: { fontSize: 13, bold: true, color: C.white, fontFace: node.mono ? MONO : FONT, breakLine: Boolean(node.body) } },
            ...(node.body ? [{ text: node.body, options: { fontSize: 11, color: C.grey30 } }] : [])
          ], { x: node.x + 0.18, y: node.y + 0.06, w: node.w - 0.3, h: node.h - 0.12, fontFace: FONT, valign: "middle", margin: 0 });
        } else if (node.dashed) {
          slide.addShape(pptx.ShapeType.roundRect, {
            x: node.x, y: node.y, w: node.w, h: node.h, fill: { color: C.white }, line: { color: C.faint, width: 1, dashType: "dash" }, rectRadius: 0.06
          });
          slide.addText([
            ...(node.label ? [{ text: node.label, options: { fontSize: 9.5, bold: true, color: C.muted, breakLine: true } }] : []),
            { text: node.title, options: { fontSize: 12, bold: true, color: C.ink, fontFace: node.mono ? MONO : FONT, breakLine: Boolean(node.body) } },
            ...(node.body ? [{ text: node.body, options: { fontSize: 11, color: C.muted } }] : [])
          ], { x: node.x + 0.18, y: node.y + 0.06, w: node.w - 0.3, h: node.h - 0.12, fontFace: FONT, valign: "middle", margin: 0 });
        } else {
          card(ctx, { x: node.x, y: node.y, w: node.w, h: node.h, label: node.label, title: node.title, body: node.body, accent: tone(node.tone), titleSize: 12.5, bodySize: 11, mono: false });
        }
      }
      if (input.note) pill(ctx, input.note, 4.62, 7.4);
      footer(ctx, input.pageNum);
    }
  });
}

// ── Skill分類マップ ───────────────────────────────────────

export function skillFamilyMapSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  groups: Array<{ area: string; tone: Tone; families: Array<{ name: string; count: number; examples: string; pages: string }> }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-skill-family-map",
    requiredFonts: [FONT, MONO],
    draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const all = input.groups.flatMap((group) => group.families.map((family) => ({ ...family, group })));
      const cols = 4;
      const gapX = 0.16;
      const gapY = 0.14;
      const w = (CW - gapX * (cols - 1)) / cols;
      const top = 1.4;
      const rows = Math.ceil(all.length / cols);
      const h = (4.48 - top - gapY * (rows - 1)) / rows;
      for (const [index, family] of all.entries()) {
        const x = LM + (index % cols) * (w + gapX);
        const y = top + Math.floor(index / cols) * (h + gapY);
        const color = tone(family.group.tone);
        card(ctx, { x, y, w, h, label: family.group.area, accent: color });
        slide.addText(family.name, {
          x: x + 0.2, y: y + 0.4, w: w - 0.8, h: 0.34, fontFace: FONT, fontSize: 13.5, bold: true, color: C.ink, valign: "middle", margin: 0
        });
        slide.addText(`${family.count}`, {
          x: x + w - 0.62, y: y + 0.34, w: 0.5, h: 0.44, fontFace: FONT, fontSize: 22, bold: true, color, align: "right", valign: "middle", margin: 0
        });
        slide.addText(family.examples, {
          x: x + 0.2, y: y + 0.82, w: w - 0.3, h: 0.36, fontFace: MONO, fontSize: 9.5, color: C.muted, valign: "top", margin: 0
        });
        slide.addShape(pptx.ShapeType.roundRect, {
          x: x + 0.2, y: y + h - 0.29, w: w - 0.35, h: 0.21, fill: { color: C.surface }, line: { color: C.surface, width: 0 }, rectRadius: 0.04
        });
        slide.addText(family.pages, {
          x: x + 0.2, y: y + h - 0.29, w: w - 0.35, h: 0.21, fontFace: FONT, fontSize: 9, bold: true, color: C.ink, align: "center", valign: "middle", margin: 0
        });
      }
      pill(ctx, input.note, 4.62, 7.4);
      footer(ctx, input.pageNum);
    }
  });
}

// ── フォルダ構成図（2026-10-02 追加） ─────────────────────────────

export type TreeNode = { name: string; depth: number; folder?: boolean; note?: string; tone?: Tone };

// 箱と線で描くフォルダツリー。tone を持つ行は色付きの背景で強調する。
async function folderTree(ctx: Ctx, nodes: TreeNode[], box: { x: number; y: number; w: number; rowH: number; noteX?: number }) {
  const { slide, pptx } = ctx;
  const indent = 0.26;
  const iconSize = 0.2;
  nodes.forEach((node, index) => {
    if (node.depth === 0) return;
    let parent = index - 1;
    while (parent >= 0 && nodes[parent].depth >= node.depth) parent -= 1;
    const lineX = box.x + (node.depth - 1) * indent + iconSize / 2;
    const y1 = box.y + parent * box.rowH + box.rowH / 2 + iconSize / 2;
    const y2 = box.y + index * box.rowH + box.rowH / 2;
    slide.addShape(pptx.ShapeType.line, { x: lineX, y: y1, w: 0, h: y2 - y1, line: { color: C.grey30, width: 1 } });
    slide.addShape(pptx.ShapeType.line, { x: lineX, y: y2, w: indent - iconSize / 2 - 0.03, h: 0, line: { color: C.grey30, width: 1 } });
  });
  for (const [index, node] of nodes.entries()) {
    const y = box.y + index * box.rowH;
    const x = box.x + node.depth * indent;
    const color = node.tone ? tone(node.tone) : C.muted;
    if (node.tone) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x - 0.05, y: y + 0.02, w: box.x + box.w - x + 0.05, h: box.rowH - 0.04,
        fill: { color: C.accentSoft }, line: { color, width: 0.75 }, rectRadius: 0.04
      });
    }
    await icon(ctx, node.folder ? "folder" : "file-text", x, y + box.rowH / 2 - iconSize / 2, iconSize, node.folder ? (node.tone ? color : C.accent) : color);
    const nameW = (box.noteX ?? box.x + box.w) - x - iconSize - 0.08;
    slide.addText(node.name, {
      x: x + iconSize + 0.07, y, w: node.note && box.noteX ? nameW : box.x + box.w - x - iconSize - 0.1, h: box.rowH,
      fontFace: MONO, fontSize: 11, bold: Boolean(node.folder), color: C.ink, valign: "middle", margin: 0
    });
    if (node.note && box.noteX) {
      slide.addText(node.note, {
        x: box.noteX, y, w: box.x + box.w - box.noteX - 0.06, h: box.rowH,
        fontFace: FONT, fontSize: 10.5, color: node.tone ? C.ink : C.muted, valign: "middle", margin: 0
      });
    }
  }
  return box.y + nodes.length * box.rowH;
}

type SideCard = { label: string; title: string; body: string; tone?: Tone };

function sideCards(ctx: Ctx, cards: SideCard[], box: { x: number; y: number; w: number; bottom: number }) {
  const gap = 0.14;
  const h = (box.bottom - box.y - gap * (cards.length - 1)) / cards.length;
  cards.forEach((item, index) => {
    card(ctx, {
      x: box.x, y: box.y + index * (h + gap), w: box.w, h,
      label: item.label, title: item.title, body: item.body, accent: tone(item.tone), titleSize: 13.5, bodySize: 10.5
    });
  });
}

// ツリー（左）＋役割カード（右）。
export function folderTreeSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  caption?: string;
  nodes: TreeNode[];
  noteColumn?: number;
  cards: SideCard[];
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "guide-folder-tree",
    requiredFonts: [FONT, MONO],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const treeW = 4.85;
      const top = 1.42;
      const bottom = input.note ? 4.45 : 4.92;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: LM, y: top, w: treeW, h: bottom - top, fill: { color: C.white }, line: { color: C.grey30, width: 1 }, rectRadius: 0.06
      });
      if (input.caption) {
        slide.addText(input.caption, {
          x: LM + 0.2, y: top + 0.08, w: treeW - 0.4, h: 0.24, fontFace: FONT, fontSize: 9.5, bold: true, color: C.muted, margin: 0
        });
      }
      const treeTop = top + (input.caption ? 0.36 : 0.14);
      const rowH = Math.min(0.3, (bottom - treeTop - 0.1) / input.nodes.length);
      await folderTree(ctx, input.nodes, {
        x: LM + 0.2, y: treeTop, w: treeW - 0.35, rowH, noteX: LM + 0.2 + (input.noteColumn ?? 2.35)
      });
      sideCards(ctx, input.cards, { x: LM + treeW + 0.25, y: top, w: CW - treeW - 0.25, bottom });
      if (input.note) pill(ctx, input.note, 4.6, 7.4);
      footer(ctx, input.pageNum);
    }
  });
}

// コピー元のツリー → コマンド → コピー先のツリー ＋ 役割カード。
export function copyTreeSlide(input: {
  pageNum: number; eyebrow: string; title: string;
  source: { caption: string; nodes: TreeNode[] };
  command: string;
  target: { caption: string; nodes: TreeNode[] };
  cards: SideCard[];
}): CustomSlide {
  return new CustomSlide({
    name: "guide-copy-tree",
    requiredFonts: [FONT, MONO],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      header(ctx, input.eyebrow, input.title);
      const top = 1.42;
      const bottom = 4.92;
      const treeW = 2.0;
      const cmdW = 1.2;
      const gap = 0.12;
      const targetX = LM + treeW + gap * 2 + cmdW;
      const cardsX = targetX + treeW + 0.22;
      for (const [x, tree] of [[LM, input.source], [targetX, input.target]] as const) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x, y: top, w: treeW, h: bottom - top, fill: { color: C.white }, line: { color: C.grey30, width: 1 }, rectRadius: 0.06
        });
        slide.addText(tree.caption, {
          x: x + 0.15, y: top + 0.08, w: treeW - 0.25, h: 0.24, fontFace: FONT, fontSize: 9.5, bold: true, color: C.muted, margin: 0
        });
        await folderTree(ctx, tree.nodes, { x: x + 0.15, y: top + 0.38, w: treeW - 0.25, rowH: 0.3 });
      }
      const cmdX = LM + treeW + gap;
      const midY = (top + bottom) / 2;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: cmdX, y: midY - 0.55, w: cmdW, h: 1.1, fill: { color: C.ink }, line: { color: C.ink, width: 0 }, rectRadius: 0.06
      });
      slide.addText(input.command, {
        x: cmdX + 0.08, y: midY - 0.55, w: cmdW - 0.16, h: 1.1, fontFace: MONO, fontSize: 10, color: C.white, align: "center", valign: "middle", margin: 0
      });
      arrow(ctx, { x: cmdX + cmdW + 0.01, y: midY }, { x: targetX - 0.01, y: midY }, C.accent);
      sideCards(ctx, input.cards, { x: cardsX, y: top, w: LM + CW - cardsX, bottom });
      footer(ctx, input.pageNum);
    }
  });
}
