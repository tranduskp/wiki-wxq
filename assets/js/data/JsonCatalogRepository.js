import { CatalogRepository } from './CatalogRepository.js';
import { Catalog } from '../domain/Catalog.js';
import { CardKind } from '../domain/CardKind.js';

/**
 * Builds the Catalog from data/nhom.json (kinds, in order, with their group labels),
 * data/bai/<loai>.json (cards), data/dich/<loai>.json (Vietnamese translations, optional) and
 * data/chi-tiet/<loai>.json (crawled skills and stats, optional; today only for heroes).
 * Adding a kind means adding a block to nhom.json and the two files, with no code change.
 */
export class JsonCatalogRepository extends CatalogRepository {
  /** `imagePolicy` turns the emblem paths of data/chi-tiet/bieu-tuong.json into URLs. */
  constructor(source, cardMapper, imagePolicy) {
    super();
    this.source = source;
    this.cardMapper = cardMapper;
    this.imagePolicy = imagePolicy;
  }

  async load() {
    const [meta, emblems] = await Promise.all([
      this.source.get('data/nhom.json'),
      this.source.get('data/chi-tiet/bieu-tuong.json', {}),
    ]);
    const kinds = await Promise.all(Object.entries(meta).map(([id, info]) => this.#loadKind(id, info, emblems)));
    return new Catalog(kinds);
  }

  async #loadKind(id, info, emblems) {
    const [rows, translations, details] = await Promise.all([
      this.source.get(`data/bai/${id}.json`),
      this.source.get(`data/dich/${id}.json`, {}),
      this.source.get(`data/chi-tiet/${id}.json`, {}),
    ]);
    // `logoNhom` in nhom.json names the section of bieu-tuong.json that holds this kind's group emblems
    const logos = Object.fromEntries(
      Object.entries(emblems[info.logoNhom] ?? {}).map(([key, path]) => [key, this.imagePolicy.asset(path)]),
    );
    const cards = rows.map((row) => {
      const name = row.ten_tuong_hoac_the;
      return this.cardMapper.map(id, row, info, translations[name], { detail: details[name], logo: logos[row.ten_khu_vuc] });
    });
    return CardKind.assemble({
      id,
      name: info.ten,
      groupKind: info.loaiNhom,
      groupLabels: info.nhom,
      groupLogos: logos,
      cards,
      caption: info.phuDe,
      iconName: info.bieuTuong,
    });
  }
}
