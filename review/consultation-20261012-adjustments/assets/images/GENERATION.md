# サムネイル編集記録

作成日：2026年10月10日。使用：内蔵 image_gen（imagegen スキル）、text-localization 編集。元のPNGの文字領域だけを編集する指定です。ロゴ、配色、構図、イラストは保持。メイン見出しは約2ポイント大きい見た目を指定しています。編集前ページの画像参照は変更していません。

## horitsu_lp

原画像：https://kagoya-consul.co.jp/cms/wp-content/uploads/2026/01/202601seminar-1.png

編集指示：

```text
Use case: text-localization.
Asset type: existing Japanese seminar thumbnail, text-only update.
Primary request: Edit the supplied image, not redesign it. Change ONLY the seminar title and event date/time. Preserve the original background, illustration, logo, colors, border, layout, and overall aspect ratio. No new photographs, icons, decorations, brand names, or slogans.
New seminar title, exact Japanese text:
「分けられない、売れない、決められない」
「親が認知症になる前に考える不動産相続」
「(弁護士・税理士)」
The first line 「分けられない、売れない、決められない」 must be a little larger than the original main headline — approximately two typographic points (about 7%) larger, not drastically oversized. Keep the original font style, weight and color. Fit all text comfortably within the existing title area, with no clipped glyphs. Use the same existing title panel; the specialist line may sit on a small third line.
New event date, exact text: 「2026年11月6日(金)」
New event time/platform, exact text: 「12:05～12:55(Teams開催)」
Remove all old seminar title text and old dates/times. Copy all Japanese characters exactly; do not add, paraphrase, translate or misspell. Preserve all other existing text and logo lettering unchanged. Produce a clean, flat, sharp ready-to-use raster banner, no mockup, no watermark, opaque background.
Image 1 is the EDIT TARGET. Its original canvas is 886 x 427, a wide horizontal banner. Keep the exact overall aspect ratio. Preserve the yellow エフクリ emblem and black エフクリ セミナー header, the white background with thin dark teal outer border, and the scales-of-justice, books and gavel illustration at bottom-left. Keep the yellow date box at bottom-right. Put the replacement date and time/platform on its existing two rows. Preserve the illustration, logo and shapes exactly; only lettering in the original seminar-title and date-box areas may change.
```

## zeimu_lp

原画像：https://kagoya-consul.co.jp/cms/wp-content/uploads/2025/05/zeimu-202505.png

編集指示：

```text
Use case: text-localization.
Asset type: existing Japanese seminar thumbnail, text-only update.
Primary request: Edit the supplied image, not redesign it. Change ONLY the seminar title and event date/time. Preserve the original background, illustration, logo, colors, border, layout, and overall aspect ratio. No new photographs, icons, decorations, brand names, or slogans.
New seminar title, exact Japanese text:
「分けられない、売れない、決められない」
「親が認知症になる前に考える不動産相続」
「(弁護士・税理士)」
The first line 「分けられない、売れない、決められない」 must be a little larger than the original main headline — approximately two typographic points (about 7%) larger, not drastically oversized. Keep the original font style, weight and color. Fit all text comfortably within the existing title area, with no clipped glyphs. Use the same existing title panel; the specialist line may sit on a small third line.
New event date, exact text: 「2026年11月6日(金)」
New event time/platform, exact text: 「12:05～12:55(Teams開催)」
Remove all old seminar title text and old dates/times. Copy all Japanese characters exactly; do not add, paraphrase, translate or misspell. Preserve all other existing text and logo lettering unchanged. Produce a clean, flat, sharp ready-to-use raster banner, no mockup, no watermark, opaque background.
Image 1 is the EDIT TARGET. Its original canvas is 886 x 441, a wide horizontal banner. Keep the exact overall aspect ratio. Preserve the yellow エフクリ emblem, black エフクリ logo, green 税務相談所 plaque and セミナー header. Preserve the white background with thin dark teal border, and the cartoon yellow-jacketed tax adviser holding the 税金 sign. Keep the yellow strip near the bottom. It should read 「日時：2026年11月6日(金) 12:05～12:55(Teams開催)」, legibly within the strip, widening the text area only if needed; no other content or decorations. Preserve all drawings and the logo exactly; only original title/date lettering may change.
```

## fudosan_lp

原画像：https://kagoya-consul.co.jp/cms/wp-content/uploads/2026/01/202601seminar-2.png

編集指示：

```text
Use case: text-localization.
Asset type: existing Japanese seminar thumbnail, text-only update.
Primary request: Edit the supplied image, not redesign it. Change ONLY the seminar title and event date/time. Preserve the original background, illustration, logo, colors, border, layout, and overall aspect ratio. No new photographs, icons, decorations, brand names, or slogans.
New seminar title, exact Japanese text:
「分けられない、売れない、決められない」
「親が認知症になる前に考える不動産相続」
「(弁護士・税理士)」
The first line 「分けられない、売れない、決められない」 must be a little larger than the original main headline — approximately two typographic points (about 7%) larger, not drastically oversized. Keep the original font style, weight and color. Fit all text comfortably within the existing title area, with no clipped glyphs. Use the same existing title panel; the specialist line may sit on a small third line.
New event date, exact text: 「2026年11月6日(金)」
New event time/platform, exact text: 「12:05～12:55(Teams開催)」
Remove all old seminar title text and old dates/times. Copy all Japanese characters exactly; do not add, paraphrase, translate or misspell. Preserve all other existing text and logo lettering unchanged. Produce a clean, flat, sharp ready-to-use raster banner, no mockup, no watermark, opaque background.
Image 1 is the EDIT TARGET. Its original canvas is 625 x 503, almost-square landscape. Keep the exact overall aspect ratio. Preserve the illustrated finance/real-estate collage background with its house, coins, graphs and teal/coral palette, the エフクリ logo at upper-left, and both existing translucent white horizontal panels. Do not alter any illustration or logo. Put the new seminar title in the upper existing white panel, with the first line only slightly larger (about +2pt / +7%). Put the new date and time/platform on two rows in the lower existing white panel. Preserve the original panels and composition. ONLY title/date lettering changes.
```

## 最終調整

最初の生成結果を目視確認し、法律版の余分な閉じ引用符、税務版の不要な引用符を削除し、見出しの大きさを約2ポイント増の見え方に近づけました。不動産版は最初の編集結果を採用しました。

### horitsu_lp

```text
Use case: text-localization, very small final typography correction. Image 1 is the edited banner and the EDIT TARGET. Image 2 is the original banner, provided ONLY to judge the original headline font size. Keep Image 1 exactly unchanged apart from its FIRST headline line. The first line must read EXACTLY: 分けられない、売れない、決められない . Do not render the period or any quotation marks: NO 「 or 」 around this line. Remove the stray closing quotation mark that is currently after 決められない. Make that first-line type roughly 15% smaller than it currently appears in Image 1, so it is only about two typographic points larger than the original title font in Image 2 at equivalent display width. Keep it centered with comfortable side margins, on one line, and keep its existing font, color and bold weight. Do not change the subtitle, specialist line, date or time, the header/logo, yellow date box, illustration, border, backgrounds, dimensions or composition. In particular retain 親が認知症になる前に考える不動産相続, (弁護士・税理士), 2026年11月6日(金) and 12:05～12:55(Teams開催). This is not a redesign; only the first headline line is corrected.
```

### zeimu_lp

```text
Use case: text-localization, very small final typography correction. Image 1 is the edited banner and the EDIT TARGET. Image 2 is the original banner, provided ONLY to judge the original headline font size. Keep Image 1 exactly unchanged apart from its FIRST headline line. The first line must read EXACTLY: 分けられない、売れない、決められない . Do not render the period or any quotation marks: remove both 「 and 」 currently around this line. Make the first-line type about 7% smaller than it currently appears in Image 1, so it is only about two typographic points larger than the original title font in Image 2 at equivalent display width. Keep it centered on one line and keep its font, color and bold weight. Do not change the subtitle, specialist line, date/time, エフクリ and 税務相談所 logos, yellow date strip, tax adviser illustration, border, dimensions, backgrounds or composition. In particular retain 親が認知症になる前に考える不動産相続, (弁護士・税理士), 2026年11月6日(金) and 12:05～12:55(Teams開催). This is not a redesign; only the first headline line is corrected.
```

## 採用した画像

- 法律相談：`seminar-law-20261106.png`
- 税務相談：`seminar-tax-20261106.png`
- 不動産相談：`seminar-estate-20261106.png`

3枚とも内蔵 image_gen の画像編集モード。元のサムネイルを参照して、色・ロゴ・イラスト・構図を維持する指示で文字を変更しました。画像化された文字なのでフォントの数値を直接指定した原稿ではなく、元画像と見比べた大きさの調整です。

目視確認：テーマ、弁護士・税理士の表記、2026年11月6日(金)、12:05～12:55(Teams開催)が読めること、不要な引用符や古い開催日が残っていないことを確認しました。
