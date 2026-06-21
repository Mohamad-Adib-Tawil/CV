# office_archiving_linkedin_post.md
# LinkedIn Posts — Office Archiving

---

## Post A: Arabic Audience (General)

---

**[Caption for first slide/image: صورة من الشاشة الرئيسية أو لقطة تظهر OCR عمل على وثيقة عربية]**

بنيت تطبيق موبايل بالكامل بـ Flutter لأرشفة المستندات، وهو يعمل 100% بدون إنترنت ودون الحاجة لأي حساب سحابي.

المشكلة اللي حلّها التطبيق بسيطة: كيف تنظّم وتبحث في مجموعة ضخمة من الوثائق (عقود، فواتير، بطاقات أعمال، مستندات رسمية) من هاتفك، بشكل خاص وآمن؟

---

**شو بيعمل التطبيق:**
- تنظيم الملفات في أقسام مخصصة مع صور غلاف
- مسح المستندات بالكاميرا أو الماسح الضوئي المدمج
- استخراج النص من الصور وملفات PDF تلقائياً (OCR) — يدعم العربية والإنجليزية معاً
- بحث داخل محتوى الملفات لا في الاسم فقط
- ترجمة النصوص عربي ↔ إنجليزي
- أدوات PDF: إنشاء، تعديل، علامة مائية، توقيع رقمي
- لوحة تحليلات مع رسوم بيانية للاستخدام اليومي
- 16 ثيم مختلف مع خيار تخصيص اللون

---

**من الناحية التقنية:**
المحرك الأصعب كان الـ OCR — استخدمت محركين في نفس الوقت (Google ML Kit + Tesseract) مع خوارزمية تقييم تختار النتيجة الأفضل تلقائياً، وهذا حسّن الدقة بشكل واضح على الوثائق المختلطة عربي/إنجليزي.

---

هل شتغلت على تطبيق مشابه أو عندك تجربة مع OCR على موبايل؟ شاركني رأيك في التعليقات 👇

---

**#Flutter #Dart #MobileApp #ArabicDev #OCR #DocumentManagement #FlutterBloc #SQLite #مطور_موبايل #تطوير_تطبيقات**

---

**نصائح للنشر:**
- أفضل وقت: الثلاثاء أو الأربعاء 9–11 صباحاً (بتوقيت الشرق الأوسط)
- استخدم لقطات شاشة حقيقية — الوثيقة العربية التي استُخرج منها النص هي أقوى ما يمكن إظهاره
- ردّ على كل تعليق خلال أول ساعتين — الخوارزمية تكافئ التفاعل المبكر
- لا تضع رابط GitHub في المنشور الأصلي — ضعه في أول تعليق

---

---

## Post B: English Audience (General)

---

**[Carousel or single image: screenshot showing organized sections + file view]**

Just shipped a Flutter document management app — fully offline, no cloud account required, everything stays on your device.

I built this to solve a real problem: organizing and searching through a growing pile of scanned documents (contracts, receipts, ID papers, business cards) without having to upload them to a third-party service.

---

**What it does:**
✅ Organize files into labeled sections with custom covers
✅ Import from camera, gallery, file picker, or document scanner
✅ Automatic OCR text extraction from images and PDFs (Arabic + English)
✅ Search inside document content — not just filenames
✅ Translate text between Arabic and English
✅ PDF tools: create, edit pages, watermark, digital signature, password protection
✅ Analytics dashboard with usage charts
✅ 16 themes + custom color picker

---

**The interesting part:** Making OCR work reliably on real-world Arabic/English mixed documents was the hardest problem. I ended up building a dual-engine pipeline (Google ML Kit + Tesseract) that tries multiple image preprocessing variants and 4 orientations, scores each candidate, and picks the best result.

Not elegant, but it works.

---

Built with: Flutter · flutter_bloc · SQLite · Google ML Kit · Tesseract · fl_chart

Would love feedback from other Flutter developers — especially if you've tackled mobile OCR before. Drop a comment 👇

---

**#Flutter #Dart #MobileApp #DocumentManagement #OCR #FlutterDev #OpenSource**

---

**Posting Tips:**
- Best time: Tuesday–Thursday, 8–10 AM in your target market timezone
- Lead with a carousel of 3–5 screenshots (LinkedIn carousels get 3x more impressions than single images)
- Pin the GitHub link in the first comment, not the post body
- End with a genuine question — posts with comments rank higher
- Tag 1–2 Flutter community accounts if they're relevant (Flutter, FlutterDev)

---

---

## Post C: Technical English Audience

---

**[Header image: code snippet from ProfessionalOcrService or architecture diagram]**

I built a mobile document archiving app in Flutter and ran into some interesting engineering problems. Thread on the three most non-obvious ones:

---

**🧵 1/4 — The OCR accuracy problem on mixed Arabic/English documents**

Google ML Kit is excellent for Latin scripts but struggles with Arabic. Tesseract handles Arabic well with proper training data but degrades on mixed content. Using either alone gave ~60% accuracy on real-world invoices.

My solution: run both engines, try 4 image orientations and 3 preprocessing variants for each, score every candidate by text length and character quality, pick the winner. Went from ~60% to ~85% accuracy on mixed documents.

Key insight: "best effort" OCR is more valuable than "failed OCR" — even a partially correct result lets full-text search work.

---

**🧵 2/4 — PDF OCR crashes on mid-range Android**

Rasterizing a 50-page PDF at 150 DPI to bitmaps in memory = instant OOM on devices with 3–4GB RAM.

Fix: hard limits (3 pages max, 72 DPI, 12MB max file size) + `Printing.raster()` streams pages one at a time instead of loading the whole document. Peak memory stays constant regardless of page count.

Lesson: On mobile, correctness isn't enough — resource budgets are constraints, not guidelines.

---

**🧵 3/4 — Theme color changes causing full MaterialApp rebuilds**

Stored custom primary color in a Cubit. Every `emit()` rebuilt MaterialApp. Visible flicker.

Fix: `ValueNotifier<Color?>` for the color, `ValueListenableBuilder` wrapping only the ThemeData resolution. Cubit still handles theme enum (16 prebuilt themes). Color changes are instant with zero rebuild overhead.

Rule: Don't reach for Cubit for everything. `ValueNotifier` is underrated for single-value hot paths.

---

**🧵 4/4 — Stack**
- Flutter · Dart 3.9 · flutter_bloc (Cubit)
- SQLite (sqflite) with additive-only schema migrations
- Google ML Kit + Tesseract OCR (dual engine)
- pdf + printing for PDF generation and page rasterization
- fl_chart for analytics, gen_l10n for AR/EN localization

GitHub link in comments. Happy to discuss any of these further 👇

---

**#Flutter #Dart #MobileEngineering #OCR #PDF #FlutterBloc #SoftwareArchitecture #MobilePerformance**

---

**Posting Tips:**
- Thread format performs well with technical audiences — it signals depth
- The "3 interesting problems" framing is more engaging than a feature list
- Post between 7–9 AM UTC on a weekday for maximum global reach
- Share the OCR code snippet as a screenshot (syntax-highlighted code images get more engagement than text)
- Consider cross-posting a condensed version to dev.to with a full technical writeup — link from LinkedIn
- Tag Flutter-specific communities: Flutter, FlutterDev subreddit, Flutter Discord — announce there too
- Respond to technical questions in comments with actual code/specifics to build credibility

---

---

## General LinkedIn Tips

### Timing
- **Best days:** Tuesday, Wednesday, Thursday
- **Best times:** 8–10 AM and 12–2 PM in your target audience's timezone
- **Avoid:** Friday afternoon, weekends (business-focused content underperforms)

### Media
- Always include at least one image — text-only posts get ~50% less reach
- Carousels (PDF slides) consistently outperform single images for technical content
- Video demo (even a 30-second screen recording) gets the highest reach of all formats

### Engagement Tactics
- Post the GitHub/project link as the **first comment**, not in the post body — LinkedIn suppresses posts with external links
- Ask a specific question at the end — not "what do you think?" but "have you solved X? how?"
- Reply to every comment within 2 hours of posting — the algorithm rewards early engagement signals
- Edit the post within 30 minutes to fix typos if needed — edits after that can hurt reach

### Hashtag Strategy
- Use 3–5 hashtags maximum — more looks spammy
- Mix high-volume (#Flutter, #MobileApp) with niche (#FlutterBloc, #OCR) tags
- Arabic posts: add both English and Arabic hashtags for broader reach
