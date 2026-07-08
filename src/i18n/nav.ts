// Primary navigation, data-driven so later changes add an entry without editing markup.
// Paths are the logical (zh) paths; localizedUrl() applies the /en prefix per locale.
export interface NavItem {
  key: string; // i18n string key
  path: string; // logical (zh) path
}

export const navItems: NavItem[] = [
  { key: 'nav.routes', path: '/routes' },
  { key: 'nav.vehicles', path: '/vehicles' },
  { key: 'nav.drivers', path: '/drivers' },
  { key: 'nav.testimonials', path: '/testimonials' },
  { key: 'nav.faq', path: '/faq' },
  { key: 'nav.about', path: '/about' },
  { key: 'nav.contact', path: '/contact' },
];
