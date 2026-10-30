# Dialogue vNext: specification and release boundaries

Status: author-authorized release candidate, 2026-10-23 (Asia/Tokyo). Publication follows the remaining display/print checks; deployment success is recorded separately.
Web: 1.6.1-dialogue-rc.1. Legacy scoring: Quick instrument 1.0.
Dialogue: 1.1-prototype. Changing a user interface is not validation of an instrument.

## Intended workflow

1. Review the person's original responses in the three existing domains: leisure activity, active travel, and sitting/reclining while awake. Keep the original question text, response IDs, labels, units and point table unchanged. A separate unsure/unanswered state is permitted for dialogue; it is not a scored Quick response and is never zero-filled.
2. Show the three original responses immediately. Offer context discussion and planning on this same page without requiring navigation through them. Discuss relevant context before choosing a plan. Discuss sitting situations, work/caring/travel constraints, health or mobility, environment, and available support. All context is optional, not scored. The person may discuss it without entering notes. A period note is a discussion annotation, not a new recall rule or retrospective assessment date.
3. Choose a manageable next step with the person, including maintaining an existing behavior or making no new plan. No automatic lowest-score priority, activity dose, clinical risk class, or follow-up interval.
4. Review, then optionally copy or print the original responses, context choices and plan. Clearly distinguish fictional examples. Show instrument, dialogue and Web versions. Changing instrument answers or recording mode clears downstream notes and plans with an advance warning. Editing optional context notes preserves an existing plan and flags it for explicit review; the pending-review label is included in copies and prints and does not block them.

## Reference score

Keep the exact v1.0 categorical sum (30 + 30 + 40 maximum), only as a collapsed reference when all three instrument responses exist. Retain original scoring code for compatibility but do not present its historical low/middle/high labels or use 35/60 as decision thresholds. No percent-health gauge, interpolation, 1-point precision, automatic continuous-time category assignment or new clinical threshold.

The 64 complete response combinations produce only 11 totals (0, 10, ..., 100). Displaying 1–100 would add no measurement information. More useful detail can come from unscored actual circumstances and the person's own explanation. Same totals can represent quite different behaviors, including a 60-point pattern with long sitting.

Fractional times in gaps between legacy categories remain unresolved (e.g. 3.5, 5.5, 7.5 hours/day; 30.5 minutes/week). Do not silently round, interpolate or force an uncertain answer. A future rule requires a separately approved instrument version, specified boundaries, evidence and compatibility evaluation.

## Scientific boundaries

Original WPTI, Quick v1.0, the NHANES implementation, and this dialogue workflow are different objects. Original WPTI uses continuous survey variables, fixed preprocessing and PCA-derived coefficients; Quick is a categorical sum. Published-original numerical reproducibility does not prove correct methods, item equivalence, Quick validity or practical benefit.

Past paper errors need an author/publisher response based on the audited calculations and affected claims. Neither a different display nor a future finer scale retrospectively corrects a publication. This prototype does not alter the submitted manuscript, original data, scoring constants, archives or past evaluations.

## Privacy and use

All answers/context/plan stay in browser memory. No identifiers requested. No account, API endpoint, database, localStorage, analytics or automatic feedback submission. The previous Vercel Analytics client is removed. This does not claim a hosting provider keeps no ordinary HTTP access logs. Copy and print are explicit user actions; their files/clipboard and any subsequent sharing are controlled outside the app.

Shared-device use requires clearing the session after each person. Do not record identifiable health information in free text. A page reload clears the app state. A browser restore/OS screenshot/clipboard is not a secure research record or guaranteed secure erasure.

The verified professional-survey approval does not by itself establish permission for collecting health-class participant comments or clinical information. Before any research collection: confirm the approved protocol, participants, new fields, purpose, consent, retention/access rules and ethics amendment requirements. Consent to care/discussion, consent to enter or keep notes, and research participation are distinct. The prototype is not evidence of a completed field study.

## Staged path

- Stage 0, preservation/audit: baseline commit, source ZIP, Git history bundle, existing manuscript identity and aggregate scientific audit. Completed locally; originals read-only.
- Stage 1, this candidate: dialogue interface, unchanged legacy scoring, explicit missingness, privacy and synthetic regression/UI verification. Implemented and reviewable.
- Stage 2, before release: author review of the workflow and text; publication decision; verified rollback archive; Japanese/English and real-device/print QA as appropriate. Do not merge or deploy solely because local tests pass.
- Stage 3, before field evaluation: confirm ethics/consent scope and prospectively specify feasibility questions (burden, understandability, continued use, comparative usefulness), measures, dates and software version. Do not count prototype tests as participant evidence.
- Stage 4, any measurement redevelopment: separately version an explicit construct/input/normalization/missingness/rounding model; prospectively evaluate reliability, validity, responsiveness and interpretability. No assumed 1-point meaning, MIC or clinical cutoffs; do not relabel old categorical data as continuous observations.

## Rollback and release

Baseline public repository: shinyu-kise/wpti-quick-web, commit d470d06d836e529db96fd4d77ce4aaa0a02e6fce. The read-back production page displayed Web 1.2-rc.1 on 2026-10-23. Baseline source and full public Git history are preserved separately in this task's outputs; research data are excluded.

The author explicitly authorized publication on 2026-10-23, conditional on completing the remaining display/print checks and retaining the previous version. Preserve the archives and source hashes, verify build/deployment identity and live behavior, and retain the ability to redeploy the baseline. Do not rewrite historical tags or substitute new screenshots for evidence from the submitted study period.
