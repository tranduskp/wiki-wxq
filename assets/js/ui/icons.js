/** Line icons (24px grid, 1.6px round strokes) used by name from data. Add a key here to give a new card kind an icon. */
const PATHS = {
  hero: '<rect x="5" y="3.5" width="14" height="17" rx="3"/><circle cx="12" cy="10" r="2.6"/><path d="M7.8 17.5c.8-2.2 2.4-3.3 4.2-3.3s3.4 1.1 4.2 3.3"/>',
  talent: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="10.4" r="2.6"/><path d="M7.6 17.6c.9-2 2.5-3 4.4-3s3.5 1 4.4 3"/><path d="M12 1.8v1.6M12 20.6v1.6"/>',
  equipment: '<path d="M12 3.4 19 6v5.6c0 4.2-2.8 7.4-7 9-4.2-1.6-7-4.8-7-9V6z"/><path d="M12 7.6v7.4M9.4 10.4h5.2"/>',
  health: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  mana: '<path d="M12 3.5s6 6.2 6 10.4a6 6 0 0 1-12 0C6 9.7 12 3.5 12 3.5z"/>',
  physAttack: '<path d="M19.5 4.5h-5L5 14l-1 5 5-1 9.5-9.5z"/><path d="m7.5 16.5-2 2"/>',
  magAttack: '<path d="m5 19 9-9"/><path d="M14 4v4M12 6h4"/><path d="M18 11v3M16.5 12.5h3"/>',
  physDefense: '<path d="M12 3.4 19 6v5.6c0 4.2-2.8 7.4-7 9-4.2-1.6-7-4.8-7-9V6z"/>',
  magDefense: '<path d="M12 3.4 19 6v5.6c0 4.2-2.8 7.4-7 9-4.2-1.6-7-4.8-7-9V6z"/><circle cx="12" cy="11.2" r="2.4"/>',
  critRate: '<circle cx="12" cy="12" r="6.5"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>',
  critEffect: '<path d="m12 3 2.2 6.3L21 12l-6.8 2.7L12 21l-2.2-6.3L3 12l6.8-2.7z"/>',
  attackSpeed: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  range: '<path d="M4 12h16M4 12l3-3M4 12l3 3M20 12l-3-3M20 12l-3 3"/>',
  star:'<path d="m12 3.6 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/>',
  sprout:'<path d="M12 20v-8"/><path d="M12 12c0-3.6-2.6-5.6-6.5-5.6 0 3.8 2.6 5.6 6.5 5.6z"/><path d="M12 14c0-3 2.2-5 5.5-5 0 3.2-2.2 5-5.5 5z"/>',
  stack: '<path d="m12 4 8.5 4.4L12 12.8 3.5 8.4z"/><path d="m3.5 12.4 8.5 4.4 8.5-4.4"/><path d="m3.5 16.4 8.5 4.4 8.5-4.4"/>',
  flame: '<path d="M12 3.4c.6 3 4.6 5 4.6 9.2a4.6 4.6 0 0 1-9.2 0c0-1.7.8-2.8 1.6-3.8.4 1.4 1.2 2 2 2.2-.3-2.8-.3-5 1-7.6z"/>',
  effect: '<path d="M12 3.4a8.6 8.6 0 0 1 8 5.6"/><path d="M20.6 12a8.6 8.6 0 0 1-5.6 8"/><path d="M12 20.6a8.6 8.6 0 0 1-8-5.6"/><path d="M3.4 12A8.6 8.6 0 0 1 9 4"/><circle cx="12" cy="12" r="2.6"/>',
};

export function iconSvg(name, className = 'icon') {
  const body = PATHS[name] ?? '<circle cx="12" cy="12" r="6"/>';
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
}
