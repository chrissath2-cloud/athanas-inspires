(() => {
  "use strict";
  const KEY = "athanasCookieChoiceV1";
  let choice = null;
  try { choice = localStorage.getItem(KEY); } catch (_) {}

  function update(value) {
    try { localStorage.setItem(KEY, value); } catch (_) {}
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: value === "granted" ? "granted" : "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
    }
    document.querySelector(".cookie-consent")?.remove();
  }

  function show() {
    if (choice) return;
    const banner = document.createElement("aside");
    banner.className = "cookie-consent";
    banner.setAttribute("data-floating-control", "consent");
    banner.setAttribute("aria-label", "Cookie and analytics choices");
    banner.innerHTML = `<div><strong>Your privacy choices</strong><p>Athanas Inspires uses essential browser storage for features such as audio preferences and the Assistant. Optional analytics help us understand which lessons and tools are useful.</p><a href="cookie-policy.html">Read cookie information</a></div><div class="cookie-consent-actions"><button type="button" data-consent="denied">Essential Only</button><button type="button" class="is-primary" data-consent="granted">Accept Analytics</button></div>`;
    banner.addEventListener("click", (event) => {
      const button = event.target.closest("[data-consent]");
      if (button) update(button.dataset.consent);
    });
    document.body.appendChild(banner);
  }

  document.addEventListener("DOMContentLoaded", show);
  window.ATHANAS_CONSENT = { update };
})();
