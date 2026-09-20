import { Emitter } from '../core/Emitter.js';
import { make } from '../core/dom.js';

/**
 * The carousel of kỳ thủ avatars. Emits `select` with the chosen Player.
 * The carousel engine (Swiper) is passed in; without it the strip is a plain horizontally scrolling row.
 */
export class PlayerRoster extends Emitter {
  #buttons = new Map();
  #players = [];
  #swiper = null;

  constructor({ viewport, wrapper, prevButton, nextButton, SwiperClass = null }) {
    super();
    this.viewport = viewport;
    this.wrapper = wrapper;
    this.prevButton = prevButton;
    this.nextButton = nextButton;
    this.SwiperClass = SwiperClass;
  }

  render(players) {
    this.#players = players;
    this.#buttons.clear();
    this.#swiper?.destroy(true, true);

    const slides = players.map((player) => {
      const button = make('button', 'chip');
      button.type = 'button';
      button.dataset.id = player.id;

      const face = make('img', 'chip-face');
      face.src = player.avatar;
      face.alt = '';
      face.width = face.height = 60;
      face.loading = 'lazy';
      face.decoding = 'async';

      const name = make('span', player.isTranslated ? 'chip-name' : 'chip-name is-zh', player.displayName);
      if (!player.isTranslated) name.lang = 'zh-Hans';

      button.append(face, name);
      button.addEventListener('click', () => this.emit('select', player));
      this.#buttons.set(player.id, button);

      const slide = make('div', 'swiper-slide');
      slide.append(button);
      return slide;
    });
    this.wrapper.replaceChildren(...slides);

    if (this.SwiperClass) {
      this.#swiper = new this.SwiperClass(this.viewport, {
        slidesPerView: 'auto',
        spaceBetween: 6,
        freeMode: { enabled: true, sticky: false },
        grabCursor: true,
        mousewheel: { forceToAxis: true },
        navigation: { prevEl: this.prevButton, nextEl: this.nextButton, disabledClass: 'is-disabled' },
      });
    } else {
      this.viewport.classList.add('is-plain');
    }
  }

  /** Marks one player as the chosen one and brings its chip into view. */
  select(player) {
    for (const [id, button] of this.#buttons) button.setAttribute('aria-pressed', String(id === player.id));
    const index = this.#players.indexOf(player);
    if (this.#swiper && index >= 0) this.#swiper.slideTo(Math.max(index - 2, 0));
    else this.#buttons.get(player.id)?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
}
