/**
 * Decides which URL to load for a card image at each size.
 * Contract: both methods take the source URL and return a usable URL string.
 */
export class ImageUrlPolicy {
  /** Small image for the grid. */
  thumb(url, width = 200) {
    throw new Error(`${this.constructor.name}.thumb is not implemented`);
  }

  /** Full-size image for the viewer. */
  full(url) {
    throw new Error(`${this.constructor.name}.full is not implemented`);
  }

  /** An image that belongs to the site's own data (skill icons, faction logos), given as its path under data/anh/. */
  asset(path) {
    throw new Error(`${this.constructor.name}.asset is not implemented`);
  }

  /** Small emblem or rank badge (shown as it is, never cropped). */
  icon(url) {
    throw new Error(`${this.constructor.name}.icon is not implemented`);
  }
}
