import { Emitter } from '../core/Emitter.js';
import { STRINGS as T } from './strings.js';

/**
 * The card viewer panel: composes the info text, the image frame and the version chips, and owns the
 * previous / next / copy-link buttons. Emits `prev`, `next`, `copy` and `variant` (with an index).
 */
export class CardViewer extends Emitter {
  static #TOAST_MS = 1800;

  #toastTimer = null;

  constructor({ info, frame, variants, prevButton, nextButton, copyButton, toast }) {
    super();
    this.info = info;
    this.frame = frame;
    this.variants = variants;
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
  }

  setNavigation({ hasPrevious, hasNext }) {
    this.prevButton.disabled = !hasPrevious;
    this.nextButton.disabled = !hasNext;
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
