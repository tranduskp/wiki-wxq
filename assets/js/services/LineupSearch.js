/**
 * The current search query and the rule for matching a lineup against it. A lineup matches when every word of the
 * query appears in its name, its heroes' names, its kỳ thủ's names or its tags, in Vietnamese or Chinese.
 */
export class LineupSearch {
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

  matches(lineup) {
    if (!this.isActive) return true;
    const haystack = this.#haystack(lineup);
    return this.#tokens.every((token) => haystack.includes(token));
  }

  #haystack(lineup) {
    let text = this.#index.get(lineup);
    if (text === undefined) {
      const parts = [lineup.nameVi, lineup.nameZh];
      for (const hero of lineup.heroes) parts.push(hero.card?.nameVi, hero.nameZh);
      for (const p of lineup.players) parts.push(p.player?.nameVi, p.nameZh);
      for (const tag of lineup.tags) parts.push(tag.vi, tag.zh);
      text = this.normalizer.fold(parts.filter(Boolean).join(' '));
      this.#index.set(lineup, text);
    }
    return text;
  }
}
