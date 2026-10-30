"use client";

import { SHORT_BOUT_IDEAS, SHORT_BOUT_REFERENCES } from "../lib/short-bouts.ts";
import type { Language } from "../lib/types.ts";
import type { DialogueSession, DialogueAction } from "../lib/dialogue.ts";
import type { Dispatch } from "react";

export function ShortBoutIdeas({ language, session, dispatch }: {
  language: Language;
  session: DialogueSession;
  dispatch: Dispatch<DialogueAction>;
}) {
  const ja = language === "ja";
  const canInsert = session.context.mode === "notes" &&
    session.plan.choice === "change" && !session.plan.action.trim();

  function useIdea(action: string) {
    if (!canInsert) return;
    dispatch({ type: "planField", field: "action", value: action });
  }

  return <section className="short-bout-guide no-print" aria-labelledby="short-bout-title">
    <h2 id="short-bout-title">{ja ? "短い身体活動も、次の一歩に" : "Brief activity can be a next step"}</h2>
    <p>{ja
      ? "まとまった運動時間がなくても、生活の中で短い活動を積み重ねる方法があります。本人に合う場面と無理のない内容を話し合いましょう。"
      : "Brief bouts can add to activity across the day. Discuss which opportunities are feasible and comfortable in everyday life."}</p>
    <ul className="short-bout-list">
      {SHORT_BOUT_IDEAS[language].map(idea => <li key={idea.id}>
        <strong>{idea.title}</strong>
        <p>{idea.action}</p>
        <p className="hint">{idea.context}</p>
        {canInsert && <button className="secondary-button" type="button" onClick={() => useIdea(idea.action)}>
          {ja ? "この例を計画欄へ入れる" : "Use as plan draft"}
        </button>}
      </li>)}
    </ul>
    <p className="hint">{ja
      ? "例の分数は一律の処方や達成基準ではありません。活動強度により健康効果の根拠は異なります。座位の小休止と高強度運動を同等とは扱いません。体調・移動能力・安全性・休息の必要性を優先してください。"
      : "The example durations are not prescriptions or thresholds. Evidence varies by intensity; light sitting breaks are not equivalent to vigorous exercise. Prioritize health, mobility, safety and needed rest."}</p>
    <details className="editor-details">
      <summary>{ja ? "科学的根拠と限界" : "Evidence and limitations"}</summary>
      <p className="hint">{ja
        ? "活動を短時間に分けても累積の身体活動には意義があります。短時間の高強度活動と死亡率の関連は観察研究によるもので、個人への因果的効果や本アプリの有効性を証明するものではありません。"
        : "Accumulated activity matters even in short bouts. Associations between brief vigorous activity and mortality are observational, not proof of individual causal benefit or of this app's effectiveness."}</p>
      <ul className="plain-list">{SHORT_BOUT_REFERENCES.map(ref =>
        <li key={ref.url}><a href={ref.url} target="_blank" rel="noreferrer">{ref.label} ↗</a></li>
      )}</ul>
    </details>
  </section>;
}
