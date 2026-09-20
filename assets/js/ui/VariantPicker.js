import { Emitter } from '../core/Emitter.js';
import { make } from '../core/dom.js';
import { STRINGS as T } from './strings.js';

/** Chips for switching between the image versions of a card. Hidden when a card has only one. Emits `pick` with an index. */
export class VariantPicker extends Emitter {
  constructor(root) {
    super();
    this.root = root;
  }

  render(card, activeIndex) {
    this.root.replaceChildren();
    this.root.hidden = card.variantCount < 2;
    if (card.variantCount < 2) return;

    this.root.append(make('span', 'cap', T.versionCaption));
    card.images.forEach((_, index) => {
      const chip = make('button', 'variant', String(index + 1));
      chip.type = 'button';
      chip.setAttribute('aria-label', `${T.versionCaption} ${index + 1}`);
      chip.setAttribute('aria-pressed', String(index === activeIndex));
      chip.addEventListener('click', () => this.emit('pick', index));
      this.root.append(chip);
    });
  }
}
