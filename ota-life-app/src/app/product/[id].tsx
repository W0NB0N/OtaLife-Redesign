import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F, themed } from '@/theme';
import { activeCoupons, useGame } from '@/store/game';
import { useFx } from '@/store/fx';
import { PRODUCTS } from '@/content/catalog';
import { RANKS, rankIdx } from '@/content/ranks';
import { fmt } from '@/lib/time';
import { Mascot } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { ProductArt } from '@/art/Products';
import { Btn, Bubble, Card, H, Over, Pill, Press, Row, T } from '@/ui/kit';
import { BackBar, OraChip, PlayerAvatar, Screen } from '@/ui/game';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const QUOTES: Record<string, string> = { taku: 'I own three. Wash cold, no regrets.', momo: 'This is my good side!', puri: 'Squish rating: 11/10.' };

export default function Product() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
  const g = useGame();
  const router = useRouter();
  const ins = useSafeAreaInsets();
  const [size, setSize] = useState<string | null>(p.sizes ? g.size : null);
  const W = Dimensions.get('window').width - 32;
  const coupon = activeCoupons(g).length > 0;
  const cap = RANKS[rankIdx(g.power)].cap;
  const buy = () => {
    if (p.sizes && !size) { useFx.getState().toast('taku', 'Pick a size first', 'We remember it for next time.', 'think'); return; }
    if (size) g.setSize(size);
    router.push({ pathname: '/checkout', params: { kind: 'merch', id: p.id, size: size || '' } });
  };
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Screen style={{ paddingBottom: 120 + ins.bottom }}>
        <BackBar title={p.name} sub={`Official merch · ★ ${p.rating} (${p.reviews})`} right={<OraChip />} />
        <View style={[styles.gallery, { backgroundColor: p.color + '2E' }]}>
          <Blob seed={p.id + 'big'} color={p.color + '55'} size={W * 0.95} second={p.color + '22'} style={{ position: 'absolute', top: 10 }} />
          <Animated.View entering={ZoomIn.springify().damping(12)}><ProductArt p={p} size={W * 0.82} bg={false} /></Animated.View>
          <View style={{ position: 'absolute', right: 6, bottom: 0, alignItems: 'flex-end' }}>
            <Mascot who={p.who} state="happy" size={84} acc={p.who === 'puri' ? 'headset' : null} />
          </View>
        </View>
        <Row between>
          <H size={30}>₹{fmt(p.price)}</H>
          <Pill color={C.violetSoft} text={C.ora}>{`+${Math.floor(p.price / 10)} Ōra when you buy`}</Pill>
        </Row>
        {(coupon || cap > 0) && (
          <Card color={C.violetSoft} style={{ gap: 6 }}>
            {coupon && <Row><Icon name="ticket" size={20} c={C.epic} /><T w="black" style={{ flex: 1 }}>15% Epic coupon applies: −₹{fmt(Math.round(p.price * 0.15))}</T></Row>}
            {cap > 0 && <Row><Icon name="gem" size={20} c={C.ora} /><T style={{ flex: 1 }}>Pay up to {cap}% with Ōra as {RANKS[rankIdx(g.power)].name}</T></Row>}
          </Card>
        )}
        {p.sizes && (
          <Card>
            <Row between><H size={17}>Size</H><T size={12} color={C.mute}>{g.size ? 'Remembered from last time' : 'Asked once, remembered'}</T></Row>
            <Row gap={8}>{SIZES.map(z => <Press key={z} onPress={() => setSize(z)} style={[styles.size, size === z && { backgroundColor: C.lime }]}><T w="black" color={size === z ? C.ink : C.text}>{z}</T></Press>)}</Row>
          </Card>
        )}
        <Card><H size={17}>About</H><T color={C.soft}>{p.about}</T>
          <Row gap={16}><Row gap={6}><Icon name="bag" size={18} c={C.mute} /><T size={12.5} color={C.mute}>Ships in 3–5 days</T></Row><Row gap={6}><Icon name="shield" size={18} c={C.mute} /><T size={12.5} color={C.mute}>7-day returns</T></Row></Row>
        </Card>
        <Card>
          <H size={17}>Reviews</H>
          {[['Kavya Pillai', 2, 'Bought it at Bangalore, wearing it to Delhi. Quality is great.'], ['Rohit V.', 0, 'Colours are even brighter in person.']].map(([n, r, t]) => (
            <Row key={n as string} style={{ alignItems: 'flex-start' }}><PlayerAvatar name={n as string} rank={r as number} size={32} /><View style={{ flex: 1 }}><Row gap={6}><T w="black">{n}</T><Row gap={1}>{[0, 1, 2, 3, 4].map(k => <Icon key={k} name="star" size={11} c={C.gold} />)}</Row></Row><T size={14} color={C.soft}>{t}</T></View></Row>
          ))}
        </Card>
      </Screen>
      <View style={[styles.dock, { paddingBottom: ins.bottom + 12 }]}>
        <View><H size={22}>₹{fmt(p.price)}</H><T size={11.5} color={C.mute}>before discounts</T></View>
        <Btn title={p.sizes && !size ? 'Pick a size' : 'Buy now'} icon="bag" style={{ flex: 1 }} onPress={buy} />
      </View>
    </View>
  );
}
const styles = themed(() => StyleSheet.create({
  gallery: { borderRadius: 30, alignItems: 'center', justifyContent: 'center', paddingVertical: 20, overflow: 'hidden', minHeight: 320 },
  size: { flex: 1, height: 46, borderRadius: 14, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' },
  dock: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingTop: 12, backgroundColor: C.bg2, borderTopLeftRadius: 26, borderTopRightRadius: 26 },
}));
