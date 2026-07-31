(() => {
  "use strict";

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function initQrJourney() {
    const nav = qs(".qr-step-nav");
    const buttons = qsa(".qr-step-button", nav || document);
    if (!nav || !buttons.length || nav.querySelector(".qr-step-progress-summary")) return;

    const title = qs(".qr-step-nav-title", nav);
    const summary = document.createElement("div");
    summary.className = "qr-step-progress-summary";
    summary.setAttribute("aria-live", "polite");
    summary.innerHTML = `
      <div class="qr-step-progress-copy"><span data-qr-progress-copy>Step 1 of ${buttons.length}</span><strong data-qr-progress-percent>${Math.round(100 / buttons.length)}% complete</strong></div>
      <div class="qr-step-progress-track" aria-hidden="true"><span data-qr-progress-bar></span></div>`;
    title?.insertAdjacentElement("afterend", summary);

    const mobile = document.createElement("div");
    mobile.className = "qr-mobile-journey";
    mobile.innerHTML = `
      <button type="button" data-qr-mobile-prev aria-label="Previous QR Builder step">‹</button>
      <div class="qr-mobile-current">
        <div class="qr-mobile-current-line"><strong data-qr-mobile-title>QR Type</strong><span data-qr-mobile-copy>Step 1 of ${buttons.length}</span></div>
        <div class="qr-mobile-progress" aria-hidden="true"><span data-qr-mobile-bar></span></div>
      </div>
      <button type="button" data-qr-mobile-next aria-label="Next QR Builder step">›</button>`;
    nav.appendChild(mobile);

    const update = () => {
      let index = buttons.findIndex((button) => button.classList.contains("is-active"));
      if (index < 0) index = 0;
      const current = buttons[index];
      const percent = Math.round(((index + 1) / buttons.length) * 100);
      const label = `Step ${index + 1} of ${buttons.length}`;
      const currentTitle = qs("strong", current)?.textContent.trim() || `Step ${index + 1}`;

      const copy = qs("[data-qr-progress-copy]", summary);
      const pct = qs("[data-qr-progress-percent]", summary);
      const bar = qs("[data-qr-progress-bar]", summary);
      if (copy) copy.textContent = label;
      if (pct) pct.textContent = `${percent}% complete`;
      if (bar) bar.style.width = `${percent}%`;

      const mobileTitle = qs("[data-qr-mobile-title]", mobile);
      const mobileCopy = qs("[data-qr-mobile-copy]", mobile);
      const mobileBar = qs("[data-qr-mobile-bar]", mobile);
      const prev = qs("[data-qr-mobile-prev]", mobile);
      const next = qs("[data-qr-mobile-next]", mobile);
      if (mobileTitle) mobileTitle.textContent = currentTitle;
      if (mobileCopy) mobileCopy.textContent = label;
      if (mobileBar) mobileBar.style.width = `${percent}%`;
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === buttons.length - 1;

      buttons.forEach((button, buttonIndex) => {
        button.setAttribute("aria-label", `${buttonIndex + 1}. ${qs("strong", button)?.textContent.trim() || "QR Builder step"}${button.classList.contains("is-complete") ? ", completed" : ""}${buttonIndex === index ? ", current step" : ""}`);
      });
    };

    qs("[data-qr-mobile-prev]", mobile)?.addEventListener("click", () => {
      const index = buttons.findIndex((button) => button.classList.contains("is-active"));
      buttons[Math.max(0, index - 1)]?.click();
    });
    qs("[data-qr-mobile-next]", mobile)?.addEventListener("click", () => {
      const index = buttons.findIndex((button) => button.classList.contains("is-active"));
      buttons[Math.min(buttons.length - 1, index + 1)]?.click();
    });

    const observer = new MutationObserver(update);
    buttons.forEach((button) => observer.observe(button, { attributes: true, attributeFilter: ["class", "aria-current"] }));
    update();
  }

  function initQrValidation() {
    const errors = qsa(".qr-inline-error");
    if (!errors.length) return;

    const sync = (error) => {
      const visible = !error.hidden && Boolean(error.textContent.trim());
      const field = error.closest(".qr-field");
      field?.classList.toggle("has-error", visible);
      const input = field?.querySelector("input,select,textarea,[role='combobox']");
      if (visible) {
        error.setAttribute("role", "alert");
        input?.setAttribute("aria-invalid", "true");
      } else if (input?.getAttribute("aria-invalid") === "true") {
        input.setAttribute("aria-invalid", "false");
      }
    };

    errors.forEach((error) => {
      new MutationObserver(() => sync(error)).observe(error, {
        attributes: true,
        attributeFilter: ["hidden"],
        childList: true,
        characterData: true,
        subtree: true
      });
      sync(error);
    });
  }

  function initShortcutFeedback() {
    const feedback = qs("#shortcutFeedback");
    if (!feedback) return;
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");

    const sync = () => {
      feedback.classList.toggle("is-visible", Boolean(feedback.textContent.trim()));
      qsa(".shortcut-choice-btn", feedback.closest(".shortcut-app-card") || document).forEach((button) => {
        if (button.classList.contains("correct-answer")) button.setAttribute("aria-label", `${button.textContent.trim()}, correct answer`);
        else if (button.classList.contains("wrong-answer")) button.setAttribute("aria-label", `${button.textContent.trim()}, your incorrect answer`);
      });
    };
    new MutationObserver(sync).observe(feedback.closest(".shortcut-question-card") || feedback, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["class"]
    });
    sync();
  }

  function auditInvalidFields() {
    qsa("[aria-invalid='true']").forEach((field) => field.closest(".qr-field,.form-group,.field-group")?.classList.add("has-error"));
  }

  function boot() {
    initQrJourney();
    initQrValidation();
    initShortcutFeedback();
    auditInvalidFields();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
