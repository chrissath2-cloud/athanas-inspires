(() => {
  "use strict";

  const STORAGE = {
    assignment: "athanasAssignmentProgressV2",
    recentTools: "athanasRecentToolsV2"
  };

  const toolConfig = {
    typing: {
      selector: ".typing-page",
      app: ".typing-app-card",
      side: ".typing-side-panel",
      title: "Typing Speed Trainer",
      icon: "⚡",
      help: [
        ["1", "Choose a practice type", "Begin with a short passage and focus on accuracy before speed."],
        ["2", "Choose a time", "Use 30 seconds for a quick warm-up or 60 seconds for normal practice."],
        ["3", "Start calmly", "Keep your eyes on the passage and type without rushing."],
        ["4", "Review the result", "Use WPM, accuracy and mistakes to choose your next goal."]
      ]
    },
    shortcuts: {
      selector: ".shortcut-page",
      app: ".shortcut-app-card",
      side: ".shortcut-side-panel",
      title: "Computer Shortcut Keys Trainer",
      icon: "⌨",
      help: [
        ["1", "Choose a category", "Practise common, Windows, Word, Excel or browser shortcuts."],
        ["2", "Answer the challenge", "Click an option or press the real shortcut on a physical keyboard."],
        ["3", "Open the explanation", "Use the feedback to understand where the shortcut is useful."],
        ["4", "Build a streak", "Repeat difficult shortcuts until the correct keys feel natural."]
      ]
    },
    quiz: {
      selector: ".quiz-page",
      app: ".quiz-app-card",
      side: ".quiz-side-panel",
      title: "General ICT Quiz Game",
      icon: "🎮",
      help: [
        ["1", "Choose a category", "Select All Topics or focus on one ICT area."],
        ["2", "Answer one question", "Read carefully and select the best answer."],
        ["3", "Learn from feedback", "Correct answers and explanations appear immediately."],
        ["4", "Review your result", "Use your final score and mistakes to decide what to practise next."]
      ]
    },
    calculator: {
      selector: ".calculator-page",
      app: ".calculator-shell",
      side: ".calculator-side-panel",
      title: "Scientific Calculator",
      icon: "🧮",
      help: [
        ["B", "Basic mode", "Use numbers, brackets, percentages and everyday operations."],
        ["SCI", "Scientific mode", "Reveal trigonometry, logarithms, powers, roots and constants."],
        ["DEG", "Angle mode", "DEG is suitable for most school trigonometry questions. Switch to RAD when required."],
        ["↺", "Calculation history", "Select a previous answer to load it back into the calculator."]
      ]
    }
  };

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "") || fallback; }
    catch (_) { return fallback; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* storage can be blocked */ }
  }

  function createModal({ id, title, kicker = "Athanas Inspires Help", body, wide = false }) {
    let modal = document.getElementById(id);
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "plw-modal";
    modal.id = id;
    modal.hidden = true;
    modal.innerHTML = `
      <button class="plw-modal-backdrop" type="button" aria-label="Close help"></button>
      <section class="plw-modal-panel${wide ? " plw-modal-panel--wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="${id}Title">
        <div class="plw-modal-head">
          <div><span class="plw-modal-kicker">${escapeHtml(kicker)}</span><h2 id="${id}Title">${escapeHtml(title)}</h2></div>
          <button class="plw-modal-close" type="button" aria-label="Close help">×</button>
        </div>
        <div class="plw-modal-body">${body}</div>
      </section>`;
    document.body.appendChild(modal);

    const close = () => {
      modal.hidden = true;
      document.body.classList.remove("plw-modal-open");
      const returnId = modal.dataset.returnFocus;
      if (returnId) document.getElementById(returnId)?.focus({ preventScroll: true });
    };
    modal.querySelector(".plw-modal-backdrop").addEventListener("click", close);
    modal.querySelector(".plw-modal-close").addEventListener("click", close);
    modal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    modal.openFrom = (button) => {
      if (button && !button.id) button.id = `${id}Trigger`;
      modal.dataset.returnFocus = button?.id || "";
      modal.hidden = false;
      document.body.classList.add("plw-modal-open");
      requestAnimationFrame(() => modal.querySelector(".plw-modal-close")?.focus({ preventScroll: true }));
    };
    modal.closeModal = close;
    return modal;
  }

  function focusSvg() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H4a1 1 0 0 0-1 1v4M16 3h4a1 1 0 0 1 1 1v4M8 21H4a1 1 0 0 1-1-1v-4M16 21h4a1 1 0 0 0 1-1v-4"/></svg>';
  }
  function helpSvg() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.3 2.2c-.8.4-1.1.9-1.1 1.8M12 17h.01"/></svg>';
  }
  function toolsSvg() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>';
  }

  function detectTool() {
    return Object.entries(toolConfig).find(([, config]) => qs(config.selector)) || null;
  }

  function recordRecentTool(key, config) {
    const recent = readJSON(STORAGE.recentTools, []);
    const currentUrl = location.pathname.split("/").pop() || "index.html";
    const item = {
      id: key,
      title: config.title,
      icon: config.icon,
      url: currentUrl,
      path: location.pathname,
      lastVisited: Date.now(),
      detail: "Continue from your latest practice session"
    };
    const updated = [item, ...recent.filter((entry) => entry.id !== key)].slice(0, 5);
    writeJSON(STORAGE.recentTools, updated);

    const scoreTargets = qsa("#typingBestPill,#shortcutBestPill,#bestScorePill,#resultDisplay");
    if (scoreTargets.length) {
      const update = () => {
        const saved = readJSON(STORAGE.recentTools, []);
        const entry = saved.find((value) => value.id === key);
        if (!entry) return;
        const detail = scoreTargets.map((el) => el.textContent.trim()).find(Boolean);
        if (detail) entry.detail = detail;
        writeJSON(STORAGE.recentTools, saved);
      };
      const observer = new MutationObserver(update);
      scoreTargets.forEach((el) => observer.observe(el, { childList: true, characterData: true, subtree: true }));
      update();
    }
  }

  function buildToolHelp(config) {
    const body = `<p>Use this compact guide whenever you need a reminder. The activity remains open behind the help window.</p><div class="plw-help-list">${config.help.map(([step, title, copy]) => `
      <div class="plw-help-item"><span>${escapeHtml(step)}</span><div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(copy)}</small></div></div>`).join("")}</div>`;
    return createModal({ id: "plwToolHelpModal", title: `${config.title} Help`, body });
  }

  function moveSecondaryCards(main, side) {
    if (!side || main.querySelector(".plw-tool-more")) return;
    const extras = Array.from(side.children).slice(1);
    if (!extras.length) return;
    const details = document.createElement("details");
    details.className = "plw-tool-more";
    details.innerHTML = '<summary>Tips, guidance and extra learning options</summary><div class="plw-tool-more-body"></div>';
    const body = details.querySelector(".plw-tool-more-body");
    extras.forEach((card) => body.appendChild(card));
    main.appendChild(details);
  }

  function initToolPage() {
    const detected = detectTool();
    if (!detected) return;
    const [key, config] = detected;
    const main = qs(config.selector);
    const app = qs(config.app, main);
    const side = qs(config.side, main);
    if (!main || !app || main.querySelector(".plw-tool-commandbar")) return;

    document.body.classList.add("plw-tool-page", `plw-tool-${key}`);
    if (key === "calculator") document.body.classList.add("plw-calculator-basic");

    const oldToolbar = qs(".tool-focus-toolbar", main);
    const oldFocus = oldToolbar?.querySelector(".tool-focus-button");
    const oldFullscreen = oldToolbar?.querySelector(".tool-fullscreen-button");

    const commandbar = document.createElement("div");
    commandbar.className = "plw-tool-commandbar";
    commandbar.innerHTML = `
      <div class="plw-tool-identity">
        <span class="plw-tool-icon" aria-hidden="true">${config.icon}</span>
        <div><span class="plw-tool-breadcrumb"><a href="index.html">Digital Tools</a><b aria-hidden="true">›</b>${escapeHtml(config.title)}</span><strong class="plw-tool-title">${escapeHtml(config.title)}</strong></div>
      </div>
      <div class="plw-tool-actions">
        <a class="plw-tool-action" href="index.html" title="Explore more tools">${toolsSvg()}<span>More Tools</span></a>
        <button class="plw-tool-action plw-tool-help" type="button" title="Open help">${helpSvg()}<span>Help</span></button>
        <button class="plw-tool-action plw-tool-action--focus" type="button" aria-pressed="false" title="Focus Mode">${focusSvg()}<span>Focus Mode</span></button>
        <button class="plw-tool-action plw-tool-action--icon plw-tool-fullscreen" type="button" title="Browser full screen" aria-label="Browser full screen">${focusSvg()}</button>
      </div>`;
    main.insertBefore(commandbar, oldToolbar || app);

    const helpModal = buildToolHelp(config);
    const helpButton = commandbar.querySelector(".plw-tool-help");
    helpButton.addEventListener("click", () => helpModal.openFrom(helpButton));

    const focusButton = commandbar.querySelector(".plw-tool-action--focus");
    const focusText = focusButton.querySelector("span");
    const updateFocus = () => {
      const active = document.body.classList.contains("tool-focus-mode");
      focusButton.setAttribute("aria-pressed", String(active));
      focusText.textContent = active ? "Exit Focus" : "Focus Mode";
      focusButton.title = active ? "Exit Focus Mode" : "Focus Mode";
    };
    focusButton.addEventListener("click", () => {
      if (oldFocus) oldFocus.click();
      else {
        document.body.classList.toggle("tool-focus-mode");
        document.documentElement.classList.toggle("tool-focus-mode", document.body.classList.contains("tool-focus-mode"));
      }
      setTimeout(updateFocus, 0);
    });

    const fullscreenButton = commandbar.querySelector(".plw-tool-fullscreen");
    fullscreenButton.addEventListener("click", async () => {
      if (oldFullscreen) { oldFullscreen.click(); return; }
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch (_) { /* unsupported */ }
    });
    document.addEventListener("fullscreenchange", () => {
      fullscreenButton.classList.toggle("is-active", Boolean(document.fullscreenElement));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("tool-focus-mode") && !document.fullscreenElement && !document.body.classList.contains("plw-modal-open")) {
        if (oldFocus) oldFocus.click();
        else {
          document.body.classList.remove("tool-focus-mode");
          document.documentElement.classList.remove("tool-focus-mode");
        }
        setTimeout(updateFocus, 0);
      }
    });

    moveSecondaryCards(main, side);
    recordRecentTool(key, config);

    const startSelectors = key === "typing" ? "#startTypingBtn" : key === "shortcuts" ? "#nextShortcut,#restartShortcuts" : key === "quiz" ? "#nextQuestion,#restartQuiz" : ".calc-btn";
    qsa(startSelectors, main).forEach((button) => button.addEventListener("click", () => document.body.classList.add("plw-tool-session-active"), { once: true }));

    if (key === "calculator") { initCalculatorModes(main); enhanceCalculatorHistory(main); }
    if (key === "shortcuts") { initShortcutKeyboardMode(main); enhanceCompactFeedback(main, "shortcut"); }
    if (key === "quiz") { enhanceQuizResults(main); enhanceCompactFeedback(main, "quiz"); }
    updateFocus();
  }


  function normaliseShortcutText(value) {
    return String(value || "")
      .replace(/Windows/gi, "Meta")
      .replace(/Control/gi, "Ctrl")
      .replace(/\s+/g, "")
      .toLowerCase();
  }

  function shortcutFromEvent(event) {
    const parts = [];
    if (event.ctrlKey) parts.push("Ctrl");
    if (event.altKey) parts.push("Alt");
    if (event.shiftKey) parts.push("Shift");
    if (event.metaKey) parts.push("Meta");
    const modifierKeys = ["Control", "Alt", "Shift", "Meta"];
    if (!modifierKeys.includes(event.key)) {
      const keyMap = { " ": "Space", "Escape": "Esc", "ArrowUp": "↑", "ArrowDown": "↓", "ArrowLeft": "←", "ArrowRight": "→" };
      const key = keyMap[event.key] || (event.key.length === 1 ? event.key.toUpperCase() : event.key);
      parts.push(key);
    }
    return parts.join(" + ");
  }

  function enhanceCompactFeedback(main, type) {
    const feedback = qs(type === "shortcut" ? "#shortcutFeedback" : "#feedbackBox", main);
    if (!feedback) return;
    let processing = false;
    const compact = () => {
      if (processing || feedback.querySelector(".plw-feedback-details") || !feedback.textContent.trim()) return;
      const first = feedback.querySelector(":scope > strong");
      if (!first) return;
      const rest = [];
      let node = first.nextSibling;
      while (node) { const next = node.nextSibling; rest.push(node); node = next; }
      if (!rest.length) return;
      processing = true;
      const details = document.createElement("details");
      details.className = "plw-feedback-details";
      details.innerHTML = `<summary>${type === "shortcut" ? "See shortcut and explanation" : "See explanation"}</summary><div></div>`;
      rest.forEach((item) => details.lastElementChild.appendChild(item));
      feedback.appendChild(details);
      processing = false;
    };
    const observer = new MutationObserver(compact);
    observer.observe(feedback, { childList: true, subtree: false });
    compact();
  }

  function enhanceQuizResults(main) {
    const resultCard = qs("#resultCard", main);
    const answerGrid = qs("#answerGrid", main);
    const restart = qs("#restartQuiz", main);
    const tabs = qs("#categoryTabs", main);
    const resultCircle = qs("#resultCircle", main);
    const resultSummary = qs("#resultSummary", main);
    if (!resultCard || resultCard.querySelector(".plw-quiz-result-actions")) return;
    const mistakes = [];
    const actions = document.createElement("div");
    actions.className = "plw-quiz-result-actions";
    actions.innerHTML = '<button type="button" data-result-action="retry">Try Again</button><button type="button" data-result-action="review">Review Mistakes</button><button type="button" data-result-action="category">Another Category</button>';
    resultCard.appendChild(actions);
    const insights = document.createElement("div");
    insights.className = "plw-result-insights";
    insights.innerHTML = '<span><b>Strength:</b> Keep building your ICT confidence.</span><span><b>Next focus:</b> Complete the quiz to receive guidance.</span>';
    resultCard.insertBefore(insights, actions);
    const updateReadyState = () => {
      const text = (resultSummary?.textContent || "").trim();
      const ready = Boolean(text) && !/final result will appear|answer the questions/i.test(text);
      resultCard.classList.toggle("plw-result-ready", ready);
    };
    if (resultSummary) new MutationObserver(updateReadyState).observe(resultSummary, { childList: true, characterData: true, subtree: true });
    updateReadyState();

    answerGrid?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      setTimeout(() => {
        try {
          const current = state.questions[state.currentIndex];
          if (current && state.selectedAnswer && state.selectedAnswer !== current.answer) {
            mistakes.push({ question: current.question, selected: state.selectedAnswer, answer: current.answer, explanation: current.explanation, category: current.category });
          }
        } catch (_) { /* older quiz build */ }
      }, 0);
    });

    const reviewBody = () => mistakes.length ? `<div class="plw-help-list">${mistakes.map((item, index) => `<div class="plw-help-item"><span>${index + 1}</span><div><strong>${escapeHtml(item.question)}</strong><small>Your answer: ${escapeHtml(item.selected)}<br>Correct answer: ${escapeHtml(item.answer)}<br>${escapeHtml(item.explanation)}</small></div></div>`).join("")}</div>` : '<p>No recorded mistakes yet. Complete a quiz round, then return here to review.</p>';
    let reviewModal = null;
    actions.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      if (button.dataset.resultAction === "retry") restart?.click();
      if (button.dataset.resultAction === "category") tabs?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (button.dataset.resultAction === "review") {
        reviewModal?.remove();
        reviewModal = createModal({ id: "plwQuizReviewModal", title: "Review Your Mistakes", body: reviewBody(), wide: true });
        reviewModal.openFrom(button);
      }
    });

    if (resultCircle) {
      const updateInsights = () => {
        const percent = Number.parseInt(resultCircle.textContent, 10) || 0;
        const strength = percent >= 80 ? "Strong ICT understanding." : percent >= 60 ? "Good foundation with room to grow." : "You started — that is the first win.";
        const categories = [...new Set(mistakes.map((item) => item.category))];
        const focus = categories.length ? `Review ${categories.slice(0,2).join(" and ")}.` : "Complete the quiz and review any missed questions.";
        insights.innerHTML = `<span><b>Strength:</b> ${escapeHtml(strength)}</span><span><b>Next focus:</b> ${escapeHtml(focus)}</span>`;
      };
      new MutationObserver(updateInsights).observe(resultCircle, { childList: true, characterData: true, subtree: true });
      updateInsights();
    }
  }

  function enhanceCalculatorHistory(main) {
    const list = qs("#historyList", main);
    if (!list) return;
    let busy = false;
    const enhance = () => {
      if (busy) return;
      busy = true;
      qsa(".history-item", list).forEach((item) => {
        if (item.parentElement?.classList.contains("plw-history-row")) return;
        const row = document.createElement("div");
        row.className = "plw-history-row";
        item.parentNode.insertBefore(row, item);
        row.appendChild(item);
        const tools = document.createElement("div");
        tools.className = "plw-history-actions";
        tools.innerHTML = '<button type="button" data-history-copy title="Copy result">Copy</button><button type="button" data-history-delete title="Remove from view">×</button>';
        row.appendChild(tools);
        tools.querySelector("[data-history-copy]").addEventListener("click", async () => {
          const value = item.querySelector("strong")?.textContent.trim() || item.textContent.trim();
          try { await navigator.clipboard.writeText(value); } catch (_) { /* clipboard permission */ }
        });
        tools.querySelector("[data-history-delete]").addEventListener("click", () => row.remove());
      });
      busy = false;
    };
    new MutationObserver(enhance).observe(list, { childList: true });
    enhance();
  }

  function initShortcutKeyboardMode(main) {
    const questionCard = qs(".shortcut-question-card", main);
    if (!questionCard || questionCard.querySelector(".plw-shortcut-mode")) return;
    const mode = document.createElement("div");
    mode.className = "plw-shortcut-mode";
    mode.innerHTML = '<span>Answer mode:</span><button type="button" class="is-active" data-mode="choice">Multiple choice</button><button type="button" data-mode="keys">Press real keys</button>';
    questionCard.insertBefore(mode, qs(".shortcut-keyboard-preview", questionCard));
    mode.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
      mode.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button));
      document.body.classList.toggle("plw-shortcut-key-mode", button.dataset.mode === "keys");
      if (button.dataset.mode === "keys") qs("#shortcutQuestion", main)?.focus?.();
    }));
    document.addEventListener("keydown", (event) => {
      if (!document.body.classList.contains("plw-shortcut-key-mode") || event.repeat || event.target.matches("input,textarea,select")) return;
      try {
        if (shortcutState.answered) return;
        const current = shortcutState.questions[shortcutState.currentIndex];
        const pressed = shortcutFromEvent(event);
        if (!pressed || pressed.split("+").length < 2) return;
        event.preventDefault();
        const choice = qsa("#shortcutAnswerGrid button", main).find((button) => normaliseShortcutText(button.textContent) === normaliseShortcutText(pressed));
        if (choice) selectShortcutAnswer(choice, choice.textContent.trim());
        else {
          const feedback = qs("#shortcutFeedback", main);
          feedback.className = "feedback-box wrong";
          feedback.textContent = `You pressed ${pressed}. Try the shortcut shown in the choices.`;
        }
      } catch (_) { /* trainer state unavailable */ }
    });
  }

  function initCalculatorModes(main) {
    const shell = qs(".calculator-shell", main);
    const topbar = qs(".calculator-topbar", shell);
    const screen = qs(".calculator-screen", shell);
    if (!shell || !topbar || shell.querySelector(".plw-calculator-modebar")) return;

    const indicators = document.createElement("div");
    indicators.className = "plw-calc-indicators";
    indicators.innerHTML = '<span id="plwAngleIndicator">DEG</span><span>MEM</span><span id="plwSciIndicator">BASIC</span>';
    screen.insertBefore(indicators, screen.firstChild);

    const modebar = document.createElement("div");
    modebar.className = "plw-calculator-modebar";
    modebar.innerHTML = `
      <span class="plw-calculator-mode-copy">Choose a clean everyday keypad or unlock the full scientific functions.</span>
      <div class="plw-calculator-switch" role="group" aria-label="Calculator mode">
        <button type="button" class="is-active" data-calc-mode="basic">Basic</button>
        <button type="button" data-calc-mode="scientific">✦ Scientific</button>
      </div>`;
    qs(".calculator-tools-row", shell).insertAdjacentElement("afterend", modebar);

    modebar.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
      const scientific = button.dataset.calcMode === "scientific";
      document.body.classList.toggle("plw-calculator-basic", !scientific);
      document.body.classList.toggle("plw-calculator-scientific", scientific);
      modebar.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button));
      qs("#plwSciIndicator").textContent = scientific ? "SCI" : "BASIC";
    }));

    const angle = qs("#angleMode", shell);
    angle?.addEventListener("click", () => { qs("#plwAngleIndicator").textContent = angle.textContent.trim(); });
  }

  function initAssignments() {
    const root = qs("#assignmentsRoot");
    if (!root) return;
    document.body.classList.add("assignments-dashboard-page");

    const waitForCards = () => {
      const cards = qsa(".premium-assignment-card", root);
      if (!cards.length) { requestAnimationFrame(waitForCards); return; }
      enhanceAssignments(root, cards);
    };
    waitForCards();
  }

  function enhanceAssignments(root, cards) {
    if (root.dataset.dashboardReady === "true") return;
    root.dataset.dashboardReady = "true";
    const progress = readJSON(STORAGE.assignment, {});

    const section = root.closest(".premium-assignment-section");
    const dashboard = document.createElement("div");
    dashboard.className = "assignment-dashboard";
    dashboard.innerHTML = `
      <div class="assignment-summary-strip">
        <div class="assignment-summary-intro"><small>Practice Dashboard</small><strong>Choose, practise and keep moving.</strong><span><b data-count="completed">0</b> completed on this device</span></div>
        <div class="assignment-summary-stat"><strong data-count="total">0</strong><span>Total</span></div>
        <div class="assignment-summary-stat"><strong data-count="word">0</strong><span>Word</span></div>
        <div class="assignment-summary-stat"><strong data-count="excel">0</strong><span>Excel</span></div>
        <div class="assignment-summary-stat"><strong data-count="computer-basics">0</strong><span>Computer Basics</span></div>
      </div>
      <div class="assignment-filterbar">
        <div class="assignment-filter-tabs" role="tablist" aria-label="Assignment subjects">
          <button class="assignment-filter-tab is-active" type="button" data-assignment-filter="all">All</button>
          <button class="assignment-filter-tab" type="button" data-assignment-filter="word">Word</button>
          <button class="assignment-filter-tab" type="button" data-assignment-filter="excel">Excel</button>
          <button class="assignment-filter-tab" type="button" data-assignment-filter="computer-basics">Computer Basics</button>
        </div>
        <label class="assignment-search-field"><span aria-hidden="true">⌕</span><input type="search" id="assignmentSearch" placeholder="Search assignments" autocomplete="off"></label>
        <span class="assignment-filter-result" id="assignmentFilterResult"></span>
      </div>`;
    section.insertBefore(dashboard, root);

    const times = ["30–40 min", "20–30 min", "20–30 min"];
    cards.forEach((card, index) => {
      const id = card.id || `assignment-${index + 1}`;
      const series = qs(".premium-assignment-series", card)?.textContent.trim() || "ICT";
      const title = qs("h2", card)?.textContent.trim() || "Practice Assignment";
      const description = Array.from(card.children).find((child) => child.tagName === "P" && !child.classList.contains("premium-assignment-series"))?.textContent.trim() || "";
      const icon = qs(".premium-assignment-icon", card)?.textContent.trim() || "✓";
      const preview = qs(".premium-assignment-preview", card)?.getAttribute("src") || "";
      const actionLinks = qsa(".premium-assignment-actions a", card).map((link) => ({
        href: link.getAttribute("href"), text: link.textContent.trim(), className: link.className,
        target: link.getAttribute("target"), rel: link.getAttribute("rel"), download: link.hasAttribute("download")
      }));
      const subject = /word/i.test(series) ? "word" : /excel/i.test(series) ? "excel" : "computer-basics";
      const sessionMatch = title.match(/Session\s+([\d.]+)/i);
      const session = sessionMatch ? `Session ${sessionMatch[1]}` : "Practice";
      const state = progress[id]?.status || "not-started";

      card.dataset.subject = subject;
      card.dataset.search = `${series} ${title} ${description}`.toLowerCase();
      card.innerHTML = `
        <button class="assignment-card-toggle" type="button" aria-expanded="false" aria-controls="${id}-details">
          <span class="assignment-card-icon" aria-hidden="true">${escapeHtml(icon)}</span>
          <span class="assignment-card-copy"><span class="assignment-card-series">${escapeHtml(series)}</span><span class="assignment-card-title">${escapeHtml(title)}</span><span class="assignment-card-meta"><span>${escapeHtml(session)}</span><span>${times[index] || "20–30 min"}</span></span></span>
          <span class="assignment-expand-arrow" aria-hidden="true">⌄</span>
        </button>
        <div class="assignment-progress-row">
          <div class="assignment-progress-head"><span class="assignment-status-badge" data-status="${state}">${statusText(state)}</span><span class="assignment-saved-mark">✓ Saved on this device</span></div>
          <div class="assignment-progress-track"><span></span></div>
        </div>
        <div class="assignment-card-details" id="${id}-details" hidden>
          <div class="assignment-detail-main">${preview ? `<img src="${escapeHtml(preview)}" alt="Preview for ${escapeHtml(title)}" loading="lazy">` : ""}<p>${escapeHtml(description)}</p></div>
          <div class="assignment-detail-steps"><span>1 · Watch</span><span>2 · Download</span><span>3 · Complete</span><span>4 · Submit</span></div>
          <div class="assignment-card-actions">${actionLinks.map((link, actionIndex) => `<a href="${escapeHtml(link.href || "#")}"${link.target ? ` target="${escapeHtml(link.target)}"` : ""}${link.rel ? ` rel="${escapeHtml(link.rel)}"` : ""}${link.download ? " download" : ""} data-assignment-action="${actionIndex}">${escapeHtml(link.text)}</a>`).join("")}</div>
          <div class="assignment-progress-actions"><button class="assignment-progress-action" type="button" data-set-progress="in-progress">Mark In Progress</button><button class="assignment-progress-action" type="button" data-set-progress="completed">Mark Completed</button></div>
        </div>`;
      applyAssignmentState(card, state);

      const toggle = qs(".assignment-card-toggle", card);
      const details = qs(".assignment-card-details", card);
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        details.hidden = expanded;
        card.classList.toggle("is-expanded", !expanded);
      });
      qsa("[data-set-progress]", card).forEach((button) => button.addEventListener("click", () => saveAssignmentState(card, button.dataset.setProgress)));
      qsa("[data-assignment-action]", card).forEach((link) => link.addEventListener("click", () => {
        const action = Number(link.dataset.assignmentAction);
        saveAssignmentState(card, action >= 2 ? "completed" : "in-progress", false);
      }));
    });

    const filterTabs = qsa("[data-assignment-filter]", dashboard);
    const search = qs("#assignmentSearch", dashboard);
    let activeFilter = "all";
    const applyFilter = () => {
      const term = search.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const matchesFilter = activeFilter === "all" || card.dataset.subject === activeFilter;
        const matchesSearch = !term || card.dataset.search.includes(term);
        card.hidden = !(matchesFilter && matchesSearch);
        if (!card.hidden) visible += 1;
      });
      qs("#assignmentFilterResult", dashboard).textContent = `${visible} assignment${visible === 1 ? "" : "s"} shown`;
      updateAssignmentCounts(cards, dashboard);
    };
    filterTabs.forEach((tab) => tab.addEventListener("click", () => {
      activeFilter = tab.dataset.assignmentFilter;
      filterTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
      applyFilter();
    }));
    search.addEventListener("input", applyFilter);
    applyFilter();

    const requested = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (requested?.classList.contains("premium-assignment-card")) {
      setTimeout(() => {
        qs(".assignment-card-toggle", requested)?.click();
        requested.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 160);
    }
  }

  function statusText(status) {
    return status === "completed" ? "Completed" : status === "in-progress" ? "In Progress" : "Not Started";
  }
  function statusPercent(status) { return status === "completed" ? 100 : status === "in-progress" ? 50 : 0; }
  function applyAssignmentState(card, status) {
    const badge = qs(".assignment-status-badge", card);
    badge.dataset.status = status;
    badge.textContent = statusText(status);
    qs(".assignment-progress-track span", card).style.width = `${statusPercent(status)}%`;
    card.dataset.progressStatus = status;
  }
  function saveAssignmentState(card, status, showToast = true) {
    const progress = readJSON(STORAGE.assignment, {});
    progress[card.id] = { status, updatedAt: Date.now() };
    writeJSON(STORAGE.assignment, progress);
    applyAssignmentState(card, status);
    updateAssignmentCounts(qsa(".premium-assignment-card", qs("#assignmentsRoot")), qs(".assignment-dashboard"));
    if (showToast) showAssignmentToast("Progress saved on this device ✓");
  }
  function updateAssignmentCounts(cards, dashboard) {
    if (!dashboard) return;
    const set = (key, value) => { const el = dashboard.querySelector(`[data-count="${key}"]`); if (el) el.textContent = value; };
    set("total", cards.length);
    set("word", cards.filter((card) => card.dataset.subject === "word").length);
    set("excel", cards.filter((card) => card.dataset.subject === "excel").length);
    set("computer-basics", cards.filter((card) => card.dataset.subject === "computer-basics").length);
    set("completed", cards.filter((card) => card.dataset.progressStatus === "completed").length);
  }
  function showAssignmentToast(message) {
    let toast = qs(".assignment-save-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "assignment-save-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showAssignmentToast.timer);
    showAssignmentToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 1900);
  }

  function initQrHelpModal() {
    const helpBtn = qs("#qrHelpBtn");
    const menu = qs("#qrHelpMenu");
    if (!helpBtn || !menu || qs("#plwQrHelpModal")) return;

    const existingButtons = qsa("[data-help-step]", menu).map((button) => ({
      step: button.dataset.helpStep,
      number: button.querySelector("span")?.textContent.trim() || "•",
      text: button.querySelector("i")?.textContent.trim() || button.textContent.trim()
    }));
    const contact = menu.querySelector("a")?.getAttribute("href") || "../contact.html";
    const body = `<p>Choose a step to jump directly to that part of the QR Builder.</p><div class="plw-help-list">${existingButtons.map((item) => `
      <button class="plw-help-item" type="button" data-qr-help-step="${escapeHtml(item.step)}"><span>${escapeHtml(item.number)}</span><div><strong>${escapeHtml(item.text)}</strong><small>Open this QR Builder step</small></div></button>`).join("")}</div><a class="plw-tool-action" href="${escapeHtml(contact)}" style="width:fit-content;color:#fff;background:linear-gradient(135deg,#176ed6,#0a438e)">Contact Athanas Inspires</a>`;
    const modal = createModal({ id: "plwQrHelpModal", title: "QR Builder Help", body, wide: true });
    helpBtn.setAttribute("aria-controls", modal.id);
    helpBtn.setAttribute("aria-haspopup", "dialog");

    helpBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      helpBtn.setAttribute("aria-expanded", "true");
      modal.openFrom(helpBtn);
    }, true);
    modal.querySelectorAll("[data-qr-help-step]").forEach((button) => button.addEventListener("click", () => {
      const original = menu.querySelector(`[data-help-step="${CSS.escape(button.dataset.qrHelpStep)}"]`);
      modal.closeModal();
      helpBtn.setAttribute("aria-expanded", "false");
      original?.click();
    }));
    const originalClose = modal.closeModal;
    modal.closeModal = () => {
      originalClose();
      helpBtn.setAttribute("aria-expanded", "false");
    };
    modal.querySelector(".plw-modal-backdrop")?.addEventListener("click", () => helpBtn.setAttribute("aria-expanded", "false"));
    modal.querySelector(".plw-modal-close")?.addEventListener("click", () => helpBtn.setAttribute("aria-expanded", "false"));
    modal.addEventListener("keydown", (event) => { if (event.key === "Escape") helpBtn.setAttribute("aria-expanded", "false"); });
    menu.hidden = true;
    menu.setAttribute("aria-hidden", "true");
    menu.remove();
  }

  function initContinuePractising() {
    const library = qs("#digital-tools-library");
    if (!library || qs(".plw-continue-section")) return;
    const recent = readJSON(STORAGE.recentTools, []);
    if (!recent.length) return;
    const item = recent[0];
    const section = document.createElement("section");
    section.className = "plw-continue-section";
    section.setAttribute("aria-label", "Continue practising");
    section.innerHTML = `<div class="plw-continue-card"><span class="plw-continue-icon" aria-hidden="true">${escapeHtml(item.icon || "↻")}</span><div class="plw-continue-copy"><small>Continue Practising</small><strong>${escapeHtml(item.title || "Your recent tool")}</strong><span>${escapeHtml(item.detail || "Return to your latest practice session")}</span></div><a class="plw-continue-action" href="${escapeHtml(item.url || item.path || "index.html")}">Continue <span aria-hidden="true">→</span></a></div>`;
    library.parentNode.insertBefore(section, library);
  }

  function boot() {
    initAssignments();
    initQrHelpModal();
    initToolPage();
    initContinuePractising();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
