// Order confirmation and the pass itself: a scannable QR for event tickets, a tracker for merch.
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { C, themed } from '@/theme';
import { useGame } from '@/store/game';
import { EVENTS } from '@/content/catalog';
import { fmt, fmtDay } from '@/lib/time';
import { Mascot } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { EventScene } from '@/art/Products';
import { Btn, Card, H, Over, Pill, Row, T } from '@/ui/kit';
import { BackBar, Screen } from '@/ui/game';
import { Confetti } from '@/ui/overlays';

export default function OrderPage() {
  const { id, fresh } = useLocalSearchParams<{ id: string; fresh?: string }>();
  const o = useGame(s => s.orders.find(x => x.id === id));
  const router = useRouter();
  const W = Dimensions.get('window').width - 32;
  if (!o) return <Screen><BackBar title="Order" /><T color={C.mute}>This order was not found.</T></Screen>;
  const ev = o.eventId ? EVENTS.find(e => e.id === o.eventId) : null;
  const ageH = (Date.now() - o.at) / 36e5;
  const steps = ['Confirmed', 'Packed', 'Shipped', 'Delivered'];
  const stage = ageH < 6 ? 0 : ageH < 30 ? 1 : ageH < 96 ? 2 : 3;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Screen>
        {fresh ? <View style={{ height: 6 }} /> : <BackBar title={o.kind === 'ticket' ? 'Your pass' : 'Your order'} sub={o.code} />}
        {fresh && (
          <View style={{ alignItems: 'center', gap: 6 }}>
            <View style={{ height: 200, width: '100%', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Blob seed="order" color={C.momoSoft} size={220} second="#FF5C9A44" style={{ position: 'absolute', top: 0 }} />
              <Mascot who="momo" state="celebrate" size={180} />
            </View>
            <Animated.View entering={ZoomIn.springify().damping(12)}><H size={30} center>{o.kind === 'ticket' ? 'See you at my debut!' : 'Order placed!'}</H></Animated.View>
            <T center color={C.mute}>{o.kind === 'ticket' ? 'Your pass is saved in My orders. Show the QR at the gate.' : 'Track it any time in My orders. Pay on delivery.'}</T>
          </View>
        )}
        {o.kind === 'ticket' && ev ? (
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.ticket}>
            <EventScene scene={ev.scene} color={ev.color} width={W} height={110} />
            <View style={{ padding: 16, gap: 2 }}>
              <Over color={ev.color}>{o.detail}</Over>
              <H size={20}>{o.name}</H>
              <T size={13} color={C.mute}>{ev.place}, {ev.city}</T>
            </View>
            <View style={styles.tear}><View style={[styles.notch, { left: -14 }]} /><View style={styles.dash} /><View style={[styles.notch, { right: -14 }]} /></View>
            <View style={{ alignItems: 'center', padding: 18, gap: 10 }}>
              <View style={{ padding: 12, backgroundColor: '#FFFFFF', borderRadius: 18 }}>
                <QRCode value={`OTA|${o.code}|${o.item}|${o.day}`} size={170} color="#120F2A" backgroundColor="#FFFFFF" />
              </View>
              <Pill color={C.card2} style={{ alignSelf: 'center' }}>{o.code}</Pill>
              <T size={12.5} color={C.mute} center>{o.total > 0 ? `Pay ₹${fmt(o.total)} at the box office` : 'Fully paid with Ōra and coupons'}</T>
            </View>
          </Animated.View>
        ) : (
          <Card>
            <Row between><T w="black" size={15} style={{ flex: 1 }}>{o.name}</T><Pill color={C.card2}>{o.code}</Pill></Row>
            <T size={13} color={C.mute}>{o.detail}</T>
            <Row gap={4} style={{ marginTop: 6 }}>
              {steps.map((s, k) => (
                <View key={s} style={{ flex: 1, gap: 6 }}>
                  <View style={{ height: 8, borderRadius: 4, backgroundColor: k <= stage ? C.lime : C.card2 }} />
                  <T size={11} w="black" color={k <= stage ? C.text : C.dim}>{s}</T>
                </View>
              ))}
            </Row>
          </Card>
        )}
        <Card style={{ gap: 6 }}>
          <Row between><T color={C.mute}>Price</T><T w="black">₹{fmt(o.price)}</T></Row>
          {o.coupon > 0 && <Row between><T color={C.green}>Coupon</T><T w="black" color={C.green}>−₹{fmt(o.coupon)}</T></Row>}
          {o.ora > 0 && <Row between><T color={C.green}>Ōra ({fmt(o.ora)})</T><T w="black" color={C.green}>−₹{fmt(o.ora / 10)}</T></Row>}
          <Row between><H size={18}>{o.kind === 'ticket' ? 'Due at the gate' : 'Due on delivery'}</H><H size={18}>₹{fmt(o.total)}</H></Row>
          <Row gap={6}><Icon name="gem" size={16} c={C.ora} /><T size={12.5} color={C.ora}>Earned +{Math.floor(o.total / 10)} Ōra{o.legend ? ' and a Legend capsule ticket' : ''}</T></Row>
        </Card>
        {fresh ? <Btn title="Done" onPress={() => router.dismissTo('/stage')} /> : null}
        {fresh && o.legend ? <Btn title="Open my Legend capsule" kind="ghost" onPress={() => router.replace('/gacha')} /> : null}
      </Screen>
      {fresh && <Confetti count={40} seed={7} />}
    </View>
  );
}
const styles = themed(() => StyleSheet.create({
  ticket: { backgroundColor: C.card, borderRadius: 28, overflow: 'hidden' },
  tear: { height: 28, justifyContent: 'center' },
  notch: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: C.bg },
  dash: { marginHorizontal: 22, borderTopWidth: 3, borderColor: C.line, borderStyle: 'dashed' },
}));
