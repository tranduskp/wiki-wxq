import { make } from '../core/dom.js';
import { LineupHeroChip } from './LineupHeroChip.js';
import { STRINGS as T } from './strings.js';

/**
 * The board of a lineup: 7 columns by 4 rows, with the heroes on their cells. The source numbers the rows from
 * the back (0) to the front (3); the board draws the front row on top, facing the enemy.
 */
export class LineupBoard {
  static COLUMNS = 7;
  static ROWS = 4;

  static build(heroes, roleIcons) {
    const byCell = new Map(heroes.map((h) => [`${h.x},${h.z}`, h]));
    const board = make('div', 'board');
    board.setAttribute('role', 'group');
    board.setAttribute('aria-label', T.detailHeadings.board);

    for (let z = LineupBoard.ROWS - 1; z >= 0; z -= 1) {
      for (let x = 0; x < LineupBoard.COLUMNS; x += 1) {
        const cell = make('div', 'board-cell');
        const hero = byCell.get(`${x},${z}`);
        if (hero) {
          cell.classList.add('has-hero');
          cell.append(LineupHeroChip.build(hero, roleIcons));
          if (hero.level > 1) cell.append(make('span', 'board-level', String(hero.level)));
        }
        board.append(cell);
      }
    }

    const wrap = make('div', 'board-wrap');
    wrap.append(
      make('span', 'board-side board-side--front', T.detailHeadings.front),
      board,
      make('span', 'board-side board-side--back', T.detailHeadings.back),
    );
    return wrap;
  }
}
