# Code Books — CV Description

## Project Summary (ATS-Optimized)

**Project Name:** Code Books
**Role:** Flutter Developer (Solo / Full-Stack Mobile)
**Platform:** iOS & Android
**Tech Stack:** Flutter · Dart · flutter_bloc (Cubit) · Dio · Google Books REST API · Hive · GetIt · GoRouter · WebView · Clean Architecture

---

## Bullet Points for CV

- Architected and delivered a cross-platform book-discovery mobile application in Flutter/Dart following Clean Architecture (Data / Domain / Presentation layers), enforcing strict separation of concerns via abstract repository interfaces and use-case classes backed by the `dartz` Either monad for typed error handling.

- Integrated the Google Books REST API using Dio with a configurable base URL (compile-time `--dart-define` injection), implementing a 3-retry exponential-backoff wrapper (`retry<T>`) and exhaustive `DioException` mapping into a domain-level `Failure` hierarchy, achieving robust offline-first resilience.

- Designed a cache-first local persistence layer using Hive with dynamically-named boxes (keyed by sort type × search category), ensuring instant cold-start rendering from cached data while transparently refreshing stale content from the remote API.

- Built a fully reactive state management system with `flutter_bloc` Cubits, modelling 10+ granular states per feature (loading, pagination-loading, success, failure, category-specific variants) and exposing them through `BlocConsumer` widgets for fine-grained UI differentiation.

- Implemented a real-time search screen with 400 ms debounce, server-side subject-filter query composition, client-side page-count and minimum-rating post-filters, infinite-scroll pagination via `ScrollNotification`, and a modal bottom-sheet filter panel with `ChoiceChip`, `RangeSlider`, and `Dropdown`.

- Delivered an in-app book reader using `webview_flutter` with automatic HTTP→HTTPS enforcement, Google Books embed-URL resolution, navigation-delegate error interception, and a recoverable error overlay with retry action, enabling users to read free e-books without leaving the app.
