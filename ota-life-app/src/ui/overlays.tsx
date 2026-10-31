// Overlays: bottom sheet, reward floats that fly into the Ōra chip, toasts, confetti, light rays.
import React, { useEffect, useMemo, useState } from 'react';
import { BackHandler, Dimensions, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, runOnJS, SlideInUp, SlideOutUp, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming, cancelAnimation } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { C, F, R, themed } from '@/theme';
import { useFx } from '@/store/fx';
import { useGame } from '@/store/game';
import { H, T, Press, Row } from './kit';
import { Icon } from '@/art/Icon';
import { MascotStill } from '@/mascots/Mascot';

/* ---------- bottom sheet ---------- */
export function Sheet({ visible, onClose, title, children, scroll = true }: { visible: boolean; onClose: () => void; title?: string; children: React.ReactNode; scroll?: boolean }) {
  const ins = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const y = useSharedValue(1);
  useEffect(() => {
    if (visible) { setMounted(true); y.value = withTiming(0, { duration: 420, easing: Easing.out(Easing.back(1.1)) }); }
    else if (mounted) y.value = withTiming(1, { duration: 240, easing: Easing.in(Easing.quad) }, done => { if (done) runOnJS(setMounted)(false); });
  }, [visible]);
  const sSheet = useAnimatedStyle((): any => ({ transform: [{ translateY: y.value * 700 }] }));
  const sScrim = useAnimatedStyle((): any => ({ opacity: 1 - y.value }));
  if (!mounted) return null;
  const Body = scroll ? ScrollView : View;
  return (
    <Modal transparent visible statusBarTranslucent navigationBarTranslucent onRequestClose={onClose} animationType="none">
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: C.scrim }, sScrim]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
      </Animated.View>
      <Animated.View style={[st.sheet, { paddingBottom: ins.bottom + 16, maxHeight: Dimensions.get('window').height * 0.9 }, sSheet]}>
        <View style={st.grab} />
        {title ? (
          <Row between style={{ paddingHorizontal: 18, paddingBottom: 6 }}>
            <H size={22} style={{ flex: 1 }}>{title}</H>
            <Press onPress={onClose} style={st.close}><Icon name="close" size={18} /></Press>
          </Row>
        ) : null}
        <Body contentContainerStyle={scroll ? { paddingHorizontal: 18, gap: 12, paddingBottom: 8 } : undefined} style={!scroll ? { paddingHorizontal: 18, gap: 12 } : undefined} showsVerticalScrollIndicator={false}>
          {children}
        </Body>
      </Animated.View>
    </Modal>
  );
}

/* ---------- floats: "+30" rises, sparkles fly to the Ōra chip ---------- */
function FloatItem({ id, x, y, text, color }: { id: number; x: number; y: number; text: string; color?: string }) {
  const drop = useFx(s => s.dropFloat);
  const chip = useFx.getState().chip;
  const t = useSharedValue(0), f = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) }, d => { if (d) runOnJS(drop)(id); });
    f.value = withDelay(250, withTiming(1, { duration: 650, easing: Easing.in(Easing.cubic) }));
  }, []);
  const sText = useAnimatedStyle((): any => ({ opacity: t.value < 0.15 ? t.value / 0.15 : 1 - Math.max(0, t.value - 0.6) / 0.4, transform: [{ translateY: -t.value * 46 }, { scale: 0.8 + Math.min(1, t.value * 4) * 0.3 }] }));
  const dx = chip ? chip.x - x : 0, dy = chip ? chip.y - y : 0;
  const sFly = useAnimatedStyle((): any => ({ opacity: chip ? (f.value < 0.95 ? 1 : 0) : 0, transform: [{ translateX: dx * f.value }, { translateY: dy * f.value - Math.sin(f.value * Math.PI) * 60 }, { scale: 1 - f.value * 0.4 }] }));
  return (
    <>
      <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: x - 12, top: y - 12, width: 24, height: 24 }, sFly]}>
        <Icon name="gem" size={24} c={C.ora} />
      </Animated.View>
      <Animated.Text pointerEvents="none" style={[{ position: 'absolute', left: x - 40, width: 80, top: y - 34, textAlign: 'center', fontFamily: F.display, fontSize: 22, color: color || C.lime, textShadowColor: '#000', textShadowRadius: 6 }, sText]}>
        {text}
      </Animated.Text>
    </>
  );
}
export function FloatsHost() {
  const floats = useFx(s => s.floats);
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{floats.map(f => <FloatItem key={f.id} {...f} />)}</View>;
}

/* ---------- toasts ---------- */
export function ToastHost() {
  const toasts = useFx(s => s.toasts), drop = useFx(s => s.dropToast);
  const ins = useSafeAreaInsets();
  const t = toasts[toasts.length - 1];
  useEffect(() => { if (!t) return; const id = setTimeout(() => drop(t.id), 3000); return () => clearTimeout(id); }, [t?.id]);
  if (!t) return null;
  const bg = { taku: C.taku, momo: C.momo, puri: C.puri }[t.who];
  return (
    <Animated.View key={t.id} entering={SlideInUp.springify().damping(16)} exiting={SlideOutUp.duration(250)} style={[st.toast, { top: ins.top + 8 }]}>
      <Pressable onPress={() => drop(t.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={[st.toastFace, { backgroundColor: bg }]}><MascotStill who={t.who} state={(t.state as any) || (t.who === 'puri' ? 'gg' : t.who === 'taku' ? 'wotagei' : 'sparkle')} size={66} /></View>
        <View style={{ flex: 1 }}>
          <T size={15} w="black" color={C.ink}>{t.title}</T>
          {t.sub ? <T size={13} color="#4B4670">{t.sub}</T> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

/* ---------- confetti burst ---------- */
function Piece({ x, delay, color, round, drift, spin, dur, height }: any) {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withDelay(delay, withTiming(1, { duration: dur, easing: Easing.in(Easing.quad) })); }, []);
  const s = useAnimatedStyle((): any => ({ opacity: t.value > 0.85 ? (1 - t.value) / 0.15 : 1, transform: [{ translateY: -30 + t.value * (height + 60) }, { translateX: Math.sin(t.value * 6) * drift }, { rotate: `${t.value * spin}deg` }] }));
  return <Animated.View style={[{ position: 'absolute', left: x, top: 0, width: round ? 10 : 8, height: round ? 10 : 14, borderRadius: round ? 5 : 2, backgroundColor: color }, s]} />;
}
export function Confetti({ count = 36, colors = [C.lime, C.pink, C.sky, C.gold, C.ora], seed = 0 }: { count?: number; colors?: string[]; seed?: number }) {
  const motion = useGame(s => s.settings.motion);
  const { width, height } = Dimensions.get('window');
  const pieces = useMemo(() => Array.from({ length: count }, (_, i) => ({ x: Math.random() * width, delay: Math.random() * 400, color: colors[i % colors.length], round: Math.random() > 0.55, drift: 10 + Math.random() * 30, spin: 360 + Math.random() * 720, dur: 1600 + Math.random() * 1400, height })), [seed]);
  if (!motion) return null;
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{pieces.map((p, i) => <Piece key={`${seed}-${i}`} {...p} />)}</View>;
}

/* ---------- spinning light rays behind reveals ---------- */
export function Rays({ color, size = 640 }: { color: string; size?: number }) {
  const t = useSharedValue(0);
  useEffect(() => { t.value = withRepeat(withTiming(1, { duration: 12000, easing: Easing.linear }), -1, false); return () => cancelAnimation(t); }, []);
  const s = useAnimatedStyle((): any => ({ transform: [{ rotate: `${t.value * 360}deg` }] }));
  const d = Array.from({ length: 14 }, (_, i) => {
    const a1 = (i / 14) * Math.PI * 2, a2 = a1 + Math.PI / 22;
    return `M50 50 L${50 + Math.cos(a1) * 50} ${50 + Math.sin(a1) * 50} L${50 + Math.cos(a2) * 50} ${50 + Math.sin(a2) * 50} Z`;
  }).join(' ');
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size, alignSelf: 'center' }, s]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100"><Path d={d} fill={color} opacity={0.35} /></Svg>
    </Animated.View>
  );
}

export function useBackClose(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { close(); return true; });
    return () => sub.remove();
  }, [open]);
}

const st = themed(() => StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.bg2, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 10, gap: 10 },
  grab: { width: 44, height: 5, borderRadius: 3, backgroundColor: C.line, alignSelf: 'center', marginBottom: 4 },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' },
  toast: { position: 'absolute', left: 14, right: 14, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 8, paddingRight: 14, zIndex: 100, elevation: 12 },
  toastFace: { width: 56, height: 56, borderRadius: 18, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' },
}));
