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
      nav: {summary:'Summary',experience:'Experience',projects:'Projects',skills:'Skills',education:'Education',achievements:'Achievements',advanced:'Advanced Skills',services:'Services',languages:'Languages'},
      header: {jobTitle:'Flutter Developer',availability:'Available for Freelance',ctaWork:'View My Work',ctaContact:'Get in Touch',print:'Print / PDF'},
      titles:{summary:'Professional Summary',experience:'Work Experience',projects:'Selected Projects',skills:'Core Skills',education:'Education',achievements:'Key Achievements',advanced:'Advanced Skills',services:'Services Offered',languages:'Languages'},
      summaryText:'Senior Flutter Developer with 3+ years shipping production-grade apps to 1,000+ active users across social audio, OCR automation, and marketplace domains. Owns the full Flutter app lifecycle from product discovery and architecture through deployment, analytics, and iterative growth, with strong product thinking. Specialized in clean architecture, advanced state management (BLoC/Cubit), and backend integrations (Supabase, Appwrite, Firebase). Proven track record optimizing real-time streaming for 1000+ concurrent users and implementing AI-powered OCR/translation pipelines. Available for freelance projects and full-time remote roles.',
      experienceRole:'Freelance Flutter Developer (2022 – Present)',
      experienceList:[
        'Owned end-to-end Flutter delivery from requirements gathering and UX flows to deployment, analytics, and post-launch iteration.',
        'Architected and shipped 4 production apps with 1,000+ total downloads and 4+ average rating on Google Play Store.',
        'Optimized LKLK social audio app to sustain 1000+ concurrent users with <100ms latency through smart caching and adaptive performance modes.',
        'Engineered offline Arabic-English OCR pipeline in Office Archiving, reducing processing time by 40% via enhanced preprocessing.',
        'Implemented Supabase Auth + real-time chat in Wolfera marketplace, increasing user engagement by 60%.',
        "Collaborated with cross-functional clients to deliver pixel-perfect, multilingual UIs using Flutter's responsive design principles."
      ],
      projectsDesc:{
        iklk:'LKLK is a high-performance social audio arena delivering instant multilingual rooms, synchronized gifting animations, and resilient streaming powered by Zego Cloud, Appwrite, and smart caching. Optimized pipelines, secure storage, and adaptive performance modes sustain buttery engagement for crowds of 1000+, even on constrained devices. Published on Google Play Store: <a href="https://play.google.com/store/apps/details?id=com.bwmatbw.lklklivechatapp" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Download</a>',
        wolfera:'Wolfera is the intelligent car marketplace that pairs curated listings with blazing Supabase-backed performance, secure Supabase Auth including Google Sign-In, smart filters, and live buyer-seller chat, creating a multilingual, cross-platform buying and selling experience that closes deals faster with confidence for everyone.',
        codebook:'Code Book is a clean-architecture Flutter app (BLoC, GetIt, Hive) that browses Open Library with resilient Dio networking (retry, structured failures), repository-driven pagination, and offline-first caching. It features a premium dark UI, WebView previews, and Play Store–ready assets.',
        office:'Office Archiving centralizes documents and media into smart sections, delivering advanced offline Arabic-English OCR, enhanced image preprocessing, multi-page PDF handling, comprehensive text search, instant translation and summarization, interactive storage analytics, smooth dark-mode interface, optional result export, and streamlined workflows for everyday archiving tasks. Published on Google Play Store: <a href="https://play.google.com/store/apps/details?id=com.werewolf.office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Download</a>'
      },
      skillsList:[
        'Flutter & Dart (Expert) | Clean Architecture & SOLID (Advanced)',
        'State Management: BLoC, Cubit, Provider (Expert)',
        'Dependency Injection & Modularization: GetIt, layered architecture',
        'Networking & Resilience: Dio, retry logic, structured failures, pagination, repository pattern',
        'Offline-first & Local Storage: Hive adapters, caching strategies, sync hooks',
        'UI/UX: Responsive layouts, WebView previews, custom widgets',
        'Release Readiness: Play Store collateral, flutter_launcher_icons, pubspec hygiene'
      ],
      education:{heading:'University of Aleppo – Diploma in Computer Engineering, Software Engineering Track (Jun 2020 – Aug 2022)', items:['Relevant Coursework: C#, Data Structures, Algorithms, Object-Oriented Programming, Database Systems, Software Engineering','Final Project: Helping platform (web, Windows, and mobile app) for education programming by courses similar to Udemy']},
      achievements:[
        'Built social audio app supporting 1000+ concurrent users with 99.9% uptime',
        'Published 4 apps on Google Play Store with 1,000+ combined downloads',
        'Implemented advanced offline OCR system processing Arabic & English documents',
        'Delivered Code Book: offline-capable Open Library app with DI (GetIt), BLoC, Dio resilience, Hive caching, pagination, and Play Store readiness'
      ],
      advancedSkills:[
        'Performance Optimization: Code splitting, lazy loading, memory profiling',
        'Design Patterns & Architecture: Repository pattern, Clean Architecture',
        'Dependency Injection: GetIt',
        'Resilient Networking: Dio with retry & structured failures',
        'Offline-first strategies: Hive caching, sync hooks'
      ],
      services:[
        'Full-cycle mobile app delivery (analysis → launch → iteration)',
        'Architecture audits & clean-code refactors',
        'Offline-first implementation (Hive) & caching strategies',
        'Resilient API integration (Dio + retry, pagination, repository)',
        'UI/UX implementation from Figma/Adobe XD (WebView, custom widgets)',
        'App publishing & Play Store optimization'
      ],
      languagesText:'Arabic (Native), English (Professional)',
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
      nav:{summary:'الملخص',experience:'الخبرة',projects:'المشاريع',skills:'المهارات',education:'التعليم',achievements:'الإنجازات',advanced:'مهارات متقدمة',services:'الخدمات',languages:'اللغات'},
      header:{jobTitle:'مطوّر Flutter',availability:'متاح للعمل الحر',ctaWork:'استعرض أعمالي',ctaContact:'تواصل معي',print:'طباعة / PDF'},
      titles:{summary:'الملخص المهني',experience:'الخبرة العملية',projects:'أبرز المشاريع',skills:'المهارات الأساسية',education:'التعليم',achievements:'أهم الإنجازات',advanced:'مهارات متقدمة',services:'الخدمات المقدّمة',languages:'اللغات'},
      summaryText:'مطوّر Flutter بخبرة تفوق 3 سنوات في بناء تطبيقات إنتاجية تصل إلى أكثر من 1,000 مستخدم نشط في مجالات الصوت الاجتماعي وميكنة OCR والأسواق الإلكترونية. أتولّى كامل دورة حياة التطبيق من تحليل المتطلبات وتصميم الواجهة وتجارب المستخدم وصولًا إلى الإطلاق، القياس، والتحسين المستمر، مع تفكير منتجي قوي. مختص في الهندسة النظيفة وإدارة الحالة المتقدمة (BLoC/Cubit) وتكامل الخلفيات (Supabase وAppwrite وFirebase). سجل مثبت في تحسين البثّ اللحظي لأكثر من 1000 مستخدم متزامن وتنفيذ مسارات OCR/ترجمة مدعومة بالذكاء الاصطناعي. متاح لمشاريع حرة وفرص عمل عن بُعد.',
      experienceRole:'مطوّر Flutter حر (2022 – حتى الآن)',
      experienceList:[
        'أتولّى تسليم تطبيقات Flutter من جمع المتطلبات وتخطيط تجربة المستخدم إلى الإطلاق، التحليلات، والتحسين بعد النشر.',
        'بنيت وأطلقت 4 تطبيقات إنتاجية مع +1,000 تنزيل وتقييم +4 على متجر Google Play.',
        'حسّنت تطبيق LKLK للصوت الاجتماعي لدعم +1000 مستخدم متزامن بزمن استجابة أقل من 100ms عبر التخزين الذكي وأنماط الأداء التكيفية.',
        'هندست مسار OCR عربي-إنجليزي للعمل دون اتصال في Office Archiving مع خفض زمن المعالجة بنسبة 40% عبر تحسين ما قبل المعالجة.',
        'طبّقت Supabase Auth ودردشة فورية في سوق Wolfera مما رفع تفاعل المستخدمين بنسبة 60%.',
        'تعاونت مع عملاء متعددي الاختصاصات لتنفيذ واجهات متعددة اللغات بدقة عالية وفق مبادئ التصميم المتجاوب.'
      ],
      projectsDesc:{
        iklk:'يوفّر LKLK ساحة صوت اجتماعي عالية الأداء مع غرف فورية متعددة اللغات، ورسوم هدايا متزامنة، وبث مرن يعتمد Zego Cloud وAppwrite والتخزين الذكي. سلاسل معالجة مُحسّنة وتخزين آمن وأنماط أداء تكيُّفية تحافظ على تفاعلٍ سلس مع حشود تفوق 1000 مستخدم حتى على الأجهزة المحدودة. متاح على متجر Google Play: <a href="https://play.google.com/store/apps/details?id=com.bwmatbw.lklklivechatapp" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> تحميل</a>',
        wolfera:'Wolfera هو سوق سيارات ذكي يجمع بين قوائم مُنتقاة وأداء فائق يعتمد Supabase مع مصادقة Supabase الآمنة (بما فيها تسجيل الدخول عبر Google)، ومرشحات ذكية، ودردشة مباشرة بين المشتري والبائع، ليقدّم تجربة شراء وبيع متعددة اللغات وعبر منصّات متعددة تُسرّع إتمام الصفقات بثقة.',
        codebook:'Code Book تطبيق Flutter بمعمارية نظيفة (BLoC وGetIt وHive) لتصفح Open Library مع شبكات Dio مرنة (إعادة المحاولة، أخطاء منظَّمة)، وترقيم صفحات يقوده نمط المستودع، وتخزين مؤقت يعمل دون اتصال. واجهة داكنة احترافية، معاينات WebView، وأصول جاهزة للنشر على Play Store.',
        office:'يجمع Office Archiving المستندات والوسائط في أقسام ذكية مع OCR عربي-إنجليزي متقدم دون اتصال، وتحسين مسبق للصور، ودعم PDF متعدد الصفحات، وبحث نصي شامل، وترجمة وتلخيص فوريين، وتحليلات تفاعلية للتخزين، وواجهة داكنة سلسة، وتصدير اختياري للنتائج، ومسارات عمل مبسّطة للمهام اليومية. متاح على متجر Google Play: <a href="https://play.google.com/store/apps/details?id=com.werewolf.office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> تحميل</a>'
      },
      skillsList:[
        'Flutter وDart (خبير) | المعمارية النظيفة وSOLID (متقدم)',
        'إدارة الحالة: BLoC وCubit وProvider (خبير)',
        'الحقن الاعتمادي والتقسيم: GetIt ومعمارية طبقية',
        'الشبكات والاعتمادية: Dio ومنطق إعادة المحاولة وأخطاء منظّمة وترقيم صفحات ونمط المستودع',
        'Offline-first والتخزين المحلي: محولات Hive واستراتيجيات التخزين المؤقت وخطافات المزامنة',
        'UI/UX: تخطيطات متجاوبة ومعاينات WebView وويدجتات مخصصة',
        'جهوزية الإطلاق: أصول Play Store وflutter_launcher_icons ونظافة pubspec'
      ],
      education:{heading:'جامعة حلب — دبلوم هندسة حاسبات، مسار هندسة البرمجيات (يونيو 2020 – أغسطس 2022)', items:['مواد ذات صلة: C# وهياكل البيانات والخوارزميات والبرمجة كائنية التوجه وقواعد البيانات وهندسة البرمجيات','مشروع التخرج: منصة مساعدة (ويب وويندوز وتطبيق جوال) لتعلّم البرمجة عبر دورات شبيهة بمنصات مثل Udemy']},
      achievements:[
        'بنيت تطبيق صوت اجتماعي يدعم +1000 مستخدم متزامن مع توافرية 99.9%',
        'نشرت 4 تطبيقات على متجر Google Play بإجمالي تنزيلات +1,000',
        'نفّذت نظام OCR متقدمًا دون اتصال لمعالجة النصوص العربية والإنجليزية',
        'إطلاق Code Book: تطبيق Open Library يعمل دون اتصال مع DI (GetIt) وBLoC وشبكات Dio مرنة وتخزين Hive وترقيم صفحات وجهوزية Play Store'
      ],
      advancedSkills:[
        'تحسين الأداء: تقسيم الشيفرة، التحميل الكسول، تحليل الذاكرة',
        'الأنماط والمعمارية: Repository والمعمارية النظيفة',
        'الحقن الاعتمادي: GetIt',
        'شبكات مرنة: Dio مع إعادة المحاولة وأخطاء منظَّمة',
        'إستراتيجيات Offline-first: تخزين Hive وخطافات المزامنة'
      ],
      services:[
        'تسليم التطبيق كامل الدورة (تحليل → إطلاق → تحسين)',
        'تقييم المعمارية وإعادة هيكلة الشيفرة',
        'تطبيق Offline-first (Hive) واستراتيجيات التخزين المؤقت',
        'تكامل واجهات APIs بمرونة (Dio + إعادة المحاولة، ترقيم صفحات، نمط المستودع)',
        'تنفيذ UI/UX من Figma/Adobe XD (WebView وويدجتات مخصصة)',
        'نشر التطبيقات وتحسين الظهور على Play Store'
      ],
      languagesText:'العربية (لغة أم)، الإنجليزية (احترافية)',
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
    // Nav
    const navMap = [['navSummary','summary'],['navExperience','experience'],['navProjects','projects'],['navSkills','skills'],['navEducation','education'],['navAchievements','achievements'],['navAdvanced','advanced'],['navServices','services'],['navLanguages','languages']];
    navMap.forEach(([id,key])=>{ const el=document.getElementById(id); if(el) el.textContent = dict.nav[key]; });
    // Header
    const jt=document.getElementById('jobTitle'); if(jt) jt.textContent=dict.header.jobTitle;
    const av=document.getElementById('availabilityBadge'); if(av) av.textContent=dict.header.availability;
    const ctaW=document.getElementById('ctaWorkText'); if(ctaW) ctaW.textContent=dict.header.ctaWork;
    const ctaC=document.getElementById('ctaContactText'); if(ctaC) ctaC.textContent=dict.header.ctaContact;
    const pb=document.getElementById('printBtnText'); if(pb) pb.textContent=dict.header.print;
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

  // Print button (if present)
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

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
});
