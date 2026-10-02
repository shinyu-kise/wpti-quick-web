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
  "Kise S. (2026). Operationalizing wellness in physiotherapy: development and validation of a 0-100 wellness physical therapy index from a national population survey. Physiotherapy Theory and Practice. 42(9):1171–1180. https://doi.org/10.1080/09593985.2026.2621961";

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
      appTitle: "WPTI-Quick Web v1.1",
      start: "評価を開始",
      restart: "新しく回答する",
      print: "印刷 / PDF保存",
      calculate: "スコアを表示",
      points: "点",
      outOf100: "100点満点"
    },
    home: {
      eyebrow: "WPTI-Quick Web v1.1",
      title: "動く・移動する・座る。暮らしを振り返り、次の一歩へ。",
      body: "余暇・移動における身体活動と座位時間を、3つの質問で確認します。本人と理学療法士などの専門職が一緒に生活を振り返り、取り組みやすい行動を選ぶためのツールです。"
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
      "WPTI-Quickのスコアは、個人を分類したり将来のリスクを推定したりするための数値ではありません。原著とは異なる簡易採点であり、原著の判定性能や閾値を直接適用できません。点数の変化だけで介入効果や健康の改善を判定せず、実際の行動や体調と一緒に確認してください。",
    privacyStatement:
      "回答・行動計画はブラウザ内で処理し、サーバーには送信しません。サイトのアクセス状況はVercel Analyticsで集計します。",
    about: {
      title: "概要",
      body: "WPTI-Quickは、原著WPTIと同じ3領域を、別のカテゴリ式採点で扱う簡易版です。成人の生活行動について対話するための利用を想定しています。このWeb版はQuick v1.0の質問・選択肢・配点を保ち、回答補助と任意の行動計画を追加しています。"
    },
    howTo: {
      title: "使い方",
      bullets: [
        "対象者: 成人",
        "想起期間: 過去1週間の平均的な状況",
        "回答方法: 各項目で1つの選択肢を選択",
        "本人と専門職で回答の内訳を確認し、取り組むことを一つ選びます。",
        "結果と計画はコピー・印刷・PDF保存できます。再読み込みすると入力内容は消えます。"
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
        "Web v1.1の回答補助・行動計画は採点対象外です。"
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
      appTitle: "WPTI-Quick Web v1.1",
      start: "Start assessment",
      restart: "Restart assessment",
      print: "Print / Save as PDF",
      calculate: "Show score",
      points: "points",
      outOf100: "out of 100"
    },
    home: {
      eyebrow: "WPTI-Quick Web v1.1",
      title: "Move, travel, sit. Reflect on daily life. Choose a next step.",
      body: "Explore leisure and transport activity and sedentary time with three questions. Use the results together with a physiotherapist or other professional to reflect on daily life and choose a manageable next step."
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
      "The WPTI-Quick score is not intended to classify individuals or estimate future risk. It uses a different, simplified scoring method; the original WPTI’s accuracy and thresholds do not directly apply. Score changes alone do not establish intervention benefit or better health; review actual behavior and health circumstances too.",
    privacyStatement:
      "Responses and action plans are processed in the browser and are not sent to a server. Site visits are measured with Vercel Analytics.",
    about: {
      title: "About",
      body: "WPTI-Quick is a simplified derivative using separate categorical scoring across the original WPTI’s three domains. It is intended to support conversations about movement behavior in adults. This web version preserves Quick v1.0 questions, options, and points while adding recall aids and an optional action plan."
    },
    howTo: {
      title: "How to use",
      bullets: [
        "Target users: adults",
        "Recall period: average situation during the past 1 week",
        "Response method: select one option for each item",
        "Review the behavior profile together and choose one manageable action.",
        "Copy, print, or save the result and plan as PDF. Reloading clears entries."
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
