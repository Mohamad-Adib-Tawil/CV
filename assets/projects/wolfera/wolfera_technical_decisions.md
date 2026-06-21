# Wolfera — Technical Decisions Log

This document explains the "why" behind each major technical choice in the project.
Useful for interviews, onboarding new team members, and portfolio discussions.

---

## 1. Why Flutter?

- Single codebase for iOS and Android — critical for a small team or solo developer
- High performance via Skia/Impeller rendering — smooth 60fps car image carousels and animations
- Strong ecosystem for marketplace apps (image picking, notifications, maps, payments)
- Dart's null safety reduces entire categories of runtime crashes

---

## 2. Why Supabase over Firebase Firestore?

| Criteria | Supabase | Firebase Firestore |
|---|---|---|
| Database model | PostgreSQL (relational) | Document (NoSQL) |
| Complex queries | Native SQL JOINs | Requires denormalization |
| Row-level security | Built-in Postgres RLS | Security Rules (less flexible) |
| Realtime | Postgres CDC via WebSocket | Firestore real-time listeners |
| Auth | Built-in, supports SSO | Firebase Auth |
| Pricing model | Predictable (row-based) | Can be unpredictable (read-heavy) |

**Decision:** A car marketplace has highly relational data — cars have owners, conversations have buyers/sellers/cars, notifications reference multiple entities. PostgreSQL's JOINs and RLS made it the natural choice. A single Supabase query can fetch a conversation with its buyer, seller, and linked car in one round trip; Firestore would require multiple fetches or heavy data duplication.

---

## 3. Why BLoC over Riverpod or Provider?

- Team/ecosystem familiarity with the BLoC pattern
- Explicit event/state separation makes complex flows (auth, multi-step wizard) easy to reason about and test
- `flutter_bloc` 8.x has excellent DevTools integration for state inspection
- The `bloc_concurrency` package gives fine-grained control over event processing (e.g., `droppable()` for search, `sequential()` for form submission)
- Cubit is used where full BLoC is overkill — best of both worlds within the same library

---

## 4. Why GoRouter over Navigator 2.0 directly?

- GoRouter provides declarative routing with URL-based navigation out of the box
- Built-in redirect logic for auth guards (unauthenticated users redirected to login)
- Named routes prevent magic strings scattered across the codebase
- Nested navigation (shell routes) handles the bottom navigation bar with independent stacks
- Official Flutter team recommendation at the time of development

---

## 5. Why GetIt + Injectable over Riverpod for DI?

- GetIt is framework-agnostic — services registered in GetIt work outside of the widget tree (useful for `NotificationService` which needs to navigate on tap without a BuildContext)
- Injectable's code generation (`@lazySingleton`, `@injectable`) means zero manual registration boilerplate
- ChatService, SupabaseService, and NotificationService all need to be accessed from non-widget contexts — GetIt handles this cleanly

---

## 6. Why Freezed for models?

- Immutable data classes with `copyWith`, `==` equality, and `hashCode` generated automatically
- Eliminates an entire category of bugs caused by mutable shared state
- Works seamlessly with `json_serializable` for Supabase response deserialization
- Union types (sealed classes) allow modeling loading/success/error states cleanly in BLoC

---

## 7. Why Easy Localization over Flutter's built-in intl?

- JSON translation files are simpler to edit than ARB files — non-developers can contribute translations
- Runtime locale switching without app restart
- Generated locale keys (`LocaleKeys.xxx`) provide compile-time safety — no typos in translation key strings
- Built-in RTL support with locale-aware layout direction

---

## 8. Why TFLite for NSFW moderation (on-device) instead of a cloud API?

- **Cost:** Cloud moderation APIs (Google Vision SafeSearch, AWS Rekognition) charge per image. On-device is free after the model is bundled.
- **Privacy:** User photos never leave the device during the screening step — only approved images are uploaded.
- **Latency:** On-device inference is instant; a cloud API round trip adds 200ms–2s depending on network.
- **Fail-open design:** If the model fails to load (device too old, model corrupt), the app allows the upload rather than blocking the user. The admin approval workflow provides a second layer of moderation.

---

## 9. Why SharedPreferences for favorites instead of a remote table?

- **Offline-first UX:** Favorites are available immediately, even without network connectivity
- **Speed:** No network latency on toggle — instant UI feedback
- **Simplicity:** The primary use case (saving cars to view later) doesn't require cross-device sync
- **Trade-off accepted:** Favorites are lost if the user clears app data or reinstalls. This is acceptable for the current product stage. A future improvement would sync to a `user_favorites` Supabase table on network availability.

---

## 10. Why firebase_messaging for push notifications instead of Supabase Edge Functions + APNs directly?

- Firebase Cloud Messaging abstracts the platform differences between APNs (iOS) and FCM (Android) — one API for both
- `firebase_messaging` Flutter plugin handles foreground/background/terminated app states with a consistent API
- Firebase's infrastructure handles delivery, retry logic, and device token management
- Supabase doesn't have a native push delivery system; FCM is the standard complement

---

## 11. Why reactive_forms over Flutter's built-in Form widget?

- `reactive_forms` provides a model-driven approach — form state lives in a `FormGroup` object, not in widget state
- Built-in validators are composable and testable as pure functions
- Multi-step wizard forms (5 pages in the car listing flow) can share a single `FormGroup` passed through the widget tree without `GlobalKey<FormState>` boilerplate
- Async validators (e.g., checking if a car model exists) are first-class citizens

---

## 12. Why infinite_scroll_pagination over custom scroll controller logic?

- Handles all edge cases out of the box: first page loading, subsequent page loading, empty state, error state, retry
- The `PagingController` separates pagination logic from UI completely
- Built-in support for Supabase's offset-based pagination (`.range(start, end)`)
- Significantly less code than a custom implementation with comparable reliability

---

## 13. Decisions I Would Change in Hindsight

| Decision | What I'd do differently |
|---|---|
| No tests | Add BLoC unit tests from day one — they're fast to write and catch regressions |
| `print()` in production code | Use the `logger` package (already in pubspec) from the start |
| Duplicate `core/network/` and `core/api/` | Pick one directory structure and enforce it |
| Debug pages in `lib/` root | Always put test/debug pages in `test/` or behind a `kDebugMode` flag |
| Favorites local-only | Design for eventual sync from the beginning — the local-first layer is still valuable but sync should be planned |
