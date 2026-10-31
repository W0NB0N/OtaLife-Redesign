import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, themed } from '@/theme';
import { useGame } from '@/store/game';
import { haptic } from '@/store/fx';
import { EVENTS } from '@/content/catalog';
import { dayKey, daysUntil, fmt, fmtDay } from '@/lib/time';
import { Mascot, MState } from '@/mascots/Mascot';
import { Icon } from '@/art/Icon';
import { EventScene } from '@/art/Products';
import { Btn, Bubble, Card, H, Over, Pill, Press, Row, T } from '@/ui/kit';
import { BackBar, OraChip, Screen } from '@/ui/game';

const MOMO_LINE: Record<string, [string, MState]> = { gen: ['Every fan counts. See you there!', 'wave'], prime: ['Prime! Seated for my LIVE. Smart.', 'sparkle'], vip: ['VIP!! Front row! I\'ll wave at you!', 'celebrate'], seat: ['Draw me cute, okay?', 'sparkle'], entry: ['Save me some takoyaki!', 'happy'] };

export default function EventPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ev = EVENTS.find(e => e.id === id) || EVENTS[0];
  const router = useRouter();
  const ins = useSafeAreaInsets();
  const g = useGame();
  const W = Dimensions.get('window').width - 32;
  const open = ev.days.filter(d => d >= dayKey());
  const [day, setDay] = useState(open[0] || ev.days[0]);
  const [tier, setTier] = useState(ev.tiers[Math.min(1, ev.tiers.length - 1)].id);
  const t = ev.tiers.find(x => x.id === tier)!;
  const ended = !open.length;
  const owned = g.orders.filter(o => o.eventId === ev.id).length;
  const [line, st] = MOMO_LINE[tier] || ['See you there!', 'wave'];
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Screen style={{ paddingBottom: 120 + ins.bottom }}>
        <BackBar title={ev.name} sub={`${ev.place} · ${ev.city}`} right={<OraChip />} />
        <View style={styles.hero}>
          <EventScene scene={ev.scene} color={ev.color} width={W} height={200} />
          <View style={{ position: 'absolute', right: 0, bottom: -10, alignItems: 'flex-end' }}>
            <Bubble text={line} small tail="right" style={{ marginRight: 40 }} />
            <Mascot who="momo" state={st} size={120} />
          </View>
          <View style={{ position: 'absolute', left: 14, bottom: 14 }}><Pill color={C.lime} text={C.ink}>{ended ? 'Event ended' : daysUntil(open[0]) === 0 ? 'Today!' : `In ${daysUntil(open[0])} days`}</Pill></View>
        </View>
        <T color={C.soft}>{ev.about}</T>
        {owned > 0 && <Card color={C.greenSoft} onPress={() => router.push('/orders')} style={{ flexDirection: 'row', alignItems: 'center' }}><Icon name="ticket" size={22} c={C.green} /><T w="black" color={C.green} style={{ flex: 1 }}>You have {owned} pass{owned > 1 ? 'es' : ''} for this event</T><Icon name="chev" size={16} c={C.green} /></Card>}
        <H size={20}>Pick a day</H>
        <Row gap={8}>
          {ev.days.map(d => {
            const past = d < dayKey();
            return (
              <Press key={d} disabled={past} onPress={() => { setDay(d); haptic.tap(); }} style={[styles.opt, { flex: 1 }, day === d && styles.on, past && { opacity: 0.4 }]}>
                <Icon name="calendar" size={22} c={day === d ? C.lime : C.mute} c2={day === d ? C.ora : C.card2} />
                <H size={17}>{fmtDay(d)}</H>
                <T size={12} color={C.mute}>{past ? 'Over' : ev.id === 'delhi' ? (d === ev.days[0] ? 'Momo\'s debut · cosplay finals' : 'Guest headliner · voice actors') : '6 pm onwards'}</T>
              </Press>
            );
          })}
        </Row>
        <H size={20}>{ev.tiers.length > 1 ? 'Pick a pass' : 'Your pass'}</H>
        {ev.tiers.map((x, i) => (
          <Animated.View key={x.id} entering={FadeInDown.delay(i * 60).springify()}>
            <Press onPress={() => { setTier(x.id); haptic.tap(); }} style={[styles.opt, tier === x.id && styles.on]}>
              <Row between>
                <Row><View style={[styles.radio, tier === x.id && { borderWidth: 7, borderColor: C.lime }]} /><H size={19}>{x.name}</H>{x.legend && <Pill color={C.puriDeep} text={C.gold}>+ Legend ticket</Pill>}</Row>
                <H size={19}>₹{fmt(x.price)}</H>
              </Row>
              {x.perks.map(p => <Row key={p} gap={8}><Icon name="check" size={14} c={C.lime} /><T size={13.5} color={C.soft}>{p}</T></Row>)}
            </Press>
          </Animated.View>
        ))}
        <T size={12.5} color={C.mute}>Prices are per person. Check in at the gate on the day for +1,000 Ōra.</T>
      </Screen>
      <View style={[styles.dock, { paddingBottom: ins.bottom + 12 }]}>
        <View><H size={22}>₹{fmt(t.price)}</H><T size={11.5} color={C.mute}>{t.name} · {fmtDay(day)}</T></View>
        <Btn title={ended ? 'Event ended' : 'Continue'} disabled={ended} icon="ticket" style={{ flex: 1 }} onPress={() => router.push({ pathname: '/checkout', params: { kind: 'ticket', id: ev.id, tier, day } })} />
      </View>
    </View>
  );
}
const styles = themed(() => StyleSheet.create({
  hero: { borderRadius: 28, overflow: 'hidden', height: 200 },
  opt: { backgroundColor: C.card, borderRadius: 22, padding: 14, gap: 6, borderWidth: 2.5, borderColor: 'transparent' },
  on: { borderColor: C.lime, backgroundColor: C.selected },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2.5, borderColor: C.line },
  dock: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingTop: 12, backgroundColor: C.bg2, borderTopLeftRadius: 26, borderTopRightRadius: 26 },
}));
