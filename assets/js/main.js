document.addEventListener('DOMContentLoaded', function() {
  // Helpers
  const enableThemeTransition = () => {
    document.body.classList.add('theme-transition');
    window.setTimeout(() => document.body.classList.remove('theme-transition'), 300);
  };

  const updateThemeColorMeta = () => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    const cs = getComputedStyle(document.body);
    const primary = cs.getPropertyValue('--primary-color').trim() || '#0066cc';
    meta.setAttribute('content', primary);
  };

  // Simple contrast check (WCAG approx) and adjustment for body text
  const luminance = (r, g, b) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };
  const parseRGB = (str) => {
    const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return [0,0,0];
    return [parseInt(m[1],10), parseInt(m[2],10), parseInt(m[3],10)];
  };
  const contrastRatio = (rgb1, rgb2) => {
    const L1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    const L2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    const light = Math.max(L1, L2) + 0.05;
    const dark = Math.min(L1, L2) + 0.05;
    return light / dark;
  };
  const updateContrast = () => {
    const cs = getComputedStyle(document.body);
    const bodyBg = cs.backgroundColor;
    const bodyColor = cs.color;
    const ratio = contrastRatio(parseRGB(bodyBg), parseRGB(bodyColor));
    if (ratio < 4.5) {
      // If background is light, force darker text; else force lighter text
      const [r,g,b] = parseRGB(bodyBg);
      const L = luminance(r,g,b);
      const target = L > 0.5 ? '#111111' : '#f5f5f5';
      document.documentElement.style.setProperty('--dark-text', target);
    } else {
      // reset to theme default
      document.documentElement.style.removeProperty('--dark-text');
    }
  };
  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  // Apply saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    themeToggle.setAttribute('aria-pressed', 'false');
  }
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const dark = document.body.classList.contains('dark-mode');
    themeIcon.classList.toggle('fa-sun', dark);
    themeIcon.classList.toggle('fa-moon', !dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    themeToggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
  });

  // Scroll animations with stagger effect
  const elementsToAnimate = document.querySelectorAll('section, .project-table, .skill-category, header');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = entry.target.classList.contains('skill-category') ? index * 100 : 100;
        setTimeout(() => { entry.target.classList.add('fade-in'); }, delay);
      }
    });
  }, { threshold: 0.1 });
  elementsToAnimate.forEach(element => observer.observe(element));

  // Scroll spy: highlight active nav link
  const navLinks = Array.from(document.querySelectorAll('.top-nav a[href^="#"]'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach(a => {
      const isActive = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('active', isActive);
      if (isActive) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(sec => spyObserver.observe(sec));

  // Theme presets switcher
  const presetSelect = document.getElementById('themePreset');
  const applyPreset = (preset) => {
    document.body.classList.remove('theme-blue','theme-purple','theme-teal','theme-slate','theme-navy','theme-emerald','theme-midnight','theme-royal','theme-silver');
    switch (preset) {
      case 'purple': document.body.classList.add('theme-purple'); break;
      case 'teal': document.body.classList.add('theme-teal'); break;
      case 'slate': document.body.classList.add('theme-slate'); break;
      case 'navy': document.body.classList.add('theme-royal'); break; // legacy mapping
      case 'emerald': document.body.classList.add('theme-silver'); break; // legacy mapping
      case 'royal': document.body.classList.add('theme-royal'); break;
      case 'silver': document.body.classList.add('theme-silver'); break;
      case 'midnight': document.body.classList.add('theme-midnight'); break;
      default: document.body.classList.add('theme-blue');
    }
    updateThemeColorMeta();
    updateContrast();
  };
  // Load saved preset (default blue)
  let savedPreset = localStorage.getItem('themePreset') || 'blue';
  if (savedPreset === 'navy') savedPreset = 'royal';
  if (savedPreset === 'emerald') savedPreset = 'silver';
  applyPreset(savedPreset);
  if (presetSelect) presetSelect.value = savedPreset;
  // If midnight preset is selected, ensure dark mode is active
  if (savedPreset === 'midnight' && !document.body.classList.contains('dark-mode')) {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    themeToggle.setAttribute('aria-pressed', 'true');
    localStorage.setItem('theme', 'dark');
  }
  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      enableThemeTransition();
      applyPreset(val);
      localStorage.setItem('themePreset', val);
      if (val === 'midnight') {
        // Force dark mode for midnight
        if (!document.body.classList.contains('dark-mode')) {
          document.body.classList.add('dark-mode');
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
          themeToggle.setAttribute('aria-pressed', 'true');
        }
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // ===== i18n (English / Arabic) =====
  const i18n = {
    en: {
      nav: {summary:'Summary',experience:'Experience',projects:'Projects',skills:'Skills',education:'Education',achievements:'Achievements',advanced:'Advanced Skills',services:'Services',languages:'Languages',download:'Download CV'},
      header: {jobTitle:'Mid-level Flutter Developer | Mobile Application Engineer',availability:'Available for Freelance',employment:'Open to Full-time/Contract',badges:['Remote (GMT+3)','Google Play published','Clean, maintainable code','Bilingual AR/EN'],ctaWork:'View My Work',ctaContact:'Get in Touch',ctaWebsite:'GitHub',ctaDownload:'Download Resume (PDF)',ctaHire:'Hire Me'},
      titles:{summary:'Professional Summary',experience:'Work Experience',projects:'Selected Projects',skills:'Core Skills',education:'Education',achievements:'Key Achievements',advanced:'Advanced Skills',services:'Services Offered',languages:'Languages'},
      summaryText:'Results-driven Flutter Developer with over 3 years of experience building and maintaining production mobile applications. Strong background in Clean Architecture and SOLID principles, with a focus on robust error handling and scalable architecture. Experienced in integrating real-time audio systems, OCR solutions, and advanced state management (BLoC/Cubit). Specialized in optimizing app performance, improving stability, and delivering secure, maintainable cross-platform solutions for iOS and Android.',
      experienceRole:'Flutter Developer (Independent / Contract) — 07/2022 – Present',
      experienceList:[
        'Architected and delivered multiple production mobile applications using Clean Architecture.',
        'Implemented functional error handling using Either to improve stability and predictability.',
        'Configured ProGuard/R8 rules to enhance application security and reduce APK size.',
        'Developed offline caching layers using Hive and SQLite for better user experience.',
        'Implemented App Flavoring to manage Development and Production environments.',
        'Optimized UI performance using Isolates and background processing for heavy tasks.'
      ],
      projectsDesc:{
        iklk:'Tech: Zego Cloud, Appwrite, BLoC, GetIt, Hive, ProGuard, Crashlytics — Developed a social platform with real-time audio rooms and messaging. Integrated Zego Express and ZIM for audio streaming and signaling. Secured the application using ProGuard obfuscation. Implemented virtual gifting and in-app purchases. Link: <a href="https://play.google.com/store/apps/details?id=com.bwmatbw.lklklivechatapp" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Play Store</a>',
        wolfera:'Tech: Supabase, Clean Architecture, Dartz (Either), Infinite Pagination, GoRouter — Built a marketplace with advanced search and real-time chat. Integrated Supabase for authentication, storage, and realtime features. Applied functional error handling to improve network reliability. Link: <a href="https://github.com/Mohamad-Adib-Tawil/Wolfera" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>',
        codebook:'Tech: Clean Architecture, BLoC, GetIt, Hive, Dio, WebView — Developed an offline reading application using Open Library APIs. Implemented caching and retry mechanisms. Built deep linking and advanced navigation flows. <a href="https://github.com/Mohamad-Adib-Tawil/Code-Books-" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>',
        office:'Tech: Google ML Kit, Tesseract OCR, SQLite, PDF Processing — Developed an offline-first document scanning and archiving system. Implemented bilingual OCR (Arabic/English). Built PDF generation and printing features. Added full-text search using indexed local databases. Links: <a href="https://play.google.com/store/apps/details?id=com.werewolf.office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Play Store</a> · <a href="https://github.com/Mohamad-Adib-Tawil/office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>'
      },
      skillsList:[
        'Architecture & Logic: Clean Architecture (Data/Domain/Presentation), SOLID, MVVM, Functional Error Handling (Either/Dartz), DI (GetIt/Injectable), Codegen (Freezed, JsonSerializable)',
        'State Management: BLoC, Cubit, Provider, Bloc Concurrency (Droppable/Restartable)',
        'Networking & Data: REST (Dio + Interceptors), WebSockets, Offline-first, Smart Caching (Hive/SQLite), Secure Storage, Infinite Pagination, Postman Testing',
        'Real-time & Media: Zego Cloud (Express & ZIM), LiveKit, Just_Audio, Audio Recording, SVGA/Lottie',
        'System & Performance: ProGuard/R8, App Flavors (Dev/Prod), Isolates, Image Optimization, Background/Foreground Tasks',
        'AI & Services: OCR (Tesseract, Google ML Kit), Firebase (Auth/FCM/Analytics/Crashlytics), Supabase, Appwrite, In-App Purchases, Google Mobile Ads',
        'UI/UX: Responsive Design, Figma-to-Code, Dark/Light Mode, Internationalization (i18n)'
      ],
      education:{heading:'University of Aleppo — Diploma in Computer Engineering (2020–2022)', items:['Software Engineering Track']},
      achievements:[
        'Shipped production mobile apps to Google Play',
        'Built real-time chat and live audio features',
        'Implemented offline OCR and PDF processing',
        'Optimized performance and memory usage in Flutter apps',
        'Handled Play Console compliance and store assets'
      ],
      advancedSkills:[
        'Performance Engineering: Virtual scrolling, object pooling, debouncing, 3-tier adaptive modes',
        'Architecture Patterns: Clean Architecture, BLoC, Repository, DI with GetIt/Injectable',
        'Real-time Technologies: WebSocket, LiveKit, Server-Sent Events, Zego Express Engine, Supabase Realtime',
        'Mobile AI: OCR pipelines, image preprocessing, batch processing, text analysis',
        'Security: Certificate pinning, secure storage, OAuth 2.0, network resilience'
      ],
      services:[
        'End-to-end mobile app development (iOS & Android) from concept to deployment',
        'Real-time features: Live audio/video, chat systems, synchronized animations',
        'AI integration: OCR, ML Kit, image processing, text analysis, translation',
        'Performance optimization: Memory reduction, FPS improvement, adaptive scaling',
        'Backend architecture: Supabase, Firebase, Appwrite, custom APIs, WebSocket',
        'CI/CD setup: Automated pipelines, testing, deployment, monitoring',
        'Play Console compliance & publishing (privacy policy, permissions, content rating, store listing)'
      ],
      languagesText:'Arabic (Native), English (Good Technical English)',
      codebook:{
        highlightsSummary:'Highlights',
        techTitle:'Technical Skills',
        softTitle:'Soft Skills',
        impactTitle:'Professional Impact',
        cvEntryTitle:'CV Project Entry',
        techList:[
          '[Cross-platform Flutter delivery] Built a production-ready Android/iOS app with flutter_bloc, get_it, and clean architecture layering (presentation, domain, data).',
          '[Networking & resilience] Integrated Open Library API via dio, custom retry logic, structured failures, and pagination aligned with repository pattern.',
          '[Local persistence] Engineered offline-first flows using Hive (entity adapters, caching strategies, synchronization hooks).',
          '[UI/UX execution] Crafted premium theming, responsive layouts, dynamic WebView previews, and custom widgets (CustomAppBar, BookStackListBlocConsumer).',
          '[DevOps readiness] Automated branding assets (flutter_launcher_icons), prepared store collateral, and maintained pubspec.yaml hygiene for reproducible builds.'
        ],
        softList:[
          '[End-to-end ownership] Guided the project from analysis to launch without hand-offs, proving autonomy.',
          '[Product thinking] Balanced feature scope, usability, and compliance for Play Store publishing.',
          '[Problem solving & learning agility] Researched APIs, resolved integration issues, and refined architecture iteratively.',
          '[Time & risk management] Sequenced tasks (design → implementation → QA → assets) under self-imposed deadlines.',
          '[Documentation & communication] Produced prompts, descriptions, and deployment notes suitable for stakeholders.'
        ],
        impactList:[
          '[Faster feature delivery] Demonstrates ability to ship complex mobile solutions solo—reducing onboarding risk for employers.',
          '[Reusable architecture] Provides a template for future content-driven apps (education, media, libraries).',
          '[User value focus] Blends engineering with polished branding, showing commitment to user engagement and store readiness.'
        ],
        cvEntryList:[
          'Code Book – Cross-platform Flutter reading app (solo project)',
          'Engineered clean-architecture Flutter app (BLoC, GetIt, Hive) delivering offline-capable Open Library browsing with resilient Dio networking and pagination.',
          'Designed premium dark UI/UX, integrated WebView previews, and automated icon/theming assets for Play Store launch readiness.',
          'Led full lifecycle (analysis → design → development → QA → deployment collateral), proving autonomous product delivery.'
        ]
      }
    },
    ar: {
      nav:{summary:'الملخص',experience:'الخبرة',projects:'المشاريع',skills:'المهارات',education:'التعليم',achievements:'الإنجازات',advanced:'مهارات متقدمة',services:'الخدمات',languages:'اللغات',download:'تحميل السيرة'},
      header:{jobTitle:'مطوّر Flutter متوسط المستوى | مهندس تطبيقات موبايل',availability:'متاح للعمل الحر',employment:'متاح لعقود/دوام كامل',badges:['عن بُعد (GMT+3)','+1000 مستخدم متزامن','توافرية 99.9%','4 تطبيقات منشورة'],ctaWork:'استعرض أعمالي',ctaContact:'تواصل معي',ctaWebsite:'GitHub',ctaDownload:'تحميل السيرة (PDF)',ctaHire:'وظّفني'},
      titles:{summary:'الملخص المهني',experience:'الخبرة العملية',projects:'أبرز المشاريع',skills:'المهارات الأساسية',education:'التعليم',achievements:'أهم الإنجازات',advanced:'مهارات متقدمة',services:'الخدمات المقدّمة',languages:'اللغات'},
      summaryText:'مطوّر Flutter بنتائج ملموسة ولديه أكثر من 3 سنوات خبرة في بناء وصيانة تطبيقات موبايل إنتاجية. خلفية قوية في المعمارية النظيفة ومبادئ SOLID مع تركيز على معالجة الأخطاء بشكل وظيفي وبناء معماريات قابلة للتوسّع. خبرة بدمج أنظمة الصوت اللحظية وحلول OCR وإدارة الحالة المتقدّمة (BLoC/Cubit). مختص في تحسين الأداء والاستقرار وتقديم حلول عبر المنصّات آمنة وقابلة للصيانة على iOS وAndroid.',
      experienceRole:'مطوّر Flutter (مستقل/عقود) — 07/2022 – حتى الآن',
      experienceList:[
        'هندسة وتسليم عدّة تطبيقات إنتاجية بمعمارية نظيفة.',
        'تطبيق معالجة أخطاء وظيفية باستخدام Either لرفع الاستقرار والتوقّعية.',
        'تهيئة ProGuard/R8 لتعزيز الأمان وتقليل حجم الحزمة.',
        'تطوير طبقات كاش أوفلاين باستخدام Hive وSQLite لتحسين التجربة.',
        'تطبيق Flavors لإدارة بيئتي التطوير والإنتاج.',
        'تحسين أداء الواجهات باستخدام Isolates والمهام الخلفية للأعمال الثقيلة.'
      ],
      projectsDesc:{
        iklk:'تقنيات: Zego Cloud، Appwrite، BLoC، GetIt، Hive، ProGuard، Crashlytics — تطوير منصّة اجتماعية بغرف صوت ودردشة. دمج Zego Express وZIM للبث والإشارة. حماية عبر تشويش ProGuard. تنفيذ الهدايا الافتراضية وعمليات الشراء داخل التطبيق. الرابط: <a href="https://play.google.com/store/apps/details?id=com.bwmatbw.lklklivechatapp" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Google Play</a>',
        wolfera:'تقنيات: Supabase، معمارية نظيفة، Dartz (Either)، ترقيم لا نهائي، GoRouter — بناء سوق بسيط ببحث متقدّم ودردشة لحظية. دمج Supabase للمصادقة والتخزين والوقت الحقيقي. معالجة أخطاء وظيفية لزيادة الاعتمادية. الرابط: <a href="https://github.com/Mohamad-Adib-Tawil/Wolfera" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>',
        codebook:'تقنيات: معمارية نظيفة، BLoC، GetIt، Hive، Dio، WebView — تطوير تطبيق قراءة أوفلاين باستخدام Open Library. تطبيق الكاش وإعادة المحاولة والروابط العميقة. <a href="https://github.com/Mohamad-Adib-Tawil/Code-Books-" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>',
        office:'تقنيات: Google ML Kit، Tesseract OCR، SQLite، معالجة PDF — تطوير نظام مسح وأرشفة يعمل دون اتصال مع OCR ثنائي اللغة. إنشاء PDF والطباعة وبحث نصي كامل. الروابط: <a href="https://play.google.com/store/apps/details?id=com.werewolf.office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Google Play</a> · <a href="https://github.com/Mohamad-Adib-Tawil/office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>'
      },
      skillsList:[
        'المعمارية والمنطق: معمارية نظيفة (البيانات/المجال/العرض)، SOLID، MVVM، معالجة أخطاء وظيفية (Either/Dartz)، DI (GetIt/Injectable)، توليد الشيفرة (Freezed/JsonSerializable)',
        'إدارة الحالة: BLoC، Cubit، Provider، تزامن Bloc (Droppable/Restartable)',
        'الشبكات والبيانات: REST (Dio + Interceptors)، WebSocket، إستراتيجية Offline-first، كاش ذكي (Hive/SQLite)، تخزين آمن، ترقيم لانهائي، اختبار Postman',
        'الوقت الحقيقي والوسائط: Zego Cloud (Express & ZIM)، LiveKit، Just_Audio، تسجيل الصوت، SVGA/Lottie',
        'النظام والأداء: ProGuard/R8، نكهات التطبيق (Dev/Prod)، Isolates، تحسين الصور، مهام خلفية/أمامية',
        'الذكاء الاصطناعي والخدمات: OCR (Tesseract، Google ML Kit)، Firebase (Auth/FCM/Analytics/Crashlytics)، Supabase، Appwrite، مشتريات داخل التطبيق، إعلانات Google Mobile',
        'الواجهة/التجربة: تصميم متجاوب، تحويل Figma إلى كود، الوضع الفاتح/الداكن، تدويل (i18n)'
      ],
      education:{heading:'جامعة حلب — دبلوم هندسة حاسبات (2020–2022)', items:['مسار هندسة البرمجيات']},
      achievements:[
        'نشر تطبيقات إنتاجية على Google Play',
        'بناء دردشة فورية وصوت مباشر',
        'تنفيذ OCR دون اتصال ومعالجة PDF',
        'تحسين الأداء وإدارة الذاكرة في تطبيقات Flutter',
        'التعامل مع متطلبات نشر Play Console وأصول المتجر'
      ],
      advancedSkills:[
        'تحسين الأداء: تقسيم الشيفرة، التحميل الكسول، تحليل الذاكرة',
        'الأنماط والمعمارية: Repository والمعمارية النظيفة',
        'الحقن الاعتمادي: GetIt',
        'شبكات مرنة: Dio مع إعادة المحاولة وأخطاء منظَّمة',
        'إستراتيجيات Offline-first: تخزين Hive وخطافات المزامنة'
      ],
      services:[
        'تطوير تطبيقات موبايل شاملة (iOS وAndroid) من الفكرة للنشر',
        'ميزات الوقت الفعلي: صوت/فيديو مباشر، أنظمة دردشة، رسوم متحركة متزامنة',
        'تكامل الذكاء الاصطناعي: OCR، ML Kit، معالجة الصور، تحليل النصوص، الترجمة',
        'تحسين الأداء: تقليل الذاكرة، تحسين FPS، التوسع التكيفي',
        'معمارية الخلفيات: Supabase، Firebase، Appwrite، APIs مخصصة، WebSocket',
        'إعداد CI/CD: خطوط آلية، اختبار، نشر، مراقبة',
        'امتثال Play Console والنشر (سياسة الخصوصية، الأذونات، تصنيف المحتوى، صفحة المتجر)'
      ],
      languagesText:'العربية (لغة أم)، الإنجليزية (إنجليزية تقنية جيدة)',
      codebook:{
        highlightsSummary:'أهم النقاط',
        techTitle:'المهارات التقنية',
        softTitle:'المهارات السلوكية',
        impactTitle:'الأثر المهني',
        cvEntryTitle:'مدخل مشروع في السيرة',
        techList:[
          '[تطوير متعدد المنصات] بناء تطبيق Android/iOS جاهز للإنتاج باستخدام flutter_bloc وget_it وتطبيق الطبقات وفق المعمارية النظيفة (العرض، المجال، البيانات).',
          '[الشبكات والاعتمادية] دمج Open Library عبر dio مع منطق إعادة المحاولة، معالجة منهجية للأخطاء، وترقيم صفحات مطابق لنمط المستودع.',
          '[التخزين المحلي] تصميم تدفقات Offline-first باستخدام Hive (محولات الكيانات، استراتيجيات التخزين المؤقت، وخطافات المزامنة).',
          '[تنفيذ UI/UX] تصميم ثيم مميز، تخطيطات متجاوبة، معاينات WebView ديناميكية، وويدجتات مخصصة (CustomAppBar وBookStackListBlocConsumer).',
          '[جاهزية DevOps] أتمتة أصول العلامة (flutter_launcher_icons)، تجهيز مواد النشر للمتجر، والحفاظ على نظافة pubspec.yaml لبناءات قابلة للتكرار.'
        ],
        softList:[
          '[ملكية كاملة] قيادة المشروع من التحليل حتى الإطلاق دون تسليمات متتابعة، مما يثبت القدرة على الاعتماد الذاتي.',
          '[تفكير منتجي] موازنة نطاق الميزات وقابلية الاستخدام والامتثال لمتطلبات نشر Play Store.',
          '[حل المشكلات وسرعة التعلّم] البحث في الـ APIs، حل مشكلات التكامل، وتحسين المعمارية بشكل تكراري.',
          '[إدارة الوقت والمخاطر] ترتيب المهام (تصميم → تنفيذ → اختبار جودة → أصول) ضمن مهل ذاتية.',
          '[توثيق وتواصل] إنتاج وصف ومحاضر ونصوص نشر واضحة مناسبة لأصحاب المصلحة.'
        ],
        impactList:[
          '[تسليم أسرع للميزات] يبرهن القدرة على شحن حلول جوال معقدة بمفردك — مما يقلل مخاطر التأهيل لدى أصحاب العمل.',
          '[معمارية قابلة لإعادة الاستخدام] تشكّل قالبًا لتطبيقات المحتوى المستقبلية (تعليم، وسائط، مكتبات).',
          '[تركيز على قيمة المستخدم] يمزج الهندسة مع هوية بصرية مصقولة، ما يعكس التزامًا بالتفاعل وجهوزية النشر.'
        ],
        cvEntryList:[
          'Code Book — تطبيق قراءة متعدد المنصات (مشروع فردي)',
          'بناء تطبيق Flutter بمعمارية نظيفة (BLoC وGetIt وHive) يوفّر تصفح Open Library مع العمل دون اتصال وشبكات Dio مرنة وترقيم صفحات.',
          'تصميم واجهة داكنة احترافية مع معاينات WebView وأتمتة الأيقونات/الثيمات لجهوزية النشر على Play Store.',
          'قيادة دورة الحياة كاملة (تحليل → تصميم → تطوير → ضمان الجودة → مواد النشر) بما يثبت التسليم الذاتي.'
        ]
      }
    }
  };

  const applyLanguage = (lang) => {
    const dict = i18n[lang] || i18n.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    // Set font family based on language
    document.body.style.fontFamily = (lang === 'ar')
      ? "'Tajawal', 'Poppins', Arial, sans-serif"
      : "'Inter', 'Poppins', Arial, sans-serif";
    // Nav
    const navMap = [['navSummary','summary'],['navExperience','experience'],['navProjects','projects'],['navSkills','skills'],['navEducation','education'],['navAchievements','achievements'],['navAdvanced','advanced'],['navServices','services'],['navLanguages','languages'],['navDownload','download']];
    navMap.forEach(([id,key])=>{ const el=document.getElementById(id); if(el) el.textContent = dict.nav[key]; });
    // Header
    const jt=document.getElementById('jobTitle'); if(jt) jt.textContent=dict.header.jobTitle;
    const av=document.getElementById('availabilityBadge'); if(av) av.textContent=dict.header.availability;
    const emp=document.getElementById('employmentBadge'); if(emp && dict.header.employment) emp.textContent = dict.header.employment;
    const hb=document.getElementById('headerBadges');
    if (hb && Array.isArray(dict.header.badges)) {
      hb.innerHTML = '';
      dict.header.badges.forEach(txt => { const s=document.createElement('span'); s.className='badge'; s.textContent=txt; hb.appendChild(s); });
    }
    const ctaW=document.getElementById('ctaWorkText'); if(ctaW) ctaW.textContent=dict.header.ctaWork;
    const ctaC=document.getElementById('ctaContactText'); if(ctaC) ctaC.textContent=dict.header.ctaContact;
    const ctaWB=document.getElementById('ctaWebsiteText'); if(ctaWB && dict.header.ctaWebsite) ctaWB.textContent = dict.header.ctaWebsite;
    const ctaD=document.getElementById('ctaDownloadText'); if(ctaD && dict.header.ctaDownload) ctaD.textContent = dict.header.ctaDownload;
    const ctaH=document.getElementById('ctaHireText'); if(ctaH && dict.header.ctaHire) ctaH.textContent = dict.header.ctaHire;
    
    // Titles
    const titleMap=[['summaryTitle','summary'],['experienceTitle','experience'],['projectsTitle','projects'],['skillsTitle','skills'],['educationTitle','education'],['achievementsTitle','achievements'],['advancedSkillsTitle','advanced'],['servicesTitle','services'],['languagesTitle','languages']];
    titleMap.forEach(([id,key])=>{const el=document.getElementById(id); if(el){ const icon=el.querySelector('i'); el.textContent=' '+dict.titles[key]; if(icon) el.prepend(icon); }});
    // Summary
    const st=document.getElementById('summaryText'); if(st) st.textContent=dict.summaryText;
    // Experience
    const er=document.getElementById('experienceRole'); if(er) er.textContent=dict.experienceRole;
    const elist=document.getElementById('experienceList'); if(elist){ elist.innerHTML=''; dict.experienceList.forEach(item=>{ const li=document.createElement('li'); li.textContent=item; elist.appendChild(li); }); }
    // Projects descriptions
    const dI=document.getElementById('descIklk'); if(dI) dI.innerHTML=dict.projectsDesc.iklk;
    const dW=document.getElementById('descWolfera'); if(dW) dW.innerHTML=dict.projectsDesc.wolfera;
    const dC=document.getElementById('descCodeBook'); if(dC) dC.innerHTML=dict.projectsDesc.codebook;
    const dO=document.getElementById('descOffice'); if(dO) dO.innerHTML=dict.projectsDesc.office;
    // Skills
    const sList=document.querySelector('.skill-list'); if(sList){ sList.innerHTML=''; dict.skillsList.forEach(s=>{ const li=document.createElement('li'); li.textContent=s; sList.appendChild(li);}); }
    // Education
    const edh=document.querySelector('#education h3'); if(edh) edh.textContent=dict.education.heading;
    const edul=document.querySelector('#education ul'); if(edul){ edul.innerHTML=''; dict.education.items.forEach(x=>{ const li=document.createElement('li'); li.textContent=x; edul.appendChild(li);}); }
    // Achievements
    const achUl=document.querySelector('.achievement-list'); if(achUl){ achUl.innerHTML=''; dict.achievements.forEach(x=>{ const li=document.createElement('li'); li.textContent=x; achUl.appendChild(li);}); }
    // Advanced skills
    const advUl=document.querySelector('.advanced-skill-list'); if(advUl){ advUl.innerHTML=''; dict.advancedSkills.forEach(x=>{ const li=document.createElement('li'); li.textContent=x; advUl.appendChild(li);}); }
    // Services
    const srvUl=document.querySelector('.service-list'); if(srvUl){ srvUl.innerHTML=''; dict.services.forEach(x=>{ const li=document.createElement('li'); li.textContent=x; srvUl.appendChild(li);}); }
    // Languages text
    const lt=document.getElementById('languagesText'); if(lt) lt.textContent=dict.languagesText;
    // Code Book Highlights
    const cb=dict.codebook;
    const hsum=document.getElementById('codebookHighlightsSummary'); if(hsum && cb) hsum.textContent=cb.highlightsSummary;
    const ttitle=document.getElementById('codebookTechTitle'); if(ttitle && cb) ttitle.textContent=cb.techTitle;
    const stitle=document.getElementById('codebookSoftTitle'); if(stitle && cb) stitle.textContent=cb.softTitle;
    const ititle=document.getElementById('codebookImpactTitle'); if(ititle && cb) ititle.textContent=cb.impactTitle;
    const cvtitle=document.getElementById('codebookCvEntryTitle'); if(cvtitle && cb) cvtitle.textContent=cb.cvEntryTitle;
    const techUl=document.getElementById('codebookTechList'); if(techUl && cb){ techUl.innerHTML=''; cb.techList.forEach(x=>{ const li=document.createElement('li'); li.textContent=x; techUl.appendChild(li);}); }
    const softUl=document.getElementById('codebookSoftList'); if(softUl && cb){ softUl.innerHTML=''; cb.softList.forEach(x=>{ const li=document.createElement('li'); li.textContent=x; softUl.appendChild(li);}); }
    const impUl=document.getElementById('codebookImpactList'); if(impUl && cb){ impUl.innerHTML=''; cb.impactList.forEach(x=>{ const li=document.createElement('li'); li.textContent=x; impUl.appendChild(li);}); }
    const cvUl=document.getElementById('codebookCvEntryList'); if(cvUl && cb){ cvUl.innerHTML=''; cb.cvEntryList.forEach(x=>{ const li=document.createElement('li'); li.textContent=x; cvUl.appendChild(li);}); }
  };

  // Language switcher hookup
  const langSelect = document.getElementById('langSelect');
  const savedLang = localStorage.getItem('lang') || 'en';
  applyLanguage(savedLang);
  if (langSelect) {
    langSelect.value = savedLang;
    langSelect.addEventListener('change', (e)=>{
      const lang = e.target.value;
      enableThemeTransition();
      applyLanguage(lang);
      localStorage.setItem('lang', lang);
    });
  }

  // Header parallax on scroll (subtle)
  const headerEl = document.getElementById('header');
  const reducedMotionMQ = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  const attachParallax = () => {
    if (!headerEl) return;
    if (reducedMotionMQ && reducedMotionMQ.matches) {
      headerEl.style.transform = '';
      return;
    }
    window.addEventListener('scroll', onScrollParallax, { passive: true });
  };
  const onScrollParallax = () => {
    if (!headerEl) return;
    const offset = Math.min(window.scrollY, 200);
    headerEl.style.transform = `translateY(${offset * 0.03}px)`; // calmer parallax
  };
  if (headerEl) attachParallax();
  if (reducedMotionMQ) reducedMotionMQ.addEventListener('change', () => {
    window.removeEventListener('scroll', onScrollParallax);
    attachParallax();
  });

  // Animate skill bars
  const skillBars = document.querySelectorAll('.skill-progress');
  const skillsSection = document.getElementById('skills');
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          bar.style.width = width;
        });
      }
    });
  }, { threshold: 0.5 });
  skillsObserver.observe(skillsSection);

  // Scroll to top button
  const scrollToTopBtn = document.getElementById('scrollToTop');
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) scrollToTopBtn.classList.add('show');
    else scrollToTopBtn.classList.remove('show');
  });
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Create particles background (defer to idle time, and respect reduced motion)
  const createParticles = () => {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const numberOfParticles = vw >= 1200 ? 30 : (vw >= 768 ? 20 : 12);
    for (let i = 0; i < numberOfParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const size = Math.random() * 15 + 5;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 15 + 10;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}vw`;
      particle.style.top = `${posY}vh`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      particlesContainer.appendChild(particle);
    }
  };
  if ('requestIdleCallback' in window) requestIdleCallback(createParticles);
  else setTimeout(createParticles, 0);

  // Animated counter for stats
  const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target >= 1000 ? `${(target/1000).toFixed(1)}K+` : `${target}+`;
        clearInterval(timer);
      } else {
        const display = current >= 1000 ? `${(current/1000).toFixed(1)}K` : Math.floor(current);
        element.textContent = display;
      }
    }, 16);
  };

  // Observe stats section for counter animation
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumbers = document.querySelectorAll('.stat-number');
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateCounter(stat, target);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  // Update current year in footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Initial adjustments
  updateThemeColorMeta();
  updateContrast();
  // Enable theme transition
  enableThemeTransition();
  // Set aria-current on initial section link
  if (sections[0]) setActive(sections[0].id);

  // Add subtle typing effect to name
  const nameElement = document.querySelector('h1');
  const originalName = nameElement ? nameElement.textContent : '';
  if (nameElement) {
    nameElement.textContent = '';
    let i = 0;
    function typeWriter() {
      if (i < originalName.length) {
        nameElement.textContent += originalName.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeWriter();
          headerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    const headerElForTyping = document.getElementById('header');
    if (headerElForTyping) headerObserver.observe(headerElForTyping);
  }

  // Export to Word functionality (Simple HTML-based method)
  const exportWordBtn = document.getElementById('exportWordBtn');
  if (exportWordBtn) {
    exportWordBtn.addEventListener('click', () => {
      const currentLang = localStorage.getItem('lang') || 'en';
      const dict = i18n[currentLang];
      
      // Simple HTML-based Word export (works 100% without external libraries)
      const wordHTML = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>CV - Mohamad Adib Tawil</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.6; margin: 0.75in; ${currentLang === 'ar' ? 'direction: rtl;' : ''} }
h1 { font-size: 18pt; font-weight: bold; color: #0066cc; margin-bottom: 8pt; text-align: center; }
h2 { font-size: 14pt; font-weight: bold; color: #0066cc; margin-top: 14pt; margin-bottom: 8pt; border-bottom: 2pt solid #0066cc; }
h3 { font-size: 12pt; font-weight: bold; margin-top: 10pt; margin-bottom: 6pt; }
ul { margin: 6pt 0; padding-left: ${currentLang === 'ar' ? '0' : '20pt'}; ${currentLang === 'ar' ? 'padding-right: 20pt;' : ''} }
li { margin-bottom: 6pt; }
.contact { text-align: center; margin-bottom: 12pt; font-size: 10pt; color: #333; }
.job-title { text-align: center; font-weight: bold; margin-bottom: 16pt; font-size: 12pt; }
</style>
</head>
<body>
<h1>Mohamad Adib Tawil</h1>
<div class="contact">mohamad.adib.tawil@gmail.com | linkedin.com/in/mohamad-adib-tawil-54024b314 | github.com/Mohamad-Adib-Tawil</div>
<div class="job-title">${dict.header.jobTitle} | ${dict.header.availability}</div>

<h2>${dict.titles.summary}</h2>
<p>${dict.summaryText}</p>

<h2>${dict.titles.skills}</h2>
<ul>${dict.skillsList.map(s => `<li>${s}</li>`).join('')}</ul>

<h2>${dict.titles.experience}</h2>
<h3>${dict.experienceRole}</h3>
<ul>${dict.experienceList.map(i => `<li>${i}</li>`).join('')}</ul>

<h2>${dict.titles.projects}</h2>
<h3>LKLK</h3>
<p>${dict.projectsDesc.iklk.replace(/<[^>]*>/g, '')}</p>
<h3>Wolfera</h3>
<p>${dict.projectsDesc.wolfera.replace(/<[^>]*>/g, '')}</p>
<h3>Code Book</h3>
<p>${dict.projectsDesc.codebook.replace(/<[^>]*>/g, '')}</p>
<h3>Office Archiving</h3>
<p>${dict.projectsDesc.office.replace(/<[^>]*>/g, '')}</p>

<h2>${dict.titles.achievements}</h2>
<ul>${dict.achievements.map(a => `<li>${a}</li>`).join('')}</ul>

<h2>${dict.titles.education}</h2>
<h3>${dict.education.heading}</h3>
<ul>${dict.education.items.map(x => `<li>${x}</li>`).join('')}</ul>

<h2>${dict.titles.languages}</h2>
<p>${dict.languagesText}</p>

</body>
</html>`;

      const blob = new Blob(['\ufeff', wordHTML], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Mohamad_Adib_Tawil_CV_${currentLang.toUpperCase()}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  // Export ATS-friendly Word (for companies, no freelance)
  const exportATSBtn = document.getElementById('exportATSBtn');
  if (exportATSBtn) {
    exportATSBtn.addEventListener('click', () => {
      const currentLang = localStorage.getItem('lang') || 'en';
      const dict = i18n[currentLang];
      
      // ATS-optimized (simple, keyword-rich, no fancy formatting)
      const summary = currentLang === 'ar' 
        ? 'مطوّر Flutter متوسط المستوى (3+ سنوات). مع BLoC/Cubit والمعمارية النظيفة وتكامل Supabase/Firebase. وسّعت بثًا حيًا لـ1000+ مستخدم (−60% ذاكرة، +100% FPS) عبر Zego Cloud. OCR ثنائي اللغة (ML Kit/Tesseract). متاح عن بُعد/عقود.'
        : 'Mid-level Flutter Developer (3+ yrs). End-to-end delivery with BLoC/Cubit, clean architecture, and Supabase/Firebase. Scaled live audio to 1000+ CCU (−60% memory, +100% FPS) via Zego Cloud. Built AR/EN OCR (ML Kit/Tesseract). Open to remote/contract.';

      const keywords = currentLang === 'ar'
        ? ['Flutter','Dart','BLoC/Cubit','المعمارية النظيفة','Supabase','Firebase','Appwrite','Zego Cloud','WebSocket','Realtime','OCR','ML Kit','Tesseract','Hive','SQLite','CI/CD','GitHub Actions','Fastlane']
        : ['Flutter','Dart','BLoC/Cubit','Clean Architecture','Supabase','Firebase','Appwrite','Zego Cloud','WebSocket','Realtime','OCR','ML Kit','Tesseract','Hive','SQLite','CI/CD','GitHub Actions','Fastlane'];
      
      const atsHTML = `
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><title>CV - Mohamad Adib Tawil</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 0.75in; ${currentLang === 'ar' ? 'direction: rtl;' : ''} }
h1 { font-size: 16pt; font-weight: bold; margin-bottom: 6pt; text-align: center; text-transform: uppercase; }
h2 { font-size: 13pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; text-transform: uppercase; border-bottom: 1pt solid #000; }
h3 { font-size: 11pt; font-weight: bold; margin-top: 8pt; margin-bottom: 4pt; }
ul { margin: 5pt 0; padding-left: ${currentLang === 'ar' ? '0' : '18pt'}; ${currentLang === 'ar' ? 'padding-right: 18pt;' : ''} }
li { margin-bottom: 4pt; }
.contact { text-align: center; margin-bottom: 8pt; font-size: 10pt; }
.job-title { text-align: center; font-weight: bold; margin-bottom: 12pt; font-size: 11pt; text-transform: uppercase; }
</style>
</head>
<body>
<h1>MOHAMAD ADIB TAWIL</h1>
<div class="contact">mohamad.adib.tawil@gmail.com | linkedin.com/in/mohamad-adib-tawil-54024b314 | github.com/Mohamad-Adib-Tawil</div>
<div class="job-title">${currentLang === 'ar' ? 'مطوّر Flutter متوسط المستوى' : 'MID-LEVEL FLUTTER DEVELOPER'}</div>

<h2>${currentLang === 'ar' ? 'الملخص المهني' : 'PROFESSIONAL SUMMARY'}</h2>
<p>${summary}</p>

<h2>${currentLang === 'ar' ? 'المهارات التقنية' : 'TECHNICAL SKILLS'}</h2>
<ul>${dict.skillsList.map(s => `<li>${s}</li>`).join('')}</ul>

<h2>${currentLang === 'ar' ? 'الخبرة العملية' : 'PROFESSIONAL EXPERIENCE'}</h2>
<h3>${currentLang === 'ar' ? 'مطوّر Flutter متوسط المستوى | 2022 – حتى الآن' : 'MID-LEVEL FLUTTER DEVELOPER | 2022 – PRESENT'}</h3>
<ul>${dict.experienceList.map(i => `<li>${i}</li>`).join('')}</ul>

<h2>${currentLang === 'ar' ? 'المشاريع الرئيسية' : 'KEY PROJECTS'}</h2>
<h3>LKLK - ${currentLang === 'ar' ? 'منصة صوت اجتماعي مباشر' : 'Live Social Audio Platform'}</h3>
<p>${dict.projectsDesc.iklk.replace(/<[^>]*>/g, '')}</p>
<h3>Wolfera - ${currentLang === 'ar' ? 'سوق إلكتروني للسيارات' : 'Car Marketplace'}</h3>
<p>${dict.projectsDesc.wolfera.replace(/<[^>]*>/g, '')}</p>
<h3>Code Book - ${currentLang === 'ar' ? 'تطبيق قراءة تقني' : 'Technical Reading App'}</h3>
<p>${dict.projectsDesc.codebook.replace(/<[^>]*>/g, '')}</p>
<h3>Office Archiving - ${currentLang === 'ar' ? 'نظام أرشفة مستندات' : 'Document Management System'}</h3>
<p>${dict.projectsDesc.office.replace(/<[^>]*>/g, '')}</p>

<h2>${currentLang === 'ar' ? 'أهم الإنجازات' : 'KEY ACHIEVEMENTS'}</h2>
<ul>${dict.achievements.map(a => `<li>${a}</li>`).join('')}</ul>

<h2>${currentLang === 'ar' ? 'التعليم' : 'EDUCATION'}</h2>
<h3>${dict.education.heading}</h3>
<ul>${dict.education.items.map(x => `<li>${x}</li>`).join('')}</ul>

<h2>${currentLang === 'ar' ? 'اللغات' : 'LANGUAGES'}</h2>
<p>${dict.languagesText}</p>

<h2>${currentLang === 'ar' ? 'الكلمات المفتاحية' : 'KEYWORDS'}</h2>
<p>${keywords.join(', ')}</p>

</body>
</html>`;

      const blob = new Blob(['\ufeff', atsHTML], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Mohamad_Adib_Tawil_CV_ATS_${currentLang.toUpperCase()}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  // Snackbar host and styles
  function ensureSnackbarHost() {
    let host = document.getElementById('snackbarHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'snackbarHost';
      host.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;display:flex;gap:8px;flex-direction:column;align-items:center;pointer-events:none';
      document.body.appendChild(host);
      const style = document.createElement('style');
      style.textContent = `
.snackbar{min-width:220px;max-width:90vw;background:#111;color:#fff;padding:12px 16px;border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,.15);font:500 14px/1.4 Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;opacity:0;transform:translateY(8px);transition:.3s;pointer-events:auto}
.snackbar.show{opacity:1;transform:translateY(0)}
.snackbar.success{background:#10b981}
.snackbar.warn{background:#f59e0b}
.snackbar.error{background:#ef4444}`;
      document.head.appendChild(style);
    }
    return host;
  }
  function showSnackbar(msg, type='warn', timeout=2500) {
    const host = ensureSnackbarHost();
    const el = document.createElement('div');
    el.className = `snackbar ${type}`;
    el.textContent = msg;
    host.appendChild(el);
    requestAnimationFrame(()=> el.classList.add('show'));
    setTimeout(()=> {
      el.classList.remove('show');
      setTimeout(()=> host.removeChild(el), 300);
    }, timeout);
  }
  // Guard missing downloads
  function setupDownloadGuard() {
    const selector = 'a[href*="assets/downloads/"]';
    document.querySelectorAll(selector).forEach((a) => {
      a.addEventListener('click', async (e) => {
        const href = a.getAttribute('href') || '';
        const isFile = /(\.pdf|\.docx?|\.PDF|\.DOCX?)$/.test(href);
        if (!isFile) return; // only file links
        e.preventDefault();
        let ok = false;
        try {
          try {
            const r = await fetch(href, { method: 'HEAD', cache: 'no-store' });
            ok = r.ok;
          } catch (_) {}
          if (!ok) {
            const r2 = await fetch(href, { method: 'GET', headers: { 'Range': 'bytes=0-0' }, cache: 'no-store' });
            ok = r2.ok;
          }
        } catch (_) {}
        if (ok) window.location.href = href;
        else showSnackbar('Soon — file will be available shortly.', 'warn', 3000);
      }, { passive: false });
    });
  }
  setupDownloadGuard();
  window.CVShowSnackbar = showSnackbar;
});
