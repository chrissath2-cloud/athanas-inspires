(() => {
  "use strict";
  const send = (name, params = {}) => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, {
      event_category: params.category || "engagement",
      event_label: params.label || "",
      value: Number.isFinite(Number(params.value)) ? Number(params.value) : undefined,
      page_path: window.location.pathname,
      transport_type: "beacon"
    });
  };

  document.addEventListener("athanas:track", (event) => {
    const detail = event.detail || {};
    if (detail.name) send(detail.name, detail);
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("a,button");
    if (!target) return;
    const href = target.getAttribute("href") || "";
    const label = target.dataset.trackLabel || target.textContent.trim().replace(/\s+/g, " ").slice(0, 120);
    if (target.dataset.track) send(target.dataset.track, { label });
    else if (/youtube\.com|youtu\.be/.test(href)) send(href.includes("sub_confirmation") ? "youtube_subscribe_click" : "youtube_video_click", { label });
    else if (/wa\.me|chat\.whatsapp\.com/.test(href)) send(href.includes("chat.whatsapp") ? "whatsapp_community_click" : "whatsapp_support_click", { label });
    else if (target.hasAttribute("download") || /assets\/downloads\//.test(href)) send("file_download", { label: label || href.split("/").pop() });
    else if (target.closest(".ytp-slider-controls")) send("testimonial_control", { label });
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("audio").forEach((audio) => {
      const name = audio.id || "website_audio";
      let started = false;
      audio.addEventListener("play", () => { if (!started) { started = true; send("welcome_audio_play", { label: name }); } });
      audio.addEventListener("ended", () => send("welcome_audio_complete", { label: name }));
    });
  });
})();
