import { ImageUrlPolicy } from './ImageUrlPolicy.js';
import { HttpJsonSource } from './HttpJsonSource.js';

/**
 * Serves the webp copies in data/anh/web/ (made by scripts/tao_anh_web.py) instead of the Tencent links
 * in data/bai. `fileByUrl` is data/anh/theo-url.json: source URL to the PNG path under data/anh/. A URL with
 * no local copy is returned unchanged, so a missing file falls back to the original link instead of breaking.
 */
export class LocalImagePolicy extends ImageUrlPolicy {
  constructor(fileByUrl, root = 'data/anh/web/') {
    super();
    this.fileByUrl = fileByUrl;
    this.root = root;
  }

  /** Reads the URL map through `source` and builds the policy. An unreadable map means "no local copies". */
  static async load(source, root) {
    return new LocalImagePolicy(await source.get('data/anh/theo-url.json', {}), root);
  }

  #local(url, suffix) {
    const file = this.fileByUrl[url];
    return file ? `${this.root}${file.replace(/\.png$/, suffix)}` : url;
  }

  thumb(url) {
    return this.#local(url, '.thumb.webp');
  }

  full(url) {
    return this.#local(url, '.webp');
  }

  icon(url) {
    return this.#local(url, '.webp');
  }

  asset(path) {
    return `${this.root}${path.replace(/\.png$/, '.webp')}`;
  }
}
