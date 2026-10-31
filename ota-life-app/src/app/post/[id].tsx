import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F, themed } from '@/theme';
import { useGame } from '@/store/game';
import { haptic } from '@/store/fx';
import { SEED_COMMENTS, SEED_POSTS } from '@/content/catalog';
import { RANKS, titleOf } from '@/content/ranks';
import { ago } from '@/lib/time';
import { Icon } from '@/art/Icon';
import { Pill, Press, Row, T } from '@/ui/kit';
import { Avatar, BackBar, PlayerAvatar, Screen } from '@/ui/game';
import { PostCard } from '@/screens/PostCard';

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const g = useGame();
  const ins = useSafeAreaInsets();
  const [text, setText] = useState('');
  const p = useMemo(() => {
    const own = g.posts.find(x => x.id === id);
    if (own) return own;
    const s = SEED_POSTS.find(x => x.id === id)!;
    return { ...s, at: Date.now() + s.at };
  }, [id]);
  const seed = (SEED_COMMENTS[id] || []).map(c => ({ ...c, at: Date.now() + c.at }));
  const mine = g.comments[id] || [];
  const send = (e: any) => {
    const t = text.trim(); if (!t) return;
    const pays = g.addComment(id, t);
    setText(''); haptic.success();
    if (pays) g.earn(10, { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Screen>
        <BackBar title="Post" sub={`${seed.length + mine.length} comments`} />
        <PostCard p={p} full />
        {seed.map((c, k) => (
          <Row key={'s' + k} style={styles.cm}>
            <PlayerAvatar name={c.by} rank={c.rank} size={34} />
            <View style={{ flex: 1, gap: 2 }}>
              <Row gap={6}><T w="black">{c.by}</T><Pill color={C.card2} text={RANKS[c.rank].frame}>{RANKS[c.rank].name}</Pill><T size={12} color={C.mute}>{ago(c.at)}</T></Row>
              <T color={C.soft}>{c.text}</T>
            </View>
          </Row>
        ))}
        {mine.map(c => (
          <Animated.View key={c.id} entering={FadeInDown.springify()}>
            <Row style={styles.cm}>
              <Avatar size={34} />
              <View style={{ flex: 1, gap: 2 }}>
                <Row gap={6}><T w="black">{g.name}</T><Pill color={C.card2} text={C.lime}>{titleOf(g.power)}</Pill><T size={12} color={C.mute}>{ago(c.at)}</T></Row>
                <T color={C.soft}>{c.text}</T>
              </View>
            </Row>
          </Animated.View>
        ))}
      </Screen>
      <Row style={[styles.bar, { paddingBottom: ins.bottom + 10 }]}>
        <TextInput value={text} onChangeText={setText} placeholder={g.day.comments < 5 ? 'Add a comment · +10 Ōra' : 'Add a comment'} placeholderTextColor={C.dim} style={styles.input} maxLength={240} onSubmitEditing={send} />
        <Press onPress={send} style={[styles.send, !text.trim() && { opacity: 0.5 }]} accessibilityLabel="Send comment"><Icon name="send" size={20} c={C.ink} /></Press>
      </Row>
    </KeyboardAvoidingView>
  );
}

const styles = themed(() => StyleSheet.create({
  cm: { alignItems: 'flex-start', backgroundColor: C.card, borderRadius: 20, padding: 12 },
  bar: { paddingHorizontal: 14, paddingTop: 10, backgroundColor: C.bg2, gap: 10 },
  input: { flex: 1, height: 48, borderRadius: 24, backgroundColor: C.card, paddingHorizontal: 16, color: C.text, fontFamily: F.body, fontSize: 15, outlineStyle: 'none' as any },
  send: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center' },
}));
