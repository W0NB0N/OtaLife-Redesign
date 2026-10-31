import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import { C, Rarity } from '@/theme';
import type { Prize } from '@/content/catalog';
import { MascotStill } from '@/mascots/Mascot';

export const RARITY: Record<Rarity, { fill: string; soft: string; deep: string; label: string }> = {
  common: { fill: '#B9C2D6', soft: '#EEF0F5', deep: '#4F5872', label: 'Common' },
  rare: { fill: '#4FA8FF', soft: '#DDEEFC', deep: '#1F68A8', label: 'Rare' },
  epic: { fill: '#A77BFF', soft: '#EDE4FF', deep: '#6D3FE0', label: 'Epic' },
  legendary: { fill: '#FFC93C', soft: '#FFF1C9', deep: '#8A5A00', label: 'Legendary' },
};

export function PrizeArt({ p, size }: { p: Prize; size: number }) {
  const R = RARITY[p.r];
  if (p.art.kind === 'coupon' || p.art.kind === 'perk') {
    return (
      <Svg width={size} height={size * 0.7} viewBox="0 0 200 140">
        <Path d="M14 30 Q14 20 24 20 H176 Q186 20 186 30 V56 A14 14 0 0 0 186 84 V110 Q186 120 176 120 H24 Q14 120 14 110 V84 A14 14 0 0 0 14 56 Z" fill="#FFFFFF" transform="rotate(-6 100 70)" />
        <Path d="M14 30 Q14 20 24 20 H62 V120 H24 Q14 120 14 110 V84 A14 14 0 0 0 14 56 Z" fill={R.fill} transform="rotate(-6 100 70)" />
        <SvgText fontFamily="Fredoka_700Bold" x={124} y={82} fontSize={p.art.text!.length > 3 ? 30 : 40} fontWeight="900" fill={R.deep} textAnchor="middle" transform="rotate(-6 100 70)">{p.art.text}</SvgText>
        <SvgText fontFamily="Fredoka_700Bold" x={124} y={104} fontSize={11} fontWeight="900" fill="#6A6590" textAnchor="middle" transform="rotate(-6 100 70)">{p.art.kind === 'coupon' ? 'OFF MERCH' : 'ŌTA TOKYO'}</SvgText>
        <Circle cx={38} cy={66} r={9} fill="#FFFFFF" transform="rotate(-6 100 70)" />
      </Svg>
    );
  }
  if (p.art.kind === 'card') {
    return (
      <View style={{ width: size * 0.74, height: size, borderRadius: 16, backgroundColor: R.fill, borderWidth: 6, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden', transform: [{ rotate: '-5deg' }] }}>
        <View style={{ position: 'absolute', top: 10, width: size * 0.5, height: size * 0.5, borderRadius: size, backgroundColor: '#FFFFFF55' }} />
        <View><MascotStill who={p.art.who!} state={p.art.state as any} size={size * 0.72} /></View>
      </View>
    );
  }
  // stickers and avatar parts: the mascot with a thick white sticker border
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: size * 0.86, height: size * 0.86, borderRadius: size, backgroundColor: '#FFFFFF' }} />
      <View><MascotStill who={p.art.who!} state={p.art.state as any} size={size * 0.85} acc={(p.art.acc as any) || null} /></View>
    </View>
  );
}
