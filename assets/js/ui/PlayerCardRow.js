import { make } from '../core/dom.js';

/** Builds the list row of one PlayerCard: icon, name (with the Chinese original), description, optional source note. */
export class PlayerCardRow {
  /** `fallbackIcon` is used when the card has no icon of its own (the cards inside an ability group). */
  static build(card, fallbackIcon = '', order = 0) {
    const row = make('li', 'prow');
    row.style.setProperty('--i', order);

    const icon = make('img', 'prow-icon');
    icon.src = card.icon || fallbackIcon;
    icon.alt = '';
    icon.width = icon.height = 52;
    icon.loading = 'lazy';
    icon.decoding = 'async';

    const body = make('div', 'prow-body');
    const name = make('p', 'prow-name', card.displayName);
    if (card.nameVi) {
      const original = make('span', 'prow-zh', card.nameZh);
      original.lang = 'zh-Hans';
      name.append(original);
    } else {
      name.lang = 'zh-Hans';
    }

    const { text, vi } = card.description;
    const desc = make('p', vi ? 'prow-desc' : 'prow-desc is-zh', text);
    desc.lang = vi ? 'vi' : 'zh-Hans';

    body.append(name, desc);
    if (card.source) body.append(make('span', 'pill', card.source));
    row.append(icon, body);
    return row;
  }
}
