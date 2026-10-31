// Gate bosses: original yokai of otaku woes, drawn in the same flat style as the mascots.
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { BOSSES, BossId } from '@/content/ranks';
import { C } from '@/theme';

const INK = '#1B1840';

export function Boss({ id, size = 180, beaten }: { id: BossId; size?: number; beaten?: boolean }) {
  const b = BOSSES[id];
  const col = beaten ? '#5D5790' : b.color, sh = beaten ? '#4A4578' : b.shade, belly = beaten ? '#7A74AE' : b.belly;
  const label = { kappa: 'SPOILERS', tanuki: 'RECAP', tengu: '99%', oni: 'SOLD OUT', yuki: '0%', daimao: '∞' }[id];
  let top: React.ReactNode = null, extra: React.ReactNode = null;
  if (id === 'kappa') top = <G><Ellipse cx={100} cy={46} rx={36} ry={11} fill={beaten ? '#8A84B8' : '#E9FFF3'} /><Path d="M86 96 Q100 112 114 96 Z" fill={beaten ? '#8A84B8' : '#FFC93C'} /></G>;
  if (id === 'tanuki') top = <G><Ellipse cx={58} cy={52} rx={15} ry={15} fill={col} /><Ellipse cx={142} cy={52} rx={15} ry={15} fill={col} /><Path d="M64 70 Q100 56 136 70 Q138 96 100 98 Q62 96 64 70Z" fill={beaten ? '#4A4578' : '#5B3A22'} /><Path d="M92 34 Q100 6 118 22 Q110 36 92 34Z" fill={beaten ? '#8A84B8' : '#3DDC97'} /></G>;
  if (id === 'tengu') top = <G><Path d="M96 86 L156 98 Q160 104 152 106 L98 102 Z" fill={sh} /><Circle cx={100} cy={22} r={16} fill="none" stroke={beaten ? '#8A84B8' : '#FFFFFF'} strokeWidth={6} strokeDasharray="12 7" strokeLinecap="round" /></G>;
  if (id === 'oni') top = <G><Path d="M70 50 L60 14 L86 40 Z" fill={beaten ? '#8A84B8' : '#FFF1C9'} stroke={beaten ? '#8A84B8' : '#FFF1C9'} strokeWidth={6} strokeLinejoin="round" /><Path d="M130 50 L140 14 L114 40 Z" fill={beaten ? '#8A84B8' : '#FFF1C9'} stroke={beaten ? '#8A84B8' : '#FFF1C9'} strokeWidth={6} strokeLinejoin="round" /><Path d="M88 118 L92 108 L96 118 M104 118 L108 108 L112 118" fill="#FFFFFF" /></G>;
  if (id === 'yuki') top = <Path d="M44 84 Q44 26 100 24 Q156 26 156 84 Q144 54 100 52 Q56 54 44 84Z" fill={beaten ? '#8A84B8' : '#FFFFFF'} />;
  if (id === 'daimao') { top = <Path d="M68 44 L74 14 L88 32 L100 8 L112 32 L126 14 L132 44 Z" fill={beaten ? '#8A84B8' : '#FFC93C'} stroke={beaten ? '#8A84B8' : '#FFC93C'} strokeWidth={5} strokeLinejoin="round" />; extra = <G><Rect x={148} y={110} width={30} height={50} rx={7} fill={C.barLine} /><Rect x={152} y={116} width={22} height={36} rx={3} fill={beaten ? '#5D5790' : '#4FC3F7'} /></G>; }
  return (
    <View style={{ width: size, height: size }}>
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Ellipse cx={100} cy={192} rx={70} ry={8} fill="#000000" opacity={0.25} />
      <Path d="M30 136 Q10 120 18 98" stroke={col} strokeWidth={18} strokeLinecap="round" fill="none" />
      <Path d="M170 136 Q190 120 182 98" stroke={col} strokeWidth={18} strokeLinecap="round" fill="none" />
      <Path d="M36 190 C18 132 34 40 100 40 C166 40 182 132 164 190 Z" fill={col} />
      <Path d="M36 190 C30 170 30 150 34 134 Q100 168 166 134 C170 150 170 170 164 190 Z" fill={sh} />
      <Path d="M62 190 C56 144 72 124 100 124 C128 124 144 144 138 190 Z" fill={belly} />
      <SvgText fontFamily="Fredoka_700Bold" x={100} y={label.length > 6 ? 164 : 166} fontSize={label.length > 6 ? 14 : 20} fontWeight="900" fill={INK} textAnchor="middle">{label}</SvgText>
      {top}
      {beaten ? (
        <G><Path d="M70 80 L86 96 M86 80 L70 96 M114 80 L130 96 M130 80 L114 96" stroke={INK} strokeWidth={5} strokeLinecap="round" /></G>
      ) : (
        <G>
          <Ellipse cx={80} cy={88} rx={12} ry={13} fill="#FFFFFF" /><Ellipse cx={120} cy={88} rx={12} ry={13} fill="#FFFFFF" />
          <Circle cx={83} cy={91} r={6} fill={INK} /><Circle cx={117} cy={91} r={6} fill={INK} />
          <Path d="M64 70 L92 78 M136 70 L108 78" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        </G>
      )}
      <Path d={beaten ? 'M86 114 Q100 108 114 114' : 'M84 116 Q100 106 116 116'} stroke={INK} strokeWidth={4.5} strokeLinecap="round" fill="none" />
      {extra}
    </Svg>
    </View>
  );
}
