import { Emitter } from '../core/Emitter.js';

/**
 * Presents the viewer panel as a modal bottom sheet on phones and as a plain side column elsewhere.
 * The owner decides when it is open; the sheet applies it (visibility, inert background, ARIA role, focus).
 * Emits `close` from its close button and its scrim.
 */
export class BottomSheet extends Emitter {
  #open = false;

  constructor({ panel, scrim, closeButton, backgroundElements, phone }) {
    super();
    this.panel = panel;
    this.scrim = scrim;
    this.closeButton = closeButton;
    this.backgroundElements = backgroundElements;
    this.phone = phone;

    closeButton.addEventListener('click', () => this.emit('close'));
    scrim.addEventListener('click', () => this.emit('close'));
  }

  get isOpen() {
    return this.#open;
  }

  /** `returnFocusTo` is called when the sheet closes and must return the element to focus, if any. */
  apply(open, returnFocusTo) {
    const was = this.#open;
    this.#open = open;

    this.panel.dataset.open = String(open);
    this.scrim.hidden = !open;
    for (const el of this.backgroundElements) el.inert = open;

    this.panel.setAttribute('role', this.phone.matches ? 'dialog' : 'complementary');
    if (this.phone.matches) this.panel.setAttribute('aria-modal', 'true');
    else this.panel.removeAttribute('aria-modal');

    if (open && !was) requestAnimationFrame(() => this.closeButton.focus());
    if (!open && was) returnFocusTo?.()?.focus({ preventScroll: true });
  }
}
