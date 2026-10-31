// Organic blobs that sit behind mascots. Shapes are seeded so each screen keeps its own blob.
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming, cancelAnimation } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { seeded } from '@/lib/time';
import { useGame } from '@/store/game';

export function blobPath(seed: string, points = 7, wobble = 0.22, cx = 50, cy = 50, r = 44) {
  const rnd = seeded(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const rr = r * (1 - wobble + rnd() * wobble * 2);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  // closed Catmull-Rom spline converted to cubic Béziers
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < points; i++) {
    const p0 = pts[(i - 1 + points) % points], p1 = pts[i], p2 = pts[(i + 1) % points], p3 = pts[(i + 2) % points];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

type Props = { seed: string; color: string; size: number; style?: ViewStyle; spin?: boolean; second?: string; dots?: boolean };

export function Blob({ seed, color, size, style, spin = true, second, dots }: Props) {
  const motion = useGame(s => s.settings.motion);
  const d = useMemo(() => blobPath(seed), [seed]);
  const d2 = useMemo(() => (second ? blobPath(seed + 'b', 6, 0.28, 54, 48, 38) : ''), [seed, second]);
  const t = useSharedValue(0);
  useEffect(() => {
    if (!spin || !motion) return;
    t.value = withRepeat(withTiming(1, { duration: 16000, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(t);
  }, [spin, motion]);
  const st = useAnimatedStyle((): any => ({ transform: [{ rotate: `${t.value * 360}deg` }, { scale: 1 + Math.sin(t.value * Math.PI * 4) * 0.03 }] }));
  const st2 = useAnimatedStyle((): any => ({ transform: [{ rotate: `${-t.value * 360}deg` }] }));
  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, style]}>
      {second ? (
        <Animated.View style={[StyleSheet.absoluteFill, st2]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100"><Path d={d2} fill={second} /></Svg>
        </Animated.View>
      ) : null}
      <Animated.View style={[StyleSheet.absoluteFill, st]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100"><Path d={d} fill={color} /></Svg>
      </Animated.View>
      {dots ? (
        <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 100">
          <Circle cx={10} cy={22} r={2.4} fill="#FFFFFF" opacity={0.5} /><Circle cx={88} cy={16} r={3.4} fill="#C6F432" /><Circle cx={92} cy={74} r={2} fill="#FFFFFF" opacity={0.6} /><Circle cx={6} cy={80} r={3} fill="#FF5C9A" />
        </Svg>
      ) : null}
    </View>
  );
}

/** mascot on a blob: the standard way a host appears on a panel */
export function OnBlob({ seed, color, size, children, style, second, dots = true }: { seed: string; color: string; size: number; children: React.ReactNode; style?: ViewStyle; second?: string; dots?: boolean }) {
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }, style]}>
      <Blob seed={seed} color={color} size={size * 0.92} second={second} dots={dots} style={{ position: 'absolute', top: size * 0.02, left: size * 0.04 }} />
      {children}
    </View>
  );
}
