import { Emitter } from '../core/Emitter.js';
import { make, replay } from '../core/dom.js';
import { STRINGS as T } from './strings.js';

/**
 * The tab strip above a card's text (Mô tả, Kỹ năng, Chỉ số) and the panes it switches between.
 * `show(ids)` offers the tabs that apply to the current card; the chosen tab is kept from card to card while it is
 * still offered. With a single tab the strip is hidden. Emits `select` with the tab id.
 */
export class InfoTabs extends Emitter {
  #active = null;
  #offered = [];

  /** @param {{ root: HTMLElement, panes: Record<string, HTMLElement> }} parts  `panes` maps a tab id to its panel */
  constructor({ root, panes }) {
    super();
    this.root = root;
    this.panes = panes;
    root.setAttribute('role', 'tablist');
    root.setAttribute('aria-label', T.infoTabsLabel);
    root.addEventListener('keydown', (event) => this.#onKeyDown(event));
    for (const [id, pane] of Object.entries(panes)) {
      pane.setAttribute('role', 'tabpanel');
      pane.id ||= `pane-${id}`;
    }
  }

  show(ids) {
    this.#offered = ids;
    if (!ids.includes(this.#active)) this.#active = ids[0];
    this.root.hidden = ids.length < 2;
    this.root.replaceChildren(
      ...ids.map((id) => {
        const tab = make('button', 'itab', T.infoTabs[id]);
        tab.type = 'button';
        tab.id = `tab-${id}`;
        tab.dataset.id = id;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', this.panes[id].id);
        tab.addEventListener('click', () => this.select(id));
        return tab;
      }),
    );
    this.#apply(false);
  }

  select(id) {
    if (id === this.#active || !this.#offered.includes(id)) return;
    this.#active = id;
    this.#apply(true);
    this.emit('select', id);
  }

  #apply(animate) {
    for (const tab of this.root.children) {
      const on = tab.dataset.id === this.#active;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    }
    for (const [id, pane] of Object.entries(this.panes)) {
      const on = id === this.#active && this.#offered.includes(id);
      pane.hidden = !on;
      if (on && animate) replay(pane, 'is-changing');
    }
  }

  #onKeyDown(event) {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    const at = this.#offered.indexOf(this.#active);
    const next = this.#offered[(at + step + this.#offered.length) % this.#offered.length];
    event.preventDefault();
    this.select(next);
    this.root.querySelector(`[data-id="${next}"]`)?.focus();
  }
}
