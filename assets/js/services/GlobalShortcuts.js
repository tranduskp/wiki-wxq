import { Emitter } from '../core/Emitter.js';

/** Page-wide keyboard shortcuts. Emits `escape` and `focus-search` (with the key event) and leaves the meaning to listeners. */
export class GlobalShortcuts extends Emitter {
  constructor(doc = document) {
    super();
    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.emit('escape', event);
      const typing = /^(INPUT|TEXTAREA)$/.test(doc.activeElement?.tagName ?? '');
      if (event.key === '/' && !typing) this.emit('focus-search', event);
    });
  }
}
