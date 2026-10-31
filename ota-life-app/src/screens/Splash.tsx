import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { C } from '@/theme';

// Shown for the moment fonts load and saved progress is read from storage.
export function Splash() {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 18 }}>
      <Text style={{ color: C.text, fontSize: 44, fontWeight: '900' }}>Ōta Life</Text>
      <ActivityIndicator color={C.lime} />
    </View>
  );
}
