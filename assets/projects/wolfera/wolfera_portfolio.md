# Wolfera — Portfolio Case Study

## Overview

**Wolfera** is a production-grade mobile marketplace application built with Flutter that connects car buyers, sellers, and renters in a single platform. The app targets Arabic-speaking markets and supports both Arabic and English with full RTL layout. Users can browse car listings, contact sellers via real-time chat, save favorites, and list their own vehicles for sale or rent — all within a unified mobile experience.

The platform includes an admin approval layer to ensure listing quality, on-device AI image moderation to prevent inappropriate content, and a smart notification system that alerts users when a favorited car drops in price.

---

## My Role

I was the sole Flutter developer responsible for the full mobile implementation: architecture decisions, Supabase integration, Firebase setup, state management design, UI implementation, and all feature development from authentication to admin tooling.

---

## Main Features

- **Dual-language marketplace** — full Arabic/English support with locale-aware RTL layouts
- **Car listing wizard** — multi-step guided flow: select make/model/year → enter specs and features → upload images → set price and description
- **Advanced search & filtering** — 15+ filter dimensions with a dedicated filter page and active filter badge counter
- **Real-time chat** — buyer-to-seller messaging via Supabase Realtime channels with conversation reactivation logic and emoji picker
- **Favorites** — locally persisted per user ID via SharedPreferences; price-change push notifications for favorited cars
- **Admin approval workflow** — admins review pending car submissions, approve or reject with written reasons; sellers receive FCM push notifications on outcome
- **Car rental** — separate listing type with six rental pricing tiers (per day / week / month / 3-months / 6-months / year)
- **Multi-auth SSO** — email/password, Google Sign-In, Apple Sign-In with SHA-256 nonce flow for Supabase
- **On-device NSFW moderation** — TFLite model screens car photos before upload; fail-open design to never block the user on model errors
- **Push notifications** — FCM + local notifications for chat messages, car approval/rejection events, and price changes
- **Car stores section** — dedicated section for dealership and store listings
- **Featured cars** — admin-toggleable featured flag surfaced in a dedicated home section

---

## Technical Implementation

### Architecture

Feature-based Clean Architecture. Each feature module contains three layers:

- **Data** — data sources, Freezed models with JSON serialization, repository implementations  
- **Domain** — use cases, abstract repository interfaces  
- **Presentation** — BLoC or Cubit, pages, widgets  

Shared infrastructure lives in `lib/core/` (DI, routing, network client, storage abstraction, base UseCase) and `lib/services/` (Supabase, Firebase, chat, notifications, NSFW moderation, storage).

```
lib/
├── core/            # DI, routing, network, storage, utils
├── features/        # 10 feature modules
│   ├── auth/        # BLoC
│   ├── cars/        # car details
│   ├── home/        # Cubit
│   ├── my_car/      # BLoC (listing wizard)
│   ├── chat/        # realtime messaging
│   ├── faviorate/   # Cubit
│   ├── notifications/
│   ├── profile/     # BLoC
│   ├── car_stores/
│   └── search_and_filteration/
└── services/        # app-wide singletons
```

### State Management

`flutter_bloc` throughout. Complex event-driven features (Auth, MyCars, Profile) use full **BLoC** with distinct Event and State classes. Lighter stateful features (HomeCubit, FavoriteCubit, CountryCubit) use **Cubit**. `bloc_concurrency` controls event transformer behaviour.

| Feature | Pattern | Reason |
|---|---|---|
| Authentication | BLoC | Multi-state login/register/verify/reset flow |
| My Cars wizard | BLoC | Multi-step form with per-step validation states |
| Profile | BLoC | Edit → loading → success/error cycle |
| Home feed | Cubit | Simple load + filter toggle |
| Favorites | Cubit | Toggle/load without complex branching |

### Data Flow

```
UI Event → BLoC/Cubit → Use Case → Data Source → Supabase SDK → Freezed Model → State → UI rebuild
```

### API & Backend Integration

**Supabase** is the primary backend:
- **Database** — direct table queries on `cars`, `users`, `conversations`, `messages`, `favorites`, `notifications` with Postgres Row-Level Security for user isolation and admin-only actions
- **Auth** — Supabase Auth with JWT sessions; social login via `signInWithIdToken`
- **Storage** — Supabase Buckets for car image upload and deletion
- **Realtime** — Supabase channels for live message streaming in chat

A Dio-based REST client is also configured pointing to `api.wolfera.com` for legacy auth endpoints.

### Local Storage

`SharedPreferences` abstracted behind a `PrefsRepository` interface. Used for: favorites persistence (keyed by user ID), preferred language, and onboarding completion state.

### Authentication

All flows go through Supabase Auth:
- **Email/password** — standard sign-up with OTP verification and password reset
- **Google Sign-In** — `google_sign_in ^7.x` with platform-specific client ID; `idToken` passed to Supabase `signInWithIdToken`
- **Apple Sign-In** — raw/SHA-256 nonce pair generated via `crypto` package; `idToken` + raw nonce passed to Supabase; display name upserted on first login
- On first social login, a `users` row is upserted with profile metadata from the provider

### Reusable Components

- `AppEmptyState` — configurable empty state per context (favorites, cars, notifications)
- `AppLoader` — custom SpinKit loader variants
- `CustomFilterCard` — canvas-painted card with custom clipper for filter UI
- `DelayedFadeSlide` — reusable entrance animation wrapper
- `SearchMixin`, `FormStateMixin`, `Debouncer` — shared logic mixins across features
- `MoneyFormatter`, `CarValueTranslator` — utility classes for localized number and enum display

### Error Handling

- Network exceptions typed in `core/api/exceptions.dart`
- All Supabase and SSO errors are mapped to localization keys for consistent user-facing messages
- Crashlytics uses a `_isRecoverableRuntimeError` filter to suppress `AuthRetryableFetchException`, `SocketException`, and DNS failures — keeping crash reports meaningful in production

### Performance Considerations

- `cached_network_image` for all remote images with shimmer placeholders during load
- `infinite_scroll_pagination` for car feed lists
- `flutter_image_compress` applied before upload to reduce Supabase storage costs
- `Debouncer` utility on search inputs to rate-limit Supabase queries
- App orientation locked to portrait to avoid unnecessary layout rebuilds
- Lazy singleton registration via GetIt for heavy services (ChatService, FavoriteCubit)

---

## Challenges & Solutions

### 1. Apple Sign-In nonce flow with Supabase
Apple requires a SHA-256 hashed nonce sent to Apple and the raw nonce sent to Supabase — a subtle requirement many developers get wrong. Implemented a dedicated `AppleAuthService` that generates a cryptographically random nonce, hashes it with the `crypto` package, and passes both values correctly, with a fallback `_ensureUserRow` upsert to handle first-login profile metadata.

### 2. Price-change notifications for favorited cars
When a seller edits a car, the `updateCar` method fetches the current price values from Supabase, diffs them against the incoming update payload across all six pricing fields (sale + 5 rental tiers), and if any changed, calls `NotificationService.sendPriceChangeNotification`. That service queries the `favorites` table to find all users who saved that car and sends targeted FCM notifications to each.

### 3. On-device NSFW image moderation
Integrated a TFLite model for image screening with a **fail-open design** — if the model fails to load or inference fails, the image is permitted rather than blocking the user. The interpreter's input tensor shape is inspected at runtime to auto-detect the expected image dimensions, making the service resilient to model updates.

### 4. Admin RBAC without a dedicated backend API
Admin authorization checks query `users.is_admin` / `users.is_super_admin` directly via Supabase. The Postgres RLS policies enforce server-side security, so the mobile client checks these flags only for UI rendering. This avoids needing a separate admin API while maintaining security guarantees at the database layer.

---

## Technologies Used

| Category | Technology |
|---|---|
| Framework | Flutter 3.x, Dart ≥3.3.4 |
| State Management | flutter_bloc 8.x (BLoC + Cubit) |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Push Notifications | Firebase Cloud Messaging + flutter_local_notifications |
| Crash Reporting | Firebase Crashlytics |
| Authentication | Supabase Auth, Google Sign-In v7, Sign in with Apple |
| Dependency Injection | GetIt + Injectable (code-generated) |
| Navigation | GoRouter |
| Models | Freezed + json_serializable |
| HTTP Client | Dio 5.x |
| Local Storage | SharedPreferences |
| Image | flutter_image_compress, cached_network_image, photo_view |
| Localization | easy_localization (AR/EN) |
| Forms | reactive_forms |
| On-device AI | tflite_flutter (NSFW moderation model) |
| QR Scanner | mobile_scanner |
| Animations | animate_do, Lottie |
| Responsive UI | flutter_screenutil, flutter_svg, shimmer, google_fonts |

---

## Results / Impact

- End-to-end marketplace shipped on iOS and Android
- Full bilingual Arabic/English support with locale-aware RTL layout
- Admin workflow enables content moderation without a separate web admin panel
- On-device NSFW screening reduces harmful content upload with zero server cost
- Realtime chat eliminates the need for a third-party messaging SDK
- Automated price-change alerts increase user retention and re-engagement
