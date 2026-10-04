import { CustomSlide, C, FONTS, LAYOUT, type CustomSlideContext } from "../../src/index.js";

const { LM, CW, LS } = LAYOUT;

// build-presentation Skillの既定最小サイズ（ユーザーテンプレートなし）
const SIZE = {
  deckTitle: 50,
  title: 35,
  sub: 24,
  body: 16,
  code: 16
} as const;

const CONTENT_Y = 1.3;
const CONTENT_BOTTOM = 5.0;

type Ctx = CustomSlideContext;

function frame(ctx: Ctx, title: string) {
  const { slide, pptx } = ctx;
  slide.background = { color: C.white };
  slide.addText(title, {
    x: LM,
    y: 0.28,
    w: CW,
    h: 0.72,
    fontSize: SIZE.title,
    fontFace: FONTS.sans,
    color: C.ink,
    valign: "middle",
    margin: 0
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: LM,
    y: 1.06,
    w: 0.6,
    h: 0.05,
    fill: { color: C.accent },
    line: { color: C.accent, width: 0 }
  });
}

function footer(ctx: Ctx, pageNum: number, label?: string) {
  ctx.helpers.addFooter(ctx.slide, pageNum, { light: true });
  if (label) {
    ctx.slide.addText(label, {
      x: 5.5,
      y: 5.14,
      w: 4.0,
      h: 0.28,
      fontSize: 10,
      fontFace: FONTS.sans,
      color: C.muted,
      align: "right",
      margin: 0
    });
  }
}

function codePanel(ctx: Ctx, code: string, box: { x: number; y: number; w: number }, lineSpacing = 21) {
  const lines = code.split("\n");
  const lineH = lineSpacing / 72;
  const h = lines.length * lineH + 0.34;
  ctx.slide.addShape(ctx.pptx.ShapeType.roundRect, {
    x: box.x,
    y: box.y,
    w: box.w,
    h,
    fill: { color: C.ink },
    line: { color: C.ink, width: 0 },
    rectRadius: 0.06
  });
  ctx.slide.addText(
    lines.map((line, index) => ({
      text: line === "" ? " " : line,
      options: {
        color: line.trimStart().startsWith("#") ? "93C5FD" : C.white,
        breakLine: index < lines.length - 1
      }
    })),
    {
      x: box.x + 0.2,
      y: box.y + 0.15,
      w: box.w - 0.4,
      h: h - 0.3,
      fontSize: SIZE.code,
      fontFace: FONTS.mono,
      lineSpacing,
      valign: "top",
      margin: 0
    }
  );
  return h;
}

function bulletRuns(items: string[]) {
  return items.map((item, index) => ({
    text: item,
    options: { bullet: { indent: 18 }, breakLine: index < items.length - 1, paraSpaceAfter: 6 }
  }));
}

export function coverSlide(input: { overline: string; title: string; subtitle: string }): CustomSlide {
  return new CustomSlide({
    name: "cover",
    requiredFonts: [FONTS.sans],
    draw(ctx) {
      const { slide, pptx } = ctx;
      slide.background = { color: C.ink };
      slide.addShape(pptx.ShapeType.rect, {
        x: LM,
        y: 1.0,
        w: 0.8,
        h: 0.07,
        fill: { color: C.accent },
        line: { color: C.accent, width: 0 }
      });
      slide.addText(input.overline, {
        x: LM, y: 1.2, w: CW, h: 0.45,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: "93C5FD", margin: 0
      });
      slide.addText(input.title, {
        x: LM, y: 1.65, w: CW, h: 1.85,
        fontSize: SIZE.deckTitle, fontFace: FONTS.sans, color: C.white,
        valign: "top", lineSpacingMultiple: 1.05, margin: 0
      });
      slide.addText(input.subtitle, {
        x: LM, y: 4.05, w: CW, h: 0.9,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: C.grey30,
        valign: "top", lineSpacingMultiple: LS, margin: 0
      });
    }
  });
}

export function sectionSlide(input: { part: string; title: string; lead: string }): CustomSlide {
  return new CustomSlide({
    name: "section",
    requiredFonts: [FONTS.sans],
    draw(ctx) {
      const { slide, pptx } = ctx;
      slide.background = { color: C.ink };
      slide.addText(input.part, {
        x: LM, y: 1.45, w: CW, h: 0.45,
        fontSize: SIZE.sub, fontFace: FONTS.sans, color: "93C5FD", margin: 0
      });
      slide.addText(input.title, {
        x: LM, y: 1.95, w: CW, h: 1.0,
        fontSize: SIZE.deckTitle, fontFace: FONTS.sans, color: C.white, margin: 0
      });
      slide.addShape(pptx.ShapeType.rect, {
        x: LM, y: 3.1, w: 0.8, h: 0.07,
        fill: { color: C.accent }, line: { color: C.accent, width: 0 }
      });
      slide.addText(input.lead, {
        x: LM, y: 3.35, w: CW, h: 0.6,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: C.grey30, margin: 0
      });
    }
  });
}

export function flowSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  steps: Array<{ heading: string; body: string; icon?: string }>;
  loopLabel?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "flow",
    requiredFonts: [FONTS.sans],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const gap = 0.32;
      const w = (CW - gap * (input.steps.length - 1)) / input.steps.length;
      const y = input.loopLabel ? 1.4 : 1.55;
      const h = input.loopLabel ? 2.75 : 3.2;
      for (const [index, step] of input.steps.entries()) {
        const x = LM + index * (w + gap);
        slide.addShape(pptx.ShapeType.rect, {
          x, y, w, h,
          fill: { color: C.surface }, line: { color: C.grey30, width: 0.75 }
        });
        slide.addShape("ellipse", {
          x: x + 0.18, y: y + 0.22, w: 0.55, h: 0.55,
          fill: { color: C.ink }, line: { color: C.ink, width: 0 }
        });
        slide.addText(String(index + 1), {
          x: x + 0.18, y: y + 0.22, w: 0.55, h: 0.55,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.white,
          align: "center", valign: "middle", margin: 0
        });
        if (step.icon) {
          await ctx.helpers.addIcon(slide, step.icon, { x: x + w - 0.68, y: y + 0.22, w: 0.5, h: 0.5 }, { color: C.accent });
        }
        slide.addText(step.heading, {
          x: x + 0.18, y: y + 0.95, w: w - 0.36, h: 0.5,
          fontSize: SIZE.sub, fontFace: FONTS.sans, color: C.ink, margin: 0
        });
        slide.addText(step.body, {
          x: x + 0.18, y: y + 1.55, w: w - 0.36, h: h - 1.7,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink,
          lineSpacingMultiple: 1.1, valign: "top", margin: 0
        });
        if (index < input.steps.length - 1) {
          ctx.helpers.addArrow(slide, {
            from: { x: x + w + 0.04, y: y + h / 2 },
            to: { x: x + w + gap - 0.04, y: y + h / 2 },
            color: C.accent, width: 2
          });
        }
      }
      if (input.loopLabel) {
        const firstX = LM + w / 2;
        const lastX = LM + (input.steps.length - 1) * (w + gap) + w / 2;
        const loopY = y + h + 0.38;
        // 負の幅・高さの線は矢印の向きが反転するため、すべて正方向に引く。
        const loopLine = { color: C.accent2, width: 2, dashed: true };
        ctx.helpers.addArrow(slide, { from: { x: lastX, y: y + h + 0.04 }, to: { x: lastX, y: loopY }, ...loopLine, endArrowType: "none" });
        ctx.helpers.addArrow(slide, { from: { x: firstX, y: loopY }, to: { x: lastX, y: loopY }, ...loopLine, endArrowType: "none" });
        ctx.helpers.addArrow(slide, { from: { x: firstX, y: y + h + 0.04 }, to: { x: firstX, y: loopY }, ...loopLine, beginArrowType: "triangle", endArrowType: "none" });
        slide.addShape(pptx.ShapeType.rect, {
          x: LM + CW / 2 - 2.6, y: loopY - 0.2, w: 5.2, h: 0.4,
          fill: { color: C.white }, line: { color: C.white, width: 0 }
        });
        slide.addText(input.loopLabel, {
          x: LM + CW / 2 - 2.6, y: loopY - 0.2, w: 5.2, h: 0.4,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink,
          align: "center", valign: "middle", margin: 0
        });
      }
      footer(ctx, input.pageNum, input.label);
    }
  });
}

export function connectionSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  rows: Array<{ cli: string; via: string; target: string; host: string; path: string; tone: "accent" | "accent2" }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "connection",
    requiredFonts: [FONTS.sans, FONTS.mono],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const cliW = 2.1;
      const gap = 1.65;
      const endX = LM + cliW + gap;
      const endW = LM + CW - endX;
      const rowH = 1.2;
      const startY = input.rows.length === 1 ? 2.2 : 1.72;
      await ctx.helpers.addIcon(slide, "laptop", { x: LM, y: startY - 0.42, w: 0.32, h: 0.32 }, { color: C.muted });
      slide.addText("Windows PC", {
        x: LM + 0.42, y: startY - 0.42, w: cliW, h: 0.35,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
      });
      await ctx.helpers.addIcon(slide, "cloud", { x: endX, y: startY - 0.42, w: 0.32, h: 0.32 }, { color: C.muted });
      slide.addText("Microsoft Foundry リソース", {
        x: endX + 0.42, y: startY - 0.42, w: endW, h: 0.35,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
      });
      input.rows.forEach((row, index) => {
        const y = startY + index * (rowH + 0.25);
        const color = row.tone === "accent2" ? C.accent2 : C.accent;
        slide.addShape(pptx.ShapeType.rect, {
          x: LM, y, w: cliW, h: rowH,
          fill: { color: C.white }, line: { color, width: 2 }
        });
        slide.addText(row.cli, {
          x: LM, y, w: cliW, h: rowH,
          fontSize: SIZE.sub, fontFace: FONTS.sans, color: C.ink,
          align: "center", valign: "middle", margin: 0
        });
        ctx.helpers.addArrow(slide, {
          from: { x: LM + cliW + 0.05, y: y + rowH / 2 },
          to: { x: endX - 0.05, y: y + rowH / 2 },
          color, width: 2
        });
        slide.addText(row.via, {
          x: LM + cliW, y: y + rowH / 2 - 0.42, w: gap, h: 0.36,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink, align: "center", margin: 0
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: endX, y, w: endW, h: rowH,
          fill: { color: C.surface }, line: { color: C.grey30, width: 0.75 }
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: endX, y, w: 0.08, h: rowH,
          fill: { color }, line: { color, width: 0 }
        });
        slide.addText([
          { text: row.target, options: { fontFace: FONTS.sans, color: C.muted, breakLine: true } },
          { text: row.host, options: { fontFace: FONTS.mono, color: C.ink, breakLine: true } },
          { text: row.path, options: { fontFace: FONTS.mono, color: C.ink } }
        ], {
          x: endX + 0.25, y: y + 0.1, w: endW - 0.35, h: rowH - 0.2,
          fontSize: SIZE.body, valign: "middle", lineSpacingMultiple: 1.15, margin: 0
        });
      });
      slide.addText(input.note, {
        x: LM, y: 4.55, w: CW, h: 0.4,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
      });
      footer(ctx, input.pageNum, input.label);
    }
  });
}

export function tableSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  header: string[];
  rows: string[][];
  colW: number[];
  rowH?: number;
  note?: string;
  icons?: string[];
}): CustomSlide {
  return new CustomSlide({
    name: "table",
    requiredFonts: [FONTS.sans],
    async draw(ctx) {
      const { slide } = ctx;
      frame(ctx, input.title);
      const headerRow = input.header.map((cell) => ({
        text: cell,
        options: { color: C.white, fill: { color: C.ink }, valign: "middle" }
      }));
      const bodyRows = input.rows.map((row, rowIndex) =>
        row.map((cell, colIndex) => ({
          text: cell,
          options: {
            valign: "middle",
            fill: { color: rowIndex % 2 === 1 ? C.surface : C.white },
            fontFace: FONTS.sans,
            ...(input.icons && colIndex === 0 ? { margin: [4, 8, 4, 40] } : {})
          }
        }))
      );
      slide.addTable([headerRow, ...bodyRows] as never, {
        x: LM,
        y: CONTENT_Y,
        w: CW,
        colW: input.colW,
        rowH: [0.45, ...input.rows.map(() => input.rowH ?? 0.62)],
        border: { type: "solid", pt: 0.75, color: C.grey30 },
        fontSize: SIZE.body,
        fontFace: FONTS.sans,
        color: C.ink,
        margin: [4, 8, 4, 8],
        lineSpacingMultiple: 1.1
      });
      const rowH = input.rowH ?? 0.62;
      for (const [index, icon] of (input.icons ?? []).entries()) {
        await ctx.helpers.addIcon(slide, icon, {
          x: LM + 0.12, y: CONTENT_Y + 0.45 + index * rowH + rowH / 2 - 0.16, w: 0.32, h: 0.32
        }, { color: C.accent });
      }
      if (input.note) {
        const tableBottom = CONTENT_Y + 0.45 + input.rows.length * (input.rowH ?? 0.62);
        slide.addText(input.note, {
          x: LM, y: Math.max(4.62, tableBottom + 0.08), w: CW, h: 0.42,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, valign: "bottom", margin: 0
        });
      }
      footer(ctx, input.pageNum, input.label);
    }
  });
}

export function stepsSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  steps: string[];
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "steps",
    requiredFonts: [FONTS.sans],
    draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const rowH = input.steps.length > 4 ? 0.58 : 0.72;
      input.steps.forEach((step, index) => {
        const y = CONTENT_Y + 0.05 + index * rowH;
        slide.addShape("ellipse", {
          x: LM, y: y + 0.08, w: 0.46, h: 0.46,
          fill: { color: C.accent }, line: { color: C.accent, width: 0 }
        });
        slide.addText(String(index + 1), {
          x: LM, y: y + 0.08, w: 0.46, h: 0.46,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink,
          align: "center", valign: "middle", margin: 0
        });
        slide.addText(step, {
          x: LM + 0.7, y, w: CW - 0.7, h: 0.62,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink,
          valign: "middle", lineSpacingMultiple: 1.15, margin: 0
        });
      });
      if (input.note) {
        const noteY = input.steps.length > 4 ? 4.45 : 4.3;
        const noteH = input.steps.length > 4 ? 0.6 : 0.7;
        slide.addShape(pptx.ShapeType.rect, {
          x: LM, y: noteY, w: CW, h: noteH,
          fill: { color: C.accentSoft }, line: { color: C.accentSoft, width: 0 }
        });
        slide.addText(input.note, {
          x: LM + 0.2, y: noteY, w: CW - 0.4, h: noteH,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink, valign: "middle", margin: 0
        });
      }
      footer(ctx, input.pageNum, input.label);
    }
  });
}

export function codeSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  lead?: string;
  code: string;
  notes?: string[];
  lineSpacing?: number;
}): CustomSlide {
  return new CustomSlide({
    name: "code",
    requiredFonts: [FONTS.sans, FONTS.mono],
    draw(ctx) {
      const { slide } = ctx;
      frame(ctx, input.title);
      if (input.lead) {
        slide.addText(input.lead, {
          x: LM, y: CONTENT_Y, w: CW, h: 0.4,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink, valign: "middle", margin: 0
        });
      }
      const panelY = input.lead ? CONTENT_Y + 0.5 : CONTENT_Y;
      const panelH = codePanel(ctx, input.code, { x: LM, y: panelY, w: CW }, input.lineSpacing);
      if (input.notes?.length) {
        const y = panelY + panelH + 0.15;
        slide.addText(bulletRuns(input.notes), {
          x: LM, y, w: CW, h: Math.max(0.4, CONTENT_BOTTOM + 0.05 - y),
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink,
          valign: "top", lineSpacingMultiple: 1.1, margin: 0
        });
      }
      footer(ctx, input.pageNum, input.label);
    }
  });
}

export function codeBulletsSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  code: string;
  bullets: string[];
}): CustomSlide {
  return new CustomSlide({
    name: "code-bullets",
    requiredFonts: [FONTS.sans, FONTS.mono],
    draw(ctx) {
      const { slide } = ctx;
      frame(ctx, input.title);
      const panelH = codePanel(ctx, input.code, { x: LM, y: CONTENT_Y, w: CW });
      const y = CONTENT_Y + panelH + 0.3;
      slide.addText(bulletRuns(input.bullets), {
        x: LM, y, w: CW, h: CONTENT_BOTTOM + 0.05 - y,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink,
        valign: "top", lineSpacingMultiple: LS, margin: 0
      });
      footer(ctx, input.pageNum, input.label);
    }
  });
}

export function cardsSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  cards: Array<{ heading: string; bullets: string[]; tone?: "accent" | "accent2" | "accent3" }>;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "cards",
    requiredFonts: [FONTS.sans],
    draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const gap = 0.3;
      const n = input.cards.length;
      const w = (CW - gap * (n - 1)) / n;
      const y = CONTENT_Y + 0.05;
      const h = (input.note ? 4.45 : CONTENT_BOTTOM) - y;
      input.cards.forEach((card, index) => {
        const x = LM + index * (w + gap);
        const color = card.tone === "accent2" ? C.accent2 : card.tone === "accent3" ? C.accent3 : C.accent;
        slide.addShape(pptx.ShapeType.rect, {
          x, y, w, h,
          fill: { color: C.surface }, line: { color: C.grey30, width: 0.75 }
        });
        slide.addShape(pptx.ShapeType.rect, {
          x, y, w, h: 0.07,
          fill: { color }, line: { color, width: 0 }
        });
        slide.addText(card.heading, {
          x: x + 0.22, y: y + 0.2, w: w - 0.44, h: 0.5,
          fontSize: SIZE.sub, fontFace: FONTS.sans, color: C.ink, valign: "middle", margin: 0
        });
        slide.addText(bulletRuns(card.bullets), {
          x: x + 0.22, y: y + 0.85, w: w - 0.44, h: h - 1.0,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink,
          valign: "top", lineSpacingMultiple: 1.15, margin: 0
        });
      });
      if (input.note) {
        slide.addText(input.note, {
          x: LM, y: 4.55, w: CW, h: 0.45,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, valign: "middle", margin: 0
        });
      }
      footer(ctx, input.pageNum, input.label);
    }
  });
}

export function sourcesSlide(input: {
  pageNum: number;
  title: string;
  sources: Array<{ name: string; url: string }>;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "sources",
    requiredFonts: [FONTS.sans],
    draw(ctx) {
      const { slide } = ctx;
      frame(ctx, input.title);
      const runs = input.sources.flatMap((source, index) => [
        { text: source.name, options: { color: C.ink, breakLine: true } },
        {
          text: source.url,
          options: { color: C.muted, breakLine: index < input.sources.length - 1, paraSpaceAfter: 4 }
        }
      ]);
      slide.addText(runs, {
        x: LM, y: CONTENT_Y, w: CW, h: input.note ? 3.4 : 3.75,
        fontSize: SIZE.body, fontFace: FONTS.sans, valign: "top", lineSpacingMultiple: 1.0, margin: 0
      });
      if (input.note) slide.addText(input.note, {
        x: LM, y: 4.72, w: CW, h: 0.4,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, valign: "middle", margin: 0
      });
      footer(ctx, input.pageNum);
    }
  });
}

// ── 図解レイアウト（2026-10-01 ブラッシュアップ） ─────────────────

type Tone = "accent" | "accent2" | "accent3" | "ink" | "muted";

function toneColor(tone: Tone | undefined): string {
  if (tone === "accent2") return C.accent2;
  if (tone === "accent3") return C.accent3;
  if (tone === "ink") return C.ink;
  if (tone === "muted") return C.faint;
  return C.accent;
}

type ChipInput = {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  icon?: string;
  tone?: Tone;
  mono?: boolean;
  dark?: boolean;
  soft?: boolean;
  fontSize?: number;
};

// アイコンと短い文を入れた角丸ボックス。図解の基本部品。
async function chip(ctx: Ctx, input: ChipInput) {
  const { slide, pptx } = ctx;
  const color = toneColor(input.tone);
  const fill = input.dark ? C.ink : input.soft ? C.accentSoft : C.white;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: input.x, y: input.y, w: input.w, h: input.h,
    fill: { color: fill }, line: { color: input.dark ? C.ink : color, width: 1.5 },
    rectRadius: 0.08
  });
  const iconSize = 0.34;
  let textX = input.x + 0.12;
  if (input.icon) {
    await ctx.helpers.addIcon(slide, input.icon, {
      x: input.x + 0.14, y: input.y + input.h / 2 - iconSize / 2, w: iconSize, h: iconSize
    }, { color: input.dark ? "93C5FD" : color });
    textX = input.x + 0.14 + iconSize + 0.1;
  }
  slide.addText(input.text, {
    x: textX, y: input.y, w: input.x + input.w - 0.1 - textX, h: input.h,
    fontSize: input.fontSize ?? SIZE.body,
    fontFace: input.mono ? FONTS.mono : FONTS.sans,
    color: input.dark ? C.white : C.ink,
    align: input.icon ? "left" : "center", valign: "middle",
    lineSpacingMultiple: 1.05, margin: 0
  });
}

function arrowRight(ctx: Ctx, x1: number, x2: number, y: number, color: string = C.accent) {
  ctx.helpers.addArrow(ctx.slide, { from: { x: x1, y }, to: { x: x2, y }, color, width: 2 });
}

function arrowDown(ctx: Ctx, x: number, y1: number, y2: number, color: string = C.accent) {
  ctx.helpers.addArrow(ctx.slide, { from: { x, y: y1 }, to: { x, y: y2 }, color, width: 2 });
}

// 16ptで1行に収めるための概算幅（Keynote/PowerPointの和文フォント代替を見込んだ値）。
function textWidth(text: string, mono = false): number {
  let width = 0;
  for (const ch of text) {
    if (/[\u3000-\u9fff\uff00-\uffef]/.test(ch)) width += 0.235;
    else if (ch === " ") width += 0.07;
    else width += mono ? 0.15 : 0.125;
  }
  return width;
}

function chipNeed(item: { text: string; icon?: string; mono?: boolean }): number {
  const longest = Math.max(...item.text.split("\n").map((line) => textWidth(line, item.mono)));
  return longest + (item.icon ? 0.72 : 0.34);
}

// 横一列のチップを矢印でつなぐ。幅は文字量に合わせて配分し、収まらなければ失敗させる。
async function chipFlow(ctx: Ctx, items: Array<Omit<ChipInput, "x" | "y" | "w" | "h"> & { weight?: number }>, box: { x: number; y: number; w: number; h: number }, gap = 0.4) {
  const needs = items.map(chipNeed);
  const spare = box.w - gap * (items.length - 1) - needs.reduce((sum, need) => sum + need, 0);
  if (spare < 0) throw new Error(`chip flow is ${(-spare).toFixed(2)}in too wide: ${items.map((item) => item.text).join(" / ")}`);
  let x = box.x;
  for (const [index, item] of items.entries()) {
    const w = needs[index] + spare / items.length;
    await chip(ctx, { ...item, x, y: box.y, w, h: box.h });
    if (index < items.length - 1) arrowRight(ctx, x + w + 0.05, x + w + gap - 0.05, box.y + box.h / 2);
    x += w + gap;
  }
}

function noteText(ctx: Ctx, text: string, y: number, h = 0.38) {
  ctx.slide.addText(text, {
    x: LM, y, w: CW, h,
    fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, valign: "middle", margin: 0
  });
}

function assertFits(name: string, bottom: number) {
  if (bottom > 5.08) throw new Error(`${name}: content bottom ${bottom.toFixed(2)}in overlaps the footer`);
}

type FlowItem = Omit<ChipInput, "x" | "y" | "w" | "h"> & { weight?: number };

// コード＋その設定がどう効くかを示す処理フロー帯。
export function codeFlowSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  lead?: string;
  code: string;
  lineSpacing?: number;
  flowLabel?: string;
  flow: FlowItem[];
  note?: string | string[];
}): CustomSlide {
  return new CustomSlide({
    name: "code-flow",
    requiredFonts: [FONTS.sans, FONTS.mono],
    async draw(ctx) {
      const { slide } = ctx;
      frame(ctx, input.title);
      let y = CONTENT_Y;
      if (input.lead) {
        slide.addText(input.lead, {
          x: LM, y, w: CW, h: 0.4,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink, valign: "middle", margin: 0
        });
        y += 0.5;
      }
      y += codePanel(ctx, input.code, { x: LM, y, w: CW }, input.lineSpacing) + 0.16;
      const flowH = 0.56;
      await chipFlow(ctx, input.flow, { x: LM, y, w: CW, h: flowH }, 0.3);
      y += flowH;
      for (const note of typeof input.note === "string" ? [input.note] : input.note ?? []) {
        noteText(ctx, note, y + 0.05);
        y += 0.42;
      }
      assertFits(input.title, y);
      footer(ctx, input.pageNum, input.label);
    }
  });
}

// 長いコード用。右端に処理段階のレールを重ねる（line は1始まりの行番号）。
export function railCodeSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  code: string;
  lineSpacing: number;
  rail: Array<{ line: number; text: string }>;
}): CustomSlide {
  return new CustomSlide({
    name: "rail-code",
    requiredFonts: [FONTS.sans, FONTS.mono],
    draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const panelH = codePanel(ctx, input.code, { x: LM, y: CONTENT_Y, w: CW }, input.lineSpacing);
      assertFits(input.title, CONTENT_Y + panelH);
      const lineH = input.lineSpacing / 72;
      const chipW = 0.85;
      const chipH = 0.3;
      const chipX = LM + CW - chipW - 0.1;
      const centers = input.rail.map((item) => CONTENT_Y + 0.15 + (item.line - 0.5) * lineH);
      slide.addShape(pptx.ShapeType.line, {
        x: chipX + chipW / 2, y: centers[0], w: 0, h: centers[centers.length - 1] - centers[0],
        line: { color: "93C5FD", width: 1.5, dashType: "dash" }
      });
      input.rail.forEach((item, index) => {
        const cy = centers[index];
        slide.addShape(pptx.ShapeType.roundRect, {
          x: chipX, y: cy - chipH / 2, w: chipW, h: chipH,
          fill: { color: C.accentSoft }, line: { color: C.accentSoft, width: 0 }, rectRadius: 0.06
        });
        slide.addText(item.text, {
          x: chipX, y: cy - chipH / 2, w: chipW, h: chipH,
          fontSize: SIZE.body, fontFace: FONTS.sans, bold: true, color: C.ink,
          align: "center", valign: "middle", margin: 0
        });
      });
      footer(ctx, input.pageNum, input.label);
    }
  });
}

// アイコン付きカードのグリッド。
export function iconCardsSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  cols: number;
  cards: Array<{ icon: string; heading: string; body: string; tone?: Tone; mono?: boolean }>;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "icon-cards",
    requiredFonts: [FONTS.sans, FONTS.mono],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const rows = Math.ceil(input.cards.length / input.cols);
      const gapX = 0.25;
      const gapY = 0.2;
      const top = CONTENT_Y + 0.02;
      const bottom = input.note ? 4.5 : 4.98;
      const w = (CW - gapX * (input.cols - 1)) / input.cols;
      const h = (bottom - top - gapY * (rows - 1)) / rows;
      for (const [index, card] of input.cards.entries()) {
        const x = LM + (index % input.cols) * (w + gapX);
        const y = top + Math.floor(index / input.cols) * (h + gapY);
        const color = toneColor(card.tone);
        slide.addShape(pptx.ShapeType.rect, {
          x, y, w, h, fill: { color: C.surface }, line: { color: C.grey30, width: 0.75 }
        });
        slide.addShape(pptx.ShapeType.rect, {
          x, y, w: 0.07, h, fill: { color }, line: { color, width: 0 }
        });
        await ctx.helpers.addIcon(slide, card.icon, { x: x + 0.22, y: y + 0.16, w: 0.42, h: 0.42 }, { color });
        slide.addText(card.heading, {
          x: x + 0.76, y: y + 0.12, w: w - 0.9, h: 0.5,
          fontSize: SIZE.sub, fontFace: FONTS.sans, color: C.ink, valign: "middle", margin: 0
        });
        slide.addText(card.body, {
          x: x + 0.22, y: y + 0.7, w: w - 0.38, h: h - 0.8,
          fontSize: SIZE.body, fontFace: card.mono ? FONTS.mono : FONTS.sans, color: C.ink,
          valign: "top", lineSpacingMultiple: 1.1, margin: 0
        });
      }
      if (input.note) noteText(ctx, input.note, 4.6);
      footer(ctx, input.pageNum, input.label);
    }
  });
}

// Foundryプロジェクト（左）から各デプロイ、利用先へ分岐する構成図。
export function hubSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  hub: { icon: string; heading: string; body: string };
  rows: Array<{ deployment: string; consumer: string; icon: string; tone: Tone }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "hub",
    requiredFonts: [FONTS.sans],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const top = 1.35;
      const rowH = 0.68;
      const gap = 0.12;
      const bottom = top + input.rows.length * rowH + (input.rows.length - 1) * gap;
      const hubW = 1.9;
      slide.addShape(pptx.ShapeType.rect, {
        x: LM, y: top, w: hubW, h: bottom - top,
        fill: { color: C.ink }, line: { color: C.ink, width: 0 }
      });
      await ctx.helpers.addIcon(slide, input.hub.icon, { x: LM + 0.2, y: top + 0.22, w: 0.5, h: 0.5 }, { color: "93C5FD" });
      slide.addText(input.hub.heading, {
        x: LM + 0.2, y: top + 0.85, w: hubW - 0.35, h: 0.5,
        fontSize: SIZE.sub, fontFace: FONTS.sans, color: C.white, margin: 0
      });
      slide.addText(input.hub.body, {
        x: LM + 0.2, y: top + 1.45, w: hubW - 0.35, h: bottom - top - 1.55,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: C.grey30,
        valign: "top", lineSpacingMultiple: 1.1, margin: 0
      });
      const depX = LM + hubW + 0.55;
      const depW = 3.3;
      const conX = depX + depW + 0.5;
      const conW = LM + CW - conX;
      for (const [index, row] of input.rows.entries()) {
        const y = top + index * (rowH + gap);
        const color = toneColor(row.tone);
        arrowRight(ctx, LM + hubW + 0.04, depX - 0.05, y + rowH / 2, C.faint);
        slide.addShape(pptx.ShapeType.rect, {
          x: depX, y, w: depW, h: rowH, fill: { color: C.surface }, line: { color: C.grey30, width: 0.75 }
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: depX, y, w: 0.07, h: rowH, fill: { color }, line: { color, width: 0 }
        });
        slide.addText(row.deployment, {
          x: depX + 0.2, y, w: depW - 0.3, h: rowH,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink, valign: "middle",
          lineSpacingMultiple: 1.0, margin: 0
        });
        arrowRight(ctx, depX + depW + 0.05, conX - 0.05, y + rowH / 2, color);
        await chip(ctx, { x: conX, y: y + 0.06, w: conW, h: rowH - 0.12, text: row.consumer, icon: row.icon, tone: row.tone });
      }
      slide.addText("デプロイ", {
        x: depX, y: top - 0.36, w: depW, h: 0.3,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
      });
      slide.addText("使う場所", {
        x: conX, y: top - 0.36, w: conW, h: 0.3,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
      });
      slide.addShape(pptx.ShapeType.rect, {
        x: LM, y: 4.55, w: CW, h: 0.45, fill: { color: C.accentSoft }, line: { color: C.accentSoft, width: 0 }
      });
      slide.addText(input.note, {
        x: LM + 0.2, y: 4.55, w: CW - 0.4, h: 0.45,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink, valign: "middle", margin: 0
      });
      footer(ctx, input.pageNum, input.label);
    }
  });
}

// コード＋左（別名）→右（デプロイ名）の対応図。
export function codeMappingSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  code: string;
  mapLabel: { from: string; to: string };
  rows: Array<{ from: string; to: string; aside?: string }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "code-mapping",
    requiredFonts: [FONTS.sans, FONTS.mono],
    async draw(ctx) {
      const { slide } = ctx;
      frame(ctx, input.title);
      const panelH = codePanel(ctx, input.code, { x: LM, y: CONTENT_Y, w: CW });
      let y = CONTENT_Y + panelH + 0.18;
      const fromW = 1.9;
      const toX = LM + fromW + 0.7;
      const toW = 3.3;
      slide.addText(input.mapLabel.from, {
        x: LM, y, w: toX - LM, h: 0.3, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
      });
      slide.addText(input.mapLabel.to, {
        x: toX, y, w: toW, h: 0.3, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
      });
      y += 0.36;
      const rowH = 0.44;
      for (const row of input.rows) {
        await chip(ctx, { x: LM, y, w: fromW, h: rowH, text: row.from, mono: true, tone: "accent2" });
        arrowRight(ctx, LM + fromW + 0.08, toX - 0.08, y + rowH / 2, C.accent2);
        await chip(ctx, { x: toX, y, w: toW, h: rowH, text: row.to, mono: true, tone: "accent", soft: true });
        if (row.aside) {
          slide.addText(row.aside, {
            x: toX + toW + 0.2, y, w: LM + CW - toX - toW - 0.2, h: rowH,
            fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, valign: "middle", margin: 0
          });
        }
        y += rowH + 0.1;
      }
      noteText(ctx, input.note, y + 0.02);
      assertFits(input.title, y + 0.4);
      footer(ctx, input.pageNum, input.label);
    }
  });
}

// 2つの方式を横レーンで並べる比較図。
export function lanesSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  lanes: Array<{ name: string; caption: string; tone: Tone; steps: FlowItem[] }>;
  stepsLabel?: string;
  steps?: string[];
  notes?: string[];
}): CustomSlide {
  return new CustomSlide({
    name: "lanes",
    requiredFonts: [FONTS.sans],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const laneH = 1.0;
      const labelW = 1.6;
      let y = 1.35;
      for (const lane of input.lanes) {
        const color = toneColor(lane.tone);
        slide.addShape(pptx.ShapeType.rect, {
          x: LM, y, w: CW, h: laneH, fill: { color: C.surface }, line: { color: C.surface, width: 0 }
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: LM, y, w: 0.07, h: laneH, fill: { color }, line: { color, width: 0 }
        });
        slide.addText([
          { text: lane.name, options: { fontSize: SIZE.sub, color: C.ink, breakLine: true } },
          { text: lane.caption, options: { fontSize: SIZE.body, color: C.muted } }
        ], {
          x: LM + 0.22, y, w: labelW - 0.2, h: laneH, fontFace: FONTS.sans, valign: "middle", margin: 0
        });
        await chipFlow(ctx, lane.steps.map((step) => ({ ...step, tone: step.tone ?? lane.tone })), {
          x: LM + labelW + 0.1, y: y + 0.2, w: CW - labelW - 0.25, h: laneH - 0.4
        }, 0.35);
        y += laneH + 0.18;
      }
      if (input.steps?.length) {
        slide.addText(input.stepsLabel ?? "", {
          x: LM, y, w: labelW, h: 0.5, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, valign: "middle", margin: 0
        });
        const stepW = (CW - labelW) / input.steps.length;
        input.steps.forEach((step, index) => {
          const x = LM + labelW + index * stepW;
          slide.addShape("ellipse", {
            x, y: y + 0.07, w: 0.36, h: 0.36, fill: { color: C.ink }, line: { color: C.ink, width: 0 }
          });
          slide.addText(String(index + 1), {
            x, y: y + 0.07, w: 0.36, h: 0.36, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.white,
            align: "center", valign: "middle", margin: 0
          });
          slide.addText(step, {
            x: x + 0.45, y, w: stepW - 0.5, h: 0.5, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink,
            valign: "middle", margin: 0
          });
        });
        y += 0.58;
      }
      for (const note of input.notes ?? []) {
        noteText(ctx, note, y, 0.36);
        y += 0.38;
      }
      assertFits(input.title, y);
      footer(ctx, input.pageNum, input.label);
    }
  });
}

// アイコン付きの行リスト。項目名と説明を1行ずつ並べる。
export function iconListSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  items: Array<{ icon: string; heading: string; body: string; tone?: Tone; mono?: boolean }>;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "icon-list",
    requiredFonts: [FONTS.sans, FONTS.mono],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const gap = 0.07;
      const bottom = input.note ? 4.52 : 4.98;
      const rowH = Math.min(0.62, (bottom - CONTENT_Y - gap * (input.items.length - 1)) / input.items.length);
      const headX = LM + 0.68;
      const headW = 1.85;
      const bodyX = headX + headW + 0.1;
      let y = CONTENT_Y;
      for (const item of input.items) {
        const color = toneColor(item.tone);
        slide.addShape(pptx.ShapeType.rect, {
          x: LM, y, w: CW, h: rowH, fill: { color: C.surface }, line: { color: C.surface, width: 0 }
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: LM, y, w: 0.07, h: rowH, fill: { color }, line: { color, width: 0 }
        });
        await ctx.helpers.addIcon(slide, item.icon, { x: LM + 0.22, y: y + rowH / 2 - 0.17, w: 0.34, h: 0.34 }, { color });
        slide.addText(item.heading, {
          x: headX, y, w: headW, h: rowH, fontSize: SIZE.body, fontFace: FONTS.sans, bold: true, color: C.ink, valign: "middle", margin: 0
        });
        slide.addText(item.body, {
          x: bodyX, y, w: LM + CW - bodyX - 0.1, h: rowH,
          fontSize: SIZE.body, fontFace: item.mono ? FONTS.mono : FONTS.sans, color: C.ink, valign: "middle", margin: 0
        });
        y += rowH + gap;
      }
      if (input.note) noteText(ctx, input.note, 4.6);
      footer(ctx, input.pageNum, input.label);
    }
  });
}

// 2択の比較カード＋共通事項の帯。
export function compareCardsSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  cards: Array<{ icon: string; name: string; full: string; body: string; tone: Tone }>;
  axis?: { left: string; right: string };
  common: string;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "compare-cards",
    requiredFonts: [FONTS.sans, FONTS.mono],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const gap = 0.3;
      const w = (CW - gap) / 2;
      const y = CONTENT_Y + 0.02;
      const h = 2.25;
      for (const [index, card] of input.cards.entries()) {
        const x = LM + index * (w + gap);
        const color = toneColor(card.tone);
        slide.addShape(pptx.ShapeType.rect, {
          x, y, w, h, fill: { color: C.surface }, line: { color: C.grey30, width: 0.75 }
        });
        slide.addShape(pptx.ShapeType.rect, {
          x, y, w, h: 0.07, fill: { color }, line: { color, width: 0 }
        });
        await ctx.helpers.addIcon(slide, card.icon, { x: x + 0.25, y: y + 0.28, w: 0.55, h: 0.55 }, { color });
        slide.addText(card.name, {
          x: x + 0.95, y: y + 0.22, w: w - 1.1, h: 0.42,
          fontSize: 28, fontFace: FONTS.sans, color: C.ink, valign: "middle", margin: 0
        });
        slide.addText(card.full, {
          x: x + 0.95, y: y + 0.64, w: w - 1.1, h: 0.32,
          fontSize: SIZE.body, fontFace: FONTS.mono, color: C.muted, valign: "middle", margin: 0
        });
        slide.addText(card.body, {
          x: x + 0.25, y: y + 1.15, w: w - 0.45, h: h - 1.25,
          fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink, valign: "top", lineSpacingMultiple: 1.15, margin: 0
        });
      }
      let by = y + h + 0.15;
      if (input.axis) {
        ctx.helpers.addArrow(slide, {
          from: { x: LM + 1.6, y: by + 0.17 }, to: { x: LM + CW - 1.6, y: by + 0.17 },
          color: C.faint, width: 1.5, beginArrowType: "triangle"
        });
        slide.addText(input.axis.left, {
          x: LM, y: by, w: 1.5, h: 0.34, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, align: "left", valign: "middle", margin: 0
        });
        slide.addText(input.axis.right, {
          x: LM + CW - 1.5, y: by, w: 1.5, h: 0.34, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, align: "right", valign: "middle", margin: 0
        });
        by += 0.45;
      }
      slide.addShape(pptx.ShapeType.rect, {
        x: LM, y: by, w: CW, h: 0.7, fill: { color: C.accentSoft }, line: { color: C.accentSoft, width: 0 }
      });
      slide.addText(input.common, {
        x: LM + 0.2, y: by, w: CW - 0.4, h: 0.7,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink, valign: "middle", lineSpacingMultiple: 1.05, margin: 0
      });
      by += 0.7;
      if (input.note) {
        noteText(ctx, input.note, by + 0.05, 0.32);
        by += 0.37;
      }
      assertFits(input.title, by);
      footer(ctx, input.pageNum, input.label);
    }
  });
}

// 左から右へ進むフロー。各段に複数ボックスを縦に積める。
export function stageFlowSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  stages: Array<{ caption?: string; weight?: number; boxes: Array<{ heading?: string; body: string; icon?: string; tone?: Tone; dark?: boolean; mono?: boolean }> }>;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "stage-flow",
    requiredFonts: [FONTS.sans, FONTS.mono],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const gap = 0.42;
      const total = input.stages.reduce((sum, stage) => sum + (stage.weight ?? 1), 0);
      const unit = (CW - gap * (input.stages.length - 1)) / total;
      const top = 1.68;
      const bottom = input.note ? 4.48 : 4.95;
      const midY = (top + bottom) / 2;
      let x = LM;
      for (const [index, stage] of input.stages.entries()) {
        const w = unit * (stage.weight ?? 1);
        if (stage.caption) {
          slide.addText(stage.caption, {
            x, y: top - 0.4, w, h: 0.32, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
          });
        }
        const n = stage.boxes.length;
        const boxGap = 0.2;
        const boxH = (bottom - top - boxGap * (n - 1)) / n;
        for (const [boxIndex, box] of stage.boxes.entries()) {
          const y = top + boxIndex * (boxH + boxGap);
          const color = toneColor(box.tone);
          slide.addShape(pptx.ShapeType.rect, {
            x, y, w, h: boxH,
            fill: { color: box.dark ? C.ink : C.surface }, line: { color: box.dark ? C.ink : C.grey30, width: 0.75 }
          });
          if (!box.dark) {
            slide.addShape(pptx.ShapeType.rect, {
              x, y, w, h: 0.07, fill: { color }, line: { color, width: 0 }
            });
          }
          let ty = y + 0.18;
          if (box.icon) {
            await ctx.helpers.addIcon(slide, box.icon, { x: x + 0.18, y: ty, w: 0.42, h: 0.42 }, { color: box.dark ? "93C5FD" : color });
            ty += 0.5;
          }
          if (box.heading) {
            slide.addText(box.heading, {
              x: x + 0.18, y: ty, w: w - 0.3, h: 0.46,
              fontSize: SIZE.sub, fontFace: FONTS.sans, color: box.dark ? C.white : C.ink, valign: "middle", margin: 0
            });
            ty += 0.52;
          }
          slide.addText(box.body, {
            x: x + 0.18, y: ty, w: w - 0.3, h: y + boxH - ty - 0.08,
            fontSize: SIZE.body, fontFace: box.mono ? FONTS.mono : FONTS.sans,
            color: box.dark ? C.white : C.ink, valign: "top", lineSpacingMultiple: 1.1, margin: 0
          });
        }
        if (index < input.stages.length - 1) arrowRight(ctx, x + w + 0.06, x + w + gap - 0.06, midY);
        x += w + gap;
      }
      if (input.note) noteText(ctx, input.note, 4.58, 0.4);
      footer(ctx, input.pageNum, input.label);
    }
  });
}

// 可否を色とアイコンで示す比較行。
export function statusRowsSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  header: { item: string; status: string };
  rows: Array<{ item: string; status: string; level: "ok" | "partial" | "no"; highlight?: string }>;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "status-rows",
    requiredFonts: [FONTS.sans],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const statusX = LM + 5.45;
      slide.addText(input.header.item, {
        x: LM + 0.9, y: CONTENT_Y, w: 4.4, h: 0.32, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
      });
      slide.addText(input.header.status, {
        x: statusX, y: CONTENT_Y, w: 3.0, h: 0.32, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
      });
      const rowH = 0.82;
      let y = CONTENT_Y + 0.4;
      for (const row of input.rows) {
        const look = row.level === "ok"
          ? { icon: "circle-check", color: C.accent3, fill: C.accentSoft }
          : row.level === "partial"
            ? { icon: "circle-alert", color: C.accent2, fill: C.surface }
            : { icon: "circle-x", color: C.faint, fill: C.surface };
        slide.addShape(pptx.ShapeType.rect, {
          x: LM, y, w: CW, h: rowH, fill: { color: look.fill }, line: { color: C.grey30, width: 0.75 }
        });
        await ctx.helpers.addIcon(slide, look.icon, { x: LM + 0.25, y: y + rowH / 2 - 0.25, w: 0.5, h: 0.5 }, { color: look.color });
        slide.addText(row.item, {
          x: LM + 0.9, y, w: 4.45, h: rowH, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink, valign: "middle", margin: 0
        });
        slide.addText([
          { text: row.status, options: { color: C.ink, breakLine: Boolean(row.highlight) } },
          ...(row.highlight ? [{ text: row.highlight, options: { color: C.muted } }] : [])
        ], {
          x: statusX, y, w: LM + CW - statusX - 0.15, h: rowH,
          fontSize: SIZE.body, fontFace: FONTS.sans, valign: "middle", margin: 0
        });
        y += rowH + 0.12;
      }
      if (input.note) noteText(ctx, input.note, y + 0.02);
      assertFits(input.title, y + 0.4);
      footer(ctx, input.pageNum, input.label);
    }
  });
}

// 対象 → 実行するコマンド → 期待する結果 のレーン図。
export function verifyLanesSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  header: [string, string, string];
  rows: Array<{ icon: string; target: string; command: string; result: string; tone: Tone }>;
  note?: string;
}): CustomSlide {
  return new CustomSlide({
    name: "verify-lanes",
    requiredFonts: [FONTS.sans, FONTS.mono],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const tW = 2.4;
      const cX = LM + tW + 0.15;
      const cW = 3.75;
      const rX = cX + cW + 0.45;
      const rW = LM + CW - rX;
      [[LM, tW], [cX, cW], [rX, rW]].forEach(([x, w], index) => {
        slide.addText(input.header[index], {
          x, y: CONTENT_Y - 0.06, w, h: 0.32, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
        });
      });
      const rowH = 0.68;
      let y = CONTENT_Y + 0.28;
      for (const row of input.rows) {
        const color = toneColor(row.tone);
        await chip(ctx, { x: LM, y, w: tW, h: rowH, text: row.target, icon: row.icon, tone: row.tone });
        slide.addShape(pptx.ShapeType.roundRect, {
          x: cX, y, w: cW, h: rowH, fill: { color: C.ink }, line: { color: C.ink, width: 0 }, rectRadius: 0.06
        });
        slide.addText(row.command, {
          x: cX + 0.15, y, w: cW - 0.25, h: rowH,
          fontSize: SIZE.body, fontFace: FONTS.mono, color: C.white, valign: "middle", lineSpacingMultiple: 1.0, margin: 0
        });
        arrowRight(ctx, cX + cW + 0.06, rX - 0.06, y + rowH / 2, color);
        slide.addText(row.result, {
          x: rX, y, w: rW, h: rowH, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.ink, valign: "middle", margin: 0
        });
        y += rowH + 0.08;
      }
      if (input.note) noteText(ctx, input.note, y - 0.02);
      assertFits(input.title, y + (input.note ? 0.36 : 0));
      footer(ctx, input.pageNum, input.label);
    }
  });
}

// 設定の通り道（左の縦チェーン）と、各段で起きる症状・確認点の対応図。
export function faultMapSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  chainLabel: string;
  rows: Array<{ part: string; icon: string; symptom: string; check: string }>;
}): CustomSlide {
  return new CustomSlide({
    name: "fault-map",
    requiredFonts: [FONTS.sans],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const partW = Math.max(1.7, ...input.rows.map((row) => chipNeed({ text: row.part, icon: row.icon })));
      const cardX = LM + partW + 0.55;
      const cardW = LM + CW - cardX;
      slide.addText(input.chainLabel, {
        x: LM, y: CONTENT_Y - 0.06, w: cardX - LM - 0.05, h: 0.32, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
      });
      slide.addText("症状 → 確認すること", {
        x: cardX, y: CONTENT_Y - 0.06, w: cardW, h: 0.32, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
      });
      const n = input.rows.length;
      const top = n > 4 ? CONTENT_Y + 0.24 : CONTENT_Y + 0.3;
      const gap = n > 4 ? 0.06 : 0.14;
      const rowH = (4.98 - top - gap * (n - 1)) / n;
      for (const [index, row] of input.rows.entries()) {
        const y = top + index * (rowH + gap);
        await chip(ctx, { x: LM, y, w: partW, h: rowH, text: row.part, icon: row.icon, tone: "accent", soft: true });
        if (index < n - 1) arrowDown(ctx, LM + partW / 2, y + rowH + 0.01, y + rowH + gap - 0.01, C.accent);
        ctx.helpers.addArrow(slide, {
          from: { x: cardX - 0.06, y: y + rowH / 2 }, to: { x: LM + partW + 0.06, y: y + rowH / 2 },
          color: C.accent2, width: 1.5, dashed: true
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: cardX, y, w: cardW, h: rowH, fill: { color: C.white }, line: { color: C.grey30, width: 0.75 }
        });
        slide.addShape(pptx.ShapeType.rect, {
          x: cardX, y, w: 0.07, h: rowH, fill: { color: C.accent2 }, line: { color: C.accent2, width: 0 }
        });
        slide.addText([
          { text: row.symptom, options: { bold: true, color: C.ink, breakLine: true } },
          { text: row.check, options: { color: C.ink } }
        ], {
          x: cardX + 0.2, y, w: cardW - 0.3, h: rowH,
          fontSize: SIZE.body, fontFace: FONTS.sans, valign: "middle", lineSpacingMultiple: n > 4 ? 0.9 : 1.0, margin: 0
        });
      }
      footer(ctx, input.pageNum, input.label);
    }
  });
}

// ── フォルダ構成図（2026-10-02 追加） ─────────────────────────────

export type FileNode = { name: string; depth: number; folder?: boolean; tag?: string; tone?: Tone };

// 箱と線で描くフォルダツリー。行ごとにアイコン・名前・所属Partのタグを並べる。
async function fileTree(ctx: Ctx, nodes: FileNode[], box: { x: number; y: number; w: number; rowH: number }) {
  const { slide, pptx } = ctx;
  const indent = 0.3;
  const iconSize = 0.28;
  const tagW = 0.85;
  nodes.forEach((node, index) => {
    if (node.depth === 0) return;
    // 直前の親の行から、この行の中央まで線を引く。
    let parent = index - 1;
    while (parent >= 0 && nodes[parent].depth >= node.depth) parent -= 1;
    const lineX = box.x + (node.depth - 1) * indent + iconSize / 2;
    const y1 = box.y + parent * box.rowH + box.rowH / 2 + iconSize / 2;
    const y2 = box.y + index * box.rowH + box.rowH / 2;
    slide.addShape(pptx.ShapeType.line, { x: lineX, y: y1, w: 0, h: y2 - y1, line: { color: C.faint, width: 1 } });
    slide.addShape(pptx.ShapeType.line, { x: lineX, y: y2, w: indent - iconSize / 2 - 0.04, h: 0, line: { color: C.faint, width: 1 } });
  });
  for (const [index, node] of nodes.entries()) {
    const y = box.y + index * box.rowH;
    const x = box.x + node.depth * indent;
    const color = toneColor(node.tone ?? "muted");
    if (node.tag) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: x - 0.06, y: y + 0.03, w: box.x + box.w - x + 0.06, h: box.rowH - 0.06,
        fill: { color: C.surface }, line: { color: C.surface, width: 0 }, rectRadius: 0.05
      });
    }
    await ctx.helpers.addIcon(slide, node.folder ? "folder" : "file-text", {
      x, y: y + box.rowH / 2 - iconSize / 2, w: iconSize, h: iconSize
    }, { color: node.folder ? C.accent : color });
    slide.addText(node.name, {
      x: x + iconSize + 0.1, y, w: box.x + box.w - x - iconSize - 0.1 - (node.tag ? tagW + 0.1 : 0), h: box.rowH,
      fontSize: SIZE.body, fontFace: FONTS.mono, color: C.ink, valign: "middle", margin: 0
    });
    if (node.tag) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: box.x + box.w - tagW, y: y + 0.07, w: tagW, h: box.rowH - 0.14,
        fill: { color }, line: { color, width: 0 }, rectRadius: 0.05
      });
      slide.addText(node.tag, {
        x: box.x + box.w - tagW, y: y + 0.07, w: tagW, h: box.rowH - 0.14,
        fontSize: 14, fontFace: FONTS.sans, bold: true, color: C.white, align: "center", valign: "middle", margin: 0
      });
    }
  }
  return box.y + nodes.length * box.rowH;
}

export function fileMapSlide(input: {
  pageNum: number;
  label: string;
  title: string;
  columns: Array<{ caption: string; w: number; nodes: FileNode[]; extra?: { heading: string; body: string } }>;
  note: string;
}): CustomSlide {
  return new CustomSlide({
    name: "file-map",
    requiredFonts: [FONTS.sans, FONTS.mono],
    async draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const gap = CW - input.columns.reduce((sum, column) => sum + column.w, 0);
      let x = LM;
      let bottom = 0;
      for (const column of input.columns) {
        slide.addText(column.caption, {
          x, y: CONTENT_Y - 0.06, w: column.w, h: 0.32, fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
        });
        let y = await fileTree(ctx, column.nodes, { x, y: CONTENT_Y + 0.3, w: column.w, rowH: 0.37 });
        if (column.extra) {
          y += 0.18;
          slide.addShape(pptx.ShapeType.rect, {
            x, y, w: column.w, h: 1.0, fill: { color: C.white }, line: { color: C.grey30, width: 0.75 }
          });
          slide.addShape(pptx.ShapeType.rect, {
            x, y, w: 0.07, h: 1.0, fill: { color: C.accent2 }, line: { color: C.accent2, width: 0 }
          });
          slide.addText([
            { text: column.extra.heading, options: { bold: true, color: C.ink, breakLine: true } },
            { text: column.extra.body, options: { color: C.muted } }
          ], { x: x + 0.2, y, w: column.w - 0.3, h: 1.0, fontSize: SIZE.body, fontFace: FONTS.sans, valign: "middle", margin: 0 });
          y += 1.0;
        }
        bottom = Math.max(bottom, y);
        x += column.w + gap;
      }
      noteText(ctx, input.note, Math.max(bottom + 0.08, 4.6));
      assertFits(input.title, Math.max(bottom + 0.08, 4.6) + 0.38);
      footer(ctx, input.pageNum, input.label);
    }
  });
}
