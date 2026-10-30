# Web 1.7.0 — five usability improvements

2026-10-30. Web 1.7.0-dialogue-rc.1 / Dialogue 1.2-prototype / Quick instrument v1.0.

The author requested these five improvements after a browser walkthrough of Web 1.6.1, explicitly retaining the scoring specification.

- Explain use alone or together with a support person. Use neutral input labels, while keeping permission guidance for recording another person's information.
- Provide an immediate next-step entry and one-click editable action examples. Clicking an example explicitly starts a small-change draft; existing text, maintenance choices and no-change choices are never replaced. The plan editor opens and receives keyboard focus.
- Add plain-language screen headings and explicit weekly-total / daily-average units. Canonical question text remains in the unchanged question data, help and printed response summary. The one-week recall period is unchanged.
- Show the existing between-category guidance beside sedentary-time choices. Times such as 3.5, 5.5 and 7.5 hours are not rounded or assigned automatically; an unsure response remains unscored.
- Preserve context and plan text when correcting instrument responses, including changing to unsure or unanswered. Mark an existing plan as awaiting review on screen and in copied/printed summaries, until explicitly reviewed. Current reference scores always use current responses. Explicit reset and choosing not to record still clear notes.

The version does not add persistence, transmission, new response categories, score thresholds, health classifications or scientific efficacy claims. Original scores and question/option data are checked against the retained instrument fixture. Implementation tests and browser QA do not constitute a participant usability study or clinical validation.

Previous production source: `79c6d2af7001b693ce130064361040592255fb42` (Web 1.6.1-dialogue-rc.1), retained in `archive/web-v1.6.1-before-usability-20261030`. Deployment identity and live behavior are verified separately from local build results.
