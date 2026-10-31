// Flat, geometric mascot parts on a 200×200 canvas, drawn from the character references:
// rounded primitives, one darker flat shade per colour, no outlines, no gradients.
import React from 'react';
import { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import type { Who } from '@/theme';

export const INK = '#2B2833';
const WHITE = '#FFFFFF';
const TEAR = '#5EC8FF';

export type EyeV = 'open' | 'wide' | 'happy' | 'closed' | 'sad' | 'cry' | 'angry' | 'sparkle' | 'wink' | 'dizzy' | 'side' | 'lid' | 'heart' | 'star';
export type MouthV = 'smile' | 'grin' | 'open' | 'shout' | 'o' | 'frown' | 'wobble' | 'flat' | 'smirk' | 'tongue' | 'rage' | 'cat' | 'console';
export type Prop = 'glowsticks' | 'mic' | 'gg' | 'controller' | null;
export type Acc = 'headset' | 'crown' | 'partyHat' | null;
type Pt = [number, number];

/** eye geometry; `dot` eyes (Puri) have no whites, `big` eyes (Momo) get lashes */
export type EyeGeo = { l: Pt; r: Pt; s: number; kind: 'dot' | 'normal' | 'big'; lid: string; ink?: string };

/* ---------- eyes ---------- */
const arc = (x: number, y: number, s: number, up: boolean, w: number, c = INK) => (
  <Path d={up ? `M${x - s} ${y + s * 0.35} Q${x} ${y - s * 1.05} ${x + s} ${y + s * 0.35}` : `M${x - s} ${y - s * 0.15} Q${x} ${y + s * 0.85} ${x + s} ${y - s * 0.15}`} stroke={c} strokeWidth={w} strokeLinecap="round" fill="none" />
);
const star = (x: number, y: number, s: number, fill = '#FFC93C') => (
  <Path d={`M${x} ${y - s} Q${x + s * .22} ${y - s * .22} ${x + s} ${y} Q${x + s * .22} ${y + s * .22} ${x} ${y + s} Q${x - s * .22} ${y + s * .22} ${x - s} ${y} Q${x - s * .22} ${y - s * .22} ${x} ${y - s}Z`} fill={fill} />
);
const heart = (x: number, y: number, s: number) => (
  <Path d={`M${x} ${y + s * 0.95} C${x - s * 1.7} ${y - s * 0.15} ${x - s * 0.85} ${y - s * 1.45} ${x} ${y - s * 0.45} C${x + s * 0.85} ${y - s * 1.45} ${x + s * 1.7} ${y - s * 0.15} ${x} ${y + s * 0.95}Z`} fill="#FF4D6D" />
);
const hasWhite = (v: EyeV) => ['open', 'wide', 'sad', 'cry', 'angry', 'sparkle', 'side', 'lid'].includes(v);

function oneEye(v: EyeV, [x, y]: Pt, g: EyeGeo, side: -1 | 1) {
  const s = g.s, ink = g.ink || INK, w = Math.max(3.4, s * 0.42);
  const white = (k = 1) => (g.kind === 'dot' ? null : <Ellipse cx={x} cy={y} rx={s * (g.kind === 'big' ? 1 : 0.95) * k} ry={s * (g.kind === 'big' ? 1 : 1.08) * k} fill={WHITE} />);
  const lashes = g.kind === 'big' && hasWhite(v) && v !== 'angry' ? (
    <G>{[-0.55, 0, 0.55].map((a, i) => <Line key={i} x1={x + side * s * (0.25 + a * 0.6)} y1={y - s * 1.08} x2={x + side * s * (0.35 + a * 0.95)} y2={y - s * 1.5} stroke={ink} strokeWidth={3} strokeLinecap="round" />)}</G>
  ) : null;
  // inner end sits toward the nose: raised inner ends read as worried, lowered as angry
  const bs = g.kind === 'dot' ? s * 1.6 : s;
  const brow = (inner: number, outer: number) => <Path d={`M${x + side * bs * 1.1} ${y - bs * outer} L${x - side * bs * 0.7} ${y - bs * inner}`} stroke={ink} strokeWidth={Math.max(3.4, s * 0.38)} strokeLinecap="round" />;
  switch (v) {
    case 'happy': return arc(x, y, s * 0.95, true, w, ink);
    case 'closed': return arc(x, y, s * 0.95, false, w, ink);
    case 'wink': return side < 0 ? <G>{white()}{lashes}</G> : arc(x, y, s * 0.95, true, w, ink);
    case 'dizzy': return <Path d={`M${x - s * 0.7} ${y - s * 0.7} L${x + s * 0.7} ${y + s * 0.7} M${x + s * 0.7} ${y - s * 0.7} L${x - s * 0.7} ${y + s * 0.7}`} stroke={ink} strokeWidth={w * 0.9} strokeLinecap="round" />;
    case 'star': return star(x, y, s * (g.kind === 'dot' ? 2.2 : 1.35));
    case 'heart': return heart(x, y, s * (g.kind === 'dot' ? 2 : 1.15));
    case 'wide': return <G>{g.kind === 'dot' ? <Circle cx={x} cy={y} r={s * 1.6} fill={WHITE} /> : white(1.25)}{lashes}</G>;
    case 'sad': return <G>{white()}{lashes}{brow(1.9, 1.35)}</G>;
    case 'cry': return <G>{white()}{lashes}{brow(1.9, 1.35)}</G>;
    case 'angry': return <G>{white(0.95)}{brow(0.95, 1.75)}</G>;
    default: return <G>{white()}{lashes}</G>;
  }
}
export function Eyes({ g, v }: { g: EyeGeo; v: EyeV }) {
  return <G>{oneEye(v, g.l, g, -1)}{oneEye(v, g.r, g, 1)}</G>;
}

/** pupils live on their own layer so they can look around */
export function Pupils({ g, v }: { g: EyeGeo; v: EyeV }) {
  const ink = g.ink || INK;
  const one = ([x, y]: Pt, side: number) => {
    const s = g.s;
    if (!hasWhite(v) || (v === 'wink' && side > 0)) return null;
    if (v === 'wink' && side < 0) { /* falls through to normal pupil */ }
    const dot = g.kind === 'dot';
    const dx = v === 'side' ? s * (dot ? 0.5 : 0.38) : 0;
    const dy = v === 'sad' || v === 'cry' ? s * 0.25 : v === 'lid' ? s * 0.28 : 0;
    if (v === 'wide') {
      const r = dot ? s * 0.75 : s * 0.45;
      return <G key={side}><Circle cx={x} cy={y} r={r} fill={ink} /><Circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.32} fill={WHITE} /></G>;
    }
    const big = v === 'sparkle' || g.kind === 'big';
    const rx = dot ? s : big ? s * 0.72 : s * 0.56, ry = dot ? s * 1.08 : big ? s * 0.76 : s * 0.66;
    const cx = x + dx, cy = y + dy + (dot ? 0 : s * 0.1);
    return (
      <G key={side}>
        <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={ink} />
        {!dot && <Circle cx={cx - rx * 0.36} cy={cy - ry * 0.38} r={rx * (big ? 0.36 : 0.34)} fill={WHITE} />}
        {big && !dot && <Circle cx={cx + rx * 0.38} cy={cy + ry * 0.38} r={rx * 0.15} fill={WHITE} />}
        {dot && <Circle cx={cx - rx * 0.32} cy={cy - ry * 0.36} r={rx * 0.3} fill={WHITE} opacity={0.85} />}
      </G>
    );
  };
  return <G>{one(g.l, -1)}{one(g.r, 1)}</G>;
}

/** heavy lids and tear pools sit above the pupils */
export function EyeOverlay({ g, v }: { g: EyeGeo; v: EyeV }) {
  const pair = (f: (p: Pt, side: number) => React.ReactNode) => <G>{f(g.l, -1)}{f(g.r, 1)}</G>;
  const s = g.s * (g.kind === 'dot' ? 1.6 : 1);
  if (v === 'lid') return pair(([x, y]) => <Path d={`M${x - s * 1.25} ${y - s * 1.4} H${x + s * 1.25} V${y + s * 0.05} Q${x} ${y - s * 0.25} ${x - s * 1.25} ${y + s * 0.05} Z`} fill={g.lid} />);
  if (v === 'cry' || v === 'sad') return pair(([x, y]) => (
    <G>
      <Path d={`M${x - s * 0.95} ${y + s * 0.35} Q${x} ${y + s * 1.25} ${x + s * 0.95} ${y + s * 0.35} Q${x} ${y + s * 0.85} ${x - s * 0.95} ${y + s * 0.35}Z`} fill={TEAR} />
      {v === 'cry' && <Path d={`M${x - s * 0.15} ${y + s * 0.9} Q${x - s * 0.4} ${y + s * 2.2} ${x} ${y + s * 2.6} Q${x + s * 0.4} ${y + s * 2.2} ${x + s * 0.15} ${y + s * 0.9}Z`} fill={TEAR} opacity={0.9} />}
    </G>
  ));
  return null;
}

/* ---------- mouths ---------- */
export function Mouth({ at, v, ink = INK }: { at: [number, number, number]; v: MouthV; ink?: string }) {
  const [x, y, w] = at, pink = '#FF6F91', sw = Math.max(3.2, w * 0.42);
  switch (v) {
    case 'smile': return <Path d={`M${x - w} ${y} Q${x} ${y + w * 0.9} ${x + w} ${y}`} stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />;
    case 'cat': return <Path d={`M${x - w} ${y} q${w * 0.5} ${w * 0.7} ${w} 0 q${w * 0.5} ${w * 0.7} ${w} 0`} stroke={ink} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
    case 'smirk': return <Path d={`M${x - w * 0.9} ${y + w * 0.25} Q${x + w * 0.1} ${y + w * 0.55} ${x + w} ${y - w * 0.25}`} stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />;
    case 'grin': return <G><Path d={`M${x - w * 1.15} ${y - w * 0.1} Q${x} ${y + w * 1.8} ${x + w * 1.15} ${y - w * 0.1} Z`} fill={ink} /><Ellipse cx={x} cy={y + w * 0.82} rx={w * 0.5} ry={w * 0.28} fill={pink} /></G>;
    case 'open': return <G><Ellipse cx={x} cy={y + w * 0.5} rx={w * 0.66} ry={w * 0.82} fill={ink} /><Ellipse cx={x} cy={y + w * 0.95} rx={w * 0.42} ry={w * 0.28} fill={pink} /></G>;
    case 'shout': return <G><Path d={`M${x - w * 1.2} ${y - w * 0.2} Q${x} ${y - w * 0.5} ${x + w * 1.2} ${y - w * 0.2} Q${x + w * 1.1} ${y + w * 2} ${x} ${y + w * 2.1} Q${x - w * 1.1} ${y + w * 2} ${x - w * 1.2} ${y - w * 0.2}Z`} fill={ink} /><Ellipse cx={x} cy={y + w * 1.45} rx={w * 0.7} ry={w * 0.45} fill={pink} /></G>;
    case 'o': return <Ellipse cx={x} cy={y + w * 0.35} rx={w * 0.34} ry={w * 0.42} fill={ink} />;
    case 'frown': return <Path d={`M${x - w * 0.8} ${y + w * 0.6} Q${x} ${y - w * 0.15} ${x + w * 0.8} ${y + w * 0.6}`} stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />;
    case 'wobble': return <Path d={`M${x - w} ${y + w * 0.5} q${w * 0.33} ${-w * 0.45} ${w * 0.66} 0 q${w * 0.33} ${-w * 0.45} ${w * 0.66} 0 q${w * 0.33} ${-w * 0.45} ${w * 0.66} 0`} stroke={ink} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
    case 'flat': return <Line x1={x - w * 0.6} y1={y + w * 0.3} x2={x + w * 0.6} y2={y + w * 0.3} stroke={ink} strokeWidth={sw} strokeLinecap="round" />;
    case 'tongue': return <G><Path d={`M${x - w * 0.5} ${y + w * 0.4} q0 ${w * 1.4} ${w * 0.5} ${w * 1.4} q${w * 0.5} 0 ${w * 0.5} ${-w * 1.4} Z`} fill={pink} /><Line x1={x} y1={y + w * 0.6} x2={x} y2={y + w * 1.3} stroke="#E04C72" strokeWidth={2} strokeLinecap="round" /><Path d={`M${x - w * 1.1} ${y} Q${x - w * 0.55} ${y + w * 0.75} ${x} ${y + w * 0.1} Q${x + w * 0.55} ${y + w * 0.75} ${x + w * 1.1} ${y}`} stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" /></G>;
    case 'rage': return <G><Rect x={x - w * 1.1} y={y - w * 0.2} width={w * 2.2} height={w * 1.3} rx={w * 0.4} fill={ink} /><Path d={`M${x - w * 0.8} ${y + w * 0.05} l${w * 0.4} ${w * 0.4} l${w * 0.4} ${-w * 0.4} l${w * 0.4} ${w * 0.4} l${w * 0.4} ${-w * 0.4}`} stroke={WHITE} strokeWidth={2.4} strokeLinejoin="round" fill="none" /></G>;
    case 'console': return (
      <G>
        <Ellipse cx={x} cy={y + w * 0.5} rx={w * 1.1} ry={w * 0.9} fill={ink} />
        <Rect x={x - w * 2} y={y - w * 2.3} width={w * 4} height={w * 2.4} rx={w * 0.4} fill="#3B3A55" />
        <Rect x={x - w * 1.3} y={y - w * 2.05} width={w * 2.6} height={w * 1.9} rx={2} fill="#9FE6FF" />
        <Rect x={x - w * 2.75} y={y - w * 2.3} width={w * 0.85} height={w * 2.4} rx={w * 0.4} fill="#29B6F6" />
        <Rect x={x + w * 1.9} y={y - w * 2.3} width={w * 0.85} height={w * 2.4} rx={w * 0.4} fill="#FF4D6D" />
      </G>
    );
  }
  return null;
}

/* ---------- hand props: drawn along the arm so they follow its rotation ---------- */
function handProp(p: Prop, [hx, hy]: Pt, [dx, dy]: Pt) {
  const len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
  if (p === 'glowsticks') return (
    <G>
      <Line x1={hx + ux * 4} y1={hy + uy * 4} x2={hx + ux * 32} y2={hy + uy * 32} stroke="#C6F432" strokeWidth={10} strokeLinecap="round" />
      <Line x1={hx + ux * 12} y1={hy + uy * 12} x2={hx + ux * 28} y2={hy + uy * 28} stroke="#EFFFB0" strokeWidth={3.4} strokeLinecap="round" />
      <Line x1={hx - ux * 3} y1={hy - uy * 3} x2={hx + ux * 6} y2={hy + uy * 6} stroke="#2E2A55" strokeWidth={11} strokeLinecap="round" />
    </G>
  );
  if (p === 'mic') return <G><Line x1={hx} y1={hy} x2={hx + ux * 16} y2={hy + uy * 16} stroke="#3B3A55" strokeWidth={6} strokeLinecap="round" /><Circle cx={hx + ux * 22} cy={hy + uy * 22} r={8.5} fill="#E8E6F5" /><Circle cx={hx + ux * 22} cy={hy + uy * 22} r={4} fill="#B9B4D8" /></G>;
  if (p === 'gg') {
    // the sign counter-rotates so it reads upright when the arm is raised (pose -150°)
    const sx = hx + ux * 38, sy = hy + uy * 38;
    return (
      <G>
        <Line x1={hx} y1={hy} x2={hx + ux * 30} y2={hy + uy * 30} stroke="#8B6CFF" strokeWidth={5} strokeLinecap="round" />
        <G transform={`rotate(150 ${sx} ${sy})`}>
          <Rect x={sx - 28} y={sy - 20} width={56} height={40} rx={12} fill="#C6F432" />
          <SvgText fontFamily="Fredoka_700Bold" x={sx} y={sy + 9} fontSize={24} fontWeight="900" fill={INK} textAnchor="middle">GG</SvgText>
        </G>
      </G>
    );
  }
  if (p === 'controller') return <G><Rect x={hx - 20} y={hy - 2} width={40} height={22} rx={11} fill="#3B3A55" /><Circle cx={hx - 9} cy={hy + 9} r={3.4} fill="#fff" /><Circle cx={hx + 9} cy={hy + 6} r={3} fill="#FF4D6D" /><Circle cx={hx + 13} cy={hy + 12} r={3} fill="#29B6F6" /></G>;
  return null;
}

/* ---------- head accessories ---------- */
function headAcc(a: Acc, [x, y]: Pt, width: number) {
  if (a === 'crown') return <G><Path d={`M${x - 22} ${y + 4} L${x - 26} ${y - 22} L${x - 11} ${y - 10} L${x} ${y - 28} L${x + 11} ${y - 10} L${x + 26} ${y - 22} L${x + 22} ${y + 4} Z`} fill="#FFC93C" stroke="#FFC93C" strokeWidth={4} strokeLinejoin="round" /><Rect x={x - 22} y={y - 2} width={44} height={8} rx={3} fill="#F5A623" /><Circle cx={x} cy={y - 12} r={4} fill="#FF5C9A" /></G>;
  if (a === 'partyHat') return <G><Path d={`M${x - 18} ${y + 4} L${x} ${y - 40} L${x + 18} ${y + 4} Z`} fill="#8B6CFF" stroke="#8B6CFF" strokeWidth={5} strokeLinejoin="round" /><Path d={`M${x - 11} ${y - 12} L${x + 10} ${y - 4} M${x - 6} ${y - 26} L${x + 5} ${y - 22}`} stroke="#C6F432" strokeWidth={5} strokeLinecap="round" /><Circle cx={x} cy={y - 42} r={7} fill="#FF5C9A" /></G>;
  if (a === 'headset') {
    const h = width / 2;
    return (
      <G>
        <Path d={`M${x - h + 4} ${y + 40} C${x - h} ${y - 16} ${x + h} ${y - 16} ${x + h - 4} ${y + 40}`} stroke="#8B6CFF" strokeWidth={8} strokeLinecap="round" fill="none" />
        <Rect x={x - h - 10} y={y + 26} width={20} height={34} rx={10} fill="#8B6CFF" />
        <Rect x={x + h - 10} y={y + 26} width={20} height={34} rx={10} fill="#8B6CFF" />
        <Rect x={x - h - 6} y={y + 32} width={8} height={22} rx={4} fill="#6A4BEA" />
        <Path d={`M${x - h} ${y + 56} Q${x - h + 8} ${y + 76} ${x - h + 32} ${y + 72}`} stroke="#3B3A55" strokeWidth={4} strokeLinecap="round" fill="none" />
        <Circle cx={x - h + 34} cy={y + 72} r={5} fill="#C6F432" />
      </G>
    );
  }
  return null;
}

/* ---------- the three rigs ---------- */
export type RigDef = {
  piv: { body: Pt; head: Pt; armL: Pt; armR: Pt; legL: Pt; legR: Pt; tail?: Pt; pomL?: Pt; pomR?: Pt };
  eye: EyeGeo; mouth: [number, number, number]; mouthInk?: string; fxTop: Pt;
  back?: () => React.ReactNode; tail?: () => React.ReactNode;
  legL: () => React.ReactNode; legR: () => React.ReactNode;
  torso: (tint?: string) => React.ReactNode;
  armL: (p: Prop) => React.ReactNode; armR: (p: Prop) => React.ReactNode;
  head: (tint?: string) => React.ReactNode; headTop?: () => React.ReactNode;
  pomL?: () => React.ReactNode; pomR?: () => React.ReactNode;
  acc: (a: Acc) => React.ReactNode;
  idle: { eyes: EyeV; mouth: MouthV };
};

const limb = (a: Pt, b: Pt, color: string, w: number, hand?: string, hr = 9) => (
  <G>
    <Line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={w} strokeLinecap="round" />
    {hand && <Circle cx={b[0]} cy={b[1] + 1} r={hr} fill={hand} />}
  </G>
);

/* Puri-kun: wide pill head, yellow top and white muzzle band, round ears, big brown nose,
   yellow tee, roomy blue trousers. */
const PU = { fur: '#FBE07A', furShade: '#F2CF5B', muzzle: '#FFFFFF', nose: '#4A3A33', tee: '#FFD000', teeShade: '#F2B600', pants: '#3A8DDA', pantsShade: '#2272C3' };
export const PURI: RigDef = {
  piv: { body: [100, 194], head: [100, 146], armL: [62, 150], armR: [138, 150], legL: [80, 186], legR: [120, 186] },
  eye: { l: [80, 90], r: [120, 90], s: 5.6, kind: 'dot', lid: PU.fur, ink: INK }, mouth: [100, 121, 7], fxTop: [100, 46],
  idle: { eyes: 'open', mouth: 'smile' },
  legL: () => <Ellipse cx={80} cy={192} rx={13} ry={6} fill={PU.fur} />,
  legR: () => <Ellipse cx={120} cy={192} rx={13} ry={6} fill={PU.fur} />,
  torso: () => (
    <G>
      <Rect x={50} y={144} width={22} height={18} rx={8} fill={PU.teeShade} />
      <Rect x={128} y={144} width={22} height={18} rx={8} fill={PU.teeShade} />
      <Path d="M62 146 Q62 140 72 140 H128 Q138 140 138 146 L140 170 H60 Z" fill={PU.tee} />
      <Path d="M58 166 H142 V178 Q142 193 127 193 Q112 193 106 184 Q100 179 94 184 Q88 193 73 193 Q58 193 58 178 Z" fill={PU.pants} />
      <Path d="M58 180 Q58 193 73 193 Q88 193 94 184 Q100 179 106 184 Q112 193 127 193 Q142 193 142 180 Q138 188 127 188 Q114 188 106 180 Q100 176 94 180 Q86 188 73 188 Q62 188 58 180Z" fill={PU.pantsShade} />
    </G>
  ),
  armL: p => <G>{limb([62, 150], [46, 174], PU.fur, 17, PU.fur, 9)}{handProp(p, [46, 175], [-16, 24])}</G>,
  armR: p => <G>{limb([138, 150], [154, 174], PU.fur, 17, PU.fur, 9)}{handProp(p, [154, 175], [16, 24])}</G>,
  head: tint => (
    <G>
      <Circle cx={60} cy={54} r={17} fill={tint || PU.fur} />
      <Circle cx={140} cy={54} r={17} fill={tint || PU.fur} />
      <Rect x={20} y={56} width={160} height={92} rx={46} fill={tint || PU.fur} />
      <Path d="M20 102 H180 A46 46 0 0 1 134 148 H66 A46 46 0 0 1 20 102 Z" fill={PU.muzzle} />
      <Path d="M30 128 Q40 148 66 148 H134 Q160 148 170 128 Q156 142 134 142 H66 Q44 142 30 128Z" fill="#EEF0F5" />
      <Rect x={76} y={93} width={48} height={22} rx={11} fill={PU.nose} />
      <Rect x={84} y={96} width={14} height={5} rx={2.5} fill="#7A6457" />
    </G>
  ),
  acc: a => headAcc(a, [100, 56], 160),
};

/* TAKU-kun: pale blue husky, pointy ears with yellow insides, cheek fluff, big white muzzle,
   round glasses, purple tee, black backpack, white mitten hands. */
const TK = { fur: '#B9DCE6', furShade: '#9CC6D4', ear: '#F6D46B', white: '#FFFFFF', tee: '#C59BEA', teeShade: '#AE82DC', pack: '#2E2C33', glass: '#2B2833' };
export const TAKU: RigDef = {
  piv: { body: [100, 194], head: [100, 130], armL: [68, 138], armR: [132, 138], legL: [86, 170], legR: [114, 170], tail: [136, 166] },
  eye: { l: [80, 82], r: [120, 82], s: 8, kind: 'normal', lid: TK.fur }, mouth: [100, 108, 8], fxTop: [100, 30],
  idle: { eyes: 'happy', mouth: 'tongue' },
  back: () => <G><Rect x={54} y={126} width={92} height={58} rx={22} fill={TK.pack} /></G>,
  tail: () => <G><Path d="M134 172 C162 176 184 158 182 130 C174 146 160 156 138 158 Z" fill={TK.fur} /><Path d="M182 130 C186 142 182 152 174 158 C170 148 174 138 182 130 Z" fill={TK.furShade} /></G>,
  legL: () => <G><Rect x={77} y={164} width={19} height={24} rx={9} fill={TK.fur} /><Ellipse cx={86} cy={190} rx={14} ry={7} fill={TK.white} /></G>,
  legR: () => <G><Rect x={104} y={164} width={19} height={24} rx={9} fill={TK.fur} /><Ellipse cx={114} cy={190} rx={14} ry={7} fill={TK.white} /></G>,
  torso: () => (
    <G>
      <Ellipse cx={100} cy={166} rx={30} ry={10} fill={TK.furShade} />
      <Rect x={56} y={130} width={18} height={20} rx={8} fill={TK.teeShade} />
      <Rect x={126} y={130} width={18} height={20} rx={8} fill={TK.teeShade} />
      <Path d="M68 132 Q68 126 76 126 H124 Q132 126 132 132 L134 160 Q134 168 126 168 H74 Q66 168 66 160 Z" fill={TK.tee} />
      <Path d="M66 156 H134 V160 Q134 168 126 168 H74 Q66 168 66 160 Z" fill={TK.teeShade} />
      <Path d="M70 128 Q64 146 70 164" stroke={TK.pack} strokeWidth={7} strokeLinecap="round" fill="none" />
      <Path d="M130 128 Q136 146 130 164" stroke={TK.pack} strokeWidth={7} strokeLinecap="round" fill="none" />
    </G>
  ),
  armL: p => <G>{limb([68, 138], [54, 162], TK.fur, 17, TK.white, 11)}{handProp(p, [54, 163], [-14, 24])}</G>,
  armR: p => <G>{limb([132, 138], [146, 162], TK.fur, 17, TK.white, 11)}{handProp(p, [146, 163], [14, 24])}</G>,
  head: () => (
    <G>
      <Path d="M52 74 L64 18 L100 50 Z" fill={TK.fur} stroke={TK.fur} strokeWidth={12} strokeLinejoin="round" />
      <Path d="M148 74 L136 18 L100 50 Z" fill={TK.fur} stroke={TK.fur} strokeWidth={12} strokeLinejoin="round" />
      <Path d="M66 54 L70 30 L86 46 Z" fill={TK.ear} stroke={TK.ear} strokeWidth={6} strokeLinejoin="round" />
      <Path d="M134 54 L130 30 L114 46 Z" fill={TK.ear} stroke={TK.ear} strokeWidth={6} strokeLinejoin="round" />
      {[[44, 84, 13], [40, 100, 12], [46, 114, 11], [156, 84, 13], [160, 100, 12], [154, 114, 11]].map(([x, y, r], i) => <Circle key={i} cx={x} cy={y} r={r} fill={TK.fur} />)}
      <Ellipse cx={100} cy={86} rx={56} ry={50} fill={TK.fur} />
      <Ellipse cx={100} cy={114} rx={34} ry={25} fill={TK.white} />
      <Ellipse cx={80} cy={56} rx={7} ry={5} fill={TK.white} />
      <Ellipse cx={120} cy={56} rx={7} ry={5} fill={TK.white} />
    </G>
  ),
  headTop: () => (
    <G>
      <Circle cx={80} cy={82} r={18} stroke={TK.glass} strokeWidth={4.5} fill="none" />
      <Circle cx={120} cy={82} r={18} stroke={TK.glass} strokeWidth={4.5} fill="none" />
      <Path d="M97 80 Q100 77 103 80" stroke={TK.glass} strokeWidth={4.5} strokeLinecap="round" fill="none" />
      <Ellipse cx={100} cy={100} rx={8} ry={5.5} fill={TK.glass} />
      <Ellipse cx={97.5} cy={98.5} rx={2.4} ry={1.5} fill="#FFFFFF" />
    </G>
  ),
  acc: a => headAcc(a, [100, 38], 124),
};

/* Momo-chan: pale pink rounded head, cloud pom pigtails, red bow, huge glossy eyes with lashes,
   red A-line dress, stubby arms and legs. */
const MO = { skin: '#F9D4DC', skinShade: '#F2BDCA', pom: '#F59AC0', pomShade: '#EA7FAE', bow: '#E24A3B', bowKnot: '#F2604F', dress: '#F2413A', dressShade: '#D9302B', ink: '#4A2238' };
export const MOMO: RigDef = {
  piv: { body: [100, 196], head: [100, 140], armL: [80, 150], armR: [120, 150], legL: [90, 178], legR: [110, 178], pomL: [58, 78], pomR: [142, 78] },
  eye: { l: [77, 98], r: [123, 98], s: 15, kind: 'big', lid: MO.skin, ink: MO.ink }, mouth: [100, 117, 6], mouthInk: '#B5607C', fxTop: [100, 26],
  idle: { eyes: 'open', mouth: 'cat' },
  legL: () => <Rect x={84} y={172} width={13} height={24} rx={6.5} fill={MO.skin} />,
  legR: () => <Rect x={103} y={172} width={13} height={24} rx={6.5} fill={MO.skin} />,
  torso: () => (
    <G>
      <Path d="M80 138 L120 138 L140 176 Q142 182 135 182 L65 182 Q58 182 60 176 Z" fill={MO.dress} />
      <Path d="M63 172 L137 172 L140 176 Q142 182 135 182 L65 182 Q58 182 60 176 Z" fill={MO.dressShade} />
    </G>
  ),
  armL: p => <G>{limb([82, 150], [62, 162], MO.skin, 15, MO.skin, 7.5)}{handProp(p, [62, 163], [-20, 12])}</G>,
  armR: p => <G>{limb([118, 150], [138, 162], MO.skin, 15, MO.skin, 7.5)}{handProp(p, [138, 163], [20, 12])}</G>,
  pomL: () => <G>{[[44, 70, 20], [30, 88, 19], [48, 104, 20], [62, 84, 16]].map(([x, y, r], i) => <Circle key={i} cx={x} cy={y} r={r} fill={MO.pom} />)}<Circle cx={36} cy={98} r={9} fill={MO.pomShade} /></G>,
  pomR: () => <G>{[[156, 70, 20], [170, 88, 19], [152, 104, 20], [138, 84, 16]].map(([x, y, r], i) => <Circle key={i} cx={x} cy={y} r={r} fill={MO.pom} />)}<Circle cx={164} cy={98} r={9} fill={MO.pomShade} /></G>,
  head: () => (
    <G>
      <Rect x={44} y={44} width={112} height={98} rx={46} fill={MO.skin} />
      <Path d="M46 112 Q52 142 92 142 H108 Q148 142 154 112 Q146 134 108 136 H92 Q54 134 46 112Z" fill={MO.skinShade} />
      <Path d="M100 42 L70 20 Q58 36 70 56 Z" fill={MO.bow} stroke={MO.bow} strokeWidth={8} strokeLinejoin="round" />
      <Path d="M100 42 L130 20 Q142 36 130 56 Z" fill={MO.bow} stroke={MO.bow} strokeWidth={8} strokeLinejoin="round" />
      <Circle cx={100} cy={42} r={11} fill={MO.bowKnot} />
      <Ellipse cx={100} cy={109} rx={6.5} ry={4.5} fill={MO.ink} />
    </G>
  ),
  acc: a => headAcc(a, [138, 40], 112),
};

export const RIGS: Record<Who, RigDef> = { taku: TAKU, momo: MOMO, puri: PURI };
