import { Emitter } from '../core/Emitter.js';
import { make } from '../core/dom.js';
import { variantLabel } from './variantLabel.js';

/** Dots for switching between the image versions of a card. Hidden when a card has only one. Emits `pick` with an index. */
export class VariantPicker extends Emitter {
  constructor(root) {
    super();
    this.root = root;
  }

  render(card, activeIndex) {
    this.root.replaceChildren();
    this.root.hidden = card.variantCount < 2;
    if (card.variantCount < 2) return;

    card.images.forEach((_, index) => {
      const label = variantLabel(card, index);
      const chip = make('button', 'variant', String(index + 1));
      chip.type = 'button';
      chip.title = label;
      chip.setAttribute('aria-label', label);
      chip.setAttribute('aria-pressed', String(index === activeIndex));
      chip.addEventListener('click', () => this.emit('pick', index));
      this.root.append(chip);
    });
  }
}
