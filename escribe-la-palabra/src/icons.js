// Íconos SVG en línea (trazo, heredan currentColor).
const paths = {
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M7 7l10 10M17 7L7 17"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z"/><path d="M4 20.5A2.5 2.5 0 016.5 18H20v3H6.5A2.5 2.5 0 014 20.5z"/>',
  trace: '<path d="M4 18c3-8 5-12 8-12s2 6 5 6 3-3 3-3" stroke-dasharray="2 3"/><circle cx="4" cy="18" r="1.5"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2h2"/>',
  pencil: '<path d="M15.5 4.5l4 4L8 20H4v-4z"/><path d="M13 7l4 4"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0112 7.6 4.2 4.2 0 0119.5 10c0 5.4-7.5 10-7.5 10z"/>',
  cards: '<rect x="3" y="6" width="12" height="15" rx="2"/><path d="M8 3h11a2 2 0 012 2v12"/>',
  notebook: '<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M9 3v18M3 7h4M3 12h4M3 17h4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14l2 2 4-4"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 21l5-3 5 3-1.5-7"/>',
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  apple: '<path d="M12 7c-2-2-7-1.5-7 4 0 4 3 9 5 9 1 0 1.3-.6 2-.6s1 .6 2 .6c2 0 5-5 5-9 0-5.5-5-6-7-4z"/><path d="M12 7c0-2 1-3.5 3-4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 4.6a3.5 3.5 0 010 6.8M18 14a6.5 6.5 0 013.5 6"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>',
  gift: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8S10.5 3.5 8 4.2 7 8 12 8zM12 8s1.5-4.5 4-3.8S17 8 12 8z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
};

export const icon = (name) =>
  `<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || ""}</svg>`;

// Dibujos decorativos a color (no heredan currentColor)
const doodles = {
  star: '<svg viewBox="0 0 60 60" width="60" height="60"><path d="M30 4l7.6 16.4L56 23l-13.3 12.6L46 54 30 45l-16 9 3.3-18.4L4 23l18.4-2.6z" fill="#FFC83D" stroke="#1B355C" stroke-width="2.5" stroke-linejoin="round"/></svg>',
  heart: '<svg viewBox="0 0 60 60" width="60" height="60"><path d="M30 52S6 38 6 21a12 12 0 0124-4 12 12 0 0124 4c0 17-24 31-24 31z" fill="#FF7A59" stroke="#1B355C" stroke-width="2.5" stroke-linejoin="round"/></svg>',
  pencil: '<svg viewBox="0 0 80 80" width="80" height="80"><g transform="rotate(-35 40 40)"><rect x="14" y="32" width="44" height="16" rx="2" fill="#FFC83D" stroke="#1B355C" stroke-width="2.5"/><rect x="8" y="32" width="8" height="16" rx="2" fill="#FF9DB5" stroke="#1B355C" stroke-width="2.5"/><path d="M58 32l14 8-14 8z" fill="#F6DDB5" stroke="#1B355C" stroke-width="2.5" stroke-linejoin="round"/><path d="M68 37.7L72 40l-4 2.3z" fill="#1B355C"/></g></svg>',
};

export const doodle = (name) => doodles[name] || "";
