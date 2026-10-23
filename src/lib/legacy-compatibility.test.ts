import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createSession } from "./dialogue.ts";
import { copy } from "./i18n.ts";
import { buildSummary } from "./practice.ts";
import { calculateScores } from "./scoring.ts";
import type { QuestionCopy } from "./i18n.ts";
import type { Language } from "./types.ts";

// Public item copy captured from git d470d06, not from the evolving UI.
// Changes require a separately named instrument revision, not snapshot refresh.
const legacy = JSON.parse(
  readFileSync(new URL("../../tests/legacy-instrument-v1.json", import.meta.url), "utf8")
) as {
  sourceCommit: string;
  questions: Record<Language, QuestionCopy[]>;
};

// Administration time frame was present in baseline d470d06 and in the
// submitted report. Context discussion must not silently replace that period.
const recallPeriod = {
  ja: "過去1週間の平均的な状況",
  en: "average situation during the past 1 week"
} as const;
const recallExportLine = {
  ja: "Quick v1.0の回答の想起期間：過去1週間の平均的な状況",
  en: "Quick v1.0 response recall period: average situation during the past 1 week"
} as const;

for (const language of ["ja", "en"] as const) {
  test(`preserves exact Quick v1.0 questions and response options in ${language}`, () => {
    assert.equal(legacy.sourceCommit, "d470d06d836e529db96fd4d77ce4aaa0a02e6fce");
    assert.deepEqual(copy[language].questions, legacy.questions[language]);
  });

  test(`preserves the baseline one-week recall instruction in ${language}`, () => {
    assert.ok(copy[language].assessment.intro.includes(recallPeriod[language]));
    assert.ok(copy[language].howTo.bullets.some(line => line.includes(recallPeriod[language])));
  });

  test(`exports the instrument recall period separately from discussion context in ${language}`, () => {
    const session = createSession();
    session.context.mode = "notes";
    session.context.period = "CONTEXT_PERIOD_ONLY";
    session.contextReviewed = true;
    const summary = buildSummary(session, language, "2026-10-23");
    assert.ok(summary.split("\n").includes(recallExportLine[language]));
    assert.ok(summary.includes("CONTEXT_PERIOD_ONLY"));
  });
}

test("Quick v1.0 has exactly 11 attainable totals, with no one-point precision", () => {
  // Explicit original options: avoid deriving the tested domain space from
  // production OPTION_SCORES, which could silently add new categories.
  const leisureOptions = ["leisure_0_30", "leisure_31_90", "leisure_91_150", "leisure_151_plus"] as const;
  const transportOptions = ["transport_0_30", "transport_31_90", "transport_91_150", "transport_151_plus"] as const;
  const sedentaryOptions = ["sedentary_8_plus", "sedentary_6_7", "sedentary_4_5", "sedentary_3_or_less"] as const;
  const totals = new Set<number>();

  for (const leisure of leisureOptions) {
    for (const transport of transportOptions) {
      for (const sedentary of sedentaryOptions) {
        totals.add(calculateScores({ leisure, transport, sedentary }).total);
      }
    }
  }

  assert.deepEqual([...totals].sort((a, b) => a - b), [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
});

test("equal totals retain distinct domain profiles, including long sitting with high activity", () => {
  const activeWithLongSitting = calculateScores({
    leisure: "leisure_151_plus",
    transport: "transport_151_plus",
    sedentary: "sedentary_8_plus"
  });
  const lessSittingWithNoTransport = calculateScores({
    leisure: "leisure_91_150",
    transport: "transport_0_30",
    sedentary: "sedentary_3_or_less"
  });
  const lessSittingWithNoLeisure = calculateScores({
    leisure: "leisure_0_30",
    transport: "transport_91_150",
    sedentary: "sedentary_3_or_less"
  });

  assert.deepEqual(
    [activeWithLongSitting, lessSittingWithNoTransport, lessSittingWithNoLeisure].map(({ total }) => total),
    [60, 60, 60]
  );
  assert.deepEqual(activeWithLongSitting.domainScores, { leisure: 30, transport: 30, sedentary: 0 });
  assert.deepEqual(lessSittingWithNoTransport.domainScores, { leisure: 20, transport: 0, sedentary: 40 });
  assert.deepEqual(lessSittingWithNoLeisure.domainScores, { leisure: 0, transport: 20, sedentary: 40 });
});

test("an unanswered domain cannot be silently converted into a zero-point answer", () => {
  const incomplete = { leisure: "leisure_0_30", transport: "transport_0_30" } as const;
  assert.throws(() => calculateScores(incomplete), /Missing answers: sedentary/);

  const explicitlyAnswered = calculateScores({ ...incomplete, sedentary: "sedentary_8_plus" });
  assert.equal(explicitlyAnswered.total, 0);
  // A valid zero-point category does not mean a measured zero duration:
  // leisure includes 0–30 minutes, while sedentary means at least 8 hours.
  assert.deepEqual(explicitlyAnswered.domainScores, { leisure: 0, transport: 0, sedentary: 0 });
});
