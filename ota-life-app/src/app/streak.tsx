import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { C, F } from '@/theme';
import { streakMult, useGame } from '@/store/game';
import { haptic, useFx } from '@/store/fx';
import { addDays, dayKey, weekdayLetter } from '@/lib/time';
import { Mascot } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { Bar, Btn, Card, H, Num, Over, Pill, Row, T } from '@/ui/kit';
import { BackBar, Screen } from '@/ui/game';
import { streakMood } from '@/lib/derived';

export default function Streak() {
  const g = useGame();
  const router = useRouter();
  const mood = streakMood(g);
  const n = g.streak.count;
  const ladder: [number, number][] = [[3, 1.1], [7, 1.2], [30, 1.3], [100, 1.5]];
  const next = ladder.find(([d]) => n < d);
  const days = Array.from({ length: 14 }, (_, k) => addDays(dayKey(), k - 13));
  const kept = (d: string) => !!g.streak.last && n > 0 && d <= g.streak.last && d > addDays(g.streak.last, -n);
  return (
    <Screen>
      <BackBar title="Your streak" sub={`Best: ${g.streak.best} days`} />
      <View style={{ backgroundColor: mood.bg, borderRadius: 30, padding: 18, minHeight: 250, overflow: 'hidden' }}>
        <Blob seed="streak" color={C.glass} size={260} style={{ position: 'absolute', right: -50, top: -30 }} />
        <Pill color="#FFFFFF" text={C.momo}>{mood.tag}</Pill>
        <Row gap={4} style={{ marginTop: 10 }}><Icon name="flame" size={40} c={C.orange} /><Num value={n} style={{ fontFamily: F.display, fontSize: 64, color: mood.fg }} /></Row>
        <T w="black" color={mood.fg} style={{ maxWidth: 170 }}>{mood.line}</T>
        <View style={{ position: 'absolute', right: 0, bottom: 0 }}><Mascot who="momo" state={mood.s} size={180} /></View>
      </View>
      <Card>
        <Over>Last 14 days</Over>
        <Row gap={4}>{days.map(d => <View key={d} style={{ flex: 1, height: 34, borderRadius: 10, backgroundColor: kept(d) ? C.momo : C.card2, alignItems: 'center', justifyContent: 'center', borderWidth: d === dayKey() ? 2 : 0, borderColor: '#FFFFFF' }}><T size={10} w="black" color={kept(d) ? C.ink : C.mute}>{weekdayLetter(d)}</T></View>)}</Row>
      </Card>
      <Card>
        <Row between><H size={18}>Ōra multiplier</H><Pill color={C.violetSoft} text={C.ora}>{`Now ×${streakMult(n)}`}</Pill></Row>
        {ladder.map(([d, m]) => (
          <View key={d} style={{ gap: 4 }}>
            <Row between><T w="black" color={n >= d ? C.lime : C.text}>{d} days</T><T w="black">×{m}</T></Row>
            <Bar pct={Math.min(1, n / d)} height={8} color={n >= d ? C.lime : C.momo} />
          </View>
        ))}
        <T size={13} color={C.mute}>{next ? `${next[0] - n} more day${next[0] - n > 1 ? 's' : ''} to ×${next[1]}.` : 'Max multiplier!'} One Daily Challenge a day keeps the streak.</T>
      </Card>
      <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="shield" size={34} c={C.green} />
        <View style={{ flex: 1 }}><T w="black">Encore shields · {g.streak.shields}/2</T><T size={12.5} color={C.mute}>Each covers one missed day automatically. Earned at 7-day milestones or 500 Ōra.</T></View>
        <Btn small title="500" icon="gem" disabled={g.streak.shields >= 2 || g.wallet < 500} onPress={() => { if (g.buyShield()) { haptic.success(); useFx.getState().toast('momo', 'Encore shield ready', 'If you miss a day, I\'ll hold the streak.', 'celebrate'); } }} />
      </Card>
      {!g.day.challenge && <Btn title="Play today's challenge" icon="bolt" onPress={() => router.push({ pathname: '/quiz', params: { mode: 'daily' } })} />}
    </Screen>
  );
}
