(() => {
  "use strict";
  const selector = '[data-floating-control], .ai-floating-button, .ai-loader-launcher';
  let scheduled = false;

  function visible(element) {
    if (!element || element.hidden) return false;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || (style.opacity !== "" && Number(style.opacity) === 0)) return false;
    if (element.classList.contains("ytp-back-top") && !element.classList.contains("is-visible")) return false;
    if (element.classList.contains("ytp-floating-youtube") && !element.classList.contains("is-visible")) return false;
    return true;
  }

  function layout() {
    scheduled = false;
    if (!document || !document.body) return;
    const controls = Array.from(document.querySelectorAll(selector));
    const wide = controls.filter((el) => {
      const role = el.dataset.floatingControl || "";
      return (role.includes("audio") || role === "consent") && visible(el);
    }).sort((a, b) => {
      const rank = (el) => (el.dataset.floatingControl === "consent" ? 0 : 1);
      return rank(a) - rank(b);
    });
    const circles = controls.filter((el) => {
      const role = el.dataset.floatingControl || "";
      return !role.includes("audio") && role !== "consent" && visible(el);
    }).sort((a, b) => {
      const priority = (el) => {
        const role = el.dataset.floatingControl || "";
        if (role === "assistant") return 0;
        if (role === "youtube") return 1;
        if (role === "back-top") return 2;
        return 3;
      };
      return priority(a) - priority(b);
    });
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const safe = mobile ? 10 : 16;
    let currentBottom = safe;
    wide.forEach((el) => {
      el.style.setProperty("--floating-offset", `${currentBottom}px`);
      currentBottom += (el.getBoundingClientRect().height || 76) + (mobile ? 10 : 12);
    });
    document.body.classList.toggle("has-visible-audio-control", wide.some((el) => (el.dataset.floatingControl || "").includes("audio")));
    circles.forEach((el, index) => {
      el.setAttribute("data-floating-control", el.dataset.floatingControl || "circle");
      el.style.setProperty("--floating-offset", `${currentBottom + index * (mobile ? 66 : 72)}px`);
    });
  }

  function requestLayout() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(layout);
  }

  document.addEventListener("DOMContentLoaded", () => {
    requestLayout();
    new MutationObserver(requestLayout).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "hidden", "style"] });
    if ("ResizeObserver" in window) new ResizeObserver(requestLayout).observe(document.body);
    window.addEventListener("resize", requestLayout, { passive: true });
    window.addEventListener("scroll", requestLayout, { passive: true });
  });
})();
