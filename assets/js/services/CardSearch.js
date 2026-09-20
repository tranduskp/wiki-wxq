/**
 * The current search query and the rule for matching a card against it.
 * A card matches when every word of the query appears in its Vietnamese name, Chinese name or chapter name.
 */
export class CardSearch {
  #query = '';
  #tokens = [];
  #index = new WeakMap();

  constructor(normalizer) {
    this.normalizer = normalizer;
  }

  setQuery(query) {
    this.#query = query;
    this.#tokens = this.normalizer.fold(query.trim()).split(/\s+/).filter(Boolean);
  }

  get query() {
    return this.#query.trim();
  }

  get isActive() {
    return this.#tokens.length > 0;
  }

  matches(card) {
    if (!this.isActive) return true;
    return this.#tokens.every((token) => this.#haystack(card).includes(token));
  }

  #haystack(card) {
    let text = this.#index.get(card);
    if (text === undefined) {
      text = this.normalizer.fold(`${card.nameVi} ${card.nameZh} ${card.groupLabel}`);
      this.#index.set(card, text);
    }
    return text;
  }
}
