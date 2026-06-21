# office_archiving_technical_decisions.md
# Technical Decisions Log — Office Archiving

---

## 1. Framework: Flutter

**Chosen:** Flutter 3.x with Dart ≥ 3.9  
**Alternatives considered:** React Native, Kotlin Multiplatform Mobile (KMM), native Android (Kotlin)

**Why Flutter:**
- Single codebase for Android and iOS with near-native performance
- Rich ecosystem for the required features: PDF, OCR, camera, file handling
- Material Design 3 support out of the box, which was important for building a polished dark-themed UI quickly
- Strong Arabic/RTL support via `flutter_localizations`
- The developer's existing expertise

---

## 2. State Management: flutter_bloc (Cubit)

**Chosen:** flutter_bloc 9.x — Cubit pattern  
**Alternatives considered:** Full BLoC (Events + States), Provider, Riverpod, GetX

**Why Cubit:**
- CRUD-heavy app with simple, linear state transitions — Events layer adds boilerplate with no benefit here
- Cubit is a subset of BLoC using the same `flutter_bloc` package, so migration to full BLoC later is non-breaking
- Better than Provider for complex multi-state scenarios (loading/loaded/error per domain)
- Better than GetX for explicit, testable state (GetX reactive state is harder to unit test)
- Riverpod was a valid alternative, but flutter_bloc was the developer's more familiar tool

**Tradeoff:** Cubit methods (like `addSection()`) cannot be easily debounced or throttled without wrapping in Streams. For search inputs, a simple `Future.delayed` debounce was used instead of a proper transformer.

---

## 3. Local Database: SQLite (sqflite)

**Chosen:** sqflite 2.x  
**Alternatives considered:** Hive, Isar, ObjectBox, Drift (formerly Moor)

**Why sqflite:**
- The data model has relational structure (sections → items with foreign key). Key-value stores like Hive are a poor fit for relational queries.
- SQL gives full `LIKE`-based search across both `name` and `ocrText` columns in a single query — crucial for the full-text search feature.
- Isar and Drift are excellent but add generated code complexity. sqflite with manual SQL was sufficient for the schema size (2 tables).
- Well-established, stable, no code generation required

**Tradeoff:** No type safety for column names — schema is expressed as raw SQL strings and Map-based row parsing. Drift would have provided typed query builders, reducing the risk of column name typos.

---

## 4. OCR: Dual-Engine (Google ML Kit + Tesseract)

**Chosen:** google_mlkit_text_recognition + flutter_tesseract_ocr  
**Alternatives considered:** ML Kit only, Tesseract only, remote OCR API (Google Vision, AWS Textract)

**Why dual-engine:**
- ML Kit has excellent accuracy on Latin scripts but poor performance on Arabic text
- Tesseract with Arabic tessdata (`ara.traineddata`) handles Arabic well but struggles on mixed-language documents
- Using both and selecting the best result produces better accuracy than either alone on the target document types (mixed Arabic/English invoices and forms)

**Why not remote OCR API:**
- Offline-first requirement: documents may contain sensitive personal data and users should not be required to upload them to a remote server
- Cost: commercial OCR APIs (Google Vision, AWS Textract) charge per page

**Tradeoff:** Bundling tessdata assets increases the app size significantly. The DPI and page limits needed to prevent memory crashes add complexity.

---

## 5. PDF Processing: `pdf` + `printing` packages

**Chosen:** pdf ^3.10.8 + printing ^5.13.4  
**Alternatives considered:** syncfusion_flutter_pdf (commercial), pdfium (native binding), remote PDF service

**Why `pdf` + `printing`:**
- Pure-Dart PDF generation with `pdf` is sufficient for the creation use case (PDFs from images)
- `printing`'s `Printing.raster()` provides the page-to-image rasterization needed for editing and OCR
- Both are MIT-licensed, actively maintained, and free
- Syncfusion has a free community license but requires attribution and has size/feature limits

**Tradeoff:** Rasterizing pages for editing (rotate, reorder) and then re-embedding them as images loses the original vector content and increases file size. A true PDF editing library would preserve vectors. This is acknowledged as a known limitation.

---

## 6. Architecture: Flat Service-Oriented (No Clean Architecture Layers)

**Chosen:** Flat structure — `service/`, `services/`, `cubit/`, `pages/`  
**Alternatives considered:** Clean Architecture (domain/data/presentation), MVVM, Feature-first modularization

**Why flat:**
- Solo developer, offline app, no complex business rules that need isolation
- Clean Architecture at this scale would mean 3–4x more files for identical runtime behavior
- The app's "domain logic" is essentially: validate input → call database → emit state. No use-case classes needed.

**Tradeoff:** Cubits are tightly coupled to `DatabaseService`. Unit testing cubits requires a real SQLite database or significant test infrastructure. If the project grows or becomes a team project, refactoring to add a repository layer would be the first priority.

---

## 7. Navigation: Imperative `Navigator.push`

**Chosen:** `Navigator.push(MaterialPageRoute(...))` throughout  
**Alternatives considered:** go_router, auto_route, Navigator 2.0

**Why imperative navigation:**
- Simplest approach for a single-stack app with no deep linking requirements
- No named routes needed since all navigation is triggered by explicit user actions (taps on items)
- go_router would add configuration complexity that wasn't justified at the time

**Tradeoff:** No deep linking support. The `MethodChannel` file-open handler in `main.dart` has to manually call `_navigatorKey.currentState?.push(...)` because there are no named routes to navigate to. Named routes would make this cleaner and testable.

---

## 8. Localization: gen_l10n with ARB Files

**Chosen:** `flutter_localizations` + `intl` + `gen_l10n` code generation  
**Alternatives considered:** `easy_localization`, `flutter_i18n`, hardcoded strings

**Why gen_l10n:**
- Official Flutter approach; supported by the Flutter SDK
- Generates strongly-typed `AppLocalizations` class — compile-time safety for missing translation keys
- ARB format is editable by non-developers (translators) in tools like Arbify or Lokalise
- No additional packages required

---

## 9. Theming: Custom ThemeData Factories with ColorScheme Seed

**Chosen:** 16 custom `ThemeData` instances built with `ColorScheme.fromSeed()`  
**Alternatives considered:** Single theme with dynamic colors, Material You dynamic color (dynamic_color package)

**Why custom themes:**
- Material You dynamic color ties the app's palette to the device wallpaper — not appropriate for a professional document app with a specific brand identity
- 16 handcrafted themes give users meaningful choice (dark professional, light clean, colored accent themes) while maintaining visual consistency
- The custom primary color picker is an additive override on top of the selected theme, covering power users who want fine-grained control

**Tradeoff:** 16 `ThemeData` objects are built at startup and cached. Memory impact is negligible but the `theme_cubit.dart` file is long. A factory pattern generating themes on demand would be cleaner.

---

## 10. File Storage: Structured Directory Tree (DocumentStorageService)

**Chosen:** Custom directory tree under `getApplicationDocumentsDirectory()`  
**Alternatives considered:** Single flat directory, per-section directories, external storage

**Why structured tree:**
- Separating `imports/`, `scans/`, `exports/`, `signatures/`, `tmp/` makes debugging easier (you can inspect the device filesystem and know exactly what each directory contains)
- Exporting to `exports/` keeps user-generated content separate from raw imports
- `tmp/` for PDF editing sessions is cleaned up on session dispose — isolation prevents temp files from leaking into the main archive

**Why app documents directory (not external storage):**
- App documents are private to the app, not visible in system file managers by default — appropriate for a document archiving app where files may be sensitive
- No runtime permission required on iOS; simplified permission handling on Android

---

## 11. Translation: `translator` Package (Google Translate Unofficial API)

**Chosen:** `translator` package with LibreTranslate HTTP fallback  
**Alternatives considered:** Google Cloud Translation API (official), DeepL API, ML Kit Language ID + on-device translation

**Why unofficial Google Translate:**
- Free with no API key required
- Covers Arabic↔English (the primary use case) reliably
- LibreTranslate fallback provides resilience if Google Translate's unofficial endpoint changes

**Tradeoff:** The `translator` package uses Google's unofficial translation endpoint, which can break without notice if Google changes their API. For a production app, the official Google Cloud Translation API (paid but stable) would be more appropriate.

---

## 12. Summarization: HuggingFace BART + Local Extractive Fallback

**Chosen:** HuggingFace Inference API (facebook/bart-large-cnn) with local fallback  
**Alternatives considered:** OpenAI GPT API, on-device ML model, simple extractive algorithm only

**Why HuggingFace:**
- Free inference API (rate-limited) with no mandatory API key
- BART is a strong summarization model for English text
- Optional API key for users who need higher throughput

**Why local fallback:**
- Documents are offline-sensitive; if the user has no internet, summarization should still work
- The local extractive algorithm (sentence scoring by length and position) is fast and good enough for basic document outlines

**Tradeoff:** BART is primarily an English model. Arabic summarization quality is poor. This is a known limitation not currently disclosed to the user.

---

## Decisions I Would Change in Hindsight

### 1. Add a Repository Layer from Day One
**What I did:** Cubits call `DatabaseService` directly.  
**What I'd do instead:** Define `SectionRepository` and `ItemRepository` interfaces. `DatabaseService` implements them. Cubits receive the interfaces via constructor injection.  
**Why it matters:** The current approach makes unit testing impossible without a real SQLite database. This is the single biggest architectural regret.

---

### 2. Use go_router for Navigation
**What I did:** `Navigator.push(MaterialPageRoute(...))` everywhere.  
**What I'd do instead:** Define named routes with `go_router`. This would make the `MethodChannel` file-open handler clean (just `context.go('/pdf-viewer', extra: path)`), enable deep linking, and make navigation testable.

---

### 3. Use sqflite's Version-Based Migration Instead of PRAGMA Checks
**What I did:** Check for each column with `PRAGMA table_info` and `ALTER TABLE` if missing.  
**What I'd do instead:** Use sqflite's `version` parameter and `onUpgrade(db, oldVersion, newVersion)` callback with numbered migration steps. This is more explicit, auditable, and handles more complex migrations (column renames, table restructures).

---

### 4. Write Tests Alongside Features
**What I did:** No tests written.  
**What I'd do instead:** Write cubit unit tests (once repository interfaces exist), widget tests for the main screens, and integration tests for the OCR pipeline. Even 20% coverage is significantly better than 0%.

---

### 5. Persist the HuggingFace API Key
**What I did:** The API key is stored in-memory in `AISummarizationService` and lost on app restart.  
**What I'd do instead:** Store the key in `SharedPreferences` (or more securely in `flutter_secure_storage`) and load it at service initialization.

---

### 6. Add Proper Logging/Crash Reporting
**What I did:** Used `dart:developer log()` throughout, which only outputs to the debug console.  
**What I'd do instead:** Integrate Firebase Crashlytics for production crash reporting and a structured logging solution (like `logger` package) with log levels (debug, info, warning, error) and the ability to filter in production builds.
