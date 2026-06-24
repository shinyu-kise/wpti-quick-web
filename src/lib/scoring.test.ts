import assert from "node:assert/strict";
import test from "node:test";

import { calculateScores, getDiscussionFocusQuestions, getMissingQuestions, getScoreBand } from "./scoring.ts";

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

test("uses the requested score band thresholds", () => {
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
