/* Ōta Life · boot: event wiring, desktop rail + mascot lab, start-up */
ACT.tab = el => goTab(el.dataset.t);
ACT.back = () => back();
ACT.closeSheet = () => closeSheet();
ACT.reel = el => openReel(el.dataset.i || 0);
ACT.retryError = () => closeSheet();

document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (a && $('#screen').contains(a) && ACT[a.dataset.act]) {
    if (a.getAttribute('aria-disabled') === 'true' && a.dataset.act !== 'buy') return;
    e.preventDefault(); ACT[a.dataset.act](a, e); return;
  }
  const m = e.target.closest('.m.poke');
  if (m && $('#screen').contains(m)) poke(m);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('#sheet-layer').classList.contains('open')) closeSheet();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-act]')) { e.preventDefault(); e.target.click(); }
  if ($('#full-layer .reel') && (e.key === 'ArrowDown' || e.key === 'ArrowRight')) ACT.nextReel();
});

/* tab bar hides where a checkout dock owns the bottom edge */
const _paint = paint;
paint = function (anim, keep) {
  _paint(anim, keep);
  const dockScreen = ['product', 'ticket'].includes(cur().name);
  $('#tabbar').classList.toggle('hide', dockScreen || !S.onboarded);
  const dock = $('#view .scr .dock'); if (dock) $('#view').appendChild(dock);
};

/* clear every overlay before a jump from the rail */
function clearAll() {
  if (QZ) { clearInterval(QZ.timer); QZ = null; }
  if (RP) clearInterval(RP.timer);
  closeFull(); $('#sheet-layer').classList.remove('open'); sheetClose = null;
  $$('#fx-layer > *').forEach(n => n.remove());
  EVQ.length = 0; busy = false; G.phase = 'idle';
  if (!S.onboarded) { S = DEMO(); save(); }
}
const JUMP = {
  onboarding: () => ACT.replayOb(),
  home: () => goTab('home'),
  quiz: () => { goTab('battle'); startQuiz('daily'); },
  gacha: () => { goTab('stage'); if (!S.tickets.std) S.tickets.std = 2; openGacha(); },
  reel: () => { goTab('discover'); openReel(0); },
  council: () => { goTab('discover'); push('council'); },
  community: () => { goTab('discover'); push('community', { id: 'jjk' }); },
  ticket: () => { goTab('stage'); push('ticket'); },
  shop: () => { goTab('stage'); push('shop'); },
  journey: () => { goTab('me'); push('journey'); },
  arena: () => { goTab('battle'); push('arena'); },
  rankup: () => { goTab('home'); rankUp(Math.min(6, Math.max(1, rankIdx(S.power) + 1))); },
  error: () => { goTab('battle'); push('lagspike'); },
  loading: () => { goTab('home'); ACT.demoLoading(); },
  reset: () => ACT.resetDemo()
};
$('#jumps').addEventListener('click', e => {
  const b = e.target.closest('[data-jump]'); if (!b) return;
  const k = b.dataset.jump; clearAll();
  if (k !== 'onboarding') renderTabbar();
  JUMP[k]();
});

/* mascot lab (desktop): live rig + every state */
let LAB = 'taku';
function drawLab(state) {
  $('#labwho').innerHTML = ['taku', 'momo', 'puri'].map(w => `<button type="button" class="${LAB === w ? 'on' : ''}" data-w="${w}">${M.NAMES[w]}</button>`).join('');
  $('#labstates').innerHTML = M.STATES[LAB].map(s => `<button type="button" data-s="${s}" class="${s === state ? 'on' : ''}">${s}</button>`).join('');
  const bg = { taku: 'var(--taku-s)', momo: 'var(--momo-s)', puri: 'var(--puri-s)' }[LAB];
  $('#labstage').style.background = bg;
  $('#labstage').innerHTML = `${burst('rgba(255,255,255,.8)')}${M.html(LAB, state, { size: 180, acc: LAB === 'puri' && state !== 'rage' ? 'hs' : '' })}`;
}
$('#labwho').addEventListener('click', e => { const b = e.target.closest('[data-w]'); if (b) { LAB = b.dataset.w; drawLab('idle'); } });
$('#labstates').addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) drawLab(b.dataset.s); });
drawLab('wave');

/* start: returning viewers land on Home, first-timers see the splash */
S = load() || FRESH();
if (S.onboarded) { NAV.tab = 'home'; paint(); }
else { renderTabbar(); $('#view').innerHTML = ''; OB.step = 'splash'; obRender(); }
