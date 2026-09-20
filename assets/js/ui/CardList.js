import { Emitter } from '../core/Emitter.js';
import { make, replay } from '../core/dom.js';
import { GridKeyboardNavigator } from './GridKeyboardNavigator.js';
import { STRINGS as T } from './strings.js';

/**
 * The scrolling area: the chapters of the current KindView, the result summary line, the empty and error states.
 * Emits `scroll` (throttled to animation frames).
 */
export class CardList extends Emitter {
  static #ACTIVE_OFFSET = 24;

  #view = null;
  #scrollQueued = false;

  constructor({ scroller, container, status, reduceMotion }) {
    super();
    this.scroller = scroller;
    this.container = container;
    this.status = status;
    this.reduceMotion = reduceMotion;

    new GridKeyboardNavigator(container, () => this.#view?.visibleTiles ?? []);
    scroller.addEventListener(
      'scroll',
      () => {
        if (this.#scrollQueued) return;
        this.#scrollQueued = true;
        requestAnimationFrame(() => {
          this.#scrollQueued = false;
          this.emit('scroll');
        });
      },
      { passive: true },
    );
  }

  show(view) {
    this.#view = view;
    this.container.replaceChildren(...view.sections.map((s) => s.element));
    this.scroller.scrollTop = 0;
    replay(this.container, 'is-entering');
  }

  /** Marks the region as labelled by the active tab. */
  setLabelledBy(id) {
    this.container.setAttribute('aria-labelledby', id);
  }

  showSummary(kind, shown, search) {
    const [strong, rest] = search.isActive
      ? T.summaryQuery(shown, kind.size, search.query)
      : T.summaryAll(kind.size, kind.groups.length, kind.groupKind);
    this.status.replaceChildren(make('strong', null, strong), rest);
    this.status.dataset.q = search.isActive ? '1' : '0';
  }

  clearEmpty() {
    this.container.querySelector('.empty')?.remove();
  }

  showEmpty(onClear) {
    this.container.append(this.#panel(T.emptyTitle, T.emptyHint, T.emptyAction, onClear));
  }

  showError(text, onRetry) {
    this.container.replaceChildren(this.#panel(T.loadFailedTitle, text, T.retry, onRetry));
    this.status.textContent = '';
  }

  jumpTo(section) {
    this.scroller.scrollTo({ top: section.top, behavior: this.reduceMotion.matches ? 'auto' : 'smooth' });
  }

  /** The chapter whose heading is at or above the top of the visible area. */
  activeSection() {
    if (!this.#view) return null;
    const line = this.scroller.scrollTop + CardList.#ACTIVE_OFFSET;
    let active = null;
    for (const section of this.#view.visibleSections) if (section.top <= line) active = section;
    return active ?? this.#view.visibleSections[0] ?? null;
  }

  #panel(title, text, actionLabel, onAction) {
    const panel = make('div', 'empty');
    const button = make('button', 'btn', actionLabel);
    button.type = 'button';
    button.addEventListener('click', onAction);
    panel.append(make('strong', null, title), make('p', null, text), button);
    return panel;
  }
}
