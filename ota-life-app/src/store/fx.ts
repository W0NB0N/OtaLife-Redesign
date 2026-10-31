// Ephemeral feedback layer: reward floats, toasts, queued rank/star events. Not persisted.
import { create } from 'zustand';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import type { Who } from '@/theme';

export type Float = { id: number; x: number; y: number; text: string; color?: string };
export type Toast = { id: number; who: Who; title: string; sub?: string; state?: string };
export type GameEvent = { type: 'rank'; idx: number } | { type: 'star'; title: string };

type FX = {
  floats: Float[];
  toasts: Toast[];
  queue: GameEvent[];
  busy: number;
  chip: { x: number; y: number } | null;
  cutscene: number | null; // rank index being celebrated
  hapticsOn: boolean;
  float: (x: number, y: number, text: string, color?: string) => void;
  dropFloat: (id: number) => void;
  toast: (who: Who, title: string, sub?: string, state?: string) => void;
  dropToast: (id: number) => void;
  push: (e: GameEvent) => void;
  shift: () => GameEvent | undefined;
  setBusy: (on: boolean) => void;
  setChip: (p: { x: number; y: number }) => void;
  setCutscene: (i: number | null) => void;
};

let n = 1;
export const useFx = create<FX>((set, get) => ({
  floats: [], toasts: [], queue: [], busy: 0, chip: null, cutscene: null, hapticsOn: true,
  float: (x, y, text, color) => set(s => ({ floats: [...s.floats, { id: n++, x, y, text, color }] })),
  dropFloat: id => set(s => ({ floats: s.floats.filter(f => f.id !== id) })),
  toast: (who, title, sub, state) => set(s => ({ toasts: [...s.toasts.slice(-1), { id: n++, who, title, sub, state }] })),
  dropToast: id => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
  push: e => set(s => ({ queue: [...s.queue, e] })),
  shift: () => { const [e, ...rest] = get().queue; set({ queue: rest }); return e; },
  setBusy: on => set(s => ({ busy: Math.max(0, s.busy + (on ? 1 : -1)) })),
  setChip: p => set({ chip: p }),
  setCutscene: i => set({ cutscene: i }),
}));

export const haptic = {
  tap: () => { if (Platform.OS !== 'web' && useFx.getState().hapticsOn) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); },
  medium: () => { if (Platform.OS !== 'web' && useFx.getState().hapticsOn) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}); },
  heavy: () => { if (Platform.OS !== 'web' && useFx.getState().hapticsOn) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}); },
  success: () => { if (Platform.OS !== 'web' && useFx.getState().hapticsOn) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); },
  error: () => { if (Platform.OS !== 'web' && useFx.getState().hapticsOn) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {}); },
};
