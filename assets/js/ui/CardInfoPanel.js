import { make, replayAll } from '../core/dom.js';
import { KeywordText } from './KeywordText.js';
import { STRINGS as T } from './strings.js';
import { variantLabel } from './variantLabel.js';

/**
 * The text of the viewer: names, chapter and version pills, and the panes of the info tabs (description, and for a
 * hero its skill and stats). It owns the tab strip and the two hero panes, and hands them the data.
 */
export class CardInfoPanel {
  constructor({ name, nameZh, meta, description, glossary, tabs, skillPane, statsPane }) {
    this.name = name;
    this.nameZh = nameZh;
    this.meta = meta;
    this.description = description;
    this.glossary = glossary;
    this.tabs = tabs;
    this.skillPane = skillPane;
    this.statsPane = statsPane;
  }

  render(card, kind, variant = 0) {
    replayAll([this.name.parentElement, this.description], 'is-changing');
    this.name.textContent = card.displayName;
    this.name.classList.toggle('is-zh', !card.isTranslated);
    this.name.lang = card.isTranslated ? 'vi' : 'zh-Hans';
    this.nameZh.textContent = card.isTranslated ? card.nameZh : '';
    this.nameZh.hidden = !card.isTranslated;

    this.#renderPills(card, kind, variant);
    this.#renderDescription(card, variant);

    if (card.profile) {
      this.skillPane.render(card.profile);
      this.statsPane.render(card.profile);
      this.tabs.show(['mo-ta', 'ky-nang', 'chi-so']);
    } else {
      this.tabs.show(['mo-ta']);
    }
  }

  /** The kind is already the active tab, so the pills carry the chapter (with its emblem), the version, and the translation state. */
  #renderPills(card, kind, variant) {
    const chapter = make('span', 'pill');
    if (card.groupLogo) {
      const logo = new Image();
      logo.className = 'pill-logo';
      logo.src = card.groupLogo;
      logo.alt = '';
      logo.width = logo.height = 16;
      chapter.append(logo);
    }
    chapter.append(kind.groupKind === 'Bậc' ? card.groupLabel : `${kind.groupKind}: ${card.groupLabel}`);
    const pills = [chapter];

    const versionKind = card.variantKind(variant);
    if (card.variantCount > 1 && versionKind) {
      pills.push(make('span', versionKind === 'thuc-tinh' ? 'pill pill--accent' : 'pill', variantLabel(card, variant)));
    }
    if (!card.isTranslated) pills.push(make('span', 'pill pill--todo', T.untranslated));
    else if (card.sample) pills.push(make('span', 'pill pill--todo', T.sampleTranslation));
    this.meta.replaceChildren(...pills);
  }

  #renderDescription(card, variant) {
    const { name, desc } = card.textFor(variant);
    const text = make('p', desc ? '' : 'todo');
    const keywords = desc ? KeywordText.fill(text, desc, this.glossary) : (text.textContent = T.descriptionMissing, []);
    this.description.replaceChildren(make('h3', null, T.descriptionHeading));
    if (name && name !== card.nameVi) this.description.append(make('p', 'variant-name', name));
    this.description.append(text);
    const box = KeywordText.box(keywords);
    if (box) this.description.append(box);
  }
}
