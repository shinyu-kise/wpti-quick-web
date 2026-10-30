export const guidedCopy = {
  ja: {
    title: ["体を動かす時間と、", "座っている時間を", "振り返りましょう。"],
    intro: "この1週間について、3つの質問に答えます。",
    audience: "一人でも、家族や支援者と一緒でも使えます。",
    start: "はじめる", resume: "つづきから", example: "入力例を見る", menu: "メニュー",
    phases: ["3問に答える", "回答を確認する", "ここで終わり"],
    privacy: "入力は送信・自動保存されません。再読み込みで消えます。",
    details: "利用上の注意・採点仕様", question: "質問", next: "次へ", back: "戻る", home: "ホームへ",
    questionTitles: {
      leisure: "自由な時間の運動",
      transport: "歩きや自転車で移動する時間",
      sedentary: "座ったり、横になったりする時間"
    },
    profileTitles: { leisure: "自由な時間の運動", transport: "歩きや自転車での移動", sedentary: "座る・横になる時間（睡眠を除く）" },
    questionUnits: { leisure: "1週間の合計（分）", transport: "1週間の合計（分）", sedentary: "1日あたりの平均（時間）" },
    betweenCategories: "当てはまる時間がなければ「わからない」を選べます。",
    recall: "この1週間の、平均的な様子を思い出してください。", skip: "答えにくい質問は飛ばせます。",
    help: "答え方を確認する", context: "暮らしについてメモする", profile: "選んだ回答",
    plan: "これからやってみたいこと", summary: "まとめを見る", summaryIntro: "回答はこれで終わりです。ここで終了しても大丈夫です。",
    export: "必要な方は、回答やメモをコピー・印刷できます。", citations: "点数の計算方法・参考文献",
    restart: "入力を消してやり直す", returnFlow: "入力に戻る"
  },
  en: {
    title: ["Time moving.", "Time sitting.", "Look back on your week."],
    intro: "Answer three questions about the past week.",
    audience: "Use it on your own, or with a family member or support person.",
    start: "Let’s begin", resume: "Continue", example: "See an example", menu: "Menu",
    phases: ["Answer 3 questions", "Check your responses", "You can finish here"],
    privacy: "Inputs are not sent or saved automatically. Reloading clears them.",
    details: "Use and scoring notes", question: "Question", next: "Next", back: "Back", home: "Home",
    questionTitles: {
      leisure: "Time being physically active during leisure (at least light breathlessness)",
      transport: "Time walking or cycling to get from place to place",
      sedentary: "Time sitting or lying down while awake (excluding sleep)"
    },
    profileTitles: { leisure: "Physical activity during leisure", transport: "Walking or cycling for travel", sedentary: "Sitting or lying down (excluding sleep)" },
    questionUnits: { leisure: "Total minutes per week", transport: "Total minutes per week", sedentary: "Average hours per day" },
    betweenCategories: "If none of the times fit, you can choose ‘Not sure’.",
    recall: "Think about the average situation during the past 1 week.", skip: "You can continue without choosing.",
    help: "What to count / calculation examples", context: "Add notes about daily life", profile: "Your responses",
    plan: "Something you would like to do", summary: "See summary", summaryIntro: "You have finished the questions. You can stop here.",
    export: "You can copy or print your responses and notes if needed.", citations: "Scoring and references",
    restart: "Clear inputs and start again", returnFlow: "Return to your responses"
  }
} as const;
