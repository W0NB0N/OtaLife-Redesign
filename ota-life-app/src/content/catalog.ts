import type { Rarity, Who } from '@/theme';

/* ---------- reels: illustrated story slides, 5 s each ---------- */
export type Slide = { big: string; small: string; caption: string };
export type Reel = { id: string; title: string; by: string; cat: string; bg: string; soft: string; accent: string; host: Who; slides: Slide[] };
export const REELS: Reel[] = [
  { id: 'r1', title: '5 anime words you already know', by: '@nihongo.with.neha', cat: 'Learn', bg: '#3B1F8F', soft: '#E6DCFF', accent: '#C6F432', host: 'taku', slides: [
    { big: 'すごい', small: 'sugoi', caption: 'Amazing. Every reaction video ever.' },
    { big: 'かわいい', small: 'kawaii', caption: 'Cute. Momo-chan approved.' },
    { big: 'やばい', small: 'yabai', caption: 'Intense, good or bad. Context is everything.' },
    { big: '仲間', small: 'nakama', caption: 'Your crew. Straw Hats know.' },
    { big: '推し', small: 'oshi', caption: 'Your favourite. Who is yours?' },
  ] },
  { id: 'r2', title: 'Cosplay on a ₹1,500 budget', by: '@cosplay.riya', cat: 'Cosplay', bg: '#7A1F4F', soft: '#FFDDEB', accent: '#FFC93C', host: 'momo', slides: [
    { big: 'EVA', small: 'foam', caption: 'Craft foam from any stationery shop: ₹180 a sheet.' },
    { big: 'HEAT', small: 'shape it', caption: 'A hair dryer bends foam into armour curves.' },
    { big: 'SEAL', small: 'PVA glue', caption: 'Three coats of PVA before paint so it doesn\'t soak in.' },
    { big: 'WIG', small: 'style it', caption: 'Thrift a wig, then trim with thinning scissors.' },
  ] },
  { id: 'r3', title: 'Tokyo konbini haul, rupee edition', by: '@japanwithaarav', cat: 'Japan', bg: '#0F4A6B', soft: '#D6EFFB', accent: '#4FC3F7', host: 'taku', slides: [
    { big: 'おにぎり', small: '≈ ₹90', caption: 'Tuna-mayo onigiri. Pull tab 1, then 2, then 3.' },
    { big: 'プリン', small: '≈ ₹120', caption: 'Custard pudding. Puri-kun\'s cousin, probably.' },
    { big: 'からあげ', small: '≈ ₹140', caption: 'Hot karaage by the counter. Order with a point.' },
  ] },
  { id: 'r4', title: 'Ōta TOKYO Bangalore: the recap', by: '@ota.official', cat: 'Anime', bg: '#2E1B6B', soft: '#EADFFF', accent: '#FF5C9A', host: 'momo', slides: [
    { big: '15K', small: 'fans', caption: '15,000 of you in one hall. Unreal.' },
    { big: '48', small: 'cosplay finalists', caption: 'The finals ran 40 minutes over. Worth it.' },
    { big: 'DELHI', small: '28–29 Nov', caption: 'Next stop: Yashobhoomi. Momo debuts on stage.' },
  ] },
  { id: 'r5', title: 'Is filler actually bad?', by: '@animenewsguy', cat: 'Anime', bg: '#1E5B3E', soft: '#D7F3E6', accent: '#3DDC97', host: 'puri', slides: [
    { big: '1/3', small: 'of some long runs', caption: 'Some long-running shows are about a third filler.' },
    { big: 'WHY', small: 'manga pace', caption: 'Anime catches up with the manga, so studios stall.' },
    { big: 'BUT', small: 'hidden gems', caption: 'Some fan-favourite episodes are filler. Skip wisely.' },
  ] },
  { id: 'r6', title: 'Speedrun: 3 gacha myths', by: '@gacha.dev', cat: 'Gaming', bg: '#5A3A00', soft: '#FFEFC2', accent: '#FFC93C', host: 'puri', slides: [
    { big: 'MYTH', small: '"I\'m due"', caption: 'Each pull is independent unless the game has pity.' },
    { big: 'PITY', small: 'read it', caption: 'Pity is a guarantee after N pulls. Ōta shows it.' },
    { big: 'GG', small: 'budget', caption: 'Ōta never sells pulls for money. Play to earn.' },
  ] },
];

/** reel colours for the active theme: deep in Night Stage, pastel in Idol Pastel */
export const reelColors = (r: Reel, dark: boolean) => (dark ? { bg: r.bg, fg: '#FFFFFF', sub: '#FFFFFFBB', band: '#00000044' } : { bg: r.soft, fg: '#2B2340', sub: '#5B5070', band: '#FFFFFFB3' });

/* ---------- communities and seeded posts ---------- */
export const COMMUNITIES = [
  { id: 'jjk', name: 'Jujutsu Kaisen India', kanji: '呪', color: '#A77BFF', members: 12400, owner: 'Akatsujuro', ownerRank: 5, city: 'Pan-India', about: 'Theories, cosplay checks and watch parties for every new episode.' },
  { id: 'nihongo', name: 'Japanese with Anime', kanji: '語', color: '#4FC3F7', members: 9700, owner: 'Neha S.', ownerRank: 4, city: 'Online', about: 'One word a day, one scene at a time. Beginners welcome.' },
  { id: 'op', name: 'One Piece Crew Delhi', kanji: '海', color: '#FFC93C', members: 8100, owner: 'Rohan K.', ownerRank: 3, city: 'Delhi NCR', about: 'Monthly meetups in Hauz Khas. Bring your bounty poster.' },
  { id: 'cos', name: 'Cosplay Collective', kanji: '装', color: '#FF5C9A', members: 5600, owner: 'Riya D.', ownerRank: 4, city: 'Bengaluru', about: 'Build logs, budget hacks and contest prep.' },
  { id: 'gacha', name: 'Gacha & Gaming', kanji: '遊', color: '#3DDC97', members: 3200, owner: 'Dev M.', ownerRank: 3, city: 'Online', about: 'Pull reports, team comps and Puri-approved strats.' },
  { id: 'idol', name: 'Idol Stage Fans', kanji: '歌', color: '#FF9F43', members: 2900, owner: 'Ananya P.', ownerRank: 2, city: 'Mumbai', about: 'Wotagei practice sessions and Momo-chan debut prep.' },
];

export type Post = { id: string; c: string; by: string; rank: number; text: string; art?: { kind: 'kanji' | 'card'; text: string; color: string }; r: Record<Who, number>; at: number; mine?: boolean };
const H = 3600e3;
export const SEED_POSTS: Post[] = [
  { id: 'p1', c: 'jjk', by: 'Akatsujuro', rank: 5, text: 'Domain expansion cosplay test for Ōta TOKYO. Is the purple too much?', art: { kind: 'kanji', text: '領域展開', color: '#5B30DB' }, r: { taku: 212, momo: 148, puri: 96 }, at: -2 * H },
  { id: 'p2', c: 'nihongo', by: 'Kavya Pillai', rank: 2, text: 'TIL いただきます means "I humbly receive". Saying it before every chai now.', r: { taku: 88, momo: 41, puri: 12 }, at: -5 * H },
  { id: 'p3', c: 'gacha', by: 'Dev M.', rank: 3, text: 'Legendary Momo debut card on my 3rd Rare+ ticket. Pity counter who?', art: { kind: 'card', text: 'LEGEND', color: '#FFC93C' }, r: { taku: 35, momo: 301, puri: 77 }, at: -26 * H },
  { id: 'p4', c: 'op', by: 'Rohan K.', rank: 3, text: 'November meetup is on! Saturday 15th, 4 pm, Deer Park. Bounty posters provided.', art: { kind: 'kanji', text: '海賊', color: '#E0A100' }, r: { taku: 64, momo: 22, puri: 31 }, at: -30 * H },
  { id: 'p5', c: 'cos', by: 'Riya D.', rank: 4, text: 'Foam armour tip: seal with three coats of PVA before painting. Thank me later.', r: { taku: 19, momo: 140, puri: 8 }, at: -50 * H },
  { id: 'p6', c: 'idol', by: 'Ananya P.', rank: 2, text: 'Wotagei practice this Sunday. We are learning the Momo debut cheer routine!', art: { kind: 'kanji', text: 'ヲタ芸', color: '#FF5C9A' }, r: { taku: 120, momo: 96, puri: 14 }, at: -70 * H },
];
export const SEED_COMMENTS: Record<string, { by: string; rank: number; text: string; at: number }[]> = {
  p1: [{ by: 'Kavya Pillai', rank: 2, text: 'Not too much. Never too much.', at: -1 * H }, { by: 'Neha S.', rank: 4, text: 'Bring this to the cosplay finals!', at: -1.5 * H }],
  p2: [{ by: 'Mm', rank: 1, text: 'ごちそうさま after, don\'t forget!', at: -3 * H }],
  p3: [{ by: 'Zoya K.', rank: 1, text: 'Show us the holo!!', at: -20 * H }],
};

/* ---------- Fan Council ---------- */
export const POLL = {
  id: 'headliner-d2', q: 'Who should headline Day 2 at Ōta TOKYO Delhi?', ends: '2026-11-10',
  options: [{ id: 'a', name: "DARUMA Rollin'", base: 1240 }, { id: 'b', name: 'Sakura Static', base: 860 }, { id: 'c', name: 'Bombay Kitsune', base: 610 }],
};
export const IDEAS = [
  { id: 'repair', title: 'Cosplay repair booth at the venue', by: 'Kavya Pillai', rank: 2, type: 'Events', kanji: '針', color: '#FF5C9A', base: 96 },
  { id: 'plush', title: 'Momo-chan plush keychain', by: 'Dev M.', rank: 3, type: 'Merch', kanji: '桃', color: '#FFC93C', base: 382 },
  { id: 'arcade', title: 'Retro arcade zone with a Puri high-score board', by: 'Akatsujuro', rank: 5, type: 'Events', kanji: '遊', color: '#4FC3F7', base: 64 },
  { id: 'subs', title: 'Hindi subtitle track for the LIVE screens', by: 'Neha S.', rank: 4, type: 'Events', kanji: '字', color: '#3DDC97', base: 228 },
];
export const STAGES: [string, number][] = [['Spark', 100], ['Hype', 500], ['Review', 0], ['Confirmed', 0], ['Live', 0]];
export const stageOf = (n: number) => (n < 100 ? 0 : n < 500 ? 1 : 2);

/* ---------- store ---------- */
export type Product = { id: string; name: string; price: number; kind: 'tee' | 'hoodie' | 'stand' | 'plush' | 'glow' | 'keychain' | 'tote' | 'poster'; who: Who; color: string; sizes?: boolean; about: string; rating: number; reviews: number; tag?: string };
export const PRODUCTS: Product[] = [
  { id: 'tee', name: 'TAKU Akiba tee', price: 899, kind: 'tee', who: 'taku', color: '#4FC3F7', sizes: true, about: 'Heavyweight 240 gsm cotton with TAKU mid-wotagei on the front. Printed in Tiruppur.', rating: 4.8, reviews: 214, tag: 'Bestseller' },
  { id: 'stand', name: 'Momo debut acrylic stand', price: 649, kind: 'stand', who: 'momo', color: '#FF5C9A', about: '12 cm clear acrylic on a holo base. Limited to the Delhi festival run.', rating: 4.9, reviews: 98, tag: 'Limited' },
  { id: 'plush', name: 'Puri squish plush', price: 1299, kind: 'plush', who: 'puri', color: '#FFC93C', about: '25 cm and extra puffy, with a removable purple gamer headset.', rating: 4.7, reviews: 176 },
  { id: 'glow', name: 'Ōra glowstick pair', price: 349, kind: 'glow', who: 'taku', color: '#C6F432', about: '12 colours and a wotagei-grade wrist strap. Batteries included.', rating: 4.6, reviews: 301 },
  { id: 'hoodie', name: 'Trio night hoodie', price: 1799, kind: 'hoodie', who: 'momo', color: '#8B6CFF', sizes: true, about: 'Brushed fleece with all three mascots on the back. Kangaroo pocket fits a Switch.', rating: 4.8, reviews: 67, tag: 'New' },
  { id: 'keychain', name: 'Capsule keychain set', price: 499, kind: 'keychain', who: 'puri', color: '#FF9F43', about: 'Three rubber capsule charms, one per mascot. Clip them to your bag.', rating: 4.5, reviews: 143 },
  { id: 'tote', name: 'Akiba run tote', price: 599, kind: 'tote', who: 'taku', color: '#3DDC97', about: 'Canvas tote sized for manga volumes and con loot.', rating: 4.6, reviews: 88 },
  { id: 'poster', name: 'Ōta TOKYO Delhi poster', price: 299, kind: 'poster', who: 'momo', color: '#FF4D6D', about: 'A2 art print of the Delhi festival key visual, matte finish.', rating: 4.7, reviews: 52 },
];

export type Event = { id: string; name: string; place: string; city: string; days: string[]; color: string; scene: 'festival' | 'workshop' | 'market'; about: string; tiers: { id: string; name: string; price: number; perks: string[]; legend?: boolean }[] };
export const EVENTS: Event[] = [
  { id: 'delhi', name: 'Ōta TOKYO Delhi', place: 'Yashobhoomi, Dwarka', city: 'New Delhi', days: ['2026-11-28', '2026-11-29'], color: '#8B6CFF', scene: 'festival', about: 'Two halls of anime, gaming, cosplay finals and Momo-chan\'s idol debut on the LIVE stage.',
    tiers: [
      { id: 'gen', name: 'General', price: 299, perks: ['Entry to both halls', 'Cosplay finals viewing', 'Event badge in the app'] },
      { id: 'prime', name: 'Prime', price: 799, perks: ['Everything in General', 'Seated LIVE stage', 'Sushi workshop seat', '+1 Legend capsule ticket'], legend: true },
      { id: 'vip', name: 'VIP', price: 1999, perks: ['Everything in Prime', 'Front row for Momo\'s debut', 'Voice actor meet-and-greet', 'Fast-lane entry'], legend: true },
    ] },
  { id: 'sketch', name: 'Manga Sketch Night', place: 'Social, Hauz Khas', city: 'New Delhi', days: ['2026-11-14'], color: '#FF5C9A', scene: 'workshop', about: 'Two hours of guided chibi drawing with a pro mangaka. Paper and pens provided.',
    tiers: [{ id: 'seat', name: 'Seat', price: 449, perks: ['All materials', 'Signed sketch to take home', 'Matcha on the house'] }] },
  { id: 'market', name: 'Ōta Night Market', place: 'Phoenix Marketcity', city: 'Bengaluru', days: ['2026-12-12', '2026-12-13'], color: '#FFC93C', scene: 'market', about: 'Yatai food stalls, indie artist alley and a capsule machine the size of a car.',
    tiers: [{ id: 'entry', name: 'Entry', price: 149, perks: ['Entry both nights', '1 free takoyaki', 'Artist alley access'] }] },
];

/* ---------- capsule prizes ---------- */
export type Prize = { id: string; r: Rarity; name: string; desc: string; art: { kind: 'sticker' | 'part' | 'coupon' | 'card' | 'perk'; who?: Who; state?: string; acc?: string; text?: string }; part?: string };
export const PRIZES: Prize[] = [
  { id: 'st-gg', r: 'common', name: 'Puri "GG" sticker', desc: 'Chat sticker', art: { kind: 'sticker', who: 'puri', state: 'gg' } },
  { id: 'st-wota', r: 'common', name: 'TAKU wotagei sticker', desc: 'Chat sticker', art: { kind: 'sticker', who: 'taku', state: 'wotagei' } },
  { id: 'st-wink', r: 'common', name: 'Momo wink sticker', desc: 'Chat sticker', art: { kind: 'sticker', who: 'momo', state: 'sparkle' } },
  { id: 'st-zz', r: 'common', name: 'Sleepy Momo sticker', desc: 'Chat sticker', art: { kind: 'sticker', who: 'momo', state: 'sleepy' } },
  { id: 'av-hs', r: 'rare', name: 'Gamer headset', desc: 'Avatar part · equip on Me', art: { kind: 'part', who: 'puri', state: 'happy', acc: 'headset' }, part: 'headset' },
  { id: 'av-crown', r: 'rare', name: 'Paper crown', desc: 'Avatar part · equip on Me', art: { kind: 'part', who: 'momo', state: 'happy', acc: 'crown' }, part: 'crown' },
  { id: 'av-hat', r: 'rare', name: 'Party hat', desc: 'Avatar part · equip on Me', art: { kind: 'part', who: 'taku', state: 'happy', acc: 'partyHat' }, part: 'partyHat' },
  { id: 'cp-15', r: 'epic', name: '15% off merch', desc: 'Coupon · applies itself at checkout · valid 14 days', art: { kind: 'coupon', text: '15%' } },
  { id: 'fast', r: 'epic', name: 'Fast-lane pass', desc: 'Skip the gate queue at Ōta TOKYO Delhi', art: { kind: 'perk', text: 'FAST' } },
  { id: 'holo-taku', r: 'epic', name: 'Holo TAKU card', desc: 'Trading card · 1 of 24', art: { kind: 'card', who: 'taku', state: 'wotagei' } },
  { id: 'holo-momo', r: 'legendary', name: 'Momo debut holo card', desc: 'Legendary trading card · 1 of 6', art: { kind: 'card', who: 'momo', state: 'celebrate' } },
  { id: 'meet', r: 'legendary', name: 'Meet-and-greet entry', desc: 'Raffle entry · Ōta TOKYO Delhi Day 2', art: { kind: 'perk', text: 'VIP' } },
];

export const TIERS = {
  std: { name: 'Standard', color: '#FF5C9A', odds: [['common', 70], ['rare', 25], ['epic', 5]] as [Rarity, number][], cost: 300, pity: 10, pityR: 'epic' as Rarity, minRank: 0 },
  rare: { name: 'Rare+', color: '#4FA8FF', odds: [['rare', 70], ['epic', 27], ['legendary', 3]] as [Rarity, number][], cost: 1200, pity: 20, pityR: 'legendary' as Rarity, minRank: 2 },
  legend: { name: 'Legend', color: '#FFC93C', odds: [['epic', 80], ['legendary', 20]] as [Rarity, number][], cost: 0, pity: 5, pityR: 'legendary' as Rarity, minRank: 99 },
};
export type TierId = keyof typeof TIERS;
export const DUPE_ORA: Record<Rarity, number> = { common: 20, rare: 60, epic: 150, legendary: 500 };
export const RARITY_ORDER: Rarity[] = ['common', 'rare', 'epic', 'legendary'];

/* ---------- league rivals (offline weekly league) ---------- */
export const RIVALS = ['Aanya R.', 'Kabir S.', 'Meera J.', 'Ishaan P.', 'Zoya K.', 'Arjun T.', 'Tanvi M.', 'Rohit V.', 'Sana Q.', 'Vivek N.', 'Nisha B.', 'Om G.', 'Farhan A.', 'Diya C.'];

export const FESTIVAL_DAY = '2026-11-28';
