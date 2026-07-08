document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const loader = document.querySelector(".site-loader");
    const navbar = document.querySelector(".navbar");
    const menuToggle = document.getElementById("menu-toggle");

    // Top loading state
    window.addEventListener("load", () => {
        body.classList.add("site-loaded");
        if (loader) {
            window.setTimeout(() => loader.classList.add("is-hidden"), 420);
        }
    });

    // Page scroll progress indicator
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    const updateScrollUI = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        progress.style.width = `${Math.min((scrollTop / maxScroll) * 100, 100)}%`;
        if (navbar) navbar.classList.toggle("nav-scrolled", scrollTop > 16);
    };

    updateScrollUI();
    window.addEventListener("scroll", updateScrollUI, { passive: true });

    // Homepage search
    const searchInput = document.getElementById("homeSearch");
    const clearButton = document.getElementById("clearSearch");
    const noResults = document.getElementById("homeSearchNoResults");
    const items = Array.from(document.querySelectorAll(".search-item"));

    if (searchInput && items.length > 0) {
        const filterItems = () => {
            const term = searchInput.value.trim().toLowerCase();
            let visibleCount = 0;

            items.forEach((item) => {
                const text = `${item.textContent} ${item.dataset.search || ""}`.toLowerCase();
                const shouldShow = !term || text.includes(term);
                item.classList.toggle("is-filtered-out", !shouldShow);
                window.setTimeout(() => {
                    item.style.display = shouldShow ? "" : "none";
                }, shouldShow ? 0 : 160);
                if (shouldShow) visibleCount += 1;
            });

            if (noResults) {
                noResults.style.display = visibleCount === 0 ? "block" : "none";
            }
        };

        searchInput.addEventListener("input", filterItems);

        if (clearButton) {
            clearButton.addEventListener("click", () => {
                searchInput.value = "";
                filterItems();
                searchInput.focus();
            });
        }
    }

    // Smooth in-page scrolling and close mobile menu after click
    document.querySelectorAll('a[href]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href") || "";

            if (menuToggle && link.closest(".nav-links")) {
                menuToggle.checked = false;
            }

            if (href.startsWith("#") && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.pushState(null, "", href);
                }
            }
        });
    });

    // Gentle page transition for normal internal page links
    document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href") || "";
            const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
            const opensNewTab = link.target && link.target !== "_self";

            if (isModifiedClick || opensNewTab || href.includes("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

            event.preventDefault();
            body.classList.add("is-leaving");
            window.setTimeout(() => {
                window.location.href = href;
            }, 180);
        });
    });

    // Reveal sections/cards gently as visitors scroll
    const revealTargets = document.querySelectorAll([
        ".hero-text",
        ".hero-image",
        ".section-heading",
        ".start-here-card",
        ".home-search-card",
        ".course-card",
        ".update-card",
        ".platform-card",
        ".assignment-card",
        ".session-card",
        ".download-card",
        ".contact-card",
        ".about-card",
        ".about-image",
        ".video-series",
        ".youtube-hero-card",
        ".community-card",
        ".why-card",
        ".side-card"
    ].join(","));

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        revealTargets.forEach((element, index) => {
            element.classList.add("reveal-on-scroll");
            element.style.transitionDelay = `${Math.min((index % 6) * 55, 275)}ms`;
            observer.observe(element);
        });
    } else {
        revealTargets.forEach((element) => element.classList.add("is-visible"));
    }
});
