# WPTI-Quick Web v1.0

A browser-based implementation of WPTI-Quick for visualizing wellness-related movement behavior in clinical, educational, public-health, occupational-health, community, and research settings.

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

Score interpretation:

- 0-34 points: discussion can focus on expanding options for daily movement behavior.
- 35-59 points: modifiable behaviors can be identified more concretely.
- 60 points or higher: discussion can focus on maintenance and preparation for changes in life context.

The fixed scoring table is defined in `src/lib/scoring.ts`. Bilingual text content is defined in `src/lib/i18n.ts`.

## Privacy

This web version does not ask for name, email, date of birth, address, workplace, medical information, or other personal information. Responses are scored locally in the browser, no backend database is used, and answers are not transmitted to a server.

Japanese privacy statement:

このWeb版は、個人情報を収集せず、回答内容をサーバーに送信しません。

## Citation

Kise S. (2026). Operationalizing wellness in physiotherapy: development and validation of a 0-100 wellness physical therapy index from a national population survey. Physiotherapy Theory and Practice. https://doi.org/10.1080/09593985.2026.2621961

## Policy

- WPTI-Quick v1.0 is free to use for clinical, educational, and research purposes.
- Do not modify the question wording, response options, or scoring.
- Cite the original WPTI article when using WPTI-Quick.
- This tool is not intended for diagnosis or ranking individuals.
