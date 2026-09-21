(() => {
  "use strict";
  const links = Array.from(document.querySelectorAll("[data-jump-link]"));
  const skillLinks = Array.from(document.querySelectorAll("[data-jump-link][data-skill]"));
  const skills = Array.from(document.querySelectorAll("[data-skill-section]"));
  const current = document.getElementById("xmCurrentSkill");
  const progressText = document.getElementById("xmProgressText");
  const progressBar = document.getElementById("xmProgressBar");
  const skillList = document.querySelector(".xm-jump-skills");

  // Keep the active skill visible inside the navigator without moving the page itself.
  // Using Element.scrollIntoView here caused some mobile browsers to fight normal page
  // scrolling when the sticky navigator updated, which could trap the page near Skill 2.
  const keepJumpLinkVisible = (link) => {
    if (!skillList || !link) return;
    const navRect = skillList.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const mobile = window.matchMedia("(max-width: 820px)").matches;
    const edge = 10;

    if (mobile) {
      let deltaX = 0;
      if (linkRect.left < navRect.left + edge) deltaX = linkRect.left - navRect.left - edge;
      else if (linkRect.right > navRect.right - edge) deltaX = linkRect.right - navRect.right + edge;
      if (Math.abs(deltaX) > 1) skillList.scrollBy({left: deltaX, behavior: "smooth"});
      return;
    }

    let deltaY = 0;
    if (linkRect.top < navRect.top + edge) deltaY = linkRect.top - navRect.top - edge;
    else if (linkRect.bottom > navRect.bottom - edge) deltaY = linkRect.bottom - navRect.bottom + edge;
    if (Math.abs(deltaY) > 1) skillList.scrollBy({top: deltaY, behavior: "smooth"});
  };

  const setActive = (id, number) => {
    links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`));
    skills.forEach((section) => section.classList.toggle("is-current", section.id === id));
    if (number) {
      const link = skillLinks.find((item) => Number(item.dataset.skill) === number);
      if (current) current.textContent = link?.querySelector("strong")?.textContent || `Skill ${number}`;
      if (progressText) progressText.textContent = `${number} / 20`;
      if (progressBar) progressBar.style.width = `${(number / 20) * 100}%`;
      keepJumpLinkVisible(link);
    } else {
      if (current) current.textContent = id === "what-youll-learn" ? "What You’ll Learn" : "Watch + Practise";
    }
  };

  links.forEach((link) => link.addEventListener("click", () => {
    const id = decodeURIComponent(link.getAttribute("href").slice(1));
    const number = Number(link.dataset.skill || 0);
    setActive(id, number);
  }));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const section = visible.target;
      const number = Number(section.dataset.skillSection || 0);
      setActive(section.id, number);
    }, {rootMargin:"-18% 0px -62% 0px", threshold:[0,.15,.35,.6]});
    document.querySelectorAll("[data-major-section],[data-skill-section]").forEach((section) => observer.observe(section));
  }

  const video = document.getElementById("masterclassVideo");
  const button = video?.querySelector(".xm-video-poster");
  button?.addEventListener("click", () => {
    const id = video.dataset.videoId;
    if (location.protocol === "file:") {
      window.open(`https://youtu.be/${id}`, "_blank", "noopener");
      return;
    }
    const iframe = document.createElement("iframe");
    const params = new URLSearchParams({autoplay:"1",rel:"0",playsinline:"1",origin:location.origin,widget_referrer:location.href.split("#")[0]});
    iframe.src = `https://www.youtube.com/embed/${id}?${params.toString()}`;
    iframe.title = "20 Excel Tips & Tricks to Save Time and Work Faster";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    video.innerHTML = "";
    video.appendChild(iframe);
  });
})();
