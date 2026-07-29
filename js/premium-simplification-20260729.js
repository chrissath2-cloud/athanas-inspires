(() => {
  "use strict";

  const normalisePath = (value) => {
    const path = String(value || "/").replace(/\/index\.html$/i, "/");
    return path.length > 1 ? path.replace(/\/$/, "") : path;
  };

  const refreshActiveNavigation = () => {
    const currentPath = normalisePath(window.location.pathname);
    const currentHash = window.location.hash || "";
    const cards = Array.from(document.querySelectorAll(".nav-card-menu a.nav-menu-card"));
    const primaryLinks = Array.from(document.querySelectorAll(".nav-links > li > a"));

    primaryLinks.forEach((link) => {
      let url;
      try { url = new URL(link.href, window.location.href); } catch (error) { return; }
      const active = normalisePath(url.pathname) === currentPath && (url.hash || "") === currentHash;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    document.querySelectorAll(".nav-dropdown-toggle.active").forEach((toggle) => toggle.classList.remove("active"));
    cards.forEach((link) => {
      let url;
      try { url = new URL(link.href, window.location.href); } catch (error) { return; }
      const samePath = normalisePath(url.pathname) === currentPath;
      const exactHash = (url.hash || "") === currentHash;
      const active = samePath && exactHash;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");

      if (samePath) {
        link.closest(".nav-dropdown")?.querySelector(":scope > .nav-dropdown-toggle")?.classList.add("active");
      }
    });
  };

  const preparePremiumReveals = () => {
    const targets = Array.from(document.querySelectorAll([
      ".start-here-mini-card",
      ".home-editorial-card",
      ".latest-update-row",
      ".digital-tool-row",
      ".premium-discovery-panel",
      ".premium-site-footer .footer-main > *",
      ".premium-site-footer .footer-community-strip"
    ].join(",")));

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("premium-reveal", "is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -34px" });

    targets.forEach((target, index) => {
      target.classList.add("premium-reveal");
      target.style.setProperty("--premium-reveal-delay", `${Math.min((index % 4) * 70, 210)}ms`);
      observer.observe(target);
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    refreshActiveNavigation();
    preparePremiumReveals();
  });
  window.addEventListener("hashchange", refreshActiveNavigation);
})();
