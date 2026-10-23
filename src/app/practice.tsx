"use client";

import { useState } from "react";
import type { Dispatch } from "react";
import { copy } from "../lib/i18n.ts";
import { PAPER_URL, responseLabel, weeklyMinutes } from "../lib/practice.ts";
import { CONTEXT_FIELDS } from "../lib/dialogue.ts";
import type { DialogueAction, DialogueSession, PlanChoice } from "../lib/dialogue.ts";
import { workflowCopy } from "../lib/workflow-copy.ts";
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
    {id === "sedentary" && <details>
      <summary>{w.intervalTitle}</summary>
      <p className="hint">{w.intervalNote}</p>
    </details>}
    {id !== "sedentary" && <details>
      <summary>{w.calcTitle}</summary>
      <div className="recall-fields">
        <label htmlFor={`${id}-days`}>{w.days}<input id={`${id}-days`} type="number" min="0" max="7" step="1" autoComplete="off" value={days} onChange={e => setDays(e.target.value)} /></label>
        <span aria-hidden="true">×</span>
        <label htmlFor={`${id}-minutes`}>{w.minutes}<input id={`${id}-minutes`} type="number" min="0" max="1440" step="any" autoComplete="off" value={minutes} onChange={e => setMinutes(e.target.value)} /></label>
        <output aria-live="polite">{w.total}: <strong>{total === null ? "—" : total}</strong> {language === "ja" ? "分" : "min"}</output>
      </div>
      {days && minutes && total === null && <p role="alert" className="validation-message">{w.invalid}</p>}
      <p className="hint">{w.calcNote}</p>
    </details>}
  </div>;
}

export function BehaviorProfile({ language, session }: Pick<DialogueProps, "language" | "session">) {
  const t = copy[language];
  const w = workflowCopy[language];
  return <section className="domain-section behavior-profile" aria-labelledby="profile-title">
    <h2 id="profile-title">{w.profileTitle}</h2>
    <p className="hint">{t.assessment.recallPeriod}</p>
    <p className="hint">{w.profileNote}</p>
    <div className="domain-list">
      {QUESTION_ORDER.map((id, index) => <article className="domain-row" key={id}>
        <p className="eyebrow">0{index + 1}</p>
        <h3>{t.questions.find(q => q.id === id)?.title}</h3>
        <p className={`response-label ${session.answers[id] ? "" : "unresolved"}`}>{responseLabel(session.answers, id, language, session.nonresponses)}</p>
      </article>)}
    </div>
  </section>;
}

export function ContextEditor({ language, session, dispatch }: DialogueProps) {
  const w = workflowCopy[language];
  return <section className="dialogue-editor" aria-label={w.contextTitle}>
    <p>{w.contextIntro}</p>
    <div className="notice">{w.privacy}</div>
    <p className="hint">{w.consent}</p>
    <fieldset className="recording-choices">
      <legend>{w.modeTitle}</legend>
      {(["notes", "talk-only"] as const).map(mode => <label className="option-row" key={mode}>
        <input type="radio" name="recording-mode" checked={session.context.mode === mode} onChange={() => dispatch({ type: "contextMode", mode })} />
        <span>{mode === "notes" ? w.notesMode : w.talkOnly}</span>
      </label>)}
    </fieldset>
    {session.context.mode === "talk-only" && <p className="hint">{w.talkOnlyNote}</p>}
    {session.context.mode === "notes" && <div className="context-fields">
      {CONTEXT_FIELDS.map(field => <div className={`context-field context-${field}`} key={field}>
        <label htmlFor={`context-${field}`}>{w.contextLabels[field]}</label>
        <p className="hint" id={`context-${field}-hint`}>{w.contextHints[field]}</p>
        <textarea id={`context-${field}`} aria-describedby={`context-${field}-hint`} autoComplete="off" rows={field === "period" ? 2 : 3} maxLength={field === "period" ? 160 : 500} value={session.context[field]} onChange={e => dispatch({ type: "contextField", field, value: e.target.value })} />
        {field === "period" && <p className="hint">{w.periodNote}</p>}
      </div>)}
    </div>}
    {session.context.mode === "talk-only" && <div className="talk-prompts">
      <p className="talk-status">{w.notRecorded}</p>
      {CONTEXT_FIELDS.map(field => <div key={field}><h3>{w.contextLabels[field]}</h3><p>{w.contextHints[field]}</p></div>)}
    </div>}
    <p className="hint">{w.contextReset}</p>
  </section>;
}

export function PlanEditor({ language, session, dispatch }: DialogueProps) {
  const t = copy[language];
  const w = workflowCopy[language];
  const plan = session.plan;
  const hasPlan = ["change", "maintain"].includes(plan.choice);
  return <section className="action-plan" aria-label={w.planTitle}>
    <p>{w.planIntro}</p>
    {session.context.mode === "talk-only" ? <>
      <p className="talk-status">{w.notRecorded}</p>
      <ul className="plain-list">{Object.values(w.planChoices).map(label => <li key={label}>{label}</li>)}</ul>
      <p>{w.choose} → {w.action} → {w.support}</p>
    </> : <>
      <fieldset className="plan-choices">
        <legend>{language === "ja" ? "本人と選んだ方針（任意）" : "Choice agreed together (optional)"}</legend>
        {(Object.keys(w.planChoices) as Exclude<PlanChoice, "">[]).map(choice => <label key={choice} className={plan.choice === choice ? "chosen" : ""}>
          <input type="radio" name="plan-choice" checked={plan.choice === choice} onChange={() => dispatch({ type: "planChoice", choice })} />
          {w.planChoices[choice]}
        </label>)}
      </fieldset>
      <button type="button" className="text-button" onClick={() => dispatch({ type: "planChoice", choice: "" })}>{w.noPlan}</button>
      {hasPlan && <>
        <fieldset className="plan-choices topic-choices">
          <legend>{w.choose}</legend>
          {([...QUESTION_ORDER, "other"] as const).map(domain => <label key={domain} className={plan.domain === domain ? "chosen" : ""}>
            <input type="radio" name="plan-domain" checked={plan.domain === domain} onChange={() => dispatch({ type: "planDomain", domain })} />
            {domain === "other" ? w.otherDomain : t.domainLabels[domain]}
          </label>)}
        </fieldset>
        <p className="hint">{language === "ja" ? "方針や話題を変えると、以下の以前の記入内容は消えます。" : "Changing the choice or topic clears the previously entered details below."}</p>
        <div className="plan-fields">
          {(["action", "when", "support"] as const).map(field => <label key={field} htmlFor={`plan-${field}`}>{w[field]}<textarea id={`plan-${field}`} rows={2} maxLength={500} autoComplete="off" value={plan[field]} onChange={e => dispatch({ type: "planField", field, value: e.target.value })} /></label>)}
          <label htmlFor="plan-review">{w.review}<input id="plan-review" type="date" autoComplete="off" value={plan.review} onChange={e => dispatch({ type: "planField", field: "review", value: e.target.value })} /></label>
        </div>
      </>}
      <p className="hint">{w.privacy}</p>
    </>}
    <p className="hint">{w.personalized}</p>
    <div className="notice">{w.reviewNote}</div>
  </section>;
}

export function ConversationDetails({ language, session }: Pick<DialogueProps, "language" | "session">) {
  const t = copy[language];
  const w = workflowCopy[language];
  const { context, plan } = session;
  const notes = context.mode === "notes";
  return <>
    <section className="summary-section" aria-labelledby="context-summary-title">
      <p className="eyebrow">02</p><h2 id="context-summary-title">{w.contextTitle}</h2>
      {notes ? <dl className="summary-list">{CONTEXT_FIELDS.map(field => <div key={field}><dt>{w.contextLabels[field]}</dt><dd>{context[field] || w.notEntered}</dd></div>)}</dl> : <p>{w.notRecorded}</p>}
      <p className="hint">{w.periodNote}</p>
    </section>
    <section className="summary-section" aria-labelledby="plan-summary-title">
      <p className="eyebrow">03</p><h2 id="plan-summary-title">{w.planTitle}</h2>
      {notes ? <>
        <p className="plan-decision">{plan.choice ? w.planChoices[plan.choice] : w.notEntered}</p>
        {["change", "maintain"].includes(plan.choice) && <dl className="summary-list">
          <div><dt>{w.choose}</dt><dd>{plan.domain ? plan.domain === "other" ? w.otherDomain : t.domainLabels[plan.domain] : w.notEntered}</dd></div>
          {(["action", "when", "support", "review"] as const).map(field => <div key={field}><dt>{w[field]}</dt><dd>{plan[field] || w.notEntered}</dd></div>)}
        </dl>}
      </> : <p>{w.notRecorded}</p>}
      <p className="hint">{w.reviewNote}</p>
    </section>
  </>;
}
