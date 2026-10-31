import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { C, Rarity, themed } from '@/theme';
import { useGame } from '@/store/game';
import { haptic, useFx } from '@/store/fx';
import { PRIZES, RARITY_ORDER } from '@/content/catalog';
import { Mascot } from '@/mascots/Mascot';
import { Btn, Card, Chip, H, Pill, Row, T } from '@/ui/kit';
import { BackBar, Screen } from '@/ui/game';
import { PrizeArt, RARITY } from '@/screens/PrizeArt';

export default function Cabinet() {
  const g = useGame();
  const router = useRouter();
  const [f, setF] = useState<'all' | Rarity>('all');
  const items = g.cabinet
    .map(c => ({ c, p: PRIZES.find(p => p.id === c.id)! }))
    .filter(x => x.p && (f === 'all' || x.p.r === f))
    .sort((a, b) => RARITY_ORDER.indexOf(b.p.r) - RARITY_ORDER.indexOf(a.p.r) || b.c.at - a.c.at);
  return (
    <Screen>
      <BackBar title="Capsule cabinet" sub={`${g.cabinet.length} items · ${g.pulls} pulls`} />
      <Row gap={8} style={{ flexWrap: 'wrap' }}>{(['all', 'legendary', 'epic', 'rare', 'common'] as const).map(k => <Chip key={k} label={k === 'all' ? 'All' : RARITY[k].label} on={f === k} onPress={() => setF(k)} />)}</Row>
      {items.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {items.map(({ c, p }, i) => {
            const expired = c.expires && c.expires < Date.now();
            const days = c.expires ? Math.ceil((c.expires - Date.now()) / 864e5) : 0;
            return (
              <Animated.View key={c.uid} entering={FadeInDown.delay(i * 40)} style={[styles.it, { borderColor: RARITY[p.r].fill }]}>
                <View style={[styles.art, { backgroundColor: RARITY[p.r].soft }]}><PrizeArt p={p} size={84} /></View>
                <Pill color={RARITY[p.r].soft} text={RARITY[p.r].deep}>{RARITY[p.r].label}</Pill>
                <T w="black" size={13.5} numberOfLines={2}>{p.name}</T>
                <T size={11.5} color={C.mute}>{c.used ? 'Used at checkout' : expired ? 'Expired' : c.expires ? `Expires in ${days} day${days === 1 ? '' : 's'}` : p.desc}</T>
                {p.part && <Btn small kind={g.equipped === p.part ? 'lime' : 'ghost'} title={g.equipped === p.part ? 'Equipped' : 'Equip'} onPress={() => { g.equip(g.equipped === p.part ? null : p.part!); haptic.success(); }} />}
                {p.id === 'cp-15' && !c.used && !expired && <Btn small kind="ghost" title="Use in shop" onPress={() => router.push('/shop')} />}
              </Animated.View>
            );
          })}
        </View>
      ) : (
        <Card style={{ alignItems: 'center' }}>
          <Mascot who="momo" state="sad" size={140} />
          <H size={19} center>{f === 'all' ? 'Your cabinet is empty' : `No ${RARITY[f as Rarity].label} prizes yet`}</H>
          <T center color={C.mute}>Prizes from the capsule machine land here, sorted by rarity.</T>
          <Btn title="Turn the handle" onPress={() => router.replace('/gacha')} />
        </Card>
      )}
    </Screen>
  );
}
const styles = themed(() => StyleSheet.create({
  it: { width: '48%', flexGrow: 1, backgroundColor: C.card, borderRadius: 22, padding: 10, gap: 6, borderWidth: 2.5 },
  art: { height: 100, borderRadius: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
}));
