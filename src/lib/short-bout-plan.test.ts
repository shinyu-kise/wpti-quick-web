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

test("all 64 original scores survive each Japanese and English example without changing responses or selecting a domain", () => {
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
            const after = dialogueReducer(session, { type: "insertShortBout", value: idea.action });
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
  assert.equal(checked, 384);
});

test("inserted drafts are erased by reset, talk-only mode and upstream response changes", () => {
  let session = dialogueReducer(createSession(), { type: "example" });
  session = dialogueReducer(session, { type: "contextMode", mode: "notes" });
  session = dialogueReducer(session, { type: "planChoice", choice: "change" });
  session = dialogueReducer(session, { type: "insertShortBout", value: SHORT_BOUT_IDEAS.ja[0].action });
  assert.deepEqual(dialogueReducer(session, { type: "reset" }), createSession());
  const talkOnly = dialogueReducer(session, { type: "contextMode", mode: "talk-only" });
  assert.deepEqual(talkOnly.plan, createSession().plan);
  assert.deepEqual(talkOnly.answers, session.answers);
  const changedAnswer = dialogueReducer(session, { type: "answer", questionId: "leisure", optionId: "leisure_0_30" });
  assert.deepEqual(changedAnswer.plan, createSession().plan);
  assert.deepEqual(changedAnswer.context, createSession().context);
  const unanswered = dialogueReducer(session, { type: "nonresponse", questionId: "leisure", value: "unsure" });
  assert.deepEqual(unanswered.plan, createSession().plan);
  assert.equal(referenceScore(unanswered.answers), null);
});
