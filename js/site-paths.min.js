(() => {
  "use strict";

  const currentScript = document.currentScript;
  const scriptUrl = currentScript && currentScript.src
    ? new URL(currentScript.src, document.baseURI)
    : new URL("js/site-paths.js", document.baseURI);
  const siteRoot = new URL("../", scriptUrl);

  function isExternal(value) {
    return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value || "");
  }

  function resolve(value) {
    if (typeof value !== "string" || !value) return value;
    if (value.startsWith("//") || /^(?:https?:|mailto:|tel:|data:|blob:|javascript:)/i.test(value) || value.startsWith("#")) return value;
    if (value.startsWith("/")) return new URL(value.slice(1), siteRoot).href;
    return value;
  }

  function rewriteElement(element) {
    if (!element || element.nodeType !== 1) return;
    ["href", "src", "action", "poster", "data-src", "data-href"].forEach((attribute) => {
      const value = element.getAttribute && element.getAttribute(attribute);
      if (value && value.startsWith("/") && !value.startsWith("//")) {
        element.setAttribute(attribute, resolve(value));
      }
    });
    if (element.querySelectorAll) {
      element.querySelectorAll("[href^='/'],[src^='/'],[action^='/'],[poster^='/'],[data-src^='/'],[data-href^='/']").forEach(rewriteElement);
    }
  }

  window.AthanasPaths = Object.freeze({
    root: siteRoot.href,
    resolve,
    isExternal
  });

  rewriteElement(document.documentElement);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") rewriteElement(mutation.target);
      mutation.addedNodes.forEach(rewriteElement);
    });
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["href", "src", "action", "poster", "data-src", "data-href"]
  });
})();
