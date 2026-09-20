import { Card } from '../domain/Card.js';

// Wide enough to stay sharp on 2x screens where a tile shows only the art part of the card.
const THUMB_WIDTH = 320;

/**
 * Turns one row of data/bai/<loai>.json, plus its optional translation, into a Card.
 * Row fields: ten_tuong_hoac_the (Chinese name), ten_khu_vuc (group), anh_icon, anh_card (url or urls).
 */
export class CardMapper {
  constructor(imagePolicy) {
    this.imagePolicy = imagePolicy;
  }

  /** `ban` is keyed by 1-based version number ("2", "3"...); Card wants 0-based indexes. */
  #variantTexts(ban = {}) {
    const texts = {};
    for (const [number, entry] of Object.entries(ban)) {
      texts[Number(number) - 1] = { name: entry.ten || '', desc: entry.mo_ta || '' };
    }
    return texts;
  }

  map(kindId, row, kindMeta, translation = {}) {
    const images = Array.isArray(row.anh_card) ? row.anh_card : [row.anh_card];
    // "icon" kinds ship a real emblem in anh_icon; the others only a small rank badge, so their
    // thumbnail comes from the card image itself.
    const emblem = kindMeta.anhDaiDien === 'icon';
    return new Card({
      kindId,
      id: row.ten_tuong_hoac_the,
      groupKey: row.ten_khu_vuc,
      groupLabel: kindMeta.nhom[row.ten_khu_vuc] ?? row.ten_khu_vuc,
      nameZh: row.ten_tuong_hoac_the,
      nameVi: translation.ten || '',
      descVi: translation.mo_ta || '',
      variantTexts: this.#variantTexts(translation.ban),
      sample: Boolean(translation.mau),
      images,
      thumb: emblem ? this.imagePolicy.icon(row.anh_icon) : this.imagePolicy.thumb(images[0], THUMB_WIDTH),
      badge: emblem ? '' : this.imagePolicy.icon(row.anh_icon),
      emblem,
    });
  }
}
