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
    steps: ["3領域の生活行動", "生活の背景を話す", "本人と次の一歩を選ぶ"],
    sample: "入力例で試す", example: "入力例です。架空の回答を使っています。", version: "採点：Quick v1.0 ／ 対話支援：1.1-prototype ／ Web：1.6.1-dialogue-rc.1",
    boundary: "3領域の回答と生活の背景を手がかりに話し合います。Quickの点数は参考値であり、健康度の割合、診断、WHO基準の達成や支援の優先順位を示しません。",
    evidenceTitle: "原著WPTIとQuickの違い・研究上の限界",
    evidence: [
      "原著WPTIは、理学療法での行動評価・相談を目指し、余暇活動・移動活動・座位時間をまとめる3領域指標を開発し、初期評価した研究です。日本の成人全国調査で2,966人の得点を算出したと報告しています。全国の参照尺度として使えることや、得点に基づく臨床判断の実用準備が完了したことを示すものではありません。",
      "Quick v1.0は、同じ3領域をカテゴリ化して30・30・40点を配点する別の簡易版です。原著WPTIと同じ算式ではなく、原著の性能値や35点・60点の提案帯をQuickの判定基準として適用できません。この画面では判定帯を表示しません。",
      "原著はスクリーニングなどへの応用を提案していますが、得点によるスクリーニング、運動量や追跡頻度の決定は、検証済みの用途ではありません。この対話支援の使いやすさや有用性も、今後の検証課題です。",
      "原著の活動基準との関連は、得点と一部の自己申告入力を共有する標本内の結果です。独立した健康・機能・予後の妥当性を示すものではありません。計算の再現性と測定の信頼性は別であり、再検査信頼性・変化への反応性・意味のある変化量は確立していません。",
      "アプリの改良や区分の細分化によって、過去の研究の計算・数値の問題を遡って修正することはできません。原著の数値の検証と、Quickおよび対話支援の検証は分けて扱います。点数の増減だけで介入効果や健康の改善を判断できません。"
    ],
    hints: {
      leisure: "例：余暇の速歩、運動、スポーツなど。身体を動かさない余暇活動は含めません。移動目的の歩行・自転車はQ2に分け、同じ時間を二重に数えないでください。",
      transport: "例：通勤・通学・買い物で歩いた時間や自転車に乗った時間。車や電車に乗っている時間は含めません。往復する場合は、両方の時間を合計します。",
      sedentary: "仕事中、車・電車の中、自宅などで、起きて座る・横になる時間の1日平均です。睡眠は除きます。区分に当てはめにくい場合は、無理に選ばず「わからない・区分で迷う」から対話に進めます。"
    },
    intervalTitle: "座位時間が区分の間にあるとき",
    intervalNote: "Quick v1.0では、3.5・5.5・7.5時間などの丸め方を定めていません。時間を自動変換したり、近い区分への丸めを求めたりしません。迷う場合は回答を保留し、実際の状況を話し合ってください。",
    calcTitle: "週の合計を計算する（任意）", days: "週に何日？", minutes: "その日の合計（分）", total: "週の合計", calcNote: "同じくらいの時間を行う場合の補助です。回答は自動で選びません。日ごとに違う場合は1週間分を合計してください。この補助の入力値はまとめに含めません。", invalid: "日数は0〜7の整数、時間は0〜1,440分で入力してください。",
    profileTitle: "3領域の回答", profileNote: "選んだ回答をそのまま表示します。わからない・答えにくい・未回答を0点や「活動なし」に置き換えません。",
    prompts: { leisure: "どんな活動を、どんな場面でしていますか。続けやすいことや大切にしたいことはありますか。", transport: "普段の移動手段や、その方法を選ぶ理由は何ですか。", sedentary: "どんな場面で、どのくらい座ったり横になったりしていますか。休息として必要な時間も含めて確認します。" },
    nonresponseTitle: "選択できない場合（採点項目への回答とは別に扱います）",
    nonresponses: { unsure: "わからない・区分で迷う", unable: "答えにくい・回答しない" }, unanswered: "未回答", clearAnswer: "選択を解除して未回答に戻す",
    nextContext: "生活の背景を話す", contextTitle: "生活の背景を、一緒に確認する", contextIntro: "点数にかかわらず、実際の場面、制約、支えになっていることを確認します。以下はすべて任意・採点対象外です。話すだけで進めても構いません。",
    modeTitle: "本人と、記録の有無を選んでください", notesMode: "記録してよい内容を確認し、この画面に一時メモする", talkOnly: "話すだけにして、背景・計画の内容は入力しない",
    talkOnlyNote: "背景と計画は画面に記録しません。前に入力した背景・計画がある場合は消えます。3領域の選択済み回答は残ります。",
    contextLabels: { period: "今回話している時期（任意）", sitting: "実際の座位・臥位の場面や時間", demands: "仕事・家事・介護・移動などの事情", healthMobility: "体調・動きやすさ・休息の必要性", environment: "周囲の環境や、難しくしていること", supports: "支えになっていること・使えそうな支援" },
    contextHints: { period: "例：普段の生活、最近の生活の変化など。日付や期間も任意です。", sitting: "いつ、どこで、何をしている時か。区分に入らない実際の時間や、続けて座る状況も話題にできます。", demands: "選びにくい事情や、本人だけでは変えられないことも含めます。", healthMobility: "診断名など詳しい診療情報は不要です。本人が話したい範囲で確認します。", environment: "天候、安全な場所、交通、時間、費用など、本人に関係することを確認します。", supports: "今の習慣を続けられる理由、人や場所などの支援を、個人名なしで確認します。" },
    periodNote: "この時期メモは任意の対話の文脈です。3項目の回答で用いる「過去1週間の平均的な状況」という想起期間は変えません。",
    contextRequired: "メモするか、話すだけにするかを選ぶと次へ進めます。内容の記入は不要です。", nextPlan: "本人と次の一歩を選ぶ", editContext: "背景を見直す", contextReset: "背景のメモを変更しても計画は残ります。次の一歩も本人と確認してください。", answerReset: "回答を変更すると、それまでの背景メモと計画は消えます。本人と順に再確認してください。",
    planTitle: "本人と、次の一歩を選ぶ", planIntro: "取り組む内容を自動で選ぶことはありません。本人が大切にしたいこと、体調、生活の事情を踏まえます。新しく変えないことや、記録しないことも選べます。",
    planChoices: { change: "小さな変更を試す", maintain: "今できていることを続ける", none: "今回は新しい変更を決めない" },
    choose: "本人が選ぶ話題（任意）", otherDomain: "その他・領域をまたぐこと", noPlan: "今回は計画を記録しない・未選択に戻す", action: "本人と選んだこと（任意）", when: "いつ・どこで・無理のない範囲（任意）", support: "支援や、難しいときの別の方法（任意）", review: "振り返る日（任意）",
    personalized: "体調や移動能力に合わせて内容を確認してください。この画面から運動量や支援の優先順位は決めません。",
    reviewNote: "次回は、できたこと、続けやすさ、難しかったことを本人と振り返ります。同じ区分・点数でも、行動や生活の事情が変わることがあります。",
    privacy: "氏名・連絡先など、個人を特定できる情報は入力しないでください。入力はこの画面のメモリ内だけで扱い、自動送信・自動保存しません。再読み込みや「入力をすべて消す」で消えます。",
    consent: "本人と専門職で、使い方と記録してよい範囲を確認してください。健康教室等での収集・研究利用は、この画面とは別に、必要な同意や倫理承認の範囲を確認します。",
    showSummary: "対話のまとめを確認", copy: "まとめをコピー", copied: "コピーしました。クリップボードには内容が残るため、共有先を確認してください。", copyFailed: "コピーできませんでした。印刷 / PDF保存をご利用ください。", edit: "回答を見直す", editPlan: "次の一歩を見直す",
    referenceTitle: "参考：Quick v1.0の合計点を確認", referenceNote: "元のカテゴリ採点を変更せず計算した参考値です。原著WPTIと同一ではありません。健康度の％・臨床閾値・1点刻みの測定精度を意味せず、判断帯や優先順位は付けません。",
    scoreUnavailable: "採点項目への回答がそろっていないため、合計点は計算しません。対話はこのまま進められます。", planReviewPending: "背景のメモ変更後、次の一歩は再確認待ちです。", notRecorded: "背景・計画の記録なし", notEntered: "未記入", summaryTitle: "対話のまとめ", summaryIntro: "本人と、回答・生活の背景・選んだことを確認してください。採点と対話メモは分けて扱います。", exportNote: "コピー・印刷・PDF保存は、この操作をしたときだけ行います。保存先や共有先、本人の同意を確認してください。コピーした内容や保存したファイルは「入力をすべて消す」では消えません。",
    original: "原著をPubMedで読む"
  },
  en: {
    steps: ["Three areas of daily behavior", "Discuss life circumstances", "Choose a next step together"],
    sample: "Try an example", example: "Example only. These are fictional responses.", version: "Scoring: Quick v1.0 / Dialogue: 1.1-prototype / Web: 1.6.1-dialogue-rc.1",
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
      sedentary: "Average daily time sitting or reclining while awake, including work, travel, and home. Exclude sleep. If no category fits, choose ‘Unsure / between categories’ and continue the conversation."
    },
    intervalTitle: "When sitting time falls between categories", intervalNote: "Quick v1.0 does not specify rounding for times such as 3.5, 5.5, or 7.5 hours. This interface does not convert or request rounding to the nearest category. Leave the answer unresolved and discuss the actual situation alongside the responses.",
    calcTitle: "Calculate weekly minutes (optional)", days: "Days per week", minutes: "Total minutes on that day", total: "Weekly total", calcNote: "A recall aid for similar daily amounts; it does not select an answer. If days differ, add the minutes across the week. These helper inputs are not included in the summary.", invalid: "Enter a whole number of days from 0 to 7 and minutes from 0 to 1,440.",
    profileTitle: "Responses across three areas", profileNote: "These are the original selected responses. Unsure, unable to answer, and unanswered entries are never converted to zero points or no activity.",
    prompts: { leisure: "What activities happen in daily life? What helps, or matters to you?", transport: "How do you usually travel, and what shapes those choices?", sedentary: "When and for how long do you sit or recline? Include the time you need for rest." },
    nonresponseTitle: "If you cannot select an option (separate from instrument responses)", nonresponses: { unsure: "Unsure / between categories", unable: "Difficult to answer / prefer not to answer" }, unanswered: "Unanswered", clearAnswer: "Clear this selection and leave unanswered",
    nextContext: "Discuss life circumstances", contextTitle: "Understand life circumstances together", contextIntro: "Whatever the score, discuss actual situations, constraints, and sources of support. Every field is optional and unscored. You can talk without recording any details.",
    modeTitle: "Choose together whether to record notes", notesMode: "Agree what may be recorded and make temporary notes on this page", talkOnly: "Talk only; do not enter context or plan details", talkOnlyNote: "Context and plan details will not be recorded here. Any previous context or plan notes will be erased. Selected responses to the three questions will remain.",
    contextLabels: { period: "Period being discussed (optional)", sitting: "Actual sitting / reclining situations and time", demands: "Work, household, caring, and travel circumstances", healthMobility: "Health, mobility, and need for rest", environment: "Environment and barriers", supports: "What helps / support that may be available" },
    contextHints: { period: "For example: usual routines or recent changes. Dates and a period are optional.", sitting: "When, where, and during what activities? Discuss actual time between categories and uninterrupted periods if useful.", demands: "Include constraints and circumstances that the participant cannot change alone.", healthMobility: "Detailed diagnoses or clinical information are unnecessary. Discuss only what the participant wishes to share.", environment: "Discuss relevant weather, safety, transport, time, or cost constraints.", supports: "Consider what sustains current habits and useful people or places, without entering names." },
    periodNote: "This optional note describes the conversation context. It does not change the three-item response recall period: the average situation during the past 1 week.", contextRequired: "Choose temporary notes or talk only to continue. You do not need to fill in any details.", nextPlan: "Choose a next step together", editContext: "Review circumstances", contextReset: "The plan is kept when context notes change. Review the next step together again.", answerReset: "Changing a response clears previous context notes and plans. Review them again together in order.",
    planTitle: "Choose a next step together", planIntro: "No action is selected automatically. Start with what matters to the participant, health, and life circumstances. Maintaining current habits, making no new change, and leaving notes blank are valid choices.", planChoices: { change: "Try a small change", maintain: "Maintain what is working", none: "Decide on no new change this time" },
    choose: "Participant-selected topic (optional)", otherDomain: "Other / across areas", noPlan: "Do not record a plan / clear the selection", action: "What you chose together (optional)", when: "When / where / a manageable amount (optional)", support: "Support or an alternative if difficult (optional)", review: "Review date (optional)",
    personalized: "Check the plan against health and mobility. This screen does not prescribe an exercise dose or rank support needs.", reviewNote: "Next time, discuss what happened, what was manageable, and what got in the way. Behavior and circumstances can change within the same category or score.",
    privacy: "Do not enter names, contact details, or other personal identifiers. Inputs remain in this page’s memory; they are not automatically sent or saved. Reloading or ‘Clear all inputs’ erases them.", consent: "The participant and professional should agree how to use this tool and what may be recorded. Collection or research use in a health class requires a separate check of consent and any applicable ethics approval.", showSummary: "Review the conversation summary", copy: "Copy summary", copied: "Copied. The clipboard retains the content; check where you share it.", copyFailed: "Copy failed. Please use Print / Save as PDF.", edit: "Review responses", editPlan: "Review next step",
    referenceTitle: "Reference only: view the Quick v1.0 total", referenceNote: "Calculated with the unchanged categorical scoring. It is not equivalent to the original WPTI. It does not represent a health percentage, a clinical threshold, or measurement precision of one point. No decision bands or priorities are assigned.", scoreUnavailable: "Some instrument responses are missing, so no total is calculated. The conversation can continue without a score.", planReviewPending: "The next step is awaiting review after context notes changed.", notRecorded: "No context or plan details recorded", notEntered: "Not entered", summaryTitle: "Conversation summary", summaryIntro: "Check the responses, life circumstances, and choices together. Keep scoring separate from conversation notes.", exportNote: "Copying, printing, or saving as PDF happens only when you choose it. Check the destination, sharing, and participant’s consent. ‘Clear all inputs’ does not erase clipboard content or saved files.", original: "Read the original paper on PubMed"
  }
};
