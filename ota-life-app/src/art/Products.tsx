// Merch and event illustrations: flat product shots with mascot prints, and event scenes.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { MascotStill } from '@/mascots/Mascot';
import { Blob } from './Blob';
import type { Product } from '@/content/catalog';
import type { Who } from '@/theme';
import { C } from '@/theme';

const INK = '#1B1840';
const darker = (hex: string, k = 0.8) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.round(v * k);
  return `#${((1 << 24) | (f((n >> 16) & 255) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).slice(1)}`;
};

function Shape({ kind, color }: { kind: Product['kind']; color: string }) {
  const d = darker(color);
  switch (kind) {
    case 'tee': return <G><Path d="M60 40 L84 30 Q100 44 116 30 L140 40 L166 64 L148 84 L138 76 L138 164 Q138 170 132 170 L68 170 Q62 170 62 164 L62 76 L52 84 L34 64 Z" fill={color} stroke={color} strokeWidth={6} strokeLinejoin="round" /><Path d="M84 30 Q100 50 116 30" stroke={d} strokeWidth={6} strokeLinecap="round" fill="none" /><Rect x={62} y={156} width={76} height={14} fill={d} /></G>;
    case 'hoodie': return <G><Path d="M56 50 Q100 22 144 50 L170 80 L150 98 L140 88 L140 166 Q140 172 134 172 L66 172 Q60 172 60 166 L60 88 L50 98 L30 80 Z" fill={color} stroke={color} strokeWidth={6} strokeLinejoin="round" /><Path d="M78 46 Q100 74 122 46 Q100 30 78 46 Z" fill={d} /><Path d="M80 130 H120 L126 156 H74 Z" fill={d} /><Line x1={94} y1={58} x2={92} y2={80} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" /><Line x1={106} y1={58} x2={108} y2={80} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" /></G>;
    case 'stand': return <G><Ellipse cx={100} cy={172} rx={58} ry={12} fill={d} /><Ellipse cx={100} cy={166} rx={58} ry={12} fill={color} /><Ellipse cx={100} cy={164} rx={40} ry={6} fill="#FFFFFF" opacity={0.4} /><Rect x={50} y={30} width={100} height={136} rx={22} fill="#FFFFFF" opacity={0.16} /><Rect x={58} y={38} width={8} height={70} rx={4} fill="#FFFFFF" opacity={0.4} /></G>;
    case 'plush': return <G><Ellipse cx={100} cy={176} rx={60} ry={9} fill="#000000" opacity={0.25} /><Rect x={140} y={120} width={30} height={20} rx={5} fill="#FFFFFF" /><SvgText fontFamily="Fredoka_700Bold" x={155} y={134} fontSize={10} fontWeight="900" fill={INK} textAnchor="middle">ŌTA</SvgText></G>;
    case 'glow': return <G><G transform="rotate(-22 100 100)"><Rect x={86} y={22} width={22} height={118} rx={11} fill={color} /><Rect x={92} y={34} width={6} height={90} rx={3} fill="#FFFFFF" opacity={0.6} /><Rect x={84} y={136} width={26} height={40} rx={9} fill={INK} /></G><G transform="rotate(22 100 100)"><Rect x={92} y={22} width={22} height={118} rx={11} fill="#FF5C9A" /><Rect x={98} y={34} width={6} height={90} rx={3} fill="#FFFFFF" opacity={0.6} /><Rect x={90} y={136} width={26} height={40} rx={9} fill={INK} /></G></G>;
    case 'keychain': return <G><Circle cx={100} cy={40} r={18} stroke="#E9E6F7" strokeWidth={6} fill="none" />{[['#4FC3F7', 58, 122], ['#FF5C9A', 100, 138], ['#FFC93C', 142, 122]].map(([c, x, y], i) => <G key={i}><Line x1={100} y1={56} x2={x as number} y2={(y as number) - 30} stroke="#E9E6F7" strokeWidth={4} /><Path d={`M${(x as number) - 26} ${y} A26 26 0 0 1 ${(x as number) + 26} ${y} Z`} fill={c as string} /><Path d={`M${(x as number) - 26} ${y} A26 26 0 0 0 ${(x as number) + 26} ${y} Z`} fill="#FFFFFF" /><Rect x={(x as number) - 27} y={(y as number) - 3} width={54} height={6} rx={3} fill={darker(c as string, 0.7)} /></G>)}</G>;
    case 'tote': return <G><Path d="M70 64 Q70 26 100 26 Q130 26 130 64" stroke={d} strokeWidth={8} fill="none" strokeLinecap="round" /><Path d="M48 62 H152 L144 170 Q144 176 138 176 H62 Q56 176 56 170 Z" fill={color} /><Rect x={48} y={62} width={104} height={14} fill={d} /></G>;
    case 'poster': return <G><Rect x={46} y={20} width={108} height={152} rx={8} fill="#FFFFFF" /><Rect x={54} y={28} width={92} height={136} rx={4} fill="#241B6B" /><Circle cx={100} cy={70} r={26} fill="#FF5C9A" /><Path d="M66 118 H134 M74 104 H126 M80 104 V146 M120 104 V146" stroke="#FF4D6D" strokeWidth={7} strokeLinecap="round" /><Circle cx={68} cy={44} r={2} fill="#FFFFFF" /><Circle cx={132} cy={52} r={2.5} fill="#C6F432" /><SvgText fontFamily="Fredoka_700Bold" x={100} y={158} fontSize={11} fontWeight="900" fill="#FFFFFF" textAnchor="middle">DELHI 2026</SvgText></G>;
  }
  return null;
}

const PRINT: Record<Product['kind'], { x: number; y: number; s: number } | null> = {
  tee: { x: 0.31, y: 0.36, s: 0.38 }, hoodie: { x: 0.33, y: 0.4, s: 0.34 }, stand: { x: 0.2, y: 0.12, s: 0.6 }, plush: { x: 0.12, y: 0.08, s: 0.78 },
  glow: null, keychain: null, tote: { x: 0.3, y: 0.42, s: 0.4 }, poster: null,
};

export function ProductArt({ p, size, bg }: { p: Product; size: number; bg?: boolean }) {
  const pr = PRINT[p.kind];
  return (
    <View style={{ width: size, height: size }}>
      {bg !== false && <Blob seed={p.id} color={p.color + '33'} size={size * 0.92} spin={false} style={{ position: 'absolute', left: size * 0.04, top: size * 0.04 }} />}
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 200 200"><Shape kind={p.kind} color={p.color} /></Svg>
      {pr && (
        <View style={{ position: 'absolute', left: pr.x * size, top: pr.y * size }}>
          <MascotStill who={p.who} size={pr.s * size} state={p.kind === 'tee' ? 'wotagei' : p.kind === 'stand' ? 'celebrate' : 'idle'} acc={p.kind === 'plush' ? 'headset' : null} />
        </View>
      )}
    </View>
  );
}

/* ---------- event scenes ---------- */
export function EventScene({ scene, color, width, height }: { scene: 'festival' | 'workshop' | 'market'; color: string; width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 200" preserveAspectRatio="xMidYMid slice">
      <Rect width={360} height={200} fill={scene === 'festival' ? C.panel : scene === 'workshop' ? '#4A1638' : C.puriDeep} />
      {[[30, 24, 2], [80, 50, 1.6], [150, 20, 2.4], [220, 40, 1.4], [300, 18, 2], [336, 60, 1.6], [120, 70, 1.2]].map(([x, y, r], i) => <Circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={0.7} />)}
      <Circle cx={300} cy={56} r={26} fill={scene === 'market' ? '#FFC93C' : '#FFE9A8'} />
      <Circle cx={290} cy={50} r={26} fill={scene === 'festival' ? C.panel : scene === 'workshop' ? '#4A1638' : C.puriDeep} opacity={scene === 'market' ? 0 : 1} />
      {scene === 'festival' && <G>
        <Path d="M0 160 L20 130 L40 150 L70 110 L100 150 L130 120 L160 152 L200 104 L236 150 L270 124 L300 150 L330 116 L360 140 V200 H0 Z" fill={C.heroBlob} />
        <Rect x={0} y={160} width={360} height={40} fill="#14104A" />
        <G><Rect x={96} y={86} width={168} height={14} rx={7} fill="#FF4D6D" /><Rect x={86} y={74} width={188} height={14} rx={7} fill="#FF4D6D" /><Rect x={112} y={100} width={14} height={80} rx={4} fill="#FF4D6D" /><Rect x={234} y={100} width={14} height={80} rx={4} fill="#FF4D6D" /><Rect x={110} y={108} width={140} height={9} rx={4} fill="#E0243F" /></G>
        <Path d="M0 30 Q90 64 180 34 Q270 64 360 30" stroke="#FFFFFF" strokeWidth={1.5} opacity={0.4} fill="none" />
        {[40, 110, 180, 250, 320].map((x, i) => <G key={i}><Rect x={x - 9} y={42 + (i % 2) * 6} width={18} height={24} rx={8} fill={i % 2 ? '#FFC93C' : '#FF5C9A'} /><Rect x={x - 5} y={40 + (i % 2) * 6} width={10} height={4} rx={2} fill={INK} /></G>)}
      </G>}
      {scene === 'workshop' && <G>
        <Rect x={0} y={150} width={360} height={50} fill="#7A2B5B" />
        <G transform="rotate(-6 120 120)"><Rect x={60} y={80} width={130} height={90} rx={6} fill="#FFFFFF" /><Circle cx={110} cy={118} r={22} fill="none" stroke={INK} strokeWidth={4} /><Path d="M98 116 q4 -4 8 0 M114 116 q4 -4 8 0 M104 128 q6 5 12 0" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" /><Path d="M140 100 H176 M140 114 H170 M140 128 H176" stroke="#B9B4D8" strokeWidth={4} strokeLinecap="round" /></G>
        <G transform="rotate(30 240 110)"><Rect x={232} y={50} width={14} height={100} rx={4} fill="#FFC93C" /><Path d="M232 150 L239 166 L246 150 Z" fill="#F6D7A7" /><Rect x={232} y={50} width={14} height={14} rx={3} fill="#FF5C9A" /></G>
        <G><Path d="M270 130 H330 L324 176 Q323 182 316 182 H284 Q277 182 276 176 Z" fill="#3DDC97" /><Ellipse cx={300} cy={130} rx={30} ry={7} fill="#7FE8B5" /><Path d="M330 142 Q346 146 340 160 Q336 168 326 164" stroke="#3DDC97" strokeWidth={6} fill="none" /></G>
      </G>}
      {scene === 'market' && <G>
        <Rect x={0} y={162} width={360} height={38} fill="#2A1F08" />
        <Path d="M0 40 Q90 70 180 44 Q270 70 360 40" stroke="#FFFFFF" strokeWidth={1.5} opacity={0.4} fill="none" />
        {[30, 90, 150, 210, 270, 330].map((x, i) => <Circle key={i} cx={x} cy={52 + Math.sin(i) * 6} r={9} fill={['#FF5C9A', '#FFC93C', '#C6F432', '#4FC3F7'][i % 4]} />)}
        {[[24, '#FF5C9A'], [136, '#4FC3F7'], [248, '#C6F432']].map(([x, c], i) => (
          <G key={i}><Rect x={(x as number) + 6} y={108} width={88} height={60} fill="#5A440F" /><Path d={`M${x} 108 L${(x as number) + 10} 84 H${(x as number) + 90} L${(x as number) + 100} 108 Z`} fill={c as string} />{[0, 1, 2, 3, 4].map(k => <Path key={k} d={`M${(x as number) + k * 20} 108 a10 10 0 0 0 20 0`} fill={k % 2 ? '#FFFFFF' : (c as string)} />)}<Rect x={(x as number) + 20} y={126} width={60} height={10} rx={5} fill="#FFC93C" /></G>
        ))}
      </G>}
    </Svg>
  );
}

/* ---------- flat decoration used behind cards ---------- */
export function Confetti({ width, height, seed = 'c', opacity = 0.5 }: { width: number; height: number; seed?: string; opacity?: number }) {
  const pts = Array.from({ length: 14 }, (_, i) => {
    const a = (Math.sin(i * 12.9898 + seed.length * 78.233) * 43758.5453) % 1;
    const b = (Math.sin(i * 39.3468 + seed.length * 11.135) * 24634.6345) % 1;
    return { x: Math.abs(a) * width, y: Math.abs(b) * height, k: i };
  });
  const cols = ['#C6F432', '#FF5C9A', '#4FC3F7', '#FFC93C', '#FFFFFF'];
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      {pts.map(p => p.k % 3 === 0
        ? <Circle key={p.k} cx={p.x} cy={p.y} r={3} fill={cols[p.k % 5]} opacity={opacity} />
        : <Rect key={p.k} x={p.x} y={p.y} width={9} height={4} rx={2} fill={cols[p.k % 5]} opacity={opacity} transform={`rotate(${p.k * 37} ${p.x} ${p.y})`} />)}
    </Svg>
  );
}

export function KanjiCover({ kanji, color, size }: { kanji: string; color: string; size: number }) {
  return (
    <View style={{ width: size, height: size * 0.6, backgroundColor: color + '33', borderRadius: 18, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
      <Blob seed={kanji} color={color} size={size * 0.62} spin={false} style={{ position: 'absolute', right: -size * 0.12, top: -size * 0.1, opacity: 0.55 }} />
      <Svg width={size} height={size * 0.6} style={StyleSheet.absoluteFill}><Circle cx={size * 0.12} cy={size * 0.46} r={size * 0.07} fill={color} opacity={0.5} /></Svg>
      <View><Text style={{ fontSize: size * 0.24, color: C.text, fontWeight: '900' }}>{kanji}</Text></View>
    </View>
  );
}

export const whoColor = (w: Who) => ({ taku: '#4FC3F7', momo: '#FF5C9A', puri: '#FFC93C' }[w]);
