/** One tab of the lineup page (Người mới, Tổng hợp, Hot) and its lineups, in the order of the source. */
export class LineupGroup {
  constructor({ id, name, caption = '', iconName = '', lineups }) {
    this.id = id;
    this.name = name;
    /** Small English caption shown under the name in the tab. */
    this.caption = caption;
    /** Name of the icon in ui/icons.js. */
    this.iconName = iconName;
    this.lineups = lineups;
  }

  get size() {
    return this.lineups.length;
  }

  find(code) {
    return this.lineups.find((l) => l.code === code) ?? null;
  }
}
