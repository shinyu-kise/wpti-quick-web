import assert from "node:assert/strict";
import test from "node:test";
import { getDomainFeedback } from "./domain-feedback.ts";
import type { AnswerMap, CompleteAnswerMap, QuestionId } from "./types.ts";

// Literal instrument expectations, independent of the production score table.
const options = {
  leisure: [["leisure_0_30", 0], ["leisure_31_90", 10], ["leisure_91_150", 20], ["leisure_151_plus", 30]],
  transport: [["transport_0_30", 0], ["transport_31_90", 10], ["transport_91_150", 20], ["transport_151_plus", 30]],
  sedentary: [["sedentary_8_plus", 0], ["sedentary_6_7", 10], ["sedentary_4_5", 20], ["sedentary_3_or_less", 40]]
} as const;
const ids: QuestionId[] = ["leisure", "transport", "sedentary"];
const maxima = { leisure: 30, transport: 30, sedentary: 40 };

test("domain feedback retains literal points and the exact relative-score minima for all 64 complete patterns", () => {
  let checked = 0;
  for (const [leisure, l] of options.leisure) {
    for (const [transport, t] of options.transport) {
      for (const [sedentary, s] of options.sedentary) {
        const answers = Object.freeze({ leisure, transport, sedentary });
        const points = { leisure: l, transport: t, sedentary: s };
        const allMax = l === 30 && t === 30 && s === 40;
        // Integer cross-products avoid using the production ratio calculation
        // as the oracle, and include every tied lowest domain.
        const expectedFocus = allMax ? [] : ids.filter(id => ids.every(other => points[id] * maxima[other] <= points[other] * maxima[id]));
        const feedback = getDomainFeedback(answers);
        for (const id of ids) assert.deepEqual(feedback.domains[id], { points: points[id], max: maxima[id] });
        assert.equal(feedback.status, allMax ? "all-max" : "comparable");
        assert.deepEqual(feedback.focusIds, expectedFocus, JSON.stringify(answers));
        assert.deepEqual(feedback.unscoredIds, []);
        checked++;
      }
    }
  }
  assert.equal(checked, 64);
});

test("all 61 incomplete patterns retain known scores without comparing or imputing missing domains", () => {
  const withMissing = {
    leisure: [undefined, ...options.leisure.map(([id]) => id)],
    transport: [undefined, ...options.transport.map(([id]) => id)],
    sedentary: [undefined, ...options.sedentary.map(([id]) => id)]
  };
  let checked = 0;
  for (const leisure of withMissing.leisure) {
    for (const transport of withMissing.transport) {
      for (const sedentary of withMissing.sedentary) {
        if (leisure && transport && sedentary) continue;
        const answers = { leisure, transport, sedentary };
        const feedback = getDomainFeedback(answers);
        assert.equal(feedback.status, "incomplete");
        assert.deepEqual(feedback.focusIds, []);
        assert.deepEqual(feedback.unscoredIds, ids.filter(id => !answers[id]));
        for (const id of ids) {
          const expectedPoints = options[id].find(([option]) => option === answers[id])?.[1] ?? null;
          assert.deepEqual(feedback.domains[id], { points: expectedPoints, max: maxima[id] });
        }
        checked++;
      }
    }
  }
  assert.equal(checked, 61);
});

test("all 24 single substitutions from another domain stay unscored and prevent comparison", () => {
  const baseline: CompleteAnswerMap = { leisure: "leisure_151_plus", transport: "transport_151_plus", sedentary: "sedentary_3_or_less" };
  let checked = 0;
  for (const id of ids) {
    for (const source of ids) {
      if (id === source) continue;
      for (const [wrongOption] of options[source]) {
        const feedback = getDomainFeedback({ ...baseline, [id]: wrongOption });
        assert.equal(feedback.status, "incomplete");
        assert.equal(feedback.domains[id].points, null);
        assert.deepEqual(feedback.unscoredIds, [id]);
        assert.deepEqual(feedback.focusIds, []);
        for (const other of ids.filter(value => value !== id)) assert.equal(feedback.domains[other].points, maxima[other]);
        checked++;
      }
    }
  }
  assert.equal(checked, 24);
});

test("unknown values cannot become a zero or a lowest-score recommendation", () => {
  for (const invalid of ["unknown", "unsure", "unable", "", "__proto__", "constructor", null]) {
    const answers = { leisure: invalid, transport: "transport_151_plus", sedentary: "sedentary_3_or_less" } as AnswerMap;
    const feedback = getDomainFeedback(answers);
    assert.equal(feedback.domains.leisure.points, null);
    assert.equal(feedback.status, "incomplete");
    assert.deepEqual(feedback.focusIds, []);
    assert.deepEqual(feedback.unscoredIds, ["leisure"]);
  }
});

test("a 60-point active-but-sitting pattern identifies sitting; differing item maxima are respected", () => {
  assert.deepEqual(getDomainFeedback({ leisure: "leisure_151_plus", transport: "transport_151_plus", sedentary: "sedentary_8_plus" }).focusIds, ["sedentary"]);
  // 10/40 is lower than 10/30, despite the same raw points.
  assert.deepEqual(getDomainFeedback({ leisure: "leisure_31_90", transport: "transport_31_90", sedentary: "sedentary_6_7" }).focusIds, ["sedentary"]);
});

test("all-zero and partial ties keep every tied domain, while all-maximum has no low domain", () => {
  assert.deepEqual(getDomainFeedback({ leisure: "leisure_0_30", transport: "transport_0_30", sedentary: "sedentary_8_plus" }).focusIds, ids);
  assert.deepEqual(getDomainFeedback({ leisure: "leisure_31_90", transport: "transport_31_90", sedentary: "sedentary_4_5" }).focusIds, ["leisure", "transport"]);
  const allMax = getDomainFeedback({ leisure: "leisure_151_plus", transport: "transport_151_plus", sedentary: "sedentary_3_or_less" });
  assert.equal(allMax.status, "all-max");
  assert.deepEqual(allMax.focusIds, []);
  assert.deepEqual(allMax.unscoredIds, []);
});
