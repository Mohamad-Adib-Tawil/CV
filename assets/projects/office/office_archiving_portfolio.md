# office_archiving_portfolio.md
# Portfolio Case Study — Office Archiving

---

## Overview

**Office Archiving** is an offline-first mobile document management application built with Flutter for Android and iOS. It addresses a practical problem faced by professionals, small businesses, and individuals: managing a growing collection of physical and digital documents — scanned receipts, contracts, identity papers, business cards — in a structured, searchable, and private way.

The core proposition is that everything happens on-device. No account creation, no cloud upload, no subscription. Users organize documents into labeled sections (folders), import files from the camera, gallery, or file system, and get searchable text extracted automatically via OCR. On top of archiving, the app provides a suite of PDF processing tools and AI-assisted features (translation, summarization) that were historically reserved for desktop software.

The app targets Arabic-speaking users as a primary audience, making Arabic OCR accuracy, RTL layout correctness, and bilingual UI a first-class concern rather than an afterthought.

---

## My Role

Solo Flutter developer. I was responsible for every layer of the application:

- Architecture design and state management decisions
- SQLite database schema design and migration strategy
- OCR pipeline engineering (dual engine, preprocessing, scoring)
- PDF tooling implementation (creation, editing, security)
- AI service integration with offline fallbacks
- Native Android MethodChannel for file-open intent
- Full bilingual localization (Arabic + English) using gen_l10n
- 16-theme engine with custom color picker
- UI/UX implementation across all 15+ screens
- Performance profiling and memory-safe PDF processing

---

## Main Features

### Document Organization
- Create named sections (folders) with optional custom cover images
- Per-section item counts and visual cover auto-populated from the latest image in that section
- Sections support rename and delete (cascading delete cleans up all child items and their physical files)

### Multi-Source Document Import
- **Camera capture** — live camera with permission handling
- **Gallery picker** — image picker integration
- **File picker** — supports PDF and image files from the device file system
- **Hardware document scanner** — integration with `flutter_doc_scanner` for edge-detected, perspective-corrected scans

### OCR and Full-Text Search
- Automatic text extraction from images and PDFs on import
- Dual-backend OCR: Google ML Kit (Latin/mixed scripts) and Tesseract (Arabic and multilingual via bundled tessdata assets)
- Language modes: auto-detect, Arabic-only, English-only, mixed
- OCR text stored in SQLite alongside the item; searched alongside file names
- Batch OCR processing for items missing OCR text, with progress callback

### PDF Tools
- Create PDFs from a list of images
- Per-page editing session: rasterize pages to images, apply rotate/delete/reorder, rebuild final PDF
- OCR extraction from PDF pages
- Share/export resulting PDFs via `share_plus`

### PDF Security
- **Watermarks** — text watermark with configurable opacity, color, and rotation applied to all pages
- **Digital Signature** — canvas-based signature pad (via `signature` package), exported as PNG, embedded into PDF page
- **Password Protection** — user-set open password and owner password with configurable permissions (print, copy, edit, annotate)

### AI Features
- **OCR + Display** — extract text from a picked image or PDF and display it
- **Translation** — translate extracted text between Arabic and English
- **Summarization** — summarize long extracted text using HuggingFace BART (optional API key) or a local extractive algorithm
- **Smart Organization Suggestion** — heuristic-based section name suggestion (`SmartOrganizationService`)
- **Batch OCR** — run OCR on all items missing extracted text with live progress indicator

### Scanner Tools (Professional Tools Page)
- Document scanner with flutter_doc_scanner
- Business card scanner with dedicated import flow
- QR code and barcode scanner

### Analytics Dashboard
- Total file count, section count, total storage used (bytes, summed from actual files on disk)
- File type distribution (bar/pie via fl_chart)
- 7-day activity chart (files added per day, size added per day)
- Data pulled live from SQLite with StreamBuilder refresh on any database change

### Settings
- Theme selection (16 prebuilt themes + custom color picker using flutter_colorpicker)
- Language toggle (Arabic / English), persisted to SharedPreferences
- HuggingFace API key input for AI summarization

---

## Technical Implementation

### Architecture

The project uses a **service-oriented flat architecture**. There are no explicit Clean Architecture layers (no `domain/`, no `data/` repository interfaces). The structure is:

```
lib/
├── cubit/          ← State management (BLoC Cubit pattern)
├── models/         ← Plain Dart data classes
├── service/        ← SQLite singleton (DatabaseService)
├── services/       ← Domain services (OCR, PDF, Storage, Translation...)
├── pages/          ← Full-page screen widgets
├── widgets/        ← Reusable UI components
├── functions/      ← Dialog helpers and flow functions
├── helper/         ← File viewer helpers (PDF, Text)
├── screens/editor/ ← PDF editor sub-screens
├── theme/          ← ThemeData definitions
├── l10n/           ← Generated localization classes
└── main.dart
```

**Tradeoff acknowledged:** The flat service architecture is appropriate for a solo project of this scope. For a team project, I would add a repository layer between cubits and `DatabaseService` to enable mocking in tests.

---

### State Management

**flutter_bloc 9.x — Cubit pattern** is used for all UI-driving state.

| Cubit | States |
|-------|--------|
| `SectionCubit` | `SectionLoading`, `SectionLoaded(List<Section>)`, `SectionError(String)` |
| `ItemSectionCubit` | `ItemSectionLoading`, `ItemSectionLoaded(List<ItemSection>)`, `ItemSectionError`, `ItemAdded`, `ItemDeleted`, `ItemNameUpdated` |
| `LocaleCubit` | `Locale` (emits the active locale directly) |
| `ThemeCubit` | `AppTheme` enum (16 values) |

All four cubits are provided at the root `MultiBlocProvider` in `main.dart`, making them available throughout the entire widget tree.

**`ThemeCubit` special case:** Theme color customization uses a `ValueNotifier<Color?>` instead of a Cubit emit, because wrapping `MaterialApp` in a `ValueListenableBuilder` allows instant color changes without rebuilding the entire app widget tree that a `BlocBuilder` emit would trigger.

---

### Data Flow

```
User Action (UI)
    │
    ▼
Cubit method (e.g., SectionCubit.addSection)
    │
    ▼
DatabaseService (sqflite singleton)
    │  ─── writes to SQLite ───►  SQLite DB file (on device)
    │  ─── notifyChange() ────►  StreamController<void>.broadcast()
    │
    ▼
Cubit emits new state
    │
    ▼
BlocBuilder / StreamBuilder rebuilds UI
```

The `StreamController<void> changes` in `DatabaseService` serves as a reactive bus. Any widget that subscribes (e.g., the home screen's storage summary card) automatically refreshes when any part of the app mutates the database, without needing direct cubit subscriptions.

---

### API Integration

The app is offline-first with three optional external HTTP calls, all with fallback behavior:

| Service | Endpoint | Fallback |
|---------|----------|----------|
| Google Translator | `GoogleTranslator()` (unofficial API via `translator` package) | LibreTranslate HTTP POST |
| LibreTranslate | `https://libretranslate.de/translate` | Throws user-visible error |
| HuggingFace BART | `https://api-inference.huggingface.co/models/facebook/bart-large-cnn` | Local extractive summarization |

No authentication token is required for core functionality. The HuggingFace API key is optional and entered by the user in the settings screen, stored in-memory in `AISummarizationService` (not persisted between sessions — this is a known limitation).

---

### Local Storage

Two separate storage mechanisms are used:

**SQLite (sqflite):**
- Stores structured metadata: sections, items, OCR text, file paths, file types, creation timestamps
- Two tables: `section` and `items` with a foreign key relationship
- Indexes on `items.sectionId`, `items.name`, `items.filePath` for query performance
- Schema migrations are additive-only: startup checks `PRAGMA table_info` and only executes `ALTER TABLE ADD COLUMN` if the column is missing

**SharedPreferences:**
- App theme selection (`app_theme` string key)
- App locale (`app_locale` string key)
- Custom primary color (`custom_primary_color` int key, stored as ARGB integer)
- First-open tracking per page (`first_open_{pageKey}` boolean key)

**File System (DocumentStorageService):**
- Structured directory tree under `getApplicationDocumentsDirectory()`:
  - `office_archiving/imports/` — files imported from gallery/file picker
  - `office_archiving/scans/` — files from camera/scanner
  - `office_archiving/exports/` — generated PDFs and processed files
  - `office_archiving/signatures/` — captured signature PNG files
  - `office_archiving/tmp/` — temporary PDF editing sessions (cleaned up on dispose)
- File name sanitization supports Arabic Unicode range (`؀-ۿ`), strips special characters, truncates to 80 characters

---

### Authentication

**None.** The app has no user accounts, no login, and no network-based authentication. All data is private to the device by virtue of being stored in the app's sandboxed documents directory.

This is a deliberate design decision — the target users are individuals who value privacy and do not want their documents uploaded to any cloud service.

---

### Reusable Components

| Component | Purpose |
|-----------|---------|
| `ShimmerLoadingList` / `ShimmerGrid` | Skeleton loading placeholders during async operations |
| `EmptyStateWidget` | Consistent empty state illustration + message for all list screens |
| `FirstOpenAnimator` | Wraps any widget with a fade-in animation shown only on first visit to that page |
| `SectionListView` / `GridViewItemsSuccess` | Section and item list/grid rendering with tap, long-press, and context menu |
| `RenameSectionDialog` / `RenameItemDialog` | Reusable rename dialogs with validation |
| `SectionFileCard` | File card widget showing thumbnail (image) or file-type icon (PDF, etc.) |
| `SettingsContent` | Settings UI extracted to a widget usable both as a full page and a bottom sheet |
| `SignaturePad` | Canvas-based signature capture with clear and export actions |

---

### Error Handling

- **Cubit errors** emit an `*Error(String message)` state that the UI handles with an error widget and a retry option
- **OCR errors** are caught inside `ProfessionalOcrService` and re-thrown as typed exceptions with user-readable Arabic messages
- **PDF editing errors** are surfaced via `_errorMessage` state variable displayed in the editor page UI
- **Database errors** on delete/update are caught and emitted as error states
- **File system errors** (file not found, permission denied) are caught in `deleteItemWithFile` and logged; the DB row is still cleaned up
- **Network errors** in translation and summarization use try/catch chains that cascade to the next fallback service before throwing

---

### Performance Considerations

- **PDF OCR memory limits:** PDF rasterization is capped at 3 pages, 72 DPI, 12 MB max file size to prevent OOM crashes on mobile
- **SQLite indexes:** Three indexes (`sectionId`, `name`, `filePath`) added at database initialization to optimize search and item listing queries
- **Silent refresh pattern:** `ItemSectionCubit.refreshItems()` calls `fetchItemsBySectionId(showLoading: false)` so list updates after rename/delete do not flash a loading skeleton
- **Theme update isolation:** `ValueNotifier<Color?>` wraps `MaterialApp` in `ValueListenableBuilder` so custom color changes do not trigger full app rebuilds
- **First-open animations:** Animations only run once per page (tracked via SharedPreferences), avoiding unnecessary animation overhead on repeat visits
- **Ordered item loading:** Items fetched with `ORDER BY createdAt DESC` so newest files appear first without client-side sorting
- **Lazy section cover loading:** Section cover is resolved via `getSectionCoverOrLatest()` which first checks the explicit cover, then queries for the most recent image — only one DB call is needed

---

## Challenges & Solutions

### Challenge 1: PDF OCR Causing Out-of-Memory Crashes
**Problem:** Rasterizing a full PDF (100+ pages, high DPI) to bitmaps in memory caused `OutOfMemoryError` on mid-range Android devices.

**Solution:** Enforced hard limits in `OCRService`: `maxPages = 3`, `dpi = 72`, `maxFileSizeBytes = 12 MB`. Used `Printing.raster()` which yields pages as a `Stream` rather than loading the entire document. Added a file size gate before starting the OCR process.

---

### Challenge 2: Poor OCR Accuracy on Mixed Arabic/English Documents
**Problem:** Google ML Kit (trained primarily on Latin scripts) produced garbage output on Arabic text, while Tesseract with only an Arabic language pack struggled on mixed content.

**Solution:** Built `ProfessionalOcrService` as a multi-candidate engine:
1. Runs both ML Kit and Tesseract backends
2. Tries 4 orientations (0°, 90°, 180°, 270°) for each
3. Applies image preprocessing variants (standard, binarized, document-mode)
4. Scores each candidate by text length and character quality
5. Selects the highest-scoring result

This significantly improved accuracy on real-world documents such as scanned invoices with mixed Arabic headers and English amounts.

---

### Challenge 3: Real-Time UI Sync Across Unrelated Widgets
**Problem:** The home screen's storage summary card needed to update whenever any part of the app added, renamed, or deleted a file — but it was not a direct consumer of `ItemSectionCubit`.

**Solution:** Added a `StreamController<void>.broadcast()` on `DatabaseService` that emits a signal after every mutation (`insertItem`, `deleteItem`, `updateSectionName`, etc.). The home screen wraps its summary card in a `StreamBuilder<void>` subscribed to `DatabaseService.instance.changes`, triggering a `FutureBuilder` refresh on every signal.

---

### Challenge 4: Theme Color Changes Rebuilding the Entire App
**Problem:** Storing the custom primary color in `ThemeCubit` and emitting a new state caused `BlocBuilder<ThemeCubit, AppTheme>` to rebuild `MaterialApp` completely, causing visible flicker and performance cost.

**Solution:** Separated theme enum state (handled by Cubit emit for theme switches) from color state (handled by `ValueNotifier<Color?>`). `MaterialApp` is wrapped in a `ValueListenableBuilder` that only rebuilds when the color notifier changes, while theme enum changes still use the normal Cubit emit path. A composite `ValueKey` is applied to `MaterialApp` to force a rebuild only when both locale and theme name change.

---

### Challenge 5: SQLite Schema Evolution Without Breaking Existing Users
**Problem:** Adding OCR columns (`ocrText`, `ocrLang`, `ocrHasText`, `ocrProcessedAt`) and `createdAt` to the `items` table after the app was already in use would fail if using a version-bump migration that drops and recreates the table.

**Solution:** At database initialization, the app reads `PRAGMA table_info('items')` into a list and checks for each expected column by name. `ALTER TABLE ADD COLUMN` is only executed if the column does not already exist. This makes all migrations additive and safe to run on any database version.

---

## Technologies Used

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Flutter | 3.x |
| Language | Dart | ≥ 3.9.0 |
| State Management | flutter_bloc (Cubit) | ^9.1.0 |
| Local Database | sqflite | ^2.0.0 |
| OCR — Latin/Mixed | google_mlkit_text_recognition | ^0.12.0 |
| OCR — Arabic | flutter_tesseract_ocr | ^0.4.21 |
| PDF Generation | pdf | ^3.10.8 |
| PDF Rendering | printing | ^5.13.4 |
| PDF Viewer | flutter_pdfview | ^1.3.2 |
| Document Scanner | flutter_doc_scanner | ^0.0.16 |
| Image Editing | image_editor_plus | ^1.0.8 |
| Image Processing | image | ^4.2.0 |
| Camera | camera | ^0.11.0 |
| Image Picker | image_picker | ^1.1.2 |
| File Picker | file_picker | ^8.1.2 |
| Signature Capture | signature | ^5.5.0 |
| Sharing | share_plus | ^10.0.2 |
| File Opening | open_file | ^3.5.7 |
| Charts | fl_chart | ^0.68.0 |
| Animations | animations | ^2.0.11 |
| Shimmer | shimmer | ^3.0.0 |
| Color Picker | flutter_colorpicker | ^1.1.0 |
| QR Generation | qr_flutter | ^4.1.0 |
| URL Launcher | url_launcher | ^6.3.0 |
| HTTP Client | http | ^1.1.0 |
| Translation | translator | ^1.0.0 |
| Preferences | shared_preferences | ^2.3.2 |
| Path Utilities | path | ^1.8.0 |
| Path Provider | path_provider | ^2.0.15 |
| Permissions | permission_handler | ^12.0.1 |
| Media Store | media_store_plus | ^0.1.3 |
| Localization | flutter_localizations + intl | ^0.20.2 |
| Custom Font | GT Sectra Fine | (bundled) |

---

## Results / Impact

- Delivered a fully functional, production-versioned (1.0.5) mobile application that covers the complete document lifecycle: capture → organize → search → process → export/share
- Achieved accurate bilingual OCR (Arabic + English) on real-world mixed-language documents through a custom multi-candidate pipeline — a non-trivial engineering outcome on mobile
- Built an offline-first system that provides features (translation, summarization, PDF editing) typically dependent on cloud services, demonstrating resilient service design
- Created an Arabic-first user experience with full RTL layout support, Arabic OCR, and bilingual UI — a differentiating capability in the Flutter developer market
- Implemented memory-safe PDF processing that handles edge cases (large files, many pages) that crash naive implementations on mid-range Android hardware
