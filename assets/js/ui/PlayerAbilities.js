import { make } from '../core/dom.js';
import { PlayerCardRow } from './PlayerCardRow.js';

/** The ability groups of a player (skill, secret technique, exclusive), each with its cards. */
export class PlayerAbilities {
  constructor(container) {
    this.container = container;
  }

  render(groups) {
    let row = 0; // running index across groups, drives the entrance cascade
    const sections = groups
      .filter((g) => g.cards.length > 0)
      .map((group) => {
        const section = make('section', 'ability');
        const list = make('ul', 'rows');
        list.append(...group.cards.map((card) => PlayerCardRow.build(card, group.icon, row++)));
        section.append(make('h4', 'ability-label', group.label), list);
        return section;
      });
    this.container.replaceChildren(...sections);
  }
}
