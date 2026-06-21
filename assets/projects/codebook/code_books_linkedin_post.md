# Code Books — LinkedIn Post Templates

---

## Post A — Arabic Audience (General)

```
🚀 أطلقت مشروعي الجديد: Code Books

تطبيق Flutter لاستعراض وقراءة الكتب البرمجية مجاناً، مبني على معمارية Clean Architecture بشكل كامل.

✅ ما يميّز هذا المشروع:
• يعمل بدون إنترنت — البيانات محفوظة محلياً عبر Hive
• بحث فوري مع debounce وفلترة متقدمة (نوع، تقييم، عدد الصفحات)
• قارئ كتب مدمج داخل التطبيق عبر WebView
• إدارة الحالات عبر flutter_bloc (Cubit) بشكل احترافي
• معالجة أخطاء الشبكة مع إعادة المحاولة التلقائية (3 محاولات مع Exponential Backoff)

المشروع مفتوح المصدر على GitHub — الرابط في التعليقات 👇

#Flutter #Dart #MobileApp #CleanArchitecture #OpenSource
```

**Tips (Arabic post):**
- نشر يوم الأحد أو الاثنين صباحاً (9-11 ص بتوقيت الخليج) للوصول الأعلى
- أضف صورة شاشة (screenshot) أو GIF للتطبيق — المنشورات التي تحتوي وسائط تحصل على 3x مشاهدات
- اذكر اسم التقنية الرئيسية في السطر الأول لجذب المطورين

---

## Post B — English Audience (General)

```
Built something I'm proud of this month 📱

Code Books — a free programming book discovery app built entirely with Flutter.

You can browse popular and newest programming books, filter by category (Flutter, Python, JavaScript, Algorithms...), search with advanced filters, and read books directly inside the app.

What made this project interesting to build:
→ Offline-first: every category you browse is cached locally, so the app is instant on re-open
→ The in-app reader rewrites Google Books URLs into clean embed links — no external browser needed
→ Network calls automatically retry 3× with exponential backoff before surfacing an error

Stack: Flutter · flutter_bloc · Dio · Hive · GoRouter · GetIt · Clean Architecture

Happy to answer any questions about the architecture or any technical choices 🙂

GitHub link in the comments ↓

#Flutter #MobileDevelopment #OpenSource #SoftwareEngineering #Android #iOS
```

**Tips (English general post):**
- Post Tuesday–Thursday between 8–10 AM (your local time) for maximum reach
- Add a 3-screen carousel image (Home → Search → Reader) as the media attachment
- End with a question ("What's your go-to Flutter state management solution?") to drive comments

---

## Post C — Technical English Audience (Engineers / Hiring Managers)

```
Just shipped Code Books — a Flutter app for browsing and reading free programming e-books. 

A few implementation details that might be interesting:

𝗔𝗿𝗰𝗵𝗶𝘁𝗲𝗰𝘁𝘂𝗿𝗲
Full Clean Architecture: domain layer has zero Flutter/third-party imports. The abstract HomeRepo interface means the entire Google Books API integration can be swapped by changing only the data layer. Use cases return Either<Failure, T> via dartz — error paths are explicit in every function signature.

𝗖𝗮𝗰𝗵𝗶𝗻𝗴 𝗦𝘁𝗿𝗮𝘁𝗲𝗴𝘆
Hive boxes are named dynamically: boxNameFor('new', 'flutter') → 'books_new_flutter'. Every sort-type × category combination gets its own isolated box. Cache-first reads on every request; page-0 writes clear the box first to prevent stale accumulation.

𝗥𝗲𝘀𝗶𝗹𝗶𝗲𝗻𝗰𝗲
Dio wrapped with a generic retry<T>() that applies exponential backoff (delay *= 2). Full DioExceptionType switch → typed ServerFailure messages. Cubits emit distinct PaginationFailure vs. first-load Failure states so the UI can differentiate between "inline error" and "full-screen error."

𝗦𝗲𝗮𝗿𝗰𝗵
400ms debounce, server-side subject-filter query composition, client-side page-count + minimum-rating post-filtering, and infinite scroll via ScrollNotification — all inside a single SearchView.

Tech: Flutter 3.8 · flutter_bloc 9 · Dio 5 · Hive · GoRouter 14 · GetIt · webview_flutter · dartz

Open source — repo link in the comments.

What would you add or change? Always interested in feedback 👇

#Flutter #CleanArchitecture #MobileDev #Dart #OpenSource
```

**Tips (Technical post):**
- Bold text formatting (𝗕𝗼𝗹𝗱 via Unicode) improves scannability — LinkedIn doesn't support Markdown
- Tag 1–2 Flutter community figures or your local Flutter meetup page to reach their audience
- Post on Wednesday or Thursday; technical posts perform better mid-week
- Respond to every comment within the first hour — early engagement boosts LinkedIn's algorithm reach significantly
- Add a short screen recording (15–30 seconds) showing the search + filter flow as the media attachment

---

## Hashtag Bank

### Primary (high volume, relevant)
`#Flutter` `#Dart` `#MobileDevelopment` `#CleanArchitecture` `#OpenSource`

### Secondary (targeted reach)
`#FlutterDev` `#AndroidDev` `#iOSDev` `#SoftwareEngineering` `#AppDevelopment`

### Technical (niche but quality audience)
`#BlocPattern` `#StateManagement` `#RestAPI` `#OfflineFirst` `#TechPortfolio`

### Career / Visibility
`#FlutterCommunity` `#BuildInPublic` `#100DaysOfCode` `#DevPortfolio`

---

## General Posting Tips

| Tip | Detail |
|---|---|
| Best posting days | Tuesday, Wednesday, Thursday |
| Best time | 8–10 AM local time |
| Media | Always attach screenshots or a GIF — posts with images get 3× more impressions |
| First comment | Post the GitHub link as the first comment (not in the post body) — LinkedIn's algorithm deprioritizes posts with external links in the body |
| Engagement window | Respond to comments within the first 60 minutes — this is the highest-leverage activity for reach |
| Frequency | Post once per project, not multiple times — one strong post beats three weak ones |
| Tagging | Tag technologies' official pages (e.g., Flutter) and relevant communities, not random people |
