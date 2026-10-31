/* Ōta Life · screens: onboarding, Home, Discover (reels, communities, Fan Council), Me (journey, badges, lab) */

/* ======================= ONBOARDING ======================= */
const OB = { step: 'splash', buddy: 'momo', a: [], b: null, c: null };
const BUDDY = {
  taku: { bg: 'var(--taku)', tag: 'The Ultimate Akiba Otaku', line: 'Yoroshiku! I know every reference. Let\'s find your 推し (oshi), your favourite!', sub: 'Hosts Discover: reels, words, communities, Fan Council' },
  momo: { bg: 'var(--momo)', tag: 'The Rising Debut Idol', line: 'Hi hi! My debut is at Ōta TOKYO on 28 Nov. Be my first fan?', sub: 'Hosts Stage: events, shop, capsules, streaks' },
  puri: { bg: 'var(--puri)', tag: 'The Hardcore Gamer', line: 'Player two has entered the game. Let\'s speedrun this.', sub: 'Hosts Battle: quizzes, arena, leaderboards' }
};
function obRender() {
  const s = OB.step;
  const dots = n => `<div class="dots">${[0, 1, 2, 3, 4].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</div>`;
  const hdr = n => `<div class="row">${dots(n)}${S.power ? oraChip() : ''}</div>`;
  let h = '';
  if (s === 'splash') {
    h = `<div class="ob splash">${burst('rgba(255,255,255,.1)')}
      <div class="logo"><h1>Ōta<br>Life</h1><span>オタライフ</span></div>
      <div class="cast">
        <div style="position:absolute;left:2%;bottom:0;width:150px;height:150px;--from:-260px">${M.html('taku', 'wave', { size: 150, poke: true })}</div>
        <div style="position:absolute;left:50%;margin-left:-85px;bottom:30px;width:170px;height:170px;--from:0px">${M.html('momo', 'sparkle', { size: 170, poke: true })}</div>
        <div style="position:absolute;right:0;bottom:0;width:140px;height:140px;--from:260px">${M.html('puri', 'gg', { size: 140, poke: true, acc: 'hs' })}</div>
      </div>
      <p>Anime, quizzes, capsules and the Ōta TOKYO festival. Every tap earns Ōra.</p>
      <div class="col" style="width:100%;position:relative"><button type="button" class="btn b-lime full" data-act="obGo" data-to="pick">Get started</button>
      <button type="button" class="btn b-ghost full" data-act="obDemo">Explore the demo account</button></div></div>`;
  }
  if (s === 'pick') {
    const b = BUDDY[OB.buddy];
    h = `<div class="ob" style="background:${b.bg}">${hdr(0)}
      <div><span class="over" style="color:var(--ink)">Step 1 · your buddy</span><h2>Pick your buddy</h2></div>
      <div class="bigstage">${burst('rgba(255,255,255,.45)')}<div class="bub" data-say>${b.line}</div>${M.html(OB.buddy, 'happy', { poke: true, size: 220, acc: OB.buddy === 'puri' ? 'hs' : '' })}</div>
      <p style="font-weight:800;font-size:13.5px;text-align:center">${b.sub}</p>
      <div class="picker">${['taku', 'momo', 'puri'].map(w => `<button type="button" data-act="obBuddy" data-w="${w}" class="${OB.buddy === w ? 'on' : ''}" aria-pressed="${OB.buddy === w}"><span class="face" style="background:${BUDDY[w].bg}">${M.html(w, 'idle')}</span><b>${M.NAMES[w]}</b><span>${BUDDY[w].tag.replace('The ', '')}</span></button>`).join('')}</div>
      <button type="button" class="btn b-ink full" data-act="obGo" data-to="q1">Team up with ${M.NAMES[OB.buddy]}</button></div>`;
  }
  if (s === 'q1') {
    const opts = ['Jujutsu Kaisen', 'One Piece', 'Darling in the FranXX', 'Naruto', 'Demon Slayer', 'Spy x Family', 'Haikyu!!', 'Chainsaw Man'];
    h = `<div class="ob" style="background:var(--taku-s)">${hdr(1)}
      <div class="row" style="align-items:flex-end">${M.html('taku', OB.a.length ? 'wotagei' : 'think', { size: 120, poke: true })}<div class="bub" data-say>${OB.a.length ? `${OB.a.length} picked! I'll add you to their communities.` : 'What are you watching? Pick a few!'}</div></div>
      <div><span class="over" style="color:var(--taku-d)">TAKU asks · +40 Ōra</span><h2>Your favourite anime?</h2></div>
      <div class="opts">${opts.map(o => `<button type="button" class="chip ${OB.a.includes(o) ? 'on' : ''}" data-act="obA" data-v="${o}">${o}</button>`).join('')}</div>
      <div style="margin-top:auto" class="col"><button type="button" class="btn ${OB.a.length ? 'b-ink' : 'b-dis'} full" data-act="obAnswer" data-q="1" ${OB.a.length ? '' : 'aria-disabled="true"'}>${OB.a.length ? 'Continue · +40 Ōra' : 'Pick at least one'}</button><button type="button" class="btn b-white full" data-act="obGo" data-to="q2">Skip</button></div></div>`;
  }
  if (s === 'q2') {
    const opts = [['Mobile', 'Gacha and rhythm games'], ['Console', 'Switch, PlayStation'], ['PC', 'Steam all night'], ['I just watch', 'No games, all anime']];
    h = `<div class="ob" style="background:var(--puri-s)">${hdr(2)}
      <div class="row" style="align-items:flex-end">${M.html('puri', OB.b ? 'gg' : 'idle', { size: 120, poke: true, acc: 'hs' })}<div class="bub" data-say>${OB.b ? 'Respect. I\'ll queue quizzes for that.' : 'Where do you play? Be honest.'}</div></div>
      <div><span class="over" style="color:var(--puri-d)">Puri asks · +30 Ōra</span><h2>What do you play on?</h2></div>
      <div class="col">${opts.map(([o, d], k) => `<button type="button" class="opt ${OB.b === o ? 'sel' : ''}" data-act="obB" data-v="${o}" style="background:#fff"><i>${'ABCD'[k]}</i><span>${o}<br><small class="mute" style="font-weight:700">${d}</small></span></button>`).join('')}</div>
      <div style="margin-top:auto" class="col"><button type="button" class="btn ${OB.b ? 'b-ink' : 'b-dis'} full" data-act="obAnswer" data-q="2">${OB.b ? 'Continue · +30 Ōra' : 'Pick one'}</button><button type="button" class="btn b-white full" data-act="obGo" data-to="q3">Skip</button></div></div>`;
  }
  if (s === 'q3') {
    const opts = [['Meet voice actors', '声'], ['Cosplay contest', '装'], ['Shop exclusive merch', '物'], ['Watch the LIVE stage', '歌']];
    h = `<div class="ob" style="background:var(--momo-s)">${hdr(3)}
      <div class="row" style="align-items:flex-end">${M.html('momo', OB.c ? 'sparkle' : 'wave', { size: 120, poke: true })}<div class="bub" data-say>${OB.c ? 'Ahh, I\'ll save you a spot!' : 'What would make Ōta TOKYO perfect for you?'}</div></div>
      <div><span class="over" style="color:var(--momo-d)">Momo asks · +30 Ōra</span><h2>Your festival goal?</h2></div>
      <div class="col">${opts.map(([o, k]) => `<button type="button" class="opt ${OB.c === o ? 'sel' : ''}" data-act="obC" data-v="${o}" style="background:#fff"><i class="jp" style="background:var(--momo-s);color:var(--momo-d);font-size:17px">${k}</i><span>${o}</span></button>`).join('')}</div>
      <div style="margin-top:auto" class="col"><button type="button" class="btn ${OB.c ? 'b-ink' : 'b-dis'} full" data-act="obAnswer" data-q="3">${OB.c ? 'Continue · +30 Ōra' : 'Pick one'}</button><button type="button" class="btn b-white full" data-act="obGo" data-to="warm">Skip</button></div></div>`;
  }
  if (s === 'warm') {
    const b = OB.buddy;
    h = `<div class="ob" style="background:var(--puri)">${hdr(4)}
      <div class="bigstage">${burst('rgba(255,255,255,.4)')}<div class="bub" data-say>${{ taku: 'Last step: a warm-up battle! Three easy Japanese words. Ganbatte!', momo: 'Last step! A tiny warm-up quiz. I\'ll be cheering!', puri: 'Tutorial boss: three questions. Don\'t choke.' }[b]}</div>${M.html('puri', 'excited', { size: 210, poke: true, acc: 'hs' })}</div>
      <div><span class="over" style="color:var(--puri-d)">Warm-up battle · up to +90 Ōra</span><h2>3 questions, 15 seconds each</h2></div>
      <button type="button" class="btn b-ink full" data-act="obWarm">Start the battle</button></div>`;
  }
  openFull(h);
  if (s === 'pick') setTimeout(() => M.react($('#full-layer .bigstage .m'), 'happy'), 50);
}
ACT.obGo = el => { OB.step = el.dataset.to; obRender(); };
ACT.obBuddy = el => { OB.buddy = el.dataset.w; S.partner = OB.buddy; obRender(); };
ACT.obA = el => { const v = el.dataset.v; OB.a = OB.a.includes(v) ? OB.a.filter(x => x !== v) : [...OB.a, v]; obRender(); };
ACT.obB = el => { OB.b = el.dataset.v; obRender(); };
ACT.obC = el => { OB.c = el.dataset.v; obRender(); };
ACT.obAnswer = async el => {
  const q = el.dataset.q;
  if ((q === '1' && !OB.a.length) || (q === '2' && !OB.b) || (q === '3' && !OB.c)) return;
  if (q === '1') { if (OB.a.includes('Jujutsu Kaisen')) S.joined.jjk = true; if (OB.a.includes('One Piece')) S.joined.op = true; S.joined.nihongo = true; }
  earn({ 1: 40, 2: 30, 3: 30 }[q], { from: el, mult: false });
  await wait(700);
  OB.step = { 1: 'q2', 2: 'q3', 3: 'warm' }[q]; obRender();
};
ACT.obWarm = () => { startQuiz('warmup'); };
ACT.obDemo = () => { S = DEMO(); save(); closeFull(); NAV.tab = 'home'; NAV.stack = []; paint(); };
async function finishOnboarding() {
  // welcome bonus tops the user up to Kōhai so the first boss always lands in session one
  const bonus = Math.max(100, 500 - S.power);
  S.onboarded = true; S.partner = OB.buddy;
  closeFull(); NAV.tab = 'home'; NAV.stack = []; paint();
  await wait(300);
  toast(S.partner, `Welcome bonus +${bonus} Ōra`, 'Your Power just hit Kōhai…');
  earn(bonus, { from: $('#view .hero'), mult: false });
  await wait(1200);
  while (busy || EVQ.length) await wait(300);
  S.tickets.std += 1; save(); refresh();
  openSheet(`${sheetHead('A gift from Momo', 'momo')}<div class="state" style="background:var(--momo-s)">${M.html('momo', 'celebrate', { size: 150 })}<h3>Your first capsule ticket!</h3><p>Turn it in my capsule machine on Stage for a sticker, an avatar part or something rarer.</p><span class="row" style="font-weight:800"><span class="capsule" style="--c:var(--momo)"></span> +1 Standard ticket</span></div><button type="button" class="btn b-ink full" data-act="closeSheet">Show me around</button>`, () => setTimeout(tour, 300));
}

/* ======================= HOME ======================= */
function streakInfo() {
  const p = S.streakPreview;
  if (p === 'lively' || (!p && S.doneToday && !S.mileFresh && S.streak >= 7)) return { k: 'lively', s: 'lively', tag: 'On fire', line: `${S.streak} days! I'm buzzing!` };
  if (p === 'mile' || (!p && S.doneToday && S.mileFresh)) return { k: 'mile', s: 'celebrate', tag: `${S.streak}-day milestone`, line: `×${streakMult()} Ōra boost unlocked!` };
  if (p === 'risk' || (!p && !S.doneToday && S.streak > 0)) return { k: 'risk', s: 'sleepy', tag: 'Streak at risk', line: 'Play today\'s challenge or I nod off…' };
  if (!S.doneToday && S.streak === 0) return { k: 'start', s: 'wave', tag: 'Start a streak', line: 'One challenge a day lights me up' };
  return { k: 'ok', s: 'happy', tag: 'Kept today', line: 'See you tomorrow!' };
}
function weekDots() {
  const n = S.streak, today = 6;
  return TODAY_WEEK.map((d, k) => {
    const kept = k < today ? (today - k <= (S.doneToday ? n - 1 : n)) : S.doneToday;
    return `<i class="${kept ? 'y' : ''} ${k === today ? 't' : ''}">${d}</i>`;
  }).join('');
}
function questRows() {
  const q = S.quests;
  const rows = [
    { id: 'checkin', who: 'momo', bg: 'var(--momo-s)', t: 'Check in with Momo', sub: '+20 Ōra · +1 ticket', done: q.checkin },
    { id: 'challenge', who: 'puri', bg: 'var(--puri-s)', t: 'Play the Daily Challenge', sub: '+250 Ōra · keeps streak', done: q.challenge },
    { id: 'reels', who: 'taku', bg: 'var(--taku-s)', t: 'Watch 2 reels to the end', sub: `${Math.min(2, q.reels)}/2 · +5 Ōra per tick`, done: q.reels >= 2, prog: Math.min(1, q.reels / 2) }
  ];
  return rows.map(r => `<button type="button" class="quest ${r.done ? 'done' : ''}" data-act="quest" data-q="${r.id}"><span class="tile" style="background:${r.bg}">${M.html(r.who, r.done ? 'happy' : 'idle', { acc: r.who === 'puri' ? 'hs' : '' })}</span>
    <span class="q"><b>${r.t}</b><span>${r.sub}</span>${r.prog !== undefined && !r.done ? `<span class="bar"><i style="width:${r.prog * 100}%"></i></span>` : ''}</span>
    <span class="ck">${r.done ? `<span style="color:#fff">${I.check}</span>` : ''}</span></button>`).join('');
}
function jarSvg(n, cap = 60, w = 56) {
  const f = Math.min(1, n / cap), rows = Math.ceil(f * 6);
  let coins = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < 3; c++) coins += `<circle cx="${17 + c * 11 + (r % 2) * 4}" cy="${62 - r * 8}" r="5.5" fill="#F7D46A" stroke="#2B2540" stroke-width="2"/>`;
  return `<svg class="j" width="${w}" height="${w * 1.2}" viewBox="0 0 56 72" aria-hidden="true"><rect x="12" y="4" width="32" height="9" rx="3" fill="#6E88C7" stroke="#2B2540" stroke-width="3"/><path d="M14 13 Q6 20 6 32 V60 Q6 70 16 70 H40 Q50 70 50 60 V32 Q50 20 42 13 Z" fill="rgba(255,255,255,.75)" stroke="#2B2540" stroke-width="3"/>${coins}<path d="M14 26 Q12 40 14 54" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/></svg>`;
}
const daysTo = () => Math.max(0, Math.ceil((new Date(2026, 10, 28) - new Date(2026, 9, 30)) / 864e5));
SCREENS.home = () => {
  const st = starsOf(S.power), si = streakInfo(), allDone = S.quests.checkin && S.quests.challenge && S.quests.reels >= 2;
  const doneN = [S.quests.checkin, S.quests.challenge, S.quests.reels >= 2].filter(Boolean).length;
  const nx = st.next;
  const goalTxt = !nx ? 'Max rank' : st.stars < 3 ? `<span><b>${fmt(st.to - S.power)}</b> to ${RANKS[st.i].name} ${starStr(st.stars + 1)} · +1 ticket</span>` : `<span><b>${fmt(nx.min - S.power)}</b> to ${nx.name} · boss fight</span>`;
  return `${topbar()}
  <section class="hero" aria-label="Your buddy and Power">
    ${burst('rgba(255,255,255,.12)')}
    <div class="stagex"><div class="bub" data-say>${homeLine()}</div>${M.html(S.partner, 'wave', { poke: true, acc: S.partner === 'puri' ? 'hs' : '' })}</div>
    <div class="lvl"><div><small>Power · ${title()}</small><b class="num">${fmt(S.power)} Ōra</b></div><button type="button" class="btn sm b-lime" data-act="journey">Journey ${I.chev}</button></div>
    <div class="obar" role="progressbar" aria-valuenow="${Math.round(st.pct * 100)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${st.pct * 100}%"></i></div>
    <div class="goal">${goalTxt}<span>${streakMult() > 1 ? `×${streakMult()} streak` : ''}</span></div>
  </section>
  <div class="duo">
    <button type="button" class="streak ${si.k}" data-act="streak"><span class="pill state">${si.tag}</span><b class="num">${S.streak}</b><span class="lab2">day streak</span>${M.html('momo', si.s)}<div class="week">${weekDots()}</div></button>
    <button type="button" class="tix" data-act="gacha"><span class="over" style="color:#C9C3DD">Capsule tickets</span>
      <span class="caps"><span><span class="capsule" style="--c:var(--momo)"></span>Standard<b>${S.tickets.std}</b></span><span><span class="capsule" style="--c:var(--rare)"></span>Rare+<b>${S.tickets.rare}</b></span><span><span class="capsule" style="--c:var(--leg)"></span>Legend<b>${S.tickets.legend}</b></span></span>
      <span class="go">Pull with Momo</span></button>
  </div>
  <section class="card questcard"><div class="between"><h3 style="font-size:19px">Today's quests</h3><span class="pill">${doneN}/3</span></div>
    <div class="quests">${questRows()}</div>
    ${S.boardClaimed ? `<div class="chest" style="background:#E3F7C9"><b style="color:#3C6000">Board cleared · +150 Ōra and a ticket claimed</b></div>` :
      `<div class="chest ${allDone ? 'ready' : ''}" ${allDone ? 'data-act="claimBoard" role="button" tabindex="0"' : ''}><span class="capsule" style="--c:var(--violet)"></span><span class="bar"><i style="width:${doneN / 3 * 100}%"></i></span><b>${allDone ? 'Open chest · +150' : '+150 Ōra chest'}</b></div>`}
  </section>
  <button type="button" class="jarcard" data-act="reel">${jarSvg(S.jar)}<div class="col" style="gap:3px"><h4>Puri's watch jar</h4><p>${S.jar} tokens today · each 5 s of a reel drops one (+5 Ōra)</p><span class="pill" style="background:#fff;align-self:flex-start">${S.jar >= 60 ? 'Jar full for today' : `${60 - S.jar} tokens of room left`}</span></div></button>
  <button type="button" class="event" data-act="ticket"><div><span class="over" style="color:var(--lime)">Ōta TOKYO Delhi · 28–29 Nov</span><h4>Momo's debut in ${daysTo()} days</h4><p>Yashobhoomi, Dwarka. Passes from ₹299.</p>
    <div class="cd"><span><b>${daysTo()}</b>days</span><span><b>2</b>stages</span><span><b>50k</b>fans</span></div></div>${M.html('momo', 'excited')}</button>
  <button type="button" class="card" data-act="arena" style="flex-direction:row;align-items:center;text-align:left">
    <span class="tile" style="width:52px;height:52px;border-radius:16px;background:var(--puri);display:grid;place-items:end center;overflow:hidden;flex:none">${M.html('puri', 'idle', { size: 66, acc: 'hs' }).replace('style="--sz:66px"', 'style="--sz:66px;margin-bottom:-16px"')}</span>
    <span class="col" style="gap:2px;flex:1"><b style="font:400 17px var(--f-disp)">${RANKS[rankIdx(S.power)].name} League · #${arenaPos()}</b><span class="mute" style="font-weight:700;font-size:13px">${fmt(S.weekOra)} Ōra this week · top 5 move up</span></span>${I.chev}</button>`;
};
function homeLine() {
  const si = streakInfo(), h = new Date().getHours();
  const L = {
    puri: si.k === 'risk' ? 'Streak\'s on the line. Daily Challenge. Now.' : S.tickets.std ? `You've got ${S.tickets.std} capsule ticket${S.tickets.std > 1 ? 's' : ''}. Loot time?` : 'Queue up. Daily Challenge is live.',
    momo: si.k === 'risk' ? `${S.streak} days together! Don't leave me hanging tonight.` : `${daysTo()} days to my debut! Practice with me?`,
    taku: S.wordDone ? 'Nice! 推し learned. Reels next?' : 'Word of the day is 推し (oshi). Wanna learn it?'
  };
  return h < 5 ? 'Up late? Same.' : L[S.partner];
}
AFTER.home = () => {};
ACT.quest = async el => {
  const q = el.dataset.q;
  if (q === 'checkin') {
    if (S.quests.checkin) return;
    S.quests.checkin = true; S.tickets.std++;
    const mo = $('.streak .m'); M.react(mo, 'sparkle', 1100);
    earn(20, { from: el });
    toast('momo', 'Checked in!', '+1 Standard ticket. See you tomorrow?');
    await wait(500); refresh();
  }
  if (q === 'challenge') { if (S.quests.challenge) return goTab('battle'); startQuiz('daily'); }
  if (q === 'reels') openReel(0);
};
ACT.claimBoard = async el => {
  S.boardClaimed = true; S.tickets.std++;
  earn(150, { from: el, mult: false });
  confetti(40);
  openSheet(`${sheetHead('Quest board cleared!')}<div class="state" style="background:var(--violet-s)"><div class="row" style="justify-content:center;gap:0">${M.html('taku', 'cheer', { size: 100 })}${M.html('momo', 'celebrate', { size: 110 })}${M.html('puri', 'victory', { size: 100, acc: 'hs' })}</div><h3>+150 Ōra and a ticket</h3><p>All three of us are proud. New quests arrive at midnight.</p></div><button type="button" class="btn b-ink full" data-act="closeSheet">Nice</button>`, refresh);
};
ACT.streak = () => {
  const si = streakInfo(), nm = nextMult();
  const ladder = [[3, '×1.1'], [7, '×1.2'], [30, '×1.3'], [100, '×1.5']];
  openSheet(`${sheetHead('Your streak')}
    <div class="streak ${si.k}" style="min-height:220px"><span class="pill state">${si.tag}</span><b class="num" style="font-size:56px">${S.streak}</b><span class="lab2">days · ${si.line}</span>${M.html('momo', si.s, { size: 150 })}<div class="week">${weekDots()}</div></div>
    <div class="card"><div class="between"><h4>Ōra multiplier</h4><span class="pill" style="background:var(--violet-s);color:#4C31D1">Now ×${streakMult()}</span></div>
      <div class="stages">${ladder.map(([d, m]) => `<span class="${S.streak >= d ? 'done on' : ''}"><i><b style="width:${Math.min(100, S.streak / d * 100)}%"></b></i>${d} days · ${m}</span>`).join('')}</div>
      <p class="mute" style="font-weight:600;font-size:13px">${nm ? `${nm[0] - S.streak} more day${nm[0] - S.streak > 1 ? 's' : ''} to ×${nm[1]}.` : 'Max multiplier.'} One Daily Challenge a day keeps it. Momo sends one nudge at 8 pm if it's at risk, never more.</p></div>
    <div class="card" style="flex-direction:row;align-items:center"><span class="capsule" style="--c:var(--lime);width:34px;height:34px"></span><div class="col" style="gap:2px;flex:1"><b>Encore shields · ${S.shields}/2</b><span class="mute" style="font-size:12.5px;font-weight:700">Covers one missed day. 500 Ōra each.</span></div><button type="button" class="btn sm ${S.wallet >= 500 && S.shields < 2 ? 'b-ink' : 'b-dis'}" data-act="buyShield">Buy</button></div>
    <div class="card"><span class="over">Preview Momo's streak moods</span><div class="chips" style="margin:0;padding:0;flex-wrap:wrap">${[['', 'Live'], ['lively', 'Lively (7+ days)'], ['risk', 'Sleepy (at risk)'], ['mile', 'Milestone']].map(([k, l]) => `<button type="button" class="chip ${(S.streakPreview || '') === k ? 'on' : ''}" style="background:${(S.streakPreview || '') === k ? '' : 'var(--ground)'}" data-act="streakPrev" data-k="${k}">${l}</button>`).join('')}</div></div>`, refresh);
};
ACT.streakPrev = el => { S.streakPreview = el.dataset.k || null; save(); ACT.streak(); };
ACT.buyShield = el => { if (S.wallet < 500 || S.shields >= 2) return; spend(500); S.shields++; save(); toast('momo', 'Encore shield ready', 'If you miss a day, I\'ll hold the streak.'); ACT.streak(); };
ACT.wallet = () => {
  const st = starsOf(S.power);
  openSheet(`${sheetHead('Your Ōra')}
    <div class="hero" style="min-height:0;gap:8px">${burst('rgba(255,255,255,.12)')}<div class="between" style="position:relative"><div><small style="font-weight:700;color:#DCD4FF">Wallet · spendable</small><b style="display:block;font:400 32px var(--f-disp)" class="num">${fmt(S.wallet)}</b></div><div style="text-align:right"><small style="font-weight:700;color:#DCD4FF">Power · lifetime</small><b style="display:block;font:400 22px var(--f-disp)" class="num">${fmt(S.power)}</b></div></div>
    <div class="obar"><i style="width:${st.pct * 100}%"></i></div><p style="position:relative;font-weight:700;font-size:13px;color:#E4DEFF">Power sets your rank. Spending only lowers your Wallet, so your rank never drops.</p></div>
    <div class="card"><h4>Ways to earn today</h4><div class="lines">
      <div><span>Daily check-in</span><b>+20</b></div><div><span>Daily Challenge, per right answer</span><b>+30</b></div><div><span>Daily Challenge cleared</span><b>+100</b></div>
      <div><span>Every 5 s of a reel (Puri token)</span><b>+5</b></div><div><span>Word of the day</span><b>+20</b></div><div><span>Cheer a Fan Council idea</span><b>+10</b></div><div><span>Quest board cleared</span><b>+150</b></div><div><span>Shop purchase</span><b>1 per ₹10</b></div></div>
      <p class="mute" style="font-size:12.5px;font-weight:600">Your ${S.streak}-day streak multiplies daily Ōra by ×${streakMult()}.</p></div>`);
};
ACT.inbox = () => {
  S.inboxRead = true; save();
  const msgs = [
    { w: 'momo', t: streakInfo().k === 'risk' ? `${S.streak} days in a row! Don't leave me hanging before my debut.` : 'Passes for my debut are selling fast. Prime still has seats!', a: streakInfo().k === 'risk' ? ['Play now', 'quizDaily'] : ['See passes', 'ticketGo'], time: '8:00 pm' },
    { w: 'puri', t: `New Weekly Arena bracket: 29 rivals near your rank. You're #${arenaPos()}.`, a: ['Open arena', 'arenaGo'], time: '6:12 pm' },
    { w: 'taku', t: 'Word of the day: 推し (oshi), your favourite character. Tap to learn it, +20 Ōra.', a: ['Learn it', 'wordGo'], time: '9:30 am' }
  ];
  openSheet(`${sheetHead('Mascot inbox')}${msgs.map(m => `<div class="card" style="flex-direction:row;align-items:flex-start;background:var(--${m.w}-s)"><span style="width:52px;height:52px;border-radius:16px;overflow:hidden;display:grid;place-items:end center;background:var(--${m.w});flex:none">${M.html(m.w, 'idle', { size: 66, acc: m.w === 'puri' ? 'hs' : '' }).replace('style="--sz:66px"', 'style="--sz:66px;margin-bottom:-16px"')}</span><div class="col" style="gap:6px;flex:1"><div class="between"><b>${M.NAMES[m.w]}</b><span class="mute" style="font-size:12px;font-weight:700">${m.time}</span></div><p style="font-weight:600;font-size:14px">${m.t}</p><button type="button" class="btn sm b-ink" style="align-self:flex-start" data-act="${m.a[1]}">${m.a[0]}</button></div></div>`).join('')}`, refresh);
};
ACT.quizDaily = () => { closeSheet(); startQuiz('daily'); };
ACT.ticketGo = () => { closeSheet(); goTab('stage'); push('ticket'); };
ACT.arenaGo = () => { closeSheet(); goTab('battle'); push('arena'); };
ACT.wordGo = () => { closeSheet(); goTab('discover'); };

/* ======================= DISCOVER (TAKU) ======================= */
const REELS = [
  { id: 'r1', t: '5 anime words you already know', by: '@nihongo.with.neha', cat: 'Learn', bg: ['#6C4DF6', '#FF9DBB'], k: 'すごい', dur: 15 },
  { id: 'r2', t: 'Thunder-breathing cosplay in 60 seconds', by: '@cosplay.riya', cat: 'Cosplay', bg: ['#FFB23D', '#FF5A7E'], k: '雷', dur: 20 },
  { id: 'r3', t: 'Tokyo konbini haul, rupee edition', by: '@japanwithaarav', cat: 'Japan', bg: ['#4FB3E0', '#6C4DF6'], k: 'コンビニ', dur: 15 },
  { id: 'r4', t: 'Ōta TOKYO Bangalore: the recap', by: '@ota.official', cat: 'Anime', bg: ['#241A5C', '#E66F98'], k: '祭', dur: 20 },
  { id: 'r5', t: 'Is filler actually bad? A defence', by: '@animenewsguy', cat: 'Anime', bg: ['#3F9E63', '#241A5C'], k: 'フィラー', dur: 15 }
];
const reelArt = (r, big) => `<div class="art" style="background:linear-gradient(165deg,${r.bg[0]},${r.bg[1]})"><span class="jp" style="position:absolute;left:${big ? 20 : 10}px;top:${big ? 140 : 46}px;font-size:${big ? (r.k.length > 2 ? 64 : 120) : (r.k.length > 2 ? 30 : 64)}px;line-height:1;color:rgba(255,255,255,.92);${big ? 'animation:m-float 4s ease-in-out infinite' : ''}">${r.k}</span><span style="position:absolute;right:-30px;top:${big ? 300 : 120}px;width:${big ? 200 : 90}px;height:${big ? 200 : 90}px;border-radius:50%;background:rgba(255,255,255,.14)"></span><span style="position:absolute;left:-20px;bottom:${big ? 160 : 60}px;width:${big ? 120 : 60}px;height:${big ? 120 : 60}px;border-radius:30%;background:rgba(0,0,0,.12);transform:rotate(20deg)"></span><span style="position:absolute;inset:0;background:linear-gradient(transparent 55%,rgba(0,0,0,.45))"></span></div>`;
const COMMS = [
  { id: 'jjk', name: 'Jujutsu Kaisen India', k: '呪', bg: 'var(--violet-s)', members: 12400, owner: 'Akatsujuro', ofr: 'fr5', orank: 'Shōgun ★' },
  { id: 'nihongo', name: 'Japanese with Anime', k: '語', bg: 'var(--taku-s)', members: 9700, owner: 'Neha S.', ofr: 'fr4', orank: 'Sensei ★★' },
  { id: 'op', name: 'One Piece Crew Delhi', k: '海', bg: 'var(--puri-s)', members: 8100, owner: 'Rohan K.', ofr: 'fr3', orank: 'Otaku ★★★' },
  { id: 'cos', name: 'Cosplay Collective', k: '装', bg: 'var(--momo-s)', members: 5600, owner: 'Riya D.', ofr: 'fr4', orank: 'Sensei ★' },
  { id: 'gacha', name: 'Gacha & Gaming', k: '遊', bg: '#E3F7C9', members: 3200, owner: 'Dev M.', ofr: 'fr3', orank: 'Otaku ★' }
];
const POSTS = [
  { id: 'p1', c: 'jjk', by: 'Akatsujuro', fr: 'fr5', rank: 'Shōgun ★', badge: 'Quiz Ronin', time: '2 h', text: 'Domain expansion cosplay test for Ōta TOKYO. Is the purple too much?', media: { k: '領域展開', bg: '#2A1F6B' }, r: { taku: 212, momo: 148, puri: 96 }, cm: 24 },
  { id: 'p2', c: 'nihongo', by: 'Kavya Pillai', fr: 'fr2', rank: 'Senpai ★★', badge: 'Word Nerd', time: '5 h', text: 'TIL いただきます (itadakimasu) means "I humbly receive". Saying it before every chai now.', r: { taku: 88, momo: 41, puri: 12 }, cm: 9 },
  { id: 'p3', c: 'gacha', by: 'Dev M.', fr: 'fr3', rank: 'Otaku ★', badge: 'Lucky Pull', time: '1 d', text: 'Legendary Momo debut card on my 3rd Rare+ ticket. Pity counter who?', media: { k: 'LEGEND', bg: '#FFC23D', dark: true }, r: { taku: 35, momo: 301, puri: 77 }, cm: 31 }
];
let DCHIP = 'All';
function reactBar(pid, base, inReel) {
  const mine = S.reacts[pid];
  return ['taku', 'momo', 'puri'].map(w => {
    const n = (base[w] || 0) + (mine === w ? 1 : 0);
    const lbl = { taku: 'Cheer', momo: 'Sparkle', puri: 'GG' }[w];
    return `<button type="button" class="react ${mine === w ? 'on' : ''}" data-act="react" data-p="${pid}" data-r="${w}" aria-pressed="${mine === w}" aria-label="${lbl} · ${n}"><span class="face" style="background:var(--${w})">${M.html(w, 'idle', { acc: w === 'puri' ? 'hs' : '' })}</span>${inReel ? lbl : fmt(n)}</button>`;
  }).join('');
}
function postCard(p) {
  const c = COMMS.find(x => x.id === p.c);
  return `<article class="post"><div class="hd">${initials(p.by, p.fr, 40)}<div class="col" style="gap:1px;flex:1;min-width:0"><div class="row" style="gap:6px;flex-wrap:wrap"><b>${p.by}</b><span class="rank-chip">${p.rank}</span></div><span>${c.name} · ${p.time}</span></div></div>
    <p>${p.text}</p>
    ${p.media ? `<div class="media" style="background:${p.media.bg}"><span class="jp" style="font-size:${p.media.k.length > 4 ? 34 : 54}px;color:${p.media.dark ? 'var(--ink)' : '#fff'}">${p.media.k}</span></div>` : ''}
    <div class="reacts">${reactBar(p.id, p.r)}<button type="button" class="react" style="padding:0 12px;margin-left:auto" data-act="comments" data-p="${p.id}">${I.inbox} ${p.cm}</button></div></article>`;
}
SCREENS.discover = () => `${topbar('Discover')}
  <div class="chips">${['All', 'Anime', 'Cosplay', 'Japan', 'Learn'].map(c => `<button type="button" class="chip ${DCHIP === c ? 'on' : ''}" data-act="dchip" data-c="${c}">${c}</button>`).join('')}</div>
  <section class="word"><span class="over" style="color:var(--taku-d)">TAKU's word of the day</span><span class="k">推し</span><span class="r">oshi · your favourite</span><p>The character (or idol) you'd go to war for. "Momo-chan is my 推し."</p>
    <button type="button" class="btn sm ${S.wordDone ? 'b-white' : 'b-ink'}" style="justify-self:start;margin-top:6px" data-act="word">${S.wordDone ? 'Learned ✓' : 'Got it · +20 Ōra'}</button>${M.html('taku', S.wordDone ? 'happy' : 'think', { poke: true })}</section>
  <div class="sec"><h3>Reels</h3><button type="button" data-act="reel">Play all</button></div>
  <div class="hscroll">${REELS.filter(r => DCHIP === 'All' || r.cat === DCHIP).map(r => `<button type="button" class="reel-card" data-act="reel" data-i="${REELS.indexOf(r)}">${reelArt(r)}<span class="play">${I.play}</span><span class="earn">+${r.dur} Ōra</span><b>${r.t}</b><span>${r.by}</span></button>`).join('') || `<div class="state" style="width:100%"><p>No ${DCHIP} reels yet.</p></div>`}</div>
  <button type="button" class="council" data-act="council"><div class="col" style="gap:4px"><span class="over" style="color:var(--lime)">Fan Council</span><h4>Vote what Ōta builds next</h4><div class="row" style="gap:8px"><span class="sticks">${[0, 1, 2, 3, 4, 5].slice(0, S.cheersMax || RANKS[rankIdx(S.power)].cheers).map(k => `<i class="glow ${k < S.cheers ? '' : 'off'}"></i>`).join('')}</span><p>${S.cheers} Cheers left today</p></div></div>${M.html('taku', S.cheers ? 'idle' : 'sleepy')}</button>
  <div class="sec"><h3>Communities</h3><button type="button" data-act="comms">See all</button></div>
  <div class="hscroll">${COMMS.map(c => `<div class="comm"><button type="button" class="cov" style="background:${c.bg}" data-act="community" data-c="${c.id}"><span class="jp">${c.k}</span></button><b>${c.name}</b><span>${fmt(c.members + (S.joined[c.id] ? 1 : 0))} members</span><button type="button" class="j ${S.joined[c.id] ? 'on' : ''}" data-act="join" data-c="${c.id}">${S.joined[c.id] ? 'Joined' : 'Join'}</button></div>`).join('')}</div>
  <div class="sec"><h3>From your communities</h3></div>
  ${POSTS.map(postCard).join('')}`;
ACT.dchip = el => { DCHIP = el.dataset.c; refresh(); };
ACT.word = el => { if (S.wordDone) return; S.wordDone = true; M.react($('.word .m'), 'wotagei', 1400); earn(20, { from: el }); setTimeout(refresh, 1300); };
ACT.react = el => {
  const p = el.dataset.p, w = el.dataset.r;
  const was = S.reacts[p]; S.reacts[p] = was === w ? null : w; save();
  const wrap = el.closest('.reacts,.side');
  $$('.react[data-r]', wrap).forEach(b => {
    const on = S.reacts[p] === b.dataset.r; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
    const post = POSTS.find(x => x.id === p);
    if (post && !wrap.classList.contains('side')) b.lastChild.textContent = fmt((post.r[b.dataset.r] || 0) + (on ? 1 : 0));
  });
  if (S.reacts[p]) {
    const st = { taku: 'wotagei', momo: 'sparkle', puri: 'gg' }[w];
    const pop = document.createElement('div'); pop.className = 'react-pop';
    pop.innerHTML = M.html(w, st, { acc: w === 'puri' ? 'hs' : '' });
    el.style.position = 'relative'; el.appendChild(pop);
    setTimeout(() => pop.remove(), 1500);
  }
};
ACT.join = el => {
  const id = el.dataset.c; S.joined[id] = !S.joined[id]; save();
  if (S.joined[id]) toast('taku', 'Joined!', `${COMMS.find(c => c.id === id).name}: say hi in the feed.`);
  refresh();
};
ACT.comms = () => push('comms');
ACT.community = el => push('community', { id: el.dataset.c });
ACT.council = () => push('council');
ACT.comments = el => {
  const p = POSTS.find(x => x.id === el.dataset.p);
  const cms = [['Kavya Pillai', 'fr2', 'Senpai ★★', 'Not too much. Never too much.', '12 m'], ['Mm', 'fr1', 'Kōhai', 'Anyone going on day 2?', '40 m'], ['Neha S.', 'fr4', 'Sensei ★★', 'Bring this to the cosplay contest!', '1 h']];
  openSheet(`${sheetHead(`${p.cm} comments`)}${cms.map(([n, fr, rk, t, tm]) => `<div class="card" style="flex-direction:row;padding:12px">${initials(n, fr, 40)}<div class="col" style="gap:2px"><div class="row" style="gap:6px"><b>${n}</b><span class="rank-chip">${rk}</span><span class="mute" style="font-size:12px;font-weight:700">${tm}</span></div><p style="font-weight:600">${t}</p></div></div>`).join('')}
    <div class="card" style="flex-direction:row;align-items:center;padding:8px 8px 8px 14px"><input id="cmt" placeholder="Add a comment · +10 Ōra" style="flex:1;border:0;font:600 14px var(--f-body);outline:none;min-width:0;background:none"><button type="button" class="btn sm b-ink" data-act="sendComment">Post</button></div>`);
};
ACT.sendComment = el => {
  const v = $('#cmt').value.trim(); if (!v) return $('#cmt').focus();
  const card = document.createElement('div'); card.className = 'card'; card.style.cssText = 'flex-direction:row;padding:12px;animation:pop .4s var(--spring)';
  card.innerHTML = `${avatar(40)}<div class="col" style="gap:2px"><div class="row" style="gap:6px"><b>${S.name}</b><span class="rank-chip">${title()}</span><span class="mute" style="font-size:12px;font-weight:700">now</span></div><p style="font-weight:600"></p></div>`;
  $('p', card).textContent = v;
  el.closest('.card').before(card); $('#cmt').value = '';
  earn(10, { from: el });
};

/* reel player with the Puri token jar */
let RP = null;
function openReel(i = 0) {
  i = +i || 0; setBusy(true);
  RP = { i, t: 0, timer: null, ticks: 0 };
  drawReel();
}
function drawReel() {
  const r = REELS[RP.i];
  openFull(`<div class="reel" role="dialog" aria-label="Reel player"><div class="vid">${reelArt(r, true)}</div>
    <div class="prog">${REELS.map((x, k) => `<i><b style="width:${k < RP.i ? 100 : 0}%"></b></i>`).join('')}</div>
    <div class="rtop"><button type="button" class="back" style="background:rgba(255,255,255,.2);color:#fff" data-act="closeReel" aria-label="Close reels">${I.close}</button>${oraChip()}</div>
    <div class="jar"><div data-jar>${jarSvg(S.jar, 60, 52)}</div><span class="jl" data-jl>${S.jar} token${S.jar === 1 ? "" : "s"}</span></div>
    <button type="button" aria-label="Next reel" data-act="nextReel" style="position:absolute;inset:150px 90px 160px 0;z-index:2"></button>
    <div class="cap"><span class="pill" style="align-self:flex-start;background:rgba(255,255,255,.2);color:#fff">${r.cat}</span><b>${r.t}</b><span>${r.by} · tap to skip · each 5 s drops a Puri token</span></div>
    <div class="side">${reactBar(r.id, {}, true)}</div></div>`);
  clearInterval(RP.timer);
  RP.ds = 0; // tenths of a second watched on this reel
  const bar = () => $$('#full-layer .prog i b')[RP.i];
  RP.timer = setInterval(() => {
    if (!$('#full-layer .reel')) return clearInterval(RP.timer);
    RP.ds++;
    const b = bar(); if (b) b.style.width = Math.min(100, RP.ds / (r.dur * 10) * 100) + '%';
    if (RP.ds % 50 === 0) dropToken();
    if (RP.ds >= r.dur * 10) { S.quests.reels++; save(); nextReel(true); }
  }, 100);
}
function dropToken() {
  if (S.jar >= 60) return;
  S.jar++;
  const jar = $('#full-layer .jar'); if (!jar) return;
  const d = document.createElement('div'); d.className = 'drop'; d.innerHTML = M.token(24);
  const r = rectIn(jar); d.style.left = (r.x - 12) + 'px'; d.style.top = (r.y - 30) + 'px';
  $('#fx-layer').appendChild(d);
  setTimeout(() => { d.remove(); $('#full-layer [data-jar]') && ($('#full-layer [data-jar]').innerHTML = jarSvg(S.jar, 60, 52)); const l = $('#full-layer [data-jl]'); if (l) l.textContent = `${S.jar} token${S.jar === 1 ? "" : "s"}`; earn(5, { from: jar, mult: false }); }, 800);
}
function nextReel(finished) {
  if (RP.i >= REELS.length - 1) { ACT.closeReel(); return; }
  if (finished) toast('taku', 'Reel finished!', `Quest: ${Math.min(2, S.quests.reels)}/2 reels watched`, 1800);
  RP.i++; drawReel();
}
ACT.nextReel = () => nextReel(false);
ACT.closeReel = () => { clearInterval(RP && RP.timer); closeFull(); setBusy(false); refresh(); };

/* communities */
SCREENS.comms = () => `<div class="top"><button type="button" class="back" data-act="back" aria-label="Back">${I.back}</button><div class="who"><b>Communities</b><span>${Object.values(S.joined).filter(Boolean).length} joined</span></div></div>
  <div class="card" style="flex-direction:row;align-items:center;padding:10px 14px">${I.search}<input placeholder="Search fandoms, cities, games" style="flex:1;border:0;font:600 14px var(--f-body);outline:none;background:none;min-width:0" aria-label="Search communities"></div>
  ${COMMS.map(c => `<div class="qrow"><button type="button" class="cov jp" style="background:${c.bg}" data-act="community" data-c="${c.id}">${c.k}</button><button type="button" class="t" data-act="community" data-c="${c.id}" style="text-align:left"><b>${c.name}</b><span>${fmt(c.members)} members · owner ${c.owner}</span></button><button type="button" class="btn sm ${S.joined[c.id] ? 'b-white' : 'b-ink'}" data-act="join" data-c="${c.id}">${S.joined[c.id] ? 'Joined' : 'Join'}</button></div>`).join('')}
  <div class="state" style="background:var(--taku-s)">${M.html('taku', 'think', { size: 120 })}<h3>Can't find your fandom?</h3><p>Start a community at Otaku rank. TAKU checks it for duplicates first.</p><button type="button" class="btn b-dis" aria-disabled="true">${I.lock} Unlocks at Otaku</button></div>`;
SCREENS.community = ({ id }) => {
  const c = COMMS.find(x => x.id === id), joined = S.joined[id];
  const tops = [['Akatsujuro', 'fr5', 2140], ['Neha S.', 'fr4', 1810], [S.name, RANKS[rankIdx(S.power)].fr, S.weekOra], ['Rohan K.', 'fr3', 1220]].sort((a, b) => b[2] - a[2]);
  const posts = POSTS.filter(p => p.c === id);
  return `<div class="top"><button type="button" class="back" data-act="back" aria-label="Back">${I.back}</button><div class="who"><b>${c.name}</b><span>${fmt(c.members + (joined ? 1 : 0))} members</span></div></div>
  <section class="host" style="background:${c.bg};min-height:150px"><div class="col" style="gap:6px"><span class="jp" style="font-size:54px;line-height:1">${c.k}</span><span class="pill" style="background:#fff;align-self:flex-start">${I.pin} Delhi · English + हिन्दी</span></div>${M.html('taku', joined ? 'wotagei' : 'wave', { poke: true })}</section>
  <button type="button" class="btn ${joined ? 'b-white' : 'b-ink'} full" data-act="join" data-c="${id}">${joined ? 'Joined · leave' : 'Join community'}</button>
  <div class="card" style="flex-direction:row;align-items:center">${initials(c.owner, c.ofr, 48)}<div class="col" style="gap:2px;flex:1"><span class="over">Owner</span><b>${c.owner}</b><span class="rank-chip" style="align-self:flex-start">${c.orank}</span></div><button type="button" class="btn sm b-white" data-act="report">Report</button></div>
  <div class="sec"><h3>Top members this week</h3></div>
  <div class="lb">${tops.map((t, k) => `<div class="lbr ${t[0] === S.name ? 'me' : ''}"><span class="n">${k + 1}</span>${t[0] === S.name ? avatar(36) : initials(t[0], t[1], 36)}<span class="nm"><b>${t[0]}</b><span>${t[0] === S.name ? title() : ''}</span></span><span class="sc num">${fmt(t[2])}<small>Ōra</small></span></div>`).join('')}</div>
  <div class="sec"><h3>Feed</h3></div>
  ${posts.length ? posts.map(postCard).join('') : `<div class="state" style="background:var(--taku-s)">${M.html('taku', 'sleepy', { size: 130, poke: true })}<h3>It's quiet in here</h3><p>No posts this week. Be the first and earn +10 Ōra.</p><button type="button" class="btn b-ink" data-act="newPost">Write the first post</button></div>`}`;
};
ACT.report = () => toast('taku', 'Thanks for flagging', 'The Ōta team will review it within 24 h.');
ACT.newPost = el => { earn(10, { from: el }); toast('taku', 'Posted!', 'Your post is live in the community.'); };

/* Fan Council */
const POLL = { q: 'Who should headline Day 2 at Ōta TOKYO Delhi?', opts: [{ id: 'a', n: 'DARUMA Rollin\'', v: 1240 }, { id: 'b', n: 'Sakura Static', v: 860 }, { id: 'c', n: 'Bombay Kitsune', v: 610 }] };
const IDEAS = [
  { id: 'repair', t: 'Cosplay repair booth at the venue', by: 'Kavya Pillai', fr: 'fr2', type: 'Events', k: '針', bg: 'var(--momo-s)' },
  { id: 'plush', t: 'Momo-chan plush keychain', by: 'Dev M.', fr: 'fr3', type: 'Merch', k: '桃', bg: 'var(--puri-s)' },
  { id: 'arcade', t: 'Retro arcade zone with a Puri high-score board', by: 'Akatsujuro', fr: 'fr5', type: 'Events', k: '遊', bg: 'var(--taku-s)' }
];
const STAGES = [['Spark', 100], ['Hype', 500], ['Review', 0], ['Confirmed', 0], ['Live', 0]];
const stageOf = n => n < 100 ? 0 : n < 500 ? 1 : 2;
let PSEL = null;
function ideaCard(d) {
  const n = S.ideas[d.id], s = stageOf(n), goal = STAGES[s][1], lo = s === 0 ? 0 : 100;
  return `<article class="idea" data-idea="${d.id}"><div class="top2"><span class="thumb jp" style="background:${d.bg};font-size:34px">${d.k}</span><div class="t"><span class="over" style="color:var(--taku-d)">${d.type} · ${STAGES[s][0]}</span><b>${d.t}</b><span class="row" style="gap:6px">${initials(d.by, d.fr, 22)} ${d.by}</span></div></div>
    <div class="stages">${STAGES.map(([nm], k) => `<span class="${k < s ? 'done' : ''} ${k === s ? 'on' : ''}"><i><b style="width:${k < s ? 100 : k === s && goal ? (n - lo) / (goal - lo) * 100 : 0}%"></b></i>${nm}</span>`).join('')}</div>
    <div class="foot"><span class="c num">${fmt(n)} / ${fmt(goal)} Cheers to ${STAGES[s + 1][0]}</span><button type="button" class="cheer-btn ${S.cheers ? '' : 'off'}" data-act="cheerIdea" data-id="${d.id}"><span class="glow" style="width:7px;height:16px"></span>Cheer</button></div></article>`;
}
SCREENS.council = () => {
  const voted = S.poll, total = POLL.opts.reduce((a, o) => a + o.v, 0) + (voted ? 1 : 0);
  const max = RANKS[rankIdx(S.power)].cheers;
  return `<div class="top"><button type="button" class="back" data-act="back" aria-label="Back">${I.back}</button><div class="who"><b>Fan Council</b><span>Your Cheers decide what Ōta builds</span></div>${oraChip()}</div>
  <section class="cheerbar"><div class="col" style="gap:6px"><span class="sticks">${Array.from({ length: max }, (_, k) => `<i class="glow ${k < S.cheers ? '' : 'off'}"></i>`).join('')}</span><b>${S.cheers} of ${max} Cheers left</b><p>${S.cheers ? 'Each Cheer gives +10 Ōra. They reset at midnight.' : 'Out of Cheers. 3 more at midnight.'}</p></div>${M.html('taku', S.cheers ? 'idle' : 'sleepy', { poke: true })}</section>
  <section class="poll"><div class="between"><span class="over" style="color:var(--taku-d)">Live poll · ends in 2 days</span><span class="pill">${fmt(total)} votes</span></div><h3 style="font-size:19px">${POLL.q}</h3>
    ${POLL.opts.map((o, k) => { const v = o.v + (voted === o.id ? 1 : 0); return `<button type="button" class="opt ${voted === o.id ? 'mine' : ''} ${!voted && PSEL === o.id ? 'sel' : ''}" data-act="pollPick" data-o="${o.id}" ${voted ? 'aria-disabled="true"' : ''}><span class="fill" data-w="${voted ? v / total * 100 : 0}"></span><i>${'ABC'[k]}</i><span>${o.n}</span>${voted ? `<em class="num">${Math.round(v / total * 100)}%</em>` : ''}</button>`; }).join('')}
    ${voted ? `<p class="mute" style="font-weight:700;font-size:13px">You cheered ${POLL.opts.find(o => o.id === voted).n}. Momo announces the winner on 10 Nov.</p>` : `<button type="button" class="btn ${PSEL && S.cheers ? 'b-ink' : 'b-dis'} full" data-act="pollVote">${PSEL ? 'Cheer to vote · results unlock' : 'Pick an artist to see results'}</button>`}</section>
  <div class="sec"><h3>Ideas</h3><span class="mute" style="font-weight:700;font-size:13px">Closest to goal</span></div>
  ${IDEAS.slice().sort((a, b) => (S.ideas[b.id] % 100) - (S.ideas[a.id] % 100)).map(ideaCard).join('')}
  <div class="state" style="background:var(--taku-s)">${M.html('taku', 'think', { size: 110 })}<h3>Have an idea?</h3><p>Pitch merch, events or guests at Otaku rank. You're ${fmt(Math.max(0, 10000 - S.power))} Ōra away.</p><button type="button" class="btn b-dis" aria-disabled="true">${I.lock} Unlocks at Otaku</button></div>`;
};
AFTER.council = () => requestAnimationFrame(() => $$('.opt .fill').forEach(f => f.style.width = f.dataset.w + '%'));
ACT.pollPick = el => { if (S.poll) return; PSEL = el.dataset.o; refresh(); };
ACT.pollVote = async el => {
  if (!PSEL || !S.cheers) return;
  S.poll = PSEL; S.cheers--; save();
  M.set($('.cheerbar .m'), 'wotagei', true);
  earn(10, { from: el });
  await wait(1200); refresh();
};
ACT.cheerIdea = async el => {
  const id = el.dataset.id;
  const taku = $('.cheerbar .m');
  if (!S.cheers) { M.set(taku, 'sleepy'); toast('taku', 'Out of Cheers', '3 more at midnight. Zzz…'); return; }
  const before = S.ideas[id];
  S.ideas[id]++; S.cheers--; S.myCheers[id] = (S.myCheers[id] || 0) + 1; save();
  M.react(taku, 'wotagei', 1500);
  earn(10, { from: el });
  const card = el.closest('.idea');
  card.outerHTML = ideaCard(IDEAS.find(d => d.id === id));
  const fresh = $(`.idea[data-idea="${id}"]`);
  if (stageOf(before) < stageOf(S.ideas[id])) {
    fresh.insertAdjacentHTML('beforeend', `<div class="stageup">Stage up! It moved to ${STAGES[stageOf(S.ideas[id])][0]}. ${IDEAS.find(d => d.id === id).by} gets +200 Ōra and it's featured in Discover.</div>`);
    confetti(30);
  }
  const bar = $('.cheerbar'); bar.querySelectorAll('.glow').forEach((g, k) => g.classList.toggle('off', k >= S.cheers));
  $('.cheerbar b').textContent = `${S.cheers} of ${RANKS[rankIdx(S.power)].cheers} Cheers left`;
  if (!S.cheers) setTimeout(() => { M.set(taku, 'sleepy'); $('.cheerbar p').textContent = 'Out of Cheers. 3 more at midnight.'; }, 1600);
};

/* ======================= ME ======================= */
const BADGES = [
  { n: 'First Pull', d: 'Open a capsule', k: '1', c: 'var(--momo-s)', ok: () => S.cabinet.length > 0 },
  { n: 'Quiz Ronin', d: '10 perfect quizzes', k: '侍', c: 'var(--puri-s)', ok: () => false },
  { n: 'Word Nerd', d: 'Learn 7 words', k: '語', c: 'var(--taku-s)', ok: () => S.wordDone },
  { n: 'Backer', d: 'Cheer an idea to a stage', k: '応', c: 'var(--violet-s)', ok: () => Object.keys(S.myCheers).length > 0 },
  { n: 'Week Warrior', d: '7-day streak', k: '7', c: 'var(--momo-s)', ok: () => S.streak >= 7 },
  { n: 'Ōta TOKYO 2026', d: 'Check in at the gate', k: '祭', c: 'var(--leg-s)', ok: () => false }
];
SCREENS.me = () => {
  const st = starsOf(S.power);
  return `<div class="top"><div class="who"><b>Me</b><span>Profile and progress</span></div>${oraChip()}</div>
  <section class="profile">${burst('rgba(255,255,255,.12)')}${avatar(96)}<h2>${S.name}</h2><span class="title">${title()} · partner ${M.NAMES[S.partner]}</span>
    <div class="stats"><div><b class="num">${fmt(S.power)}</b><span>Power</span></div><div><b class="num">${S.streak}</b><span>day streak</span></div><div><b class="num">#${arenaPos()}</b><span>in league</span></div></div></section>
  <button type="button" class="card" data-act="journey" style="text-align:left"><div class="between"><h3 style="font-size:19px">Rank journey</h3>${I.chev}</div>
    <div class="row" style="gap:6px">${RANKS.map((r, k) => `<span title="${r.name}" style="flex:1;height:10px;border-radius:5px;background:${k < st.i ? 'var(--violet)' : k === st.i ? 'var(--lime)' : 'var(--line)'}"></span>`).join('')}</div>
    <span class="mute" style="font-weight:700;font-size:13px">${st.next ? `Next: ${st.next.name} at ${fmt(st.next.min)} · ${M.BOSSES[st.next.boss].name} guards the gate` : 'Kami reached'}</span></button>
  <div class="sec"><h3>Badges</h3><span class="mute" style="font-weight:700;font-size:13px">${BADGES.filter(b => b.ok()).length}/${BADGES.length}</span></div>
  <div class="badges">${BADGES.map(b => `<div class="badge ${b.ok() ? '' : 'lock'}"><span class="bi jp" style="background:${b.c}">${b.ok() ? b.k : I.lock}</span><b>${b.n}</b><span>${b.d}</span></div>`).join('')}</div>
  <div class="menu">
    <button type="button" data-act="partner"><span>Partner mascot</span><small>${M.NAMES[S.partner]}</small>${I.chev}</button>
    <button type="button" data-act="mytix"><span>My tickets</span><small>${S.tix.length}</small>${I.chev}</button>
    <button type="button" data-act="cabinet"><span>Capsule cabinet</span><small>${S.cabinet.length} items</small>${I.chev}</button>
    <button type="button" data-act="sheetLab"><span>Mascot sheet · all states</span>${I.chev}</button>
  </div>
  <div class="sec"><h3>Demo controls</h3></div>
  <div class="menu">
    <button type="button" data-act="newDay"><span>Skip to tomorrow</span><small>resets quests, Cheers, jar</small>${I.chev}</button>
    <button type="button" data-act="demoLoading"><span>Show loading state</span>${I.chev}</button>
    <button type="button" data-act="demoError"><span>Show error state</span><small>Puri rage-quits</small>${I.chev}</button>
    <button type="button" data-act="demoRank"><span>Replay a boss fight</span>${I.chev}</button>
    <button type="button" data-act="replayOb"><span>Replay onboarding</span>${I.chev}</button>
    <button type="button" data-act="resetDemo"><span>Reset demo account</span>${I.chev}</button>
  </div>`;
};
ACT.partner = () => openSheet(`${sheetHead('Partner mascot')}<p class="mute" style="font-weight:600">Your partner greets you on Home, narrates tips and lands the final hit in boss fights. It doesn't change how much Ōra you earn.</p>
  <div class="picker">${['taku', 'momo', 'puri'].map(w => `<button type="button" data-act="setPartner" data-w="${w}" class="${S.partner === w ? 'on' : ''}"><span class="face" style="background:${BUDDY[w].bg}">${M.html(w, S.partner === w ? 'happy' : 'idle', { acc: w === 'puri' ? 'hs' : '' })}</span><b>${M.NAMES[w]}</b><span>${BUDDY[w].tag.replace('The ', '')}</span></button>`).join('')}</div>`);
ACT.setPartner = el => { S.partner = el.dataset.w; save(); ACT.partner(); refresh(); };
ACT.sheetLab = () => {
  openSheet(`${sheetHead('Mascot sheet')}<p class="mute" style="font-weight:600">Every pose is the same vector rig. Tap a tile to replay it.</p>
  ${['taku', 'momo', 'puri'].map(w => `<div class="sec"><h3>${M.NAMES[w]}</h3></div><div class="sheetgrid">${M.STATES[w].map(s => `<button type="button" data-act="labReplay" style="background:var(--${w}-s)">${M.html(w, s, { acc: w === 'puri' && s !== 'rage' ? 'hs' : '' })}${s}</button>`).join('')}</div>`).join('')}`);
};
ACT.labReplay = el => { const m = $('.m', el); M.set(m, m.dataset.base); };
ACT.newDay = () => {
  let msg = 'New quests are up.';
  if (!S.doneToday) {
    if (S.shields > 0 && S.streak > 0) { S.shields--; msg = 'Momo used an Encore shield. Streak saved!'; }
    else if (S.streak > 0) { msg = `Streak lost at ${S.streak} days. Start again today!`; S.streak = 0; }
  }
  Object.assign(S, { doneToday: false, mileFresh: false, quests: { checkin: false, challenge: false, reels: 0 }, boardClaimed: false, jar: 0, wordDone: false, cheers: RANKS[rankIdx(S.power)].cheers, todayOra: 0, streakPreview: null });
  save(); toast('momo', 'Good morning!', msg); goTab('home');
};
ACT.demoLoading = () => loading('Finding rivals', 'The trio is running to the arena', 2200);
ACT.demoError = () => openSheet(`${sheetHead('Error state')}${errorState('closeSheet')}`);
ACT.demoRank = () => { const i = Math.max(1, rankIdx(S.power)); rankUp(i); };
ACT.replayOb = () => { S = FRESH(); save(); OB.step = 'splash'; OB.a = []; OB.b = OB.c = null; renderTabbar(); obRender(); };
ACT.resetDemo = () => { S = DEMO(); save(); toast('puri', 'Demo reset', 'Ria · Kōhai ★★★ · 2,860 Power'); goTab('home'); };

/* journey map: ranks as a path, stars as nodes, bosses at every gate */
SCREENS.journey = () => {
  const p = S.power;
  let h = `<div class="top"><button type="button" class="back" data-act="back" aria-label="Back">${I.back}</button><div class="who"><b>Rank journey</b><span>${title()} · ${fmt(p)} Power</span></div>${oraChip()}</div>
  <div class="journey">`;
  const xoff = k => Math.round(Math.sin(k * 1.25) * 70);
  let n = 0;
  RANKS.forEach((r, i) => {
    const nx = RANKS[i + 1];
    if (i > 0) {
      const beaten = p >= r.min, b = M.BOSSES[r.boss];
      h += `<div class="jseg"><div class="jboss ${beaten ? 'beaten' : ''}" style="background:${beaten ? '#EDE9F5' : 'var(--night)'}">${M.boss(r.boss)}${beaten ? '<span class="x">✕</span>' : ''}<span class="bt">${beaten ? `${b.name} · beaten` : `${b.name} · ${fmt(r.min)}`}</span></div>
        ${beaten ? `<button type="button" class="btn sm b-white" data-act="replayBoss" data-i="${i}">Replay fight</button>` : ''}</div>`;
    }
    const isNow = rankIdx(p) === i;
    h += `<div class="jhead" style="background:${isNow ? 'var(--lime)' : p >= r.min ? '#fff' : '#EAE6F3'}">${avatar(46, S.partner, r.min)}<div class="col" style="gap:1px;flex:1"><b>${r.name}</b><span>${r.en} · from ${fmt(r.min)} Power</span></div>${p >= r.min ? `<span class="pill" style="background:var(--violet);color:#fff">${isNow ? 'You' : 'Done'}</span>` : `<span class="pill">${I.lock}</span>`}</div>`;
    if (nx) {
      const step = (nx.min - r.min) / 3;
      h += `<div class="jseg">`;
      for (let s = 1; s <= 3; s++) {
        const at = r.min + step * (s - 1), next = s < 3 ? r.min + step * s : nx.min;
        const state = p >= next ? 'done' : p >= at ? 'now' : 'lock';
        h += `<div class="jnode ${state}" style="transform:translateX(${xoff(n++)}px)">${state === 'now' ? `<span class="tag">You · ${fmt(next - p)} to go</span>` : ''}${'★'.repeat(s)}</div>`;
      }
      if (isNow) h += `<div class="perks"><b style="font:400 15px var(--f-disp)">${nx.name} unlocks</b><ul>${nx.perks.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
      h += `</div>`;
    }
  });
  return h + `</div>`;
};
AFTER.journey = () => { const t = $('.jnode.now'); t && t.scrollIntoView({ block: 'center' }); };
ACT.journey = () => { if (NAV.tab !== 'me' && NAV.tab !== 'home') NAV.tab = 'home'; push('journey'); };
ACT.replayBoss = el => rankUp(+el.dataset.i);
