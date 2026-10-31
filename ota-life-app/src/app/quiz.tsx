// Quiz battle: Daily Challenge, library quizzes and the onboarding warm-up share this screen.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, Easing, FadeIn, FadeInDown, FadeInUp, useAnimatedProps, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { C, F, themed } from '@/theme';
import { BANK, QUIZ_CATS, WARMUP_IDS } from '@/content/quiz';
import { RIVALS } from '@/content/catalog';
import { rankIdx } from '@/content/ranks';
import { useGame, streakMult } from '@/store/game';
import { haptic, useFx } from '@/store/fx';
import { obDraft } from '@/store/draft';
import { dayKey, fmt, seeded, shuffle } from '@/lib/time';
import { Mascot, MState } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { Btn, Card, H, JpText, Num, Over, Press, Row, T, Bar, Pill } from '@/ui/kit';
import { Avatar, OraChip, PlayerAvatar, goBack } from '@/ui/game';
import { Confetti } from '@/ui/overlays';

const ACircle = Animated.createAnimatedComponent(Circle);
const SECS = 15;

export default function Quiz() {
  const { mode = 'daily', cat } = useLocalSearchParams<{ mode: 'daily' | 'library' | 'warmup'; cat?: string }>();
  const router = useRouter();
  const ins = useSafeAreaInsets();
  const g = useGame();
  const setBusy = useFx(s => s.setBusy);

  const questions = useMemo(() => {
    if (mode === 'warmup') return WARMUP_IDS.map(id => BANK.find(q => q.id === id)!);
    if (mode === 'daily') return shuffle(BANK, seeded('daily' + dayKey())).slice(0, 5);
    return shuffle(BANK.filter(q => q.cat === cat), seeded(cat + String(Date.now()))).slice(0, 5);
  }, []);
  const rewarded = useMemo(() => useGame.getState().canEarnQuiz(mode, cat), []);
  const per = mode === 'library' ? 20 : 30;

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [earned, setEarned] = useState(0);
  const [left, setLeft] = useState(SECS);
  const [done, setDone] = useState(false);
  const [puri, setPuri] = useState<MState>('idle');
  const elapsed = useRef(0);
  const startAt = useRef(Date.now());
  const ring = useSharedValue(1);
  const q = questions[i];

  useEffect(() => { setBusy(true); return () => setBusy(false); }, []);
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { if (!done && mode === 'warmup') return true; return false; });
    return () => sub.remove();
  }, [done]);

  // per-question timer
  useEffect(() => {
    if (done || picked !== null) return;
    startAt.current = Date.now();
    setLeft(SECS);
    ring.value = 1;
    ring.value = withTiming(0, { duration: SECS * 1000, easing: Easing.linear });
    const id = setInterval(() => {
      const l = SECS - (Date.now() - startAt.current) / 1000;
      setLeft(Math.max(0, Math.ceil(l)));
      if (l <= 5) setPuri(p => (p === 'idle' ? 'watch' : p));
      if (l <= 0) { clearInterval(id); answer(-1); }
    }, 200);
    return () => clearInterval(id);
  }, [i, done, picked]);

  const answer = (k: number, e?: any) => {
    if (picked !== null) return;
    cancelAnimation(ring);
    elapsed.current += (Date.now() - startAt.current) / 1000;
    setPicked(k);
    if (k === q.a) {
      haptic.success();
      const c = combo + 1;
      setCombo(c); setBest(b => Math.max(b, c)); setRight(r => r + 1);
      setPuri(c >= 3 ? 'victory' : 'happy');
      if (rewarded) { const amt = useGame.getState().earn(per, { x: e?.nativeEvent?.pageX, y: e?.nativeEvent?.pageY }); setEarned(x => x + amt); }
    } else {
      haptic.error();
      setCombo(0); setPuri(k === -1 ? 'shocked' : 'sad');
    }
  };
  const next = () => {
    if (i < questions.length - 1) { setI(i + 1); setPicked(null); setPuri(combo >= 3 ? 'excited' : 'idle'); }
    else setDone(true);
  };

  const ringProps = useAnimatedProps(() => ({ strokeDashoffset: 2 * Math.PI * 28 * (1 - ring.value) }));
  const comboS = useSharedValue(1);
  useEffect(() => { if (combo >= 2) comboS.value = withSequence(withTiming(1.4, { duration: 120 }), withSpring(1)); }, [combo]);
  const sCombo = useAnimatedStyle((): any => ({ transform: [{ scale: comboS.value }, { rotate: '6deg' }] }));

  if (done) return <Results mode={mode} cat={cat} right={right} total={questions.length} best={best} earned={earned} time={elapsed.current} rewarded={rewarded} />;

  const low = left <= 5;
  return (
    <View style={{ flex: 1, backgroundColor: C.puriDeep }}>
      <ScrollView contentContainerStyle={{ paddingTop: ins.top + 10, paddingHorizontal: 16, paddingBottom: ins.bottom + 24, gap: 12 }} showsVerticalScrollIndicator={false}>
        <Row>
          <Press onPress={() => (mode === 'warmup' ? null : goBack(router))} style={[styles.round, mode === 'warmup' && { opacity: 0 }]} accessibilityLabel="Quit quiz"><Icon name="close" size={18} /></Press>
          <View style={{ flex: 1 }}><Bar pct={(i + (picked !== null ? 1 : 0)) / questions.length} color={C.puri} height={14} /></View>
          <OraChip />
        </Row>
        <View style={{ height: 210, alignItems: 'center', justifyContent: 'flex-end' }}>
          <Blob seed={'q' + i} color={C.puriSoft} size={220} second="#FFC93C22" style={{ position: 'absolute', top: 0 }} />
          <View style={{ position: 'absolute', left: 0, top: 6, width: 68, height: 68, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={68} height={68} style={StyleSheet.absoluteFill}>
              <Circle cx={34} cy={34} r={28} fill={C.card} stroke={C.card2} strokeWidth={6} />
              <ACircle cx={34} cy={34} r={28} fill="none" stroke={low ? C.red : C.puri} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 28}`} animatedProps={ringProps} transform="rotate(-90 34 34)" />
            </Svg>
            <H size={22} color={low ? C.red : C.text}>{left}</H>
          </View>
          {combo >= 2 && (
            <Animated.View style={[styles.combo, sCombo]}>
              <T size={10} w="black" color={C.ink}>COMBO</T>
              <H size={22} color={C.ink}>×{combo}</H>
            </Animated.View>
          )}
          <Mascot who="puri" state={puri} size={180} acc="headset" />
        </View>

        <Animated.View key={'q' + i} entering={FadeInDown.springify().damping(16)}>
          <Card color={C.card} style={{ gap: 8 }}>
            <Over color={C.puri}>{mode === 'daily' ? 'Daily Challenge' : mode === 'warmup' ? 'Warm-up battle' : QUIZ_CATS.find(c => c.id === cat)?.name} · {i + 1} of {questions.length}{rewarded ? ` · +${Math.round(per * streakMult(g.streak.count))} Ōra` : ' · practice'}</Over>
            <JpText text={q.q} size={20} display />
          </Card>
        </Animated.View>

        {q.o.map((o, k) => {
          const isRight = picked !== null && k === q.a, isWrong = picked === k && k !== q.a, dim = picked !== null && !isRight && !isWrong;
          return (
            <Animated.View key={i + '-' + k} entering={FadeInDown.delay(80 + k * 60).springify().damping(16)}>
              <Press onPress={e => answer(k, e)} disabled={picked !== null && !isRight && !isWrong ? false : false} haptics={false}
                style={[styles.ans, isRight && { backgroundColor: C.lime }, isWrong && { backgroundColor: C.red }, dim && { opacity: 0.45 }]}>
                <View style={[styles.key, (isRight || isWrong) && { backgroundColor: '#FFFFFF' }]}><T w="black" color={isRight || isWrong ? C.ink : C.text}>{'ABCD'[k]}</T></View>
                <T size={16} w="black" color={isRight ? C.ink : C.text} style={{ flex: 1 }}>{o}</T>
                {isRight && <Icon name="check" size={22} c={C.ink} />}
                {isWrong && <Icon name="close" size={20} c="#FFFFFF" />}
              </Press>
            </Animated.View>
          );
        })}

        {picked !== null && (
          <Animated.View entering={FadeInUp.springify().damping(16)} style={{ gap: 12 }}>
            <Row style={{ alignItems: 'flex-end' }}>
              <Mascot who="taku" state={picked === q.a ? 'happy' : 'think'} size={86} />
              <View style={[styles.note]}>
                {picked === -1 && <T w="black" color={C.red}>Time’s up!</T>}
                <JpText text={q.note} size={14.5} color={C.ink} hi={C.oraDeep} />
              </View>
            </Row>
            <Btn title={i < questions.length - 1 ? 'Next question' : 'See results'} onPress={next} />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

function Results({ mode, cat, right, total, best, earned, time, rewarded }: { mode: string; cat?: string; right: number; total: number; best: number; earned: number; time: number; rewarded: boolean }) {
  const router = useRouter();
  const ins = useSafeAreaInsets();
  const [res, setRes] = useState<{ bonus: number; ticket: boolean; streakUp: boolean; milestone: boolean } | null>(null);
  const [bonusPaid, setBonusPaid] = useState(0);
  const g = useGame();
  const win = right >= Math.ceil(total * 0.6), perfect = right === total;
  const secs = Math.round(time), mm = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return; ran.current = true;
    const r = useGame.getState().completeQuiz({ mode: mode as any, cat, right, total });
    const bonus = rewarded ? r.bonus : 0;
    setRes({ ...r, bonus });
    if (bonus) setTimeout(() => setBonusPaid(useGame.getState().earn(bonus, { mult: false, x: Dimensions.get('window').width / 2, y: 420 })), 700);
    if (win) haptic.success();
  }, []);

  const board = useMemo(() => {
    const rnd = seeded('board' + dayKey() + mode + (cat || ''));
    const rows = shuffle(RIVALS, rnd).slice(0, 4).map(n => ({ n, rank: 1 + Math.floor(rnd() * 3), score: Math.max(2, total - Math.floor(rnd() * 3)), t: 30 + Math.floor(rnd() * 50) }));
    rows.push({ n: g.name, rank: rankIdx(g.power), score: right, t: secs, me: true } as any);
    return rows.sort((a, b) => b.score - a.score || a.t - b.t);
  }, []);

  const finish = () => {
    if (mode === 'warmup') {
      const d = obDraft.data;
      const s = useGame.getState();
      s.finishOnboarding({ name: d?.name || 'Fan', partner: d?.partner || 'momo', anime: d?.anime || [], platform: d?.platform || null, goal: d?.goal || null });
      if (d?.anime?.length) {
        const map: Record<string, string> = { 'Jujutsu Kaisen': 'jjk', 'One Piece': 'op' };
        const joined: Record<string, boolean> = { nihongo: true };
        d.anime.forEach(a => { if (map[a]) joined[map[a]] = true; });
        if (d.platform && d.platform !== 'I just watch') joined.gacha = true;
        if (d.goal === 'Win the cosplay contest') joined.cos = true;
        if (d.goal === 'Watch the LIVE stage') joined.idol = true;
        useGame.setState({ joined });
      }
      const top = Math.max(100, 500 - useGame.getState().power);
      useGame.getState().earn(top, { mult: false });
      useGame.setState(st => ({ tickets: { ...st.tickets, std: st.tickets.std + 1 } }));
      router.replace('/');
      setTimeout(() => useFx.getState().toast('momo', 'A gift from Momo!', 'Your first capsule ticket is waiting on Stage.', 'celebrate'), 400);
      return;
    }
    goBack(router);
    if (res?.milestone) setTimeout(() => useFx.getState().toast('momo', `${useGame.getState().streak.count}-day milestone!`, `Ōra multiplier is now ×${streakMult(useGame.getState().streak.count)}`, 'celebrate'), 500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.puriDeep }}>
      <ScrollView contentContainerStyle={{ paddingTop: ins.top + 10, paddingHorizontal: 16, paddingBottom: ins.bottom + 24, gap: 12 }} showsVerticalScrollIndicator={false}>
        <Row between><Pill color={C.card2}>{mode === 'daily' ? 'Daily Challenge' : mode === 'warmup' ? 'Warm-up battle' : 'Library quiz'} · {mm}</Pill><OraChip /></Row>
        <View style={{ height: 230, alignItems: 'center', justifyContent: 'flex-end' }}>
          <Blob seed="results" color={win ? C.puriSoft : C.card} size={250} second={win ? '#FFC93C33' : undefined} style={{ position: 'absolute', top: 0 }} />
          <Mascot who="puri" state={win ? 'victory' : 'cry'} size={200} acc="headset" />
        </View>
        <Animated.View entering={ZoomIn.springify().damping(12)}><H size={34} center>{win ? (perfect ? 'Flawless. GG!' : 'Victory! GG') : 'GG, close one'}</H></Animated.View>
        <T center color={C.mute}>{win ? `Best combo ×${best}.` : 'TAKU left a note on every answer. Rematch tomorrow.'}</T>
        <Row gap={8}>
          {[[`${right}/${total}`, 'correct'], [`×${best}`, 'best combo'], [mm, 'time']].map(([v, l], k) => (
            <Animated.View key={l} entering={FadeInDown.delay(150 + k * 80).springify()} style={styles.tile}><H size={24}>{v}</H><T size={11.5} color={C.mute}>{l}</T></Animated.View>
          ))}
        </Row>
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Card style={{ gap: 0 }}>
            {!rewarded && <T color={C.mute} style={{ paddingVertical: 6 }}>{mode === 'library' ? 'Practice round: this quiz already paid out today.' : 'Practice round: today\'s challenge is already cleared.'}</T>}
            {rewarded && <Line l={`${right} right × ${per(mode)} Ōra${streakMult(g.streak.count) > 1 && mode !== 'warmup' ? ` × ${streakMult(g.streak.count)}` : ''}`} v={earned} />}
            {rewarded && mode === 'daily' && <Line l="Daily Challenge cleared" v={100} />}
            {rewarded && perfect && mode !== 'warmup' && <Line l="Perfect score" v={50} />}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, marginTop: 4, borderTopWidth: 2, borderTopColor: C.line, borderStyle: 'dashed' }}>
              <H size={20}>Total</H><Num value={earned + bonusPaid} prefix="+" suffix=" Ōra" style={{ fontFamily: F.display, fontSize: 20, color: C.lime }} />
            </View>
          </Card>
        </Animated.View>
        {res?.ticket && (
          <Animated.View entering={FadeInDown.delay(550).springify()}>
            <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="ticket" size={28} c={C.momo} />
              <T w="black" style={{ flex: 1 }}>+1 Standard capsule ticket</T>
              {res.streakUp && <Pill color={C.momoSoft} text={C.momo}><Icon name="flame" size={14} c={C.orange} /><T size={12} w="black" color={C.momo}>{useGame.getState().streak.count}-day streak</T></Pill>}
            </Card>
          </Animated.View>
        )}
        {mode !== 'warmup' && (
          <Animated.View entering={FadeInDown.delay(650).springify()}>
            <Card style={{ gap: 4 }}>
              <Over>Top rankings · ties broken by time</Over>
              {board.map((r: any, k) => (
                <Row key={r.n + k} style={[styles.lbr, r.me && { backgroundColor: C.lime }]}>
                  <H size={15} color={r.me ? C.ink : C.mute} style={{ width: 20 }}>{k + 1}</H>
                  {r.me ? <Avatar size={32} /> : <PlayerAvatar name={r.n} rank={r.rank} size={30} />}
                  <T w="black" color={r.me ? C.ink : C.text} style={{ flex: 1 }}>{r.n}</T>
                  <View style={{ alignItems: 'flex-end' }}><H size={15} color={r.me ? C.ink : C.text}>{r.score}/{total}</H><T size={11} color={r.me ? C.ink : C.mute}>{`${Math.floor(r.t / 60)}:${String(r.t % 60).padStart(2, '0')}`}</T></View>
                </Row>
              ))}
            </Card>
          </Animated.View>
        )}
        <Btn title={mode === 'warmup' ? 'Claim my rewards' : 'Continue'} onPress={finish} />
      </ScrollView>
      {win && <Confetti count={perfect ? 46 : 28} seed={3} />}
    </View>
  );
}
const per = (m: string) => (m === 'library' ? 20 : 30);
function Line({ l, v }: { l: string; v: number }) {
  return <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 }}><T color={C.mute}>{l}</T><T w="black">+{fmt(v)}</T></View>;
}

const styles = themed(() => StyleSheet.create({
  round: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  combo: { position: 'absolute', right: 0, top: 10, backgroundColor: C.lime, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center', zIndex: 3 },
  ans: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: 20, padding: 9, minHeight: 58 },
  key: { width: 40, height: 40, borderRadius: 14, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' },
  note: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, borderBottomLeftRadius: 6, padding: 12, gap: 4 },
  tile: { flex: 1, backgroundColor: C.card, borderRadius: 20, paddingVertical: 12, alignItems: 'center' },
  lbr: { gap: 10, paddingVertical: 7, paddingHorizontal: 8, borderRadius: 16 },
}));
