export const languages = ["ja", "en"] as const;
export type Language = (typeof languages)[number];

export const questionIds = ["leisure", "transport", "sedentary"] as const;
export type QuestionId = (typeof questionIds)[number];

export type LeisureOptionId =
  | "leisure_0_30"
  | "leisure_31_90"
  | "leisure_91_150"
  | "leisure_151_plus";

export type TransportOptionId =
  | "transport_0_30"
  | "transport_31_90"
  | "transport_91_150"
  | "transport_151_plus";

export type SedentaryOptionId =
  | "sedentary_8_plus"
  | "sedentary_6_7"
  | "sedentary_4_5"
  | "sedentary_3_or_less";

export type OptionId = LeisureOptionId | TransportOptionId | SedentaryOptionId;

export type AnswerMap = Partial<Record<QuestionId, OptionId>>;
export type CompleteAnswerMap = Record<QuestionId, OptionId>;

export type DomainScores = Record<QuestionId, number>;
export type ScoreBand = "low" | "middle" | "high";

export type ScoreResult = {
  total: number;
  domainScores: DomainScores;
  band: ScoreBand;
};
