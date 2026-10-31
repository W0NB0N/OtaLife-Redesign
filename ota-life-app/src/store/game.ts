// The game: one persisted store holding the player's progress. All rules for earning,
// spending, streaks, daily resets and capsule pulls live here so screens stay thin.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyTheme, type Rarity, type ThemeName, type Who } from '@/theme';
import { RANKS, rankIdx, stars, titleOf } from '@/content/ranks';
import { PRIZES, TIERS, TierId, DUPE_ORA, RARITY_ORDER, IDEAS, POLL, Post } from '@/content/catalog';
import { addDays, dayKey, daysBetween, parseDay as parseDayLocal, uid, weekKey } from '@/lib/time';
import { useFx } from './fx';
import { leagueRows } from './league';

export type Day = {
  key: string; checkin: boolean; challenge: boolean; challengeScore: number; reels: string[]; jar: number;
  word: boolean; cheersUsed: number; comments: number; quizzes: string[]; boardClaimed: boolean; ora: number; milestone: boolean;
};
export type Order = { id: string; kind: 'merch' | 'ticket'; item: string; name: string; detail: string; price: number; coupon: number; ora: number; total: number; at: number; code: string; legend?: boolean; eventId?: string; day?: string };
export type CabinetItem = { uid: string; id: string; at: number; used?: boolean; expires?: number };

const freshDay = (key: string): Day => ({ key, checkin: false, challenge: false, challengeScore: 0, reels: [], jar: 0, word: false, cheersUsed: 0, comments: 0, quizzes: [], boardClaimed: false, ora: 0, milestone: false });

export type Game = {
  onboarded: boolean; toured: boolean; name: string; partner: Who; created: number;
  power: number; wallet: number;
  tickets: Record<TierId, number>; pity: Record<TierId, number>; pulls: number;
  streak: { count: number; last: string | null; shields: number; best: number; saved: number };
  day: Day; week: { key: string; ora: number; freePull: boolean };
  beaten: string[]; cabinet: CabinetItem[]; equipped: string | null;
  reacts: Record<string, Who | null>; joined: Record<string, boolean>;
  posts: Post[]; comments: Record<string, { id: string; text: string; at: number }[]>;
  ideaCheers: Record<string, number>; poll: string | null; myIdeas: { id: string; title: string; type: string; at: number }[];
  orders: Order[]; size: string | null; address: { name: string; phone: string; line: string; city: string; pin: string } | null; quizzesWon: number; perfects: number; wordsLearned: number;
  settings: { haptics: boolean; motion: boolean; theme: ThemeName };
  answers: { anime: string[]; platform: string | null; goal: string | null };

  rollover: () => void;
  finishOnboarding: (o: { name: string; partner: Who; anime: string[]; platform: string | null; goal: string | null }) => void;
  earn: (n: number, opt?: { mult?: boolean; x?: number; y?: number }) => number;
  spend: (n: number) => boolean;
  checkin: () => boolean;
  completeQuiz: (r: { mode: 'daily' | 'library' | 'warmup'; cat?: string; right: number; total: number }) => { bonus: number; ticket: boolean; streakUp: boolean; milestone: boolean };
  canEarnQuiz: (mode: string, cat?: string) => boolean;
  reelToken: () => boolean;
  reelDone: (id: string) => void;
  learnWord: () => void;
  react: (post: string, who: Who) => void;
  toggleJoin: (c: string) => void;
  addPost: (c: string, text: string) => void;
  addComment: (post: string, text: string) => boolean;
  cheerIdea: (id: string) => { ok: boolean; stagedUp: boolean };
  votePoll: (opt: string) => boolean;
  submitIdea: (title: string, type: string) => void;
  claimBoard: () => boolean;
  buyShield: () => boolean;
  pull: (tier: TierId) => { prize: typeof PRIZES[number]; dupe: boolean } | null;
  pullCost: (tier: TierId) => 'ticket' | 'free' | 'ora' | null;
  equip: (part: string | null) => void;
  placeOrder: (o: Omit<Order, 'id' | 'at' | 'code'>, couponUid?: string) => Order;
  setPartner: (w: Who) => void; setName: (n: string) => void; setSize: (s: string) => void;
  setSetting: (k: 'haptics' | 'motion', v: boolean) => void;
  setTheme: (t: ThemeName) => void;
  setToured: () => void;
  reset: () => void;
};

const MILESTONES = [3, 7, 14, 30, 50, 100];
export const streakMult = (n: number) => (n >= 100 ? 1.5 : n >= 30 ? 1.3 : n >= 7 ? 1.2 : n >= 3 ? 1.1 : 1);
export const cheersMax = (p: number) => RANKS[rankIdx(p)].cheers;

const initial = () => ({
  onboarded: false, toured: false, name: '', partner: 'momo' as Who, created: Date.now(),
  power: 0, wallet: 0,
  tickets: { std: 0, rare: 0, legend: 0 }, pity: { std: 0, rare: 0, legend: 0 }, pulls: 0,
  streak: { count: 0, last: null as string | null, shields: 0, best: 0, saved: 0 },
  day: freshDay(dayKey()), week: { key: weekKey(), ora: 0, freePull: false },
  beaten: [] as string[], cabinet: [] as CabinetItem[], equipped: null as string | null,
  reacts: {}, joined: {}, posts: [] as Post[], comments: {},
  ideaCheers: {}, poll: null as string | null, myIdeas: [],
  orders: [] as Order[], size: null as string | null, address: null as Game['address'], quizzesWon: 0, perfects: 0, wordsLearned: 0,
  settings: { haptics: true, motion: true, theme: 'pastel' as ThemeName },
  answers: { anime: [] as string[], platform: null as string | null, goal: null as string | null },
});

export const useGame = create<Game>()(persist((set, get) => ({
  ...initial(),

  rollover: () => {
    const s = get(), today = dayKey(), wk = weekKey();
    const patch: Partial<Game> = {};
    if (s.week.key !== wk) {
      patch.week = { key: wk, ora: 0, freePull: false };
      // pay out last week's league: rivals are scored at the end of that week
      const end = new Date(parseDayLocal(s.week.key).getTime() + 7 * 864e5 - 1000);
      const pos = leagueRows(s.week.ora, s.week.key, s.name, rankIdx(s.power), end).findIndex(r => r.me) + 1;
      const prize = [300, 200, 100][pos - 1];
      if (prize && s.week.ora > 0) setTimeout(() => { get().earn(prize, { mult: false }); useFx.getState().toast('puri', `League finish: #${pos}!`, `+${prize} Ōra for last week. GG.`, 'victory'); }, 2000);
    }
    if (s.day.key !== today) {
      patch.day = freshDay(today);
      const st = { ...s.streak };
      if (st.last && st.count > 0) {
        const gap = daysBetween(st.last, today);
        if (gap > 1) {
          const missed = gap - 1;
          if (st.shields >= missed) {
            st.shields -= missed; st.last = addDays(today, -1); st.saved += missed;
            setTimeout(() => useFx.getState().toast('momo', 'Streak saved!', `Momo used ${missed > 1 ? missed + ' Encore shields' : 'an Encore shield'} for the day you missed.`, 'celebrate'), 1200);
          } else {
            setTimeout(() => useFx.getState().toast('momo', `Your ${st.count}-day streak ended`, 'Play today\'s challenge to start a new one.', 'cry'), 1200);
            st.count = 0;
          }
        }
      }
      patch.streak = st;
    }
    if (Object.keys(patch).length) set(patch);
  },

  finishOnboarding: o => set({ onboarded: true, name: o.name, partner: o.partner, answers: { anime: o.anime, platform: o.platform, goal: o.goal } }),

  earn: (n, opt = {}) => {
    const s = get();
    const amt = Math.round(n * (opt.mult === false ? 1 : streakMult(s.streak.count)));
    if (amt <= 0) return 0;
    const before = s.power, after = before + amt;
    set({ power: after, wallet: s.wallet + amt, day: { ...s.day, ora: s.day.ora + amt }, week: { ...s.week, ora: s.week.ora + amt } });
    const fx = useFx.getState();
    if (opt.x != null && opt.y != null) fx.float(opt.x, opt.y, `+${amt}`);
    const a = stars(before), b = stars(after);
    if (b.i > a.i) {
      for (let i = a.i + 1; i <= b.i; i++) fx.push({ type: 'rank', idx: i });
    } else if (b.stars > a.stars) {
      set(st => ({ tickets: { ...st.tickets, std: st.tickets.std + 1 } }));
      fx.push({ type: 'star', title: titleOf(after) });
    }
    return amt;
  },

  spend: n => { const s = get(); if (s.wallet < n) return false; set({ wallet: s.wallet - n }); return true; },

  checkin: () => {
    const s = get(); if (s.day.checkin) return false;
    set({ day: { ...s.day, checkin: true }, tickets: { ...s.tickets, std: s.tickets.std + 1 } });
    return true;
  },

  canEarnQuiz: (mode, cat) => {
    const d = get().day;
    if (mode === 'daily') return !d.challenge;
    if (mode === 'library') return !d.quizzes.includes(cat!) && d.quizzes.length < 5;
    return true;
  },

  completeQuiz: ({ mode, cat, right, total }) => {
    const s = get(); let bonus = 0, ticket = false, streakUp = false, milestone = false;
    const won = right >= Math.ceil(total * 0.6);
    const day = { ...s.day }, streak = { ...s.streak }, tickets = { ...s.tickets };
    if (mode === 'daily' && !day.challenge) {
      day.challenge = true; day.challengeScore = right;
      bonus += 100; ticket = true; tickets.std += 1;
      const today = dayKey();
      if (streak.last !== today) {
        streak.count = streak.last === addDays(today, -1) ? streak.count + 1 : 1;
        streak.last = today; streakUp = true;
        streak.best = Math.max(streak.best, streak.count);
        if (MILESTONES.includes(streak.count)) { milestone = true; day.milestone = true; if (streak.count % 7 === 0 && streak.shields < 2) streak.shields += 1; }
      }
    }
    if (mode === 'library' && cat && !day.quizzes.includes(cat)) day.quizzes = [...day.quizzes, cat];
    if (right === total && mode !== 'warmup') bonus += 50;
    set({ day, streak, tickets, quizzesWon: s.quizzesWon + (won ? 1 : 0), perfects: s.perfects + (right === total ? 1 : 0) });
    return { bonus, ticket, streakUp, milestone };
  },

  reelToken: () => { const s = get(); if (s.day.jar >= 60) return false; set({ day: { ...s.day, jar: s.day.jar + 1 } }); return true; },
  reelDone: id => { const s = get(); if (!s.day.reels.includes(id)) set({ day: { ...s.day, reels: [...s.day.reels, id] } }); },
  learnWord: () => { const s = get(); if (s.day.word) return; set({ day: { ...s.day, word: true }, wordsLearned: s.wordsLearned + 1 }); },

  react: (post, who) => set(s => ({ reacts: { ...s.reacts, [post]: s.reacts[post] === who ? null : who } })),
  toggleJoin: c => set(s => ({ joined: { ...s.joined, [c]: !s.joined[c] } })),
  addPost: (c, text) => set(s => ({ posts: [{ id: 'u' + uid(), c, by: s.name, rank: rankIdx(s.power), text, r: { taku: 0, momo: 0, puri: 0 }, at: Date.now(), mine: true }, ...s.posts] })),
  addComment: (post, text) => {
    const s = get();
    set({ comments: { ...s.comments, [post]: [...(s.comments[post] || []), { id: uid(), text, at: Date.now() }] }, day: { ...s.day, comments: s.day.comments + 1 } });
    return s.day.comments < 5; // first five comments a day earn Ōra
  },

  cheerIdea: id => {
    const s = get();
    if (s.day.cheersUsed >= cheersMax(s.power)) return { ok: false, stagedUp: false };
    const base = IDEAS.find(i => i.id === id)?.base ?? 0;
    const before = base + (s.ideaCheers[id] || 0), after = before + 1;
    set({ ideaCheers: { ...s.ideaCheers, [id]: (s.ideaCheers[id] || 0) + 1 }, day: { ...s.day, cheersUsed: s.day.cheersUsed + 1 } });
    return { ok: true, stagedUp: (before < 100 && after >= 100) || (before < 500 && after >= 500) };
  },
  votePoll: opt => {
    const s = get();
    if (s.poll || s.day.cheersUsed >= cheersMax(s.power) || dayKey() > POLL.ends) return false;
    set({ poll: opt, day: { ...s.day, cheersUsed: s.day.cheersUsed + 1 } });
    return true;
  },
  submitIdea: (title, type) => set(s => ({ myIdeas: [{ id: uid(), title, type, at: Date.now() }, ...s.myIdeas] })),

  claimBoard: () => {
    const s = get(), d = s.day;
    if (d.boardClaimed || !(d.checkin && d.challenge && d.reels.length >= 2)) return false;
    set({ day: { ...d, boardClaimed: true }, tickets: { ...s.tickets, std: s.tickets.std + 1 } });
    return true;
  },
  buyShield: () => { const s = get(); if (s.streak.shields >= 2 || s.wallet < 500) return false; set({ wallet: s.wallet - 500, streak: { ...s.streak, shields: s.streak.shields + 1 } }); return true; },

  pullCost: tier => {
    const s = get(), T = TIERS[tier];
    if (s.tickets[tier] > 0) return 'ticket';
    if (tier === 'std' && rankIdx(s.power) >= 2 && !s.week.freePull) return 'free';
    if (T.cost && rankIdx(s.power) >= T.minRank && s.wallet >= T.cost) return 'ora';
    return null;
  },
  pull: tier => {
    const s = get(), T = TIERS[tier], how = get().pullCost(tier);
    if (!how) return null;
    const tickets = { ...s.tickets }, pity = { ...s.pity }, week = { ...s.week };
    let wallet = s.wallet;
    if (how === 'ticket') tickets[tier] -= 1;
    else if (how === 'free') week.freePull = true;
    else wallet -= T.cost;
    pity[tier] += 1;
    let r: Rarity;
    if (pity[tier] >= T.pity) r = T.pityR;
    else {
      let x = Math.random() * 100; r = T.odds[0][0];
      for (const [rr, p] of T.odds) { if ((x -= p) < 0) { r = rr; break; } }
    }
    if (RARITY_ORDER.indexOf(r) >= RARITY_ORDER.indexOf(T.pityR)) pity[tier] = 0;
    const pool = PRIZES.filter(p => p.r === r);
    const prize = pool[Math.floor(Math.random() * pool.length)];
    const collectible = prize.art.kind !== 'coupon' && prize.art.kind !== 'perk';
    const dupe = collectible && s.cabinet.some(c => c.id === prize.id);
    const cabinet = dupe ? s.cabinet : [{ uid: uid(), id: prize.id, at: Date.now(), expires: prize.art.kind === 'coupon' ? Date.now() + 14 * 864e5 : undefined }, ...s.cabinet];
    set({ tickets, pity, week, wallet, cabinet, pulls: s.pulls + 1 });
    if (dupe) get().earn(DUPE_ORA[r], { mult: false });
    return { prize, dupe };
  },
  equip: part => set({ equipped: part }),

  placeOrder: (o, couponUid) => {
    const s = get();
    const order: Order = { ...o, id: uid(), at: Date.now(), code: 'OTA-' + uid().slice(0, 6).toUpperCase() };
    set({
      orders: [order, ...s.orders],
      wallet: s.wallet - o.ora, // o.ora is Ōra spent; 10 Ōra = ₹1
      cabinet: couponUid ? s.cabinet.map(c => (c.uid === couponUid ? { ...c, used: true } : c)) : s.cabinet,
      tickets: o.legend ? { ...s.tickets, legend: s.tickets.legend + 1 } : s.tickets,
    });
    return order;
  },

  setPartner: w => set({ partner: w }),
  setName: n => set({ name: n }),
  setSize: sz => set({ size: sz }),
  setSetting: (k, v) => { set(s => ({ settings: { ...s.settings, [k]: v } })); if (k === 'haptics') useFx.setState({ hapticsOn: v }); },
  setTheme: t => { applyTheme(t); set(s => ({ settings: { ...s.settings, theme: t } })); },
  setToured: () => set({ toured: true }),
  reset: () => set(s => ({ ...initial(), settings: { ...initial().settings, theme: s.settings.theme }, created: Date.now() })),
}), {
  name: 'ota-life-v1',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: s => Object.fromEntries(Object.entries(s).filter(([, v]) => typeof v !== 'function')) as any,
  onRehydrateStorage: () => st => {
    if (!st) return;
    useFx.setState({ hapticsOn: st.settings?.haptics !== false });
    applyTheme(st.settings?.theme || 'pastel'); // older saves default to Idol Pastel
  },
}));

/* derived helpers */
export const activeCoupons = (g: Game) => g.cabinet.filter(c => c.id === 'cp-15' && !c.used && (!c.expires || c.expires > Date.now()));
export const ideaCount = (g: Game, id: string) => (IDEAS.find(i => i.id === id)?.base ?? 0) + (g.ideaCheers[id] || 0);
export const boardDone = (d: Day) => [d.checkin, d.challenge, d.reels.length >= 2];
