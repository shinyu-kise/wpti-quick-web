import { copy } from "./i18n.ts";
import { calculateScores, QUESTION_ORDER } from "./scoring.ts";
import type { AnswerMap, Language, QuestionId } from "./types.ts";

export const WEB_VERSION = "1.1";
export const INSTRUMENT_VERSION = "1.0";
export const PAPER_URL = "https://pubmed.ncbi.nlm.nih.gov/41606948/";

export type ActionPlan = {
  domain: QuestionId | "";
  action: string;
  when: string;
  review: string;
};
export const emptyPlan: ActionPlan = { domain: "", action: "", when: "", review: "" };

// Recall support only: no conversion to response categories or score thresholds.
export function weeklyMinutes(days: string, minutes: string): number | null {
  if (!days.trim() || !minutes.trim()) return null;
  const d = Number(days);
  const m = Number(minutes);
  if (!Number.isInteger(d) || d < 0 || d > 7 || !Number.isFinite(m) || m < 0 || m > 1440) return null;
  return Math.round(d * m * 10) / 10;
}

export function responseLabel(answers: AnswerMap, id: QuestionId, language: Language): string {
  return copy[language].questions.find(q => q.id === id)?.options.find(o => o.id === answers[id])?.label ?? "—";
}

export function buildSummary(answers: AnswerMap, plan: ActionPlan, language: Language, date: string, demo: boolean): string {
  const t = copy[language];
  const result = calculateScores(answers);
  const ja = language === "ja";
  return [
    `WPTI-Quick v${INSTRUMENT_VERSION} / Web v${WEB_VERSION}`,
    demo ? (ja ? "入力例（架空の回答・本人の結果ではありません）" : "Example only — fictional responses") : "",
    `${t.results.date}: ${date}`,
    `${t.results.totalScore}: ${result.total}/100`,
    ...QUESTION_ORDER.map(id => `${t.domainLabels[id]}: ${responseLabel(answers, id, language)} (${result.domainScores[id]} ${t.common.points})`),
    "",
    ja ? "本人が選んだ取り組み（任意・採点対象外）" : "Self-selected plan (optional; not scored)",
    plan.domain ? t.domainLabels[plan.domain] : (ja ? "未選択" : "Not selected"),
    `${ja ? "取り組むこと" : "Action"}: ${plan.action || "—"}`,
    `${ja ? "いつ・どこで" : "When / where"}: ${plan.when || "—"}`,
    `${ja ? "振り返る日" : "Review date"}: ${plan.review || "—"}`,
    "",
    ja ? "Quickは原著WPTIの考え方に基づく別の簡易採点です。原著の判定性能・閾値をQuickに直接適用できません。点数は健康度の割合や診断、WHO基準達成、介入効果を示しません。" : "Quick uses a separate simplified scoring method. The original WPTI's accuracy and thresholds do not directly apply. Scores are not a percentage of health, a diagnosis, WHO guideline attainment, or evidence of intervention benefit.",
    t.citation.text,
    PAPER_URL
  ].filter(line => line !== "").join("\n");
}
