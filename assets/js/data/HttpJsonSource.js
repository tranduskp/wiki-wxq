/** Reads JSON documents over HTTP. Replace it to read from anywhere else (a file, a test double). */
export class HttpJsonSource {
  constructor(baseUrl = '', fetchFn = (...args) => fetch(...args)) {
    this.baseUrl = baseUrl;
    this.fetchFn = fetchFn;
  }

  /** Returns the parsed document, or `fallback` when one is given and the read fails. */
  async get(path, fallback) {
    try {
      const res = await this.fetchFn(this.baseUrl + path);
      if (!res.ok) throw new Error(`${res.status} ${path}`);
      return await res.json();
    } catch (err) {
      if (fallback !== undefined) return fallback;
      throw err;
    }
  }
}
