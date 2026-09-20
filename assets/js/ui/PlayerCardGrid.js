import { Emitter } from '../core/Emitter.js';
import { make } from '../core/dom.js';
import { GridKeyboardNavigator } from './GridKeyboardNavigator.js';
import { PlayerCardTile } from './PlayerCardTile.js';
import { STRINGS as T } from './strings.js';

/** The other cards of a player as a grid of tiles (details show in PlayerCardDetail). Emits `select` with a PlayerCard. */
export class PlayerCardGrid extends Emitter {
  static #CASCADE_TILES = 24;

  #tiles = [];

  constructor({ heading, container }) {
    super();
    this.heading = heading;
    this.container = container;
    new GridKeyboardNavigator(container, () => this.#tiles);
  }

  render(cards) {
    this.heading.textContent = cards.length ? `${T.cardsHeading} (${cards.length})` : T.cardsHeading;
    this.#tiles = cards.map((card) => new PlayerCardTile(card, { onSelect: (c) => this.emit('select', c) }));
    // Only the first screenful joins the entrance cascade.
    this.#tiles.slice(0, PlayerCardGrid.#CASCADE_TILES).forEach((tile, i) => tile.element.style.setProperty('--t', i));
    if (!cards.length) {
      this.container.replaceChildren(make('p', 'empty-note', T.cardsEmpty));
      return;
    }
    this.container.replaceChildren(...this.#tiles.map((t) => t.element));
  }

  select(card) {
    for (const tile of this.#tiles) tile.setSelected(tile.card === card);
  }
}
