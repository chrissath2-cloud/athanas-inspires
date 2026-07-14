document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const loader = document.querySelector(".site-loader");
    const navbar = document.querySelector(".navbar");
    const menuToggle = document.getElementById("menu-toggle");

    // Homepage welcome audio. Browsers may block sound until the visitor interacts,
    // so autoplay is attempted first and a premium play control appears when needed.
    const welcomeAudio = document.getElementById("welcomeAudio");
    const welcomeAudioWidget = document.getElementById("welcomeAudioWidget");
    const welcomeAudioAction = document.getElementById("welcomeAudioAction");
    const welcomeAudioStatus = document.getElementById("welcomeAudioStatus");
    const welcomeAudioDismiss = document.getElementById("welcomeAudioDismiss");
    const welcomePlayedKey = "athanas-welcome-audio-played";
    const welcomeDismissedKey = "athanas-welcome-audio-dismissed";
    let welcomeHideTimer = null;

    const readSessionFlag = (key) => {
        try {
            return window.sessionStorage.getItem(key) === "true";
        } catch (error) {
            return false;
        }
    };

    const saveSessionFlag = (key) => {
        try {
            window.sessionStorage.setItem(key, "true");
        } catch (error) {
            // Storage can be unavailable in strict privacy modes; audio still works.
        }
    };

    const showWelcomeAudioWidget = (state, label) => {
        if (!welcomeAudioWidget || !welcomeAudioAction || !welcomeAudioStatus) return;

        window.clearTimeout(welcomeHideTimer);
        welcomeAudioWidget.hidden = false;
        welcomeAudioWidget.classList.toggle("is-playing", state === "playing");
        welcomeAudioWidget.classList.toggle("is-ready", state === "ready");
        welcomeAudioWidget.classList.toggle("is-ended", state === "ended");
        welcomeAudioStatus.textContent = label;

        const actionLabel = state === "playing"
            ? "Pause welcome message"
            : state === "ended"
                ? "Replay welcome message"
                : "Play welcome message";
        welcomeAudioAction.setAttribute("aria-label", actionLabel);
    };

    const hideWelcomeAudioWidget = () => {
        if (!welcomeAudioWidget) return;
        welcomeAudioWidget.classList.add("is-hiding");
        window.setTimeout(() => {
            welcomeAudioWidget.hidden = true;
            welcomeAudioWidget.classList.remove("is-hiding", "is-playing", "is-ready", "is-ended");
        }, 280);
    };

    const playWelcomeAudio = async ({ reset = false } = {}) => {
        if (!welcomeAudio) return false;

        if (reset || welcomeAudio.ended) welcomeAudio.currentTime = 0;
        welcomeAudio.volume = 0.82;

        try {
            await welcomeAudio.play();
            saveSessionFlag(welcomePlayedKey);
            showWelcomeAudioWidget("playing", "Welcome audio playing");
            return true;
        } catch (error) {
            showWelcomeAudioWidget("ready", "Tap to hear our welcome");
            return false;
        }
    };

    const initialiseWelcomeAudio = () => {
        if (!welcomeAudio || readSessionFlag(welcomePlayedKey) || readSessionFlag(welcomeDismissedKey)) return;

        const dataSaverEnabled = Boolean(navigator.connection && navigator.connection.saveData);
        if (dataSaverEnabled) {
            showWelcomeAudioWidget("ready", "Play our welcome");
            return;
        }

        playWelcomeAudio();
    };

    if (welcomeAudio && welcomeAudioAction && welcomeAudioDismiss) {
        welcomeAudioAction.addEventListener("click", () => {
            if (!welcomeAudio.paused) {
                welcomeAudio.pause();
                showWelcomeAudioWidget("ready", "Continue welcome audio");
                return;
            }

            playWelcomeAudio({ reset: welcomeAudio.ended });
        });

        welcomeAudioDismiss.addEventListener("click", () => {
            welcomeAudio.pause();
            saveSessionFlag(welcomeDismissedKey);
            hideWelcomeAudioWidget();
        });

        welcomeAudio.addEventListener("playing", () => {
            showWelcomeAudioWidget("playing", "Welcome audio playing");
        });

        welcomeAudio.addEventListener("ended", () => {
            showWelcomeAudioWidget("ended", "Replay welcome audio");
            welcomeHideTimer = window.setTimeout(hideWelcomeAudioWidget, 8000);
        });

        welcomeAudio.addEventListener("error", () => {
            hideWelcomeAudioWidget();
        });
    }

    // Top loading state
    window.addEventListener("load", () => {
        body.classList.add("site-loaded");
        if (loader) {
            window.setTimeout(() => loader.classList.add("is-hidden"), 420);
        }
        window.setTimeout(initialiseWelcomeAudio, 900);
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

    // Premium same-page inspirational image viewer.
    // Opening the viewer adds a history entry, so the browser Back button closes it.
    const imageViewerTriggers = Array.from(document.querySelectorAll("[data-image-viewer]"));

    if (imageViewerTriggers.length > 0) {
        const viewer = document.createElement("div");
        viewer.className = "image-viewer";
        viewer.id = "inspiration-image-viewer";
        viewer.setAttribute("aria-hidden", "true");
        viewer.innerHTML = `
            <div class="image-viewer-backdrop" data-image-viewer-close></div>
            <section class="image-viewer-panel" role="dialog" aria-modal="true" aria-labelledby="imageViewerTitle">
                <div class="image-viewer-toolbar">
                    <button class="image-viewer-back" type="button" data-image-viewer-back>
                        <span aria-hidden="true">←</span> Back
                    </button>
                    <span class="image-viewer-kicker">Athanas Inspires · Inspirational Image</span>
                    <button class="image-viewer-close" type="button" data-image-viewer-close aria-label="Close image viewer">×</button>
                </div>
                <figure class="image-viewer-figure">
                    <div class="image-viewer-media">
                        <img src="" alt="">
                    </div>
                    <figcaption class="image-viewer-caption">
                        <div>
                            <span class="image-viewer-type">Visual Inspiration</span>
                            <h2 id="imageViewerTitle"></h2>
                            <p></p>
                        </div>
                        <span class="image-viewer-brand" aria-label="Athanas Inspires">Athanas Inspires</span>
                    </figcaption>
                </figure>
            </section>`;
        document.body.appendChild(viewer);

        const viewerImage = viewer.querySelector(".image-viewer-media img");
        const viewerTitle = viewer.querySelector(".image-viewer-caption h2");
        const viewerCaption = viewer.querySelector(".image-viewer-caption p");
        const viewerBackButton = viewer.querySelector("[data-image-viewer-back]");
        let lastViewerTrigger = null;
        let viewerHistoryWasPushed = false;

        const fillViewer = (trigger) => {
            if (!trigger) return;
            viewerImage.src = trigger.dataset.imageSrc || "";
            viewerImage.alt = trigger.dataset.imageAlt || "Inspirational image";
            viewerTitle.textContent = trigger.dataset.imageTitle || "Inspirational Image";
            viewerCaption.textContent = trigger.dataset.imageCaption || "";
        };

        const openViewer = (trigger, pushHistory = true) => {
            if (trigger) {
                lastViewerTrigger = trigger;
                fillViewer(trigger);
            }
            viewer.classList.add("is-open");
            viewer.setAttribute("aria-hidden", "false");
            document.body.classList.add("image-viewer-open");

            if (pushHistory && window.location.hash !== "#inspiration-image-viewer") {
                history.pushState({ imageViewer: true }, "", "#inspiration-image-viewer");
                viewerHistoryWasPushed = true;
            }

            window.setTimeout(() => viewerBackButton.focus(), 80);
        };

        const closeViewer = (restoreFocus = true) => {
            viewer.classList.remove("is-open");
            viewer.setAttribute("aria-hidden", "true");
            document.body.classList.remove("image-viewer-open");
            if (restoreFocus && lastViewerTrigger) lastViewerTrigger.focus({ preventScroll: true });
        };

        const leaveViewer = () => {
            if (viewerHistoryWasPushed && window.location.hash === "#inspiration-image-viewer") {
                viewerHistoryWasPushed = false;
                history.back();
            } else {
                if (window.location.hash === "#inspiration-image-viewer") {
                    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
                }
                closeViewer();
            }
        };

        imageViewerTriggers.forEach((trigger) => {
            trigger.addEventListener("click", (event) => {
                event.preventDefault();
                openViewer(trigger, true);
            });
        });

        viewer.querySelectorAll("[data-image-viewer-close]").forEach((control) => {
            control.addEventListener("click", leaveViewer);
        });
        viewerBackButton.addEventListener("click", leaveViewer);

        window.addEventListener("popstate", () => {
            if (window.location.hash === "#inspiration-image-viewer") {
                openViewer(lastViewerTrigger || imageViewerTriggers[0], false);
            } else {
                viewerHistoryWasPushed = false;
                closeViewer(true);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (!viewer.classList.contains("is-open")) return;

            if (event.key === "Escape") {
                event.preventDefault();
                leaveViewer();
                return;
            }

            if (event.key === "Tab") {
                const focusable = Array.from(viewer.querySelectorAll('button, a[href]')).filter((item) => !item.hasAttribute("disabled"));
                if (focusable.length === 0) return;
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
        });

        // Support a copied URL containing the viewer hash without opening a new page.
        if (window.location.hash === "#inspiration-image-viewer") {
            openViewer(imageViewerTriggers[0], false);
        }
    }

    // Smooth in-page scrolling and close mobile menu after click
    document.querySelectorAll('a[href]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href") || "";

            if (link.hasAttribute("data-image-viewer")) return;

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
        ".side-card",
        ".purpose-mission-inner",
        ".latest-row",
        ".featured-inspiration-copy",
        ".featured-inspiration-image",
        ".inspiration-link-row",
        ".coming-line",
        ".article-hero-copy",
        ".article-hero-image",
        ".article-reflection",
        ".start-small-challenge",
        ".article-next-step"
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


/* Shared grouped navigation dropdowns and homepage FAQ preview */
document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = Array.from(document.querySelectorAll(".nav-dropdown"));
    const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const closeTimers = new WeakMap();
    const usesDesktopNavigation = () => desktopPointer.matches && window.innerWidth > 860;

    const setDropdown = (dropdown, shouldOpen) => {
        const toggle = dropdown.querySelector(".nav-dropdown-toggle");
        dropdown.classList.toggle("is-open", shouldOpen);
        toggle?.setAttribute("aria-expanded", String(shouldOpen));
    };

    const closeAllDropdowns = (except = null) => {
        dropdowns.forEach((dropdown) => {
            if (dropdown !== except) setDropdown(dropdown, false);
        });
    };

    const focusMenuItem = (dropdown, position = "first") => {
        const links = Array.from(dropdown.querySelectorAll(".nav-dropdown-menu a, .nav-dropdown-menu button"));
        if (!links.length) return;
        (position === "last" ? links.at(-1) : links[0]).focus();
    };

    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".nav-dropdown-toggle");
        const menu = dropdown.querySelector(".nav-dropdown-menu");
        const links = Array.from(dropdown.querySelectorAll(".nav-dropdown-menu a, .nav-dropdown-menu button"));

        toggle?.addEventListener("click", (event) => {
            event.stopPropagation();
            const willOpen = usesDesktopNavigation() ? true : !dropdown.classList.contains("is-open");
            closeAllDropdowns(dropdown);
            setDropdown(dropdown, willOpen);
        });

        toggle?.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                closeAllDropdowns(dropdown);
                setDropdown(dropdown, true);
                window.setTimeout(() => focusMenuItem(dropdown, event.key === "ArrowUp" ? "last" : "first"), 20);
            }
        });

        menu?.addEventListener("keydown", (event) => {
            const currentIndex = links.indexOf(document.activeElement);
            if (currentIndex < 0) return;

            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                const direction = event.key === "ArrowDown" ? 1 : -1;
                links[(currentIndex + direction + links.length) % links.length].focus();
            } else if (event.key === "Home") {
                event.preventDefault();
                links[0]?.focus();
            } else if (event.key === "End") {
                event.preventDefault();
                links.at(-1)?.focus();
            }
        });

        links.forEach((link) => {
            link.addEventListener("click", () => {
                setDropdown(dropdown, false);
                const mobileMenuToggle = document.getElementById("menu-toggle");
                if (mobileMenuToggle) mobileMenuToggle.checked = false;
            });
        });

        dropdown.addEventListener("mouseenter", () => {
            if (!usesDesktopNavigation()) return;
            const timer = closeTimers.get(dropdown);
            if (timer) window.clearTimeout(timer);
            closeAllDropdowns(dropdown);
            setDropdown(dropdown, true);
        });

        dropdown.addEventListener("mouseleave", () => {
            if (!usesDesktopNavigation()) return;
            const timer = window.setTimeout(() => setDropdown(dropdown, false), 140);
            closeTimers.set(dropdown, timer);
        });
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".nav-dropdown")) closeAllDropdowns();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        const openDropdown = dropdowns.find((dropdown) => dropdown.classList.contains("is-open"));
        closeAllDropdowns();
        openDropdown?.querySelector(".nav-dropdown-toggle")?.focus();
    });

    document.getElementById("menu-toggle")?.addEventListener("change", (event) => {
        if (!event.target.checked) closeAllDropdowns();
    });

    window.addEventListener("resize", () => closeAllDropdowns(), { passive: true });

    const homeFaqItems = Array.from(document.querySelectorAll(".home-faq-item"));
    homeFaqItems.forEach((item) => {
        item.addEventListener("toggle", () => {
            if (!item.open) return;
            homeFaqItems.forEach((other) => {
                if (other !== item) other.open = false;
            });
        });
    });
});
