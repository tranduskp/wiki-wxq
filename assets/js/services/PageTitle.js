/** Keeps the browser tab title in step with what is on screen. */
export class PageTitle {
  constructor(doc, siteName) {
    this.doc = doc;
    this.siteName = siteName;
  }

  forKind(kind) {
    this.doc.title = `${kind.name} · Tra cứu · ${this.siteName}`;
  }

  forCard(card, kind) {
    this.doc.title = `${card.displayName} · ${kind.name} · ${this.siteName}`;
  }

  forLineup(groupName, lineup) {
    const head = lineup ? `${lineup.displayName} · ` : '';
    this.doc.title = `${head}${groupName} · Đội hình · ${this.siteName}`;
  }

  forPlayer(player, sectionName) {
    this.doc.title = `${player.displayName} · ${sectionName} · ${this.siteName}`;
  }
}
