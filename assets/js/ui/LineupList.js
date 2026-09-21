import { Emitter } from '../core/Emitter.js';
import { make, replay } from '../core/dom.js';
import { LineupRow } from './LineupRow.js';
import { STRINGS as T } from './strings.js';

/**
 * The scrolling list of lineup rows, shown a page at a time with a "more" button.
 * Emits `select` and `copy` with a Lineup.
 */
export class LineupList extends Emitter {
  static #PAGE = 20;
  static #CASCADE_ROWS = 8;

  #lineups = [];
  #rows = new Map();
  #shown = 0;
  #selected = null;

  constructor({ scroller, list, status, moreButton, roleIcons }) {
    super();
    this.scroller = scroller;
    this.list = list;
    this.status = status;
    this.moreButton = moreButton;
    this.roleIcons = roleIcons;
    moreButton.addEventListener('click', () => this.#appendRows(this.#shown + LineupList.#PAGE));
  }

  /** Replaces the rows. The chosen lineup, if any, is included even when it lies beyond the first page. */
  render(lineups, selected = null) {
    this.#lineups = lineups;
    this.#rows.clear();
    this.#shown = 0;
    this.#selected = null;
    this.list.replaceChildren();
    const at = selected ? lineups.indexOf(selected) : -1;
    const pages = Math.max(1, Math.ceil((at + 1) / LineupList.#PAGE));
    this.#appendRows(pages * LineupList.#PAGE);
    if (selected) this.select(selected);
    this.scroller.scrollTop = 0;
    replay(this.list, 'is-entering');
  }

  /** The "Chi tiết" button of a lineup's row, or null when that row is not on the page. */
  openButtonOf(lineup) {
    return this.#rows.get(lineup)?.openButton ?? null;
  }

  select(lineup) {
    this.#rows.get(this.#selected)?.setSelected(false);
    this.#selected = lineup;
    this.#rows.get(lineup)?.setSelected(true);
  }

  showSummary(shown, total, search) {
    if (!search.isActive) {
      this.status.replaceChildren(make('strong', null, String(total)), ' đội hình');
      return;
    }
    const [strong, rest] = T.lineupSummary(shown, total);
    this.status.replaceChildren(make('strong', null, strong), rest);
  }

  showEmpty() {
    const panel = make('div', 'empty');
    panel.append(make('strong', null, T.lineupNone), make('p', null, T.lineupNoneHint));
    this.list.replaceChildren(panel);
    this.moreButton.hidden = true;
  }

  showError(text, onRetry) {
    const panel = make('div', 'empty');
    const retry = make('button', 'btn', T.retry);
    retry.type = 'button';
    retry.addEventListener('click', onRetry);
    panel.append(make('strong', null, T.loadFailedTitle), make('p', null, text), retry);
    this.list.replaceChildren(panel);
    this.moreButton.hidden = true;
    this.status.textContent = '';
  }

  #appendRows(upTo) {
    const batch = this.#lineups.slice(this.#shown, upTo);
    for (const [i, lineup] of batch.entries()) {
      const row = new LineupRow(lineup, {
        roleIcons: this.roleIcons,
        onSelect: (l) => this.emit('select', l),
        onCopy: (l) => this.emit('copy', l),
      });
      if (this.#shown === 0 && i < LineupList.#CASCADE_ROWS) row.element.style.setProperty('--i', i); // first rows arrive in a cascade
      this.#rows.set(lineup, row);
      this.list.append(row.element);
    }
    this.#shown += batch.length;
    const left = this.#lineups.length - this.#shown;
    this.moreButton.hidden = left <= 0;
    this.moreButton.textContent = T.lineupMore(left);
    if (this.#selected) this.#rows.get(this.#selected)?.setSelected(true);
  }
}
