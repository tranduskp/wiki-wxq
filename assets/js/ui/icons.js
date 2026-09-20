/** Line icons (24px grid, 1.6px round strokes) used by name from data. Add a key here to give a new card kind an icon. */
const PATHS = {
  hero: '<rect x="5" y="3.5" width="14" height="17" rx="3"/><circle cx="12" cy="10" r="2.6"/><path d="M7.8 17.5c.8-2.2 2.4-3.3 4.2-3.3s3.4 1.1 4.2 3.3"/>',
  talent: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="10.4" r="2.6"/><path d="M7.6 17.6c.9-2 2.5-3 4.4-3s3.5 1 4.4 3"/><path d="M12 1.8v1.6M12 20.6v1.6"/>',
  equipment: '<path d="M12 3.4 19 6v5.6c0 4.2-2.8 7.4-7 9-4.2-1.6-7-4.8-7-9V6z"/><path d="M12 7.6v7.4M9.4 10.4h5.2"/>',
  effect: '<path d="M12 3.4a8.6 8.6 0 0 1 8 5.6"/><path d="M20.6 12a8.6 8.6 0 0 1-5.6 8"/><path d="M12 20.6a8.6 8.6 0 0 1-8-5.6"/><path d="M3.4 12A8.6 8.6 0 0 1 9 4"/><circle cx="12" cy="12" r="2.6"/>',
};

export function iconSvg(name, className = 'icon') {
  const body = PATHS[name] ?? '<circle cx="12" cy="12" r="6"/>';
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
}
