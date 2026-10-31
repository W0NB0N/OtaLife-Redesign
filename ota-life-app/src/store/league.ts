// Offline weekly league. Rivals are generated per week and earn through the week at their
// own pace, so the table moves in real time and resets every Monday.
import { RIVALS } from '@/content/catalog';
import { seeded, weekProgress } from '@/lib/time';

export type LeagueRow = { name: string; rank: number; ora: number; time: number; me?: boolean };

export function leagueRows(myOra: number, wk: string, myName = 'You', myRank = 1, now = new Date()): LeagueRow[] {
  const rnd = seeded('league' + wk);
  const p = weekProgress(now);
  const rows: LeagueRow[] = RIVALS.map(name => {
    const target = 700 + Math.floor(rnd() * 4300);
    const pace = 0.75 + rnd() * 0.5; // early birds vs weekend grinders
    const ora = Math.round(target * Math.min(1, Math.pow(p, pace)) / 10) * 10;
    return { name, rank: 1 + Math.floor(rnd() * 3), ora, time: 180 + Math.floor(rnd() * 240) };
  });
  rows.push({ name: myName, rank: myRank, ora: myOra, time: 240, me: true });
  return rows.sort((a, b) => b.ora - a.ora || a.time - b.time);
}

export const leaguePos = (myOra: number, wk: string) => leagueRows(myOra, wk).findIndex(r => r.me) + 1;
