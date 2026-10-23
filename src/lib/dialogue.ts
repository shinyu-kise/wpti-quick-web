import { calculateScores, isCompleteAnswerMap } from "./scoring.ts";
import type { AnswerMap, OptionId, QuestionId } from "./types.ts";

// These states belong to dialogue support, never to the Quick v1.0 instrument.
export type Nonresponse = "unsure" | "unable";
export type NonresponseMap = Partial<Record<QuestionId, Nonresponse>>;
export type ContextMode = "" | "notes" | "talk-only";
export const CONTEXT_FIELDS = ["period", "sitting", "demands", "healthMobility", "environment", "supports"] as const;
export type ContextField = (typeof CONTEXT_FIELDS)[number];
export type LifeContext = { mode: ContextMode } & Record<ContextField, string>;
export type PlanChoice = "" | "change" | "maintain" | "none";
export type ActionPlan = {
  choice: PlanChoice;
  domain: QuestionId | "other" | "";
  action: string;
  when: string;
  support: string;
  review: string;
};
export const emptyContext: LifeContext = { mode: "", period: "", sitting: "", demands: "", healthMobility: "", environment: "", supports: "" };
export const emptyPlan: ActionPlan = { choice: "", domain: "", action: "", when: "", support: "", review: "" };
export type DialogueSession = {
  answers: AnswerMap;
  nonresponses: NonresponseMap;
  context: LifeContext;
  contextReviewed: boolean;
  plan: ActionPlan;
  demo: boolean;
};

export function createSession(): DialogueSession {
  return { answers: {}, nonresponses: {}, context: { ...emptyContext }, contextReviewed: false, plan: { ...emptyPlan }, demo: false };
}

export type DialogueAction =
  | { type: "answer"; questionId: QuestionId; optionId: OptionId }
  | { type: "nonresponse"; questionId: QuestionId; value: Nonresponse | "" }
  | { type: "contextMode"; mode: ContextMode }
  | { type: "contextField"; field: ContextField; value: string }
  | { type: "reviewContext" }
  | { type: "planChoice"; choice: PlanChoice }
  | { type: "planDomain"; domain: ActionPlan["domain"] }
  | { type: "planField"; field: "action" | "when" | "support" | "review"; value: string }
  | { type: "reset" }
  | { type: "example" };

function invalidateFollowingSteps(session: DialogueSession): DialogueSession {
  return { ...session, context: { ...emptyContext }, contextReviewed: false, plan: { ...emptyPlan } };
}

// A changed upstream response must not retain an apparently agreed downstream plan.
export function dialogueReducer(session: DialogueSession, action: DialogueAction): DialogueSession {
  switch (action.type) {
    case "reset": return createSession();
    case "example": return {
      ...createSession(),
      answers: { leisure: "leisure_151_plus", transport: "transport_151_plus", sedentary: "sedentary_8_plus" },
      demo: true
    };
    case "answer": {
      if (session.answers[action.questionId] === action.optionId) return session;
      const nonresponses = { ...session.nonresponses };
      delete nonresponses[action.questionId];
      return invalidateFollowingSteps({ ...session, answers: { ...session.answers, [action.questionId]: action.optionId }, nonresponses });
    }
    case "nonresponse": {
      if (!session.answers[action.questionId] && (session.nonresponses[action.questionId] ?? "") === action.value) return session;
      const answers = { ...session.answers };
      const nonresponses = { ...session.nonresponses };
      delete answers[action.questionId];
      if (action.value) nonresponses[action.questionId] = action.value;
      else delete nonresponses[action.questionId];
      return invalidateFollowingSteps({ ...session, answers, nonresponses });
    }
    case "contextMode":
      if (session.context.mode === action.mode) return session;
      // Switching to talk-only erases every previously entered note.
      return { ...session, context: { ...emptyContext, mode: action.mode }, contextReviewed: false, plan: { ...emptyPlan } };
    case "contextField":
      if (session.context.mode !== "notes" || session.context[action.field] === action.value) return session;
      return { ...session, context: { ...session.context, [action.field]: action.value }, contextReviewed: false, plan: { ...emptyPlan } };
    case "reviewContext":
      return session.context.mode ? { ...session, contextReviewed: true } : session;
    case "planChoice":
      if (!session.contextReviewed || session.context.mode !== "notes" || session.plan.choice === action.choice) return session;
      return { ...session, plan: { ...emptyPlan, choice: action.choice } };
    case "planDomain":
      if (!session.contextReviewed || session.context.mode !== "notes" || !["change", "maintain"].includes(session.plan.choice) || session.plan.domain === action.domain) return session;
      return { ...session, plan: { ...emptyPlan, choice: session.plan.choice, domain: action.domain } };
    case "planField":
      if (!session.contextReviewed || session.context.mode !== "notes" || !["change", "maintain"].includes(session.plan.choice)) return session;
      return { ...session, plan: { ...session.plan, [action.field]: action.value } };
  }
}

export function referenceScore(answers: AnswerMap) {
  return isCompleteAnswerMap(answers) ? calculateScores(answers) : null;
}
