import { Lineup } from '../domain/Lineup.js';

/**
 * Turns one entry of data/doi-hinh.json, plus its translation from data/dich/doi-hinh.json, into a Lineup.
 * Heroes, gear, talents, effects and kỳ thủ are stored by Chinese name; they are looked up in the catalog and
 * the players so every one of them shows the Vietnamese name and image already made for the other pages.
 */
export class LineupMapper {
  static #KIND = { hero: 'anh-hung', equipment: 'trang-bi', talent: 'thien-phu', effect: 'hieu-ung' };

  /**
   * @param {{ catalog: import('../domain/Catalog.js').Catalog, players: import('../domain/Player.js').Player[], tagLabels?: Record<string, string> }} deps
   */
  constructor({ catalog, players }) {
    this.catalog = catalog;
    this.playersByName = new Map(players.map((p) => [p.nameZh, p]));
  }

  #card(kind, nameZh) {
    return this.catalog.findCard(LineupMapper.#KIND[kind], nameZh);
  }

  #ref(kind, nameZh) {
    return { card: this.#card(kind, nameZh), nameZh };
  }

  map(raw, translation = {}, tagLabels = {}) {
    const say = (key) => ({ vi: translation[key] || '', zh: raw[`${key}_zh`] || '' });
    const playerNotes = translation.ky_thu ?? {};
    const phaseText = translation.giai_doan ?? [];
    const tagsZh = [...new Set([raw.tag_zh, ...(raw.the_zh ?? [])].filter(Boolean))];

    return new Lineup({
      code: raw.ma,
      nameZh: raw.ten_zh,
      nameVi: translation.ten || '',
      tags: tagsZh.map((zh) => ({ zh, vi: tagLabels[zh] || '' })),
      official: raw.chinh_thuc,
      uses: raw.luot_dung,
      score: raw.diem,
      scoreCount: raw.so_danh_gia,
      date: raw.ngay,
      players: raw.ky_thu.map((k) => ({
        player: this.playersByName.get(k.ten_zh) ?? null,
        nameZh: k.ten_zh,
        noteVi: playerNotes[String(k.id)] || '',
        noteZh: k.ghi_chu_zh || '',
      })),
      heroes: raw.tuong.map((h) => ({
        card: this.#card('hero', h.ten_zh),
        nameZh: h.ten_zh,
        level: h.cap,
        role: h.loai,
        evolved: h.tien_hoa,
        x: h.x,
        z: h.z,
        equipment: h.trang_bi.map((name) => this.#card('equipment', name)).filter(Boolean),
      })),
      phases: raw.giai_doan.map((g, i) => ({
        from: g.tu_vong,
        to: g.den_vong,
        textVi: phaseText[i] || '',
        textZh: g.mo_ta_zh || '',
        main: g.chinh.map((n) => this.#ref('hero', n)),
        sub: g.phu.map((n) => this.#ref('hero', n)),
      })),
      talents: raw.thien_phu.map((n) => this.#ref('talent', n)),
      effects: raw.hieu_ung.map((n) => this.#ref('effect', n)),
      notes: {
        overview: say('tong_quan'),
        position: say('vi_tri'),
        equipment: say('trang_bi'),
        talent: say('thien_phu'),
        effect: say('hieu_ung'),
      },
    });
  }
}
