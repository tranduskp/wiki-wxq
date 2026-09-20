/** Copies text to the clipboard, with a fallback for browsers or contexts without the async API. */
export class ClipboardService {
  constructor(win = window) {
    this.win = win;
  }

  /** @returns {Promise<boolean>} whether the text was copied */
  async copy(text) {
    try {
      await this.win.navigator.clipboard.writeText(text);
      return true;
    } catch {
      return this.#legacyCopy(text);
    }
  }

  #legacyCopy(text) {
    const doc = this.win.document;
    const area = doc.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    doc.body.append(area);
    area.select();
    let ok = false;
    try {
      ok = doc.execCommand('copy');
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}
