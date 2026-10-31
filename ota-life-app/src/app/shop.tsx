import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { C, F, themed } from '@/theme';
import { activeCoupons, useGame } from '@/store/game';
import { PRODUCTS } from '@/content/catalog';
import { RANKS, rankIdx } from '@/content/ranks';
import { fmt } from '@/lib/time';
import { Mascot } from '@/mascots/Mascot';
import { Icon } from '@/art/Icon';
import { ProductArt } from '@/art/Products';
import { Btn, Card, Chip, H, Pill, Press, Row, T } from '@/ui/kit';
import { BackBar, OraChip, Screen } from '@/ui/game';

const CATS: Record<string, string[]> = { All: [], Apparel: ['tee', 'hoodie', 'tote'], Collectibles: ['stand', 'plush', 'keychain', 'poster'], Gear: ['glow'] };

export default function Shop() {
  const g = useGame();
  const router = useRouter();
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'popular' | 'low' | 'high'>('popular');
  const list = PRODUCTS.filter(p => (cat === 'All' || CATS[cat].includes(p.kind)) && p.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : b.reviews - a.reviews));
  return (
    <Screen>
      <BackBar title="Merch store" sub="Official Ōta TOKYO goods" right={<OraChip />} />
      <Row style={styles.search}><Icon name="search" size={20} c={C.mute} /><TextInput value={q} onChangeText={setQ} placeholder="Search merch" placeholderTextColor={C.dim} style={styles.input} /></Row>
      <Row gap={8} style={{ flexWrap: 'wrap' }}>{Object.keys(CATS).map(c => <Chip key={c} label={c} on={cat === c} onPress={() => setCat(c)} />)}</Row>
      <Row gap={8}>
        {([['popular', 'Popular'], ['low', 'Price ↑'], ['high', 'Price ↓']] as const).map(([k, l]) => (
          <Press key={k} onPress={() => setSort(k)}><Pill color={sort === k ? C.ora : C.card} text={C.text}>{l}</Pill></Press>
        ))}
      </Row>
      <Card color={C.violetSoft} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="gem" size={30} c={C.ora} />
        <T style={{ flex: 1 }} size={13.5}>{RANKS[rankIdx(g.power)].cap ? `As ${RANKS[rankIdx(g.power)].name} you can pay up to ${RANKS[rankIdx(g.power)].cap}% with Ōra (10 Ōra = ₹1).` : 'Reach Kōhai to start paying with Ōra.'}{activeCoupons(g).length ? ' Your 15% coupon applies too.' : ''}</T>
      </Card>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {list.map((p, i) => (
          <Animated.View key={p.id} entering={FadeInDown.delay(i * 50).springify()} style={{ width: '48%', flexGrow: 1 }}>
            <Press onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })} style={styles.prod}>
              <View style={[styles.art, { backgroundColor: p.color + '26' }]}>
                <ProductArt p={p} size={140} />
                {p.tag && <Pill color={C.lime} text={C.ink} style={{ position: 'absolute', top: 8, left: 8 }}>{p.tag}</Pill>}
              </View>
              <T w="black" size={13.5} numberOfLines={1}>{p.name}</T>
              <Row gap={4}><Icon name="star" size={13} c={C.gold} /><T size={12} color={C.mute}>{p.rating} · {p.reviews}</T></Row>
              <Row between><T w="black" size={15}>₹{fmt(p.price)}</T><T size={11} w="black" color={C.ora}>+{Math.floor(p.price / 10)} Ōra</T></Row>
            </Press>
          </Animated.View>
        ))}
      </View>
      {!list.length && <Card style={{ alignItems: 'center' }}><Mascot who="momo" state="think" size={120} /><T center color={C.mute}>Nothing matches. Pitch it to the Fan Council!</T><Btn title="Open Fan Council" onPress={() => router.push('/council')} /></Card>}
    </Screen>
  );
}
const styles = themed(() => StyleSheet.create({
  search: { backgroundColor: C.card, borderRadius: 20, paddingHorizontal: 14, height: 50 },
  input: { flex: 1, color: C.text, fontFamily: F.body, fontSize: 15, outlineStyle: 'none' as any },
  prod: { backgroundColor: C.card, borderRadius: 24, padding: 8, gap: 5 },
  art: { height: 150, borderRadius: 18, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
}));
