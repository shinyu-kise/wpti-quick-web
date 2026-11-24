export const guidedCopy = {
  ja: {
    title: ["この1週間、", "どんなときに動き、", "どんなときに座っていましたか？"],
    intro: "自由な時間に体を動かしたこと、歩きや自転車で移動したこと、座って過ごした時間。3つの質問で、いつもの暮らしを振り返ります。",
    start: "3つの質問に答える", resume: "つづきから", example: "入力例を見る", menu: "メニュー",
    phases: ["3つの質問", "結果", "行動例"],
    privacy: "入力は送信・自動保存されません。再読み込みで消えます。",
    details: "採点方法・研究利用について", question: "質問", next: "次へ", back: "戻る", home: "ホームへ",
    questionTitles: {
      leisure: "余暇・運動での身体活動",
      transport: "歩きや自転車で移動する時間",
      sedentary: "座ったり、横になったりする時間"
    },
    profileTitles: { leisure: "余暇・運動での身体活動", transport: "歩きや自転車での移動", sedentary: "座る・横になる時間（睡眠を除く）" },
    questionUnits: { leisure: "1週間の合計（分）", transport: "1週間の合計（分）", sedentary: "1日あたりの平均（時間）" },
    betweenCategories: "当てはまる時間がなければ「わからない」を選べます。",
    recall: "この1週間の、平均的な様子を思い出してください。", skip: "答えにくい質問は飛ばせます。",
    help: "答え方を確認する", context: "暮らしについてメモする", profile: "選んだ回答",
    plan: "これからやってみたいこと", summary: "まとめを見る",
    export: "必要な方は、回答やメモをコピー・印刷できます。", citations: "点数の計算方法・参考文献",
    restart: "入力を消してやり直す", returnFlow: "入力に戻る"
  },
  en: {
    title: ["This past week, ", "when were you moving ", "and when were you sitting?"],
    intro: "Think about being active in your free time, walking or cycling to get somewhere, and the time you spent sitting. Three questions help you look back on everyday life.",
    start: "Answer three questions", resume: "Continue", example: "See an example", menu: "Menu",
    phases: ["3 questions", "Results", "Activity ideas"],
    privacy: "Inputs are not sent or saved automatically. Reloading clears them.",
    details: "Scoring and research use", question: "Question", next: "Next", back: "Back", home: "Home",
    questionTitles: {
      leisure: "Leisure and exercise physical activity",
      transport: "Time walking or cycling to get from place to place",
      sedentary: "Time sitting or lying down while awake (excluding sleep)"
    },
    profileTitles: { leisure: "Leisure and exercise physical activity", transport: "Walking or cycling for travel", sedentary: "Sitting or lying down (excluding sleep)" },
    questionUnits: { leisure: "Total minutes per week", transport: "Total minutes per week", sedentary: "Average hours per day" },
    betweenCategories: "If none of the times fit, you can choose ‘Not sure’.",
    recall: "Think about the average situation during the past 1 week.", skip: "You can continue without choosing.",
    help: "What to count / calculation examples", context: "Add notes about daily life", profile: "Your responses",
    plan: "Something you would like to do", summary: "See summary",
    export: "You can copy or print your responses and notes if needed.", citations: "Scoring and references",
    restart: "Clear inputs and start again", returnFlow: "Return to your responses"
  }
} as const;
