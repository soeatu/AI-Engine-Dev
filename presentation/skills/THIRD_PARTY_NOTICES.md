# Third-Party Notices

## alfonsograziano/pptx-gen

Source: https://github.com/alfonsograziano/pptx-gen

Reference revision: `f529b7c9ba53d5fe38398ba08003d7229fb3511d` (verified 2026-08-30)

`presentation/harness/` は、上記RevisionのTypeScript engine、CLI、neutral templates、examples、Design System、Lucide assetsを基礎として収録し、AI-Engine-Dev向けの品質ゲートと文書入口を追加しています。原ライセンスは [`presentation/harness/LICENSE`](../harness/LICENSE) にあります。

```text
MIT License

Copyright (c) 2026 pptx-gen contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

The bundled Lucide icon set under `presentation/harness/assets/icons/` is distributed under the ISC License. See [its license](../harness/assets/icons/LICENSE).

## Reference-only official skills

The following official skills were reviewed for workflow and quality principles. Their files are not redistributed in this workspace:

- OpenAI Codex Presentations Skill, bundled runtime version `26.826.12353`: communication job, template fidelity, source tracking, full-slide rendering, and visual QA.
- Anthropic Skills `pptx`, revision `3b3fad96af16a10759d930941b4520ba0c40edae`: PPTX routing, PptxGenJS/OOXML failure modes, package validation, and visual QA. The upstream skill declares a proprietary license.
