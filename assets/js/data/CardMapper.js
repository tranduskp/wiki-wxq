import { Card } from '../domain/Card.js';
import { HeroProfile } from '../domain/HeroProfile.js';

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

  /**
   * Builds the HeroProfile of a hero from data/chi-tiet/anh-hung.json and the `ky_nang` block of its translation.
   * The stats keep the order of the game's own attribute list.
   */
  #profile(detail, translation) {
    const skillText = translation.ky_nang ?? {};
    const skill = detail.ky_nang ?? {};
    const stats = detail.chi_so ?? {};
    return new HeroProfile({
      skill: {
        nameZh: skill.ten_zh ?? '',
        nameVi: skillText.ten || '',
        descZh: skill.mo_ta_zh ?? '',
        descVi: skillText.mo_ta || '',
        icon: skill.icon ? this.imagePolicy.asset(skill.icon) : '',
        upgrades: (skill.nang_cap ?? []).map((u, i) => ({
          level: u.cap,
          textVi: skillText.nang_cap?.[i] || '',
          textZh: u.mo_ta_zh ?? '',
        })),
      },
      stats: [
        { key: 'health', value: stats.mau, suffix: '' },
        { key: 'mana', value: `${stats.phap_luc_dau}/${stats.phap_luc_max}`, suffix: '' },
        { key: 'physAttack', value: stats.cong_vat_ly, suffix: '' },
        { key: 'magAttack', value: stats.cong_phap_thuat, suffix: '' },
        { key: 'physDefense', value: stats.thu_vat_ly, suffix: '' },
        { key: 'magDefense', value: stats.thu_phap_thuat, suffix: '' },
        { key: 'critRate', value: stats.ti_le_chi_mang, suffix: '%' },
        { key: 'critEffect', value: stats.hieu_qua_chi_mang, suffix: '%' },
        { key: 'attackSpeed', value: stats.toc_do_danh, suffix: '' },
        { key: 'range', value: stats.tam_danh, suffix: '' },
      ],
      variants: (detail.phien_ban ?? []).map((v) => ({ kind: v.loai, afterAwakening: Boolean(v.sau_thuc_tinh) })),
    });
  }

  /** @param {{ detail?: object, logo?: string }} extras  the hero's crawled detail and its group's logo URL */
  map(kindId, row, kindMeta, translation = {}, extras = {}) {
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
      groupLogo: extras.logo ?? '',
      profile: extras.detail ? this.#profile(extras.detail, translation) : null,
    });
  }
}
