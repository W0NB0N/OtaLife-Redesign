// Meet the cast: every mascot pose, tap one to see it move.
import React, { useState } from 'react';
import { View } from 'react-native';
import { C, DOMAIN, Who } from '@/theme';
import { Mascot, STATES, MState } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Card, Chip, H, Press, Row, Segmented, T } from '@/ui/kit';
import { BackBar, Screen } from '@/ui/game';

const BIO: Record<Who, string> = {
  taku: 'Straight from Akihabara. Lives and breathes idol culture; catch him doing wotagei in the front row of every LIVE.',
  momo: 'Inspired by India\'s favourite spicy dumpling. Sweet, spicy and packed with energy. Debuts at Ōta TOKYO on 28 Nov.',
  puri: 'Inspired by the crispy, golden puri. Pulls 14-hour gaming marathons. Rumour says there\'s a Switch in his mouth.',
};

export default function Cast() {
  const [who, setWho] = useState<Who>('taku');
  const [st, setSt] = useState<MState>('idle');
  const [acc, setAcc] = useState<any>(null);
  return (
    <Screen>
      <BackBar title="Meet the cast" sub="Tap a mood to play it" />
      <Segmented<Who> value={who} onChange={w => { setWho(w); setSt('idle'); }} items={(['taku', 'momo', 'puri'] as Who[]).map(k => ({ k, label: DOMAIN[k].name }))} />
      <View style={{ height: 300, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: DOMAIN[who].deep, borderRadius: 30, overflow: 'hidden' }}>
        <Blob seed={'cast' + who} color={DOMAIN[who].soft} size={300} second={DOMAIN[who].fill + '33'} dots style={{ position: 'absolute', top: 0 }} />
        <Mascot who={who} state={st} size={250} acc={acc} />
      </View>
      <T color={C.soft}>{BIO[who]}</T>
      <H size={17}>Moods</H>
      <Row gap={8} style={{ flexWrap: 'wrap' }}>{STATES[who].map(s => <Chip key={s} label={s} on={st === s} onPress={() => setSt(s)} />)}</Row>
      <H size={17}>Accessories</H>
      <Row gap={8} style={{ flexWrap: 'wrap' }}>{[[null, 'None'], ['headset', 'Headset'], ['crown', 'Crown'], ['partyHat', 'Party hat']].map(([a, l]) => <Chip key={l as string} label={l as string} on={acc === a} onPress={() => setAcc(a)} />)}</Row>
    </Screen>
  );
}
