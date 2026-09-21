/** Contract for whatever supplies the lineups. `load()` resolves to an array of LineupGroup. */
export class LineupRepository {
  async load() {
    throw new Error(`${this.constructor.name}.load is not implemented`);
  }
}
