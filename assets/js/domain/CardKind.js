import { CardGroup } from './CardGroup.js';

/** One of the browsable card types (Anh Hùng, Hiệu Ứng, ...) and its chapters. */
export class CardKind {
  #byId;

  constructor({ id, name, groupKind, groups, caption = '', iconName = '' }) {
    this.id = id;
    this.name = name;
    /** Small English caption shown under the name in the tab. */
    this.caption = caption;
    /** Name of the icon in ui/icons.js. */
    this.iconName = iconName;
    /** What the chapters are called for this kind: "Khu vực", "Bậc" or "Nhóm". */
    this.groupKind = groupKind;
    this.groups = groups;
    this.cards = groups.flatMap((g) => g.cards);
    this.#byId = new Map(this.cards.map((c) => [c.id, c]));
  }

  get size() {
    return this.cards.length;
  }

  find(cardId) {
    return this.#byId.get(cardId) ?? null;
  }

  /** Groups cards into chapters. Known chapters keep their configured order; unknown ones follow. */
  static assemble({ id, name, groupKind, groupLabels, groupLogos = {}, cards, caption, iconName }) {
    const order = Object.keys(groupLabels);
    for (const card of cards) if (!order.includes(card.groupKey)) order.push(card.groupKey);
    const groups = order
      .map((key) => new CardGroup(key, groupLabels[key] ?? key, cards.filter((c) => c.groupKey === key), groupLogos[key] ?? ''))
      .filter((g) => g.size > 0);
    return new CardKind({ id, name, groupKind, groups, caption, iconName });
  }
}
