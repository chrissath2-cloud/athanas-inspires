(() => {
    "use strict";

    const DATA = window.ATHANAS_ASSISTANT_DATA;
    if (!DATA) return;

    const STORAGE_KEY = "athanasAssistantConversationV1";
    const SEEN_VERSION_KEY = "athanasAssistantSeenVersion";
    const OPEN_SESSION_KEY = "athanasAssistantOpenThisSession";
    const MAX_AGE = 90 * 24 * 60 * 60 * 1000;
    const STOP_WORDS = new Set([
        "a", "an", "and", "are", "as", "at", "be", "been", "but", "by", "can", "could", "do", "does", "for", "from",
        "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "please", "should", "that", "the", "this", "to",
        "what", "when", "where", "which", "why", "will", "with", "would", "you", "your"
    ]);
    const CRITICAL_TERMS = new Set([
        "assignment", "download", "whatsapp", "community", "excel", "word", "password", "email",
        "typing", "shortcut", "printer", "formula", "internet", "file", "folder", "picture", "chart",
        "percentage", "wifi", "keyboard", "mouse", "computer", "table", "powerpoint", "slide", "pdf", "phone",
        "google", "drive", "meet", "zoom", "cloud", "backup", "browser", "security", "printer", "website"
    ]);
    const SPELLING = {
        exel: "excel", excell: "excel", excelent: "excellent", microsft: "microsoft", microsof: "microsoft",
        assigment: "assignment", asignement: "assignment", assignement: "assignment", assingment: "assignment",
        whatsap: "whatsapp", whatsup: "whatsapp", watsapp: "whatsapp", comunity: "community", comunityy: "community",
        knoledge: "knowledge", beginer: "beginner", begginer: "beginner", begginners: "beginners", computor: "computer",
        keybord: "keyboard", foler: "folder", folda: "folder", dowload: "download", downlod: "download", dowmload: "download",
        fomula: "formula", formular: "formula", formulla: "formula", persentage: "percentage", avarage: "average",
        colum: "column", collumn: "column", cloumn: "column", raw: "row", rows: "row", collumns: "column",
        documente: "document", documet: "document", pictue: "picture", picure: "picture", broser: "browser",
        passward: "password", pasword: "password", emial: "email", attachement: "attachment", printe: "printer",
        instaling: "installing", instal: "install", isntall: "install", shorcut: "shortcut", typingg: "typing",
        wrod: "word", msword: "word", powerpint: "powerpoint", powerpiont: "powerpoint", powepoint: "powerpoint",
        powerpointt: "powerpoint", presenation: "presentation", presentaton: "presentation", slied: "slide",
        gogle: "google", googel: "google", youtub: "youtube", yotube: "youtube", internent: "internet",
        adress: "address", recieve: "receive", seperate: "separate", screeshot: "screenshot", laptob: "laptop",
        moblie: "mobile", smarphone: "smartphone", bluetooh: "bluetooth", wirless: "wireless",
        attatchment: "attachment", calender: "calendar", passwrod: "password", secuirty: "security"
    };

    const state = {
        storage: loadStorage(),
        flow: null,
        panelOpen: false,
        returnChoiceHandled: false,
        latestQuestion: "",
        latestTopic: "General support",
        elements: {}
    };

    function emptyStorage() {
        return { version: DATA.version, updatedAt: Date.now(), messages: [], flow: null };
    }

    function loadStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return emptyStorage();
            const parsed = JSON.parse(raw);
            if (!parsed || !Array.isArray(parsed.messages) || Date.now() - Number(parsed.updatedAt || 0) > MAX_AGE) {
                localStorage.removeItem(STORAGE_KEY);
                return emptyStorage();
            }
            parsed.version = DATA.version;
            return { ...emptyStorage(), ...parsed };
        } catch (error) {
            try { localStorage.removeItem(STORAGE_KEY); } catch (storageError) {}
            return emptyStorage();
        }
    }

    function saveStorage() {
        state.storage.updatedAt = Date.now();
        state.storage.version = DATA.version;
        state.storage.flow = state.flow;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.storage));
        } catch (error) {
            // The assistant still works without persistence when browser storage is unavailable.
        }
    }

    function clearStorage() {
        state.storage = emptyStorage();
        state.flow = null;
        try { localStorage.removeItem(STORAGE_KEY); } catch (error) {}
    }

    function normalize(text) {
        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[’‘]/g, "'")
            .replace(/[^a-z0-9+#%$' ]+/g, " ")
            .split(/\s+/)
            .filter(Boolean)
            .map((word) => SPELLING[word] || word)
            .join(" ")
            .trim();
    }

    function stem(word) {
        let result = word;
        if (result.length > 5 && result.endsWith("ing")) result = result.slice(0, -3);
        else if (result.length > 4 && result.endsWith("ed")) result = result.slice(0, -2);
        else if (result.length > 4 && result.endsWith("es")) result = result.slice(0, -2);
        else if (result.length > 3 && result.endsWith("s")) result = result.slice(0, -1);
        return result;
    }

    function tokenize(text, keepStops = false) {
        return normalize(text).split(" ").filter((word) => word && (keepStops || !STOP_WORDS.has(word))).map(stem);
    }

    const GREETING_PHRASES = new Set([
        "hi", "hello", "hey", "hello there", "hi there", "hey there", "greetings", "good morning",
        "good afternoon", "good evening", "morning", "afternoon", "evening", "hello assistant",
        "hi assistant", "hey assistant", "hello athanas", "hi athanas", "good day", "hello sir", "hi sir",
        "good morning sir", "good afternoon sir", "good evening sir", "hello teacher", "hi teacher"
    ]);
    const THANKS_PHRASES = new Set([
        "thanks", "thank you", "thank you very much", "many thanks", "thanks a lot", "much appreciated",
        "i appreciate it", "appreciate it"
    ]);
    const GOODBYE_PHRASES = new Set([
        "bye", "goodbye", "see you", "see you later", "talk later", "have a good day", "good night"
    ]);

    function detectConversationIntent(text) {
        const q = normalize(text);
        if (!q) return null;
        if (GREETING_PHRASES.has(q)) {
            let period = "hello";
            if (q.includes("morning")) period = "morning";
            else if (q.includes("afternoon")) period = "afternoon";
            else if (q.includes("evening")) period = "evening";
            return { type: "greeting", period };
        }
        if (THANKS_PHRASES.has(q) || /^(thanks|thank you)( very much| so much| a lot| athanas| assistant| for your help)*$/.test(q)) return { type: "thanks" };
        if (GOODBYE_PHRASES.has(q)) return { type: "goodbye" };
        if (/^(how are you|how are you doing|how is it going|are you okay|how do you do|what's up|whats up)$/.test(q)) return { type: "wellbeing" };
        if (/^(help|help me|i need help|show options|show menu|main menu|menu|what can you do|what do you do)$/.test(q)) return { type: "help" };
        if (/^(okay|ok|alright|all right|great|nice|good|understood|i understand|got it)$/.test(q)) return { type: "acknowledgement" };

        const prefixes = [
            "good morning", "good afternoon", "good evening", "hello there", "hi there", "hey there",
            "hello assistant", "hi assistant", "hey assistant", "hello athanas", "hi athanas", "hello", "hi", "hey", "greetings"
        ];
        for (const prefix of prefixes) {
            if (q.startsWith(prefix + " ")) {
                const remainder = q.slice(prefix.length).trim();
                if (remainder && !["there", "assistant", "athanas"].includes(remainder)) {
                    return { type: "greeting-question", query: remainder };
                }
            }
        }
        return null;
    }

    function respondToConversationIntent(intent) {
        if (!intent) return false;
        if (intent.type === "greeting") {
            const opening = intent.period === "morning" ? "Good morning" : intent.period === "afternoon" ? "Good afternoon" : intent.period === "evening" ? "Good evening" : "Hello";
            addBotMessage(`${opening} 👋 It’s great to have you here. I’m ready to help you learn or find the right resource.`, { save: true });
            renderQuickActions();
            showComposer();
            return true;
        }
        if (intent.type === "thanks") {
            addBotMessage("You’re very welcome 😊 Keep practising—each clear step builds confidence. Is there anything else I can help you find?", {
                save: true,
                actions: [{ label: "Main Options", command: "main", kind: "primary" }]
            });
            return true;
        }
        if (intent.type === "goodbye") {
            addBotMessage("Goodbye for now 👋 Keep learning, keep practising, and keep moving from confusion to clarity.", { save: true });
            return true;
        }
        if (intent.type === "wellbeing") {
            addBotMessage("I’m ready and happy to help 😊 Tell me what you want to learn, find, or solve today.", { save: true });
            renderQuickActions();
            return true;
        }
        if (intent.type === "help") {
            addBotMessage("I can guide you to lessons, assignments, tools, education resources, inspiration, and support. I can also answer many beginner questions about computers, Word, Excel, PowerPoint, PDFs, phones, email, internet safety, and digital productivity.", { save: true });
            renderQuickActions();
            showComposer();
            return true;
        }
        if (intent.type === "acknowledgement") {
            addBotMessage("Great 👍 What would you like to explore next?", { save: true });
            renderQuickActions();
            return true;
        }
        return false;
    }

    function levenshtein(a, b) {
        if (a === b) return 0;
        if (!a.length) return b.length;
        if (!b.length) return a.length;
        const previous = Array.from({ length: b.length + 1 }, (_, i) => i);
        for (let i = 1; i <= a.length; i += 1) {
            let diagonal = previous[0];
            previous[0] = i;
            for (let j = 1; j <= b.length; j += 1) {
                const old = previous[j];
                previous[j] = Math.min(
                    previous[j] + 1,
                    previous[j - 1] + 1,
                    diagonal + (a[i - 1] === b[j - 1] ? 0 : 1)
                );
                diagonal = old;
            }
        }
        return previous[b.length];
    }

    const preparedKnowledge = DATA.knowledge.map((item) => {
        const aliases = item.aliases || [];
        const keywords = Array.isArray(item.keywords) ? item.keywords.join(" ") : String(item.keywords || "");
        return {
            ...item,
            _title: normalize(item.title),
            _aliases: aliases.map(normalize),
            _titleTokens: tokenize(`${item.title} ${item.topic}`),
            _aliasTokens: tokenize(aliases.join(" ")),
            _keywordTokens: tokenize(keywords),
            _answerTokens: tokenize(`${item.answer} ${item.details || ""}`)
        };
    });

    function scoreEntry(query, entry) {
        const q = normalize(query);
        const qTokens = tokenize(q);
        if (!q || !qTokens.length) return 0;
        let score = 0;

        if (q === entry._title) score += 130;
        if (entry._aliases.includes(q)) score += 115;
        if (entry._title.includes(q) && q.length >= 5) score += 48;
        if (q.includes(entry._title) && entry._title.length >= 8) score += 40;
        entry._aliases.forEach((alias) => {
            if (alias && alias.includes(q) && q.length >= 5) score += 35;
            else if (alias && q.includes(alias) && alias.length >= 5) score += 30;
        });

        const titleSet = new Set(entry._titleTokens);
        const aliasSet = new Set(entry._aliasTokens);
        const keywordSet = new Set(entry._keywordTokens);
        const answerSet = new Set(entry._answerTokens);
        const strongEntryTokens = new Set([...titleSet, ...aliasSet, ...keywordSet]);

        qTokens.forEach((token) => {
            if (CRITICAL_TERMS.has(token)) {
                score += strongEntryTokens.has(token) ? 13 : -16;
            }
            if (titleSet.has(token)) score += 9;
            if (aliasSet.has(token)) score += 7;
            if (keywordSet.has(token)) score += 4;
            if (answerSet.has(token)) score += 1;

            if (!titleSet.has(token) && token.length >= 4) {
                const near = entry._titleTokens.some((candidate) => {
                    if (Math.abs(candidate.length - token.length) > 2) return false;
                    const limit = token.length >= 7 ? 2 : 1;
                    return levenshtein(token, candidate) <= limit;
                });
                if (near) score += 3;
            }
        });

        const matchedTitle = qTokens.filter((token) => titleSet.has(token)).length;
        if (matchedTitle >= 2) score += matchedTitle * 3;
        if (matchedTitle === qTokens.length && qTokens.length > 1) score += 12;
        return score;
    }

    function findMatches(query, limit = 3) {
        return preparedKnowledge
            .map((entry) => ({ entry, score: scoreEntry(query, entry) }))
            .filter((result) => result.score > 0)
            .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
            .slice(0, limit);
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (typeof text === "string") element.textContent = text;
        return element;
    }

    function injectNavbarButton() {
        const navLinks = document.querySelector(".nav-links");
        if (!navLinks || navLinks.querySelector(".nav-ai-assistant-btn")) return;
        const item = createElement("li", "nav-ai-item");
        const button = createElement("button", "nav-ai-assistant-btn");
        button.type = "button";
        button.setAttribute("aria-haspopup", "dialog");
        button.setAttribute("aria-controls", "athanas-ai-assistant-panel");
        button.innerHTML = `
            <span class="nav-ai-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-6 6v1.2A3.5 3.5 0 0 0 4 13.4V17a2 2 0 0 0 2 2h2l1.6 2h4.8L16 19h2a2 2 0 0 0 2-2v-3.6a3.5 3.5 0 0 0-2-3.2V9a6 6 0 0 0-6-6Z"/><path d="M9 12h.01M15 12h.01M9.5 16h5"/></svg>
            </span>
            <span>AI Assistant</span>
            <span class="nav-ai-update-dot" aria-hidden="true"></span>`;
        button.addEventListener("click", () => {
            const menuToggle = document.getElementById("menu-toggle");
            if (menuToggle) menuToggle.checked = false;
            document.body.classList.remove("mobile-nav-open");
            openPanel();
        });
        item.appendChild(button);
        navLinks.appendChild(item);
        state.elements.navButton = button;
    }

    function injectAssistant() {
        const shell = createElement("div", "ai-assistant-shell");
        shell.innerHTML = `
            <button class="ai-floating-button" type="button" aria-label="Open Athanas Inspires AI Assistant" aria-controls="athanas-ai-assistant-panel">
                <span class="ai-floating-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-6 6v1.2A3.5 3.5 0 0 0 4 13.4V17a2 2 0 0 0 2 2h2l1.6 2h4.8L16 19h2a2 2 0 0 0 2-2v-3.6a3.5 3.5 0 0 0-2-3.2V9a6 6 0 0 0-6-6Z"/><path d="M9 12h.01M15 12h.01M9.5 16h5"/></svg>
                </span>
                <span class="ai-floating-label">AI Assistant</span>
                <span class="ai-update-dot" aria-hidden="true"></span>
            </button>
            <div class="ai-assistant-overlay" aria-hidden="true">
                <button class="ai-overlay-dismiss" type="button" aria-label="Close AI Assistant"></button>
                <aside class="ai-assistant-panel" id="athanas-ai-assistant-panel" role="dialog" aria-modal="true" aria-labelledby="aiAssistantTitle" tabindex="-1">
                    <header class="ai-assistant-header">
                        <div class="ai-header-brand">
                            <div class="ai-header-logo"><img src="assets/images/logo.png" alt=""></div>
                            <div>
                                <h2 id="aiAssistantTitle">${DATA.name}</h2>
                                <p><span class="ai-status-dot" aria-hidden="true"></span>${DATA.status}</p>
                            </div>
                        </div>
                        <div class="ai-header-controls">
                            <button type="button" data-ai-new title="Start a new conversation" aria-label="Start a new conversation"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 0-2.05 4.95"/></svg></button>
                            <button type="button" data-ai-clear title="Clear saved conversation" aria-label="Clear saved conversation"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg></button>
                            <button type="button" data-ai-close title="Close assistant" aria-label="Close assistant"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
                        </div>
                    </header>
                    <div class="ai-assistant-body">
                        <div class="ai-messages" role="log" aria-live="polite" aria-relevant="additions"></div>
                        <div class="ai-live-suggestions" hidden></div>
                    </div>
                    <div class="ai-composer is-hidden">
                        <div class="ai-example-questions"></div>
                        <form class="ai-input-form">
                            <button class="ai-menu-button" type="button" aria-label="Show main options" title="Main options">☰</button>
                            <label class="sr-only" for="aiAssistantInput">Ask the AI Assistant</label>
                            <textarea id="aiAssistantInput" rows="1" maxlength="400" placeholder="Type your question..."></textarea>
                            <button class="ai-send-button" type="submit" aria-label="Send question">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 17 8-17 8 3-8-3-8Z"/><path d="M7 12h14"/></svg>
                            </button>
                        </form>
                    </div>
                    <footer class="ai-assistant-footer">
                        <p><span aria-hidden="true">🔒</span> ${DATA.privacy}</p>
                    </footer>
                </aside>
            </div>`;
        document.body.appendChild(shell);

        state.elements.shell = shell;
        state.elements.floating = shell.querySelector(".ai-floating-button");
        state.elements.overlay = shell.querySelector(".ai-assistant-overlay");
        state.elements.panel = shell.querySelector(".ai-assistant-panel");
        state.elements.messages = shell.querySelector(".ai-messages");
        state.elements.suggestions = shell.querySelector(".ai-live-suggestions");
        state.elements.composer = shell.querySelector(".ai-composer");
        state.elements.form = shell.querySelector(".ai-input-form");
        state.elements.input = shell.querySelector("#aiAssistantInput");
        state.elements.examples = shell.querySelector(".ai-example-questions");

        state.elements.floating.addEventListener("click", openPanel);
        shell.querySelector(".ai-overlay-dismiss").addEventListener("click", closePanel);
        shell.querySelector("[data-ai-close]").addEventListener("click", closePanel);
        shell.querySelector("[data-ai-new]").addEventListener("click", startNewConversation);
        shell.querySelector("[data-ai-clear]").addEventListener("click", askToClearConversation);
        shell.querySelector(".ai-menu-button").addEventListener("click", showMainOptions);
        state.elements.form.addEventListener("submit", (event) => {
            event.preventDefault();
            const query = state.elements.input.value.trim();
            if (!query) return;
            state.elements.input.value = "";
            autoResizeInput();
            hideSuggestions();
            handleFreeQuestion(query);
        });
        state.elements.input.addEventListener("input", () => {
            autoResizeInput();
            updateLiveSuggestions();
        });
        state.elements.input.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                state.elements.form.requestSubmit();
            }
        });

        DATA.examples.forEach((question) => {
            const button = createElement("button", "ai-example-chip", question);
            button.type = "button";
            button.addEventListener("click", () => handleFreeQuestion(question));
            state.elements.examples.appendChild(button);
        });

        const menuToggle = document.getElementById("menu-toggle");
        if (menuToggle) {
            const syncMobileMenu = () => document.body.classList.toggle("mobile-nav-open", menuToggle.checked);
            menuToggle.addEventListener("change", syncMobileMenu);
            syncMobileMenu();
        }

        document.addEventListener("keydown", (event) => {
            if (!state.panelOpen) return;
            if (event.key === "Escape") {
                event.preventDefault();
                closePanel();
            } else if (event.key === "Tab") {
                trapFocus(event);
            }
        });

        window.setTimeout(() => state.elements.floating.classList.add("is-compact"), 5200);
        updateVersionBadge();
    }

    function trapFocus(event) {
        const focusable = Array.from(state.elements.panel.querySelectorAll('button:not([disabled]), a[href], textarea, [tabindex]:not([tabindex="-1"])'))
            .filter((item) => item.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function updateVersionBadge() {
        let seen = "";
        try { seen = localStorage.getItem(SEEN_VERSION_KEY) || ""; } catch (error) {}
        const show = seen !== DATA.version;
        state.elements.floating?.classList.toggle("has-update", show);
        state.elements.navButton?.classList.toggle("has-update", show);
    }

    function markVersionSeen() {
        try { localStorage.setItem(SEEN_VERSION_KEY, DATA.version); } catch (error) {}
        updateVersionBadge();
    }

    function openPanel() {
        if (!state.elements.panel) return;
        state.panelOpen = true;
        state.elements.overlay.classList.add("is-open");
        state.elements.overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("ai-assistant-open");
        state.elements.floating.setAttribute("aria-expanded", "true");
        try { sessionStorage.setItem(OPEN_SESSION_KEY, "1"); } catch (error) {}
        markVersionSeen();

        if (!state.returnChoiceHandled) prepareOpeningView();
        window.setTimeout(() => state.elements.panel.focus(), 80);
        scrollToBottom();
    }

    function closePanel() {
        state.panelOpen = false;
        state.elements.overlay.classList.remove("is-open");
        state.elements.overlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("ai-assistant-open");
        state.elements.floating.setAttribute("aria-expanded", "false");
        try { sessionStorage.removeItem(OPEN_SESSION_KEY); } catch (error) {}
        state.elements.floating.focus({ preventScroll: true });
    }

    function prepareOpeningView() {
        state.returnChoiceHandled = true;
        const hasHistory = state.storage.messages.length > 0;
        clearMessagesView();
        if (hasHistory) {
            addBotMessage("Welcome back 👋 Would you like to continue your previous conversation or start a new one?", {
                save: false,
                choices: [
                    { label: "Continue Conversation", value: "continue-history", icon: "↩" },
                    { label: "Start New Conversation", value: "start-new", icon: "✨" }
                ]
            });
        } else {
            initializeConversation();
        }
    }

    function initializeConversation() {
        clearMessagesView();
        state.flow = null;
        state.storage.messages = [];
        addBotMessage(DATA.greeting, { save: true });
        renderQuickActions();
        saveStorage();
    }

    function startNewConversation() {
        clearStorage();
        state.returnChoiceHandled = true;
        hideComposer();
        initializeConversation();
    }

    function askToClearConversation() {
        addBotMessage("Clear this saved conversation from this browser?", {
            save: false,
            choices: [
                { label: "Yes, Clear It", value: "confirm-clear", icon: "✓" },
                { label: "Keep Conversation", value: "cancel-clear", icon: "←" }
            ]
        });
    }

    function continueConversation() {
        clearMessagesView();
        state.storage.messages.forEach((message) => renderStoredMessage(message));
        state.flow = state.storage.flow || null;
        if (state.flow) restoreFlowChoices();
        else renderCompactMainButton();
        scrollToBottom();
    }

    function clearMessagesView() {
        state.elements.messages.innerHTML = "";
        hideSuggestions();
    }

    function avatar(role) {
        const wrapper = createElement("span", `ai-message-avatar ${role}`);
        if (role === "assistant") {
            wrapper.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0-6 6v1.2A3.5 3.5 0 0 0 4 13.4V17a2 2 0 0 0 2 2h2l1.6 2h4.8L16 19h2a2 2 0 0 0 2-2v-3.6a3.5 3.5 0 0 0-2-3.2V9a6 6 0 0 0-6-6Z"/><path d="M9 12h.01M15 12h.01M9.5 16h5"/></svg>';
        } else {
            wrapper.textContent = "You";
        }
        return wrapper;
    }

    function addMessage(role, text, options = {}) {
        const record = {
            role,
            text: String(text || ""),
            details: options.details || "",
            actions: (options.actions || []).filter((a) => a && (a.url || a.command))
        };
        renderStoredMessage(record, options.choices || []);
        if (options.save !== false) {
            state.storage.messages.push(record);
            if (state.storage.messages.length > 80) state.storage.messages = state.storage.messages.slice(-80);
            saveStorage();
        }
        return record;
    }

    function addBotMessage(text, options = {}) {
        return addMessage("assistant", text, options);
    }

    function addUserMessage(text, options = {}) {
        return addMessage("user", text, options);
    }

    function renderStoredMessage(record, choices = []) {
        const row = createElement("div", `ai-message-row ${record.role}`);
        if (record.role === "assistant") row.appendChild(avatar("assistant"));
        const content = createElement("div", "ai-message-content");
        const bubble = createElement("div", "ai-message-bubble");
        if (record.role === "assistant") {
            const author = createElement("span", "ai-message-author", "Athanas AI");
            author.setAttribute("aria-hidden", "true");
            bubble.appendChild(author);
        }
        const paragraph = createElement("p", "", record.text);
        bubble.appendChild(paragraph);

        if (record.details) {
            const details = createElement("div", "ai-message-details");
            details.hidden = true;
            details.appendChild(createElement("p", "", record.details));
            const toggle = createElement("button", "ai-learn-more", "Learn More ↓");
            toggle.type = "button";
            toggle.setAttribute("aria-expanded", "false");
            toggle.addEventListener("click", () => {
                details.hidden = !details.hidden;
                toggle.textContent = details.hidden ? "Learn More ↓" : "Show Less ↑";
                toggle.setAttribute("aria-expanded", String(!details.hidden));
                scrollToBottom();
            });
            bubble.appendChild(toggle);
            bubble.appendChild(details);
        }

        if (record.actions && record.actions.length) {
            bubble.appendChild(renderActions(record.actions));
        }
        content.appendChild(bubble);
        if (choices.length) content.appendChild(renderChoices(choices));
        row.appendChild(content);
        if (record.role === "user") row.appendChild(avatar("user"));
        state.elements.messages.appendChild(row);
        scrollToBottom();
    }

    function renderActions(actions) {
        const wrap = createElement("div", "ai-message-actions");
        actions.forEach((item) => {
            if (item.url) {
                const link = createElement("a", `ai-action-link ${item.kind === "primary" ? "primary" : ""}`, item.label);
                link.href = item.url;
                if (/^https?:/i.test(item.url)) {
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                }
                wrap.appendChild(link);
            } else if (item.command) {
                const button = createElement("button", `ai-action-link ${item.kind === "primary" ? "primary" : ""}`, item.label);
                button.type = "button";
                button.addEventListener("click", () => executeCommand(item.command, item.payload));
                wrap.appendChild(button);
            }
        });
        return wrap;
    }

    function renderChoices(choices) {
        const wrap = createElement("div", "ai-choice-grid");
        choices.forEach((choice) => {
            const button = createElement("button", "ai-choice-button");
            button.type = "button";
            button.dataset.choice = choice.value;
            if (choice.icon) button.appendChild(createElement("span", "ai-choice-icon", choice.icon));
            button.appendChild(createElement("span", "", choice.label));
            button.addEventListener("click", () => handleChoice(choice.value, choice));
            wrap.appendChild(button);
        });
        return wrap;
    }

    function renderQuickActions() {
        const choices = DATA.quickActions.map((item) => ({ label: item.label, value: `quick:${item.id}`, icon: item.icon }));
        const wrap = renderChoices(choices);
        wrap.classList.add("ai-main-actions");
        state.elements.messages.appendChild(wrap);
        scrollToBottom();
    }

    function renderCompactMainButton() {
        const wrap = createElement("div", "ai-inline-menu-wrap");
        const button = createElement("button", "ai-inline-menu-button", "Show Main Options");
        button.type = "button";
        button.addEventListener("click", showMainOptions);
        wrap.appendChild(button);
        state.elements.messages.appendChild(wrap);
    }

    function showMainOptions() {
        hideComposer();
        state.flow = null;
        saveStorage();
        addBotMessage("What would you like help with?", { save: true });
        renderQuickActions();
    }

    function showComposer() {
        state.elements.composer.classList.remove("is-hidden");
        window.setTimeout(() => state.elements.input.focus(), 50);
        scrollToBottom();
    }

    function hideComposer() {
        state.elements.composer.classList.add("is-hidden");
        state.elements.input.value = "";
        hideSuggestions();
    }

    function autoResizeInput() {
        const input = state.elements.input;
        input.style.height = "auto";
        input.style.height = `${Math.min(input.scrollHeight, 112)}px`;
    }

    function updateLiveSuggestions() {
        const value = state.elements.input.value.trim();
        if (normalize(value).length < 2) {
            hideSuggestions();
            return;
        }
        const matches = findMatches(value, 3).filter((match) => match.score >= 7);
        if (!matches.length) {
            hideSuggestions();
            return;
        }
        const box = state.elements.suggestions;
        box.innerHTML = "";
        box.appendChild(createElement("p", "ai-suggestions-label", "Suggested questions"));
        matches.forEach(({ entry }) => {
            const button = createElement("button", "ai-suggestion-button", entry.title);
            button.type = "button";
            button.addEventListener("click", () => {
                state.elements.input.value = "";
                hideSuggestions();
                handleFreeQuestion(entry.title);
            });
            box.appendChild(button);
        });
        box.hidden = false;
    }

    function hideSuggestions() {
        if (!state.elements.suggestions) return;
        state.elements.suggestions.hidden = true;
        state.elements.suggestions.innerHTML = "";
    }

    function scrollToBottom() {
        window.requestAnimationFrame(() => {
            const box = state.elements.messages;
            if (box) box.scrollTop = box.scrollHeight;
        });
    }

    function handleChoice(value, choice) {
        if (value === "continue-history") {
            continueConversation();
            return;
        }
        if (value === "start-new") {
            startNewConversation();
            return;
        }
        if (value === "confirm-clear") {
            clearStorage();
            initializeConversation();
            return;
        }
        if (value === "cancel-clear") {
            addBotMessage("Your saved conversation has been kept.", { save: false });
            return;
        }
        if (value.startsWith("quick:")) {
            addUserMessage(choice.label);
            handleQuickAction(value.split(":")[1]);
            return;
        }
        if (value.startsWith("learning:")) {
            handleLearningChoice(value.split(":")[1], choice.label);
            return;
        }
        if (value.startsWith("assignment-course:")) {
            handleAssignmentCourse(value.split(":")[1], choice.label);
            return;
        }
        if (value.startsWith("assignment-item:")) {
            handleAssignmentItem(value.split(":")[1], choice.label);
            return;
        }
        if (value.startsWith("tool:")) {
            handleToolChoice(value.split(":")[1], choice.label);
            return;
        }
        if (value.startsWith("knowledge:")) {
            const id = value.split(":")[1];
            const found = preparedKnowledge.find((item) => item.id === id);
            if (found) answerKnowledge(found);
            return;
        }
        if (value === "none-of-these" || value === "rephrase") {
            addBotMessage("No problem. Try a shorter question, or choose one of the examples below.", { save: true });
            showComposer();
            return;
        }
    }

    function handleQuickAction(id) {
        hideComposer();
        switch (id) {
            case "start-learning": startLearningFlow(); break;
            case "find-assignments": startAssignmentFlow(); break;
            case "learning-tools": startToolsFlow(); break;
            case "education": showEducationResources(); break;
            case "faith": showFaithContent(); break;
            case "community": showCommunity(); break;
            case "ask":
                state.flow = null;
                saveStorage();
                addBotMessage("Type your question below. I’ll search my approved website and beginner ICT knowledge, then guide you carefully.", { save: true });
                showComposer();
                break;
            default: showMainOptions();
        }
    }

    function setFlow(flow, step, values = {}) {
        state.flow = { flow, step, values };
        saveStorage();
    }

    function startLearningFlow() {
        setFlow("learning", "experience", {});
        addBotMessage("First, how much computer experience do you have?", {
            choices: [
                { label: "I have never used a computer", value: "learning:experience-never", icon: "🌱" },
                { label: "I have used one a little", value: "learning:experience-little", icon: "🙂" },
                { label: "I use computers regularly", value: "learning:experience-regular", icon: "💻" }
            ]
        });
    }

    function handleLearningChoice(value, label) {
        addUserMessage(label);
        const flow = state.flow || { values: {} };
        if (value.startsWith("experience-")) {
            flow.values.experience = value.replace("experience-", "");
            setFlow("learning", "area", flow.values);
            addBotMessage("What would you like to learn first?", {
                choices: [
                    { label: "Computer Basics", value: "learning:area-computer", icon: "🖥️" },
                    { label: "Microsoft Word", value: "learning:area-word", icon: "📄" },
                    { label: "Microsoft Excel", value: "learning:area-excel", icon: "📊" },
                    { label: "I’m not sure", value: "learning:area-unsure", icon: "✨" }
                ]
            });
        } else if (value.startsWith("area-")) {
            flow.values.area = value.replace("area-", "");
            setFlow("learning", "preference", flow.values);
            addBotMessage("How would you prefer to begin?", {
                choices: [
                    { label: "Watch a lesson", value: "learning:preference-lesson", icon: "▶️" },
                    { label: "Try a practice activity", value: "learning:preference-practice", icon: "📝" },
                    { label: "See the recommended path", value: "learning:preference-path", icon: "🧭" }
                ]
            });
        } else if (value.startsWith("preference-")) {
            flow.values.preference = value.replace("preference-", "");
            finishLearningRecommendation(flow.values);
        }
    }

    function finishLearningRecommendation(values) {
        let area = values.area;
        if (area === "unsure") area = values.experience === "regular" ? "word" : "computer";
        const lesson = DATA.lessons[area][0];
        const names = { computer: "Computer Basics Session 0.1", word: "Microsoft Word Session 1", excel: "Microsoft Excel Session 1" };
        let text = `I recommend starting with ${names[area]}. It gives you the foundation for the lessons that follow.`;
        if (values.preference === "practice") {
            text += " Watch the lesson first, repeat the steps on your computer, and then use the available assignments or learning tools for practice.";
        } else if (values.preference === "path") {
            text += " Follow the sessions in order, practise after each lesson, and move forward only when the main steps feel familiar.";
        }
        text += " You can learn this one clear step at a time.";
        state.latestTopic = names[area];
        state.flow = null;
        saveStorage();
        addBotMessage(text, {
            actions: [
                { label: "Watch Recommended Lesson", url: lesson.url, kind: "primary" },
                { label: "View Full Learning Path", url: "courses.html" },
                { label: "Main Options", command: "main" }
            ]
        });
    }

    function startAssignmentFlow() {
        setFlow("assignments", "course", {});
        addBotMessage("Which course assignment are you looking for?", {
            choices: [
                { label: "Computer Basics", value: "assignment-course:computer", icon: "🖥️" },
                { label: "Microsoft Word", value: "assignment-course:word", icon: "📄" },
                { label: "Microsoft Excel", value: "assignment-course:excel", icon: "📊" }
            ]
        });
    }

    function handleAssignmentCourse(course, label) {
        addUserMessage(label);
        const items = DATA.assignments[course] || [];
        if (!items.length) {
            state.flow = null;
            saveStorage();
            addBotMessage("Computer Basics does not currently have a downloadable assignment. Repeat the lesson steps on your computer, or use the General ICT Quiz Game for extra practice.", {
                actions: [
                    { label: "Open ICT Quiz", url: "quiz.html", kind: "primary" },
                    { label: "Browse All Assignments", url: "assignments.html" },
                    { label: "Main Options", command: "main" }
                ]
            });
            return;
        }
        setFlow("assignments", "item", { course });
        addBotMessage(`Which ${label} session do you need?`, {
            choices: items.map((item) => ({
                label: `${label} Session ${item.session}`,
                value: `assignment-item:${course}|${item.session}`,
                icon: "📝"
            }))
        });
    }

    function handleAssignmentItem(value, label) {
        addUserMessage(label);
        const [course, session] = value.split("|");
        const item = (DATA.assignments[course] || []).find((assignment) => assignment.session === session);
        if (!item) return;
        state.latestTopic = `${course} Session ${session} assignment`;
        state.flow = null;
        saveStorage();
        addBotMessage(`${item.title} is available. Watch the related lesson first, complete your own work carefully, then submit it through the official WhatsApp button when ready.`, {
            actions: [
                { label: "Download Assignment", url: item.download, kind: "primary" },
                { label: "View Instructions", url: item.page },
                { label: "Submit on WhatsApp", url: item.submit },
                { label: "Main Options", command: "main" }
            ]
        });
    }

    function startToolsFlow() {
        setFlow("tools", "need", {});
        addBotMessage("What would you like to practise?", {
            choices: [
                { label: "Typing speed and accuracy", value: "tool:typing", icon: "⌨️" },
                { label: "Keyboard shortcuts", value: "tool:shortcuts", icon: "⚡" },
                { label: "ICT knowledge", value: "tool:quiz", icon: "🎮" },
                { label: "Mathematical calculations", value: "tool:calculator", icon: "🧮" },
                { label: "I’m not sure", value: "tool:unsure", icon: "✨" }
            ]
        });
    }

    function handleToolChoice(id, label) {
        addUserMessage(label);
        if (id === "unsure") {
            state.flow = null;
            saveStorage();
            const summary = DATA.tools.map((tool) => `${tool.label}: ${tool.need}.`).join(" ");
            addBotMessage(`Here is a quick guide. ${summary}`, {
                actions: [
                    { label: "View All Learning Tools", url: "tools.html", kind: "primary" },
                    { label: "Choose Again", command: "tools" },
                    { label: "Main Options", command: "main" }
                ]
            });
            return;
        }
        const tool = DATA.tools.find((item) => item.id === id);
        if (!tool) return;
        state.latestTopic = tool.label;
        state.flow = null;
        saveStorage();
        addBotMessage(`${tool.label} is the best match. ${tool.description}`, {
            actions: [
                { label: "Open Recommended Tool", url: tool.url, kind: "primary" },
                { label: "View All Learning Tools", url: "tools.html" },
                { label: "Main Options", command: "main" }
            ]
        });
    }

    function showEducationResources() {
        state.flow = null;
        state.latestTopic = "Education Resources";
        saveStorage();
        addBotMessage("Here are the education resources currently available for the Tanzanian education system.", {
            actions: [
                { label: "Open Education Resources", url: "education.html", kind: "primary" },
                { label: "Main Options", command: "main" }
            ]
        });
    }

    function showFaithContent() {
        state.flow = null;
        state.latestTopic = "Faith & Inspiration";
        saveStorage();
        addBotMessage(`Here is something to encourage you today: ${DATA.featuredFaith.quote}`, {
            details: `Featured article: ${DATA.featuredFaith.title}. The Faith & Inspiration section is rooted in Christian faith and offers practical encouragement for growth, hope, perseverance, and purpose.`,
            actions: [
                { label: "Read the Full Article", url: DATA.featuredFaith.url, kind: "primary" },
                { label: "Explore Faith & Inspiration", url: DATA.featuredFaith.page },
                { label: "Main Options", command: "main" }
            ]
        });
    }

    function showCommunity() {
        state.flow = null;
        state.latestTopic = "WhatsApp ICT Community";
        saveStorage();
        addBotMessage("The Athanas Inspires ICT Community is a supportive space for learners building practical digital skills. Members receive lesson updates, assignment reminders, encouragement, support, and opportunities to share progress. After joining, introduce yourself with your name, country, and the ICT skill you want to learn. Please keep discussions respectful and focused on learning.", {
            actions: [
                { label: "Join WhatsApp ICT Community", url: DATA.whatsappCommunity, kind: "primary" },
                { label: "Learn More", url: "faq.html#faq-28" },
                { label: "Main Options", command: "main" }
            ]
        });
    }

    function executeCommand(command, payload) {
        if (command === "main") showMainOptions();
        else if (command === "ask") showComposer();
        else if (command === "tools") startToolsFlow();
        else if (command === "whatsapp") openWhatsApp(payload);
        else if (command === "rephrase") {
            addBotMessage("Try using fewer words and mention the main topic, such as Excel, Word, assignments, downloads, or passwords.", { save: true });
            showComposer();
        }
    }

    function restoreFlowChoices() {
        const flow = state.flow;
        if (!flow) return;
        if (flow.flow === "learning") {
            const map = {
                experience: [
                    { label: "I have never used a computer", value: "learning:experience-never", icon: "🌱" },
                    { label: "I have used one a little", value: "learning:experience-little", icon: "🙂" },
                    { label: "I use computers regularly", value: "learning:experience-regular", icon: "💻" }
                ],
                area: [
                    { label: "Computer Basics", value: "learning:area-computer", icon: "🖥️" },
                    { label: "Microsoft Word", value: "learning:area-word", icon: "📄" },
                    { label: "Microsoft Excel", value: "learning:area-excel", icon: "📊" },
                    { label: "I’m not sure", value: "learning:area-unsure", icon: "✨" }
                ],
                preference: [
                    { label: "Watch a lesson", value: "learning:preference-lesson", icon: "▶️" },
                    { label: "Try a practice activity", value: "learning:preference-practice", icon: "📝" },
                    { label: "See the recommended path", value: "learning:preference-path", icon: "🧭" }
                ]
            };
            state.elements.messages.appendChild(renderChoices(map[flow.step] || []));
        } else if (flow.flow === "assignments") {
            if (flow.step === "course") {
                state.elements.messages.appendChild(renderChoices([
                    { label: "Computer Basics", value: "assignment-course:computer", icon: "🖥️" },
                    { label: "Microsoft Word", value: "assignment-course:word", icon: "📄" },
                    { label: "Microsoft Excel", value: "assignment-course:excel", icon: "📊" }
                ]));
            } else if (flow.step === "item") {
                const course = flow.values.course;
                const courseLabel = { word: "Microsoft Word", excel: "Microsoft Excel" }[course] || course;
                state.elements.messages.appendChild(renderChoices((DATA.assignments[course] || []).map((item) => ({
                    label: `${courseLabel} Session ${item.session}`,
                    value: `assignment-item:${course}|${item.session}`,
                    icon: "📝"
                }))));
            }
        } else if (flow.flow === "tools") {
            state.elements.messages.appendChild(renderChoices([
                { label: "Typing speed and accuracy", value: "tool:typing", icon: "⌨️" },
                { label: "Keyboard shortcuts", value: "tool:shortcuts", icon: "⚡" },
                { label: "ICT knowledge", value: "tool:quiz", icon: "🎮" },
                { label: "Mathematical calculations", value: "tool:calculator", icon: "🧮" },
                { label: "I’m not sure", value: "tool:unsure", icon: "✨" }
            ]));
        }
    }

    function handleFreeQuestion(query) {
        const cleanQuery = query.trim();
        if (!cleanQuery) return;
        showComposer();
        addUserMessage(cleanQuery);
        state.latestQuestion = cleanQuery;

        const intent = detectConversationIntent(cleanQuery);
        if (intent && intent.type !== "greeting-question" && respondToConversationIntent(intent)) return;
        if (intent?.type === "greeting-question") {
            const nestedIntent = detectConversationIntent(intent.query);
            if (nestedIntent && nestedIntent.type !== "greeting-question" && respondToConversationIntent(nestedIntent)) return;
        }
        const searchableQuery = intent?.type === "greeting-question" ? intent.query : cleanQuery;
        const matches = findMatches(searchableQuery, 3);
        const best = matches[0];
        const second = matches[1];

        if (best && (best.score >= 28 || (best.score >= 21 && (!second || best.score - second.score >= 9)))) {
            answerKnowledge(best.entry);
            return;
        }

        if (best && best.score >= 13) {
            state.latestTopic = best.entry.topic;
            const choices = matches.map(({ entry }, index) => ({
                label: index === 0 ? `Best match: ${entry.title}` : entry.title,
                value: `knowledge:${entry.id}`,
                icon: index === 0 ? "✨" : "•"
            }));
            choices.push({ label: "None of These", value: "none-of-these", icon: "↩" });
            addBotMessage("I found a few possible meanings. The best match appears first—choose the one you intended.", { choices });
            return;
        }

        showFallback(searchableQuery);
    }

    function answerKnowledge(entry) {
        state.latestTopic = entry.topic || "General support";
        const actions = [...(entry.actions || [])];
        if (!actions.some((item) => item.command === "main")) actions.push({ label: "Main Options", command: "main" });
        addBotMessage(entry.answer, {
            details: entry.details || "",
            actions
        });
    }

    function showFallback(query) {
        state.latestTopic = inferTopic(query);
        const whatsappUrl = buildWhatsAppUrl(query, state.latestTopic);
        addBotMessage("I’m sorry—I couldn’t find a confident answer to that question. Try a shorter question, explore the Frequently Asked Questions, or ask Athanas Inspires on WhatsApp. When I’m unsure, I guide rather than guess.", {
            actions: [
                { label: "Try Another Question", command: "rephrase", kind: "primary" },
                { label: "Open FAQ", url: "faq.html" },
                { label: "Ask on WhatsApp", url: whatsappUrl }
            ]
        });
    }

    function inferTopic(query) {
        const q = normalize(query);
        if (q.includes("excel")) return "Microsoft Excel";
        if (q.includes("word")) return "Microsoft Word";
        if (q.includes("powerpoint") || q.includes("slide") || q.includes("presentation")) return "Microsoft PowerPoint";
        if (q.includes("pdf") || q.includes("print")) return "PDF & Printing";
        if (q.includes("phone") || q.includes("smartphone") || q.includes("mobile")) return "Smartphones";
        if (q.includes("google") || q.includes("drive") || q.includes("cloud")) return "Cloud & Collaboration";
        if (q.includes("meet") || q.includes("zoom") || q.includes("meeting")) return "Online Meetings";
        if (q.includes("website") || q.includes("domain") || q.includes("hosting")) return "Web Basics";
        if (q.includes("assignment") || q.includes("download")) return "Assignments & Downloads";
        if (q.includes("whatsapp") || q.includes("community")) return "WhatsApp ICT Community";
        if (q.includes("password") || q.includes("internet") || q.includes("email")) return "Internet & Online Safety";
        if (q.includes("computer") || q.includes("keyboard") || q.includes("mouse")) return "Computer Basics";
        return "General support";
    }

    function buildWhatsAppUrl(question = state.latestQuestion, topic = state.latestTopic) {
        const text = `Hello Athanas Inspires, the AI Assistant could not fully answer my question.\nTopic: ${topic || "General support"}\nMy question: ${question || "I need help with..."}`;
        return `https://wa.me/${DATA.whatsappNumber}?text=${encodeURIComponent(text)}`;
    }

    function openWhatsApp(payload = {}) {
        window.open(buildWhatsAppUrl(payload?.question, payload?.topic), "_blank", "noopener,noreferrer");
    }

    function init() {
        injectNavbarButton();
        injectAssistant();
        state.flow = state.storage.flow || null;
        try {
            if (sessionStorage.getItem(OPEN_SESSION_KEY) === "1") {
                state.returnChoiceHandled = true;
                if (state.storage.messages.length) continueConversation();
                else initializeConversation();
                window.setTimeout(openPanel, 180);
            }
        } catch (error) {}
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
