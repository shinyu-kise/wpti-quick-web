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
    {id === "sedentary" && <>
      <h3>{w.intervalTitle}</h3>
      <p className="hint">{w.intervalNote}</p>
    </>}
    {id !== "sedentary" && <details className="editor-details recall-calculator">
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

export function BehaviorProfile({ language, session, compact = true }: Pick<DialogueProps, "language" | "session"> & { compact?: boolean }) {
  const t = copy[language];
  const w = workflowCopy[language];
  return <section className="domain-section behavior-profile" aria-labelledby="profile-title">
    <h2 id="profile-title">{w.profileTitle}</h2>
    <p className={`hint${compact ? " print-only" : ""}`}>{t.assessment.recallPeriod}</p>
    <p className={`hint${compact ? " print-only" : ""}`}>{w.profileNote}</p>
    <div className="domain-list">
      {QUESTION_ORDER.map((id, index) => <article className="domain-row" key={id}>
        <p className="eyebrow">0{index + 1}</p>
        {compact && <h3 className="no-print">{t.domainLabels[id]}</h3>}
        <h3 className={compact ? "print-only" : undefined}>{t.questions.find(q => q.id === id)?.title}</h3>
        <p className={`response-label ${session.answers[id] ? "" : "unresolved"}`}>{responseLabel(session.answers, id, language, session.nonresponses)}</p>
      </article>)}
    </div>
    {compact && <details className="editor-details profile-guide no-print">
      <summary>{language === "ja" ? "回答の見方" : "About these responses"}</summary>
      <p>{t.assessment.recallPeriod}</p>
      <p>{w.profileNote}</p>
      {QUESTION_ORDER.map(id => <p key={id}>{t.questions.find(q => q.id === id)?.title}</p>)}
    </details>}
  </section>;
}

function RecordingPrivacy({ language }: { language: Language }) {
  const w = workflowCopy[language];
  return <div className="recording-privacy">
    <p className="privacy-brief">{language === "ja"
      ? "名前などは入力しないでください。メモは自動送信・自動保存されません。再読み込みで消えます。本人と記録範囲を確認してください。"
      : "Do not enter names or other identifying details. Notes are not sent or saved automatically. Reloading clears them. Agree with the participant what may be recorded."}</p>
    <details className="editor-details record-information">
      <summary>{language === "ja" ? "記録と個人情報について" : "Notes and privacy"}</summary>
      <p>{w.privacy}</p>
      <p>{w.consent}</p>
    </details>
  </div>;
}

export function ContextEditor({ language, session, dispatch }: DialogueProps) {
  const w = workflowCopy[language];
  const otherFields = CONTEXT_FIELDS.filter(field => field !== "sitting");
  const hasContextNotes = CONTEXT_FIELDS.some(field => Boolean(session.context[field]));
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
  return <section className="dialogue-editor" aria-label={w.contextTitle}>
    <p className="editor-intro">{language === "ja" ? "話すだけでも大丈夫。本人と進め方を選びます。" : "Talking is enough. Choose how to continue together."}</p>
    {(hasContextNotes || hasPlanData) && <p className="change-warning">{language === "ja"
      ? "記録方法を変えると、入力済みの背景メモと計画は消えます。"
      : "Changing how you record notes clears the existing context notes and plan."}</p>}
    <fieldset className="recording-choices">
      <legend>{w.modeTitle}</legend>
      {(["talk-only", "notes"] as const).map(mode => <label className={`option-row recording-option ${session.context.mode === mode ? "chosen" : ""}`} key={mode}>
        <input type="radio" name="recording-mode" checked={session.context.mode === mode} onChange={() => dispatch({ type: "contextMode", mode })} />
        <span><strong>{mode === "talk-only"
          ? language === "ja" ? "話すだけ" : "Talk only"
          : language === "ja" ? "メモを残す" : "Make notes"}</strong>
          <small>{mode === "talk-only"
            ? language === "ja" ? "背景・計画は入力しません" : "No context or plan details entered"
            : language === "ja" ? "この画面だけの一時メモ" : "Temporary notes on this page"}</small></span>
      </label>)}
    </fieldset>
    {session.context.mode === "notes" && <>
      <RecordingPrivacy language={language} />
      {hasPlanData && <p className="change-warning">{w.contextReset}</p>}
      <div className="context-fields context-primary">{contextField("sitting")}</div>
      <details className="editor-details context-more">
        <summary>{language === "ja" ? "ほかの生活背景もメモする（任意）" : "Add other life circumstances (optional)"}</summary>
        <p className="hint">{w.contextIntro}</p>
        <div className="context-fields">{otherFields.map(contextField)}</div>
      </details>
    </>}
    {session.context.mode === "talk-only" && <div className="talk-prompts">
      <p className="talk-status">{w.notRecorded}</p>
      <div className="talk-prompt"><h3>{language === "ja" ? "座っているのは、どんなとき？" : "When do you spend time sitting?"}</h3><p>{w.prompts.sedentary}</p></div>
      <details className="editor-details secondary-topics">
        <summary>{language === "ja" ? "ほかに話したいことがあれば" : "Other topics, if useful"}</summary>
        {otherFields.map(field => <div key={field}><h3>{w.contextLabels[field]}</h3><p>{w.contextHints[field]}</p></div>)}
        <p className="hint">{w.periodNote}</p>
      </details>
    </div>}
  </section>;
}

export function PlanEditor({ language, session, dispatch }: DialogueProps) {
  const w = workflowCopy[language];
  const plan = session.plan;
  const hasPlan = ["change", "maintain"].includes(plan.choice);
  const hasPlanDetails = [plan.domain, plan.action, plan.when, plan.support, plan.review].some(Boolean);
  const changeWarning = language === "ja" ? "方針を変えると、記入済みの計画は消えます。" : "Changing the choice clears the plan details already entered.";
  return <section className="action-plan" aria-label={w.planTitle}>
    <p className="editor-intro">{language === "ja" ? "小さく変える、続ける、今は決めない。本人が選びます。" : "Make a small change, keep going, or decide later. The choice is yours."}</p>
    {session.context.mode === "talk-only" ? <>
      <p className="talk-status">{w.notRecorded}</p>
      <div className="talk-prompt"><h3>{language === "ja" ? "いまの希望に近いものは？" : "What feels right for you now?"}</h3></div>
      <ul className="talk-choice-list">{Object.values(w.planChoices).map(label => <li key={label}>{label}</li>)}</ul>
      <p className="hint">{language === "ja" ? "画面には記録せず、話し合って次へ進めます。" : "Talk it through and continue without recording the choice here."}</p>
    </> : <>
      {hasPlanDetails && <p className="change-warning">{changeWarning}</p>}
      <fieldset className="plan-choices">
        <legend>{language === "ja" ? "本人と選んだ方針（任意）" : "Choice agreed together (optional)"}</legend>
        {(Object.keys(w.planChoices) as Exclude<PlanChoice, "">[]).map(choice => <label key={choice} className={plan.choice === choice ? "chosen" : ""}>
          <input type="radio" name="plan-choice" checked={plan.choice === choice} onChange={() => dispatch({ type: "planChoice", choice })} />
          {w.planChoices[choice]}
        </label>)}
      </fieldset>
      {plan.choice && <button type="button" className="text-button" onClick={() => dispatch({ type: "planChoice", choice: "" })}>{w.noPlan}</button>}
      {hasPlan && <>
        <RecordingPrivacy language={language} />
        <div className="plan-fields plan-primary">
          <label htmlFor="plan-action">{w.action}<textarea id="plan-action" rows={3} maxLength={500} autoComplete="off" value={plan.action} onChange={e => dispatch({ type: "planField", field: "action", value: e.target.value })} /></label>
        </div>
        <details className="editor-details plan-more">
          <summary>{language === "ja" ? "いつ・支援・振り返り日を加える（任意）" : "Add timing, support or a review date (optional)"}</summary>
          <div className="plan-fields">
            {(["when", "support"] as const).map(field => <label key={field} htmlFor={`plan-${field}`}>{w[field]}<textarea id={`plan-${field}`} rows={2} maxLength={500} autoComplete="off" value={plan[field]} onChange={e => dispatch({ type: "planField", field, value: e.target.value })} /></label>)}
            <label htmlFor="plan-review">{w.review}<input id="plan-review" type="date" autoComplete="off" value={plan.review} onChange={e => dispatch({ type: "planField", field: "review", value: e.target.value })} /></label>
          </div>
        </details>
      </>}
    </>}
    <details className="editor-details plan-guidance">
      <summary>{language === "ja" ? "選ぶとき・振り返るときのヒント" : "Tips for choosing and reviewing"}</summary>
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
  return <>
    <section className="summary-section" aria-labelledby="context-summary-title">
      <p className="eyebrow">02</p><h2 id="context-summary-title">{w.contextTitle}</h2>
      {notes ? <>
        {!hasContextNotes && <p className="no-print">{w.notEntered}</p>}
        <dl className="summary-list">{CONTEXT_FIELDS.map(field => <div key={field} className={context[field].trim() ? undefined : "print-only"}><dt>{w.contextLabels[field]}</dt><dd>{context[field] || w.notEntered}</dd></div>)}</dl>
      </> : <p>{w.notRecorded}</p>}
      <p className="hint">{w.periodNote}</p>
    </section>
    <section className="summary-section" aria-labelledby="plan-summary-title">
      <p className="eyebrow">03</p><h2 id="plan-summary-title">{w.planTitle}</h2>
      {notes ? <>
        <p className="plan-decision">{plan.choice ? w.planChoices[plan.choice] : w.notEntered}</p>
        {["change", "maintain"].includes(plan.choice) && <>
          {!hasPlanDetails && <p className="no-print">{w.notEntered}</p>}
          <dl className="summary-list">
            <div className={plan.domain ? undefined : "print-only"}><dt>{w.choose}</dt><dd>{plan.domain ? plan.domain === "other" ? w.otherDomain : t.domainLabels[plan.domain] : w.notEntered}</dd></div>
            {(["action", "when", "support", "review"] as const).map(field => <div key={field} className={plan[field].trim() ? undefined : "print-only"}><dt>{w[field]}</dt><dd>{plan[field] || w.notEntered}</dd></div>)}
          </dl>
        </>}
      </> : <p>{w.notRecorded}</p>}
      <p className="hint">{w.reviewNote}</p>
    </section>
  </>;
}
