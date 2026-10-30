import type { ContextField, Nonresponse, PlanChoice } from "./dialogue.ts";
import type { Language, QuestionId } from "./types.ts";

type WorkflowCopy = {
  steps: string[]; sample: string; example: string; version: string;
  boundary: string; evidenceTitle: string; evidence: string[];
  hints: Record<QuestionId, string>; intervalTitle: string; intervalNote: string;
  calcTitle: string; days: string; minutes: string; total: string; calcNote: string; invalid: string;
  profileTitle: string; profileNote: string; prompts: Record<QuestionId, string>;
  nonresponseTitle: string; nonresponses: Record<Nonresponse, string>; unanswered: string; clearAnswer: string;
  nextContext: string; contextTitle: string; contextIntro: string; modeTitle: string; notesMode: string; talkOnly: string;
  talkOnlyNote: string; contextLabels: Record<ContextField, string>; contextHints: Record<ContextField, string>;
  periodNote: string; contextRequired: string; nextPlan: string; editContext: string; contextReset: string; answerReset: string;
  planReviewPending: string; planTitle: string; planIntro: string; planChoices: Record<Exclude<PlanChoice, "">, string>;
  choose: string; otherDomain: string; noPlan: string; action: string; when: string; support: string; review: string;
  personalized: string; reviewNote: string; privacy: string; consent: string; showSummary: string;
  copy: string; copied: string; copyFailed: string; edit: string; editPlan: string;
  referenceTitle: string; referenceNote: string; scoreUnavailable: string; notRecorded: string; notEntered: string;
  summaryTitle: string; summaryIntro: string; exportNote: string; original: string;
};

export const workflowCopy: Record<Language, WorkflowCopy> = {
  ja: {
    steps: ["3問に答える", "暮らしについて話す", "やってみたいことを選ぶ"],
    sample: "入力例で試す", example: "入力例です。架空の回答を使っています。", version: "採点：Quick v1.0 ／ 対話支援：1.3-prototype ／ Web：1.8.0-dialogue-rc.1",
    boundary: "3つの回答を、暮らしを振り返るきっかけに使います。点数は参考です。健康の良し悪しや病気の診断、WHOの運動基準を満たすかどうか、支援が必要な順番を示すものではありません。",
    evidenceTitle: "原著WPTIとQuickの違い・研究上の限界",
    evidence: [
      "原著WPTIは、理学療法での行動評価・相談を目指し、余暇活動・移動活動・座位時間をまとめる3領域指標を開発し、初期評価した研究です。日本の成人全国調査で2,966人の得点を算出したと報告しています。全国の参照尺度として使えることや、得点に基づく臨床判断の実用準備が完了したことを示すものではありません。",
      "Quick v1.0は、同じ3領域をカテゴリ化して30・30・40点を配点する別の簡易版です。原著WPTIと同じ算式ではなく、原著の性能値や35点・60点の提案帯をQuickの判定基準として適用できません。この画面では判定帯を表示しません。",
      "原著はスクリーニングなどへの応用を提案していますが、得点によるスクリーニング、運動量や追跡頻度の決定は、検証済みの用途ではありません。この対話支援の使いやすさや有用性も、今後の検証課題です。",
      "原著の活動基準との関連は、得点と一部の自己申告入力を共有する標本内の結果です。独立した健康・機能・予後の妥当性を示すものではありません。計算の再現性と測定の信頼性は別であり、再検査信頼性・変化への反応性・意味のある変化量は確立していません。",
      "アプリの改良や区分の細分化によって、過去の研究の計算・数値の問題を遡って修正することはできません。原著の数値の検証と、Quickおよび対話支援の検証は分けて扱います。点数の増減だけで介入効果や健康の改善を判断できません。"
    ],
    hints: {
      leisure: "例：自由な時間にする速歩き、運動、スポーツなど。少し息が弾む程度以上の活動を数えます。通勤や買い物のための歩き・自転車は、2問目に入れてください。",
      transport: "例：通勤・通学・買い物で歩いた時間や自転車に乗った時間。車や電車に乗っている時間は含めません。往復する場合は、両方の時間を合計します。",
      sedentary: "仕事中、車・電車の中、自宅などで、座ったり横になったりした時間を数えます。眠っていた時間は入れません。当てはまる時間がなければ「わからない」を選べます。"
    },
    intervalTitle: "当てはまる時間がないとき",
    intervalNote: "例えば3時間半・5時間半・7時間半は、選択肢の間になります。近い時間を無理に選ばず、「わからない」を選んでください。Quick v1.0には、この間の時間をどちらに入れるかという決まりはありません。",
    calcTitle: "1週間の合計を計算する", days: "週に何日？", minutes: "1日何分？", total: "1週間の合計", calcNote: "毎回ほぼ同じ時間なら、この計算が使えます。日によって違う場合は、7日分を足してください。計算後は、自分で回答を選びます。この計算欄は、まとめには残りません。", invalid: "日数は0〜7日（小数なし）、時間は0〜1,440分で入力してください。",
    profileTitle: "選んだ回答", profileNote: "選んだ内容をそのまま表示します。「わからない」「答えない」や未回答は、0点や「活動していない」とは扱いません。",
    prompts: { leisure: "どんな運動をしていますか。続けたいことはありますか。", transport: "普段はどうやって出かけていますか。", sedentary: "どんなときに座ったり横になったりしていますか。必要な休息も含めて考えましょう。" },
    nonresponseTitle: "答えが決まらない・答えたくないとき",
    nonresponses: { unsure: "わからない", unable: "答えない" }, unanswered: "未回答", clearAnswer: "選択を取り消す",
    nextContext: "暮らしについて話す", contextTitle: "暮らしについてメモする", contextIntro: "書きたいところだけで大丈夫です。メモは点数に影響しません。",
    modeTitle: "メモを使いますか？", notesMode: "この画面にメモする", talkOnly: "書かずに、考えたり話したりする",
    talkOnlyNote: "前に書いた暮らしのメモと、やってみたいことのメモは消えます。3問の回答は残ります。",
    contextLabels: { period: "いつごろの話？（任意）", sitting: "座ったり横になったりするのは、どんなとき？", demands: "仕事・家事・介護などで忙しいことは？", healthMobility: "体調や体の動きで気になることは？", environment: "場所や交通などで困ることは？", supports: "役に立っていることや、頼れる人は？" },
    contextHints: { period: "例：普段の生活、最近変わったこと。日付は書かなくても大丈夫です。", sitting: "例：テレビを見るとき、仕事中、休むとき。実際の時間も書けます。", demands: "自分だけでは変えられない事情も書けます。", healthMobility: "詳しい病名は不要です。休息が必要なことなど、書ける範囲で大丈夫です。", environment: "例：雨が多い、歩ける場所がない、時間や費用が足りない。", supports: "例：一緒に歩く人、近くの公園。個人の名前は書かないでください。" },
    periodNote: "メモに別の時期を書いても、3問で答える期間は「この1週間」のままです。",
    contextRequired: "メモするか、話すだけにするかを選んでください。何も書かなくても進めます。", nextPlan: "やってみたいことを選ぶ", editContext: "暮らしのメモを見直す", contextReset: "メモを変えても、選んだ行動は残ります。今の暮らしに合っているか確認してください。", answerReset: "回答を変えても、メモは残ります。選んだ行動が今の暮らしに合っているか確認してください。",
    planTitle: "やってみたいことを選ぶ", planIntro: "体調や暮らしに合わせて選んでください。今の習慣を続けたり、今は決めなかったりしても大丈夫です。",
    planChoices: { change: "やってみたいことを決める", maintain: "今の習慣を続ける", none: "今は決めない" },
    choose: "何について？（任意）", otherDomain: "その他・いくつかに関係すること", noPlan: "選択とメモを取り消す", action: "やってみたいこと・続けたいこと", when: "いつ・どこで・どのくらい？（任意）", support: "手伝ってほしいこと・難しいときの工夫（任意）", review: "後で振り返る日（任意）",
    personalized: "体調に合わせて、無理なくできることを選んでください。この画面では、必要な運動量や支援の順番は決めません。",
    reviewNote: "後で、できたことや難しかったことを振り返りましょう。暮らしが変わっても、点数が変わらない場合があります。",
    privacy: "名前や連絡先など、個人が特定できる内容は書かないでください。入力は送信・自動保存されません。ページを読み込み直すか、入力を消してやり直すと消えます。",
    consent: "一人でも、理学療法士などの支援者と一緒でも使えます。誰かと使う場合は、使い方と記録してよい範囲を本人と確認してください。健康教室等での収集・研究利用は、この画面とは別に、必要な同意や倫理承認の範囲を確認します。",
    showSummary: "回答とメモを見る", copy: "まとめをコピー", copied: "コピーしました。貼り付ける場所を確認してください。", copyFailed: "コピーできませんでした。印刷 / PDF保存をご利用ください。", edit: "回答を直す", editPlan: "選んだ行動を見直す",
    referenceTitle: "点数を見る（参考）", referenceNote: "Quick v1.0の決まりで計算した参考点です。原著WPTIとは別のものです。健康度の割合や、診断の基準ではありません。1点の差が測定できることを示さず、点数による判定や支援の優先順位は付けません。",
    scoreUnavailable: "3問すべての時間が選ばれていないため、点数は出しません。回答の確認はこれで終わりです。", planReviewPending: "回答や暮らしのメモを変えました。選んだ行動は残してあるので、内容を確認してください。", notRecorded: "暮らしや行動のメモなし", notEntered: "未記入", summaryTitle: "回答とメモ", summaryIntro: "回答とメモの内容を確認してください。誰かと使う場合は一緒に確認します。メモは点数に影響しません。", exportNote: "コピーや印刷は、ボタンを押したときだけ行います。保存先や共有する相手を確認してください。誰かの回答を保存・共有する場合は、本人の了解を得てください。コピーした内容や保存したファイルは、画面の入力を消しても残ります。",
    original: "原著をPubMedで読む"
  },
  en: {
    steps: ["Three areas of daily behavior", "Discuss life circumstances", "Choose a next step"],
    sample: "Try an example", example: "Example only. These are fictional responses.", version: "Scoring: Quick v1.0 / Dialogue: 1.3-prototype / Web: 1.8.0-dialogue-rc.1",
    boundary: "Use the responses and life circumstances as conversation prompts. The Quick score is a reference only, not a percentage of health, a diagnosis, WHO guideline attainment, or a priority for support.",
    evidenceTitle: "Original WPTI vs Quick: research limitations",
    evidence: [
      "The original study developed and initially evaluated a three-domain index of leisure activity, transport activity, and sedentary time for physiotherapy assessment and counselling. It reports scores for 2,966 adults from a national survey in Japan. This does not establish a national reference scale or readiness for routine score-based use.",
      "Quick v1.0 is a separate simplified version with categorical scoring and 30, 30, and 40 available points. Its formula is not the original WPTI formula. The original performance estimates and proposed bands at 35 and 60 cannot be applied as Quick decision rules. This interface does not display those bands.",
      "The paper proposes applications including screening, but score-based screening, exercise-dose allocation, and follow-up decisions are not established uses. The usability and benefit of this dialogue support also remain to be evaluated.",
      "The original associations with activity criteria are within-sample results that share some self-reported inputs with the score. They do not establish independent validity for health, function, or prognosis. Computational reproducibility differs from measurement reliability; test–retest reliability, responsiveness, and meaningful change have not been established.",
      "App improvements or finer categories cannot retrospectively correct calculation or numerical problems in past research. Verification of the original study, Quick, and dialogue support must be kept separate. Score changes alone do not establish intervention effectiveness or improved health."
    ],
    hints: {
      leisure: "Examples: brisk leisure walking, exercise, or sport. Do not count inactive leisure. Count walking or cycling for travel in Q2; do not count the same time twice.",
      transport: "Examples: walking or cycling to work, study, or shops. Exclude time riding in a car or train. Include both legs of a return trip.",
      sedentary: "Average daily time sitting or reclining while awake, including work, travel, and home. Exclude sleep. If no category fits, choose ‘Not sure’ and continue the conversation."
    },
    intervalTitle: "When sitting time falls between categories", intervalNote: "Quick v1.0 does not specify rounding for times such as 3.5, 5.5, or 7.5 hours. This interface does not convert or request rounding to the nearest category. Leave the answer unresolved and discuss the actual situation alongside the responses.",
    calcTitle: "Calculate weekly minutes (optional)", days: "Days per week", minutes: "Total minutes on that day", total: "Weekly total", calcNote: "A recall aid for similar daily amounts; it does not select an answer. If days differ, add the minutes across the week. These helper inputs are not included in the summary.", invalid: "Enter a whole number of days from 0 to 7 and minutes from 0 to 1,440.",
    profileTitle: "Responses across three areas", profileNote: "These are the original selected responses. Unsure, unable to answer, and unanswered entries are never converted to zero points or no activity.",
    prompts: { leisure: "What activities happen in daily life? What helps, or matters to you?", transport: "How do you usually travel, and what shapes those choices?", sedentary: "When and for how long do you sit or recline? Include the time you need for rest." },
    nonresponseTitle: "If you are unsure or prefer not to answer", nonresponses: { unsure: "Not sure", unable: "Prefer not to answer" }, unanswered: "Unanswered", clearAnswer: "Clear this selection",
    nextContext: "Discuss life circumstances", contextTitle: "Reflect on life circumstances", contextIntro: "Whatever the score, consider actual situations, constraints, and sources of support. Every field is optional and unscored. You can reflect or talk without recording any details.",
    modeTitle: "Choose whether to record notes", notesMode: "Choose what to record and make temporary notes on this page", talkOnly: "Reflect or talk without entering context or plan details", talkOnlyNote: "Context and plan details will not be recorded here. Any previous context or plan notes will be erased. Selected responses to the three questions will remain.",
    contextLabels: { period: "Period being discussed (optional)", sitting: "Actual sitting / reclining situations and time", demands: "Work, household, caring, and travel circumstances", healthMobility: "Health, mobility, and need for rest", environment: "Environment and barriers", supports: "What helps / support that may be available" },
    contextHints: { period: "For example: usual routines or recent changes. Dates and a period are optional.", sitting: "When, where, and during what activities? Discuss actual time between categories and uninterrupted periods if useful.", demands: "Include constraints and circumstances that the participant cannot change alone.", healthMobility: "Detailed diagnoses or clinical information are unnecessary. Discuss only what the participant wishes to share.", environment: "Discuss relevant weather, safety, transport, time, or cost constraints.", supports: "Consider what sustains current habits and useful people or places, without entering names." },
    periodNote: "A different period in this optional note does not change the three questions: answer for the average situation during the past 1 week.", contextRequired: "Choose temporary notes or talk only to continue. You do not need to fill in any details.", nextPlan: "Choose a next step", editContext: "Review circumstances", contextReset: "The plan is kept when context notes change. Check whether the next step still fits your circumstances.", answerReset: "Context notes and the plan are kept when a response changes. Review the next step against the updated responses.",
    planTitle: "Choose something you would like to do", planIntro: "Choose what fits your health and daily life. You can keep your current habits or decide later.", planChoices: { change: "Choose something to try", maintain: "Keep my current habits", none: "Decide later" },
    choose: "What is it about? (optional)", otherDomain: "Other / more than one area", noPlan: "Clear this choice and its notes", action: "Something to try or keep doing", when: "When / where / how much? (optional)", support: "Help or an alternative if difficult (optional)", review: "A date to look back (optional)",
    personalized: "Check the plan against health and mobility. This screen does not prescribe an exercise dose or rank support needs.", reviewNote: "Next time, discuss what happened, what was manageable, and what got in the way. Behavior and circumstances can change within the same category or score.",
    privacy: "Do not enter names, contact details, or other personal identifiers. Inputs remain in this page’s memory; they are not automatically sent or saved. Reloading or ‘Clear all inputs’ erases them.", consent: "Use this on your own or with a physiotherapist or another support person. If using it with someone else, agree how to use it and what may be recorded. Collection or research use in a health class requires a separate check of consent and any applicable ethics approval.", showSummary: "Review the conversation summary", copy: "Copy summary", copied: "Copied. The clipboard retains the content; check where you share it.", copyFailed: "Copy failed. Please use Print / Save as PDF.", edit: "Review responses", editPlan: "Review next step",
    referenceTitle: "Reference only: view the Quick v1.0 total", referenceNote: "Calculated with the unchanged categorical scoring. It is not equivalent to the original WPTI. It does not represent a health percentage, a clinical threshold, or measurement precision of one point. No decision bands or priorities are assigned.", scoreUnavailable: "Some instrument responses are missing, so no total is calculated. The conversation can continue without a score.", planReviewPending: "Responses or context notes have changed. The retained next step is awaiting review.", notRecorded: "No context or plan details recorded", notEntered: "Not entered", summaryTitle: "Conversation summary", summaryIntro: "Check the responses, life circumstances, and choices, together if using this with someone else. Keep scoring separate from notes.", exportNote: "Copying, printing, or saving as PDF happens only when you choose it. Check the destination and sharing. Get the person’s agreement before handling their record. ‘Clear all inputs’ does not erase clipboard content or saved files.", original: "Read the original paper on PubMed"
  }
};
