import { make } from '../core/dom.js';
import { compactNumber } from '../core/format.js';
import { iconSvg } from './icons.js';
import { LineupHeroChip } from './LineupHeroChip.js';
import { STRINGS as T } from './strings.js';

/** One lineup in the list: name and tags, the heroes and kỳ thủ, the score and use count, and the two actions. */
export class LineupRow {
  #el;

  /**
   * @param {import('../domain/Lineup.js').Lineup} lineup
   * @param {{ roleIcons: Record<number, string>, onSelect: (l: object) => void, onCopy: (l: object) => void }} options
   */
  constructor(lineup, { roleIcons, onSelect, onCopy }) {
    this.lineup = lineup;

    const el = make('li', 'lrow');
    el.dataset.code = lineup.code;

    const name = make('h3', 'lrow-name', lineup.displayName);
    if (!lineup.isTranslated) name.lang = 'zh-Hans';
    const head = make('div', 'lrow-head');
    head.append(name, ...lineup.tags.map((tag) => this.#tag(tag)));

    const heroes = make('div', 'lrow-heroes');
    // heroes with a role badge first (a stable sort keeps the source order within each half)
    const ordered = [...lineup.heroes].sort((a, b) => Number(b.role > 0) - Number(a.role > 0));
    heroes.append(...ordered.map((h) => LineupHeroChip.build(h, roleIcons)));

    const players = make('div', 'lrow-players');
    for (const p of lineup.players) {
      if (!p.player?.avatar) continue;
      const img = new Image();
      img.src = p.player.avatar;
      img.alt = '';
      img.title = p.player.displayName;
      img.width = img.height = 40;
      img.loading = 'lazy';
      img.decoding = 'async';
      players.append(img);
    }

    const main = make('div', 'lrow-main');
    main.append(heroes);
    if (players.childElementCount) main.append(make('span', 'lrow-sep'), players);

    const score = make('span', 'lrow-score');
    score.insertAdjacentHTML('beforeend', iconSvg('star', 'icon'));
    score.append(lineup.score.toFixed(1));
    score.title = T.scoreOf(lineup.score.toFixed(1), lineup.scoreCount);
    const stats = make('div', 'lrow-stats');
    stats.append(score, make('span', 'lrow-uses', lineup.uses ? T.uses(compactNumber(lineup.uses)) : ''));

    const copy = make('button', 'btn btn--soft', T.copyCode);
    copy.type = 'button';
    copy.addEventListener('click', (event) => {
      event.stopPropagation();
      onCopy(lineup);
    });
    const open = make('button', 'btn btn--go', T.seeDetail);
    open.type = 'button';
    open.setAttribute('aria-label', `${T.seeDetail}: ${lineup.displayName}`);
    open.addEventListener('click', (event) => {
      event.stopPropagation();
      onSelect(lineup);
    });
    const actions = make('div', 'lrow-actions');
    actions.append(copy, open);

    const side = make('div', 'lrow-side');
    side.append(stats, actions);
    el.append(head, main, side);
    el.addEventListener('click', () => onSelect(lineup));
    this.#el = el;
    this.openButton = open;
  }

  get element() {
    return this.#el;
  }

  setSelected(selected) {
    if (selected) this.#el.setAttribute('aria-current', 'true');
    else this.#el.removeAttribute('aria-current');
  }

  #tag(tag) {
    const official = tag.zh.includes('官方');
    const span = make('span', official ? 'ltag ltag--official' : 'ltag', official ? T.officialTag : tag.vi || tag.zh);
    if (!official && !tag.vi) span.lang = 'zh-Hans';
    return span;
  }
}
