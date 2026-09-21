import { make } from '../core/dom.js';

/** A chapter of the grid: a sticky heading with its count, and the tiles of one CardGroup. */
export class ChapterSection {
  static #logo(src) {
    const img = new Image();
    img.className = 'chapter-logo';
    img.src = src;
    img.alt = '';
    img.width = img.height = 30;
    img.decoding = 'async';
    return img;
  }

  #el;
  #countEl;

  constructor(group, index, kindId, tileFactory) {
    this.group = group;
    this.visibleCount = group.size;
    this.tiles = group.cards.map((card) => tileFactory(card));

    const heading = make('h2', null, group.label);
    const logo = group.logo ? ChapterSection.#logo(group.logo) : null;
    heading.id = `chuong-${kindId}-${index}`;
    this.#countEl = make('span', 'n', String(group.size));
    const head = make('div', 'chapter-head');
    head.append(...(logo ? [logo] : []), heading, this.#countEl);

    const grid = make('div', 'grid');
    grid.append(...this.tiles.map((t) => t.element));

    this.#el = make('section', 'chapter');
    this.#el.setAttribute('aria-labelledby', heading.id);
    this.#el.style.setProperty('--i', index); // its place in the entrance cascade
    this.#el.append(head, grid);
  }

  get element() {
    return this.#el;
  }

  get label() {
    return this.group.label;
  }

  get hidden() {
    return this.#el.hidden;
  }

  /** Distance from the top of the scrolling list. */
  get top() {
    return this.#el.offsetTop;
  }

  /** Shows the tiles whose card matches; hides the chapter when none do. Returns how many matched. */
  applyFilter(search) {
    let shown = 0;
    for (const tile of this.tiles) {
      const ok = search.matches(tile.card);
      tile.setVisible(ok);
      if (ok) shown += 1;
    }
    this.visibleCount = shown;
    this.#countEl.textContent = String(shown);
    this.#el.hidden = shown === 0;
    return shown;
  }
}
