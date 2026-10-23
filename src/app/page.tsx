"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { copy } from "../lib/i18n.ts";
import { QUESTION_ORDER } from "../lib/scoring.ts";
import type { Language, OptionId, QuestionId } from "../lib/types.ts";
import { BehaviorProfile, ContextEditor, ConversationDetails, Evidence, PlanEditor, RecallHelp } from "./practice.tsx";
import { buildSummary, PAPER_URL } from "../lib/practice.ts";
import { createSession, dialogueReducer, referenceScore } from "../lib/dialogue.ts";
import type { DialogueSession, Nonresponse } from "../lib/dialogue.ts";
import { workflowCopy } from "../lib/workflow-copy.ts";

type View = "home" | "assessment" | "context" | "plan" | "results" | "about" | "howTo" | "citation" | "policy";
const navViews = ["home", "assessment", "about", "howTo", "citation", "policy"] as const;

function formatDate(isoDate: string, language: Language): string {
  return isoDate ? new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(isoDate)) : "";
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("ja");
  const [view, setView] = useState<View>("home");
  const [session, dispatch] = useReducer(dialogueReducer, undefined, createSession);
  const [summaryDate, setSummaryDate] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [resetNotice, setResetNotice] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  useEffect(() => { mainRef.current?.querySelector("h1")?.focus(); }, [view, resetKey]);
  const t = copy[language];
  const w = workflowCopy[language];
  const answeredCount = QUESTION_ORDER.filter(id => session.answers[id]).length;
  const step = view === "assessment" ? 0 : view === "context" ? 1 : ["plan", "results"].includes(view) ? 2 : -1;

  function navigate(next: View) { setResetNotice(false); setView(next); }
  function resetAll() {
    dispatch({ type: "reset" });
    setSummaryDate("");
    setResetKey(value => value + 1);
    setResetNotice(true);
    setView("assessment");
  }
  function selectAnswer(questionId: QuestionId, optionId: OptionId) {
    dispatch({ type: "answer", questionId, optionId });
    setSummaryDate("");
    setResetNotice(false);
  }
  function selectNonresponse(questionId: QuestionId, value: Nonresponse | "") {
    dispatch({ type: "nonresponse", questionId, value });
    setSummaryDate("");
    setResetNotice(false);
  }
  function showSummary() {
    if (!session.contextReviewed) { navigate("context"); return; }
    setSummaryDate(new Date().toISOString());
    navigate("results");
  }

  return <div className="app-shell">
    <header className="topbar no-print">
      <div className="topbar-inner">
        <button className="brand" type="button" onClick={() => navigate("home")}>WPTI-Quick <span className="brand-detail">{language === "ja" ? "生活行動を話す" : "A conversation about daily life"}</span></button>
        <div className="header-controls">
          <div className="language-toggle" role="group" aria-label={language === "ja" ? "表示言語" : "Language"}>
            {(["ja", "en"] as const).map(lang => <button key={lang} className={language === lang ? "toggle-active" : ""} type="button" onClick={() => setLanguage(lang)} aria-pressed={language === lang}>{lang === "ja" ? "日本語" : "English"}</button>)}
          </div>
          <button className="text-button reset-button" type="button" onClick={resetAll}>{t.common.restart}</button>
        </div>
      </div>
      <nav className="nav" aria-label={language === "ja" ? "メインメニュー" : "Main navigation"}>
        {navViews.map(navView => <button className={view === navView ? "nav-active" : ""} key={navView} type="button" onClick={() => navigate(navView)} aria-current={view === navView ? "page" : undefined}>{t.nav[navView]}</button>)}
        {session.contextReviewed && <button type="button" className={view === "results" ? "nav-active" : ""} onClick={showSummary} aria-current={view === "results" ? "page" : undefined}>{t.nav.results}</button>}
      </nav>
    </header>

    <main className="main" ref={mainRef}>
      {resetNotice && <p className="notice" role="status">{language === "ja" ? "この画面の回答・背景・計画をすべて消しました。" : "All responses, context notes, and plan details on this page have been cleared."}</p>}
      {session.demo && <div className="demo-banner" role="status">{w.example}<button className="secondary-button no-print" type="button" onClick={resetAll}>{t.common.restart}</button></div>}
      {step >= 0 && <ol className="workflow-steps no-print" aria-label={language === "ja" ? "対話の流れ" : "Conversation steps"}>{w.steps.map((label, index) => <li key={label} className={index === step ? "current-step" : ""} aria-current={index === step ? "step" : undefined}><span>0{index + 1}</span>{label}</li>)}</ol>}

      {view === "home" && <section className="panel home-panel">
        <p className="eyebrow">{language === "ja" ? "対話支援プロトタイプ" : "Dialogue support prototype"}</p>
        <h1 tabIndex={-1}>{t.home.title}</h1>
        <p className="lead">{t.home.body}</p>
        <ol className="workflow-steps">{w.steps.map((label, index) => <li key={label}><span>0{index + 1}</span>{label}</li>)}</ol>
        <div className="action-row"><button className="primary-button" type="button" onClick={() => navigate("assessment")}>{t.common.start}</button><button className="secondary-button" type="button" onClick={() => { dispatch({ type: "example" }); setSummaryDate(""); navigate("context"); }}>{w.sample}</button></div>
        <p className="hint">{w.boundary}</p><div className="notice">{w.privacy}</div><p className="hint">{w.consent}</p><Evidence language={language} />
      </section>}

      {view === "assessment" && <section className="assessment-layout" key={resetKey}>
        <div className="section-header"><p className="eyebrow">01 / {w.steps[0]}</p><h1 tabIndex={-1}>{t.assessment.title}</h1><p>{t.assessment.intro}</p></div>
        <p className="response-count" aria-live="polite">{language === "ja" ? `採点項目の回答：${answeredCount} / 3` : `Instrument responses: ${answeredCount} / 3`} <span>{language === "ja" ? "すべて埋める必要はありません" : "You do not need to fill every item"}</span></p>
        <p className="hint">{w.answerReset}</p>
        <div className="question-list">
          {t.questions.map((question, index) => <fieldset className="question-card" key={question.id} aria-describedby={`${question.id}-hint`}>
            <legend className="sr-only">{`Q${index + 1}. ${question.title}`}</legend>
            <div className="question-heading" aria-hidden="true"><span className="question-number">Q{index + 1}</span><span className="question-title">{question.title}</span></div>
            <RecallHelp id={question.id} language={language} />
            <div className="option-list">{question.options.map(option => <label className="option-row" key={option.id}><input type="radio" name={question.id} value={option.id} checked={session.answers[question.id] === option.id} onChange={() => selectAnswer(question.id, option.id)} /><span>{option.label}</span></label>)}</div>
            <div className="nonresponse-options"><p id={`${question.id}-nonresponse`}>{w.nonresponseTitle}</p>
              {(["unsure", "unable"] as const).map(value => <label className="option-row" key={value}><input type="radio" name={question.id} aria-describedby={`${question.id}-nonresponse`} checked={session.nonresponses[question.id] === value} onChange={() => selectNonresponse(question.id, value)} /><span>{w.nonresponses[value]}</span></label>)}
              <button type="button" className="text-button" onClick={() => selectNonresponse(question.id, "")}>{w.clearAnswer}</button>
            </div>
          </fieldset>)}
        </div>
        <div className="assessment-actions"><p className="hint">{t.assessment.incomplete}</p><button className="primary-button" type="button" onClick={() => navigate("context")}>{w.nextContext} →</button></div>
      </section>}

      {view === "context" && <section className="panel flow-panel">
        <div><p className="eyebrow">02 / {w.steps[1]}</p><h1 tabIndex={-1}>{w.contextTitle}</h1></div>
        <BehaviorProfile language={language} session={session} />
        <ContextEditor language={language} session={session} dispatch={dispatch} />
        {!session.context.mode && <p className="hint" id="context-mode-required">{w.contextRequired}</p>}
        <div className="result-actions"><button type="button" className="secondary-button" onClick={() => navigate("assessment")}>{w.edit}</button><button type="button" className="primary-button" disabled={!session.context.mode} aria-describedby={!session.context.mode ? "context-mode-required" : undefined} onClick={() => { dispatch({ type: "reviewContext" }); navigate("plan"); }}>{w.nextPlan} →</button></div>
      </section>}

      {view === "plan" && session.contextReviewed && <section className="panel flow-panel">
        <div><p className="eyebrow">03 / {w.steps[2]}</p><h1 tabIndex={-1}>{w.planTitle}</h1></div>
        <PlanEditor language={language} session={session} dispatch={dispatch} />
        <div className="result-actions"><button type="button" className="secondary-button" onClick={() => navigate("context")}>{w.editContext}</button><button type="button" className="primary-button" onClick={showSummary}>{w.showSummary} →</button></div>
      </section>}

      {view === "results" && session.contextReviewed && <SummaryView language={language} session={session} date={formatDate(summaryDate, language)} editAnswers={() => navigate("assessment")} editContext={() => navigate("context")} editPlan={() => navigate("plan")} />}
      {view === "about" && <InfoPanel title={t.about.title}><p>{t.about.body}</p><div className="notice">{t.importantStatement}</div><Evidence language={language} /></InfoPanel>}
      {view === "howTo" && <InfoPanel title={t.howTo.title}><ul className="plain-list">{t.howTo.bullets.map(item => <li key={item}>{item}</li>)}</ul><div className="notice">{w.privacy}</div><p>{w.consent}</p></InfoPanel>}
      {view === "citation" && <InfoPanel title={t.citation.title}><p>{t.citation.text}</p><a href={PAPER_URL} target="_blank" rel="noreferrer">{w.original} ↗</a><p>{w.version}</p></InfoPanel>}
      {view === "policy" && <InfoPanel title={t.policy.title}><ul className="plain-list">{t.policy.bullets.map(item => <li key={item}>{item}</li>)}</ul><div className="notice">{w.privacy}</div><p>{w.consent}</p></InfoPanel>}
    </main>
    <footer className="footer no-print"><p>{w.version}</p><span>{t.privacyStatement}</span></footer>
  </div>;
}

function SummaryView({ language, session, date, editAnswers, editContext, editPlan }: { language: Language; session: DialogueSession; date: string; editAnswers: () => void; editContext: () => void; editPlan: () => void }) {
  const t = copy[language];
  const w = workflowCopy[language];
  const result = referenceScore(session.answers);
  const [copyStatus, setCopyStatus] = useState("");
  useEffect(() => { setCopyStatus(""); }, [session, language]);
  async function copySummary() {
    try { await navigator.clipboard.writeText(buildSummary(session, language, date)); setCopyStatus(w.copied); }
    catch { setCopyStatus(w.copyFailed); }
  }
  const reference = <><p className="reference-total">{language === "ja" ? "参考点" : "Reference total"}: <strong>{result?.total} / 100</strong></p><p className="hint">{w.referenceNote}</p></>;
  return <section className="panel result-panel printable-result">
    <div className="result-heading"><div><p className="eyebrow">WPTI-Quick / {language === "ja" ? "対話支援" : "DIALOGUE SUPPORT"}</p><h1 tabIndex={-1}>{w.summaryTitle}</h1><p>{t.results.date}: {date}</p><p>{w.summaryIntro}</p></div></div>
    <BehaviorProfile language={language} session={session} />
    <ConversationDetails language={language} session={session} />
    {result ? <><details className="reference-score no-print"><summary>{w.referenceTitle}</summary>{reference}</details><div className="reference-score print-only"><h2>{w.referenceTitle}</h2>{reference}</div></> : <p className="notice">{w.scoreUnavailable}</p>}
    <div className="statement">{w.boundary}</div>
    <Evidence language={language} />
    <div className="print-details"><p>{w.version}</p><h2>{t.citation.title}</h2><p>{t.citation.text}</p><a href={PAPER_URL} target="_blank" rel="noreferrer">{w.original} ↗</a></div>
    <div className="no-print export-controls"><p className="hint">{w.exportNote}</p><div className="result-actions"><button className="secondary-button" type="button" onClick={copySummary}>{w.copy}</button><button className="primary-button" type="button" onClick={() => window.print()}>{t.common.print}</button></div><p role="status" aria-live="polite">{copyStatus}</p></div>
    <div className="result-actions no-print"><button className="text-button" type="button" onClick={editAnswers}>{w.edit}</button><button className="text-button" type="button" onClick={editContext}>{w.editContext}</button><button className="text-button" type="button" onClick={editPlan}>{w.editPlan}</button></div>
  </section>;
}

function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="panel info-panel"><h1 tabIndex={-1}>{title}</h1>{children}</section>;
}
