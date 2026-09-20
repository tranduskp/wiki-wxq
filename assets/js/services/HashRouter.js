import { Route } from './Route.js';

/**
 * Reads and writes the current route in the URL hash, and reports every change (own navigation or Back/Forward).
 * `RouteType` is the class that parses and prints the hash (Route for Tra cứu, PlayerRoute for Kỳ thủ).
 */
export class HashRouter {
  #listeners = [];

  constructor(win = window, RouteType = Route) {
    this.win = win;
    this.RouteType = RouteType;
    win.addEventListener('popstate', () => this.#notify());
  }

  onChange(listener) {
    this.#listeners.push(listener);
  }

  current() {
    return this.RouteType.parse(this.win.location.hash);
  }

  get url() {
    return this.win.location.href;
  }

  /** True when the current history entry was pushed for an open bottom sheet, so Back closes it. */
  get atSheetEntry() {
    return Boolean(this.win.history.state?.sheet);
  }

  /** `push` adds a history entry (Back returns here); otherwise the current entry is replaced. */
  navigate(route, { push = false, sheet = false } = {}) {
    if (push) this.win.history.pushState(sheet ? { sheet: true } : null, '', route.toHash());
    else this.win.history.replaceState(this.win.history.state, '', route.toHash());
    this.#notify();
  }

  back() {
    this.win.history.back();
  }

  #notify() {
    for (const listener of this.#listeners) listener();
  }
}
