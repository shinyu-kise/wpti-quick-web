import test from "node:test";
import assert from "node:assert/strict";
import { SHORT_BOUT_IDEAS, SHORT_BOUT_REFERENCES } from "./short-bouts.ts";
import { OPTION_SCORES } from "./scoring.ts";

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
