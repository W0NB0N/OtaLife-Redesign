import React from 'react';
import { StyleSheet, View } from 'react-native';
import { C, themed } from '@/theme';
import { reelColors, type Reel } from '@/content/catalog';
import { MascotStill } from '@/mascots/Mascot';
import { Blob } from '@/art/Blob';
import { Icon } from '@/art/Icon';
import { H, Pill, T } from '@/ui/kit';

export function ReelCover({ r, watched, w = 150 }: { r: Reel; watched?: boolean; w?: number }) {
  const rc = reelColors(r, C.dark);
  return (
    <View style={[styles.card, { width: w, height: w * 1.6, backgroundColor: rc.bg }]}>
      <Blob seed={r.id} color={r.accent + '44'} size={w * 1.1} spin={false} style={{ position: 'absolute', right: -w * 0.35, top: -w * 0.2 }} />
      <T size={r.slides[0].big.length > 3 ? 26 : 40} w="black" style={{ position: 'absolute', left: 12, top: 52, opacity: 0.95 }}>{r.slides[0].big}</T>
      <View style={{ position: 'absolute', right: -10, bottom: w * 0.42 }}><MascotStill who={r.host} state={r.host === 'taku' ? 'wotagei' : r.host === 'momo' ? 'sparkle' : 'gg'} size={w * 0.55} /></View>
      <View style={styles.top}>
        <View style={styles.play}><Icon name={watched ? 'check' : 'play'} size={14} c={watched ? C.lime : rc.fg} /></View>
        <Pill color={C.lime} text={C.ink}>{`+${r.slides.length * 5} Ōra`}</Pill>
      </View>
      <View style={[styles.cap, { backgroundColor: rc.band }]}>
        <H size={15} color={rc.fg} numberOfLines={3}>{r.title}</H>
        <T size={11.5} color={rc.sub} numberOfLines={1}>{r.by}</T>
      </View>
    </View>
  );
}

const styles = themed(() => StyleSheet.create({
  card: { borderRadius: 24, overflow: 'hidden' },
  top: { position: 'absolute', top: 10, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  play: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFF33', alignItems: 'center', justifyContent: 'center' },
  cap: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, gap: 2, backgroundColor: '#00000044' },
}));
