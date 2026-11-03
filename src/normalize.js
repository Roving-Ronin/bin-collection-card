/* Config values: canonical names plus a few English synonyms. */

const table = groups => {
  const out = {};
  for (const [canon, aliases] of Object.entries(groups)) for (const a of [canon, ...aliases]) out[a] = canon;
  return out;
};

/* Display order: the three bins every Australian household has, then glass, paper, others */
export const BIN_ALIASES = table({
  red: [],
  yellow: [],
  green: ['lime'],
  purple: ['violet', 'mauve'],
  blue: [],
  grey: ['gray'],
  black: [],
});
export const BINS = ['red', 'yellow', 'green', 'purple', 'blue', 'grey', 'black'];

export const CONTAINER_ALIASES = table({
  wheelie_bin: ['bin', 'wheelie'],
  bag: ['bags'],
  bulky: ['bulky_waste'],
});
export const CONTAINERS = ['wheelie_bin', 'bag', 'bulky'];

export const WEEKS_ALIASES = table({
  all: ['every'],
  even: [],
  odd: [],
});
export const WEEKS = ['all', 'even', 'odd'];

export const HOLIDAY_ALIASES = table({
  none: ['ignore', 'off'],
  next_day: [],
  next_work_day: ['next_workday', 'next_working_day'],
  shift_week: ['skip_week', 'next_week'],
  shift_rest_of_week: [],
  cancel: ['skip'],
});
export const HOLIDAY_MODES = ['none', 'next_day', 'next_work_day', 'shift_week', 'shift_rest_of_week', 'cancel'];
export const HOLIDAY_NEEDS_WORKDAY = new Set(['next_work_day']);

export const DAY_NAMES = {
  monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6,
  mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6,
};
export const MONTH_NAMES = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
};

const lower = v => String(v ?? '').trim().toLowerCase();
const isName = v => typeof v === 'string' && v.trim() !== '' && isNaN(v);
export const parseDay = d => (isName(d) ? DAY_NAMES[lower(d)] : Number(d));
export const parseMonth = m => (isName(m) ? MONTH_NAMES[lower(m)] : Number(m));

export const normBin = v => BIN_ALIASES[lower(v)];
export const normContainer = v => (v == null || v === '' ? undefined : CONTAINER_ALIASES[lower(v)]);
export const normWeeks = v => (v == null || v === '' ? undefined : WEEKS_ALIASES[lower(v)]);
export const normHolidays = v => (v == null || v === '' ? undefined : HOLIDAY_ALIASES[lower(v)]);

/* Returns a copy of the config with canonical values (unknown values are left as written,
   so setConfig can report them). Used by both the card and the visual editor. */
export function normalizeConfig(c) {
  const out = { ...c };
  if (out.bin != null) out.bin = normBin(out.bin) ?? out.bin;
  for (const [k, fn] of [['container', normContainer], ['weeks', normWeeks], ['holidays', normHolidays]]) {
    if (out[k] == null || out[k] === '') continue;
    const v = fn(out[k]);
    if (v) out[k] = v;
  }
  if (out.container === 'wheelie_bin') delete out.container; // default
  if (out.weeks === 'all') delete out.weeks;                 // default
  if (out.holidays === 'none') delete out.holidays;          // default
  return out;
}
