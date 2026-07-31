(function () {
  "use strict";

  const currentPath = (window.location.pathname || "").toLowerCase();
  const compactToolPattern = /(?:^|\/)(?:typing-trainer|shortcut-trainer|quiz|calculator|qr-code-generator)\.html$/;
  const focusedDigitalToolPattern = /\/digital-tools\/(?:typing-trainer|shortcut-keys-trainer|ict-quiz|scientific-calculator|qr-code-generator)\.html$/;

  if (compactToolPattern.test(currentPath) || focusedDigitalToolPattern.test(currentPath)) return;

  const navbar = document.querySelector(".navbar");
  if (!navbar || navbar.querySelector(".ai-live-strip")) return;

  const messages = [
    "One skill today can open a door tomorrow.",
    "Keep learning—your progress is building something powerful.",
    "Learn. Believe. Grow. Build."
  ];

  const strip = document.createElement("div");
  strip.className = "ai-live-strip";
  strip.setAttribute("role", "group");
  strip.setAttribute("aria-live", "off");
  strip.setAttribute("aria-label", "Local date, time, and encouragement");
  strip.innerHTML = `
    <div class="ai-live-primary">
      <span class="ai-live-icon" aria-hidden="true">🌙</span>
      <strong class="ai-live-greeting">Good evening</strong>
      <span class="ai-live-separator" aria-hidden="true">·</span>
      <span class="ai-live-date-full"></span>
      <span class="ai-live-date-short"></span>
      <span class="ai-live-separator" aria-hidden="true">·</span>
      <time class="ai-live-clock"></time>
    </div>
    <div class="ai-live-encouragement" aria-hidden="true"><span></span></div>
  `;

  navbar.appendChild(strip);
  navbar.classList.add("has-live-strip");

  const icon = strip.querySelector(".ai-live-icon");
  const greeting = strip.querySelector(".ai-live-greeting");
  const fullDate = strip.querySelector(".ai-live-date-full");
  const shortDate = strip.querySelector(".ai-live-date-short");
  const clock = strip.querySelector(".ai-live-clock");
  const encouragement = strip.querySelector(".ai-live-encouragement");
  const encouragementText = encouragement.querySelector("span");

  const fullDateFormatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short"
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  function timeIdentity(hour) {
    if (hour >= 5 && hour < 12) return { icon: "🌅", greeting: "Good morning" };
    if (hour >= 12 && hour < 18) return { icon: "☀️", greeting: "Good afternoon" };
    if (hour >= 18 && hour < 21) return { icon: "🌇", greeting: "Good evening" };
    return { icon: "🌙", greeting: "Good evening" };
  }

  function updateClock() {
    const now = new Date();
    const identity = timeIdentity(now.getHours());

    icon.textContent = identity.icon;
    greeting.textContent = identity.greeting;
    fullDate.textContent = fullDateFormatter.format(now);
    shortDate.textContent = shortDateFormatter.format(now);
    clock.dateTime = now.toISOString();
    clock.textContent = timeFormatter.format(now);
  }

  let messageIndex = 0;
  encouragementText.textContent = messages[messageIndex];

  function rotateMessage() {
    encouragement.classList.add("is-changing");
    window.setTimeout(function () {
      messageIndex = (messageIndex + 1) % messages.length;
      encouragementText.textContent = messages[messageIndex];
      encouragement.classList.remove("is-changing");
    }, 330);
  }

  function updateScrolledState() {
    navbar.classList.toggle("nav-scrolled", window.scrollY > 42);
  }

  const menuToggle = navbar.querySelector(".menu-toggle");
  if (menuToggle) {
    const syncMenuState = function () {
      navbar.classList.toggle("live-menu-open", menuToggle.checked);
    };
    menuToggle.addEventListener("change", syncMenuState);
    syncMenuState();
  }

  updateClock();
  updateScrolledState();
  window.setInterval(updateClock, 1000);
  window.setInterval(rotateMessage, 13000);
  window.addEventListener("scroll", updateScrolledState, { passive: true });
})();
