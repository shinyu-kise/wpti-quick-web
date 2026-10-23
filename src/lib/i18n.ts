import type { Language, OptionId, QuestionId, ScoreBand } from "./types.ts";

export type QuestionCopy = {
  id: QuestionId;
  title: string;
  options: Array<{
    id: OptionId;
    label: string;
  }>;
};

type AppCopy = {
  languageName: string;
  nav: Record<"home" | "assessment" | "results" | "about" | "howTo" | "citation" | "policy", string>;
  common: {
    appTitle: string;
    start: string;
    restart: string;
    print: string;
    calculate: string;
    points: string;
    outOf100: string;
  };
  home: {
    eyebrow: string;
    title: string;
    body: string;
  };
  assessment: {
    title: string;
    intro: string;
    recallPeriod: string;
    progress: string;
    answered: string;
    incomplete: string;
  };
  results: {
    title: string;
    totalScore: string;
    scoreRange: string;
    interpretation: string;
    domainBreakdown: string;
    scoreComposition: string;
    discussionFocus: string;
    focusExplanationSingle: string;
    focusExplanationMultiple: string;
    visualGauge: string;
    noResult: string;
    date: string;
    printableSummary: string;
  };
  domainLabels: Record<QuestionId, string>;
  scoreBands: Record<ScoreBand, string>;
  interpretations: Record<ScoreBand, string>;
  importantStatement: string;
  privacyStatement: string;
  about: {
    title: string;
    body: string;
  };
  howTo: {
    title: string;
    bullets: string[];
  };
  citation: {
    title: string;
    text: string;
  };
  policy: {
    title: string;
    bullets: string[];
  };
  questions: QuestionCopy[];
};

const citationText =
  "Kise S. (2026). Operationalizing wellness in physiotherapy: development and validation of a 0-100 wellness physical therapy index from a national population survey. Physiotherapy Theory and Practice. 42(9):1171–1180. https://doi.org/10.1080/09593985.2026.2621961";

export const copy: Record<Language, AppCopy> = {
  ja: {
    languageName: "日本語",
    nav: {
      home: "ホーム",
      assessment: "生活行動",
      results: "まとめ",
      about: "概要",
      howTo: "使い方",
      citation: "引用",
      policy: "ポリシー"
    },
    common: {
      appTitle: "WPTI-Quick Web v1.4.0-dialogue-rc.1",
      start: "生活行動から話し始める",
      restart: "入力をすべて消す",
      print: "印刷 / PDF保存",
      calculate: "生活の背景を話す",
      points: "点",
      outOf100: "100点満点"
    },
    home: {
      eyebrow: "WPTI-Quick Web v1.4.0-dialogue-rc.1",
      title: "動く・移動する・座る。暮らしを振り返り、次の一歩へ。",
      body: "余暇・移動における身体活動と座位時間を、3つの質問で確認します。本人と理学療法士などの専門職が一緒に生活を振り返り、取り組みやすい行動を選ぶためのツールです。"
    },
    assessment: {
      title: "3領域の生活行動を確認する",
      intro: "過去1週間の平均的な状況について、回答できる項目を選んでください。迷う場合や答えにくい場合は保留できます。未回答のままでも、生活の背景を話す画面へ進めます。",
      recallPeriod: "Quick v1.0の回答の想起期間：過去1週間の平均的な状況",
      progress: "進捗",
      answered: "回答済み",
      incomplete: "未回答や保留があっても、対話に進めます。参考点は全項目に回答した場合だけ計算します。"
    },
    results: {
      title: "結果",
      totalScore: "合計スコア",
      scoreRange: "スコア範囲",
      interpretation: "解釈",
      domainBreakdown: "領域別スコア",
      scoreComposition: "あなたのスコア構成",
      discussionFocus: "現在、話題にしやすい項目：",
      focusExplanationSingle:
        "この項目は、今回の回答の中で相対的にスコアが低い項目です。生活行動を振り返る際の話題として活用できます。",
      focusExplanationMultiple:
        "これらの項目は、今回の回答の中で相対的にスコアが低い項目です。生活行動を振り返る際の話題として活用できます。",
      visualGauge: "0から100の視覚ゲージ",
      noResult: "まだ結果はありません。評価を完了してください。",
      date: "日付",
      printableSummary: "印刷用サマリー"
    },
    domainLabels: {
      leisure: "余暇・運動での身体活動",
      transport: "移動に伴う身体活動",
      sedentary: "座位・臥位行動"
    },
    scoreBands: {
      low: "0–34点",
      middle: "35–59点",
      high: "60点以上"
    },
    interpretations: {
      low: "行動の選択肢を広げる話題にしやすい段階",
      middle: "改善余地のある行動が特定しやすい段階",
      high: "維持や生活環境変化への備えを話題にしやすい段階"
    },
    importantStatement:
      "Quickは原著とは別の簡易採点です。点数だけで支援の必要性や介入効果を判断せず、行動の内訳・体調・生活環境と一緒に確認してください。",
    privacyStatement:
      "回答・背景・計画はこの画面のメモリ内だけで扱い、自動送信・自動保存しません。氏名など個人を特定できる情報は入力しないでください。",
    about: {
      title: "概要",
      body: "原著WPTIは、理学療法での行動評価・相談を目指した3領域指標の開発と初期評価の段階にあります。Quickは同じ3領域を別のカテゴリ式採点で扱い、成人の生活行動について対話するための簡易版です。このWeb版はQuick v1.0の質問・選択肢・配点と既存の想起期間を保ち、生活背景の確認と本人による選択を、別の対話支援として提供します。"
    },
    howTo: {
      title: "使い方",
      bullets: [
        "対象者: 成人",
        "3項目の想起期間：過去1週間の平均的な状況。背景欄の時期メモは別の任意記録であり、この想起期間を変えません。",
        "回答できる項目を選びます。わからない・答えにくい・未回答のままでも対話できます。",
        "本人と専門職で、3領域の回答と生活の背景を順に確認し、次の一歩を選びます。維持や新しく変えない選択もできます。",
        "背景・計画は話すだけで記録しない方法も選べます。記録を残す場合は同意を確認し、まとめをコピー・印刷・PDF保存します。再読み込みやリセットで画面の入力は消えます。"
      ]
    },
    citation: {
      title: "引用",
      text: citationText
    },
    policy: {
      title: "ポリシー",
      bullets: [
        "WPTI-Quick v1.0は、臨床・教育・研究目的で無料で利用できます。",
        "質問文・選択肢・配点はQuick v1.0を保持しています。利用者が独自に改変して同じ版として使用することはできません。",
        "利用時には原著WPTI論文を引用し、使用したQuickの版とWeb版を記載してください。",
        "診断、個人の優劣付け、疾病リスクの推定を目的としません。",
        "対話支援1.0-prototypeの保留状態・生活背景・計画はQuick v1.0の採点対象外です。研究利用では必要な同意・倫理承認範囲を別に確認してください。"
      ]
    },
    questions: [
      {
        id: "leisure",
        title: "余暇・運動での身体活動（息が少し弾む程度以上の運動）",
        options: [
          { id: "leisure_0_30", label: "0–30 分／週" },
          { id: "leisure_31_90", label: "31–90 分／週" },
          { id: "leisure_91_150", label: "91–150 分／週" },
          { id: "leisure_151_plus", label: "151 分以上／週" }
        ]
      },
      {
        id: "transport",
        title: "移動に伴う身体活動（歩行・自転車による移動）",
        options: [
          { id: "transport_0_30", label: "0–30 分／週" },
          { id: "transport_31_90", label: "31–90 分／週" },
          { id: "transport_91_150", label: "91–150 分／週" },
          { id: "transport_151_plus", label: "151 分以上／週" }
        ]
      },
      {
        id: "sedentary",
        title: "覚醒時の座位・臥位時間（睡眠を除く）",
        options: [
          { id: "sedentary_8_plus", label: "8 時間以上／日" },
          { id: "sedentary_6_7", label: "6–7 時間／日" },
          { id: "sedentary_4_5", label: "4–5 時間／日" },
          { id: "sedentary_3_or_less", label: "3 時間以下／日" }
        ]
      }
    ]
  },
  en: {
    languageName: "English",
    nav: {
      home: "Home",
      assessment: "Daily behavior",
      results: "Summary",
      about: "About",
      howTo: "How to use",
      citation: "Citation",
      policy: "Policy"
    },
    common: {
      appTitle: "WPTI-Quick Web v1.4.0-dialogue-rc.1",
      start: "Start with daily behavior",
      restart: "Clear all inputs",
      print: "Print / Save as PDF",
      calculate: "Discuss life circumstances",
      points: "points",
      outOf100: "out of 100"
    },
    home: {
      eyebrow: "WPTI-Quick Web v1.4.0-dialogue-rc.1",
      title: "Move, travel, sit. Reflect on daily life. Choose a next step.",
      body: "Explore leisure and transport activity and sedentary time with three questions. Use the results together with a physiotherapist or other professional to reflect on daily life and choose a manageable next step."
    },
    assessment: {
      title: "Explore three areas of daily behavior",
      intro: "Consider the average situation during the past 1 week and select responses where you can. If unsure or unable to answer, leave an item unresolved. You can continue to discuss life circumstances with unanswered items.",
      recallPeriod: "Quick v1.0 response recall period: average situation during the past 1 week",
      progress: "Progress",
      answered: "answered",
      incomplete: "You can continue the conversation with unanswered or unresolved items. A reference total is calculated only with all instrument responses."
    },
    results: {
      title: "Results",
      totalScore: "Total score",
      scoreRange: "Score range",
      interpretation: "Interpretation",
      domainBreakdown: "Domain score breakdown",
      scoreComposition: "Score composition",
      discussionFocus: "Current discussion focus:",
      focusExplanationSingle:
        "This item had a relatively lower score in your current responses. It may be useful as a starting point for reflecting on daily movement behavior.",
      focusExplanationMultiple:
        "These items had relatively lower scores in your current responses. They may be useful as starting points for reflecting on daily movement behavior.",
      visualGauge: "Visual score gauge from 0 to 100",
      noResult: "No result yet. Complete the assessment first.",
      date: "Date",
      printableSummary: "Printable summary"
    },
    domainLabels: {
      leisure: "Leisure-time / exercise physical activity",
      transport: "Transport-related physical activity",
      sedentary: "Sedentary or reclining behavior"
    },
    scoreBands: {
      low: "0–34 points",
      middle: "35–59 points",
      high: "60 points or higher"
    },
    interpretations: {
      low: "A stage where discussion can focus on expanding options for daily movement behavior.",
      middle: "A stage where modifiable behaviors can be identified more concretely.",
      high: "A stage where discussion can focus on maintenance and preparation for changes in life context."
    },
    importantStatement:
      "Quick uses a simplified scoring method separate from the original WPTI. Review the behavior profile, health, and life circumstances together; the score alone does not determine support needs or intervention benefit.",
    privacyStatement:
      "Responses, context, and plans stay in this page’s memory without automatic transmission or saving. Do not enter personal identifiers.",
    about: {
      title: "About",
      body: "The original WPTI is at the stage of development and initial evaluation as a three-domain index for physiotherapy assessment and counselling. Quick is a simplified version with separate categorical scoring across the same domains, intended for conversations about movement behavior in adults. This web version preserves Quick v1.0 questions, options, and points and provides a separate dialogue process for life circumstances and participant-selected next steps."
    },
    howTo: {
      title: "How to use",
      bullets: [
        "Target users: adults",
        "Recall period for the three items: average situation during the past 1 week. The optional context-period note is separate and does not change this recall period.",
        "Select responses where possible. Unsure, unable to answer, and unanswered items do not prevent a conversation.",
        "Review the responses and life circumstances in order, then choose a next step together. Maintaining habits or making no new change are valid choices.",
        "You can talk without recording context or plan details. If keeping a record is agreed, copy, print, or save the summary as PDF. Reloading or resetting clears page inputs."
      ]
    },
    citation: {
      title: "Citation",
      text: citationText
    },
    policy: {
      title: "Policy",
      bullets: [
        "WPTI-Quick v1.0 is free to use for clinical, educational, and research purposes.",
        "Quick v1.0 questions, response options, and points are preserved. Do not label modified questions, response options, or points as Quick v1.0.",
        "Cite the original WPTI article and state both the Quick instrument version and the Web version used.",
        "This tool is not intended for diagnosis, ranking individuals, or estimating disease risk.",
        "Dialogue 1.0-prototype nonresponse states, context, and plans are not scored by Quick v1.0. Check consent and applicable ethics approval separately for research use."
      ]
    },
    questions: [
      {
        id: "leisure",
        title: "Leisure/exercise physical activity involving at least light breathlessness",
        options: [
          { id: "leisure_0_30", label: "0–30 min/week" },
          { id: "leisure_31_90", label: "31–90 min/week" },
          { id: "leisure_91_150", label: "91–150 min/week" },
          { id: "leisure_151_plus", label: "≥151 min/week" }
        ]
      },
      {
        id: "transport",
        title: "Transport-related physical activity such as walking or cycling",
        options: [
          { id: "transport_0_30", label: "0–30 min/week" },
          { id: "transport_31_90", label: "31–90 min/week" },
          { id: "transport_91_150", label: "91–150 min/week" },
          { id: "transport_151_plus", label: "≥151 min/week" }
        ]
      },
      {
        id: "sedentary",
        title: "Sedentary or reclining time while awake, excluding sleep",
        options: [
          { id: "sedentary_8_plus", label: "≥8 hours/day" },
          { id: "sedentary_6_7", label: "6–7 hours/day" },
          { id: "sedentary_4_5", label: "4–5 hours/day" },
          { id: "sedentary_3_or_less", label: "≤3 hours/day" }
        ]
      }
    ]
  }
};
