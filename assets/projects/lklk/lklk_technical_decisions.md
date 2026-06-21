# LKLK Live — Technical Decisions Log

---

## 1. Framework: Flutter

**Chosen**: Flutter 3.x with Dart  
**Alternatives**: React Native, native Android/iOS  
**Reason**: Single codebase for Android and iOS with near-native performance, a rich widget library, and first-class support for custom animations (SVGA, VAP, custom painters). The Arabic market target made `flutter_intl` + RTL support critical — Flutter's declarative RTL handling via `Directionality` is more ergonomic than React Native's manual RTL patches. The team's existing Dart expertise was also a factor.

---

## 2. State Management: flutter_bloc (Cubit)

**Chosen**: `flutter_bloc` 9.x using the Cubit pattern  
**Alternatives**: Riverpod, GetX, Provider, MobX  
**Reason**: Cubit provides a predictable unidirectional data flow with minimal boilerplate. The `BlocObserver` (`ComprehensiveBlocObserver`) gives free debugging — every state transition is logged. Riverpod was considered but the team was already familiar with BLoC's concepts. GetX was rejected because it encourages mixing business logic with UI and lacks explicit state modeling. Provider was too low-level for the scale of this app. The full Bloc (Event) pattern was not used for most cubits because the app's interactions are simple commands, not event streams.

---

## 3. Dependency Injection: GetIt

**Chosen**: `get_it` 8.x  
**Alternatives**: Riverpod (as DI), Injectable + get_it, Provider  
**Reason**: GetIt is a pure service locator — no code generation required for basic usage, no widget tree coupling. It allows registering singletons (`registerLazySingleton`) and transient instances (`registerFactory`) with a clean API. `LazySingleton` is used for expensive services (ApiService, UserCubit, LiveKitAudioCubit) so they're only created when first needed. `Injectable` was not added because the project doesn't need annotation-driven DI — the `service_locator.dart` file is short and clear.

---

## 4. HTTP Client: Dio

**Chosen**: `dio` 5.x  
**Alternatives**: `http` package, Chopper  
**Reason**: Dio provides interceptors (used for token injection and request debounce), `IOHttpClientAdapter` override (needed for legacy Android SSL certificate trust), built-in timeout configuration, and clean error typing via `DioException`. The plain `http` package is also present for a small number of simple fire-and-forget calls but all structured API communication goes through `ApiService` (Dio). Chopper adds code generation overhead that wasn't justified.

---

## 5. Backend: Custom REST API + Appwrite (Self-Hosted)

**Chosen**: Custom Laravel/backend REST API at `lklklive.com/api` + Appwrite `api.lklklive.com/v1` for realtime  
**Alternatives**: Firebase (Firestore + Cloud Functions), Supabase, pure Appwrite  
**Reason**: The custom REST API gives full control over business logic (coin ledger, VIP tiers, gift validation), which wouldn't be possible with a BaaS alone. Appwrite was chosen for real-time document subscriptions (gift events, notifications) because it provides a WebSocket-based Realtime channel with no Firebase vendor lock-in. The self-hosted Appwrite instance reduces cost and keeps data sovereignty within the product's infrastructure.

---

## 6. Audio SDK: ZEGOCLOUD ZegoExpress + ZIM

**Chosen**: ZEGOCLOUD ZegoExpress for audio streaming, ZIM for in-room signaling  
**Alternatives**: Agora, LiveKit, WebRTC direct  
**Reason**: ZEGOCLOUD provides a mature, battle-tested SDK for the Middle East market with features specifically designed for social audio (room attributes, SEI, media mixer for music sharing, audience mode). ZIM (ZEGOCLOUD IM) is tightly integrated with ZegoExpress for seat request signaling without building a separate signaling server. The `internal/sdk/` wrapper layer abstracts ZegoExpress behind clean Dart interfaces.

---

## 7. Alternative Audio Path: LiveKit

**Chosen**: `livekit_client` 2.x as a second audio SDK  
**Alternatives**: Keep only ZEGOCLOUD  
**Reason**: LiveKit is open-source, self-hostable, and uses standard WebRTC. Adding it as an alternative gives the product flexibility: if ZEGOCLOUD costs or reliability become issues, LiveKit can serve as a fallback or replacement. The `livekit_audio` feature isolates this behind the `AudioRepository` interface, so the switch is a DI change, not a rewrite. *Note*: at the time of writing, both SDKs coexist; the final choice of primary SDK may still be in-flight.

---

## 8. Local Storage Strategy

**Chosen**: flutter_secure_storage (primary), Hive (offline cache), SharedPreferences (legacy/simple flags)  
**Alternatives**: SQLite (sqflite), Drift  
**Reason**: Three tiers serve three needs. `flutter_secure_storage` is used for the JWT token and user profile — security is paramount. `Hive` is used for the `UserEntity` offline cache because it's a fast, typed, box-oriented NoSQL store with code-generated adapters — zero SQL boilerplate. `SharedPreferences` remains for simple key-value flags (download preferences, language setting) where encryption isn't needed. SQLite/Drift would be overkill for this data shape.

---

## 9. Animation Engine: SVGA + VAP (Alpha Player)

**Chosen**: Custom SVGA player (`flutter_svga` with local path override) + custom VAP (alpha-channel video) player  
**Alternatives**: Lottie, Rive, plain GIF  
**Reason**: SVGA is the dominant gift animation format in Chinese/Middle Eastern social apps (Yalla, Bigo, etc.) — the animation assets were provided in SVGA format. Lottie and Rive were not compatible with the asset format. VAP (Video Alpha Protocol) enables alpha-channel videos for full-bleed entry animations that SVGA can't express. The `flutter_svga` package was forked (`packages/flutter_svga`) to fix local file loading and performance issues in the upstream package.

---

## 10. In-App Purchases: in_app_purchase

**Chosen**: `in_app_purchase` 3.x (official Flutter plugin)  
**Alternatives**: RevenueCat, Adapty, purchases_flutter  
**Reason**: The official plugin was sufficient for 6 fixed consumable SKUs. RevenueCat adds subscription management, paywalls, and analytics — none of which were needed for a simple coin bundle flow. The plugin integrates directly with Google Play Billing and App Store Connect with no third-party SDK.

---

## 11. Routing: Navigator (imperative)

**Chosen**: Imperative `Navigator.push` / `Navigator.pop` with a global `navigatorKey`  
**Alternatives**: GoRouter, AutoRoute, Beamer  
**Reason**: The app was built incrementally without upfront routing architecture. The global `navigatorKey` in `main.dart` allows navigation from non-widget contexts (services, notifications). However, this decision has grown into a liability — see "Decisions I Would Change."

---

## 12. Localization: flutter_intl

**Chosen**: `flutter_intl` with `.arb` files, generating `lib/generated/l10n.dart`  
**Alternatives**: easy_localization, slang, flutter_gen for strings  
**Reason**: `flutter_intl` is the official Dart/Flutter localization approach (ARB files + `intl` package), with IDE support via the Flutter Intl VS Code extension. It generates type-safe string accessors (`S.of(context).someKey`) and supports pluralization. The project ID is registered with Localizely for collaborative translation. The text direction is currently hardcoded to LTR in `_getTextDirection()` despite the app targeting Arabic — this is a bug (see improvements).

---

## 13. Background Processing: flutter_foreground_task + background_downloader

**Chosen**: `flutter_foreground_task` for audio room continuity, `background_downloader` for asset downloads  
**Alternatives**: WorkManager (android_alarm_manager), isolates  
**Reason**: Keeping a live audio room running while the user switches apps requires an Android foreground service — `flutter_foreground_task` provides this with a persistent notification. For SVGA/gift asset downloads, `background_downloader` handles queuing, progress, and retry across app restarts, which WorkManager doesn't do as reliably for file downloads.

---

## Decisions I Would Change in Hindsight

### 1. Add GoRouter from day one
The current imperative navigation makes deep-linking and push-notification routing fragile. Every screen that needs to be reachable from a notification must be wired manually to the `navigatorKey`. GoRouter's declarative routes + `redirect` hooks would have made auth-gated navigation, deep links from push notifications, and the room overlay far cleaner.

### 2. Fix the hardcoded LTR text direction
`_getTextDirection()` in `main.dart` always returns `TextDirection.ltr` regardless of the locale, even for Arabic. This is almost certainly a bug introduced when switching away from an auto-detect approach. For an Arabic-first app, the default should be `TextDirection.rtl` for `ar` locale.

### 3. Add automated tests before the app grew
With 13+ features and two audio SDKs, retrofitting tests is expensive. Unit tests for all use cases and Cubits should have been the first code written for each feature. A zero-test codebase is a serious technical debt signal to senior reviewers.

### 4. Centralize error handling in a single layer
Error messages are currently handled inconsistently: some are Arabic strings in `ApiService`, some are English strings in Cubits, and some are raw exception messages that leak into the UI. A centralized `AppException` hierarchy with a single `ErrorFormatter` service would have given consistent, localized error UX.

### 5. Use code generation for DI (Injectable)
As the app grew to 20+ services registered in `service_locator.dart`, the file became long and error-prone (missing registrations are runtime errors, not compile errors). `Injectable` with `@injectable` / `@lazySingleton` annotations would make DI failures compile-time errors and eliminate the manual `sl.registerLazySingleton` repetition.
