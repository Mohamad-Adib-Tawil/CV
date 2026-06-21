# Code Books — Technical Decisions Log

---

## 1. Architecture: Clean Architecture

**Chosen:** Clean Architecture (Data / Domain / Presentation layers) with a cross-cutting `core` module.

**Alternatives considered:**
- MVC / vanilla Flutter with setState
- Feature-first with MVVM
- Simple layered architecture without domain use cases

**Why this choice:**
The project is intended as a portfolio piece demonstrating professional-level architecture awareness. Clean Architecture enforces a clear dependency rule (outer layers depend on inner layers, never the reverse), makes each layer independently testable, and isolates the Google Books API behind an abstract `HomeRepo` interface — meaning the entire data source can be swapped without touching the Cubit or UI code. For a project at this scale, it adds some upfront boilerplate but pays off in maintainability and interview-readiness.

---

## 2. State Management: flutter_bloc (Cubit)

**Chosen:** `flutter_bloc` v9 using Cubit (not full Bloc).

**Alternatives considered:**
- Provider / ChangeNotifier
- Riverpod
- GetX
- Full Bloc with Events

**Why this choice:**
`flutter_bloc` is the industry-standard Flutter state management solution with the widest adoption in production codebases. Cubit was chosen over full Bloc because the state transitions in this app are simple: there are no complex event-to-state mappings, event transformers, or cases where two events produce the same state update. Cubit eliminates the Event boilerplate while retaining `BlocObserver` support (used for `SimpleBlocObserver` debug logging), testability with `bloc_test`, and the `BlocConsumer` / `BlocBuilder` widget API. Riverpod would also have been a valid choice, but flutter_bloc's explicit state classes (`sealed class`) communicate intent more clearly in a portfolio context.

---

## 3. Dependency Injection: GetIt

**Chosen:** `get_it` service locator.

**Alternatives considered:**
- Injectable (GetIt with code generation)
- Riverpod (doubles as DI)
- Manual constructor injection passed down the widget tree

**Why this choice:**
GetIt provides a minimal, fast service locator with zero code generation for the current scope (two singletons: `ApiServices` and `HomeRepoImpl`). It avoids the complexity of `injectable`'s annotation scanning for a project this size. The `setupServiceLocator()` function includes an idempotency guard (`getIt.isRegistered`) that prevents duplicate registration on hot restart. A production codebase with many more services would benefit from `injectable` for automatic wiring; at this scale, explicit registration is clearer.

---

## 4. Navigation: GoRouter

**Chosen:** `go_router` v14.

**Alternatives considered:**
- `Navigator 2.0` (manual `RouterDelegate`)
- `auto_route`
- `flutter_modular`

**Why this choice:**
GoRouter is Flutter's officially recommended navigation solution, maintained by the Flutter team. It provides declarative route definitions, type-safe `extra` object passing (used for `BookEntity` navigation to the details screen), deep-link support, and `CupertinoPage` transitions out of the box. `auto_route` offers stronger code-generation-based type safety for route parameters, which would be valuable if the app had many routes with complex typed params. GoRouter was sufficient here and required no code generation.

---

## 5. Local Storage: Hive

**Chosen:** `hive` + `hive_flutter` + `hive_generator`.

**Alternatives considered:**
- SharedPreferences (too limited for structured data)
- SQLite via `sqflite` or `drift`
- `isar`
- `flutter_secure_storage`

**Why this choice:**
Hive is a pure-Dart, NoSQL key-value store that is significantly faster than SQLite for simple object storage and requires no native code for core functionality. `BookEntity` maps naturally to a Hive object with typed `@HiveField` annotations. The dynamic box-naming strategy (`boxNameFor`) gives independent cache namespaces per category/sort combination with no schema migrations. SQLite/drift would be justified if the app needed complex relational queries (e.g., cross-category search in the local database), but simple list retrieval by page index doesn't benefit from SQL.

---

## 6. HTTP Client: Dio

**Chosen:** `dio` v5.

**Alternatives considered:**
- `http` package (also present in pubspec)
- `chopper`
- `retrofit` (Dio + code generation)

**Why this choice:**
Dio provides a richer feature set than the base `http` package: request/response interceptors (useful for future auth token injection), granular timeout configuration (separate connect, send, and receive timeouts), typed response via `ResponseType.json`, and exhaustive `DioExceptionType` enum for precise error mapping. The `http` package is also listed in `pubspec.yaml` but appears unused in the current codebase — likely a residual dependency. `retrofit` would add type-safe API interface generation but introduces code-generation complexity not justified for three endpoints.

---

## 7. Error Handling: dartz Either

**Chosen:** `dartz` `Either<Failure, T>` for repository return types.

**Alternatives considered:**
- Raw try/catch propagation
- Custom `Result<T>` class
- `fpdart` (modern functional Dart alternative to dartz)

**Why this choice:**
`Either` makes the error contract explicit in function signatures — the compiler forces callers to handle both paths. `dartz` is the established functional programming library for Dart and is widely used alongside `flutter_bloc` in Clean Architecture setups. `fpdart` is a more modern alternative with better Dart 3 compatibility, but `dartz` was the stable, battle-tested choice at the time of this project's setup. A custom `Result<T>` class would work but requires writing the `.fold()` / map operations from scratch.

---

## 8. Image Loading: cached_network_image

**Chosen:** `cached_network_image` v3.

**Alternatives considered:**
- `Image.network` (no caching)
- `flutter_cache_manager` directly
- `fast_cached_network_image`

**Why this choice:**
Google Books thumbnail URLs are stable across app sessions, so caching them avoids repeated bandwidth usage and eliminates the thumbnail flash on revisit. `cached_network_image` provides both memory and disk caching, a `placeholder` builder for shimmer effects, and an `errorWidget` for broken images — all needed here. It wraps `flutter_cache_manager` under the hood, providing a simpler API.

---

## 9. In-App Reader: webview_flutter (WebView)

**Chosen:** `webview_flutter` (Google Books embed URL).

**Alternatives considered:**
- `flutter_pdfview` or `syncfusion_flutter_pdf` for native PDF rendering
- Launch URL in external browser (`url_launcher`)
- Download PDF and render natively

**Why this choice:**
Google Books provides a free, fully functional embedded reader at `books.google.com/books?id=<id>&output=embed`. Using WebView means no PDF download is required (many books are "preview" only, not full downloads), HTTPS enforcement is trivial in the `NavigationDelegate`, and the reader UI is maintained by Google. A native PDF renderer would only work for books with a downloadable `acsTokenLink`, which is not always available. Launching in an external browser would break the in-app experience. The tradeoff is that the WebView reader is subject to Google's preview limitations — some books show only a few pages.

---

## 10. Logging: Custom AppLogger

**Chosen:** Custom `AppLogger` wrapping `dart:developer`.

**Alternatives considered:**
- `logger` package
- `talker`
- `print()` statements

**Why this choice:**
`dart:developer.log()` integrates directly with the Flutter DevTools logging view, supports named channels, and accepts `error` and `stackTrace` parameters. Wrapping it in `AppLogger` with a `kDebugMode` guard ensures all log calls are no-ops in release builds without any compile-time stripping magic. For a production app requiring remote log collection (Crashlytics, Sentry, Datadog), `AppLogger` acts as the single injection point — just add the remote SDK call inside the `error()` method.

---

## Decisions I Would Change in Hindsight

| Decision | Problem | Better Approach |
|---|---|---|
| `BookEntity` has Hive annotations | Pollutes the domain layer with a storage concern | Create a separate `BookEntityHiveAdapter` in the data layer; keep `BookEntity` annotation-free |
| No cache TTL | Cached data never expires — users could see stale results indefinitely | Store a timestamp alongside each box write; in `HomeLocalDataSourceImpl`, return empty if `DateTime.now().difference(lastCached) > TTL` |
| `http` package listed but unused | Dead dependency adding to build size and confusion | Remove from `pubspec.yaml` |
| `BookModel` extends `BookEntity` | Inheritance couples data and domain layers; changes to `BookModel` fields risk breaking `BookEntity`'s contract | Use composition: `BookModel` contains `BookEntity` and provides a `toEntity()` method |
| No unit tests | Architecture is testable but untested | Add `bloc_test` tests for each Cubit, `mocktail` mocks for data sources, and widget tests for key screens |
| `test.dart` widget file in production | `lib/home/presentation/views/widgets/test.dart` appears to be a scratch file | Delete or move to `test/` directory before sharing the repository |
| `sord` parameter naming | Unclear abbreviation — is it "sort" + "order"? | Rename to `sortOrder` or introduce a `SortMode` enum |
| Inline state logic in `SearchView` | `_results`, `_nextPage`, `_isLoading` are managed with `setState` inside a screen that already uses BlocConsumer | Extract into a `SearchCubit` for consistency and testability |
