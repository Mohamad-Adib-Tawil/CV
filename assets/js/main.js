(() => {
  const data = window.CV_DATA;

  if (!data) {
    return;
  }

  const THEME_CLASSES = [
    "theme-blue",
    "theme-purple",
    "theme-teal",
    "theme-slate",
    "theme-navy",
    "theme-emerald",
    "theme-midnight",
    "theme-royal",
    "theme-silver",
  ];

  const state = {
    currentLang: "en",
    statsAnimated: false,
  };

  const storage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (_) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (_) {}
    },
  };

  const profile = data.profile;
  const body = document.body;
  const page = body?.dataset.page || "home";
  const themeRoot = document.documentElement;

  const $ = (id) => document.getElementById(id);

  const themeToggle = $("themeToggle");
  const themeIcon = themeToggle?.querySelector("i") || null;
  const presetSelect = $("themePreset");
  const langSelect = $("langSelect");

  const getDict = (lang = state.currentLang) =>
    data.translations[lang] || data.translations.en;

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const stripHtml = (value) =>
    String(value)
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const compactUrl = (value) => String(value).replace(/^https?:\/\//, "").replace(/\/$/, "");

  const fileSafeName = (value) => value.replace(/\s+/g, "_");

  const getQueryParam = (key) =>
    new URLSearchParams(window.location.search).get(key);

  const setText = (id, value) => {
    const element = $(id);

    if (element && value != null) {
      element.textContent = value;
    }

    return element;
  };

  const setHtml = (id, value) => {
    const element = $(id);

    if (element && value != null) {
      element.innerHTML = value;
    }

    return element;
  };

  const setHeadingText = (id, value) => {
    const element = $(id);

    if (!element || value == null) {
      return;
    }

    const icon = element.querySelector("i");
    element.textContent = ` ${value}`;

    if (icon) {
      element.prepend(icon);
    }
  };

  const renderList = (selector, items) => {
    const element = document.querySelector(selector);

    if (!element || !Array.isArray(items)) {
      return;
    }

    element.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  };

  const enableThemeTransition = () => {
    body.classList.add("theme-transition");
    window.setTimeout(() => body.classList.remove("theme-transition"), 300);
  };

  const updateThemeColorMeta = () => {
    const meta = document.querySelector('meta[name="theme-color"]');

    if (!meta) {
      return;
    }

    const styles = getComputedStyle(body);
    const primary = styles.getPropertyValue("--primary-color").trim() || "#0066cc";
    meta.setAttribute("content", primary);
  };

  const luminance = (r, g, b) => {
    const adjusted = [r, g, b].map((value) => {
      const channel = value / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * adjusted[0] + 0.7152 * adjusted[1] + 0.0722 * adjusted[2];
  };

  const parseRGB = (value) => {
    const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return match ? [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)] : [0, 0, 0];
  };

  const contrastRatio = (rgb1, rgb2) => {
    const light = Math.max(luminance(rgb1[0], rgb1[1], rgb1[2]), luminance(rgb2[0], rgb2[1], rgb2[2])) + 0.05;
    const dark = Math.min(luminance(rgb1[0], rgb1[1], rgb1[2]), luminance(rgb2[0], rgb2[1], rgb2[2])) + 0.05;
    return light / dark;
  };

  const updateContrast = () => {
    const styles = getComputedStyle(body);
    const bodyBg = styles.backgroundColor;
    const bodyColor = styles.color;
    const ratio = contrastRatio(parseRGB(bodyBg), parseRGB(bodyColor));

    if (ratio < 4.5) {
      const [r, g, b] = parseRGB(bodyBg);
      const target = luminance(r, g, b) > 0.5 ? "#111111" : "#f5f5f5";
      themeRoot.style.setProperty("--dark-text", target);
      return;
    }

    themeRoot.style.removeProperty("--dark-text");
  };

  const applyThemeState = (isDark) => {
    themeRoot.classList.toggle("dark-mode", isDark);

    if (themeIcon) {
      themeIcon.classList.toggle("fa-sun", isDark);
      themeIcon.classList.toggle("fa-moon", !isDark);
    }

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    }
  };

  const normalizePreset = (preset) => {
    if (preset === "navy") {
      return "royal";
    }

    if (preset === "emerald") {
      return "silver";
    }

    return preset || "purple";
  };

  const applyPreset = (preset) => {
    body.classList.remove(...THEME_CLASSES);

    switch (preset) {
      case "purple":
        body.classList.add("theme-purple");
        break;
      case "teal":
        body.classList.add("theme-teal");
        break;
      case "slate":
        body.classList.add("theme-slate");
        break;
      case "royal":
      case "navy":
        body.classList.add("theme-royal");
        break;
      case "silver":
      case "emerald":
        body.classList.add("theme-silver");
        break;
      case "midnight":
        body.classList.add("theme-midnight");
        break;
      default:
        body.classList.add("theme-blue");
        break;
    }

    updateThemeColorMeta();
    updateContrast();
  };

  const renderStats = (lang) => {
    const grid = $("statsGrid");

    if (!grid) {
      return;
    }

    grid.innerHTML = data.stats
      .map((stat) => {
        const label = stat.label[lang] || stat.label.en;
        const statValue = state.statsAnimated ? formatStatValue(stat.value) : "0";

        return `
          <div class="stat-card">
            <i class="${escapeHtml(stat.icon)} stat-icon" aria-hidden="true"></i>
            <div class="stat-number" data-target="${escapeHtml(stat.value)}">${statValue}</div>
            <div class="stat-label">${escapeHtml(label)}</div>
          </div>
        `;
      })
      .join("");
  };

  const renderProjects = (lang) => {
    const tableBody = $("projectsTableBody");

    if (!tableBody) {
      return;
    }

    const dict = getDict(lang);
    const fromParam =
      typeof window !== "undefined" && window.CV_VERSION === "se" ? "&from=se" : "";
    const viewDetailsLabel = dict.detailPage?.viewDetails || "View details";

    tableBody.innerHTML = data.projects
      .map((project) => {
        const alt = project.image.alt[lang] || project.image.alt.en;
        const logo = project.logo || project.image;
        const logoAlt = logo.alt?.[lang] || logo.alt?.en || alt;
        const description = project.description[lang] || project.description.en;
        const slug = project.slug || project.id;
        const detailsHref = `project.html?id=${encodeURIComponent(slug)}${fromParam}`;

        return `
          <tr class="project-row" data-href="${escapeHtml(detailsHref)}" role="button" tabindex="0" aria-label="${escapeHtml(project.name)}">
            <td class="project-name">
              <span class="project-name-lockup">
                <img class="project-logo project-logo--animated" src="${escapeHtml(logo.src)}" alt="${escapeHtml(logoAlt)}" width="52" height="52" loading="lazy" decoding="async">
                <span>${escapeHtml(project.name)}</span>
              </span>
              <div class="project-tech">
                ${project.tech
                  .map((item) => `<span class="tech-badge">${escapeHtml(item)}</span>`)
                  .join("")}
              </div>
            </td>
            <td>
              <div class="project-description">
                <img
                  src="${escapeHtml(project.image.src)}"
                  alt="${escapeHtml(alt)}"
                  class="project-thumb"
                  loading="lazy"
                  width="120"
                  height="120"
                  decoding="async"
                >
                <p>${description}</p>
                <a class="project-details-link" href="${escapeHtml(detailsHref)}">
                  ${escapeHtml(viewDetailsLabel)} <i class="fas fa-arrow-right" aria-hidden="true"></i>
                </a>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  };

  const renderNav = (dict) => {
    const navMap = [
      ["navSummary", "summary"],
      ["navExperience", "experience"],
      ["navProjects", "projects"],
      ["navSkills", "skills"],
      ["navEducation", "education"],
      ["navAchievements", "achievements"],
      ["navAdvanced", "advanced"],
      ["navServices", "services"],
      ["navLanguages", "languages"],
      ["navAdditionalExp", "additionalExp"],
      ["navDownload", "download"],
    ];

    navMap.forEach(([id, key]) => {
      if (dict.nav[key] != null) setText(id, dict.nav[key]);
    });
  };

  const renderHeader = (dict) => {
    const headerSubtitle = page === "downloads" ? dict.downloadsPage.subtitle : dict.header.jobTitle;

    setText("jobTitle", headerSubtitle);
    setText("availabilityBadge", dict.header.availability);
    setText("employmentBadge", dict.header.employment);
    setText("ctaWorkText", dict.header.ctaWork);
    setText("ctaContactText", dict.header.ctaContact);
    setText("ctaWebsiteText", dict.header.ctaWebsite);
    setText("ctaDownloadText", dict.header.ctaDownload);
    setText("ctaHireText", dict.header.ctaHire);

    const headerBadges = $("headerBadges");
    if (headerBadges && Array.isArray(dict.header.badges)) {
      headerBadges.innerHTML = dict.header.badges
        .map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`)
        .join("");
    }
  };

  const renderSectionTitles = (dict) => {
    setHeadingText("summaryTitle", dict.titles.summary);
    setHeadingText("experienceTitle", dict.titles.experience);
    setHeadingText("projectsTitle", dict.titles.projects);
    setHeadingText("skillsTitle", dict.titles.skills);
    setHeadingText("educationTitle", dict.titles.education);
    setHeadingText("achievementsTitle", dict.titles.achievements);
    setHeadingText("advancedSkillsTitle", dict.titles.advanced);
    setHeadingText("servicesTitle", dict.titles.services);
    setHeadingText("languagesTitle", dict.titles.languages);
  };

  const renderContentSections = (dict) => {
    setText("summaryText", dict.summaryText);
    setText("languagesText", dict.languagesText);

    // Multi-entry experience (SE version) vs single entry (Flutter version)
    if (dict.experienceEntries && Array.isArray(dict.experienceEntries)) {
      const container = $("experienceContainer");
      if (container) {
        container.innerHTML = dict.experienceEntries.map((entry) => `
          <div class="exp-entry">
            <div class="exp-entry-header">
              <h3>${escapeHtml(entry.role)}</h3>
              <div class="exp-entry-meta">
                <span class="exp-period">${escapeHtml(entry.period)}</span>
                <span class="exp-location">${escapeHtml(entry.location)}</span>
              </div>
            </div>
            <ul>${entry.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </div>
        `).join("");
      }
    } else {
      setText("experienceRole", dict.experienceRole);
      const experienceList = $("experienceList");
      if (experienceList) {
        experienceList.innerHTML = dict.experienceList.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      }
    }

    // Additional technical experience section (SE version only)
    if (dict.additionalTechExperience) {
      setHeadingText("additionalTechTitle", dict.additionalTechExperience.title);
      const container = $("additionalTechContainer");
      if (container) {
        container.innerHTML = dict.additionalTechExperience.sections.map((sec) => `
          <div class="additional-tech-section">
            <h3>${escapeHtml(sec.title)}</h3>
            <ul>${sec.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </div>
        `).join("");
      }
    }

    renderList(".skill-list", dict.skillsList);
    renderList(".achievement-list", dict.achievements);
    renderList(".advanced-skill-list", dict.advancedSkills);
    renderList(".service-list", dict.services);

    const educationHeading = document.querySelector("#education h3");
    if (educationHeading) {
      educationHeading.textContent = dict.education.heading;
    }

    const educationList = document.querySelector("#education ul");
    if (educationList) {
      educationList.innerHTML = dict.education.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    }

    renderStats(state.currentLang);
    renderProjects(state.currentLang);
  };

  const getPortfolio = (lang = state.currentLang) =>
    data.portfolio?.[lang] || data.portfolio?.en;

  const getProject = (id) => data.projects.find((project) => project.id === id);

  const projectDetailsHref = (id) => {
    const from = typeof window !== "undefined" && window.CV_VERSION === "se" ? "&from=se" : "";
    return `project.html?id=${encodeURIComponent(id)}${from}`;
  };

  const renderExternalProjectLinks = (project, labels, compact = false) => {
    if (!project) {
      return "";
    }

    const links = project.links || {};
    const entries = [
      [links.playStore, "fab fa-google-play", labels.playStore],
      [links.appStore, "fab fa-apple", labels.appStore],
      [links.github, "fab fa-github", labels.github],
      [links.directDownload, "fas fa-download", labels.directDownload],
    ];

    return entries
      .filter(([href]) => Boolean(href))
      .map(([href, icon, label]) => `
        <a class="${compact ? "text-link" : "text-link"}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
          <i class="${icon}" aria-hidden="true"></i> ${escapeHtml(label)}
        </a>
      `)
      .join("");
  };

  const renderPortfolio = (lang) => {
    if (page !== "home") {
      return;
    }

    const copy = getPortfolio(lang);
    if (!copy) {
      return;
    }

    const isSoftware = typeof window !== "undefined" && window.CV_VERSION === "se";
    const section = copy.sections;
    const resumePath = data.downloads.files[lang]?.pdf || data.downloads.files.en.pdf;

    setText("navWork", copy.nav.work);
    setText("navExpertise", copy.nav.expertise);
    setText("navExperience", copy.nav.experience);
    setText("navAbout", copy.nav.about);
    setText("navContact", copy.nav.contact);
    setText("switcherLabel", copy.switcher.label);
    setText("switchFlutter", copy.switcher.flutter);
    setText("switchSoftware", copy.switcher.software);
    setText("heroEyebrow", copy.hero.eyebrow);
    setText("heroTitle", isSoftware ? copy.hero.titleSoftware : copy.hero.titleFlutter);
    setText("heroLead", copy.hero.lead);
    setHtml("heroAvailability", `<span aria-hidden="true"></span> ${escapeHtml(copy.hero.availability)}`);
    setHtml("heroPrimary", `${escapeHtml(copy.hero.primary)} <i class="fas fa-arrow-down" aria-hidden="true"></i>`);
    setText("heroStackLabel", copy.hero.stackLabel);
    setText("heroVisualLabel", copy.hero.visualLabel);

    const navToggle = $("navToggle");
    if (navToggle) navToggle.setAttribute("aria-label", copy.nav.menu);
    if (themeToggle) themeToggle.setAttribute("aria-label", lang === "ar" ? "تبديل الوضع اللوني" : "Toggle color mode");
    if (langSelect) langSelect.setAttribute("aria-label", lang === "ar" ? "اللغة" : "Language");

    setText("themePresetLabel", lang === "ar" ? "اللون المميز" : "Accent");
    const themeNames = lang === "ar"
      ? ["بنفسجي", "أزرق", "فيروزي", "رمادي", "ملكي", "فضي", "منتصف الليل"]
      : ["Violet", "Blue", "Teal", "Slate", "Royal", "Silver", "Midnight"];
    presetSelect?.querySelectorAll("option").forEach((option, index) => {
      option.textContent = themeNames[index] || option.textContent;
    });

    const scrollButton = $("scrollToTop");
    if (scrollButton) scrollButton.setAttribute("aria-label", lang === "ar" ? "العودة إلى الأعلى" : "Back to top");

    const brandSubtitle = document.querySelector(".brand-copy small");
    if (brandSubtitle) {
      brandSubtitle.textContent = isSoftware
        ? (lang === "ar" ? "مهندس برمجيات · مطوّر Flutter" : "Software Engineer · Flutter Developer")
        : (lang === "ar" ? "مهندس تطبيقات للهواتف" : "Mobile Application Engineer");
    }

    const resumeLinks = [$("navResumeLink"), $("heroResumeLink")].filter(Boolean);
    resumeLinks.forEach((link) => {
      link.href = resumePath;
      const iconClass = link.id === "navResumeLink" ? "fa-arrow-up-right-from-square" : "fa-download";
      link.innerHTML = `${escapeHtml(link.id === "navResumeLink" ? copy.nav.resume : copy.hero.secondary)} <i class="fas ${iconClass}" aria-hidden="true"></i>`;
    });

    const heroNotes = document.querySelectorAll(".visual-note");
    if (heroNotes[0]) heroNotes[0].innerHTML = `<span>5K+</span> ${lang === "ar" ? "تنزيل لتطبيق LKLK" : "LKLK downloads"}`;
    if (heroNotes[1]) heroNotes[1].innerHTML = `<span>500</span> ${lang === "ar" ? "مستخدم في الغرفة" : "users / room"}`;

    const statsGrid = $("statsGrid");
    if (statsGrid) {
      statsGrid.innerHTML = copy.metrics.map((metric) => `
        <div class="metric"><strong>${escapeHtml(metric.value)}</strong><span>${escapeHtml(metric.label)}</span></div>
      `).join("");
    }

    const titleMap = [
      ["workEyebrow", section.workEyebrow], ["workTitle", section.workTitle], ["workLead", section.workLead],
      ["otherWorkTitle", section.otherTitle], ["expertiseEyebrow", section.expertiseEyebrow],
      ["expertiseTitle", section.expertiseTitle], ["expertiseLead", section.expertiseLead],
      ["processEyebrow", section.processEyebrow], ["processTitle", section.processTitle],
      ["pillarsEyebrow", section.pillarsEyebrow], ["pillarsTitle", section.pillarsTitle],
      ["experienceEyebrow", section.experienceEyebrow], ["experienceTitle", section.experienceTitle],
      ["stackEyebrow", section.stackEyebrow], ["stackTitle", section.stackTitle],
      ["aboutEyebrow", section.aboutEyebrow], ["aboutTitle", section.aboutTitle],
      ["servicesEyebrow", section.servicesEyebrow], ["servicesTitle", section.servicesTitle],
      ["contactEyebrow", section.contactEyebrow], ["contactTitle", section.contactTitle],
    ];
    titleMap.forEach(([id, value]) => setText(id, value));
    setText("processIntro", lang === "ar"
      ? "أبدأ بفهم المشكلة، ثم أصمم حلاً واضحاً يمكن تطويره وصيانته بثقة."
      : "Architecture is useful when it turns change, failure, and scale into manageable decisions.");

    const featuredHost = $("featuredProjects");
    if (featuredHost) {
      featuredHost.innerHTML = copy.featured.map((item) => {
        const project = getProject(item.id);
        const projectName = project?.name || item.id;
        const logo = project?.logo || project?.image;
        const logoAlt = logo?.alt?.[lang] || logo?.alt?.en || `${projectName} logo`;
        const detailsHref = projectDetailsHref(item.id);
        const detailsLabel = lang === "ar" ? `عرض تفاصيل مشروع ${projectName}` : `View ${projectName} project details`;
        return `
          <article class="case-study" aria-labelledby="case-${escapeHtml(item.id)}">
            <div class="case-copy">
              <div><span class="case-index">${escapeHtml(item.index)}</span><span class="case-category">${escapeHtml(item.category)}</span></div>
              <h3 id="case-${escapeHtml(item.id)}" class="project-title-lockup">
                <a class="project-title-link" href="${escapeHtml(detailsHref)}" data-project-transition="${escapeHtml(item.id)}" aria-label="${escapeHtml(detailsLabel)}">
                  ${logo ? `<img class="project-logo project-logo--animated" src="${escapeHtml(logo.src)}" alt="${escapeHtml(logoAlt)}" width="52" height="52" loading="lazy" decoding="async">` : ""}
                  <span>${escapeHtml(projectName)}</span>
                </a>
              </h3>
              <div class="case-meta"><span>${escapeHtml(item.role)}</span><span>${escapeHtml(item.platform)}</span></div>
              <p class="case-summary">${escapeHtml(item.summary)}</p>
              <p class="case-outcome">${escapeHtml(item.outcome)}</p>
              <ul class="case-metrics">${item.metrics.map((metric) => `<li>${escapeHtml(metric)}</li>`).join("")}</ul>
              <ul class="case-tech">${item.tech.map((tech) => `<li class="tech-badge">${escapeHtml(tech)}</li>`).join("")}</ul>
              <div class="case-actions">
                <a class="button button--quiet" href="${escapeHtml(detailsHref)}" data-project-transition="${escapeHtml(item.id)}">${escapeHtml(copy.actions.caseStudy)} <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></a>
                ${renderExternalProjectLinks(project, copy.actions)}
              </div>
            </div>
            <a class="case-visual project-visual-link" href="${escapeHtml(detailsHref)}" data-project-transition="${escapeHtml(item.id)}" aria-label="${escapeHtml(detailsLabel)}">
              ${item.screens.map((screen) => `<figure class="case-screen"><img src="${escapeHtml(screen.src)}" alt="${escapeHtml(screen.alt)}" loading="lazy" decoding="async"></figure>`).join("")}
            </a>
          </article>
        `;
      }).join("");
    }

    const otherHost = $("otherProjects");
    if (otherHost) {
      otherHost.innerHTML = copy.other.map((item) => {
        const project = getProject(item.id);
        const logo = project?.logo || project?.image;
        const logoAlt = logo?.alt?.[lang] || logo?.alt?.en || `${project?.name || item.id} logo`;
        const projectName = project?.name || item.id;
        const detailsHref = projectDetailsHref(item.id);
        const detailsLabel = lang === "ar" ? `عرض تفاصيل مشروع ${projectName}` : `View ${projectName} project details`;
        return `
          <article class="other-project">
            <div>
              <p class="project-category">${escapeHtml(item.category)}</p>
              <h4 class="project-title-lockup">
                <a class="project-title-link" href="${escapeHtml(detailsHref)}" data-project-transition="${escapeHtml(item.id)}" aria-label="${escapeHtml(detailsLabel)}">
                  ${logo ? `<img class="project-logo project-logo--animated" src="${escapeHtml(logo.src)}" alt="${escapeHtml(logoAlt)}" width="52" height="52" loading="lazy" decoding="async">` : ""}
                  <span>${escapeHtml(projectName)}</span>
                </a>
              </h4>
              <p>${escapeHtml(item.summary)}</p>
              <p class="project-proof">${escapeHtml(item.proof)}</p>
            </div>
            <div>
              <ul class="case-tech">${item.tech.map((tech) => `<li class="tech-badge">${escapeHtml(tech)}</li>`).join("")}</ul>
              <div class="case-actions"><a class="text-link" href="${escapeHtml(detailsHref)}" data-project-transition="${escapeHtml(item.id)}">${escapeHtml(copy.actions.caseStudy)} <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></a>${renderExternalProjectLinks(project, copy.actions, true)}</div>
            </div>
          </article>
        `;
      }).join("");
    }

    const expertiseHost = $("expertiseGrid");
    if (expertiseHost) {
      expertiseHost.innerHTML = copy.expertise.map((item) => `
        <article class="expertise-item"><span class="number">${escapeHtml(item.number)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>
      `).join("");
    }

    const processHost = $("processFlow");
    if (processHost) {
      processHost.innerHTML = copy.process.map((item) => `<li class="process-item"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></li>`).join("");
    }

    const pillarIcons = ["fa-gauge-high", "fa-shield-halved", "fa-rotate"];
    const pillarsHost = $("pillarsGrid");
    if (pillarsHost) {
      pillarsHost.innerHTML = copy.pillars.map((item, index) => `
        <article class="pillar"><span class="pillar-icon"><i class="fas ${pillarIcons[index]}" aria-hidden="true"></i></span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>
      `).join("");
    }

    const timelineHost = $("experienceTimeline");
    if (timelineHost) {
      timelineHost.innerHTML = copy.experience.map((entry) => `
        <article class="timeline-entry">
          <p class="timeline-period">${escapeHtml(entry.period)}<span class="timeline-place">${escapeHtml(entry.place)}</span></p>
          <div class="timeline-content"><h3>${escapeHtml(entry.role)}</h3><ul>${entry.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
        </article>
      `).join("");
    }

    const stackHost = $("stackList");
    if (stackHost) {
      stackHost.innerHTML = copy.stack.map((item) => `<div class="stack-row"><dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.value)}</dd></div>`).join("");
    }

    setText("aboutText", copy.about.text);
    setText("aboutPrinciple", copy.about.principle);
    const educationHost = $("educationBlock");
    if (educationHost) {
      educationHost.innerHTML = `
        <h3>${escapeHtml(copy.about.educationTitle)}</h3>
        <p class="education-primary">${escapeHtml(copy.about.education)}</p>
        <p>${escapeHtml(copy.about.university)}</p>
        <p>${escapeHtml(copy.about.coursework)}</p>
        <p>${escapeHtml(copy.about.languages)}</p>
      `;
    }

    const servicesHost = $("servicesGrid");
    if (servicesHost) {
      servicesHost.innerHTML = copy.services.map((item) => `<article class="service"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join("");
    }

    setText("contactLead", copy.contact.lead);
    setHtml("contactEmail", `${escapeHtml(copy.contact.email)} <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>`);
    setText("contactWhatsapp", copy.contact.whatsapp);
    setText("contactLinkedin", copy.contact.linkedin);
    setText("contactGithub", copy.contact.github);
    setText("footerNote", copy.footer);

    const skipLink = document.querySelector(".skip-link");
    if (skipLink) skipLink.textContent = lang === "ar" ? "انتقل إلى المحتوى الرئيسي" : "Skip to main content";

    document.title = `${profile.name} — ${isSoftware ? copy.hero.titleSoftware : copy.hero.titleFlutter}`;
  };

  const renderFooter = (dict) => {
    setText("footerQuickLinksTitle", dict.footer.quickLinksTitle);
    setText("footerConnectTitle", dict.footer.connectTitle);
    setText("footerInfoTitle", dict.footer.infoTitle);
    setText("footerSummaryLink", dict.footer.quickLinks.summary);
    setText("footerExperienceLink", dict.footer.quickLinks.experience);
    setText("footerProjectsLink", dict.footer.quickLinks.projects);
    setText("footerSkillsLink", dict.footer.quickLinks.skills);
    setText("footerDownloadLink", dict.footer.quickLinks.download);
  };

  const renderDownloadsPage = (dict) => {
    const lang = state.currentLang;
    const isSoftware = typeof window !== "undefined" && window.CV_VERSION === "se";
    setText("downloadsBackText", dict.downloadsPage.backToCv);
    setText("downloadsPageTitle", dict.downloadsPage.title);
    setHeadingText("downloadsSectionTitle", dict.downloadsPage.downloadsTitle);
    setHeadingText("plainTextSectionTitle", dict.downloadsPage.plainTextTitle);
    setHtml("downloadsIntro", dict.downloadsPage.downloadsIntro);
    setText("downloadEnglishLabel", dict.downloadsPage.englishLabel);
    setText("downloadArabicLabel", dict.downloadsPage.arabicLabel);
    setText("exportWordText", dict.downloadsPage.exportWord);
    setText("exportATSText", dict.downloadsPage.exportATS);
    setText("downloadsEyebrow", lang === "ar" ? "مكتبة السيرة الذاتية" : "Resume library");
    setText("downloadsSectionEyebrow", lang === "ar" ? "اختر اللغة والصيغة" : "Choose your format");
    setText("downloadEnglishDescription", lang === "ar" ? "نسخة مهنية مكتوبة باللغة الإنجليزية." : "English-language professional resume.");
    setText("downloadArabicDescription", lang === "ar" ? "نسخة عربية واضحة ومتوافقة مع اتجاه RTL." : "Clear Arabic resume with full RTL support.");
    setText("downloadToolsEyebrow", lang === "ar" ? "هل تحتاج ملفاً قابلاً للتعديل؟" : "Need a tailored file?");
    setText("downloadToolsTitle", lang === "ar" ? "أنشئ نسخة Word قابلة للتعديل" : "Generate an editable version");
    setText("downloadToolsIntro", lang === "ar" ? "أنشئ ملف Word باستخدام اللغة المعروضة حالياً في الموقع." : "Create a Word document using the currently selected site language.");
    setText("downloadsAvailability", lang === "ar" ? "متاح للعمل عن بُعد" : "Available for remote work");
    setText("downloadsBrandRole", lang === "ar"
      ? (isSoftware ? "مهندس برمجيات · مطوّر Flutter" : "مهندس تطبيقات للهواتف")
      : (isSoftware ? "Software engineer · Flutter developer" : "Mobile application engineer"));

    const plainTextIntro = $("plainTextIntro");
    if (plainTextIntro) {
      plainTextIntro.innerHTML = `${escapeHtml(dict.downloadsPage.plainTextIntro)} <a id="plainTextLink" href="${escapeHtml(
        data.downloads.plainTextPath
      )}" target="_blank" rel="noopener">CV_Text_EN_AR.md</a>`;
    }

    const links = [
      ["downloadEnglishDocx", data.downloads.files.en.docx],
      ["downloadEnglishPdf", data.downloads.files.en.pdf],
      ["downloadArabicDocx", data.downloads.files.ar.docx],
      ["downloadArabicPdf", data.downloads.files.ar.pdf],
    ];

    links.forEach(([id, href]) => {
      const anchor = $(id);
      if (anchor) {
        anchor.href = href;
      }
    });
  };

  // ── Project detail page (project.html) ───────────────────────────────
  let lightbox = null;
  let lightboxLastFocus = null;

  const closeLightbox = () => {
    if (!lightbox) {
      return;
    }

    lightbox.classList.remove("show");
    lightbox.setAttribute("hidden", "");
    body.style.removeProperty("overflow");

    if (lightboxLastFocus && typeof lightboxLastFocus.focus === "function") {
      lightboxLastFocus.focus();
    }
  };

  const ensureLightbox = () => {
    if (lightbox) {
      return lightbox;
    }

    lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.id = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", state.currentLang === "ar" ? "عارض الصورة" : "Image viewer");
    lightbox.setAttribute("hidden", "");
    lightbox.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="${state.currentLang === "ar" ? "إغلاق" : "Close"}">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
      <img class="lightbox-img" alt="">
    `;
    document.body.appendChild(lightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target.closest(".lightbox-close")) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox && !lightbox.hasAttribute("hidden")) {
        closeLightbox();
      }
      if (event.key === "Tab" && lightbox && !lightbox.hasAttribute("hidden")) {
        event.preventDefault();
        lightbox.querySelector(".lightbox-close")?.focus();
      }
    });

    return lightbox;
  };

  const openLightbox = (src, alt) => {
    const box = ensureLightbox();
    const image = box.querySelector(".lightbox-img");
    image.src = src;
    image.alt = alt || "";
    lightboxLastFocus = document.activeElement;
    box.removeAttribute("hidden");
    window.requestAnimationFrame(() => box.classList.add("show"));
    body.style.overflow = "hidden";
    box.querySelector(".lightbox-close").focus();
  };

  const renderProjectDetail = () => {
    if (page !== "project") {
      return;
    }

    const dict = getDict();
    const lang = state.currentLang;
    const detail = $("projectDetail");
    const notFound = $("projectNotFound");
    const id = getQueryParam("id");
    const from = getQueryParam("from") === "se" ? "se.html" : "index.html";
    const backHref = `${from}#work`;

    setText("detailBackText", dict.detailPage.back);
    const backLink = $("detailBackLink");
    if (backLink) backLink.href = backHref;
    const nfBackLink = $("notFoundBackLink");
    if (nfBackLink) nfBackLink.href = backHref;
    setText("footerConnectTitle", dict.footer.connectTitle);

    const project = data.projects.find((item) => (item.slug || item.id) === id);

    if (!project) {
      if (detail) detail.hidden = true;
      if (notFound) notFound.hidden = false;
      setText("notFoundTitle", dict.detailPage.notFound);
      setText("notFoundBody", dict.detailPage.notFoundBody);
      setText("notFoundBack", dict.detailPage.back);
      document.title = `${dict.detailPage.notFound} — ${profile.name}`;
      return;
    }

    if (notFound) notFound.hidden = true;
    if (detail) detail.hidden = false;
    if (detail && !detail.dataset.heroAnimated) {
      detail.dataset.heroAnimated = "true";
      window.requestAnimationFrame(() => detail.classList.add("detail-entered"));
    }

    const media = project.media || {};
    const screenshots = Array.isArray(media.screenshots) ? media.screenshots : [];

    const alt = project.image.alt[lang] || project.image.alt.en;
    document.title = `${project.name} — ${profile.name}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", stripHtml(project.description[lang] || project.description.en));
    }

    const icon = $("detailIcon");
    if (icon) {
      const logo = project.logo || project.image;
      icon.src = logo.src;
      icon.alt = logo.alt?.[lang] || logo.alt?.en || alt;
    }

    setText("detailName", project.name);
    setText("detailEyebrow", lang === "ar" ? "دراسة مشروع" : "Project case study");
    setText("detailHeroLabel", lang === "ar" ? "تطبيق هاتف جاهز للنشر" : "Production mobile application");
    setText("detailBrandRole", lang === "ar" ? "مهندس تطبيقات للهواتف" : "Mobile application engineer");
    setText("detailIndexLabel", lang === "ar" ? "محتويات الصفحة" : "On this page");
    setText("detailOverviewNav", dict.detailPage.overview);
    setText("detailScreensNavText", dict.detailPage.screenshots);
    setText("detailVideoNavText", dict.detailPage.video);
    setText("detailLinkedinNavText", dict.detailPage.linkedin);
    setText("overviewEyebrow", lang === "ar" ? "عن التطبيق" : "The product");
    setText("screensEyebrow", lang === "ar" ? "واجهات التطبيق" : "Interface gallery");
    setText("videoEyebrow", lang === "ar" ? "جولة داخل التطبيق" : "Product walkthrough");
    setText("linkedinEyebrow", lang === "ar" ? "نص جاهز للمشاركة" : "Ready to share");

    const curatedHeroScreens = {
      lklk: ["assets/images/portfolio/lklk-live-room.jpg", "assets/images/portfolio/lklk-levels.jpg"],
      wolfera: ["assets/images/portfolio/wolfera-marketplace.jpg", "assets/images/portfolio/wolfera-listing.jpg"],
      office: ["assets/images/portfolio/office-dashboard.jpg", "assets/images/portfolio/office-search.jpg"],
    };
    const heroSources = curatedHeroScreens[project.id]
      || screenshots.slice(0, 2).map((shot) => shot.src)
      || [];
    const resolvedHeroSources = heroSources.length ? heroSources : [project.image.src];
    const heroVisual = $("detailHeroVisual");
    if (heroVisual) {
      heroVisual.classList.toggle("is-single", resolvedHeroSources.length === 1);
      heroVisual.setAttribute("aria-label", lang === "ar" ? `واجهات مختارة من ${project.name}` : `Selected ${project.name} screens`);
      heroVisual.innerHTML = resolvedHeroSources.slice(0, 2).map((src, index) =>
        `<img class="detail-hero-screen" src="${escapeHtml(src)}" alt="${escapeHtml(`${project.name} ${lang === "ar" ? "واجهة تطبيق" : "application screen"} ${index + 1}`)}" decoding="async"${index ? ' loading="lazy"' : ''}>`
      ).join("");
    }

    const techHost = $("detailTech");
    if (techHost) {
      techHost.innerHTML = project.tech
        .map((item) => `<li class="tech-badge">${escapeHtml(item)}</li>`)
        .join("");
    }

    // Section titles
    setText("overviewTitle", dict.detailPage.overview);
    setText("screensTitle", dict.detailPage.screenshots);
    setText("videoTitle", dict.detailPage.video);
    setText("linkedinTitle", dict.detailPage.linkedin);

    // Bio (owner-authored; treated as plain text for safety)
    const bioHost = $("detailBio");
    if (bioHost) {
      const bioText = (project.bio && (project.bio[lang] || project.bio.en)) || "";
      if (bioText.trim()) {
        bioHost.innerHTML = `<p>${escapeHtml(bioText)}</p>`;
        bioHost.hidden = false;
      } else {
        bioHost.innerHTML = "";
        bioHost.hidden = true;
      }
    }

    // Description (raw HTML — same accepted pattern as renderProjects)
    setHtml("detailDescription", project.description[lang] || project.description.en);

    // Action buttons
    const actionsHost = $("detailActions");
    if (actionsHost) {
      const links = project.links || {};
      const buttons = [];

      if (links.directDownload) {
        const isLocal = !/^https?:\/\//.test(links.directDownload);
        buttons.push(
          `<a class="btn btn-primary" href="${escapeHtml(links.directDownload)}"${
            isLocal ? " download" : ' target="_blank" rel="noopener noreferrer"'
          }><i class="fas fa-download" aria-hidden="true"></i> ${escapeHtml(
            dict.detailPage.directDownload
          )}</a>`
        );
      }

      const external = [
        [links.playStore, "fab fa-google-play", dict.detailPage.playStore],
        [links.appStore, "fab fa-apple", dict.detailPage.appStore],
        [links.github, "fab fa-github", dict.detailPage.github],
        [links.website, "fas fa-globe", dict.detailPage.website],
      ];

      external.forEach(([href, iconClass, label]) => {
        if (href) {
          buttons.push(
            `<a class="btn btn-secondary" href="${escapeHtml(
              href
            )}" target="_blank" rel="noopener noreferrer"><i class="${iconClass}" aria-hidden="true"></i> ${escapeHtml(
              label
            )}</a>`
          );
        }
      });

      actionsHost.innerHTML = buttons.join("");
    }

    // Screenshots gallery
    const screensSection = $("detailScreens");
    const gallery = $("detailGallery");
    const screensNav = $("detailScreensNav");

    if (gallery && screenshots.length) {
      const preferred = {
        lklk: [72, 29],
        wolfera: [23, 44],
        office: [0, 29],
      };
      const previewSources = {
        lklk: { 72: "assets/images/portfolio/lklk-live-room.jpg", 29: "assets/images/portfolio/lklk-levels.jpg" },
        wolfera: { 23: "assets/images/portfolio/wolfera-marketplace.jpg", 44: "assets/images/portfolio/wolfera-listing.jpg" },
        office: { 0: "assets/images/portfolio/office-dashboard.jpg", 29: "assets/images/portfolio/office-search.jpg" },
      };
      const primaryIndices = (preferred[project.id] || screenshots.map((_, index) => index).slice(0, 10))
        .filter((index, position, values) => index < screenshots.length && values.indexOf(index) === position);
      const primarySet = new Set(primaryIndices);
      const remainingIndices = screenshots.map((_, index) => index).filter((index) => !primarySet.has(index));

      const renderShot = (index) => {
        const shot = screenshots[index];
        const shotSrc = previewSources[project.id]?.[index] || shot.src;
        const authoredAlt = shot.alt && (shot.alt[lang] || shot.alt.en);
        const shotAlt = authoredAlt || `${project.name} ${lang === "ar" ? "لقطة شاشة" : "screenshot"} ${index + 1}`;
        return `
          <button type="button" class="gallery-item" data-src="${escapeHtml(shotSrc)}" data-alt="${escapeHtml(shotAlt)}">
            <img src="${escapeHtml(shotSrc)}" alt="${escapeHtml(shotAlt)}" loading="lazy" decoding="async">
          </button>
        `;
      };

      gallery.innerHTML = `
        <div class="gallery-grid">${primaryIndices.map(renderShot).join("")}</div>
        ${remainingIndices.length ? `
          <details class="gallery-more">
            <summary>${escapeHtml(lang === "ar" ? `عرض المعرض الكامل (${remainingIndices.length} لقطة إضافية)` : `View full gallery (${remainingIndices.length} more)` )}</summary>
            <div class="gallery-grid">${remainingIndices.map(renderShot).join("")}</div>
          </details>
        ` : ""}
      `;

      gallery.querySelectorAll(".gallery-item").forEach((item) => {
        item.addEventListener("click", () => {
          openLightbox(item.getAttribute("data-src"), item.getAttribute("data-alt"));
        });
      });

      if (screensSection) screensSection.hidden = false;
      if (screensNav) screensNav.hidden = false;
    } else if (screensSection) {
      screensSection.hidden = true;
      if (screensNav) screensNav.hidden = true;
    }

    // LinkedIn post
    const linkedinSection = $("detailLinkedinSection");
    const linkedinNav = $("detailLinkedinNav");
    if (linkedinSection) {
      const linkedinText = (project.linkedin && (project.linkedin[lang] || project.linkedin.en)) || "";
      if (linkedinText.trim()) {
        setText("detailLinkedinText", linkedinText);
        setText("linkedinCopyLabel", dict.detailPage.linkedinCopy);
        linkedinSection.hidden = false;
        if (linkedinNav) linkedinNav.hidden = false;
        const copyBtn = $("linkedinCopyBtn");
        if (copyBtn) {
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(linkedinText).then(() => {
              const lbl = $("linkedinCopyLabel");
              if (lbl) {
                lbl.textContent = "✓";
                setTimeout(() => setText("linkedinCopyLabel", dict.detailPage.linkedinCopy), 2000);
              }
            });
          };
        }
      } else {
        linkedinSection.hidden = true;
        if (linkedinNav) linkedinNav.hidden = true;
      }
    }

    // Video
    const videoSection = $("detailVideoSection");
    const videoHost = $("detailVideo");
    const videoNav = $("detailVideoNav");
    if (videoHost && media.video) {
      const ytId = media.video;
      videoHost.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${escapeHtml(ytId)}"
          title="Demo video"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
        ></iframe>
      `;
      if (videoSection) videoSection.hidden = false;
      if (videoNav) videoNav.hidden = false;
    } else if (videoSection) {
      videoSection.hidden = true;
      if (videoNav) videoNav.hidden = true;
    }
  };

  const applyLanguage = (lang) => {
    state.currentLang = data.translations[lang] ? lang : "en";

    const dict = getDict();
    themeRoot.lang = state.currentLang;
    themeRoot.dir = state.currentLang === "ar" ? "rtl" : "ltr";
    // R-14 lock: switch font via class, not an inline body style, so the
    // language system never globally overrides the CSS font/typography system.
    body.classList.toggle("lang-ar", state.currentLang === "ar");

    const languageControl = $("langSelect");
    if (languageControl) languageControl.setAttribute("aria-label", state.currentLang === "ar" ? "اللغة" : "Language");
    const themePresetControl = $("themePreset");
    if (themePresetControl) {
      themePresetControl.setAttribute("aria-label", state.currentLang === "ar" ? "اللون المميز" : "Theme preset");
      const names = state.currentLang === "ar"
        ? ["أزرق", "بنفسجي", "فيروزي", "رمادي", "ملكي", "فضي", "منتصف الليل"]
        : ["Blue", "Purple", "Teal", "Slate", "Royal", "Silver", "Midnight"];
      themePresetControl.querySelectorAll("option").forEach((option, index) => {
        option.textContent = names[index] || option.textContent;
      });
    }
    const detailIndex = document.querySelector(".detail-index");
    if (detailIndex) detailIndex.setAttribute("aria-label", state.currentLang === "ar" ? "محتويات الصفحة" : "On this page");

    renderNav(dict);
    renderHeader(dict);
    renderSectionTitles(dict);
    renderContentSections(dict);
    renderFooter(dict);
    renderDownloadsPage(dict);
    renderPortfolio(state.currentLang);
    renderProjectDetail();
  };

  const formatStatValue = (value) => {
    if (value >= 1000) {
      const compact = value / 1000;
      return `${Number.isInteger(compact) ? compact.toString() : compact.toFixed(1)}K`;
    }

    return String(value);
  };

  const animateCounter = (element, target, duration = 2000) => {
    const increment = target / (duration / 16);
    let current = 0;

    const timer = window.setInterval(() => {
      current += increment;

      if (current >= target) {
        element.textContent = formatStatValue(target);
        window.clearInterval(timer);
        return;
      }

      element.textContent = current >= 1000 ? formatStatValue(current) : Math.floor(current).toString();
    }, 16);
  };

  const initTheme = () => {
    const savedTheme = storage.get("theme");
    const savedPreset = normalizePreset(storage.get("themePreset"));

    applyThemeState(savedTheme !== "light");
    applyPreset(savedPreset);

    if (presetSelect) {
      presetSelect.value = savedPreset;
      presetSelect.addEventListener("change", (event) => {
        const nextPreset = normalizePreset(event.target.value);
        enableThemeTransition();
        applyPreset(nextPreset);
        storage.set("themePreset", nextPreset);

        if (nextPreset === "midnight") {
          applyThemeState(true);
          storage.set("theme", "dark");
        }
      });
    }

    if (savedPreset === "midnight" && !themeRoot.classList.contains("dark-mode")) {
      applyThemeState(true);
      storage.set("theme", "dark");
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const nextDarkMode = !themeRoot.classList.contains("dark-mode");
        applyThemeState(nextDarkMode);
        storage.set("theme", nextDarkMode ? "dark" : "light");
        updateContrast();
      });
    }
  };

  const initLanguage = () => {
    const savedLang = storage.get("lang") || "en";
    applyLanguage(savedLang);

    if (langSelect) {
      langSelect.value = state.currentLang;
      langSelect.addEventListener("change", (event) => {
        enableThemeTransition();
        applyLanguage(event.target.value);
        storage.set("lang", state.currentLang);
      });
    }
  };

  const initRevealAnimations = () => {
    const targets = document.querySelectorAll(".reveal");

    if (targets.length === 0) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("fade-in"));
      return;
    }

    themeRoot.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => entry.target.classList.add("fade-in"), 100);
            observer.unobserve(entry.target);
          }
        });
      },
      // threshold:0 + rootMargin so very tall sections (e.g. the screenshots
      // gallery, ~15000px on mobile) still reveal — a 0.1 threshold can never be
      // met when the section is far taller than the viewport, which left the
      // section stuck at opacity:0 and the thumbnails invisible on phones.
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );

    targets.forEach((target) => observer.observe(target));
  };

  const initNavSpy = () => {
    const navLinks = Array.from(document.querySelectorAll(".top-nav a[href^='#']"));

    if (navLinks.length === 0) {
      return;
    }

    const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

    const setActive = (id) => {
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", active);

        if (active) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0, rootMargin: "-30% 0px -62% 0px" }
    );

    sections.forEach((section) => observer.observe(section));

    if (sections[0]) {
      setActive(sections[0].id);
    }
  };

  const initScrollToTop = () => {
    const button = $("scrollToTop");

    if (!button) {
      return;
    }

    window.addEventListener("scroll", () => {
      button.classList.toggle("show", window.pageYOffset > 300);
    });

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const initStatsAnimation = () => {
    const section = document.querySelector(".stats-section");

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || state.statsAnimated) {
            return;
          }

          const statNumbers = document.querySelectorAll(".stat-number");
          statNumbers.forEach((stat) => {
            animateCounter(stat, parseInt(stat.getAttribute("data-target"), 10));
          });
          state.statsAnimated = true;
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
  };

  const downloadBlob = (html, filename) => {
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const buildProjectExportMarkup = (lang) =>
    data.projects
      .map((project) => {
        const description = stripHtml(project.description[lang] || project.description.en);
        return `<h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(description)}</p>`;
      })
      .join("");

  const buildExperienceExportMarkup = (dict) => {
    if (Array.isArray(dict.experienceEntries) && dict.experienceEntries.length) {
      return dict.experienceEntries.map((entry) => `
        <h3>${escapeHtml(entry.role)} | ${escapeHtml(entry.period)} | ${escapeHtml(entry.location)}</h3>
        <ul>${entry.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      `).join("");
    }

    return `<h3>${escapeHtml(dict.experienceRole)}</h3><ul>${dict.experienceList.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  };

  const buildWordHtml = (lang) => {
    const dict = getDict(lang);
    const currentLang = lang === "ar" ? "ar" : "en";

    return `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>CV - ${escapeHtml(profile.name)}</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.6; margin: 0.75in; ${
      currentLang === "ar" ? "direction: rtl;" : ""
    } }
    h1 { font-size: 18pt; font-weight: bold; color: #0066cc; margin-bottom: 8pt; text-align: center; }
    h2 { font-size: 14pt; font-weight: bold; color: #0066cc; margin-top: 14pt; margin-bottom: 8pt; border-bottom: 2pt solid #0066cc; }
    h3 { font-size: 12pt; font-weight: bold; margin-top: 10pt; margin-bottom: 6pt; }
    ul { margin: 6pt 0; padding-left: ${currentLang === "ar" ? "0" : "20pt"}; ${
      currentLang === "ar" ? "padding-right: 20pt;" : ""
    } }
    li { margin-bottom: 6pt; }
    .contact { text-align: center; margin-bottom: 12pt; font-size: 10pt; color: #333; }
    .job-title { text-align: center; font-weight: bold; margin-bottom: 16pt; font-size: 12pt; }
  </style>
</head>
<body>
  <h1>${escapeHtml(profile.name)}</h1>
  <div class="contact">${escapeHtml(profile.email)} | ${escapeHtml(profile.phone)} | ${escapeHtml(compactUrl(profile.linkedinUrl))} | ${escapeHtml(
      compactUrl(profile.githubUrl)
    )}</div>
  <div class="job-title">${escapeHtml(dict.header.jobTitle)} | ${escapeHtml(dict.header.availability)}</div>

  <h2>${escapeHtml(dict.titles.summary)}</h2>
  <p>${escapeHtml(dict.summaryText)}</p>

  <h2>${escapeHtml(dict.titles.skills)}</h2>
  <ul>${dict.skillsList.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

  <h2>${escapeHtml(dict.titles.experience)}</h2>
  ${buildExperienceExportMarkup(dict)}

  <h2>${escapeHtml(dict.titles.projects)}</h2>
  ${buildProjectExportMarkup(currentLang)}

  <h2>${escapeHtml(dict.titles.achievements)}</h2>
  <ul>${dict.achievements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

  <h2>${escapeHtml(dict.titles.education)}</h2>
  <h3>${escapeHtml(dict.education.heading)}</h3>
  <ul>${dict.education.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

  <h2>${escapeHtml(dict.titles.languages)}</h2>
  <p>${escapeHtml(dict.languagesText)}</p>
</body>
</html>`;
  };

  const buildAtsHtml = (lang) => {
    const dict = getDict(lang);
    const currentLang = lang === "ar" ? "ar" : "en";

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CV - ${escapeHtml(profile.name)}</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 0.75in; ${
      currentLang === "ar" ? "direction: rtl;" : ""
    } }
    h1 { font-size: 16pt; font-weight: bold; margin-bottom: 6pt; text-align: center; text-transform: uppercase; }
    h2 { font-size: 13pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; text-transform: uppercase; border-bottom: 1pt solid #000; }
    h3 { font-size: 11pt; font-weight: bold; margin-top: 8pt; margin-bottom: 4pt; }
    ul { margin: 5pt 0; padding-left: ${currentLang === "ar" ? "0" : "18pt"}; ${
      currentLang === "ar" ? "padding-right: 18pt;" : ""
    } }
    li { margin-bottom: 4pt; }
    .contact { text-align: center; margin-bottom: 8pt; font-size: 10pt; }
    .job-title { text-align: center; font-weight: bold; margin-bottom: 12pt; font-size: 11pt; text-transform: uppercase; }
  </style>
</head>
<body>
  <h1>${escapeHtml(profile.name.toUpperCase())}</h1>
  <div class="contact">${escapeHtml(profile.email)} | ${escapeHtml(profile.phone)} | ${escapeHtml(compactUrl(profile.linkedinUrl))} | ${escapeHtml(
      compactUrl(profile.githubUrl)
    )}</div>
  <div class="job-title">${escapeHtml(dict.header.jobTitle)}</div>

  <h2>${escapeHtml(currentLang === "ar" ? "الملخص المهني" : "PROFESSIONAL SUMMARY")}</h2>
  <p>${escapeHtml(dict.downloadsPage.atsSummary)}</p>

  <h2>${escapeHtml(currentLang === "ar" ? "المهارات التقنية" : "TECHNICAL SKILLS")}</h2>
  <ul>${dict.skillsList.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

  <h2>${escapeHtml(currentLang === "ar" ? "الخبرة العملية" : "PROFESSIONAL EXPERIENCE")}</h2>
  ${buildExperienceExportMarkup(dict)}

  <h2>${escapeHtml(currentLang === "ar" ? "المشاريع الرئيسية" : "KEY PROJECTS")}</h2>
  ${buildProjectExportMarkup(currentLang)}

  <h2>${escapeHtml(currentLang === "ar" ? "أهم الإنجازات" : "KEY ACHIEVEMENTS")}</h2>
  <ul>${dict.achievements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

  <h2>${escapeHtml(currentLang === "ar" ? "التعليم" : "EDUCATION")}</h2>
  <h3>${escapeHtml(dict.education.heading)}</h3>
  <ul>${dict.education.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

  <h2>${escapeHtml(currentLang === "ar" ? "اللغات" : "LANGUAGES")}</h2>
  <p>${escapeHtml(dict.languagesText)}</p>

  <h2>${escapeHtml(currentLang === "ar" ? "الكلمات المفتاحية" : "KEYWORDS")}</h2>
  <p>${dict.downloadsPage.keywords.map((keyword) => escapeHtml(keyword)).join(", ")}</p>
</body>
</html>`;
  };

  const initExports = () => {
    const exportWordBtn = $("exportWordBtn");
    const exportAtsBtn = $("exportATSBtn");
    const fileName = fileSafeName(profile.name);

    if (exportWordBtn) {
      exportWordBtn.addEventListener("click", () => {
        const lang = state.currentLang;
        downloadBlob(buildWordHtml(lang), `${fileName}_CV_${lang.toUpperCase()}.doc`);
      });
    }

    if (exportAtsBtn) {
      exportAtsBtn.addEventListener("click", () => {
        const lang = state.currentLang;
        downloadBlob(buildAtsHtml(lang), `${fileName}_CV_ATS_${lang.toUpperCase()}.doc`);
      });
    }
  };

  const ensureSnackbarHost = () => {
    let host = $("snackbarHost");

    if (host) {
      return host;
    }

    host = document.createElement("div");
    host.id = "snackbarHost";
    host.style.cssText =
      "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;display:flex;gap:8px;flex-direction:column;align-items:center;pointer-events:none";
    document.body.appendChild(host);

    const style = document.createElement("style");
    style.textContent = `
      .snackbar{min-width:220px;max-width:90vw;background:#111;color:#fff;padding:12px 16px;border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,.15);font:500 14px/1.4 Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;opacity:0;transform:translateY(8px);transition:.3s;pointer-events:auto}
      .snackbar.show{opacity:1;transform:translateY(0)}
      .snackbar.success{background:#10b981}
      .snackbar.warn{background:#f59e0b}
      .snackbar.error{background:#ef4444}
    `;
    document.head.appendChild(style);

    return host;
  };

  const showSnackbar = (message, type = "warn", timeout = 2500) => {
    const host = ensureSnackbarHost();
    const element = document.createElement("div");
    element.className = `snackbar ${type}`;
    element.textContent = message;
    host.appendChild(element);

    window.requestAnimationFrame(() => element.classList.add("show"));

    window.setTimeout(() => {
      element.classList.remove("show");
      window.setTimeout(() => {
        if (element.parentNode === host) {
          host.removeChild(element);
        }
      }, 300);
    }, timeout);
  };

  const initDownloadGuard = () => {
    document.querySelectorAll('a[href*="assets/downloads/"]').forEach((anchor) => {
      anchor.addEventListener(
        "click",
        async (event) => {
          const href = anchor.getAttribute("href") || "";

          if (!/(\.pdf|\.docx?|\.PDF|\.DOCX?)$/.test(href)) {
            return;
          }

          event.preventDefault();

          let available = false;

          try {
            try {
              const response = await fetch(href, { method: "HEAD", cache: "no-store" });
              available = response.ok;
            } catch (_) {}

            if (!available) {
              const response = await fetch(href, {
                method: "GET",
                headers: { Range: "bytes=0-0" },
                cache: "no-store",
              });
              available = response.ok;
            }
          } catch (_) {}

          if (available) {
            window.location.href = href;
            return;
          }

          showSnackbar(getDict().downloadsPage.fileUnavailable, "warn", 3000);
        },
        { passive: false }
      );
    });

    window.CVShowSnackbar = showSnackbar;
  };

  const initProjectRows = () => {
    const table = $("projectsTableBody");
    if (!table) return;

    const navigate = (row) => {
      const href = row.dataset.href;
      if (href) window.location.href = href;
    };

    table.addEventListener("click", (e) => {
      const row = e.target.closest("tr.project-row");
      if (!row) return;
      if (e.target.closest("a")) return;
      navigate(row);
    });

    table.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const row = e.target.closest("tr.project-row");
      if (!row) return;
      e.preventDefault();
      navigate(row);
    });
  };

  const initProjectHeroTransitions = () => {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[data-project-transition]");
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const source = link.closest(".case-study, .other-project");
      if (!source) return;

      document.querySelectorAll(".project-transition-source").forEach((element) => {
        element.classList.remove("project-transition-source", "is-navigating");
        element.style.removeProperty("view-transition-name");
      });
      source.classList.add("project-transition-source", "is-navigating");
      source.style.setProperty("view-transition-name", "project-hero");
    });
  };

  const initMobileNav = () => {
    const nav = document.querySelector(".cv-nav");
    const toggle = $("navToggle");

    if (!nav || !toggle) {
      return;
    }

    const setOpen = (open) => {
      nav.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    toggle.addEventListener("click", () => {
      setOpen(!nav.classList.contains("nav-open"));
    });

    // Close the menu after navigating to a section.
    nav.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (nav.classList.contains("nav-open") && !nav.contains(event.target)) {
        setOpen(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 920) setOpen(false);
    });
  };

  const initYear = () => {
    const year = $("currentYear");

    if (year) {
      year.textContent = new Date().getFullYear().toString();
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initLanguage();
    initRevealAnimations();
    initNavSpy();
    initScrollToTop();
    initStatsAnimation();
    initYear();
    initMobileNav();
    initExports();
    initDownloadGuard();
    initProjectRows();
    initProjectHeroTransitions();
    updateThemeColorMeta();
    updateContrast();
    enableThemeTransition();
  });
})();
