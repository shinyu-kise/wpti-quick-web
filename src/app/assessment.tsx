"use client";

import { useEffect, useRef, useState } from "react";
import { copy } from "../lib/i18n.ts";
import { guidedCopy } from "../lib/guided-copy.ts";
import { workflowCopy } from "../lib/workflow-copy.ts";
import type { DialogueSession, Nonresponse } from "../lib/dialogue.ts";
import type { Language, OptionId, QuestionId } from "../lib/types.ts";
import { RecallHelp } from "./practice.tsx";

export function Assessment({ language, session, hasDownstream, selectAnswer, selectNonresponse, showSummary, goHome }: {
  language: Language; session: DialogueSession; hasDownstream: boolean;
  selectAnswer: (id: QuestionId, value: OptionId) => void;
  selectNonresponse: (id: QuestionId, value: Nonresponse | "") => void;
  showSummary: () => void; goHome: () => void;
}) {
  const [step, setStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const moved = useRef(false);
  const ja = language === "ja";
  const t = copy[language], u = guidedCopy[language], w = workflowCopy[language];
  const answeredCount = t.questions.filter(q => session.answers[q.id] || session.nonresponses[q.id]).length;
  useEffect(() => {
    if (!moved.current) return;
    sectionRef.current?.querySelector<HTMLElement>(`[data-current="true"] h2`)?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [step]);
  function goTo(next: number) { moved.current = true; setStep(next); }

  return <section className="quick-assessment" ref={sectionRef}>
    <div className="assessment-heading">
      <div><h1 tabIndex={-1}>{ja ? "この1週間について" : "Think about the past week"}</h1><p className="recall-period">{u.recall}</p></div>
      <p className="answer-count desktop-assessment" role="status">{ja ? "回答" : "Answered"} <strong>{answeredCount} / 3</strong></p>
      <p className="mobile-assessment question-progress" role="status">{ja ? `全3問のうち ${step + 1}問目` : `Question ${step + 1} of 3`}</p>
    </div>
    {hasDownstream && <p className="change-warning">{w.answerReset}</p>}
    <div className="quick-question-list">{t.questions.map((question, index) => <fieldset className="question-card" key={question.id} data-current={index === step} aria-describedby={`${question.id}-recall ${question.id}-unit ${question.id}-example${question.id === "leisure" ? " leisure-intensity" : ""}${question.id === "sedentary" ? " sedentary-interval" : ""}`}>
      <legend className="sr-only">{u.questionTitles[question.id]}</legend>
      <h2 className="question-heading" tabIndex={-1}><span className="question-number" aria-hidden="true">{index + 1}</span><span className="question-title">{u.questionTitles[question.id]}</span></h2>
      <span className="sr-only" id={`${question.id}-recall`}>{u.recall}</span>
      {question.id === "leisure" && <p className="intensity-note" id="leisure-intensity">{ja ? "息が少し弾む程度以上の運動など" : "At least light breathlessness"}</p>}
      <p className="question-unit" id={`${question.id}-unit`}>{u.questionUnits[question.id]}</p>
      <p className="question-example" id={`${question.id}-example`}>{question.id === "sedentary"
        ? ja ? "寝ている時間は入れません。" : "Do not include sleep."
        : ja ? "例：1日10分を3日なら、合計30分。" : "Example: 10 minutes a day for 3 days = 30 minutes."}</p>
      <div className="option-list">{question.options.map(option => <label className="option-row" key={option.id}><input type="radio" name={question.id} value={option.id} checked={session.answers[question.id] === option.id} onChange={() => selectAnswer(question.id, option.id)} /><span>{option.label}</span></label>)}</div>
      <div className="nonresponse-options compact-nonresponse" aria-label={w.nonresponseTitle}>{(["unsure", "unable"] as const).map(value => <label className="option-row" key={value}><input type="radio" name={question.id} checked={session.nonresponses[question.id] === value} onChange={() => selectNonresponse(question.id, value)} /><span>{w.nonresponses[value]}</span></label>)}</div>
      {question.id === "sedentary" && <p className="category-hint" id="sedentary-interval">{u.betweenCategories}</p>}
      <div className="question-tools"><details className="question-extra"><summary>{u.help}</summary><RecallHelp id={question.id} language={language} /><details className="source-question"><summary>{ja ? "元の質問文" : "Original question"}</summary><p>{question.title}</p></details>
        {(session.answers[question.id] || session.nonresponses[question.id]) && <button type="button" className="text-button clear-answer" aria-label={w.clearAnswer} onClick={() => selectNonresponse(question.id, "")}>{ja ? "回答を消す" : "Clear answer"}</button>}</details>
      </div>
    </fieldset>)}</div>
    <div className="mobile-assessment step-actions">
      <button className="secondary-button" type="button" onClick={() => step > 0 ? goTo(step - 1) : goHome()}>{step > 0 ? ja ? "前の質問へ" : "Previous question" : u.home}</button>
      <button className="primary-button" type="button" onClick={() => step < 2 ? goTo(step + 1) : showSummary()}>{step < 2 ? ja ? "次の質問へ" : "Next question" : ja ? "結果を見る" : "See responses"} <span aria-hidden="true">→</span></button>
      <p className="hint">{u.skip}</p>
    </div>
    <div className="assessment-actions desktop-assessment"><p className="hint">{u.skip}</p><button className="secondary-button" type="button" onClick={goHome}>{u.home}</button><button className="primary-button" type="button" onClick={showSummary}>{ja ? "結果を見る" : "See responses"} <span aria-hidden="true">→</span></button></div>
  </section>;
}
