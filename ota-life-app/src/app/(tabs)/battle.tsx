// Battle (Puri): Daily Challenge, the weekly league and the quiz library.
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { C, F, themed } from '@/theme';
import { streakMult, useGame } from '@/store/game';
import { QUIZ_CATS, BANK } from '@/content/quiz';
import { RANKS, rankIdx } from '@/content/ranks';
import { leagueRows } from '@/store/league';
import { fmt, untilMidnight, untilWeekEnd } from '@/lib/time';
import { Mascot } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { Btn, Card, H, Over, Pill, Press, Row, Section, T } from '@/ui/kit';
import { Avatar, PlayerAvatar, Screen, TopBar } from '@/ui/game';
import { Confetti as Deco } from '@/art/Products';

export default function Battle() {
  const g = useGame();
  const router = useRouter();
  const done = g.day.challenge;
  const rows = leagueRows(g.week.ora, g.week.key, g.name, rankIdx(g.power));
  const me = rows.findIndex(r => r.me);
  const podium = [rows[1], rows[0], rows[2]];
  const mult = streakMult(g.streak.count);

  return (
    <Screen tabs>
      <TopBar title="Battle" />
      <View style={[styles.daily, done && { backgroundColor: C.puriSoft }]}>
        <Deco width={380} height={300} seed="daily" opacity={0.3} />
        <Blob seed="daily" color={done ? C.puriSoft : C.puriSoft} size={250} second="#FFC93C33" style={{ position: 'absolute', right: -50, top: -30 }} />
        <View style={{ gap: 8, zIndex: 2, maxWidth: '60%' }}>
          <Over color={C.puri}>Daily Challenge · keeps your streak</Over>
          <H size={28}>{done ? 'Cleared for today' : 'Japanese through anime'}</H>
          <Row gap={6} style={{ flexWrap: 'wrap' }}>
            <Pill color={C.glass}>5 questions</Pill><Pill color={C.glass}>15 s each</Pill>
            <Pill color={C.glass}>{`+${Math.round(250 * mult)} Ōra`}</Pill><Pill color={C.glass}>+1 ticket</Pill>
          </Row>
          {done && <T color={C.mute}>You scored {g.day.challengeScore}/5. New challenge in {untilMidnight()}.</T>}
        </View>
        <Mascot who="puri" state={done ? 'victory' : 'gg'} size={170} acc="headset" style={{ position: 'absolute', right: -6, bottom: 66 }} />
        <Btn title={done ? 'Practise it again' : 'Play now'} kind={done ? 'ghost' : 'lime'} icon="bolt" style={{ marginTop: 18 }} onPress={() => router.push({ pathname: '/quiz', params: { mode: 'daily' } })} />
      </View>

      <Card onPress={() => router.push('/arena')} style={{ gap: 12 }}>
        <Row between>
          <View><Over>Weekly league · ends in {untilWeekEnd()}</Over><H size={20}>{RANKS[rankIdx(g.power)].name} League</H></View>
          <Pill color={C.lime} text={C.ink}>{`You're #${me + 1}`}</Pill>
        </Row>
        <Row gap={8} style={{ alignItems: 'flex-end' }}>
          {podium.map((r, k) => {
            const place = k === 1 ? 1 : k === 0 ? 2 : 3, h = place === 1 ? 86 : place === 2 ? 64 : 50;
            return (
              <View key={r.name} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                {r.me ? <Avatar size={38} /> : <PlayerAvatar name={r.name} rank={r.rank} size={36} />}
                <T w="black" size={12.5} numberOfLines={1}>{r.me ? 'You' : r.name.split(' ')[0]}</T>
                <View style={[styles.block, { height: h, backgroundColor: place === 1 ? C.gold : place === 2 ? '#B9C2D6' : '#E0915A' }]}><H size={22} color={C.ink}>{place}</H><T size={11} w="black" color={C.ink}>{fmt(r.ora)}</T></View>
              </View>
            );
          })}
        </Row>
        <T size={13} color={C.mute}>Top 5 move up a league. Ties go to the faster total answer time.</T>
      </Card>

      <Section title="Quiz library" />
      <T size={13} color={C.mute} style={{ marginTop: -8 }}>+20 Ōra per right answer on your first play of each quiz today (5 a day).</T>
      {QUIZ_CATS.map(q => {
        const played = g.day.quizzes.includes(q.id);
        return (
          <Card key={q.id} onPress={() => router.push({ pathname: '/quiz', params: { mode: 'library', cat: q.id } })} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
            <View style={[styles.cov, { backgroundColor: q.color + '33' }]}><T size={26} w="black" color={q.color}>{q.kanji}</T></View>
            <View style={{ flex: 1, gap: 4 }}>
              <T w="black" size={15}>{q.name}</T>
              <Row gap={6}><Pill color={q.level === 'Beginner' ? C.greenSoft : q.level === 'Advanced' ? '#4A1626' : C.puriDeep} text={q.level === 'Beginner' ? C.green : q.level === 'Advanced' ? C.red : C.puri}>{q.level}</Pill><T size={12} color={C.mute}>{BANK.filter(b => b.cat === q.id).length} words in the pool</T></Row>
            </View>
            {played ? <Pill color={C.card2} text={C.mute}>Played</Pill> : <Icon name="chev" size={18} c={C.mute} />}
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = themed(() => StyleSheet.create({
  daily: { backgroundColor: C.puriDeep, borderRadius: 32, padding: 18, minHeight: 280, overflow: 'hidden', justifyContent: 'flex-end' },
  block: { width: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottomLeftRadius: 6, borderBottomRightRadius: 6, alignItems: 'center', justifyContent: 'center' },
  cov: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
}));
