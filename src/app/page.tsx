"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { copy } from "../lib/i18n.ts";
import { QUESTION_ORDER } from "../lib/scoring.ts";
import type { Language, OptionId, QuestionId } from "../lib/types.ts";
import { BehaviorProfile, ContextEditor, ConversationDetails, Evidence, PlanEditor } from "./practice.tsx";
import { buildSummary, PAPER_URL } from "../lib/practice.ts";
import { createSession, dialogueReducer, referenceScore } from "../lib/dialogue.ts";
import type { DialogueAction, DialogueSession, Nonresponse } from "../lib/dialogue.ts";
import { workflowCopy } from "../lib/workflow-copy.ts";
import { guidedCopy } from "../lib/guided-copy.ts";
import { ShortBoutIdeas } from "./short-bouts.tsx";
import { Assessment } from "./assessment.tsx";

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
            <p className="audience-note">{u.audience}</p>
            <div className="action-row"><button className="primary-button" type="button" onClick={() => navigate(hasProgress ? lastStep : "assessment")}>{hasProgress ? u.resume : u.start} <span aria-hidden="true">→</span></button>{!hasProgress && <button className="secondary-button" type="button" onClick={() => { dispatch({ type: "example" }); setSummaryDate(new Date().toISOString()); navigate("results"); }}>{u.example}</button>}</div>
            <p className="mini-privacy">{u.privacy}</p>
          </div>
          <div className="hero-art no-print" aria-hidden="true"><img src="/wellness-path.jpg" alt="" width="1122" height="1402" fetchPriority="high" /></div>
        </div>
        <div className="home-journey"><ol className="home-steps">{u.phases.map((label, index) => <li key={label}><span>0{index + 1}</span><strong>{label}</strong></li>)}</ol></div>
      </section>}

      {view === "assessment" && <Assessment key={resetKey} language={language} session={session} hasDownstream={hasDownstream} selectAnswer={selectAnswer} selectNonresponse={selectNonresponse} showSummary={showSummary} goHome={() => navigate("home")} />}

      {view === "results" && <SummaryView language={language} session={session} dispatch={updateDialogue} date={formatDate(summaryDate, language)} editAnswers={() => navigate("assessment")} goHome={() => navigate("home")} />}
      {view === "about" && <InfoPanel title={t.about.title}><p>{t.about.body}</p><div className="notice">{t.importantStatement}</div><Evidence language={language} /></InfoPanel>}
      {view === "howTo" && <InfoPanel title={t.howTo.title}><ul className="plain-list">{t.howTo.bullets.map(item => <li key={item}>{item}</li>)}</ul><div className="notice">{w.privacy}</div><p>{w.consent}</p></InfoPanel>}
      {view === "citation" && <InfoPanel title={t.citation.title}><p>{t.citation.text}</p><a href={PAPER_URL} target="_blank" rel="noreferrer">{w.original} ↗</a><p>{w.version}</p></InfoPanel>}
      {view === "policy" && <InfoPanel title={t.policy.title}><ul className="plain-list">{t.policy.bullets.map(item => <li key={item}>{item}</li>)}</ul><div className="notice">{w.privacy}</div><p>{w.consent}</p></InfoPanel>}
    </main>
    <footer className="footer no-print"><details><summary>{u.details}</summary><p>{w.version}</p><p>{w.boundary}</p><p>{w.privacy}</p><p>{w.consent}</p><Evidence language={language} /></details></footer>
  </div>;
}

function SummaryView({ language, session, dispatch, date, editAnswers, goHome }: { language: Language; session: DialogueSession; dispatch: React.Dispatch<DialogueAction>; date: string; editAnswers: () => void; goHome: () => void }) {
  const t = copy[language], w = workflowCopy[language], u = guidedCopy[language];
  const ja = language === "ja";
  const result = referenceScore(session.answers);
  const [stage, setStage] = useState<"result" | "ideas" | "plan">("result");
  const [copyStatus, setCopyStatus] = useState("");
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => { setCopyStatus(""); }, [session, language]);
  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>(".screen-heading")?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [stage]);
  function openPlan() {
    if (session.context.mode !== "notes") dispatch({ type: "contextMode", mode: "notes" });
    setStage("plan");
  }
  async function copySummary() {
    try { await navigator.clipboard.writeText(buildSummary(session, language, date)); setCopyStatus(w.copied); }
    catch { setCopyStatus(w.copyFailed); }
  }
  const reference = <><p className="reference-total">{ja ? "参考点" : "Reference total"}: <strong>{result?.total} / 100</strong></p><p className="hint">{w.referenceNote}</p></>;
  return <section className="panel result-panel printable-result quick-result" ref={panelRef}>
    <div className={stage === "result" ? "result-heading" : "print-only"}>
      <div><h1 className={stage === "result" ? "screen-heading" : undefined} tabIndex={-1}><span className="no-print">{ja ? "回答の結果" : "Your responses"}</span><span className="print-only">{w.summaryTitle}</span></h1><p className="print-only">{t.results.date}: {date}</p><p className="print-only">{w.summaryIntro}</p></div>
      <button className="text-button no-print edit-responses" type="button" onClick={editAnswers}>{w.edit}</button>
    </div>
    <div className={stage === "result" ? "response-overview" : "print-only"}><BehaviorProfile language={language} session={session} /></div>
    {stage === "result" && <div className="result-finish no-print">
      <p className="completion-message">{ja ? "回答はこれで終わりです。" : "You have finished the questions."}</p>
      <p className="hint">{ja ? "この結果は、病気や健康状態を判定するものではありません。" : "These responses do not diagnose illness or assess your health."}</p>
      {session.plan.choice && <div className="chosen-action"><strong>{w.planChoices[session.plan.choice]}</strong>{session.plan.action && <p>{session.plan.action}</p>}</div>}
      {session.planNeedsReview && <p className="notice" role="status">{w.planReviewPending}</p>}
      <div className="completion-actions"><button className="primary-button" type="button" onClick={goHome}>{ja ? "はじめの画面へ" : "Back to start"}</button>
      <button className="secondary-button" type="button" onClick={() => session.plan.choice ? openPlan() : setStage("ideas")}>{session.plan.choice ? ja ? "メモを見直す" : "Review your note" : ja ? "やってみたいことを選ぶ（任意）" : "Choose something to do (optional)"}</button></div>
    </div>}
    {stage === "ideas" && <div className="optional-screen no-print">
      <h1 className="screen-heading" tabIndex={-1}>{ja ? "やってみたいことはありますか？" : "Is there something you would like to do?"}</h1>
      <p>{ja ? "選ばずに終わっても大丈夫です。" : "It is fine to finish without choosing."}</p>
      <div className="action-row"><button className="secondary-button" type="button" onClick={() => setStage("result")}>{ja ? "結果に戻る" : "Back to responses"}</button><button className="text-button" type="button" onClick={openPlan}>{ja ? "自分で決める" : "Choose for yourself"}</button></div>
      <ShortBoutIdeas language={language} session={session} dispatch={dispatch} onOpenPlan={() => setStage("plan")} />
    </div>}
    {stage === "plan" && <div className="optional-screen plan-screen no-print">
      <h1 className="screen-heading" tabIndex={-1}>{session.plan.choice ? ja ? "メモを確認する" : "Check your note" : ja ? "これからどうしますか？" : "What would you like to do?"}</h1>
      <p>{ja ? "書かずに終わっても大丈夫です。" : "You can finish without writing anything."}</p>
      <PlanEditor language={language} session={session} dispatch={dispatch} onDone={() => setStage("result")} />
      <details className="additional-context"><summary>{ja ? "暮らしのこともメモする（任意）" : "Add notes about daily life (optional)"}</summary><ContextEditor language={language} session={session} dispatch={dispatch} /></details>
      <button className="text-button" type="button" onClick={() => setStage("result")}>{ja ? "結果に戻る" : "Back to responses"}</button>
    </div>}
    {stage === "result" && <div className="result-extras no-print">
      <details className="reference-score"><summary>{w.referenceTitle}</summary>{result ? reference : <p>{w.scoreUnavailable}</p>}</details>
      <details className="export-controls"><summary>{ja ? "結果をコピー・印刷する" : "Copy or print your responses"}</summary><p className="hint">{u.export}</p><details className="export-details"><summary>{ja ? "保存するときの注意" : "Before saving"}</summary><p>{w.exportNote}</p></details><div className="result-actions"><button className="secondary-button" type="button" onClick={copySummary}>{w.copy}</button><button className="secondary-button" type="button" onClick={() => window.print()}>{t.common.print}</button></div><p role="status" aria-live="polite">{copyStatus}</p></details>
    </div>}
    <div className="print-only"><ConversationDetails language={language} session={session} />{result ? <div className="reference-score"><h2>{w.referenceTitle}</h2>{reference}</div> : <p>{w.scoreUnavailable}</p>}<div className="statement">{w.boundary}</div><p>{w.version}</p><h2>{t.citation.title}</h2><p>{t.citation.text}</p><a href={PAPER_URL} target="_blank" rel="noreferrer">{w.original} ↗</a></div>
  </section>;
}

function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="panel info-panel"><h1 tabIndex={-1}>{title}</h1>{children}</section>;
}
