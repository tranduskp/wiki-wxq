import { Emitter } from '../core/Emitter.js';
import { STRINGS as T } from './strings.js';
import { variantLabel } from './variantLabel.js';

/**
 * The card viewer panel: composes the info text, the image frame and the version dots, and owns the
 * previous / next / copy-link buttons. Previous and next step through the versions of the shown card (a hero and its
 * awakened form, say), wrapping around; they are hidden for a card with a single version.
 * Emits `prev`, `next`, `copy` and `variant` (with an index).
 */
export class CardViewer extends Emitter {
  static #TOAST_MS = 1800;

  #toastTimer = null;

  constructor({ info, frame, variants, pager, prevButton, nextButton, copyButton, toast }) {
    super();
    this.info = info;
    this.frame = frame;
    this.variants = variants;
    this.pager = pager;
    this.prevButton = prevButton;
    this.nextButton = nextButton;
    this.copyButton = copyButton;
    this.toast = toast;

    prevButton.addEventListener('click', () => this.emit('prev'));
    nextButton.addEventListener('click', () => this.emit('next'));
    copyButton.addEventListener('click', () => this.emit('copy'));
    variants.on('pick', (index) => this.emit('variant', index));
  }

  render(card, kind, variant) {
    this.info.render(card, kind, variant);
    this.variants.render(card, variant);
    this.frame.show(card, variant);
    this.#renderPager(card, variant);
  }

  #renderPager(card, variant) {
    const count = card.variantCount;
    this.pager.hidden = count < 2;
    if (count < 2) return;
    const previous = T.viewVariant(variantLabel(card, (variant + count - 1) % count));
    const next = T.viewVariant(variantLabel(card, (variant + 1) % count));
    for (const [button, label] of [[this.prevButton, previous], [this.nextButton, next]]) {
      button.title = label;
      button.setAttribute('aria-label', label);
    }
  }

  showCopyResult(ok) {
    this.copyButton.classList.toggle('is-done', ok);
    this.toast.textContent = ok ? T.copied : T.copyFailed;
    clearTimeout(this.#toastTimer);
    this.#toastTimer = setTimeout(() => {
      this.copyButton.classList.remove('is-done');
      this.toast.textContent = '';
    }, CardViewer.#TOAST_MS);
  }
}
