import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { C, themed } from '@/theme';
import { useGame } from '@/store/game';
import { leagueRows } from '@/store/league';
import { RANKS, rankIdx } from '@/content/ranks';
import { fmt, untilWeekEnd } from '@/lib/time';
import { Mascot } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Btn, Card, H, Over, Pill, Row, T } from '@/ui/kit';
import { Avatar, BackBar, OraChip, PlayerAvatar, Screen } from '@/ui/game';

export default function Arena() {
  const g = useGame();
  const router = useRouter();
  const rows = leagueRows(g.week.ora, g.week.key, g.name, rankIdx(g.power));
  const me = rows.findIndex(r => r.me);
  const gap = me >= 5 ? rows[4].ora - g.week.ora + 10 : 0;
  return (
    <Screen>
      <BackBar title="Weekly league" sub={`${RANKS[rankIdx(g.power)].name} League · ${rows.length} players`} right={<OraChip />} />
      <View style={styles.head}>
        <Blob seed="arena" color={C.puriSoft} size={200} style={{ position: 'absolute', right: -30, top: -40 }} />
        <View style={{ flex: 1, gap: 6, zIndex: 2 }}>
          <Over color={C.puri}>Ends in {untilWeekEnd()}</Over>
          <H size={24}>{me < 5 ? 'You\'re in the promotion zone!' : `${fmt(gap)} Ōra to the top 5`}</H>
          <Row gap={6} style={{ flexWrap: 'wrap' }}><Pill color={C.glass}>Top 3: +300 / 200 / 100</Pill><Pill color={C.glass}>Top 5 move up</Pill></Row>
        </View>
        <Mascot who="puri" state={me < 5 ? 'victory' : 'watch'} size={124} acc="headset" style={{ marginBottom: -14 }} />
      </View>
      <Card style={{ padding: 8, gap: 2 }}>
        {rows.map((r, k) => (
          <Animated.View key={r.name} entering={FadeInDown.delay(Math.min(k, 10) * 40)}>
            <Row style={[styles.row, r.me && { backgroundColor: C.lime }, k === 4 && styles.zone]}>
              <T w="black" color={r.me ? C.ink : k < 3 ? C.gold : C.mute} style={{ width: 24, textAlign: 'center' }}>{k + 1}</T>
              {r.me ? <Avatar size={34} /> : <PlayerAvatar name={r.name} rank={r.rank} size={32} />}
              <View style={{ flex: 1 }}>
                <T w="black" color={r.me ? C.ink : C.text}>{r.me ? `${r.name} (you)` : r.name}</T>
                {rows.some((x, j) => j !== k && x.ora === r.ora) && <T size={11} color={r.me ? C.ink : C.mute}>Tie · {Math.floor(r.time / 60)}:{String(r.time % 60).padStart(2, '0')} answer time</T>}
              </View>
              <T w="black" color={r.me ? C.ink : C.text}>{fmt(r.ora)} Ōra</T>
            </Row>
          </Animated.View>
        ))}
      </Card>
      <Btn title="Earn Ōra in the Daily Challenge" icon="bolt" disabled={g.day.challenge} onPress={() => router.push({ pathname: '/quiz', params: { mode: 'daily' } })} />
    </Screen>
  );
}
const styles = themed(() => StyleSheet.create({
  head: { backgroundColor: C.puriDeep, borderRadius: 28, padding: 16, flexDirection: 'row', alignItems: 'flex-end', overflow: 'hidden' },
  row: { gap: 10, paddingVertical: 8, paddingHorizontal: 8, borderRadius: 16 },
  zone: { borderBottomWidth: 2, borderBottomColor: C.green, borderStyle: 'dashed' },
}));
