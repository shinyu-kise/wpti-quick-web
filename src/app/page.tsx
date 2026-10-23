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
import { guidedCopy } from "../lib/guided-copy.ts";

type View = "home" | "assessment" | "context" | "plan" | "results" | "about" | "howTo" | "citation" | "policy";
const infoViews = ["about", "howTo", "citation", "policy"] as const;
const flowViews: View[] = ["assessment", "context", "plan", "results"];

function formatDate(isoDate: string, language: Language): string {
  return isoDate ? new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(isoDate)) : "";
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("ja");
  const [view, setView] = useState<View>("home");
  const [lastStep, setLastStep] = useState<View>("assessment");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [session, dispatch] = useReducer(dialogueReducer, undefined, createSession);
  const [summaryDate, setSummaryDate] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [resetNotice, setResetNotice] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  useEffect(() => {
    const selector = view === "assessment" ? '[data-current-question="true"] h1' : 'h1';
    mainRef.current?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [view, questionIndex, resetKey]);
  const t = copy[language];
  const w = workflowCopy[language];
  const u = guidedCopy[language];
  const hasProgress = questionIndex > 0 || QUESTION_ORDER.some(id => session.answers[id] || session.nonresponses[id]) || Boolean(session.context.mode);
  const hasDownstream = Boolean(session.context.mode) || Object.values(session.plan).some(Boolean);
  const step = view === "assessment" ? 0 : view === "context" ? 1 : ["plan", "results"].includes(view) ? 2 : -1;

  function navigate(next: View) {
    setResetNotice(false);
    if (menuRef.current) menuRef.current.open = false;
    if (flowViews.includes(next)) setLastStep(next);
    setView(next);
    if (next === view) {
      const selector = next === "assessment" ? '[data-current-question="true"] h1' : 'h1';
      mainRef.current?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
    }
  }
  function resetAll() {
    dispatch({ type: "reset" });
    setSummaryDate("");
    setQuestionIndex(0);
    setResetKey(value => value + 1);
    setResetNotice(true);
    setLastStep("assessment");
    setView("assessment");
    if (menuRef.current) menuRef.current.open = false;
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
  function nextQuestion() {
    if (questionIndex < QUESTION_ORDER.length - 1) setQuestionIndex(index => index + 1);
    else navigate("context");
  }

  return <div className="app-shell">
    <header className="topbar no-print">
      <div className="topbar-inner">
        <button className="brand" type="button" onClick={() => navigate("home")} aria-label="WPTI-Quick Home"><span className="brand-symbol" aria-hidden="true">✳</span> WPTI-Quick</button>
        <div className="header-controls">
          <div className="language-toggle" role="group" aria-label={language === "ja" ? "表示言語" : "Language"}>
            <button type="button" onClick={() => setLanguage(language === "ja" ? "en" : "ja")} aria-label={language === "ja" ? "Switch to English" : "日本語に切り替える"}>{language === "ja" ? "EN" : "日本語"}</button>
          </div>
          <details className="info-menu" ref={menuRef}><summary aria-label={u.menu}><span className="menu-label">{u.menu}</span><svg className="menu-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg></summary><nav className="menu-links" aria-label={u.menu}>
            <button type="button" onClick={() => navigate("home")}>{t.nav.home}</button>
            {hasProgress && <button type="button" onClick={() => navigate(lastStep)}>{u.returnFlow}</button>}
            {infoViews.map(info => <button key={info} type="button" onClick={() => navigate(info)} aria-current={view === info ? "page" : undefined}>{t.nav[info]}</button>)}
            {hasProgress && <button className="reset-button" type="button" onClick={resetAll}>{u.restart}</button>}
          </nav></details>
        </div>
      </div>
    </header>

    <main className="main" ref={mainRef}>
      {resetNotice && <p className="notice" role="status">{language === "ja" ? "入力をすべて消しました。" : "All inputs have been cleared."}</p>}
      {session.demo && <div className="demo-banner" role="status">{w.example}<button className="text-button no-print" type="button" onClick={resetAll}>{u.restart}</button></div>}
      {step >= 0 && <ol className="flow-progress no-print" aria-label={language === "ja" ? "対話の流れ" : "Conversation steps"}>{u.phases.map((label, index) => <li key={label} className={index === step ? "current-step" : ""} aria-current={index === step ? "step" : undefined}><span>{index + 1} {label}</span></li>)}</ol>}

      {view === "home" && <section className="panel home-panel">
        <div className="home-hero">
          <div className="hero-copy">
            <p className="eyebrow">WELLNESS, YOUR WAY.</p>
            <h1 className="hero-title" tabIndex={-1}>{u.title.map((line, index) => <span className={index === 2 ? "hero-accent" : ""} key={line}>{line}</span>)}</h1>
            <p className="lead">{u.intro}</p>
            <div className="action-row"><button className="primary-button" type="button" onClick={() => navigate(hasProgress ? lastStep : "assessment")}>{hasProgress ? u.resume : u.start} <span aria-hidden="true">→</span></button>{!hasProgress && <button className="secondary-button" type="button" onClick={() => { dispatch({ type: "example" }); setSummaryDate(""); setQuestionIndex(0); navigate("context"); }}>{u.example}</button>}</div>
            <p className="mini-privacy">{u.privacy}</p>
          </div>
          <div className="hero-art no-print" aria-hidden="true"><img src="/wellness-path.jpg" alt="" width="1122" height="1402" fetchPriority="high" /></div>
        </div>
        <div className="home-journey"><ol className="home-steps">{u.phases.map((label, index) => <li key={label}><span>0{index + 1}</span><strong>{label}</strong></li>)}</ol></div>
      </section>}

      {view === "assessment" && <section className="wizard-shell" key={resetKey}>
        <div className="question-progress"><p>{u.question} <strong>{questionIndex + 1} / 3</strong></p><div className="question-dots" aria-hidden="true">{QUESTION_ORDER.map((id, index) => <span key={id} className={index === questionIndex ? "active" : ""} />)}</div></div>
        <p className="recall-period">{u.recall}</p>
        {hasDownstream && <p className="change-warning">{w.answerReset}</p>}
        {t.questions.map((question, index) => <div key={question.id} hidden={index !== questionIndex} data-current-question={index === questionIndex ? "true" : "false"}>
          <fieldset className="question-card" aria-describedby={`${question.id}-recall`}>
            <legend className="sr-only">{`Q${index + 1}. ${question.title}`}</legend>
            <h1 tabIndex={-1}>{question.title}</h1>
            <span className="sr-only" id={`${question.id}-recall`}>{t.assessment.recallPeriod}</span>
            <div className="option-list">{question.options.map(option => <label className="option-row" key={option.id}><input type="radio" name={question.id} value={option.id} checked={session.answers[question.id] === option.id} onChange={() => selectAnswer(question.id, option.id)} /><span>{option.label}</span></label>)}</div>
            <div className="nonresponse-options compact-nonresponse" aria-label={w.nonresponseTitle}>
              {(["unsure", "unable"] as const).map(value => <label className="option-row" key={value}><input type="radio" name={question.id} checked={session.nonresponses[question.id] === value} onChange={() => selectNonresponse(question.id, value)} /><span>{w.nonresponses[value]}</span></label>)}
            </div>
            <details className="question-extra"><summary>{u.help}</summary><RecallHelp id={question.id} language={language} /></details>
            {(session.answers[question.id] || session.nonresponses[question.id]) && <button type="button" className="text-button clear-answer" onClick={() => selectNonresponse(question.id, "")}>{w.clearAnswer}</button>}
          </fieldset>
        </div>)}
        <div className="question-actions"><p className="hint">{u.skip}</p><button className="secondary-button" type="button" onClick={() => questionIndex > 0 ? setQuestionIndex(index => index - 1) : navigate("home")}>{questionIndex > 0 ? u.back : u.home}</button><button className="primary-button" type="button" onClick={nextQuestion}>{u.next} <span aria-hidden="true">→</span></button></div>
      </section>}

      {view === "context" && <section className="panel flow-panel">
        <h1 tabIndex={-1}>{u.context}</h1>
        <ContextEditor language={language} session={session} dispatch={dispatch} />
        <details className="editor-details"><summary>{u.profile}</summary><BehaviorProfile language={language} session={session} /></details>
        <div className="result-actions"><button type="button" className="secondary-button" onClick={() => navigate("assessment")}>{u.back}</button><button type="button" className="primary-button" disabled={!session.context.mode} aria-describedby={!session.context.mode ? "context-mode-required" : undefined} onClick={() => { dispatch({ type: "reviewContext" }); navigate("plan"); }}>{u.next} <span aria-hidden="true">→</span></button></div>
        {!session.context.mode && <p className="hint" id="context-mode-required">{language === "ja" ? "進め方を選ぶと、次へ進めます。" : "Choose how to continue above."}</p>}
      </section>}

      {view === "plan" && session.contextReviewed && <section className="panel flow-panel">
        <h1 tabIndex={-1}>{u.plan}</h1>
        <PlanEditor language={language} session={session} dispatch={dispatch} />
        <div className="result-actions"><button type="button" className="secondary-button" onClick={() => navigate("context")}>{u.back}</button><button type="button" className="primary-button" onClick={showSummary}>{u.summary} <span aria-hidden="true">→</span></button></div>
      </section>}

      {view === "results" && session.contextReviewed && <SummaryView language={language} session={session} date={formatDate(summaryDate, language)} editAnswers={() => { setQuestionIndex(0); navigate("assessment"); }} editContext={() => navigate("context")} editPlan={() => navigate("plan")} />}
      {view === "about" && <InfoPanel title={t.about.title}><p>{t.about.body}</p><div className="notice">{t.importantStatement}</div><Evidence language={language} /></InfoPanel>}
      {view === "howTo" && <InfoPanel title={t.howTo.title}><ul className="plain-list">{t.howTo.bullets.map(item => <li key={item}>{item}</li>)}</ul><div className="notice">{w.privacy}</div><p>{w.consent}</p></InfoPanel>}
      {view === "citation" && <InfoPanel title={t.citation.title}><p>{t.citation.text}</p><a href={PAPER_URL} target="_blank" rel="noreferrer">{w.original} ↗</a><p>{w.version}</p></InfoPanel>}
      {view === "policy" && <InfoPanel title={t.policy.title}><ul className="plain-list">{t.policy.bullets.map(item => <li key={item}>{item}</li>)}</ul><div className="notice">{w.privacy}</div><p>{w.consent}</p></InfoPanel>}
    </main>
    <footer className="footer no-print"><details><summary>{u.details}</summary><p>{w.version}</p><p>{w.boundary}</p><p>{w.privacy}</p><p>{w.consent}</p><Evidence language={language} /></details></footer>
  </div>;
}

function SummaryView({ language, session, date, editAnswers, editContext, editPlan }: { language: Language; session: DialogueSession; date: string; editAnswers: () => void; editContext: () => void; editPlan: () => void }) {
  const t = copy[language];
  const w = workflowCopy[language];
  const u = guidedCopy[language];
  const result = referenceScore(session.answers);
  const [copyStatus, setCopyStatus] = useState("");
  useEffect(() => { setCopyStatus(""); }, [session, language]);
  async function copySummary() {
    try { await navigator.clipboard.writeText(buildSummary(session, language, date)); setCopyStatus(w.copied); }
    catch { setCopyStatus(w.copyFailed); }
  }
  const reference = <><p className="reference-total">{language === "ja" ? "参考点" : "Reference total"}: <strong>{result?.total} / 100</strong></p><p className="hint">{w.referenceNote}</p></>;
  return <section className="panel result-panel printable-result">
    <div className="result-heading"><div><p className="eyebrow">WPTI-Quick / {language === "ja" ? "対話支援" : "DIALOGUE SUPPORT"}</p><h1 tabIndex={-1}>{w.summaryTitle}</h1><p>{t.results.date}: {date}</p><p className="no-print">{u.summaryIntro}</p><p className="print-only">{w.summaryIntro}</p></div></div>
    <BehaviorProfile language={language} session={session} />
    <ConversationDetails language={language} session={session} />
    {result ? <><details className="reference-score no-print"><summary>{w.referenceTitle}</summary>{reference}</details><div className="reference-score print-only"><h2>{w.referenceTitle}</h2>{reference}</div></> : <p className="notice">{w.scoreUnavailable}</p>}
    <div className="statement print-only">{w.boundary}</div>
    <details className="editor-details no-print"><summary>{u.citations}</summary><p>{w.boundary}</p><p>{w.version}</p><p>{t.citation.text}</p><Evidence language={language} /></details>
    <div className="print-details print-only"><p>{w.version}</p><h2>{t.citation.title}</h2><p>{t.citation.text}</p><a href={PAPER_URL} target="_blank" rel="noreferrer">{w.original} ↗</a></div>
    <div className="no-print export-controls"><p className="hint">{u.export}</p><details className="export-details"><summary>{language === "ja" ? "保存・共有について" : "About saving and sharing"}</summary><p>{w.exportNote}</p></details><div className="result-actions"><button className="secondary-button" type="button" onClick={copySummary}>{w.copy}</button><button className="primary-button" type="button" onClick={() => window.print()}>{t.common.print}</button></div><p role="status" aria-live="polite">{copyStatus}</p></div>
    <div className="result-actions no-print"><button className="text-button" type="button" onClick={editAnswers}>{w.edit}</button><button className="text-button" type="button" onClick={editContext}>{w.editContext}</button><button className="text-button" type="button" onClick={editPlan}>{w.editPlan}</button></div>
  </section>;
}

function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="panel info-panel"><h1 tabIndex={-1}>{title}</h1>{children}</section>;
}
