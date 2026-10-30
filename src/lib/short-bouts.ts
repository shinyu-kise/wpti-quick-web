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
      title: "余暇：生活の合間に歩く",
      action: "昼食後などに、無理のない範囲で5分ほど歩いてみる。",
      context: "時間をまとめて取らず、生活にある機会を選ぶ"
    },
    {
      id: "transport",
      title: "移動：歩く部分を少し足す",
      action: "通勤や買い物の移動で、歩く時間を2〜5分ほど増やしてみる。",
      context: "天候、移動経路、足元の安全を踏まえて選ぶ"
    },
    {
      id: "sedentary",
      title: "座位：座り続ける時間を区切る",
      action: "座り続けているとき、可能なら立つ・室内を1〜2分歩いてみる。",
      context: "必要な休息は保ち、無理に中断しない"
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
  { url: "https://pubmed.ncbi.nlm.nih.gov/29567764/", label: "Saint-Maurice et al. (2018), activity bouts and mortality" },
  { url: "https://pubmed.ncbi.nlm.nih.gov/36482104/", label: "Stamatakis et al. (2022), brief vigorous activity" }
] as const;
