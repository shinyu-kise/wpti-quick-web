import assert from "node:assert/strict";
import test from "node:test";
import { createSession, dialogueReducer, referenceScore } from "./dialogue.ts";
import type { DialogueSession } from "./dialogue.ts";
import { SHORT_BOUT_IDEAS } from "./short-bouts.ts";
import { buildSummary } from "./practice.ts";

test("short-bout insertion requires notes, an explicit change choice and an empty action in every state combination", () => {
  let checked = 0;
  for (const mode of ["", "notes", "talk-only"] as const) {
    for (const choice of ["", "change", "maintain", "none"] as const) {
      for (const action of ["", " \n\t", "Participant's own plan", "  Already entered  "]) {
        const before: DialogueSession = {
          ...createSession(),
          context: { ...createSession().context, mode, supports: "Existing context" },
          plan: { choice, domain: "other", action, when: "After lunch", support: "A companion", review: "2026-11-06" },
          planNeedsReview: true
        };
        const after = dialogueReducer(before, { type: "insertShortBout", value: "Selected example" });
        if (mode === "notes" && choice === "change" && !action.trim()) {
          assert.deepEqual(after, { ...before, plan: { ...before.plan, action: "Selected example" } });
        } else {
          assert.equal(after, before, JSON.stringify({ mode, choice, action }));
        }
        checked += 1;
      }
    }
  }
  assert.equal(checked, 48);
});

test("stale, repeated and empty suggestion actions never overwrite a participant's plan", () => {
  let session = dialogueReducer(createSession(), { type: "contextMode", mode: "notes" });
  session = dialogueReducer(session, { type: "planChoice", choice: "change" });
  for (const value of ["", " \n\t"]) {
    assert.equal(dialogueReducer(session, { type: "insertShortBout", value }), session);
  }
  const inserted = dialogueReducer(session, { type: "insertShortBout", value: "First example" });
  assert.equal(dialogueReducer(inserted, { type: "insertShortBout", value: "Second example" }), inserted);
  const edited = dialogueReducer(inserted, { type: "planField", field: "action", value: "Participant edited the draft" });
  assert.equal(dialogueReducer(edited, { type: "insertShortBout", value: "Stale example click" }), edited);
});

test("all 64 original scores survive direct and legacy Japanese and English example actions without changing responses or selecting a domain", () => {
  let checked = 0;
  for (const leisure of ["leisure_0_30", "leisure_31_90", "leisure_91_150", "leisure_151_plus"] as const) {
    for (const transport of ["transport_0_30", "transport_31_90", "transport_91_150", "transport_151_plus"] as const) {
      for (const sedentary of ["sedentary_8_plus", "sedentary_6_7", "sedentary_4_5", "sedentary_3_or_less"] as const) {
        let session: DialogueSession = { ...createSession(), answers: { leisure, transport, sedentary } };
        session = dialogueReducer(session, { type: "contextMode", mode: "notes" });
        session = dialogueReducer(session, { type: "planChoice", choice: "change" });
        const beforeScore = referenceScore(session.answers);
        for (const language of ["ja", "en"] as const) {
          for (const idea of SHORT_BOUT_IDEAS[language]) {
            for (const type of ["insertShortBout", "startShortBout"] as const) {
              const after = dialogueReducer(session, { type, value: idea.action });
              assert.deepEqual(after.answers, session.answers);
              assert.deepEqual(after.nonresponses, session.nonresponses);
              assert.deepEqual(referenceScore(after.answers), beforeScore);
              assert.equal(after.plan.domain, "");
              assert.equal(after.plan.action, idea.action);
              assert.equal(after.plan.choice, "change");
              assert.ok(buildSummary(after, language, "2026-10-30").includes(idea.action));
              checked += 1;
            }
          }
        }
      }
    }
  }
  assert.equal(checked, 768);
});

test("inserted drafts are erased by reset and talk-only mode but preserved for review after response changes", () => {
  let session = dialogueReducer(createSession(), { type: "example" });
  session = dialogueReducer(session, { type: "contextMode", mode: "notes" });
  session = dialogueReducer(session, { type: "planChoice", choice: "change" });
  session = dialogueReducer(session, { type: "insertShortBout", value: SHORT_BOUT_IDEAS.ja[0].action });
  assert.deepEqual(dialogueReducer(session, { type: "reset" }), createSession());
  const talkOnly = dialogueReducer(session, { type: "contextMode", mode: "talk-only" });
  assert.deepEqual(talkOnly.plan, createSession().plan);
  assert.deepEqual(talkOnly.answers, session.answers);
  const changedAnswer = dialogueReducer(session, { type: "answer", questionId: "leisure", optionId: "leisure_0_30" });
  assert.deepEqual(changedAnswer.plan, session.plan);
  assert.deepEqual(changedAnswer.context, session.context);
  assert.equal(changedAnswer.planNeedsReview, true);
  const unanswered = dialogueReducer(session, { type: "nonresponse", questionId: "leisure", value: "unsure" });
  assert.deepEqual(unanswered.plan, session.plan);
  assert.equal(unanswered.planNeedsReview, true);
  assert.equal(referenceScore(unanswered.answers), null);
});

test("direct example selection enables notes and a change draft without replacing existing text or another choice", () => {
  let checked = 0;
  for (const mode of ["", "notes", "talk-only"] as const) {
    for (const choice of ["", "change", "maintain", "none"] as const) {
      for (const action of ["", " \n\t", "My existing plan"]) {
        const before: DialogueSession = {
          ...createSession(),
          context: { ...createSession().context, mode, sitting: "My context" },
          plan: { choice, action, domain: "transport", when: "After lunch", support: "A companion", review: "2026-11-06" },
          contextReviewed: true,
          planNeedsReview: true
        };
        const after = dialogueReducer(before, { type: "startShortBout", value: "Chosen example" });
        if (["", "change"].includes(choice) && !action.trim()) {
          assert.deepEqual(after, {
            ...before,
            context: { ...before.context, mode: "notes" },
            plan: { ...before.plan, choice: "change", action: "Chosen example" }
          });
        } else {
          assert.equal(after, before);
        }
        checked += 1;
      }
    }
  }
  assert.equal(checked, 36);
});

test("direct example selection rejects blank, repeated and stale clicks while allowing editing afterwards", () => {
  const initial = createSession();
  for (const value of ["", " \n\t"]) {
    assert.equal(dialogueReducer(initial, { type: "startShortBout", value }), initial);
  }
  const started = dialogueReducer(initial, { type: "startShortBout", value: "First example" });
  assert.equal(started.context.mode, "notes");
  assert.equal(started.plan.choice, "change");
  assert.equal(started.planNeedsReview, false);
  assert.equal(dialogueReducer(started, { type: "startShortBout", value: "Other example" }), started);
  const edited = dialogueReducer(started, { type: "planField", field: "action", value: "My own version" });
  assert.equal(edited.plan.action, "My own version");
  assert.equal(dialogueReducer(edited, { type: "startShortBout", value: "Stale example" }), edited);
});
