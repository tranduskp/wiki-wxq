/**
 * The game's keywords (Xuất Trận, Khai Chiến, ...) with their explanations. Plain data plus text scanning;
 * knows nothing about the DOM. Keywords are matched as whole words, case sensitive, since card texts
 * always write them with capitals.
 */
export class KeywordGlossary {
  #byName;
  #pattern;

  /** @param {{ ten: string, zh?: string, mo_ta: string }[]} entries */
  constructor(entries = []) {
    this.entries = entries;
    this.#byName = new Map(entries.map((e) => [e.ten, e]));
    // longest first, so a keyword that contains another one is matched whole
    const names = [...this.#byName.keys()].sort((a, b) => b.length - a.length).map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    this.#pattern = names.length ? new RegExp(`(?<![\\p{L}\\p{N}])(${names.join('|')})(?![\\p{L}\\p{N}])`, 'gu') : null;
  }

  get isEmpty() {
    return this.entries.length === 0;
  }

  /** Splits a text into [{ text, keyword }] where `keyword` is the glossary entry of a keyword piece, else null. */
  segments(text) {
    if (!this.#pattern || !text) return [{ text, keyword: null }];
    const parts = [];
    let last = 0;
    for (const match of text.matchAll(this.#pattern)) {
      if (match.index > last) parts.push({ text: text.slice(last, match.index), keyword: null });
      parts.push({ text: match[0], keyword: this.#byName.get(match[0]) });
      last = match.index + match[0].length;
    }
    if (last < text.length) parts.push({ text: text.slice(last), keyword: null });
    return parts;
  }

  /** The distinct keywords a text uses, in order of first appearance. */
  find(text) {
    const seen = new Set();
    for (const part of this.segments(text)) if (part.keyword) seen.add(part.keyword);
    return [...seen];
  }
}
