import assert from "node:assert/strict";
import test from "node:test";
import { buildSummary, emptyPlan, responseLabel, weeklyMinutes } from "./practice.ts";
import { calculateScores } from "./scoring.ts";

const activeButSitting = { leisure: "leisure_151_plus", transport: "transport_151_plus", sedentary: "sedentary_8_plus" } as const;

test("recall helper accepts zero, does not treat blanks as zero, and rejects implausible inputs", () => {
  assert.equal(weeklyMinutes("5", "20"), 100);
  assert.equal(weeklyMinutes("3", "12.5"), 37.5);
  assert.equal(weeklyMinutes("0", "0"), 0);
  for (const [d, m] of [["", "20"], ["2", ""], ["8", "30"], ["1.5", "30"], ["-1", "30"], ["1", "-1"], ["1", "1441"], ["1", "Infinity"]]) {
    assert.equal(weeklyMinutes(d, m), null);
  }
});

test("60-point export retains long sitting, scoring provenance, and limitations in both languages", () => {
  assert.equal(calculateScores(activeButSitting).total, 60);
  for (const language of ["ja", "en"] as const) {
    const summary = buildSummary(activeButSitting, emptyPlan, language, "2026-10-02", true);
    assert.match(summary, /60\/100/);
    assert.ok(summary.includes(responseLabel(activeButSitting, "sedentary", language)));
    assert.match(summary, /Quick v1.0 \/ Web v1.1/);
    assert.match(summary, /41606948/);
    assert.match(summary, language === "ja" ? /架空の回答/ : /fictional responses/);
    assert.match(summary, language === "ja" ? /直接適用できません/ : /do not directly apply/);
  }
});

test("optional plan is exported verbatim without changing scoring; incomplete answers cannot be exported", () => {
  const plan = { domain: "sedentary", action: "会議の合間に姿勢を変える", when: "会議室", review: "2026-10-09" } as const;
  const summary = buildSummary(activeButSitting, plan, "ja", "2026-10-02", false);
  assert.match(summary, /60\/100/);
  assert.ok(summary.includes(plan.action));
  assert.ok(summary.includes(plan.review));
  assert.doesNotMatch(summary, /架空の回答/);
  assert.throws(() => buildSummary({}, plan, "ja", "2026-10-02", false), /Missing answers/);
});
