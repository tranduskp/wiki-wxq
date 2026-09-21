import { LineupRepository } from './LineupRepository.js';
import { LineupMapper } from './LineupMapper.js';
import { LineupGroup } from '../domain/LineupGroup.js';

/**
 * Builds the lineup groups from data/doi-hinh.json (crawled by scripts/crawl_doi_hinh.py) and
 * data/dich/doi-hinh.json (Vietnamese translations, optional). A lineup can belong to several groups.
 * The catalog and the players are loaded through their own repositories, so a lineup can show their
 * Vietnamese names and images.
 */
export class JsonLineupRepository extends LineupRepository {
  /**
   * @param {object} deps
   * @param {{ get: Function }} deps.source
   * @param {import('./CatalogRepository.js').CatalogRepository} deps.catalogRepository
   * @param {import('./PlayerRepository.js').PlayerRepository} deps.playerRepository
   * @param {Record<string, { name: string, caption?: string, iconName?: string }>} deps.groupMeta  labels per group id
   */
  constructor({ source, catalogRepository, playerRepository, groupMeta }) {
    super();
    this.source = source;
    this.catalogRepository = catalogRepository;
    this.playerRepository = playerRepository;
    this.groupMeta = groupMeta;
  }

  async load() {
    const [data, translations, catalog, players] = await Promise.all([
      this.source.get('data/doi-hinh.json'),
      this.source.get('data/dich/doi-hinh.json', {}),
      this.catalogRepository.load(),
      this.playerRepository.load(),
    ]);
    const mapper = new LineupMapper({ catalog, players });
    const tagLabels = translations._chung?.tag ?? {};
    const lineups = new Map(data.doi_hinh.map((raw) => [raw.ma, mapper.map(raw, translations[raw.ma], tagLabels)]));

    return data.nhom.map((group) => {
      const members = data.doi_hinh
        .filter((raw) => group.id in raw.nhom)
        .sort((a, b) => a.nhom[group.id] - b.nhom[group.id])
        .map((raw) => lineups.get(raw.ma));
      const meta = this.groupMeta[group.id] ?? { name: group.ten_zh };
      return new LineupGroup({ id: group.id, name: meta.name, caption: meta.caption, iconName: meta.iconName, lineups: members });
    });
  }
}
