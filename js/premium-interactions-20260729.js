(() => {
  "use strict";

  const NEW_TARGETS = [
    ".eyebrow",
    ".home-editorial-meta > span",
    ".home-editorial-image > span",
    ".latest-update-meta b",
    ".latest-new-badge",
    ".inspiration-link-row small",
    ".new-label",
    ".question-tag"
  ].join(",");

  const wrapNewWord = (root = document) => {
    const targets = [];
    if (root.nodeType === Node.ELEMENT_NODE && root.matches?.(NEW_TARGETS)) targets.push(root);
    root.querySelectorAll?.(NEW_TARGETS).forEach((element) => targets.push(element));

    targets.forEach((element) => {
      if (element.querySelector(".new-blink")) return;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let textNode;
      while ((textNode = walker.nextNode())) {
        const match = textNode.nodeValue.match(/\bNew\b/i);
        if (!match) continue;
        const value = textNode.nodeValue;
        const index = match.index;
        const fragment = document.createDocumentFragment();
        fragment.append(value.slice(0, index));
        const blink = document.createElement("span");
        blink.className = "new-blink";
        blink.textContent = value.slice(index, index + match[0].length);
        fragment.append(blink, value.slice(index + match[0].length));
        textNode.replaceWith(fragment);
        break;
      }
    });
  };

  const prepareNewPanels = () => {
    const panels = Array.from(document.querySelectorAll(".premium-discovery-panel"));
    if (!panels.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      panels.forEach((panel) => panel.classList.add("premium-reveal", "is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -28px" });

    panels.forEach((panel, index) => {
      panel.classList.add("premium-reveal");
      panel.style.setProperty("--premium-reveal-delay", `${index * 90}ms`);
      observer.observe(panel);
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    wrapNewWord();
    prepareNewPanels();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) wrapNewWord(node);
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
