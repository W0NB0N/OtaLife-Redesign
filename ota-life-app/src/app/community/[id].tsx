import React, { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { C, F, themed } from '@/theme';
import { useGame } from '@/store/game';
import { haptic, useFx } from '@/store/fx';
import { COMMUNITIES, SEED_POSTS } from '@/content/catalog';
import { RANKS, rankIdx } from '@/content/ranks';
import { fmt, seeded } from '@/lib/time';
import { Mascot } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { Btn, Card, H, Over, Pill, Press, Row, T } from '@/ui/kit';
import { Avatar, BackBar, PlayerAvatar, Screen } from '@/ui/game';
import { PostCard } from '@/screens/PostCard';

export default function Community() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = COMMUNITIES.find(x => x.id === id) || COMMUNITIES[0];
  const g = useGame();
  const joined = !!g.joined[c.id];
  const [text, setText] = useState('');
  const posts = useMemo(() => {
    const now = Date.now();
    return [...g.posts.filter(p => p.c === c.id), ...SEED_POSTS.filter(p => p.c === c.id).map(p => ({ ...p, at: now + p.at }))];
  }, [g.posts, c.id]);
  const top = useMemo(() => {
    const rnd = seeded(c.id + g.week.key);
    const rows = [c.owner, 'Kavya Pillai', 'Zoya K.', 'Rohit V.'].map((n, k) => ({ n, rank: k === 0 ? c.ownerRank : 1 + Math.floor(rnd() * 3), ora: Math.round((900 + rnd() * 2400) / 10) * 10 }));
    if (joined) rows.push({ n: g.name, rank: rankIdx(g.power), ora: g.week.ora, me: true } as any);
    return rows.sort((a, b) => b.ora - a.ora).slice(0, 5);
  }, [joined, g.week.ora]);
  const post = () => {
    const t = text.trim(); if (!t) return;
    g.addPost(c.id, t); setText('');
    haptic.success();
    useFx.getState().toast('taku', 'Posted!', `Your post is live in ${c.name}.`, 'wotagei');
  };
  return (
    <Screen>
      <BackBar title={c.name} sub={`${fmt(c.members + (joined ? 1 : 0))} members · ${c.city}`} />
      <View style={[styles.banner, { backgroundColor: c.color + '33' }]}>
        <Blob seed={c.id} color={c.color} size={220} second={c.color + '55'} style={{ position: 'absolute', right: -40, top: -30 }} />
        <View style={{ flex: 1, gap: 8, zIndex: 2 }}>
          <T size={58} w="black" style={{ lineHeight: 64 }}>{c.kanji}</T>
          <T color={C.soft}>{c.about}</T>
        </View>
        <Mascot who="taku" state={joined ? 'wotagei' : 'wave'} size={130} style={{ marginBottom: -12, marginRight: -10 }} />
      </View>
      <Btn title={joined ? 'Joined · tap to leave' : 'Join community'} kind={joined ? 'ghost' : 'lime'} icon={joined ? 'check' : 'plus'} onPress={() => { g.toggleJoin(c.id); if (!joined) { haptic.success(); useFx.getState().toast('taku', 'Welcome in!', 'Posts from here now show in Discover.', 'wotagei'); } }} />
      <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
        <PlayerAvatar name={c.owner} rank={c.ownerRank} size={44} />
        <View style={{ flex: 1 }}><Over>Owner</Over><T w="black" size={16}>{c.owner}</T><Pill color={C.card2} text={RANKS[c.ownerRank].frame}>{`${RANKS[c.ownerRank].name} rank`}</Pill></View>
        <Btn small kind="ghost" title="Report" onPress={() => useFx.getState().toast('taku', 'Thanks for flagging', 'The Ōta team reviews reports within 24 h.', 'think')} />
      </Card>
      <H size={20}>Top members this week</H>
      <Card style={{ gap: 4, padding: 10 }}>
        {top.map((r: any, k) => (
          <Row key={r.n} style={[styles.lbr, r.me && { backgroundColor: C.lime }]}>
            <H size={15} color={r.me ? C.ink : C.mute} style={{ width: 18 }}>{k + 1}</H>
            {r.me ? <Avatar size={32} /> : <PlayerAvatar name={r.n} rank={r.rank} size={30} />}
            <T w="black" color={r.me ? C.ink : C.text} style={{ flex: 1 }}>{r.n}</T>
            <T w="black" color={r.me ? C.ink : C.text}>{fmt(r.ora)} Ōra</T>
          </Row>
        ))}
      </Card>
      <H size={20}>Feed</H>
      {joined ? (
        <Card style={{ gap: 10 }}>
          <TextInput value={text} onChangeText={setText} placeholder={`Share something with ${c.name}`} placeholderTextColor={C.dim} multiline maxLength={280} style={styles.input} />
          <Row between><T size={12} color={C.mute}>{text.length}/280</T><Btn small title="Post" icon="send" disabled={!text.trim()} onPress={post} /></Row>
        </Card>
      ) : <T color={C.mute}>Join to post in this community.</T>}
      {posts.length ? posts.map(p => <PostCard key={p.id} p={p} />) : (
        <Card style={{ alignItems: 'center' }}><Mascot who="taku" state="sleepy" size={120} /><H size={18} center>It’s quiet in here</H><T center color={C.mute}>No posts yet. Be the first!</T></Card>
      )}
    </Screen>
  );
}

const styles = themed(() => StyleSheet.create({
  banner: { borderRadius: 28, padding: 16, flexDirection: 'row', alignItems: 'flex-end', overflow: 'hidden', minHeight: 180 },
  lbr: { gap: 10, paddingVertical: 7, paddingHorizontal: 8, borderRadius: 16 },
  input: { minHeight: 70, color: C.text, fontFamily: F.body, fontSize: 15, textAlignVertical: 'top', outlineStyle: 'none' as any },
}));
