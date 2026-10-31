// Modular 2D rig: body, tail, legs, torso, arms, head, eyes, pupils, lids and mouth are separate
// layers stacked on one 200×200 canvas. Each layer turns around its own joint. A state is a
// face, props, effects and a joint program built from cartoon principles: anticipation,
// squash and stretch, overshoot and follow-through.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, SharedValue, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Ellipse, G } from 'react-native-svg';
import { Acc, EyeOverlay, EyeV, Eyes, Mouth, MouthV, Prop, Pupils, RIGS } from './parts';
import { FxKind, MascotFx } from './Fx';
import type { Who } from '@/theme';
import { useGame } from '@/store/game';
import { haptic } from '@/store/fx';

export type MState =
  | 'idle' | 'talk' | 'happy' | 'wave' | 'excited' | 'cheer' | 'celebrate' | 'lively' | 'love' | 'dance'
  | 'sad' | 'cry' | 'sleepy' | 'think' | 'watch' | 'smug' | 'shocked'
  | 'run' | 'charge' | 'wotagei' | 'sparkle' | 'gg' | 'victory' | 'rage' | 'console' | 'dizzy';

export const STATES: Record<Who, MState[]> = {
  taku: ['idle', 'happy', 'wave', 'talk', 'wotagei', 'dance', 'love', 'excited', 'cheer', 'think', 'watch', 'smug', 'shocked', 'sad', 'cry', 'sleepy', 'dizzy', 'run', 'charge'],
  momo: ['idle', 'happy', 'wave', 'talk', 'sparkle', 'celebrate', 'lively', 'love', 'dance', 'excited', 'cheer', 'watch', 'smug', 'shocked', 'sad', 'cry', 'sleepy', 'run', 'charge'],
  puri: ['idle', 'happy', 'gg', 'victory', 'console', 'talk', 'dance', 'love', 'excited', 'cheer', 'think', 'watch', 'smug', 'shocked', 'rage', 'sad', 'cry', 'sleepy', 'dizzy', 'run', 'charge'],
};

type Look = { eyes?: EyeV; mouth?: MouthV; propL?: Prop; propR?: Prop; fx?: FxKind[] };
const LOOK: Record<MState, Look> = {
  idle: {}, talk: {},
  happy: { eyes: 'happy', mouth: 'grin', fx: ['diamonds'] },
  wave: { eyes: 'happy', mouth: 'smile' },
  excited: { eyes: 'sparkle', mouth: 'open', fx: ['diamonds', 'spark'] },
  cheer: { eyes: 'happy', mouth: 'shout', fx: ['diamonds', 'spark'] },
  celebrate: { eyes: 'happy', mouth: 'open', propR: 'mic', fx: ['notes', 'diamonds'] },
  lively: { eyes: 'sparkle', mouth: 'grin', fx: ['hearts', 'spark'] },
  love: { eyes: 'heart', mouth: 'grin', fx: ['hearts'] },
  dance: { eyes: 'happy', mouth: 'open', fx: ['notes'] },
  sad: { eyes: 'sad', mouth: 'wobble', fx: ['sweat'] },
  cry: { eyes: 'cry', mouth: 'wobble', fx: ['tears'] },
  sleepy: { eyes: 'closed', mouth: 'o', fx: ['zzz'] },
  think: { eyes: 'side', mouth: 'flat', fx: ['question'] },
  watch: { eyes: 'wide', mouth: 'o', fx: ['sweat'] },
  smug: { eyes: 'lid', mouth: 'smirk' },
  shocked: { eyes: 'wide', mouth: 'shout', fx: ['exclaim'] },
  run: { eyes: 'happy', mouth: 'open' },
  charge: { eyes: 'angry', mouth: 'grin', fx: ['spark'] },
  wotagei: { eyes: 'happy', mouth: 'open', propL: 'glowsticks', propR: 'glowsticks', fx: ['notes'] },
  sparkle: { eyes: 'wink', mouth: 'grin', fx: ['burst', 'diamonds'] },
  gg: { eyes: 'happy', mouth: 'smirk', propR: 'gg' },
  victory: { eyes: 'sparkle', mouth: 'shout', fx: ['trophy', 'diamonds'] },
  rage: { eyes: 'angry', mouth: 'rage', propL: 'controller', fx: ['steam'] },
  console: { eyes: 'wide', mouth: 'console', fx: ['spark'] },
  dizzy: { eyes: 'dizzy', mouth: 'wobble', fx: ['swirl'] },
};

type J = 'bx' | 'by' | 'brot' | 'bsx' | 'bsy' | 'hrot' | 'hty' | 'al' | 'ar' | 'll' | 'lr' | 'tail' | 'blink' | 'px' | 'py' | 'poml' | 'pomr';
type Joints = Record<J, SharedValue<number>>;

const sine = Easing.inOut(Easing.sin);
const out = Easing.out(Easing.quad), inn = Easing.in(Easing.quad), back = Easing.out(Easing.back(2));
const tm = (v: number, ms: number, e = sine) => withTiming(v, { duration: ms, easing: e });
const loop = (a: number, b: number, ms: number, delay = 0) => withDelay(delay, withRepeat(withSequence(tm(a, ms), tm(b, ms)), -1, false));
const to = (v: number, ms = 240) => withTiming(v, { duration: ms, easing: back });
const rep = (...steps: any[]) => withRepeat(withSequence(...steps), -1, false);

/** a full cartoon jump: crouch, stretch up, hang, fall, squash on landing, settle */
function jump(j: Joints, h: number, rest = 420, tilt = 0) {
  j.by.value = rep(tm(7, 130, out), tm(-h, 260, out), tm(-h - 4, 90), tm(0, 230, inn), tm(5, 80, out), tm(0, 160, back), tm(0, rest));
  j.bsy.value = rep(tm(0.84, 130, out), tm(1.14, 260, out), tm(1.04, 90), tm(1, 230), tm(0.82, 80, out), tm(1, 160, back), tm(1, rest));
  j.bsx.value = rep(tm(1.14, 130, out), tm(0.9, 260, out), tm(0.97, 90), tm(1, 230), tm(1.16, 80, out), tm(1, 160, back), tm(1, rest));
  j.ll.value = rep(tm(0, 130), tm(-22, 260), tm(-26, 90), tm(0, 230), tm(0, 240 + rest));
  j.lr.value = rep(tm(0, 130), tm(22, 260), tm(26, 90), tm(0, 230), tm(0, 240 + rest));
  if (tilt) j.brot.value = rep(tm(0, 130), tm(tilt, 260), tm(-tilt * 0.4, 320), tm(0, 240 + rest));
}
/** Duolingo-style wing flap: arms beat wide and fast */
const flap = (j: Joints, lo: number, hi: number, ms: number) => { j.al.value = loop(hi, lo, ms); j.ar.value = loop(-hi, -lo, ms); };

function program(j: Joints, s: MState, who: Who) {
  Object.values(j).forEach(v => cancelAnimation(v));
  j.bx.value = to(0); j.by.value = to(0); j.brot.value = to(0); j.bsx.value = to(1); j.bsy.value = to(1); j.hty.value = to(0); j.hrot.value = to(0);
  j.al.value = to(0); j.ar.value = to(0); j.ll.value = to(0); j.lr.value = to(0); j.px.value = to(0); j.py.value = to(0); j.blink.value = 1;
  const breathe = (amp = 4, ms = 1300) => { j.by.value = loop(-amp, 0, ms); j.bsy.value = loop(1.02, 0.99, ms); j.bsx.value = loop(0.99, 1.01, ms); };
  const blink = (gap = 2600) => { j.blink.value = rep(withDelay(gap, tm(0.08, 70, out)), tm(1, 110, out)); };
  const glance = () => { j.px.value = rep(withDelay(1800, tm(3, 160, out)), withDelay(800, tm(-3, 200, out)), withDelay(900, tm(0, 160, out))); };
  const fast = ['excited', 'lively', 'happy', 'wotagei', 'dance', 'cheer', 'celebrate', 'victory'].includes(s);
  j.tail.value = loop(18, -8, fast ? 160 : 520);
  j.poml.value = loop(8, -5, fast ? 180 : 800);
  j.pomr.value = loop(-8, 5, fast ? 180 : 800, 90);

  switch (s) {
    case 'idle':
      breathe(); blink(); glance();
      j.al.value = loop(6, -2, 1300); j.ar.value = loop(-6, 2, 1300);
      j.hrot.value = rep(withDelay(3200, tm(-6, 420)), withDelay(600, tm(4, 500)), tm(0, 420));
      break;
    case 'talk':
      breathe(3, 900); blink(1800);
      j.hrot.value = loop(4, -4, 380); j.hty.value = loop(-2, 1, 190);
      j.ar.value = loop(-30, -8, 420);
      break;
    case 'happy':
      jump(j, 32, 380); blink(3000);
      j.al.value = rep(tm(-10, 130), tm(120, 200, out), tm(80, 120), tm(120, 120), tm(10, 300, out), tm(0, 380));
      j.ar.value = rep(tm(10, 130), tm(-120, 200, out), tm(-80, 120), tm(-120, 120), tm(-10, 300, out), tm(0, 380));
      break;
    case 'wave':
      breathe(); blink();
      j.brot.value = loop(-4, 3, 700);
      j.hrot.value = loop(6, -2, 700);
      j.ar.value = withSequence(to(-140, 260), rep(tm(-175, 210), tm(-120, 210)));
      j.al.value = loop(8, 0, 700);
      break;
    case 'excited': case 'lively':
      j.by.value = loop(-14, 0, 170); j.bsy.value = loop(1.06, 0.92, 170); j.bsx.value = loop(0.95, 1.07, 170);
      flap(j, 60, 150, 140); blink(2000);
      j.hrot.value = loop(5, -5, 340);
      break;
    case 'cheer':
      jump(j, 38, 160, 6);
      j.al.value = loop(150, 125, 160); j.ar.value = loop(-150, -125, 160);
      break;
    case 'celebrate':
      jump(j, 24, 200, -10);
      j.al.value = loop(130, 90, 230); j.ar.value = to(-150, 300);
      j.hrot.value = loop(8, -8, 460);
      break;
    case 'love':
      j.brot.value = loop(-8, 8, 900); j.bx.value = loop(-5, 5, 900);
      j.hrot.value = loop(10, -10, 900); j.by.value = loop(-4, 0, 450);
      j.al.value = loop(-62, -52, 450); j.ar.value = loop(62, 52, 450);
      break;
    case 'dance':
      j.brot.value = loop(-14, 14, 300);
      j.by.value = loop(-14, 0, 150); j.bsy.value = loop(1.05, 0.94, 150);
      j.al.value = loop(150, 30, 300); j.ar.value = loop(-30, -150, 300);
      j.ll.value = loop(-18, 6, 300); j.lr.value = loop(-6, 18, 300);
      j.hrot.value = loop(-10, 10, 300);
      break;
    case 'sad':
      j.bsy.value = to(0.92, 500); j.bsx.value = to(1.05, 500); j.by.value = to(4, 500);
      j.hty.value = to(7, 500); j.hrot.value = loop(-10, -6, 1800);
      j.brot.value = loop(-2, 2, 1800);
      j.al.value = to(-14); j.ar.value = to(14); j.py.value = to(2);
      break;
    case 'cry':
      j.bsy.value = to(0.9, 400); j.bsx.value = to(1.07, 400);
      j.by.value = rep(tm(5, 90), tm(2, 90)); // sobbing shudder
      j.hty.value = rep(tm(8, 90), tm(5, 90)); j.hrot.value = loop(-5, 5, 700);
      j.al.value = loop(-70, -55, 180); j.ar.value = loop(70, 55, 180); // hands up to the face
      break;
    case 'sleepy':
      j.brot.value = loop(-4, 4, 1900); j.by.value = loop(3, 0, 1900);
      j.hrot.value = rep(tm(16, 1400), tm(18, 500), tm(4, 260, back), tm(6, 900)); // nodding off, jolting awake
      j.hty.value = loop(6, 2, 1300); j.al.value = to(-6); j.ar.value = to(6);
      break;
    case 'think':
      breathe(2, 1500);
      j.hrot.value = loop(-12, -6, 1100); j.ar.value = to(-105, 360);
      j.px.value = to(3); j.py.value = loop(-3, -1, 900);
      j.brot.value = to(-3);
      break;
    case 'watch':
      j.bx.value = loop(-6, 6, 480); j.brot.value = loop(-5, 5, 480);
      j.px.value = rep(tm(-3, 120, out), withDelay(500, tm(3, 120, out)), withDelay(500, tm(-3, 120, out)));
      j.al.value = to(22); j.ar.value = to(-22); blink(1800);
      break;
    case 'smug':
      j.brot.value = loop(-5, -2, 1600); j.by.value = loop(-2, 0, 1600);
      j.hrot.value = to(-6, 500); j.px.value = to(2);
      j.al.value = to(-35, 400); j.ar.value = loop(-12, -4, 1600);
      break;
    case 'shocked':
      j.bsy.value = withSequence(tm(0.8, 120, out), tm(1.2, 180, back), rep(tm(1.15, 60), tm(1.18, 60)));
      j.bsx.value = withSequence(tm(1.15, 120, out), tm(0.88, 180, back), rep(tm(0.9, 60), tm(0.88, 60)));
      j.by.value = withSequence(tm(4, 120), tm(-14, 180, out), tm(-10, 300));
      j.al.value = to(80, 200); j.ar.value = to(-80, 200);
      j.bx.value = rep(tm(-2, 50), tm(2, 50));
      break;
    case 'run':
      j.brot.value = to(10); j.by.value = loop(-10, 0, 140); j.bsy.value = loop(1.05, 0.95, 140);
      j.ll.value = loop(-32, 32, 140); j.lr.value = loop(32, -32, 140);
      j.al.value = loop(-45, 45, 140); j.ar.value = loop(45, -45, 140);
      break;
    case 'charge':
      j.bsx.value = loop(1.1, 0.94, 100); j.bsy.value = loop(0.9, 1.06, 100); j.bx.value = loop(-2, 2, 50);
      j.al.value = to(-60); j.ar.value = to(60); j.by.value = to(4);
      break;
    case 'wotagei':
      j.brot.value = loop(-8, 8, 240); j.by.value = loop(-8, 0, 120);
      j.al.value = loop(40, 175, 240); j.ar.value = loop(-175, -40, 240);
      j.hrot.value = loop(6, -6, 240); blink(2200);
      break;
    case 'sparkle':
      jump(j, 26, 700, -6); j.ar.value = to(-135, 260); j.al.value = loop(14, -4, 500);
      j.hrot.value = to(-8, 300);
      break;
    case 'gg':
      jump(j, 16, 900); j.ar.value = to(-150, 300); j.al.value = to(-30, 300); blink();
      break;
    case 'victory':
      jump(j, 40, 200);
      j.al.value = loop(160, 130, 210); j.ar.value = loop(-160, -130, 210);
      break;
    case 'rage':
      j.bx.value = rep(tm(-4, 45), tm(4, 45)); j.by.value = loop(-6, 0, 160);
      flap(j, -20, 90, 110); j.hrot.value = loop(-4, 4, 90);
      j.bsy.value = loop(1.04, 0.96, 160);
      break;
    case 'console':
      jump(j, 14, 900); j.hrot.value = loop(-6, 6, 450); j.al.value = to(40); j.ar.value = to(-40);
      break;
    case 'dizzy':
      j.brot.value = loop(-12, 12, 520); j.bx.value = loop(-6, 6, 520); j.hrot.value = loop(10, -10, 520);
      j.al.value = loop(30, -10, 520); j.ar.value = loop(10, -30, 520);
      break;
  }
}

/** joints for a still pose (static mascots and reduced motion) */
const POSE: Partial<Record<MState, Partial<Record<'al' | 'ar' | 'hrot' | 'brot', number>>>> = {
  wave: { ar: -155, hrot: 4 }, cheer: { al: 140, ar: -140 }, celebrate: { al: 110, ar: -150, brot: -6 }, lively: { al: 120, ar: -120 }, excited: { al: 110, ar: -110 },
  victory: { al: 150, ar: -150 }, wotagei: { al: 160, ar: -60 }, sparkle: { ar: -135, hrot: -8 }, gg: { ar: -150, al: -30 }, think: { ar: -105, hrot: -10 },
  sad: { hrot: -8, al: -14, ar: 14 }, cry: { al: -62, ar: 62 }, sleepy: { hrot: 14 }, rage: { ar: -100, al: 60 }, charge: { al: -60, ar: 60 },
  love: { al: -58, ar: 58, hrot: 8 }, dance: { al: 140, ar: -40, brot: 10 }, smug: { al: -35, hrot: -6, brot: -4 }, shocked: { al: 80, ar: -80 }, happy: { al: 110, ar: -110 },
};

type Props = { who: Who; state?: MState; size?: number; acc?: Acc; style?: ViewStyle; onPress?: () => void; still?: boolean; flip?: boolean };

export function Mascot({ who, state = 'idle', size = 160, acc = null, style, onPress, still, flip }: Props) {
  const motionOn = useGame(s => s.settings.motion);
  const motion = motionOn && !still;
  const R = RIGS[who];
  const look = LOOK[state];
  const eyes = look.eyes || R.idle.eyes;
  const [talkOpen, setTalkOpen] = useState(false);
  useEffect(() => {
    if (state !== 'talk' || !motion) return;
    const id = setInterval(() => setTalkOpen(o => !o), 160);
    return () => clearInterval(id);
  }, [state, motion]);
  const mouth: MouthV = state === 'talk' ? (talkOpen ? 'open' : 'smile') : look.mouth || R.idle.mouth;
  const tint = state === 'rage' && who === 'puri' ? '#FFA36C' : undefined;
  const pose = POSE[state] || {};

  const j: Joints = {
    bx: useSharedValue(0), by: useSharedValue(0), brot: useSharedValue(pose.brot || 0), bsx: useSharedValue(1), bsy: useSharedValue(1),
    hrot: useSharedValue(pose.hrot || 0), hty: useSharedValue(0), al: useSharedValue(pose.al || 0), ar: useSharedValue(pose.ar || 0),
    ll: useSharedValue(0), lr: useSharedValue(0), tail: useSharedValue(0), blink: useSharedValue(1), px: useSharedValue(0), py: useSharedValue(0),
    poml: useSharedValue(0), pomr: useSharedValue(0),
  };
  useEffect(() => {
    if (motion) program(j, state, who);
    else {
      Object.values(j).forEach(v => cancelAnimation(v));
      j.al.value = pose.al || 0; j.ar.value = pose.ar || 0; j.hrot.value = pose.hrot || 0; j.brot.value = pose.brot || 0;
      j.by.value = 0; j.bx.value = 0; j.bsx.value = 1; j.bsy.value = 1; j.blink.value = 1; j.hty.value = 0; j.px.value = 0; j.py.value = 0;
    }
  }, [state, motion, who]);

  const sBody = useAnimatedStyle((): any => ({ transform: [{ translateX: j.bx.value }, { translateY: j.by.value * (size / 200) }, { rotate: `${j.brot.value}deg` }, { scaleX: j.bsx.value }, { scaleY: j.bsy.value }] }));
  const sHead = useAnimatedStyle((): any => ({ transform: [{ translateY: j.hty.value * (size / 200) }, { rotate: `${j.hrot.value}deg` }] }));
  const sAL = useAnimatedStyle((): any => ({ transform: [{ rotate: `${j.al.value}deg` }] }));
  const sAR = useAnimatedStyle((): any => ({ transform: [{ rotate: `${j.ar.value}deg` }] }));
  const sLL = useAnimatedStyle((): any => ({ transform: [{ rotate: `${j.ll.value}deg` }] }));
  const sLR = useAnimatedStyle((): any => ({ transform: [{ rotate: `${j.lr.value}deg` }] }));
  const sTail = useAnimatedStyle((): any => ({ transform: [{ rotate: `${j.tail.value}deg` }] }));
  const sPL = useAnimatedStyle((): any => ({ transform: [{ rotate: `${j.poml.value}deg` }] }));
  const sPR = useAnimatedStyle((): any => ({ transform: [{ rotate: `${j.pomr.value}deg` }] }));
  const sEyes = useAnimatedStyle((): any => ({ transform: [{ scaleY: j.blink.value }] }));
  const sPupils = useAnimatedStyle((): any => ({ transform: [{ translateX: j.px.value * (size / 200) }, { translateY: j.py.value * (size / 200) }] }));

  const o = (p: [number, number]) => `${p[0] / 2}% ${p[1] / 2}%`;
  const L = (st: any, origin: [number, number] | null, node: React.ReactNode) => (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, origin && { transformOrigin: o(origin) }, st]}>
      <Svg width="100%" height="100%" viewBox="0 0 200 200">{node}</Svg>
    </Animated.View>
  );
  const eyeMid: [number, number] = [100, (R.eye.l[1] + R.eye.r[1]) / 2];

  const body = (
    <View style={[{ width: size, height: size }, flip && { transform: [{ scaleX: -1 }] }, style]}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: 0.22 }]}>
        <Svg width="100%" height="100%" viewBox="0 0 200 200"><G><EllipseShadow /></G></Svg>
      </View>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { transformOrigin: o(R.piv.body) }, sBody]}>
        {R.back && L(null, null, R.back())}
        {R.tail && L(sTail, R.piv.tail!, R.tail())}
        {L(sLL, R.piv.legL, R.legL())}
        {L(sLR, R.piv.legR, R.legR())}
        {L(sAL, R.piv.armL, R.armL(look.propL || null))}
        {L(null, null, R.torso(tint))}
        {L(sAR, R.piv.armR, R.armR(look.propR || null))}
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { transformOrigin: o(R.piv.head) }, sHead]}>
          {R.pomL && L(sPL, R.piv.pomL!, R.pomL())}
          {R.pomR && L(sPR, R.piv.pomR!, R.pomR())}
          <Svg style={StyleSheet.absoluteFill} viewBox="0 0 200 200">{R.head(tint)}</Svg>
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { transformOrigin: o(eyeMid) }, sEyes]}>
            <Svg style={StyleSheet.absoluteFill} viewBox="0 0 200 200"><Eyes g={R.eye} v={eyes} /></Svg>
            <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, sPupils]}>
              <Svg style={StyleSheet.absoluteFill} viewBox="0 0 200 200"><Pupils g={R.eye} v={eyes} /></Svg>
            </Animated.View>
            <Svg style={StyleSheet.absoluteFill} viewBox="0 0 200 200"><EyeOverlay g={{ ...R.eye, lid: tint || R.eye.lid }} v={eyes} /></Svg>
          </Animated.View>
          <Svg style={StyleSheet.absoluteFill} viewBox="0 0 200 200"><Mouth at={R.mouth} v={mouth} ink={R.mouthInk} />{R.headTop?.()}{R.acc(acc)}</Svg>
        </Animated.View>
      </Animated.View>
      {look.fx && <MascotFx kinds={look.fx} top={R.fxTop} motion={motion} eyes={[R.eye.l, R.eye.r]} />}
    </View>
  );
  if (!onPress) return body;
  return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${who} mascot`}>{body}</Pressable>;
}

function EllipseShadow() {
  return <Ellipse cx={100} cy={197} rx={52} ry={4} fill="#000000" />;
}

/** single-SVG still mascot for small tiles, chips and lists */
export function MascotStill({ who, state = 'idle', size = 48, acc = null }: { who: Who; state?: MState; size?: number; acc?: Acc }) {
  const R = RIGS[who], look = LOOK[state], pose = POSE[state] || {};
  const rot = (a: number | undefined, p: [number, number]) => (a ? `rotate(${a} ${p[0]} ${p[1]})` : undefined);
  const eyes = look.eyes || R.idle.eyes;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <G transform={rot(pose.brot, R.piv.body)}>
          {R.back?.()}
          {R.tail && <G>{R.tail()}</G>}
          {R.legL()}{R.legR()}
          <G transform={rot(pose.al, R.piv.armL)}>{R.armL(look.propL || null)}</G>
          {R.torso()}
          <G transform={rot(pose.ar, R.piv.armR)}>{R.armR(look.propR || null)}</G>
          <G transform={rot(pose.hrot, R.piv.head)}>
            {R.pomL?.()}{R.pomR?.()}{R.head()}
            <Eyes g={R.eye} v={eyes} /><Pupils g={R.eye} v={eyes} /><EyeOverlay g={R.eye} v={eyes} />
            <Mouth at={R.mouth} v={look.mouth || R.idle.mouth} ink={R.mouthInk} />{R.headTop?.()}{R.acc(acc)}
          </G>
        </G>
      </Svg>
    </View>
  );
}

/** a mascot that plays a one-shot reaction on tap and returns to its base state */
export function PokeMascot({ who, base = 'idle', size = 160, acc = null, reactions, onPoke, style }: { who: Who; base?: MState; size?: number; acc?: Acc; reactions?: MState[]; onPoke?: (s: MState) => void; style?: ViewStyle }) {
  const [s, setS] = useState<MState>(base);
  const t = useRef<any>(null);
  useEffect(() => { setS(base); }, [base]);
  useEffect(() => () => clearTimeout(t.current), []);
  const pool = useMemo(() => reactions || ({
    taku: ['happy', 'wotagei', 'love', 'dance', 'shocked'],
    momo: ['sparkle', 'happy', 'love', 'dance', 'shocked'],
    puri: ['gg', 'console', 'happy', 'smug', 'shocked'],
  } as Record<Who, MState[]>)[who], [who, reactions]);
  const poke = () => {
    haptic.tap();
    const next = pool[Math.floor(Math.random() * pool.length)];
    setS(next); onPoke?.(next);
    clearTimeout(t.current);
    t.current = setTimeout(() => setS(base), next === 'console' ? 1800 : 1500);
  };
  return <Mascot who={who} state={s} size={size} acc={acc} onPress={poke} style={style} />;
}
