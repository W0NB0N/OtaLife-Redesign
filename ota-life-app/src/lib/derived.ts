// Derived state shared by several screens.
import { C } from '@/theme';
import type { MState } from '@/mascots/Mascot';
import { streakMult, useGame } from '@/store/game';
import { WORDS } from '@/content/words';
import { dayKey, daysBetween, untilMidnight } from './time';

export const wordToday = () => WORDS[Math.abs(daysBetween('2026-01-01', dayKey())) % WORDS.length];

export function streakMood(g: ReturnType<typeof useGame.getState>): { s: MState; tag: string; line: string; bg: string; fg: string } {
  const done = g.day.challenge, n = g.streak.count, evening = new Date().getHours() >= 18;
  if (done && g.day.milestone) return { s: 'celebrate', tag: `${n}-day milestone`, line: `×${streakMult(n)} Ōra boost unlocked!`, bg: C.momo, fg: C.ink };
  if (done && n >= 7) return { s: 'lively', tag: 'On fire', line: `${n} days! I'm buzzing!`, bg: C.momoSoft, fg: C.text };
  if (done) return { s: 'happy', tag: 'Kept today', line: 'See you tomorrow!', bg: C.momoSoft, fg: C.text };
  if (n > 0 && evening) return { s: 'sleepy', tag: 'At risk', line: `${untilMidnight()} left. Play today's challenge!`, bg: '#2A2547', fg: C.text };
  if (n > 0) return { s: 'wave', tag: 'Keep it going', line: 'One challenge keeps me awake', bg: C.momoDeep, fg: C.text };
  return { s: 'wave', tag: 'Start a streak', line: 'One challenge a day lights me up', bg: C.momoDeep, fg: C.text };
}
