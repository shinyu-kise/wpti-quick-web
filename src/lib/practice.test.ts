import assert from "node:assert/strict";
import test from "node:test";
import { buildSummary, responseLabel, weeklyMinutes } from "./practice.ts";
import { createSession, dialogueReducer, referenceScore } from "./dialogue.ts";
import type { DialogueSession } from "./dialogue.ts";
import { workflowCopy } from "./workflow-copy.ts";

const activeButSitting = { leisure: "leisure_151_plus", transport: "transport_151_plus", sedentary: "sedentary_8_plus" } as const;

test("recall helper accepts zero, does not treat blanks as zero, and rejects implausible inputs", () => {
  assert.equal(weeklyMinutes("5", "20"), 100);
  assert.equal(weeklyMinutes("3", "12.5"), 37.5);
  assert.equal(weeklyMinutes("0", "0"), 0);
  for (const [d, m] of [["", "20"], ["2", ""], ["8", "30"], ["1.5", "30"], ["-1", "30"], ["1", "-1"], ["1", "1441"], ["1", "Infinity"]]) {
    assert.equal(weeklyMinutes(d, m), null);
  }
});

test("recall helper preserves decimal values near category gaps without rounding or assigning a category", () => {
  for (const boundary of [30, 90, 150]) {
    const value = boundary + 0.04;
    const result = weeklyMinutes("1", String(value));
    assert.equal(result, value);
    assert.ok(result !== null && result > boundary && result < boundary + 1);
    assert.equal(typeof result, "number");
  }
  assert.equal(weeklyMinutes("3", "10.01"), 3 * 10.01);
});

test("60-point export puts original responses before context, plan and reference score in both languages", () => {
  const session = { ...createSession(), answers: activeButSitting, demo: true };
  assert.equal(referenceScore(session.answers)?.total, 60);
  for (const language of ["ja", "en"] as const) {
    const summary = buildSummary(session, language, "2026-10-23");
    assert.match(summary, /60\/100/);
    const sitting = responseLabel(activeButSitting, "sedentary", language);
    assert.ok(summary.includes(sitting));
    assert.ok(summary.indexOf(sitting) < summary.indexOf("60/100"));
    assert.match(summary, /Quick v1.0 \/ Dialogue v1.5-prototype \/ Web v1.9.1-dialogue-rc.1/);
    assert.match(summary, /41606948/);
    assert.match(summary, language === "ja" ? /過去1週間の平均的な状況/ : /average situation during the past 1 week/);
    assert.match(summary, language === "ja" ? /架空の回答/ : /fictional responses/);
    assert.match(summary, language === "ja" ? /原著WPTIとは別のものです/ : /not equivalent to the original WPTI/);
    assert.doesNotMatch(summary, /35–59|60点以上|60 points or higher/);
  }
});

test("incomplete answers export with distinct nonresponse states and never an imputed total", () => {
  let session = createSession();
  session = dialogueReducer(session, { type: "nonresponse", questionId: "leisure", value: "unsure" });
  session = dialogueReducer(session, { type: "nonresponse", questionId: "transport", value: "unable" });
  for (const language of ["ja", "en"] as const) {
    const summary = buildSummary(session, language, "2026-10-23");
    assert.doesNotMatch(summary, /\d+\/100/);
    assert.ok(summary.includes(workflowCopy[language].nonresponses.unsure));
    assert.ok(summary.includes(workflowCopy[language].nonresponses.unable));
    assert.match(summary, language === "ja" ? /未回答/ : /Unanswered/);
  }
});

test("optional notes and participant-selected plan export without a legacy review step or scoring changes", () => {
  let session: DialogueSession = { ...createSession(), answers: activeButSitting };
  session = dialogueReducer(session, { type: "contextMode", mode: "notes" });
  session = dialogueReducer(session, { type: "contextField", field: "sitting", value: "会議で長く座る\n日によって違う" });
  session = dialogueReducer(session, { type: "contextField", field: "period", value: "最近の生活" });
  session = dialogueReducer(session, { type: "planChoice", choice: "maintain" });
  session = dialogueReducer(session, { type: "planDomain", domain: "sedentary" });
  session = dialogueReducer(session, { type: "planField", field: "action", value: "休息の時間を大切にする" });
  session = dialogueReducer(session, { type: "planField", field: "support", value: "無理がある日は休む" });
  session = dialogueReducer(session, { type: "planField", field: "review", value: "2026-11-09" });
  assert.equal(session.contextReviewed, false);
  for (const language of ["ja", "en"] as const) {
    const summary = buildSummary(session, language, "2026-10-23");
    for (const text of ["会議で長く座る\n日によって違う", "最近の生活", "休息の時間を大切にする", "無理がある日は休む", "2026-11-09"]) assert.ok(summary.includes(text));
    assert.ok(summary.includes(workflowCopy[language].planChoices.maintain));
    assert.match(summary, /60\/100/);
    assert.doesNotMatch(summary, /架空の回答|fictional responses/);
  }
  assert.equal(referenceScore(session.answers)?.total, 60);
});

test("an unclassified memo exports without blank fields and survives answer correction with an explicit review notice", () => {
  const before: DialogueSession = { ...createSession(), answers: activeButSitting };
  const written = dialogueReducer(before, { type: "writeMemo", value: "仕事の後や休日に、できそうなことを考える" });
  assert.equal(written.plan.choice, "");
  assert.equal(referenceScore(written.answers)?.total, referenceScore(before.answers)?.total);
  const corrected = dialogueReducer(written, { type: "answer", questionId: "leisure", optionId: "leisure_31_90" });
  const edited = dialogueReducer(corrected, { type: "writeMemo", value: "仕事の後や休日に、歩けそうな時間を考える" });
  assert.equal(edited.planNeedsReview, true);
  const acknowledged = dialogueReducer(edited, { type: "acknowledgePlanReview" });
  for (const language of ["ja", "en"] as const) {
    const w = workflowCopy[language];
    const summary = buildSummary(written, language, "2026-10-30");
    assert.ok(summary.includes(`${w.action}: ${written.plan.action}`));
    assert.ok(!summary.includes(w.notEntered));
    assert.match(summary, /60\/100/);
    for (const field of ["when", "support", "review"] as const) {
      assert.ok(!summary.split("\n").some(line => line.startsWith(`${w[field]}:`)));
    }
    const updatedSummary = buildSummary(edited, language, "2026-10-30");
    assert.ok(updatedSummary.includes(edited.plan.action));
    assert.ok(updatedSummary.includes(w.planReviewPending));
    assert.match(updatedSummary, /40\/100/);
    const reviewedSummary = buildSummary(acknowledged, language, "2026-10-30");
    assert.ok(reviewedSummary.includes(edited.plan.action));
    assert.ok(!reviewedSummary.includes(w.planReviewPending));
  }
});

test("memos export with retained choices and details but cleared text never reappears", () => {
  for (const choice of ["maintain", "none"] as const) {
    let session: DialogueSession = { ...createSession(), answers: activeButSitting };
    session = dialogueReducer(session, { type: "contextMode", mode: "notes" });
    session = dialogueReducer(session, { type: "planChoice", choice });
    session = dialogueReducer(session, { type: "writeMemo", value: "TEMPORARY_MEMO_TO_CLEAR" });
    session = dialogueReducer(session, { type: "writeMemo", field: "when", value: "After work on Friday" });
    const erased = dialogueReducer(session, { type: "writeMemo", value: "" });
    const cleared = dialogueReducer(session, { type: "contextMode", mode: "talk-only" });
    const reset = dialogueReducer(session, { type: "reset" });
    for (const language of ["ja", "en"] as const) {
      const w = workflowCopy[language];
      const summary = buildSummary(session, language, "2026-10-30");
      assert.ok(summary.includes(w.planChoices[choice]));
      assert.ok(summary.includes(`${w.action}: TEMPORARY_MEMO_TO_CLEAR`));
      assert.ok(summary.includes(`${w.when}: After work on Friday`));
      const erasedSummary = buildSummary(erased, language, "2026-10-30");
      assert.ok(!erasedSummary.includes("TEMPORARY_MEMO_TO_CLEAR"));
      assert.ok(erasedSummary.includes("After work on Friday"));
      assert.ok(erasedSummary.includes(w.planChoices[choice]));
      for (const state of [cleared, reset]) {
        const clearedSummary = buildSummary(state, language, "2026-10-30");
        assert.ok(!clearedSummary.includes("TEMPORARY_MEMO_TO_CLEAR"));
        assert.ok(!clearedSummary.includes("After work on Friday"));
      }
    }
  }
});

test("changed context exports the retained plan with a review label until explicitly acknowledged in both languages", () => {
  let session: DialogueSession = { ...createSession(), answers: activeButSitting };
  session = dialogueReducer(session, { type: "contextMode", mode: "notes" });
  session = dialogueReducer(session, { type: "contextField", field: "sitting", value: "会議が多い" });
  session = dialogueReducer(session, { type: "planChoice", choice: "change" });
  session = dialogueReducer(session, { type: "planField", field: "action", value: "参加者が選んだ小さな一歩" });
  session = dialogueReducer(session, { type: "contextField", field: "sitting", value: "会議が多い日もある" });
  assert.equal(session.planNeedsReview, true);
  for (const language of ["ja", "en"] as const) {
    const summary = buildSummary(session, language, "2026-10-23");
    assert.ok(summary.includes("会議が多い日もある"));
    assert.ok(summary.includes("参加者が選んだ小さな一歩"));
    assert.ok(summary.includes(workflowCopy[language].planReviewPending));
    assert.match(summary, /60\/100/);
    const acknowledged = dialogueReducer(session, { type: "acknowledgePlanReview" });
    const reviewedSummary = buildSummary(acknowledged, language, "2026-10-23");
    assert.ok(reviewedSummary.includes("参加者が選んだ小さな一歩"));
    assert.doesNotMatch(reviewedSummary, /再確認待ち|awaiting review/);
  }
});

test("corrected responses export retained notes with a review marker and the current score or missing-response status", () => {
  let session: DialogueSession = { ...createSession(), answers: activeButSitting };
  session = dialogueReducer(session, { type: "contextMode", mode: "notes" });
  session = dialogueReducer(session, { type: "contextField", field: "sitting", value: "A context note to retain" });
  session = dialogueReducer(session, { type: "planChoice", choice: "maintain" });
  session = dialogueReducer(session, { type: "planField", field: "action", value: "A plan to retain" });
  const corrected = dialogueReducer(session, { type: "answer", questionId: "leisure", optionId: "leisure_31_90" });
  const unsure = dialogueReducer(corrected, { type: "nonresponse", questionId: "sedentary", value: "unsure" });
  for (const language of ["ja", "en"] as const) {
    const w = workflowCopy[language];
    for (const state of [corrected, unsure]) {
      const summary = buildSummary(state, language, "2026-10-30");
      assert.ok(summary.includes("A context note to retain"));
      assert.ok(summary.includes("A plan to retain"));
      assert.ok(summary.includes(w.planChoices.maintain));
      assert.ok(summary.includes(w.planReviewPending));
      assert.ok(summary.includes(responseLabel(state.answers, "leisure", language, state.nonresponses)));
    }
    assert.match(buildSummary(corrected, language, "2026-10-30"), /40\/100/);
    const incompleteSummary = buildSummary(unsure, language, "2026-10-30");
    assert.doesNotMatch(incompleteSummary, /\d+\/100/);
    assert.ok(incompleteSummary.includes(w.scoreUnavailable));
    assert.ok(incompleteSummary.includes(w.nonresponses.unsure));
    const acknowledged = dialogueReducer(unsure, { type: "acknowledgePlanReview" });
    const reviewedSummary = buildSummary(acknowledged, language, "2026-10-30");
    assert.ok(reviewedSummary.includes("A plan to retain"));
    assert.ok(!reviewedSummary.includes(w.planReviewPending));
  }
});

test("the immediate response summary describes unselected notes as unrecorded without implying a talk-only choice", () => {
  const session = { ...createSession(), answers: activeButSitting };
  assert.equal(session.context.mode, "");
  for (const language of ["ja", "en"] as const) {
    const summary = buildSummary(session, language, "2026-10-23");
    const unrecorded = workflowCopy[language].notRecorded;
    assert.equal(summary.split("\n").filter(line => line === unrecorded).length, 2);
    assert.doesNotMatch(summary, /話すだけ|Talk only|再確認待ち|awaiting review/);
    assert.match(summary, /60\/100/);
  }
});

test("unselected and talk-only exports exclude stale context, plan and review state in both languages", () => {
  for (const mode of ["", "talk-only"] as const) {
    const session = createSession();
    session.context.mode = mode;
    session.context.sitting = "SHOULD_NOT_EXPORT_CONTEXT";
    session.context.period = "SHOULD_NOT_EXPORT_PERIOD";
    session.plan.choice = "change";
    session.plan.action = "SHOULD_NOT_EXPORT_PLAN";
    session.contextReviewed = true;
    session.planNeedsReview = true;
    for (const language of ["ja", "en"] as const) {
      const summary = buildSummary(session, language, "2026-10-23");
      assert.doesNotMatch(summary, /SHOULD_NOT_EXPORT|再確認待ち|awaiting review/);
      assert.ok(summary.includes(workflowCopy[language].notRecorded));
    }
  }
});

test("equal 60-point totals export distinct item scores and different reflection candidates in both languages", () => {
  const cases = [
    { answers: activeButSitting, points: [30, 30, 0], focus: 2 },
    { answers: { leisure: "leisure_0_30", transport: "transport_91_150", sedentary: "sedentary_3_or_less" }, points: [0, 20, 40], focus: 0 },
    { answers: { leisure: "leisure_91_150", transport: "transport_0_30", sedentary: "sedentary_3_or_less" }, points: [20, 0, 40], focus: 1 }
  ] as const;
  const names = {
    ja: ["余暇・運動での身体活動", "歩きや自転車での移動", "座る・横になる時間"],
    en: ["Leisure and exercise physical activity", "Walking or cycling for travel", "Sitting or lying down"]
  };
  const maxima = [30, 30, 40];

  for (const language of ["ja", "en"] as const) {
    const prefix = language === "ja" ? "見直す候補：" : "Area to reflect on: ";
    for (const pattern of cases) {
      const session = { ...createSession(), answers: pattern.answers };
      const lines = buildSummary(session, language, "2026-10-30").split("\n");
      assert.ok(lines.some(line => line.endsWith(": 60/100")));
      for (let index = 0; index < 3; index++) {
        assert.ok(lines.includes(`${names[language][index]}: ${pattern.points[index]}/${maxima[index]}${language === "ja" ? "点" : " pts"}`));
      }
      assert.deepEqual(lines.filter(line => line.startsWith(prefix)), [`${prefix}${names[language][pattern.focus]}`]);
    }
  }
});

test("partial exports distinguish a scored zero from unsure, declined and unanswered items without a comparison", () => {
  for (const nonresponse of ["unsure", "unable"] as const) {
    let session = createSession();
    session = dialogueReducer(session, { type: "answer", questionId: "leisure", optionId: "leisure_0_30" });
    session = dialogueReducer(session, { type: "nonresponse", questionId: "transport", value: nonresponse });
    for (const language of ["ja", "en"] as const) {
      const summary = buildSummary(session, language, "2026-10-30");
      const lines = summary.split("\n");
      if (language === "ja") {
        assert.ok(lines.includes("余暇・運動での身体活動: 0/30点"));
        assert.ok(lines.includes("歩きや自転車での移動: 点数なし"));
        assert.ok(lines.includes("座る・横になる時間: 点数なし"));
        assert.ok(lines.includes("選ばれた時間だけでは、3つを比べられません。"));
        assert.ok(summary.includes(nonresponse === "unsure" ? "わからない" : "答えない"));
        assert.ok(summary.includes("未回答"));
      } else {
        assert.ok(lines.includes("Leisure and exercise physical activity: 0/30 pts"));
        assert.ok(lines.includes("Walking or cycling for travel: Not scored"));
        assert.ok(lines.includes("Sitting or lying down: Not scored"));
        assert.ok(lines.includes("The selected times are not enough to compare all three areas."));
        assert.ok(summary.includes(nonresponse === "unsure" ? "Not sure" : "Prefer not to answer"));
        assert.ok(summary.includes("Unanswered"));
      }
      assert.doesNotMatch(summary, /\d+\/100/);
      assert.deepEqual(lines.filter(line => /^(見直す候補：|Area to reflect on: )/.test(line)), []);
    }
  }
});

test("all-maximum export shows three full item scores without inventing a low domain or health clearance", () => {
  const session: DialogueSession = { ...createSession(), answers: { leisure: "leisure_151_plus", transport: "transport_151_plus", sedentary: "sedentary_3_or_less" } };
  for (const language of ["ja", "en"] as const) {
    const summary = buildSummary(session, language, "2026-10-30");
    const lines = summary.split("\n");
    assert.match(summary, /100\/100/);
    assert.deepEqual(lines.filter(line => /^(見直す候補：|Area to reflect on: )/.test(line)), []);
    if (language === "ja") {
      for (const expected of ["余暇・運動での身体活動: 30/30点", "歩きや自転車での移動: 30/30点", "座る・横になる時間: 40/40点", "3つとも、この採点では満点です。", "点数だけで、健康上の不足は判断できません。"]) assert.ok(lines.includes(expected));
      assert.doesNotMatch(summary, /不足なし|健康です/);
    } else {
      for (const expected of ["Leisure and exercise physical activity: 30/30 pts", "Walking or cycling for travel: 30/30 pts", "Sitting or lying down: 40/40 pts", "All three responses receive the maximum points in this scoring system.", "Scores alone cannot establish a health-related deficiency."]) assert.ok(lines.includes(expected));
      assert.doesNotMatch(summary, /You are healthy|No health deficiencies/);
    }
  }
});
