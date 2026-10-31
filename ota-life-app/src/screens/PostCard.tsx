// Feed post with mascot reactions instead of likes: TAKU cheers, Momo sparkles, Puri says GG.
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { C, F, Who, themed } from '@/theme';
import { useGame } from '@/store/game';
import { haptic } from '@/store/fx';
import { COMMUNITIES, Post, SEED_COMMENTS } from '@/content/catalog';
import { RANKS } from '@/content/ranks';
import { ago, fmt } from '@/lib/time';
import { Mascot, MascotStill } from '@/mascots/Mascot';
import { Icon } from '@/art/Icon';
import { Pill, Press, Row, T, H } from '@/ui/kit';
import { PlayerAvatar, Avatar } from '@/ui/game';
import { Blob } from '@/art/Blob';

const RX: Record<Who, { label: string; state: any; bg: string }> = {
  taku: { label: 'Cheer', state: 'wotagei', bg: C.taku },
  momo: { label: 'Sparkle', state: 'sparkle', bg: C.momo },
  puri: { label: 'GG', state: 'gg', bg: C.puri },
};

export function ReactBar({ id, base, big }: { id: string; base: Record<Who, number>; big?: boolean }) {
  const mine = useGame(s => s.reacts[id]);
  const react = useGame(s => s.react);
  const [pop, setPop] = useState<Who | null>(null);
  useEffect(() => { if (!pop) return; const t = setTimeout(() => setPop(null), 1500); return () => clearTimeout(t); }, [pop]);
  return (
    <Row gap={8}>
      {(['taku', 'momo', 'puri'] as Who[]).map(w => {
        const on = mine === w, n = (base[w] || 0) + (on ? 1 : 0);
        return (
          <View key={w}>
            {pop === w && (
              <Animated.View entering={ZoomIn.springify().damping(10)} exiting={FadeOut} style={styles.pop} pointerEvents="none">
                <Mascot who={w} state={RX[w].state} size={96} />
              </Animated.View>
            )}
            <Press haptics={false} onPress={() => { haptic.medium(); react(id, w); if (!on) setPop(w); }} style={[styles.rx, on && { backgroundColor: RX[w].bg }]} accessibilityLabel={`${RX[w].label}, ${n}`}>
              <View style={[styles.face, { backgroundColor: on ? '#FFFFFF55' : RX[w].bg }]}><MascotStill who={w} state={on ? RX[w].state : 'idle'} size={44} /></View>
              <T w="black" size={13} color={on ? C.ink : C.text}>{big ? RX[w].label : fmt(n)}</T>
            </Press>
          </View>
        );
      })}
    </Row>
  );
}

export function PostCard({ p, full }: { p: Post; full?: boolean }) {
  const router = useRouter();
  const comments = useGame(s => s.comments[p.id]?.length || 0);
  const name = useGame(s => s.name);
  const c = COMMUNITIES.find(x => x.id === p.c)!;
  const n = (SEED_COMMENTS[p.id]?.length || 0) + comments;
  return (
    <View style={styles.post}>
      <Row>
        {p.mine ? <Avatar size={36} /> : <PlayerAvatar name={p.by} rank={p.rank} />}
        <View style={{ flex: 1 }}>
          <Row gap={6}><T w="black">{p.mine ? name : p.by}</T><Pill color={C.card2} text={RANKS[p.rank]?.frame}>{RANKS[p.rank]?.name}</Pill></Row>
          <T size={12} color={C.mute}>{c.name} · {ago(p.at)}</T>
        </View>
      </Row>
      <T size={15} color={C.soft}>{p.text}</T>
      {p.art && (
        <View style={[styles.media, { backgroundColor: p.art.color }]}>
          <Blob seed={p.id} color={C.glass} size={220} spin={false} style={{ position: 'absolute', right: -40, top: -50 }} />
          {p.art.kind === 'card' ? (
            <View style={styles.card}><MascotStill who="momo" state="celebrate" size={110} /><H size={14} color={C.ink}>LEGENDARY</H></View>
          ) : <T size={p.art.text.length > 3 ? 40 : 56} w="black" color="#FFFFFF">{p.art.text}</T>}
        </View>
      )}
      <Row between>
        <ReactBar id={p.id} base={p.r} />
        {!full && (
          <Press onPress={() => router.push({ pathname: '/post/[id]', params: { id: p.id } })} style={styles.rx}>
            <Icon name="chat" size={18} c={C.mute} /><T w="black" size={13}>{n}</T>
          </Press>
        )}
      </Row>
    </View>
  );
}

const styles = themed(() => StyleSheet.create({
  post: { backgroundColor: C.card, borderRadius: 26, padding: 14, gap: 12 },
  media: { height: 170, borderRadius: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  card: { width: 110, height: 140, borderRadius: 14, backgroundColor: '#FFF1C9', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-6deg' }] },
  rx: { height: 40, borderRadius: 20, backgroundColor: C.card2, flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 4, paddingRight: 12 },
  face: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' },
  pop: { position: 'absolute', bottom: 34, left: -28, zIndex: 10 },
}));
