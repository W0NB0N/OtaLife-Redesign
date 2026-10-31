/* Ōta Life · core: state, Ōra economy, navigation, overlays, rewards feedback, cutscene, tour */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => Math.round(n).toLocaleString('en-IN');
const wait = ms => new Promise(r => setTimeout(r, ms));
const pick = a => a[Math.floor(Math.random() * a.length)];
const M = window.Mascot;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- icons (24px grid, round strokes) ---------- */
const ic = (d, w = 2.2, extra = '') => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const I = {
  home: ic('<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>'),
  discover: ic('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
  battle: ic('<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>'),
  stage: ic('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'),
  me: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
  inbox: ic('<path d="M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>'),
  back: ic('<path d="M15 5l-7 7 7 7"/>', 2.6),
  close: ic('<path d="M6 6l12 12M18 6L6 18"/>', 2.6),
  check: ic('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 3),
  ticket: ic('<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/>'),
  chev: ic('<path d="M9 5l7 7-7 7"/>', 2.6),
  lock: ic('<rect x="5" y="11" width="14" height="10" rx="3"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  play: '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="currentColor"/></svg>',
  search: ic('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
  plus: ic('<path d="M12 5v14M5 12h14"/>', 2.6),
  bag: ic('<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>'),
  qr: ic('<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2"/>'),
  calendar: ic('<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>'),
  pin: ic('<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  users: ic('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .7 3.2 2.2 3.6 5"/>'),
  sparkle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" fill="#D5F45A"/></svg>',
  flame: '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1.2 4.4 6 5.6 6 11a6 6 0 0 1-12 0c0-3.4 2.2-4.6 2.2-7.8 1.7 1.1 3.3 2.8 3.3 4.4.6-2.3 0-5.4.5-7.6z" fill="#FF8A3D"/></svg>'
};

/* ---------- ranks: Power thresholds, bosses, frames, perks ---------- */
const RANKS = [
  { id: 'shoshinsha', name: 'Shoshinsha', en: 'Beginner', min: 0, fr: 'fr0', boss: null, cap: 0, cheers: 3, perks: ['3 Cheers a day', 'Plain paper frame'] },
  { id: 'kohai', name: 'Kōhai', en: 'Junior', min: 500, fr: 'fr1', boss: 'kappa', cap: 5, cheers: 3, perks: ['Sakura frame', 'Your title shows on comments', 'Use Ōra for up to 5% off'] },
  { id: 'senpai', name: 'Senpai', en: 'Senior', min: 3000, fr: 'fr2', boss: 'tanuki', cap: 10, cheers: 4, perks: ['Teal ribbon frame', '4 Cheers a day', 'Rare+ pulls with Ōra', 'One free Standard pull a week', 'Use Ōra for up to 10% off'] },
  { id: 'otaku', name: 'Otaku', en: 'True fan', min: 10000, fr: 'fr3', boss: 'tengu', cap: 15, cheers: 4, perks: ['Akiba neon frame', 'Submit Fan Council ideas', '24 h early ticket access', 'Up to 15% off'] },
  { id: 'sensei', name: 'Sensei', en: 'Master', min: 25000, fr: 'fr4', boss: 'oni', cap: 20, cheers: 5, perks: ['Gold brush frame', 'Priority entry lane', 'Legend ticket every rank-up', 'Up to 20% off'] },
  { id: 'shogun', name: 'Shōgun', en: 'Warlord', min: 60000, fr: 'fr5', boss: 'yuki', cap: 25, cheers: 5, perks: ['Kabuto crest frame', 'Meet-and-greet raffle entry per event', 'Up to 25% off'] },
  { id: 'kami', name: 'Kami', en: 'Legend', min: 120000, fr: 'fr6', boss: 'daimao', cap: 25, cheers: 6, perks: ['Living aura frame', '6 Cheers a day', 'One free General Pass per festival'] }
];
const rankIdx = p => { let i = 0; RANKS.forEach((r, k) => { if (p >= r.min) i = k; }); return i; };
function starsOf(p) {
  const i = rankIdx(p), r = RANKS[i], nx = RANKS[i + 1];
  if (!nx) return { i, stars: 3, next: null, from: r.min, to: r.min, pct: 1 };
  const step = (nx.min - r.min) / 3;
  const stars = Math.min(3, 1 + Math.floor((p - r.min) / step));
  const from = r.min + step * (stars - 1), to = stars < 3 ? r.min + step * stars : nx.min;
  return { i, stars, step, from, to, pct: (p - from) / (to - from), next: nx, toRank: nx.min - p };
}
const starStr = n => '★'.repeat(n);
const title = (p = S.power) => `${RANKS[rankIdx(p)].name} ${starStr(starsOf(p).stars)}`;

/* ---------- state ---------- */
const TODAY_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DEMO = () => ({
  v: 3, onboarded: true, name: 'Ria', partner: 'puri',
  power: 2860, wallet: 1240, todayOra: 0, weekOra: 1910,
  tickets: { std: 2, rare: 1, legend: 0 }, pity: { std: 7, rare: 4, legend: 0 },
  streak: 6, doneToday: false, mileFresh: false, shields: 1, streakPreview: null,
  cheers: 3, quests: { checkin: false, challenge: false, reels: 0 }, boardClaimed: false,
  jar: 0, wordDone: false, beaten: ['kappa'],
  cabinet: [{ id: 'st-gg', at: 1 }, { id: 'cp-15', at: 2 }],
  reacts: { p1: 'taku' }, joined: { jjk: true, nihongo: true },
  ideas: { arcade: 64, plush: 382, repair: 99 }, myCheers: {}, poll: null,
  inboxRead: false, tix: [], played: {}, size: null, events: 0
});
const FRESH = () => Object.assign(DEMO(), {
  onboarded: false, power: 0, wallet: 0, weekOra: 0, tickets: { std: 0, rare: 0, legend: 0 }, pity: { std: 0, rare: 0, legend: 0 },
  streak: 0, shields: 0, beaten: [], cabinet: [], reacts: {}, joined: {}, partner: 'momo'
});
let S;
function load() { try { const raw = localStorage.getItem('ota-life'); if (raw) { const o = JSON.parse(raw); if (o.v === 3) return o; } } catch (e) {} return null; }
function save() { try { localStorage.setItem('ota-life', JSON.stringify(S)); } catch (e) {} }
const streakMult = () => S.streak >= 100 ? 1.5 : S.streak >= 30 ? 1.3 : S.streak >= 7 ? 1.2 : S.streak >= 3 ? 1.1 : 1;
const nextMult = () => [[3, 1.1], [7, 1.2], [30, 1.3], [100, 1.5]].find(([d]) => S.streak < d);

/* ---------- navigation ---------- */
const SCREENS = {}, AFTER = {}, ACT = {};
const NAV = { tab: 'home', stack: [] };
const TABS = [
  { id: 'discover', label: 'Discover', icon: 'discover', c: 'var(--taku)' },
  { id: 'battle', label: 'Battle', icon: 'battle', c: 'var(--puri)' },
  { id: 'home', label: 'Home', icon: 'home', c: 'var(--lime)' },
  { id: 'stage', label: 'Stage', icon: 'stage', c: 'var(--momo)' },
  { id: 'me', label: 'Me', icon: 'me', c: 'var(--lime)' }
];
function cur() { return NAV.stack.length ? NAV.stack[NAV.stack.length - 1] : { name: NAV.tab, args: {} }; }
function paint(anim = 'enter', keepScroll) {
  const view = $('#view');
  const old = $('.scr', view), top = keepScroll && old ? old.scrollTop : 0;
  const c = cur();
  view.innerHTML = `<div class="scr ${anim || ''}" data-screen="${c.name}">${SCREENS[c.name](c.args || {})}</div>`;
  if (top) $('.scr', view).scrollTop = top;
  renderTabbar();
  AFTER[c.name] && AFTER[c.name](c.args || {});
}
const refresh = () => paint('', true);
function goTab(t) { NAV.tab = t; NAV.stack = []; paint('enter'); }
function push(name, args) { NAV.stack.push({ name, args }); paint('push'); }
function back() { NAV.stack.pop(); paint('enter'); }
function renderTabbar() {
  const bar = $('#tabbar');
  bar.innerHTML = TABS.map(t => {
    const on = NAV.tab === t.id;
    return `<button type="button" data-act="tab" data-t="${t.id}" class="${on ? 'on' : ''}" style="${on ? `--tabc:${t.c}` : ''}" aria-current="${on ? 'page' : 'false'}">${I[t.icon]}<span>${t.label}</span></button>`;
  }).join('');
  bar.classList.toggle('hide', !S.onboarded);
}

/* ---------- shared pieces ---------- */
function avatar(size = 44, who = S.partner, power = S.power) {
  const bg = { taku: 'var(--taku)', momo: 'var(--momo-s)', puri: 'var(--puri)' }[who];
  return `<span class="av ${RANKS[rankIdx(power)].fr}" style="--a:${size}px;--avbg:${bg}"><span class="in">${M.html(who, 'idle', { acc: who === 'puri' ? 'hs' : '' })}</span></span>`;
}
function initials(name, fr, size = 40, bg = '#EDE8F7') {
  const ini = name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return `<span class="av ${fr}" style="--a:${size}px;--avbg:${bg}"><span class="ini">${ini}</span></span>`;
}
function oraChip() {
  const st = starsOf(S.power), C = 2 * Math.PI * 13;
  return `<button type="button" class="ora" data-act="wallet" aria-label="Ōra wallet ${fmt(S.wallet)}"><span class="ring"><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="none" stroke="#E9E3FF" stroke-width="3.4"/><circle cx="16" cy="16" r="13" fill="none" stroke="#6C4DF6" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - st.pct)}"/></svg><span class="gem">${I.sparkle}</span></span><span class="num" data-wallet>${fmt(S.wallet)}</span></button>`;
}
function topbar(sub) {
  return `<div class="top"><button type="button" data-act="tab" data-t="me" aria-label="Your profile">${avatar(44)}</button>
    <div class="who"><b>${sub || greet()}</b><span>${title()}</span></div>
    ${oraChip()}
    <button type="button" class="round" data-act="inbox" aria-label="Mascot inbox">${I.inbox}${S.inboxRead ? '' : '<span class="dot"></span>'}</button></div>`;
}
function greet() { const h = new Date().getHours(); return `${h < 12 ? 'Ohayō' : h < 18 ? 'Konnichiwa' : 'Konbanwa'}, ${S.name}`; }
const burst = (fill = 'rgba(255,255,255,.14)', cls = 'burst') =>
  `<svg class="${cls}" viewBox="-8 -8 116 116" aria-hidden="true"><polygon points="50,0 61.1,8.5 75,6.7 80.4,19.6 93.3,25 91.5,38.9 100,50 91.5,61.1 93.3,75 80.4,80.4 75,93.3 61.1,91.5 50,100 38.9,91.5 25,93.3 19.6,80.4 6.7,75 8.5,61.1 0,50 8.5,38.9 6.7,25 19.6,19.6 25,6.7 38.9,8.5" fill="${fill}" stroke="${fill}" stroke-width="10" stroke-linejoin="round"/></svg>`;

/* ---------- reward feedback: float, fly to chip, tick ---------- */
function rectIn(el) {
  const s = $('#screen').getBoundingClientRect();
  if (!el) return { x: s.width / 2, y: s.height / 2, w: 0, h: 0 };
  const r = el.getBoundingClientRect();
  return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2, w: r.width, h: r.height };
}
function floatText(el, text, cls = '') {
  const p = rectIn(el), f = document.createElement('div');
  f.className = 'float ' + cls; f.textContent = text;
  f.style.left = (p.x - 24) + 'px'; f.style.top = (p.y - 20) + 'px';
  $('#fx-layer').appendChild(f); setTimeout(() => f.remove(), 1200);
}
function visibleChip() { return $('#full-layer .ora') || $('#view .ora'); }
function flyToChip(el) {
  const chip = visibleChip(); if (!chip) return;
  const a = rectIn(el), b = rectIn(chip);
  for (let k = 0; k < 3; k++) {
    const d = document.createElement('div');
    d.className = 'flyer'; d.innerHTML = `<span style="width:14px;height:14px;display:block">${I.sparkle}</span>`;
    d.style.left = (a.x - 13) + 'px'; d.style.top = (a.y - 13) + 'px';
    $('#fx-layer').appendChild(d);
    setTimeout(() => { d.style.transform = `translate(${b.x - a.x - 10 + k * 6}px,${b.y - a.y}px) scale(.6)`; d.style.opacity = '0'; }, 40 + k * 90);
    setTimeout(() => d.remove(), 1100);
  }
  setTimeout(() => tickChip(), 700);
}
function tickChip() {
  $$('.ora').forEach(chip => {
    const n = $('[data-wallet]', chip); if (!n) return;
    const from = parseInt(n.textContent.replace(/,/g, ''), 10) || 0, to = S.wallet, t0 = performance.now();
    chip.classList.remove('bump'); void chip.offsetWidth; chip.classList.add('bump');
    const step = t => { const k = Math.min(1, (t - t0) / 600); n.textContent = fmt(from + (to - from) * k); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    const st = starsOf(S.power), C = 2 * Math.PI * 13, ring = $$('circle', chip)[1];
    if (ring) { ring.style.transition = 'stroke-dashoffset .8s'; ring.style.strokeDashoffset = C * (1 - st.pct); }
  });
}
let busy = false; const EVQ = [];
function earn(n, { from, mult = true, label } = {}) {
  const amt = Math.round(n * (mult ? streakMult() : 1));
  const before = S.power;
  S.power += amt; S.wallet += amt; S.todayOra += amt; S.weekOra += amt;
  if (from !== false) { floatText(from, `+${amt}${label ? ' ' + label : ''}`, from && from.closest && from.closest('.hero,.cut,.council,.cheerbar') ? 'lime' : ''); flyToChip(from); }
  const a = starsOf(before), b = starsOf(S.power);
  if (b.i > a.i) EVQ.push({ t: 'rank', i: b.i });
  else if (b.stars > a.stars) EVQ.push({ t: 'star' });
  save();
  if (!busy) setTimeout(flush, 900);
  return amt;
}
function spend(n) { S.wallet -= n; save(); tickChip(); }
async function flush() {
  while (EVQ.length && !busy) {
    const e = EVQ.shift();
    if (e.t === 'star') { S.tickets.std++; save(); toast(S.partner, `Star-up! ${title()}`, '+1 Standard ticket for you'); refreshSoft(); await wait(400); }
    if (e.t === 'rank') { await rankUp(e.i); }
  }
}
function setBusy(b) { busy = b; if (!b) setTimeout(flush, 500); }
function refreshSoft() { if (!$('#full-layer').children.length) refresh(); }

/* ---------- toast, confetti, loading ---------- */
function toast(who, t, sub, ms = 2600) {
  const bg = { taku: 'var(--taku)', momo: 'var(--momo)', puri: 'var(--puri)' }[who];
  const el = document.createElement('div');
  el.className = 'toast'; el.setAttribute('role', 'status');
  el.innerHTML = `<span class="tm" style="background:${bg}">${M.html(who, who === 'puri' ? 'gg' : who === 'taku' ? 'wotagei' : 'sparkle')}</span><div><b>${t}</b><span>${sub || ''}</span></div>`;
  $('#fx-layer').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, ms);
}
function confetti(n = 30, colors = ['#D5F45A', '#FF9DBB', '#A9DDF2', '#FFD84A', '#8E75FF']) {
  if (REDUCED) return;
  const layer = $('#fx-layer'), w = $('#screen').clientWidth;
  for (let k = 0; k < n; k++) {
    const c = document.createElement('i');
    c.className = 'confetti';
    c.style.left = Math.random() * w + 'px';
    c.style.background = pick(colors);
    c.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
    c.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
    c.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
    c.style.animationDelay = (Math.random() * .4) + 's';
    if (Math.random() > .5) c.style.borderRadius = '50%';
    layer.appendChild(c); setTimeout(() => c.remove(), 3600);
  }
}
async function loading(text = 'Loading', sub = 'The trio is on it', ms = 1300) {
  const el = document.createElement('div');
  el.className = 'loading'; el.setAttribute('role', 'status');
  el.innerHTML = `<b>${text}…</b><span>${sub}</span><div class="track"><div class="runner">${M.html('puri', 'run')}${M.html('momo', 'run')}${M.html('taku', 'run')}</div></div><div class="ground"></div>`;
  $('#fx-layer').appendChild(el);
  await wait(ms); el.remove();
}
function errorState(retryAct = 'retryError', msg = 'Lag spike! The connection dropped mid-combo.') {
  return `<div class="state" style="background:var(--puri-s)">${M.html('puri', 'rage', { poke: true })}<h3>Puri rage-quit</h3><p>${msg} Check your connection, then try again.</p><button type="button" class="btn b-ink" data-act="${retryAct}">Retry</button></div>`;
}

/* ---------- sheets + full screens ---------- */
let sheetClose = null;
function openSheet(html, onClose) {
  $('#sheet').innerHTML = `<span class="grab"></span>${html}`;
  $('#sheet').scrollTop = 0;
  $('#sheet-layer').classList.add('open'); sheetClose = onClose || null;
  AFTER.sheet && AFTER.sheet();
}
function closeSheet() { $('#sheet-layer').classList.remove('open'); const f = sheetClose; sheetClose = null; f && f(); }
const sheetHead = (t, who) => `<div class="shead">${who ? `<span class="sh-tm" style="background:var(--${who})">${M.html(who, 'happy', { size: 62 })}</span>` : ''}<h3>${t}</h3><button type="button" class="close" data-act="closeSheet" aria-label="Close">${I.close}</button></div>`;
function openFull(html) { $('#full-layer').innerHTML = html; }
function closeFull() { $('#full-layer').innerHTML = ''; }

/* ---------- mascot pokes ---------- */
const LINES = {
  taku: ['推し means your favourite. Who\'s yours?', 'Did you know ダーリン comes from English?', 'Front row at every LIVE. Every. One.', 'Glowsticks charged. Wotagei ready!', 'Let\'s find you a community!'],
  momo: ['Six days to my… wait, I\'ve lost count. Soon!', 'Every sticker counts, you know.', 'You make me feel like a headliner!', 'Sweet, spicy and full of energy!', 'See you in the front row on 28 Nov?'],
  puri: ['Fourteen-hour marathon? Warm-up.', 'GG. Next round.', 'Wanna see my Switch? …Don\'t ask where it is.', 'Daily Challenge is basically free Ōra.', 'Combo ×5 or bust.']
};
const POKES = { taku: ['happy', 'wotagei', 'wave'], momo: ['sparkle', 'happy', 'wave'], puri: ['gg', 'console', 'happy'] };
function poke(el) {
  const who = el.dataset.who;
  const s = Math.random() < .35 && who === 'puri' ? 'console' : pick(POKES[who]);
  M.react(el, s, s === 'console' ? 1700 : 1000);
  const bub = el.parentElement && el.parentElement.querySelector('.bub[data-say]');
  if (bub) { bub.textContent = pick(LINES[who]); bub.classList.remove('pop'); void bub.offsetWidth; bub.classList.add('pop'); }
}

/* ---------- rank-up boss cutscene ---------- */
async function rankUp(i) {
  setBusy(true);
  const r = RANKS[i], b = M.BOSSES[r.boss], partner = S.partner;
  const others = ['taku', 'puri', 'momo'].filter(w => w !== partner);
  let skipped = false;
  const el = document.createElement('div');
  el.className = 'cut'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', `Rank up to ${r.name}`);
  el.innerHTML = `<button type="button" class="btn sm b-ghost skip">Skip</button><div class="stagec"></div>`;
  $('#fx-layer').appendChild(el);
  const stage = $('.stagec', el);
  const done = new Promise(res => { el._res = res; });
  $('.skip', el).onclick = () => { skipped = true; spoils(); };
  const beat = async (ms) => { await wait(ms); return !skipped; };

  function spoils() {
    if (el._spoiled) return; el._spoiled = true;
    if (!S.beaten.includes(r.boss)) S.beaten.push(r.boss);
    S.tickets.rare++; save();
    $('.skip', el).remove();
    stage.innerHTML = `<div class="spoils">${burst('rgba(213,244,90,.12)', 'burst" style="position:absolute;width:520px;height:520px;top:50%;left:50%;margin:-300px 0 0 -260px')}
      ${avatar(120, partner, r.min)}
      <span class="over" style="color:var(--lime)">Rank up · ${b.name} defeated</span>
      <h2>You're ${r.name}!</h2>
      <div class="perks"><b style="font:400 16px var(--f-disp)">New perks</b><ul>${r.perks.map(p => `<li>${p}</li>`).join('')}<li><b>+1 Rare+ capsule ticket</b></li></ul></div>
      <button type="button" class="btn b-lime full" style="max-width:320px" data-cont>Continue</button></div>`;
    confetti(46);
    $('[data-cont]', el).onclick = () => { el.remove(); setBusy(false); refreshSoft(); el._res(); };
  }

  if (REDUCED) {
    stage.innerHTML = `<div class="panel">${M.boss(r.boss)}<h2 style="font-size:24px">${b.name} blocks the way to ${r.name}!</h2><p>${M.html(partner, 'charge')}</p><p style="font-weight:700">Your partner lands the final hit.</p></div>`;
    await wait(1800); spoils(); return done;
  }
  // 0.0 s overload
  stage.innerHTML = `<div class="ovl">ŌRA<br>OVERLOAD</div><div class="obar"><i></i></div>`;
  el.classList.add('shake');
  if (!await beat(1300)) return done;
  // 1.3 s boss drops
  el.classList.remove('shake');
  stage.innerHTML = `<div class="bosswrap">${M.boss(r.boss)}<div class="namecard">${b.name.toUpperCase()}</div><p class="bline">"${b.line}"</p></div>
    <div class="team"></div><div class="beam"></div>`;
  if (!await beat(1700)) return done;
  // 3.0 s team-up
  const team = $('.team', stage), bw = $('.bosswrap', stage);
  team.innerHTML = `<div style="position:absolute;left:-140px;bottom:0;transition:left .45s cubic-bezier(.3,1.4,.5,1)" data-l>${M.html(others[0], 'charge')}</div>
    <div style="position:absolute;right:-140px;bottom:0;transition:right .45s cubic-bezier(.3,1.4,.5,1)" data-r>${M.html(others[1], 'charge')}</div>
    <div style="position:absolute;left:50%;margin-left:-65px;bottom:-200px;transition:bottom .5s cubic-bezier(.3,1.4,.5,1)" data-p>${M.html(partner, 'charge')}</div>`;
  await wait(60);
  $('[data-l]', team).style.left = '4px'; $('[data-r]', team).style.right = '4px';
  await wait(500); bw.classList.add('hit');
  if (!await beat(1100)) return done;
  // 4.7 s finisher
  $('[data-p]', team).style.bottom = '0px';
  await wait(450);
  $('.beam', stage).classList.add('on'); $('.beam', stage).style.height = '300px';
  if (!await beat(500)) return done;
  // 5.6 s poof
  bw.classList.remove('hit'); bw.classList.add('poof');
  for (let k = 0; k < 10; k++) {
    const p = document.createElement('i'); p.className = 'puff';
    p.style.left = '48%'; p.style.top = '26%';
    p.style.setProperty('--dx', (Math.random() * 240 - 120) + 'px'); p.style.setProperty('--dy', (Math.random() * 200 - 100) + 'px');
    stage.appendChild(p);
  }
  team.querySelectorAll('.m').forEach(m => M.set(m, 'cheer'));
  $('.beam', stage).style.height = '0';
  if (!await beat(1100)) return done;
  spoils();
  return done;
}

/* ---------- first-run tour, narrated by the buddy ---------- */
const TOUR = {
  momo: ['This is your Ōra! Everything you do earns it, and it never goes down when you shop.', 'And this is me: your streak! Keep me lively with one Daily Challenge a day.', 'Three quests a day, one from each of us. Clear them for a bonus chest!', 'Your path to Senpai. Every rank has a boss… don\'t worry, we always win.', 'That\'s the tour! I left you a capsule ticket on Stage. Go pull it!'],
  taku: ['Ōra! オーラ, your aura. Every reel, quiz and cheer pumps it up.', 'Momo keeps your streak. She gets sleepy if you skip a day, so don\'t!', 'Daily quests: one from each of us. All three opens the chest!', 'This bar is your road to Senpai, 先輩. Bosses guard each rank.', 'Tour done! Momo left a capsule ticket on Stage. Ikuzo!'],
  puri: ['Ōra = your power level. It only goes up. Spend freely.', 'Momo is the streak counter. Don\'t let her fall asleep.', 'Three dailies. Clear all, loot the chest. Easy.', 'Rank bar. Next boss is waiting. I\'ll tank, you DPS.', 'GG, tour over. There\'s a capsule ticket on Stage. Go.']
};
function tour() {
  const steps = [() => $('#view .ora'), () => $('#view .streak'), () => $('#view .questcard'), () => $('#view .hero .obar'), () => $('#tabbar [data-t="stage"]')];
  const who = S.partner; let k = 0;
  const el = document.createElement('div'); el.className = 'tour';
  el.innerHTML = `<div class="hole"></div><div class="guide">${M.html(who, 'wave')}<div class="box"><p data-t></p><div class="between"><span data-n></span><button type="button" class="btn sm b-ink" data-next>Next</button></div></div></div>`;
  $('#fx-layer').appendChild(el);
  const show = () => {
    const t = steps[k](); const scr = $('#view .scr');
    if (t && scr && t.closest('.scr')) { t.scrollIntoView({ block: 'center' }); }
    const r = rectIn(t), pad = 8;
    Object.assign($('.hole', el).style, { left: (r.x - r.w / 2 - pad) + 'px', top: (r.y - r.h / 2 - pad) + 'px', width: (r.w + pad * 2) + 'px', height: (r.h + pad * 2) + 'px' });
    $('.guide', el).classList.toggle('up', r.y > $('#screen').clientHeight * .55);
    $('[data-t]', el).textContent = TOUR[who][k];
    $('[data-n]', el).textContent = `${k + 1} of ${steps.length}`;
    $('[data-next]', el).textContent = k === steps.length - 1 ? 'Let\'s go' : 'Next';
    M.react($('.guide .m', el), pick(POKES[who]), 1000);
  };
  $('[data-next]', el).onclick = () => { k++; if (k >= steps.length) { el.remove(); $('#view .scr').scrollTop = 0; return; } show(); };
  setTimeout(show, 300);
}
