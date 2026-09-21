# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: the user left the choice to Claude. Node/npm are not installed on the dev machine, so the site is plain static HTML/CSS/vanilla JS (ES modules, data as JSON fetched at runtime; serve over http, e.g. `serve.bat`). Deployable to any static host. Revisit a framework only if a build step becomes worthwhile. Small libraries may be vendored into `assets/vendor/` (no CDN, no build step) when they earn their place; Swiper 11 is used for the Kỳ thủ carousel. No UI framework (React or similar): the site stays plain modules so it needs no build.

## Users

Vietnamese-speaking players of the game 王者万象棋 (the user calls it "wxq"; the official site is https://wxq.qq.com/). The game has no Vietnamese localization, so they read Chinese card text they cannot fully understand. They open the site mid-game or between matches to look up a card, check what is strong right now, or plan a lineup. Public audience; no accounts assumed.

## Product Purpose

A public, community-run Vietnamese wiki for the wxq game. Mission: give players a site where every card in the game is translated into Vietnamese so they can look things up quickly while playing. Success is a player finding and understanding a card, or a current top lineup, in seconds without leaving the game for long.

Surfaces and their status (each is its own page; top navigation, in this order):
- **Tra cứu** (home, `index.html`): built. Card lookup across four types (see Capabilities). Each card has its own shareable link (URL hash).
- **Kỳ thủ** (`ky-thu/`): built. The kỳ thủ (棋手, the player characters), from page 3 of the official site: one profile at a time with skin artwork, quote, abilities (kỹ năng, bí kỹ, chuyên thuộc) and the kỳ thủ's own cards. Each kỳ thủ and skin has a shareable link (URL hash).
- **Đội hình hot** (`doi-hinh/`): placeholder. Continuously updated hot lineups. Waiting on data.
- **Xếp đội hình** (`xep-doi-hinh/`): placeholder. Online lineup builder. Waiting on the game rules from the user.
- **Cập nhật** (`cap-nhat/`): placeholder. News about game updates and patches. Waiting on content from the user.

## Positioning

The Vietnamese-language reference for a game that officially offers none: full card localization plus meta lineups and a lineup builder in one place, made for Vietnamese players.

## Operating Context

Used alongside the game, often on a phone, in short lookups. Content is Vietnamese; source game text is not. Card data, lineups and news need frequent updates after game patches.

## Capabilities and Constraints

- All UI and content in Vietnamese; typography must render Vietnamese diacritics correctly.
- Card lookup with search is core. Search matches Vietnamese name (diacritics optional), Chinese name, and chapter name.
- Four card types, with the group each is browsed by:
  - **Anh Hùng** (85 cards), by khu vực: Đại Hà Lưu Vực, Trục Lộc, Tam Phân Chi Địa, Hà Lạc, Nhật Lạc Hải, Vô Trận Doanh (names approved by the user).
  - **Hiệu Ứng** (98), by bậc 1 to 6.
  - **Thiên Phú** (255), by bậc 1 to 3.
  - **Trang Bị** (73), by nhóm: Cơ bản, Thường, Đặc biệt, Thiên phú (the assistant's proposal; not yet approved by the user).
- Card data lives in `data/bai/<loai>.json` (fields: Chinese name, group, icon URL, one or more card image URLs). The card image itself carries the original Chinese text.
- All 511 cards are translated in `data/dich/<loai>.json` (keyed by the Chinese name; `ten`, `mo_ta`, and `ban` for the text of each further image version), by agents from the text printed on the card images. The translation is not yet reviewed by the site owner; doubts are kept in `ghi_chu` fields. Names of people, heroes and gear are Hán Việt; everyday-word names are translated by meaning. Rules and glossary: `data/dich/README.md`, `data/dich/thuat-ngu.json`. Cards without a translation would show the Chinese name and a "Chưa Việt hóa" state.
- Group labels (khu vực, bậc, nhóm) are configured in `data/nhom.json`.
- Card images are stored locally: all 962 PNGs are downloaded to `data/anh/` by `scripts/tai_anh.py` (about 190 MB; agents find them through `data/anh/manifest.json`), and the site serves lighter webp copies from `data/anh/web/` made by `scripts/tao_anh_web.py`. The Tencent links in `data/bai` stay as the source for re-downloading.
- Anh Hùng and Hiệu Ứng cards carry a small rank-pip badge in the data (1 to 5 pips for heroes, 1 to 6 for effects); it is shown on the tile. Its exact in-game meaning (cost, rarity) is not yet confirmed.
- Some cards have several image versions (a hero and its awakened form, related equipment or tactic cards). The viewer's < > buttons step through the versions of the shown card only, never to another card in the list; other cards are reached through the grid. What each version means in game is confirmed only for heroes (the hero, its awakened form, related cards).
- Each hero also shows a skill tab (skill name, description and the three upgrades unlocked at hero levels 10/40/100) and a stats tab (health, mana, attack, defense, crit, attack speed, range), crawled by `scripts/crawl_anh_hung.py` from page 4 of the official site; the skill translations are in `data/dich/anh-hung.json` (`ky_nang`), made by agents and not yet reviewed.
- **Kỳ thủ** data (19 kỳ thủ, 203 cards of theirs, 38 skins) is crawled by `scripts/crawl_ky_thu.py` from the same endpoints the official page 3 uses (a CMS JSON list and the `lords` part of a card-data script; see the script's docstring). It writes raw references to `data/ref/ky-thu/`, the compact page data to `data/ky-thu.json` and images to `data/anh/ky-thu/`. Translations (all 19 kỳ thủ, their quotes, skins, and 203 cards) are in `data/dich/ky-thu.json`, made by agents from the Chinese text and not yet reviewed by the site owner. Kỳ thủ names are Hán Việt or the familiar transliteration. The meaning of the source's card `kieu`/`chat` numbers and of the ability groups' `cap` is not confirmed, so the page does not show them.
- Terminology: game name "wxq", lineups "đội hình", cards "lá bài", player characters "kỳ thủ".
- Undecided: hosting and deploy target; update workflow for card data after patches; lineup builder rules and persistence/sharing; final wording of the terms.

## Brand Commitments

- Site name: **Vương Giả Vạn Tượng Kỳ Quán** (confirmed by the user).
- Logo: supplied by the user as a poster (`assets/img/source/logo-poster.png`: crimson ground, cream and pink type, a 3D girl with an antler cap, credit "by @finnducway"). The site uses it as a rounded badge crop in the header and favicon. Its crimson, cream and pink are the brand's own colors.
- Binding reference from the user: the style and spirit of the official site https://wxq.qq.com/, specifically page 4, the card compendium (https://wxq.qq.com/cp/a20260707sfgw/index.html#page4), while presenting it as a wiki (different purpose and UX). The card viewer copies that page's 3D sway effect. Visual decisions themselves are recorded in DESIGN.md, not here.
- The site is a community project and must not read as official. Every page has a footer saying it is unofficial and that game images and content belong to Tencent, with the credit "Cre trang web: @finnducway" (confirmed by the user) and a prominent link to the community Facebook page https://www.facebook.com/profile.php?id=61594471854740 (also as an icon in the top bar). Terms wording is still pending.

## Evidence on Hand

- Real card data for all four types in `data/bai/` (511 cards in total, supplied by the user), with icon and card image URLs.
- Vietnamese region names (approved) in `data/nhom.json`. Vietnamese card translations: none yet except two flagged samples.
- The site logo poster from the user (see Brand Commitments).
- Kỳ thủ reference data crawled from the official site (see Capabilities), kept raw in `data/ref/ky-thu/`.
- A lead for lineups, not yet crawled and not verified: the official page's `role.js` also reads `https://game.gtimg.cn/images/amside/ide_timer/598252_oslineupbyrecommend_pro_<page>.js`, which looks like recommended lineups.
- Absent, and must not be fabricated: lineup data, lineup-builder rules, news and patch notes, licensed Tencent assets beyond the card images already downloaded, card stats beyond what the card images show.

## Product Principles

- Lookup speed beats decoration: a player should reach any card or lineup in a couple of taps.
- Vietnamese first: every label, term and card text reads naturally in Vietnamese, with the Chinese original shown beside it.
- Built for mid-game phone use, not just desktop browsing.
- Accuracy and freshness are the trust signal; show when data was last updated once real data exists.
- Stay a community companion to the game, not a claim of being official.

## Confirmed Decisions

Append-only log of decisions the user has confirmed about the app. Update it (after asking) whenever a new app decision is confirmed; see CLAUDE.md.

- 2026-09-20: Site is a public Vietnamese wiki for the wxq game; audience is Vietnamese players; mission is full Vietnamese localization of every card plus lineups and news.
- 2026-09-20: Stack left to Claude; chosen plain static HTML/CSS/JS because Node is not installed.
- 2026-09-20: Pages are separate: Tra cứu (home), Đội hình hot, Xếp đội hình, Cập nhật. Lookup page uses type tabs, a grid of card icons on the left, and the card image on the right; khu vực/bậc are chapters of the grid.
- 2026-09-20: Vietnamese names for the six khu vực approved. Lineup rules and news content will be supplied by the user later.
- 2026-09-20: Card images are hotlinked from the source rather than stored; translations will be supplied later and kept in `data/dich/`.
- 2026-09-20: Site name "Vương Giả Vạn Tượng Kỳ Quán" confirmed.
- 2026-09-20: Logo is the user-supplied poster (@finnducway), used as a rounded badge. Design reference is page 4 (card compendium) of wxq.qq.com, including its swaying 3D card.
- 2026-09-21: Card images are downloaded and stored in the project (`data/anh/`) and the site serves them from there; this replaces the 2026-09-20 decision to hotlink.
- 2026-09-21: All cards are translated from the images by agents, with Hán Việt for names of people, heroes and gear, and per-version text where a card has several images. Pending the site owner's review.
- 2026-09-21: A Kỳ thủ page is added (from page 3 of the official site) as the second top-level page, after Tra cứu; its data is crawled by script for reference and the page is built from it.
- 2026-09-21: Libraries are allowed for the Kỳ thủ page; Swiper is vendored, React is not used.
- 2026-09-22: The hero card viewer gets Skill and Stats tabs, and the < > buttons switch between the versions of the same card (hero and awakened hero), not to the next card in the list.
- 2026-09-22: Every page gets a footer with the unofficial notice, the credit "Cre trang web: @finnducway" and a prominent link to the community Facebook page (also an icon in the top bar).
