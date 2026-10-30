import assert from "node:assert/strict";
import test from "node:test";
import { buildSummary, responseLabel, weeklyMinutes } from "./practice.ts";
import { createSession, dialogueReducer, referenceScore } from "./dialogue.ts";
import type { DialogueSession } from "./dialogue.ts";

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
    assert.match(summary, /Quick v1.0 \/ Dialogue v1.1-prototype \/ Web v1.6.0-dialogue-rc.1/);
    assert.match(summary, /41606948/);
    assert.match(summary, language === "ja" ? /過去1週間の平均的な状況/ : /average situation during the past 1 week/);
    assert.match(summary, language === "ja" ? /架空の回答/ : /fictional responses/);
    assert.match(summary, language === "ja" ? /原著WPTIと同一ではありません/ : /not equivalent to the original WPTI/);
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
    assert.match(summary, language === "ja" ? /わからない・区分で迷う/ : /Unsure \/ between categories/);
    assert.match(summary, language === "ja" ? /答えにくい・回答しない/ : /Difficult to answer \/ prefer not to answer/);
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
    assert.match(summary, language === "ja" ? /今できていることを続ける/ : /Maintain what is working/);
    assert.match(summary, /60\/100/);
    assert.doesNotMatch(summary, /架空の回答|fictional responses/);
  }
  assert.equal(referenceScore(session.answers)?.total, 60);
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
    assert.match(summary, language === "ja" ? /背景のメモ変更後、次の一歩は再確認待ちです。/ : /The next step is awaiting review after context notes changed\./);
    assert.match(summary, /60\/100/);
    const acknowledged = dialogueReducer(session, { type: "acknowledgePlanReview" });
    const reviewedSummary = buildSummary(acknowledged, language, "2026-10-23");
    assert.ok(reviewedSummary.includes("参加者が選んだ小さな一歩"));
    assert.doesNotMatch(reviewedSummary, /再確認待ち|awaiting review/);
  }
});

test("the immediate response summary describes unselected notes as unrecorded without implying a talk-only choice", () => {
  const session = { ...createSession(), answers: activeButSitting };
  assert.equal(session.context.mode, "");
  for (const language of ["ja", "en"] as const) {
    const summary = buildSummary(session, language, "2026-10-23");
    const unrecorded = language === "ja" ? "背景・計画の記録なし" : "No context or plan details recorded";
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
      assert.match(summary, language === "ja" ? /背景・計画の記録なし/ : /No context or plan details recorded/);
    }
  }
});
