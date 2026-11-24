(() => {
  // Archive search + tag filter
  const searchInput = document.getElementById("archive-search");
  const filterChips = document.querySelectorAll(".filter-chip");
  const postItems = document.querySelectorAll(".archive-post-item");
  const visibleCount = document.getElementById("archive-visible-count");
  const emptyState = document.getElementById("archive-empty");
  const resetBtn = document.getElementById("archive-reset");
  let activeTag = "all";

  function applyArchiveFilter() {
    if (!postItems.length) return;
    const q = (searchInput?.value || "").trim().toLowerCase();
    let shown = 0;
    postItems.forEach((item) => {
      const tags = (item.dataset.tags || "").split(",");
      const hay = item.dataset.search || "";
      const match = (activeTag === "all" || tags.includes(activeTag)) && (!q || hay.includes(q));
      item.hidden = !match;
      if (match) shown++;
    });
    document.querySelectorAll(".archive-series").forEach((sec) => {
      const anyVisible = Array.from(sec.querySelectorAll(".archive-post-item")).some((el) => !el.hidden);
      sec.hidden = !anyVisible;
    });
    if (visibleCount) visibleCount.textContent = String(shown);
    if (emptyState) emptyState.hidden = shown > 0;
  }

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      activeTag = chip.dataset.filterTag || "all";
      filterChips.forEach((c) => { c.classList.toggle("is-active", c === chip); });
      applyArchiveFilter();
    });
  });
  searchInput?.addEventListener("input", applyArchiveFilter);
  resetBtn?.addEventListener("click", () => {
    activeTag = "all";
    if (searchInput) searchInput.value = "";
    filterChips.forEach((c) => { c.classList.toggle("is-active", c.dataset.filterTag === "all"); });
    applyArchiveFilter();
  });

  // Search dialog (Cmd/Ctrl+K)
  const dialog = document.getElementById("search-dialog");
  const trigger = document.getElementById("search-trigger");
  const closeBtn = document.getElementById("search-close");
  const dlgInput = document.getElementById("search-input");
  const dlgResults = document.getElementById("search-results");
  let postsIndex = null;

  async function openSearch() {
    if (!dialog) return;
    dialog.showModal();
    dlgInput?.focus();
    if (!postsIndex) {
      try {
        const res = await fetch(dialog.dataset.indexUrl || "/index.json");
        postsIndex = await res.json();
      } catch {
        postsIndex = [];
      }
    }
    renderSearch("");
  }

  function renderSearch(q) {
    if (!dlgResults || !postsIndex) return;
    const term = q.trim().toLowerCase();
    const hits = postsIndex.filter((p) => !term || `${p.title} ${p.tags || ""}`.toLowerCase().includes(term)).slice(0, 8);
    dlgResults.innerHTML = hits.length
      ? hits.map((p) => `<li><a class="writing-item" href="${p.permalink}"><time>${p.date || ""}</time><span>${p.title}</span><span class="writing-meta">→</span></a></li>`).join("")
      : `<li style="padding:1rem 0;color:var(--text-muted)">${dialog?.dataset.emptyMsg || "No results."}</li>`;
  }

  trigger?.addEventListener("click", openSearch);
  closeBtn?.addEventListener("click", () => dialog?.close());
  dlgInput?.addEventListener("input", (e) => renderSearch(e.target.value));
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      dialog?.open ? dialog.close() : openSearch();
    }
  });

  // Copy button on code blocks
  document.querySelectorAll(".article-content pre").forEach((pre) => {
    const code = pre.querySelector("code");
    if (!code) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-code-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.textContent || "");
        btn.textContent = "Copied";
        btn.classList.add("is-copied");
        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("is-copied");
        }, 1500);
      } catch {}
    });
    pre.appendChild(btn);
  });

  // Reading progress & back-to-top
  const progress = document.getElementById("reading-progress");
  const topBtn = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (topBtn) topBtn.classList.toggle("is-visible", y > 360);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = h > 0 ? `${Math.min(100, (y / h) * 100)}%` : "0%";
    }
  }, { passive: true });
  topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();
