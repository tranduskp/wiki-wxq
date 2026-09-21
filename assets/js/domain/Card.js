/** One card of the game. Plain data plus a few derived reads; knows nothing about the DOM or the network. */
export class Card {
  constructor({ kindId, id, groupKey, groupLabel, nameZh, nameVi = '', descVi = '', variantTexts = {}, sample = false, images, thumb, badge = '', emblem = false, groupLogo = '', profile = null }) {
    this.kindId = kindId;
    this.id = id;
    this.groupKey = groupKey;
    this.groupLabel = groupLabel;
    this.nameZh = nameZh;
    this.nameVi = nameVi;
    this.descVi = descVi;
    /** Translations of the other versions, keyed by 0-based image index: { name, desc }. */
    this.variantTexts = variantTexts;
    /** True when the translation is an assistant-authored sample, not the real one. */
    this.sample = sample;
    this.images = images;
    this.thumb = thumb;
    /** Small rank badge shown on the tile, or an empty string. */
    this.badge = badge;
    /** True when `thumb` is an emblem to be shown whole, false when it is a card image to be cropped. */
    this.emblem = emblem;
    /** Logo of the group (the faction's emblem for a hero), or an empty string. */
    this.groupLogo = groupLogo;
    /** HeroProfile for heroes, null for the other kinds. */
    this.profile = profile;
  }

  /** What image `variant` is: 'goc', 'thuc-tinh' or 'lien-quan' when the game data says so, else null. */
  variantKind(variant) {
    return this.profile?.variantKind(variant) ?? null;
  }

  get displayName() {
    return this.nameVi || this.nameZh;
  }

  get isTranslated() {
    return Boolean(this.nameVi);
  }

  /**
   * The Vietnamese text printed on one version's image. Version 0 is the card itself; a later version
   * uses its own entry when the translation has one and falls back to the card's description otherwise.
   * `name` is set only when that version's printed name differs from the card's name.
   */
  textFor(variant) {
    const own = this.variantTexts[variant] ?? {};
    return { name: own.name || '', desc: own.desc || this.descVi };
  }

  get variantCount() {
    return this.images.length;
  }
}
