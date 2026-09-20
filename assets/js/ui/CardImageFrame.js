import { replay } from '../core/dom.js';
import { STRINGS as T } from './strings.js';

/** The frame around the viewed card image: loading, ready and error states, retry, and the settle motion. */
export class CardImageFrame {
  #token = 0;
  #shown = null;

  constructor({ frame, img, retryButton, imagePolicy }) {
    this.frame = frame;
    this.img = img;
    this.imagePolicy = imagePolicy;
    retryButton.addEventListener('click', () => this.#shown && this.#load(this.#shown, true));
  }

  /** Loads the image of one version of a card. Does nothing when that exact image is already shown. */
  show(card, variant) {
    const key = `${card.id}#${variant}`;
    if (this.#shown?.key === key) return;
    this.#load({ key, card, variant }, false);
  }

  #load(target, bust) {
    this.#shown = target;
    const token = ++this.#token;
    const { card, variant } = target;
    const source = this.imagePolicy.full(card.images[variant]);

    this.#replaySettle();
    this.frame.dataset.state = 'loading';
    this.img.onload = () => { if (token === this.#token) this.frame.dataset.state = 'ready'; };
    this.img.onerror = () => { if (token === this.#token) this.frame.dataset.state = 'error'; };
    this.img.alt = T.imageAlt(card.displayName, variant, card.variantCount);
    this.img.src = bust ? `${source}${source.includes('?') ? '&' : '?'}t=${Date.now()}` : source;
  }

  #replaySettle() {
    replay(this.frame, 'is-settling');
  }
}
