"use client";

import { getActionIdeaGroups, SHORT_BOUT_IDEAS, SHORT_BOUT_REFERENCES } from "../lib/short-bouts.ts";
import type { Language, QuestionId } from "../lib/types.ts";
import { domainFeedbackCopy } from "../lib/domain-feedback-copy.ts";
import type { DialogueSession, DialogueAction } from "../lib/dialogue.ts";
import type { Dispatch } from "react";

type IdeaProps = {
  language: Language;
  session: DialogueSession;
  dispatch: Dispatch<DialogueAction>;
  onOpenPlan: () => void;
};

export function ResultActionIdeas({ language, session, dispatch, onOpenPlan }: IdeaProps) {
  const ja = language === "ja";
  const groups = getActionIdeaGroups(session.answers);
  const canInsert = ["", "change"].includes(session.plan.choice) && !session.plan.action.trim();
  function useIdea(action: string) {
    if (!canInsert) return;
    dispatch({ type: "noteShortBout", value: action });
    onOpenPlan();
  }
  function cards(ids: QuestionId[], other = false) {
    return <ul className="short-bout-list result-idea-list" data-count={ids.length}>
      {ids.map(id => {
        const idea = SHORT_BOUT_IDEAS[language].find(item => item.id === id)!;
        return <li key={id}>
          {(ids.length > 1 || other) && <p className="idea-domain">{domainFeedbackCopy[language].names[id]}</p>}
          <strong>{idea.title}</strong>
          <p>{idea.action}</p>
          {canInsert && <button className="secondary-button" type="button" aria-label={`${idea.title}: ${ja ? "この例をメモする" : "Add this idea to a note"}`} onClick={() => useIdea(idea.action)}>{ja ? "この例をメモする" : "Add this idea to a note"}</button>}
        </li>;
      })}
    </ul>;
  }
  return <section className="result-action-ideas no-print" aria-labelledby="result-ideas-title">
    <h2 id="result-ideas-title">{ja ? "行動の例" : "Activity ideas"}</h2>
    {groups.status === "incomplete" && <p>{ja ? "3つの項目の例です。生活に合うものを選んでください。" : "Here are examples across all three areas. Choose what fits your life."}</p>}
    {groups.status === "comparable" && groups.primaryIds.length > 1 && <p>{ja ? "見直す候補が複数あります。できそうなものから選べます。" : "There are several areas to reflect on. Start with whichever feels manageable."}</p>}
    {groups.status === "all-max" && <p className="maintain-message">{ja ? "今の習慣を続けることも選べます。" : "Keeping your current habits is also an option."}</p>}
    {groups.primaryIds.length > 0 && cards(groups.primaryIds)}
    {groups.primaryIds.length > 0 && <p className="hint idea-fit-note">{ja ? "時間は一例です。体調や生活に合うものを選んでください。" : "Times are examples. Choose what suits your health and daily life."}</p>}
    {groups.otherIds.length > 0 && <details className="other-action-ideas"><summary>{groups.status === "all-max" ? ja ? "生活に合わせた行動例を見る" : "See ideas for your daily life" : ja ? "ほかの行動例も見る" : "See other activity ideas"}</summary>{cards(groups.otherIds, true)}{groups.status === "all-max" && <p className="hint">{ja ? "時間は一例です。体調や生活に合うものを選んでください。" : "Times are examples. Choose what suits your health and daily life."}</p>}</details>}
    {!canInsert && <p className="existing-memo-note">{ja ? "書いたメモはそのまま残っています。" : "Your existing note is kept."} <button className="text-button" type="button" onClick={onOpenPlan}>{ja ? "メモを見る" : "View your note"}</button></p>}
  </section>;
}

export function ShortBoutIdeas({ language, session, dispatch, onOpenPlan }: {
  language: Language;
  session: DialogueSession;
  dispatch: Dispatch<DialogueAction>;
  onOpenPlan: () => void;
}) {
  const ja = language === "ja";
  const canInsert = ["", "change"].includes(session.plan.choice) && !session.plan.action.trim();

  function useIdea(action: string) {
    if (!canInsert) return;
    dispatch({ type: "noteShortBout", value: action });
    onOpenPlan();
  }

  return <section className="short-bout-guide no-print" aria-labelledby="short-bout-title">
    <h2 id="short-bout-title">{ja ? "例えば、こんなこと" : "Some ideas"}</h2>
    <p>{ja ? "体調に合わせて、無理のないものを選んでください。" : "Choose something that feels safe and manageable for you."}</p>
    {!canInsert && <><p>{ja ? "今のメモはそのまま残っています。" : "Your existing note is kept."}</p><button className="secondary-button" type="button" onClick={onOpenPlan}>{ja ? "今のメモを見る" : "View your note"}</button></>}
    <ul className="short-bout-list">
      {SHORT_BOUT_IDEAS[language].map(idea => <li key={idea.id}>
        <strong>{idea.title}</strong>
        <p>{idea.action}</p>
        <details className="idea-details"><summary>{ja ? "補足を見る" : "More about this idea"}</summary><p className="hint">{idea.context}</p></details>
        {canInsert && <button className="secondary-button" type="button" aria-label={`${idea.title}: ${ja ? "この例をメモする" : "Add this idea to a note"}`} onClick={() => useIdea(idea.action)}>
          {ja ? "この例をメモする" : "Add this idea to a note"}
        </button>}
      </li>)}
    </ul>
    <p className="hint">{ja ? "時間は例です。休息が必要なときは、休むことを優先してください。" : "Times are examples. Rest when you need to."}</p>
    <details className="editor-details">
      <summary>{ja ? "注意点と研究について" : "Notes and research"}</summary>
      <p>{ja ? "例の時間は、全員が目指す運動量ではありません。ゆっくり歩くことと、息が大きく弾む運動では、研究で分かっている効果が異なります。" : "The example durations are not prescriptions or targets for everyone. Evidence for light activity and vigorous exercise differs."}</p>
      <p className="hint">{ja
        ? "WHOの2020年ガイドラインでは、中高強度の身体活動を数える際の「1回10分以上」という条件はありません。成人の有酸素活動の目安は週150〜300分の中強度、または75〜150分の高強度（あるいは同等の組合せ）です。軽い歩行や立位を、中高強度身体活動の推奨時間にそのまま算入することはできません。ただし、座位時間を減らし、軽い身体活動に置き換えることにも健康上の意義があります。"
        : "WHO's 2020 guidelines no longer require moderate-to-vigorous activity to last at least 10 minutes. The adult aerobic recommendation is 150–300 minutes of moderate activity or 75–150 minutes of vigorous activity per week, or an equivalent combination. Light walking or standing cannot be counted directly toward the recommended duration of moderate-to-vigorous activity. However, reducing sedentary time and replacing it with light physical activity also has health benefits."}</p>
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
        ? "原著WPTIでは妥当性を検討した結果が報告されています。一方、WPTI-Quickは別のカテゴリ式尺度であり、原著と同じ測定特性が確認されたものではありません。WPTI-Quick自体の妥当性・再現性・反応性、および本機能による行動変容や健康アウトカムへの効果は、今後の検証課題です。"
        : "The original WPTI paper reported findings from an assessment of validity. WPTI-Quick is a separate categorical instrument; it has not been shown to share the original instrument's measurement properties. WPTI-Quick's own validity, test–retest reliability and responsiveness, and this feature's effects on behavior change and health outcomes, require future evaluation."}</p>
      <ul className="plain-list">{SHORT_BOUT_REFERENCES.map(ref =>
        <li key={ref.url}><a href={ref.url} target="_blank" rel="noreferrer">{ref.label} ↗</a></li>
      )}</ul>
    </details>
  </section>;
}
