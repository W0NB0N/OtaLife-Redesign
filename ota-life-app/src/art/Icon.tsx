// Filled, rounded icon set drawn on a 24-unit grid. `c` is the main colour, `c2` the accent.
import React from 'react';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';
import { C } from '@/theme';

export type IconName =
  | 'home' | 'discover' | 'battle' | 'stage' | 'me' | 'inbox' | 'back' | 'close' | 'check' | 'ticket' | 'chev' | 'lock'
  | 'play' | 'pause' | 'search' | 'plus' | 'bag' | 'qr' | 'calendar' | 'pin' | 'users' | 'gem' | 'flame' | 'chest' | 'trophy'
  | 'gear' | 'heart' | 'chat' | 'send' | 'shield' | 'star' | 'gift' | 'edit' | 'clock' | 'bolt' | 'sparkle' | 'cart' | 'trash' | 'info';

export function Icon({ name, size = 24, c = C.text, c2 }: { name: IconName; size?: number; c?: string; c2?: string }) {
  const a = c2 || c;
  const S = (k: React.ReactNode) => <Svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'relative' }}>{k}</Svg>;
  const stroke = { stroke: c, strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  switch (name) {
    case 'home': return S(<G><Path d="M3.5 11.2 12 4l8.5 7.2V19a2 2 0 0 1-2 2h-4v-6h-5v6h-4a2 2 0 0 1-2-2z" fill={c} /><Rect x={9.5} y={15} width={5} height={6} rx={1.5} fill={a} opacity={0.55} /></G>);
    case 'discover': return S(<G><Circle cx={12} cy={12} r={9.5} fill={c} /><Path d="M15.8 8.2 13.6 13.6 8.2 15.8 10.4 10.4Z" fill={a === c ? '#120F2A' : a} /></G>);
    case 'battle': return S(<Path d="M13.6 2.5 5 13.4h6.2l-1.4 8.1 8.9-11.2h-6.3z" fill={c} stroke={c} strokeWidth={1.2} strokeLinejoin="round" />);
    case 'stage': return S(<Path d="M12 2.8l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.1 6.4 20l1.1-6.2L3 9.4l6.2-.9z" fill={c} stroke={c} strokeWidth={1.6} strokeLinejoin="round" />);
    case 'me': return S(<G><Circle cx={12} cy={8} r={4.5} fill={c} /><Path d="M3.5 21c.8-4.4 4.2-7 8.5-7s7.7 2.6 8.5 7z" fill={c} /></G>);
    case 'inbox': return S(<G><Path d="M5 4.5h14a2.5 2.5 0 0 1 2.5 2.5v8.5a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V18H5a2.5 2.5 0 0 1-2.5-2.5V7A2.5 2.5 0 0 1 5 4.5z" fill={c} /><Circle cx={8} cy={11.3} r={1.4} fill="#120F2A" /><Circle cx={12} cy={11.3} r={1.4} fill="#120F2A" /><Circle cx={16} cy={11.3} r={1.4} fill="#120F2A" /></G>);
    case 'back': return S(<Path d="M15 5l-7 7 7 7" {...stroke} strokeWidth={3} />);
    case 'chev': return S(<Path d="M9 5l7 7-7 7" {...stroke} strokeWidth={3} />);
    case 'close': return S(<Path d="M6 6l12 12M18 6 6 18" {...stroke} strokeWidth={3} />);
    case 'check': return S(<Path d="M5 12.5l4.5 4.5L19 7.5" {...stroke} strokeWidth={3.2} />);
    case 'plus': return S(<Path d="M12 5v14M5 12h14" {...stroke} strokeWidth={3} />);
    case 'ticket': return S(<G><Path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5V14a2 2 0 0 0 0-4z" fill={c} /><Path d="M15 7v10" stroke="#120F2A" strokeWidth={1.6} strokeDasharray="2 2" /></G>);
    case 'lock': return S(<G><Rect x={4.5} y={10.5} width={15} height={11} rx={3} fill={c} /><Path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" {...stroke} /><Circle cx={12} cy={16} r={1.6} fill="#120F2A" /></G>);
    case 'play': return S(<Path d="M7 4.5 19.5 12 7 19.5z" fill={c} stroke={c} strokeWidth={2} strokeLinejoin="round" />);
    case 'pause': return S(<G><Rect x={6} y={5} width={4.4} height={14} rx={1.6} fill={c} /><Rect x={13.6} y={5} width={4.4} height={14} rx={1.6} fill={c} /></G>);
    case 'search': return S(<G><Circle cx={10.5} cy={10.5} r={6.5} {...stroke} /><Path d="M15.5 15.5 20 20" {...stroke} /></G>);
    case 'bag': return S(<G><Path d="M4.5 8h15l-1.2 11.5A2 2 0 0 1 16.3 21H7.7a2 2 0 0 1-2-1.5z" fill={c} /><Path d="M9 9.5V7a3 3 0 0 1 6 0v2.5" {...stroke} stroke={a === c ? '#120F2A' : a} /></G>);
    case 'cart': return S(<G><Path d="M3 4h2.5l2.2 10.5h10.8L21 7H7" fill="none" stroke={c} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" /><Circle cx={9} cy={19} r={1.8} fill={c} /><Circle cx={17} cy={19} r={1.8} fill={c} /></G>);
    case 'qr': return S(<G><Rect x={3.5} y={3.5} width={7} height={7} rx={1.6} fill={c} /><Rect x={13.5} y={3.5} width={7} height={7} rx={1.6} fill={c} /><Rect x={3.5} y={13.5} width={7} height={7} rx={1.6} fill={c} /><Rect x={14} y={14} width={3} height={3} rx={0.8} fill={a} /><Rect x={17.5} y={17.5} width={3} height={3} rx={0.8} fill={a} /></G>);
    case 'calendar': return S(<G><Rect x={3.5} y={5} width={17} height={15.5} rx={3} fill={c} /><Rect x={3.5} y={5} width={17} height={5} rx={2.5} fill={a} /><Path d="M8 3v4M16 3v4" {...stroke} /></G>);
    case 'pin': return S(<G><Path d="M12 21.5s7-6.4 7-11.8a7 7 0 0 0-14 0c0 5.4 7 11.8 7 11.8z" fill={c} /><Circle cx={12} cy={9.7} r={2.6} fill="#120F2A" /></G>);
    case 'users': return S(<G><Circle cx={9} cy={8} r={3.6} fill={c} /><Path d="M2.5 19.5c.6-3.7 3.2-5.6 6.5-5.6s5.9 1.9 6.5 5.6z" fill={c} /><Circle cx={16.5} cy={8.5} r={2.8} fill={a} /><Path d="M15.6 13.4c3.3-.4 5.4 1.6 5.9 4.6h-4.2" fill={a} /></G>);
    case 'gem': return S(<G><Circle cx={12} cy={12} r={10} fill={c} /><Path d="M12 4.5c.6 4.2 3 6.9 7.5 7.5-4.5.6-6.9 3.3-7.5 7.5-.6-4.2-3-6.9-7.5-7.5 4.5-.6 6.9-3.3 7.5-7.5z" fill={a === c ? '#C6F432' : a} /></G>);
    case 'flame': return S(<G><Path d="M12 2.2c1.3 4.6 6.4 5.8 6.4 11.4a6.4 6.4 0 0 1-12.8 0c0-3.6 2.3-4.9 2.3-8.2 1.8 1.2 3.5 3 3.5 4.7.6-2.4 0-5.6.6-7.9z" fill={c} /><Path d="M12 12.5c.6 2 2.8 2.6 2.8 5a2.8 2.8 0 0 1-5.6 0c0-1.6 1-2.2 1-3.6.8.5 1.5 1.3 1.5 2 .3-1 0-2.5.3-3.4z" fill={a === c ? '#FFE07A' : a} /></G>);
    case 'chest': return S(<G><Path d="M3.5 10a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v1.5h-17z" fill={a} /><Rect x={3.5} y={11} width={17} height={9} rx={2} fill={c} /><Rect x={10.3} y={9.5} width={3.4} height={5} rx={1.2} fill="#FFE07A" /></G>);
    case 'trophy': return S(<G><Path d="M7 3.5h10v5.2a5 5 0 0 1-10 0z" fill={c} /><Path d="M7 5H4.3a3.2 3.2 0 0 0 3.2 4.6M17 5h2.7a3.2 3.2 0 0 1-3.2 4.6" {...stroke} strokeWidth={2} /><Rect x={10.4} y={13} width={3.2} height={3.5} fill={c} /><Rect x={7} y={16.5} width={10} height={4} rx={1.5} fill={a} /></G>);
    case 'gear': return S(<G><Path d="M10.3 2.8h3.4l.5 2.4 1.9 1 2.3-.9 1.7 3-1.8 1.6v2.2l1.8 1.6-1.7 3-2.3-.9-1.9 1-.5 2.4h-3.4l-.5-2.4-1.9-1-2.3.9-1.7-3 1.8-1.6v-2.2L3.9 8.3l1.7-3 2.3.9 1.9-1z" fill={c} /><Circle cx={12} cy={12} r={3} fill="#120F2A" /></G>);
    case 'heart': return S(<Path d="M12 20.5S3.5 15.4 3.5 9.2A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.5 2.6c0 6.2-8.5 11.3-8.5 11.3z" fill={c} />);
    case 'chat': return S(<Path d="M12 3.5c4.9 0 8.5 3.2 8.5 7.4s-3.6 7.4-8.5 7.4c-1 0-2-.1-2.9-.4L4.5 20l1.2-3.9C4.3 14.8 3.5 13 3.5 10.9c0-4.2 3.6-7.4 8.5-7.4z" fill={c} />);
    case 'send': return S(<Path d="M3.5 11.5 20.5 4l-6.8 16.5-2.6-6.6z" fill={c} stroke={c} strokeWidth={1.6} strokeLinejoin="round" />);
    case 'shield': return S(<G><Path d="M12 2.8 19.5 6v6c0 4.6-3.2 8-7.5 9.2C7.7 20 4.5 16.6 4.5 12V6z" fill={c} /><Path d="M8.5 12l2.4 2.4 4.6-4.8" {...stroke} stroke="#120F2A" /></G>);
    case 'star': return S(<Path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.4l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" fill={c} stroke={c} strokeWidth={1.4} strokeLinejoin="round" />);
    case 'gift': return S(<G><Rect x={3.5} y={9} width={17} height={4} rx={1.5} fill={a} /><Rect x={5} y={13} width={14} height={8} rx={2} fill={c} /><Rect x={10.6} y={9} width={2.8} height={12} fill="#FFE07A" /><Path d="M12 9C10 5 6.5 5.5 7.2 7.6 7.7 9 12 9 12 9zm0 0c2-4 5.5-3.5 4.8-1.4C16.3 9 12 9 12 9z" fill="#FFE07A" /></G>);
    case 'edit': return S(<G><Path d="M15.2 4.3 19.7 8.8 9 19.5l-5 .5.5-5z" fill={c} /><Path d="M13.4 6.1 17.9 10.6" stroke="#120F2A" strokeWidth={1.6} /></G>);
    case 'clock': return S(<G><Circle cx={12} cy={12} r={9.5} fill={c} /><Path d="M12 7v5.5l3.5 2" stroke="#120F2A" strokeWidth={2.4} strokeLinecap="round" fill="none" /></G>);
    case 'bolt': return S(<Path d="M13.6 2.5 5 13.4h6.2l-1.4 8.1 8.9-11.2h-6.3z" fill={c} />);
    case 'sparkle': return S(<Path d="M12 2c.8 5.6 4.4 9.2 10 10-5.6.8-9.2 4.4-10 10-.8-5.6-4.4-9.2-10-10 5.6-.8 9.2-4.4 10-10z" fill={c} />);
    case 'trash': return S(<G><Rect x={5.5} y={7} width={13} height={14} rx={2.5} fill={c} /><Rect x={3.5} y={4.5} width={17} height={3} rx={1.5} fill={a} /><Rect x={9.5} y={2.5} width={5} height={3} rx={1.2} fill={a} /></G>);
    case 'info': return S(<G><Circle cx={12} cy={12} r={9.5} fill={c} /><Rect x={10.8} y={10.5} width={2.4} height={7} rx={1.2} fill="#120F2A" /><Circle cx={12} cy={7.5} r={1.5} fill="#120F2A" /></G>);
  }
  return null;
}
