import { make } from '../core/dom.js';
import { STRINGS as T } from './strings.js';

/**
 * A hero of a lineup as a small portrait with the game's role badge (ACE, shield, lightning) and a bright frame
 * when the hero is awakened. Built with the same markup as the Tra cứu tiles, so it shares their portrait crop.
 */
export class LineupHeroChip {
  /**
   * @param {{ card: object|null, nameZh: string, role?: number, evolved?: boolean }} hero
   * @param {Record<number, string>} roleIcons  role number -> badge image URL
   */
  static build(hero, roleIcons, { showName = false } = {}) {
    const name = hero.card?.displayName ?? hero.nameZh;
    const chip = make('span', `hchip${hero.evolved ? ' is-evo' : ''}`);
    chip.title = hero.card?.isTranslated ? `${name} (${hero.nameZh})` : hero.nameZh;

    const face = make('span', 'tile-face is-loading');
    face.dataset.ch = hero.nameZh.charAt(0);
    if (hero.card?.thumb) {
      const img = new Image();
      img.className = 'tile-img';
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('load', () => face.classList.remove('is-loading'));
      img.addEventListener('error', () => {
        face.classList.remove('is-loading');
        face.classList.add('is-broken');
      });
      img.src = hero.card.thumb;
      face.append(img);
    } else {
      face.classList.remove('is-loading');
      face.classList.add('is-broken');
    }
    const art = make('span', 'tile-art');
    art.append(face);
    chip.append(art);

    if (hero.role && roleIcons[hero.role]) {
      const badge = new Image();
      badge.className = 'hchip-role';
      badge.src = roleIcons[hero.role];
      badge.alt = T.roleLabels[hero.role] ?? '';
      badge.width = badge.height = 20;
      badge.decoding = 'async';
      chip.append(badge);
    }
    if (showName) {
      const label = make('span', 'hchip-name', name);
      if (!hero.card?.isTranslated) label.lang = 'zh-Hans';
      chip.append(label);
    }
    return chip;
  }
}
