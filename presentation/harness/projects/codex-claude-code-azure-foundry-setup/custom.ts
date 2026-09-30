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
  steps: Array<{ heading: string; body: string }>;
}): CustomSlide {
  return new CustomSlide({
    name: "flow",
    requiredFonts: [FONTS.sans],
    draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const gap = 0.32;
      const w = (CW - gap * (input.steps.length - 1)) / input.steps.length;
      const y = 1.55;
      const h = 3.2;
      input.steps.forEach((step, index) => {
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
      });
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
    draw(ctx) {
      const { slide, pptx } = ctx;
      frame(ctx, input.title);
      const cliW = 2.1;
      const gap = 1.65;
      const endX = LM + cliW + gap;
      const endW = LM + CW - endX;
      const rowH = 1.2;
      const startY = input.rows.length === 1 ? 2.2 : 1.72;
      slide.addText("Windows PC", {
        x: LM, y: startY - 0.42, w: cliW, h: 0.35,
        fontSize: SIZE.body, fontFace: FONTS.sans, color: C.muted, margin: 0
      });
      slide.addText("Microsoft Foundry リソース", {
        x: endX, y: startY - 0.42, w: endW, h: 0.35,
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
}): CustomSlide {
  return new CustomSlide({
    name: "table",
    requiredFonts: [FONTS.sans],
    draw(ctx) {
      const { slide } = ctx;
      frame(ctx, input.title);
      const headerRow = input.header.map((cell) => ({
        text: cell,
        options: { color: C.white, fill: { color: C.ink }, valign: "middle" }
      }));
      const bodyRows = input.rows.map((row, rowIndex) =>
        row.map((cell) => ({
          text: cell,
          options: {
            valign: "middle",
            fill: { color: rowIndex % 2 === 1 ? C.surface : C.white },
            fontFace: FONTS.sans
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
