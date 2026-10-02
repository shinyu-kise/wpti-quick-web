# Web v1.1: evidence boundaries and release notes

## Source

Kise S. Operationalizing wellness in physiotherapy: development and validation of a 0–100 wellness physical therapy index from a national population survey. Physiother Theory Pract. 2026;42(9):1171–1180. doi:10.1080/09593985.2026.2621961. PMID: [41606948](https://pubmed.ncbi.nlm.nih.gov/41606948/).

The supplied published PDF was reviewed, including Methods (pp. 1172–1173), Results (pp. 1175–1176), Clinical implications (p. 1177), and Limitations (pp. 1177–1178). The author's existing Quick v1.0 guide was also checked. The article PDF and private working materials are not included in this public repository.

## Core distinction

Original WPTI uses winsorization, weighted standardization, PCA-derived weights, and a continuous rescaling. Quick v1.0 uses discrete 0/10/20/30 points for leisure and transport, and 0/10/20/40 for sedentary time. It is a separate operationalization. Sharing a 0–100 range does not establish numerical equivalence.

- Do not transfer original AUC 0.865, predicted probabilities, mean 20.9, or thresholds 35/60 to Quick as validated properties.
- Do not interpret Quick as WHO guideline attainment, overall health, disease risk, diagnosis, or a validated treatment outcome.
- The original paper itself notes criterion circularity, self-report limitations, limited generalizability, and untested responsiveness, test–retest reliability, and meaningful change.

## Implemented features

| Feature | Basis and boundary |
|---|---|
| Domain examples and weekly minutes helper | Clarifies leisure/transport/sitting definitions. A recall aid, not a changed item or automatic category assignment. |
| Actual response categories alongside points | Makes the behavior visible. Bars represent item points, not health percentages. |
| Sitting reminder for the existing ≥8-hour response | Keeps this response visible even at a high total; not a new clinical cutoff. |
| Questions about context, barriers, and maintaining habits | Implements the paper's proposed domain-specific counseling. No demonstrated treatment benefit is claimed. |
| Optional self-selected action, context, and review date | Supports shared goal setting; no score changes, exercise prescription, mandatory follow-up interval, or automated clinical triage. |
| Print and clipboard summary | Retains response labels, instrument/Web versions, interpretation boundary, and source. No backend or persistent history. |
| Labeled fictional example | Demonstrates 30 + 30 + 0 = 60 while keeping ≥8-hour sitting visible. Never presented as a real user's result. |

## Intentional presentation changes

The existing guide frames bands as discussion aids. Web v1.0 nevertheless placed a generic maintenance message next to a total of 60 even with ≥8-hour sitting. Web v1.1 removes the prominent total-band classification and the algorithmic "lowest domain" priority from results. All three domains remain available for a user-selected discussion. The underlying scoring functions and all 64 possible scores are unchanged.

The word “outcome measure” is removed from the main product explanation to avoid implying established evaluative measurement properties. Japanese About and Policy text is now in Japanese. Access analytics is described separately from local-only response/plan handling.

## Known instrument issue, not silently changed

The original Quick v1.0 labels use whole-hour ranges (≤3, 4–5, 6–7, ≥8 hours/day) and do not explicitly specify a rounding rule for 3.5, 5.5, or 7.5 hours/day. The existing instruction asks users to choose the closest situation. This revision does not invent a rounding rule or silently redefine categories. Numeric-to-category auto-selection is intentionally absent. Resolving interval boundaries would require an explicit instrument revision and a compatibility decision for previously collected Quick data.

The weekly helper is for similar daily amounts only. It neither infers intensity nor determines WHO guideline attainment. The app does not reproduce the original continuous WPTI because the supplied paper does not provide all frozen preprocessing/rescaling constants needed for an exact calculator.

## Validation

- Existing 7 scoring tests plus 3 recall/export safety tests pass.
- All 64 answer combinations, Japanese/English question text, response options, and point mappings match base commit dd6b58f68719fb143631e8eda41133ebe54dfb25.
- TypeScript, lint, production build, and whitespace checks pass.
- Browser verification and deployment state are reported in the pull request; do not infer them from this file.

Web v1.1 interface changes are not a new validation study. For conference reporting, retain the version and collection period associated with the original pilot; do not present prior usability results as evaluation of this revised interface.
