import type {
  AnswerMap,
  CompleteAnswerMap,
  DomainScores,
  OptionId,
  QuestionId,
  ScoreBand,
  ScoreResult
} from "./types.ts";

export const QUESTION_ORDER: QuestionId[] = ["leisure", "transport", "sedentary"];

export const DOMAIN_MAX: DomainScores = {
  leisure: 30,
  transport: 30,
  sedentary: 40
};

type OptionScoreDefinition = {
  questionId: QuestionId;
  points: number;
};

// Fixed WPTI-Quick v1.0 scoring table. Do not modify wording, options, or points
// without changing the validated instrument specification.
export const OPTION_SCORES: Record<OptionId, OptionScoreDefinition> = {
  leisure_0_30: { questionId: "leisure", points: 0 },
  leisure_31_90: { questionId: "leisure", points: 10 },
  leisure_91_150: { questionId: "leisure", points: 20 },
  leisure_151_plus: { questionId: "leisure", points: 30 },
  transport_0_30: { questionId: "transport", points: 0 },
  transport_31_90: { questionId: "transport", points: 10 },
  transport_91_150: { questionId: "transport", points: 20 },
  transport_151_plus: { questionId: "transport", points: 30 },
  sedentary_8_plus: { questionId: "sedentary", points: 0 },
  sedentary_6_7: { questionId: "sedentary", points: 10 },
  sedentary_4_5: { questionId: "sedentary", points: 20 },
  sedentary_3_or_less: { questionId: "sedentary", points: 40 }
};

export function getOptionPoints(optionId: OptionId): number {
  return OPTION_SCORES[optionId].points;
}

export function getMissingQuestions(answers: AnswerMap): QuestionId[] {
  return QUESTION_ORDER.filter((questionId) => answers[questionId] === undefined);
}

export function isCompleteAnswerMap(answers: AnswerMap): answers is CompleteAnswerMap {
  return getMissingQuestions(answers).length === 0;
}

export function getScoreBand(total: number): ScoreBand {
  if (total <= 34) {
    return "low";
  }

  if (total <= 59) {
    return "middle";
  }

  return "high";
}

export function calculateScores(answers: AnswerMap): ScoreResult {
  if (!isCompleteAnswerMap(answers)) {
    const missing = getMissingQuestions(answers).join(", ");
    throw new Error(`Cannot calculate WPTI-Quick score. Missing answers: ${missing}`);
  }

  const domainScores = QUESTION_ORDER.reduce<DomainScores>(
    (scores, questionId) => {
      const optionId = answers[questionId];
      const optionScore = OPTION_SCORES[optionId];

      if (optionScore.questionId !== questionId) {
        throw new Error(`Answer ${optionId} does not belong to question ${questionId}`);
      }

      return {
        ...scores,
        [questionId]: optionScore.points
      };
    },
    {
      leisure: 0,
      transport: 0,
      sedentary: 0
    }
  );

  const total = QUESTION_ORDER.reduce((sum, questionId) => sum + domainScores[questionId], 0);

  return {
    total,
    domainScores,
    band: getScoreBand(total)
  };
}
