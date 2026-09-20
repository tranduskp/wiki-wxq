import { make, replayAll } from '../core/dom.js';
import { STRINGS as T } from './strings.js';

/** The text of the viewer: names, chapter and translation-state pills, and the Vietnamese description. */
export class CardInfoPanel {
  constructor({ name, nameZh, meta, description }) {
    this.name = name;
    this.nameZh = nameZh;
    this.meta = meta;
    this.description = description;
  }

  render(card, kind, variant = 0) {
    replayAll([this.name.parentElement, this.description], 'is-changing');
    this.name.textContent = card.displayName;
    this.name.classList.toggle('is-zh', !card.isTranslated);
    this.name.lang = card.isTranslated ? 'vi' : 'zh-Hans';
    this.nameZh.textContent = card.isTranslated ? card.nameZh : '';
    this.nameZh.hidden = !card.isTranslated;

    // The kind is already the active tab, so the pills carry only the chapter and the translation state.
    const chapter = kind.groupKind === 'Bậc' ? card.groupLabel : `${kind.groupKind}: ${card.groupLabel}`;
    this.meta.replaceChildren(make('span', 'pill', chapter));
    if (!card.isTranslated) this.meta.append(make('span', 'pill pill--todo', T.untranslated));
    else if (card.sample) this.meta.append(make('span', 'pill pill--todo', T.sampleTranslation));

    const { name, desc } = card.textFor(variant);
    const text = make('p', desc ? '' : 'todo', desc || T.descriptionMissing);
    this.description.replaceChildren(make('h3', null, T.descriptionHeading));
    if (name && name !== card.nameVi) this.description.append(make('p', 'variant-name', name));
    this.description.append(text);
  }
}
