import { make } from '../core/dom.js';
import { iconSvg } from './icons.js';
import { STRINGS as T } from './strings.js';

/** The "Chỉ số" pane of a hero: its base stats as a grid of icon, label and value. */
export class StatsPane {
  constructor(container) {
    this.container = container;
  }

  render(profile) {
    const grid = make('dl', 'stats');
    for (const stat of profile.stats) {
      const cell = make('div', 'stat');
      cell.dataset.stat = stat.key;
      if (T.statHints[stat.key]) cell.title = T.statHints[stat.key];
      const label = make('dt', 'stat-label');
      label.insertAdjacentHTML('beforeend', iconSvg(stat.key, 'icon'));
      label.append(T.statLabels[stat.key]);
      cell.append(label, make('dd', 'stat-value', `${stat.value}${stat.suffix}`));
      grid.append(cell);
    }
    this.container.replaceChildren(grid);
  }
}
