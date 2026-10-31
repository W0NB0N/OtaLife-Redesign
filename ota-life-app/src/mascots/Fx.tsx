// Small looping effects that orbit a mascot's head: sparkles, hearts, Zzz, sweat, steam, notes.
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming, cancelAnimation } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { INK } from './parts';

export type FxKind = 'spark' | 'heart' | 'zzz' | 'sweat' | 'steam' | 'dots' | 'notes' | 'trophy' | 'swirl' | 'burst' | 'tears' | 'exclaim' | 'question' | 'diamonds' | 'hearts';

const Star = ({ x, y, s, c }: { x: number; y: number; s: number; c: string }) => (
  <Path d={`M${x} ${y - s} Q${x + s * .22} ${y - s * .22} ${x + s} ${y} Q${x + s * .22} ${y + s * .22} ${x} ${y + s} Q${x - s * .22} ${y + s * .22} ${x - s} ${y} Q${x - s * .22} ${y - s * .22} ${x} ${y - s}Z`} fill={c} />
);

/* one animated sprite on the 200×200 canvas */
function Sprite({ kind, x, y, delay = 0, loop = 1400, motion = true, children }: { kind: 'rise' | 'twinkle' | 'drip' | 'bob' | 'spin' | 'pop' | 'fall'; x: number; y: number; delay?: number; loop?: number; motion?: boolean; children: React.ReactNode }) {
  const t = useSharedValue(motion ? 0 : 0.5);
  useEffect(() => {
    if (!motion) return;
    t.value = 0;
    t.value = withDelay(delay, withRepeat(withTiming(1, { duration: loop, easing: kind === 'spin' ? Easing.linear : Easing.inOut(Easing.quad) }), kind === 'pop' ? 2 : -1, kind === 'twinkle' || kind === 'bob'));
    return () => cancelAnimation(t);
  }, [motion]);
  const st = useAnimatedStyle((): any => {
    const v = t.value;
    if (kind === 'rise') return { opacity: v < 0.2 ? v * 5 : 1 - (v - 0.2) / 0.8, transform: [{ translateY: -v * 34 }, { scale: 0.7 + v * 0.4 }] };
    if (kind === 'twinkle') return { opacity: 0.35 + v * 0.65, transform: [{ scale: 0.7 + v * 0.45 }, { rotate: `${v * 40}deg` }] };
    if (kind === 'fall') return { opacity: v < 0.1 ? v * 10 : 1 - Math.max(0, v - 0.7) / 0.3, transform: [{ translateY: v * 40 }, { scaleY: 1 + v * 0.3 }] };
    if (kind === 'drip') return { opacity: v < 0.2 ? v * 5 : 1 - v, transform: [{ translateY: v * 16 }] };
    if (kind === 'bob') return { transform: [{ translateY: -v * 6 }, { rotate: `${(v - 0.5) * 10}deg` }] };
    if (kind === 'spin') return { transform: [{ rotate: `${v * 360}deg` }] };
    return { opacity: 1 - v, transform: [{ scale: 0.4 + v * 1.3 }] };
  });
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { transformOrigin: `${x / 2}% ${y / 2}%` }, st]}>
      <Svg width="100%" height="100%" viewBox="0 0 200 200">{children}</Svg>
    </Animated.View>
  );
}

export function MascotFx({ kinds, top, motion, eyes }: { kinds: FxKind[]; top: [number, number]; motion: boolean; eyes?: [[number, number], [number, number]] }) {
  const [hx, hy] = top;
  const dia = (x: number, y: number, s: number, c: string) => <Path d={`M${x} ${y - s} L${x + s * 0.8} ${y} L${x} ${y + s} L${x - s * 0.8} ${y} Z`} fill={c} />;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {kinds.includes('spark') && <>
        <Sprite kind="twinkle" x={hx - 70} y={hy + 10} loop={900} motion={motion}><Star x={hx - 70} y={hy + 10} s={10} c="#FFC93C" /></Sprite>
        <Sprite kind="twinkle" x={hx + 72} y={hy} delay={300} loop={1100} motion={motion}><Star x={hx + 72} y={hy} s={13} c="#C6F432" /></Sprite>
        <Sprite kind="twinkle" x={hx + 64} y={hy + 70} delay={600} loop={800} motion={motion}><Star x={hx + 64} y={hy + 70} s={8} c="#FF8FB0" /></Sprite>
      </>}
      {kinds.includes('heart') && [0, 1].map(i => (
        <Sprite key={i} kind="rise" x={hx + (i ? -56 : 58)} y={hy + 10} delay={i * 600} loop={1400} motion={motion}>
          <Path d={`M${hx + (i ? -56 : 58)} ${hy + 19} c-14 -10 -8 -22 0 -14 c8 -8 14 4 0 14z`} fill="#FF5C9A" />
        </Sprite>
      ))}
      {kinds.includes('zzz') && [0, 1, 2].map(i => (
        <Sprite key={i} kind="rise" x={hx + 50 + i * 12} y={hy + 6 - i * 14} delay={i * 700} loop={2100} motion={motion}>
          <SvgText fontFamily="Fredoka_700Bold" x={hx + 50 + i * 12} y={hy + 6 - i * 14} fontSize={14 + i * 5} fontWeight="900" fill="#BFD7FF">z</SvgText>
        </Sprite>
      ))}
      {kinds.includes('sweat') && (
        <Sprite kind="drip" x={hx + 52} y={hy + 26} loop={1500} motion={motion}><Path d={`M${hx + 52} ${hy + 16} q-9 14 0 18 q9 -4 0 -18z`} fill="#7FD6FF" /></Sprite>
      )}
      {kinds.includes('steam') && [0, 1].map(i => (
        <Sprite key={i} kind="rise" x={i ? hx + 62 : hx - 62} y={hy + 6} delay={i * 400} loop={900} motion={motion}>
          <G><Circle cx={i ? hx + 62 : hx - 62} cy={hy + 6} r={11} fill="#F2EEFF" /><Circle cx={i ? hx + 72 : hx - 72} cy={hy - 6} r={7} fill="#F2EEFF" /></G>
        </Sprite>
      ))}
      {kinds.includes('dots') && (
        <Sprite kind="bob" x={hx + 58} y={hy - 4} loop={700} motion={motion}>
          <G><Rect x={hx + 32} y={hy - 18} width={54} height={30} rx={15} fill="#FFFFFF" /><Circle cx={hx + 46} cy={hy - 3} r={4} fill={INK} /><Circle cx={hx + 59} cy={hy - 3} r={4} fill={INK} /><Circle cx={hx + 72} cy={hy - 3} r={4} fill={INK} /></G>
        </Sprite>
      )}
      {kinds.includes('notes') && [0, 1].map(i => (
        <Sprite key={i} kind="rise" x={i ? hx - 64 : hx + 66} y={hy + 20} delay={i * 500} loop={1300} motion={motion}>
          <G><Ellipse cx={i ? hx - 64 : hx + 66} cy={hy + 24} rx={6} ry={5} fill={i ? '#C6F432' : '#4FC3F7'} /><Rect x={(i ? hx - 64 : hx + 66) + 3.5} y={hy + 2} width={4} height={22} rx={2} fill={i ? '#C6F432' : '#4FC3F7'} /></G>
        </Sprite>
      ))}
      {kinds.includes('trophy') && (
        <Sprite kind="bob" x={hx} y={hy - 20} loop={900} motion={motion}>
          <G><Path d={`M${hx - 17} ${hy - 44} H${hx + 17} V${hy - 30} Q${hx + 17} ${hy - 12} ${hx} ${hy - 10} Q${hx - 17} ${hy - 12} ${hx - 17} ${hy - 30} Z`} fill="#FFC93C" /><Rect x={hx - 6} y={hy - 11} width={12} height={8} fill="#F5A623" /><Rect x={hx - 14} y={hy - 4} width={28} height={7} rx={3} fill="#F5A623" /><Ellipse cx={hx - 7} cy={hy - 34} rx={3} ry={6} fill="#FFE59A" /></G>
        </Sprite>
      )}
      {kinds.includes('swirl') && (
        <Sprite kind="spin" x={hx} y={hy - 4} loop={1200} motion={motion}>
          <G>{[0, 120, 240].map(a => { const r = (a * Math.PI) / 180; return <Star key={a} x={hx + Math.cos(r) * 26} y={hy - 4 + Math.sin(r) * 9} s={6} c="#FFC93C" />; })}</G>
        </Sprite>
      )}
      {kinds.includes('tears') && eyes && [0, 1, 2, 3].map(i => {
        const [ex, ey] = eyes[i % 2];
        return (
          <Sprite key={i} kind="fall" x={ex} y={ey + 16} delay={i * 260} loop={900} motion={motion}>
            <Path d={`M${ex + (i % 2 ? 6 : -6)} ${ey + 10} q-6 9 0 12 q6 -3 0 -12z`} fill="#5EC8FF" />
          </Sprite>
        );
      })}
      {kinds.includes('exclaim') && (
        <Sprite kind="pop" x={hx + 62} y={hy - 6} loop={600} motion={motion}>
          <G><Rect x={hx + 56} y={hy - 34} width={12} height={28} rx={6} fill="#FF4D6D" /><Circle cx={hx + 62} cy={hy + 4} r={6} fill="#FF4D6D" /></G>
        </Sprite>
      )}
      {kinds.includes('question') && (
        <Sprite kind="bob" x={hx + 62} y={hy - 10} loop={700} motion={motion}>
          <SvgText fontFamily="Fredoka_700Bold" x={hx + 62} y={hy} fontSize={34} fontWeight="900" fill="#FFC93C" textAnchor="middle">?</SvgText>
        </Sprite>
      )}
      {kinds.includes('diamonds') && [[-66, 6, 8, '#FF9DBB'], [70, -10, 7, '#FFC93C'], [58, 40, 5, '#7FD6FF'], [-58, 50, 5, '#C6F432']].map(([dx, dy, s, c], i) => (
        <Sprite key={i} kind="twinkle" x={hx + (dx as number)} y={hy + (dy as number)} delay={i * 180} loop={700} motion={motion}>{dia(hx + (dx as number), hy + (dy as number), s as number, c as string)}</Sprite>
      ))}
      {kinds.includes('hearts') && [[-60, 0, 10], [58, -12, 12], [64, 30, 7]].map(([dx, dy, s], i) => (
        <Sprite key={i} kind="rise" x={hx + dx} y={hy + dy} delay={i * 380} loop={1300} motion={motion}>
          <Path d={`M${hx + dx} ${hy + dy + s} C${hx + dx - s * 1.7} ${hy + dy - s * 0.2} ${hx + dx - s * 0.85} ${hy + dy - s * 1.5} ${hx + dx} ${hy + dy - s * 0.5} C${hx + dx + s * 0.85} ${hy + dy - s * 1.5} ${hx + dx + s * 1.7} ${hy + dy - s * 0.2} ${hx + dx} ${hy + dy + s}Z`} fill="#FF4D6D" />
        </Sprite>
      ))}
      {kinds.includes('burst') && [[-60, -30], [60, -40], [-74, 20], [76, 16], [-40, 60], [46, 56]].map(([dx, dy], i) => (
        <Sprite key={i} kind="pop" x={hx + dx} y={hy + 50 + dy} delay={i * 40} loop={700} motion={motion}>
          <Star x={hx + dx} y={hy + 50 + dy} s={8} c={i % 2 ? '#C6F432' : '#FFC93C'} />
        </Sprite>
      ))}
    </View>
  );
}
