import { PlayerRepository } from './PlayerRepository.js';

/**
 * Builds the players from data/ky-thu.json (crawled by scripts/crawl_ky_thu.py) and data/dich/ky-thu.json
 * (Vietnamese translations, optional). Order follows the source file.
 */
export class JsonPlayerRepository extends PlayerRepository {
  constructor(source, mapper) {
    super();
    this.source = source;
    this.mapper = mapper;
  }

  async load() {
    const [rows, translations] = await Promise.all([
      this.source.get('data/ky-thu.json'),
      this.source.get('data/dich/ky-thu.json', {}),
    ]);
    const sourceLabels = translations._chung?.nguon ?? {};
    return rows.map((row) => this.mapper.map(row, translations[row.ten_zh], sourceLabels));
  }
}
