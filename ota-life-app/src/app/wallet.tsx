import React from 'react';
import { View } from 'react-native';
import { C, F } from '@/theme';
import { streakMult, useGame } from '@/store/game';
import { stars, titleOf } from '@/content/ranks';
import { fmt } from '@/lib/time';
import { Mascot } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { Bar, Card, H, Num, Over, Row, T } from '@/ui/kit';
import { BackBar, Screen } from '@/ui/game';

const EARN: [string, string][] = [
  ['Daily check-in', '+20'], ['Daily Challenge, per right answer', '+30'], ['Daily Challenge cleared', '+100'], ['Perfect score', '+50'],
  ['Library quiz, per right answer', '+20'], ['Every 5 s of a reel (Puri token)', '+5'], ['Word of the day', '+20'], ['Cheer in the Fan Council', '+10'],
  ['Comment (first 5 a day)', '+10'], ['Quest board cleared', '+150'], ['Purchases', '1 per ₹10'],
];

export default function Wallet() {
  const g = useGame();
  const st = stars(g.power);
  return (
    <Screen>
      <BackBar title="Your Ōra" sub={titleOf(g.power)} />
      <View style={{ backgroundColor: C.hero, borderRadius: 30, padding: 18, gap: 12, overflow: 'hidden' }}>
        <Blob seed="wallet" color={C.heroBlob} size={220} style={{ position: 'absolute', right: -40, top: -40 }} />
        <Row between style={{ alignItems: 'flex-end' }}>
          <View><Over color={C.heroSoft}>Wallet · spendable</Over><Num value={g.wallet} style={{ fontFamily: F.display, fontSize: 40, color: C.text }} /></View>
          <View style={{ alignItems: 'flex-end' }}><Over color={C.heroSoft}>Power · lifetime</Over><Num value={g.power} style={{ fontFamily: F.display, fontSize: 24, color: C.text }} /></View>
        </Row>
        <Bar pct={st.pct} color={C.heroBar} track={C.heroTrack} height={14} />
        <T color={C.heroSoft}>Power sets your rank and only goes up. Spending takes Ōra from your Wallet, so your rank never drops.</T>
      </View>
      <Row style={{ alignItems: 'flex-end' }}>
        <Mascot who="puri" state="think" size={100} acc="headset" />
        <Card style={{ flex: 1 }}><T w="black">Streak bonus ×{streakMult(g.streak.count)}</T><T size={13} color={C.mute}>Daily Ōra multiplies at 3, 7, 30 and 100 days. Today you’ve earned {fmt(g.day.ora)} Ōra.</T></Card>
      </Row>
      <Card style={{ gap: 2 }}>
        <H size={18}>Ways to earn</H>
        {EARN.map(([l, v]) => <Row key={l} between style={{ paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: C.line }}><T color={C.soft} style={{ flex: 1 }}>{l}</T><T w="black" color={C.lime}>{v}</T></Row>)}
      </Card>
      <Card style={{ gap: 2 }}>
        <H size={18}>Ways to spend</H>
        {[['Standard capsule (no ticket)', '300'], ['Rare+ capsule (Senpai+)', '1,200'], ['Encore streak shield', '500'], ['Merch and passes', '10 = ₹1']].map(([l, v]) => <Row key={l} between style={{ paddingVertical: 7 }}><T color={C.soft}>{l}</T><Row gap={4}><Icon name="gem" size={14} c={C.ora} /><T w="black">{v}</T></Row></Row>)}
      </Card>
    </Screen>
  );
}
