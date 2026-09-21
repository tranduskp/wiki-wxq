import { KeywordRepository } from './KeywordRepository.js';
import { KeywordGlossary } from '../domain/KeywordGlossary.js';

/**
 * Reads data/tu-khoa.json, and the keyword icons of data/chi-tiet/bieu-tuong.json when there are any.
 * A missing file means no keyword help or no icons, not a broken page.
 */
export class JsonKeywordRepository extends KeywordRepository {
  constructor(source, imagePolicy) {
    super();
    this.source = source;
    this.imagePolicy = imagePolicy;
  }

  async load() {
    const [entries, emblems] = await Promise.all([
      this.source.get('data/tu-khoa.json', []),
      this.source.get('data/chi-tiet/bieu-tuong.json', {}),
    ]);
    const icons = emblems.tu_khoa ?? {};
    return new KeywordGlossary(
      entries.map((e) => ({ ...e, icon: icons[e.zh] && this.imagePolicy ? this.imagePolicy.asset(icons[e.zh]) : '' })),
    );
  }
}
