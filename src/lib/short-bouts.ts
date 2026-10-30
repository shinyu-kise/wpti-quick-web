import type { Language, QuestionId } from "./types.ts";

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
      title: "昼食後などに歩く",
      action: "昼食後などに、無理のない範囲で5分ほど歩く。",
      context: "都合のよい時間を選んでください"
    },
    {
      id: "transport",
      title: "出かけるときに少し多く歩く",
      action: "通勤や買い物で、歩く時間を2〜5分ほど増やす。",
      context: "天気や道の安全を確かめてください"
    },
    {
      id: "sedentary",
      title: "座っている合間に立つ・歩く",
      action: "座り続けているとき、できれば立つか、室内を1〜2分歩く。",
      context: "休息が必要なときは、無理に立たなくて大丈夫です"
    }
  ],
  en: [
    {
      id: "leisure",
      title: "Leisure: fit in a brief walk",
      action: "Try a comfortable walk for about five minutes after lunch or at another convenient time.",
      context: "Choose an opportunity already present in daily life"
    },
    {
      id: "transport",
      title: "Travel: add a little walking",
      action: "Try adding about two to five minutes of walking during a trip to work or the shops.",
      context: "Consider the route, weather and safe footing"
    },
    {
      id: "sedentary",
      title: "Sitting: interrupt a long spell",
      action: "If feasible, stand up or walk indoors for one to two minutes during a long sitting period.",
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
