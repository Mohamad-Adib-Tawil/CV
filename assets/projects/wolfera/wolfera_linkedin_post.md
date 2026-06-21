# Wolfera — LinkedIn Post Templates

Choose the version that fits the context (job hunting, general showcase, or technical audience).

---

## Version A — General Audience (Arabic)

🚗 سعيد بمشاركة مشروع Wolfera — منصة متكاملة لبيع وشراء وتأجير السيارات طورتها بالكامل باستخدام Flutter.

المشروع يشمل:
✅ بحث وفلترة بأكثر من 15 معيار
✅ دردشة فورية بين المشتري والبائع
✅ نظام إشعارات ذكي عند تغيير سعر سيارة في المفضلة
✅ خطوات إرشادية لإضافة السيارة مع ضغط الصور تلقائياً
✅ دعم تسجيل الدخول عبر Google وApple
✅ فلتر ذكاء اصطناعي محلي للكشف عن المحتوى غير اللائق
✅ واجهة ثنائية اللغة عربي / إنجليزي

**Tech Stack:**
Flutter · Supabase · Firebase · BLoC/Cubit · Clean Architecture · GoRouter · TFLite

---

## Version B — General Audience (English)

🚗 Excited to share Wolfera — a full-featured car marketplace app I built end-to-end with Flutter.

Key highlights:
✅ Browse, buy, sell & rent cars with 15+ advanced filters
✅ Real-time buyer-to-seller chat via Supabase Realtime
✅ Smart push notifications when a favorited car drops in price
✅ Multi-step car listing wizard with automatic image compression
✅ Google & Apple Sign-In with proper nonce security flow
✅ On-device TFLite NSFW image moderation — zero cloud cost
✅ Full bilingual Arabic/English with RTL support

**Tech Stack:**
Flutter · Dart · Supabase · Firebase · BLoC/Cubit · Clean Architecture · GoRouter · GetIt · Freezed · TFLite

---

## Version C — Technical Audience

🔧 Breaking down the architecture of Wolfera — a car marketplace I built solo with Flutter.

Some technical decisions worth sharing:

**Why Supabase over Firestore?**
Car data is inherently relational (cars → owners → conversations → messages). PostgreSQL's JOINs and Row-Level Security gave me admin access control at the DB layer — no separate backend API needed.

**On-device NSFW moderation:**
Used a bundled TFLite model to screen car images before upload. Fail-open design: if the model fails, upload proceeds — the admin approval workflow is the safety net.

**Price-change notifications:**
When a seller edits a car's price, the app diffs all 6 price fields, queries who favorited that car, reads their preferred language, and sends localized FCM push notifications. All from within the Flutter app's service layer.

**BLoC where it matters, Cubit where it doesn't:**
Auth and the 5-page listing wizard use full BLoC for explicit event tracing. Favorites and home feed use Cubit. Same library, right tool for the complexity level.

Stack: Flutter · Supabase · Firebase FCM + Crashlytics · BLoC/Cubit · Clean Architecture · GoRouter · GetIt + Injectable · Freezed · TFLite · easy_localization

---

## Hashtags (add to any version)

```
#Flutter #Dart #MobileDevelopment #Supabase #Firebase #CleanArchitecture
#BLoC #FlutterDev #MobileApp #CarMarketplace #TFLite #OpenToWork
```

---

## Tips Before Posting

- Add 2–3 screenshots or a short screen recording (Loom or GIF) — posts with visuals get 3× more engagement
- Tag relevant technologies: @Flutter, @Supabase
- Post on Tuesday or Wednesday morning for best reach
- In the comments, pin a link to the GitHub repo
