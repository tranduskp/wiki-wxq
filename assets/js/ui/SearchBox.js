import { Emitter } from '../core/Emitter.js';

/** The search field with its clear button. Emits `input` with the current text (also after clearing). */
export class SearchBox extends Emitter {
  constructor({ wrap, input, clearButton }) {
    super();
    this.wrap = wrap;
    this.input = input;

    input.addEventListener('input', () => this.#changed());
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && input.value) {
        event.preventDefault();
        this.clear();
      }
    });
    clearButton.addEventListener('click', () => this.clear());
  }

  get value() {
    return this.input.value;
  }

  focus() {
    this.input.focus();
  }

  clear() {
    this.input.value = '';
    this.#changed();
    this.input.focus();
  }

  #changed() {
    this.wrap.classList.toggle('has-value', this.input.value.length > 0);
    this.emit('input', this.input.value);
  }
}
