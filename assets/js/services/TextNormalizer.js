/** Makes text comparable regardless of Vietnamese diacritics and case. */
export class TextNormalizer {
  /** "Trục Lộc" and "truc loc" fold to the same string. */
  fold(text) {
    return text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase();
  }
}
