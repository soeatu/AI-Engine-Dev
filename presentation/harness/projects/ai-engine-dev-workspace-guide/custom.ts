import { C, CustomSlide, LAYOUT, type CustomSlideContext } from "../../src/index.js";

const { LM, CW } = LAYOUT;
const TITLE_SIZE = 35;
const BODY_SIZE = 16;
const LABEL_SIZE = 12;
const FONTS = {
  sans: "Arial",
  mono: "Arial"
} as const;

type Slide = CustomSlideContext["slide"];
type Pptx = CustomSlideContext["pptx"];

function addTitle(slide: Slide, title: string, eyebrow = "SECTION LABEL") {
  slide.addText(eyebrow, {
    x: LM,
    y: 0.3,
    w: CW,
    h: 0.22,
    fontFace: FONTS.sans,
    fontSize: LABEL_SIZE,
    bold: true,
    color: C.accent,
    charSpacing: 1.1,
    margin: 0
  });
  slide.addText(title, {
    x: LM,
    y: 0.72,
    w: CW,
    h: 0.6,
    fontFace: FONTS.sans,
    fontSize: TITLE_SIZE,
    bold: true,
    color: C.ink,
    margin: 0,
    breakLine: false
  });
}

function addFooter(slide: Slide, page = "00") {
  slide.addShape("line", {
    x: LM,
    y: 5.08,
    w: CW,
    h: 0,
    line: { color: C.grey30, width: 1 }
  });
  slide.addText("AI-ENGINE-DEV GUIDE", {
    x: LM,
    y: 5.16,
    w: 2.5,
    h: 0.18,
    fontFace: FONTS.sans,
    fontSize: 9,
    color: C.muted,
    margin: 0
  });
  slide.addText(page, {
    x: 9.05,
    y: 5.16,
    w: 0.42,
    h: 0.18,
    fontFace: FONTS.sans,
    fontSize: 9,
    color: C.muted,
    align: "right",
    margin: 0
  });
}

function addPill(slide: Slide, pptx: Pptx, text: string, x: number, y: number, w: number, fill = C.accentSoft) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.38,
    fill: { color: fill },
    line: { color: fill, width: 0 },
    rectRadius: 0.08
  });
  slide.addText(text, {
    x: x + 0.1,
    y: y + 0.05,
    w: w - 0.2,
    h: 0.23,
    fontFace: FONTS.sans,
    fontSize: 12,
    bold: true,
    color: C.ink,
    align: "center",
    margin: 0
  });
}

function addCard(
  slide: Slide,
  pptx: Pptx,
  input: { x: number; y: number; w: number; h: number; label: string; title: string; body: string; accent?: string }
) {
  const accent = input.accent ?? C.accent;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: input.x,
    y: input.y,
    w: input.w,
    h: input.h,
    fill: { color: C.white },
    line: { color: C.grey30, width: 1 },
    rectRadius: 0.08,
    shadow: { type: "outer", color: "D8DCE3", blur: 1, angle: 45, distance: 1, opacity: 0.18 }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: input.x,
    y: input.y,
    w: 0.08,
    h: input.h,
    fill: { color: accent },
    line: { color: accent, width: 0 }
  });
  slide.addText(input.label, {
    x: input.x + 0.22,
    y: input.y + 0.14,
    w: input.w - 0.4,
    h: 0.2,
    fontFace: FONTS.sans,
    fontSize: 10,
    bold: true,
    color: accent,
    margin: 0
  });
  slide.addText(input.title, {
    x: input.x + 0.22,
    y: input.y + 0.42,
    w: input.w - 0.4,
    h: 0.34,
    fontFace: FONTS.sans,
    fontSize: 20,
    bold: true,
    color: C.ink,
    margin: 0
  });
  slide.addText(input.body, {
    x: input.x + 0.22,
    y: input.y + 0.84,
    w: input.w - 0.4,
    h: input.h - 0.98,
    fontFace: FONTS.sans,
    fontSize: BODY_SIZE,
    color: C.muted,
    breakLine: false,
    valign: "top",
    margin: 0
  });
}

export function coverSlide(): CustomSlide {
  return new CustomSlide({
    name: "guide-cover",
    background: "dark",
    requiredFonts: [FONTS.sans],
    draw({ slide, pptx }) {
      slide.background = { color: C.ink };
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 0.2,
        h: LAYOUT.height,
        fill: { color: C.accent },
        line: { color: C.accent, width: 0 }
      });
      slide.addText("GUIDE CATEGORY", {
        x: LM,
        y: 1.1,
        w: CW,
        h: 0.3,
        fontFace: FONTS.sans,
        fontSize: 14,
        bold: true,
        color: C.accent,
        charSpacing: 1.2,
        margin: 0
      });
      slide.addText("Workspace guide title", {
        x: LM,
        y: 1.65,
        w: 7.6,
        h: 0.82,
        fontFace: FONTS.sans,
        fontSize: 50,
        bold: true,
        color: C.white,
        margin: 0,
        valign: "mid"
      });
      slide.addText("A concise subtitle describing the audience and outcome", {
        x: LM,
        y: 2.85,
        w: 7.4,
        h: 0.62,
        fontFace: FONTS.sans,
        fontSize: 22,
        color: "CAD1DE",
        margin: 0
      });
      slide.addText("VERSION OR CONTEXT", {
        x: LM,
        y: 4.62,
        w: 3.0,
        h: 0.24,
        fontFace: FONTS.sans,
        fontSize: 11,
        color: C.faint,
        margin: 0
      });
    }
  });
}

export function sectionDividerSlide(): CustomSlide {
  return new CustomSlide({
    name: "guide-section-divider",
    background: "dark",
    requiredFonts: [FONTS.sans],
    draw({ slide, pptx }) {
      slide.background = { color: C.ink };
      slide.addText("01", {
        x: LM,
        y: 0.75,
        w: 1.2,
        h: 0.85,
        fontFace: FONTS.sans,
        fontSize: 48,
        bold: true,
        color: C.accent,
        margin: 0
      });
      slide.addText("Section title", {
        x: LM,
        y: 1.75,
        w: 7.6,
        h: 0.82,
        fontFace: FONTS.sans,
        fontSize: 44,
        bold: true,
        color: C.white,
        margin: 0
      });
      slide.addText("What the reader will understand in this section", {
        x: LM,
        y: 2.82,
        w: 7.7,
        h: 0.62,
        fontFace: FONTS.sans,
        fontSize: 22,
        color: "CAD1DE",
        margin: 0
      });
      slide.addShape(pptx.ShapeType.line, {
        x: LM,
        y: 4.55,
        w: CW,
        h: 0,
        line: { color: "384258", width: 1 }
      });
      slide.addText("AI-ENGINE-DEV GUIDE", {
        x: LM,
        y: 4.72,
        w: 2.8,
        h: 0.22,
        fontFace: FONTS.sans,
        fontSize: 10,
        color: C.faint,
        margin: 0
      });
    }
  });
}

export function folderMapSlide(): CustomSlide {
  return new CustomSlide({
    name: "guide-folder-map",
    requiredFonts: [FONTS.sans, FONTS.mono],
    draw({ slide, pptx }) {
      slide.background = { color: C.white };
      addTitle(slide, "Folder roles become clear at a glance", "WORKSPACE MAP");
      slide.addShape(pptx.ShapeType.roundRect, {
        x: LM,
        y: 1.48,
        w: 3.1,
        h: 3.25,
        fill: { color: C.ink },
        line: { color: C.ink, width: 0 },
        rectRadius: 0.08
      });
      slide.addText("workspace-root/\n├─ development/\n│  ├─ projects/\n│  ├─ skills/\n│  ├─ scripts/\n│  └─ templates/\n├─ presentation/\n│  ├─ harness/\n│  ├─ skills/\n│  └─ presentations/\n└─ Lerning/", {
        x: LM + 0.28,
        y: 1.76,
        w: 2.55,
        h: 2.68,
        fontFace: FONTS.mono,
        fontSize: 15,
        color: C.white,
        breakLine: false,
        margin: 0
      });
      addCard(slide, pptx, {
        x: 4.25,
        y: 1.48,
        w: 2.45,
        h: 1.42,
        label: "PRIMARY AREA",
        title: "Folder name",
        body: "Responsibility and entry point."
      });
      addCard(slide, pptx, {
        x: 6.95,
        y: 1.48,
        w: 2.55,
        h: 1.42,
        label: "CANONICAL ENTRY",
        title: "README.md",
        body: "First document and next action.",
        accent: C.accent2
      });
      addCard(slide, pptx, {
        x: 4.25,
        y: 3.18,
        w: 5.25,
        h: 1.55,
        label: "BOUNDARY",
        title: "What belongs elsewhere",
        body: "Name the nearest related area and prevent misplaced artifacts.",
        accent: C.accent3
      });
      addFooter(slide);
    }
  });
}

export function processFlowSlide(): CustomSlide {
  const steps = [
    ["01", "Input", "Goal, audience, evidence"],
    ["02", "Select", "Folder and Skill"],
    ["03", "Work", "Artifact and source"],
    ["04", "Verify", "Tests and visual QA"],
    ["05", "Handoff", "Results and risks"]
  ] as const;
  return new CustomSlide({
    name: "guide-process-flow",
    requiredFonts: [FONTS.sans],
    draw({ slide, pptx, helpers }) {
      slide.background = { color: C.white };
      addTitle(slide, "Five-stage workflow", "WORKFLOW");
      const y = 2.05;
      const w = 1.55;
      const gap = 0.25;
      steps.forEach(([number, title, body], index) => {
        const x = LM + index * (w + gap);
        if (index < steps.length - 1) {
          helpers.addArrow(slide, {
            from: { x: x + w, y: y + 0.82 },
            to: { x: x + w + gap - 0.04, y: y + 0.82 },
            color: C.faint,
            width: 1.4
          });
        }
        slide.addShape(pptx.ShapeType.roundRect, {
          x,
          y,
          w,
          h: 1.78,
          fill: { color: index === 1 ? C.accentSoft : C.surface },
          line: { color: index === 1 ? C.accent : C.grey30, width: index === 1 ? 1.5 : 1 },
          rectRadius: 0.08
        });
        slide.addText(number, {
          x: x + 0.16,
          y: y + 0.18,
          w: 0.42,
          h: 0.28,
          fontFace: FONTS.sans,
          fontSize: 13,
          bold: true,
          color: C.accent,
          margin: 0
        });
        slide.addText(title, {
          x: x + 0.16,
          y: y + 0.58,
          w: w - 0.32,
          h: 0.35,
          fontFace: FONTS.sans,
          fontSize: 20,
          bold: true,
          color: C.ink,
          margin: 0
        });
        slide.addText(body, {
          x: x + 0.16,
          y: y + 1.04,
          w: w - 0.32,
          h: 0.5,
          fontFace: FONTS.sans,
          fontSize: 14,
          color: C.muted,
          margin: 0,
          valign: "top"
        });
      });
      addFooter(slide);
    }
  });
}

export function skillCatalogSlide(): CustomSlide {
  const rows = [
    ["CATEGORY ONE", "Skill name", "When this Skill fits", "Primary output"],
    ["CATEGORY TWO", "Skill name", "When this Skill fits", "Primary output"],
    ["CATEGORY THREE", "Skill name", "When this Skill fits", "Primary output"],
    ["CATEGORY FOUR", "Skill name", "When this Skill fits", "Primary output"]
  ] as const;
  return new CustomSlide({
    name: "guide-skill-catalog",
    requiredFonts: [FONTS.sans],
    draw({ slide, pptx }) {
      slide.background = { color: C.white };
      addTitle(slide, "Catalog title with one clear takeaway", "SKILL CATALOG");
      const x = LM;
      const top = 1.5;
      const widths = [1.52, 1.85, 3.15, 2.23];
      const headers = ["Category", "Skill", "Use when", "Primary output"];
      let cursor = x;
      headers.forEach((header, index) => {
        slide.addShape(pptx.ShapeType.rect, {
          x: cursor,
          y: top,
          w: widths[index],
          h: 0.5,
          fill: { color: C.ink },
          line: { color: C.ink, width: 0 }
        });
        slide.addText(header, {
          x: cursor + 0.12,
          y: top + 0.12,
          w: widths[index] - 0.24,
          h: 0.22,
          fontFace: FONTS.sans,
          fontSize: 11,
          bold: true,
          color: C.white,
          margin: 0
        });
        cursor += widths[index];
      });
      rows.forEach((row, rowIndex) => {
        let cellX = x;
        const rowY = top + 0.5 + rowIndex * 0.68;
        row.forEach((cell, colIndex) => {
          slide.addShape(pptx.ShapeType.rect, {
            x: cellX,
            y: rowY,
            w: widths[colIndex],
            h: 0.68,
            fill: { color: rowIndex % 2 === 0 ? C.white : C.surface },
            line: { color: C.grey30, width: 0.6 }
          });
          slide.addText(cell, {
            x: cellX + 0.12,
            y: rowY + 0.13,
            w: widths[colIndex] - 0.24,
            h: 0.38,
            fontFace: FONTS.sans,
            fontSize: colIndex === 0 ? 10 : 12,
            bold: colIndex < 2,
            color: colIndex === 0 ? C.accent : C.ink,
            margin: 0,
            valign: "mid"
          });
          cellX += widths[colIndex];
        });
      });
      addFooter(slide);
    }
  });
}

export function routingGuideSlide(): CustomSlide {
  return new CustomSlide({
    name: "guide-routing-guide",
    requiredFonts: [FONTS.sans],
    draw({ slide, pptx, helpers }) {
      slide.background = { color: C.white };
      addTitle(slide, "Routing title with one clear takeaway", "ROUTING GUIDE");
      addCard(slide, pptx, {
        x: LM,
        y: 1.52,
        w: 2.15,
        h: 1.36,
        label: "START",
        title: "Task",
        body: "Required outcome."
      });
      addCard(slide, pptx, {
        x: 3.95,
        y: 1.35,
        w: 2.25,
        h: 1.52,
        label: "DEVELOPMENT",
        title: "Build",
        body: "Requirements · design\nCode · tests",
        accent: C.accent2
      });
      addCard(slide, pptx, {
        x: 3.95,
        y: 3.15,
        w: 2.25,
        h: 1.52,
        label: "PRESENTATION",
        title: "Explain",
        body: "Brief · deck\nSources · visual QA",
        accent: C.accent3
      });
      addCard(slide, pptx, {
        x: 7.15,
        y: 2.25,
        w: 2.35,
        h: 1.55,
        label: "NEXT",
        title: "Skill",
        body: "Read matching SKILL.md."
      });
      helpers.addArrow(slide, { from: { x: 2.9, y: 2.2 }, to: { x: 3.88, y: 2.1 }, color: C.faint });
      helpers.addArrow(slide, { from: { x: 2.9, y: 2.2 }, to: { x: 3.88, y: 3.9 }, color: C.faint });
      helpers.addArrow(slide, { from: { x: 6.2, y: 2.1 }, to: { x: 7.08, y: 2.75 }, color: C.faint });
      helpers.addArrow(slide, { from: { x: 6.2, y: 3.9 }, to: { x: 7.08, y: 3.3 }, color: C.faint });
      addFooter(slide);
    }
  });
}

export function stepByStepSlide(): CustomSlide {
  const steps = [
    ["1", "Read the entrypoint", "Open the nearest README and AGENTS.md."],
    ["2", "Fix the brief", "Record scope, evidence, constraints, and authority."],
    ["3", "Run the Skill", "Create the artifact with its required workflow."],
    ["4", "Verify and hand off", "Separate completed checks from remaining risks."]
  ] as const;
  return new CustomSlide({
    name: "guide-step-by-step",
    requiredFonts: [FONTS.sans],
    draw({ slide, pptx }) {
      slide.background = { color: C.white };
      addTitle(slide, "Four-step procedure", "STEP BY STEP");
      steps.forEach(([number, title, body], index) => {
        const y = 1.42 + index * 0.82;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: LM,
          y,
          w: 0.5,
          h: 0.5,
          fill: { color: index === 3 ? C.ink : C.accentSoft },
          line: { color: index === 3 ? C.ink : C.accent, width: 1 },
          rectRadius: 0.08
        });
        slide.addText(number, {
          x: LM,
          y: y + 0.1,
          w: 0.5,
          h: 0.23,
          fontFace: FONTS.sans,
          fontSize: 15,
          bold: true,
          color: index === 3 ? C.white : C.accent,
          align: "center",
          margin: 0
        });
        slide.addText(title, {
          x: 1.5,
          y: y + 0.02,
          w: 2.65,
          h: 0.33,
          fontFace: FONTS.sans,
          fontSize: 18,
          bold: true,
          color: C.ink,
          margin: 0
        });
        slide.addText(body, {
          x: 4.25,
          y: y + 0.02,
          w: 5.25,
          h: 0.42,
          fontFace: FONTS.sans,
          fontSize: 15,
          color: C.muted,
          margin: 0
        });
        if (index < steps.length - 1) {
          slide.addShape(pptx.ShapeType.line, {
            x: 1.0,
            y: y + 0.5,
            w: 0,
            h: 0.32,
            line: { color: C.grey30, width: 1.5 }
          });
        }
      });
      addFooter(slide);
    }
  });
}

export function comparisonSlide(): CustomSlide {
  return new CustomSlide({
    name: "guide-comparison",
    requiredFonts: [FONTS.sans],
    draw({ slide, pptx }) {
      slide.background = { color: C.white };
      addTitle(slide, "Two-area comparison", "COMPARISON");
      addCard(slide, pptx, {
        x: LM,
        y: 1.48,
        w: 4.18,
        h: 2.95,
        label: "LEFT AREA",
        title: "Development",
        body: "Purpose\nPrimary inputs\nTypical Skills\nMain artifacts\nValidation and handoff",
        accent: C.accent2
      });
      addCard(slide, pptx, {
        x: 5.32,
        y: 1.48,
        w: 4.18,
        h: 2.95,
        label: "RIGHT AREA",
        title: "Presentation",
        body: "Purpose\nPrimary inputs\nTypical Skills\nMain artifacts\nValidation and handoff",
        accent: C.accent3
      });
      addPill(slide, pptx, "Shared rule: evidence, canonical sources, validation, human review", 2.15, 4.62, 5.7);
      addFooter(slide);
    }
  });
}

export function evidenceSlide(): CustomSlide {
  const items = [
    ["CONFIRMED", "Fact", "Verified by a current source or check.", C.accent3],
    ["ASSUMPTION", "Assumption", "Useful for progress, but clearly labeled.", C.accent2],
    ["OPEN", "Unresolved", "Needs user input or later verification.", C.accent],
    ["BOUNDARY", "Permission", "Skills do not expand authority.", C.ink]
  ] as const;
  return new CustomSlide({
    name: "guide-evidence-and-caution",
    requiredFonts: [FONTS.sans],
    draw({ slide, pptx }) {
      slide.background = { color: C.white };
      addTitle(slide, "Evidence and authority", "EVIDENCE AND CAUTION");
      items.forEach(([label, title, body, accent], index) => {
        const x = LM + (index % 2) * 4.52;
        const y = 1.5 + Math.floor(index / 2) * 1.62;
        addCard(slide, pptx, { x, y, w: 4.22, h: 1.35, label, title, body, accent });
      });
      addFooter(slide);
    }
  });
}

export function checklistSlide(): CustomSlide {
  const items = [
    "I know which folder owns the work",
    "I selected only the Skills required for this task",
    "Facts, assumptions, and unresolved items are separated",
    "Outputs and canonical documents agree",
    "Completed and uncompleted checks are reported",
    "External actions stay within explicit authority"
  ];
  return new CustomSlide({
    name: "guide-checklist",
    requiredFonts: [FONTS.sans],
    draw({ slide, pptx }) {
      slide.background = { color: C.ink };
      slide.addText("FINAL CHECK", {
        x: LM,
        y: 0.42,
        w: CW,
        h: 0.24,
        fontFace: FONTS.sans,
        fontSize: 12,
        bold: true,
        color: C.accent,
        charSpacing: 1.1,
        margin: 0
      });
      slide.addText("The reader is ready when these six conditions are clear", {
        x: LM,
        y: 0.76,
        w: CW,
        h: 0.78,
        fontFace: FONTS.sans,
        fontSize: 38,
        bold: true,
        color: C.white,
        margin: 0
      });
      items.forEach((item, index) => {
        const x = LM + (index % 2) * 4.5;
        const y = 1.82 + Math.floor(index / 2) * 0.86;
        slide.addShape(pptx.ShapeType.roundRect, {
          x,
          y,
          w: 0.42,
          h: 0.42,
          fill: { color: C.accent },
          line: { color: C.accent, width: 0 },
          rectRadius: 0.08
        });
        slide.addText("✓", {
          x,
          y: y + 0.05,
          w: 0.42,
          h: 0.24,
          fontFace: "Arial",
          fontSize: 15,
          bold: true,
          color: C.ink,
          align: "center",
          margin: 0
        });
        slide.addText(item, {
          x: x + 0.58,
          y: y - 0.01,
          w: 3.58,
          h: 0.48,
          fontFace: FONTS.sans,
          fontSize: 15,
          color: C.white,
          margin: 0,
          valign: "mid"
        });
      });
      slide.addText("REFERENCE LINKS OR NEXT ACTION", {
        x: LM,
        y: 4.76,
        w: CW,
        h: 0.22,
        fontFace: FONTS.sans,
        fontSize: 11,
        color: C.faint,
        margin: 0
      });
    }
  });
}
