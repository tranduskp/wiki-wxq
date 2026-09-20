import { make } from '../core/dom.js';

/** One card in the grid: a small portrait with its name, optional rank badge, and selected state. */
export class CardTile {
  #el;

  constructor(card, { onSelect }) {
    this.card = card;

    const el = make('button', `tile${card.emblem ? ' tile--icon' : ''}${card.isTranslated ? '' : ' is-zh'}`);
    el.type = 'button';
    el.dataset.id = card.id;
    el.setAttribute('aria-pressed', 'false');
    el.setAttribute('aria-label', card.isTranslated ? `${card.nameVi} (${card.nameZh})` : card.nameZh);

    const art = make('span', 'tile-art');
    art.append(this.#buildFace(card));

    const label = make('span', 'tile-name', card.displayName);
    if (!card.isTranslated) label.lang = 'zh-Hans';

    el.append(art, label);
    el.addEventListener('click', () => onSelect(card, this));
    this.#el = el;
  }

  get element() {
    return this.#el;
  }

  get visible() {
    return !this.#el.hidden;
  }

  get isConnected() {
    return this.#el.isConnected;
  }

  setVisible(visible) {
    this.#el.hidden = !visible;
  }

  setSelected(selected) {
    this.#el.setAttribute('aria-pressed', String(selected));
  }

  focus(options) {
    this.#el.focus(options);
  }

  scrollIntoView(options) {
    this.#el.scrollIntoView(options);
  }

  #buildFace(card) {
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
    img.src = card.thumb;
    face.append(img);

    if (card.badge) {
      const badge = new Image();
      badge.className = 'tile-badge';
      badge.alt = '';
      badge.width = 24;
      badge.height = 24;
      badge.decoding = 'async';
      badge.src = card.badge;
      face.append(badge);
    }
    return face;
  }
}
