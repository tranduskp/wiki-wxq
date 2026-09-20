/**
 * One kỳ thủ (棋手): who they are, their skins, their ability groups (skill, secret technique, exclusive)
 * and the rest of their cards. Plain data plus a few derived reads; knows nothing about the DOM or the network.
 */
export class Player {
  constructor({ id, nameZh, nameVi = '', nameEn = '', quoteZh = '', quoteVi = '', avatar = '', skins = [], groups = [], cards = [] }) {
    this.id = id;
    this.nameZh = nameZh;
    this.nameVi = nameVi;
    this.nameEn = nameEn;
    this.quoteZh = quoteZh;
    this.quoteVi = quoteVi;
    this.avatar = avatar;
    /** [{ nameZh, nameVi, cover, banner }] in the order of the source. */
    this.skins = skins;
    /** [{ key, label, icon, cards: PlayerCard[] }]: the ability groups, in the order of the source. */
    this.groups = groups;
    /** PlayerCard[]: every other card of the player. */
    this.cards = cards;
  }

  get displayName() {
    return this.nameVi || this.nameZh;
  }

  get isTranslated() {
    return Boolean(this.nameVi);
  }

  /** The skin at `index`, clamped into range; null when the player has no skins. */
  skin(index) {
    return this.skins[Math.min(Math.max(index, 0), this.skins.length - 1)] ?? null;
  }
}
