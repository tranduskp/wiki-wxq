import { ImageUrlPolicy } from './ImageUrlPolicy.js';

const CARD_HOST = 'staticimage-prod.osgame.qq.com';

/**
 * Uses the Tencent card CDN's image processing (imageMogr2) for small webp thumbnails and a lighter
 * full-size webp. URLs on other hosts are returned untouched. The parameter is not a documented
 * promise, so swap this class for a self-hosted policy if it ever stops working.
 */
export class TencentImagePolicy extends ImageUrlPolicy {
  #isCard(url) {
    return url.includes(CARD_HOST);
  }

  thumb(url, width = 200) {
    return this.#isCard(url) ? `${url}?imageMogr2/thumbnail/${width}x/format/webp/quality/75` : url;
  }

  full(url) {
    return this.#isCard(url) ? `${url}?imageMogr2/format/webp/quality/90` : url;
  }

  icon(url) {
    return url;
  }
}
