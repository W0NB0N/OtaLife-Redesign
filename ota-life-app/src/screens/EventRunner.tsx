// Plays queued progression events when the player isn't mid-task:
// star-ups become a partner toast, rank-ups become the boss fight cutscene.
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, Who, themed } from '@/theme';
import { haptic, useFx } from '@/store/fx';
import { useGame } from '@/store/game';
import { BOSSES, RANKS } from '@/content/ranks';
import { Boss } from '@/art/Boss';
import { Blob } from '@/art/Blob';
import { Mascot } from '@/mascots/Mascot';
import { Btn, Card, H, Over, Press, T } from '@/ui/kit';
import { Avatar } from '@/ui/game';
import { Confetti, Rays } from '@/ui/overlays';

export function EventRunner() {
  const queue = useFx(s => s.queue), busy = useFx(s => s.busy), cut = useFx(s => s.cutscene);
  const partner = useGame(s => s.partner);
  useEffect(() => {
    if (!queue.length || busy > 0 || cut != null) return;
    const id = setTimeout(() => {
      const fx = useFx.getState();
      if (fx.busy > 0 || fx.cutscene != null) return;
      const e = fx.shift();
      if (!e) return;
      if (e.type === 'star') { haptic.success(); fx.toast(partner, `Star up! ${e.title}`, '+1 Standard capsule ticket'); }
      else fx.setCutscene(e.idx);
    }, 700);
    return () => clearTimeout(id);
  }, [queue.length, busy, cut]);
  return cut != null ? <Cutscene idx={cut} /> : null;
}

type Beat = 'overload' | 'boss' | 'team' | 'beam' | 'poof' | 'spoils';

function Cutscene({ idx }: { idx: number }) {
  const r = RANKS[idx], boss = BOSSES[r.boss!];
  const g = useGame();
  const motion = g.settings.motion;
  const ins = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  const [beat, setBeat] = useState<Beat>(motion ? 'overload' : 'spoils');
  const timers = useRef<any[]>([]);
  const others = (['taku', 'puri', 'momo'] as Who[]).filter(w => w !== g.partner);
  const fresh = useRef(!useGame.getState().beaten.includes(r.boss!)).current; // replays from the journey grant nothing

  useEffect(() => {
    if (!motion) return;
    const seq: [Beat, number][] = [['boss', 1300], ['team', 3000], ['beam', 4600], ['poof', 5500], ['spoils', 6600]];
    seq.forEach(([b, t]) => timers.current.push(setTimeout(() => { setBeat(b); haptic.medium(); }, t)));
    haptic.heavy();
    return () => timers.current.forEach(clearTimeout);
  }, []);
  useEffect(() => {
    if (beat === 'spoils') {
      haptic.success();
      // idempotent: only the first win against this boss pays out
      if (fresh) useGame.setState(s => (s.beaten.includes(r.boss!) ? {} : { beaten: [...s.beaten, r.boss!], tickets: { ...s.tickets, rare: s.tickets.rare + 1, legend: s.tickets.legend + (idx >= 4 ? 1 : 0) } }));
    }
  }, [beat]);
  const skip = () => { timers.current.forEach(clearTimeout); setBeat('spoils'); };
  const done = () => useFx.getState().setCutscene(null);

  // shared values for the fight
  const shake = useSharedValue(0), bossY = useSharedValue(-500), bossS = useSharedValue(1), bossO = useSharedValue(1), teamX = useSharedValue(-220), partnerY = useSharedValue(300), beamH = useSharedValue(0);
  useEffect(() => {
    if (beat === 'overload') shake.value = withRepeat(withSequence(withTiming(-6, { duration: 50 }), withTiming(6, { duration: 50 })), 10, true);
    if (beat === 'boss') { shake.value = withTiming(0); bossY.value = withSpring(0, { damping: 9, stiffness: 120 }); }
    if (beat === 'team') { teamX.value = withSpring(0, { damping: 12 }); bossS.value = withDelay(500, withRepeat(withSequence(withTiming(0.92, { duration: 90 }), withTiming(1, { duration: 90 })), 4, false)); }
    if (beat === 'beam') { partnerY.value = withSpring(0, { damping: 12 }); beamH.value = withDelay(350, withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })); }
    if (beat === 'poof') { beamH.value = withTiming(0, { duration: 300 }); bossS.value = withTiming(1.6, { duration: 600 }); bossO.value = withTiming(0, { duration: 600 }); }
  }, [beat]);
  const sShake = useAnimatedStyle((): any => ({ transform: [{ translateX: shake.value }] }));
  const sBoss = useAnimatedStyle((): any => ({ opacity: bossO.value, transform: [{ translateY: bossY.value }, { scale: bossS.value }] }));
  const sL = useAnimatedStyle((): any => ({ transform: [{ translateX: teamX.value }] }));
  const sR = useAnimatedStyle((): any => ({ transform: [{ translateX: -teamX.value }] }));
  const sP = useAnimatedStyle((): any => ({ transform: [{ translateY: partnerY.value }] }));
  const sBeam = useAnimatedStyle((): any => ({ height: beamH.value * height * 0.36, opacity: beamH.value > 0 ? 1 : 0 }));

  return (
    <Modal transparent visible animationType="fade" statusBarTranslucent navigationBarTranslucent onRequestClose={beat === 'spoils' ? done : skip}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#0A0720' }, sShake]}>
        {beat !== 'spoils' && (
          <Press onPress={skip} style={[styles.skip, { top: ins.top + 12 }]}><T w="black" size={14} color="#FFFFFF">Skip</T></Press>
        )}
        {beat === 'overload' && (
          <View style={styles.center}>
            <Animated.Text entering={ZoomIn.springify().damping(10)} style={styles.overload}>ŌRA{'\n'}OVERLOAD</Animated.Text>
            <View style={{ width: width - 60, height: 22, borderRadius: 11, backgroundColor: C.card2, overflow: 'hidden', marginTop: 24 }}>
              <Animated.View entering={FadeIn} style={{ flex: 1, backgroundColor: C.lime }} />
            </View>
          </View>
        )}
        {beat !== 'overload' && beat !== 'spoils' && (
          <>
            <Animated.View style={[{ position: 'absolute', top: height * 0.1, alignSelf: 'center', alignItems: 'center' }, sBoss]}>
              <Blob seed={r.boss!} color={boss.color + '33'} size={260} style={{ position: 'absolute', top: -20 }} />
              <Boss id={r.boss!} size={230} />
              <View style={styles.nameCard}><T w="black" size={20} color="#FFFFFF">{boss.name.toUpperCase()}</T></View>
              <T size={14} color="#ABA5D9" style={{ marginTop: 8 }}>“{boss.line}”</T>
            </Animated.View>
            <Animated.View style={[{ position: 'absolute', left: 0, bottom: height * 0.12 }, sL]}><Mascot who={others[0]} state="charge" size={140} /></Animated.View>
            <Animated.View style={[{ position: 'absolute', right: 0, bottom: height * 0.12 }, sR]}><Mascot who={others[1]} state="charge" size={140} flip /></Animated.View>
            <Animated.View style={[{ position: 'absolute', alignSelf: 'center', bottom: height * 0.06 }, sP]}><Mascot who={g.partner} state={beat === 'poof' ? 'cheer' : 'charge'} size={160} /></Animated.View>
            <Animated.View style={[styles.beam, { bottom: height * 0.06 + 140 }, sBeam]} />
            {beat === 'poof' && <Confetti count={30} seed={1} colors={['#FFFFFF', boss.color, C.lime]} />}
          </>
        )}
        {beat === 'spoils' && (
          <View style={[styles.center, { paddingHorizontal: 20, gap: 14 }]}>
            <Rays color={RANKS[idx].frame} size={width * 1.6} />
            <Animated.View entering={ZoomIn.springify().damping(9)}><Avatar size={110} power={r.min} /></Animated.View>
            <Over color={C.lime}>{fresh ? 'Rank up' : 'Replay'} · {boss.name} defeated</Over>
            <H size={36} center color="#FFFFFF">You’re {r.name}!</H>
            <Card style={{ width: '100%', maxWidth: 360 }} color="#FFFFFF">
              <T w="black" color={C.ink} size={16}>New perks</T>
              {r.perks.map(p => <T key={p} color={C.ink}>• {p}</T>)}
              {fresh && <T w="black" color={C.oraDeep}>• +1 Rare+ capsule ticket{idx >= 4 ? ' and a Legend ticket' : ''}</T>}
            </Card>
            <Btn title="Continue" onPress={done} style={{ width: '100%', maxWidth: 360 }} />
            <Confetti count={46} seed={2} />
          </View>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = themed(() => StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overload: { fontFamily: 'Fredoka_700Bold', fontSize: 52, lineHeight: 56, color: C.lime, textAlign: 'center' },
  skip: { position: 'absolute', right: 16, zIndex: 5, backgroundColor: C.card2, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
  nameCard: { backgroundColor: C.red, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 8, transform: [{ rotate: '-3deg' }], marginTop: -6 },
  beam: { position: 'absolute', alignSelf: 'center', width: 56, borderRadius: 28, backgroundColor: C.lime, borderWidth: 8, borderColor: '#F3FFC8' },
}));
