// Web-only bridge for the showcase site: the page hosting the app in an iframe sends
// { type: 'ota-demo', action } messages, and the app seeds a demo account and opens a flow.
// The app reports its theme back so the page can match it. Native builds never install this.
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { useGame } from '@/store/game';
import { useFx } from '@/store/fx';
import { RANKS, rankIdx } from '@/content/ranks';
import { addDays, dayKey, uid, weekKey } from './time';

const freshDay = () => ({ key: dayKey(), checkin: false, challenge: false, challengeScore: 0, reels: [], jar: 0, word: false, cheersUsed: 0, comments: 0, quizzes: [], boardClaimed: false, ora: 0, milestone: false });

/** a well-stocked account: 240 Ōra short of Otaku, a 6-day streak, tickets in every tier, a coupon */
export function seedDemo() {
  const g = useGame.getState();
  g.reset();
  useGame.setState(s => ({
    onboarded: true, toured: true, name: 'Guest', partner: 'momo',
    power: 9760, wallet: 6400,
    tickets: { std: 6, rare: 3, legend: 2 }, pity: { std: 8, rare: 17, legend: 3 },
    streak: { count: 6, last: addDays(dayKey(), -1), shields: 1, best: 6, saved: 0 },
    day: freshDay(), week: { key: weekKey(), ora: 2140, freePull: false },
    beaten: ['kappa', 'tanuki'],
    cabinet: [
      { uid: uid(), id: 'cp-15', at: Date.now(), expires: Date.now() + 14 * 864e5 },
      { uid: uid(), id: 'st-gg', at: Date.now() - 864e5 },
      { uid: uid(), id: 'av-crown', at: Date.now() - 2 * 864e5 },
    ],
    joined: { jjk: true, nihongo: true, cos: true, gacha: true },
    settings: { ...s.settings },
  }));
}

function clearOverlays() {
  const fx = useFx.getState();
  fx.setCutscene(null);
  useFx.setState({ queue: [], toasts: [] });
}

function go(path: string) {
  try { if (router.canDismiss()) router.dismissAll(); } catch {}
  router.navigate('/');
  if (path !== '/') setTimeout(() => router.push(path as any), 80);
}

const ensure = () => { if (!useGame.getState().onboarded) seedDemo(); };

const ACTIONS: Record<string, () => void> = {
  onboarding: () => { useGame.getState().reset(); try { if (router.canDismiss()) router.dismissAll(); } catch {} router.replace('/onboarding'); },
  home: () => { ensure(); go('/'); },
  quests: () => { ensure(); useGame.setState({ day: freshDay() }); go('/'); },
  daily: () => { ensure(); useGame.setState(s => ({ day: { ...s.day, challenge: false } })); go('/quiz?mode=daily'); },
  reels: () => { ensure(); go('/reel'); },
  voting: () => { ensure(); useGame.setState(s => ({ poll: null, day: { ...s.day, cheersUsed: 0 } })); go('/council'); },
  community: () => { ensure(); go('/community/jjk'); },
  rewards: () => { ensure(); useGame.setState(s => ({ tickets: { std: Math.max(s.tickets.std, 6), rare: Math.max(s.tickets.rare, 3), legend: Math.max(s.tickets.legend, 2) }, wallet: Math.max(s.wallet, 3000) })); go('/gacha'); },
  events: () => { ensure(); go('/event/delhi'); },
  store: () => { ensure(); go('/shop'); },
  journey: () => { ensure(); go('/journey'); },
  league: () => { ensure(); go('/arena'); },
  streak: () => { ensure(); go('/streak'); },
  cast: () => { ensure(); go('/cast'); },
  inbox: () => { ensure(); go('/inbox'); },
  boss: () => {
    ensure(); go('/');
    const g = useGame.getState(), i = rankIdx(g.power), next = RANKS[i + 1];
    // cross the next rank for real, so the fight ends with its actual rewards
    setTimeout(() => { if (next) g.earn(next.min - g.power, { mult: false }); else useFx.getState().setCutscene(i); }, 500);
  },
  theme: () => { const g = useGame.getState(); g.setTheme(g.settings.theme === 'pastel' ? 'night' : 'pastel'); },
  reset: () => { seedDemo(); go('/'); setTimeout(() => useFx.getState().toast('momo', 'Demo account ready', '6,400 Ōra, tickets in every tier and a coupon.', 'sparkle'), 400); },
};

let installed = false;
export function installDemoBridge() {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || installed || window.parent === window) return;
  installed = true;
  const report = () => {
    const g = useGame.getState();
    window.parent.postMessage({ type: 'ota-state', theme: g.settings.theme, onboarded: g.onboarded, power: g.power, wallet: g.wallet }, '*');
  };
  window.addEventListener('message', e => {
    if (e.source !== window.parent || !e.data || e.data.type !== 'ota-demo') return;
    const run = ACTIONS[e.data.action];
    if (!run) return;
    clearOverlays();
    run();
    setTimeout(report, 300);
  });
  useGame.subscribe((s, prev) => { if (s.settings.theme !== prev.settings.theme || s.onboarded !== prev.onboarded) report(); });
  report();
}
