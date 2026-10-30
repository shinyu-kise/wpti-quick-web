# Web 1.9.0 — visible domain feedback

2026-10-30. Web 1.9.0-dialogue-rc.1 / Dialogue 1.4-prototype / Quick instrument v1.0.

The author noted that the simplified response-only display no longer made it clear which of the three domains could be reviewed. This release adds a concise point-based comparison without changing questions, response options, domain points, the total, or the one-week recall period.

- Each domain shows its original response and points/max (30, 30, 40), with a bar scaled to that domain's own maximum. The bar is not a health percentage or guideline-attainment measure.
- Complete answers use the existing relative-score comparison function. The lowest proportion is labeled as a reflection candidate (見直す候補). All ties are retained. All-max responses do not invent a lowest candidate.
- Missing, unsure, declined or invalid-domain responses remain unscored; known item scores may still be displayed, but no three-domain comparison or total is made.
- A short domain-specific prompt appears only for a single candidate. People remain free to choose another topic, keep current routines, or finish without making a plan. No clinical priority or exercise dose is assigned.
- Copy and print summaries include the same per-domain scores, comparison and interpretation boundaries. The total remains an optional reference.

This supersedes the earlier decision to omit an automatically calculated discussion candidate from the main interface, following the author's explicit feedback. It does not establish a validated health-deficiency threshold, safety clearance, clinical triage rule or evidence of behavior-change benefit.

Validation: 59 tests pass, including all 64 complete scoring/comparison patterns, 61 incomplete patterns, 24 wrong-domain substitutions, exact original Japanese/English instrument fixtures, ties/all-max handling, and bilingual export integration. Type checking, lint and static production build pass. Browser checks cover PC and narrow layouts, the 30+30+0 example, all-max, tied candidates, missing responses, English and optional notes. These checks are not an older-adult usability study or physical-smartphone test. Physical print/PDF layout remains unverified; export content is checked in unit tests.

Previous production source: `d718f3108321d42851f139bda931c33a924f6f23`, preserved as `archive/web-v1.8.0-before-domain-feedback-20261030`. Deployment is verified separately.
