"use client";

import { SHORT_BOUT_IDEAS, SHORT_BOUT_REFERENCES } from "../lib/short-bouts.ts";
import type { Language } from "../lib/types.ts";
import type { DialogueSession, DialogueAction } from "../lib/dialogue.ts";
import { useEffect, useRef } from "react";
import type { Dispatch } from "react";

export function ShortBoutIdeas({ language, session, dispatch }: {
  language: Language;
  session: DialogueSession;
  dispatch: Dispatch<DialogueAction>;
}) {
  const ja = language === "ja";
  const focusAfterInsert = useRef(false);
  const canInsert = session.context.mode === "notes" &&
    session.plan.choice === "change" && !session.plan.action.trim();

  useEffect(() => {
    if (!focusAfterInsert.current) return;
    focusAfterInsert.current = false;
    const field = document.getElementById("plan-action");
    const details = field?.closest<HTMLDetailsElement>("details.optional-dialogue");
    if (details) details.open = true;
    field?.focus();
  }, [session.plan.action]);

  function useIdea(action: string) {
    if (!canInsert) return;
    focusAfterInsert.current = true;
    dispatch({ type: "insertShortBout", value: action });
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
        {canInsert && <button className="secondary-button" type="button" aria-controls="plan-action" aria-label={`${idea.title}: ${ja ? "この例を計画欄へ入れる" : "Use as plan draft"}`} onClick={() => useIdea(idea.action)}>
          {ja ? "この例を計画欄へ入れる" : "Use as plan draft"}
        </button>}
      </li>)}
    </ul>
    <p className="hint">{ja
      ? "計画に使う場合は、下の「生活背景・次の一歩を話す」で本人と確認して入力欄を開き、「小さな変更を試す」を選びます。計画欄が空のときだけ、例を入れるボタンが表示されます。記入済みの内容は上書きしません。"
      : "To use an example, open ‘Talk about daily life and a next step’ below, agree with the participant to open note fields, and choose ‘Try a small change’. Draft buttons appear only while the action field is empty. Existing text is never overwritten."}</p>
    <p className="hint">{ja
      ? "例の分数は一律の処方や達成基準ではありません。活動強度により健康効果の根拠は異なります。座位の小休止と高強度運動を同等とは扱いません。体調・移動能力・安全性・休息の必要性を優先してください。"
      : "The example durations are not prescriptions or thresholds. Evidence varies by intensity; light sitting breaks are not equivalent to vigorous exercise. Prioritize health, mobility, safety and needed rest."}</p>
    <details className="editor-details">
      <summary>{ja ? "科学的根拠と限界" : "Evidence and limitations"}</summary>
      <p className="hint">{ja
        ? "WHOの2020年ガイドラインでは、中高強度の身体活動を数える際の「1回10分以上」という条件はありません。成人の有酸素活動の目安は週150〜300分の中強度、または75〜150分の高強度（あるいは同等の組合せ）です。軽い歩行や立位を、この目安にそのまま置き換えることはできません。"
        : "WHO's 2020 guidelines no longer require moderate-to-vigorous activity to last at least 10 minutes. The adult aerobic recommendation is 150–300 minutes of moderate activity or 75–150 minutes of vigorous activity per week, or an equivalent combination. Light walking or standing does not substitute directly for this recommendation."}</p>
      <p className="hint">{ja
        ? "Saint-Mauriceらの研究は、中高強度活動の総量と死亡率の関連が、活動のまとまり方によらず認められた観察研究です。すべての強度・短時間活動で同じ効果があると示したものではありません。"
        : "Saint-Maurice and colleagues observed associations between total moderate-to-vigorous activity and mortality across different bout patterns. This observational study does not establish equal effects for every intensity or brief activity."}</p>
      <p className="hint">{ja
        ? "VILPAは、日常生活に含まれる1〜2分程度などの短い高強度活動を指します。Stamatakisらが報告した死亡率との関連は観察研究によるもので、因果的効果の証明ではありません。ゆっくり歩くことや立つだけの休憩に、その結果を当てはめることはできません。"
        : "VILPA means brief vigorous activity embedded in daily life, such as bouts lasting one to two minutes. Stamatakis and colleagues reported observational associations with mortality, not proof of causation. Those findings cannot be applied to easy walking or standing breaks."}</p>
      <p className="hint">{ja
        ? "Dunstanらの小規模な試験では、過体重・肥満の成人が座位を短い歩行で中断すると、食後の血糖・インスリン反応が短期的に低下しました。立つだけの効果や、長期の死亡率低下を検証した試験ではありません。"
        : "In Dunstan and colleagues' small trial in adults with overweight or obesity, brief walking breaks reduced post-meal glucose and insulin responses acutely. The trial did not test standing alone or long-term mortality."}</p>
      <p className="hint">{ja
        ? "これらは生活の中の行動を考えるための参考情報です。WPTI-Quickの測定特性や、この提案による行動変容・健康効果は検証されていません。"
        : "These sources inform discussion of everyday choices. WPTI-Quick's measurement properties and the behavior-change or health effects of these suggestions have not been established."}</p>
      <ul className="plain-list">{SHORT_BOUT_REFERENCES.map(ref =>
        <li key={ref.url}><a href={ref.url} target="_blank" rel="noreferrer">{ref.label} ↗</a></li>
      )}</ul>
    </details>
  </section>;
}
