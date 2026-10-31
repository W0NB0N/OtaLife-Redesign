// Game-aware UI: Ōra chip, avatar with rank frame, top bar, screen scaffold, slider.
import React, { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, ScrollView, ScrollViewProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { C, F, R, Who, themed } from '@/theme';
import { useGame } from '@/store/game';
import { useFx } from '@/store/fx';
import { RANKS, rankIdx, stars, titleOf } from '@/content/ranks';
import { H, Num, Press, Row, T } from './kit';
import { Icon } from '@/art/Icon';
import { MascotStill } from '@/mascots/Mascot';
import { greeting } from '@/lib/time';

/** back when there is history, otherwise home (deep links, reloads) */
export const goBack = (router: { canGoBack: () => boolean; back: () => void; replace: (h: any) => void }) => (router.canGoBack() ? router.back() : router.replace('/'));

export function OraChip({ track = true }: { track?: boolean }) {
  const wallet = useGame(s => s.wallet), power = useGame(s => s.power);
  const setChip = useFx(s => s.setChip);
  const ref = useRef<any>(null);
  const router = useRouter();
  const bump = useSharedValue(1);
  const prev = useRef(wallet);
  useEffect(() => {
    if (wallet > prev.current) bump.value = withSequence(withTiming(1, { duration: 650 }), withSpring(1.18, { damping: 6, stiffness: 400 }), withSpring(1));
    prev.current = wallet;
  }, [wallet]);
  const s = useAnimatedStyle((): any => ({ transform: [{ scale: bump.value }] }));
  const measure = () => { if (track) ref.current?.measureInWindow((x, y, w, h) => { if (w) setChip({ x: x + 18, y: y + h / 2 }); }); };
  useEffect(() => { const id = setTimeout(measure, 400); return () => clearTimeout(id); });
  const st = stars(power), Cc = 2 * Math.PI * 13;
  return (
    <Press onPress={() => router.push('/wallet')}>
      <Animated.View ref={ref as any} onLayout={measure} style={[styles.ora, s]}>
        <View style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={32} height={32} style={StyleSheet.absoluteFill}>
            <Circle cx={16} cy={16} r={13} stroke={C.card2} strokeWidth={3.4} fill="none" />
            <Circle cx={16} cy={16} r={13} stroke={C.lime} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeDasharray={`${Cc}`} strokeDashoffset={Cc * (1 - st.pct)} transform="rotate(-90 16 16)" />
          </Svg>
          <Icon name="gem" size={22} c={C.ora} />
        </View>
        <Num value={wallet} style={{ fontFamily: F.display, fontSize: 17, color: C.text }} />
      </Animated.View>
    </Press>
  );
}

const MASCOT_BG = (w: Who) => ({ taku: C.taku, momo: C.momo, puri: C.puri })[w];
export function Avatar({ size = 44, who, power, acc }: { size?: number; who?: Who; power?: number; acc?: any }) {
  const g = useGame();
  const w = who || g.partner, p = power ?? g.power, a = acc === undefined ? g.equipped : acc;
  const r = RANKS[rankIdx(p)];
  const ring = Math.max(3, size * 0.07);
  return (
    <View style={{ width: size + ring * 2, height: size + ring * 2, borderRadius: size, padding: ring, backgroundColor: r.frame }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: MASCOT_BG(w), overflow: 'hidden', alignItems: 'center' }}>
        <View style={{ marginTop: -size * 0.02 }}><MascotStill who={w} size={size * 1.25} acc={a} /></View>
      </View>
      {rankIdx(p) >= 1 && <View style={{ position: 'absolute', right: -2, top: -2, backgroundColor: C.bg, borderRadius: 10, padding: 2 }}><Icon name="star" size={size * 0.26} c={r.frame} /></View>}
    </View>
  );
}

/** an initials avatar for other players, framed by their rank */
export function PlayerAvatar({ name, rank, size = 36 }: { name: string; rank: number; size?: number }) {
  const r = RANKS[Math.min(rank, RANKS.length - 1)];
  const ini = name.split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase();
  const hue = ['#4FC3F7', '#FF5C9A', '#FFC93C', '#A77BFF', '#3DDC97', '#FF9F43'][name.length % 6];
  return (
    <View style={{ width: size + 6, height: size + 6, borderRadius: size, padding: 3, backgroundColor: r.frame }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: hue, alignItems: 'center', justifyContent: 'center' }}>
        <T size={size * 0.36} w="black" color={C.ink}>{ini}</T>
      </View>
    </View>
  );
}

export function TopBar({ title }: { title?: string }) {
  const g = useGame();
  const router = useRouter();
  return (
    <Row gap={10}>
      <Press onPress={() => router.push('/(tabs)/me')}><Avatar size={40} /></Press>
      <View style={{ flex: 1 }}>
        <H size={18} numberOfLines={1}>{title || `${greeting()}, ${g.name}`}</H>
        <T size={12.5} color={C.mute}>{titleOf(g.power)}</T>
      </View>
      <OraChip />
      <Press onPress={() => router.push('/inbox')} style={styles.round}><Icon name="inbox" size={22} c={C.text} /></Press>
    </Row>
  );
}

export function BackBar({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  const router = useRouter();
  return (
    <Row gap={10}>
      <Press onPress={() => goBack(router)} style={styles.round} accessibilityLabel="Back"><Icon name="back" size={20} /></Press>
      <View style={{ flex: 1 }}>
        <H size={19} numberOfLines={1}>{title}</H>
        {sub ? <T size={12.5} color={C.mute} numberOfLines={1}>{sub}</T> : null}
      </View>
      {right}
    </Row>
  );
}

/** screen scaffold: safe-area padding, room for the floating tab bar, staggered entrance */
export function Screen({ children, tabs, style, ...p }: ScrollViewProps & { children: React.ReactNode; tabs?: boolean; style?: StyleProp<ViewStyle> }) {
  const ins = useSafeAreaInsets();
  return (
    <ScrollView
      {...p}
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={[{ paddingTop: ins.top + 10, paddingHorizontal: 16, paddingBottom: (tabs ? 110 : 40) + ins.bottom, gap: 14 }, style]}
      showsVerticalScrollIndicator={false}
    >
      {React.Children.map(children, (c, i) => c ? <Animated.View entering={FadeInDown.delay(Math.min(i, 6) * 45).duration(320)}>{c}</Animated.View> : null)}
    </ScrollView>
  );
}

/** horizontal slider built on PanResponder; works on Android and web */
export function Slider({ value, max, step = 10, onChange, color = C.ora }: { value: number; max: number; step?: number; onChange: (v: number) => void; color?: string }) {
  const [w, setW] = useState(1);
  const start = useRef(0);
  const pct = max > 0 ? value / max : 0;
  const knob = useSharedValue(1);
  const kStyle = useAnimatedStyle((): any => ({ transform: [{ scale: knob.value }] }));
  const setFromX = (x: number) => { const v = Math.round(((Math.max(0, Math.min(w, x)) / w) * max) / step) * step; onChange(Math.min(max, v)); };
  const pr = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: e => { knob.value = withSpring(1.25); start.current = e.nativeEvent.locationX; setFromXRef.current(e.nativeEvent.locationX); },
    onPanResponderMove: (_, g) => setFromXRef.current(start.current + g.dx),
    onPanResponderRelease: () => { knob.value = withSpring(1); },
  })).current;
  const setFromXRef = useRef(setFromX); setFromXRef.current = setFromX;
  return (
    <View onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)} style={{ height: 36, justifyContent: 'center' }} {...pr.panHandlers}>
      <View pointerEvents="none" style={{ height: 10, borderRadius: 5, backgroundColor: C.card2 }}>
        <View style={{ width: `${pct * 100}%`, height: 10, borderRadius: 5, backgroundColor: color }} />
      </View>
      <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: pct * w - 14, width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 6, borderColor: color }, kStyle]} />
    </View>
  );
}

export function Stat({ value, label, color = C.text, icon }: { value: number | string; label: string; color?: string; icon?: any }) {
  return (
    <View style={{ flex: 1, backgroundColor: C.card2, borderRadius: 18, paddingVertical: 10, alignItems: 'center', gap: 2 }}>
      {icon}
      {typeof value === 'number' ? <Num value={value} style={{ fontFamily: F.display, fontSize: 20, color }} /> : <H size={20} color={color}>{value}</H>}
      <T size={11.5} color={C.mute}>{label}</T>
    </View>
  );
}

const styles = themed(() => StyleSheet.create({
  ora: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.card, borderRadius: R.pill, paddingLeft: 4, paddingRight: 13, height: 40 },
  round: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
}));
