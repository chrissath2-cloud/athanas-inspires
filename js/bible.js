(() => {
  "use strict";

  const state = {
    meta: null,
    bookCache: new Map(),
    bookId: 43,
    chapter: 3,
    highlightedVerse: null,
    searchToken: 0
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const normalize = (value = "") => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const track = (name, detail = {}) => document.dispatchEvent(new CustomEvent("athanas:track", { detail: { name, ...detail } }));

  function showToast(message) {
    const toast = $("#bibleToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
  }

  function currentBookMeta() {
    return state.meta.books.find((book) => book.id === state.bookId) || state.meta.books[0];
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-bible-source="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === "true") resolve();
        else {
          existing.addEventListener("load", resolve, { once: true });
          existing.addEventListener("error", () => reject(new Error("Faili ya Biblia haikufunguka.")), { once: true });
        }
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.dataset.bibleSource = src;
      script.addEventListener("load", () => {
        script.dataset.loaded = "true";
        resolve();
      }, { once: true });
      script.addEventListener("error", () => reject(new Error("Faili ya Biblia haikufunguka.")), { once: true });
      document.head.appendChild(script);
    });
  }

  async function loadBook(bookId) {
    if (state.bookCache.has(bookId)) return state.bookCache.get(bookId);
    const meta = state.meta.books.find((book) => book.id === bookId);
    if (!meta) throw new Error("Kitabu hakikupatikana.");

    const cachedData = window.ATHANAS_BIBLE_BOOKS?.[bookId];
    if (cachedData) {
      state.bookCache.set(bookId, cachedData);
      return cachedData;
    }

    let data = null;
    if (window.location.protocol !== "file:") {
      try {
        const response = await fetch(meta.file, { cache: "force-cache" });
        if (response.ok) data = await response.json();
      } catch (error) {
        data = null;
      }
    }

    if (!data) {
      const scriptFile = meta.file.replace(/\.json$/i, ".js");
      await loadScript(scriptFile);
      data = window.ATHANAS_BIBLE_BOOKS?.[bookId] || null;
    }

    if (!data) throw new Error(`Imeshindikana kufungua ${meta.name}.`);
    state.bookCache.set(bookId, data);
    return data;
  }

  function readInitialLocation() {
    const params = new URLSearchParams(window.location.search);
    const stored = (() => {
      try { return JSON.parse(localStorage.getItem("athanasBibleLastRead") || "null"); }
      catch (error) { return null; }
    })();

    const requestedBook = Number(params.get("book"));
    const requestedChapter = Number(params.get("chapter"));
    if (requestedBook >= 1 && requestedBook <= 66) state.bookId = requestedBook;
    else if (stored?.bookId >= 1 && stored?.bookId <= 66) state.bookId = stored.bookId;

    const meta = state.meta.books.find((book) => book.id === state.bookId) || state.meta.books[42];
    if (requestedChapter >= 1 && requestedChapter <= meta.chapterCount) state.chapter = requestedChapter;
    else if (stored?.bookId === state.bookId && stored.chapter >= 1 && stored.chapter <= meta.chapterCount) state.chapter = stored.chapter;
    else state.chapter = state.bookId === 43 ? 3 : 1;

    const verseMatch = window.location.hash.match(/^#v(\d+)$/);
    state.highlightedVerse = verseMatch ? Number(verseMatch[1]) : null;
  }

  function populateBookSelect() {
    const select = $("#bibleBookSelect");
    select.innerHTML = "";
    const groups = [
      { testament: "OT", label: "Agano la Kale" },
      { testament: "NT", label: "Agano Jipya" }
    ];
    groups.forEach(({ testament, label }) => {
      const group = document.createElement("optgroup");
      group.label = label;
      state.meta.books.filter((book) => book.testament === testament).forEach((book) => {
        const option = document.createElement("option");
        option.value = String(book.id);
        option.textContent = book.name;
        group.appendChild(option);
      });
      select.appendChild(group);
    });
    select.value = String(state.bookId);
  }

  function populateChapterSelect() {
    const select = $("#bibleChapterSelect");
    const book = currentBookMeta();
    select.innerHTML = "";
    for (let i = 1; i <= book.chapterCount; i += 1) {
      const option = document.createElement("option");
      option.value = String(i);
      option.textContent = `Sura ya ${i}`;
      select.appendChild(option);
    }
    state.chapter = Math.min(Math.max(state.chapter, 1), book.chapterCount);
    select.value = String(state.chapter);
  }

  function renderBookBrowser() {
    const root = $("#bibleBookBrowser");
    root.innerHTML = "";
    [{ key: "OT", title: "Agano la Kale" }, { key: "NT", title: "Agano Jipya" }].forEach((group) => {
      const card = document.createElement("section");
      card.className = "bible-testament-card";
      const heading = document.createElement("h3");
      heading.textContent = group.title;
      const links = document.createElement("div");
      links.className = "bible-book-links";
      state.meta.books.filter((book) => book.testament === group.key).forEach((book) => {
        const button = document.createElement("button");
        button.className = "bible-book-link";
        button.type = "button";
        button.dataset.bookId = String(book.id);
        button.textContent = book.name;
        links.appendChild(button);
      });
      card.append(heading, links);
      root.appendChild(card);
    });
  }

  function setLoading() {
    $("#bibleVerses").innerHTML = '<div class="bible-loading" aria-label="Inafungua sura"><span></span><span></span><span></span><span></span><span></span><span></span></div>';
  }

  function updateContinueBar() {
    const bar = $("#bibleStatusBar");
    const text = $("#bibleContinueText");
    const button = $("#bibleContinueButton");
    let previous = null;
    try { previous = JSON.parse(localStorage.getItem("athanasBiblePreviousRead") || "null"); }
    catch (error) { previous = null; }
    if (!previous || (previous.bookId === state.bookId && previous.chapter === state.chapter)) {
      bar.hidden = true;
      return;
    }
    const book = state.meta.books.find((item) => item.id === previous.bookId);
    if (!book || previous.chapter > book.chapterCount) {
      bar.hidden = true;
      return;
    }
    text.textContent = `Uliishia ${book.name} ${previous.chapter}.`;
    button.dataset.bookId = String(previous.bookId);
    button.dataset.chapter = String(previous.chapter);
    bar.hidden = false;
  }

  function saveLocation() {
    let last = null;
    try { last = JSON.parse(localStorage.getItem("athanasBibleLastRead") || "null"); }
    catch (error) { last = null; }
    if (last && (last.bookId !== state.bookId || last.chapter !== state.chapter)) {
      localStorage.setItem("athanasBiblePreviousRead", JSON.stringify(last));
    }
    localStorage.setItem("athanasBibleLastRead", JSON.stringify({ bookId: state.bookId, chapter: state.chapter }));
  }

  function updateUrl(verse = null, push = false) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("book", String(state.bookId));
      url.searchParams.set("chapter", String(state.chapter));
      url.hash = verse ? `v${verse}` : "";
      history[push ? "pushState" : "replaceState"]({}, "", url);
    } catch (error) {
      // Some browsers restrict History API changes while previewing local files.
    }
  }

  function updateNavigationButtons() {
    const prev = $("#biblePrev"), next = $("#bibleNext");
    const atStart = state.bookId === 1 && state.chapter === 1;
    const current = currentBookMeta();
    const atEnd = state.bookId === 66 && state.chapter === current.chapterCount;
    prev.disabled = atStart;
    next.disabled = atEnd;
    $("#biblePrevBottom").disabled = atStart;
    $("#bibleNextBottom").disabled = atEnd;
  }

  function createVerseElement(bookName, chapterNumber, verse) {
    const paragraph = document.createElement("p");
    paragraph.className = "bible-verse";
    paragraph.id = `verse-${verse.v}`;
    paragraph.dataset.verse = String(verse.v);

    const number = document.createElement("button");
    number.className = "bible-verse-number";
    number.type = "button";
    number.title = `Chagua ${bookName} ${chapterNumber}:${verse.v}`;
    number.textContent = String(verse.v);

    const text = document.createElement("span");
    text.textContent = verse.t;

    const copy = document.createElement("button");
    copy.className = "bible-copy-verse";
    copy.type = "button";
    copy.title = "Nakili mstari";
    copy.setAttribute("aria-label", `Nakili ${bookName} ${chapterNumber}:${verse.v}`);
    copy.textContent = "⧉";

    paragraph.append(number, text, copy);
    return paragraph;
  }

  async function renderChapter({ push = false, scroll = true } = {}) {
    setLoading();
    const bookMeta = currentBookMeta();
    $("#bibleBookSelect").value = String(state.bookId);
    populateChapterSelect();
    $("#bibleChapterSelect").value = String(state.chapter);
    $("#bibleChapterTitle").textContent = `${bookMeta.name} ${state.chapter}`;
    $("#bibleChapterSubtitle").textContent = `${bookMeta.testament === "OT" ? "Agano la Kale" : "Agano Jipya"} • Sura ya ${state.chapter} kati ya ${bookMeta.chapterCount}`;
    document.title = `${bookMeta.name} ${state.chapter} | Biblia ya Kiswahili | Athanas Inspires`;

    try {
      const book = await loadBook(state.bookId);
      const chapterData = book.chapters.find((item) => item.c === state.chapter);
      if (!chapterData) throw new Error("Sura hii haikupatikana.");
      const fragment = document.createDocumentFragment();
      chapterData.verses.forEach((verse) => fragment.appendChild(createVerseElement(book.name, state.chapter, verse)));
      const root = $("#bibleVerses");
      root.innerHTML = "";
      root.appendChild(fragment);
      saveLocation();
      updateContinueBar();
      updateNavigationButtons();
      updateUrl(state.highlightedVerse, push);
      track("bible_chapter_open", { label: `${book.name} ${state.chapter}` });

      if (state.highlightedVerse) {
        requestAnimationFrame(() => highlightVerse(state.highlightedVerse, true));
      } else if (scroll) {
        const top = $("#bibleReaderCard").getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } catch (error) {
      $("#bibleVerses").innerHTML = `<div class="bible-empty-state"><strong>Samahani, sura haikuweza kufunguka.</strong><p>${error.message}</p></div>`;
    }
  }

  function highlightVerse(verseNumber, shouldScroll = false) {
    $$(".bible-verse.is-highlighted").forEach((item) => item.classList.remove("is-highlighted"));
    const verse = $(`#verse-${verseNumber}`);
    if (!verse) return;
    verse.classList.add("is-highlighted");
    state.highlightedVerse = verseNumber;
    updateUrl(verseNumber);
    if (shouldScroll) verse.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function copyVerse(verseNumber) {
    const book = await loadBook(state.bookId);
    const chapterData = book.chapters.find((item) => item.c === state.chapter);
    const verse = chapterData?.verses.find((item) => item.v === verseNumber);
    if (!verse) return;
    const value = `${book.name} ${state.chapter}:${verse.v} — ${verse.t}\n\nBiblia ya Kiswahili | Athanas Inspires`;
    await copyText(value);
    highlightVerse(verseNumber);
    showToast("Mstari umenakiliwa.");
    track("bible_verse_copy", { label: `${book.name} ${state.chapter}:${verse.v}` });
  }

  async function moveChapter(direction) {
    const current = currentBookMeta();
    state.highlightedVerse = null;
    if (direction < 0) {
      if (state.chapter > 1) state.chapter -= 1;
      else if (state.bookId > 1) {
        state.bookId -= 1;
        state.chapter = state.meta.books.find((book) => book.id === state.bookId).chapterCount;
      }
    } else if (state.chapter < current.chapterCount) state.chapter += 1;
    else if (state.bookId < 66) {
      state.bookId += 1;
      state.chapter = 1;
    }
    await renderChapter({ push: true });
  }

  function applyReaderPreferences() {
    let size = 1.08;
    let night = false;
    try {
      size = Number(localStorage.getItem("athanasBibleFontSize")) || 1.08;
      night = localStorage.getItem("athanasBibleNight") === "true";
    } catch (error) {}
    document.documentElement.style.setProperty("--bible-reader-size", `${Math.min(1.55, Math.max(.9, size))}rem`);
    $("#bibleReadingPanel").classList.toggle("is-night", night);
    $("#bibleTheme").textContent = night ? "☀" : "☾";
    $("#bibleTheme").title = night ? "Mwonekano wa mchana" : "Mwonekano wa usiku";
  }

  function changeFont(delta) {
    const current = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bible-reader-size")) || 1.08;
    const next = delta === 0 ? 1.08 : Math.min(1.55, Math.max(.9, current + delta));
    document.documentElement.style.setProperty("--bible-reader-size", `${next}rem`);
    try { localStorage.setItem("athanasBibleFontSize", String(next)); } catch (error) {}
  }

  async function shareChapter() {
    const book = currentBookMeta();
    const title = `${book.name} ${state.chapter} — Biblia ya Kiswahili`;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, text: `Soma ${book.name} ${state.chapter} katika Athanas Inspires.`, url }); return; }
      catch (error) { if (error.name === "AbortError") return; }
    }
    await copyText(url);
    showToast("Kiungo cha sura kimenakiliwa.");
  }

  async function searchBible(query) {
    const clean = normalize(query);
    const status = $("#bibleSearchStatus");
    const resultsRoot = $("#bibleSearchResults");
    if (clean.length < 3) {
      status.textContent = "Andika angalau herufi 3 ili kutafuta.";
      resultsRoot.innerHTML = "";
      return;
    }

    const token = ++state.searchToken;
    status.textContent = `Inatafuta “${query.trim()}” katika vitabu 66…`;
    resultsRoot.innerHTML = '<div class="bible-loading"><span></span><span></span><span></span></div>';
    const matches = [];
    let completed = 0;
    const books = [...state.meta.books];
    const workers = Array.from({ length: 6 }, async () => {
      while (books.length && token === state.searchToken && matches.length < 100) {
        const meta = books.shift();
        const data = await loadBook(meta.id);
        for (const chapter of data.chapters) {
          for (const verse of chapter.verses) {
            if (normalize(verse.t).includes(clean)) {
              matches.push({ bookId: meta.id, book: meta.name, chapter: chapter.c, verse: verse.v, text: verse.t });
              if (matches.length >= 100) break;
            }
          }
          if (matches.length >= 100) break;
        }
        completed += 1;
        status.textContent = `Inatafuta “${query.trim()}”… vitabu ${completed}/66 vimekaguliwa.`;
      }
    });

    try { await Promise.all(workers); }
    catch (error) {
      status.textContent = "Utafutaji umeshindikana. Tafadhali jaribu tena.";
      resultsRoot.innerHTML = "";
      return;
    }
    if (token !== state.searchToken) return;
    renderSearchResults(matches, query.trim());
  }

  function renderSearchResults(matches, query) {
    const status = $("#bibleSearchStatus");
    const root = $("#bibleSearchResults");
    root.innerHTML = "";
    if (!matches.length) {
      status.textContent = `Hakuna mstari uliopatikana kwa “${query}”. Jaribu neno lingine au tahajia tofauti.`;
      root.innerHTML = '<div class="bible-empty-state">Hakuna matokeo yaliyopatikana.</div>';
      return;
    }
    status.textContent = matches.length >= 100 ? `Matokeo 100 ya kwanza kwa “${query}”. Tumia maneno zaidi kupunguza matokeo.` : `Matokeo ${matches.length} kwa “${query}”.`;
    matches.forEach((match) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bible-search-result";
      button.dataset.bookId = String(match.bookId);
      button.dataset.chapter = String(match.chapter);
      button.dataset.verse = String(match.verse);
      const number = document.createElement("span");
      number.className = "result-number";
      number.textContent = String(match.verse);
      const copy = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = `${match.book} ${match.chapter}:${match.verse}`;
      const text = document.createElement("p");
      text.textContent = match.text;
      copy.append(title, text);
      const arrow = document.createElement("span");
      arrow.className = "result-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";
      button.append(number, copy, arrow);
      root.appendChild(button);
    });
    track("bible_search", { label: query, value: matches.length });
  }

  async function openSearchResult(button) {
    state.bookId = Number(button.dataset.bookId);
    state.chapter = Number(button.dataset.chapter);
    state.highlightedVerse = Number(button.dataset.verse);
    populateChapterSelect();
    await renderChapter({ push: true, scroll: false });
    setTimeout(() => highlightVerse(state.highlightedVerse, true), 80);
  }

  function bindEvents() {
    $("#bibleBookSelect").addEventListener("change", async (event) => {
      state.bookId = Number(event.target.value);
      state.chapter = 1;
      state.highlightedVerse = null;
      populateChapterSelect();
      await renderChapter({ push: true });
    });
    $("#bibleChapterSelect").addEventListener("change", async (event) => {
      state.chapter = Number(event.target.value);
      state.highlightedVerse = null;
      await renderChapter({ push: true });
    });
    [$("#biblePrev"), $("#biblePrevBottom")].forEach((button) => button.addEventListener("click", () => moveChapter(-1)));
    [$("#bibleNext"), $("#bibleNextBottom")].forEach((button) => button.addEventListener("click", () => moveChapter(1)));

    $("#bibleFontSmaller").addEventListener("click", () => changeFont(-.08));
    $("#bibleFontReset").addEventListener("click", () => changeFont(0));
    $("#bibleFontLarger").addEventListener("click", () => changeFont(.08));
    $("#bibleTheme").addEventListener("click", () => {
      const panel = $("#bibleReadingPanel");
      const night = !panel.classList.contains("is-night");
      panel.classList.toggle("is-night", night);
      $("#bibleTheme").textContent = night ? "☀" : "☾";
      $("#bibleTheme").title = night ? "Mwonekano wa mchana" : "Mwonekano wa usiku";
      try { localStorage.setItem("athanasBibleNight", String(night)); } catch (error) {}
    });
    $("#biblePrint").addEventListener("click", () => window.print());
    $("#bibleShare").addEventListener("click", shareChapter);

    $("#bibleVerses").addEventListener("click", (event) => {
      const paragraph = event.target.closest(".bible-verse");
      if (!paragraph) return;
      const verse = Number(paragraph.dataset.verse);
      if (event.target.closest(".bible-copy-verse")) copyVerse(verse);
      else if (event.target.closest(".bible-verse-number")) highlightVerse(verse);
    });

    $("#bibleContinueButton").addEventListener("click", async (event) => {
      state.bookId = Number(event.currentTarget.dataset.bookId);
      state.chapter = Number(event.currentTarget.dataset.chapter);
      state.highlightedVerse = null;
      await renderChapter({ push: true });
    });

    $("#bibleBookBrowser").addEventListener("click", async (event) => {
      const button = event.target.closest("[data-book-id]");
      if (!button) return;
      state.bookId = Number(button.dataset.bookId);
      state.chapter = 1;
      state.highlightedVerse = null;
      populateChapterSelect();
      await renderChapter({ push: true });
    });

    $("#bibleSearchForm").addEventListener("submit", (event) => {
      event.preventDefault();
      searchBible($("#bibleSearchInput").value);
    });
    $("#bibleSearchResults").addEventListener("click", (event) => {
      const button = event.target.closest(".bible-search-result");
      if (button) openSearchResult(button);
    });

    window.addEventListener("popstate", async () => {
      readInitialLocation();
      populateBookSelect();
      populateChapterSelect();
      await renderChapter({ scroll: false });
    });
  }

  async function init() {
    try {
      state.meta = window.ATHANAS_BIBLE_META || null;
      if (!state.meta && window.location.protocol !== "file:") {
        try {
          const response = await fetch("assets/bible-data/books.json", { cache: "force-cache" });
          if (response.ok) state.meta = await response.json();
        } catch (error) {
          state.meta = null;
        }
      }
      if (!state.meta) {
        await loadScript("assets/bible-data/books.js");
        state.meta = window.ATHANAS_BIBLE_META || null;
      }
      if (!state.meta) throw new Error("Taarifa za Biblia hazijapatikana.");
      readInitialLocation();
      populateBookSelect();
      populateChapterSelect();
      renderBookBrowser();
      applyReaderPreferences();
      bindEvents();
      await renderChapter({ scroll: false });
    } catch (error) {
      $("#bibleVerses").innerHTML = `<div class="bible-empty-state"><strong>Biblia haikuweza kufunguka.</strong><p>${error.message}</p></div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
