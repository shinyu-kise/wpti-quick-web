import assert from "node:assert/strict";
import test from "node:test";
import { createSession, dialogueReducer, emptyContext, emptyPlan, referenceScore } from "./dialogue.ts";
import type { DialogueSession } from "./dialogue.ts";

function plannedSession() {
  let session = dialogueReducer(createSession(), { type: "example" });
  session = dialogueReducer(session, { type: "contextMode", mode: "notes" });
  session = dialogueReducer(session, { type: "contextField", field: "sitting", value: "A daily meeting" });
  session = dialogueReducer(session, { type: "planChoice", choice: "change" });
  session = dialogueReducer(session, { type: "planDomain", domain: "transport" });
  return dialogueReducer(session, { type: "planField", field: "action", value: "A participant-selected step" });
}

test("initial session has no imputed answers, context period, plan, or score", () => {
  const session = createSession();
  assert.deepEqual(session.answers, {});
  assert.deepEqual(session.context, emptyContext);
  assert.deepEqual(session.plan, emptyPlan);
  assert.equal(session.planNeedsReview, false);
  assert.equal(referenceScore(session.answers), null);
  assert.equal(dialogueReducer(session, { type: "reviewContext" }).contextReviewed, false);
});

test("nonresponses stay separate from Quick answers and replacing them restores only the selected response", () => {
  const before = plannedSession();
  let session = before;
  session = dialogueReducer(session, { type: "nonresponse", questionId: "sedentary", value: "unsure" });
  assert.equal(session.answers.sedentary, undefined);
  assert.equal(session.nonresponses.sedentary, "unsure");
  assert.equal(referenceScore(session.answers), null);
  assert.deepEqual(session.context, before.context);
  assert.deepEqual(session.plan, before.plan);
  assert.equal(session.planNeedsReview, true);
  session = dialogueReducer(session, { type: "answer", questionId: "sedentary", optionId: "sedentary_8_plus" });
  assert.equal(session.nonresponses.sedentary, undefined);
  assert.equal(referenceScore(session.answers)?.total, 60);
  assert.deepEqual(session.plan, before.plan);
  assert.equal(session.planNeedsReview, true);
  session = dialogueReducer(session, { type: "nonresponse", questionId: "sedentary", value: "" });
  assert.equal(session.answers.sedentary, undefined);
  assert.equal(session.nonresponses.sedentary, undefined);
});

test("changing an answer preserves context and plan, recalculates the score and asks for review", () => {
  const before = dialogueReducer(plannedSession(), { type: "reviewContext" });
  assert.equal(before.contextReviewed, true);
  assert.equal(before.planNeedsReview, false);
  const after = dialogueReducer(before, { type: "answer", questionId: "transport", optionId: "transport_31_90" });
  assert.deepEqual(after.context, before.context);
  assert.deepEqual(after.plan, before.plan);
  assert.equal(after.contextReviewed, false);
  assert.equal(after.planNeedsReview, true);
  assert.equal(after.demo, true);
  assert.equal(referenceScore(before.answers)?.total, 60);
  assert.equal(referenceScore(after.answers)?.total, 40);
  assert.equal(dialogueReducer(before, { type: "answer", questionId: "transport", optionId: "transport_151_plus" }), before);
  const acknowledged = dialogueReducer(after, { type: "acknowledgePlanReview" });
  assert.equal(acknowledged.planNeedsReview, false);
  assert.deepEqual(acknowledged.plan, before.plan);
});

test("answer edits without a plan keep notes without creating a plan or review task", () => {
  let session = dialogueReducer(createSession(), { type: "contextMode", mode: "notes" });
  session = dialogueReducer(session, { type: "contextField", field: "sitting", value: "Time spent in meetings" });
  const after = dialogueReducer(session, { type: "answer", questionId: "transport", optionId: "transport_31_90" });
  assert.deepEqual(after.context, session.context);
  assert.deepEqual(after.plan, emptyPlan);
  assert.equal(after.planNeedsReview, false);
});

test("a choice to make no new change is retained for review after every nonresponse edit", () => {
  const before = dialogueReducer(plannedSession(), { type: "planChoice", choice: "none" });
  for (const value of ["unsure", "unable", ""] as const) {
    const after = dialogueReducer(before, { type: "nonresponse", questionId: "leisure", value });
    assert.deepEqual(after.context, before.context);
    assert.deepEqual(after.plan, before.plan);
    assert.equal(after.plan.choice, "none");
    assert.equal(after.planNeedsReview, true);
    assert.equal(referenceScore(after.answers), null);
    assert.equal(dialogueReducer(after, { type: "nonresponse", questionId: "leisure", value }), after);
  }
});

test("notes mode permits a participant-selected plan without the legacy context review step", () => {
  const session = plannedSession();
  assert.equal(session.contextReviewed, false);
  assert.equal(session.plan.choice, "change");
  assert.equal(session.plan.domain, "transport");
  assert.equal(session.plan.action, "A participant-selected step");
  assert.equal(session.planNeedsReview, false);
  assert.equal(referenceScore(session.answers)?.total, 60);
});

test("editing context preserves a written plan and marks it for review until explicitly acknowledged", () => {
  const before = plannedSession();
  const after = dialogueReducer(before, { type: "contextField", field: "supports", value: "Community support" });
  assert.deepEqual(after.plan, before.plan);
  assert.equal(after.planNeedsReview, true);
  assert.equal(after.contextReviewed, false);
  assert.equal(after.context.sitting, before.context.sitting);
  const edited = dialogueReducer(after, { type: "planField", field: "when", value: "After lunch" });
  assert.equal(edited.planNeedsReview, true);
  assert.equal(edited.plan.action, before.plan.action);
  assert.equal(edited.plan.when, "After lunch");
  const legacyReviewed = dialogueReducer(edited, { type: "reviewContext" });
  assert.equal(legacyReviewed.planNeedsReview, true);
  const acknowledged = dialogueReducer(legacyReviewed, { type: "acknowledgePlanReview" });
  assert.equal(acknowledged.planNeedsReview, false);
  assert.deepEqual(acknowledged.plan, edited.plan);
  assert.deepEqual(acknowledged.context, edited.context);
  assert.equal(referenceScore(acknowledged.answers)?.total, 60);
});

test("context edits without a plan and reselecting an unchanged context do not create review work", () => {
  let session = dialogueReducer(createSession(), { type: "contextMode", mode: "notes" });
  session = dialogueReducer(session, { type: "contextField", field: "sitting", value: "A daily meeting" });
  assert.equal(session.planNeedsReview, false);
  const planned = plannedSession();
  assert.equal(dialogueReducer(planned, { type: "contextField", field: "sitting", value: "A daily meeting" }), planned);
  assert.equal(planned.planNeedsReview, false);
});

test("unselected and talk-only modes reject recording even with a stale legacy review flag", () => {
  for (const mode of ["", "talk-only"] as const) {
    let session: DialogueSession = { ...createSession(), context: { ...emptyContext, mode }, contextReviewed: true };
    session = dialogueReducer(session, { type: "contextField", field: "sitting", value: "Do not retain" });
    session = dialogueReducer(session, { type: "planChoice", choice: "change" });
    session = dialogueReducer(session, { type: "planDomain", domain: "transport" });
    session = dialogueReducer(session, { type: "planField", field: "action", value: "Do not retain" });
    assert.deepEqual(session.context, { ...emptyContext, mode });
    assert.deepEqual(session.plan, emptyPlan);
    const staleReview = { ...session, planNeedsReview: true };
    assert.equal(dialogueReducer(staleReview, { type: "acknowledgePlanReview" }), staleReview);
  }
});

test("talk-only erases notes and pending review and prevents recording plan or context details", () => {
  const pending = dialogueReducer(plannedSession(), { type: "contextField", field: "supports", value: "Community support" });
  let session = dialogueReducer(pending, { type: "contextMode", mode: "talk-only" });
  assert.deepEqual(session.context, { ...emptyContext, mode: "talk-only" });
  assert.deepEqual(session.plan, emptyPlan);
  assert.equal(session.planNeedsReview, false);
  session = dialogueReducer(session, { type: "reviewContext" });
  session = dialogueReducer(session, { type: "contextField", field: "sitting", value: "Do not retain" });
  session = dialogueReducer(session, { type: "planChoice", choice: "change" });
  session = dialogueReducer(session, { type: "planField", field: "action", value: "Do not retain" });
  assert.equal(session.context.sitting, "");
  assert.deepEqual(session.plan, emptyPlan);
  assert.equal(referenceScore(session.answers)?.total, 60);
});

test("changing a plan choice or topic never silently carries the previous action", () => {
  const before = dialogueReducer(plannedSession(), { type: "contextField", field: "supports", value: "Community support" });
  const changedTopic = dialogueReducer(before, { type: "planDomain", domain: "leisure" });
  assert.equal(changedTopic.plan.action, "");
  assert.equal(changedTopic.plan.choice, "change");
  const noChange = dialogueReducer(before, { type: "planChoice", choice: "none" });
  assert.deepEqual(noChange.plan, { ...emptyPlan, choice: "none" });
  assert.equal(noChange.planNeedsReview, false);
  const rejectedText = dialogueReducer(noChange, { type: "planField", field: "action", value: "Must not be retained" });
  assert.equal(rejectedText.plan.action, "");
});

test("reset clears every input and the demo marker, with independent fresh objects", () => {
  const pending = dialogueReducer(plannedSession(), { type: "contextField", field: "supports", value: "Community support" });
  const after = dialogueReducer(pending, { type: "reset" });
  assert.deepEqual(after, createSession());
  const another = createSession();
  after.context.sitting = "mutated in test";
  after.plan.action = "mutated in test";
  assert.equal(another.context.sitting, "");
  assert.equal(another.plan.action, "");
});
