export const guidedCopy = {
  ja: {
    title: ["動く。移動する。座る。", "いつもの暮らしを、", "次の一歩へ。"],
    intro: "3問に答えて、いつもの行動を振り返る。気づいたことから、自分に合う次の一歩を考えましょう。",
    audience: "一人で振り返るときも、理学療法士などの支援者と一緒に話すときも使えます。",
    start: "はじめる", resume: "つづきから", example: "入力例を見る", menu: "メニュー",
    phases: ["ふり返る", "考える", "選ぶ"],
    privacy: "入力は送信・自動保存されません。再読み込みで消えます。",
    details: "利用上の注意・採点仕様", question: "質問", next: "次へ", back: "戻る", home: "ホームへ",
    questionTitles: {
      leisure: "余暇に体を動かす時間（息が少し弾む程度以上）",
      transport: "歩き・自転車で移動する時間",
      sedentary: "起きている間に座る・横になる時間（睡眠を除く）"
    },
    profileTitles: { leisure: "余暇に体を動かす時間", transport: "歩き・自転車での移動", sedentary: "座る・横になる時間（睡眠を除く）" },
    questionUnits: { leisure: "1週間の合計（分）", transport: "1週間の合計（分）", sedentary: "1日あたりの平均（時間）" },
    betweenCategories: "3.5・5.5・7.5時間など、区分の間なら「わからない・区分で迷う」を選べます。近い区分に丸める必要はありません。",
    recall: "過去1週間の平均的な状況で、選んでください。", skip: "選ばなくても進めます。",
    help: "答えに迷ったときは", context: "いつもの暮らしを、もう少し。", profile: "3つの回答を確認する",
    plan: "次は、どうしてみたい？", summary: "まとめを見る", summaryIntro: "気づいたことから、次の一歩を考えましょう。生活背景や計画のメモは任意です。",
    export: "保存・共有する内容と相手を確認してください。誰かと使う場合は、本人の了解を得てください。", citations: "採点仕様・引用",
    restart: "入力を消してやり直す", returnFlow: "入力に戻る"
  },
  en: {
    title: ["Move. Travel. Sit.", "Your daily life.", "Your next step."],
    intro: "Answer three questions, reflect on your daily habits, and consider a next step that fits your life.",
    audience: "Use it on your own, or together with a physiotherapist or another support person.",
    start: "Let’s begin", resume: "Continue", example: "See an example", menu: "Menu",
    phases: ["Reflect", "Consider", "Choose"],
    privacy: "Inputs are not sent or saved automatically. Reloading clears them.",
    details: "Use and scoring notes", question: "Question", next: "Next", back: "Back", home: "Home",
    questionTitles: {
      leisure: "Time being physically active during leisure (at least light breathlessness)",
      transport: "Time walking or cycling to get from place to place",
      sedentary: "Time sitting or lying down while awake (excluding sleep)"
    },
    profileTitles: { leisure: "Physical activity during leisure", transport: "Walking or cycling for travel", sedentary: "Sitting or lying down (excluding sleep)" },
    questionUnits: { leisure: "Total minutes per week", transport: "Total minutes per week", sedentary: "Average hours per day" },
    betweenCategories: "For times between categories, such as 3.5, 5.5, or 7.5 hours, choose ‘Unsure / between categories’. You do not need to round to a nearby category.",
    recall: "Think about the average situation during the past 1 week.", skip: "You can continue without choosing.",
    help: "Need help choosing?", context: "A little more about daily life.", profile: "Review your three responses",
    plan: "What feels right for you next?", summary: "See summary", summaryIntro: "Consider what you notice and what might come next. Context and next-step notes are optional.",
    export: "Check what to save or share, and with whom. If using this with someone else, get their agreement first.", citations: "Scoring and citation",
    restart: "Clear inputs and start again", returnFlow: "Return to your responses"
  }
} as const;
