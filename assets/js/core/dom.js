/** Small DOM helpers shared by the UI classes. */

/** Like querySelector, but fails loudly when the page markup and the code disagree. */
export function must(selector, root = document) {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el;
}

/** Restarts a CSS animation that a class starts, by removing the class, forcing a reflow and adding it back. */
export function replay(el, className) {
  replayAll([el], className);
}

/** Restarts the animation on several elements with a single forced reflow instead of one each. */
export function replayAll(els, className) {
  for (const el of els) el.classList.remove(className);
  void document.documentElement.offsetWidth;
  for (const el of els) el.classList.add(className);
}

export function make(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text != null) el.textContent = text;
  return el;
}
