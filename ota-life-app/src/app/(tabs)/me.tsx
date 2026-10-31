// Me: profile, rank progress, badges, partner and everything you own.
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { C, DOMAIN, F, Who, themed } from '@/theme';
import { useGame } from '@/store/game';
import { haptic, useFx } from '@/store/fx';
import { RANKS, rankIdx, stars, titleOf } from '@/content/ranks';
import { PRIZES } from '@/content/catalog';
import { leaguePos } from '@/store/league';
import { fmt } from '@/lib/time';
import { Mascot, MascotStill } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon, IconName } from '@/art/Icon';
import { Bar, Btn, Card, H, Over, Pill, Press, Row, Section, T } from '@/ui/kit';
import { Avatar, Screen, Stat } from '@/ui/game';
import { Sheet } from '@/ui/overlays';

export default function Me() {
  const g = useGame();
  const router = useRouter();
  const st = stars(g.power), cur = rankIdx(g.power);
  const [partner, setPartner] = useState(false);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(g.name);
  const badges = [
    { n: 'First pull', d: 'Open a capsule', k: '1', c: C.momo, ok: g.pulls > 0 },
    { n: 'Week warrior', d: '7-day streak', k: '7', c: C.orange, ok: g.streak.best >= 7 },
    { n: 'Quiz ronin', d: '10 perfect quizzes', k: '侍', c: C.puri, ok: g.perfects >= 10 },
    { n: 'Word nerd', d: 'Learn 7 words', k: '語', c: C.taku, ok: g.wordsLearned >= 7 },
    { n: 'Backer', d: 'Cheer 10 ideas', k: '応', c: C.ora, ok: Object.values(g.ideaCheers).reduce((a, b) => a + b, 0) >= 10 },
    { n: 'Festival-goer', d: 'Book a pass', k: '祭', c: C.gold, ok: g.orders.some(o => o.kind === 'ticket') },
  ];
  const parts = g.cabinet.map(c => PRIZES.find(p => p.id === c.id)).filter(p => p?.part);
  const menu: [IconName, string, string, () => void][] = [
    ['users', 'Partner mascot', DOMAIN[g.partner].name, () => setPartner(true)],
    ['ticket', 'My orders and passes', `${g.orders.length}`, () => router.push('/orders')],
    ['gift', 'Capsule cabinet', `${g.cabinet.length} items`, () => router.push('/cabinet')],
    ['star', 'Meet the cast', 'Poses and moods', () => router.push('/cast')],
    ['gear', 'Settings', '', () => router.push('/settings')],
  ];
  return (
    <Screen tabs>
      <Row between><H size={26}>Me</H><Press onPress={() => router.push('/settings')} style={styles.round}><Icon name="gear" size={22} c={C.text} /></Press></Row>
      <View style={styles.profile}>
        <Blob seed={'me' + g.partner} color={C.heroBlob} size={300} second="#8B6CFF33" style={{ position: 'absolute', top: -60 }} />
        <Avatar size={100} />
        {edit ? (
          <Row style={{ zIndex: 2 }}>
            <TextInput value={name} onChangeText={setName} maxLength={20} autoFocus style={styles.input} onSubmitEditing={() => { if (name.trim()) g.setName(name.trim()); setEdit(false); }} />
            <Btn small title="Save" onPress={() => { if (name.trim()) g.setName(name.trim()); setEdit(false); }} />
          </Row>
        ) : (
          <Press onPress={() => setEdit(true)}><Row gap={6}><H size={28}>{g.name}</H><Icon name="edit" size={18} c={C.heroSoft} /></Row></Press>
        )}
        <Pill color="#FFFFFF" text={C.ink}>{`${titleOf(g.power)} · partner ${DOMAIN[g.partner].name}`}</Pill>
        <Row gap={8} style={{ width: '100%' }}>
          <Stat value={g.power} label="Power" />
          <Stat value={g.streak.count} label="day streak" />
          <Stat value={`#${leaguePos(g.week.ora, g.week.key)}`} label="in league" />
        </Row>
      </View>
      <Card onPress={() => router.push('/journey')}>
        <Row between><H size={19}>Rank journey</H><Icon name="chev" size={18} c={C.mute} /></Row>
        <Row gap={5}>{RANKS.map((r, k) => <View key={r.id} style={{ flex: 1, height: 10, borderRadius: 5, backgroundColor: k < cur ? C.ora : k === cur ? C.lime : C.card2 }} />)}</Row>
        <T size={13} color={C.mute}>{st.next ? `Next: ${st.next.name} at ${fmt(st.next.min)} Power` : 'Kami reached. Legendary.'}</T>
      </Card>
      {parts.length > 0 && (
        <Card>
          <Row between><H size={17}>Avatar parts</H><T size={12} color={C.mute}>Tap to equip</T></Row>
          <Row gap={10} style={{ flexWrap: 'wrap' }}>
            <Press onPress={() => g.equip(null)} style={[styles.part, !g.equipped && { borderColor: C.lime }]}><T w="black" size={12}>None</T></Press>
            {parts.map(p => (
              <Press key={p!.id} onPress={() => { g.equip(p!.part!); haptic.success(); }} style={[styles.part, g.equipped === p!.part && { borderColor: C.lime }]}>
                <MascotStill who={g.partner} size={56} acc={p!.part as any} />
              </Press>
            ))}
          </Row>
        </Card>
      )}
      <Section title="Badges" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {badges.map(b => (
          <View key={b.n} style={[styles.badge, !b.ok && { opacity: 0.45 }]}>
            <View style={[styles.bi, { backgroundColor: b.ok ? b.c : C.card2 }]}>{b.ok ? <H size={22} color={C.ink}>{b.k}</H> : <Icon name="lock" size={20} c={C.dim} />}</View>
            <T w="black" size={12.5} center>{b.n}</T>
            <T size={10.5} color={C.mute} center>{b.d}</T>
          </View>
        ))}
      </View>
      <Card style={{ padding: 6, gap: 0 }}>
        {menu.map(([ic, l, s, f], k) => (
          <Press key={l} onPress={f} style={[styles.menu, k === menu.length - 1 && { borderBottomWidth: 0 }]}>
            <Icon name={ic} size={22} c={C.lime} c2={C.ora} />
            <T w="black" size={15} style={{ flex: 1 }}>{l}</T>
            <T size={12.5} color={C.mute}>{s}</T>
            <Icon name="chev" size={16} c={C.mute} />
          </Press>
        ))}
      </Card>
      <Sheet visible={partner} onClose={() => setPartner(false)} title="Partner mascot">
        <T color={C.mute}>Your partner greets you on Home, guides you and lands the final hit in boss fights. It doesn’t change how much Ōra you earn.</T>
        {(['taku', 'momo', 'puri'] as Who[]).map(w => (
          <Press key={w} onPress={() => { g.setPartner(w); haptic.success(); useFx.getState().toast(w, `${DOMAIN[w].name} is your partner!`, 'Ready when you are.', 'happy'); }}
            style={[styles.pick, { backgroundColor: DOMAIN[w].deep }, g.partner === w && { borderColor: DOMAIN[w].fill }]}>
            <Mascot who={w} state={g.partner === w ? 'happy' : 'idle'} size={90} acc={w === 'puri' ? 'headset' : null} />
            <View style={{ flex: 1 }}><H size={18}>{DOMAIN[w].name}</H><T size={13} color={C.mute}>{{ taku: 'Ultimate Akiba otaku', momo: 'Rising debut idol', puri: 'Hardcore gamer' }[w]}</T></View>
            {g.partner === w && <Icon name="check" size={22} c={DOMAIN[w].fill} />}
          </Press>
        ))}
      </Sheet>
    </Screen>
  );
}

const styles = themed(() => StyleSheet.create({
  round: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  profile: { backgroundColor: C.hero, borderRadius: 32, padding: 18, alignItems: 'center', gap: 10, overflow: 'hidden' },
  input: { backgroundColor: '#FFFFFF', borderRadius: 14, height: 44, paddingHorizontal: 12, minWidth: 160, fontFamily: F.bodyHeavy, fontSize: 18, color: C.ink, outlineStyle: 'none' as any },
  part: { width: 70, height: 70, borderRadius: 20, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'transparent' },
  badge: { width: '31%', flexGrow: 1, backgroundColor: C.card, borderRadius: 22, padding: 12, alignItems: 'center', gap: 4 },
  bi: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  menu: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: C.line },
  pick: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 22, paddingRight: 14, borderWidth: 3, borderColor: 'transparent', overflow: 'hidden' },
}));
