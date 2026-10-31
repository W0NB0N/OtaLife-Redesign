// Fan Council: spend daily Cheers on a live poll and on ideas that climb through five stages.
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing, ZoomIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { C, themed } from '@/theme';
import { cheersMax, ideaCount, useGame } from '@/store/game';
import { haptic, useFx } from '@/store/fx';
import { IDEAS, POLL, STAGES, stageOf } from '@/content/catalog';
import { rankIdx } from '@/content/ranks';
import { dayKey, fmt, fmtDay, untilMidnight } from '@/lib/time';
import { Mascot, MState } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { Bar, Btn, Card, H, Over, Pill, Press, Row, T } from '@/ui/kit';
import { BackBar, OraChip, PlayerAvatar, Screen } from '@/ui/game';
import { Confetti } from '@/ui/overlays';

function PollBar({ pct, mine, delay }: { pct: number; mine: boolean; delay: number }) {
  const w = useSharedValue(0);
  useEffect(() => { w.value = withDelay(delay, withTiming(pct, { duration: 900, easing: Easing.out(Easing.cubic) })); }, [pct]);
  const s = useAnimatedStyle((): any => ({ width: `${w.value * 100}%` }));
  return <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: mine ? C.lime : C.takuSoft, borderRadius: 18 }, s]} />;
}

export default function Council() {
  const g = useGame();
  const router = useRouter();
  const max = cheersMax(g.power), left = Math.max(0, max - g.day.cheersUsed);
  const [taku, setTaku] = useState<MState>(left ? 'idle' : 'sleepy');
  const [pick, setPick] = useState<string | null>(null);
  const [staged, setStaged] = useState<string | null>(null);
  const [burst, setBurst] = useState(0);
  const closed = dayKey() > POLL.ends;
  const voted = g.poll;
  const total = POLL.options.reduce((a, o) => a + o.base, 0) + (voted ? 1 : 0);
  const winner = POLL.options.reduce((a, b) => (a.base >= b.base ? a : b));

  const dance = () => { setTaku('wotagei'); setTimeout(() => setTaku(useGame.getState().day.cheersUsed >= cheersMax(useGame.getState().power) ? 'sleepy' : 'idle'), 1500); };
  const vote = (e: any) => {
    if (!pick || !useGame.getState().votePoll(pick)) return;
    haptic.success(); dance();
    g.earn(10, { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
  };
  const cheer = (id: string, e: any) => {
    const r = useGame.getState().cheerIdea(id);
    if (!r.ok) { setTaku('sleepy'); useFx.getState().toast('taku', 'Out of Cheers', `New Cheers in ${untilMidnight()}.`, 'sleepy'); return; }
    haptic.medium(); dance();
    g.earn(10, { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
    if (r.stagedUp) { setStaged(id); setBurst(b => b + 1); haptic.success(); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Screen>
        <BackBar title="Fan Council" sub="Your Cheers decide what Ōta builds" right={<OraChip />} />
        <View style={styles.bar}>
          <View style={{ flex: 1, gap: 8, zIndex: 2 }}>
            <Row gap={5}>{Array.from({ length: max }, (_, k) => <Animated.View key={k} entering={ZoomIn.delay(k * 60)} style={[styles.glow, k >= left && styles.glowOff]} />)}</Row>
            <H size={22}>{left} of {max} Cheers left</H>
            <T size={13} color={C.mute}>{left ? 'Each Cheer earns +10 Ōra. They refill at midnight.' : `Out of Cheers. ${untilMidnight()} until the refill.`}</T>
          </View>
          <Blob seed="council" color={C.heroBlob} size={150} style={{ position: 'absolute', right: -20, top: -20 }} />
          <Mascot who="taku" state={taku} size={124} style={{ marginBottom: -18, marginRight: -8 }} />
        </View>

        <Card style={{ gap: 10 }}>
          <Row between><Over color={C.taku}>{closed ? 'Poll closed' : `Live poll · ends ${fmtDay(POLL.ends)}`}</Over><Pill>{`${fmt(total)} votes`}</Pill></Row>
          <H size={19}>{POLL.q}</H>
          {POLL.options.map((o, k) => {
            const v = o.base + (voted === o.id ? 1 : 0), show = !!voted || closed;
            return (
              <Press key={o.id} disabled={!!voted || closed} haptics={!voted} onPress={() => setPick(o.id)} style={[styles.opt, !show && pick === o.id && { borderColor: C.lime }]}>
                {show && <PollBar pct={v / total} mine={voted === o.id} delay={k * 120} />}
                <View style={[styles.key, voted === o.id && { backgroundColor: C.ink }]}><T w="black" color={voted === o.id ? '#FFFFFF' : C.text}>{'ABC'[k]}</T></View>
                <T w="black" size={15} style={{ flex: 1 }} color={voted === o.id ? C.ink : C.text}>{o.name}{closed && o.id === winner.id ? '  ·  Winner' : ''}</T>
                {show && <T w="black" color={voted === o.id ? C.ink : C.text}>{Math.round((v / total) * 100)}%</T>}
              </Press>
            );
          })}
          {!voted && !closed && <Btn title={pick ? 'Cheer to vote · results unlock' : 'Pick an artist to see results'} disabled={!pick || !left} onPress={vote} />}
          {voted && <T size={13} color={C.mute}>You cheered {POLL.options.find(o => o.id === voted)!.name}. Momo announces the winner on {fmtDay(POLL.ends)}.</T>}
        </Card>

        <Row between style={{ marginTop: 6 }}><H size={20}>Ideas</H><T size={13} color={C.mute}>Closest to the next stage</T></Row>
        {IDEAS.slice().sort((a, b) => { const p = (x: typeof a) => { const n = ideaCount(g, x.id); return n < 100 ? n / 100 : (n - 100) / 400; }; return p(b) - p(a); }).map((d, i) => {
          const n = ideaCount(g, d.id), s = stageOf(n), goal = STAGES[s][1], lo = s === 0 ? 0 : 100;
          return (
            <Animated.View key={d.id} entering={FadeInDown.delay(i * 60).springify()}>
              <Card style={{ gap: 12 }}>
                <Row style={{ alignItems: 'flex-start' }}>
                  <View style={[styles.thumb, { backgroundColor: d.color + '33' }]}><T size={34} w="black">{d.kanji}</T></View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Over color={C.taku}>{d.type} · {STAGES[s][0]}</Over>
                    <T w="black" size={15.5}>{d.title}</T>
                    <Row gap={6}><PlayerAvatar name={d.by} rank={d.rank} size={20} /><T size={12.5} color={C.mute}>{d.by}</T></Row>
                  </View>
                </Row>
                <Row gap={4}>
                  {STAGES.map(([nm], k) => (
                    <View key={nm} style={{ flex: 1, gap: 4 }}>
                      <Bar pct={k < s ? 1 : k === s && goal ? (n - lo) / (goal - lo) : 0} height={7} color={k < s ? C.ora : C.lime} delay={k * 80} />
                      <T size={10} w="black" color={k <= s ? C.text : C.dim}>{nm}</T>
                    </View>
                  ))}
                </Row>
                <Row between>
                  <T w="black" size={13}>{s < 2 ? `${fmt(n)} / ${fmt(goal)} Cheers to ${STAGES[s + 1][0]}` : 'Under review by the Ōta team'}</T>
                  {s < 2 && <Btn small title={g.ideaCheers[d.id] ? `Cheer · ${g.ideaCheers[d.id]}` : 'Cheer'} kind={left ? 'lime' : 'ghost'} disabled={!left} onPress={e => cheer(d.id, e)} />}
                </Row>
                {staged === d.id && <Animated.View entering={ZoomIn.springify()} style={styles.stageup}><T w="black" color={C.ink}>Stage up! It moved to {STAGES[stageOf(n)][0]}. {d.by} gets +200 Ōra and it’s featured in Discover.</T></Animated.View>}
              </Card>
            </Animated.View>
          );
        })}
        {g.myIdeas.map(m => (
          <Card key={m.id} color={C.takuDeep}><Over color={C.taku}>{m.type} · Spark · your idea</Over><T w="black" size={15.5}>{m.title}</T><Bar pct={0.01} height={7} color={C.lime} /><T size={12.5} color={C.mute}>TAKU is checking it for duplicates. It goes live within 24 h.</T></Card>
        ))}
        <Card color={C.takuDeep} style={{ alignItems: 'center' }}>
          <Mascot who="taku" state="think" size={116} />
          <H size={19} center>Have an idea?</H>
          <T center color={C.mute}>Pitch merch, events or guests from Otaku rank.</T>
          <Btn title={rankIdx(g.power) >= 3 ? 'Pitch an idea' : `${fmt(Math.max(0, 10000 - g.power))} Ōra to Otaku`} icon={rankIdx(g.power) >= 3 ? 'plus' : 'lock'} disabled={rankIdx(g.power) < 3} onPress={() => router.push('/idea')} />
        </Card>
      </Screen>
      {burst > 0 && <Confetti key={burst} seed={burst} />}
    </View>
  );
}

const styles = themed(() => StyleSheet.create({
  bar: { backgroundColor: C.panel, borderRadius: 28, padding: 16, flexDirection: 'row', alignItems: 'flex-end', overflow: 'hidden', minHeight: 140 },
  glow: { width: 11, height: 30, borderRadius: 6, backgroundColor: C.lime, borderBottomWidth: 8, borderBottomColor: '#2E2A55' },
  glowOff: { backgroundColor: C.glow },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card2, borderRadius: 18, padding: 8, paddingRight: 14, borderWidth: 2.5, borderColor: 'transparent', overflow: 'hidden' },
  key: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  thumb: { width: 76, height: 76, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  stageup: { backgroundColor: C.lime, borderRadius: 16, padding: 12 },
}));
