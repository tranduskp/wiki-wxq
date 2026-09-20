/** Arrow-key movement between the tiles of a grid. Left/Right step through the list; Up/Down go to the nearest tile in the next row. */
export class GridKeyboardNavigator {
  static #ROW_TOLERANCE = 8;

  constructor(container, visibleTiles) {
    this.visibleTiles = visibleTiles;
    container.addEventListener('keydown', (event) => this.#onKeyDown(event));
  }

  #onKeyDown(event) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    const origin = event.target.closest?.('.tile');
    if (!origin) return;

    const tiles = this.visibleTiles();
    const index = tiles.findIndex((t) => t.element === origin);
    let target = null;
    if (event.key === 'ArrowRight') target = tiles[index + 1];
    else if (event.key === 'ArrowLeft') target = tiles[index - 1];
    else target = this.#tileInAdjacentRow(tiles, origin, event.key === 'ArrowDown');

    if (target) {
      event.preventDefault();
      target.focus();
    }
  }

  #tileInAdjacentRow(tiles, origin, down) {
    const tol = GridKeyboardNavigator.#ROW_TOLERANCE;
    const from = origin.getBoundingClientRect();
    const centerX = from.left + from.width / 2;
    const candidates = tiles
      .map((tile) => ({ tile, rect: tile.element.getBoundingClientRect() }))
      .filter(({ rect }) => (down ? rect.top > from.top + tol : rect.top < from.top - tol));
    if (!candidates.length) return null;

    const rowTop = down ? Math.min(...candidates.map((c) => c.rect.top)) : Math.max(...candidates.map((c) => c.rect.top));
    const distance = ({ rect }) => Math.abs(rect.left + rect.width / 2 - centerX);
    return candidates
      .filter(({ rect }) => Math.abs(rect.top - rowTop) < tol)
      .sort((a, b) => distance(a) - distance(b))[0]?.tile ?? null;
  }
}
