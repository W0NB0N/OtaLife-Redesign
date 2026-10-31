import React, { useEffect, useState } from 'react';
import { AppState, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { C } from '@/theme';
import { useGame } from '@/store/game';
import { FloatsHost, ToastHost } from '@/ui/overlays';
import { EventRunner } from '@/screens/EventRunner';
import { Splash } from '@/screens/Splash';
import { useFx } from '@/store/fx';
import { installDemoBridge } from '@/lib/demoBridge';

// dev builds expose the stores for debugging in the browser console
if (__DEV__ && typeof window !== 'undefined') (window as any).__ota = { game: useGame, fx: useFx };

export default function Root() {
  const [fonts] = useFonts({ Fredoka_600SemiBold, Fredoka_700Bold, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black });
  const [hydrated, setHydrated] = useState(useGame.persist.hasHydrated());
  const rollover = useGame(s => s.rollover);
  const theme = useGame(s => s.settings.theme); // re-render the tree when the theme changes

  useEffect(() => { SystemUI.setBackgroundColorAsync(C.bg).catch(() => {}); }, [theme, hydrated]);
  useEffect(() => {
    const unsub = useGame.persist.onFinishHydration(() => setHydrated(true));
    if (useGame.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  // web only: lets the showcase page drive the app
  useEffect(() => { if (hydrated) installDemoBridge(); }, [hydrated]);

  // days roll over at local midnight: check on launch, on resume and every minute
  useEffect(() => {
    if (!hydrated) return;
    rollover();
    const sub = AppState.addEventListener('change', s => { if (s === 'active') rollover(); });
    const id = setInterval(rollover, 60000);
    return () => { sub.remove(); clearInterval(id); };
  }, [hydrated]);

  if (!fonts || !hydrated) return <Splash />;

  return (
    <SafeAreaProvider>
      <View key={'root'} style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar style={C.dark ? 'light' : 'dark'} />
        <Stack id="root" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg }, animation: 'slide_from_right', animationDuration: 320 }}>
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="onboarding" options={{ animation: 'fade', gestureEnabled: false }} />
          <Stack.Screen name="quiz" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
          <Stack.Screen name="gacha" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="reel" options={{ animation: 'fade_from_bottom' }} />
          <Stack.Screen name="order/[id]" options={{ animation: 'fade', gestureEnabled: false }} />
        </Stack>
        <EventRunner />
        <FloatsHost />
        <ToastHost />
      </View>
    </SafeAreaProvider>
  );
}
