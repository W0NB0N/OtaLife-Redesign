// Checkout: coupon from the cabinet applies itself, Ōra pays up to the rank cap, address for merch.
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F, themed } from '@/theme';
import { activeCoupons, useGame } from '@/store/game';
import { haptic, useFx } from '@/store/fx';
import { EVENTS, PRODUCTS } from '@/content/catalog';
import { RANKS, rankIdx } from '@/content/ranks';
import { fmt, fmtDay } from '@/lib/time';
import { Mascot } from '@/mascots/Mascot';
import { Icon } from '@/art/Icon';
import { EventScene, ProductArt } from '@/art/Products';
import { Btn, Card, H, Num, Over, Pill, Press, Row, T } from '@/ui/kit';
import { BackBar, Screen, Slider } from '@/ui/game';

export default function Checkout() {
  const { kind, id, size, tier, day } = useLocalSearchParams<{ kind: 'merch' | 'ticket'; id: string; size?: string; tier?: string; day?: string }>();
  const g = useGame();
  const router = useRouter();
  const ins = useSafeAreaInsets();
  const setBusy = useFx(s => s.setBusy);
  React.useEffect(() => { setBusy(true); return () => setBusy(false); }, []);

  const item = useMemo(() => {
    if (kind === 'merch') { const p = PRODUCTS.find(x => x.id === id)!; return { name: p.name, detail: size ? `Size ${size}` : 'One size', price: p.price, product: p, event: null as any, legend: false, who: p.who }; }
    const ev = EVENTS.find(x => x.id === id)!; const t = ev.tiers.find(x => x.id === tier)!;
    return { name: `${ev.name} · ${t.name}`, detail: fmtDay(day!), price: t.price, product: null as any, event: ev, legend: !!t.legend, who: 'momo' as const };
  }, []);

  const coupons = activeCoupons(g);
  const [useCoupon, setUseCoupon] = useState(kind === 'merch' && coupons.length > 0);
  const couponOff = useCoupon ? Math.round(item.price * 0.15) : 0;
  const cap = RANKS[rankIdx(g.power)].cap;
  const maxOra = Math.max(0, Math.min(Math.floor(g.wallet / 10) * 10, Math.floor(((item.price - couponOff) * cap) / 100) * 10));
  const [ora, setOra] = useState(maxOra);
  const oraUsed = Math.min(ora, maxOra);
  const total = Math.max(0, item.price - couponOff - oraUsed / 10);
  const earnBack = Math.floor(total / 10);

  const [addr, setAddr] = useState(g.address || { name: g.name, phone: '', line: '', city: '', pin: '' });
  const addrOk = kind !== 'merch' || (addr.name.trim().length > 1 && /^[6-9]\d{9}$/.test(addr.phone) && addr.line.trim().length > 5 && addr.city.trim().length > 1 && /^\d{6}$/.test(addr.pin));
  const [placing, setPlacing] = useState(false);

  const place = () => {
    if (!addrOk || placing) return;
    setPlacing(true); haptic.medium();
    if (kind === 'merch') g.setSize && size && g.setSize(size);
    if (kind === 'merch') useGame.setState({ address: addr });
    const order = g.placeOrder({
      kind, item: id, name: item.name, detail: item.detail, price: item.price, coupon: couponOff, ora: oraUsed, total,
      legend: item.legend, eventId: kind === 'ticket' ? id : undefined, day: kind === 'ticket' ? day : undefined,
    }, useCoupon ? coupons[0]?.uid : undefined);
    if (earnBack) useGame.getState().earn(earnBack, { mult: false });
    setTimeout(() => router.replace({ pathname: '/order/[id]', params: { id: order.id, fresh: '1' } }), 450);
  };

  const field = (k: keyof typeof addr, ph: string, opts: any = {}) => (
    <TextInput value={addr[k]} onChangeText={v => setAddr(a => ({ ...a, [k]: v }))} placeholder={ph} placeholderTextColor={C.dim} style={styles.input} {...opts} />
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen style={{ paddingBottom: 130 + ins.bottom }} keyboardShouldPersistTaps="handled">
        <BackBar title="Checkout" sub={kind === 'merch' ? 'Merch order' : 'Event pass'} />
        <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.thumb}>{item.product ? <ProductArt p={item.product} size={80} bg={false} /> : <EventScene scene={item.event.scene} color={item.event.color} width={80} height={80} />}</View>
          <View style={{ flex: 1 }}><T w="black" size={15}>{item.name}</T><T size={13} color={C.mute}>{item.detail}</T></View>
          <H size={18}>₹{fmt(item.price)}</H>
        </Card>

        {kind === 'merch' && (
          <Press onPress={() => coupons.length && setUseCoupon(u => !u)} style={[styles.row, !coupons.length && { opacity: 0.6 }]}>
            <Icon name="ticket" size={24} c={C.epic} />
            <View style={{ flex: 1 }}><T w="black">15% Epic coupon</T><T size={12.5} color={C.mute}>{coupons.length ? `From your capsule cabinet · ${coupons.length} available` : 'Pull one from the capsule machine'}</T></View>
            <View style={[styles.switch, useCoupon && { backgroundColor: C.ora }]}><View style={[styles.knob, useCoupon && { transform: [{ translateX: 20 }] }]} /></View>
          </Press>
        )}

        <Card>
          <Row between><T w="black">Pay with Ōra</T><Pill color={C.violetSoft} text={C.ora}>{`${fmt(oraUsed)} Ōra = ₹${fmt(oraUsed / 10)}`}</Pill></Row>
          {maxOra > 0 ? <Slider value={oraUsed} max={maxOra} step={10} onChange={setOra} /> : null}
          <T size={12.5} color={C.mute}>{cap ? `${RANKS[rankIdx(g.power)].name} can cover up to ${cap}% with Ōra. 10 Ōra = ₹1. Spending never lowers your rank.` : 'Reach Kōhai rank to pay with Ōra.'}</T>
        </Card>

        {kind === 'merch' && (
          <Card>
            <Over>Delivery address</Over>
            {field('name', 'Full name', { autoComplete: 'name' })}
            {field('phone', 'Mobile number (10 digits)', { keyboardType: 'phone-pad', maxLength: 10, autoComplete: 'tel' })}
            {field('line', 'House, street, area', { autoComplete: 'street-address' })}
            <Row gap={8}>
              <View style={{ flex: 1 }}>{field('city', 'City')}</View>
              <View style={{ width: 120 }}>{field('pin', 'PIN code', { keyboardType: 'number-pad', maxLength: 6 })}</View>
            </Row>
            {!addrOk && (addr.phone || addr.pin) ? <T size={12} color={C.red}>Check the mobile number (10 digits) and PIN code (6 digits).</T> : null}
          </Card>
        )}

        <Card style={{ gap: 6 }}>
          <Row between><T color={C.mute}>Subtotal</T><T w="black">₹{fmt(item.price)}</T></Row>
          {couponOff > 0 && <Row between><T color={C.green}>Coupon</T><T w="black" color={C.green}>−₹{fmt(couponOff)}</T></Row>}
          {oraUsed > 0 && <Row between><T color={C.green}>Ōra</T><T w="black" color={C.green}>−₹{fmt(oraUsed / 10)}</T></Row>}
          {kind === 'merch' && <Row between><T color={C.mute}>Delivery</T><T w="black" color={C.green}>Free</T></Row>}
          <View style={{ height: 2, backgroundColor: C.line, marginVertical: 6, borderRadius: 1 }} />
          <Row between><H size={20}>To pay</H><Num value={total} prefix="₹" style={{ fontFamily: F.display, fontSize: 22, color: C.text }} /></Row>
          <Row gap={6}><Icon name="gem" size={16} c={C.ora} /><T size={12.5} color={C.ora}>You’ll earn +{earnBack} Ōra{item.legend ? ' and a Legend capsule ticket' : ''}</T></Row>
        </Card>
        <Card color={C.violetSoft} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="info" size={20} c={C.mute} />
          <T size={12.5} color={C.mute} style={{ flex: 1 }}>{kind === 'merch' ? 'Pay by UPI or cash when your order arrives.' : 'Pay by UPI or cash at the box office when you show this pass.'}</T>
        </Card>
      </Screen>
      <View style={[styles.dock, { paddingBottom: ins.bottom + 12 }]}>
        <Mascot who={item.who} state={placing ? 'cheer' : 'idle'} size={70} acc={item.who === 'puri' ? 'headset' : null} />
        <Btn title={placing ? 'Placing…' : kind === 'merch' ? `Place order · ₹${fmt(total)}` : `Book pass · ₹${fmt(total)}`} disabled={!addrOk || placing} style={{ flex: 1 }} onPress={place} />
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = themed(() => StyleSheet.create({
  thumb: { width: 80, height: 80, borderRadius: 18, overflow: 'hidden', backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: 22, padding: 14 },
  switch: { width: 50, height: 30, borderRadius: 15, backgroundColor: C.card2, padding: 3 },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFFFFF' },
  input: { backgroundColor: C.card2, borderRadius: 14, height: 48, paddingHorizontal: 14, color: C.text, fontFamily: F.body, fontSize: 15, outlineStyle: 'none' as any },
  dock: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 8, backgroundColor: C.bg2, borderTopLeftRadius: 26, borderTopRightRadius: 26 },
}));
