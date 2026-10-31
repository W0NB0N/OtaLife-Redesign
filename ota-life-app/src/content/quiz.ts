// Japanese-through-anime question bank. Text inside 〔〕 renders as a highlighted Japanese word.
export type Q = { id: string; cat: string; q: string; o: string[]; a: number; note: string };

export const QUIZ_CATS = [
  { id: 'words', name: 'Anime words 101', kanji: '語', level: 'Beginner', color: '#4FC3F7' },
  { id: 'shonen', name: 'Shōnen catchphrases', kanji: '拳', level: 'Intermediate', color: '#FFC93C' },
  { id: 'idol', name: 'Idol & fan culture', kanji: '歌', level: 'Intermediate', color: '#FF5C9A' },
  { id: 'kanji', name: 'Kanji in anime titles', kanji: '漢', level: 'Advanced', color: '#A77BFF' },
  { id: 'japan', name: 'Life in Japan', kanji: '日', level: 'Beginner', color: '#3DDC97' },
];

export const BANK: Q[] = [
  { id: 'w1', cat: 'words', q: 'Zero Two calls Hiro 〔ダーリン〕 (daarin). What does it mean?', o: ['Captain', 'Darling', 'My enemy', 'Big brother'], a: 1, note: '〔ダーリン〕 is borrowed from English "darling". Katakana usually marks a loanword.' },
  { id: 'w2', cat: 'words', q: '〔かわいい〕 (kawaii) means…', o: ['Scary', 'Cute', 'Hungry', 'Fast'], a: 1, note: '〔かわいい〕 means "cute". Momo-chan uses it for everything, chutney included.' },
  { id: 'w3', cat: 'words', q: '〔先輩〕 (senpai) is…', o: ['A teacher', 'A rival', 'Someone senior to you', 'A best friend'], a: 2, note: '〔先輩〕 is anyone senior at school or work. It is also a rank on Ōta.' },
  { id: 'w4', cat: 'words', q: '〔推し〕 (oshi) is your…', o: ['Rival', 'Favourite character', 'Teacher', 'Pet'], a: 1, note: '〔推し〕 comes from 推す (osu), "to push". Your oshi is who you hype.' },
  { id: 'w5', cat: 'words', q: '〔頑張って〕 (ganbatte) means…', o: ['Do your best!', 'Be quiet', 'Thank you', 'Welcome back'], a: 0, note: '〔頑張って〕 is "go for it!". Reply with 頑張ります (ganbarimasu), "I will!".' },
  { id: 'w6', cat: 'words', q: '〔やばい〕 (yabai) can mean…', o: ['Only "dangerous"', 'Awful or amazing, by context', 'Delicious', 'Goodbye'], a: 1, note: '〔やばい〕 started as "dangerous" and now covers anything intense, good or bad.' },
  { id: 'w7', cat: 'words', q: 'A character says 〔ただいま〕 (tadaima) when…', o: ['Leaving home', 'Coming home', 'Eating', 'Going to sleep'], a: 1, note: '〔ただいま〕 is "I\'m home". The family replies おかえり (okaeri).' },
  { id: 'w8', cat: 'words', q: '〔すごい〕 (sugoi) means…', o: ['Amazing', 'Sad', 'Small', 'Slow'], a: 0, note: '〔すごい〕 is "amazing". Add a long い for extra drama: すごーい!' },
  { id: 's1', cat: 'shonen', q: 'Naruto ends his lines with 〔だってばよ〕 (dattebayo). Closest meaning?', o: ['…you know!', 'Goodbye!', "I'm hungry", "Let's fight"], a: 0, note: '〔だってばよ〕 is a verbal tic, roughly "…you know!". The English dub chose "Believe it!".' },
  { id: 's2', cat: 'shonen', q: 'Luffy wants to be 〔海賊王〕 (kaizoku-ō). That is…', o: ['King of the Pirates', 'Sea captain', 'Ocean god', 'Navy admiral'], a: 0, note: '〔海賊王〕: 海賊 (kaizoku) is pirate and 王 (ō) is king.' },
  { id: 's3', cat: 'shonen', q: 'In Jujutsu Kaisen, 〔呪術〕 (jujutsu) means…', o: ['A gentle martial art', 'Cursed sorcery', 'The ninja path', 'A sword style'], a: 1, note: '〔呪術〕 is sorcery (呪 = curse). Jiu-jitsu the martial art is a different word: 柔術.' },
  { id: 's4', cat: 'shonen', q: 'Tanjiro\'s "Breathing" techniques use the word 〔呼吸〕 (kokyū). It means…', o: ['Breath', 'Blade', 'Fire', 'Water'], a: 0, note: '〔呼吸〕 is literally "breathing": 呼 exhale, 吸 inhale.' },
  { id: 's5', cat: 'shonen', q: '〔必殺技〕 (hissatsu-waza) is a…', o: ['Finishing move', 'Training arc', 'Rival', 'Flashback'], a: 0, note: '〔必殺技〕 means "certain-kill technique": every hero\'s signature move.' },
  { id: 's6', cat: 'shonen', q: 'Goku powers up as a 〔超サイヤ人〕. The 超 (sūpā) means…', o: ['Super', 'Angry', 'Golden', 'Ancient'], a: 0, note: '〔超〕 alone reads chō and means "super" or "ultra".' },
  { id: 's7', cat: 'shonen', q: '〔仲間〕 (nakama) is a word shōnen heroes love. It means…', o: ['Comrades', 'Enemies', 'Teachers', 'Strangers'], a: 0, note: '〔仲間〕 is your crew, the friends you would fight for.' },
  { id: 'i1', cat: 'idol', q: 'At idol LIVEs, 〔ヲタ芸〕 (wotagei) is…', o: ['A glowstick cheer dance', 'A ramen style', 'A card game', 'A cosplay pose'], a: 0, note: '〔ヲタ芸〕 is the glowstick dance fans do in the crowd. TAKU-kun\'s speciality.' },
  { id: 'i2', cat: 'idol', q: 'A 〔センター〕 (sentā) in an idol group is…', o: ['The manager', 'The member in the middle spot', 'The stage', 'The fan club'], a: 1, note: '〔センター〕 is the member who stands centre, usually the most popular.' },
  { id: 'i3', cat: 'idol', q: '〔デビュー〕 (debyū) means…', o: ['Debut', 'Retirement', 'Encore', 'Rehearsal'], a: 0, note: '〔デビュー〕 is "debut". Momo-chan\'s is at Ōta TOKYO Delhi!' },
  { id: 'i4', cat: 'idol', q: 'Fans call colourful glowsticks 〔ペンライト〕 (penraito). Literally…', o: ['Pen light', 'Power light', 'Party light', 'Pink light'], a: 0, note: '〔ペンライト〕 is from English "penlight".' },
  { id: 'i5', cat: 'idol', q: 'An 〔アンコール〕 (ankōru) is…', o: ['The opening song', 'An encore', 'A meet-and-greet', 'The ticket line'], a: 1, note: '〔アンコール〕 is the encore. Chant it loud enough and the idol returns.' },
  { id: 'i6', cat: 'idol', q: '〔握手会〕 (akushukai) is an event where fans…', o: ['Shake hands with idols', 'Buy CDs', 'Sing karaoke', 'Vote for songs'], a: 0, note: '〔握手会〕: 握手 (akushu) is handshake, 会 (kai) is meeting.' },
  { id: 'k1', cat: 'kanji', q: 'The 〔鬼〕 in 鬼滅の刃 (Kimetsu no Yaiba) means…', o: ['Demon', 'Blade', 'Fire', 'Brother'], a: 0, note: '〔鬼〕 (oni) is a demon or ogre. 刃 (yaiba) is blade.' },
  { id: 'k2', cat: 'kanji', q: 'In 進撃の巨人, 〔巨人〕 (kyojin) means…', o: ['Titan or giant', 'Wall', 'Soldier', 'Attack'], a: 0, note: '〔巨人〕: 巨 huge, 人 person. 進撃 is "advance".' },
  { id: 'k3', cat: 'kanji', q: 'The 〔君〕 in 君の名は。 means…', o: ['You', 'Name', 'Sky', 'Star'], a: 0, note: '〔君〕 (kimi) is a familiar "you". 名 (na) is name.' },
  { id: 'k4', cat: 'kanji', q: '〔千〕 in 千と千尋の神隠し means…', o: ['Thousand', 'River', 'Spirit', 'Girl'], a: 0, note: '〔千〕 (sen) is 1,000. Chihiro (千尋) literally holds "a thousand fathoms".' },
  { id: 'k5', cat: 'kanji', q: '〔海〕 appears in many pirate titles. It means…', o: ['Sea', 'Sky', 'Ship', 'Gold'], a: 0, note: '〔海〕 (umi) is sea. Spot the water radical 氵 on its left.' },
  { id: 'k6', cat: 'kanji', q: 'The 〔猫〕 in a cafe sign tells you it is a…', o: ['Cat cafe', 'Dog cafe', 'Book cafe', 'Maid cafe'], a: 0, note: '〔猫〕 (neko) is cat, a favourite word of every catgirl ever.' },
  { id: 'j1', cat: 'japan', q: 'When do characters say 〔いただきます〕 (itadakimasu)?', o: ['After waking up', 'Before eating', 'Leaving home', 'Apologising'], a: 1, note: '〔いただきます〕 means "I humbly receive". After the meal: ごちそうさま.' },
  { id: 'j2', cat: 'japan', q: 'A 〔コンビニ〕 (konbini) is a…', o: ['Convenience store', 'Train pass', 'Lunch box', 'Karaoke booth'], a: 0, note: '〔コンビニ〕 is short for "convenience store". Japan has over 55,000.' },
  { id: 'j3', cat: 'japan', q: '〔お弁当〕 (o-bentō) is a…', o: ['Packed lunch box', 'Festival', 'School uniform', 'Bus stop'], a: 0, note: '〔お弁当〕 is the classic packed lunch. Heart-shaped rice optional.' },
  { id: 'j4', cat: 'japan', q: 'Summer festival stalls are called 〔屋台〕 (yatai). They sell…', o: ['Street food and games', 'Train tickets', 'Books', 'Phones'], a: 0, note: '〔屋台〕 stalls serve takoyaki, yakisoba and goldfish scooping.' },
  { id: 'j5', cat: 'japan', q: 'The 〔新幹線〕 (shinkansen) is Japan\'s…', o: ['Bullet train', 'Metro card', 'Highway', 'Ferry'], a: 0, note: '〔新幹線〕 literally "new trunk line". Top speed is around 320 km/h.' },
  { id: 'j6', cat: 'japan', q: '〔花見〕 (hanami) is…', o: ['Cherry blossom viewing', 'Fireworks', 'New Year', 'Snow festival'], a: 0, note: '〔花見〕: 花 flower, 見 look. Picnics under sakura every spring.' },
];

export const WARMUP_IDS = ['w2', 'j1', 'w1'];
