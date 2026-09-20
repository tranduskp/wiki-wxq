/** Where the Catalog comes from. The app depends on this contract, not on JSON files. */
export class CatalogRepository {
  /** @returns {Promise<import('../domain/Catalog.js').Catalog>} */
  async load() {
    throw new Error(`${this.constructor.name}.load is not implemented`);
  }
}
