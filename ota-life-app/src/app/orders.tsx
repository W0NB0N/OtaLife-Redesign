import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { C } from '@/theme';
import { useGame } from '@/store/game';
import { EVENTS, PRODUCTS } from '@/content/catalog';
import { ago, fmt } from '@/lib/time';
import { Mascot } from '@/mascots/Mascot';
import { Icon } from '@/art/Icon';
import { ProductArt, EventScene } from '@/art/Products';
import { Btn, Card, H, Pill, Row, Section, T } from '@/ui/kit';
import { BackBar, Screen } from '@/ui/game';

export default function Orders() {
  const orders = useGame(s => s.orders);
  const router = useRouter();
  const passes = orders.filter(o => o.kind === 'ticket'), merch = orders.filter(o => o.kind === 'merch');
  const row = (o: typeof orders[number]) => {
    const p = PRODUCTS.find(x => x.id === o.item), ev = EVENTS.find(x => x.id === o.eventId);
    return (
      <Card key={o.id} onPress={() => router.push({ pathname: '/order/[id]', params: { id: o.id } })} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <View style={{ width: 60, height: 60, borderRadius: 16, overflow: 'hidden', backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' }}>
          {p ? <ProductArt p={p} size={60} bg={false} /> : ev ? <EventScene scene={ev.scene} color={ev.color} width={60} height={60} /> : null}
        </View>
        <View style={{ flex: 1, gap: 2 }}><T w="black" numberOfLines={1}>{o.name}</T><T size={12.5} color={C.mute}>{o.detail} · {ago(o.at)} ago</T></View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}><T w="black">₹{fmt(o.total)}</T>{o.kind === 'ticket' ? <Icon name="qr" size={18} c={C.lime} /> : <Pill color={C.card2}>Track</Pill>}</View>
      </Card>
    );
  };
  return (
    <Screen>
      <BackBar title="My orders" sub={`${passes.length} passes · ${merch.length} merch`} />
      {!orders.length && (
        <Card style={{ alignItems: 'center' }}>
          <Mascot who="momo" state="sad" size={140} />
          <H size={19} center>No orders yet</H>
          <T center color={C.mute}>Grab a pass for Ōta TOKYO Delhi. Prime and VIP include a Legend capsule ticket.</T>
          <Btn title="See events" onPress={() => router.push({ pathname: '/event/[id]', params: { id: 'delhi' } })} />
        </Card>
      )}
      {passes.length > 0 && <Section title="Passes" />}
      {passes.map(row)}
      {merch.length > 0 && <Section title="Merch" />}
      {merch.map(row)}
    </Screen>
  );
}
