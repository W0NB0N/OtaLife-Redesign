// Reel player: illustrated story slides, 5 s each. Every finished slide drops a Puri token
// into the jar (+5 Ōra, 60 a day). Pauses when you hold the screen or leave the app.
import React, { useEffect, useRef, useState } from 'react';
import { AppState, Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, FadeIn, FadeInDown, runOnJS, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming, ZoomIn } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F, themed } from '@/theme';
import { REELS, reelColors } from '@/content/catalog';
import { useGame } from '@/store/game';
import { haptic, useFx } from '@/store/fx';
import { Mascot } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { JarArt, TokenArt } from '@/art/Machine';
import { H, Pill, Press, Row, T } from '@/ui/kit';
import { OraChip, goBack } from '@/ui/game';
import { ReactBar } from '@/screens/PostCard';

const SLIDE_MS = 5000;

function SlideBar({ state, run, onDone, paused }: { state: 'past' | 'now' | 'next'; run: number; onDone: () => void; paused: boolean }) {
  const w = useSharedValue(state === 'past' ? 1 : 0);
  const startAt = useRef(0), acc = useRef(0);
  useEffect(() => { cancelAnimation(w); w.value = state === 'past' ? 1 : 0; acc.current = 0; }, [state, run]);
  useEffect(() => {
    if (state !== 'now') return;
    if (paused) { cancelAnimation(w); acc.current = w.value * SLIDE_MS; return; }
    const remain = SLIDE_MS - acc.current;
    w.value = withTiming(1, { duration: Math.max(0, remain), easing: Easing.linear }, f => { if (f) runOnJS(onDone)(); });
  }, [state, paused, run]);
  const s = useAnimatedStyle((): any => ({ width: `${w.value * 100}%` }));
  return <View style={styles.seg}><Animated.View style={[{ height: '100%', backgroundColor: C.dark ? '#FFFFFF' : C.lime, borderRadius: 2 }, s]} /></View>;
}

export default function Reel() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const ins = useSafeAreaInsets();
  const g = useGame();
  const setBusy = useFx(s => s.setBusy);
  const [ri, setRi] = useState(Math.max(0, REELS.findIndex(r => r.id === id)));
  const [si, setSi] = useState(0);
  const [paused, setPaused] = useState(false);
  const [drops, setDrops] = useState<number[]>([]);
  const [run, setRun] = useState(0);
  const r = REELS[ri], slide = r.slides[si];
  const rc = reelColors(r, C.dark);
  const { width, height } = Dimensions.get('window');
  const jarRef = useRef<any>(null);

  useEffect(() => { setBusy(true); return () => setBusy(false); }, []);
  useEffect(() => {
    const sub = AppState.addEventListener('change', s => setPaused(s !== 'active'));
    return () => sub.remove();
  }, []);

  const finishedSlide = () => {
    // a full 5 s watched: one Puri token into the jar
    if (useGame.getState().reelToken()) {
      setDrops(d => [...d, Date.now()]);
      setTimeout(() => { haptic.tap(); jarRef.current?.measureInWindow((x: number, y: number, w: number) => useGame.getState().earn(5, { mult: false, x: x + w / 2, y })); }, 650);
    }
    if (si < r.slides.length - 1) { setSi(si + 1); setRun(x => x + 1); }
    else {
      useGame.getState().reelDone(r.id);
      if (ri < REELS.length - 1) {
        useFx.getState().toast('taku', 'Reel finished!', `Quest: ${Math.min(2, useGame.getState().day.reels.length)}/2 reels today`, 'happy');
        setRi(ri + 1); setSi(0); setRun(x => x + 1);
      } else goBack(router);
    }
  };
  const go = (dir: 1 | -1) => {
    haptic.tap();
    if (dir > 0) { if (si < r.slides.length - 1) setSi(si + 1); else if (ri < REELS.length - 1) { setRi(ri + 1); setSi(0); } else return goBack(router); }
    else { if (si > 0) setSi(si - 1); else if (ri > 0) { setRi(ri - 1); setSi(0); } }
    setRun(x => x + 1);
  };
  const jar = g.day.jar, full = jar >= 60;

  return (
    <View style={{ flex: 1, backgroundColor: rc.bg }}>
      <Animated.View key={r.id + si} entering={FadeIn.duration(350)} style={StyleSheet.absoluteFill}>
        <Blob seed={r.id + si} color={r.accent + '40'} size={width * 1.1} second="#FFFFFF14" style={{ position: 'absolute', right: -width * 0.35, top: height * 0.12 }} />
        <Blob seed={r.id + 'b' + si} color="#00000026" size={width * 0.8} spin={false} style={{ position: 'absolute', left: -width * 0.3, bottom: height * 0.1 }} />
        <View style={{ position: 'absolute', left: 22, right: 22, top: height * 0.24 }}>
          <Animated.Text entering={ZoomIn.springify().damping(12)} style={{ fontFamily: F.display, fontSize: slide.big.length > 4 ? 58 : 92, lineHeight: slide.big.length > 4 ? 66 : 100, color: rc.fg }}>{slide.big}</Animated.Text>
          <Animated.View entering={FadeInDown.delay(150)}><Pill color={r.accent} text={C.ink}>{slide.small}</Pill></Animated.View>
          <Animated.View entering={FadeInDown.delay(300)} style={{ marginTop: 18 }}><H size={24} color={rc.fg}>{slide.caption}</H></Animated.View>
        </View>
      </Animated.View>

      <Pressable style={StyleSheet.absoluteFill} onPressIn={() => setPaused(true)} onPressOut={() => setPaused(false)} onPress={e => go(e.nativeEvent.locationX < width * 0.33 ? -1 : 1)} accessibilityLabel="Tap for next slide, hold to pause" />

      <View style={[styles.top, { paddingTop: ins.top + 8 }]} pointerEvents="box-none">
        <Row gap={4}>{r.slides.map((_, k) => <SlideBar key={r.id + k} state={k < si ? 'past' : k === si ? 'now' : 'next'} run={run} paused={paused} onDone={finishedSlide} />)}</Row>
        <Row between style={{ marginTop: 10 }} >
          <Press onPress={() => goBack(router)} style={styles.round} accessibilityLabel="Close"><Icon name="close" size={18} /></Press>
          <View style={{ flex: 1, marginLeft: 10 }}><T w="black" color={rc.fg} numberOfLines={1}>{r.title}</T><T size={12} color={rc.sub}>{r.by} · {r.cat}</T></View>
          <OraChip />
        </Row>
      </View>

      <View style={[styles.jarBox, { top: ins.top + 110 }]} pointerEvents="none">
        <View ref={jarRef} collapsable={false}><JarArt count={jar} size={58} /></View>
        <Pill color={full ? C.card2 : C.puri} text={full ? C.mute : C.ink}>{full ? 'Jar full today' : `${jar}/60`}</Pill>
        {drops.slice(-3).map(d => <Drop key={d} />)}
      </View>

      <View style={[styles.bottom, { paddingBottom: ins.bottom + 14 }]} pointerEvents="box-none">
        <Row style={{ alignItems: 'flex-end' }} gap={6} >
          <Mascot who={r.host} state={paused ? 'idle' : 'talk'} size={96} />
          <View style={styles.bubble}><T size={13.5} w="black" color={C.ink}>{paused ? 'Paused. Let go to keep watching.' : full ? 'Jar\'s full for today. Watching still counts for the quest!' : 'Every 5 seconds drops a Puri token into the jar.'}</T></View>
        </Row>
        <ReactBar id={r.id} base={{ taku: 120 + ri * 13, momo: 88 + ri * 7, puri: 40 + ri * 11 }} big />
      </View>
    </View>
  );
}

function Drop() {
  const y = useSharedValue(-70), o = useSharedValue(1), rot = useSharedValue(-40);
  useEffect(() => {
    y.value = withTiming(14, { duration: 600, easing: Easing.in(Easing.quad) });
    rot.value = withTiming(0, { duration: 600 });
    o.value = withSequence(withTiming(1, { duration: 600 }), withTiming(0, { duration: 200 }));
  }, []);
  const s = useAnimatedStyle((): any => ({ opacity: o.value, transform: [{ translateY: y.value }, { rotate: `${rot.value}deg` }] }));
  return <Animated.View style={[{ position: 'absolute', top: 10, left: 17 }, s]}><TokenArt size={26} /></Animated.View>;
}

const styles = themed(() => StyleSheet.create({
  top: { position: 'absolute', left: 0, right: 0, top: 0, paddingHorizontal: 14 },
  seg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: C.dark ? '#FFFFFF44' : '#2B234022', overflow: 'hidden' },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00000044', alignItems: 'center', justifyContent: 'center' },
  jarBox: { position: 'absolute', right: 14, alignItems: 'center', gap: 4 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 14, gap: 12 },
  bubble: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, borderBottomLeftRadius: 6, padding: 12, marginBottom: 14 },
}));
