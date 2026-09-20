import { Emitter } from '../core/Emitter.js';
import { make } from '../core/dom.js';
import { iconSvg } from './icons.js';

/**
 * The card-kind tabs. Emits `select` with a kind id, from a click or from Arrow/Home/End keys.
 * The bright "current tab" plate is one element that slides from tab to tab.
 */
export class TabBar extends Emitter {
  #root;
  #kindIds = [];
  #activeId = null;
  #plate = null;
  #placedOnce = false;

  constructor(root, panelId) {
    super();
    this.#root = root;
    this.panelId = panelId;
    root.addEventListener('keydown', (event) => this.#onKeyDown(event));
    new ResizeObserver(() => this.#placePlate(false)).observe(root);
  }

  tabId(kindId) {
    return `tab-${kindId}`;
  }

  render(kinds) {
    this.#kindIds = kinds.map((k) => k.id);
    this.#plate = make('span', 'tab-plate');
    this.#plate.setAttribute('aria-hidden', 'true');
    this.#placedOnce = false;
    this.#root.replaceChildren(
      this.#plate,
      ...kinds.map((kind) => {
        const tab = make('button', 'tab');
        tab.type = 'button';
        tab.id = this.tabId(kind.id);
        tab.dataset.kind = kind.id;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', this.panelId);
        tab.insertAdjacentHTML('beforeend', iconSvg(kind.iconName, 'tab-icon'));
        const text = make('span', 'tab-text');
        text.append(make('span', 'tab-name', kind.name), make('span', 'tab-cap', kind.caption));
        text.lastElementChild.setAttribute('aria-hidden', 'true');
        tab.append(text, make('span', 'n', String(kind.size)));
        tab.addEventListener('click', () => this.emit('select', kind.id));
        return tab;
      }),
    );
  }

  setActive(kindId) {
    this.#activeId = kindId;
    for (const tab of this.#root.querySelectorAll('.tab')) {
      const on = tab.dataset.kind === kindId;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    this.#placePlate(this.#placedOnce);
    this.#placedOnce = true;
  }

  /** Moves the plate under the current tab; `animate` false jumps there (first paint, resize). */
  #placePlate(animate) {
    const tab = this.#root.querySelector('.tab[aria-selected="true"]');
    if (!tab || !this.#plate) return;
    const plate = this.#plate;
    if (!animate) plate.style.transition = 'none';
    plate.style.width = `${tab.offsetWidth}px`;
    plate.style.height = `${tab.offsetHeight}px`;
    plate.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop}px)`;
    if (!animate) {
      void plate.offsetWidth;
      plate.style.transition = '';
    }
  }

  #onKeyDown(event) {
    const ids = this.#kindIds;
    const i = ids.indexOf(this.#activeId);
    const next = {
      ArrowRight: ids[(i + 1) % ids.length],
      ArrowLeft: ids[(i + ids.length - 1) % ids.length],
      Home: ids[0],
      End: ids[ids.length - 1],
    }[event.key];
    if (!next) return;
    event.preventDefault();
    this.emit('select', next);
    this.#root.querySelector(`#${this.tabId(next)}`)?.focus();
  }
}
