// Stage (Momo): capsule machine, events and merch.
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { C, themed } from '@/theme';
import { activeCoupons, useGame } from '@/store/game';
import { EVENTS, FESTIVAL_DAY, PRODUCTS } from '@/content/catalog';
import { daysUntil, fmt, shortDay } from '@/lib/time';
import { Mascot } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { CapsuleArt } from '@/art/Machine';
import { EventScene, ProductArt } from '@/art/Products';
import { Btn, Card, H, Over, Pill, Press, Row, Section, T } from '@/ui/kit';
import { Screen, TopBar } from '@/ui/game';

export default function Stage() {
  const g = useGame();
  const router = useRouter();
  const W = Dimensions.get('window').width - 32;
  const tickets = g.tickets.std + g.tickets.rare + g.tickets.legend;
  const coupons = activeCoupons(g);
  const days = daysUntil(FESTIVAL_DAY);
  const passes = g.orders.filter(o => o.kind === 'ticket').length;
  return (
    <Screen tabs>
      <TopBar title="Stage" />
      <View style={styles.hero}>
        <Blob seed="stage" color={C.momoSoft} size={230} second="#FF5C9A44" style={{ position: 'absolute', right: -30, top: -20 }} />
        <View style={{ flex: 1, gap: 6, zIndex: 2 }}>
          <Over color={C.momo}>Hosted by Momo-chan</Over>
          <H size={30}>Stage</H>
          <T color={C.soft}>Events, capsules and merch. {days > 0 ? `${days} days to my debut!` : 'Debut week!'}</T>
        </View>
        <Mascot who="momo" state="wave" size={150} style={{ marginBottom: -26, marginRight: -10 }} />
      </View>

      <Row gap={12} style={{ alignItems: 'stretch' }}>
        <Press onPress={() => router.push('/gacha')} style={[styles.tile, { backgroundColor: C.bar }]}>
          <H size={18}>Capsule machine</H>
          <T size={12.5} color={C.mute}>{tickets ? `${tickets} ticket${tickets > 1 ? 's' : ''} ready` : 'Pull with Ōra or earn a ticket'}</T>
          <Row gap={0} style={{ marginTop: 'auto' }}>
            <CapsuleArt color={C.momo} size={40} /><View style={{ marginLeft: -10 }}><CapsuleArt color={C.rare} size={40} /></View><View style={{ marginLeft: -10 }}><CapsuleArt color={C.gold} size={40} /></View>
          </Row>
        </Press>
        <Press onPress={() => router.push('/orders')} style={[styles.tile, { backgroundColor: C.card }]}>
          <H size={18}>My orders</H>
          <T size={12.5} color={C.mute}>{g.orders.length ? `${passes} pass${passes === 1 ? '' : 'es'} · ${g.orders.length - passes} merch` : 'Passes and merch show here'}</T>
          <View style={{ marginTop: 'auto', alignSelf: 'flex-end' }}><Icon name="qr" size={40} c={C.momo} c2={C.lime} /></View>
        </Press>
      </Row>

      <Section title="Events" />
      {EVENTS.map(ev => (
        <Press key={ev.id} onPress={() => router.push({ pathname: '/event/[id]', params: { id: ev.id } })} style={styles.event}>
          <EventScene scene={ev.scene} color={ev.color} width={W} height={130} />
          <View style={{ padding: 14, gap: 4 }}>
            <Row between>
              <Over color={ev.color}>{ev.days.map(shortDay).join(' & ')} · {ev.city}</Over>
              {daysUntil(ev.days[0]) >= 0 && <Pill color={ev.color + '33'} text={ev.color}>{daysUntil(ev.days[0]) === 0 ? 'Today' : `In ${daysUntil(ev.days[0])} days`}</Pill>}
            </Row>
            <H size={20}>{ev.name}</H>
            <Row between><T size={13} color={C.mute}>{ev.place}</T><T w="black" color={C.lime}>From ₹{fmt(Math.min(...ev.tiers.map(t => t.price)))}</T></Row>
          </View>
        </Press>
      ))}

      <Section title="Merch" action="See all" onAction={() => router.push('/shop')} />
      {coupons.length > 0 && <Card color={C.violetSoft} style={{ flexDirection: 'row', alignItems: 'center' }}><Pill color={C.epic} text={C.ink}>Epic coupon</Pill><T w="black" style={{ flex: 1 }}>15% off merch applies itself at checkout</T></Card>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 16 }} style={{ marginHorizontal: -16, paddingLeft: 16 }}>
        {PRODUCTS.slice(0, 5).map(p => (
          <Press key={p.id} onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })} style={styles.prod}>
            <View style={[styles.prodArt, { backgroundColor: p.color + '26' }]}><ProductArt p={p} size={140} /></View>
            <T w="black" size={13.5} numberOfLines={1}>{p.name}</T>
            <Row between><T w="black">₹{fmt(p.price)}</T><T size={11} w="black" color={C.ora}>+{Math.floor(p.price / 10)} Ōra</T></Row>
          </Press>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = themed(() => StyleSheet.create({
  hero: { backgroundColor: C.momoDeep, borderRadius: 32, padding: 18, flexDirection: 'row', alignItems: 'flex-end', overflow: 'hidden', minHeight: 170 },
  tile: { flex: 1, borderRadius: 26, padding: 14, gap: 4, minHeight: 150 },
  event: { backgroundColor: C.card, borderRadius: 26, overflow: 'hidden' },
  prod: { width: 160, backgroundColor: C.card, borderRadius: 24, padding: 8, gap: 6 },
  prodArt: { height: 150, borderRadius: 18, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
}));
