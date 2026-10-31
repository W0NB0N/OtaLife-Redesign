// First run: meet the trio, enter a name, pick a buddy, answer three mascot questions,
// then a warm-up battle that lands the first rank-up before Home.
import React, { useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInRight, FadeOutLeft, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C, DOMAIN, F, Who, themed } from '@/theme';
import { useGame } from '@/store/game';
import { Mascot, PokeMascot } from '@/mascots/Mascot';
import { Blob, OnBlob } from '@/art/Blob';
import { Btn, Bubble, Chip, H, Over, Press, Row, T } from '@/ui/kit';
import { OraChip } from '@/ui/game';
import { obDraft } from '@/store/draft';

type Step = 'hello' | 'name' | 'buddy' | 'anime' | 'platform' | 'goal' | 'warm';
const ORDER: Step[] = ['hello', 'name', 'buddy', 'anime', 'platform', 'goal', 'warm'];

const BUDDY: Record<Who, { tag: string; line: string; hosts: string }> = {
  taku: { tag: 'Ultimate Akiba otaku', line: 'Yoroshiku! I know every reference. Let\'s find your 推し (oshi)!', hosts: 'Hosts Discover: reels, words, communities, Fan Council' },
  momo: { tag: 'Rising debut idol', line: 'Hi hi! I debut at Ōta TOKYO on 28 Nov. Be my first fan?', hosts: 'Hosts Stage: events, merch, capsules, your streak' },
  puri: { tag: 'Hardcore gamer', line: 'Player two has entered the game. Let\'s speedrun this.', hosts: 'Hosts Battle: quizzes, the league, leaderboards' },
};
const ANIME = ['Jujutsu Kaisen', 'One Piece', 'Naruto', 'Demon Slayer', 'Spy x Family', 'Haikyu!!', 'Chainsaw Man', 'Frieren', 'Solo Leveling', 'Darling in the FranXX'];
const PLATFORMS = [['Mobile', 'Gacha and rhythm games'], ['Console', 'Switch or PlayStation'], ['PC', 'Steam until 3 am'], ['I just watch', 'All anime, no games']];
const GOALS = [['Meet voice actors', '声'], ['Win the cosplay contest', '装'], ['Shop exclusive merch', '物'], ['Watch the LIVE stage', '歌']];

export default function Onboarding() {
  const ins = useSafeAreaInsets();
  const router = useRouter();
  const earn = useGame(s => s.earn);
  const [step, setStep] = useState<Step>('hello');
  const [name, setName] = useState('');
  const [buddy, setBuddy] = useState<Who>('momo');
  const [anime, setAnime] = useState<string[]>([]);
  const [platform, setPlatform] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [paid, setPaid] = useState<Record<string, boolean>>({});
  const { width } = Dimensions.get('window');
  const next = (s: Step) => setStep(s);
  const pay = (key: string, amt: number, e: any) => {
    if (!paid[key]) { earn(amt, { mult: false, x: e?.nativeEvent?.pageX, y: e?.nativeEvent?.pageY }); setPaid(p => ({ ...p, [key]: true })); }
  };
  const idx = ORDER.indexOf(step);
  const bg = { hello: C.bg, name: C.bg, buddy: DOMAIN[buddy].deep, anime: C.takuDeep, platform: C.puriDeep, goal: C.momoDeep, warm: C.puriDeep }[step];

  const dots = idx > 0 && (
    <Row gap={8} style={{ marginBottom: 4 }}>
      <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
        {ORDER.slice(1).map((s, k) => <View key={s} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: k < idx ? C.lime : C.glass }} />)}
      </View>
      <OraChip track />
    </Row>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: ins.top + 12, paddingBottom: ins.bottom + 20, paddingHorizontal: 18, gap: 16 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {dots}
        {step === 'hello' && (
          <Animated.View key="hello" entering={FadeIn.duration(500)} style={{ flex: 1, justifyContent: 'space-between', gap: 20 }}>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Animated.Text entering={ZoomIn.delay(100).springify().damping(10)} style={styles.logo}>Ōta Life</Animated.Text>
              <T size={16} color={C.lime} w="black" style={{ letterSpacing: 6 }}>オタライフ</T>
            </View>
            <View style={{ height: 260, alignItems: 'center', justifyContent: 'flex-end' }}>
              <Blob seed="hello" color={C.oraDeep} size={300} second={C.heroBlob} style={{ position: 'absolute', top: -20 }} />
              <Row gap={0} style={{ alignItems: 'flex-end' }}>
                <Animated.View entering={FadeInRight.delay(200).springify()}><PokeMascot who="taku" base="wave" size={130} style={{ marginRight: -22 }} /></Animated.View>
                <Animated.View entering={FadeInDown.delay(350).springify()}><PokeMascot who="momo" base="sparkle" size={160} /></Animated.View>
                <Animated.View entering={FadeInRight.delay(500).springify()}><PokeMascot who="puri" base="gg" size={125} acc="headset" style={{ marginLeft: -22 }} /></Animated.View>
              </Row>
            </View>
            <T center color={C.mute} size={16}>Anime, quizzes, capsules and the Ōta TOKYO festival. Everything you do earns Ōra.</T>
            <Btn title="Get started" onPress={() => next('name')} />
          </Animated.View>
        )}

        {step === 'name' && (
          <Animated.View key="name" entering={FadeInRight.springify().damping(18)} style={{ flex: 1, gap: 18 }}>
            <Row style={{ alignItems: 'flex-end' }}>
              <OnBlob seed="name" color={C.momoSoft} size={130}><Mascot who="momo" state="talk" size={120} /></OnBlob>
              <Bubble text="First things first: what should we call you?" />
            </Row>
            <Over>Step 1 · your name</Over>
            <H size={30}>What’s your name?</H>
            <TextInput value={name} onChangeText={setName} placeholder="Your fan name" placeholderTextColor={C.dim} maxLength={20} autoFocus style={styles.input} returnKeyType="next" onSubmitEditing={() => name.trim() && next('buddy')} />
            <T color={C.mute} size={13}>Shown on comments, leaderboards and community posts. You can change it later.</T>
            <View style={{ flex: 1 }} />
            <Btn title="Continue" disabled={!name.trim()} onPress={() => next('buddy')} />
          </Animated.View>
        )}

        {step === 'buddy' && (
          <Animated.View key="buddy" entering={FadeInRight.springify().damping(18)} style={{ flex: 1, gap: 14 }}>
            <Over color={DOMAIN[buddy].fill}>Step 2 · your buddy</Over>
            <H size={30}>Pick your buddy</H>
            <View style={{ height: 270, alignItems: 'center', justifyContent: 'flex-end' }}>
              <Blob seed={buddy} color={DOMAIN[buddy].soft} size={270} second={DOMAIN[buddy].fill + '33'} style={{ position: 'absolute', top: 0 }} />
              <Bubble text={BUDDY[buddy].line} style={{ position: 'absolute', top: 0, left: 0 }} />
              <PokeMascot key={buddy} who={buddy} base="happy" size={210} acc={buddy === 'puri' ? 'headset' : null} />
            </View>
            <T center w="black" color={DOMAIN[buddy].fill}>{BUDDY[buddy].hosts}</T>
            <Row gap={8}>
              {(['taku', 'momo', 'puri'] as Who[]).map(w => (
                <Press key={w} onPress={() => setBuddy(w)} style={[styles.pick, buddy === w && { borderColor: DOMAIN[w].fill, transform: [{ translateY: -4 }] }]}>
                  <View style={[styles.pickFace, { backgroundColor: DOMAIN[w].fill }]}><Mascot who={w} size={78} still /></View>
                  <T w="black" size={13}>{DOMAIN[w].name}</T>
                  <T size={11} color={C.mute} center>{BUDDY[w].tag}</T>
                </Press>
              ))}
            </Row>
            <Btn title={`Team up with ${DOMAIN[buddy].name}`} onPress={() => next('anime')} />
          </Animated.View>
        )}

        {step === 'anime' && (
          <Animated.View key="anime" entering={FadeInRight.springify().damping(18)} style={{ flex: 1, gap: 14 }}>
            <Row style={{ alignItems: 'flex-end' }}>
              <OnBlob seed="anime" color={C.takuSoft} size={130}><Mascot who="taku" state={anime.length ? 'wotagei' : 'think'} size={124} /></OnBlob>
              <Bubble text={anime.length ? `${anime.length} picked! I'll add you to their communities.` : 'What are you watching? Pick as many as you like.'} />
            </Row>
            <Over color={C.taku}>TAKU asks · +40 Ōra</Over>
            <H size={28}>Your favourite anime?</H>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {ANIME.map(a => <Chip key={a} label={a} on={anime.includes(a)} onPress={() => setAnime(x => (x.includes(a) ? x.filter(y => y !== a) : [...x, a]))} />)}
            </View>
            <View style={{ flex: 1 }} />
            <Btn title={anime.length ? 'Continue · +40 Ōra' : 'Pick at least one'} disabled={!anime.length} onPress={e => { pay('anime', 40, e); setTimeout(() => next('platform'), 650); }} />
            <Btn title="Skip" kind="ghost" onPress={() => next('platform')} />
          </Animated.View>
        )}

        {step === 'platform' && (
          <Animated.View key="platform" entering={FadeInRight.springify().damping(18)} style={{ flex: 1, gap: 12 }}>
            <Row style={{ alignItems: 'flex-end' }}>
              <OnBlob seed="plat" color={C.puriSoft} size={130}><Mascot who="puri" state={platform ? 'gg' : 'idle'} size={120} acc="headset" /></OnBlob>
              <Bubble text={platform ? 'Respect. I\'ll queue quizzes for that.' : 'Where do you play? Be honest.'} />
            </Row>
            <Over color={C.puri}>Puri asks · +30 Ōra</Over>
            <H size={28}>What do you play on?</H>
            {PLATFORMS.map(([p, d], k) => (
              <Press key={p} onPress={() => setPlatform(p)} style={[styles.opt, platform === p && { borderColor: C.puri, backgroundColor: C.puriSoft }]}>
                <View style={[styles.optKey, platform === p && { backgroundColor: C.puri }]}><T w="black" color={platform === p ? C.ink : C.text}>{'ABCD'[k]}</T></View>
                <View style={{ flex: 1 }}><T w="black" size={16}>{p}</T><T size={13} color={C.mute}>{d}</T></View>
              </Press>
            ))}
            <View style={{ flex: 1 }} />
            <Btn title={platform ? 'Continue · +30 Ōra' : 'Pick one'} disabled={!platform} onPress={e => { pay('platform', 30, e); setTimeout(() => next('goal'), 650); }} />
            <Btn title="Skip" kind="ghost" onPress={() => next('goal')} />
          </Animated.View>
        )}

        {step === 'goal' && (
          <Animated.View key="goal" entering={FadeInRight.springify().damping(18)} style={{ flex: 1, gap: 12 }}>
            <Row style={{ alignItems: 'flex-end' }}>
              <OnBlob seed="goal" color={C.momoSoft} size={130}><Mascot who="momo" state={goal ? 'sparkle' : 'wave'} size={124} /></OnBlob>
              <Bubble text={goal ? 'Ahh, I\'ll save you a spot!' : 'What would make Ōta TOKYO perfect for you?'} />
            </Row>
            <Over color={C.momo}>Momo asks · +30 Ōra</Over>
            <H size={28}>Your festival goal?</H>
            {GOALS.map(([g, k]) => (
              <Press key={g} onPress={() => setGoal(g)} style={[styles.opt, goal === g && { borderColor: C.momo, backgroundColor: C.momoSoft }]}>
                <View style={[styles.optKey, { backgroundColor: goal === g ? C.momo : C.card2 }]}><T w="black" size={18}>{k}</T></View>
                <T w="black" size={16} style={{ flex: 1 }}>{g}</T>
              </Press>
            ))}
            <View style={{ flex: 1 }} />
            <Btn title={goal ? 'Continue · +30 Ōra' : 'Pick one'} disabled={!goal} onPress={e => { pay('goal', 30, e); setTimeout(() => next('warm'), 650); }} />
            <Btn title="Skip" kind="ghost" onPress={() => next('warm')} />
          </Animated.View>
        )}

        {step === 'warm' && (
          <Animated.View key="warm" entering={FadeInRight.springify().damping(18)} style={{ flex: 1, gap: 14 }}>
            <View style={{ height: 300, alignItems: 'center', justifyContent: 'flex-end' }}>
              <Blob seed="warm" color={C.puriSoft} size={300} second="#FFC93C33" style={{ position: 'absolute', top: 0 }} />
              <Bubble text={{ taku: 'Last step: a warm-up battle. Three easy words. Ganbatte!', momo: 'Last step! A tiny warm-up quiz. I\'ll be cheering!', puri: 'Tutorial boss: three questions. Don\'t choke.' }[buddy]} style={{ position: 'absolute', top: 0, left: 0 }} />
              <Mascot who="puri" state="excited" size={220} acc="headset" />
            </View>
            <Over color={C.puri}>Warm-up battle · up to +90 Ōra</Over>
            <H size={28}>3 questions, 15 seconds each</H>
            <T color={C.mute}>Win it and you’ll face your first boss. Don’t worry, the trio always wins.</T>
            <View style={{ flex: 1 }} />
            <Btn title="Start the battle" icon="bolt" onPress={() => {
              obDraft.data = { name: name.trim(), partner: buddy, anime, platform, goal };
              useGame.setState({ partner: buddy });
              router.push({ pathname: '/quiz', params: { mode: 'warmup' } });
            }} />
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = themed(() => StyleSheet.create({
  logo: { fontFamily: F.display, fontSize: 64, color: C.text, lineHeight: 70 },
  input: { backgroundColor: C.card, borderRadius: 20, height: 60, paddingHorizontal: 18, fontFamily: F.bodyHeavy, fontSize: 20, color: C.text, borderWidth: 2, borderColor: C.line },
  pick: { flex: 1, backgroundColor: C.card, borderRadius: 22, paddingVertical: 10, paddingHorizontal: 4, alignItems: 'center', gap: 2, borderWidth: 3, borderColor: 'transparent' },
  pickFace: { width: 64, height: 64, borderRadius: 20, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' },
  opt: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: 20, padding: 10, borderWidth: 2.5, borderColor: 'transparent' },
  optKey: { width: 40, height: 40, borderRadius: 14, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' },
}));
