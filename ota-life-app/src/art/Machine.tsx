// Capsule machine, capsules and Puri's token jar.
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { seeded } from '@/lib/time';
import { C } from '@/theme';

const INK = '#1B1840';
const shade = (hex: string, k = 0.82) => {
  const n = parseInt(hex.slice(1), 16), r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

export function CapsuleArt({ color, size = 40, cracks = 0, open = 0 }: { color: string; size?: number; cracks?: number; open?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G transform={`translate(${-open * 10} ${-open * 14}) rotate(${-open * 20} 50 50)`}>
        <Path d="M8 50 A42 42 0 0 1 92 50 Z" fill={color} />
        <Path d="M8 50 A42 42 0 0 1 20 21 Q30 40 50 42 L92 50 Z" fill={shade(color, 0.9)} opacity={0.4} />
        <Ellipse cx={32} cy={28} rx={11} ry={6} fill="#FFFFFF" opacity={0.65} />
      </G>
      <G transform={`translate(${open * 10} ${open * 14}) rotate(${open * 20} 50 50)`}>
        <Path d="M8 50 A42 42 0 0 0 92 50 Z" fill="#FFFFFF" />
        <Path d="M20 79 A42 42 0 0 0 92 50 L84 50 A34 34 0 0 1 24 72 Z" fill="#E4E1F4" />
      </G>
      {!open && <Rect x={6} y={46} width={88} height={8} rx={4} fill={shade(color, 0.7)} />}
      {cracks > 0 && <Path d="M30 16 L38 30 L31 40" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
      {cracks > 1 && <Path d="M70 62 L62 72 L70 84" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
      {cracks > 2 && <Path d="M58 12 L54 24 L64 32 L60 42" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
    </Svg>
  );
}

const CAP_COLORS: Record<string, string[]> = {
  std: ['#FF5C9A', '#4FC3F7', '#B9C2D6', '#A77BFF', '#FFC93C', '#3DDC97'],
  rare: ['#4FA8FF', '#A77BFF', '#FFC93C', '#4FA8FF', '#C6F432'],
  legend: ['#FFC93C', '#A77BFF', '#FFC93C', '#FF5C9A'],
};

/** the machine; `turning` rumbles it and spins the handle */
export function Machine({ color, tier, turning, width }: { color: string; tier: 'std' | 'rare' | 'legend'; turning: boolean; width: number }) {
  const h = (width * 400) / 300;
  const shake = useSharedValue(0), handle = useSharedValue(0), jostle = useSharedValue(0);
  useEffect(() => {
    if (turning) {
      shake.value = withRepeat(withSequence(withTiming(-2.5, { duration: 55 }), withTiming(2.5, { duration: 55 })), -1, true);
      jostle.value = withRepeat(withTiming(1, { duration: 140 }), -1, true);
      handle.value = withTiming(handle.value + 720, { duration: 1300, easing: Easing.inOut(Easing.cubic) });
    } else { cancelAnimation(shake); cancelAnimation(jostle); shake.value = withTiming(0); jostle.value = withTiming(0); }
  }, [turning]);
  const sShake = useAnimatedStyle((): any => ({ transform: [{ translateX: shake.value }, { rotate: `${shake.value * 0.3}deg` }] }));
  const sHandle = useAnimatedStyle((): any => ({ transform: [{ rotate: `${handle.value}deg` }] }));
  const sCaps = useAnimatedStyle((): any => ({ transform: [{ translateY: -jostle.value * 6 }, { rotate: `${(jostle.value - 0.5) * 6}deg` }] }));
  const pal = CAP_COLORS[tier];
  const caps = useMemo(() => {
    const pos = [[110, 176], [146, 186], [184, 176], [90, 148], [128, 154], [166, 156], [206, 146], [110, 122], [150, 128], [190, 120], [132, 96], [172, 98], [92, 98]];
    return pos.map(([x, y], k) => ({ x, y, r: (k * 47) % 360, c: pal[k % pal.length] }));
  }, [tier]);
  const dark = shade(color, 0.78);
  return (
    <Animated.View style={[{ width, height: h }, sShake]}>
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 300 400">
        <Ellipse cx={150} cy={392} rx={116} ry={8} fill="#000000" opacity={0.3} />
        <Rect x={112} y={190} width={76} height={24} rx={6} fill={dark} />
        <Circle cx={150} cy={122} r={98} fill={C.barLine} />
        <Circle cx={150} cy={122} r={90} fill="#3A3378" />
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, { transformOrigin: '50% 35%' }, sCaps]}>
        <Svg style={StyleSheet.absoluteFill} viewBox="0 0 300 400">
          {caps.map((c, i) => (
            <G key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.r})`}>
              <Circle r={17} fill="#FFFFFF" />
              <Path d="M-17 0 A17 17 0 0 1 17 0 Z" fill={c.c} />
              <Rect x={-17} y={-2} width={34} height={4} rx={2} fill={shade(c.c, 0.75)} />
            </G>
          ))}
        </Svg>
      </Animated.View>
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 300 400">
        <Path d="M84 70 Q98 42 132 34" stroke="#FFFFFF" strokeWidth={11} strokeLinecap="round" fill="none" opacity={0.75} />
        <Circle cx={100} cy={92} r={6} fill="#FFFFFF" opacity={0.7} />
        <Rect x={124} y={14} width={52} height={20} rx={9} fill={color} />
        <Path d="M64 204 H236 Q252 204 252 220 V370 Q252 386 236 386 H64 Q48 386 48 370 V220 Q48 204 64 204Z" fill={color} />
        <Path d="M48 330 H252 V370 Q252 386 236 386 H64 Q48 386 48 370Z" fill={dark} />
        <Rect x={60} y={216} width={14} height={100} rx={7} fill="#FFFFFF" opacity={0.3} />
        <Rect x={90} y={220} width={120} height={30} rx={15} fill="#FFFFFF" />
        <SvgText fontFamily="Fredoka_700Bold" x={150} y={241} fontSize={16} fontWeight="900" fill={INK} textAnchor="middle">ŌTA GACHA</SvgText>
        <Rect x={214} y={266} width={12} height={34} rx={6} fill={INK} />
        <Path d="M104 330 H196 V366 Q196 376 186 376 H114 Q104 376 104 366Z" fill={INK} />
        <Rect x={114} y={336} width={72} height={8} rx={4} fill="#FFFFFF" opacity={0.25} />
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, { transformOrigin: '50% 70.5%' }, sHandle]}>
        <Svg style={StyleSheet.absoluteFill} viewBox="0 0 300 400">
          <Circle cx={150} cy={282} r={32} fill="#FFFFFF" />
          <Circle cx={150} cy={282} r={24} fill="#E9E6F7" />
          <Rect x={142} y={252} width={16} height={60} rx={8} fill={INK} />
          <Circle cx={150} cy={282} r={6} fill="#FFFFFF" />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

/** Puri token: the coin that drops into the watch jar */
export function TokenArt({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Circle cx={20} cy={22} r={17} fill="#F5A623" />
      <Circle cx={20} cy={19} r={16} fill="#FFC93C" />
      <Path d="M6 21 Q13 16 20 19 Q27 16 34 21 Q27 26 20 23 Q13 26 6 21Z" fill="#FFF3D1" />
      <Circle cx={15.5} cy={14.5} r={2} fill={INK} /><Circle cx={24.5} cy={14.5} r={2} fill={INK} />
      <Ellipse cx={12} cy={9} rx={3} ry={1.6} fill="#FFFFFF" opacity={0.7} />
    </Svg>
  );
}

/** Puri's jar; tokens settle in seeded positions so the pile never jumps */
export function JarArt({ count, cap = 60, size = 70 }: { count: number; cap?: number; size?: number }) {
  const shown = Math.min(36, Math.round((Math.min(count, cap) / cap) * 36));
  const coins = useMemo(() => {
    const rnd = seeded('jar');
    const out: { x: number; y: number }[] = [];
    for (let i = 0; i < 36; i++) { const row = Math.floor(i / 6), col = i % 6; out.push({ x: 20 + col * 12 + (row % 2) * 5 + rnd() * 2, y: 104 - row * 10 - rnd() * 2 }); }
    return out;
  }, []);
  return (
    <Svg width={size} height={size * 1.25} viewBox="0 0 100 125">
      <Rect x={24} y={6} width={52} height={14} rx={5} fill="#4F7CFF" />
      <Rect x={24} y={14} width={52} height={6} rx={3} fill="#3B62E6" />
      <Path d="M26 20 Q8 30 8 50 V104 Q8 120 24 120 H76 Q92 120 92 104 V50 Q92 30 74 20 Z" fill="#3A3378" />
      {coins.slice(0, shown).map((c, i) => (
        <G key={i}><Circle cx={c.x} cy={c.y + 2} r={6.5} fill="#F5A623" /><Circle cx={c.x} cy={c.y} r={6.5} fill="#FFC93C" /></G>
      ))}
      <Path d="M26 20 Q8 30 8 50 V104 Q8 120 24 120 H76 Q92 120 92 104 V50 Q92 30 74 20 Z" fill="#FFFFFF" opacity={0.12} />
      <Path d="M20 44 Q16 70 20 98" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.6} />
      <Rect x={30} y={56} width={40} height={22} rx={8} fill="#FFFFFF" opacity={0.9} />
      <SvgText fontFamily="Fredoka_700Bold" x={50} y={72} fontSize={13} fontWeight="900" fill={INK} textAnchor="middle">PURI</SvgText>
    </Svg>
  );
}
