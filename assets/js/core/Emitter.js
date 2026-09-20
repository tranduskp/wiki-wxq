/** Minimal event emitter. UI components report user intent through it without knowing who listens. */
export class Emitter {
  #handlers = new Map();

  on(event, handler) {
    if (!this.#handlers.has(event)) this.#handlers.set(event, []);
    this.#handlers.get(event).push(handler);
    return this;
  }

  emit(event, ...args) {
    for (const handler of this.#handlers.get(event) ?? []) handler(...args);
  }
}
