import assert from "node:assert/strict";
import test from "node:test";
import { createSession, dialogueReducer, emptyContext, emptyPlan, referenceScore } from "./dialogue.ts";

function plannedSession() {
  let session = dialogueReducer(createSession(), { type: "example" });
  session = dialogueReducer(session, { type: "contextMode", mode: "notes" });
  session = dialogueReducer(session, { type: "contextField", field: "sitting", value: "A daily meeting" });
  session = dialogueReducer(session, { type: "reviewContext" });
  session = dialogueReducer(session, { type: "planChoice", choice: "change" });
  session = dialogueReducer(session, { type: "planDomain", domain: "transport" });
  return dialogueReducer(session, { type: "planField", field: "action", value: "A participant-selected step" });
}

test("initial session has no imputed answers, context period, plan, or score", () => {
  const session = createSession();
  assert.deepEqual(session.answers, {});
  assert.deepEqual(session.context, emptyContext);
  assert.deepEqual(session.plan, emptyPlan);
  assert.equal(referenceScore(session.answers), null);
  assert.equal(dialogueReducer(session, { type: "reviewContext" }).contextReviewed, false);
});

test("nonresponses stay separate from Quick answers and replacing them restores only the selected response", () => {
  let session = plannedSession();
  session = dialogueReducer(session, { type: "nonresponse", questionId: "sedentary", value: "unsure" });
  assert.equal(session.answers.sedentary, undefined);
  assert.equal(session.nonresponses.sedentary, "unsure");
  assert.equal(referenceScore(session.answers), null);
  assert.deepEqual(session.context, emptyContext);
  assert.deepEqual(session.plan, emptyPlan);
  session = dialogueReducer(session, { type: "answer", questionId: "sedentary", optionId: "sedentary_8_plus" });
  assert.equal(session.nonresponses.sedentary, undefined);
  assert.equal(referenceScore(session.answers)?.total, 60);
  session = dialogueReducer(session, { type: "nonresponse", questionId: "sedentary", value: "" });
  assert.equal(session.answers.sedentary, undefined);
  assert.equal(session.nonresponses.sedentary, undefined);
});

test("changing an answer clears downstream context and plan but preserves the demo marker", () => {
  const before = plannedSession();
  const after = dialogueReducer(before, { type: "answer", questionId: "transport", optionId: "transport_31_90" });
  assert.deepEqual(after.context, emptyContext);
  assert.deepEqual(after.plan, emptyPlan);
  assert.equal(after.contextReviewed, false);
  assert.equal(after.demo, true);
  assert.equal(dialogueReducer(before, { type: "answer", questionId: "transport", optionId: "transport_151_plus" }), before);
});

test("context changes invalidate the plan and require a fresh context review", () => {
  const before = plannedSession();
  const after = dialogueReducer(before, { type: "contextField", field: "supports", value: "Community support" });
  assert.deepEqual(after.plan, emptyPlan);
  assert.equal(after.contextReviewed, false);
  assert.equal(after.context.sitting, before.context.sitting);
  const premature = dialogueReducer(after, { type: "planChoice", choice: "maintain" });
  assert.deepEqual(premature.plan, emptyPlan);
});

test("talk-only erases notes and prevents recording plan or context details", () => {
  let session = dialogueReducer(plannedSession(), { type: "contextMode", mode: "talk-only" });
  assert.deepEqual(session.context, { ...emptyContext, mode: "talk-only" });
  assert.deepEqual(session.plan, emptyPlan);
  session = dialogueReducer(session, { type: "reviewContext" });
  session = dialogueReducer(session, { type: "contextField", field: "sitting", value: "Do not retain" });
  session = dialogueReducer(session, { type: "planChoice", choice: "change" });
  session = dialogueReducer(session, { type: "planField", field: "action", value: "Do not retain" });
  assert.equal(session.context.sitting, "");
  assert.deepEqual(session.plan, emptyPlan);
  assert.equal(referenceScore(session.answers)?.total, 60);
});

test("changing a plan choice or topic never silently carries the previous action", () => {
  const before = plannedSession();
  const changedTopic = dialogueReducer(before, { type: "planDomain", domain: "leisure" });
  assert.equal(changedTopic.plan.action, "");
  assert.equal(changedTopic.plan.choice, "change");
  const noChange = dialogueReducer(before, { type: "planChoice", choice: "none" });
  assert.deepEqual(noChange.plan, { ...emptyPlan, choice: "none" });
  const rejectedText = dialogueReducer(noChange, { type: "planField", field: "action", value: "Must not be retained" });
  assert.equal(rejectedText.plan.action, "");
});

test("reset clears every input and the demo marker, with independent fresh objects", () => {
  const after = dialogueReducer(plannedSession(), { type: "reset" });
  assert.deepEqual(after, createSession());
  const another = createSession();
  after.context.sitting = "mutated in test";
  after.plan.action = "mutated in test";
  assert.equal(another.context.sitting, "");
  assert.equal(another.plan.action, "");
});
