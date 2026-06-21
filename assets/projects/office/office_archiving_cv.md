# office_archiving_cv.md
# CV Description — Office Archiving

---

**Project Name:** Office Archiving — Smart Offline Document Management App  
**Role:** Flutter Developer (Solo)  
**Platform:** Android / iOS  
**Version:** 1.0.5  

**Technologies:**  
Flutter · Dart · flutter_bloc (Cubit) · SQLite (sqflite) · Google ML Kit Text Recognition · Tesseract OCR · pdf · printing · flutter_pdfview · flutter_doc_scanner · share_plus · flutter_localizations (AR/EN) · SharedPreferences · MethodChannel · fl_chart · http · translator (Google Translate)

---

## CV Bullet Points

- Architected an offline-first document management mobile app using Flutter and Dart with SQLite (sqflite) as the sole persistence layer, implementing a non-destructive schema migration strategy via `PRAGMA table_info` checks to safely evolve the database schema across app versions without data loss.

- Built a dual-engine OCR pipeline combining Google ML Kit Text Recognition and Tesseract OCR to extract Arabic and English text from images and multi-page PDFs, with image preprocessing (resize, binarization, document-mode variants), 4-angle orientation sweep, and a scoring function that automatically selects the highest-quality result; OCR output is stored in SQLite and exposed through full-text SQL search (`LIKE` queries on both filename and OCR content).

- Developed a complete PDF tooling layer including programmatic PDF creation from image lists, per-page session-based editing (rotate, delete, reorder) by rasterizing pages via `Printing.raster()`, watermark embedding, canvas-based digital signature capture, and password protection using the `pdf` and `printing` packages.

- Implemented a reactive state management system using flutter_bloc Cubit pattern across four domain cubits (Section, Item, Locale, Theme), with a `StreamController<void>` broadcast bus on `DatabaseService` enabling decoupled real-time UI synchronization across unrelated widget subtrees.

- Integrated AI-assisted document features including text translation (Google Translator with LibreTranslate HTTP fallback) and text summarization (HuggingFace BART API with a local extractive algorithm as offline fallback), demonstrating resilient service design with graceful degradation.

- Built a 16-theme engine using custom `ThemeData` factories with a `ColorScheme`-seed approach, augmented by a `ValueNotifier<Color?>` for instant custom primary color updates without triggering full `MaterialApp` rebuilds; persisted theme selection and locale to `SharedPreferences` with legacy theme name migration support.

- Delivered a fully bilingual Arabic/English UI using `gen_l10n` with ARB files, a native Android `MethodChannel` for file-open intent routing, shimmer loading states, first-open page animations tracked via `SharedPreferences`, and an analytics dashboard powered by `fl_chart` showing file type distribution and 7-day activity.

---

## Quick Stats

| Metric | Value |
|--------|-------|
| Screens / Pages | 15+ |
| Cubit state classes | 4 domains |
| SQLite tables | 2 (section, items) |
| Themes | 16 prebuilt + custom color |
| OCR backends | 2 (ML Kit + Tesseract) |
| Supported languages | Arabic, English |
| External API calls | 3 (all with offline fallback) |
| Native channels | 1 (Android file-open intent) |
