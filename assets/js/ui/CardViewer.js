import { Emitter } from '../core/Emitter.js';
import { STRINGS as T } from './strings.js';

/**
 * The card viewer panel: composes the info text, the image frame and the version dots, and owns the
 * copy-link button. Emits `copy` and `variant` (with an index).
 */
export class CardViewer extends Emitter {
  static #TOAST_MS = 1800;

  #toastTimer = null;

  constructor({ info, frame, variants, copyButton, toast }) {
    super();
    this.info = info;
    this.frame = frame;
    this.variants = variants;
    this.copyButton = copyButton;
    this.toast = toast;

    copyButton.addEventListener('click', () => this.emit('copy'));
    variants.on('pick', (index) => this.emit('variant', index));
  }

  render(card, kind, variant) {
    this.info.render(card, kind, variant);
    this.variants.render(card, variant);
    this.frame.show(card, variant);
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
