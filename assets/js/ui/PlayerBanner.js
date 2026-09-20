import { Emitter } from '../core/Emitter.js';
import { make, replay } from '../core/dom.js';
import { STRINGS as T } from './strings.js';

/**
 * The head of a player's profile: the skin artwork, the name in Vietnamese and Chinese, the quote,
 * and the skin picker. Emits `skin` with a 0-based skin index.
 */
export class PlayerBanner extends Emitter {
  #swapToken = 0;

  constructor({ image, ghost, name, nameZh, quote, quoteZh, skinName, skins }) {
    super();
    this.image = image;
    this.ghost = ghost;
    this.name = name;
    this.nameZh = nameZh;
    this.quote = quote;
    this.quoteZh = quoteZh;
    this.skinName = skinName;
    this.skins = skins;
  }

  render(player, skinIndex) {
    const skin = player.skin(skinIndex);
    const skinTitle = skin ? this.#skinTitle(player, skin) : '';

    this.name.textContent = player.displayName;
    this.name.classList.toggle('is-zh', !player.isTranslated);
    this.name.lang = player.isTranslated ? 'vi' : 'zh-Hans';
    this.nameZh.textContent = player.isTranslated ? player.nameZh : '';
    this.nameZh.hidden = !player.isTranslated;

    const quote = player.quoteVi || player.quoteZh;
    this.quote.textContent = quote ? `“${quote}”` : '';
    this.quote.lang = player.quoteVi ? 'vi' : 'zh-Hans';
    this.quoteZh.textContent = player.quoteVi && player.quoteZh ? player.quoteZh : '';
    this.quoteZh.hidden = !this.quoteZh.textContent;

    this.ghost.textContent = player.nameEn.toUpperCase();

    this.image.alt = T.bannerAlt(player.displayName, skinTitle);
    if (skin?.banner && this.image.getAttribute('src') !== skin.banner) this.#swapImage(skin.banner);

    const picker = player.skins.length > 1;
    this.skins.hidden = !picker;
    this.skinName.textContent = skin && picker ? `${T.skinLabel}: ${skinTitle}` : '';
    this.skinName.hidden = !this.skinName.textContent;
    this.skins.replaceChildren(...(picker ? player.skins.map((s, i) => this.#skinButton(player, s, i, i === skinIndex)) : []));
  }

  /** Loads and decodes the new artwork first, so the old one stays until the new one can fade in without a pop. */
  #swapImage(src) {
    const token = ++this.#swapToken;
    const next = new Image();
    next.src = src;
    next.decode().catch(() => {}).then(() => {
      if (token !== this.#swapToken) return; // a newer choice arrived meanwhile
      this.#leaveOldImage();
      this.image.src = src;
      replay(this.image, 'is-entering');
    });
  }

  /** Leaves a copy of the current artwork underneath, so the new one fades in over it instead of over an empty frame. */
  #leaveOldImage() {
    if (!this.image.getAttribute('src')) return;
    const old = this.image.cloneNode();
    old.removeAttribute('id');
    old.alt = '';
    old.setAttribute('aria-hidden', 'true');
    old.classList.remove('is-entering');
    old.classList.add('is-leaving');
    this.image.before(old);
    old.addEventListener('animationend', () => old.remove(), { once: true });
  }

  #skinTitle(player, skin) {
    if (skin.nameVi) return skin.nameVi;
    return skin.nameZh === player.nameZh ? T.originalSkin : skin.nameZh;
  }

  #skinButton(player, skin, index, on) {
    const title = this.#skinTitle(player, skin);
    const button = make('button', 'skin');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(on));
    button.setAttribute('aria-label', title);
    button.title = title;
    const img = make('img');
    img.src = skin.cover;
    img.alt = '';
    img.width = img.height = 44;
    img.decoding = 'async';
    button.append(img);
    button.addEventListener('click', () => this.emit('skin', index));
    return button;
  }
}
