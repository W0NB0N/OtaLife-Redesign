# Ōta Life (Android)

React Native (Expo SDK 58, Expo Router) app for the Ōta TOKYO fan community. Three Duolingo-style mascots host the app: TAKU-kun (Discover), Puri-kun (Battle) and Momo-chan (Stage). One stat, Ōra, drives ranks, boss fights and spending.

## Run it

```bash
npm install
npx expo start            # scan with a development build, or press "w" for web
```

### Build an installable Android APK

No Android SDK is needed; EAS builds in the cloud (free Expo account required):

```bash
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview
```

### Build locally

Needs Android Studio (SDK + an emulator or a USB-debugging phone):

```bash
npx expo run:android
```

## What works

Everything is stored on the device (AsyncStorage) and driven by the real clock:

- **Days roll over at local midnight.** Quests, Cheers, the reel jar and the word of the day reset; the Daily Challenge question set is seeded by date.
- **Streaks** count consecutive days with a cleared Daily Challenge. A missed day spends an Encore shield (earned at 7-day milestones or bought for 500 Ōra), otherwise the streak resets.
- **Ōra**: Power (lifetime, sets rank) and Wallet (spendable). Ranks, stars and boss cutscenes fire from Power thresholds. Spending never lowers rank.
- **Capsule machine**: three ticket tiers with published odds, pity counters, duplicates converted to Ōra, prizes kept in the Cabinet; avatar parts can be equipped.
- **Weekly league**: an offline league of generated rivals that earn through the week; it resets every Monday and pays the top 3.
- **Fan Council**: daily Cheers on a poll (closes 10 Nov 2026) and staged ideas; pitching ideas unlocks at Otaku rank.
- **Communities and feed**: join/leave, post, comment (first 5 comments a day pay Ōra), mascot reactions.
- **Store**: merch with sizes, events with day and tier pickers, checkout with cabinet coupons, an Ōra slider capped by rank, saved delivery address, and orders with a scannable QR pass.

## Not connected yet

There is no backend, so:

- Payments are recorded as **pay on delivery / pay at the box office**. Online UPI/card needs a payment gateway and server.
- Other players (league rivals, community posts by others, poll totals) are seeded content, not live data.
- Progress lives on one device; there are no accounts or sync.

## Code map

- `src/app` routes (Expo Router). Tabs in `src/app/(tabs)`.
- `src/mascots` the 2D rigs: `parts.tsx` draws each part (head, torso, arms, legs, eyes, pupils, mouth, props), `Mascot.tsx` animates joints per state, `Fx.tsx` sparkles, hearts, Zzz and more.
- `src/art` icons, blobs, bosses, the capsule machine, Puri's jar, merch and event illustrations.
- `src/store` the persisted game rules (`game.ts`), feedback queue (`fx.ts`) and league (`league.ts`).
- `src/content` quiz bank, reels, communities, store catalogue, ranks.
