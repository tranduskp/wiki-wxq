import { Player } from '../domain/Player.js';
import { PlayerCard } from '../domain/PlayerCard.js';

/**
 * Turns one entry of data/ky-thu.json, plus its translation from data/dich/ky-thu.json, into a Player.
 * Image fields in the data are paths under data/anh/; the site serves their webp copies from `imageRoot`.
 */
export class PlayerMapper {
  /**
   * @param {{ imageRoot: string, groupLabels: Record<string, string>, commonSource: string }} options
   *   `groupLabels` maps the Chinese group name (技能, 秘技, 专属) to its Vietnamese label. `commonSource` is the
   *   source note that almost every card has; it is not repeated on each card.
   */
  constructor({ imageRoot, groupLabels, commonSource = '' }) {
    this.imageRoot = imageRoot;
    this.groupLabels = groupLabels;
    this.commonSource = commonSource;
  }

  #image(path) {
    return path ? `${this.imageRoot}${path.replace(/\.(png|jpe?g)$/i, '.webp')}` : '';
  }

  #card(raw, translation = {}, sourceLabels = {}) {
    const notable = raw.nguon_zh && raw.nguon_zh !== this.commonSource;
    return new PlayerCard({
      id: raw.id,
      nameZh: raw.ten_zh,
      nameVi: translation.ten || '',
      descZh: raw.mo_ta_zh || '',
      descVi: translation.mo_ta || '',
      icon: this.#image(raw.icon),
      source: notable ? (sourceLabels[raw.nguon_zh] ?? raw.nguon_zh) : '',
    });
  }

  map(raw, translation = {}, sourceLabels = {}) {
    const cardText = translation.the ?? {};
    const skinText = translation.trang_phuc ?? {};
    return new Player({
      id: raw.ten_zh,
      nameZh: raw.ten_zh,
      nameVi: translation.ten || '',
      nameEn: raw.ten_en || '',
      quoteZh: raw.cau_noi_zh || '',
      quoteVi: translation.cau_noi || '',
      avatar: this.#image(raw.avatar),
      skins: raw.trang_phuc.map((s) => ({
        nameZh: s.ten_zh,
        nameVi: skinText[s.ten_zh] || '',
        cover: this.#image(s.bia),
        banner: this.#image(s.kv),
      })),
      groups: raw.ky_nang.map((g) => ({
        key: g.nhom_zh,
        label: this.groupLabels[g.nhom_zh] ?? g.nhom_zh,
        icon: this.#image(g.icon),
        cards: g.the.map((c) => this.#card(c, cardText[c.ten_zh], sourceLabels)),
      })),
      cards: raw.bai.map((c) => this.#card(c, cardText[c.ten_zh], sourceLabels)),
    });
  }
}
