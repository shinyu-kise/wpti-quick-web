# WPTI-Quick Web v1.1

A browser-based implementation of WPTI-Quick for visualizing wellness-related movement behavior in clinical, educational, public-health, occupational-health, community, and research settings.

Web v1.1 preserves **Quick instrument v1.0** questions, response options, and scoring. It adds bilingual recall examples, an optional weekly-minutes calculator, response-level discussion prompts, a self-selected action plan, and copy/print summaries. The original WPTI and Quick use different calculations; the original paper does not validate this categorical Quick score or the new workflow.

See [Scientific and implementation boundaries](docs/scientific-boundaries.md).

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

The fixed scoring table is defined in `src/lib/scoring.ts`. Bilingual text is in `src/lib/i18n.ts` and `src/lib/workflow-copy.ts`. The result screen displays actual response categories and item scores, including long sitting regardless of total score. It does not apply the original paper's 35/60 thresholds to Quick.

## Privacy

This web version does not request personal identifiers. Responses and optional action plans stay in React state, are not sent to a server, and clear on reload. Free-text fields instruct users not to enter identifiers. Copy and print are user-triggered. The existing Vercel Analytics integration remains for site visits; no response, score, plan, or other custom event is sent to it.

Japanese privacy statement:

回答・行動計画はブラウザ内で処理し、サーバーには送信しません。サイトのアクセス状況はVercel Analyticsで集計します。

## Citation

Kise S. (2026). Operationalizing wellness in physiotherapy: development and validation of a 0-100 wellness physical therapy index from a national population survey. Physiotherapy Theory and Practice. https://doi.org/10.1080/09593985.2026.2621961

## Policy

- WPTI-Quick v1.0 is free to use for clinical, educational, and research purposes.
- Do not modify the question wording, response options, or scoring.
- Cite the original WPTI article when using WPTI-Quick.
- This tool is not intended for diagnosis or ranking individuals.
