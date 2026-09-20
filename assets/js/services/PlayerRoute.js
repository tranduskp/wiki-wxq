/** Where the visitor is on the Kỳ thủ page: one player (by Chinese name), optionally one skin of that player. */
export class PlayerRoute {
  constructor(playerId = null, skin = 0) {
    this.playerId = playerId;
    this.skin = skin;
  }

  /** Parses `#/<ky-thu>[/<trang-phuc>]`; the skin number is 1-based in the URL. */
  static parse(hash) {
    let parts;
    try {
      parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    } catch {
      parts = [];
    }
    return new PlayerRoute(parts[0] ?? null, Math.max(0, (parseInt(parts[1], 10) || 1) - 1));
  }

  toHash() {
    let hash = `#/${encodeURIComponent(this.playerId ?? '')}`;
    if (this.skin > 0) hash += `/${this.skin + 1}`;
    return hash;
  }
}
