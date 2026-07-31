(() => {
  "use strict";

  const buttons = Array.from(document.querySelectorAll("[data-category-filter]"));
  const rows = Array.from(document.querySelectorAll("[data-tool-category]"));
  const result = document.getElementById("digitalToolsResult");
  const library = document.getElementById("digital-tools-library");
  const navbar = document.querySelector(".navbar");
  if (!buttons.length || !rows.length || !library) return;

  const labels = {
    all: "all tools",
    create: "Create tools",
    "learn-practise": "Learn & Practise tools",
    calculate: "Calculate tools",
    productivity: "Productivity tools",
    "ai-tools": "AI tools"
  };

  let announcementTimer = 0;
  let scrollTimer = 0;

  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const validCategory = (value) => buttons.some((button) => button.dataset.categoryFilter === value) ? value : "all";

  const showRow = (row, shouldShow) => {
    row.classList.remove("is-filter-visible");
    row.classList.toggle("is-filtered-out", !shouldShow);
    row.hidden = !shouldShow;
    row.setAttribute("aria-hidden", String(!shouldShow));
    if (shouldShow) {
      requestAnimationFrame(() => requestAnimationFrame(() => row.classList.add("is-filter-visible")));
    }
  };

  const scrollToLibrary = () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      const offset = Math.max(74, (navbar?.offsetHeight || 68) + 14);
      const top = Math.max(0, library.getBoundingClientRect().top + window.scrollY - offset);
      window.scrollTo({ top, behavior: reducedMotion() ? "auto" : "smooth" });
    }, 70);
  };

  const announceCategory = (category, visible) => {
    const activeButton = buttons.find((button) => button.dataset.categoryFilter === category);
    activeButton?.classList.remove("is-category-pulse");
    result?.classList.remove("is-announcing");
    library.classList.remove("is-category-announcing");

    requestAnimationFrame(() => {
      activeButton?.classList.add("is-category-pulse");
      result?.classList.add("is-announcing");
      library.classList.add("is-category-announcing");
    });

    if (activeButton && window.innerWidth <= 720) {
      activeButton.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "nearest", inline: "center" });
    }

    window.clearTimeout(announcementTimer);
    announcementTimer = window.setTimeout(() => {
      activeButton?.classList.remove("is-category-pulse");
      result?.classList.remove("is-announcing");
      library.classList.remove("is-category-announcing");
    }, 1200);
  };

  const apply = (requestedCategory, options = {}) => {
    const {
      updateHash = true,
      shouldScroll = false,
      shouldAnnounce = true
    } = options;

    const category = validCategory(requestedCategory);
    let visible = 0;

    buttons.forEach((button) => {
      const active = button.dataset.categoryFilter === category;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      button.tabIndex = active ? 0 : -1;
    });

    rows.forEach((row) => {
      const shouldShow = category === "all" || row.dataset.toolCategory === category;
      showRow(row, shouldShow);
      if (shouldShow) visible += 1;
    });

    if (result) {
      if (category === "all") result.textContent = `Showing all ${visible} tools`;
      else {
        const noun = visible === 1 ? labels[category].replace(/ tools$/, " tool") : labels[category];
        result.textContent = `Showing ${visible} ${noun}`;
      }
    }

    if (updateHash) {
      const hash = category === "all" ? "#digital-tools-library" : `#${category}`;
      history.replaceState({ digitalToolsCategory: category }, "", hash);
    }

    if (shouldAnnounce) announceCategory(category, visible);
    if (shouldScroll) scrollToLibrary();
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      apply(button.dataset.categoryFilter, { updateHash: true, shouldScroll: false, shouldAnnounce: true });
    });

    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowLeft") next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      buttons[next].focus();
      apply(buttons[next].dataset.categoryFilter, { updateHash: true, shouldScroll: false, shouldAnnounce: true });
    });
  });

  const categoryFromHash = () => {
    const raw = location.hash.replace(/^#/, "");
    return raw === "digital-tools-library" || !raw ? "all" : raw;
  };

  const initialCategory = categoryFromHash();
  const initialHasCategoryHash = Boolean(location.hash && location.hash !== "#digital-tools-library");
  apply(initialCategory, { updateHash: false, shouldScroll: initialHasCategoryHash, shouldAnnounce: initialHasCategoryHash });

  window.addEventListener("hashchange", () => {
    apply(categoryFromHash(), { updateHash: false, shouldScroll: true, shouldAnnounce: true });
  });

  // Same-page navbar category links can be clicked while the hash is already active.
  document.querySelectorAll(".nav-dropdown-digital-tools a").forEach((link) => {
    link.addEventListener("click", (event) => {
      let url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (error) {
        return;
      }

      const samePage = url.pathname.replace(/\/index\.html$/i, "/") === window.location.pathname.replace(/\/index\.html$/i, "/");
      if (!samePage) return;

      const category = url.hash.replace(/^#/, "") || "all";
      if (validCategory(category) !== category && category !== "digital-tools-library") return;

      event.preventDefault();
      window.setTimeout(() => apply(category === "digital-tools-library" ? "all" : category, {
        updateHash: true,
        shouldScroll: true,
        shouldAnnounce: true
      }), 20);
    });
  });
})();
