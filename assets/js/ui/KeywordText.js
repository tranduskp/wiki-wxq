import { make } from '../core/dom.js';
import { STRINGS as T } from './strings.js';

/** Writes a description into an element with the game keywords marked, and builds the box that explains them. */
export class KeywordText {
  static #icon(src) {
    const img = new Image();
    img.className = 'kw-icon';
    img.src = src;
    img.alt = '';
    img.width = img.height = 16;
    img.decoding = 'async';
    return img;
  }

  /** Fills `element` with `text`; each keyword becomes a highlighted span with its explanation as a tooltip. Returns the keywords used. */
  static fill(element, text, glossary) {
    const parts = glossary.segments(text);
    element.replaceChildren(
      ...parts.map((part) => {
        if (!part.keyword) return document.createTextNode(part.text);
        const span = make('span', 'kw');
        if (part.keyword.icon) span.append(KeywordText.#icon(part.keyword.icon));
        span.append(part.text);
        span.title = part.keyword.mo_ta;
        return span;
      }),
    );
    return parts.filter((p) => p.keyword).map((p) => p.keyword);
  }

  /** The "explanation of keywords" box for a list of glossary entries (distinct), or null when the list is empty. */
  static box(keywords) {
    const unique = [...new Set(keywords)];
    if (!unique.length) return null;
    const box = make('div', 'kwbox');
    box.append(make('h3', 'kwbox-title', T.keywordsHeading));
    const list = make('dl', 'kwbox-list');
    for (const entry of unique) {
      const term = make('dt');
      if (entry.icon) term.append(KeywordText.#icon(entry.icon));
      term.append(entry.ten);
      list.append(term, make('dd', null, entry.mo_ta));
    }
    box.append(list);
    return box;
  }
}
