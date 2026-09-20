---
name: Vương Giả Vạn Tượng Kỳ Quán (wxq wiki)
description: A periwinkle-dusk card compendium seen through navy glass, with one periwinkle accent, built as a fast Vietnamese lookup tool for 王者万象棋 players.
colors:
  sky-navy: "#161e56"
  sky-deep: "#34438a"
  sky-mid: "#6274bb"
  sky-pale: "#98a9e2"
  sky-mist: "#d6e2ff"
  ground: "#141b3d"
  glass-navy: "rgba(17, 24, 62, 0.45)"
  glass-strong: "rgba(15, 21, 56, 0.9)"
  glass-soft: "rgba(255, 255, 255, 0.08)"
  glass-line: "rgba(170, 188, 255, 0.28)"
  glass-line-strong: "rgba(200, 214, 255, 0.55)"
  text: "#f5f7ff"
  text-2: "#dfe3f2"
  text-3: "#cdd5f0"
  accent-hi: "#dfe8ff"
  accent: "#99b4fe"
  accent-lo: "#6f8cf0"
  accent-deep: "#34478f"
  accent-wash: "rgba(153, 180, 254, 0.18)"
  brand-crimson: "#8b1229"
  brand-cream: "#f4e9d6"
  brand-pink: "#f08fb0"
typography:
  page-title:
    fontFamily: "Anton, Be Vietnam Pro, Arial Narrow, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0.02em"
  card-name:
    fontFamily: "Anton, Be Vietnam Pro, Arial Narrow, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.04em"
  chapter:
    fontFamily: "Anton, Be Vietnam Pro, Arial Narrow, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "0.05em"
  brand:
    fontFamily: "Anton, Be Vietnam Pro, Arial Narrow, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "0.07em"
  flourish:
    fontFamily: "Lobster, Brush Script MT, cursive"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: "Be Vietnam Pro, system-ui, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  body-reading:
    fontFamily: "Be Vietnam Pro, system-ui, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Be Vietnam Pro, system-ui, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.15
  small:
    fontFamily: "Be Vietnam Pro, system-ui, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  numeral:
    fontFamily: "Chakra Petch, Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.5
    fontFeature: "tabular-nums"
  caption:
    fontFamily: "Chakra Petch, Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.16em"
  name-zh:
    fontFamily: "Noto Sans SC, PingFang SC, Microsoft YaHei, Hiragino Sans GB, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  sm: "8px"
  md: "12px"
  lg: "18px"
  sheet: "22px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "22px"
  pad: "28px"
  pad-mobile: "14px"
components:
  nav-link:
    textColor: "{colors.text-2}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 16px 8px 20px"
  nav-link-current:
    textColor: "#ffffff"
  tab:
    backgroundColor: "rgba(255, 255, 255, 0.1)"
    textColor: "{colors.text-2}"
    typography: "{typography.label}"
    width: "176px"
    height: "58px"
    padding: "0 22px 0 16px"
  tab-selected:
    backgroundColor: "#b7cbff"
    textColor: "{colors.accent-deep}"
  search:
    backgroundColor: "rgba(17, 24, 62, 0.55)"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 44px 0 46px"
  panel:
    backgroundColor: "{colors.glass-navy}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
  panel-sheet:
    backgroundColor: "{colors.glass-strong}"
    rounded: "{rounded.sheet}"
  rail-button:
    textColor: "{colors.text-2}"
    typography: "{typography.small}"
    rounded: "10px"
    padding: "9px 10px"
  rail-button-current:
    backgroundColor: "{colors.accent-wash}"
    textColor: "#ffffff"
  tile-frame:
    backgroundColor: "{colors.accent}"
    rounded: "{rounded.md}"
    width: "64px"
    padding: "2px"
  icon-button:
    backgroundColor: "rgba(255, 255, 255, 0.1)"
    textColor: "{colors.text-2}"
    rounded: "{rounded.md}"
    size: "40px"
  pill:
    backgroundColor: "rgba(255, 255, 255, 0.06)"
    textColor: "{colors.text-2}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "3px 11px"
  card-frame:
    rounded: "10px"
    width: "330px"
---

# Design System: Vương Giả Vạn Tượng Kỳ Quán (wxq wiki)

## Overview

**Creative North Star: "The Dusk Compendium"**

The interface is a periwinkle dusk seen through navy glass. The sky runs from deep navy at the top to pale periwinkle low on the right, with a fine vertical-streak curtain over it, recreating the blurred background of the official wxq.qq.com compendium page. Everything a visitor reads or touches is a navy glass panel with a light hairline laid over that sky. The one object that is allowed to glow is the card itself: it floats in front of a periwinkle backlight and sways in 3D as it does on the official site.

The voice is game-native and quick: heavy Anton caps for titles, a Lobster script flourish that echoes the logo's caps-plus-script pairing, tiny Chakra Petch captions and numerals, and Be Vietnam Pro for all reading. Density is high but small: portrait tiles about 64px wide in thin light frames, tight rails, one detail column. The interface has exactly one accent, periwinkle. The logo's own crimson, cream and pink belong to the brand alone and appear only in the header badge and the script flourish.

This system rejects the black-vault-with-gold it replaced and the generic dark dashboard. There is no gold anywhere in the shipped code.

**Key Characteristics:**
- A dusk gradient sky with a vertical-streak curtain, fixed behind everything; content sits on navy glass, never on flat black.
- One interface accent (periwinkle #99b4fe, often as a white-to-periwinkle gradient); crimson, cream and pink are brand-only.
- Angular glass slab tabs with a cut corner; the selected tab turns to bright glass.
- Radio-dot chapter rail, sticky chapter heads with a diamond and a fading rule.
- Portrait tiles in a thin light frame with corner brackets and a "seat" motion when selected.
- A 3D-swaying card stage (perspective 1200px, rotateY plus or minus 10deg, 25s cycle) over a static backlight.
- Mobile: bottom glass nav and a glass bottom sheet for the card.

## Colors

A cool navy-to-periwinkle dusk with one periwinkle accent; every neutral leans blue and none is gray.

### Primary
- **Dusk Periwinkle** (`accent`, #99b4fe): the single interface accent. Selection, the current-page caption, radio dots, rail heading, focus-adjacent glow, scrollbar thumb tint. Often used as the gradient `linear-gradient(150deg, #f4f7ff 0%, #99b4fe 46%, #6f8cf0 100%)` on diamonds, the selected tile frame, and the mobile nav bar.
- **Periwinkle Mist** (`accent-hi`, #dfe8ff): focus rings (2px, 2px offset), corner brackets, description headings, the copied-link check.
- **Periwinkle Deep** (`accent-lo` #6f8cf0, `accent-deep` #34478f): `accent-lo` ends the accent gradient and the chapter rule fade; `accent-deep` is the text color on the bright selected tab and the ink on the skip link.
- **Accent Wash** (`accent-wash`, rgba 153 180 254 / 0.18): the current rail entry background.

### Secondary (brand only)
- **Logo Crimson** (`brand-crimson`, #8b1229): the brand badge's ground and the 2px underlay shadow beneath script flourishes.
- **Logo Cream** (`brand-cream`, #f4e9d6): the script flourish text (brand subtitle, page title accent).
- **Logo Pink** (`brand-pink`, #f08fb0): declared as the logo's third color; the badge image carries it. Not used in interface controls.

### Neutral
- **Sky Navy** (`sky-navy`, #161e56): top of the sky gradient.
- **Sky Deep** (`sky-deep`, #34438a): sky at 12%.
- **Sky Mid** (`sky-mid`, #6274bb): sky at 32%.
- **Sky Pale** (`sky-pale`, #98a9e2): sky at the bottom edge. `sky-mist` (#d6e2ff) is the low-right bloom.
- **Ground** (`ground`, #141b3d): solid fallback behind the sky, and the theme-color.
- **Glass Navy** (`glass-navy`, rgba 17 24 62 / 0.45): base panel fill. Work panels use gradients that darken toward the bottom (see Named Rules).
- **Glass Strong** (`glass-strong`, rgba 15 21 56 / 0.9): the mobile bottom nav and the bottom sheet, where nothing may show through.
- **Glass Soft** (`glass-soft`, white / 0.08): hover fill on nav links, rail buttons and the search clear.
- **Glass Line** (`glass-line` rgba 170 188 255 / 0.28) and **Glass Line Strong** (`glass-line-strong` rgba 200 214 255 / 0.55): panel hairlines and stronger dividers, dashed empty states, the sheet grab handle.
- **Text** (`text` #f5f7ff), **Text 2** (`text-2` #dfe3f2), **Text 3** (`text-3` #cdd5f0): primary, secondary, tertiary. All three were lightened during the build so small text clears contrast on the bright bottom of the sky.

### Named Rules
**The One Interface Accent Rule.** Periwinkle is the only accent the interface uses. Selection, current page, active tab glow and focus all speak periwinkle.

**The Brand Colors Stay Home Rule.** Crimson, cream and pink live only in the brand badge and the script flourish. They never color a button, link, chip or state.

**The Scrim Toward the Sky Rule.** The sky gets brighter toward the bottom, so text panels darken that way: the list panel runs 0.26 to 0.5 navy, the detail panel 0.36 to 0.56. Any new panel that carries text over the sky follows the same direction.

**The Blue-Leaning Neutral Rule.** Every text and surface neutral carries blue. No gray.

## Typography

**Display Font:** Anton (with Be Vietnam Pro, Arial Narrow, sans-serif)
**Flourish Font:** Lobster (with Brush Script MT, cursive)
**Body Font:** Be Vietnam Pro (with system-ui, Segoe UI, sans-serif)
**Label/Numeral Font:** Chakra Petch (with Be Vietnam Pro, system-ui, sans-serif)
**CJK Font:** Noto Sans SC (with PingFang SC, Microsoft YaHei, Hiragino Sans GB, sans-serif)

**Character:** Heavy condensed caps with a script flourish, as in the logo, over a clean Vietnamese-capable text face. Chakra Petch supplies the small technical voice for numerals and English captions. Fonts load from Google Fonts with `display=swap`.

### Hierarchy
- **Page Title** (Anton 400, 2.75rem, 1.15, 0.02em, uppercase, italic): "Tra cứu" on the home page and each secondary page h1 (2.1rem on phones). Anton ships no italic, so the slant is browser-synthesized. It carries a two-part shadow (0 3px 0 rgb(15 21 56 / 0.4) plus a soft 12px). On the home page a Lobster flourish (1.75rem, cream, rotated -7deg) sits over its corner; below 1400px wide the home title collapses to screen-reader-only.
- **Card Name** (Anton 400, 1.75rem, 1.2, 0.04em, uppercase, balanced wrap): the Vietnamese name in the card stage. When the name is Chinese (`is-zh`) it switches to the CJK stack at 700, 1.375rem, no case change.
- **Chapter Head** (Anton 400, 1.5rem, 1.25, 0.05em, uppercase; 1.3rem on phones): sticky chapter headings in the list.
- **Brand** (Anton 400, 1.2rem, 0.07em, uppercase) over a Lobster subtitle (1.05rem, cream, crimson underlay shadow): the header wordmark; 1rem and 0.95rem on phones.
- **Body** (Be Vietnam Pro 400, 0.9375rem, 1.5): default UI text. **Reading** text (card descriptions) uses line-height 1.65, `text-wrap: pretty`, capped at 65ch.
- **Label** (Be Vietnam Pro 600, 0.9375rem tabs; 0.875rem nav): tab names, nav labels. **Small** (0.8125rem, and 0.75rem for tile names and pills): rails, status, meta.
- **Numeral** (Chakra Petch 600, 0.8125rem, tabular-nums): counts on tabs, rail entries and chapter heads.
- **Caption** (Chakra Petch 600, 0.625rem, uppercase, tracked 0.1em on tabs and 0.16em on nav and the rail heading): the tiny English captions ("Compendium", "Lineup", "Builder", "News", and per-tab captions). Decorative and aria-hidden.
- **Chinese name** (Noto Sans SC 400, 0.9375rem under the card name; 0.8125rem on tiles): always the CJK stack, never the display face.

### Named Rules
**The Anton Plus Script Rule.** Anton caps carry every heading and the card name; the Lobster script appears only as a flourish over or beside an Anton line, never as running text.

**The Numbers Are Chakra Rule.** Counts and numerals use Chakra Petch with tabular figures.

## Layout

Desktop is a fixed-height app shell (`100dvh`): a 72px transparent topbar, a toolbar, then a three-column workspace of glass panels: chapter rail (188px), list (flexible), card detail (380px), with 16px between panels and 28px page padding. Panel outer rhythm is 14px top, 22px bottom.

The toolbar puts the page title at left, the four slab tabs (176px by 58px, 4px apart) in the middle and a pill search (max 320px, 44px tall) pushed right. The list's tile grid is `auto-fill` at minimum 88px columns, 20px row gap and 4px column gap, with tiles capped at 92px wide. Chapter heads are sticky at the top of the list. Secondary pages use a centered 960px column with the same header.

Responsive steps are three:
- **Under 1400px:** the home page title steps aside (visually hidden, still the h1).
- **Under 1180px:** detail narrows to 340px, tab icons hide, and the rail becomes a horizontal strip of pill-shaped chapter chips above the list.
- **Under 820px (phones):** page padding 14px, header 58px, bottom glass nav (60px, four columns, icons at 22px, English captions hidden), full-width slab tabs 52px tall, 76px minimum tile columns with 58px frames, and the detail becomes a bottom sheet (max 90dvh, 22px top radius, grab handle, dimmed scrim rgb 6 10 34 / 0.7). Touch targets rise to 44px.

## Elevation & Depth

Depth here is layered glass, not shadow. Three planes stack: the fixed sky, navy glass panels (backdrop blur 6px with saturation 1.2, 1px light hairline), and the card, which is the only thing that floats. Shadows are soft, navy-tinted and reserved for the things that lift: the selected tile, the card, the brand badge.

### Shadow Vocabulary
- **Card lift** (`filter: drop-shadow(0 22px 22px rgb(4 8 34 / 0.5))`): on the swaying card, static while it moves. A floor ellipse (radial navy to transparent, 64% wide, 22px tall) sits under it.
- **Card backlight** (`radial-gradient(closest-side, rgb(153 180 254 / 0.5), rgb(153 180 254 / 0.14) 55%, transparent 74%)`, 118% of the stage width): the periwinkle glow behind the card. Static.
- **Seated tile** (`box-shadow: 0 10px 20px rgb(4 8 34 / 0.5)`): selected portrait tile.
- **Brand badge** (`0 0 0 1.5px rgb(255 255 255 / 0.55), 0 6px 16px rgb(4 8 34 / 0.45)`): white hairline ring plus a soft drop.
- **Title shadows** (soft `0 12px 24px rgb(4 8 34 / 0.4)` on titles, `0 2px 12px` on the wordmark): text lift over the bright sky.

### Named Rules
**The Glass, Not Black Rule.** Surfaces are translucent navy over the dusk. A solid near-black panel is out of world; the only near-opaque surfaces are the mobile nav and bottom sheet (0.9), where legibility outranks transparency.

**The Only The Card Floats Rule.** The card is the one object with a real drop shadow and glow. Other surfaces stay on the glass plane.

## Shapes

Softly rounded glass with a few angular cuts. Panels use 18px, controls 12px, small controls 8px and 10px, search and pills are full pills (999px), the sheet rounds 22px on top. The signature angular form is the tab slab: a rectangle with a 12px chamfer on the bottom-right (`clip-path`) and a 2px light top edge. Tiles are a 12px thin light frame (2px, white to periwinkle to white gradient) around a 10px-rounded portrait (3:4; 1:1 for icon kinds). Small 45-degree diamonds (7px on the rail heading, 9px on chapter heads) lead headings. The card image itself has a 10px radius. The brand badge is a 14px rounded square (12px on phones).

## Components

### Navigation (top nav)
Transparent over the sky. Each link pairs a 14px Be Vietnam Pro label (600) with a tiny English Chakra Petch caption beneath (0.625rem, white at 0.7). Hover fills `glass-soft`. The current page turns white with a periwinkle caption and a 3px by 30px light bar at its left edge (white to periwinkle gradient). On phones the nav becomes a fixed bottom glass bar (blur 16px, 1px top hairline): icon above label, captions hidden, the current item in periwinkle with a 28px by 3px gradient bar at the top edge.

### Tabs (glass slabs)
Four slabs (Anh Hùng, Hiệu Ứng, Thiên Phú, Trang Bị), each with a 24px line icon at left, a Vietnamese name over an English caption, and the count at right in Chakra Petch. Idle: white 0.16 to 0.05 gradient glass, 2px top edge at white 0.4, text-2. Hover: brighter glass and white text. Selected: bright glass (115deg #eef3ff to #b7cbff to #dde7ff), white top edge, all text turns `accent-deep`. Focus is an inset 2px `accent-hi` ring.

### Search
A pill: navy glass at 0.55 with blur 10px, 1px `glass-line`, a 18px search icon inside left, and a clear button that appears with a value. Hover strengthens the border; focus adds a 2px `accent-hi` outline and a periwinkle border. The caret is periwinkle.

### Glass Panels (rail, list, detail)
18px radius, 1px `glass-line`, a top-to-bottom navy gradient scrim, backdrop blur 6px. The detail panel is slightly darker at the top than the list.

### Chapter Rail
A periwinkle Chakra Petch heading with a diamond, then radio-dot entries: a 15px ring in `rgb(170 188 255 / 0.65)`, a label, and a count. The current entry fills the dot (periwinkle radial), takes `accent-wash`, goes white and bold, and its count turns periwinkle. Disabled entries sit at 0.4 opacity. Under 1180px the rail becomes a row of bordered pills.

### Portrait Tile
A 64px thin light frame with corner-bracketed selection. Hover lifts 3px and the frame brightens (white to periwinkle). Selected: the frame becomes the periwinkle gradient, gains the seated shadow, plays a 320ms "seat" scale-in (0.92 to 1) with four 10px corner brackets in `accent-hi` at 6px outside, animating from 14px out. Loading tiles shimmer; broken images show the Chinese character. A small rank badge (18px image from the data, top-left inside the frame, 16px on phones) marks rank; there are no CSS-drawn pips. Names sit beneath in 0.75rem, two lines clamped; Chinese names use the CJK stack at 0.8125rem.

### Card Stage
The card sits in a `perspective: 1200px` stage. It sways `rotateY` 0, -10deg, +10deg over a 25s cycle (10% steps), with a static drop shadow and backlight. Its width is `clamp(220px, (100dvh - 470px) * 0.708, 330px)` at aspect 400:565. On card change the frame plays a 360ms settle (translate 10px up and scale 0.965 to rest); images fade in over 240ms. Version dots below are 26px by 9px white bars that clip to dots, the current one a full pill. Reduced motion disables the sway.

### Buttons and Chips
Icon buttons (40px, 44px on phones) and text buttons share one recipe: white 0.1 fill, 1px `glass-line`, 12px radius, text-2. Hover brightens the fill to 0.18, the border goes periwinkle and the text white. The copy-link button flips to a check and a periwinkle border when done. Meta pills are 12px text, white 0.06 fill, `glass-line` border; pending Vietnamese state uses a dashed border.

### Empty and Waiting States
A 1px dashed `glass-line-strong` border, 12px to 18px radius, on glass. Used for "chưa Việt hóa"-style states and the three pages waiting for content.

## Do's and Don'ts

### Do:
- **Do** build every surface as translucent navy glass over the dusk, with a 1px `glass-line` hairline.
- **Do** use periwinkle (#99b4fe, or its white-to-periwinkle gradient) as the only interface accent.
- **Do** keep the crimson, cream and pink to the brand badge and the script flourish.
- **Do** darken text-bearing panels toward the bottom (the sky brightens there) and keep the text tokens at #f5f7ff, #dfe3f2 and #cdd5f0 or lighter.
- **Do** set headings in Anton caps, add a Lobster flourish only beside an Anton line, and set numerals in Chakra Petch tabular figures.
- **Do** give Chinese names the Noto Sans SC stack.
- **Do** mark the current item with a light bar and keep the 2px `accent-hi` focus ring on every focusable control.
- **Do** honor `prefers-reduced-motion`: the sway stops and transitions collapse.

### Don't:
- **Don't** reintroduce gold or violet; that was the previous system and none of it remains in the code.
- **Don't** use a solid black or near-black panel over the sky; the mobile nav and sheet at 0.9 navy are the ceiling.
- **Don't** use gray text; every neutral leans blue.
- **Don't** color controls, links or states with crimson, cream or pink.
- **Don't** animate anything but the card's sway on a loop; the backlight and drop shadow stay static.
- **Don't** extend the English captions to new elements: they exist only on the nav items and tabs, decoratively, and stay `aria-hidden`.
- **Don't** add a second accent hue.

## Exceptions and Carried Drift

Recorded so the next surface does not inherit them by accident.

- **Sanctioned radial gradients.** The sky blooms (three radial gradients in `body::before`) recreate the official blurred background, and the card backlight is a radial gradient the user explicitly allowed. They are the only radial glows in the system.
- **Decorative English captions.** Tab and nav captions carry no meaning, are `aria-hidden`, and are 0.625rem: acceptable only because the Vietnamese label beside them says the same thing.
- **Carried defects, not rules.** The title and flourish text-shadows include zero-blur offset extrusions (`0 3px 0`, `0 2px 0`); they echo the logo's 3D lettering but are not a pattern for other elements. A source comment in `assets/js/ui/CardImageFrame.js` still says "gold frame".
