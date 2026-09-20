import { make } from '../core/dom.js';

/** One card of a kỳ thủ in the grid: the emblem in a small frame with its name. Same look as the Tra cứu tiles. */
export class PlayerCardTile {
  #el;

  constructor(card, { onSelect }) {
    this.card = card;

    const el = make('button', `tile tile--icon${card.nameVi ? '' : ' is-zh'}`);
    el.type = 'button';
    el.dataset.id = card.id;
    el.setAttribute('aria-pressed', 'false');
    el.setAttribute('aria-label', card.nameVi ? `${card.nameVi} (${card.nameZh})` : card.nameZh);

    const face = make('span', 'tile-face is-loading');
    face.dataset.ch = card.nameZh.charAt(0);
    const img = new Image();
    img.className = 'tile-img';
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('load', () => face.classList.remove('is-loading'));
    img.addEventListener('error', () => {
      face.classList.remove('is-loading');
      face.classList.add('is-broken');
    });
    img.src = card.icon;
    face.append(img);

    const art = make('span', 'tile-art');
    art.append(face);
    const label = make('span', 'tile-name', card.displayName);
    if (!card.nameVi) label.lang = 'zh-Hans';

    el.append(art, label);
    el.addEventListener('click', () => onSelect(card));
    this.#el = el;
  }

  get element() {
    return this.#el;
  }

  setSelected(selected) {
    this.#el.setAttribute('aria-pressed', String(selected));
  }

  focus(options) {
    this.#el.focus(options);
  }
}
