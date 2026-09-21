/** A chapter of a card kind: a khu vực, a bậc or a nhóm. */
export class CardGroup {
  constructor(key, label, cards, logo = '') {
    this.key = key;
    this.label = label;
    this.cards = cards;
    /** Image URL of the chapter's emblem (a faction's logo), or an empty string. */
    this.logo = logo;
  }

  get size() {
    return this.cards.length;
  }
}
