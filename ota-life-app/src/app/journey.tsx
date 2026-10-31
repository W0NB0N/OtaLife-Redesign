// Rank journey: a winding path of star nodes; a boss guards each gate between ranks.
import React, { useEffect, useRef } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { C, themed } from '@/theme';
import { useGame } from '@/store/game';
import { useFx } from '@/store/fx';
import { BOSSES, RANKS, rankIdx, titleOf } from '@/content/ranks';
import { fmt } from '@/lib/time';
import { Boss } from '@/art/Boss';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { Btn, Card, H, Over, Pill, Row, T } from '@/ui/kit';
import { Avatar, BackBar, OraChip } from '@/ui/game';

const NODE = 74, GAPY = 104;

function Pulse({ children }: { children: React.ReactNode }) {
  const s = useSharedValue(1);
  useEffect(() => { s.value = withRepeat(withSequence(withTiming(1.08, { duration: 700 }), withTiming(1, { duration: 700 })), -1, false); }, []);
  const st = useAnimatedStyle((): any => ({ transform: [{ scale: s.value }] }));
  return <Animated.View style={st}>{children}</Animated.View>;
}

export default function Journey() {
  const g = useGame();
  const router = useRouter();
  const ins = useSafeAreaInsets();
  const scroll = useRef<any>(null);
  const W = Dimensions.get('window').width - 32;
  const p = g.power, cur = rankIdx(p);
  const xs = (k: number) => W / 2 + Math.sin(k * 1.3) * (W * 0.26);
  let n = 0;

  return (
    <ScrollView ref={scroll} style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: ins.top + 10, paddingHorizontal: 16, paddingBottom: ins.bottom + 40, gap: 12 }} showsVerticalScrollIndicator={false}>
      <BackBar title="Rank journey" sub={`${titleOf(p)} · ${fmt(p)} Power`} right={<OraChip />} />
      {RANKS.map((r, i) => {
        const nx = RANKS[i + 1];
        const done = p >= r.min, here = cur === i;
        const nodes = nx ? [0, 1, 2].map(s => {
          const step = (nx.min - r.min) / 3, at = r.min + step * s, to = s < 2 ? r.min + step * (s + 1) : nx.min;
          return { s, at, to, state: p >= to ? 'done' : p >= at ? 'now' : 'lock', x: xs(n++) };
        }) : [];
        const path = nodes.map((nd, k) => `${k ? 'L' : 'M'}${nd.x} ${k * GAPY + NODE / 2}`).join(' ');
        return (
          <View key={r.id} style={{ gap: 12 }}>
            {i > 0 && (
              <Animated.View entering={FadeInDown.springify()} style={[styles.gate, { backgroundColor: done ? C.card : C.panel }]}>
                <Blob seed={'gate' + r.id} color={done ? C.card2 : BOSSES[r.boss!].color + '33'} size={170} spin={!done} style={{ position: 'absolute', left: -10, top: -10 }} />
                <Boss id={r.boss!} size={130} beaten={g.beaten.includes(r.boss!) || done} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Over color={done ? C.green : C.red}>{done ? 'Defeated' : `Gate boss · ${fmt(r.min)} Power`}</Over>
                  <H size={18}>{BOSSES[r.boss!].name}</H>
                  <T size={12.5} color={C.mute}>“{BOSSES[r.boss!].line}”</T>
                  {done && <Btn small kind="ghost" title="Replay fight" onPress={() => useFx.getState().setCutscene(i)} style={{ alignSelf: 'flex-start', marginTop: 4 }} />}
                </View>
              </Animated.View>
            )}
            <View style={[styles.head, { backgroundColor: here ? C.lime : done ? C.card : C.panel }]}>
              <Avatar size={46} power={r.min} />
              <View style={{ flex: 1 }}>
                <H size={20} color={here ? C.onLime : C.text}>{r.name}</H>
                <T size={12.5} color={here ? C.onLime : C.mute}>{r.en} · from {fmt(r.min)} Power</T>
              </View>
              {done ? <Pill color={here ? C.ink : C.ora} text="#FFFFFF">{here ? 'You are here' : 'Done'}</Pill> : <Icon name="lock" size={22} c={C.dim} />}
            </View>
            {nx && (
              <View style={{ height: GAPY * 2 + NODE + 10, marginTop: 26 }}>
                <Svg width={W} height={GAPY * 2 + NODE} style={StyleSheet.absoluteFill}>
                  <Path d={path} stroke={C.card2} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <Path d={path} stroke={done ? C.ora : C.card2} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={done ? undefined : '2 14'} />
                </Svg>
                {nodes.map((nd, k) => {
                  const body = (
                    <View style={[styles.node, nd.state === 'done' && { backgroundColor: C.ora, borderBottomColor: C.oraDeep }, nd.state === 'now' && { backgroundColor: C.lime, borderBottomColor: C.limeDeep }]}>
                      {nd.state === 'lock' ? <Icon name="lock" size={22} c={C.dim} /> : <Row gap={0}>{Array.from({ length: k + 1 }, (_, j) => <Icon key={j} name="star" size={16} c={nd.state === 'now' ? C.onLime : '#FFFFFF'} />)}</Row>}
                    </View>
                  );
                  return (
                    <View key={k} onLayout={nd.state === 'now' ? e => { const y = e.nativeEvent.layout.y; setTimeout(() => scroll.current?.scrollTo({ y: Math.max(0, y - 120), animated: true }), 600); } : undefined}
                      style={{ position: 'absolute', top: k * GAPY, left: nd.x - NODE / 2, alignItems: 'center' }}>
                      {nd.state === 'now' && (
                        <View style={styles.you}><T size={11} w="black" color={C.onLime}>You · {fmt(nd.to - p)} to go</T></View>
                      )}
                      {nd.state === 'now' ? <Pulse>{body}</Pulse> : body}
                      <View style={styles.reward}><Icon name="ticket" size={13} c={nd.state === 'done' ? C.mute : C.momo} /><T size={10.5} w="black" color={nd.state === 'done' ? C.mute : C.text}>{k < 2 ? '+1 ticket' : 'Boss'}</T></View>
                    </View>
                  );
                })}
              </View>
            )}
            {here && nx && (
              <Card color={C.violetSoft}>
                <H size={17}>{nx.name} unlocks</H>
                {nx.perks.map(x => <Row key={x} gap={8}><Icon name="check" size={14} c={C.lime} /><T size={13.5}>{x}</T></Row>)}
                <Btn small title="Earn Ōra now" icon="bolt" onPress={() => router.push(g.day.challenge ? '/reel' : { pathname: '/quiz', params: { mode: 'daily' } })} />
              </Card>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = themed(() => StyleSheet.create({
  gate: { borderRadius: 26, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, overflow: 'hidden' },
  head: { borderRadius: 24, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  node: { width: NODE, height: NODE - 8, borderRadius: NODE / 2, backgroundColor: C.card2, borderBottomWidth: 7, borderBottomColor: C.line, alignItems: 'center', justifyContent: 'center' },
  you: { position: 'absolute', top: -30, backgroundColor: C.lime, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, zIndex: 3, width: 140, alignItems: 'center' },
  reward: { flexDirection: 'row', gap: 3, alignItems: 'center', marginTop: 3 },
}));
