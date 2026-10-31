// Momo's capsule machine: pick a tier, turn the handle, tap the capsule three times, reveal.
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, FadeOut, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming, ZoomIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F, Rarity, themed } from '@/theme';
import { useGame } from '@/store/game';
import { haptic, useFx } from '@/store/fx';
import { DUPE_ORA, Prize, TIERS, TierId } from '@/content/catalog';
import { rankIdx } from '@/content/ranks';
import { fmt } from '@/lib/time';
import { Mascot, MState } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { CapsuleArt, Machine } from '@/art/Machine';
import { Bar, Btn, Bubble, H, Pill, Press, Row, Segmented, T } from '@/ui/kit';
import { BackBar, OraChip, goBack } from '@/ui/game';
import { Confetti, Rays } from '@/ui/overlays';
import { PrizeArt, RARITY } from '@/screens/PrizeArt';

type Phase = 'idle' | 'turning' | 'crack' | 'reveal';

export default function Gacha() {
  const g = useGame();
  const router = useRouter();
  const ins = useSafeAreaInsets();
  const setBusy = useFx(s => s.setBusy);
  const [tier, setTier] = useState<TierId>(g.tickets.rare > 0 && g.tickets.std === 0 ? 'rare' : 'std');
  const [phase, setPhase] = useState<Phase>('idle');
  const [taps, setTaps] = useState(0);
  const [res, setRes] = useState<{ prize: Prize; dupe: boolean } | null>(null);
  const [momo, setMomo] = useState<MState>('wave');
  const [line, setLine] = useState('Feeling lucky? Turn the handle!');
  const T_ = TIERS[tier];
  const how = g.pullCost(tier);
  const { width, height } = Dimensions.get('window');
  const machineW = Math.min(width * 0.58, (height - 470) * 0.75);

  useEffect(() => { setBusy(true); return () => setBusy(false); }, []);
  useEffect(() => {
    if (phase !== 'idle') return;
    setMomo(how ? 'wave' : 'sad');
    setLine(how ? (tier === 'legend' ? 'Legend capsules! Epic or better, guaranteed.' : tier === 'rare' ? 'Rare+ is where the holo cards live~' : 'Feeling lucky? Turn the handle!') : tier === 'legend' ? 'Legend tickets come from event check-ins and big rank-ups.' : 'Out of tickets… but you can earn one today!');
  }, [tier, phase, how]);

  const turn = () => {
    const r = useGame.getState().pull(tier);
    if (!r) return;
    haptic.medium();
    setRes(r); setTaps(0); tapsRef.current = 0; setPhase('turning'); setMomo('excited'); setLine('Here it comes…!');
    setTimeout(() => { setPhase('crack'); setMomo('watch'); setLine('Tap it! Tap it!'); haptic.heavy(); }, 1400);
  };
  const tapsRef = useRef(0);
  const tap = () => {
    if (phase !== 'crack' || tapsRef.current >= 3) return;
    const n = ++tapsRef.current; setTaps(n);
    haptic.medium();
    if (n >= 3) {
      setTimeout(() => {
        haptic.success();
        setPhase('reveal');
        const high = res!.prize.r === 'epic' || res!.prize.r === 'legendary';
        setMomo(high ? 'celebrate' : 'sparkle');
      }, 260);
    }
  };
  const again = () => { setPhase('idle'); setRes(null); };
  const pityLeft = T_.pity - g.pity[tier];
  const locked = tier === 'rare' && rankIdx(g.power) < 2 && !g.tickets.rare;

  return (
    <View style={{ flex: 1, backgroundColor: C.momoDeep }}>
      <View style={{ paddingTop: ins.top + 10, paddingHorizontal: 16, gap: 10 }}>
        <BackBar title="Capsule machine" sub="Hosted by Momo-chan" right={<OraChip />} />
        <Segmented<TierId> value={tier} onChange={k => phase === 'idle' && setTier(k)} items={(Object.keys(TIERS) as TierId[]).map(k => ({ k, label: TIERS[k].name, sub: `${g.tickets[k]} ticket${g.tickets[k] === 1 ? '' : 's'}` }))} />
        <Row gap={6} style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          {T_.odds.map(([r, p]) => <Pill key={r} color={RARITY[r].soft} text={RARITY[r].deep}>{`${RARITY[r].label} ${p}%`}</Pill>)}
        </Row>
        <Row gap={8}>
          <T size={12} w="black" color={C.momo}>{RARITY[T_.pityR].label} guaranteed in {pityLeft} pull{pityLeft === 1 ? '' : 's'}</T>
          <View style={{ flex: 1 }}><Bar pct={g.pity[tier] / T_.pity} height={8} color={RARITY[T_.pityR].fill} /></View>
        </Row>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
        <Blob seed={'gacha' + tier} color={C.momoSoft} size={width * 0.95} second={T_.color + '30'} style={{ position: 'absolute', top: 0 }} />
        <Machine color={T_.color} tier={tier} turning={phase === 'turning'} width={machineW} />
        <View style={{ position: 'absolute', left: 4, bottom: 0, alignItems: 'flex-start' }}>
          <Bubble text={line} small style={{ maxWidth: 160, marginLeft: 6, marginBottom: -4 }} />
          <Mascot who="momo" state={momo} size={124} />
        </View>
        {phase === 'crack' && res && <DroppedCapsule color={RARITY[res.prize.r].fill} taps={taps} onTap={tap} />}
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: ins.bottom + 14, paddingTop: 10, gap: 8 }}>
        {phase === 'idle' ? (
          how ? (
            <CostButton label="Turn the handle" cost={how === 'ticket' ? `1 ${T_.name} ticket` : how === 'free' ? 'Free weekly pull' : `${fmt(T_.cost)} Ōra`} onPress={turn} />
          ) : (
            <>
              <CostButton label={`No ${T_.name} tickets`} cost={tier === 'legend' ? 'Event check-in' : locked ? 'Senpai rank' : `${fmt(T_.cost)} Ōra`} off />
              <Btn kind="ghost" title={g.day.challenge ? (g.day.boardClaimed ? 'Next ticket: tomorrow\'s check-in' : 'Next ticket: clear today\'s quests') : 'Next ticket: play the Daily Challenge'} onPress={() => (g.day.challenge ? goBack(router) : router.replace({ pathname: '/quiz', params: { mode: 'daily' } }))} />
            </>
          )
        ) : (
          <CostButton label={phase === 'turning' ? 'Turning…' : 'Tap the capsule'} cost={phase === 'crack' ? `${taps}/3` : '···'} off />
        )}
        <Btn small kind="ghost" title={phase === 'idle' ? `Cabinet · ${g.cabinet.length} item${g.cabinet.length === 1 ? '' : 's'}` : 'Cabinet'} disabled={phase !== 'idle'} onPress={() => router.push('/cabinet')} />
      </View>

      {phase === 'reveal' && res && <Reveal res={res} onAgain={again} onCabinet={() => router.push('/cabinet')} canAgain={!!useGame.getState().pullCost(tier)} />}
    </View>
  );
}

function CostButton({ label, cost, onPress, off }: { label: string; cost: string; onPress?: () => void; off?: boolean }) {
  return (
    <Press onPress={onPress} disabled={off && !onPress} style={[styles.split, off && { backgroundColor: C.card2 }]}>
      <H size={18} color={off ? C.mute : C.text} style={{ flex: 1 }}>{label}</H>
      <View style={[styles.cost, off && { backgroundColor: C.card }]}><T w="black" size={13.5} color={off ? C.mute : C.ink}>{cost}</T></View>
    </Press>
  );
}

function DroppedCapsule({ color, taps, onTap }: { color: string; taps: number; onTap: () => void }) {
  const y = useSharedValue(-180), sx = useSharedValue(1), wob = useSharedValue(0);
  useEffect(() => { y.value = withSpring(0, { damping: 7, stiffness: 140 }); }, []);
  useEffect(() => {
    if (!taps) { wob.value = withRepeat(withSequence(withTiming(-4, { duration: 300 }), withTiming(4, { duration: 300 })), -1, true); return; }
    const amp = 6 + taps * 6, sp = Math.max(60, 180 - taps * 40);
    wob.value = withRepeat(withSequence(withTiming(-amp, { duration: sp }), withTiming(amp, { duration: sp })), -1, true);
    sx.value = withSequence(withTiming(1.15, { duration: 80 }), withSpring(1));
  }, [taps]);
  const s = useAnimatedStyle((): any => ({ transform: [{ translateY: y.value }, { rotate: `${wob.value}deg` }, { scale: sx.value }] }));
  return (
    <View style={{ position: 'absolute', bottom: -24, alignSelf: 'center', alignItems: 'center' }}>
      <Press onPress={onTap} haptics={false} scaleTo={0.9} accessibilityLabel={`Capsule, tap ${3 - taps} more times`}>
        <Animated.View style={s}>
          <View style={{ position: 'absolute', left: -22, top: -22, width: 164, height: 164, borderRadius: 82, backgroundColor: color, opacity: 0.22 }} />
          <View style={{ position: 'absolute', left: -6, top: -6, width: 132, height: 132, borderRadius: 66, backgroundColor: color, opacity: 0.3 }} />
          <CapsuleArt color={color} size={120} cracks={taps} />
        </Animated.View>
      </Press>
      <Row gap={6} style={{ marginTop: 6 }}>{[0, 1, 2].map(k => <View key={k} style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: k < taps ? '#FFFFFF' : '#FFFFFF44' }} />)}</Row>
    </View>
  );
}

function Reveal({ res, onAgain, onCabinet, canAgain }: { res: { prize: Prize; dupe: boolean }; onAgain: () => void; onCabinet: () => void; canAgain: boolean }) {
  const { prize, dupe } = res, R = RARITY[prize.r];
  const { width } = Dimensions.get('window');
  const g = useGame();
  const shine = useSharedValue(-1);
  useEffect(() => { if (prize.r === 'legendary' || prize.art.kind === 'card') shine.value = withRepeat(withTiming(1.5, { duration: 1800, easing: Easing.linear }), -1, false); }, []);
  const sShine = useAnimatedStyle((): any => ({ transform: [{ translateX: shine.value * 260 }, { rotate: '20deg' }] }));
  const lines: Record<Rarity, string> = { common: 'Every sticker counts!', rare: 'Ooh, a Rare! Cute on you.', epic: 'EPIC!! TAKU, look!', legendary: 'LEGENDARY!! That\'s my debut card!!' };
  const isPart = !!prize.part;
  return (
    <Animated.View entering={FadeIn.duration(200)} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8,5,25,0.88)', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 20 }]}>
      <Rays color={R.fill} size={width * 1.8} />
      <Animated.View entering={ZoomIn.delay(150)}><Bubble text={lines[prize.r]} /></Animated.View>
      <Animated.View entering={ZoomIn.springify().damping(10).delay(80)} style={[styles.prize, { borderColor: R.fill, shadowColor: R.fill }]}>
        <Pill color={R.soft} text={R.deep}>{R.label}</Pill>
        <View style={[styles.art, { backgroundColor: R.soft }]}>
          <Blob seed={prize.id} color="#FFFFFFAA" size={190} spin style={{ position: 'absolute' }} />
          <PrizeArt p={prize} size={150} />
        </View>
        <H size={20} color={C.ink} center>{prize.name}</H>
        <T size={13} color="#6A6590" center>{prize.desc}</T>
        {(prize.r === 'legendary' || prize.art.kind === 'card') && <Animated.View pointerEvents="none" style={[styles.shine, sShine]} />}
      </Animated.View>
      {dupe && <Animated.View entering={ZoomIn.delay(500)}><Pill color={C.lime} text={C.ink}>{`Duplicate · converted to +${DUPE_ORA[prize.r]} Ōra`}</Pill></Animated.View>}
      <Row gap={10} style={{ width: '100%', maxWidth: 340 }}>
        {isPart && !dupe ? <Btn title={g.equipped === prize.part ? 'Equipped' : 'Equip'} style={{ flex: 1 }} onPress={() => { g.equip(prize.part!); haptic.success(); useFx.getState().toast(g.partner, 'Equipped!', `Your avatar is wearing the ${prize.name.toLowerCase()}.`, 'happy'); }} />
          : <Btn title="Cabinet" style={{ flex: 1 }} onPress={onCabinet} />}
        <Btn title={canAgain ? 'Pull again' : 'Done'} kind="white" style={{ flex: 1 }} onPress={onAgain} />
      </Row>
      <View pointerEvents="none" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {prize.r === 'legendary' ? <><Mascot who="taku" state="wotagei" size={110} /><Mascot who="momo" state="celebrate" size={120} /><Mascot who="puri" state="victory" size={110} acc="headset" /></>
          : prize.r === 'epic' ? <><Mascot who="taku" state="cheer" size={110} /><View /><Mascot who="momo" state="celebrate" size={116} /></>
          : <><View /><Mascot who="momo" state="sparkle" size={116} /></>}
      </View>
      <Confetti count={{ common: 20, rare: 24, epic: 36, legendary: 50 }[prize.r]} seed={prize.id.length + Date.now() % 1000} colors={prize.r === 'legendary' ? [C.gold, '#FFF1C9', '#FFFFFF', C.epic] : undefined} />
    </Animated.View>
  );
}

const styles = themed(() => StyleSheet.create({
  split: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.bar, borderRadius: 999, paddingLeft: 22, paddingRight: 6, height: 62 },
  cost: { backgroundColor: C.lime, borderRadius: 999, height: 50, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  prize: { width: 260, backgroundColor: '#FFFFFF', borderRadius: 30, borderWidth: 5, padding: 14, alignItems: 'center', gap: 8, overflow: 'hidden', shadowOpacity: 0.8, shadowRadius: 30, elevation: 0 },
  art: { width: '100%', height: 180, borderRadius: 22, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  shine: { position: 'absolute', top: -60, left: -120, width: 50, height: 520, backgroundColor: '#FFFFFF', opacity: 0.45 },
}));
