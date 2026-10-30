"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { copy } from "../lib/i18n.ts";
import { QUESTION_ORDER } from "../lib/scoring.ts";
import type { Language, OptionId, QuestionId } from "../lib/types.ts";
import { BehaviorProfile, ContextEditor, ConversationDetails, Evidence, PlanEditor, RecallHelp } from "./practice.tsx";
import { buildSummary, PAPER_URL } from "../lib/practice.ts";
import { createSession, dialogueReducer, referenceScore } from "../lib/dialogue.ts";
import type { DialogueAction, DialogueSession, Nonresponse } from "../lib/dialogue.ts";
import { workflowCopy } from "../lib/workflow-copy.ts";
import { guidedCopy } from "../lib/guided-copy.ts";
import { ShortBoutIdeas } from "./short-bouts.tsx";

type View = "home" | "assessment" | "results" | "about" | "howTo" | "citation" | "policy";
const infoViews = ["about", "howTo", "citation", "policy"] as const;
const flowViews: View[] = ["assessment", "results"];

function formatDate(isoDate: string, language: Language): string {
  return isoDate ? new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(isoDate)) : "";
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("ja");
  const [view, setView] = useState<View>("home");
  const [lastStep, setLastStep] = useState<View>("assessment");
  const [session, dispatch] = useReducer(dialogueReducer, undefined, createSession);
  const [summaryDate, setSummaryDate] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [resetNotice, setResetNotice] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  useEffect(() => {
    const selector = "h1";
    mainRef.current?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [view, resetKey]);
  const t = copy[language];
  const w = workflowCopy[language];
  const u = guidedCopy[language];
  const hasProgress = QUESTION_ORDER.some(id => session.answers[id] || session.nonresponses[id]) || Boolean(session.context.mode);
  const hasDownstream = Object.entries(session.context).some(([key, value]) => key !== "mode" && Boolean(value)) || Object.values(session.plan).some(Boolean);
  const answeredCount = QUESTION_ORDER.filter(id => session.answers[id] || session.nonresponses[id]).length;

  function navigate(next: View) {
    setResetNotice(false);
    if (menuRef.current) menuRef.current.open = false;
    if (flowViews.includes(next)) setLastStep(next);
    setView(next);
    if (next === view) {
      const selector = "h1";
      mainRef.current?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
    }
  }
  function resetAll() {
    dispatch({ type: "reset" });
    setSummaryDate("");
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
    setSummaryDate(new Date().toISOString());
    navigate("results");
  }
  function updateDialogue(action: DialogueAction) {
    dispatch(action);
    setSummaryDate(new Date().toISOString());
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

      {view === "home" && <section className="panel home-panel compact-home">
        <div className="home-hero">
          <div className="hero-copy">
            <p className="eyebrow">WELLNESS, YOUR WAY.</p>
            <h1 className="hero-title" tabIndex={-1}>{u.title.map((line, index) => <span className={index === 2 ? "hero-accent" : ""} key={line}>{line}</span>)}</h1>
            <p className="lead">{u.intro}</p>
            <div className="action-row"><button className="primary-button" type="button" onClick={() => navigate(hasProgress ? lastStep : "assessment")}>{hasProgress ? u.resume : u.start} <span aria-hidden="true">→</span></button>{!hasProgress && <button className="secondary-button" type="button" onClick={() => { dispatch({ type: "example" }); setSummaryDate(new Date().toISOString()); navigate("results"); }}>{u.example}</button>}</div>
            <p className="mini-privacy">{u.privacy}</p>
          </div>
          <div className="hero-art no-print" aria-hidden="true"><img src="/wellness-path.jpg" alt="" width="1122" height="1402" fetchPriority="high" /></div>
        </div>
        <div className="home-journey"><ol className="home-steps">{u.phases.map((label, index) => <li key={label}><span>0{index + 1}</span><strong>{label}</strong></li>)}</ol></div>
      </section>}

      {view === "assessment" && <section className="quick-assessment" key={resetKey}>
        <div className="assessment-heading">
          <div><h1 tabIndex={-1}>{language === "ja" ? "3つの質問に答える" : "Three questions about your week"}</h1><p className="recall-period">{u.recall}</p></div>
          <p className="answer-count" role="status">{language === "ja" ? "回答" : "Answered"} <strong>{answeredCount} / 3</strong></p>
        </div>
        {hasDownstream && <p className="change-warning">{w.answerReset}</p>}
        <div className="quick-question-list">{t.questions.map((question, index) => <fieldset className="question-card" key={question.id} aria-describedby={`${question.id}-recall`}>
          <legend className="sr-only">{question.title}</legend><h2 className="question-heading" aria-hidden="true"><span className="question-number">0{index + 1}</span><span className="question-title">{question.title}</span></h2>
          <span className="sr-only" id={`${question.id}-recall`}>{t.assessment.recallPeriod}</span>
          <div className="option-list">{question.options.map(option => <label className="option-row" key={option.id}><input type="radio" name={question.id} value={option.id} checked={session.answers[question.id] === option.id} onChange={() => selectAnswer(question.id, option.id)} /><span>{option.label}</span></label>)}</div>
          <div className="nonresponse-options compact-nonresponse" aria-label={w.nonresponseTitle}>{(["unsure", "unable"] as const).map(value => <label className="option-row" key={value}><input type="radio" name={question.id} checked={session.nonresponses[question.id] === value} onChange={() => selectNonresponse(question.id, value)} /><span>{w.nonresponses[value]}</span></label>)}</div>
          <div className="question-tools"><details className="question-extra"><summary>{u.help}</summary><RecallHelp id={question.id} language={language} /></details>
          {(session.answers[question.id] || session.nonresponses[question.id]) && <button type="button" className="text-button clear-answer" aria-label={w.clearAnswer} onClick={() => selectNonresponse(question.id, "")}>{language === "ja" ? "選択を解除" : "Clear answer"}</button>}</div>
        </fieldset>)}</div>
        <div className="assessment-actions"><p className="hint">{u.skip}</p><button className="secondary-button" type="button" onClick={() => navigate("home")}>{u.home}</button><button className="primary-button" type="button" onClick={showSummary}>{language === "ja" ? "回答を振り返る" : "Review responses"} <span aria-hidden="true">→</span></button></div>
      </section>}

      {view === "results" && <SummaryView language={language} session={session} dispatch={updateDialogue} date={formatDate(summaryDate, language)} editAnswers={() => navigate("assessment")} />}
      {view === "about" && <InfoPanel title={t.about.title}><p>{t.about.body}</p><div className="notice">{t.importantStatement}</div><Evidence language={language} /></InfoPanel>}
      {view === "howTo" && <InfoPanel title={t.howTo.title}><ul className="plain-list">{t.howTo.bullets.map(item => <li key={item}>{item}</li>)}</ul><div className="notice">{w.privacy}</div><p>{w.consent}</p></InfoPanel>}
      {view === "citation" && <InfoPanel title={t.citation.title}><p>{t.citation.text}</p><a href={PAPER_URL} target="_blank" rel="noreferrer">{w.original} ↗</a><p>{w.version}</p></InfoPanel>}
      {view === "policy" && <InfoPanel title={t.policy.title}><ul className="plain-list">{t.policy.bullets.map(item => <li key={item}>{item}</li>)}</ul><div className="notice">{w.privacy}</div><p>{w.consent}</p></InfoPanel>}
    </main>
    <footer className="footer no-print"><details><summary>{u.details}</summary><p>{w.version}</p><p>{w.boundary}</p><p>{w.privacy}</p><p>{w.consent}</p><Evidence language={language} /></details></footer>
  </div>;
}

function SummaryView({ language, session, dispatch, date, editAnswers }: { language: Language; session: DialogueSession; dispatch: React.Dispatch<DialogueAction>; date: string; editAnswers: () => void }) {
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
  return <section className="panel result-panel printable-result quick-result">
    <div className="result-heading"><div><p className="eyebrow">WPTI-Quick / {language === "ja" ? "対話支援" : "DIALOGUE SUPPORT"}</p><h1 tabIndex={-1}><span className="no-print">{language === "ja" ? "3つの回答を振り返る" : "Your three responses"}</span><span className="print-only">{w.summaryTitle}</span></h1><p>{t.results.date}: {date}</p><p className="no-print">{u.summaryIntro}</p><p className="print-only">{w.summaryIntro}</p></div><button className="text-button no-print edit-responses" type="button" onClick={editAnswers}>{w.edit}</button></div>
    <BehaviorProfile language={language} session={session} />
    <ShortBoutIdeas language={language} session={session} dispatch={dispatch} />

    <details className="optional-dialogue no-print">
      <summary>{language === "ja" ? "生活背景・次の一歩を話す（任意）" : "Talk about daily life and a next step (optional)"}</summary>
      <div className="optional-dialogue-body">
        <h2>{language === "ja" ? "いつもの暮らしについて" : "Daily life"}</h2>
        <ContextEditor language={language} session={session} dispatch={dispatch} />
        <h2>{u.plan}</h2>
        <PlanEditor language={language} session={session} dispatch={dispatch} />
      </div>
    </details>
    {result ? <><details className="reference-score no-print"><summary>{w.referenceTitle}</summary>{reference}</details><div className="reference-score print-only"><h2>{w.referenceTitle}</h2>{reference}</div></> : <p className="notice">{w.scoreUnavailable}</p>}
    <ConversationDetails language={language} session={session} />
    <div className="statement print-only">{w.boundary}</div>
    <details className="editor-details no-print"><summary>{u.citations}</summary><p>{w.boundary}</p><p>{w.version}</p><p>{t.citation.text}</p><Evidence language={language} /></details>
    <div className="print-details print-only"><p>{w.version}</p><h2>{t.citation.title}</h2><p>{t.citation.text}</p><a href={PAPER_URL} target="_blank" rel="noreferrer">{w.original} ↗</a></div>
    <div className="no-print export-controls"><p className="hint">{u.export}</p><details className="export-details"><summary>{language === "ja" ? "保存・共有について" : "About saving and sharing"}</summary><p>{w.exportNote}</p></details><div className="result-actions"><button className="secondary-button" type="button" onClick={copySummary}>{w.copy}</button><button className="primary-button" type="button" onClick={() => window.print()}>{t.common.print}</button></div><p role="status" aria-live="polite">{copyStatus}</p></div>
  </section>;
}

function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="panel info-panel"><h1 tabIndex={-1}>{title}</h1>{children}</section>;
}
