(() => {
  "use strict";
  const links = Array.from(document.querySelectorAll("[data-jump-link]"));
  const skillLinks = Array.from(document.querySelectorAll("[data-jump-link][data-skill]"));
  const skills = Array.from(document.querySelectorAll("[data-skill-section]"));
  const current = document.getElementById("xmCurrentSkill");
  const progressText = document.getElementById("xmProgressText");
  const progressBar = document.getElementById("xmProgressBar");

  const setActive = (id, number) => {
    links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`));
    skills.forEach((section) => section.classList.toggle("is-current", section.id === id));
    if (number) {
      const link = skillLinks.find((item) => Number(item.dataset.skill) === number);
      if (current) current.textContent = link?.querySelector("strong")?.textContent || `Skill ${number}`;
      if (progressText) progressText.textContent = `${number} / 20`;
      if (progressBar) progressBar.style.width = `${(number / 20) * 100}%`;
      link?.scrollIntoView({block:"nearest", inline:"nearest"});
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
