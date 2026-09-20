---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: Tra cứu (index.html)

Scope: home page of the wxq Vietnamese wiki. Visitor mode: Operate (lookup task, often one-handed on a phone mid-game).

## Audience and job
Vietnamese players of 王者万象棋. They open a card's page to read what it does. Success: find and understand a card within seconds.

## Chosen structure: "Chương Khu Vực"
Four type tabs (Anh Hùng, Hiệu Ứng, Thiên Phú, Trang Bị). Icon grid split into chapters (khu vực / bậc / nhóm) with sticky chapter headings and a jump rail. Right column holds the card, Vietnamese name, Chinese name, chapter and translation. Đội hình hot, Xếp đội hình and Cập nhật are separate pages in the top nav.

## Visual authority
Pinned by the user to the official wxq.qq.com compendium page (https://wxq.qq.com/cp/a20260707sfgw/index.html#page4): cool dusk-blue glass, not a black vault. The first build read as monotone and generic, so this direction replaces it (revision 2). Logo pinned by the user: assets/img/source/logo-poster.png (crimson ground, cream and pink type, 3D girl with antler cap), cropped to a rounded badge.

## Content and ranges
Real data in data/bai/*.json: 85 / 98 / 255 / 73 cards; chapters of 7 to 118 cards. Images hotlinked from Tencent CDN with CDN thumbnails. Vietnamese translations are added later in data/dich/*.json; until then the page shows Chinese names and a clear "chưa Việt hóa" state.

## Direction contract

THESIS: A card compendium that carries the official page's air: a periwinkle dusk with vertical light streaks, glass panels, small framed portrait tiles, and one card that floats and sways in 3D. It refuses the black-vault-with-gold and the generic dark dashboard.

OWN-WORLD: Dusk gradient from deep navy (#0f1436) to periwinkle (#7d8fcb) with a fine vertical-streak curtain texture; navy glass panels with light hairlines; one accent, periwinkle (#99b4fe to white) for selection, active tab and glow. Logo colors (crimson #8b1229, cream, pink) live only in the brand badge and the script flourish. Anton caps for headings, Lobster script for the flourish (echoing the logo's heavy-caps plus script pairing), Chakra Petch for tiny English captions and numerals, Be Vietnam Pro for all text. Angular glass tab slabs with a cut corner, radio-dot filters, portrait tiles about 64px wide in thin light frames.

STORY: The visitor feels they are in the game's own compendium, finds a card fast among small tiles, and reads its Vietnamese name and text beside a card that sways like on the official site.

FIRST VIEWPORT: Desktop: transparent header with the rounded logo badge, the name in caps plus script, and nav items with tiny English captions and a light bar on the current one. Below: a heavy italic caps title "Tra cứu" with a script "lá bài" flourish at left, four glass slab tabs with icons in the middle, a pill search at right. Then three glass panels: a chapter rail with radio dots, the icon grid with sticky chapter heads, and at right a stage where the card sways (rotateY plus or minus 10 degrees, perspective 1200px, 25s cycle) over a soft backlight, with name, version dots and description beneath. Mobile: brand and search, slab tabs, chapter chips, 4-column tiles, bottom glass nav, card opens as a glass bottom sheet.

FORM: Chương Khu Vực, dealt second in the re-rolled hand, seed key 36b8392e.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
