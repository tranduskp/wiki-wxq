/** A chapter of a card kind: a khu vực, a bậc or a nhóm. */
export class CardGroup {
  constructor(key, label, cards) {
    this.key = key;
    this.label = label;
    this.cards = cards;
  }

  get size() {
    return this.cards.length;
  }
}
