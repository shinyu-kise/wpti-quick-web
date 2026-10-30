import { copy } from "./i18n.ts";
import { CONTEXT_FIELDS, referenceScore } from "./dialogue.ts";
import type { DialogueSession, NonresponseMap } from "./dialogue.ts";
import { QUESTION_ORDER } from "./scoring.ts";
import type { AnswerMap, Language, QuestionId } from "./types.ts";
import { workflowCopy } from "./workflow-copy.ts";

export { emptyPlan } from "./dialogue.ts";
export type { ActionPlan } from "./dialogue.ts";
export const WEB_VERSION = "1.8.0-dialogue-rc.1";
export const INSTRUMENT_VERSION = "1.0";
export const DIALOGUE_VERSION = "1.3-prototype";
export const PAPER_URL = "https://pubmed.ncbi.nlm.nih.gov/41606948/";

// Recall support only: no conversion to response categories or score thresholds.
export function weeklyMinutes(days: string, minutes: string): number | null {
  if (!days.trim() || !minutes.trim()) return null;
  const d = Number(days);
  const m = Number(minutes);
  if (!Number.isInteger(d) || d < 0 || d > 7 || !Number.isFinite(m) || m < 0 || m > 1440) return null;
  // Keep decimal input as entered: rounding here could silently move a value
  // into a Quick category across an unresolved boundary (e.g. 30.04 -> 30).
  return d * m;
}

export function responseLabel(answers: AnswerMap, id: QuestionId, language: Language, nonresponses: NonresponseMap = {}): string {
  const option = copy[language].questions.find(q => q.id === id)?.options.find(o => o.id === answers[id]);
  if (option) return option.label;
  const status = nonresponses[id];
  return status ? workflowCopy[language].nonresponses[status] : workflowCopy[language].unanswered;
}

export function buildSummary(session: DialogueSession, language: Language, date: string): string {
  const t = copy[language];
  const w = workflowCopy[language];
  const result = referenceScore(session.answers);
  const { context, plan } = session;
  const notes = context.mode === "notes";
  return [
    `WPTI-Quick v${INSTRUMENT_VERSION} / Dialogue v${DIALOGUE_VERSION} / Web v${WEB_VERSION}`,
    session.demo ? w.example : "",
    `${t.results.date}: ${date}`,
    w.profileTitle,
    t.assessment.recallPeriod,
    ...QUESTION_ORDER.map(id => `${t.domainLabels[id]}: ${responseLabel(session.answers, id, language, session.nonresponses)}`),
    w.profileNote,
    "",
    w.contextTitle,
    ...(notes ? CONTEXT_FIELDS.map(field => `${w.contextLabels[field]}: ${context[field] || w.notEntered}`) : [w.notRecorded]),
    w.periodNote,
    "",
    w.planTitle,
    ...(notes ? [
      plan.choice ? w.planChoices[plan.choice] : w.notEntered,
      session.planNeedsReview ? w.planReviewPending : "",
      ...(["change", "maintain"].includes(plan.choice) ? [
        ...(plan.domain ? [`${w.choose}: ${plan.domain === "other" ? w.otherDomain : t.domainLabels[plan.domain]}`] : []),
        `${w.action}: ${plan.action || w.notEntered}`,
        `${w.when}: ${plan.when || w.notEntered}`,
        `${w.support}: ${plan.support || w.notEntered}`,
        `${w.review}: ${plan.review || w.notEntered}`
      ] : [])
    ] : [w.notRecorded]),
    "",
    result ? `${language === "ja" ? "参考点（Quick v1.0）" : "Reference total (Quick v1.0)"}: ${result.total}/100` : w.scoreUnavailable,
    w.referenceNote,
    w.boundary,
    w.reviewNote,
    "",
    t.citation.text,
    PAPER_URL
  ].join("\n");
}
