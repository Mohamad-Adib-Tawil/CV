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

    return preset || "blue";
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
        const description = project.description[lang] || project.description.en;
        const slug = project.slug || project.id;
        const detailsHref = `project.html?id=${encodeURIComponent(slug)}${fromParam}`;

        return `
          <tr>
            <td class="project-name">
              ${escapeHtml(project.name)}
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
    setText("downloadsBackLink", dict.downloadsPage.backToCv);
    setText("downloadsPageTitle", dict.downloadsPage.title);
    setHeadingText("downloadsSectionTitle", dict.downloadsPage.downloadsTitle);
    setHeadingText("plainTextSectionTitle", dict.downloadsPage.plainTextTitle);
    setHtml("downloadsIntro", dict.downloadsPage.downloadsIntro);
    setText("downloadEnglishLabel", dict.downloadsPage.englishLabel);
    setText("downloadArabicLabel", dict.downloadsPage.arabicLabel);
    setText("exportWordText", dict.downloadsPage.exportWord);
    setText("exportATSText", dict.downloadsPage.exportATS);

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
    lightbox.setAttribute("hidden", "");
    lightbox.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="Close">
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
    const backHref = `${from}#projects`;

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

    const alt = project.image.alt[lang] || project.image.alt.en;
    document.title = `${project.name} — ${profile.name}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", stripHtml(project.description[lang] || project.description.en));
    }

    const icon = $("detailIcon");
    if (icon) {
      icon.src = project.image.src;
      icon.alt = alt;
    }

    setText("detailName", project.name);

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
    const media = project.media || {};
    const screensSection = $("detailScreens");
    const gallery = $("detailGallery");
    const screenshots = Array.isArray(media.screenshots) ? media.screenshots : [];

    if (gallery && screenshots.length) {
      gallery.innerHTML = screenshots
        .map((shot) => {
          const shotAlt = (shot.alt && (shot.alt[lang] || shot.alt.en)) || alt;
          return `
            <button type="button" class="gallery-item" data-src="${escapeHtml(
              shot.src
            )}" data-alt="${escapeHtml(shotAlt)}">
              <img src="${escapeHtml(shot.src)}" alt="${escapeHtml(
            shotAlt
          )}" loading="lazy" decoding="async">
            </button>
          `;
        })
        .join("");

      gallery.querySelectorAll(".gallery-item").forEach((item) => {
        item.addEventListener("click", () => {
          openLightbox(item.getAttribute("data-src"), item.getAttribute("data-alt"));
        });
      });

      if (screensSection) screensSection.hidden = false;
    } else if (screensSection) {
      screensSection.hidden = true;
    }

    // Video
    const videoSection = $("detailVideoSection");
    const videoHost = $("detailVideo");
    if (videoHost && media.video) {
      const poster = media.poster || project.image.src;
      videoHost.innerHTML = `
        <video controls preload="none" poster="${escapeHtml(poster)}">
          <source src="${escapeHtml(media.video)}" type="video/mp4">
        </video>
      `;
      if (videoSection) videoSection.hidden = false;
    } else if (videoSection) {
      videoSection.hidden = true;
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

    renderNav(dict);
    renderHeader(dict);
    renderSectionTitles(dict);
    renderContentSections(dict);
    renderFooter(dict);
    renderDownloadsPage(dict);
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
    const savedTheme = localStorage.getItem("theme");
    const savedPreset = normalizePreset(localStorage.getItem("themePreset"));

    applyThemeState(savedTheme !== "light");
    applyPreset(savedPreset);

    if (presetSelect) {
      presetSelect.value = savedPreset;
      presetSelect.addEventListener("change", (event) => {
        const nextPreset = normalizePreset(event.target.value);
        enableThemeTransition();
        applyPreset(nextPreset);
        localStorage.setItem("themePreset", nextPreset);

        if (nextPreset === "midnight") {
          applyThemeState(true);
          localStorage.setItem("theme", "dark");
        }
      });
    }

    if (savedPreset === "midnight" && !themeRoot.classList.contains("dark-mode")) {
      applyThemeState(true);
      localStorage.setItem("theme", "dark");
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const nextDarkMode = !themeRoot.classList.contains("dark-mode");
        applyThemeState(nextDarkMode);
        localStorage.setItem("theme", nextDarkMode ? "dark" : "light");
        updateContrast();
      });
    }
  };

  const initLanguage = () => {
    const savedLang = localStorage.getItem("lang") || "en";
    applyLanguage(savedLang);

    if (langSelect) {
      langSelect.value = state.currentLang;
      langSelect.addEventListener("change", (event) => {
        enableThemeTransition();
        applyLanguage(event.target.value);
        localStorage.setItem("lang", state.currentLang);
      });
    }
  };

  const initRevealAnimations = () => {
    const targets = document.querySelectorAll("section, .project-table, header");

    if (targets.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => entry.target.classList.add("fade-in"), 100);
          }
        });
      },
      { threshold: 0.1 }
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
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));

    if (sections[0]) {
      setActive(sections[0].id);
    }
  };

  const initParallax = () => {
    const header = $("header");
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    if (!header) {
      return;
    }

    const onScroll = () => {
      const offset = Math.min(window.scrollY, 200);
      header.style.transform = `translateY(${offset * 0.03}px)`;
    };

    const attach = () => {
      if (reducedMotion?.matches) {
        header.style.transform = "";
        return;
      }

      window.addEventListener("scroll", onScroll, { passive: true });
    };

    attach();

    if (reducedMotion) {
      reducedMotion.addEventListener("change", () => {
        window.removeEventListener("scroll", onScroll);
        attach();
      });
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

  const initParticles = () => {
    const createParticles = () => {
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const container = $("particles");

      if (!container) {
        return;
      }

      const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const total = viewportWidth >= 1200 ? 30 : viewportWidth >= 768 ? 20 : 12;

      for (let index = 0; index < total; index += 1) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.width = `${Math.random() * 15 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
        container.appendChild(particle);
      }
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(createParticles);
      return;
    }

    window.setTimeout(createParticles, 0);
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

  const initTypingEffect = () => {
    const heading = document.querySelector("h1");

    if (!heading) {
      return;
    }

    const originalText = heading.textContent || "";
    heading.textContent = "";

    let index = 0;
    const typeWriter = () => {
      if (index < originalText.length) {
        heading.textContent += originalText.charAt(index);
        index += 1;
        window.setTimeout(typeWriter, 100);
      }
    };

    const header = $("header");

    if (!header) {
      typeWriter();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            typeWriter();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(header);
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
  <div class="contact">${escapeHtml(profile.email)} | ${escapeHtml(compactUrl(profile.linkedinUrl))} | ${escapeHtml(
      compactUrl(profile.githubUrl)
    )}</div>
  <div class="job-title">${escapeHtml(dict.header.jobTitle)} | ${escapeHtml(dict.header.availability)}</div>

  <h2>${escapeHtml(dict.titles.summary)}</h2>
  <p>${escapeHtml(dict.summaryText)}</p>

  <h2>${escapeHtml(dict.titles.skills)}</h2>
  <ul>${dict.skillsList.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

  <h2>${escapeHtml(dict.titles.experience)}</h2>
  <h3>${escapeHtml(dict.experienceRole)}</h3>
  <ul>${dict.experienceList.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

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
  <div class="contact">${escapeHtml(profile.email)} | ${escapeHtml(compactUrl(profile.linkedinUrl))} | ${escapeHtml(
      compactUrl(profile.githubUrl)
    )}</div>
  <div class="job-title">${
    currentLang === "ar"
      ? escapeHtml("مطوّر Flutter متوسط المستوى")
      : escapeHtml("MID-LEVEL FLUTTER DEVELOPER")
  }</div>

  <h2>${escapeHtml(currentLang === "ar" ? "الملخص المهني" : "PROFESSIONAL SUMMARY")}</h2>
  <p>${escapeHtml(dict.downloadsPage.atsSummary)}</p>

  <h2>${escapeHtml(currentLang === "ar" ? "المهارات التقنية" : "TECHNICAL SKILLS")}</h2>
  <ul>${dict.skillsList.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

  <h2>${escapeHtml(currentLang === "ar" ? "الخبرة العملية" : "PROFESSIONAL EXPERIENCE")}</h2>
  <h3>${escapeHtml(currentLang === "ar" ? "مطوّر Flutter متوسط المستوى | 2022 – حتى الآن" : "MID-LEVEL FLUTTER DEVELOPER | 2022 – PRESENT")}</h3>
  <ul>${dict.experienceList.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>

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
    updateThemeColorMeta();
    updateContrast();
    enableThemeTransition();
  });
})();
