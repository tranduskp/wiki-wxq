import { make, replay } from '../core/dom.js';
import { KeywordText } from './KeywordText.js';

/** The text of the chosen card of a kỳ thủ: emblem, name with the Chinese original, description, source note. */
export class PlayerCardDetail {
  constructor(container, glossary) {
    this.container = container;
    this.glossary = glossary;
  }

  render(card) {
    if (!card) {
      this.container.hidden = true;
      this.container.replaceChildren();
      return;
    }
    this.container.hidden = false;
    replay(this.container, 'is-changing');

    const icon = make('img', 'detail-icon');
    icon.src = card.icon;
    icon.alt = '';
    icon.width = icon.height = 72;
    icon.decoding = 'async';

    const name = make('h4', 'detail-name', card.displayName);
    if (!card.nameVi) name.lang = 'zh-Hans';
    const body = make('div', 'detail-body');
    body.append(name);
    if (card.nameVi) {
      const zh = make('p', 'detail-zh', card.nameZh);
      zh.lang = 'zh-Hans';
      body.append(zh);
    }

    const { text, vi } = card.description;
    const desc = make('p', vi ? 'detail-desc' : 'detail-desc is-zh');
    desc.lang = vi ? 'vi' : 'zh-Hans';
    const keywords = vi ? KeywordText.fill(desc, text, this.glossary) : (desc.textContent = text, []);
    body.append(desc);
    const box = KeywordText.box(keywords);
    if (box) body.append(box);
    if (card.source) body.append(make('span', 'pill', card.source));

    this.container.replaceChildren(icon, body);
  }
}
