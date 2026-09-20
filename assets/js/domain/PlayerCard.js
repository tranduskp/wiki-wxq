/** One card that belongs to a player (a skill, a secret technique, or an exclusive card). Plain data, no DOM. */
export class PlayerCard {
  constructor({ id, nameZh, nameVi = '', descZh = '', descVi = '', icon = '', source = '' }) {
    this.id = id;
    this.nameZh = nameZh;
    this.nameVi = nameVi;
    this.descZh = descZh;
    this.descVi = descVi;
    this.icon = icon;
    /** Vietnamese "where you get it" note, only when it is worth showing (empty for the usual case). */
    this.source = source;
  }

  get displayName() {
    return this.nameVi || this.nameZh;
  }

  /** The description to show and whether it is the Vietnamese one. */
  get description() {
    return this.descVi ? { text: this.descVi, vi: true } : { text: this.descZh, vi: false };
  }
}
