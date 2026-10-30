import type { DomainFeedback } from "./domain-feedback.ts";
import type { Language } from "./types.ts";

export const domainFeedbackCopy = {
  ja: {
    title: "3つの点数", candidate: "見直す候補", noScore: "点数なし",
    names: { leisure: "余暇・運動での身体活動", transport: "歩きや自転車での移動", sedentary: "座る・横になる時間" },
    allMax: "3つとも、この採点では満点です。",
    allTied: "3つとも見直す候補です。",
    incomplete: "選ばれた時間だけでは、3つを比べられません。",
    choose: "できそうな項目から考えてみましょう。",
    comparison: "それぞれの満点に対する点数で比べています。",
    limitation: "点数だけで、健康上の不足は判断できません。",
    method: "満点は、余暇・運動での身体活動30点・移動30点・座る時間40点です。それぞれの満点に対する点数を比べ、最も低い項目を「見直す候補」としています。同じ場合はすべて示します。3つとも満点の場合は、候補を示しません。余暇・運動や移動で体を動かす時間は長いほど、座る時間は短いほど点数が高くなります。",
    missing: "「わからない」「答えない」や未回答は、0点ではありません。回答できる範囲で大丈夫です。",
    hints: {
      leisure: "仕事の後や休日などに、どんな活動・運動ができそうですか？",
      transport: "通勤や買い物で、歩きや自転車で移動できそうな場面はありますか？",
      sedentary: "仕事中や自宅で、長く座り続ける場面はありますか？"
    }
  },
  en: {
    title: "Your three item scores", candidate: "Area to reflect on", noScore: "Not scored",
    names: { leisure: "Leisure and exercise physical activity", transport: "Walking or cycling for travel", sedentary: "Sitting or lying down" },
    allMax: "All three responses receive the maximum points in this scoring system.",
    allTied: "All three areas are candidates for reflection.",
    incomplete: "The selected times are not enough to compare all three areas.",
    choose: "Start with whichever feels manageable for you.",
    comparison: "Each score is compared with its own maximum.",
    limitation: "Scores alone cannot establish a health-related deficiency.",
    method: "The maxima are 30 points for leisure, 30 for travel and 40 for sitting. Each score is compared with its own maximum; the lowest proportion identifies an area to reflect on. All ties are shown, except that no candidate is shown when all three items receive maximum points. Longer activity or travel time and shorter sitting time receive higher points.",
    missing: "Unsure, declined and unanswered items are not zero points. Answer only what you can.",
    hints: {
      leisure: "What activity or exercise could fit after work, on days off, or in other free time?",
      transport: "Could walking or cycling fit into journeys to work or the shops?",
      sedentary: "When do you sit for a long time without a break, at work or at home?"
    }
  }
} as const;

export function domainFeedbackMessage(feedback: DomainFeedback, language: Language): string {
  const c = domainFeedbackCopy[language];
  if (feedback.status === "incomplete") return c.incomplete;
  if (feedback.status === "all-max") return c.allMax;
  if (feedback.focusIds.length === 3) return c.allTied;
  return `${c.candidate}${language === "ja" ? "：" : ": "}${feedback.focusIds.map(id => c.names[id]).join(language === "ja" ? "・" : " / ")}`;
}
