"use client";

import { useState } from "react";
import { copy } from "../lib/i18n.ts";
import { emptyPlan, PAPER_URL, weeklyMinutes } from "../lib/practice.ts";
import type { ActionPlan } from "../lib/practice.ts";
import { workflowCopy } from "../lib/workflow-copy.ts";
import type { Language, QuestionId } from "../lib/types.ts";

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
    {id !== "sedentary" && <details>
      <summary>{w.calcTitle}</summary>
      <div className="recall-fields">
        <label>{w.days}<input type="number" min="0" max="7" step="1" value={days} onChange={e => setDays(e.target.value)} /></label>
        <span aria-hidden="true">×</span>
        <label>{w.minutes}<input type="number" min="0" max="1440" step="any" value={minutes} onChange={e => setMinutes(e.target.value)} /></label>
        <output aria-live="polite">{w.total}: <strong>{total === null ? "—" : total}</strong> {language === "ja" ? "分" : "min"}</output>
      </div>
      {days && minutes && total === null && <p role="alert" className="validation-message">{w.invalid}</p>}
      <p className="hint">{w.calcNote}</p>
    </details>}
  </div>;
}

export function PlanEditor({ language, plan, setPlan }: { language: Language; plan: ActionPlan; setPlan: (plan: ActionPlan) => void }) {
  const t = copy[language];
  const w = workflowCopy[language];
  return <section className="action-plan" aria-labelledby="plan-title">
    <p className="eyebrow">03 / {language === "ja" ? "行動計画" : "ACTION PLAN"}</p>
    <h2 id="plan-title">{w.planTitle}</h2>
    <p>{w.planIntro}</p>
    <div className="no-print">
      <fieldset className="plan-choices">
        <legend>{w.choose}</legend>
        {t.questions.map(q => <label key={q.id} className={plan.domain === q.id ? "chosen" : ""}>
          <input type="radio" name="plan-domain" checked={plan.domain === q.id} onChange={() => setPlan({ ...plan, domain: q.id })} />
          {t.domainLabels[q.id]}
        </label>)}
        <label><input type="radio" name="plan-domain" checked={plan.domain === ""} onChange={() => setPlan({ ...emptyPlan })} />{w.noPlan}</label>
      </fieldset>
      {plan.domain && <div className="plan-example">
        <p>{w.examples[plan.domain]}</p>
        <button type="button" className="secondary-button" onClick={() => setPlan({ ...plan, action: w.examples[plan.domain as QuestionId] })}>{w.useExample}</button>
      </div>}
      <div className="plan-fields">
        <label>{w.action}<textarea rows={2} maxLength={500} value={plan.action} placeholder={w.actionPlaceholder} onChange={e => setPlan({ ...plan, action: e.target.value })} /></label>
        <label>{w.when}<textarea rows={2} maxLength={300} value={plan.when} placeholder={w.whenPlaceholder} onChange={e => setPlan({ ...plan, when: e.target.value })} /></label>
        <label>{w.review}<input type="date" value={plan.review} onChange={e => setPlan({ ...plan, review: e.target.value })} /></label>
      </div>
      <p className="hint">{w.privacy}</p>
    </div>
    <dl className="print-only plan-summary">
      <dt>{w.choose}</dt><dd>{plan.domain ? t.domainLabels[plan.domain] : "—"}</dd>
      <dt>{w.action}</dt><dd>{plan.action || "—"}</dd>
      <dt>{w.when}</dt><dd>{plan.when || "—"}</dd>
      <dt>{w.review}</dt><dd>{plan.review || "—"}</dd>
    </dl>
    <p className="hint">{w.personalized}</p>
    <div className="notice">{w.reviewNote}</div>
  </section>;
}
