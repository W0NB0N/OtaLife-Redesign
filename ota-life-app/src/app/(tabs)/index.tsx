// Home: the daily hub. Buddy + Power, Momo's streak, tickets, today's quests, Puri's jar, the festival.
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { C, DOMAIN, F, Who, themed } from '@/theme';
import { boardDone, streakMult, useGame } from '@/store/game';
import { haptic, useFx } from '@/store/fx';
import { stars, titleOf, RANKS, BOSSES } from '@/content/ranks';
import { EVENTS, FESTIVAL_DAY, RIVALS } from '@/content/catalog';
import { addDays, dayKey, daysUntil, fmt, untilMidnight, weekdayLetter } from '@/lib/time';
import { Mascot, MascotStill, MState, PokeMascot } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { CapsuleArt, JarArt } from '@/art/Machine';
import { EventScene, Confetti as Deco } from '@/art/Products';
import { Bar, Btn, Bubble, Card, H, Num, Over, Pill, Press, Row, T } from '@/ui/kit';
import { Screen, TopBar } from '@/ui/game';
import { Confetti } from '@/ui/overlays';
import { leaguePos } from '@/store/league';
import { Tour, useTourTarget } from '@/screens/Tour';
import { streakMood } from '@/lib/derived';


function homeLine(g: ReturnType<typeof useGame.getState>, who: Who) {
  const m = streakMood(g).s;
  if (who === 'puri') return m === 'sleepy' ? 'Streak\'s on the line. Daily Challenge. Now.' : g.tickets.std ? `${g.tickets.std} capsule ticket${g.tickets.std > 1 ? 's' : ''} ready. Loot time?` : g.day.challenge ? 'Dailies cleared. Library quizzes still pay.' : 'Daily Challenge is live. Queue up.';
  if (who === 'momo') return m === 'sleepy' ? `${g.streak.count} days together! Don't leave me hanging.` : `${Math.max(0, daysUntil(FESTIVAL_DAY))} days to my debut! Practise with me?`;
  return g.day.word ? 'Word learned! Reels next?' : 'New word of the day in Discover. Wanna learn it?';
}

export default function Home() {
  const g = useGame();
  const router = useRouter();
  const st = stars(g.power), nx = st.next;
  const mood = streakMood(g);
  const done = boardDone(g.day), doneN = done.filter(Boolean).length, all = doneN === 3;
  const [line, setLine] = useState(homeLine(g, g.partner));
  const [burst, setBurst] = useState(0);
  const cutscene = useFx(s => s.cutscene), queue = useFx(s => s.queue);
  const tHero = useTourTarget(), tStreak = useTourTarget(), tQuests = useTourTarget(), tBar = useTourTarget(), tChip = useTourTarget();
  useEffect(() => setLine(homeLine(g, g.partner)), [g.partner, g.day.challenge, g.day.word]);

  const checkin = (e: any) => {
    if (!useGame.getState().checkin()) return;
    haptic.success();
    g.earn(20, { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
    useFx.getState().toast('momo', 'Checked in!', '+1 Standard ticket. See you tomorrow?', 'sparkle');
  };
  const claim = (e: any) => {
    if (!useGame.getState().claimBoard()) return;
    haptic.success();
    g.earn(150, { mult: false, x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
    setBurst(b => b + 1);
    useFx.getState().toast(g.partner, 'Quest board cleared!', '+150 Ōra and a Standard ticket');
  };

  const goal = !nx ? 'Max rank reached' : st.stars < 3 ? `${fmt(st.to - g.power)} to ${RANKS[st.i].name} ${'★'.repeat(st.stars + 1)} · +1 ticket` : `${fmt(nx.min - g.power)} to ${nx.name} · ${BOSSES[nx.boss!].name} awaits`;
  const quests = [
    { id: 'checkin', who: 'momo' as Who, t: 'Check in with Momo', sub: '+20 Ōra · +1 ticket', done: done[0], prog: undefined as number | undefined, go: checkin },
    { id: 'challenge', who: 'puri' as Who, t: 'Play the Daily Challenge', sub: `5 questions · keeps your streak`, done: done[1], go: () => router.push({ pathname: '/quiz', params: { mode: 'daily' } }) },
    { id: 'reels', who: 'taku' as Who, t: 'Finish 2 reels', sub: `${Math.min(2, g.day.reels.length)}/2 · tokens every 5 s`, done: done[2], prog: Math.min(1, g.day.reels.length / 2), go: () => router.push('/reel') },
  ];
  const fest = EVENTS[0], days = daysUntil(FESTIVAL_DAY);
  const pos = leaguePos(g.week.ora, g.week.key);
  const W = Dimensions.get('window').width - 32;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Screen tabs>
        <View ref={tChip.ref} collapsable={false}><TopBar /></View>

        <View ref={tHero.ref} collapsable={false} style={styles.hero}>
          <Deco width={W} height={330} seed="hero" opacity={0.35} />
          <Blob seed={'hero' + g.partner} color={C.heroBlob} size={250} second="#8B6CFF33" style={{ position: 'absolute', right: -30, top: -10 }} />
          <View style={{ height: 196, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <Bubble text={line} style={{ position: 'absolute', left: 0, top: 4, maxWidth: 190 }} />
            <PokeMascot who={g.partner} base={g.partner === 'puri' ? 'idle' : 'wave'} size={196} acc={g.equipped as any ?? (g.partner === 'puri' ? 'headset' : null)} style={{ marginRight: -10, marginBottom: -8 }} onPoke={() => setLine(pickLine(g.partner))} />
          </View>
          <Row between style={{ alignItems: 'flex-end' }}>
            <View>
              <T size={12.5} color={C.heroSoft}>Power · {titleOf(g.power)}</T>
              <Num value={g.power} suffix=" Ōra" style={{ fontFamily: F.display, fontSize: 32, color: C.text }} />
            </View>
            <Btn title="Journey" small kind="lime" onPress={() => router.push('/journey')} right={<Icon name="chev" size={14} c={C.ink} />} />
          </Row>
          <View ref={tBar.ref} collapsable={false}><Bar pct={st.pct} color={C.heroBar} track={C.heroTrack} height={14} delay={200} /></View>
          <Row between><T size={12.5} color={C.heroSoft} style={{ flex: 1 }}>{goal}</T>{streakMult(g.streak.count) > 1 && <Pill color={C.glass} text={C.lime}>{`×${streakMult(g.streak.count)} streak`}</Pill>}</Row>
        </View>

        <Row gap={12} style={{ alignItems: 'stretch' }}>
          <View ref={tStreak.ref} collapsable={false} style={{ flex: 1.25 }}>
            <Press onPress={() => router.push('/streak')} style={[styles.streak, { backgroundColor: mood.bg }]}>
              <Pill color="#FFFFFF" text={C.momo}>{mood.tag}</Pill>
              <Row gap={4} style={{ marginTop: 4 }}><Icon name="flame" size={26} c={C.orange} /><Num value={g.streak.count} style={{ fontFamily: F.display, fontSize: 40, color: mood.fg }} /></Row>
              <T size={12.5} w="black" color={mood.fg} style={{ maxWidth: 96 }}>day streak</T>
              <View style={{ position: 'absolute', right: -14, bottom: 26 }}><Mascot who="momo" state={mood.s} size={104} /></View>
              <Row gap={3} style={{ marginTop: 'auto' }}>
                {Array.from({ length: 7 }, (_, k) => {
                  const d = addDays(dayKey(), k - 6);
                  const kept = g.streak.last != null && g.streak.count > 0 && d <= g.streak.last && d > addDays(g.streak.last, -g.streak.count);
                  return <View key={k} style={[styles.dot, kept && { backgroundColor: C.momo }, k === 6 && { borderWidth: 2, borderColor: '#FFFFFF' }]}><T size={9} w="black" color={kept ? C.ink : C.mute}>{weekdayLetter(d)}</T></View>;
                })}
              </Row>
            </Press>
          </View>
          <Press onPress={() => router.push('/gacha')} style={[styles.tix]}>
            <Over color={C.mute}>Capsule tickets</Over>
            {([['std', 'Standard', C.momo], ['rare', 'Rare+', C.rare], ['legend', 'Legend', C.gold]] as const).map(([k, n, c]) => (
              <Row key={k} gap={8}><CapsuleArt color={c} size={22} /><T size={13} style={{ flex: 1 }}>{n}</T><Num value={g.tickets[k]} style={{ fontFamily: F.display, fontSize: 17, color: C.text }} /></Row>
            ))}
            <View style={styles.go}><T w="black" size={13.5} color={C.ink}>Pull with Momo</T></View>
          </Press>
        </Row>

        <View ref={tQuests.ref} collapsable={false}>
          <Card style={{ gap: 10 }}>
            <Row between><H size={20}>Today’s quests</H><Pill color={all ? C.lime : C.card2} text={all ? C.ink : C.text}>{`${doneN}/3`}</Pill></Row>
            {quests.map(q => (
              <Press key={q.id} onPress={e => (q.done ? null : q.go(e))} style={[styles.quest, q.done && { opacity: 0.7 }]}>
                <View style={[styles.qtile, { backgroundColor: DOMAIN[q.who].fill }]}><MascotStill who={q.who} state={q.done ? 'happy' : 'idle'} size={62} acc={q.who === 'puri' ? 'headset' : null} /></View>
                <View style={{ flex: 1, gap: 3 }}>
                  <T w="black" size={14.5} style={q.done && { textDecorationLine: 'line-through' }}>{q.t}</T>
                  <T size={12.5} color={C.mute}>{q.sub}</T>
                  {q.prog !== undefined && !q.done && <Bar pct={q.prog} height={6} color={C.taku} />}
                </View>
                <View style={[styles.check, q.done && { backgroundColor: C.lime, borderColor: C.lime }]}>{q.done ? <Icon name="check" size={18} c={C.ink} /> : <Icon name="chev" size={16} c={C.mute} />}</View>
              </Press>
            ))}
            {g.day.boardClaimed ? (
              <View style={[styles.chest, { backgroundColor: C.greenSoft }]}><Icon name="chest" size={26} c={C.green} c2="#2C8F5E" /><T w="black" color={C.green}>Chest opened · +150 Ōra and a ticket</T></View>
            ) : (
              <Chest ready={all} pct={doneN / 3} onPress={claim} />
            )}
          </Card>
        </View>

        <Press onPress={() => router.push('/reel')} style={styles.jar}>
          <JarArt count={g.day.jar} size={64} />
          <View style={{ flex: 1, gap: 4 }}>
            <H size={18}>Puri’s watch jar</H>
            <T size={13} color={C.puri}>{g.day.jar} token{g.day.jar === 1 ? '' : 's'} today · every 5 s of a reel drops one (+5 Ōra)</T>
            <Bar pct={g.day.jar / 60} color={C.puri} height={8} />
          </View>
        </Press>

        <Press onPress={() => router.push({ pathname: '/event/[id]', params: { id: fest.id } })} style={styles.event}>
          <EventScene scene="festival" color={fest.color} width={W} height={150} />
          <View style={{ padding: 16, gap: 6 }}>
            <Over color={C.lime}>Ōta TOKYO Delhi · 28–29 Nov</Over>
            <H size={22}>{days > 0 ? `Momo's debut in ${days} days` : days === 0 ? 'Momo debuts today!' : 'Thanks for coming!'}</H>
            <T size={13} color={C.mute}>{fest.place}. Passes from ₹{fest.tiers[0].price}.</T>
          </View>
          <View style={{ position: 'absolute', right: 6, top: 66 }}><Mascot who="momo" state="excited" size={110} /></View>
        </Press>

        <Card onPress={() => router.push('/arena')} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.qtile, { backgroundColor: C.puri, width: 52, height: 52 }]}><MascotStill who="puri" state="gg" size={66} acc="headset" /></View>
          <View style={{ flex: 1 }}>
            <H size={17}>{RANKS[st.i].name} League · #{pos}</H>
            <T size={13} color={C.mute}>{fmt(g.week.ora)} Ōra this week · top 5 move up</T>
          </View>
          <Icon name="chev" size={18} c={C.mute} />
        </Card>
      </Screen>
      {burst > 0 && <Confetti key={burst} seed={burst} />}
      {!g.toured && cutscene == null && queue.length === 0 && (
        <Tour who={g.partner} steps={[
          { t: tChip, text: { momo: 'This is your Ōra wallet! Everything you do earns it.', taku: 'Ōra! オーラ, your aura. Reels, quizzes and cheers pump it up.', puri: 'Ōra = currency. Spending it never lowers your rank.' }[g.partner] },
          { t: tBar, text: { momo: 'Power only goes up. Fill the bar to rank up and fight a boss!', taku: 'Your path to Senpai, 先輩. A boss guards every rank.', puri: 'Rank bar. Next boss is waiting. I tank, you DPS.' }[g.partner] },
          { t: tStreak, text: { momo: 'This is me: your streak! One Daily Challenge a day keeps me lively.', taku: 'Momo keeps your streak. She gets sleepy when it\'s at risk.', puri: 'Momo is the streak counter. Don\'t let her fall asleep.' }[g.partner] },
          { t: tQuests, text: { momo: 'Three quests a day, one from each of us. Clear all for the chest!', taku: 'Daily quests: one from each of us. All three opens the chest.', puri: 'Three dailies. Clear all, loot the chest. Easy.' }[g.partner] },
        ]} onDone={() => useGame.getState().setToured()} />
      )}
    </View>
  );
}

const LINES: Record<Who, string[]> = {
  taku: ['推し means your favourite. Who\'s yours?', 'Front row at every LIVE. Every. One.', 'Glowsticks charged. Wotagei ready!', 'Did you know ダーリン comes from English?'],
  momo: ['You make me feel like a headliner!', 'Sweet, spicy and full of energy!', 'See you in the front row on 28 Nov?', 'Every sticker counts, you know.'],
  puri: ['Fourteen-hour marathon? Warm-up.', 'GG. Next round.', 'Wanna see my Switch? …Don\'t ask where it is.', 'Combo ×5 or bust.'],
};
const pickLine = (w: Who) => LINES[w][Math.floor(Math.random() * LINES[w].length)];

function Chest({ ready, pct, onPress }: { ready: boolean; pct: number; onPress: (e: any) => void }) {
  const wob = useSharedValue(0);
  useEffect(() => { wob.value = ready ? withRepeat(withSequence(withTiming(-8, { duration: 90 }), withTiming(8, { duration: 90 }), withTiming(0, { duration: 90 }), withTiming(0, { duration: 900 })), -1, false) : withTiming(0); }, [ready]);
  const s = useAnimatedStyle((): any => ({ transform: [{ rotate: `${wob.value}deg` }] }));
  return (
    <Press onPress={onPress} disabled={!ready} style={[styles.chest, ready && { backgroundColor: C.lime }]}>
      <Animated.View style={s}><Icon name="chest" size={30} c={ready ? C.oraDeep : C.ora} c2={ready ? C.ora : C.oraDeep} /></Animated.View>
      <View style={{ flex: 1 }}><Bar pct={pct} height={10} color={ready ? C.oraDeep : C.ora} track={ready ? '#FFFFFF88' : C.card2} /></View>
      <T w="black" color={ready ? C.ink : C.mute}>{ready ? 'Open · +150' : '+150 chest'}</T>
    </Press>
  );
}

const styles = themed(() => StyleSheet.create({
  hero: { backgroundColor: C.hero, borderRadius: 32, padding: 18, gap: 10, overflow: 'hidden' },
  streak: { borderRadius: 26, padding: 14, minHeight: 200, overflow: 'hidden', gap: 2 },
  dot: { width: 17, height: 17, borderRadius: 9, backgroundColor: C.glass, alignItems: 'center', justifyContent: 'center' },
  tix: { flex: 1, backgroundColor: C.card, borderRadius: 26, padding: 14, gap: 9 },
  go: { marginTop: 'auto', backgroundColor: C.lime, borderRadius: 999, height: 36, alignItems: 'center', justifyContent: 'center' },
  quest: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card2, borderRadius: 20, padding: 8 },
  qtile: { width: 48, height: 48, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' },
  check: { width: 34, height: 34, borderRadius: 17, borderWidth: 2.5, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  chest: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card2, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 10 },
  jar: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.puriDeep, borderRadius: 26, padding: 14 },
  event: { backgroundColor: C.panel, borderRadius: 28, overflow: 'hidden' },
}));
