// Core UI kit: text, buttons, cards, animated numbers and bars, chips, bubbles.
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, TextProps, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming, FadeIn, ZoomIn } from 'react-native-reanimated';
import { C, F, R, themed } from '@/theme';
import { haptic } from '@/store/fx';
import { Icon, IconName } from '@/art/Icon';
import { fmt } from '@/lib/time';

/* ---------- text ---------- */
// Bright accents (gold, mint, sky…) read well on Night Stage but vanish on pastel tints.
// On light themes, saturated text colours are darkened (same hue) until they reach ~4:1 against white.
const readCache: Record<string, string> = {};
export function readable(color?: string) {
  if (!color || C.dark || !/^#[0-9a-f]{6}$/i.test(color)) return color;
  const hit = readCache[color]; if (hit) return hit;
  let [r, g, b] = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16) / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (sat < 0.3) return (readCache[color] = color);
  const lum = (x: number[]) => x.map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  let k = 1;
  while (1.05 / (lum([r * k, g * k, b * k]) + 0.05) < 4 && k > 0.2) k -= 0.04;
  [r, g, b] = [r * k, g * k, b * k];
  const hex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  return (readCache[color] = '#' + hex(r) + hex(g) + hex(b));
}

type TP = TextProps & { size?: number; color?: string; w?: 'reg' | 'bold' | 'heavy' | 'black'; center?: boolean; style?: StyleProp<TextStyle> };
export function T({ size = 15, color = C.text, w = 'bold', center, style, ...p }: TP) {
  const fam = { reg: F.bodyReg, bold: F.body, heavy: F.bodyBold, black: F.bodyHeavy }[w];
  return <Text {...p} style={[{ fontFamily: fam, fontSize: size, color: readable(color), lineHeight: size * 1.32 }, center && { textAlign: 'center' }, style]} />;
}
export function H({ size = 24, color = C.text, center, style, ...p }: TP) {
  return <Text {...p} style={[{ fontFamily: F.display, fontSize: size, color: readable(color), lineHeight: size * 1.12, letterSpacing: -0.2 }, center && { textAlign: 'center' }, style]} />;
}
export const Over = ({ children, color = C.mute, style }: { children: React.ReactNode; color?: string; style?: StyleProp<TextStyle> }) => (
  <Text style={[{ fontFamily: F.bodyHeavy, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: readable(color) }, style]}>{children}</Text>
);

/** Japanese-aware text: segments wrapped in 〔〕 are highlighted */
export function JpText({ text, size = 18, color = C.text, hi = C.pink, display }: { text: string; size?: number; color?: string; hi?: string; display?: boolean }) {
  const parts = text.split(/(〔[^〕]+〕)/g);
  const base = { fontFamily: display ? F.display : F.body, fontSize: size, color, lineHeight: size * 1.3 };
  return <Text style={base}>{parts.map((p, i) => p.startsWith('〔') ? <Text key={i} style={{ color: hi, fontWeight: '900' }}>{p.slice(1, -1)}</Text> : p)}</Text>;
}

/* ---------- pressable that springs ---------- */
export function Press({ onPress, style, children, disabled, haptics = true, scaleTo = 0.96, ...p }: PressableProps & { style?: StyleProp<ViewStyle>; haptics?: boolean; scaleTo?: number; children?: React.ReactNode }) {
  const s = useSharedValue(1);
  const st = useAnimatedStyle((): any => ({ transform: [{ scale: s.value }] }));
  // layout keys belong on the touch target; visual keys on the view that scales
  const flat: any = StyleSheet.flatten(style) || {};
  const outer: any = {}, inner: any = {};
  for (const k in flat) {
    if (/^(flex|flexGrow|flexShrink|flexBasis|alignSelf|margin.*|position|left|right|top|bottom|zIndex|width|maxWidth|minWidth)$/.test(k)) outer[k] = flat[k];
    else inner[k] = flat[k];
  }
  if (flat.flex != null || flat.flexGrow != null) inner.flexGrow = 1;
  return (
    <Pressable
      style={outer}
      {...p}
      disabled={disabled}
      onPressIn={() => { s.value = withSpring(scaleTo, { damping: 15, stiffness: 400 }); }}
      onPressOut={() => { s.value = withSpring(1, { damping: 12, stiffness: 300 }); }}
      onPress={e => { if (haptics) haptic.tap(); onPress?.(e); }}
      accessibilityRole="button"
    >
      <Animated.View style={[inner, st, disabled && { opacity: 0.55 }]}>{children}</Animated.View>
    </Pressable>
  );
}

type BtnKind = 'lime' | 'ink' | 'white' | 'ghost' | 'violet' | 'pink' | 'dis';
// resolved per render so a theme switch recolours every button
const btnColors = (k: BtnKind): [string, string] => ({
  lime: [C.lime, C.onLime], ink: [C.dark ? C.bar : C.ink, '#FFFFFF'], white: ['#FFFFFF', C.ink], ghost: [C.card2, C.text], violet: [C.ora, '#FFFFFF'], pink: [C.pink, '#FFFFFF'], dis: [C.card2, C.dim],
} as Record<BtnKind, [string, string]>)[k];
export function Btn({ title, kind = 'lime', onPress, icon, small, style, right, disabled, haptics }: { title: string; kind?: BtnKind; onPress?: (e: any) => void; icon?: IconName; small?: boolean; style?: StyleProp<ViewStyle>; right?: React.ReactNode; disabled?: boolean; haptics?: boolean }) {
  const k = disabled ? 'dis' : kind;
  const [bg, fg] = btnColors(k);
  const depth = k === 'lime' ? C.limeDeep : k === 'violet' ? C.oraDeep : k === 'pink' ? '#C93A70' : k === 'white' ? '#E5DDEE' : C.dark ? '#00000055' : '#E7D8E6';
  const gloss = C.gloss && k !== 'dis' && k !== 'ghost';
  return (
    <Press onPress={onPress} disabled={disabled} haptics={haptics} style={[{ borderRadius: R.pill, backgroundColor: depth, paddingBottom: small ? 3 : 4 }, style]}>
      <View style={[st.btn, small && st.btnSm, { backgroundColor: bg, overflow: 'hidden' }]}>
        {gloss && <View pointerEvents="none" style={[st.gloss, small && { height: 12 }]} />}
        {icon && <Icon name={icon} size={small ? 18 : 20} c={fg} />}
        <Text style={{ fontFamily: F.bodyHeavy, fontSize: small ? 14 : 16, color: fg }} numberOfLines={1}>{title}</Text>
        {right}
      </View>
    </Press>
  );
}

export function Card({ children, style, color = C.card, onPress }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; color?: string; onPress?: () => void }) {
  const inner = <View style={[{ backgroundColor: color, borderRadius: R.lg, padding: 16, gap: 12 }, style]}>{children}</View>;
  return onPress ? <Press onPress={onPress} scaleTo={0.98}>{inner}</Press> : inner;
}

export function Pill({ children, color = C.card2, text = C.text, style }: { children: React.ReactNode; color?: string; text?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ backgroundColor: color, borderRadius: R.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5 }, style]}>
      {React.Children.toArray(children).every(c => typeof c === 'string' || typeof c === 'number') ? <Text style={{ fontFamily: F.bodyHeavy, fontSize: 11.5, color: readable(text) }}>{children}</Text> : children}
    </View>
  );
}

export function Chip({ label, on, onPress }: { label: string; on?: boolean; onPress?: () => void }) {
  return (
    <Press onPress={onPress} style={[st.chip, on && { backgroundColor: C.lime }]}>
      <Text style={{ fontFamily: F.bodyHeavy, fontSize: 14, color: on ? C.ink : C.text }}>{label}</Text>
    </Press>
  );
}

/* ---------- animated number ---------- */
export function useCountUp(target: number, ms = 700) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const a = from.current, b = target;
    if (a === b) return;
    const t0 = Date.now();
    let raf: any;
    const step = () => {
      const k = Math.min(1, (Date.now() - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      setV(a + (b - a) * e);
      if (k < 1) raf = requestAnimationFrame(step); else from.current = b;
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); from.current = b; };
  }, [target]);
  return v;
}
export function Num({ value, style, prefix = '', suffix = '', ms }: { value: number; style?: StyleProp<TextStyle>; prefix?: string; suffix?: string; ms?: number }) {
  const v = useCountUp(value, ms);
  return <Text style={style}>{prefix}{fmt(v)}{suffix}</Text>;
}

/* ---------- progress bar that grows ---------- */
export function Bar({ pct, color = C.ora, track = C.card2, height = 12, delay = 0, style }: { pct: number; color?: string; track?: string; height?: number; delay?: number; style?: StyleProp<ViewStyle> }) {
  const w = useSharedValue(0);
  useEffect(() => { w.value = withDelay(delay, withTiming(Math.max(0, Math.min(1, pct)), { duration: 900, easing: Easing.out(Easing.cubic) })); }, [pct]);
  const s = useAnimatedStyle((): any => ({ width: `${w.value * 100}%` }));
  return (
    <View style={[{ height, borderRadius: height, backgroundColor: track, overflow: 'hidden' }, style]}>
      <Animated.View style={[{ height: '100%', borderRadius: height, backgroundColor: color }, s]}>
        <View style={{ position: 'absolute', left: height / 2, right: height / 2, top: height * 0.2, height: Math.max(2, height * 0.22), borderRadius: 3, backgroundColor: '#FFFFFF', opacity: 0.35 }} />
      </Animated.View>
    </View>
  );
}

/* ---------- speech bubble ---------- */
export function Bubble({ text, tail = 'left', style, small }: { text: string; tail?: 'left' | 'right' | 'down'; style?: StyleProp<ViewStyle>; small?: boolean }) {
  return (
    <Animated.View key={text} entering={ZoomIn.springify().damping(14)} style={[st.bubble, tail === 'left' && { borderBottomLeftRadius: 6 }, tail === 'right' && { borderBottomRightRadius: 6 }, style]}>
      <Text style={{ fontFamily: F.bodyHeavy, fontSize: small ? 13 : 14.5, color: C.ink, lineHeight: (small ? 13 : 14.5) * 1.3 }}>{text}</Text>
    </Animated.View>
  );
}

export function Row({ children, gap = 10, style, between }: { children: React.ReactNode; gap?: number; style?: StyleProp<ViewStyle>; between?: boolean }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, between && { justifyContent: 'space-between' }, style]}>{children}</View>;
}

export function Section({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <Row between style={{ marginTop: 8 }}>
      <H size={20}>{title}</H>
      {action ? <Press onPress={onAction}><T size={13} w="black" color={C.lime}>{action}</T></Press> : null}
    </Row>
  );
}

export function Segmented<K extends string>({ items, value, onChange }: { items: { k: K; label: string; sub?: string }[]; value: K; onChange: (k: K) => void }) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: C.card, borderRadius: 20, padding: 4, gap: 4 }}>
      {items.map(it => (
        <Press key={it.k} onPress={() => onChange(it.k)} style={{ flex: 1 }}>
          <View style={{ borderRadius: 16, paddingVertical: 8, alignItems: 'center', backgroundColor: value === it.k ? C.lime : 'transparent' }}>
            <Text style={{ fontFamily: F.bodyHeavy, fontSize: 13.5, color: value === it.k ? C.ink : C.text }}>{it.label}</Text>
            {it.sub ? <Text style={{ fontFamily: F.body, fontSize: 11, color: value === it.k ? C.ink : C.mute }}>{it.sub}</Text> : null}
          </View>
        </Press>
      ))}
    </View>
  );
}

export const Fade = ({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) => (
  <Animated.View entering={FadeIn.delay(delay).duration(380)} style={style}>{children}</Animated.View>
);

const st = themed(() => StyleSheet.create({
  btn: { height: 54, borderRadius: R.pill, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnSm: { height: 40, paddingHorizontal: 16 },
  gloss: { position: 'absolute', left: 14, right: 14, top: 5, height: 16, borderRadius: 10, backgroundColor: '#FFFFFF', opacity: 0.32 },
  chip: { height: 38, paddingHorizontal: 15, borderRadius: R.pill, backgroundColor: C.card, justifyContent: 'center' },
  bubble: { backgroundColor: C.bubble, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, maxWidth: 230 },
}));
