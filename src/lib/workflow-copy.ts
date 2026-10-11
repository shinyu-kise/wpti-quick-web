import type { Language, QuestionId } from "./types.ts";

type WorkflowCopy = {
  steps: string[]; sample: string; example: string; version: string;
  boundary: string; evidenceTitle: string; evidence: string[];
  hintTitle: string; hints: Record<QuestionId, string>;
  intervalTitle: string; intervalNote: string;
  calcTitle: string; days: string; minutes: string; total: string; calcNote: string; invalid: string;
  profileTitle: string; profileNote: string; sittingNote: string;
  prompts: Record<QuestionId, string>; maintenance: Record<QuestionId, string>;
  planTitle: string; planIntro: string; choose: string; action: string; when: string; review: string;
  examples: Record<QuestionId, string>; useExample: string; personalized: string;
  actionPlaceholder: string; whenPlaceholder: string; noPlan: string;
  reviewNote: string; privacy: string; copy: string; copied: string; copyFailed: string; edit: string;
  original: string; feedback: string; feedbackNote: string; contact: string;
};

export const workflowCopy: Record<Language, WorkflowCopy> = {
  ja: {
    steps: ["3項目に回答", "行動の内訳を確認", "取り組みを一つ選ぶ"],
    sample: "入力例で試す", example: "入力例です。架空の回答を使っています。", version: "採点：Quick v1.0 ／ 画面・対話支援：Web v1.2-rc.1",
    boundary: "この点数は生活行動を話し合う手がかりです。健康度の％や、WHO身体活動基準の達成を示すものではありません。",
    evidenceTitle: "原著WPTIとQuickの違い・研究でわかっていること",
    evidence: [
      "原著WPTIは、理学療法での行動評価・相談を目指し、余暇活動・移動活動・座位時間をまとめる3領域指標を開発し、初期評価した研究です。日本の成人全国調査で2,966人の得点を算出しました。全国の参照尺度として使えることや、得点に基づく臨床判断の実用準備が完了したことを示すものではありません。",
      "Quick v1.0は、同じ3領域をカテゴリ化して30・30・40点を配点する別の簡易版です。原著の固定採点が再現できることは、Quick独自の妥当性の証明にはなりません。原著の性能値や35点・60点の提案帯も、Quickの判定基準として直接適用できません。",
      "原著はスクリーニングなどへの応用を提案していますが、得点によるスクリーニング、運動量や追跡頻度の決定は、検証済みの用途ではありません。このWeb版は行動の内訳を確認し、本人が次の一歩を選ぶための対話を支えます。その効用は今後の検証課題です。",
      "原著の活動基準との関連は、得点と一部の自己申告入力を共有する標本内の結果です。独立した健康・機能・予後の妥当性を示すものではありません。計算の再現性と測定の信頼性は別であり、高い信頼性や、再検査信頼性・変化への反応性・意味のある変化量は確立していません。",
      "繰り返して使う場合は、点数だけでなく、実際の行動、体調、生活環境を一緒に振り返ってください。点数の増減だけで介入効果や健康の改善を判定することはできません。"
    ],
    hintTitle: "何を数える？",
    hints: {
      leisure: "例：余暇の速歩、運動、スポーツなど。読書・音楽鑑賞など、身体を動かさない余暇活動は含めません。移動目的の歩行・自転車はQ2に分け、同じ時間を二重に数えないでください。",
      transport: "例：通勤・通学・買い物で歩いた時間や自転車に乗った時間。車や電車に乗っている時間は含めません。往復する場合は、両方の時間を合計します。",
      sedentary: "仕事中、車・電車の中、自宅などで、起きて座る・横になる時間の1日平均です。睡眠は除きます。区分の境界付近で迷う場合は、実際の時間を確認してから、最も近い状況を選んでください。"
    },
    intervalTitle: "座位時間が区分の間にあるとき",
    intervalNote: "Quick v1.0では、3.5・5.5・7.5時間などの丸め方を定めていません。このWeb版は時間を自動で区分に変換しません。上の案内に沿って最も近い状況を選び、迷った場合は実際の時間も相談時に確認してください。",
    calcTitle: "週の合計を計算する（任意）", days: "週に何日？", minutes: "その日の合計（分）", total: "週の合計", calcNote: "同じくらいの時間を行う場合の計算補助です。回答は自動で選びません。日ごとに違う場合は1週間分を合計してください。", invalid: "日数は0〜7の整数、時間は0〜1,440分で入力してください。",
    profileTitle: "点数の内訳から、暮らしを振り返る", profileNote: "棒の長さは各項目の配点に対する割合です。健康度や医学的な優先順位を表しません。",
    sittingNote: "座位・臥位は「8時間以上／日」と回答されています。合計点にかかわらず、座る場面や中断できる機会も一緒に確認しましょう。",
    prompts: { leisure: "楽しめそうな運動や、生活の中に入れやすい時間帯はありますか？", transport: "移動の一部に、無理なく歩行や自転車を取り入れられる場面はありますか？", sedentary: "長く座るのはどんな場面ですか？ 姿勢を変えたり、座位を中断したりできる機会はありますか？" },
    maintenance: { leisure: "今続いている活動を支えていることは何ですか？ 忙しい時にも続けられる方法を考えましょう。", transport: "今の移動習慣を続けやすくする工夫はありますか？ 天候や環境が変わる時の選択肢も話題にできます。", sedentary: "現在の生活パターンを確認し、仕事や体調が変わる時にも無理なく続けられる工夫を話し合いましょう。" },
    planTitle: "次に取り組むことを、一つ決める", planIntro: "本人が取り組みやすい項目を選びます。現在の習慣を続ける計画でも構いません。この欄は任意で、スコアに影響しません。",
    choose: "話し合いたい項目", action: "何をする？", when: "いつ・どこで？", review: "振り返る日（任意）",
    examples: { leisure: "無理なく楽しめる運動を一つ選び、試せる時間を決める", transport: "いつもの移動で、歩けそうな区間を一つ探す", sedentary: "長く座る場面を一つ選び、姿勢を変えるきっかけを決める" },
    useExample: "この例を目標欄に入れる", personalized: "例は提案です。体調、移動能力、生活環境に合わせ、本人と専門職で内容を調整してください。",
    actionPlaceholder: "例：昼休みに、無理のない範囲で散歩する", whenPlaceholder: "例：昼食の後、職場の周辺で", noPlan: "今回は記入しない",
    reviewNote: "次回は「何ができたか」「続けやすかったか」「何が難しかったか」を確認します。同じ点数でも、区分の中で行動が変わっていることがあります。",
    privacy: "氏名などの個人情報は入力しないでください。回答・計画はこの画面内だけで扱い、サーバーに送信しません。再読み込みで消えます。残す場合は印刷・PDF保存またはコピーを使ってください。",
    copy: "結果と計画をコピー", copied: "コピーしました", copyFailed: "コピーできませんでした。印刷 / PDF保存をご利用ください。", edit: "回答を見直す",
    original: "原著をPubMedで読む", feedback: "使い方についてのご意見", feedbackNote: "わかりにくかった表現や、使いたい場面をお知らせください。個人の回答や診療情報は送らないでください。", contact: "著者にメールする"
  },
  en: {
    steps: ["Answer 3 questions", "Review your behavior profile", "Choose one next step"],
    sample: "Try an example", example: "Example only. These are fictional responses.", version: "Scoring: Quick v1.0 / Interface & conversation support: Web v1.2-rc.1",
    boundary: "This score supports a conversation about movement behavior. It is not a percentage of health or a determination of WHO physical activity guideline attainment.",
    evidenceTitle: "Original WPTI vs Quick: what the research supports",
    evidence: [
      "The original study developed and initially evaluated a three-domain index of leisure activity, transport activity, and sedentary time for physiotherapy assessment and counselling. Scores were calculated for 2,966 adults from a national survey in Japan. This does not establish a national reference scale or readiness for routine score-based use.",
      "Quick v1.0 is a separate simplified version using categorical scoring, with 30, 30, and 40 points across the same domains. Reproducing the original fixed scoring rule does not validate Quick. The original performance estimates and proposed bands at 35 and 60 do not directly establish decision rules for Quick.",
      "The paper proposes applications including screening, but score-based screening, exercise-dose allocation, and follow-up decisions are not established uses. This web version supports reviewing the behavior profile and choosing a next step together; its added benefit remains to be evaluated.",
      "The original associations with activity criteria are within-sample results that share some self-reported inputs with the score. They do not establish independent validity for health, function, or prognosis. Computational reproducibility differs from measurement reliability; high reliability, test–retest reliability, responsiveness, and meaningful change have not been established.",
      "For repeated use, review actual behavior, health, and life circumstances alongside the score. Score changes alone do not establish intervention effectiveness or improvements in health."
    ],
    hintTitle: "What should I count?",
    hints: {
      leisure: "Examples: brisk leisure walking, exercise, or sport. Do not count inactive leisure such as reading or listening to music. Count walking or cycling for travel in Q2; do not count the same time twice.",
      transport: "Examples: walking or cycling to work, study, or shops. Exclude time riding in a car or train. Include both legs of a return trip.",
      sedentary: "Average daily time sitting or reclining while awake, including work, travel, and home. Exclude sleep. If you are near a category boundary, check your actual time and choose the option that best reflects your situation."
    },
    intervalTitle: "When sitting time falls between categories",
    intervalNote: "Quick v1.0 does not specify rounding for times such as 3.5, 5.5, or 7.5 hours. This web version does not assign categories automatically. Follow the guidance above to choose the closest situation, and discuss the actual time if you are unsure.",
    calcTitle: "Calculate weekly minutes (optional)", days: "Days per week", minutes: "Total minutes on that day", total: "Weekly total", calcNote: "A recall aid for similar daily amounts; it does not select an answer. If days differ, add the minutes across the week.", invalid: "Enter a whole number of days from 0 to 7 and minutes from 0 to 1,440.",
    profileTitle: "Use the breakdown to reflect on daily life", profileNote: "Bars show the proportion of each item's available points, not health percentages or clinical priorities.",
    sittingNote: "You selected ≥8 hours/day sitting or reclining. Whatever the total score, discuss sitting situations and opportunities to interrupt them.",
    prompts: { leisure: "What activity might you enjoy, and when could it fit into your day?", transport: "Could walking or cycling fit comfortably into part of a journey?", sedentary: "When do you sit for long periods? Are there opportunities to change position or interrupt sitting?" },
    maintenance: { leisure: "What helps you keep up your activity? Think about ways to sustain it when life gets busy.", transport: "What supports your current travel habits? Discuss alternatives when the weather or environment changes.", sedentary: "Review your current routine and how to sustain a manageable pattern when work or health circumstances change." },
    planTitle: "Choose one next step", planIntro: "Choose a manageable focus together. Maintaining a current habit is also an option. This section is optional and does not affect the score.",
    choose: "A topic to discuss", action: "What will you do?", when: "When / where?", review: "Review date (optional)",
    examples: { leisure: "Choose one enjoyable, manageable activity and a time to try it", transport: "Find one part of a regular journey that could be walked", sedentary: "Choose one prolonged-sitting situation and a cue to change position" },
    useExample: "Use this example in my plan", personalized: "Examples are suggestions. Adapt the plan together to health, mobility, and circumstances.",
    actionPlaceholder: "Example: take a manageable walk at lunchtime", whenPlaceholder: "Example: after lunch, near work", noPlan: "Leave blank this time",
    reviewNote: "Next time, discuss what happened, what was manageable, and what got in the way. Behavior can change within a response category without changing the score.",
    privacy: "Do not enter names or other personal identifiers. Responses and plans stay on this page and are not sent to a server. Reloading clears them. Print, save as PDF, or copy to keep a record.",
    copy: "Copy result and plan", copied: "Copied", copyFailed: "Copy failed. Please use Print / Save as PDF.", edit: "Review answers",
    original: "Read the original paper on PubMed", feedback: "Feedback on using this tool", feedbackNote: "Tell us which wording was unclear or where you would use this tool. Do not send individual responses or clinical information.", contact: "Email the author"
  }
};
