import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Redirect, Tabs, useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F, themed } from '@/theme';
import { useGame } from '@/store/game';
import { Icon, IconName } from '@/art/Icon';
import { Press } from '@/ui/kit';

const TABS: { name: string; label: string; icon: IconName; color: 'taku' | 'puri' | 'lime' | 'momo' | 'ora' }[] = [
  { name: 'discover', label: 'Discover', icon: 'discover', color: 'taku' },
  { name: 'battle', label: 'Battle', icon: 'battle', color: 'puri' },
  { name: 'index', label: 'Home', icon: 'home', color: 'lime' },
  { name: 'stage', label: 'Stage', icon: 'stage', color: 'momo' },
  { name: 'me', label: 'Me', icon: 'me', color: 'ora' },
];

function TabButton({ t, focused, onPress }: { t: typeof TABS[number]; focused: boolean; onPress: () => void }) {
  const k = useSharedValue(focused ? 1 : 0);
  useEffect(() => { k.value = withSpring(focused ? 1 : 0, { damping: 16, stiffness: 220 }); }, [focused]);
  const pill = useAnimatedStyle((): any => ({ opacity: k.value, transform: [{ scale: 0.6 + k.value * 0.4 }] }));
  const ic = useAnimatedStyle((): any => ({ transform: [{ translateY: -k.value * 1 }, { scale: 1 + k.value * 0.08 }] }));
  return (
    <Press onPress={onPress} style={styles.btn} scaleTo={0.9} accessibilityLabel={t.label} accessibilityState={{ selected: focused }}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.pill, { backgroundColor: C[t.color] }, pill]} />
      <Animated.View style={[{ alignItems: 'center', gap: 2 }, ic]}>
        <Icon name={t.icon} size={23} c={focused ? (C.dark ? C.ink : '#FFFFFF') : C.dark ? '#8C86BD' : '#B5A9C8'} c2={focused ? (C.dark ? '#FFFFFF' : C[t.color]) : C.dark ? '#5E5896' : '#FFFFFF'} />
        <Text style={{ fontFamily: F.bodyHeavy, fontSize: 10.5, color: focused ? (C.dark ? C.ink : '#FFFFFF') : C.dark ? '#8C86BD' : '#9A8EB0' }}>{t.label}</Text>
      </Animated.View>
    </Press>
  );
}

function TabBar({ state }: any) {
  useGame(s => s.settings.theme);
  const ins = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={[styles.bar, { bottom: Math.max(ins.bottom, 10) + 4 }]}>
      {TABS.map(t => {
        const i = state.routes.findIndex((x: any) => x.name === t.name);
        const r = state.routes[i];
        if (!r) return null;
        const focused = state.index === i;
        return <TabButton key={r.key} t={t} focused={focused} onPress={() => { if (!focused) router.navigate(r.name === 'index' ? '/' : ('/' + r.name) as any); }} />;
      })}
    </View>
  );
}

export default function TabsLayout() {
  const onboarded = useGame(s => s.onboarded);
  if (!onboarded) return <Redirect href="/onboarding" />;
  return (
    <Tabs id="tabs" tabBar={p => <TabBar {...p} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: C.bg }, animation: 'shift' }}>
      {['index', 'discover', 'battle', 'stage', 'me'].map(n => <Tabs.Screen key={n} name={n} options={{ title: TABS.find(t => t.name === n)!.label }} />)}
    </Tabs>
  );
}

const styles = themed(() => StyleSheet.create({
  bar: { position: 'absolute', left: 14, right: 14, height: 68, borderRadius: 34, backgroundColor: C.bar, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, borderWidth: 1.5, borderColor: C.barLine, elevation: 16 },
  btn: { flex: 1, height: 56, alignItems: 'center', justifyContent: 'center' },
  pill: { borderRadius: 28, margin: 2 },
}));
