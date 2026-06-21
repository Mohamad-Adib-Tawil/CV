# office_archiving_keywords.md
# Complete Keywords Reference — Office Archiving

> Grounded in what's actually in the codebase. Keywords are not invented.

---

## 1. Core Flutter / Dart

```
Flutter
Dart
Flutter SDK 3.x
Dart SDK 3.9+
Flutter Material Design 3
MaterialApp
StatefulWidget
StatelessWidget
BuildContext
WidgetsFlutterBinding
MethodChannel
Platform Channel
Native Integration
Flutter Plugins
Flutter Packages
flutter_launcher_icons
flutter pub get
flutter build apk
flutter gen-l10n
```

---

## 2. Architecture

```
Service-Oriented Architecture
Offline-First Architecture
Flat Architecture
Singleton Pattern
Factory Constructor
Repository Pattern (discussed / improvement target)
Separation of Concerns
SOLID Principles (partial)
Domain Services
Dependency Injection (constructor-based, manual)
Widget Composition
Reusable Components
```

---

## 3. State Management

```
State Management
flutter_bloc
BLoC Pattern
Cubit
BlocProvider
BlocBuilder
BlocListener
MultiBlocProvider
context.read()
context.select()
context.watch()
Reactive State
Stream
StreamController
Broadcast Stream
ValueNotifier
ValueListenableBuilder
Cubit States (Loading / Loaded / Error)
Immutable State
State Emission
```

---

## 4. Backend / APIs

> Note: This app has no dedicated backend server. API calls are limited to optional external services.

```
HTTP Client (http package)
REST API
JSON Serialization
JSON Deserialization
jsonEncode / jsonDecode
API Key Management
Optional API Integration
Graceful Degradation
Fallback Strategy
Offline Fallback
LibreTranslate API
HuggingFace Inference API
Google Translate (unofficial)
HuggingFace BART (facebook/bart-large-cnn)
Error Handling (HTTP)
HTTP Status Codes
```

---

## 5. Authentication

> Note: No authentication is implemented in this app. This is a deliberate design decision.

```
No Authentication (Privacy-first design)
Local-only Data
On-device Storage
Data Privacy
No Cloud Upload
```

*If adding auth in the future, relevant keywords would be: Firebase Auth, JWT, OAuth 2.0, Biometric Auth (local_auth), flutter_secure_storage.*

---

## 6. Firebase

> Note: Firebase is NOT used in this app. Do not add Firebase to your CV for this project.

*If Firebase Crashlytics is added (see improvements plan), then: Firebase, Firebase Crashlytics, FlutterFire.*

---

## 7. Data / Models

```
Data Modeling
Plain Dart Objects (PODO)
fromMap() / toMap()
fromJson() / toJson()
copyWith()
Immutable Data Classes
Equality Overrides (== and hashCode)
JSON Serialization (manual)
Map<String, dynamic>
Foreign Key Relationship
One-to-Many Relationship (Section → Items)
Nullable Fields
createdAt Timestamps
OCR Metadata Storage
```

---

## 8. Local Storage

```
SQLite
sqflite
Local Database
Offline Storage
Database Initialization
Schema Migration
Additive Migration
PRAGMA table_info
ALTER TABLE ADD COLUMN
CRUD Operations
SQL Queries
LIKE Query (Full-text search)
SQL Indexes
CREATE INDEX
ORDER BY
LIMIT / OFFSET (Pagination-ready)
DatabaseService Singleton
SharedPreferences
Key-Value Storage
Persistent Preferences
Theme Persistence
Locale Persistence
File System Storage
getApplicationDocumentsDirectory
path_provider
Structured Directory Management
File Sanitization
media_store_plus
```

---

## 9. Navigation

```
Navigator
Navigator.push()
MaterialPageRoute
NavigatorKey (GlobalKey<NavigatorState>)
MethodChannel Navigation
File-Open Intent Routing
go_router (improvement target, not yet implemented)
Named Routes (improvement target)
Deep Linking (improvement target)
```

---

## 10. Dependency Injection

```
Constructor Injection
Singleton Services
Service Locator Pattern (manual)
BlocProvider (as DI for Cubits)
DatabaseService.instance
DocumentStorageService.instance
OCRService (factory singleton)
ProfessionalOcrService.instance
```

---

## 11. Performance

```
Performance Optimization
SQLite Indexes
Query Optimization
Memory Management
Memory-Safe PDF Processing
PDF Page Limits
DPI Control
OOM Prevention
Silent Refresh Pattern (no loading flash)
ValueNotifier (targeted rebuilds)
ValueListenableBuilder
First-Open Animation Guard
SharedPreferences (first-open tracking)
Lazy Loading (cover image resolution)
Stream-based Pagination (sqflite limit/offset)
Asynchronous Operations (async/await)
compute() Isolate (improvement target)
Background Processing
```

---

## 12. ML / AI

```
Machine Learning
On-Device ML
OCR (Optical Character Recognition)
Google ML Kit
google_mlkit_text_recognition
TextRecognizer
Tesseract OCR
flutter_tesseract_ocr
tessdata (language data assets)
Arabic OCR
Bilingual OCR
Mixed-Language OCR
Language Detection (auto)
OcrLanguageProfile
Orientation Detection
Image Preprocessing
Binarization
Document Mode Preprocessing
Multi-Candidate Scoring
Dual-Engine Pipeline
PDF Rasterization
Printing.raster() (page-to-image)
Natural Language Processing (basic)
Text Summarization
Extractive Summarization
Abstractive Summarization (HuggingFace BART)
Text Translation
AI Summarization
Keyword Extraction
```

---

## 13. UI / UX

```
Material Design 3
Custom ThemeData
ColorScheme.fromSeed()
16 Prebuilt Themes
Custom Color Picker
flutter_colorpicker
Dark Theme
Light Theme
Midnight Theme
Responsive Layout
RTL Layout
Right-to-Left
Arabic UI
Shimmer Loading
shimmer package
Empty State Widget
Animated Transitions
animations package
FadeTransition
AnimationController
CurvedAnimation
Tween
First-Open Animation
Custom Font (GT Sectra Fine)
GridView
ListView.builder
Bottom Sheet
Modal Dialog
SnackBar
TabController
fl_chart
Bar Chart
Analytics Dashboard
QR Code Display
qr_flutter
Signature Capture Canvas
signature package
Image Viewer
PDF Viewer
flutter_pdfview
```

---

## 14. Localization / Internationalization

```
Localization
Internationalization (i18n)
flutter_localizations
gen_l10n
ARB Files (Application Resource Bundle)
AppLocalizations
Bilingual App
Arabic (ar)
English (en)
RTL Support
LTR Support
Locale Switching
Dynamic Locale Change
intl package
```

---

## 15. Testing

> Note: No tests are present in this project. The following are improvement targets.

```
Unit Testing (improvement target)
Widget Testing (improvement target)
Integration Testing (improvement target)
flutter_test
bloc_test
mockito
Mock Repository
Test Coverage
TDD (Test-Driven Development)
```

---

## 16. DevOps / Build

```
pubspec.yaml
flutter pub get
build_runner
flutter_lints
Analysis Options
flutter analyze
flutter build apk
flutter build ios
App Icons (flutter_launcher_icons)
Adaptive Icon (Android)
rename package
Version Management (pubspec version)
Debug Build
Release Build
```

---

## 17. Domain-Specific (Document Management)

```
Document Management
Document Archiving
File Organization
Section-Based Organization
Document Scanner
flutter_doc_scanner
Business Card Scanner
QR Code Scanner
Barcode Scanner
OCR Text Extraction
Full-Text Search
PDF Creation
PDF Editing
PDF Merging
PDF Page Editing
PDF Security
Watermark
Digital Signature
Password Protection
PDF Permissions
File Import
File Export
File Sharing (share_plus)
File Opening (open_file)
Storage Analytics
File Type Detection
Image Processing
Camera Integration
Gallery Picker
File Picker
Permission Handling
permission_handler
```

---

## Recommended LinkedIn Skills to Add

> Add these to your LinkedIn "Skills" section and ask connections to endorse them.

**Primary (add first):**
- Flutter
- Dart
- Mobile Application Development
- State Management
- SQLite
- BLoC / Cubit
- Offline-First Development
- PDF Processing
- OCR (Optical Character Recognition)
- Arabic Language Support

**Secondary:**
- Google ML Kit
- RESTful APIs
- Local Storage
- Material Design
- Flutter Localization
- Android Development
- iOS Development
- Data Visualization
- Performance Optimization
- Clean Code

---

## Keywords for ATS Scanning

> Copy-paste this list as a "Skills" section in your CV or include naturally in job application cover letters.

```
Flutter, Dart, flutter_bloc, BLoC, Cubit, State Management, SQLite, sqflite,
Offline-First, Local Storage, SharedPreferences, Reactive Programming,
OCR, Optical Character Recognition, Google ML Kit, Tesseract, Image Processing,
PDF Generation, PDF Editing, PDF Processing, Digital Signature,
REST API, HTTP, JSON, API Integration, Error Handling, Graceful Degradation,
Arabic Localization, RTL, Internationalization, gen_l10n, Bilingual App,
Material Design 3, Custom Theming, Responsive UI, Flutter Widgets,
Performance Optimization, Memory Management, Async/Await, Streams,
Native Integration, MethodChannel, Platform Channel, Android, iOS,
fl_chart, Data Visualization, Analytics Dashboard,
Camera, File Picker, Image Picker, Document Scanner, Permission Handling,
Solo Development, Full-Stack Mobile, Technical Architecture
```

---

## Keywords to NOT Claim (Not Present in Codebase)

> Do not add these to your CV for this project — they are not present.

```
Firebase (not used)
Supabase (not used)
GraphQL (not used)
Clean Architecture (not formally implemented)
Repository Pattern (not implemented)
Unit Tests / TDD (no tests)
CI/CD (not configured)
GetX (not used)
Riverpod (not used)
Provider (not used)
go_router (not used)
Authentication (not implemented)
Biometric (not used)
Push Notifications (not used)
```
