import { Emitter } from '../core/Emitter.js';
import { make } from '../core/dom.js';

/** The list of chapters beside (or above) the grid. Emits `jump` with the chosen ChapterSection. */
export class ChapterRail extends Emitter {
  #root;
  #entries = new WeakMap();
  #title = make('p', 'rail-title');

  constructor(root) {
    super();
    this.#root = root;
  }

  /** Shows the chapter buttons of a KindView. */
  show(view) {
    this.#title.textContent = view.kind.groupKind;
    this.#root.replaceChildren(this.#title, ...this.#entriesFor(view).map((e) => e.button));
  }

  /** Brings counts and disabled state in line with the current filter. */
  refresh(view) {
    for (const { section, button, count } of this.#entriesFor(view)) {
      count.textContent = String(section.visibleCount);
      button.disabled = section.visibleCount === 0;
    }
  }

  setActive(view, activeSection) {
    for (const { section, button } of this.#entriesFor(view)) {
      const on = section === activeSection;
      if (button.getAttribute('aria-current') === String(on)) continue;
      button.setAttribute('aria-current', String(on));
      if (on) button.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  static #logo(src) {
    const img = new Image();
    img.className = 'rail-logo';
    img.src = src;
    img.alt = '';
    img.width = img.height = 24;
    img.decoding = 'async';
    return img;
  }

  #entriesFor(view) {
    let entries = this.#entries.get(view);
    if (!entries) {
      entries = view.sections.map((section) => {
        const count = make('span', 'n', String(section.visibleCount));
        const button = make('button', 'rail-btn');
        button.type = 'button';
        if (section.group.logo) {
          button.classList.add('has-logo');
          button.append(ChapterRail.#logo(section.group.logo));
        }
        button.append(make('span', null, section.label), count);
        button.addEventListener('click', () => this.emit('jump', section));
        return { section, button, count };
      });
      this.#entries.set(view, entries);
    }
    return entries;
  }
}
