import { ChapterSection } from './ChapterSection.js';

/** The whole grid of one card kind: its chapters and tiles, built once and then only shown, hidden and filtered. */
export class KindView {
  static #CASCADE_TILES = 40;

  constructor(kind, tileFactory) {
    this.kind = kind;
    this.sections = kind.groups.map((group, index) => new ChapterSection(group, index, kind.id, tileFactory));
    this.tiles = this.sections.flatMap((s) => s.tiles);
    // Only the first screenful of tiles joins the entrance cascade; the rest are off screen and stay still.
    this.tiles.slice(0, KindView.#CASCADE_TILES).forEach((tile, i) => tile.element.style.setProperty('--t', i));
  }

  get visibleTiles() {
    return this.tiles.filter((t) => t.visible);
  }

  get visibleSections() {
    return this.sections.filter((s) => !s.hidden);
  }

  tileFor(card) {
    return this.tiles.find((t) => t.card === card) ?? null;
  }

  /** Returns how many cards match. */
  applyFilter(search) {
    return this.sections.reduce((total, section) => total + section.applyFilter(search), 0);
  }
}
