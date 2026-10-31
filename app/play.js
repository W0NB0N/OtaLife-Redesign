/* Ōta Life · play: Battle (quiz, results, arena), Stage (capsule machine, cabinet, shop, tickets, checkout) */

/* ======================= QUIZ (PURI) ======================= */
const Q_DAILY = [
  { q: 'Zero Two calls Hiro <span class="jp">ダーリン</span> (daarin). What does it mean?', o: ['Captain', 'Darling', 'My enemy', 'Big brother'], a: 1, note: '<b>ダーリン</b> is borrowed straight from English "darling". Katakana usually marks a loanword.' },
  { q: 'Naruto ends his lines with <span class="jp">だってばよ</span> (dattebayo). Closest meaning?', o: ['…you know!', 'Goodbye!', 'I\'m hungry', 'Let\'s fight'], a: 0, note: '<b>だってばよ</b> is a verbal tic, roughly "…you know!". The English dub went with "Believe it!".' },
  { q: 'When do characters say <span class="jp">いただきます</span> (itadakimasu)?', o: ['After waking up', 'Before eating', 'Leaving home', 'Apologising'], a: 1, note: '<b>いただきます</b> means "I humbly receive". After the meal it\'s ごちそうさま (gochisōsama).' },
  { q: 'In Jujutsu Kaisen, <span class="jp">呪術</span> (jujutsu) means…', o: ['A gentle martial art', 'Cursed sorcery', 'The ninja path', 'A sword style'], a: 1, note: '<b>呪術</b> is "sorcery" (呪 = curse). The martial art jiu-jitsu is a different word: 柔術.' },
  { q: '<span class="jp">先輩</span> (senpai) means…', o: ['Teacher', 'Rival', 'Someone senior to you', 'Best friend'], a: 2, note: '<b>先輩</b> is anyone senior at school or work. It\'s also your next rank on Ōta!' }
];
const Q_WARM = [
  { q: '<span class="jp">かわいい</span> (kawaii) means…', o: ['Scary', 'Cute', 'Hungry', 'Fast'], a: 1, note: '<b>かわいい</b> means "cute". Momo-chan says it about everything, including spicy chutney.' },
  Q_DAILY[2], Q_DAILY[0]
];
const Q_POOL = [...Q_DAILY,
  { q: 'At idol LIVEs, <span class="jp">ヲタ芸</span> (wotagei) is…', o: ['A glowstick cheer dance', 'A ramen style', 'A card game', 'A cosplay pose'], a: 0, note: '<b>ヲタ芸</b> is the glowstick dance fans do in the crowd. TAKU-kun\'s speciality.' },
  { q: '<span class="jp">推し</span> (oshi) is your…', o: ['Rival', 'Favourite character', 'Teacher', 'Pet'], a: 1, note: '<b>推し</b> comes from 推す (osu), "to push" or recommend. Your oshi is who you hype.' },
  { q: '<span class="jp">頑張って</span> (ganbatte) means…', o: ['Do your best!', 'Be quiet', 'Thank you', 'Welcome back'], a: 0, note: '<b>頑張って</b> is the classic "go for it!". Reply with 頑張ります (ganbarimasu), "I will!".' }
];
const QUIZZES = [
  { id: 'words', n: 'Anime words 101', d: 1, dl: 'Beginner', k: '語', bg: 'var(--taku-s)', ora: 100 },
  { id: 'shonen', n: 'Shōnen catchphrases', d: 2, dl: 'Intermediate', k: '拳', bg: 'var(--puri-s)', ora: 100 },
  { id: 'idol', n: 'Idol culture', d: 2, dl: 'Intermediate', k: '歌', bg: 'var(--momo-s)', ora: 100 },
  { id: 'kanji', n: 'Kanji in anime titles', d: 3, dl: 'Advanced', k: '漢', bg: 'var(--violet-s)', ora: 100 }
];
let QZ = null;
async function startQuiz(mode, id) {
  setBusy(true);
  const set = mode === 'warmup' ? Q_WARM : mode === 'daily' ? Q_DAILY : Q_POOL.slice().sort(() => Math.random() - .5).slice(0, 5);
  QZ = { mode, id, set, i: 0, right: 0, combo: 0, best: 0, time: 0, earned: 0, t: 15, timer: null, locked: false };
  if (mode !== 'warmup') await loading('Finding rivals', 'Matching you with players near your rank', 900);
  drawQ();
}
const PER = () => QZ.mode === 'library' ? 20 : 30;
function drawQ() {
  const q = QZ.set[QZ.i], n = QZ.set.length, C = 2 * Math.PI * 28;
  openFull(`<div class="quiz" role="dialog" aria-label="Quiz battle">
    <div class="qtop"><button type="button" class="back" data-act="quitQuiz" aria-label="Quit quiz">${I.close}</button><div class="bar"><i style="width:${QZ.i / n * 100}%"></i></div>${oraChip()}</div>
    <div class="arena"><div class="timer" aria-live="polite"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#fff" stroke="#FCEDB0" stroke-width="6"/><circle class="tr" cx="32" cy="32" r="28" fill="none" stroke="#1C1830" stroke-width="6" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg><b>15</b></div>
      ${QZ.combo >= 2 ? `<div class="combo"><small>COMBO</small>×${QZ.combo}</div>` : ''}${M.html('puri', QZ.combo >= 3 ? 'excited' : 'idle', { acc: 'hs', poke: true })}</div>
    <div class="qcard"><span class="over">${QZ.mode === 'daily' ? 'Daily Challenge' : QZ.mode === 'warmup' ? 'Warm-up battle' : 'Quiz battle'} · question ${QZ.i + 1} of ${n} · +${PER()} Ōra</span><h3>${q.q}</h3></div>
    <div class="answers">${q.o.map((o, k) => `<button type="button" class="ans" data-act="answer" data-k="${k}"><i>${'ABCD'[k]}</i>${o}</button>`).join('')}</div>
    <div data-after style="margin-top:auto" class="col"></div></div>`);
  QZ.t = 15; QZ.locked = false;
  const ring = $('#full-layer .tr'), lbl = $('#full-layer .timer b'), puri = () => $('#full-layer .arena .m');
  clearInterval(QZ.timer);
  QZ.timer = setInterval(() => {
    QZ.t = Math.max(0, QZ.t - .1); QZ.time += .1;
    if (!ring) return;
    ring.style.strokeDashoffset = C * (1 - QZ.t / 15);
    lbl.textContent = Math.ceil(QZ.t);
    if (QZ.t < 5 && !$('#full-layer .timer.low')) { $('#full-layer .timer').classList.add('low'); ring.style.stroke = '#A3263F'; M.set(puri(), 'watch'); }
    if (QZ.t <= 0) answer(-1);
  }, 100);
}
function answer(k) {
  if (QZ.locked) return; QZ.locked = true; clearInterval(QZ.timer);
  const q = QZ.set[QZ.i], btns = $$('#full-layer .ans'), puri = $('#full-layer .arena .m'), ok = k === q.a;
  btns.forEach((b, j) => { if (j === q.a) b.classList.add('right'); else if (j === k) b.classList.add('wrong'); else b.classList.add('dim'); });
  if (ok) {
    QZ.right++; QZ.combo++; QZ.best = Math.max(QZ.best, QZ.combo);
    const amt = earn(PER(), { from: btns[k] }); QZ.earned += amt;
    btns[k].insertAdjacentHTML('beforeend', `<em>+${amt}</em>`);
    M.set(puri, QZ.combo >= 3 ? 'victory' : 'happy');
    if (QZ.combo >= 2) { $('#full-layer .combo') && $('#full-layer .combo').remove(); $('#full-layer .arena').insertAdjacentHTML('afterbegin', `<div class="combo"><small>COMBO</small>×${QZ.combo}</div>`); }
  } else {
    QZ.combo = 0; M.set(puri, 'sad'); $('#full-layer .combo') && $('#full-layer .combo').remove();
  }
  const last = QZ.i === QZ.set.length - 1;
  $('#full-layer [data-after]').innerHTML = `<div class="note">${M.html('taku', ok ? 'happy' : 'think')}<div class="bub pop">${k === -1 ? 'Time\'s up! ' : ''}${q.note}</div></div>
    <button type="button" class="btn b-ink full" data-act="nextQ">${last ? 'See results' : 'Next question'}</button>`;
  $('#full-layer .answers').style.pointerEvents = 'none';
  $('#full-layer [data-after]').scrollIntoView({ block: 'end', behavior: 'smooth' });
}
ACT.answer = el => answer(+el.dataset.k);
ACT.nextQ = () => { if (QZ.i < QZ.set.length - 1) { QZ.i++; drawQ(); } else results(); };
ACT.quitQuiz = () => { clearInterval(QZ.timer); closeFull(); setBusy(false); if (!S.onboarded) { OB.step = 'warm'; obRender(); } else refresh(); };
function results() {
  const n = QZ.set.length, win = QZ.right >= Math.ceil(n * .6), perfect = QZ.right === n;
  const mult = streakMult();
  let bonus = 0, ticket = false, lines = [`<div><span>${QZ.right} right × ${PER()} Ōra${mult > 1 ? ` × ${mult} streak` : ''}</span><b>+${fmt(QZ.earned)}</b></div>`];
  if (QZ.mode === 'daily' && !S.quests.challenge) {
    const c = Math.round(100 * mult); bonus += c; lines.push(`<div><span>Daily Challenge cleared</span><b>+${c}</b></div>`);
    ticket = true; S.tickets.std++; S.quests.challenge = true;
    if (!S.doneToday) { S.doneToday = true; S.streak++; S.mileFresh = [3, 7, 14, 30, 50, 100].includes(S.streak); S.streakPreview = null; }
  }
  if (perfect) { bonus += 50; lines.push(`<div><span>Perfect score</span><b>+50</b></div>`); }
  lines.push(`<div><span>Total</span><b>+${fmt(QZ.earned + bonus)} Ōra</b></div>`);
  const t = Math.round(QZ.time), mm = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  const board = [['Aanya R.', 'fr2', 5, '0:41'], ['Kabir S.', 'fr1', 5, '0:48'], ['Meera J.', 'fr1', 4, '0:39']];
  const you = [S.name, RANKS[rankIdx(S.power)].fr, QZ.right, mm, true];
  const all = [...board, you].sort((a, b) => b[2] - a[2] || a[3].localeCompare(b[3]));
  openFull(`<div class="res" role="dialog" aria-label="Results">${burst('rgba(255,255,255,.4)')}
    <div class="between" style="position:relative"><span class="pill" style="background:#fff">${QZ.mode === 'daily' ? 'Daily Challenge' : QZ.mode === 'warmup' ? 'Warm-up' : 'Quiz'} · ${mm}</span>${oraChip()}</div>
    <div class="hero2">${M.html('puri', win ? 'victory' : 'sad', { acc: 'hs', poke: true })}<h2>${win ? (perfect ? 'Flawless. GG!' : 'Victory! GG') : 'GG, close one'}</h2><p style="font-weight:700">${win ? `Best combo ×${QZ.best}.` : 'Rematch tomorrow. TAKU left notes on every answer.'}</p></div>
    <div class="score"><div><b>${QZ.right}/${n}</b><span>correct</span></div><div><b>×${QZ.best}</b><span>best combo</span></div><div><b>${mm}</b><span>time</span></div></div>
    <div class="brk" data-brk>${lines.join('')}</div>
    ${ticket ? `<div class="card" style="flex-direction:row;align-items:center;position:relative"><span class="capsule" style="--c:var(--momo);width:30px;height:30px"></span><b style="flex:1">+1 Standard capsule ticket</b><span class="pill" style="background:var(--momo-s);color:var(--momo-d)">${I.flame} ${S.streak}-day streak</span></div>` : ''}
    ${QZ.mode !== 'warmup' ? `<div class="lb" style="position:relative"><span class="over" style="padding:8px 2px 2px">Top rankings · ties broken by time</span>${all.map((r, k) => `<div class="lbr ${r[4] ? 'me' : ''}"><span class="n">${k + 1}</span>${r[4] ? avatar(34) : initials(r[0], r[1], 34)}<span class="nm"><b>${r[0]}</b><span>${r[4] ? title() : ''}</span></span><span class="sc">${r[2]}/5<small>${r[3]}</small></span></div>`).join('')}</div>` : ''}
    <div class="col" style="position:relative;margin-top:auto"><button type="button" class="btn b-ink full" data-act="quizDone">${QZ.mode === 'warmup' ? 'Claim my rewards' : 'Continue'}</button></div></div>`);
  if (bonus) setTimeout(() => { const amt = earn(bonus, { from: $('#full-layer [data-brk]'), mult: false }); }, 500);
  if (win) setTimeout(() => confetti(perfect ? 46 : 26), 200);
  save();
}
ACT.quizDone = () => {
  const mode = QZ.mode; QZ = null; setBusy(false);
  if (mode === 'warmup') { finishOnboarding(); return; }
  closeFull(); refresh();
  if (mode === 'daily' && S.mileFresh) setTimeout(() => toast('momo', `${S.streak}-day milestone!`, `Ōra multiplier is now ×${streakMult()}`), 600);
};

/* ======================= BATTLE TAB ======================= */
const RIVALS = [['Aanya R.', 'fr2', 3420, '4:12'], ['Kabir S.', 'fr1', 3180, '3:58'], ['Meera J.', 'fr1', 2950, '5:01'], ['Ishaan P.', 'fr2', 2610, '4:40'], ['Zoya K.', 'fr1', 2380, '3:33'], ['Arjun T.', 'fr1', 2380, '4:05'], ['Tanvi M.', 'fr1', 2045, '6:10'], ['Rohit V.', 'fr0', 1720, '5:20'], ['Sana Q.', 'fr1', 1500, '4:50'], ['Vivek N.', 'fr0', 1290, '5:45'], ['Nisha B.', 'fr1', 980, '6:30'], ['Om G.', 'fr0', 640, '7:02']];
const arenaPos = () => RIVALS.filter(r => r[2] > S.weekOra).length + 1;
SCREENS.battle = () => {
  const done = S.quests.challenge;
  return `${topbar('Battle')}
  <section class="daily ${done ? 'done' : ''}">${burst('rgba(255,255,255,.45)')}<span class="over" style="color:var(--puri-d);position:relative">Daily Challenge · keeps your streak</span><h2>${done ? 'Cleared for today' : 'Japanese through anime'}</h2>
    <div class="meta"><span class="pill">5 questions</span><span class="pill">15 s each</span><span class="pill">+250 Ōra</span><span class="pill">+1 ticket</span></div>
    ${M.html('puri', done ? 'victory' : 'gg', { acc: 'hs', poke: true })}
    <button type="button" class="btn ${done ? 'b-white' : 'b-ink'} full" data-act="${done ? 'quizLib' : 'quizStart'}">${done ? 'Play a library quiz instead' : 'Play now'}</button></section>
  <button type="button" class="card" data-act="arena" style="text-align:left"><div class="between"><div class="col" style="gap:2px"><span class="over">Weekly Arena · ends Sun 11 pm</span><h3 style="font-size:19px">${RANKS[rankIdx(S.power)].name} League</h3></div><span class="pill" style="background:var(--lime)">You're #${arenaPos()}</span></div>
    <div class="podium">${[[1, RIVALS[1], 64, 'var(--rare-s)'], [0, RIVALS[0], 84, 'var(--leg)'], [2, RIVALS[2], 50, 'var(--momo-s)']].map(([k, r, hgt, c]) => `<div>${initials(r[0], r[1], 40)}<b>${r[0].split(' ')[0]}</b><span class="blk" style="height:${hgt}px;background:${c}">${k + 1}</span></div>`).join('')}</div>
    <span class="mute" style="font-weight:700;font-size:13px">Top 5 move up a league. Ties are broken by total answer time.</span></button>
  <div class="sec"><h3>Quiz library</h3><span class="mute" style="font-weight:700;font-size:13px">+20 Ōra per right answer</span></div>
  <div class="qlist">${QUIZZES.map(q => `<button type="button" class="qrow" data-act="quizLib" data-id="${q.id}"><span class="cov jp" style="background:${q.bg}">${q.k}</span><span class="t"><b>${q.n}</b><span>5 questions · <span class="diff d${q.d}">${q.dl}</span></span></span>${S.played[q.id] ? '<span class="pill">Played</span>' : I.chev}</button>`).join('')}</div>`;
};
ACT.quizStart = () => startQuiz('daily');
ACT.quizLib = el => { const id = el.dataset.id || 'words'; S.played[id] = true; save(); startQuiz('library', id); };
SCREENS.arena = () => {
  const rows = RIVALS.map(r => ({ n: r[0], fr: r[1], o: r[2], t: r[3] }));
  rows.push({ n: S.name, fr: RANKS[rankIdx(S.power)].fr, o: S.weekOra, t: '4:20', me: true });
  rows.sort((a, b) => b.o - a.o || a.t.localeCompare(b.t));
  const myIdx = rows.findIndex(r => r.me);
  const row = (r, k) => `<div class="lbr ${r.me ? 'me' : ''} ${k === 4 ? 'zone' : ''}"><span class="n">${k + 1}</span>${r.me ? avatar(36) : initials(r.n, r.fr, 36)}<span class="nm"><b>${r.n}</b><span>${r.me ? title() : rows.some((x, j) => j !== k && x.o === r.o) ? `tie · ${r.t} total time` : ''}</span></span><span class="sc num">${fmt(r.o)}<small>Ōra</small></span></div>`;
  return `<div class="top"><button type="button" class="back" data-act="back" aria-label="Back">${I.back}</button><div class="who"><b>Weekly Arena</b><span>${RANKS[rankIdx(S.power)].name} League · 30 players near your rank</span></div>${oraChip()}</div>
  <section class="daily" style="min-height:0;padding-bottom:16px">${burst('rgba(255,255,255,.45)')}<span class="over" style="color:var(--puri-d);position:relative">Ends in 2 d 6 h</span><h2 style="font-size:24px;max-width:12ch">${myIdx < 5 ? 'You\'re in the promotion zone!' : `${fmt(rows[4].o - S.weekOra + 1)} Ōra to the top 5`}</h2>
    <div class="meta"><span class="pill">Top 3: +300 / 200 / 100 Ōra</span><span class="pill">Top 5 move up</span></div>${M.html('puri', myIdx < 5 ? 'victory' : 'watch', { acc: 'hs', size: 120 }).replace('style="--sz:120px"', 'style="--sz:120px;bottom:-6px"')}</section>
  <div class="lb">${rows.map(row).join('')}</div>
  <button type="button" class="btn b-ink full" data-act="quizStart">Earn Ōra in the Daily Challenge</button>`;
};
SCREENS.lagspike = () => `<div class="top"><button type="button" class="back" data-act="back" aria-label="Back">${I.back}</button><div class="who"><b>Weekly Arena</b><span>Couldn't load the bracket</span></div></div>${errorState('retryArena')}`;
ACT.retryArena = async () => { await loading('Reconnecting', 'Puri is plugging the router back in', 1100); NAV.stack.pop(); push('arena'); };
ACT.arena = () => push('arena');

/* ======================= CAPSULE MACHINE (MOMO) ======================= */
const TIERS = {
  std: { name: 'Standard', c: '#FF9DBB', bg: '#FFE2EB', odds: [['common', 70], ['rare', 25], ['epic', 5]], cost: 300, pity: 10, pr: 'epic', minRank: 0 },
  rare: { name: 'Rare+', c: '#6EB6F2', bg: '#DDEEFC', odds: [['rare', 70], ['epic', 27], ['legendary', 3]], cost: 1200, pity: 20, pr: 'legendary', minRank: 2 },
  legend: { name: 'Legend', c: '#FFC23D', bg: '#FFF1C9', odds: [['epic', 80], ['legendary', 20]], cost: null, pity: 5, pr: 'legendary', minRank: 99 }
};
const RAR = { common: ['#B7BFD0', '#EEF0F5', '#4F5872', 'Common', 20], rare: ['#6EB6F2', '#DDEEFC', '#1F68A8', 'Rare', 60], epic: ['#A27BFF', '#EDE4FF', '#6D3FE0', 'Epic', 150], legendary: ['#FFC23D', '#FFF1C9', '#8A5A00', 'Legendary', 500] };
const ORDER = ['common', 'rare', 'epic', 'legendary'];
const PRIZES = [
  { id: 'st-gg', r: 'common', n: 'Puri "GG" sticker', d: 'Chat sticker', art: { who: 'puri', s: 'gg' } },
  { id: 'st-wota', r: 'common', n: 'TAKU wotagei sticker', d: 'Chat sticker', art: { who: 'taku', s: 'wotagei' } },
  { id: 'st-wink', r: 'common', n: 'Momo wink sticker', d: 'Chat sticker', art: { who: 'momo', s: 'sparkle' } },
  { id: 'st-zz', r: 'common', n: 'Sleepy Momo sticker', d: 'Chat sticker', art: { who: 'momo', s: 'sleepy' } },
  { id: 'av-pack', r: 'rare', n: 'TAKU\'s backpack', d: 'Avatar part · equip on Me', art: { who: 'taku', s: 'happy' } },
  { id: 'av-hs', r: 'rare', n: 'Puri\'s headset', d: 'Avatar part · equip on Me', art: { who: 'puri', s: 'happy', acc: 'hs' } },
  { id: 'av-bow', r: 'rare', n: 'Momo\'s red bow', d: 'Avatar part · equip on Me', art: { who: 'momo', s: 'happy' } },
  { id: 'cp-15', r: 'epic', n: '15% off merch', d: 'Coupon · applies itself at checkout · expires 7 Dec', art: { coupon: '15%' } },
  { id: 'fast', r: 'epic', n: 'Fast-lane pass · Day 1', d: 'Skip the gate queue at Ōta TOKYO', art: { coupon: 'FAST' } },
  { id: 'holo-taku', r: 'epic', n: 'Holo TAKU card', d: 'Trading card · 1 of 24', art: { who: 'taku', s: 'wotagei', card: true } },
  { id: 'holo-momo', r: 'legendary', n: 'Momo debut holo card', d: 'Legendary trading card · 1 of 6', art: { who: 'momo', s: 'celebrate', card: true } },
  { id: 'meet', r: 'legendary', n: 'Meet-and-greet raffle entry', d: 'Ōta TOKYO Delhi · Day 2 · drawn 20 Nov', art: { coupon: 'VIP' } }
];
const G = { tier: 'std', phase: 'idle', taps: 0, res: null };
function prizeArt(p, size = 130) {
  const [c, s] = RAR[p.r];
  if (p.art.coupon) return `<span style="background:#fff;border-radius:16px;padding:14px 18px;box-shadow:inset 0 0 0 3px ${c};display:flex;flex-direction:column;align-items:center;transform:rotate(-6deg)"><b style="font:400 ${size > 100 ? 40 : 24}px var(--f-disp);color:${RAR[p.r][2]}">${p.art.coupon}</b><span style="font-weight:800;font-size:11px;color:var(--mute)">${p.art.coupon.includes('%') ? 'OFF MERCH' : 'ŌTA TOKYO'}</span></span>`;
  const m = M.html(p.art.who, p.art.s, { size, acc: p.art.acc || '' });
  if (p.art.card) return `<span style="width:${size * .78}px;height:${size}px;border-radius:14px;background:linear-gradient(140deg,#fff,${s} 40%,${c});box-shadow:inset 0 0 0 4px #fff,0 6px 14px rgba(0,0,0,.15);display:grid;place-items:center;overflow:hidden">${M.html(p.art.who, p.art.s, { size: size * .8 })}</span>`;
  return `<span style="filter:drop-shadow(0 0 0 #fff) drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff)">${m}</span>`;
}
function machineSvg(c) {
  const pal = { std: ['#FF9DBB', '#A9DDF2', '#B7BFD0', '#A27BFF', '#FFD84A'], rare: ['#6EB6F2', '#A27BFF', '#FFC23D', '#6EB6F2', '#D5F45A'], legend: ['#FFC23D', '#A27BFF', '#FFC23D', '#FF9DBB'] }[G.tier];
  const pos = [[110, 178], [146, 186], [184, 178], [92, 150], [128, 156], [166, 158], [204, 150], [112, 124], [150, 130], [188, 124], [130, 98], [170, 100], [216, 120], [84, 120], [150, 72]];
  const caps = pos.map(([x, y], k) => `<g transform="translate(${x} ${y}) rotate(${(k * 47) % 360})"><g class="cp" style="--jx:${(k % 3 - 1) * 5}px;--jy:${(k % 2 ? -1 : 1) * 6}px;--jr:${(k % 2 ? 1 : -1) * 22}deg;animation-delay:${k * 30}ms"><circle r="17" fill="#fff" stroke="#2B2540" stroke-width="3"/><path d="M-17 0 A17 17 0 0 1 17 0 Z" fill="${pal[k % pal.length]}" stroke="#2B2540" stroke-width="3"/></g></g>`).join('');
  return `<svg class="machine" viewBox="0 0 300 400" role="img" aria-label="Capsule machine">
    <ellipse cx="150" cy="392" rx="112" ry="8" fill="rgba(28,24,48,.1)"/>
    <rect x="116" y="194" width="68" height="18" fill="#2B2540"/>
    <circle cx="150" cy="120" r="96" fill="rgba(255,255,255,.6)"/>
    <g class="caps">${caps}</g>
    <path d="M86 70 Q100 42 132 34" stroke="#fff" stroke-width="10" stroke-linecap="round" fill="none" opacity=".9"/>
    <circle cx="150" cy="120" r="96" fill="none" stroke="#2B2540" stroke-width="5"/>
    <rect x="126" y="12" width="48" height="16" rx="7" fill="${c}" stroke="#2B2540" stroke-width="4"/>
    <path d="M64 206 H236 Q250 206 250 220 V372 Q250 386 236 386 H64 Q50 386 50 372 V220 Q50 206 64 206Z" fill="${c}" stroke="#2B2540" stroke-width="5"/>
    <rect x="92" y="222" width="116" height="26" rx="13" fill="#fff" stroke="#2B2540" stroke-width="3"/>
    <text x="150" y="241" text-anchor="middle" font-family="Dela Gothic One, sans-serif" font-size="14" fill="#2B2540">ŌTA GACHA</text>
    <g class="handle" style="transform-box:fill-box;transform-origin:center"><circle cx="150" cy="282" r="30" fill="#fff" stroke="#2B2540" stroke-width="5"/><rect x="143" y="256" width="14" height="52" rx="7" fill="#2B2540"/></g>
    <rect x="212" y="266" width="10" height="32" rx="5" fill="#2B2540"/>
    <path d="M104 328 H196 V364 Q196 372 188 372 H112 Q104 372 104 364Z" fill="#2B2540"/>
    <rect x="112" y="334" width="76" height="7" rx="3.5" fill="#fff" opacity=".3"/>
  </svg>`;
}
function canPull() {
  const T = TIERS[G.tier];
  if (S.tickets[G.tier] > 0) return 'ticket';
  if (T.cost && rankIdx(S.power) >= T.minRank && S.wallet >= T.cost) return 'ora';
  return null;
}
function drawGacha(line) {
  const T = TIERS[G.tier], how = canPull(), pityLeft = T.pity - S.pity[G.tier];
  const locked = T.cost && rankIdx(S.power) < T.minRank;
  let cta;
  if (how === 'ticket') cta = `<button type="button" class="split" data-act="turn">Turn the handle <span>1 ${T.name} ticket</span></button>`;
  else if (how === 'ora') cta = `<button type="button" class="split" data-act="turn">Turn the handle <span>${fmt(T.cost)} Ōra</span></button>`;
  else cta = `<div class="col" style="gap:8px"><div class="split off" aria-disabled="true">No ${T.name} tickets <span>${G.tier === 'legend' ? 'Event check-in' : locked ? `${I.lock} Senpai` : `${fmt(T.cost)} Ōra`}</span></div><button type="button" class="btn b-white full" data-act="earnTicket">${S.quests.challenge ? 'Next ticket: clear the quest board' : 'Next ticket: play the Daily Challenge'} ${I.chev}</button></div>`;
  openFull(`<div class="gacha" style="--gbg:${T.bg}" role="dialog" aria-label="Capsule machine">
    <div class="top"><button type="button" class="back" data-act="closeGacha" aria-label="Close capsule machine">${I.close}</button><div class="who"><b>Capsule machine</b><span>Hosted by Momo-chan</span></div>${oraChip()}</div>
    <div class="seg" role="tablist">${Object.entries(TIERS).map(([k, t]) => `<button type="button" role="tab" aria-selected="${G.tier === k}" class="${G.tier === k ? 'on' : ''}" data-act="tier" data-t="${k}">${t.name}<small>${S.tickets[k]} ticket${S.tickets[k] === 1 ? '' : 's'}</small></button>`).join('')}</div>
    <div class="odds">${T.odds.map(([r, p]) => `<span class="o-${r === 'legendary' ? 'leg' : r}">${RAR[r][3]} ${p}%</span>`).join('')}</div>
    <div class="pity"><span>${RAR[T.pr][3]} guaranteed in ${pityLeft} pull${pityLeft === 1 ? '' : 's'}</span><span class="bar"><i style="width:${S.pity[G.tier] / T.pity * 100}%"></i></span></div>
    <div class="machine-wrap" data-mw>${machineSvg(T.c)}<div class="momo-spot"><div class="bub" data-say>${line || (how ? 'Feeling lucky? Turn the handle!' : 'Out of tickets… but you can earn one today!')}</div>${M.html('momo', how ? 'wave' : 'sad', { poke: true })}</div></div>
    ${cta}
    <button type="button" class="btn sm b-white" style="align-self:center" data-act="cabinet">Cabinet · ${S.cabinet.length} items</button></div>`);
}
function openGacha() { setBusy(true); G.phase = 'idle'; drawGacha(); }
ACT.gacha = () => openGacha();
ACT.tier = el => { if (G.phase !== 'idle') return; G.tier = el.dataset.t; drawGacha({ std: 'The classic! Stickers, avatar parts, maybe an Epic.', rare: 'Rare+ is where the holo cards live~', legend: 'Legend capsules come from event check-ins only!' }[G.tier]); };
ACT.closeGacha = () => { if (G.phase === 'turning') return; closeFull(); setBusy(false); refresh(); };
ACT.earnTicket = () => { closeFull(); setBusy(false); if (!S.quests.challenge) startQuiz('daily'); else goTab('home'); };
function roll() {
  const T = TIERS[G.tier];
  S.pity[G.tier]++;
  let r;
  if (S.pity[G.tier] >= T.pity) r = T.pr;
  else { let x = Math.random() * 100; for (const [rr, p] of T.odds) { if ((x -= p) < 0) { r = rr; break; } } r = r || T.odds[0][0]; }
  if (ORDER.indexOf(r) >= ORDER.indexOf(T.pr)) S.pity[G.tier] = 0;
  const p = pick(PRIZES.filter(x => x.r === r));
  const dupe = S.cabinet.some(c => c.id === p.id) && !p.art.coupon;
  return { p, dupe };
}
ACT.turn = async () => {
  if (G.phase !== 'idle') return;
  const how = canPull(); if (!how) return;
  if (how === 'ticket') S.tickets[G.tier]--; else spend(TIERS[G.tier].cost);
  G.phase = 'turning'; G.taps = 0; G.res = roll(); save();
  const T = TIERS[G.tier], left = T.pity - S.pity[G.tier];
  $('#full-layer .pity').innerHTML = `<span>${RAR[T.pr][3]} guaranteed in ${left} pull${left === 1 ? '' : 's'}</span><span class="bar"><i style="width:${S.pity[G.tier] / T.pity * 100}%"></i></span>`;
  $('#full-layer .seg small') && $$('#full-layer .seg button').forEach(b => { const k = b.dataset.t; $('small', b).textContent = `${S.tickets[k]} ticket${S.tickets[k] === 1 ? '' : 's'}`; });
  const mach = $('#full-layer .machine'), momo = $('#full-layer .momo-spot .m'), bub = $('#full-layer .momo-spot .bub');
  $('#full-layer .split').outerHTML = `<div class="split off" aria-live="polite">Turning… <span>${how === 'ticket' ? '1 ticket' : fmt(TIERS[G.tier].cost) + ' Ōra'}</span></div>`;
  M.set(momo, 'excited'); bub.textContent = 'Here it comes…!';
  mach.classList.add('rumble');
  requestAnimationFrame(() => { $('.handle', mach).style.transform = 'rotate(720deg)'; });
  await wait(1350);
  mach.classList.remove('rumble');
  // capsule drops; its glow hints the rarity
  const [rc] = RAR[G.res.p.r];
  G.phase = 'crack';
  const cap = document.createElement('button');
  cap.type = 'button'; cap.className = 'cap-drop'; cap.style.setProperty('--rc', rc); cap.setAttribute('aria-label', 'Capsule. Tap three times to crack it open');
  cap.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M8 50 A42 42 0 0 1 92 50 Z" fill="${rc}" stroke="#2B2540" stroke-width="4"/><path d="M8 50 A42 42 0 0 0 92 50 Z" fill="#fff" stroke="#2B2540" stroke-width="4"/><rect x="5" y="46" width="90" height="8" rx="4" fill="#2B2540"/><ellipse cx="32" cy="30" rx="10" ry="6" fill="#fff" opacity=".6"/>
    <path class="crack" d="M30 16 L38 30 L31 40" stroke="#2B2540" stroke-width="3" fill="none" stroke-linecap="round"/><path class="crack" d="M70 60 L62 72 L70 84" stroke="#2B2540" stroke-width="3" fill="none" stroke-linecap="round"/><path class="crack" d="M58 14 L54 26 L64 34 L60 42" stroke="#2B2540" stroke-width="3" fill="none" stroke-linecap="round"/></svg>
    <span class="tapdots"><i class="u"></i><i class="u"></i><i class="u"></i></span>`;
  cap.onclick = tapCap;
  $('#full-layer [data-mw]').appendChild(cap);
  M.set(momo, 'watch'); bub.textContent = 'Tap it! Tap it!';
  $('#full-layer .split').innerHTML = `Tap the capsule <span>0/3</span>`;
};
function tapCap() {
  if (G.phase !== 'crack') return;
  G.taps++;
  const cap = $('#full-layer .cap-drop');
  cap.classList.remove('w1', 'w2', 'w3'); void cap.offsetWidth; cap.classList.add('w' + G.taps);
  $$('.crack', cap)[G.taps - 1].classList.add('on');
  $$('.tapdots i', cap)[G.taps - 1].classList.remove('u');
  $('#full-layer .split span').textContent = `${G.taps}/3`;
  if (navigator.vibrate) try { navigator.vibrate(20 * G.taps); } catch (e) {}
  if (G.taps >= 3) { G.phase = 'reveal'; setTimeout(reveal, 260); }
}
function reveal() {
  const { p, dupe } = G.res, [rc, rs, rd, rl, dv] = RAR[p.r], high = p.r === 'epic' || p.r === 'legendary';
  if (!dupe) S.cabinet.unshift({ id: p.id, at: Date.now() });
  save();
  const fl = document.createElement('div'); fl.className = 'flash'; $('#fx-layer').appendChild(fl); setTimeout(() => fl.remove(), 800);
  const momoS = high ? 'celebrate' : 'happy';
  const trio = p.r === 'legendary' ? `${M.html('taku', 'wotagei')}${M.html('momo', 'celebrate')}${M.html('puri', 'victory', { acc: 'hs' })}` : p.r === 'epic' ? `${M.html('taku', 'cheer')}<span></span>${M.html('momo', momoS)}` : `<span></span><span></span>${M.html('momo', momoS)}`;
  const line = { common: 'Every sticker counts!', rare: 'Ooh, a Rare! Cute on you.', epic: 'EPIC!! TAKU, look!', legendary: 'LEGENDARY!! That\'s my debut card!!' }[p.r];
  const isPart = p.id.startsWith('av-'), isCoupon = !!p.art.coupon;
  const layer = $('#full-layer .gacha');
  layer.insertAdjacentHTML('beforeend', `<div class="reveal" style="--rc:${rc};--rs:${rs}" role="dialog" aria-label="${rl} prize: ${p.n}"><div class="rays"></div>
    <div class="bub pop" style="position:relative">${line}</div>
    <div class="prize ${p.r === 'legendary' || p.art.card ? 'holo' : ''}"><span class="pill" style="background:${rs};color:${rd}">${rl}</span><div class="art">${burst('rgba(255,255,255,.7)', 'burst" style="position:absolute;width:200px;height:200px')}<span style="position:relative">${prizeArt(p, 130)}</span></div><h3>${p.n}</h3><p>${p.d}</p></div>
    ${dupe ? `<span class="dupe">Duplicate · converted to +${dv} Ōra</span>` : ''}
    <div class="acts">${isCoupon ? '<button type="button" class="btn b-lime" data-act="useCoupon">Use now</button>' : isPart ? '<button type="button" class="btn b-lime" data-act="equip">Equip</button>' : '<button type="button" class="btn b-lime" data-act="cabinet">Cabinet</button>'}<button type="button" class="btn b-white" data-act="pullAgain">Pull again</button></div>
    <div class="trio">${trio}</div></div>`);
  confetti({ common: 20, rare: 20, epic: 34, legendary: 46 }[p.r], p.r === 'legendary' ? ['#FFC23D', '#FFF1C9', '#fff', '#A27BFF'] : undefined);
  if (dupe) setTimeout(() => earn(dv, { from: $('#full-layer .dupe'), mult: false }), 700);
  $('#full-layer .cap-drop') && $('#full-layer .cap-drop').remove();
}
ACT.pullAgain = () => { G.phase = 'idle'; drawGacha(canPull() ? 'Again? I love your energy!' : null); };
ACT.equip = () => { toast(S.partner, 'Equipped!', 'Your avatar is wearing it now.'); ACT.pullAgain(); };
ACT.useCoupon = () => { closeFull(); setBusy(false); goTab('stage'); push('shop'); };
ACT.cabinet = () => {
  const items = S.cabinet.map(c => PRIZES.find(p => p.id === c.id)).filter(Boolean).sort((a, b) => ORDER.indexOf(b.r) - ORDER.indexOf(a.r));
  openSheet(`${sheetHead('Capsule cabinet', 'momo')}${items.length ? `<div class="cab">${items.map(p => `<div class="it" style="--rcb:${RAR[p.r][0]}"><span class="a" style="background:${RAR[p.r][1]}">${prizeArt(p, 74)}</span><span class="pill" style="background:${RAR[p.r][1]};color:${RAR[p.r][2]};align-self:flex-start">${RAR[p.r][3]}</span><b>${p.n}</b><span>${p.d}</span></div>`).join('')}</div>` :
    `<div class="state" style="background:var(--momo-s)">${M.html('momo', 'sad', { size: 130 })}<h3>Your cabinet is empty</h3><p>Prizes from the capsule machine land here, sorted by rarity and expiry.</p><button type="button" class="btn b-ink" data-act="cabGacha">Turn the handle</button></div>`}`);
};
ACT.cabGacha = () => { closeSheet(); openGacha(); };

/* ======================= STAGE TAB + SHOP ======================= */
const PRODUCTS = [
  { id: 'tee', n: 'TAKU-kun Akiba tee', p: 899, who: 'taku', s: 'wotagei', bg: 'var(--taku)', sizes: true, d: 'Heavyweight cotton with TAKU mid-wotagei on the front. Printed in Tiruppur.', rate: 4.8 },
  { id: 'stand', n: 'Momo-chan debut acrylic stand', p: 649, who: 'momo', s: 'celebrate', bg: 'var(--momo)', d: '12 cm clear acrylic on a holo base. Limited to the Delhi festival run.', rate: 4.9 },
  { id: 'plush', n: 'Puri-kun squish plush', p: 1299, who: 'puri', s: 'happy', bg: 'var(--puri)', acc: 'hs', d: '25 cm and extra puffy, with a removable gamer headset.', rate: 4.7 },
  { id: 'glow', n: 'Ōra glowstick pair', p: 349, who: 'taku', s: 'cheer', bg: 'var(--lime)', d: '12 colours and a wotagei-grade grip strap. Batteries included.', rate: 4.6 }
];
const TIX = [
  { id: 'gen', n: 'General', p: 299, perks: ['Entry to both halls', 'Cosplay contest viewing', 'Ōta TOKYO event badge'] },
  { id: 'prime', n: 'Prime', p: 799, perks: ['Everything in General', 'Seated LIVE stage', 'Sushi workshop seat', '+1 Legend capsule ticket'] },
  { id: 'vip', n: 'VIP', p: 1999, perks: ['Everything in Prime', 'Front-row standing for Momo\'s debut', 'Meet-and-greet with voice actors', 'Fast-lane entry'] }
];
const hasCoupon = () => S.cabinet.some(c => c.id === 'cp-15');
const prodCard = p => `<button type="button" class="prod" data-act="product" data-id="${p.id}"><span class="a" style="background:${p.bg}">${burst('rgba(255,255,255,.35)', 'burst" style="position:absolute;width:170px;height:170px')}${M.html(p.who, p.s, { size: 118, acc: p.acc || '' })}</span><b>${p.n}</b><span class="pr"><span>₹${fmt(p.p)}</span><small>+${Math.floor(p.p / 10)} Ōra</small></span></button>`;
SCREENS.stage = () => `${topbar('Stage')}
  <section class="stagehero"><span class="over" style="color:#6A0F33">Hosted by Momo-chan</span><h2>Stage</h2><p>Events, capsules and merch. ${daysTo()} days to my debut!</p>${M.html('momo', 'wave', { poke: true })}</section>
  <div class="tiles">
    <button type="button" class="tile2" style="background:var(--ink);color:#fff" data-act="gacha"><h4>Capsule machine</h4><p style="color:#C9C3DD">${S.tickets.std + S.tickets.rare + S.tickets.legend} tickets ready</p><span class="art" style="display:flex;gap:4px"><span class="capsule" style="--c:var(--momo);width:30px;height:30px"></span><span class="capsule" style="--c:var(--rare);width:30px;height:30px"></span><span class="capsule" style="--c:var(--leg);width:30px;height:30px"></span></span></button>
    <button type="button" class="tile2" style="background:#fff" data-act="mytix"><h4>My tickets</h4><p class="mute">${S.tix.length ? `${S.tix.length} pass${S.tix.length > 1 ? 'es' : ''} in your wallet` : 'No passes yet'}</p><span class="art">${I.qr.replace('class="ic"', 'class="ic" style="width:40px;height:40px"')}</span></button>
  </div>
  <button type="button" class="ticket-hero" data-act="ticket" style="text-align:left"><span class="over" style="color:var(--lime)">28–29 Nov · Yashobhoomi, Dwarka</span><h2>Ōta TOKYO Delhi passes</h2><p>General, Prime and VIP. From ₹299.</p><span class="btn sm b-lime" style="align-self:flex-start;margin-top:auto">Pick your pass</span><span style="position:absolute;right:16px;bottom:16px;width:96px;height:110px;border-radius:20px;background:var(--lime);color:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(6deg)"><b style="font:400 40px/1 var(--f-disp)">28</b><span style="font-weight:800;font-size:12px">NOV · SAT</span><span class="jp" style="font-size:13px;margin-top:2px">祭</span></span></button>
  <div class="sec"><h3>Merch</h3><button type="button" data-act="shop">See all</button></div>
  ${hasCoupon() ? `<div class="card" style="flex-direction:row;align-items:center;background:var(--epic-s)"><span class="pill" style="background:#fff;color:var(--epic-d)">Epic coupon</span><b style="flex:1;font-size:14px">15% off merch applies itself at checkout</b></div>` : ''}
  <div class="pgrid">${PRODUCTS.map(prodCard).join('')}</div>`;
SCREENS.shop = () => `<div class="top"><button type="button" class="back" data-act="back" aria-label="Back">${I.back}</button><div class="who"><b>Merch store</b><span>Official Ōta TOKYO goods</span></div>${oraChip()}</div>
  <div class="card" style="flex-direction:row;align-items:center;padding:10px 14px">${I.search}<input placeholder="Search merch" style="flex:1;border:0;font:600 14px var(--f-body);outline:none;background:none;min-width:0" aria-label="Search merch"></div>
  <div class="chips">${['All', 'Apparel', 'Figures', 'Plush', 'Gear'].map((c, k) => `<span class="chip ${k ? '' : 'on'}">${c}</span>`).join('')}</div>
  <div class="card" style="flex-direction:row;align-items:center;background:var(--violet-s)"><span class="gem" style="width:30px;height:30px;border-radius:50%;background:var(--violet);display:grid;place-items:center;flex:none">${I.sparkle}</span><span style="font-weight:700;font-size:13.5px">Pay up to ${RANKS[rankIdx(S.power)].cap}% with Ōra at your rank. You have ${fmt(S.wallet)}.</span></div>
  <div class="pgrid">${PRODUCTS.map(prodCard).join('')}</div>
  <div class="state" style="background:var(--taku-s)">${M.html('taku', 'think', { size: 110 })}<h3>Can't find it?</h3><p>Pitch it to the Fan Council. 500 Cheers sends it to review.</p><button type="button" class="btn b-ink" data-act="council">Open Fan Council</button></div>`;
ACT.shop = () => push('shop');
ACT.product = el => push('product', { id: el.dataset.id });
SCREENS.product = ({ id }) => {
  const p = PRODUCTS.find(x => x.id === id);
  return `<div class="top"><button type="button" class="back" data-act="back" aria-label="Back">${I.back}</button><div class="who"><b>${p.n}</b><span>Official merch · ★ ${p.rate}</span></div>${oraChip()}</div>
  <section class="hero" style="background:${p.bg};min-height:300px;align-items:center;justify-content:center">${burst('rgba(255,255,255,.4)')}<div class="bub" data-say style="position:absolute;left:14px;top:14px">${{ taku: 'I own three. Wash cold, no regrets.', momo: 'This is my good side!', puri: 'Squish rating: 11/10.' }[p.who]}</div>${M.html(p.who, p.s, { poke: true, size: 230, acc: p.acc || '' })}</section>
  <div class="between"><b style="font:400 28px var(--f-disp)">₹${fmt(p.p)}</b><span class="pill" style="background:var(--violet-s);color:#4C31D1">+${Math.floor(p.p / 10)} Ōra when you buy</span></div>
  ${hasCoupon() ? `<div class="card" style="flex-direction:row;align-items:center;background:var(--epic-s);padding:12px 14px"><b style="flex:1;font-size:14px">Your 15% Epic coupon applies here</b><span class="pill" style="background:#fff;color:var(--epic-d)">−₹${fmt(Math.round(p.p * .15))}</span></div>` : ''}
  ${p.sizes ? `<div class="card"><div class="between"><h4>Size</h4><span class="mute" style="font-size:12px;font-weight:700">${S.size ? 'Remembered from last time' : 'Asked once, remembered'}</span></div><div class="sizes">${['S', 'M', 'L', 'XL', 'XXL'].map(z => `<button type="button" class="${S.size === z ? 'on' : ''}" data-act="size" data-z="${z}">${z}</button>`).join('')}</div></div>` : ''}
  <div class="card"><h4>About</h4><p style="font-weight:600">${p.d}</p></div>
  <div class="card"><h4>Reviews</h4><div class="row" style="align-items:flex-start">${initials('Kavya Pillai', 'fr2', 36)}<div class="col" style="gap:2px"><div class="row" style="gap:6px"><b>Kavya Pillai</b><span class="rank-chip">Senpai ★★</span></div><p style="font-weight:600;font-size:14px">Bought it at Bangalore, wearing it to Delhi. Quality is great.</p></div></div></div>
  <div style="height:70px"></div>
  <div class="dock"><div class="tot"><b>₹${fmt(p.p)}</b><span>before discounts</span></div><button type="button" class="btn b-ink" data-act="buy" data-kind="merch" data-id="${p.id}" ${p.sizes && !S.size ? 'aria-disabled="true"' : ''}>${p.sizes && !S.size ? 'Pick a size' : 'Buy now'}</button></div>`;
};
ACT.size = el => { S.size = el.dataset.z; save(); refresh(); };

let TK = { day: 0, tier: 'prime' };
SCREENS.ticket = () => {
  const t = TIX.find(x => x.id === TK.tier);
  return `<div class="top"><button type="button" class="back" data-act="back" aria-label="Back">${I.back}</button><div class="who"><b>Ōta TOKYO Delhi</b><span>Yashobhoomi, Dwarka · 28–29 Nov</span></div>${oraChip()}</div>
  <section class="ticket-hero"><span class="over" style="color:var(--lime)">Momo's debut · Day 1 · 6 pm</span><h2>${daysTo()} days to go</h2><p>50,000 fans, two halls, one idol debut.</p><div class="bub" data-say style="position:relative;margin-top:auto;max-width:170px">${{ gen: 'Every fan counts. See you there!', prime: 'Prime! Seated for my LIVE. Smart.', vip: 'VIP!! Front row! I\'ll wave at you!' }[TK.tier]}</div>${M.html('momo', TK.tier === 'vip' ? 'celebrate' : 'sparkle', { poke: true })}</section>
  <div class="sec"><h3>Pick a day</h3></div>
  <div class="days">${[['Sat 28 Nov', 'Momo\'s debut · cosplay finals'], ['Sun 29 Nov', 'Guest headliner · voice actors']].map(([d, s], k) => `<button type="button" class="${TK.day === k ? 'on' : ''}" data-act="tday" data-k="${k}" aria-pressed="${TK.day === k}"><b>${d}</b><span>${s}</span></button>`).join('')}</div>
  <div class="sec"><h3>Pick a pass</h3></div>
  ${TIX.map(x => `<button type="button" class="tier ${TK.tier === x.id ? 'on' : ''}" data-act="ttier" data-id="${x.id}" aria-pressed="${TK.tier === x.id}"><div class="between"><span class="row"><span class="rad"></span><b>${x.n}</b></span><b>₹${fmt(x.p)}</b></div><ul>${x.perks.map(p => `<li>${p}</li>`).join('')}</ul></button>`).join('')}
  <p class="mute" style="font-weight:600;font-size:12.5px">Example prices for the prototype. Check in at the gate on the day for +1,000 Ōra and a Legend capsule ticket.</p>
  <div style="height:70px"></div>
  <div class="dock"><div class="tot"><b>₹${fmt(t.p)}</b><span>${t.n} · ${TK.day ? 'Sun 29' : 'Sat 28'}</span></div><button type="button" class="btn b-ink" data-act="buy" data-kind="ticket">Continue</button></div>`;
};
ACT.ticket = () => { if (NAV.tab !== 'stage') { NAV.tab = 'stage'; NAV.stack = []; } push('ticket'); };
ACT.tday = el => { TK.day = +el.dataset.k; refresh(); };
ACT.ttier = el => { TK.tier = el.dataset.id; refresh(); M.react($('.ticket-hero .m'), TK.tier === 'vip' ? 'celebrate' : 'happy', 1200); };

/* checkout: coupon applies itself, Ōra slider capped by rank */
let CO = null;
ACT.buy = el => {
  const kind = el.dataset.kind;
  if (kind === 'merch') { const p = PRODUCTS.find(x => x.id === el.dataset.id); if (p.sizes && !S.size) { toast('taku', 'Pick a size first', 'We\'ll remember it for next time.'); return; } CO = { kind, name: p.n + (p.sizes ? ` · ${S.size}` : ''), price: p.p, who: p.who, ora: 0, coupon: hasCoupon() }; }
  else { const t = TIX.find(x => x.id === TK.tier); CO = { kind, name: `${t.n} pass · ${TK.day ? 'Sun 29 Nov' : 'Sat 28 Nov'}`, price: t.p, who: 'momo', ora: 0, coupon: false, tier: t.n }; }
  CO.ora = maxOra();
  drawCheckout();
};
function maxOra() {
  const cap = RANKS[rankIdx(S.power)].cap / 100;
  const base = CO.price - (CO.coupon ? Math.round(CO.price * .15) : 0);
  return Math.min(Math.floor(S.wallet / 10) * 10, Math.floor(base * cap) * 10);
}
function coTotals() { const cp = CO.coupon ? Math.round(CO.price * .15) : 0; const od = CO.ora / 10; return { cp, od, total: Math.max(0, CO.price - cp - od) }; }
function drawCheckout() {
  const { cp, od, total } = coTotals(), mx = maxOra(), cap = RANKS[rankIdx(S.power)].cap;
  openSheet(`${sheetHead('Checkout', CO.who)}
    <div class="card"><div class="between"><b>${CO.name}</b><b>₹${fmt(CO.price)}</b></div></div>
    ${CO.kind === 'merch' ? `<div class="card" style="flex-direction:row;align-items:center"><div class="col" style="gap:2px;flex:1"><b>15% Epic coupon</b><span class="mute" style="font-size:12.5px;font-weight:700">${hasCoupon() ? 'From your capsule cabinet' : 'Pull one from the capsule machine'}</span></div><button type="button" class="switch ${CO.coupon ? 'on' : ''}" data-act="coCoupon" aria-pressed="${CO.coupon}" aria-label="Apply coupon" ${hasCoupon() ? '' : 'disabled'}></button></div>` : ''}
    <div class="card"><div class="between"><b>Pay with Ōra</b><span class="pill" style="background:var(--violet-s);color:#4C31D1">${fmt(CO.ora)} Ōra = ₹${fmt(od)}</span></div>
      <input id="oraSlider" class="slider" type="range" min="0" max="${mx}" step="10" value="${CO.ora}" aria-label="Ōra to spend" ${mx ? '' : 'disabled'}>
      <span class="mute" style="font-size:12.5px;font-weight:700">${cap ? `${RANKS[rankIdx(S.power)].name} can cover up to ${cap}% with Ōra. 10 Ōra = ₹1. Spending never lowers your rank.` : 'Reach Kōhai to pay with Ōra.'}</span></div>
    <div class="card lines"><div><span>Subtotal</span><span>₹${fmt(CO.price)}</span></div>${cp ? `<div class="g"><span>Coupon</span><span>−₹${fmt(cp)}</span></div>` : ''}${od ? `<div class="g"><span>Ōra</span><span>−₹${fmt(od)}</span></div>` : ''}<div class="t"><span>Total</span><span>₹${fmt(total)}</span></div></div>
    <button type="button" class="btn b-ink full" data-act="pay">Pay ₹${fmt(total)} · UPI</button>
    <p class="mute" style="text-align:center;font-size:12px;font-weight:700">Demo checkout. No money moves. You earn +${Math.floor(total / 10)} Ōra.</p>`);
  const sl = $('#oraSlider');
  sl && sl.addEventListener('input', () => { CO.ora = +sl.value; const t = coTotals(); $('#sheet .pill').textContent = `${fmt(CO.ora)} Ōra = ₹${fmt(t.od)}`; });
  sl && sl.addEventListener('change', () => drawCheckout());
}
ACT.coCoupon = () => { CO.coupon = !CO.coupon; CO.ora = Math.min(CO.ora, maxOra()); drawCheckout(); };
ACT.pay = async () => {
  const { total } = coTotals();
  setBusy(true); closeSheet();
  await loading('Processing payment', 'Momo is wrapping it up', 1300);
  if (CO.ora) spend(CO.ora);
  if (CO.coupon) S.cabinet = S.cabinet.filter(c => c.id !== 'cp-15');
  const code = 'OTA-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  if (CO.kind === 'ticket') { S.tix.push({ n: CO.name, code, tier: CO.tier }); if (CO.tier !== 'General') S.tickets.legend++; }
  save();
  openFull(`<div class="res" style="background:var(--momo);align-items:center" role="dialog" aria-label="Purchase complete">${burst('rgba(255,255,255,.35)')}
    <div class="hero2">${M.html('momo', 'celebrate', { size: 160 })}<h2>${CO.kind === 'ticket' ? 'See you at my debut!' : 'It\'s on its way!'}</h2><p style="font-weight:700">${CO.kind === 'ticket' ? 'Your pass is in My tickets. Show the QR at the gate.' : 'Ships in 3–5 days to your saved address.'}</p></div>
    ${CO.kind === 'ticket' ? qrTicket(S.tix[S.tix.length - 1]) : `<div class="qr-ticket" style="padding:16px;display:flex;align-items:center;gap:12px">${I.bag}<b style="flex:1">${CO.name}</b><span class="pill">${code}</span></div>`}
    ${CO.kind === 'ticket' && CO.tier !== 'General' ? `<span class="dupe" style="position:relative">+1 Legend capsule ticket</span>` : ''}
    <button type="button" class="btn b-ink full" style="max-width:340px;position:relative;margin-top:auto" data-act="payDone">Done</button></div>`);
  confetti(40);
  setTimeout(() => earn(Math.floor(total / 10), { from: $('#full-layer .hero2'), mult: false }), 500);
};
ACT.payDone = () => { closeFull(); setBusy(false); NAV.stack = []; goTab('stage'); };
function qrSvg(seed) {
  let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => (h = (h * 1103515245 + 12345) >>> 0) / 4294967296;
  const N = 25; let r = '';
  const finder = (x, y) => r += `<rect x="${x}" y="${y}" width="7" height="7" fill="#1C1830"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#1C1830"/>`;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const inF = (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9); if (!inF && rnd() > .52) r += `<rect x="${x}" y="${y}" width="1" height="1" fill="#1C1830"/>`; }
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  return `<svg width="170" height="170" viewBox="-1 -1 ${N + 2} ${N + 2}" shape-rendering="crispEdges" role="img" aria-label="Ticket QR code ${seed}"><rect x="-1" y="-1" width="${N + 2}" height="${N + 2}" fill="#fff"/>${r}</svg>`;
}
const qrTicket = t => `<div class="qr-ticket" style="position:relative"><div class="tt"><b>Ōta TOKYO Delhi</b><span>${t.n} · Yashobhoomi</span></div><div class="qb">${qrSvg(t.code)}<span class="pill" style="margin-top:8px">${t.code}</span></div></div>`;
ACT.mytix = () => openSheet(`${sheetHead('My tickets', 'momo')}${S.tix.length ? `<div class="col" style="align-items:center;--sheetbg:var(--ground)">${S.tix.map(qrTicket).join('')}</div><p class="mute" style="text-align:center;font-weight:700;font-size:13px">On event day a Check in chip appears on Home. Gate scan: +1,000 Ōra.</p>` :
  `<div class="state" style="background:var(--momo-s)">${M.html('momo', 'sad', { size: 130 })}<h3>No passes yet</h3><p>Grab a pass for my debut on 28 Nov. Prime and VIP include a Legend capsule ticket.</p><button type="button" class="btn b-ink" data-act="ticketGo">Pick a pass</button></div>`}`);
