/**
 * One recommended lineup. Plain data plus a few derived reads; knows nothing about the DOM or the network.
 *
 * `players`  [{ player: Player|null, nameZh, noteVi, noteZh }]: the kỳ thủ that suit it
 * `heroes`   [{ card: Card|null, nameZh, level, role, evolved, x, z, equipment: Card[] }] with board cell x 0..6, z 0..3
 * `phases`   [{ from, to, textVi, textZh, main: Ref[], sub: Ref[] }] where Ref is { card: Card|null, nameZh }
 * `talents` and `effects` are Ref[]; `notes` holds { overview, position, equipment, talent, effect } as { vi, zh }.
 */
export class Lineup {
  constructor({
    code, nameZh, nameVi = '', tags = [], official = false, uses = 0, score = 0, scoreCount = 0, date = '',
    players = [], heroes = [], phases = [], talents = [], effects = [], notes = {},
  }) {
    this.code = code;
    this.nameZh = nameZh;
    this.nameVi = nameVi;
    /** [{ zh, vi }]: the labels shown next to the name, in the source's order. */
    this.tags = tags;
    this.official = official;
    this.uses = uses;
    this.score = score;
    this.scoreCount = scoreCount;
    this.date = date;
    this.players = players;
    this.heroes = heroes;
    this.phases = phases;
    this.talents = talents;
    this.effects = effects;
    this.notes = notes;
  }

  get displayName() {
    return this.nameVi || this.nameZh;
  }

  get isTranslated() {
    return Boolean(this.nameVi);
  }

  /** The text of one note and whether it is the Vietnamese one; null when the lineup has no such note. */
  note(key) {
    const n = this.notes[key];
    if (!n || (!n.vi && !n.zh)) return null;
    return n.vi ? { text: n.vi, vi: true } : { text: n.zh, vi: false };
  }
}
