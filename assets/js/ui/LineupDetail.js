import { Emitter } from '../core/Emitter.js';
import { make, replay } from '../core/dom.js';
import { compactNumber } from '../core/format.js';
import { LineupBoard } from './LineupBoard.js';
import { KeywordText } from './KeywordText.js';
import { LineupHeroChip } from './LineupHeroChip.js';
import { STRINGS as T } from './strings.js';

/**
 * The detail panel of one lineup: code and copy, the board, the kỳ thủ that suit it, the written advice
 * (overview, positions, gear, talents, effects) and the route by game phase. Emits `copy` with the Lineup.
 */
export class LineupDetail extends Emitter {
  constructor({ name, nameZh, meta, body, scroller, roleIcons, glossary }) {
    super();
    this.name = name;
    this.nameZh = nameZh;
    this.meta = meta;
    this.body = body;
    this.scroller = scroller;
    this.roleIcons = roleIcons;
    this.glossary = glossary;
  }

  render(lineup) {
    this.name.textContent = lineup.displayName;
    this.name.classList.toggle('is-zh', !lineup.isTranslated);
    this.name.lang = lineup.isTranslated ? 'vi' : 'zh-Hans';
    this.nameZh.textContent = lineup.isTranslated ? lineup.nameZh : '';
    this.nameZh.hidden = !lineup.isTranslated;

    this.meta.replaceChildren(...this.#pills(lineup));

    const notes = (key, title) => this.#text(title, lineup.note(key));
    const sections = [
      this.#code(lineup),
      this.#section(T.detailHeadings.board, LineupBoard.build(lineup.heroes, this.roleIcons)),
      this.#players(lineup),
      notes('overview', T.detailHeadings.overview),
      notes('position', T.detailHeadings.position),
      this.#gear(lineup),
      this.#cards(T.detailHeadings.talents, lineup.talents, lineup.note('talent')),
      this.#cards(T.detailHeadings.effects, lineup.effects, lineup.note('effect')),
      this.#phases(lineup),
    ].filter(Boolean);
    this.body.replaceChildren(...sections);
    this.scroller.scrollTop = 0;
    replay(this.body, 'is-changing');
  }

  /** A written paragraph; the game keywords in Vietnamese text are highlighted and explained on hover. */
  #para(text, vi, className = 'ld-text') {
    const p = make('p', vi ? className : `${className} is-zh`);
    p.lang = vi ? 'vi' : 'zh-Hans';
    if (vi) KeywordText.fill(p, text, this.glossary);
    else p.textContent = text;
    return p;
  }

  #pills(lineup) {
    const pills = [];
    for (const tag of lineup.tags) {
      const official = tag.zh.includes('官方');
      const pill = make('span', official ? 'pill pill--accent' : 'pill', official ? T.officialTag : tag.vi || tag.zh);
      if (!official && !tag.vi) pill.lang = 'zh-Hans';
      pills.push(pill);
    }
    pills.push(make('span', 'pill', T.scoreOf(lineup.score.toFixed(1), lineup.scoreCount)));
    if (lineup.uses) pills.push(make('span', 'pill', T.uses(compactNumber(lineup.uses))));
    if (lineup.date) pills.push(make('span', 'pill', lineup.date));
    return pills;
  }

  #section(title, content) {
    const section = make('section', 'ld-section');
    section.append(make('h3', 'ld-title', title), content);
    return section;
  }

  #code(lineup) {
    const row = make('div', 'ld-code');
    const code = make('code', null, lineup.code);
    const button = make('button', 'btn btn--soft', T.copyCode);
    button.type = 'button';
    button.addEventListener('click', () => this.emit('copy', lineup));
    row.append(code, button);
    return row;
  }

  #text(title, note) {
    if (!note) return null;
    return this.#section(title, this.#para(note.text, note.vi));
  }

  #players(lineup) {
    const shown = lineup.players.filter((p) => p.player);
    if (!shown.length) return null;
    const list = make('ul', 'ld-players');
    for (const p of shown) {
      const item = make('li', 'ld-player');
      const img = new Image();
      img.src = p.player.avatar;
      img.alt = '';
      img.width = img.height = 48;
      img.loading = 'lazy';
      img.decoding = 'async';
      const body = make('div', 'ld-player-body');
      const name = make('p', 'ld-player-name', p.player.displayName);
      const text = p.noteVi || p.noteZh;
      body.append(name);
      if (text) {
        body.append(this.#para(text, Boolean(p.noteVi), 'ld-player-note'));
      }
      item.append(img, body);
      list.append(item);
    }
    return this.#section(T.detailHeadings.players, list);
  }

  /** The written gear advice plus, per hero that carries gear, its pieces. */
  #gear(lineup) {
    const note = lineup.note('equipment');
    const carriers = lineup.heroes.filter((h) => h.equipment.length);
    if (!note && !carriers.length) return null;

    const box = make('div');
    if (carriers.length) {
      const list = make('ul', 'ld-gear');
      for (const hero of carriers) {
        const item = make('li', 'ld-gear-row');
        item.append(LineupHeroChip.build(hero, this.roleIcons, { showName: true }));
        const pieces = make('span', 'ld-gear-items');
        for (const piece of hero.equipment) pieces.append(this.#cardRef({ card: piece, nameZh: piece.nameZh }));
        item.append(pieces);
        list.append(item);
      }
      box.append(list);
    }
    if (note) {
      box.append(this.#para(note.text, note.vi));
    }
    return this.#section(T.detailHeadings.equipment, box);
  }

  #cards(title, refs, note) {
    if (!refs.length && !note) return null;
    const box = make('div');
    if (refs.length) {
      const list = make('div', 'ld-cards');
      list.append(...refs.map((ref) => this.#cardRef(ref)));
      box.append(list);
    }
    if (note) {
      box.append(this.#para(note.text, note.vi));
    }
    return this.#section(title, box);
  }

  /** A small card reference: its emblem and Vietnamese name (Chinese when the card is unknown). */
  #cardRef(ref) {
    const el = make('span', 'cref');
    const card = ref.card;
    if (card?.thumb) {
      const img = new Image();
      img.className = 'cref-icon';
      img.src = card.thumb;
      img.alt = '';
      img.width = img.height = 32;
      img.loading = 'lazy';
      img.decoding = 'async';
      el.append(img);
    }
    const name = make('span', 'cref-name', card?.displayName ?? ref.nameZh);
    if (!card?.isTranslated) name.lang = 'zh-Hans';
    el.append(name);
    el.title = ref.nameZh;
    return el;
  }

  #phases(lineup) {
    if (!lineup.phases.length) return null;
    const list = make('ol', 'ld-phases');
    for (const phase of lineup.phases) {
      const item = make('li', 'ld-phase');
      item.append(make('p', 'ld-phase-rounds', T.phaseRounds(phase.from, phase.to)));
      const text = phase.textVi || phase.textZh;
      if (text) {
        item.append(this.#para(text, Boolean(phase.textVi)));
      }
      for (const [label, refs] of [[T.mainHeroes, phase.main], [T.subHeroes, phase.sub]]) {
        if (!refs.length) continue;
        const row = make('div', 'ld-phase-heroes');
        row.append(make('span', 'ld-phase-label', label));
        row.append(...refs.map((ref) => this.#cardRef(ref)));
        item.append(row);
      }
      list.append(item);
    }
    return this.#section(T.detailHeadings.phases, list);
  }
}
