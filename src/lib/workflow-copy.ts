import type { ContextField, Nonresponse, PlanChoice } from "./dialogue.ts";
import type { Language, QuestionId } from "./types.ts";

type WorkflowCopy = {
  steps: string[]; sample: string; example: string; version: string;
  boundary: string; reflection: string; evidenceTitle: string; evidence: string[];
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
    sample: "入力例で試す", example: "入力例です。架空の回答を使っています。", version: "採点：Quick v1.0 ／ 対話支援：1.5-prototype ／ Web：1.9.2-dialogue-rc.1",
    boundary: "点数は、この1週間の「動く・座る」を振り返る目安です。",
    reflection: "いつもの暮らしを思い浮かべて、これからも続けたいこと、またできたらうれしいことはありますか？",
    evidenceTitle: "原著WPTIとQuickの採点",
    evidence: [
      "Quickは原著WPTIの3つの領域を受け継ぎ、回答を区分して採点します。配点は余暇の活動30点、移動30点、座る時間40点です。",
      "原著の判定区分や研究結果はQuickの点数には適用しません。"
    ],
    hints: {
      leisure: "例：仕事の後や休日の速歩き、ダンス、ジョギング、スポーツなど。少し息が弾む程度以上の活動を数えます。通勤や買い物のための歩き・自転車は、2問目に入れてください。",
      transport: "例：通勤・通学・買い物で歩いた時間や自転車に乗った時間。車や電車に乗っている時間は含めません。往復する場合は、両方の時間を合計します。",
      sedentary: "デスクワーク、車・電車での移動、自宅での休憩など、座ったり横になったりした時間を数えます。眠っていた時間は入れません。当てはまる時間がなければ「わからない」を選べます。"
    },
    intervalTitle: "当てはまる時間がないとき",
    intervalNote: "例えば3時間半・5時間半・7時間半は、選択肢の間になります。近い時間を無理に選ばず、「わからない」を選んでください。Quick v1.0には、この間の時間をどちらに入れるかという決まりはありません。",
    calcTitle: "1週間の合計を計算する", days: "週に何日？", minutes: "1日何分？", total: "1週間の合計", calcNote: "毎回ほぼ同じ時間なら、この計算が使えます。日によって違う場合は、7日分を足してください。計算後は、自分で回答を選びます。この計算欄は、まとめには残りません。", invalid: "日数は0〜7日（小数なし）、時間は0〜1,440分で入力してください。",
    profileTitle: "選んだ回答", profileNote: "選んだ内容をそのまま表示します。「わからない」「答えない」や未回答は、0点や「活動していない」とは扱いません。",
    prompts: { leisure: "自由な時間には、どんなことで体を動かしていますか。続けたいことはありますか。", transport: "普段はどうやって出かけていますか。", sedentary: "どんなときに座ったり横になったりしていますか。必要な休息も含めて考えましょう。" },
    nonresponseTitle: "答えが決まらない・答えたくないとき",
    nonresponses: { unsure: "わからない", unable: "答えない" }, unanswered: "未回答", clearAnswer: "選択を取り消す",
    nextContext: "暮らしについて話す", contextTitle: "暮らしについてメモする", contextIntro: "書きたいところだけで大丈夫です。メモは点数に影響しません。",
    modeTitle: "メモを使いますか？", notesMode: "この画面にメモする", talkOnly: "書かずに、考えたり話したりする",
    talkOnlyNote: "前に書いた暮らしのメモと、やってみたいことのメモは消えます。3問の回答は残ります。",
    contextLabels: { period: "いつごろの話？（任意）", sitting: "座ったり横になったりするのは、どんなとき？", demands: "仕事・家事・育児・介護などで忙しいことは？", healthMobility: "体調や体の動きで気になることは？", environment: "場所や交通などで困ることは？", supports: "役に立っていることや、頼れる人は？" },
    contextHints: { period: "例：普段の生活、最近変わったこと。日付は書かなくても大丈夫です。", sitting: "例：テレビを見るとき、仕事中、休むとき。実際の時間も書けます。", demands: "自分だけでは変えられない事情も書けます。", healthMobility: "詳しい病名は不要です。休息が必要なことなど、書ける範囲で大丈夫です。", environment: "例：雨が多い、歩ける場所がない、時間や費用が足りない。", supports: "例：一緒に歩く人、近くの公園。個人の名前は書かないでください。" },
    periodNote: "メモに別の時期を書いても、3問で答える期間は「この1週間」のままです。",
    contextRequired: "メモするか、話すだけにするかを選んでください。何も書かなくても進めます。", nextPlan: "やってみたいことを選ぶ", editContext: "暮らしのメモを見直す", contextReset: "ここを変えても、先に書いたメモは残ります。必要に応じて見直してください。", answerReset: "回答を変えても、メモは残ります。今の内容に合っているか確認してください。",
    planTitle: "メモ", planIntro: "体調や暮らしに合わせて選んでください。今の習慣を続けたり、今は決めなかったりしても大丈夫です。",
    planChoices: { change: "やってみたいことを決める", maintain: "今の習慣を続ける", none: "今は決めない" },
    choose: "何について？（任意）", otherDomain: "その他・いくつかに関係すること", noPlan: "選択とメモを取り消す", action: "気づいたこと・やってみたいこと", when: "いつ・どこで・どのくらい？（任意）", support: "手伝ってほしいこと・難しいときの工夫（任意）", review: "後で振り返る日（任意）",
    personalized: "体調に合わせて、無理なくできることを選んでください。この画面では、必要な運動量や支援の順番は決めません。",
    reviewNote: "後で、できたことや難しかったことを振り返りましょう。暮らしが変わっても、点数が変わらない場合があります。",
    privacy: "氏名や連絡先は入力しないでください。入力は送信・自動保存されず、再読み込みやリセットで消えます。",
    consent: "誰かと使うときは、何を記録してよいか本人と確認してください。研究や健康教室で回答を集めるときは、必要な同意と倫理承認の範囲を別途確認してください。",
    showSummary: "回答とメモを見る", copy: "まとめをコピー", copied: "コピーしました。貼り付ける場所を確認してください。", copyFailed: "コピーできませんでした。印刷 / PDF保存をご利用ください。", edit: "回答を直す", editPlan: "選んだ行動を見直す",
    referenceTitle: "合計点を見る（参考）", referenceNote: "Quickの合計点は、3つの回答に応じた配点を足したものです。採点方法は原著WPTIと異なります。",
    scoreUnavailable: "3問すべての時間が選ばれていないため、合計点は出しません。", planReviewPending: "回答や暮らしのメモを変更しました。今の内容に合っているか、メモを確認してください。", notRecorded: "暮らしや行動のメモなし", notEntered: "未記入", summaryTitle: "回答とメモ", summaryIntro: "回答とメモの内容を確認してください。誰かと使う場合は一緒に確認します。メモは点数に影響しません。", exportNote: "コピーや印刷は、ボタンを押したときだけ行います。保存先や共有する相手を確認してください。誰かの回答を保存・共有する場合は、本人の了解を得てください。コピーした内容や保存したファイルは、画面の入力を消しても残ります。",
    original: "原著をPubMedで読む"
  },
  en: {
    steps: ["Three areas of daily behavior", "Discuss life circumstances", "Choose a next step"],
    sample: "Try an example", example: "Example only. These are fictional responses.", version: "Scoring: Quick v1.0 / Dialogue: 1.5-prototype / Web: 1.9.2-dialogue-rc.1",
    boundary: "The scores are a guide to reflecting on when you moved and when you sat this past week.",
    reflection: "Thinking about your daily life, what would you like to keep doing, or be able to enjoy again?",
    evidenceTitle: "How the original WPTI and Quick are scored",
    evidence: [
      "Quick uses the same three areas as the original WPTI and assigns points by response category: up to 30 for leisure activity, 30 for travel, and 40 for sitting time.",
      "The original study’s proposed score bands and performance estimates do not apply to Quick scores."
    ],
    hints: {
      leisure: "Examples: brisk walking, dancing, jogging, or sport after work or on days off, involving at least light breathlessness. Do not count inactive leisure. Count walking or cycling for travel in Q2; do not count the same time twice.",
      transport: "Examples: walking or cycling to work, study, or shops. Exclude time riding in a car or train. Include both legs of a return trip.",
      sedentary: "Average daily time sitting or reclining while awake, including desk work, car or train travel, and rest at home. Exclude sleep. If no category fits, choose ‘Not sure’ and continue the conversation."
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
    planTitle: "Notes", planIntro: "Choose what fits your health and daily life. You can keep your current habits or decide later.", planChoices: { change: "Choose something to try", maintain: "Keep my current habits", none: "Decide later" },
    choose: "What is it about? (optional)", otherDomain: "Other / more than one area", noPlan: "Clear this choice and its notes", action: "What you noticed or would like to do", when: "When / where / how much? (optional)", support: "Help or an alternative if difficult (optional)", review: "A date to look back (optional)",
    personalized: "Check the plan against health and mobility. This screen does not prescribe an exercise dose or rank support needs.", reviewNote: "Next time, discuss what happened, what was manageable, and what got in the way. Behavior and circumstances can change within the same category or score.",
    privacy: "Leave out names and contact details. Entries are not sent or saved automatically. Reloading or resetting clears them.", consent: "When using Quick with someone else, agree what you may record. Before collecting responses in a health class or study, check the consent needed and the scope of any ethics approval.", showSummary: "Review the conversation summary", copy: "Copy summary", copied: "Copied. The clipboard retains the content; check where you share it.", copyFailed: "Copy failed. Please use Print / Save as PDF.", edit: "Review responses", editPlan: "Review next step",
    referenceTitle: "Reference only: view the Quick v1.0 total", referenceNote: "The Quick total adds the points for your three responses. Its scoring method differs from the original WPTI.", scoreUnavailable: "Some instrument responses are missing, so no total is calculated. The conversation can continue without a score.", planReviewPending: "Responses or context notes have changed. The retained next step is awaiting review.", notRecorded: "No context or plan details recorded", notEntered: "Not entered", summaryTitle: "Conversation summary", summaryIntro: "Check the responses, life circumstances, and choices, together if using this with someone else. Keep scoring separate from notes.", exportNote: "Copying, printing, or saving as PDF happens only when you choose it. Check the destination and sharing. Get the person’s agreement before handling their record. ‘Clear all inputs’ does not erase clipboard content or saved files.", original: "Read the original paper on PubMed"
  }
};
