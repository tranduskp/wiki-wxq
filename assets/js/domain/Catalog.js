/** Every card kind of the wiki, in display order. */
export class Catalog {
  #byId;

  constructor(kinds) {
    this.kinds = kinds;
    this.#byId = new Map(kinds.map((k) => [k.id, k]));
  }

  get defaultKindId() {
    return this.kinds[0].id;
  }

  has(kindId) {
    return this.#byId.has(kindId);
  }

  kind(kindId) {
    return this.#byId.get(kindId);
  }

  /** An unknown or missing id falls back to the first kind. */
  resolveKindId(kindId) {
    return this.has(kindId) ? kindId : this.defaultKindId;
  }

  findCard(kindId, cardId) {
    return this.#byId.get(kindId)?.find(cardId) ?? null;
  }
}
