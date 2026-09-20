/** Where the visitor is: a card kind, optionally one card of it, optionally one image version of that card. */
export class Route {
  constructor(kindId = null, cardId = null, variant = 0) {
    this.kindId = kindId;
    this.cardId = cardId;
    this.variant = variant;
  }

  /** Parses `#/<loai>[/<bai>[/<ban>]]`. Missing parts stay null; an unknown kind is the caller's to resolve. */
  static parse(hash) {
    let parts;
    try {
      parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    } catch {
      parts = [];
    }
    return new Route(parts[0] ?? null, parts[1] ?? null, Math.max(0, (parseInt(parts[2], 10) || 1) - 1));
  }

  toHash() {
    let hash = `#/${this.kindId}`;
    if (this.cardId) {
      hash += `/${encodeURIComponent(this.cardId)}`;
      if (this.variant > 0) hash += `/${this.variant + 1}`;
    }
    return hash;
  }
}
