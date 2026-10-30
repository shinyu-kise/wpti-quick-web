import test from "node:test";
import assert from "node:assert/strict";
import { getActionIdeaGroups, SHORT_BOUT_IDEAS, SHORT_BOUT_REFERENCES } from "./short-bouts.ts";
import { OPTION_SCORES } from "./scoring.ts";
import type { AnswerMap } from "./types.ts";

test("short activity ideas cover the three established domains in both languages", () => {
  for (const language of ["ja", "en"] as const) {
    const ideas = SHORT_BOUT_IDEAS[language];
    assert.deepEqual(ideas.map(idea => idea.id), ["leisure", "transport", "sedentary"]);
    for (const idea of ideas) {
      assert.ok(idea.title.trim());
      assert.ok(idea.action.trim());
      assert.ok(idea.context.trim());
    }
  }
});

test("activity suggestions are independent of the original Quick scoring table", () => {
  assert.equal(OPTION_SCORES.leisure_0_30.points, 0);
  assert.equal(OPTION_SCORES.leisure_151_plus.points, 30);
  assert.equal(OPTION_SCORES.transport_151_plus.points, 30);
  assert.equal(OPTION_SCORES.sedentary_8_plus.points, 0);
  assert.equal(OPTION_SCORES.sedentary_3_or_less.points, 40);
  for (const pmid of ["33239350", "29567764", "36482104", "22374636"]) {
    assert.ok(SHORT_BOUT_REFERENCES.some(reference => reference.url === `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`));
  }
  assert.ok(SHORT_BOUT_REFERENCES.every(reference => reference.url.startsWith("https://pubmed.ncbi.nlm.nih.gov/")));
});

test("a single comparison candidate is shown first without rearranging the other areas or modifying answers", () => {
  const cases = [
    { answers: { leisure: "leisure_0_30", transport: "transport_151_plus", sedentary: "sedentary_3_or_less" }, primary: ["leisure"], other: ["transport", "sedentary"] },
    { answers: { leisure: "leisure_151_plus", transport: "transport_0_30", sedentary: "sedentary_3_or_less" }, primary: ["transport"], other: ["leisure", "sedentary"] },
    { answers: { leisure: "leisure_151_plus", transport: "transport_151_plus", sedentary: "sedentary_8_plus" }, primary: ["sedentary"], other: ["leisure", "transport"] }
  ] as const;
  for (const { answers, primary, other } of cases) {
    const before = { ...answers };
    assert.deepEqual(getActionIdeaGroups(Object.freeze(answers)), { status: "comparable", primaryIds: primary, otherIds: other });
    assert.deepEqual(answers, before);
  }
});

test("all tied comparison candidates remain together in question order", () => {
  assert.deepEqual(getActionIdeaGroups({ leisure: "leisure_31_90", transport: "transport_31_90", sedentary: "sedentary_3_or_less" }), {
    status: "comparable", primaryIds: ["leisure", "transport"], otherIds: ["sedentary"]
  });
  assert.deepEqual(getActionIdeaGroups({ leisure: "leisure_0_30", transport: "transport_151_plus", sedentary: "sedentary_8_plus" }), {
    status: "comparable", primaryIds: ["leisure", "sedentary"], otherIds: ["transport"]
  });
  assert.deepEqual(getActionIdeaGroups({ leisure: "leisure_0_30", transport: "transport_0_30", sedentary: "sedentary_8_plus" }), {
    status: "comparable", primaryIds: ["leisure", "transport", "sedentary"], otherIds: []
  });
});

test("example ordering follows points divided by each domain maximum, not the raw point minimum", () => {
  // Leisure and sitting each have 10 points, but 10/40 is below 10/30.
  assert.deepEqual(getActionIdeaGroups({ leisure: "leisure_31_90", transport: "transport_91_150", sedentary: "sedentary_6_7" }), {
    status: "comparable", primaryIds: ["sedentary"], otherIds: ["leisure", "transport"]
  });
});

test("maximum scores leave no primary change example while keeping all general examples available", () => {
  assert.deepEqual(getActionIdeaGroups({ leisure: "leisure_151_plus", transport: "transport_151_plus", sedentary: "sedentary_3_or_less" }), {
    status: "all-max", primaryIds: [], otherIds: ["leisure", "transport", "sedentary"]
  });
});

test("incomplete or invalid-domain answers show all examples without selecting a low domain", () => {
  const cases: AnswerMap[] = [
    {},
    { leisure: "leisure_0_30" },
    { leisure: "leisure_151_plus", sedentary: "sedentary_8_plus" },
    { leisure: "transport_0_30", transport: "transport_151_plus", sedentary: "sedentary_3_or_less" }
  ];
  for (const answers of cases) {
    assert.deepEqual(getActionIdeaGroups(Object.freeze(answers)), {
      status: "incomplete", primaryIds: ["leisure", "transport", "sedentary"], otherIds: []
    });
  }
});
