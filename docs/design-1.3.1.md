# Web 1.3.1 — 暮らしの振り返りを支える画面デザイン

2026-10-23。Web 1.3.0-dialogue-rc.1 の機能を保ち、画面の見た目を更新する。

## Canvaで確認した参考デザイン

- [Health & Wellness Event Website in Olive Green Cream Lime Green Vibrant Elegant Style](https://www.canva.com/templates/EAFw0BuHLzw-health-wellness-event-website-in-olive-green-cream-lime-green-vibrant-elegant-style/): 生成りとオリーブの配色、読み物のような見出し、余白の取り方を参考にした。
- [Green White Minimalist Self-Reflection Planner](https://www.canva.com/templates/EAHJVjFrELY-green-white-minimalist-self-reflection-planner/): 振り返り手帳の罫線と、記入しやすい整理を参考にした。

Canvaの公開プレビューを参照した。テンプレートのファイル、写真、素材、HTMLを取得・転載していない。アプリ向けのレイアウトと暮らしのSVGイラストは独自実装。Canva上の編集可能なデザインを作成したものではない。

## 変更範囲

生成りの背景、濃緑の文字、テラコッタの主ボタン、主見出しの明朝体、罫線で区切る入力・回答表示に変更。ホームを説明とイラストの2列にし、狭い画面では操作ボタンを先に置いた1列表示とした。日本語・英語の両方に対応する。

質問、回答選択肢、想起期間、採点、非回答の扱い、対話状態、科学的説明、プライバシー処理は維持する。Web版番号のみ1.3.1-dialogue-rc.1へ更新し、Quick v1.0 と Dialogue v1.0-prototype は変えない。

追加CSSはすべて画面表示用の `@media screen` 内に置く。既存印刷CSSと要約構造を保持し、ホームの装飾イラストは印刷対象外とする。Web版番号は画面・コピー・印刷で一致させる。

## 復元点

- 直前の公開版：`acd646b253e673301e7ad6ac837e3706d0568de6`、保存ブランチ `archive/web-v1.3.0-dialogue-rc.1-20261023`
- 査読用の旧公開版：`d470d06d836e529db96fd4d77ce4aaa0a02e6fce`、保存ブランチ `archive/web-v1.2-rc.1-review-20261023`

どちらも今回のデザイン変更から独立して復元できる。アプリの改良は過去の論文の数値を修正するものではない。
