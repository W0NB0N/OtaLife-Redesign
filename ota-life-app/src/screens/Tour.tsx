// First-run tour narrated by the player's buddy: spotlights real elements on Home.
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Mask, Rect } from 'react-native-svg';
import { C, Who, themed } from '@/theme';
import { Mascot } from '@/mascots/Mascot';
import { Btn, Row, T } from '@/ui/kit';

export function useTourTarget() {
  const ref = useRef<any>(null);
  return { ref };
}

type Step = { t: { ref: React.RefObject<any> }; text: string };

export function Tour({ who, steps, onDone }: { who: Who; steps: Step[]; onDone: () => void }) {
  const [k, setK] = useState(0);
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [ready, setReady] = useState(false);
  const ins = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  useEffect(() => { const id = setTimeout(() => setReady(true), 1200); return () => clearTimeout(id); }, []);
  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => steps[k].t.ref.current?.measureInWindow((x, y, w, h) => setBox({ x, y, w, h })), 120);
    return () => clearTimeout(id);
  }, [k, ready]);
  if (!ready || !box) return null;
  const pad = 8, b = { x: box.x - pad, y: box.y - pad, w: box.w + pad * 2, h: box.h + pad * 2 };
  const visible = b.y + b.h > 0 && b.y < height;
  const below = b.y + b.h < height * 0.55;
  const last = k === steps.length - 1;
  return (
    <Modal transparent visible animationType="fade" statusBarTranslucent navigationBarTranslucent onRequestClose={onDone}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <Mask id="hole">
            <Rect width={width} height={height} fill="#fff" />
            {visible && <Rect x={b.x} y={b.y} width={b.w} height={b.h} rx={26} fill="#000" />}
          </Mask>
        </Defs>
        <Rect width={width} height={height} fill="rgba(5,3,20,0.78)" mask="url(#hole)" />
        {visible && <Rect x={b.x} y={b.y} width={b.w} height={b.h} rx={26} fill="none" stroke={C.lime} strokeWidth={3} />}
      </Svg>
      <Animated.View key={k} entering={FadeIn.duration(300)} style={[styles.guide, below ? { bottom: ins.bottom + 24 } : { top: ins.top + 20 }]}>
        <Mascot who={who} state="talk" size={120} />
        <View style={styles.box}>
          <T w="black" size={15} color={C.ink}>{steps[k].text}</T>
          <Row between>
            <T size={12} color="#6A6590">{k + 1} of {steps.length}</T>
            <Btn small title={last ? "Let's go" : 'Next'} kind="violet" onPress={() => (last ? onDone() : setK(k + 1))} />
          </Row>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = themed(() => StyleSheet.create({
  guide: { position: 'absolute', left: 12, right: 12, flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  box: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, borderBottomLeftRadius: 6, padding: 14, gap: 10, marginBottom: 10 },
}));
