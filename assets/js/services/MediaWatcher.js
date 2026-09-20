/** Watches one CSS media query, for example the phone breakpoint or reduced motion. */
export class MediaWatcher {
  constructor(query, win = window) {
    this.list = win.matchMedia(query);
  }

  get matches() {
    return this.list.matches;
  }

  onChange(listener) {
    this.list.addEventListener('change', listener);
  }
}
