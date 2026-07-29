(() => {
  "use strict";

  const SELECTORS = {
    practiceMain: ".typing-page, .shortcut-page, .quiz-page",
    practiceApp: ".typing-app-card, .shortcut-app-card, .quiz-app-card"
  };

  function enhanceNewArticleBadge(root = document) {
    const badges = [];
    if (root.nodeType === Node.ELEMENT_NODE && root.matches?.(".home-editorial-image > span")) badges.push(root);
    root.querySelectorAll?.(".home-editorial-image > span").forEach((item) => badges.push(item));
    badges.forEach((badge) => {
      if (badge.classList.contains("home-editorial-badge")) return;
      badge.classList.add("home-editorial-badge");
      badge.setAttribute("aria-label", "New article");
      badge.innerHTML = '<span class="new-blink">NEW</span><span>ARTICLE</span>';
    });
  }

  function structureDigitalToolsMenu() {
    document.querySelectorAll("#digital-tools-menu").forEach((menu) => {
      const items = Array.from(menu.children).filter((item) => item.tagName === "LI" && !item.classList.contains("nav-tools-group-label"));
      if (!items.length) return;

      items[0].classList.add("nav-tools-overview");
      if (!menu.querySelector(".nav-tools-group-label")) {
        const label = document.createElement("li");
        label.className = "nav-tools-group-label";
        label.setAttribute("aria-hidden", "true");
        label.textContent = "Tool Categories";
        items[0].insertAdjacentElement("afterend", label);
      }

      items.slice(1).forEach((item) => item.classList.add("nav-tools-category"));
      menu.setAttribute("data-hierarchy-ready", "true");
    });
  }

  function focusIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H4a1 1 0 0 0-1 1v4M16 3h4a1 1 0 0 1 1 1v4M8 21H4a1 1 0 0 1-1-1v-4M16 21h4a1 1 0 0 0 1-1v-4"/></svg>';
  }

  function initPracticeFocusMode() {
    const main = document.querySelector(SELECTORS.practiceMain);
    if (!main || main.querySelector(".tool-focus-toolbar")) return;
    const app = main.querySelector(SELECTORS.practiceApp);
    if (!app) return;

    document.body.classList.add("tool-practice-page");

    const toolbar = document.createElement("div");
    toolbar.className = "tool-focus-toolbar";
    toolbar.innerHTML = `
      <div class="tool-focus-intro">
        <span aria-hidden="true">◎</span>
        <div><strong>Practice Workspace</strong><small>Use Focus Mode to remove distractions and fit more practice on screen.</small></div>
      </div>
      <div class="tool-focus-actions">
        <button class="tool-focus-button" type="button" aria-pressed="false"><span>Focus Mode</span><b aria-hidden="true">→</b></button>
        <button class="tool-fullscreen-button" type="button" aria-label="Open browser full screen" title="Open browser full screen">${focusIcon()}</button>
      </div>
      <span class="tool-focus-status" role="status" aria-live="polite"></span>`;
    main.insertBefore(toolbar, app);

    const focusButton = toolbar.querySelector(".tool-focus-button");
    const focusLabel = focusButton.querySelector("span");
    const focusArrow = focusButton.querySelector("b");
    const fullscreenButton = toolbar.querySelector(".tool-fullscreen-button");
    const status = toolbar.querySelector(".tool-focus-status");
    let previousScroll = 0;

    const setFocusMode = (enabled, { announce = true } = {}) => {
      if (enabled === document.body.classList.contains("tool-focus-mode")) return;
      if (enabled) previousScroll = window.scrollY;
      document.body.classList.toggle("tool-focus-mode", enabled);
      document.documentElement.classList.toggle("tool-focus-mode", enabled);
      focusButton.setAttribute("aria-pressed", String(enabled));
      focusLabel.textContent = enabled ? "Exit Focus Mode" : "Focus Mode";
      focusArrow.textContent = enabled ? "×" : "→";
      if (announce) status.textContent = enabled ? "Focus Mode opened. Navigation and extra panels are hidden." : "Focus Mode closed. Full page navigation restored.";
      if (enabled) {
        requestAnimationFrame(() => {
          main.scrollTop = 0;
          focusButton.focus({ preventScroll: true });
        });
      } else {
        requestAnimationFrame(() => window.scrollTo({ top: previousScroll, behavior: "smooth" }));
      }
    };

    focusButton.addEventListener("click", () => setFocusMode(!document.body.classList.contains("tool-focus-mode")));

    fullscreenButton.addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
          status.textContent = "Browser full screen opened. Press Escape to leave full screen.";
        } else {
          await document.exitFullscreen();
        }
      } catch (error) {
        status.textContent = "Browser full screen is not available here. Focus Mode still works normally.";
      }
    });

    document.addEventListener("fullscreenchange", () => {
      const active = Boolean(document.fullscreenElement);
      fullscreenButton.setAttribute("aria-label", active ? "Exit browser full screen" : "Open browser full screen");
      fullscreenButton.title = active ? "Exit browser full screen" : "Open browser full screen";
      fullscreenButton.classList.toggle("is-active", active);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("tool-focus-mode") && !document.fullscreenElement) {
        setFocusMode(false);
      }
    });
  }

  function boot() {
    enhanceNewArticleBadge();
    structureDigitalToolsMenu();
    initPracticeFocusMode();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          enhanceNewArticleBadge(node);
          if (node.matches?.("#digital-tools-menu") || node.querySelector?.("#digital-tools-menu")) structureDigitalToolsMenu();
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
