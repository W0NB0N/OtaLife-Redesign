// Mascot inbox: messages generated from your real state, newest first.
import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { C, DOMAIN, Who } from '@/theme';
import { cheersMax, useGame } from '@/store/game';
import { FESTIVAL_DAY } from '@/content/catalog';
import { leaguePos } from '@/store/league';
import { daysUntil, untilMidnight, untilWeekEnd } from '@/lib/time';
import { wordToday } from '@/lib/derived';
import { MascotStill } from '@/mascots/Mascot';
import { Btn, Card, H, Row, T } from '@/ui/kit';
import { BackBar, Screen } from '@/ui/game';

export default function Inbox() {
  const g = useGame();
  const router = useRouter();
  const msgs: { who: Who; title: string; body: string; cta?: [string, () => void] }[] = [];
  const evening = new Date().getHours() >= 18;
  if (!g.day.challenge && g.streak.count > 0 && evening) msgs.push({ who: 'momo', title: 'Streak at risk', body: `${g.streak.count} days together! ${untilMidnight()} left to play today's challenge.`, cta: ['Play now', () => router.push({ pathname: '/quiz', params: { mode: 'daily' } })] });
  if (g.tickets.std + g.tickets.rare + g.tickets.legend > 0) msgs.push({ who: 'momo', title: 'Capsules waiting', body: `You have ${g.tickets.std + g.tickets.rare + g.tickets.legend} capsule ticket${g.tickets.std + g.tickets.rare + g.tickets.legend > 1 ? 's' : ''}. The machine is warm!`, cta: ['Pull now', () => router.push('/gacha')] });
  if (!g.day.challenge) msgs.push({ who: 'puri', title: 'Daily Challenge is live', body: 'Five questions, fifteen seconds each. Keeps your streak and drops a ticket.', cta: ['Queue up', () => router.push({ pathname: '/quiz', params: { mode: 'daily' } })] });
  msgs.push({ who: 'puri', title: 'Weekly league', body: `You're #${leaguePos(g.week.ora, g.week.key)} this week. It ends in ${untilWeekEnd()}; top 5 move up.`, cta: ['Open league', () => router.push('/arena')] });
  if (!g.day.word) { const w = wordToday(); msgs.push({ who: 'taku', title: 'Word of the day', body: `${w.jp} (${w.ro}): ${w.en}. Learn it for +20 Ōra.`, cta: ['Learn it', () => router.push('/discover')] }); }
  if (g.day.cheersUsed < cheersMax(g.power)) msgs.push({ who: 'taku', title: 'Cheers to spend', body: `${cheersMax(g.power) - g.day.cheersUsed} Fan Council Cheers left today. They don't carry over.`, cta: ['Open council', () => router.push('/council')] });
  const d = daysUntil(FESTIVAL_DAY);
  if (d >= 0 && !g.orders.some(o => o.eventId === 'delhi')) msgs.push({ who: 'momo', title: d ? `${d} days to my debut` : 'My debut is today!', body: 'Prime and VIP passes include a Legend capsule ticket. Come see me!', cta: ['See passes', () => router.push({ pathname: '/event/[id]', params: { id: 'delhi' } })] });
  return (
    <Screen>
      <BackBar title="Mascot inbox" sub={`${msgs.length} messages`} />
      {msgs.map((m, i) => (
        <Animated.View key={m.title} entering={FadeInDown.delay(i * 60).springify()}>
          <Card color={DOMAIN[m.who].deep} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ width: 54, height: 54, borderRadius: 18, overflow: 'hidden', backgroundColor: DOMAIN[m.who].fill, alignItems: 'center', justifyContent: 'flex-end' }}>
              <MascotStill who={m.who} state={m.who === 'momo' ? 'sparkle' : m.who === 'puri' ? 'gg' : 'wotagei'} size={70} acc={m.who === 'puri' ? 'headset' : null} />
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Row between><H size={16}>{m.title}</H><T size={11.5} color={C.mute}>{DOMAIN[m.who].name}</T></Row>
              <T size={14} color={C.soft}>{m.body}</T>
              {m.cta && <Btn small title={m.cta[0]} onPress={m.cta[1]} style={{ alignSelf: 'flex-start' }} />}
            </View>
          </Card>
        </Animated.View>
      ))}
    </Screen>
  );
}
