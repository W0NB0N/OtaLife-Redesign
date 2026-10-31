// Local-calendar helpers. Days roll over at local midnight; weeks run Monday to Sunday.
const pad = (n: number) => String(n).padStart(2, '0');

export const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseDay = (k: string) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const daysBetween = (a: string, b: string) => Math.round((parseDay(b).getTime() - parseDay(a).getTime()) / 864e5);

export const addDays = (k: string, n: number) => {
  const d = parseDay(k);
  d.setDate(d.getDate() + n);
  return dayKey(d);
};

export function weekStart(d = new Date()) {
  const s = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const wd = (s.getDay() + 6) % 7; // Monday = 0
  s.setDate(s.getDate() - wd);
  return s;
}
export const weekKey = (d = new Date()) => dayKey(weekStart(d));

/** fraction of the current week that has elapsed, 0..1 */
export function weekProgress(now = new Date()) {
  const s = weekStart(now).getTime();
  return Math.min(1, Math.max(0, (now.getTime() - s) / (7 * 864e5)));
}

export function untilWeekEnd(now = new Date()) {
  const end = weekStart(now).getTime() + 7 * 864e5;
  const ms = Math.max(0, end - now.getTime());
  const d = Math.floor(ms / 864e5), h = Math.floor((ms % 864e5) / 36e5), m = Math.floor((ms % 36e5) / 6e4);
  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function untilMidnight(now = new Date()) {
  const t = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
  const h = Math.floor(t / 36e5), m = Math.floor((t % 36e5) / 6e4);
  return h ? `${h}h ${m}m` : `${m}m`;
}

export const daysUntil = (k: string, now = new Date()) => daysBetween(dayKey(now), k);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const fmtDay = (k: string) => { const d = parseDay(k); return `${WD[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`; };
export const shortDay = (k: string) => { const d = parseDay(k); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
export const weekdayLetter = (k: string) => WD[parseDay(k).getDay()][0];

export function ago(ts: number, now = Date.now()) {
  const s = Math.max(1, Math.round((now - ts) / 1000));
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)} m`;
  if (s < 86400) return `${Math.floor(s / 3600)} h`;
  return `${Math.floor(s / 86400)} d`;
}

export function greeting(now = new Date()) {
  const h = now.getHours();
  return h < 5 ? 'Konbanwa' : h < 12 ? 'Ohayō' : h < 18 ? 'Konnichiwa' : 'Konbanwa';
}

/* deterministic randomness, seeded from strings like a day key */
export function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rnd: () => number) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');
export const uid = () => Math.random().toString(36).slice(2, 10);
