import { CatalogRepository } from './CatalogRepository.js';
import { Catalog } from '../domain/Catalog.js';
import { CardKind } from '../domain/CardKind.js';

/**
 * Builds the Catalog from data/nhom.json (kinds, in order, with their group labels),
 * data/bai/<loai>.json (cards) and data/dich/<loai>.json (Vietnamese translations, optional).
 * Adding a kind means adding a block to nhom.json and the two files, with no code change.
 */
export class JsonCatalogRepository extends CatalogRepository {
  constructor(source, cardMapper) {
    super();
    this.source = source;
    this.cardMapper = cardMapper;
  }

  async load() {
    const meta = await this.source.get('data/nhom.json');
    const kinds = await Promise.all(Object.entries(meta).map(([id, info]) => this.#loadKind(id, info)));
    return new Catalog(kinds);
  }

  async #loadKind(id, info) {
    const [rows, translations] = await Promise.all([
      this.source.get(`data/bai/${id}.json`),
      this.source.get(`data/dich/${id}.json`, {}),
    ]);
    const cards = rows.map((row) => this.cardMapper.map(id, row, info, translations[row.ten_tuong_hoac_the]));
    return CardKind.assemble({
      id,
      name: info.ten,
      groupKind: info.loaiNhom,
      groupLabels: info.nhom,
      cards,
      caption: info.phuDe,
      iconName: info.bieuTuong,
    });
  }
}
