// Discover (TAKU): word of the day, reels, Fan Council, communities and the feed.
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { C, DOMAIN, F, Who, themed } from '@/theme';
import { cheersMax, useGame } from '@/store/game';
import { haptic } from '@/store/fx';
import { COMMUNITIES, REELS, SEED_POSTS } from '@/content/catalog';
import { WORDS } from '@/content/words';
import { dayKey, daysBetween, fmt } from '@/lib/time';
import { Mascot, MascotStill } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { KanjiCover } from '@/art/Products';
import { Btn, Card, Chip, H, Over, Pill, Press, Row, Section, T } from '@/ui/kit';
import { Screen, TopBar } from '@/ui/game';
import { PostCard } from '@/screens/PostCard';
import { ReelCover } from '@/screens/ReelCover';
import { wordToday } from '@/lib/derived';


export default function Discover() {
  const g = useGame();
  const router = useRouter();
  const [cat, setCat] = useState('All');
  const w = wordToday();
  const max = cheersMax(g.power), left = Math.max(0, max - g.day.cheersUsed);
  const posts = useMemo(() => {
    const now = Date.now();
    const seeded = SEED_POSTS.map(p => ({ ...p, at: now + p.at }));
    return [...g.posts, ...seeded].filter(p => g.joined[p.c] || p.mine).slice(0, 12);
  }, [g.posts, g.joined]);
  const reels = REELS.filter(r => cat === 'All' || r.cat === cat);

  return (
    <Screen tabs>
      <TopBar title="Discover" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 16 }} style={{ marginHorizontal: -16, paddingLeft: 16 }}>
        {['All', 'Anime', 'Cosplay', 'Japan', 'Learn', 'Gaming'].map(c => <Chip key={c} label={c} on={cat === c} onPress={() => setCat(c)} />)}
      </ScrollView>

      <View style={styles.word}>
        <Blob seed={'word' + w.jp} color={C.takuSoft} size={190} second="#4FC3F733" style={{ position: 'absolute', right: -24, top: -16 }} />
        <View style={{ flex: 1, gap: 4, zIndex: 2 }}>
          <Over color={C.taku}>TAKU’s word of the day</Over>
          <T size={44} w="black" style={{ lineHeight: 54 }}>{w.jp}</T>
          <T w="black" color={C.taku}>{w.ro} · {w.en}</T>
          <T size={13.5} color={C.mute}>{w.line}</T>
          <Btn small title={g.day.word ? 'Learned today' : 'Got it · +20 Ōra'} kind={g.day.word ? 'ghost' : 'lime'} icon={g.day.word ? 'check' : undefined} disabled={g.day.word}
            style={{ alignSelf: 'flex-start', marginTop: 6 }}
            onPress={e => { if (g.day.word) return; useGame.getState().learnWord(); haptic.success(); g.earn(20, { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY }); }} />
        </View>
        <Mascot who="taku" state={g.day.word ? 'wotagei' : 'think'} size={130} style={{ marginRight: -14, marginBottom: -10 }} />
      </View>

      <Section title="Reels" action="Play all" onAction={() => router.push('/reel')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 16 }} style={{ marginHorizontal: -16, paddingLeft: 16 }}>
        {reels.length ? reels.map(r => (
          <Press key={r.id} onPress={() => router.push({ pathname: '/reel', params: { id: r.id } })}><ReelCover r={r} watched={g.day.reels.includes(r.id)} /></Press>
        )) : <Card style={{ width: 300 }}><T color={C.mute}>No {cat} reels yet. TAKU is filming more.</T></Card>}
      </ScrollView>

      <Press onPress={() => router.push('/council')} style={styles.council}>
        <View style={{ flex: 1, gap: 6 }}>
          <Over color={C.lime}>Fan Council</Over>
          <H size={20}>Vote what Ōta builds next</H>
          <Row gap={4}>
            {Array.from({ length: max }, (_, k) => <View key={k} style={[styles.glow, k >= left && { backgroundColor: C.glow }]} />)}
            <T size={13} color={C.mute} style={{ marginLeft: 6 }}>{left} Cheer{left === 1 ? '' : 's'} left today</T>
          </Row>
        </View>
        <Mascot who="taku" state={left ? 'wotagei' : 'sleepy'} size={104} style={{ marginBottom: -26, marginRight: -6 }} />
      </Press>

      <Section title="Communities" action="See all" onAction={() => router.push('/communities')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 16 }} style={{ marginHorizontal: -16, paddingLeft: 16 }}>
        {COMMUNITIES.map(c => (
          <Press key={c.id} onPress={() => router.push({ pathname: '/community/[id]', params: { id: c.id } })} style={styles.comm}>
            <KanjiCover kanji={c.kanji} color={c.color} size={136} />
            <T w="black" size={14} numberOfLines={2}>{c.name}</T>
            <Row between><T size={12} color={C.mute}>{fmt(c.members + (g.joined[c.id] ? 1 : 0))}</T>{g.joined[c.id] ? <Pill color={C.takuSoft} text={C.taku}>Joined</Pill> : null}</Row>
          </Press>
        ))}
      </ScrollView>

      <Section title="From your communities" />
      {posts.length ? posts.map(p => <PostCard key={p.id} p={p} />) : (
        <Card style={{ alignItems: 'center' }}>
          <Mascot who="taku" state="think" size={130} />
          <H size={19} center>Your feed is empty</H>
          <T center color={C.mute}>Join a community and its posts land here.</T>
          <Btn title="Find communities" onPress={() => router.push('/communities')} />
        </Card>
      )}
    </Screen>
  );
}

const styles = themed(() => StyleSheet.create({
  word: { backgroundColor: C.takuDeep, borderRadius: 28, padding: 16, flexDirection: 'row', alignItems: 'flex-end', overflow: 'hidden' },
  council: { backgroundColor: C.panel, borderRadius: 28, padding: 16, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  glow: { width: 9, height: 24, borderRadius: 5, backgroundColor: C.lime },
  comm: { width: 160, backgroundColor: C.card, borderRadius: 24, padding: 12, gap: 8 },
}));
