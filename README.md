# WPTI-Quick Web v1.2-rc.1

A browser-based implementation of WPTI-Quick for visualizing wellness-related movement behavior in clinical, educational, public-health, occupational-health, community, and research settings.

This pre-release candidate preserves **Quick instrument v1.0** questions, response options, and scoring, and retains the Web v1.1 flow: bilingual recall examples, an optional weekly-minutes calculator, response-level discussion prompts, a self-selected action plan, and copy/print summaries. Web v1.2-rc.1 clarifies the evidence and synchronizes Japanese and English explanations.

The original WPTI concerns development and initial evaluation of a three-domain movement index intended to support physiotherapy assessment and counselling. Reproducibility of its fixed calculation is distinct from measurement reliability, clinical usefulness, or validation of Quick. The original WPTI and Quick use different calculations; the original study does not validate this categorical Quick score or the Web workflow. Screening and score-based clinical decisions remain proposed applications, not established uses.

See [Scientific and implementation boundaries](docs/scientific-boundaries.md) and [the sitting-time boundary decision](docs/sitting-time-boundaries.md). This candidate has not been deployed; releasing it and revising the instrument are separate decisions.

## Setup

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run the scoring tests:

```bash
npm test
```

## Scoring Logic

WPTI-Quick has 3 required items. The total score is Q1 + Q2 + Q3 and ranges from 0 to 100.

- Leisure/exercise physical activity: 0-30
- Transport-related physical activity: 0-30
- Sedentary behavior: 0-40

Historical v1.0 discussion bands (retained in the scoring module for compatibility, no longer presented as individual result classifications):

- 0-34 points: discussion can focus on expanding options for daily movement behavior.
- 35-59 points: modifiable behaviors can be identified more concretely.
- 60 points or higher: discussion can focus on maintenance and preparation for changes in life context.

These legacy labels are not validated clinical decision thresholds in either the original WPTI or Quick. They must not assign exercise dose, follow-up frequency, or treatment success.

The fixed scoring table is defined in `src/lib/scoring.ts`. Bilingual text is in `src/lib/i18n.ts` and `src/lib/workflow-copy.ts`. The result screen displays actual response categories and item scores, including long sitting regardless of total score. It does not apply the original paper's 35/60 thresholds to Quick. Sitting-time options and their points remain unchanged; no new rounding rule or automatic category assignment is introduced.

## Privacy

This web version does not request personal identifiers. Responses and optional action plans stay in React state, are not sent to a server, and clear on reload. Free-text fields instruct users not to enter identifiers. Copy and print are user-triggered. The existing Vercel Analytics integration remains for site visits; no response, score, plan, or other custom event is sent to it.

Japanese privacy statement:

回答・行動計画はブラウザ内で処理し、サーバーには送信しません。サイトのアクセス状況はVercel Analyticsで集計します。

## Citation

Kise S. (2026). Operationalizing wellness in physiotherapy: development and validation of a 0-100 wellness physical therapy index from a national population survey. Physiotherapy Theory and Practice. https://doi.org/10.1080/09593985.2026.2621961

## Policy

- WPTI-Quick v1.0 is free to use for clinical, educational, and research purposes.
- Preserve the Quick v1.0 question wording, response options, and scoring when using that instrument version. A scoring-specification change requires an explicit instrument revision.
- Cite the original WPTI article and record both the Quick instrument version and Web version used.
- This tool is not intended for diagnosis, ranking individuals, or estimating disease risk.
- Recall aids and the optional action plan are not scored. They support discussion; a clinical benefit has not been established.
