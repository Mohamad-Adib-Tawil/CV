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
      value: 4,
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
      value: 4,
      label: {
        en: "Years Contract Work",
        ar: "سنوات عمل مستقل/عقود",
      },
    },
  ];

  const projects = [
    {
      id: "lklk",
      name: "LKLK",
      tech: ["Flutter", "flutter_bloc (Cubit)", "GetIt", "ZEGOCLOUD", "LiveKit", "ZIM", "Appwrite", "Dio", "Hive", "in_app_purchase"],
      image: {
        src: "https://play-lh.googleusercontent.com/SprB1SlxKXYMOK-ZO4iOe1An9fgJ7dgDW-JhRYan9YMphWuEFiSoGH2l0lhNmJuYBtQ=w480-h960-rw",
        alt: {
          en: "LKLK live chat app screenshot",
          ar: "لقطة شاشة لتطبيق LKLK",
        },
      },
      description: {
        en: `Production real-time social audio platform — live rooms with up to 500 concurrent users and 20 mic seats. Dual audio SDKs (ZEGOCLOUD ZegoExpress + LiveKit), SVGA/VAP virtual-gift engine (8 concurrent), coin economy with 6 in-app purchase tiers, multi-tier VIP &amp; gamification, and Appwrite Realtime on Clean Architecture with flutter_bloc + GetIt. 5,000+ downloads. <a href="https://play.google.com/store/apps/details?id=com.bwmatbw.lklklivechatapp" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Play Store</a>`,
        ar: `منصة صوت اجتماعي لحظية بمستوى إنتاجي — غرف حيّة حتى 500 مستخدم متزامن و20 مقعد ميكروفون. SDK صوت مزدوج (ZEGOCLOUD ZegoExpress + LiveKit)، محرّك هدايا SVGA/VAP (8 هدايا متزامنة)، اقتصاد عملات بـ6 باقات شراء داخلي، نظام VIP وتحفيز متدرّج، وAppwrite Realtime بمعمارية نظيفة مع flutter_bloc وGetIt. 5,000+ تنزيل. <a href="https://play.google.com/store/apps/details?id=com.bwmatbw.lklklivechatapp" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Google Play</a>`,
      },
      // ── Detail page fields (all optional; the detail page hides empty sections) ──
      slug: "lklk",
      bio: {
        en: "A production Arabic-market social audio app where users create live rooms, send animated gifts, climb VIP ladders, and buy coins — Clubhouse meets Yalla, built entirely in Flutter. I was the sole Flutter developer for the entire client: architecture, state management, ZEGOCLOUD/LiveKit/Appwrite integrations, and the in-app economy.",
        ar: "تطبيق صوت اجتماعي إنتاجي للسوق العربي — غرف حيّة، هدايا متحركة، مستويات VIP، وشراء عملات. كنت المطوّر الوحيد للتطبيق بالكامل: المعمارية، إدارة الحالة، تكاملات ZEGOCLOUD وLiveKit وAppwrite، والاقتصاد الداخلي.",
      },
      linkedin: {
        en: "🎙️ Built a real-time social audio platform in Flutter — 500 users/room, dual audio SDKs (ZEGOCLOUD + LiveKit), a queued SVGA/VAP gift engine, and a full coin economy with 6 in-app purchase tiers. Live on Google Play with 5,000+ downloads.\n\n#Flutter #LiveAudio #FlutterBloc #ZEGOCLOUD #CleanArchitecture",
        ar: "🎙️ بنيت منصة صوت اجتماعي لحظية بـFlutter — 500 مستخدم/غرفة، SDK صوت مزدوج (ZEGOCLOUD + LiveKit)، محرّك هدايا SVGA/VAP، واقتصاد عملات متكامل بـ6 باقات شراء. منشور على Google Play بـ5,000+ تنزيل.\n\n#Flutter #فلاتر #FlutterBloc #LiveAudio",
      },
      links: {
        directDownload: "",
        playStore: "https://play.google.com/store/apps/details?id=com.bwmatbw.lklklivechatapp",
        appStore: "",
        github: "",
        website: "",
      },
      media: {
        poster: "",
        video: "xUxeqG3S7jc",
        screenshots: [
          { src: "assets/projects/lklk/screenshots/screenshot-01.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-02.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-03.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-04.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-05.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-06.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-07.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-08.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-09.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-10.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-11.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-12.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-13.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-14.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-15.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-16.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-17.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-18.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-19.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-20.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-21.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-22.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-23.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-24.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-25.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-26.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-27.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-28.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-29.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-30.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-31.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-32.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-33.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-34.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-35.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-36.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-37.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-38.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-39.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-40.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-41.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-42.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-43.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-44.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-45.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-46.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-47.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-48.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-49.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-50.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-51.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-52.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-53.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-54.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-55.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-56.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-57.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-58.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-59.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-60.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-61.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-62.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-63.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-64.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-65.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-66.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-67.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-68.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-69.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-70.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-71.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-72.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-73.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-74.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-75.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-76.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-77.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-78.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-79.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-80.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-81.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-82.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-83.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-84.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-85.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-86.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-87.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-88.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-89.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-90.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/lklk/screenshots/screenshot-91.png", alt: { en: "", ar: "" } },
        ],
      },
    },
    {
      id: "wolfera",
      name: "Wolfera",
      tech: ["Flutter", "Supabase", "Firebase (FCM/Crashlytics)", "BLoC/Cubit", "GoRouter", "GetIt + Injectable", "Freezed", "TFLite"],
      image: {
        src: "https://raw.githubusercontent.com/Mohamad-Adib-Tawil/Wolfera/main/assets/images/appIcon.png",
        alt: {
          en: "Wolfera car marketplace app icon",
          ar: "أيقونة تطبيق Wolfera",
        },
      },
      description: {
        en: `Bilingual (AR/EN) car marketplace for buying, selling, and renting with multi-tier pricing. Built on Supabase (PostgreSQL, Auth incl. Google Sign-In, Realtime chat, Storage) with Clean Architecture, BLoC/Cubit, and GetIt+Injectable. Features FCM price-drop alerts, on-device TFLite NSFW moderation, and advanced search across 15+ filters with infinite scroll. <a href="https://github.com/Mohamad-Adib-Tawil/Wolfera" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a> · <a href="https://play.google.com/store/apps/details?id=com.wolfera.wolfera" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Play Store</a>`,
        ar: `سوق سيارات ثنائي اللغة (ع/إ) للبيع والشراء والإيجار بتسعير متعدّد المستويات. مبني على Supabase (PostgreSQL، مصادقة تشمل Google، محادثة لحظية، تخزين) بمعمارية نظيفة وBLoC/Cubit وGetIt+Injectable. تنبيهات FCM لانخفاض السعر، فلترة NSFW على الجهاز عبر TFLite، وبحثًا متقدمًا بـ15+ فلتر مع تمرير لانهائي. <a href="https://github.com/Mohamad-Adib-Tawil/Wolfera" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a> · <a href="https://play.google.com/store/apps/details?id=com.wolfera.wolfera" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Google Play</a>`,
      },
      slug: "wolfera",
      bio: {
        en: "A production marketplace connecting car buyers, sellers, and renters with real-time chat, favorites, and price-drop alerts. I was the sole Flutter developer: architecture, Supabase + Firebase integration, the multi-step listing wizard, and admin tooling.",
        ar: "سوق إنتاجي يربط بائعي السيارات والمشترين والمستأجرين بمحادثة لحظية ومفضّلة وتنبيهات سعر. كنت المطوّر الوحيد: المعمارية، تكامل Supabase وFirebase، معالج الإضافة متعدد الخطوات، وأدوات المشرف.",
      },
      linkedin: {
        en: "🚗 Built Wolfera — a bilingual car marketplace in Flutter with Supabase realtime chat, on-device TFLite image moderation, admin approval workflow, and FCM price-drop alerts for favorited cars.\n\n#Flutter #Supabase #CleanArchitecture #Firebase",
        ar: "🚗 بنيت Wolfera — سوق سيارات ثنائي اللغة بـFlutter مع محادثة Supabase لحظية، فلترة صور TFLite على الجهاز، موافقة المشرف، وتنبيهات FCM لانخفاض الأسعار.\n\n#Flutter #Supabase #فلاتر #CleanArchitecture",
      },
      links: {
        directDownload: "https://github.com/Mohamad-Adib-Tawil/Wolfera/releases/download/wolfera/wolfera-latest.apk",
        playStore: "https://play.google.com/store/apps/details?id=com.wolfera.wolfera",
        appStore: "",
        github: "https://github.com/Mohamad-Adib-Tawil/Wolfera",
        website: "",
      },
      media: {
        poster: "",
        video: "aE0mbXFFe7o",
        screenshots: [
          { src: "assets/projects/wolfera/screenshots/screenshot-01.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-02.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-03.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-04.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-05.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-06.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-07.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-08.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-09.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-10.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-11.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-12.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-13.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-14.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-15.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-16.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-17.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-18.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-19.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-20.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-21.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-22.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-23.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-24.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-25.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-26.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-27.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-28.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-29.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-30.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-31.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-32.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-33.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-34.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-35.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-36.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-37.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-38.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-39.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-40.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-41.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-42.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-43.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-44.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-45.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-46.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-47.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-48.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-49.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-50.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-51.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-52.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-53.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-54.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-55.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-56.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-57.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-58.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-59.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-60.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-61.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-62.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-63.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-64.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-65.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-66.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-67.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-68.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-69.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-70.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-71.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/wolfera/screenshots/screenshot-72.png", alt: { en: "", ar: "" } },
        ],
      },
    },
    {
      id: "codebook",
      name: "Code Book",
      tech: ["Flutter", "flutter_bloc (Cubit)", "Dio", "Google Books API", "Hive", "GetIt", "GoRouter", "WebView", "dartz"],
      image: {
        src: "https://raw.githubusercontent.com/Mohamad-Adib-Tawil/Code-Books-/main/assets/images/logo.png?raw=1",
        alt: {
          en: "Code Book educational app logo",
          ar: "شعار تطبيق Code Book",
        },
      },
      description: {
        en: `Cross-platform book-discovery app consuming the Google Books REST API with an offline-first Hive cache for instant cold-start. Built on Clean Architecture (Dio + dartz Either typed errors, 3-retry exponential backoff), flutter_bloc Cubits, debounced search with advanced filters and infinite scroll, and an in-app WebView reader with HTTPS enforcement. <a href="https://github.com/Mohamad-Adib-Tawil/Code-Books-" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>`,
        ar: `تطبيق اكتشاف كتب عبر Google Books REST API مع تخزين Hive offline-first لإقلاع فوري. مبني على معمارية نظيفة (Dio + معالجة أخطاء dartz Either، إعادة محاولة أُسّية 3 مرات)، وflutter_bloc، وبحث مع فلاتر متقدمة وتمرير لانهائي، وقارئ WebView داخلي مع فرض HTTPS. <a href="https://github.com/Mohamad-Adib-Tawil/Code-Books-" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>`,
      },
      slug: "codebook",
      bio: {
        en: "A cross-platform app to discover, search, and read free programming e-books sourced from Google Books, with a premium dark UI and an offline-first Hive cache so content loads instantly. Solo project covering architecture, API integration, caching strategy, and the embedded WebView reader.",
        ar: "تطبيق لاكتشاف وقراءة كتب البرمجة المجانية من Google Books، بواجهة داكنة أنيقة وتخزين Hive offline-first لتحميل فوري. مشروع فردي شمل المعمارية، تكامل API، استراتيجية التخزين، والقارئ WebView المدمج.",
      },
      linkedin: {
        en: "📚 Built Code Books — a Flutter e-book discovery app on the Google Books API with an offline-first Hive cache, typed error handling via dartz Either, 3-retry exponential backoff, and an in-app WebView reader.\n\n#Flutter #CleanArchitecture #Dart #Hive",
        ar: "📚 بنيت Code Books — تطبيق اكتشاف كتب بـFlutter على Google Books API مع تخزين Hive offline-first، معالجة أخطاء typed عبر dartz Either، وقارئ WebView مدمج.\n\n#Flutter #فلاتر #Dart #CleanArchitecture",
      },
      links: {
        directDownload: "https://github.com/Mohamad-Adib-Tawil/Code-Books/releases/download/codebook/codebook-latest.apk",
        playStore: "",
        appStore: "",
        github: "https://github.com/Mohamad-Adib-Tawil/Code-Books-",
        website: "",
      },
      media: {
        poster: "",
        video: "",
        screenshots: [],
      },
    },
    {
      id: "office",
      name: "Office Archiving",
      tech: ["Flutter", "flutter_bloc (Cubit)", "SQLite (sqflite)", "Google ML Kit", "Tesseract OCR", "pdf", "printing", "flutter_doc_scanner"],
      image: {
        src: "https://play-lh.googleusercontent.com/2xsTQC6G7T22nIa93fSh6dxw-l92NLMWhKXskipm7KbKs84NZUI9rwoWgWh3AGOReTM=w480-h960-rw",
        alt: {
          en: "Office Archiving app screenshot",
          ar: "لقطة شاشة لتطبيق Office Archiving",
        },
      },
      description: {
        en: `Offline-first document scanning &amp; archiving app — no account, no cloud. Dual-engine OCR pipeline (Google ML Kit + Tesseract) for Arabic/English with preprocessing and best-result scoring, full-text SQLite search, a complete PDF toolkit (create, edit, watermark, sign, password-protect), AI translation/summarization with offline fallbacks, and a 16-theme engine — built with Flutter and flutter_bloc. <a href="https://github.com/Mohamad-Adib-Tawil/office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a> · <a href="https://play.google.com/store/apps/details?id=com.werewolf.office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Play Store</a>`,
        ar: `تطبيق مسح وأرشفة مستندات offline-first — بلا حساب أو سحابة. خطّ OCR مزدوج (Google ML Kit + Tesseract) للعربية/الإنجليزية مع معالجة مسبقة واختيار أفضل نتيجة، وبحثًا نصيًا كاملًا في SQLite، وأدوات PDF متكاملة (إنشاء، تعديل، علامة مائية، توقيع، حماية بكلمة سر)، وترجمة/تلخيص AI مع بدائل دون اتصال، ومحرّك 16 ثيم — بـFlutter وflutter_bloc. <a href="https://github.com/Mohamad-Adib-Tawil/office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a> · <a href="https://play.google.com/store/apps/details?id=com.werewolf.office_archiving" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Google Play</a>`,
      },
      slug: "office",
      bio: {
        en: "An offline-first, privacy-focused app to scan, organize, and search documents entirely on-device — no account or cloud required. Covers desktop-grade PDF tooling and Arabic-first OCR. Solo project across architecture, the dual-engine OCR pipeline, PDF tools, AI services, and the fully bilingual UI.",
        ar: "تطبيق offline-first يركّز على الخصوصية لمسح وتنظيم والبحث في المستندات على الجهاز بالكامل — بلا حساب أو سحابة. يوفّر أدوات PDF احترافية وOCR عربي أولًا. مشروع فردي شمل المعمارية، خطّ OCR المزدوج، أدوات PDF، خدمات AI، والواجهة الثنائية.",
      },
      linkedin: {
        en: "🗂️ Built Office Archiving — an offline-first Flutter document manager with dual-engine Arabic/English OCR (ML Kit + Tesseract), full-text SQLite search, and a complete on-device PDF toolkit (create, edit, watermark, sign, password-protect).\n\n#Flutter #OCR #OfflineFirst #FlutterBloc",
        ar: "🗂️ بنيت Office Archiving — مدير مستندات offline-first بـFlutter مع OCR عربي/إنجليزي مزدوج (ML Kit + Tesseract)، بحث نصي كامل في SQLite، وأدوات PDF متكاملة على الجهاز.\n\n#Flutter #OCR #فلاتر #FlutterBloc",
      },
      links: {
        directDownload: "https://github.com/Mohamad-Adib-Tawil/office_archiving/releases/download/office/office-latest.apk",
        playStore: "https://play.google.com/store/apps/details?id=com.werewolf.office_archiving",
        appStore: "",
        github: "https://github.com/Mohamad-Adib-Tawil/office_archiving",
        website: "",
      },
      media: {
        poster: "",
        video: "",
        screenshots: [
          { src: "assets/projects/office/screenshots/screenshot-01.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-02.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-03.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-04.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-05.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-06.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-07.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-08.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-09.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-10.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-11.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-12.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-13.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-14.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-15.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-16.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-17.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-18.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-19.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-20.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-21.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-22.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-23.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-24.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-25.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-26.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-27.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-28.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-29.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-30.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-31.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-32.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-33.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-34.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-35.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-36.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-37.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-38.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-39.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-40.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-41.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-42.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-43.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-44.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-45.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-46.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-47.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-48.png", alt: { en: "", ar: "" } },
          { src: "assets/projects/office/screenshots/screenshot-49.png", alt: { en: "", ar: "" } },
        ],
      },
    },
    {
      id: "quran",
      name: "Quran Ahmed Karasi",
      tech: ["Flutter", "flutter_bloc (Cubit)", "GetIt", "just_audio", "audio_session", "background_downloader", "quran_library", "Offline Audio"],
      image: {
        src: "https://raw.githubusercontent.com/Mohamad-Adib-Tawil/Quran/main/assets/home/%D8%B5%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D8%B4%D9%8A%D8%AE%20%D8%A7%D8%AD%D9%85%D8%AF%20%D9%83%D8%B1%D8%A7%D8%B3%D9%8A%20%D8%A7%D9%84%D8%B4%D8%AE%D8%B5%D9%8A%D8%A9.png",
        alt: {
          en: "Quran Ahmed Karasi app icon",
          ar: "أيقونة تطبيق قرآن أحمد كراسي",
        },
      },
      description: {
        en: `Offline-capable Quran reader &amp; audio app with Surah/Juz/Hizb navigation. Multi-phase audio engine (just_audio + audio_session) with an explicit state machine, OS audio-focus, repeat/speed/sleep-timer, and background per-surah downloads with live progress. Includes a local study hub (ayah tagging, notes, daily/weekly goals) on Clean Architecture with flutter_bloc + GetIt — no backend. Arabic/German, Android &amp; iOS. <a href="https://github.com/Mohamad-Adib-Tawil/Quran" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a> · <a href="https://play.google.com/store/apps/details?id=com.ahmadkarasi.quran&pli=1" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Play Store</a> · <a href="https://apps.apple.com/app/id6759857104" target="_blank" rel="noopener noreferrer"><i class="fab fa-apple"></i> App Store</a>`,
        ar: `تطبيق قرآن للقراءة والصوت يعمل دون اتصال مع تنقّل سور/أجزاء/أحزاب. محرّك صوت متعدد المراحل (just_audio + audio_session) بآلة حالة صريحة، وإدارة تركيز صوت النظام، وتكرار/سرعة/مؤقّت نوم، وتنزيلات خلفية لكل سورة مع تقدّم لحظي. ويتضمّن مركز دراسة محلي (وسم آيات، ملاحظات، أهداف يومية/أسبوعية) بمعمارية نظيفة مع flutter_bloc وGetIt — بلا خادم. عربي/ألماني، Android وiOS. <a href="https://github.com/Mohamad-Adib-Tawil/Quran" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a> · <a href="https://play.google.com/store/apps/details?id=com.ahmadkarasi.quran&pli=1" target="_blank" rel="noopener noreferrer"><i class="fab fa-google-play"></i> Google Play</a> · <a href="https://apps.apple.com/app/id6759857104" target="_blank" rel="noopener noreferrer"><i class="fab fa-apple"></i> App Store</a>`,
      },
      slug: "quran",
      bio: {
        en: "A focused, backend-free Quran app built around three pillars — reading, fully-offline listening, and structured personal study. Solo project covering the audio engine with an explicit state machine, offline per-surah download flow, study tools (tags, notes, goals), and a Figma-derived design system.",
        ar: "تطبيق قرآن مركّز بلا خادم حول ثلاث ركائز — القراءة، الاستماع دون اتصال بالكامل، والدراسة الشخصية المنظّمة. مشروع فردي شمل محرّك الصوت بآلة حالة صريحة، تدفّق التنزيل دون اتصال لكل سورة، أدوات الدراسة (وسم، ملاحظات، أهداف)، ونظام تصميم من Figma.",
      },
      linkedin: {
        en: "📖 Built a Quran app in Flutter — a state-machine audio engine (just_audio + audio_session), fully-offline per-surah background downloads, and a personal study hub (ayah tagging, notes, daily/weekly goals). No backend. Published on Google Play & App Store.\n\n#Flutter #Dart #just_audio #CleanArchitecture",
        ar: "📖 بنيت تطبيق قرآن بـFlutter — محرّك صوت بآلة حالة (just_audio + audio_session)، تنزيلات سور دون اتصال في الخلفية، ومركز دراسة شخصي (وسم آيات، ملاحظات، أهداف). بلا خادم. منشور على Google Play وApp Store.\n\n#Flutter #فلاتر #Dart #just_audio",
      },
      links: {
        directDownload: "https://github.com/Mohamad-Adib-Tawil/Quran/releases/download/quran/quran-latest.apk",
        playStore: "https://play.google.com/store/apps/details?id=com.ahmadkarasi.quran&pli=1",
        appStore: "https://apps.apple.com/app/id6759857104",
        github: "https://github.com/Mohamad-Adib-Tawil/Quran",
        website: "",
      },
      media: {
        poster: "",
        video: "h08cGHLkMLo",
        screenshots: [],
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
        "Flutter developer with 4 years designing, building, and shipping production mobile apps to Google Play and the App Store — including a live social-audio platform that surpassed 5,000+ downloads. Specialized in Clean Architecture, BLoC/Cubit state management, and offline-first systems, with deep hands-on work in real-time audio/chat (ZEGOCLOUD, LiveKit, WebSockets), on-device ML/OCR, and multi-backend integration (Supabase, Firebase, Appwrite). Owns the full mobile lifecycle end-to-end: requirements, architecture, UI, backend integration, performance tuning, and store release.",
      experienceRole: "Flutter Developer — Independent & Contract (Remote) — 07/2022 – Present",
      experienceList: [
        "Designed and shipped 5+ production Flutter apps end-to-end across social-audio, marketplace, document-management, and content domains — owning architecture, state management, backend integration, performance, and store release on Google Play and the App Store.",
        "Built a real-time social-audio platform (LKLK) architected for up to 500 listeners and 20 mic seats per room, integrating dual audio SDKs (ZEGOCLOUD + LiveKit) and three concurrent realtime channels (Appwrite Realtime, WebSockets, ZIM) with per-channel reconnect and exponential backoff; app surpassed 5,000+ downloads.",
        "Engineered the app's monetization and engagement stack: in-app purchases (6 coin tiers), an SVGA/VAP virtual-gift animation engine (concurrency-capped at 8, sub-100 ms queue interval), VIP tiers, and gamified progression.",
        "Delivered a bilingual (AR/EN) car marketplace (Wolfera) on Supabase (PostgreSQL with Row-Level Security, Auth + Google/Apple SSO, Realtime chat, Storage), with on-device TFLite image moderation, FCM price-drop alerts, and advanced search across 15+ filters with infinite scroll.",
        "Built an offline-first document scanner (Office Archiving) with a dual-engine OCR pipeline (Google ML Kit + Tesseract) for Arabic/English — multi-orientation, preprocessing, best-result scoring — plus a full PDF toolkit (watermark, sign, password-protect) and SQLite full-text search, all on-device with no backend.",
        "Standardized engineering across apps: Clean Architecture with feature-based modules, BLoC/Cubit + GetIt/Injectable, typed Either error handling, offline-first caching with pagination and 3-retry exponential backoff, and isolates/background tasks for OCR, PDF, and audio.",
        "Hardened releases with app flavors, ProGuard/R8, secure storage, environment separation, and Crashlytics crash filtering; published and maintained apps on both Google Play and the Apple App Store.",
      ],
      skillsList: [
        "Languages: Dart, SQL, C# (academic), Kotlin (basic)",
        "Mobile & UI: Flutter, Material 3, Android, iOS, responsive UI, RTL & localization (AR/EN), image optimization",
        "Architecture & State: Clean Architecture, SOLID, MVVM, feature-based modules, BLoC, Cubit, Provider, GetIt, Injectable, Freezed, dartz/Either",
        "Backend & APIs: REST, Dio (interceptors, retry/backoff), WebSockets, Supabase (PostgreSQL, Auth, Realtime, Storage, RLS), Firebase (Auth, FCM, Analytics, Crashlytics), Appwrite",
        "Real-time & Media: ZEGOCLOUD (ZegoExpress), LiveKit, ZIM, just_audio, audio_session, SVGA/VAP animation, background_downloader",
        "Storage & Offline: Hive, SQLite (sqflite), secure storage, offline-first caching, pagination, stale-while-revalidate, typed failures",
        "On-device ML & Docs: Google ML Kit, Tesseract OCR, TFLite, PDF generation/editing, printing, full-text search",
        "Release & Quality: App flavors, ProGuard/R8, Crashlytics, secure storage, environment separation, isolates & background tasks, in-app purchases, Google Play & App Store publishing",
        "Navigation & Tools: GoRouter, Git, GitHub, Postman, Figma, build_runner / codegen",
      ],
      education: {
        heading: "Diploma in Computer Engineering, University of Aleppo (2020–2022)",
        items: ["Focus: Software Engineering", "Aleppo, Syria"],
      },
      achievements: [
        "Designed and shipped 5+ production apps to Google Play and the App Store",
        "Built real-time social-audio rooms supporting up to 500 concurrent listeners and 20 mic seats using ZEGOCLOUD + LiveKit",
        "Delivered one public app (LKLK) with 5,000+ downloads over 80+ build releases",
        "Implemented a custom dual-engine OCR pipeline (ML Kit + Tesseract) for reliable Arabic/English extraction on mixed real-world documents",
        "Engineered offline-first flows with Hive, SQLite, pagination, stale-while-revalidate, 3-retry exponential backoff, and typed Either failures",
        "Shipped on-device TFLite image moderation, PDF security tooling, and AI summarization without any backend dependency",
      ],
      advancedSkills: [
        "Clean Architecture with feature-based modules and strictly separated UI, domain, and data layers — applied across 5 production apps",
        "Offline-first systems using Hive, SQLite, pagination, stale-while-revalidate caching, and typed failure responses",
        "Real-time integrations with WebSockets, Supabase Realtime, ZEGOCLOUD ZegoExpress, and ZIM signaling — with per-channel reconnect logic",
        "On-device ML pipelines: OCR (ML Kit + Tesseract), TFLite inference, multi-candidate scoring, and memory-safe PDF rasterization",
        "Production release engineering: flavors, ProGuard/R8, Crashlytics, secure storage, environment separation, isolates, and background tasks",
      ],
      services: [
        "End-to-end mobile app development (iOS & Android) from concept to store",
        "Clean Architecture design: feature-based modules, BLoC/Cubit, DI setup",
        "Real-time features: audio rooms, messaging flows, WebSockets, Supabase Realtime",
        "OCR and document workflows: ML Kit, Tesseract, SQLite, PDF generation/editing",
        "Offline-first architecture: caching, retry handling, predictable error states",
        "Backend integration: Supabase, Appwrite, Firebase, REST APIs",
        "Store publishing and production build preparation (Google Play & App Store)",
      ],
      languagesText: "Arabic (Native), English (Technical working proficiency)",
      detailPage: {
        viewDetails: "View details",
        back: "Back to CV",
        overview: "Overview",
        screenshots: "Screenshots",
        video: "Video",
        links: "Links & Downloads",
        directDownload: "Direct Download",
        playStore: "Google Play",
        appStore: "App Store",
        github: "GitHub",
        website: "Website",
        techStack: "Tech Stack",
        comingSoon: "Coming soon",
        linkedin: "LinkedIn Post",
        linkedinCopy: "Copy",
        notFound: "Project not found",
        notFoundBody:
          "This project doesn't exist. Return to the CV to browse all projects.",
      },
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
        "مطوّر Flutter بخبرة 4 سنوات في تصميم وبناء ونشر تطبيقات موبايل إنتاجية على Google Play وApp Store — من بينها منصة صوت اجتماعي حيّة تجاوزت 5,000 تنزيل. متخصص في Clean Architecture وإدارة الحالة بـ BLoC/Cubit وأنظمة offline-first، مع خبرة عميقة في الصوت/الدردشة اللحظية (ZEGOCLOUD وLiveKit وWebSockets)، ومعالجة OCR على الجهاز، والتكامل مع خدمات خلفية متعددة (Supabase وFirebase وAppwrite). يمتلك دورة الحياة الكاملة للموبايل: المتطلبات، المعمارية، الواجهات، تكامل الخلفية، ضبط الأداء، والنشر على المتاجر.",
      experienceRole: "مطوّر Flutter — مستقل وعقود (عن بُعد) — 07/2022 – حتى الآن",
      experienceList: [
        "صممت وأطلقت أكثر من 5 تطبيقات Flutter إنتاجية من الصفر حتى النشر في مجالات الصوت الاجتماعي والمتاجر وإدارة المستندات والمحتوى — مع التحكم الكامل بالمعمارية وإدارة الحالة وتكامل الخلفية والأداء والنشر على Google Play وApp Store.",
        "بنيت منصة صوت اجتماعي لحظية (LKLK) مصمّمة لتحمّل 500 مستمع و20 مقعد ميكروفون في الغرفة الواحدة، مع تكامل SDK صوت مزدوج (ZEGOCLOUD + LiveKit) وثلاثة قنوات لحظية متزامنة مع منطق إعادة اتصال لكل قناة — تجاوز التطبيق 5,000 تنزيل.",
        "صممت منظومة تحقيق الدخل والتفاعل: مشتريات داخل التطبيق (6 باقات عملات)، محرّك رسوم هدايا SVGA/VAP بسعة 8 رسوم متزامنة وفاصل طابور أقل من 100ms، ونظام VIP وتحفيز متدرّج.",
        "سلّمت سوق سيارات ثنائي اللغة (Wolfera) على Supabase (PostgreSQL مع Row-Level Security، مصادقة مع Google/Apple SSO، محادثة لحظية، تخزين)، مع فلترة NSFW على الجهاز بـ TFLite، وتنبيهات FCM عند انخفاض الأسعار، وبحث متقدم بأكثر من 15 فلتراً مع تمرير لانهائي.",
        "بنيت ماسح مستندات offline-first (Office Archiving) بخط OCR مزدوج المحرّك (Google ML Kit + Tesseract) للعربية/الإنجليزية — متعدد الاتجاهات، معالجة مسبقة، اختيار أفضل نتيجة — إضافةً لمجموعة أدوات PDF كاملة وبحث نصي في SQLite، كل ذلك على الجهاز بلا خادم.",
        "وحّدت أسلوب الهندسة عبر جميع التطبيقات: Clean Architecture مع وحدات feature-based وBLoC/Cubit وGetIt/Injectable، معالجة أخطاء typed Either، تخزين offline-first مع ترقيم وإعادة محاولة أُسّية 3 مرات، وisolates ومهام خلفية لـ OCR وPDF والصوت.",
        "حصّنت الإصدارات بـ app flavors وProGuard/R8 وتخزين آمن وبيئات منفصلة وفلترة أعطال Crashlytics؛ نشرت وصنت التطبيقات على Google Play وApple App Store.",
      ],
      skillsList: [
        "اللغات: Dart، SQL، C# (أكاديمي)، Kotlin (أساسي)",
        "الموبايل والواجهات: Flutter، Material 3، Android، iOS، واجهات تكيّفية، RTL وتعريب (عربي/إنجليزي)، تحسين الصور",
        "المعمارية وإدارة الحالة: Clean Architecture، SOLID، MVVM، وحدات feature-based، BLoC، Cubit، Provider، GetIt، Injectable، Freezed، dartz/Either",
        "الخلفية والـ APIs: REST، Dio (interceptors، إعادة المحاولة)، WebSockets، Supabase (PostgreSQL، Auth، Realtime، Storage، RLS)، Firebase (Auth، FCM، Analytics، Crashlytics)، Appwrite",
        "الوقت الحقيقي والوسائط: ZEGOCLOUD (ZegoExpress)، LiveKit، ZIM، just_audio، audio_session، رسوم SVGA/VAP، background_downloader",
        "التخزين ودون اتصال: Hive، SQLite (sqflite)، تخزين آمن، offline-first caching، ترقيم، stale-while-revalidate، أخطاء typed",
        "ML والمستندات: Google ML Kit، Tesseract OCR، TFLite، إنشاء/تعديل PDF، طباعة، بحث نصي كامل",
        "الإصدار والجودة: App flavors، ProGuard/R8، Crashlytics، تخزين آمن، بيئات منفصلة، isolates ومهام خلفية، مشتريات داخل التطبيق، نشر على Google Play وApp Store",
        "التنقّل والأدوات: GoRouter، Git، GitHub، Postman، Figma، build_runner",
      ],
      education: {
        heading: "دبلوم هندسة حاسبات، جامعة حلب (2020–2022)",
        items: ["التركيز: هندسة البرمجيات", "حلب، سوريا"],
      },
      achievements: [
        "صممت وأطلقت أكثر من 5 تطبيقات إنتاجية على Google Play وApp Store",
        "بنيت غرف صوت اجتماعية لحظية تدعم حتى 500 مستمع متزامن و20 مقعد ميكروفون باستخدام ZEGOCLOUD + LiveKit",
        "تجاوز أحد التطبيقات العامة (LKLK) 5,000 تنزيل عبر أكثر من 80 إصداراً",
        "نفّذت خط OCR مزدوج المحرّك (ML Kit + Tesseract) لاستخراج نصي موثوق من المستندات العربية والإنجليزية المختلطة",
        "صممت أنظمة offline-first بـ Hive وSQLite وترقيم وstale-while-revalidate وإعادة محاولة أُسّية وأخطاء typed Either",
        "أطلقت فلترة صور TFLite وأمان PDF وتلخيص AI بلا أي تبعية على خادم",
      ],
      advancedSkills: [
        "Clean Architecture مع وحدات feature-based وطبقات UI ومجال وبيانات مفصولة تماماً — مطبّقة على 5 تطبيقات إنتاجية",
        "أنظمة offline-first بـ Hive وSQLite وترقيم وstale-while-revalidate وردود فعل أخطاء typed",
        "تكامل لحظي بـ WebSockets وSupabase Realtime وZEGOCLOUD ZegoExpress وZIM — مع منطق إعادة اتصال مستقل لكل قناة",
        "خطوط ML على الجهاز: OCR (ML Kit + Tesseract)، استنتاج TFLite، تسجيل متعدد المرشّحين، ومعالجة PDF آمنة من الذاكرة",
        "هندسة إصدار إنتاجي: flavors وProGuard/R8 وCrashlytics وتخزين آمن وبيئات منفصلة وisolates ومهام خلفية",
      ],
      services: [
        "تطوير تطبيقات موبايل كاملة (iOS وAndroid) من الفكرة حتى المتجر",
        "تصميم Clean Architecture: وحدات feature-based وBLoC/Cubit وإعداد DI",
        "ميزات لحظية: غرف صوت، تدفقات رسائل، WebSockets، Supabase Realtime",
        "تدفّقات OCR والمستندات: ML Kit وTesseract وSQLite وإنشاء/تعديل PDF",
        "معمارية offline-first: تخزين، معالجة إعادة المحاولة، حالات خطأ متوقعة",
        "تكامل خلفي: Supabase وAppwrite وFirebase وREST APIs",
        "نشر على المتاجر وإعداد إصدارات إنتاجية (Google Play وApp Store)",
      ],
      languagesText: "العربية (لغة أم)، الإنجليزية (كفاءة عمل تقنية)",
      detailPage: {
        viewDetails: "التفاصيل",
        back: "العودة إلى السيرة",
        overview: "نظرة عامة",
        screenshots: "لقطات الشاشة",
        video: "فيديو",
        links: "الروابط والتنزيل",
        directDownload: "تنزيل مباشر",
        playStore: "Google Play",
        appStore: "App Store",
        github: "GitHub",
        website: "الموقع",
        techStack: "التقنيات",
        comingSoon: "قريباً",
        linkedin: "منشور LinkedIn",
        linkedinCopy: "نسخ",
        notFound: "المشروع غير موجود",
        notFoundBody: "هذا المشروع غير موجود. عُد إلى السيرة لتصفّح كل المشاريع.",
      },
    },
  };

  const _cvVersion = (typeof window !== 'undefined' && window.CV_VERSION) || 'flutter';
  if (_cvVersion === 'se') {
    // ── English overrides ──────────────────────────────────────────────
    translations.en.header.jobTitle = 'Software Engineer & Flutter Developer';
    translations.en.experienceRole = 'Flutter Developer — Independent & Contract (Remote) — 07/2022 – Present';
    translations.en.downloadsPage.subtitle = 'Software Engineer & Flutter Developer • Remote from Syria';
    translations.en.nav.additionalExp = 'Add. Exp.';

    translations.en.summaryText =
      'Software Engineer and Flutter Developer with 4 years designing, building, and shipping production mobile apps to Google Play and the App Store — including a live social-audio platform that surpassed 5,000+ downloads. Grounded in a software-engineering foundation: systems analysis, requirements analysis, relational database design, algorithms, OOP, and SDLC — applied from the first sketch to the shipped product. Specialized in Clean Architecture, BLoC/Cubit state management, and offline-first systems, with deep hands-on work in real-time audio/chat (ZEGOCLOUD, LiveKit, WebSockets), on-device ML/OCR, and multi-backend integration (Supabase, Firebase, Appwrite). Owns the full software development lifecycle end-to-end.';

    translations.en.downloadsPage.atsSummary =
      'Software Engineer and Flutter Developer with 4 years of independent and contract experience. Production-oriented Flutter/Dart apps, Clean Architecture, BLoC/Cubit, Supabase/Appwrite/Firebase, offline-first flows, real-time audio/chat, OCR/document workflows, systems analysis, relational DB design, and store publishing.';

    // SE-specific skills list — Flutter skills kept, SE foundations added
    translations.en.skillsList = [
      'Languages: Dart, SQL, C#, Kotlin (basic)',
      'Mobile & UI: Flutter, Material 3, Android, iOS, responsive UI, RTL & localization (AR/EN), image optimization',
      'Architecture & State: Clean Architecture, SOLID, MVVM, feature-based modules, BLoC, Cubit, Provider, GetIt, Injectable, Freezed, dartz/Either',
      'Backend & APIs: REST, Dio (interceptors, retry/backoff), WebSockets, Supabase (PostgreSQL, Auth, Realtime, Storage, RLS), Firebase (Auth, FCM, Analytics, Crashlytics), Appwrite',
      'Real-time & Media: ZEGOCLOUD (ZegoExpress), LiveKit, ZIM, just_audio, audio_session, SVGA/VAP animation, background_downloader',
      'Storage & Offline: Hive, SQLite (sqflite), secure storage, offline-first caching, pagination, stale-while-revalidate, typed failures',
      'On-device ML & Docs: Google ML Kit, Tesseract OCR, TFLite, PDF generation/editing, printing, full-text search',
      'Release & Quality: App flavors, ProGuard/R8, Crashlytics, secure storage, env separation, isolates & background tasks, in-app purchases, Google Play & App Store',
      'CS & Engineering Foundations: Data Structures & Algorithms, OOP, Software Engineering, Systems Analysis & Design, relational DB design & SQL, UML & systems modeling, SDLC, requirements analysis & technical documentation',
      'Tools: GoRouter, Git, GitHub, Postman, Figma, build_runner / codegen',
    ];

    // SE-specific achievements — adds university recognition & SE scope
    translations.en.achievements = [
      'Designed and shipped 5+ production mobile apps end-to-end across social-audio, marketplace, document-management, and content domains',
      'Built real-time social-audio rooms (LKLK) supporting up to 500 concurrent listeners and 20 mic seats — surpassed 5,000+ downloads',
      'Implemented a custom dual-engine OCR pipeline (ML Kit + Tesseract) for reliable Arabic/English extraction on mixed real-world documents',
      'Delivered two warehouse-management systems (Windows Forms) for the University of Aleppo — both recognized by faculty deans, one commended by the University Presidency',
      'Applied full SDLC: requirements analysis, UML system modeling, relational DB schema design, implementation, and store publishing — across all major projects',
      'Engineered offline-first architectures (Hive, SQLite, stale-while-revalidate, 3-retry exponential backoff, typed Either failures) across multiple apps',
    ];

    // SE-specific advanced skills
    translations.en.advancedSkills = [
      'Full software development lifecycle (SDLC): requirements analysis → UML modeling → DB design → implementation → release — applied end-to-end on all major projects',
      'Clean Architecture with feature-based modules and strictly separated UI, domain, and data layers — across 5 production apps',
      'Offline-first systems using Hive, SQLite, pagination, stale-while-revalidate caching, and typed failure responses',
      'Real-time integrations with WebSockets, Supabase Realtime, ZEGOCLOUD ZegoExpress, and ZIM — with per-channel reconnect logic',
      'On-device ML pipelines: OCR (ML Kit + Tesseract), TFLite inference, multi-candidate scoring, and memory-safe PDF rasterization',
      'Relational database design: schema normalization, SQL queries, SQLite migration strategies (additive-only, safe for existing users)',
    ];

    translations.en.experienceEntries = [
      {
        role: 'Flutter Developer — Independent & Contract',
        period: '07/2022 – Present',
        location: 'Remote',
        items: [
          'Designed and shipped 5+ production Flutter apps end-to-end — owning architecture, state management, backend integration, performance, and store release on Google Play and the App Store.',
          'Built a real-time social-audio platform (LKLK) architected for up to 500 listeners and 20 mic seats per room, integrating dual audio SDKs (ZEGOCLOUD + LiveKit) and three concurrent realtime channels with per-channel reconnect and exponential backoff; app surpassed 5,000+ downloads.',
          'Engineered the app\'s monetization and engagement stack: in-app purchases (6 coin tiers), an SVGA/VAP virtual-gift animation engine (concurrency-capped at 8, sub-100 ms queue interval), VIP tiers, and gamified progression.',
          'Delivered a bilingual (AR/EN) car marketplace (Wolfera) on Supabase (PostgreSQL with Row-Level Security, Auth + Google/Apple SSO, Realtime chat, Storage), with on-device TFLite image moderation, FCM price-drop alerts, and advanced search across 15+ filters with infinite scroll.',
          'Built an offline-first document scanner (Office Archiving) with a dual-engine OCR pipeline (ML Kit + Tesseract) for Arabic/English — multi-orientation, preprocessing, best-result scoring — plus a full PDF toolkit and SQLite full-text search, all on-device.',
          'Standardized engineering across apps: Clean Architecture, BLoC/Cubit + GetIt/Injectable, typed Either error handling, offline-first caching with 3-retry exponential backoff, and isolates/background tasks for OCR, PDF, and audio.',
          'Hardened releases with app flavors, ProGuard/R8, secure storage, environment separation, and Crashlytics crash filtering.',
        ],
      },
      {
        role: 'Android Developer (Kotlin) — University & Independent Projects',
        period: '2022',
        location: 'Aleppo, Syria',
        items: [
          'Built "Ana Mubarmej" (I Am a Programmer): curated learning tracks for 8 languages, an in-app WebView code console, and auto-graded quizzes with scoring.',
          'Graduation project: a programming-education platform (courses, articles, and runnable code samples) — covered requirements analysis, system design, and full implementation.',
        ],
      },
      {
        role: 'Windows Application Developer — University Projects',
        period: '2021 – 2022',
        location: 'Aleppo, Syria',
        items: [
          'Delivered a warehouse-management system for the Faculty of Pharmacy (Windows Forms, 2021) — recognized with a special commendation from the Dean of Pharmacy.',
          'Delivered a warehouse-management system for the Faculty of Science / Chemistry Department (Windows Forms, 2022) — recognized by the Dean of Science and awarded a special commendation from the University of Aleppo Presidency.',
        ],
      },
    ];

    translations.en.additionalTechExperience = {
      title: 'CS & Engineering Foundations',
      sections: [
        {
          title: 'Academic & Applied Software Engineering',
          items: [
            'Data Structures & Algorithms — applied in search, pagination, caching, and scoring logic across production apps',
            'Object-Oriented Programming (OOP) — foundation for all Flutter, Kotlin, and C# work',
            'Systems Analysis & Design — requirements gathering, use-case modeling, and system specification',
            'Relational database design — schema normalization, SQL queries, foreign keys, and index strategy',
            'UML diagrams and systems modeling — class, sequence, and ER diagrams',
            'Software Development Life Cycle (SDLC) — applied from requirements to store release on every major project',
            'Software requirements analysis and technical documentation — written for all university and contract projects',
            'C# programming (Windows Forms projects, academic coursework)',
          ],
        },
      ],
    };

    // ── Arabic overrides ───────────────────────────────────────────────
    translations.ar.header.jobTitle = 'مهندس برمجيات ومطوّر Flutter';
    translations.ar.experienceRole = 'مطوّر Flutter — مستقل وعقود (عن بُعد) — 07/2022 – حتى الآن';
    translations.ar.downloadsPage.subtitle = 'مهندس برمجيات ومطوّر Flutter • عن بُعد من سوريا';
    translations.ar.nav.additionalExp = 'أسس هندسة البرمجيات';

    translations.ar.summaryText =
      'مهندس برمجيات ومطوّر Flutter بخبرة 4 سنوات في تصميم وبناء ونشر تطبيقات موبايل إنتاجية على Google Play وApp Store — من بينها منصة صوت اجتماعي حيّة تجاوزت 5,000 تنزيل. مدعوم بأساس هندسة برمجيات أكاديمي تطبيقي: تحليل الأنظمة، تحليل المتطلبات، تصميم قواعد البيانات العلائقية، الخوارزميات، OOP، وSDLC — مطبّقة من أول رسمة حتى المنتج المنشور. متخصص في Clean Architecture وBLoC/Cubit وأنظمة offline-first، مع خبرة عميقة في الصوت/الدردشة اللحظية ومعالجة OCR على الجهاز والتكامل مع خدمات خلفية متعددة.';

    translations.ar.downloadsPage.atsSummary =
      'مهندس برمجيات ومطوّر Flutter بخبرة 4 سنوات في العمل المستقل والعقود. تطبيقات Flutter/Dart إنتاجية، Clean Architecture، BLoC/Cubit، Supabase/Appwrite/Firebase، تدفقات offline-first، صوت/دردشة لحظية، OCR/مستندات، تحليل أنظمة، تصميم قواعد بيانات، والنشر على المتاجر.';

    // SE-specific skills list (Arabic)
    translations.ar.skillsList = [
      'اللغات البرمجية: Dart، SQL، C#، Kotlin (أساسي)',
      'الموبايل والواجهات: Flutter، Material 3، Android، iOS، واجهات تكيّفية، RTL وتعريب (عربي/إنجليزي)، تحسين الصور',
      'المعمارية وإدارة الحالة: Clean Architecture، SOLID، MVVM، وحدات feature-based، BLoC، Cubit، Provider، GetIt، Injectable، Freezed، dartz/Either',
      'الخلفية والـ APIs: REST، Dio (interceptors، إعادة المحاولة)، WebSockets، Supabase (PostgreSQL، Auth، Realtime، Storage، RLS)، Firebase (Auth، FCM، Analytics، Crashlytics)، Appwrite',
      'الوقت الحقيقي والوسائط: ZEGOCLOUD (ZegoExpress)، LiveKit، ZIM، just_audio، audio_session، رسوم SVGA/VAP، background_downloader',
      'التخزين ودون اتصال: Hive، SQLite (sqflite)، تخزين آمن، offline-first caching، ترقيم، stale-while-revalidate، أخطاء typed',
      'ML والمستندات: Google ML Kit، Tesseract OCR، TFLite، إنشاء/تعديل PDF، طباعة، بحث نصي كامل',
      'الإصدار والجودة: App flavors، ProGuard/R8، Crashlytics، تخزين آمن، بيئات منفصلة، isolates ومهام خلفية، مشتريات داخل التطبيق، Google Play وApp Store',
      'أسس علوم الحاسب وهندسة البرمجيات: هياكل البيانات والخوارزميات، OOP، هندسة البرمجيات، تحليل وتصميم الأنظمة، تصميم قواعد البيانات العلائقية وSQL، مخططات UML، SDLC، تحليل المتطلبات والتوثيق التقني',
      'الأدوات: GoRouter، Git، GitHub، Postman، Figma، build_runner',
    ];

    // SE-specific achievements (Arabic)
    translations.ar.achievements = [
      'صممت وأطلقت أكثر من 5 تطبيقات موبايل إنتاجية من الصفر حتى النشر في مجالات الصوت الاجتماعي والمتاجر وإدارة المستندات والمحتوى',
      'بنيت غرف صوت اجتماعية لحظية (LKLK) تدعم حتى 500 مستمع متزامن و20 مقعد ميكروفون — تجاوزت 5,000 تنزيل',
      'نفّذت خط OCR مزدوج المحرّك (ML Kit + Tesseract) لاستخراج نصي موثوق من المستندات العربية والإنجليزية المختلطة',
      'سلّمت نظامَي إدارة مستودعات (Windows Forms) لجامعة حلب — حصل كلاهما على شكر العمداء، والأخير على تقدير من رئاسة الجامعة',
      'طبّقت SDLC كاملاً: تحليل متطلبات، نمذجة UML، تصميم قاعدة بيانات، تنفيذ، ونشر على المتاجر — في جميع المشاريع الرئيسية',
      'صمّمت معمارية offline-first (Hive، SQLite، stale-while-revalidate، إعادة محاولة أُسّية 3 مرات، أخطاء typed Either) على تطبيقات متعددة',
    ];

    // SE-specific advanced skills (Arabic)
    translations.ar.advancedSkills = [
      'دورة حياة تطوير البرمجيات كاملة (SDLC): تحليل متطلبات ← نمذجة UML ← تصميم قاعدة بيانات ← تنفيذ ← إصدار — مطبّقة من البداية للنهاية في كل المشاريع',
      'Clean Architecture مع وحدات feature-based وطبقات UI ومجال وبيانات مفصولة تماماً — على 5 تطبيقات إنتاجية',
      'أنظمة offline-first بـ Hive وSQLite وترقيم وstale-while-revalidate وأخطاء typed',
      'تكامل لحظي بـ WebSockets وSupabase Realtime وZEGOCLOUD ZegoExpress وZIM — مع منطق إعادة اتصال مستقل لكل قناة',
      'خطوط ML على الجهاز: OCR (ML Kit + Tesseract)، استنتاج TFLite، تسجيل متعدد المرشّحين، ومعالجة PDF آمنة من الذاكرة',
      'تصميم قواعد بيانات علائقية: تطبيع المخطط، استعلامات SQL، استراتيجيات ترقية SQLite الآمنة (additive-only)',
    ];

    translations.ar.experienceEntries = [
      {
        role: 'مطوّر Flutter — مستقل وعقود',
        period: '07/2022 – حتى الآن',
        location: 'عن بُعد',
        items: [
          'صممت وأطلقت أكثر من 5 تطبيقات Flutter إنتاجية من الصفر حتى النشر — مع التحكم الكامل بالمعمارية وإدارة الحالة وتكامل الخلفية والأداء والنشر على Google Play وApp Store.',
          'بنيت منصة صوت اجتماعي لحظية (LKLK) مصمّمة لتحمّل 500 مستمع و20 مقعد ميكروفون، مع تكامل SDK صوت مزدوج (ZEGOCLOUD + LiveKit) وثلاثة قنوات لحظية متزامنة مع منطق إعادة اتصال لكل قناة — تجاوز التطبيق 5,000 تنزيل.',
          'صممت منظومة تحقيق الدخل والتفاعل: مشتريات داخل التطبيق (6 باقات عملات)، محرّك رسوم هدايا SVGA/VAP بسعة 8 رسوم متزامنة وفاصل طابور أقل من 100ms، ونظام VIP وتحفيز متدرّج.',
          'سلّمت سوق سيارات ثنائي اللغة (Wolfera) على Supabase (PostgreSQL مع Row-Level Security، مصادقة مع Google/Apple SSO، محادثة لحظية، تخزين)، مع فلترة NSFW على الجهاز بـ TFLite، وتنبيهات FCM عند انخفاض الأسعار، وبحث متقدم بأكثر من 15 فلتراً مع تمرير لانهائي.',
          'بنيت ماسح مستندات offline-first (Office Archiving) بخط OCR مزدوج المحرّك (Google ML Kit + Tesseract) للعربية/الإنجليزية — متعدد الاتجاهات، معالجة مسبقة، اختيار أفضل نتيجة — إضافةً لمجموعة أدوات PDF كاملة وبحث نصي في SQLite، كل ذلك على الجهاز بلا خادم.',
          'وحّدت أسلوب الهندسة عبر جميع التطبيقات: Clean Architecture مع وحدات feature-based وBLoC/Cubit وGetIt/Injectable، ومعالجة أخطاء typed Either، وisolates ومهام خلفية.',
          'حصّنت الإصدارات بـ app flavors وProGuard/R8 وتخزين آمن وبيئات منفصلة وفلترة أعطال Crashlytics.',
        ],
      },
      {
        role: 'مطوّر Android (Kotlin) — مشاريع جامعية ومستقلة',
        period: '2022',
        location: 'حلب، سوريا',
        items: [
          'بنيت تطبيق "أنا مبرمج": مسارات تعلّم لـ 8 لغات برمجية، كونسول تنفيذ أكواد عبر WebView، واختبارات تلقائية بتصحيح ذاتي.',
          'مشروع التخرج: منصة تعليمية برمجية (كورسات، مقالات، وأكواد قابلة للتنفيذ) — شمل تحليل المتطلبات، تصميم النظام، والتنفيذ الكامل.',
        ],
      },
      {
        role: 'مطوّر تطبيقات ويندوز — مشاريع جامعية',
        period: '2021 – 2022',
        location: 'حلب، سوريا',
        items: [
          'سلّمت نظام إدارة مستودعات لكلية الصيدلة (Windows Forms، 2021) — حصل على شكر خاص من عميد كلية الصيدلة.',
          'سلّمت نظام إدارة مستودعات لكلية العلوم / قسم الكيمياء (Windows Forms، 2022) — حصل على شكر من عميد كلية العلوم وتقدير إضافي من رئاسة جامعة حلب.',
        ],
      },
    ];

    translations.ar.additionalTechExperience = {
      title: 'أسس علوم الحاسب وهندسة البرمجيات',
      sections: [
        {
          title: 'هندسة برمجيات أكاديمية وتطبيقية',
          items: [
            'هياكل البيانات والخوارزميات — مطبّقة في البحث والترقيم والتخزين وخوارزميات التسجيل في التطبيقات الإنتاجية',
            'البرمجة كائنية التوجه (OOP) — أساس جميع مشاريع Flutter وKotlin وC#',
            'تحليل وتصميم الأنظمة — تجميع المتطلبات، نمذجة حالات الاستخدام، وكتابة المواصفات',
            'تصميم قواعد البيانات العلائقية — تطبيع المخطط، استعلامات SQL، المفاتيح الخارجية، واستراتيجية الفهرسة',
            'مخططات UML ونمذجة الأنظمة — مخططات الفئات والتسلسل والكيانات',
            'دورة حياة تطوير البرمجيات (SDLC) — مطبّقة من المتطلبات حتى النشر على المتاجر في كل مشروع رئيسي',
            'تحليل المتطلبات البرمجية والتوثيق التقني — موثّق في جميع المشاريع الجامعية والتعاقدية',
            'لغة C# (مشاريع Windows Forms، مواد أكاديمية)',
          ],
        },
      ],
    };

    downloads.files.en.docx = 'assets/downloads/CV_SE_EN.docx';
    downloads.files.en.pdf = 'assets/downloads/CV_SE_EN.pdf';
    downloads.files.ar.docx = 'assets/downloads/CV_SE_AR.docx';
    downloads.files.ar.pdf = 'assets/downloads/CV_SE_AR.pdf';
  }

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
