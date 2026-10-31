import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { C, F, themed } from '@/theme';
import { useGame } from '@/store/game';
import { haptic, useFx } from '@/store/fx';
import { COMMUNITIES } from '@/content/catalog';
import { rankIdx } from '@/content/ranks';
import { fmt } from '@/lib/time';
import { Mascot } from '@/mascots/Mascot';
import { Icon } from '@/art/Icon';
import { KanjiCover } from '@/art/Products';
import { Btn, Card, H, Press, Row, T } from '@/ui/kit';
import { BackBar, Screen } from '@/ui/game';

export default function Communities() {
  const g = useGame();
  const router = useRouter();
  const [q, setQ] = useState('');
  const list = COMMUNITIES.filter(c => (c.name + c.city + c.about).toLowerCase().includes(q.toLowerCase()));
  const joinedN = Object.values(g.joined).filter(Boolean).length;
  return (
    <Screen>
      <BackBar title="Communities" sub={`${joinedN} joined`} />
      <Row style={styles.search}><Icon name="search" size={20} c={C.mute} /><TextInput value={q} onChangeText={setQ} placeholder="Search fandoms, cities, games" placeholderTextColor={C.dim} style={styles.input} /></Row>
      {list.map(c => (
        <Card key={c.id} onPress={() => router.push({ pathname: '/community/[id]', params: { id: c.id } })} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          <View style={{ width: 64, height: 64, borderRadius: 18, overflow: 'hidden' }}><KanjiCover kanji={c.kanji} color={c.color} size={106} /></View>
          <View style={{ flex: 1, gap: 2 }}><T w="black" size={15}>{c.name}</T><T size={12.5} color={C.mute}>{fmt(c.members + (g.joined[c.id] ? 1 : 0))} members · {c.city}</T></View>
          <Btn small title={g.joined[c.id] ? 'Joined' : 'Join'} kind={g.joined[c.id] ? 'ghost' : 'lime'} onPress={() => { g.toggleJoin(c.id); if (!g.joined[c.id]) { haptic.success(); useFx.getState().toast('taku', 'Joined!', `${c.name}: say hi in the feed.`, 'wotagei'); } }} />
        </Card>
      ))}
      {!list.length && <Card style={{ alignItems: 'center' }}><Mascot who="taku" state="think" size={120} /><T center color={C.mute}>No community matches “{q}”.</T></Card>}
      <Card color={C.takuDeep} style={{ alignItems: 'center' }}>
        <Mascot who="taku" state="think" size={120} />
        <H size={19} center>Start your own community</H>
        <T center color={C.mute}>Unlocks at Otaku rank, so TAKU can vouch for every new group.</T>
        <Btn title={rankIdx(g.power) >= 3 ? 'Start a community' : `Unlocks at Otaku · ${fmt(Math.max(0, 10000 - g.power))} Ōra to go`} disabled={rankIdx(g.power) < 3} icon={rankIdx(g.power) >= 3 ? 'plus' : 'lock'}
          onPress={() => useFx.getState().toast('taku', 'Community requests open soon', 'We\'ll notify you in the inbox.', 'happy')} />
      </Card>
    </Screen>
  );
}

const styles = themed(() => StyleSheet.create({
  search: { backgroundColor: C.card, borderRadius: 20, paddingHorizontal: 14, height: 50 },
  input: { flex: 1, color: C.text, fontFamily: F.body, fontSize: 15, outlineStyle: 'none' as any },
}));
