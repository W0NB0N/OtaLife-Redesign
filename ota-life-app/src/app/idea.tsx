import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { C, F, themed } from '@/theme';
import { useGame } from '@/store/game';
import { haptic, useFx } from '@/store/fx';
import { rankIdx } from '@/content/ranks';
import { Mascot } from '@/mascots/Mascot';
import { Btn, Card, Chip, H, Over, Row, T } from '@/ui/kit';
import { BackBar, Screen, goBack } from '@/ui/game';

export default function Idea() {
  const g = useGame();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Merch');
  const ok = rankIdx(g.power) >= 3;
  return (
    <Screen>
      <BackBar title="Pitch an idea" sub="Otaku rank and above" />
      <Row style={{ alignItems: 'flex-end' }}><Mascot who="taku" state="think" size={110} /><T color={C.mute} style={{ flex: 1 }}>Ideas start at Spark. 100 Cheers moves them to Hype, 500 sends them to the Ōta team for review.</T></Row>
      <Card>
        <Over>Type</Over>
        <Row gap={8} style={{ flexWrap: 'wrap' }}>{['Merch', 'Events', 'Guests'].map(t => <Chip key={t} label={t} on={type === t} onPress={() => setType(t)} />)}</Row>
        <Over>Title</Over>
        <TextInput value={title} onChangeText={setTitle} placeholder="Momo-chan rice cooker? Go on." placeholderTextColor={C.dim} maxLength={80} style={styles.input} />
        <T size={12} color={C.mute}>{title.length}/80</T>
      </Card>
      <Btn title="Submit idea" disabled={!ok || title.trim().length < 6} onPress={() => { g.submitIdea(title.trim(), type); haptic.success(); useFx.getState().toast('taku', 'Idea submitted!', 'It shows on the Fan Council as Spark.', 'wotagei'); goBack(router); }} />
      {!ok && <H size={16} color={C.mute} center>Reach Otaku rank to pitch ideas.</H>}
    </Screen>
  );
}
const styles = themed(() => StyleSheet.create({ input: { backgroundColor: C.card2, borderRadius: 16, height: 52, paddingHorizontal: 14, color: C.text, fontFamily: F.body, fontSize: 16, outlineStyle: 'none' as any } }));
