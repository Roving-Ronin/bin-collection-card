/* All text shown by the card and the editor lives in src/lang/en.json.
 * Day and month names come from Intl in English; dates follow the HA user's English locale
 * when it has one (en-AU → "4 Nov", en-US → "Nov 4"). */
import en from './lang/en.json';

/* English locale for dates: the HA user's locale if it is an English one, otherwise plain English. */
export function dateLocale(hass) {
  const h = hass || document.querySelector('home-assistant')?.hass;
  const raw = String(h?.locale?.language || h?.language || navigator.language || 'en').replace('_', '-');
  return /^en(-|$)/i.test(raw) ? safeLocale(raw) : 'en';
}

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const fill = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? vars[k] : m));

/* t('card.in_days', { n: 3 }) → "In 3 d" */
export function t(path, vars) {
  const v = get(en, path);
  if (v == null) return path;
  return typeof v === 'string' ? fill(v, vars) : v;
}

function safeLocale(l) { try { new Intl.DateTimeFormat(l); return l; } catch { return 'en'; } }

/* 0 = Monday … 6 = Sunday (1 Jan 2024 was a Monday) */
export const weekdayName = (locale, idx, style = 'long') =>
  new Intl.DateTimeFormat(locale, { weekday: style }).format(new Date(2024, 0, 1 + idx));
export const monthName = (locale, m, style = 'long') =>
  new Intl.DateTimeFormat(locale, { month: style }).format(new Date(2024, m - 1, 1));
export const shortDate = (locale, d) =>
  d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
