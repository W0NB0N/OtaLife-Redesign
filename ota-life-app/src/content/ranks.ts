export type BossId = 'kappa' | 'tanuki' | 'tengu' | 'oni' | 'yuki' | 'daimao';

export const RANKS = [
  { id: 'shoshinsha', name: 'Shoshinsha', en: 'Beginner', min: 0, boss: null as BossId | null, cap: 0, cheers: 3, frame: '#8A84B8', perks: ['3 Cheers a day', 'Paper frame'] },
  { id: 'kohai', name: 'Kōhai', en: 'Junior', min: 500, boss: 'kappa' as BossId, cap: 5, cheers: 3, frame: '#FF8FB0', perks: ['Sakura frame', 'Your title shows on comments', 'Pay up to 5% with Ōra'] },
  { id: 'senpai', name: 'Senpai', en: 'Senior', min: 3000, boss: 'tanuki' as BossId, cap: 10, cheers: 4, frame: '#3DDC97', perks: ['Teal ribbon frame', '4 Cheers a day', 'Rare+ pulls with Ōra', 'Free Standard pull every week', 'Pay up to 10% with Ōra'] },
  { id: 'otaku', name: 'Otaku', en: 'True fan', min: 10000, boss: 'tengu' as BossId, cap: 15, cheers: 4, frame: '#A77BFF', perks: ['Akiba neon frame', 'Pitch Fan Council ideas', 'Start your own community', 'Pay up to 15% with Ōra'] },
  { id: 'sensei', name: 'Sensei', en: 'Master', min: 25000, boss: 'oni' as BossId, cap: 20, cheers: 5, frame: '#FFC93C', perks: ['Gold brush frame', '5 Cheers a day', 'Legend ticket every rank-up', 'Pay up to 20% with Ōra'] },
  { id: 'shogun', name: 'Shōgun', en: 'Warlord', min: 60000, boss: 'yuki' as BossId, cap: 25, cheers: 5, frame: '#FF4D6D', perks: ['Kabuto crest frame', 'Meet-and-greet raffle entry', 'Pay up to 25% with Ōra'] },
  { id: 'kami', name: 'Kami', en: 'Legend', min: 120000, boss: 'daimao' as BossId, cap: 25, cheers: 6, frame: '#4FC3F7', perks: ['Living aura frame', '6 Cheers a day', 'Free General pass each festival'] },
];

export const BOSSES: Record<BossId, { name: string; line: string; color: string; shade: string; belly: string }> = {
  kappa: { name: 'Spoiler Kappa', line: 'I know how the season ends…', color: '#3DDC97', shade: '#22B279', belly: '#C8F7DF' },
  tanuki: { name: 'Filler Tanuki', line: 'Just one more recap episode~', color: '#C98A5A', shade: '#A86C40', belly: '#F6DFC4' },
  tengu: { name: 'Buffering Tengu', line: 'Loading… loading… loading…', color: '#FF4D6D', shade: '#D93453', belly: '#FFD0D8' },
  oni: { name: 'Sold-Out Oni', line: 'All the merch? Mine.', color: '#4F7CFF', shade: '#3459D9', belly: '#D5E0FF' },
  yuki: { name: 'Burnout Yuki-onna', line: 'Too tired to watch anything…', color: '#9EE0FF', shade: '#6CC2EC', belly: '#FFFFFF' },
  daimao: { name: 'Doomscroll Daimaō', line: 'Scroll forever. Feel nothing.', color: '#7B4DFF', shade: '#5B30DB', belly: '#DCCFFF' },
};

export const rankIdx = (p: number) => { let i = 0; RANKS.forEach((r, k) => { if (p >= r.min) i = k; }); return i; };

export function stars(p: number) {
  const i = rankIdx(p), r = RANKS[i], nx = RANKS[i + 1];
  if (!nx) return { i, stars: 3, from: r.min, to: r.min, pct: 1, next: null as typeof r | null };
  const step = (nx.min - r.min) / 3;
  const s = Math.min(3, 1 + Math.floor((p - r.min) / step));
  const from = r.min + step * (s - 1), to = s < 3 ? r.min + step * s : nx.min;
  return { i, stars: s, from, to, pct: (p - from) / (to - from), next: nx };
}

export const titleOf = (p: number) => `${RANKS[rankIdx(p)].name} ${'★'.repeat(stars(p).stars)}`;
