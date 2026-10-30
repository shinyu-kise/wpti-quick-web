import type { AnswerMap, Language, QuestionId } from "./types.ts";
import { getDomainFeedback } from "./domain-feedback.ts";
import { QUESTION_ORDER } from "./scoring.ts";

export type ActionIdeaGroups = {
  status: "incomplete" | "all-max" | "comparable";
  primaryIds: QuestionId[];
  otherIds: QuestionId[];
};

// Reuse the existing comparison only to organize examples, not to prescribe
// activity or add a clinical priority. Missing answers never create a focus.
export function getActionIdeaGroups(answers: AnswerMap): ActionIdeaGroups {
  const feedback = getDomainFeedback(answers);
  if (feedback.status === "incomplete") {
    return { status: feedback.status, primaryIds: [...QUESTION_ORDER], otherIds: [] };
  }
  if (feedback.status === "all-max") {
    return { status: feedback.status, primaryIds: [], otherIds: [...QUESTION_ORDER] };
  }
  return {
    status: feedback.status,
    primaryIds: QUESTION_ORDER.filter(id => feedback.focusIds.includes(id)),
    otherIds: QUESTION_ORDER.filter(id => !feedback.focusIds.includes(id))
  };
}

// Conversation prompts, not WPTI-Quick items, scored responses, or exercise prescriptions.
// Durations below are illustrative starting points to be agreed with the participant.
export type ShortBoutIdea = {
  id: QuestionId;
  title: string;
  action: string;
  context: string;
};

export const SHORT_BOUT_IDEAS: Record<Language, readonly ShortBoutIdea[]> = {
  ja: [
    {
      id: "leisure",
      title: "仕事の後や休日に歩く",
      action: "仕事の後や休日の空き時間に、5分ほど歩く。",
      context: "生活リズムや体調に合わせて、時間や歩く速さを選んでください"
    },
    {
      id: "transport",
      title: "通勤や買い物で歩く時間を増やす",
      action: "通勤や買い物で、歩く時間を2〜5分ほど増やす。",
      context: "天気や道の安全を確かめてください"
    },
    {
      id: "sedentary",
      title: "仕事や動画視聴の合間に立つ・歩く",
      action: "デスクワークや動画視聴で座り続けたら、立つか、1〜2分歩く。",
      context: "休息が必要なときは、無理に立たなくて大丈夫です"
    }
  ],
  en: [
    {
      id: "leisure",
      title: "Walk after work or on a day off",
      action: "Walk for about five minutes in free time after work or on a day off.",
      context: "Choose a time and pace that suit your routine and health"
    },
    {
      id: "transport",
      title: "Add walking to commuting or shopping",
      action: "Try adding about two to five minutes of walking during a trip to work or the shops.",
      context: "Consider the route, weather and safe footing"
    },
    {
      id: "sedentary",
      title: "Stand or walk between work tasks or videos",
      action: "After sitting for a long stretch at a desk or watching videos, stand or walk for one to two minutes.",
      context: "Keep any rest that is needed; do not force breaks"
    }
  ]
};

export const SHORT_BOUT_REFERENCES = [
  { url: "https://pubmed.ncbi.nlm.nih.gov/33239350/", label: "Bull et al. (2020), WHO guidelines" },
  { url: "https://pubmed.ncbi.nlm.nih.gov/29567764/", label: "Saint-Maurice et al. (2018), moderate-to-vigorous activity bouts and mortality" },
  { url: "https://pubmed.ncbi.nlm.nih.gov/36482104/", label: "Stamatakis et al. (2022), VILPA and mortality" },
  { url: "https://pubmed.ncbi.nlm.nih.gov/22374636/", label: "Dunstan et al. (2012), walking breaks and post-meal glucose and insulin" }
] as const;
