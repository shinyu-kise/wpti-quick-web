"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { copy } from "../lib/i18n.ts";
import {
  calculateScores,
  DOMAIN_MAX,
  getMissingQuestions,
  getOptionPoints,
  QUESTION_ORDER
} from "../lib/scoring.ts";
import type { AnswerMap, Language, OptionId, QuestionId, ScoreResult } from "../lib/types.ts";

import { Evidence, PlanEditor, RecallHelp } from "./practice.tsx";
import { buildSummary, emptyPlan, PAPER_URL, responseLabel } from "../lib/practice.ts";
import type { ActionPlan } from "../lib/practice.ts";
import { workflowCopy } from "../lib/workflow-copy.ts";

type View = "home" | "assessment" | "results" | "about" | "howTo" | "citation" | "policy";

const navViews: View[] = ["home", "assessment", "about", "howTo", "citation", "policy"];

function formatDate(isoDate: string, language: Language): string {
  if (!isoDate) {
    return "";
  }

  return new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(isoDate));
}

function formatDomainScore(score: number, max: number, language: Language): string {
  return language === "ja" ? `${score} / ${max}点` : `${score} / ${max}`;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("ja");
  const [view, setView] = useState<View>("home");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [resultDate, setResultDate] = useState("");

  const [plan, setPlan] = useState<ActionPlan>({ ...emptyPlan });
  const [demo, setDemo] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  useEffect(() => { mainRef.current?.querySelector("h1")?.focus(); }, [view]);
  const t = copy[language];
  const w = workflowCopy[language];
  const missingQuestions = useMemo(() => getMissingQuestions(answers), [answers]);
  const answeredCount = QUESTION_ORDER.length - missingQuestions.length;
  const completionPercent = Math.round((answeredCount / QUESTION_ORDER.length) * 100);
  const printableDate = formatDate(resultDate, language);

  const visibleNav = result ? [...navViews, "results" as const] : navViews;

  function startAssessment() {
    setView("assessment");
  }

  function selectAnswer(questionId: QuestionId, optionId: OptionId) {
    setResult(null);
    setResultDate("");
    setPlan({ ...emptyPlan });
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: optionId
    }));
  }

  function showScore() {
    if (missingQuestions.length > 0) {
      return;
    }

    setResult(calculateScores(answers));
    setResultDate(new Date().toISOString());
    setView("results");
  }

  function restartAssessment() {
    setDemo(false);
    setPlan({ ...emptyPlan });
    setAnswers({});
    setResult(null);
    setResultDate("");
    setView("assessment");
  }

  function tryExample() {
    const example: AnswerMap = { leisure: "leisure_151_plus", transport: "transport_151_plus", sedentary: "sedentary_8_plus" };
    setAnswers(example);
    setResult(calculateScores(example));
    setResultDate(new Date().toISOString());
    setPlan({ ...emptyPlan });
    setDemo(true);
    setView("results");
  }

  return (
    <div className="app-shell">
      <header className="topbar no-print">
        <div className="topbar-inner">
          <button className="brand" type="button" onClick={() => setView("home")}>
            {t.common.appTitle}
          </button>

          <div className="language-toggle" aria-label="Language">
            <button
              className={language === "ja" ? "toggle-active" : ""}
              type="button"
              onClick={() => setLanguage("ja")}
              aria-pressed={language === "ja"}
            >
              日本語
            </button>
            <button
              className={language === "en" ? "toggle-active" : ""}
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
            >
              English
            </button>
          </div>
        </div>

        <nav className="nav" aria-label="Primary">
          {visibleNav.map((navView) => (
            <button
              className={view === navView ? "nav-active" : ""}
              key={navView}
              type="button"
              onClick={() => setView(navView)}
            >
              {t.nav[navView]}
            </button>
          ))}
        </nav>
      </header>

      <main className="main" ref={mainRef}>
        {demo && <div className="demo-banner" role="status">{w.example} <button className="secondary-button no-print" type="button" onClick={restartAssessment}>{t.common.restart}</button></div>}
        {view === "home" && (
          <section className="panel home-panel">
            <p className="eyebrow">{t.home.eyebrow}</p>
            <h1 tabIndex={-1}>{t.home.title}</h1>
            <p className="lead">{t.home.body}</p>
            <ol className="workflow-steps">{w.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol>
            <div className="action-row">
              <button className="primary-button" type="button" onClick={startAssessment}>
                {t.common.start}
              </button>
              <button className="secondary-button" type="button" onClick={tryExample}>{w.sample}</button>
            </div>
            <p className="hint">{w.boundary}</p>
            <Evidence language={language} />
          </section>
        )}

        {view === "assessment" && (
          <section className="assessment-layout">
            <div className="section-header">
              <p className="eyebrow">{t.common.appTitle}</p>
              <h1 tabIndex={-1}>{t.assessment.title}</h1>
              <p>{t.assessment.intro}</p>
            </div>

            <div className="progress-card" aria-label={t.assessment.progress}>
              <div className="progress-line">
                <span>{t.assessment.progress}</span>
                <strong>
                  {answeredCount}/{QUESTION_ORDER.length} {t.assessment.answered}
                </strong>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={QUESTION_ORDER.length}
                aria-valuenow={answeredCount}
              >
                <div className="progress-fill" style={{ width: `${completionPercent}%` }} />
              </div>
            </div>

            <div className="question-list">
              {t.questions.map((question, index) => (
                <fieldset className="question-card" key={question.id} aria-describedby={`${question.id}-hint`}>
                  <legend className="sr-only">{`Q${index + 1}. ${question.title}`}</legend>
                  <div className="question-heading" aria-hidden="true">
                    <span className="question-number">Q{index + 1}</span>
                    <span className="question-title">{question.title}</span>
                  </div>
                  <RecallHelp id={question.id} language={language} />
                  <div className="option-list">
                    {question.options.map((option) => (
                      <label className="option-row" key={option.id}>
                        <input
                          type="radio"
                          name={question.id}
                          value={option.id}
                          checked={answers[question.id] === option.id}
                          onChange={() => selectAnswer(question.id, option.id)}
                        />
                        <span>{option.label}</span>
                        <strong>
                          {getOptionPoints(option.id)} {t.common.points}
                        </strong>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="assessment-actions">
              <p className={missingQuestions.length > 0 ? "validation-message" : "validation-ok"}>
                {missingQuestions.length > 0 ? t.assessment.incomplete : t.privacyStatement}
              </p>
              <button
                className="primary-button"
                type="button"
                onClick={showScore}
                disabled={missingQuestions.length > 0}
              >
                {t.common.calculate}
              </button>
            </div>
          </section>
        )}

        {view === "results" && (
          <ResultView
            language={language}
            printableDate={printableDate}
            result={result}
            restartAssessment={restartAssessment}
            editAnswers={() => setView("assessment")}
            answers={answers}
            demo={demo}
            plan={plan}
            setPlan={setPlan}
          />
        )}

        {view === "about" && (
          <InfoPanel title={t.about.title}>
            <p>{t.about.body}</p>
            <div className="notice">{t.importantStatement}</div>
            <Evidence language={language} />
          </InfoPanel>
        )}

        {view === "howTo" && (
          <InfoPanel title={t.howTo.title}>
            <ul className="plain-list">
              {t.howTo.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="notice">{t.privacyStatement}</div>
          </InfoPanel>
        )}

        {view === "citation" && (
          <InfoPanel title={t.citation.title}>
            <p>{t.citation.text}</p>
            <a href={PAPER_URL} target="_blank" rel="noreferrer">{w.original} ↗</a>
          </InfoPanel>
        )}

        {view === "policy" && (
          <InfoPanel title={t.policy.title}>
            <ul className="plain-list">
              {t.policy.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="notice">{t.privacyStatement}</div>
          </InfoPanel>
        )}
      </main>

      <footer className="footer no-print">
        <span>{w.version}</span><br />
        <span>{t.privacyStatement}</span>
      </footer>
    </div>
  );
}

function ResultView({
  language,
  printableDate,
  result,
  restartAssessment,
  editAnswers,
  answers,
  plan,
  setPlan,
  demo
}: {
  language: Language;
  printableDate: string;
  result: ScoreResult | null;
  restartAssessment: () => void;
  editAnswers: () => void;
  answers: AnswerMap;
  plan: ActionPlan;
  setPlan: (plan: ActionPlan) => void;
  demo: boolean;
}) {
  const t = copy[language];
  const w = workflowCopy[language];
  const [copyStatus, setCopyStatus] = useState("");
  useEffect(() => { setCopyStatus(""); }, [answers, plan, language]);
  async function copyResult() {
    try {
      await navigator.clipboard.writeText(buildSummary(answers, plan, language, printableDate, demo));
      setCopyStatus(w.copied);
    } catch { setCopyStatus(w.copyFailed); }
  }

  if (!result) {
    return (
      <section className="panel">
        <h1 tabIndex={-1}>{t.results.title}</h1>
        <p>{t.results.noResult}</p>
        <button className="primary-button" type="button" onClick={restartAssessment}>
          {t.common.start}
        </button>
      </section>
    );
  }

  return (
    <section className="panel result-panel printable-result">
      <div className="result-heading">
        <div>
          <p className="eyebrow">{t.results.printableSummary}</p>
          <h1 tabIndex={-1}>{t.results.title}</h1>
          <p>
            {t.results.date}: <strong>{printableDate}</strong>
          </p>
        </div>
        <div className="score-lockup" aria-label={`${t.results.totalScore}: ${result.total}`}>
          <span>{t.results.totalScore}</span>
          <strong>{result.total}</strong>
          <em>{t.common.outOf100}</em>
        </div>
      </div>

      <div className="gauge-block">
        <div className="gauge-label">
          <span>{t.results.visualGauge}</span>
          <strong>{result.total}/100</strong>
        </div>
        <div className="score-gauge" aria-hidden="true">
          <div className="score-gauge-fill" style={{ width: `${result.total}%` }} />
        </div>
        <div className="gauge-scale" aria-hidden="true">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      <div className="notice">{w.boundary}</div>
      {answers.sedentary === "sedentary_8_plus" && <div className="sitting-note">{w.sittingNote}</div>}

      <div className="domain-section score-composition">
        <p className="eyebrow">02 / {language === "ja" ? "生活行動の内訳" : "BEHAVIOR PROFILE"}</p>
        <h2>{w.profileTitle}</h2>
        <p className="hint">{w.profileNote}</p>
        <div className="domain-list">
          {QUESTION_ORDER.map((questionId) => (
            <DomainRow key={questionId} questionId={questionId} result={result} language={language} answers={answers} />
          ))}
        </div>
      </div>

      <PlanEditor language={language} plan={plan} setPlan={setPlan} />
      <div className="statement">{t.importantStatement}</div>
      <Evidence language={language} />

      <div className="print-details">
        <h2>{t.citation.title}</h2>
        <p>{t.citation.text}</p>
        <a href={PAPER_URL} target="_blank" rel="noreferrer">{w.original} ↗</a>
        <p>{w.version}</p>
      </div>

      <div className="result-actions no-print">
        <button className="secondary-button" type="button" onClick={editAnswers}>{w.edit}</button>
        <button className="secondary-button" type="button" onClick={copyResult}>{w.copy}</button>
        <button className="secondary-button" type="button" onClick={restartAssessment}>
          {t.common.restart}
        </button>
        <button className="primary-button" type="button" onClick={() => window.print()}>
          {t.common.print}
        </button>
      </div>
      <p role="status" aria-live="polite" className="no-print">{copyStatus}</p>
      <details className="evidence no-print">
        <summary>{w.feedback}</summary>
        <p>{w.feedbackNote}</p>
        <a href="mailto:kise.ryusei@gmail.com?subject=WPTI-Quick%20feedback">{w.contact}</a>
      </details>
    </section>
  );
}

function DomainRow({
  questionId,
  result,
  language,
  answers
}: {
  questionId: QuestionId;
  result: ScoreResult;
  language: Language;
  answers: AnswerMap;
}) {
  const t = copy[language];
  const w = workflowCopy[language];
  const score = result.domainScores[questionId];
  const max = DOMAIN_MAX[questionId];
  const width = Math.round((score / max) * 100);

  return (
    <div className="domain-row">
      <div className="domain-row-top">
        <span>{t.domainLabels[questionId]}</span>
        <strong>{formatDomainScore(score, max, language)}</strong>
      </div>
      <p className="response-label">{responseLabel(answers, questionId, language)}</p>
      <div className="domain-track" aria-hidden="true">
        <div className="domain-fill" style={{ width: `${width}%` }} />
      </div>
      <p className="domain-prompt">{score === max ? w.maintenance[questionId] : w.prompts[questionId]}</p>
    </div>
  );
}

function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel info-panel">
      <h1 tabIndex={-1}>{title}</h1>
      {children}
    </section>
  );
}
