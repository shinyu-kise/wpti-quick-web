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
  "Kise S. (2026). Operationalizing wellness in physiotherapy: development and validation of a 0-100 wellness physical therapy index from a national population survey. Physiotherapy Theory and Practice. https://doi.org/10.1080/09593985.2026.2621961";

export const copy: Record<Language, AppCopy> = {
  ja: {
    languageName: "日本語",
    nav: {
      home: "ホーム",
      assessment: "評価",
      results: "結果",
      about: "概要",
      howTo: "使い方",
      citation: "引用",
      policy: "ポリシー"
    },
    common: {
      appTitle: "WPTI-Quick Web v1.0",
      start: "評価を開始",
      restart: "もう一度評価する",
      print: "印刷 / PDF保存",
      calculate: "スコアを表示",
      points: "点",
      outOf100: "100点満点"
    },
    home: {
      eyebrow: "WPTI-Quick Web v1.0",
      title: "生活行動の次の対話点を見える化する簡易アウトカム指標",
      body: "WPTI-Quickは、理学療法、公衆衛生、産業保健、地域プログラム、教育、研究での迅速な利用を想定した3項目のブラウザ版ツールです。回答と採点はこのブラウザ内だけで処理されます。"
    },
    assessment: {
      title: "3項目評価",
      intro: "過去1週間の平均的な状況に最も近い選択肢を選んでください。",
      progress: "進捗",
      answered: "回答済み",
      incomplete: "スコア表示には3項目すべてへの回答が必要です。"
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
      "WPTI-Quickのスコアは、個人を分類したり将来のリスクを推定したりするための数値ではありません。現在の生活行動のどこに焦点を当てて話すかを共有するための、対話的なアウトカム指標です。",
    privacyStatement:
      "このWeb版は、個人情報を収集せず、回答内容をサーバーに送信しません。",
    about: {
      title: "概要",
      body: "WPTI-Quick is a brief implementation-oriented derivative of the Wellness Physical Therapy Index, designed for rapid use in clinical practice, research, occupational health, community settings, education, and implementation projects."
    },
    howTo: {
      title: "使い方",
      bullets: [
        "対象者: 成人",
        "想起期間: 過去1週間の平均的な状況",
        "回答方法: 各項目で1つの選択肢を選択",
        "所要時間: 数分",
        "実施形式: 紙または電子フォーム"
      ]
    },
    citation: {
      title: "引用",
      text: citationText
    },
    policy: {
      title: "ポリシー",
      bullets: [
        "WPTI-Quick v1.0 is free to use for clinical, educational, and research purposes.",
        "Do not modify the question wording, response options, or scoring.",
        "Cite the original WPTI article when using WPTI-Quick.",
        "This tool is not intended for diagnosis or ranking individuals."
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
      assessment: "Assessment",
      results: "Results",
      about: "About",
      howTo: "How to use",
      citation: "Citation",
      policy: "Policy"
    },
    common: {
      appTitle: "WPTI-Quick Web v1.0",
      start: "Start assessment",
      restart: "Restart assessment",
      print: "Print / Save as PDF",
      calculate: "Show score",
      points: "points",
      outOf100: "out of 100"
    },
    home: {
      eyebrow: "WPTI-Quick Web v1.0",
      title: "A brief outcome measure for discussing wellness-related movement behavior",
      body: "WPTI-Quick is a 3-item browser-based tool for rapid use in physiotherapy, public health, occupational health, community programs, education, and research. Responses and scoring are processed only in this browser."
    },
    assessment: {
      title: "3-question assessment",
      intro: "Select the option that best reflects the average situation during the past 1 week.",
      progress: "Progress",
      answered: "answered",
      incomplete: "All 3 items are required before the score can be shown."
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
      "The WPTI-Quick score is not intended to classify individuals or estimate future risk. It is a conversation-oriented outcome measure for identifying which aspects of current movement behavior should be discussed next.",
    privacyStatement:
      "This web version does not collect personal information or transmit responses to a server.",
    about: {
      title: "About",
      body: "WPTI-Quick is a brief implementation-oriented derivative of the Wellness Physical Therapy Index, designed for rapid use in clinical practice, research, occupational health, community settings, education, and implementation projects."
    },
    howTo: {
      title: "How to use",
      bullets: [
        "Target users: adults",
        "Recall period: average situation during the past 1 week",
        "Response method: select one option for each item",
        "Completion time: a few minutes",
        "Mode: paper or electronic form"
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
        "Do not modify the question wording, response options, or scoring.",
        "Cite the original WPTI article when using WPTI-Quick.",
        "This tool is not intended for diagnosis or ranking individuals."
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
