(function (global) {
  const profile = {
    name: "Mohamad Adib Tawil",
    email: "mohamad.adib.tawil@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/mohamad-adib-tawil-54024b314/",
    githubUrl: "https://github.com/Mohamad-Adib-Tawil",
    avatarUrl:
      "https://avatars.githubusercontent.com/u/223110350?s=400&u=75cb795be7688812bda8863968c8139a0fe6a96a&v=4",
    hireMailSubject: "Hiring - Flutter Developer",
  };

  const downloads = {
    files: {
      en: {
        docx: "assets/downloads/CV_EN.docx",
        pdf: "assets/downloads/CV_EN.pdf",
      },
      ar: {
        docx: "assets/downloads/CV_AR.docx",
        pdf: "assets/downloads/CV_AR.pdf",
      },
    },
    plainTextPath: "assets/cv/CV_Text_EN_AR.md",
  };

  const stats = [
    {
      icon: "fas fa-calendar-alt",
      value: 3,
      label: {
        en: "Years Experience",
        ar: "سنوات الخبرة",
      },
    },
    {
      icon: "fas fa-mobile-alt",
      value: 5,
      label: {
        en: "Apps Developed",
        ar: "تطبيقات مطوّرة",
      },
    },
    {
      icon: "fas fa-download",
      value: 5000,
      label: {
        en: "Total Downloads",
        ar: "إجمالي التنزيلات",
      },
    },
    {
      icon: "fas fa-star",
      value: 3,
      label: {
        en: "Years Contract Work",
        ar: "سنوات عمل مستقل/عقود",
      },
    },
  ];

  const projects = [
    {
      id: "iklk",
      name: "LKLK",
      tech: ["Flutter", "Zego Express", "ZIM", "Appwrite", "BLoC", "Hive"],
      image: {
        src: "https://play-lh.googleusercontent.com/SprB1SlxKXYMOK-ZO4iOe1An9fgJ7dgDW-JhRYan9YMphWuEFiSoGH2l0lhNmJuYBtQ=w480-h960-rw",
        alt: {
          en: "LKLK live chat app screenshot",
          ar: "لقطة شاشة لتطبيق LKLK",
        },
      },
      description: {
        en: `Real-time audio rooms social app with live rooms, messaging, virtual gifts, and in-app purchases. Integrated Zego Express and ZIM for audio streaming/signaling with Appwrite backend services, local storage, crash reporting, and production release hardening. Public result: 5,000+ downloads. <a href="https://play.google.com/store/apps/details?id=com.bwmatbw.lklklivechatapp" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Play Store</a>`,
        ar: `تطبيق اجتماعي لغرف الصوت المباشرة مع غرف حيّة، رسائل، هدايا افتراضية، ومشتريات داخل التطبيق. تم دمج Zego Express وZIM للبث والإشارة مع Appwrite، وإضافة تخزين محلي، Crashlytics، وتجهيزات إصدار إنتاجي. النتيجة العامة: 5,000+ تنزيل. <a href="https://play.google.com/store/apps/details?id=com.bwmatbw.lklklivechatapp" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Google Play</a>`,
      },
    },
    {
      id: "wolfera",
      name: "Wolfera",
      tech: ["Flutter", "Supabase", "Clean Architecture", "Dartz/Either", "GoRouter"],
      image: {
        src: "https://raw.githubusercontent.com/Mohamad-Adib-Tawil/Wolfera/main/assets/images/appIcon.png",
        alt: {
          en: "Wolfera car marketplace app icon",
          ar: "أيقونة تطبيق Wolfera",
        },
      },
      description: {
        en: `Automotive marketplace flows for car discovery, search, authentication, media storage, and buyer/seller communication. Used Supabase Auth, Storage, and Realtime, with typed error handling and infinite pagination for network-driven lists. <a href="https://github.com/Mohamad-Adib-Tawil/Wolfera" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a> · <a href="https://play.google.com/store/apps/details?id=com.wolfera.wolfera" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Play Store</a>`,
        ar: `سوق سيارات لتدفّقات اكتشاف السيارات والبحث والمصادقة وتخزين الوسائط والتواصل بين البائع والمشتري. استخدم Supabase Auth وStorage وRealtime مع معالجة أخطاء typed وترقيم لا نهائي للقوائم الشبكية. <a href="https://github.com/Mohamad-Adib-Tawil/Wolfera" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a> · <a href="https://play.google.com/store/apps/details?id=com.wolfera.wolfera" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Google Play</a>`,
      },
    },
    {
      id: "codebook",
      name: "Code Book",
      tech: ["Flutter", "Clean Architecture", "BLoC", "Hive", "Dio", "WebView"],
      image: {
        src: "https://raw.githubusercontent.com/Mohamad-Adib-Tawil/Code-Books-/main/assets/images/logo.png?raw=1",
        alt: {
          en: "Code Book educational app logo",
          ar: "شعار تطبيق Code Book",
        },
      },
      description: {
        en: `Offline digital library that consumes Open Library APIs and supports cached content for offline access. Implemented local caching, retry handling, deep linking, and structured navigation as an API integration and Flutter architecture practice project. <a href="https://github.com/Mohamad-Adib-Tawil/Code-Books-" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>`,
        ar: `مكتبة رقمية دون اتصال تعتمد على Open Library APIs وتدعم المحتوى المخزّن للاستخدام دون إنترنت. تم تنفيذ التخزين المحلي، إعادة المحاولة، الروابط العميقة، والتنقّل المنظّم كمشروع لتقوية تكامل APIs ومعمارية Flutter. <a href="https://github.com/Mohamad-Adib-Tawil/Code-Books-" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>`,
      },
    },
    {
      id: "office",
      name: "Office Archiving",
      tech: ["Flutter", "Google ML Kit", "Tesseract OCR", "SQLite", "PDF Processing"],
      image: {
        src: "https://play-lh.googleusercontent.com/2xsTQC6G7T22nIa93fSh6dxw-l92NLMWhKXskipm7KbKs84NZUI9rwoWgWh3AGOReTM=w480-h960-rw",
        alt: {
          en: "Office Archiving app screenshot",
          ar: "لقطة شاشة لتطبيق Office Archiving",
        },
      },
      description: {
        en: `Offline-first document scanning and archiving app for local document organization. Implemented Arabic/English OCR, PDF generation, printing, local full-text search, and SQLite-backed storage so core document flows work without a constant internet connection. <a href="https://github.com/Mohamad-Adib-Tawil/office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a> · <a href="https://play.google.com/store/apps/details?id=com.werewolf.office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Play Store</a>`,
        ar: `تطبيق أرشفة ومسح مستندات يعمل بمنهجية offline-first لتنظيم المستندات محلياً. تم تنفيذ OCR عربي/إنجليزي، إنشاء PDF، الطباعة، البحث النصي المحلي، وتخزين SQLite حتى تبقى تدفقات المستندات الأساسية قابلة للاستخدام دون اتصال دائم. <a href="https://github.com/Mohamad-Adib-Tawil/office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a> · <a href="https://play.google.com/store/apps/details?id=com.werewolf.office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Google Play</a>`,
      },
    },
    {
      id: "quran",
      name: "Quran Ahmed Karasi",
      tech: ["Flutter", "Cubit", "just_audio", "Offline Audio"],
      image: {
        src: "https://raw.githubusercontent.com/Mohamad-Adib-Tawil/Quran/main/assets/home/%D8%B5%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D8%B4%D9%8A%D8%AE%20%D8%A7%D8%AD%D9%85%D8%AF%20%D9%83%D8%B1%D8%A7%D8%B3%D9%8A%20%D8%A7%D9%84%D8%B4%D8%AE%D8%B5%D9%8A%D8%A9.png",
        alt: {
          en: "Quran Ahmed Karasi app icon",
          ar: "أيقونة تطبيق قرآن أحمد كراسي",
        },
      },
      description: {
        en: `Offline Quran reader and audio app with offline audio downloads, background playback, and ayah-level interaction. Implemented Surah, Juz, and Hizb navigation with text-audio synchronization, Arabic/German localization, and a Material 3 interface for Android and iOS. <a href="https://github.com/Mohamad-Adib-Tawil/Quran" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a> · <a href="https://play.google.com/store/apps/details?id=com.ahmadkarasi.quran&pli=1" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Play Store</a> · <a href="https://apps.apple.com/app/id6759857104" target="_blank" rel="noopener noreferrer"><i class="fab fa-apple"></i> App Store</a>`,
        ar: `تطبيق قرآن للقراءة والصوت دون اتصال مع تنزيلات صوتية، تشغيل بالخلفية، وتفاعل على مستوى الآية. تم تنفيذ تنقّل السور والأجزاء والأحزاب مع مزامنة النص والصوت، ودعم العربية/الألمانية، وواجهة Material 3 على Android وiOS. <a href="https://github.com/Mohamad-Adib-Tawil/Quran" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a> · <a href="https://play.google.com/store/apps/details?id=com.ahmadkarasi.quran&pli=1" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Google Play</a> · <a href="https://apps.apple.com/app/id6759857104" target="_blank" rel="noopener noreferrer"><i class="fab fa-apple"></i> App Store</a>`,
      },
    },
  ];

  const translations = {
    en: {
      nav: {
        summary: "Summary",
        experience: "Experience",
        projects: "Projects",
        skills: "Skills",
        education: "Education",
        achievements: "Achievements",
        advanced: "Advanced Skills",
        services: "Services",
        languages: "Languages",
        download: "Download CV",
      },
      header: {
        jobTitle: "Flutter Developer / Mobile Application Engineer",
        availability: "Available for Freelance",
        employment: "Open to Full-time/Contract",
        badges: [
          "Remote from Syria",
          "Google Play published",
          "App Store published",
          "Offline-first flows",
          "Clean Architecture",
        ],
        ctaWork: "View My Work",
        ctaContact: "Get in Touch",
        ctaWebsite: "GitHub",
        ctaDownload: "Download Resume (PDF)",
        ctaHire: "Hire Me",
      },
      titles: {
        summary: "Professional Summary",
        experience: "Work Experience",
        projects: "Selected Projects",
        skills: "Core Skills",
        education: "Education",
        achievements: "Key Achievements",
        advanced: "Advanced Skills",
        services: "Services Offered",
        languages: "Languages",
      },
      footer: {
        quickLinksTitle: "Quick Links",
        connectTitle: "Connect",
        infoTitle: "Info",
        quickLinks: {
          summary: "Summary",
          experience: "Experience",
          projects: "Projects",
          skills: "Skills",
          download: "Download CV",
        },
      },
      downloadsPage: {
        backToCv: "Back to CV",
        title: "Download CV",
        subtitle: "Flutter Developer / Mobile Application Engineer • Remote from Syria",
        downloadsTitle: "CV Downloads",
        downloadsIntro:
          'Place your DOCX/PDF files in <code>assets/downloads/</code>. Use the filenames below so links work automatically.',
        englishLabel: "English",
        arabicLabel: "العربية",
        exportWord: "Generate Word (current language)",
        exportATS: "Generate ATS Word",
        plainTextTitle: "Plain Text Version",
        plainTextIntro: "You can copy the bilingual CV text directly from",
        fileUnavailable: "Soon — file will be available shortly.",
        atsSummary:
          "Flutter Developer / Mobile Application Engineer with 3+ years of independent and contract experience. Production-oriented Flutter/Dart apps, Clean Architecture, BLoC/Cubit, Supabase/Appwrite/Firebase, offline-first flows, audio features, OCR/document workflows, and store publishing.",
        keywords: [
          "Flutter",
          "Dart",
          "BLoC/Cubit",
          "Clean Architecture",
          "Supabase",
          "Firebase",
          "Appwrite",
          "Zego Cloud",
          "WebSocket",
          "Realtime",
          "OCR",
          "ML Kit",
          "Tesseract",
          "Hive",
          "SQLite",
        "Material 3",
        "Google Play",
        "App Store",
        ],
      },
      summaryText:
        "Flutter developer with 3+ years of independent and contract experience building production-oriented mobile apps with Flutter and Dart. I work across UI implementation, API integration, offline storage, real-time features, release preparation, and store publishing. My strongest work is in Clean Architecture, BLoC/Cubit, Supabase/Appwrite/Firebase integrations, offline-first flows, audio features, OCR/document workflows, and apps that need to stay usable under weak network conditions.",
      experienceRole: "Flutter Developer, Independent / Contract — 07/2022 – Present",
      experienceList: [
        "Built and maintained Flutter applications for independent and contract projects, covering UI implementation, API integration, local persistence, release preparation, and publishing.",
        "Structured medium-sized apps using Clean Architecture, BLoC/Cubit, GetIt, and feature-based modules to keep UI, business logic, and data layers separated.",
        "Integrated REST APIs, Supabase, Appwrite, WebSockets, Zego audio rooms, messaging flows, Firebase services, and in-app purchases.",
        "Implemented offline-first behavior with Hive, SQLite, pagination, retry handling, and typed failure responses to make key flows more predictable.",
        "Prepared production builds with app flavors, ProGuard/R8, Crashlytics, secure storage, and separate development/production environments.",
        "Used isolates and background processing for heavier work such as OCR, PDF handling, audio features, and background tasks.",
        "Published and maintained apps on Google Play and App Store, including one public app with 5,000+ downloads.",
      ],
      skillsList: [
        "Flutter & Mobile: Flutter, Dart, Material 3, Android, iOS",
        "Architecture & State: Clean Architecture, SOLID, MVVM, BLoC, Cubit, Provider, GetIt, Injectable, Dartz/Either",
        "APIs & Backend Services: REST APIs, Dio, Interceptors, WebSockets, Supabase, Appwrite, Firebase Auth, FCM, Analytics, Crashlytics",
        "Storage & Offline: Hive, SQLite, Secure Storage, offline-first caching, pagination, retry handling",
        "Media, OCR & Documents: Zego Express, ZIM, LiveKit, just_audio, audio recording, Google ML Kit, Tesseract OCR, PDF generation, printing",
        "Release & Tools: ProGuard/R8, app flavors, isolates, background tasks, image optimization, Google Play, App Store, Git, GitHub, Postman, Figma",
      ],
      education: {
        heading: "Diploma in Computer Engineering, University of Aleppo (2020–2022)",
        items: ["Focus: Software Engineering", "Aleppo, Syria"],
      },
      achievements: [
        "Published and maintained apps on Google Play and App Store",
        "Delivered one public app with 5,000+ downloads",
        "Built real-time audio rooms, messaging flows, virtual gifts, and in-app purchases",
        "Implemented Arabic/English OCR, PDF generation, printing, and local full-text search",
        "Built offline-first flows with Hive, SQLite, pagination, retry handling, and typed failures",
      ],
      advancedSkills: [
        "Clean Architecture with feature-based modules and separated UI, business, and data layers",
        "Offline-first mobile flows using Hive, SQLite, pagination, retry handling, and typed failure responses",
        "Real-time integrations with WebSockets, Supabase Realtime, Zego Express, and ZIM",
        "Document workflows including OCR, PDF handling, printing, and local full-text search",
        "Production release preparation with flavors, ProGuard/R8, Crashlytics, secure storage, and separate environments",
      ],
      services: [
        "End-to-end mobile app development (iOS & Android) from concept to deployment",
        "UI implementation, API integration, local persistence, and release preparation",
        "Real-time features: audio rooms, messaging flows, WebSockets, and Supabase Realtime",
        "OCR and document workflows with ML Kit, Tesseract OCR, SQLite, PDF generation, and printing",
        "Offline-first architecture with caching, retry handling, and predictable error states",
        "Backend service integration with Supabase, Appwrite, Firebase, and REST APIs",
        "Store publishing and production build preparation for Google Play and App Store",
      ],
      languagesText: "Arabic (Native), English (Technical working proficiency)",
    },
    ar: {
      nav: {
        summary: "الملخص",
        experience: "الخبرة",
        projects: "المشاريع",
        skills: "المهارات",
        education: "التعليم",
        achievements: "الإنجازات",
        advanced: "مهارات متقدمة",
        services: "الخدمات",
        languages: "اللغات",
        download: "تحميل السيرة",
      },
      header: {
        jobTitle: "مطوّر Flutter / مهندس تطبيقات موبايل",
        availability: "متاح للعمل الحر",
        employment: "متاح لعقود/دوام كامل",
        badges: [
          "عن بُعد من سوريا",
          "تطبيقات منشورة على Google Play",
          "تطبيقات منشورة على App Store",
          "تدفّقات Offline-first",
        ],
        ctaWork: "استعرض أعمالي",
        ctaContact: "تواصل معي",
        ctaWebsite: "GitHub",
        ctaDownload: "تحميل السيرة (PDF)",
        ctaHire: "وظّفني",
      },
      titles: {
        summary: "الملخص المهني",
        experience: "الخبرة العملية",
        projects: "أبرز المشاريع",
        skills: "المهارات الأساسية",
        education: "التعليم",
        achievements: "أهم الإنجازات",
        advanced: "مهارات متقدمة",
        services: "الخدمات المقدّمة",
        languages: "اللغات",
      },
      footer: {
        quickLinksTitle: "روابط سريعة",
        connectTitle: "تواصل",
        infoTitle: "معلومات",
        quickLinks: {
          summary: "الملخص",
          experience: "الخبرة",
          projects: "المشاريع",
          skills: "المهارات",
          download: "تحميل السيرة",
        },
      },
      downloadsPage: {
        backToCv: "العودة إلى السيرة",
        title: "تحميل السيرة الذاتية",
        subtitle: "مطوّر Flutter / مهندس تطبيقات موبايل • عن بُعد من سوريا",
        downloadsTitle: "تنزيلات السيرة الذاتية",
        downloadsIntro:
          'ضع ملفات DOCX/PDF داخل <code>assets/downloads/</code>. استخدم أسماء الملفات التالية ليعمل الربط تلقائيًا.',
        englishLabel: "English",
        arabicLabel: "العربية",
        exportWord: "إنشاء ملف Word (للغة الحالية)",
        exportATS: "إنشاء ملف ATS Word",
        plainTextTitle: "النسخة النصية",
        plainTextIntro: "يمكنك نسخ النسخة الثنائية اللغة مباشرة من",
        fileUnavailable: "قريبًا — الملف سيتوفر خلال وقت قصير.",
        atsSummary:
          "مطوّر Flutter / مهندس تطبيقات موبايل بخبرة 3+ سنوات في العمل المستقل والعقود. خبرة في تطبيقات Flutter/Dart الإنتاجية، Clean Architecture، BLoC/Cubit، Supabase/Appwrite/Firebase، تدفقات offline-first، ميزات الصوت، OCR/المستندات، والنشر على المتاجر.",
        keywords: [
          "Flutter",
          "Dart",
          "BLoC/Cubit",
          "المعمارية النظيفة",
          "Supabase",
          "Firebase",
          "Appwrite",
          "Zego Cloud",
          "WebSocket",
          "Realtime",
          "OCR",
          "ML Kit",
          "Tesseract",
          "Hive",
          "SQLite",
        "Material 3",
        "Google Play",
        "App Store",
        ],
      },
      summaryText:
        "مطوّر Flutter بخبرة 3+ سنوات في العمل المستقل والعقود، مع بناء تطبيقات موبايل موجهة للإنتاج باستخدام Flutter وDart. أعمل على تنفيذ الواجهات، تكامل APIs، التخزين المحلي، ميزات الوقت الحقيقي، تجهيز الإصدارات، والنشر على المتاجر. أقوى خبراتي في Clean Architecture وBLoC/Cubit وتكامل Supabase/Appwrite/Firebase وتدفّقات offline-first وميزات الصوت وOCR/المستندات والتطبيقات التي يجب أن تبقى قابلة للاستخدام في ظروف الشبكة الضعيفة.",
      experienceRole: "مطوّر Flutter (مستقل/عقود) — 07/2022 – حتى الآن",
      experienceList: [
        "بناء وصيانة تطبيقات Flutter لمشاريع مستقلة وعقود تشمل تنفيذ الواجهات، تكامل APIs، التخزين المحلي، تجهيز الإصدارات، والنشر.",
        "تنظيم تطبيقات متوسطة الحجم باستخدام Clean Architecture وBLoC/Cubit وGetIt ووحدات feature-based لفصل الواجهة ومنطق العمل وطبقة البيانات.",
        "دمج REST APIs وSupabase وAppwrite وWebSockets وغرف Zego الصوتية وتدفّقات الرسائل وخدمات Firebase والمشتريات داخل التطبيق.",
        "تنفيذ سلوك offline-first باستخدام Hive وSQLite والترقيم وإعادة المحاولة وأخطاء typed لجعل التدفقات الأساسية أكثر توقّعية.",
        "تجهيز إصدارات إنتاجية باستخدام app flavors وProGuard/R8 وCrashlytics والتخزين الآمن وبيئات تطوير/إنتاج منفصلة.",
        "استخدام isolates والمعالجة الخلفية للأعمال الأثقل مثل OCR والتعامل مع PDF وميزات الصوت والمهام الخلفية.",
        "نشر وصيانة تطبيقات على Google Play وApp Store، منها تطبيق عام واحد حقق 5,000+ تنزيل.",
      ],
      skillsList: [
        "Flutter والموبايل: Flutter، Dart، Material 3، Android، iOS",
        "المعمارية وإدارة الحالة: Clean Architecture، SOLID، MVVM، BLoC، Cubit، Provider، GetIt، Injectable، Dartz/Either",
        "APIs وخدمات الخلفية: REST APIs، Dio، Interceptors، WebSockets، Supabase، Appwrite، Firebase Auth، FCM، Analytics، Crashlytics",
        "التخزين والعمل دون اتصال: Hive، SQLite، Secure Storage، offline-first caching، pagination، retry handling",
        "الوسائط وOCR والمستندات: Zego Express، ZIM، LiveKit، just_audio، audio recording، Google ML Kit، Tesseract OCR، PDF generation، printing",
        "الإصدار والأدوات: ProGuard/R8، app flavors، isolates، background tasks، image optimization، Google Play، App Store، Git، GitHub، Postman، Figma",
      ],
      education: {
        heading: "دبلوم هندسة حاسبات، جامعة حلب (2020–2022)",
        items: ["التركيز: هندسة البرمجيات", "حلب، سوريا"],
      },
      achievements: [
        "نشر وصيانة تطبيقات على Google Play وApp Store",
        "تسليم تطبيق عام واحد حقق 5,000+ تنزيل",
        "بناء غرف صوت لحظية وتدفّقات رسائل وهدايا افتراضية ومشتريات داخل التطبيق",
        "تنفيذ OCR عربي/إنجليزي وإنشاء PDF والطباعة والبحث النصي المحلي",
        "بناء تدفّقات offline-first باستخدام Hive وSQLite والترقيم وإعادة المحاولة وأخطاء typed",
      ],
      advancedSkills: [
        "Clean Architecture مع وحدات feature-based وفصل الواجهة ومنطق العمل وطبقة البيانات",
        "تدفّقات offline-first باستخدام Hive وSQLite والترقيم وإعادة المحاولة وأخطاء typed",
        "تكاملات الوقت الحقيقي عبر WebSockets وSupabase Realtime وZego Express وZIM",
        "تدفّقات المستندات: OCR، معالجة PDF، الطباعة، والبحث النصي المحلي",
        "تجهيز الإصدارات الإنتاجية باستخدام flavors وProGuard/R8 وCrashlytics والتخزين الآمن وبيئات منفصلة",
      ],
      services: [
        "تطوير تطبيقات موبايل شاملة (iOS وAndroid) من الفكرة للنشر",
        "تنفيذ الواجهات، تكامل APIs، التخزين المحلي، وتجهيز الإصدارات",
        "ميزات الوقت الحقيقي: غرف صوت، رسائل، WebSockets، وSupabase Realtime",
        "OCR وتدفّقات المستندات باستخدام ML Kit وTesseract OCR وSQLite وإنشاء PDF والطباعة",
        "معمارية offline-first مع caching وإعادة المحاولة وحالات خطأ توقّعية",
        "تكامل خدمات الخلفية مع Supabase وAppwrite وFirebase وREST APIs",
        "النشر على المتاجر وتجهيز الإصدارات الإنتاجية لـGoogle Play وApp Store",
      ],
      languagesText: "العربية (لغة أم)، الإنجليزية (كفاءة عمل تقنية)",
    },
  };

  const CV_DATA = {
    profile,
    downloads,
    stats,
    projects,
    translations,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = CV_DATA;
  }

  global.CV_DATA = CV_DATA;
})(typeof window !== "undefined" ? window : globalThis);
