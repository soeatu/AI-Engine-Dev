import { Presentation } from "../../src/index.js";
import {
  checklistSlide,
  comparisonSlide,
  coverSlide,
  evidenceSlide,
  folderMapSlide,
  processFlowSlide,
  routingGuideSlide,
  sectionDividerSlide,
  skillCatalogSlide,
  stepByStepSlide
} from "./custom.js";

const deck = new Presentation({
  title: "AI-Engine-Dev workspace guide template source",
  templateLibrary: "templates",
  projectDir: "projects/ai-engine-dev-workspace-guide"
});

deck.addCustomSlide(coverSlide());
deck.addCustomSlide(sectionDividerSlide());
deck.addCustomSlide(folderMapSlide());
deck.addCustomSlide(processFlowSlide());
deck.addCustomSlide(skillCatalogSlide());
deck.addCustomSlide(routingGuideSlide());
deck.addCustomSlide(stepByStepSlide());
deck.addCustomSlide(comparisonSlide());
deck.addCustomSlide(evidenceSlide());
deck.addCustomSlide(checklistSlide());

await deck.render({
  output: "output/template-deck.pptx",
  report: "output/template-build-report.md",
  screenshots: "output/template-screenshots"
});
