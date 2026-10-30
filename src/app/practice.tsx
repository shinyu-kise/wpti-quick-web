"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch } from "react";
import { copy } from "../lib/i18n.ts";
import { PAPER_URL, responseLabel, weeklyMinutes } from "../lib/practice.ts";
import { CONTEXT_FIELDS } from "../lib/dialogue.ts";
import type { DialogueAction, DialogueSession, PlanChoice } from "../lib/dialogue.ts";
import { workflowCopy } from "../lib/workflow-copy.ts";
import { guidedCopy } from "../lib/guided-copy.ts";
import { getDomainFeedback } from "../lib/domain-feedback.ts";
import { domainFeedbackCopy, domainFeedbackMessage } from "../lib/domain-feedback-copy.ts";
import { QUESTION_ORDER } from "../lib/scoring.ts";
import type { Language, QuestionId } from "../lib/types.ts";

type DialogueProps = { language: Language; session: DialogueSession; dispatch: Dispatch<DialogueAction> };

export function Evidence({ language }: { language: Language }) {
  const w = workflowCopy[language];
  return <details className="evidence no-print">
    <summary>{w.evidenceTitle}</summary>
    <ul className="plain-list">{w.evidence.map(line => <li key={line}>{line}</li>)}</ul>
    <a href={PAPER_URL} target="_blank" rel="noreferrer">{w.original} ↗</a>
  </details>;
}

export function RecallHelp({ id, language }: { id: QuestionId; language: Language }) {
  const w = workflowCopy[language];
  const [days, setDays] = useState("");
  const [minutes, setMinutes] = useState("");
  const total = weeklyMinutes(days, minutes);
  return <div className="recall-help">
    <p className="hint" id={`${id}-hint`}>{w.hints[id]}</p>
    {id === "sedentary" && <>
      <h3>{w.intervalTitle}</h3>
      <p className="hint">{w.intervalNote}</p>
    </>}
    {id !== "sedentary" && <div className="recall-calculator">
      <h3>{w.calcTitle}</h3>
      <div className="recall-fields">
        <label htmlFor={`${id}-days`}>{w.days}<input id={`${id}-days`} type="number" inputMode="numeric" min="0" max="7" step="1" autoComplete="off" value={days} onChange={e => setDays(e.target.value)} /></label>
        <span aria-hidden="true">×</span>
        <label htmlFor={`${id}-minutes`}>{w.minutes}<input id={`${id}-minutes`} type="number" inputMode="decimal" min="0" max="1440" step="any" autoComplete="off" value={minutes} onChange={e => setMinutes(e.target.value)} /></label>
        <output aria-live="polite">{w.total}: <strong>{total === null ? "—" : total}</strong> {language === "ja" ? "分" : "min"}</output>
      </div>
      {days && minutes && total === null && <p role="alert" className="validation-message">{w.invalid}</p>}
      <p className="hint">{w.calcNote}</p>
    </div>}
  </div>;
}

export function BehaviorProfile({ language, session, compact = true }: Pick<DialogueProps, "language" | "session"> & { compact?: boolean }) {
  const t = copy[language], w = workflowCopy[language], c = domainFeedbackCopy[language];
  const feedback = getDomainFeedback(session.answers);
  return <section className="domain-section behavior-profile scored-profile" aria-labelledby="profile-title">
    <h2 id="profile-title">{c.title}</h2>
    <div className={`domain-feedback-message feedback-${feedback.status}`}>
      <p className="feedback-headline">{domainFeedbackMessage(feedback, language)}</p>
      {feedback.status === "comparable" && <p>{feedback.focusIds.length === 1 ? c.hints[feedback.focusIds[0]] : c.choose}</p>}
    </div>
    <p className={`hint${compact ? " print-only" : ""}`}>{t.assessment.recallPeriod}</p>
    <div className="domain-list">
      {QUESTION_ORDER.map(id => {
        const { points, max } = feedback.domains[id];
        const focus = feedback.focusIds.includes(id);
        return <article className={`domain-row scored-domain${focus ? " focus-domain" : ""}`} key={id}>
          {compact && <h3 className="no-print">{c.names[id]}</h3>}
          <h3 className={compact ? "print-only" : undefined}>{t.questions.find(q => q.id === id)?.title}</h3>
          <p className={`response-label ${points === null ? "unresolved" : ""}`}>{responseLabel(session.answers, id, language, session.nonresponses)}</p>
          {points !== null ? <div className="domain-score-line">
            <div className="domain-score-track" aria-hidden="true"><span style={{ width: `${points / max * 100}%` }} /></div>
            <p className="domain-points"><strong>{points}</strong> / {max}{language === "ja" ? "点" : " pts"}</p>
          </div> : <p className="unscored-label">{c.noScore}</p>}
          {focus && <span className="domain-focus-label">{c.candidate}</span>}
        </article>;
      })}
    </div>
    <p className="domain-score-note">{feedback.status !== "incomplete" && <>{c.comparison}<br /></>}{c.limitation}</p>
    <p className="print-only">{c.method}</p>
    {compact && <details className="editor-details profile-guide no-print">
      <summary>{language === "ja" ? "点数と回答の見方" : "About the scores and responses"}</summary>
      <p>{c.method}</p><p>{c.missing}</p>
      <p>{guidedCopy[language].recall}</p><p>{w.profileNote}</p>
      {QUESTION_ORDER.map(id => <p key={id}>{t.questions.find(q => q.id === id)?.title}</p>)}
    </details>}
  </section>;
}

function RecordingPrivacy({ language }: { language: Language }) {
  const w = workflowCopy[language];
  return <div className="recording-privacy">
    <p className="privacy-brief">{language === "ja"
      ? "名前は書かないでください。メモは自動では保存・送信されません。"
      : "Do not enter names. Notes are not saved or sent automatically."}</p>
    <details className="editor-details record-information">
      <summary>{language === "ja" ? "メモを書く前に" : "Before writing notes"}</summary>
      <p>{w.privacy}</p>
      <p>{w.consent}</p>
    </details>
  </div>;
}

function PlanReviewNotice({ language, onConfirm }: { language: Language; onConfirm?: () => void }) {
  const w = workflowCopy[language];
  return <div className="notice plan-review-notice" role="status">
    <p>{w.planReviewPending}</p>
    {onConfirm && <button className="secondary-button" type="button" onClick={onConfirm}>{language === "ja"
      ? "メモを確認しました"
      : "I have checked my note"}</button>}
  </div>;
}

export function ContextEditor({ language, session, dispatch }: DialogueProps) {
  const editorRef = useRef<HTMLElement>(null);
  const focusAfterMode = useRef(false);
  useEffect(() => {
    if (!focusAfterMode.current) return;
    focusAfterMode.current = false;
    editorRef.current?.querySelector<HTMLElement>(session.context.mode === "notes" ? "#context-sitting" : ".enable-notes")?.focus();
  }, [session.context.mode]);
  function changeMode(mode: "notes" | "talk-only") {
    focusAfterMode.current = true;
    dispatch({ type: "contextMode", mode });
  }
  const w = workflowCopy[language];
  const otherFields = CONTEXT_FIELDS.filter(field => field !== "sitting");
  const hasPlanData = Object.values(session.plan).some(Boolean);
  function contextField(field: (typeof CONTEXT_FIELDS)[number]) {
    return <div className={`context-field context-${field}`} key={field}>
      <label htmlFor={`context-${field}`}>{field === "sitting"
        ? language === "ja" ? "座っているのは、どんなとき？" : "When do you spend time sitting?"
        : w.contextLabels[field]}</label>
      <p className="hint" id={`context-${field}-hint`}>{w.contextHints[field]}</p>
      <textarea id={`context-${field}`} aria-describedby={`context-${field}-hint`} autoComplete="off" rows={field === "period" ? 2 : 3} maxLength={field === "period" ? 160 : 500} value={session.context[field]} onChange={e => dispatch({ type: "contextField", field, value: e.target.value })} />
      {field === "period" && <p className="hint">{w.periodNote}</p>}
    </div>;
  }
  return <section className="dialogue-editor" aria-label={w.contextTitle} ref={editorRef}>
    <p className="editor-intro">{language === "ja" ? "書きたいことだけで構いません。" : "Write only what you wish to record."}</p>
    {session.context.mode === "notes" ? <>
      <RecordingPrivacy language={language} />
      {hasPlanData && <p className="change-warning">{w.contextReset}</p>}
      <div className="context-fields context-primary">{contextField("sitting")}</div>
      <details className="editor-details context-more">
        <summary>{language === "ja" ? "ほかに書いておきたいこと" : "Other things to note"}</summary>
        <p className="hint">{w.contextIntro}</p>
        <div className="context-fields">{otherFields.map(contextField)}</div>
      </details>
      <button className="text-button" type="button" onClick={() => changeMode("talk-only")}>{language === "ja"
        ? "書いたメモをすべて消す"
        : "Clear context and plan notes and continue without recording"}</button>
    </> : <>
      <div className="talk-prompts">
        <p className="talk-status">{w.notRecorded}</p>
        <div className="talk-prompt"><h3>{language === "ja" ? "座っているのは、どんなとき？" : "When do you spend time sitting?"}</h3><p>{w.prompts.sedentary}</p></div>
        <details className="editor-details secondary-topics">
          <summary>{language === "ja" ? "ほかに振り返りたいことがあれば" : "Other topics, if useful"}</summary>
          {otherFields.map(field => <div key={field}><h3>{w.contextLabels[field]}</h3><p>{w.contextHints[field]}</p></div>)}
          <p className="hint">{w.periodNote}</p>
        </details>
      </div>
      <button className="secondary-button enable-notes" type="button" onClick={() => changeMode("notes")}>{language === "ja"
        ? "暮らしについてメモする"
        : "Add notes about daily life"}</button>
    </>}
  </section>;
}

export function PlanEditor({ language, session, dispatch, onDone }: DialogueProps & { onDone?: () => void }) {
  const planRef = useRef<HTMLElement>(null);
  const choicesRef = useRef<HTMLDetailsElement>(null);
  const focusAfterReview = useRef(false);
  const focusAfterNotes = useRef(false);
  const focusAfterChoice = useRef(false);
  useEffect(() => {
    if (session.context.mode === "notes" && focusAfterNotes.current) {
      focusAfterNotes.current = false;
      planRef.current?.querySelector<HTMLElement>('input[name="plan-choice"]')?.focus();
    }
  }, [session.context.mode]);
  useEffect(() => {
    if (!session.planNeedsReview && focusAfterReview.current) {
      focusAfterReview.current = false;
      (planRef.current?.querySelector<HTMLElement>('#plan-action') ?? planRef.current?.querySelector<HTMLElement>('.plan-complete button') ?? planRef.current)?.focus();
    }
  }, [session.planNeedsReview]);
  useEffect(() => {
    if (!focusAfterChoice.current) return;
    focusAfterChoice.current = false;
    (planRef.current?.querySelector<HTMLElement>(session.plan.choice ? '#plan-action, .plan-complete button' : 'input[name="plan-choice"]') ?? planRef.current)?.focus();
  }, [session.plan.choice]);
  const w = workflowCopy[language];
  const plan = session.plan;
  const hasPlan = ["change", "maintain"].includes(plan.choice);
  const hasPlanDetails = [plan.domain, plan.action, plan.when, plan.support, plan.review].some(Boolean);
  const changeWarning = language === "ja" ? "選び直すと、ここに書いたメモは消えます。" : "Choosing something else clears the plan details entered here.";
  function choose(choice: PlanChoice) {
    focusAfterChoice.current = true;
    dispatch({ type: "planChoice", choice });
    if (choicesRef.current) choicesRef.current.open = false;
  }
  const choices = <fieldset className="plan-choices">
    <legend>{language === "ja" ? "今の気持ちに近いものを選んでください" : "Choose what feels right for you"}</legend>
    {(Object.keys(w.planChoices) as Exclude<PlanChoice, "">[]).map(choice => <label key={choice} className={plan.choice === choice ? "chosen" : ""}>
      <input type="radio" name="plan-choice" checked={plan.choice === choice} onChange={() => choose(choice)} />
      {w.planChoices[choice]}
    </label>)}
  </fieldset>;
  const doneButton = onDone && <div className="plan-complete"><button className="primary-button" type="button" onClick={onDone}>{language === "ja" ? "これで終わる" : "Done"}</button></div>;
  return <section className="action-plan" aria-label={w.planTitle} tabIndex={-1} ref={planRef}>
    {session.planNeedsReview && <PlanReviewNotice language={language} onConfirm={() => { focusAfterReview.current = true; dispatch({ type: "acknowledgePlanReview" }); }} />}
    {session.context.mode !== "notes" ? <>
      <p className="talk-status">{w.notRecorded}</p>
      <div className="talk-prompt"><h3>{language === "ja" ? "今の気持ちに近いものは？" : "What feels right for you now?"}</h3></div>
      <ul className="talk-choice-list">{Object.values(w.planChoices).map(label => <li key={label}>{label}</li>)}</ul>
      <button className="secondary-button enable-plan-notes" type="button" onClick={() => {
        focusAfterNotes.current = true;
        dispatch({ type: "contextMode", mode: "notes" });
      }}>{language === "ja" ? "メモを書く" : "Write a note"}</button>
      {doneButton}
    </> : <>
      {plan.choice ? <p className="plan-current-choice">{w.planChoices[plan.choice]}</p> : choices}
      {hasPlan && <>
        <RecordingPrivacy language={language} />
        <div className="plan-fields plan-primary">
          <label htmlFor="plan-action">{w.action}<textarea id="plan-action" rows={3} maxLength={500} autoComplete="off" value={plan.action} onChange={e => dispatch({ type: "planField", field: "action", value: e.target.value })} /></label>
        </div>
      </>}
      {doneButton}
      {plan.choice && <details className="editor-details plan-choice-change" ref={choicesRef}>
        <summary>{language === "ja" ? "選び直す" : "Change my choice"}</summary>
        {hasPlanDetails && <p className="change-warning">{changeWarning}</p>}
        {choices}
        <button type="button" className="text-button" onClick={() => choose("")}>{w.noPlan}</button>
      </details>}
      {hasPlan && <>
        <details className="editor-details plan-more">
          <summary>{language === "ja" ? "いつやるかなど、詳しく書く" : "Add details, such as when to do it"}</summary>
          <div className="plan-fields">
            {(["when", "support"] as const).map(field => <label key={field} htmlFor={`plan-${field}`}>{w[field]}<textarea id={`plan-${field}`} rows={2} maxLength={500} autoComplete="off" value={plan[field]} onChange={e => dispatch({ type: "planField", field, value: e.target.value })} /></label>)}
            <label htmlFor="plan-review">{w.review}<input id="plan-review" type="date" autoComplete="off" value={plan.review} onChange={e => dispatch({ type: "planField", field: "review", value: e.target.value })} /></label>
          </div>
        </details>
      </>}
    </>}
    <details className="editor-details plan-guidance">
      <summary>{language === "ja" ? "何を書くか迷ったら" : "If you are unsure what to write"}</summary>
      <p>{w.planIntro}</p>
      <p>{w.personalized}</p>
      <p>{w.reviewNote}</p>
    </details>
  </section>;
}

export function ConversationDetails({ language, session }: Pick<DialogueProps, "language" | "session">) {
  const t = copy[language];
  const w = workflowCopy[language];
  const { context, plan } = session;
  const notes = context.mode === "notes";
  const hasContextNotes = CONTEXT_FIELDS.some(field => context[field].trim());
  const hasPlanDetails = [plan.domain, plan.action, plan.when, plan.support, plan.review].some(value => value.trim());
  if (!notes) return <section className="summary-section print-only">
    <h2>{language === "ja" ? "暮らしと、やってみたいこと" : "Daily life and what you would like to do"}</h2>
    <p>{w.notRecorded}</p>
  </section>;
  return <>
    <section className={`summary-section${notes && hasContextNotes ? "" : " print-only"}`} aria-labelledby="context-summary-title">
      <p className="eyebrow">02</p><h2 id="context-summary-title">{w.contextTitle}</h2>
      {notes ? <>
        <dl className="summary-list">{CONTEXT_FIELDS.map(field => <div key={field} className={context[field].trim() ? undefined : "print-only"}><dt>{w.contextLabels[field]}</dt><dd>{context[field] || w.notEntered}</dd></div>)}</dl>
      </> : <p>{w.notRecorded}</p>}
      <p className="hint">{w.periodNote}</p>
    </section>
    <section className={`summary-section${notes && (plan.choice || hasPlanDetails) ? "" : " print-only"}`} aria-labelledby="plan-summary-title">
      <p className="eyebrow">03</p><h2 id="plan-summary-title">{w.planTitle}</h2>
      {session.planNeedsReview && <PlanReviewNotice language={language} />}
      {notes ? <>
        <p className="plan-decision">{plan.choice ? w.planChoices[plan.choice] : w.notEntered}</p>
        {["change", "maintain"].includes(plan.choice) && <>
          <dl className="summary-list">
            {plan.domain && <div><dt>{w.choose}</dt><dd>{plan.domain === "other" ? w.otherDomain : t.domainLabels[plan.domain]}</dd></div>}
            {(["action", "when", "support", "review"] as const).map(field => <div key={field} className={plan[field].trim() ? undefined : "print-only"}><dt>{w[field]}</dt><dd>{plan[field] || w.notEntered}</dd></div>)}
          </dl>
        </>}
      </> : <p>{w.notRecorded}</p>}
      <p className="hint">{w.reviewNote}</p>
    </section>
  </>;
}
