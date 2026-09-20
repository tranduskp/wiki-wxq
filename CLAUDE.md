# wiki_wxq

Vietnamese community wiki for the game 王者万象棋 (wxq). Static HTML/CSS/JS. Product truth is in `PRODUCT.md`, visual system in `DESIGN.md`; `README.md` covers running the site and adding translations.

## Keeping PRODUCT.md current

Whenever the user confirms a decision about the app, update `PRODUCT.md` to match, but ask first.

- **What counts:** confirmed decisions about scope, pages, content or data, translation workflow, terminology, names, approvals or rejections (for example "approved", "use this", "not this"), constraints, and answers to open questions listed in PRODUCT.md.
- **What does not:** visual-only decisions (they belong in `DESIGN.md`), suggestions the user has not confirmed, and purely internal code choices that do not change what the product is or does.
- **How to ask:** once per exchange, after the decisions land, not after every sentence. Name the section that would change and the exact line you would write, then wait for a yes. Use the structured question tool when available.
- **After a yes:** edit the right section of `PRODUCT.md`, and add a dated one-line entry to "Confirmed Decisions" at the end of the file. If a decision closes an item under "Undecided" or a "not yet confirmed" note, remove or rewrite that item.
- **After a no:** leave the file alone and do not ask again about the same decision.
- **Never** record an assumption as confirmed. Keep open questions marked as open. Keep the `impeccable:product-schema` comment untouched.
- If the user says a kind of decision no longer needs asking, follow that and note it here.

## Code structure

JavaScript in `assets/js/` is object-oriented and follows SOLID; keep new code in the same shape. See the "Kiến trúc mã" section of `README.md`.

- One class per file, named like the file. Layers: `core`, `domain` (pure data, no DOM or network), `data` (loading and mapping), `services` (router, search, clipboard...), `ui` (one component per page region), `app` (`WikiApp` coordinates), `main.js` (composition root, the only place that calls `new` on concrete collaborators).
- Depend on contracts, not concretes: collaborators arrive through constructors. Do not reach for `document`, `location` or `fetch` inside `app/` or `domain/`.
- UI components report intent with `Emitter` events; components for different page regions never call each other, `WikiApp` wires them. A component may own its own parts (for example `CardViewer` owns `CardImageFrame`).
- Extend by adding a class or data (a new `ImageUrlPolicy`, a new block in `data/nhom.json`), not by editing branches in existing classes.
- User-facing text written by JS goes in `ui/strings.js`.
