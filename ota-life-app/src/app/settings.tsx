import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { C, THEMES, ThemeName } from '@/theme';
import { useGame } from '@/store/game';
import { haptic, useFx } from '@/store/fx';
import { Mascot, MascotStill } from '@/mascots/Mascot';
import { Btn, Card, H, Press, Row, T } from '@/ui/kit';
import { BackBar, Screen } from '@/ui/game';
import { Sheet } from '@/ui/overlays';

function Toggle({ on, onChange, label, sub }: { on: boolean; onChange: (v: boolean) => void; label: string; sub: string }) {
  return (
    <Press onPress={() => onChange(!on)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }} accessibilityState={{ checked: on }}>
      <View style={{ flex: 1 }}><T w="black" size={15}>{label}</T><T size={12.5} color={C.mute}>{sub}</T></View>
      <View style={{ width: 52, height: 32, borderRadius: 16, backgroundColor: on ? C.ora : C.card2, padding: 4 }}><View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFFFFF', transform: [{ translateX: on ? 20 : 0 }] }} /></View>
    </Press>
  );
}

/** a miniature of the theme so people can see it before picking */
function ThemeCard({ name, on, onPress }: { name: ThemeName; on: boolean; onPress: () => void }) {
  const p = THEMES[name].palette;
  return (
    <Press onPress={onPress} style={{ flex: 1 }} accessibilityState={{ selected: on }} accessibilityLabel={THEMES[name].label}>
      <View style={{ borderRadius: 24, padding: 4, backgroundColor: on ? C.lime : C.card2 }}>
        <View style={{ borderRadius: 20, backgroundColor: p.bg, padding: 10, gap: 8, overflow: 'hidden' }}>
          <View style={{ backgroundColor: p.hero, borderRadius: 16, height: 70, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingLeft: 10, overflow: 'hidden' }}>
            <View style={{ gap: 4, paddingBottom: 12 }}>
              <View style={{ width: 46, height: 7, borderRadius: 4, backgroundColor: p.heroText, opacity: 0.85 }} />
              <View style={{ width: 64, height: 8, borderRadius: 4, backgroundColor: p.heroTrack }}><View style={{ width: 30, height: 8, borderRadius: 4, backgroundColor: p.dark ? p.lime : p.ora }} /></View>
            </View>
            <MascotStill who={name === 'pastel' ? 'momo' : 'puri'} size={62} />
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <View style={{ flex: 1, height: 26, borderRadius: 10, backgroundColor: p.momoDeep }} />
            <View style={{ flex: 1, height: 26, borderRadius: 10, backgroundColor: p.takuDeep }} />
          </View>
          <View style={{ height: 22, borderRadius: 11, backgroundColor: p.lime, borderBottomWidth: 3, borderBottomColor: p.limeDeep }} />
        </View>
      </View>
      <T w="black" center style={{ marginTop: 6 }}>{THEMES[name].label}{name === 'pastel' ? ' · default' : ''}</T>
    </Press>
  );
}

export default function Settings() {
  const g = useGame();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  return (
    <Screen>
      <BackBar title="Settings" />
      <Card>
        <H size={17}>Theme</H>
        <Row gap={12} style={{ alignItems: 'flex-start' }}>
          {(['pastel', 'night'] as ThemeName[]).map(t => (
            <ThemeCard key={t} name={t} on={g.settings.theme === t} onPress={() => {
              if (g.settings.theme === t) return;
              g.setTheme(t); haptic.success();
              useFx.getState().toast(t === 'pastel' ? 'momo' : 'puri', `${THEMES[t].label} on`, THEMES[t].blurb, t === 'pastel' ? 'sparkle' : 'gg');
            }} />
          ))}
        </Row>
      </Card>
      <Card style={{ gap: 0 }}>
        <Toggle on={g.settings.haptics} onChange={v => g.setSetting('haptics', v)} label="Haptics" sub="Light taps on rewards, capsule cracks and answers" />
        <Toggle on={g.settings.motion} onChange={v => g.setSetting('motion', v)} label="Mascot motion" sub="Turn off for still poses and calmer screens" />
      </Card>
      <Card>
        <H size={17}>Your data</H>
        <T size={13} color={C.mute}>Progress, orders and posts are saved on this device. Clearing the app’s storage resets them.</T>
        {g.address && <T size={13}>Saved address: {g.address.name}, {g.address.city} {g.address.pin}</T>}
        {g.address && <Btn small kind="ghost" title="Forget saved address" onPress={() => { useGame.setState({ address: null }); useFx.getState().toast('momo', 'Address removed', 'We\'ll ask again at your next merch order.', 'happy'); }} />}
        <Btn kind="ghost" title="Reset all progress" icon="trash" onPress={() => setConfirm(true)} />
      </Card>
      <T size={12} color={C.dim} center>Ōta Life 1.0 · made for Ōta TOKYO fans</T>
      <Sheet visible={confirm} onClose={() => setConfirm(false)} title="Reset everything?">
        <Row style={{ alignItems: 'flex-end' }}><Mascot who="momo" state="sad" size={110} /><T style={{ flex: 1 }} color={C.soft}>This deletes your Ōra, rank, streak, capsules, orders and posts on this device. It can’t be undone.</T></Row>
        <Btn kind="pink" title="Yes, reset my progress" onPress={() => { setConfirm(false); g.reset(); router.replace('/onboarding'); }} />
        <Btn kind="ghost" title="Keep my progress" onPress={() => setConfirm(false)} />
      </Sheet>
    </Screen>
  );
}
