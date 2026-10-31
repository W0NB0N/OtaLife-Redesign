// Ōta Life design tokens. Two themes share one token set:
//  - Idol Pastel (default): soft candy colours, big rounded white cards, glossy buttons.
//  - Night: dark indigo ground so the flat mascot colours pop.
// `C` is a live object: applyTheme() swaps its values, and `themed()` stylesheets rebuild lazily.
import { StyleSheet } from 'react-native';

export type ThemeName = 'pastel' | 'night';

const NIGHT = {
  bg: '#120F2A', bg2: '#17133A', card: '#211C4A', card2: '#2B255C', line: '#3A3378',
  text: '#FFFFFF', soft: '#E2DEFF', mute: '#ABA5D9', dim: '#726BA8', ink: '#120F2A',
  ora: '#8B6CFF', oraDeep: '#5B3FE0', lime: '#C6F432', limeDeep: '#8DB800', onLime: '#120F2A',
  pink: '#FF5C9A', red: '#FF4D6D', orange: '#FF9F43', gold: '#FFC93C', sky: '#4FC3F7', green: '#3DDC97', white: '#FFFFFF',
  taku: '#4FC3F7', takuDeep: '#123A57', takuSoft: '#1A4A6E',
  momo: '#FF5C9A', momoDeep: '#4A1638', momoSoft: '#5E1D47',
  puri: '#FFC93C', puriDeep: '#3D2E0E', puriSoft: '#544013',
  common: '#B9C2D6', rare: '#4FA8FF', epic: '#A77BFF', legendary: '#FFC93C', wrong: '#FF4D6D',
  // surfaces with a role
  hero: '#8B6CFF', heroText: '#FFFFFF', heroSoft: '#E4DEFF', heroTrack: '#FFFFFF2A', heroBlob: '#5B3FE0',
  panel: '#1D1356', bar: '#0B0920', barLine: '#2B255C', violetSoft: '#2A1F5C', greenSoft: '#1F3A1A', selected: '#24204F',
  chipOn: '#C6F432', heroBar: '#C6F432', bubble: '#FFFFFF', glass: '#FFFFFF1F', scrim: 'rgba(5,3,20,0.7)', glow: '#4A4270',
  dark: true, gloss: false,
};

const PASTEL: typeof NIGHT = {
  bg: '#FCEAF3', bg2: '#FFF5FA', card: '#FFFFFF', card2: '#F8EEF6', line: '#F1DCEA',
  text: '#2B2340', soft: '#4F4566', mute: '#6F6487', dim: '#968AAB', ink: '#2B2340',
  ora: '#8B6CFF', oraDeep: '#6E4FF0', lime: '#F2558F', limeDeep: '#C93A70', onLime: '#FFFFFF',
  pink: '#F2558F', red: '#F0476A', orange: '#FF9A4D', gold: '#F5B21E', sky: '#5BB8F0', green: '#2EAE7D', white: '#FFFFFF',
  taku: '#5BB8F0', takuDeep: '#E2F3FC', takuSoft: '#CBEAF8',
  momo: '#F2558F', momoDeep: '#FFE3EE', momoSoft: '#FFCFE1',
  puri: '#F5B21E', puriDeep: '#FFF3C9', puriSoft: '#FFE7A1',
  common: '#A9B3C8', rare: '#4FA8FF', epic: '#9F73FF', legendary: '#F5B21E', wrong: '#F0476A',
  hero: '#FFFFFF', heroText: '#2B2340', heroSoft: '#6E6488', heroTrack: '#F1E6F5', heroBlob: '#FFD6E7',
  panel: '#EFE6FF', bar: '#FFFFFF', barLine: '#F4DDEB', violetSoft: '#EFE8FF', greenSoft: '#DDF5EA', selected: '#FFF0F6',
  chipOn: '#F2558F', heroBar: '#8B6CFF', bubble: '#FFE6F0', glass: '#FFFFFF', scrim: 'rgba(70,40,70,0.35)', glow: '#E7DDF1',
  dark: false, gloss: true,
};

export const THEMES: Record<ThemeName, { label: string; blurb: string; palette: typeof NIGHT }> = {
  pastel: { label: 'Idol Pastel', blurb: 'Soft candy colours, big rounded cards, sparkles and glossy buttons.', palette: PASTEL },
  night: { label: 'Night Stage', blurb: 'Dark indigo ground that makes the mascots pop.', palette: NIGHT },
};

export const C = { ...PASTEL };
export let themeName: ThemeName = 'pastel';
let version = 0;
export const themeVersion = () => version;

export function applyTheme(name: ThemeName) {
  if (!THEMES[name]) name = 'pastel';
  Object.assign(C, THEMES[name].palette);
  themeName = name;
  version++;
}

/** a stylesheet that rebuilds itself after a theme switch; use exactly like StyleSheet.create */
export function themed<T extends Record<string, any>>(make: () => T): T {
  let built: T | null = null, at = -1;
  return new Proxy({} as T, {
    get(_, key) {
      if (at !== version || !built) { built = make(); at = version; }
      return (built as any)[key];
    },
  });
}

export const F = {
  display: 'Fredoka_700Bold',
  displaySemi: 'Fredoka_600SemiBold',
  body: 'Nunito_700Bold',
  bodyHeavy: 'Nunito_900Black',
  bodyBold: 'Nunito_800ExtraBold',
  bodyReg: 'Nunito_600SemiBold',
};

export const R = { xl: 32, lg: 26, md: 20, sm: 14, pill: 999 };

const dom = (k: 'taku' | 'momo' | 'puri', name: string) => ({
  get fill() { return C[k]; }, get deep() { return (C as any)[k + 'Deep'] as string; }, get soft() { return (C as any)[k + 'Soft'] as string; }, name,
});
export const DOMAIN = { taku: dom('taku', 'TAKU-kun'), momo: dom('momo', 'Momo-chan'), puri: dom('puri', 'Puri-kun') };

export type Who = 'taku' | 'momo' | 'puri';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
