(() => {
  "use strict";
  const buttons = Array.from(document.querySelectorAll("[data-category-filter]"));
  const rows = Array.from(document.querySelectorAll("[data-tool-category]"));
  const result = document.getElementById("digitalToolsResult");
  if (!buttons.length || !rows.length) return;
  const labels = { all: "all tools", create: "Create tools", "learn-practise": "Learn & Practise tools", calculate: "Calculate tools", productivity: "Productivity tools", "ai-tools": "AI tools" };
  const apply = (category, updateHash = true) => {
    const valid = buttons.some((button) => button.dataset.categoryFilter === category) ? category : "all";
    let visible = 0;
    buttons.forEach((button) => {
      const active = button.dataset.categoryFilter === valid;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    rows.forEach((row) => {
      const show = valid === "all" || row.dataset.toolCategory === valid;
      row.hidden = !show;
      if (show) visible += 1;
    });
    if (result) result.textContent = `Showing ${visible} ${labels[valid] || "tools"}`;
    if (updateHash) history.replaceState(null, "", valid === "all" ? "#digital-tools-library" : `#${valid}`);
  };
  buttons.forEach((button) => button.addEventListener("click", () => apply(button.dataset.categoryFilter)));
  const fromHash = location.hash.replace(/^#/, "");
  apply(fromHash || "all", false);
  window.addEventListener("hashchange", () => apply(location.hash.replace(/^#/, "") || "all", false));
})();
