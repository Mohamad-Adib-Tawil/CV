# LKLK Live — Portfolio Case Study

---

## Overview

**LKLK Live** is a production Arabic-market social audio platform — an app where users create and join live audio rooms, send virtual gifts, climb VIP ladders, compete in weekly events, and purchase virtual coins. It sits in the same category as Clubhouse, Yalla, and Sawa, targeting a Middle Eastern audience with full Arabic RTL support alongside English.

The app shipped at version **2.2.82** (build 82), available on Google Play (`com.bwmatbw.lklklivechatapp`).

---

## My Role

Full Flutter developer responsible for the entire mobile client: architecture decisions, state management design, SDK integrations (ZEGOCLOUD, LiveKit, Appwrite), UI implementation, performance tuning, and the in-app economy (purchases, coins, gifts).

---

## Main Features

| Feature | Description |
|---|---|
| Live Audio Rooms | Join/create rooms with up to 20 microphone seats, 500 users |
| Virtual Gifts | Send animated SVGA/VAP gifts; queue manager handles concurrency |
| VIP System | 6+ VIP levels with frames, entry effects, shields, chat body styles |
| Coin Economy | 6 in-app purchase tiers; coins spent on gifts, lucky bags |
| Lucky Bag / Money Bag | Interactive gifting mini-game inside rooms |
| Weekly Star Event | Countdown-based leaderboard with top-3 podium |
| Tasks & Levels | Gamified progression: tasks → XP → level-up |
| User Profiles | Avatar, badges, elements (frames, entry effects), friendship system |
| In-Room Media Player | Icecast streaming + device songs via ZEGOCLOUD mixer |
| Notifications | Local notifications + Appwrite Realtime push |
| CP / Wakala Challenges | Competitive couple/agency challenge events |
| Google Ads | AdMob banner/interstitial integration |
| Localization | Full Arabic + English, RTL-aware layout |

---

## Technical Implementation

### Architecture

The project uses a **feature-based modular structure** under `lib/features/`, with each feature ideally organized into `data / domain / presentation` layers (Clean Architecture). The `room`, `auth`, and `livekit_audio` features fully apply this layering. Simpler features (e.g. `weekly_star_event`, `tasks`) use a flatter structure with a cubit + view pattern.

```
lib/
├── core/          # Shared services, config, animations, utils
│   ├── config/    # AppConfig, AppwriteConfig, EnvLoader, FeatureFlags
│   ├── services/  # ApiService, AuthService, PurchaseService, RealtimeService…
│   └── performance/ # MemoryManager, NetworkOptimizer, PerformanceManager
├── features/
│   ├── auth/      # Google Sign-In, UserEntity, AuthRepository
│   ├── room/      # Full Clean Arch: data/domain/presentation
│   ├── livekit_audio/ # Clean Arch: LiveKit token, remote, repository
│   ├── home/      # Room listing, banners, top-50 charts
│   ├── profile_users/ # User profile, elements, friendship
│   ├── tasks/     # Gamification tasks, levels, ranking
│   └── …
├── internal/      # ZEGOCLOUD SDK wrappers (ZegoExpress, ZIM, LiveKit)
└── main.dart      # App bootstrap, MultiBlocProvider, ScreenUtilInit
```

### State Management

**flutter_bloc** (Cubit pattern) is used throughout. Cubits are registered as lazy singletons in `GetIt` and provided globally via `MultiBlocProvider` in `main.dart`. Key cubits:

- `UserCubit` — user session, profile data, wallet balance
- `RoomCubit` — active room state (join/leave, seats, settings)
- `RoomsCubit` — room listing with stale-while-revalidate cache
- `GiftCubit` / `GiftsShowCubit` — gift dispatch and animation queue
- `LuckBagCubit` — lucky bag purchase and result flow
- `LiveKitAudioCubit` — LiveKit connection, participant sync, mic toggle
- `LanguageCubit` — locale switching (AR/EN)
- `PlaybackCubit` / `PlaylistCubit` — in-room media player state

### Data Flow

1. **UI** dispatches Cubit method calls
2. **Cubit** calls Use Cases (where Clean Arch applies) or repositories directly
3. **Repository** delegates to remote data sources (`ApiService` / Appwrite)
4. Results bubble back up as Cubit state emissions
5. `BlocBuilder` / `BlocListener` rebuild or trigger side effects

### API Integration

`ApiService` is a singleton Dio wrapper configured with:
- Base URL from `.env` via `flutter_dotenv` (fallback: `https://lklklive.com/api`)
- 30-second connection/receive timeouts
- Request debounce (2 s) to prevent duplicate calls
- Interceptors for auth token injection
- Arabic error messages for 429, 403, 500, timeout, and socket errors
- `IOHttpClientAdapter` override for legacy Android SSL trust on older devices

`AuthApiClient` handles login/register against the custom backend.

### Local Storage

| Store | Used For |
|---|---|
| `flutter_secure_storage` | JWT token, user JSON (primary, secure) |
| `SharedPreferences` | Legacy token (migrated to secure storage on first read) |
| `Hive` (`userCacheBox`) | Offline-first `UserEntity` cache (Hive-generated adapter) |
| `RoomsCacheManager` / `RoomDetailsCacheManager` | Stale-while-revalidate room list / detail cache |
| `flutter_cache_manager` | Network image disk cache |

### Authentication

1. User taps **Login with Google** → `GoogleSignIn` returns `GoogleSignInAccount`
2. `AuthRepository.signInWithGoogle()` builds a `UserEntity` from the Google account
3. Google identity is exchanged with the custom backend (`AuthApiClient`) for a JWT token
4. Token is stored in `flutter_secure_storage`; a 30-minute in-memory cache in `AuthService` prevents repeated disk reads
5. Token is injected into every `ApiService` request via a Dio interceptor
6. Appwrite connection is initialized with an anonymous session for realtime subscriptions (no Appwrite account auth)

### Reusable Components

- `OptimizedSeatItemView` / `OptimizedSeatGrid` — microphone seat UI
- `OptimizedGiftAnimationWidget` — SVGA/VAP animation wrapper with queue
- `ShimmerWidget` / `Skeletonizer` — loading state placeholders
- `AnimatedBorderContainer`, `GlowAnimated`, `HeartArteryAnimation` — VIP/room decorations
- `SvgaCustomPlayer` / `AlphaPlayer` (VAP) — animation engines
- `AudioRoomOverlayPage` — persistent overlay (room continues while browsing home)

### Error Handling

- Dio errors translated to Arabic user-facing strings (`ApiService.formatDioError`)
- `runZonedGuarded` in `main` catches uncaught async errors silently (no crash)
- `FlutterError.onError` forwards to `presentError` in debug
- Cubits emit error states; UI responds with `BlocListener` snackbars via `SnackBarHelper`
- Appwrite `close()` gracefully cancels all subscriptions on logout/room exit

### Performance

- Chat capped at **25 live messages**, **50 cached** (`AppConfig.maxChatMessages`)
- Image cache: 100 items / 100 MB (`AppConfig.imageCacheMaxSizeBytes`)
- Gift animation concurrency capped at **8** (`AppConfig.maxConcurrentGifts`)
- `flutter_screenutil` (360×756 canvas) with `minTextAdapt: true`
- Lazy BlocProvider for heavy cubits (GiftCubit, FetchElementsCubit)
- Background SVGA asset pre-seeding via `SvgaSeeder` + `GlobalDownloadOrchestrator`
- `AdaptiveDownloadBandwidthPolicy` throttles concurrent downloads based on bandwidth
- `MemoryManager`, `NetworkOptimizer`, `PerformanceManager` utility classes in `core/performance/`
- `wakelock_plus` keeps screen on only when in an active audio room

---

## Challenges & Solutions

### Challenge 1: Dual Audio SDK Integration
Two audio SDKs (ZEGOCLOUD and LiveKit) coexist for different use cases — ZEGOCLOUD for the primary room flow (with ZIM signaling), LiveKit for an alternate audio path (`livekit_audio` feature). Managing SDK lifecycle without memory leaks required careful service-object singletons (`LiveKitAudioService.instance`, `ZegoSDKManager`) and explicit `init()` / `unInit()` patterns.

### Challenge 2: Gift Animation Performance
SVGA files are large; playing multiple animations simultaneously caused frame drops. Solution: a `LuckyGiftQueueManager` + `OptimizedGiftManager` that batches gifts, caps concurrency at 8, and pre-downloads assets via the background download pipeline before they are needed.

### Challenge 3: Token Security Migration
Early builds stored the JWT in plain `SharedPreferences`. Mid-development this was migrated to `flutter_secure_storage`. `AuthService.getTokenFromSharedPreferences()` handles the migration transparently: on first read it checks SharedPreferences, moves the value to secure storage, and deletes the plain-text copy.

### Challenge 4: Realtime at Scale
Three realtime channels coexist: Appwrite Realtime (gift/notification events), WebSocket `RealtimeService` (room events), and ZEGOCLOUD ZIM (seat requests, signaling). Each has its own reconnect logic (5 attempts, exponential), heartbeat timer, and typed event model to prevent coupling.

### Challenge 5: Room Continuity (Minimize)
Users expect to browse the home feed while staying in a room. An `AudioRoomOverlayPage` sits above the navigator stack, rendering the minimized room widget as a persistent overlay rather than destroying and rebuilding the room on navigation.

---

## Technologies Used

| Category | Technology |
|---|---|
| Framework | Flutter 3.x, Dart |
| State Management | flutter_bloc 9.x (Cubit) |
| DI | GetIt 8.x |
| HTTP Client | Dio 5.x |
| Backend | Custom REST API, Appwrite 20.x (self-hosted) |
| Realtime | Appwrite Realtime, WebSocket (`web_socket_channel`) |
| Audio SDK | ZEGOCLOUD ZegoExpress SDK, LiveKit 2.x |
| Signaling | ZEGOCLOUD ZIM |
| Auth | Google Sign-In, JWT (custom backend) |
| Local DB | Hive 2.x |
| Secure Storage | flutter_secure_storage 9.x |
| Caching | SharedPreferences, flutter_cache_manager |
| In-App Purchase | in_app_purchase 3.x |
| Background Tasks | flutter_foreground_task 8.x, background_downloader 9.x |
| Audio Processing | FFmpeg Kit (audio), just_audio, audio_session |
| Animations | flutter_animate, SVGA (custom player), VAP (alpha player) |
| Ads | google_mobile_ads 5.x |
| Localization | flutter_intl (AR + EN) |
| Responsive UI | flutter_screenutil 5.x |
| Code Generation | build_runner, hive_generator, flutter_gen |
| Security | encrypt 5.x, flutter_dotenv |

---

## Results / Impact

- **Production app** published on Google Play with real users in the Arabic-speaking market
- Version 2.2.82 reflects continuous iterative delivery over 80+ build iterations
- Room system supports up to **500 concurrent users per room** and **20 microphone seats**
- SVGA animation pipeline handles gift events with sub-100 ms queue processing interval
- Dual-SDK audio strategy provides a fallback audio path for connectivity resilience
- Coin economy with 6 purchase SKUs monetizes the platform through virtual gifting
