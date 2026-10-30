# Web 1.8.0 — shorter reading flow and everyday Japanese

2026-10-30. Web 1.8.0-dialogue-rc.1 / Dialogue 1.3-prototype / Quick instrument v1.0.

The author requested further simplification after a PC/narrow-browser review of Web 1.7.0, specifically rejecting the unnatural Japanese phrase for trying a small change.

- Keep the three-question overview at desktop widths; show one question at a time below 1000 CSS pixels, with a numbered progress indicator and explicit back/next buttons. Selecting a response never advances automatically. Skipping is allowed; hidden questions retain their responses.
- Use shorter labels, 18 px answer text, full-width unsure/decline options, a visible weekly-total example, and a one-expansion recall calculator. Important intensity, sleep-exclusion, units and gap guidance remain associated with their question for assistive technology. Original question text and response options are retained unchanged.
- Mark the response summary as complete. Move optional action examples and notes into separate views rather than appending them to a long result page.
- An example opens an editable action and an explicit Done button. Additional details, choice changes and daily-life notes are optional disclosures. Completion does not silently clear the retained-plan review flag.
- Replace abstract Japanese interface wording with ordinary phrases. Scoring, reference-only interpretation, privacy, manual export and research limitations are preserved.

Validation: all 50 existing implementation tests pass, including all 64 score combinations, exact original Japanese/English instrument wording, and 768 direct/legacy example combinations. Type checking, lint and the static production build pass. Browser checks cover desktop and narrow layouts, back/next, skipped and uncertain responses, copy, retained notes after response corrections, and explicit review. The print-only structure remains outside screen-stage conditionals; physical print/PDF layout is not verified in this environment.

The observed layout reduction is a browser measurement, not a demonstrated reduction in user completion time. Target-user testing, actual smartphone testing and clinical validation have not been performed. Prior participant evaluations do not evaluate this release.

Previous production source: `e00a2ec8db0e65eee8eb63fbea34c984818c2cff`, retained as `archive/web-v1.7.0-before-simple-flow-20261030`. Deployment identity is checked separately from source tests.
