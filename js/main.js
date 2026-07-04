document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("homeSearch");
    const clearButton = document.getElementById("clearSearch");
    const noResults = document.getElementById("homeSearchNoResults");
    const items = Array.from(document.querySelectorAll(".search-item"));

    if (!searchInput || items.length === 0) return;

    const filterItems = () => {
        const term = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        items.forEach((item) => {
            const text = `${item.textContent} ${item.dataset.search || ""}`.toLowerCase();
            const shouldShow = !term || text.includes(term);
            item.style.display = shouldShow ? "" : "none";
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
});
