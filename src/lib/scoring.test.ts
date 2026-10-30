import assert from "node:assert/strict";
import test from "node:test";

import { calculateScores, getDiscussionFocusQuestions, getMissingQuestions, getScoreBand } from "./scoring.ts";
import type { AnswerMap, CompleteAnswerMap, QuestionId } from "./types.ts";

// Independent, literal expectations for the unchanged Quick v1.0 instrument.
// Do not derive these values from the production scoring table.
const fixedOptions = {
  leisure: [
    ["leisure_0_30", 0],
    ["leisure_31_90", 10],
    ["leisure_91_150", 20],
    ["leisure_151_plus", 30]
  ],
  transport: [
    ["transport_0_30", 0],
    ["transport_31_90", 10],
    ["transport_91_150", 20],
    ["transport_151_plus", 30]
  ],
  sedentary: [
    ["sedentary_8_plus", 0],
    ["sedentary_6_7", 10],
    ["sedentary_4_5", 20],
    ["sedentary_3_or_less", 40]
  ]
} as const;

test("preserves literal Quick v1.0 domain points and totals for all 64 complete answer combinations", () => {
  let checked = 0;

  for (const [leisure, leisurePoints] of fixedOptions.leisure) {
    for (const [transport, transportPoints] of fixedOptions.transport) {
      for (const [sedentary, sedentaryPoints] of fixedOptions.sedentary) {
        const answers = { leisure, transport, sedentary };
        const result = calculateScores(answers);
        assert.deepEqual(result.domainScores, {
          leisure: leisurePoints,
          transport: transportPoints,
          sedentary: sedentaryPoints
        }, JSON.stringify(answers));
        assert.equal(result.total, leisurePoints + transportPoints + sedentaryPoints, JSON.stringify(answers));
        const expectedTotal = leisurePoints + transportPoints + sedentaryPoints;
        assert.equal(result.band, expectedTotal <= 34 ? "low" : expectedTotal <= 59 ? "middle" : "high", JSON.stringify(answers));
        assert.deepEqual(getMissingQuestions(answers), []);
        checked += 1;
      }
    }
  }

  assert.equal(checked, 64);
});

test("rejects all 61 incomplete combinations and reports missing domains in question order", () => {
  const leisureOptions = [undefined, ...fixedOptions.leisure.map(([id]) => id)];
  const transportOptions = [undefined, ...fixedOptions.transport.map(([id]) => id)];
  const sedentaryOptions = [undefined, ...fixedOptions.sedentary.map(([id]) => id)];
  let checked = 0;

  for (const leisure of leisureOptions) {
    for (const transport of transportOptions) {
      for (const sedentary of sedentaryOptions) {
        if (leisure && transport && sedentary) continue;

        const answers: AnswerMap = {};
        const missing: QuestionId[] = [];
        if (leisure) answers.leisure = leisure;
        else missing.push("leisure");
        if (transport) answers.transport = transport;
        else missing.push("transport");
        if (sedentary) answers.sedentary = sedentary;
        else missing.push("sedentary");

        assert.deepEqual(getMissingQuestions(answers), missing, JSON.stringify(answers));
        assert.throws(() => calculateScores(answers), {
          message: `Cannot calculate WPTI-Quick score. Missing answers: ${missing.join(", ")}`
        });
        checked += 1;
      }
    }
  }

  assert.equal(checked, 61);
});

test("rejects each of the 24 single substitutions from another question domain", () => {
  const validAnswers: CompleteAnswerMap = {
    leisure: "leisure_0_30",
    transport: "transport_0_30",
    sedentary: "sedentary_8_plus"
  };
  const domains: QuestionId[] = ["leisure", "transport", "sedentary"];
  let checked = 0;

  for (const questionId of domains) {
    for (const sourceDomain of domains) {
      if (sourceDomain === questionId) continue;

      for (const [optionId] of fixedOptions[sourceDomain]) {
        const answers: CompleteAnswerMap = { ...validAnswers, [questionId]: optionId };
        assert.throws(() => calculateScores(answers), {
          message: `Answer ${optionId} does not belong to question ${questionId}`
        });
        checked += 1;
      }
    }
  }

  assert.equal(checked, 24);
});

test("calculates the minimum possible WPTI-Quick score", () => {
  const result = calculateScores({
    leisure: "leisure_0_30",
    transport: "transport_0_30",
    sedentary: "sedentary_8_plus"
  });

  assert.equal(result.total, 0);
  assert.deepEqual(result.domainScores, {
    leisure: 0,
    transport: 0,
    sedentary: 0
  });
  assert.equal(result.band, "low");
});

test("calculates the maximum possible WPTI-Quick score", () => {
  const result = calculateScores({
    leisure: "leisure_151_plus",
    transport: "transport_151_plus",
    sedentary: "sedentary_3_or_less"
  });

  assert.equal(result.total, 100);
  assert.deepEqual(result.domainScores, {
    leisure: 30,
    transport: 30,
    sedentary: 40
  });
  assert.equal(result.band, "high");
});

test("preserves internal legacy score band boundaries for compatibility", () => {
  assert.equal(getScoreBand(34), "low");
  assert.equal(getScoreBand(35), "middle");
  assert.equal(getScoreBand(59), "middle");
  assert.equal(getScoreBand(60), "high");
});

test("reports missing questions before calculation", () => {
  const answers = {
    leisure: "leisure_31_90"
  } as const;

  assert.deepEqual(getMissingQuestions(answers), ["transport", "sedentary"]);
  assert.throws(() => calculateScores(answers), /Missing answers: transport, sedentary/);
});

test("identifies all three domains when all relative scores are lowest", () => {
  const result = calculateScores({
    leisure: "leisure_0_30",
    transport: "transport_0_30",
    sedentary: "sedentary_8_plus"
  });

  assert.deepEqual(getDiscussionFocusQuestions(result.domainScores), ["leisure", "transport", "sedentary"]);
});

test("identifies one discussion focus when one relative score is lowest", () => {
  const result = calculateScores({
    leisure: "leisure_151_plus",
    transport: "transport_0_30",
    sedentary: "sedentary_3_or_less"
  });

  assert.deepEqual(getDiscussionFocusQuestions(result.domainScores), ["transport"]);
});

test("identifies tied discussion focus domains", () => {
  const result = calculateScores({
    leisure: "leisure_31_90",
    transport: "transport_31_90",
    sedentary: "sedentary_4_5"
  });

  assert.deepEqual(getDiscussionFocusQuestions(result.domainScores), ["leisure", "transport"]);
});
