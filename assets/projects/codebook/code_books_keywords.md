# Code Books — Complete Keywords Reference

---

## Core Flutter / Dart

- Flutter
- Dart
- Flutter SDK 3.8
- Cross-platform mobile development
- Material Design
- CupertinoPage (iOS-style transitions)
- StatefulWidget
- StatelessWidget
- CustomScrollView
- SliverList
- SliverToBoxAdapter
- SafeArea
- MediaQuery
- AnimatedContainer
- Stack
- SingleChildScrollView
- ScrollController
- ScrollNotification
- ModalBottomSheet
- ChoiceChip
- RangeSlider
- DropdownButtonFormField
- CustomScrollView
- dart:developer (logging)
- dart:async (Timer, Zone)
- runZonedGuarded
- PlatformDispatcher
- FlutterError.onError

---

## Architecture

- Clean Architecture
- Domain-Driven Design (DDD)
- Separation of Concerns
- Dependency Inversion Principle
- Repository Pattern
- Data Source Pattern (Remote + Local)
- Abstract Classes / Interfaces
- Use Case Pattern
- Entity / Model separation
- Feature-first module structure
- Core layer
- Presentation / Domain / Data layers
- Layer isolation

---

## State Management

- flutter_bloc
- Cubit
- BlocProvider
- MultiBlocProvider
- BlocConsumer
- BlocBuilder
- BlocObserver
- SimpleBlocObserver
- Sealed classes (state hierarchy)
- Immutable state
- Emit
- State-driven UI
- Pagination states
- Loading / Success / Failure states

---

## Backend / APIs

- Google Books API
- REST API
- HTTP GET
- JSON parsing
- JSON deserialization
- Dio
- BaseOptions (timeouts)
- DioException handling
- DioExceptionType
- Exponential backoff
- Retry logic
- Rate limiting (HTTP 429)
- Query parameter construction
- API base URL injection (--dart-define)
- Compile-time environment variables
- responseType: JSON
- connectTimeout / receiveTimeout / sendTimeout
- Free eBooks filter
- orderBy (relevance / newest)
- startIndex / maxResults (pagination)
- subject filter query composition

---

## Authentication

> Note: This project does not implement user authentication. The following keywords reflect the architecture's readiness for it:

- Abstract repository (ready for auth integration)
- GetIt service locator (ready for auth service registration)
- GoRouter (supports auth-based redirects)
- Hive (ready for secure token storage with flutter_secure_storage swap)

---

## Data / Models

- BookEntity (domain entity)
- BookModel (data model)
- VolumeInfo
- SaleInfo
- AccessInfo
- SearchInfo
- ImageLinks
- IndustryIdentifier
- ReadingModes
- PanelizationSummary
- JSON mapping (fromJson / toJson)
- Null safety
- Default values / null coalescing
- List.from() (safe type casting)
- dartz
- Either<Failure, T>
- Left / Right
- Failure (abstract)
- ServerFailure
- Typed error handling
- Functional programming in Dart

---

## Local Storage

- Hive
- hive_flutter
- hive_generator
- HiveType annotation
- HiveField annotation
- TypeAdapter (code generation)
- Box<T>
- openBox / isBoxOpen
- box.addAll()
- box.clear()
- box.values
- Offline-first
- Cache-first strategy
- Dynamic box naming
- Per-category cache isolation
- Page-aware cache writes
- Cold-start performance
- Persistent local storage
- build_runner

---

## Navigation / Routing

- GoRouter
- GoRoute
- go_router
- Declarative routing
- context.go()
- context.pop()
- GoRouter state.extra (typed object passing)
- CupertinoPage (transition type)
- pageBuilder
- Deep linking ready
- Route constants (AppRouter class)
- Named routes

---

## Dependency Injection

- GetIt
- Service Locator pattern
- Singleton registration
- registerSingleton
- getIt.get<T>()
- Idempotency guard (isRegistered check)
- Dependency graph
- Loose coupling

---

## Performance

- CachedNetworkImage
- Memory cache
- Disk cache
- Shimmer loading indicators
- Sliver-based scrolling
- No redundant rebuilds
- Debounce (400ms Timer)
- Infinite scroll (ScrollNotification)
- Root-level BlocProvider (cubit survives navigation)
- WidgetsBinding.addPostFrameCallback (deferred refresh)
- kDebugMode-gated logging (zero release overhead)

---

## UI / UX

- Dark theme
- Custom typography (GT Sectra Fine)
- Orange accent color (#CF691F)
- Custom app bar
- Category filter tabs (animated)
- Horizontal scroll list
- Book cover thumbnails
- Rating display
- Book details screen
- Search with advanced filters
- Filter bottom sheet
- Sort order toggle
- Page range slider
- Minimum rating slider
- Subject dropdown filter
- Loading shimmer
- Error state with retry button
- Responsive layout (MediaQuery)
- SafeArea
- flutter_svg (SVG icons)

---

## WebView / In-App Browser

- webview_flutter
- WebViewController
- WebViewWidget
- JavaScriptMode.unrestricted
- NavigationDelegate
- onWebResourceError
- onHttpError
- onNavigationRequest
- NavigationDecision.prevent / navigate
- HTTP → HTTPS enforcement
- Google Books embed URL
- URL rewriting
- Transparent background WebView
- Error overlay with retry

---

## Error Handling

- Failure hierarchy (abstract + concrete)
- ServerFailure
- fromDioException factory
- formResponse factory (HTTP status codes)
- dartz Either
- fold() error handling
- Typed exceptions
- Zone error handling (runZonedGuarded)
- FlutterError.onError
- PlatformDispatcher.onError
- Safe JSON parsing (try/catch per item)
- Fallback values

---

## Localization

> Note: The app is English-only. No i18n framework was used. Keywords reflect readiness:

- English UI
- Custom font family
- Text overflow handling (ellipsis)
- RTL-ready architecture (no hardcoded LTR assumptions in layout logic)

---

## Testing

> Note: No tests exist in the current codebase. Relevant keywords for planned additions:

- flutter_test
- bloc_test
- mocktail
- Unit testing
- Widget testing
- Mock repositories
- Test doubles
- BlocTest (emitting state assertions)

---

## DevOps / Build

- flutter_launcher_icons
- Adaptive icon (Android)
- iOS icon
- --dart-define (compile-time config)
- pubspec.yaml version management (1.0.2+3)
- flutter pub get
- build_runner (code generation)
- git version control
- .gitignore
- Flutter analyze / flutter_lints

---

## Domain-Specific

- Book discovery app
- E-book reader
- Google Books
- Free ebooks
- Programming books
- Category browsing
- Book metadata (title, authors, publisher, ISBN)
- Reading modes (text / image)
- Access info (PDF / EPUB availability)
- Web reader link
- Book preview
- Average rating
- Page count
- Book categories (Flutter, Python, JavaScript, Algorithms, PHP)
- Relevance sorting
- Newest sorting
- Trending books
- Search with filters
- Subject filter
- Pagination (startIndex / maxResults)

---

## Recommended LinkedIn Skills

Add these to your LinkedIn profile Skills section:

1. **Flutter** *(top skill — add endorsements)*
2. **Dart**
3. **Mobile Application Development**
4. **Android Development**
5. **iOS Development**
6. **REST APIs**
7. **Clean Architecture**
8. **State Management**
9. **Git**
10. **Software Architecture**
11. **Object-Oriented Programming (OOP)**
12. **Functional Programming**
13. **Agile Development** *(if applicable)*

---

## Keywords for ATS Scanning

Use these in your CV, cover letter, and LinkedIn headline to pass Applicant Tracking Systems:

```
Flutter Developer | Dart | Cross-Platform Mobile | Clean Architecture |
flutter_bloc | Cubit | REST API | Dio | Hive | GetIt | GoRouter |
Offline-First | State Management | JSON | Google APIs | WebView |
dartz | Either | Repository Pattern | Use Case | SOLID Principles |
Mobile UI | Material Design | Performance Optimization | Git |
Dependency Injection | BlocObserver | Cached Images | Pagination |
Error Handling | Unit Testing | Code Generation | pubspec | Dart SDK 3
```

**Pro tip:** Mirror the exact keywords from each job posting in your CV. ATS systems look for exact matches, not synonyms. If a job says "flutter_bloc", use "flutter_bloc", not just "Bloc" or "BLoC".
