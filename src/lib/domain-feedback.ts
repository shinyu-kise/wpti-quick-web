import { DOMAIN_MAX, getDiscussionFocusQuestions, OPTION_SCORES, QUESTION_ORDER } from "./scoring.ts";
import type { AnswerMap, QuestionId } from "./types.ts";

export type DomainFeedback = {
  domains: Record<QuestionId, { points: number | null; max: number }>;
  status: "incomplete" | "all-max" | "comparable";
  focusIds: QuestionId[];
  unscoredIds: QuestionId[];
};

// Describes the existing item points. It does not classify health, activity
// sufficiency, or clinical priority, and never fills missing responses with zero.
export function getDomainFeedback(answers: AnswerMap): DomainFeedback {
  function domain(id: QuestionId) {
    const optionId = answers[id];
    const option = optionId ? OPTION_SCORES[optionId] : undefined;
    return { points: option?.questionId === id ? option.points : null, max: DOMAIN_MAX[id] };
  }

  const domains = { leisure: domain("leisure"), transport: domain("transport"), sedentary: domain("sedentary") };
  const unscoredIds = QUESTION_ORDER.filter(id => domains[id].points === null);
  const leisure = domains.leisure.points;
  const transport = domains.transport.points;
  const sedentary = domains.sedentary.points;

  if (leisure === null || transport === null || sedentary === null) {
    return { domains, status: "incomplete", focusIds: [], unscoredIds };
  }

  const scores = { leisure, transport, sedentary };
  if (QUESTION_ORDER.every(id => scores[id] === DOMAIN_MAX[id])) {
    return { domains, status: "all-max", focusIds: [], unscoredIds };
  }

  return {
    domains,
    status: "comparable",
    focusIds: getDiscussionFocusQuestions(scores),
    unscoredIds
  };
}
