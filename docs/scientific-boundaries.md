# Web v1.2-rc.1: evidence boundaries and release-candidate notes

## Source

Kise S. Operationalizing wellness in physiotherapy: development and validation of a 0–100 wellness physical therapy index from a national population survey. Physiother Theory Pract. 2026;42(9):1171–1180. doi:10.1080/09593985.2026.2621961. PMID: [41606948](https://pubmed.ncbi.nlm.nih.gov/41606948/).

The prior Web v1.1 review records consideration of the supplied published PDF, including Methods (pp. 1172–1173), Results (pp. 1175–1176), Clinical implications (p. 1177), and Limitations (pp. 1177–1178), and the author's Quick v1.0 guide.

This candidate also uses the six-page author-review draft **WPTI_研究の位置付けと最小修正案_著者検討用_20261011_v2.docx** (11 October 2026), read from the supplied Library source. Its relevant discussions are the research stage and supported claims (pp. 1–2), proposed uses and implementation issues (p. 4), recovered calculation (p. 5), and remaining decisions (p. 6). The draft reports a review of recovered records and a post-publication consistency analysis; it is not a new external validation study. Its scientific and factual review and the author's decision to adopt its proposals remain pending. This candidate does not represent a correction to the published article, and does not claim to have independently repeated the underlying research analyses. Private source files are not included in this repository.

## Core distinction

The original WPTI is described here as development and initial evaluation of a three-domain movement index intended to support physiotherapy assessment and counselling. Its selected domains are leisure activity, transport activity, and sedentary time; it does not cover all dimensions of wellness. This framing preserves the clinical aim while distinguishing the evidence obtained from the uses still proposed.

Quick v1.0 uses discrete 0/10/20/30 points for leisure and transport, and 0/10/20/40 for sedentary time. It is a separate categorical instrument. Sharing three domains and a 0–100 range does not establish numerical equivalence or validate Quick.

The author-review draft reports reproduction of the original fixed scores and strong within-sample associations with activity criteria derived from overlapping self-reported inputs. Those findings support computational reproducibility and initial activity-related evidence. They do not establish measurement reliability, independent external validity, or clinical usefulness. In particular, they do not establish those properties for Quick or this Web workflow.

- Do not transfer original AUC 0.865, predicted probabilities, mean 20.9, or thresholds 35/60 to Quick as validated properties.
- Do not interpret Quick as WHO guideline attainment, overall health, disease risk, diagnosis, or a validated treatment outcome.
- The original paper notes shared-input criteria, self-report limitations, limited generalizability, and untested responsiveness, test–retest reliability, and meaningful change. The author-review draft additionally questions the high-reliability interpretation of the reported 0.84 value and the claims of readiness for practical decisions.
- The original 35/60 bands are exploratory proposals, not established clinical decision thresholds. Neither the original bands nor Quick's legacy bands should determine exercise dose, follow-up frequency, or treatment success.
- Screening, counselling, and goal setting were proposed applications. A proposal is not evidence that a screening or treatment-decision use has been validated. This interface supports behavior review and a self-selected next step; its added benefit still needs evaluation.

## Published methods and recovered implementation

The previous Web notes described the original method as using “weighted standardization.” That conflated the published methods with the recovered implementation reported in the author-review draft. They should be kept distinct:

| Record | Description and limit |
|---|---|
| Published methods | Describe preprocessing and weighted standardization. Their correspondence with the recovered implementation is a research reporting issue for the author to resolve. |
| Recovered fixed implementation, as reported in the author-review draft, p. 5 | Caps leisure and transport durations at their 99th percentiles and sedentary time at its 99.5th percentile; standardizes components using **unweighted means and sample standard deviations**; normalizes PCA-derived coefficients to form scoring weights; and linearly rescales the composite using development-sample endpoints. |
| This Web app | Implements the fixed categorical Quick v1.0 table only. It does not implement or reproduce the original continuous WPTI calculation. |

The recovered calculation's full-precision constants and component-specific reference sets belong to the preserved fixed specification. Do not imply that every component mean and SD came from one identical 2,966-person complete-case set. Reproduction of that calculation is not a resolution of the reporting discrepancy and is not evidence validating Quick. This app's scope makes no claim that original scoring constants are unavailable or do not exist.

## Implemented features

| Feature | Basis and boundary |
|---|---|
| Domain examples and weekly minutes helper | Clarifies leisure/transport/sitting definitions. A recall aid, not a changed item or automatic category assignment. |
| Actual response categories alongside points | Makes the behavior visible. Bars represent item points, not health percentages. |
| Sitting reminder for the existing ≥8-hour response | Keeps this response visible even at a high total; not a new clinical cutoff. |
| Questions about context, barriers, and maintaining habits | Provides prompts consistent with the proposed domain-specific conversations. The usefulness of this interface and any added benefit from the total score have not been established. |
| Optional self-selected action, context, and review date | Supports shared goal setting; no score changes, exercise prescription, mandatory follow-up interval, or automated clinical triage. |
| Print and clipboard summary | Retains response labels, instrument/Web versions, interpretation boundary, and source. No backend or persistent history. |
| Labeled fictional example | Demonstrates 30 + 30 + 0 = 60 while keeping ≥8-hour sitting visible. Never presented as a real user's result. |

## Intentional presentation changes

The existing guide frames bands as discussion aids. Web v1.0 nevertheless placed a generic maintenance message next to a total of 60 even with ≥8-hour sitting. Web v1.1 removes the prominent total-band classification and the algorithmic "lowest domain" priority from results. All three domains remain available for a user-selected discussion. The underlying scoring functions and all 64 possible scores are unchanged.

The word “outcome measure” is removed from the main product explanation to avoid implying established evaluative measurement properties. Japanese About and Policy text is now in Japanese. Access analytics is described separately from local-only response/plan handling.

Web v1.2-rc.1 retains that flow and the 30/30/40 allocation. It adds the original study's development/initial-evaluation status, distinguishes proposed screening uses from established uses, and synchronizes Japanese and English explanations. Short guidance stays on the opening and results screens; the fuller research explanation is available in an expandable section. Computational testing below concerns the software and does not confer scientific validity.

## Known instrument issue, not silently changed

The original Quick v1.0 labels use whole-hour ranges (≤3, 4–5, 6–7, ≥8 hours/day) and do not explicitly specify a rounding rule for 3.5, 5.5, or 7.5 hours/day. The existing instruction asks users to choose the closest situation. This candidate makes the issue explicit without inventing a rounding rule, silently redefining categories, or reclassifying earlier records. Numeric-to-category auto-selection remains absent. Resolving interval boundaries requires an explicit instrument revision and a compatibility decision for previously collected Quick data. See [the alternatives and approval boundary](sitting-time-boundaries.md).

The weekly helper is for similar daily amounts only. It neither infers intensity nor determines WHO guideline attainment. This app remains a Quick calculator; implementing the original continuous WPTI is outside this candidate's scope.

## Software verification

The prior Web v1.1 record reports seven scoring tests plus three recall/export tests passing, all 64 answer combinations and question/option/point mappings matching its earlier base commit, and passing TypeScript, lint, build, and whitespace checks. Those are historical checks, not evidence that this candidate has already passed verification.

The Web v1.2-rc.1 candidate is to be compared with public-main snapshot `c8726c2a403c2cbd028a23412a51f978c582c237`. Candidate verification must cover all 64 scores, unanswered items, both languages, the optional plan, review guidance, copy, mobile layout, and A4 print. The candidate's accompanying verification report records actual results and remaining limitations. No deployment or merge is authorized by this document.

Web interface changes and software verification are not a new validation study. For conference reporting, retain the version and collection period associated with the original pilot; do not present prior usability results as evaluation of this revised interface. A missing or unrecovered record alone is not proof that a study activity did not occur.
