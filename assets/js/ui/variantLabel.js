import { STRINGS as T } from './strings.js';

/**
 * A short name for one image version of a card: "Thường" or "Thức Tỉnh" for a hero, the name printed on the
 * image for a related card, otherwise its number. Used for tooltips and the labels around the card.
 */
export function variantLabel(card, index) {
  const kind = card.variantKind(index);
  const printed = card.textFor(index).name;
  if (kind === 'lien-quan') return printed || T.variantKinds['lien-quan'];
  if (kind) return T.variantKinds[kind];
  return printed || T.variantNumber(index + 1);
}
