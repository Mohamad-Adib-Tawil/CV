# Code Books — Portfolio Case Study

---

## Overview

Code Books is a cross-platform Flutter application that allows users to discover, browse, search, and read free programming e-books sourced from the Google Books API. The app features a dark, premium UI with a custom typeface (GT Sectra Fine), an orange accent palette, paginated category browsing, real-time search with advanced filters, and an embedded WebView reader — all backed by an offline-first Hive cache so content loads instantly even without a network connection.

**Platform:** iOS & Android
**Version:** 1.0.2+3
**State:** Production-ready

---

## My Role

Solo developer responsible for the entire product lifecycle: architecture design, API integration, state management, UI implementation, offline caching strategy, error handling, logging infrastructure, and app-icon/launcher configuration.

---

## Main Features

| Feature | Description |
|---|---|
| Home Feed | Two independent book lists — "Popular" (relevance-sorted) and "Other Books" (newest-sorted) — both paginated and cached |
| Category Filter | Horizontal tab row (All / Flutter / Algorithms / JavaScript / Python / PHP) that fetches category-specific results and caches them independently |
| Trending Toggle | Popular list can switch between Popular, Trending, and Newest modes via cubit methods |
| Search | Real-time debounced search with subject filter, sort order, page-count range slider, minimum-rating slider, and infinite scroll pagination |
| Book Details | Full detail screen showing cover, title, authors, publisher, description, rating, language, and access flags |
| In-App Reader | WebView-based embedded Google Books reader with HTTPS enforcement, embed-URL rewriting, and a recoverable error overlay |
| Offline Caching | Hive-backed, per-category-per-sort-type boxes; cache-first strategy with transparent remote refresh |
| Centralized Logging | `AppLogger` wrapping `dart:developer` — debug-only, named logs at info and error severity with stack traces |
| Error Recovery | Typed `Failure` hierarchy, 3-retry exponential backoff on network calls, pagination-specific error states |

---

## Technical Implementation

### Architecture

The project follows **Clean Architecture** with three well-defined layers:

```
lib/
├── core/                         # Cross-cutting: errors, use-case base, DI, router, logger, styles
│   ├── errors/                   # Failure (abstract) + ServerFailure + retry utility
│   ├── use_cases/                # UseCase<Result, Param> generic abstract class
│   └── utils/                    # ApiServices, AppRouter (GoRouter), AppLogger, SetupServiceLocator
│
└── home/                         # Feature module
    ├── data/
    │   ├── data_sources/         # HomeRemoteDataSourceImpl + HomeLocalDataSourceImpl
    │   ├── models/               # BookModel (extends BookEntity) + sub-models
    │   └── repos_data/           # HomeRepoImpl
    ├── domain/
    │   ├── entities/             # BookEntity (Hive-annotated, 41 typed fields)
    │   ├── repos_domain/         # HomeRepo (abstract)
    │   └── use_cases/            # FetchPopularBooksUseCase, FetchNewestBooksUseCase, FetchBooksInUseCase
    └── presentation/
        ├── manger/               # PopularBooksCubit, FetchNewestBooksCubit, FetchBooksInCubit
        └── views/                # HomeView, BookDetailsView, SearchView + 30+ widget files

features/
└── pdf/presentation/view/        # PDFViewerScreen (WebView reader)
```

The `HomeRepo` abstract class in the domain layer is the boundary between domain and data — cubits never import data-layer classes directly.

### State Management

Three cubits manage independent concerns:

- **`PopularBooksCubit`** — owns the home hero list; exposes 8 states including `PopularBooksTrend` and `PopularBooksNewest` for tab toggling.
- **`FetchNewestBooksCubit`** — drives the "Other Books" category grid and powers the Search screen; exposes per-category states (`FlutterBooks`, `AlgorithmsBooks`, `JavaScriptBooks`, `PythonBooks`, `PhpBooks`) as well as pagination variants.
- **`FetchBooksInCubit`** — secondary list cubit for a third browsing mode.

Both root-level cubits are provided at `MaterialApp.router` level via `MultiBlocProvider` so they survive navigation and are triggered immediately on app start via `..fetchPopularBooks()` cascade.

### Data Flow

```
UI trigger
  → Cubit.fetchX(pageNumber, searchName, sord)
    → UseCase.call(params)
      → HomeRepoImpl.fetchX()
        → HomeLocalDataSourceImpl._fetchBooksPage()  ← Hive box read
        if empty →
        → HomeRemoteDataSourceImpl.fetchX()          ← Dio GET /volumes?...
          → ApiServices.get(endPoint)
            → retry(() => _dio.get(...), retries=3, exponential backoff)
          → getBooksList(data)                        ← JSON → BookEntity list
          → saveBooksPageAsync(books, boxName, page)  ← Hive persist
      → Either<Failure, List<BookEntity>>
    → Cubit emits success/failure state
  → BlocConsumer rebuilds UI
```

### API Integration

`ApiServices` wraps Dio with:
- Compile-time base URL injection (`--dart-define=GOOGLE_BOOKS_BASE_URL=...`; defaults to `https://www.googleapis.com/books/v1/`)
- Timeouts: 10 s connect/send, 15 s receive
- Typed response (`ResponseType.json`)
- Automatic retry with exponential backoff (`delay *= 2`)
- Full `DioExceptionType` switch → `ServerFailure` with human-readable messages covering 400/401/403/404/429/500 HTTP codes

Query construction in `HomeRemoteDataSourceImpl` differentiates sort modes:
- `popular` → `orderBy=relevance`, base query
- `new`/`newest` → `orderBy=newest`, base query + empty-results fallback without `filter=free-ebooks`
- `trend`/`relevance` → `orderBy=relevance`, query augmented with `+subject:technology+subject:computers`

### Local Storage

Hive boxes are named dynamically using `boxNameFor(listType, category)`:

```dart
// examples:
boxNameFor('popular', 'programming') → 'books_popular_programming'
boxNameFor('new', 'flutter')         → 'books_new_flutter'
```

This means every combination of sort × category gets its own isolated box, enabling independent cache invalidation. On page 0, `saveBooksPageAsync` calls `box.clear()` before writing, preventing stale data accumulation.

`BookEntity` is annotated with `@HiveType(typeId: 0)` and 41 `@HiveField` annotations, with the adapter generated via `hive_generator`.

### Reusable Components

- `UseCase<Result, Param>` — generic base class for all use cases; enforces `Either<Failure, Result>` return type
- `AppLogger` — centralized, debug-only logging with named channels
- `retry<T>` — generic async retry with configurable count and exponential backoff delay
- `getBooksList()` — safe JSON→entity mapping that silently skips malformed entries
- `saveBooksPageAsync()` — page-aware Hive write that clears on page 0
- `buildErrorSnackBar` — reusable snack-bar widget for error display
- `CustomFadingWidget` — shared loading shimmer

### Error Handling

- Domain errors travel as `Either<Failure, T>` via `dartz`; the UI never sees raw exceptions
- `ServerFailure.fromDioException()` handles all 7 `DioExceptionType` variants
- `ServerFailure.formResponse()` maps HTTP status codes to messages
- Cubits emit distinct `PaginationFailure` vs. first-load `Failure` states so the UI can show a non-destructive inline error during pagination vs. a full-screen error on initial load
- `PDFViewerScreen` uses `NavigationDelegate.onWebResourceError` and `onHttpError` for recoverable reader errors

### Performance

- **Cache-first** reads avoid unnecessary network calls on revisit
- `CustomScrollView` with `SliverList` / `SliverToBoxAdapter` reduces widget rebuilds on the home screen
- `CachedNetworkImage` for book thumbnails — memory + disk caching with progressive loading
- `AnimatedContainer` with `Curves.easeInOut` on category tabs — smooth 400 ms transitions
- Cubits instantiated at app root and reused; no redundant fetches on navigation
- Search debounced at 400 ms to reduce API calls during typing

---

## Challenges & Solutions

| Challenge | Solution |
|---|---|
| Google Books API returns inconsistent or missing fields | `BookEntity.fromJson()` uses null-coalescing for every field and normalises authors/categories as empty lists instead of null |
| Newest books endpoint sometimes returns empty with `filter=free-ebooks` | `fetchNewestBooks` retries the request without the filter when the list is empty |
| Cache boxes multiply across categories | Deterministic `boxNameFor()` naming + async open-if-not-already-open pattern; boxes survive app sessions via Hive's persistent storage |
| WebView loads HTTP URLs that fail on modern platforms | `_toHttps()` inspects the scheme before navigation and rewrites to HTTPS; `onNavigationRequest` enforces this on every redirect |
| Search triggers API call on every keystroke | 400 ms `Timer` debounce cancels previous pending calls; `_search()` also clears results and resets pagination on reset |
| Multiple Hive box opens across hot restarts | `setupServiceLocator()` guard checks `getIt.isRegistered<ApiServices>()` before re-registering; `main()` checks `Hive.isAdapterRegistered(0)` before re-registering the adapter |

---

## Technologies Used

| Category | Technology | Version |
|---|---|---|
| Framework | Flutter | SDK ^3.8.1 |
| Language | Dart | SDK ^3.8.1 |
| State Management | flutter_bloc (Cubit) | ^9.0.0 |
| HTTP Client | Dio | ^5.7.0 |
| Functional Programming | dartz | ^0.10.1 |
| Dependency Injection | GetIt | ^7.7.0 |
| Navigation | GoRouter | ^14.2.7 |
| Local Storage | Hive + hive_flutter | ^2.2.3 / ^1.1.0 |
| Image Caching | cached_network_image | ^3.4.1 |
| SVG Rendering | flutter_svg | ^2.0.10+1 |
| WebView | webview_flutter | ^4.11.0 |
| HTTP (secondary) | http | ^1.2.2 |
| Code Generation | hive_generator + build_runner | ^2.0.1 / ^2.4.13 |
| Icons | flutter_launcher_icons | ^0.13.1 |

---

## Results / Impact

- Fully functional offline-first book discovery app deployable to iOS and Android from a single Dart codebase
- Zero hardcoded API keys — base URL injected at build time via `--dart-define`, enabling environment-specific builds
- Comprehensive error resilience: every network call is retried up to 3 times with exponential backoff before surfacing a typed failure to the UI
- Cache layer eliminates API round-trips for already-fetched categories, significantly reducing data usage on repeat visits
- Clean Architecture structure makes it straightforward to swap the Google Books backend with any other book API by changing only the data-layer implementation
