/** Contract for whatever supplies the players. `load()` resolves to an array of Player. */
export class PlayerRepository {
  async load() {
    throw new Error(`${this.constructor.name}.load is not implemented`);
  }
}
