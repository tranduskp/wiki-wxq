/** Contract for whatever supplies the game keywords. `load()` resolves to a KeywordGlossary. */
export class KeywordRepository {
  async load() {
    throw new Error(`${this.constructor.name}.load is not implemented`);
  }
}
