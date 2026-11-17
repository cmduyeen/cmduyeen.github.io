(() => {
  const prefetched = new Set();
  const connection = navigator.connection;
  let pendingAnchor;
  let pendingTimer;

  function prefetch(link) {
    if (
      !link ||
      connection?.saveData ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g" ||
      link.hasAttribute("download") ||
      (link.target && link.target.toLowerCase() !== "_self") ||
      link.relList.contains("nofollow")
    ) {
      return;
    }

    const url = new URL(link.href, location.href);
    if (
      url.origin !== location.origin ||
      (url.pathname === location.pathname && url.search === location.search) ||
      prefetched.has(url.href)
    ) {
      return;
    }

    prefetched.add(url.href);
    const hint = document.createElement("link");
    hint.rel = "prefetch";
    hint.href = url.href;
    document.head.append(hint);
  }

  function getAnchor(target) {
    return target instanceof Element ? target.closest("a[href]") : null;
  }

  function rememberLanguage(event) {
    const language = getAnchor(event.target)?.dataset.languageSwitch;
    if (language !== "vi" && language !== "en") {
      return;
    }

    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `dyn-language=${language}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
  }

  function prefetchOnHover(event) {
    const anchor = getAnchor(event.target);
    if (!anchor || anchor === pendingAnchor) {
      return;
    }

    clearTimeout(pendingTimer);
    pendingAnchor = anchor;
    pendingTimer = setTimeout(() => {
      prefetch(pendingAnchor);
      pendingAnchor = null;
      pendingTimer = null;
    }, 80);
  }

  function cancelHoverPrefetch(event) {
    const anchor = getAnchor(event.target);
    if (
      !anchor ||
      anchor !== pendingAnchor ||
      (event.relatedTarget instanceof Element && anchor.contains(event.relatedTarget))
    ) {
      return;
    }

    clearTimeout(pendingTimer);
    pendingAnchor = null;
    pendingTimer = null;
  }

  function prefetchOnFocus(event) {
    prefetch(getAnchor(event.target));
  }

  function prefetchOnPointerDown(event) {
    if (event.pointerType !== "mouse" && event.button === 0) {
      prefetch(getAnchor(event.target));
    }
  }

  document.addEventListener("pointerover", prefetchOnHover, { passive: true });
  document.addEventListener("pointerout", cancelHoverPrefetch, { passive: true });
  document.addEventListener("pointerdown", prefetchOnPointerDown, { passive: true });
  document.addEventListener("focusin", prefetchOnFocus);
  document.addEventListener("click", rememberLanguage);

  const searchTrigger = document.getElementById("search-trigger");
  const searchDialog = document.getElementById("search-dialog");
  const searchInput = document.getElementById("search-input");
  const searchClose = document.getElementById("search-close");
  const searchResults = document.getElementById("search-results");
  let cachedPosts = null;

  function renderResults(items, query) {
    if (!searchResults) return;
    searchResults.replaceChildren();
    const q = query.trim().toLowerCase();
    const matched = q
      ? items.filter((item) => {
          const haystack = `${item.title} ${(item.tags || []).join(" ")} ${item.summary}`.toLowerCase();
          return haystack.includes(q);
        })
      : items.slice(0, 6);

    if (matched.length === 0) {
      const empty = document.createElement("li");
      empty.className = "search-empty";
      empty.textContent = searchDialog.dataset.emptyMsg || "No matching posts found.";
      searchResults.append(empty);
      return;
    }

    for (const item of matched) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "writing-item";
      a.href = item.url;
      const time = document.createElement("time");
      time.textContent = item.date;
      const span = document.createElement("span");
      span.textContent = item.title;
      a.append(time, span);
      li.append(a);
      searchResults.append(li);
    }
  }

  async function openSearch() {
    if (!searchDialog || typeof searchDialog.showModal !== "function") return;
    searchDialog.showModal();
    searchInput?.focus();
    if (!cachedPosts) {
      try {
        const res = await fetch(searchDialog.dataset.indexUrl || "/index.json");
        cachedPosts = await res.json();
      } catch (_) {
        cachedPosts = [];
      }
    }
    renderResults(cachedPosts, searchInput?.value || "");
  }

  searchTrigger?.addEventListener("click", openSearch);
  searchClose?.addEventListener("click", () => searchDialog?.close());
  searchDialog?.addEventListener("click", (e) => {
    if (e.target === searchDialog) searchDialog.close();
  });
  searchInput?.addEventListener("input", () => {
    if (cachedPosts) renderResults(cachedPosts, searchInput.value);
  });
  document.addEventListener("keydown", (e) => {
    if ((e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
        !(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)) {
      e.preventDefault();
      openSearch();
    }
  });

  const tocLinks = Array.from(document.querySelectorAll("#TableOfContents a[href^='#']"));
  if (tocLinks.length > 0 && "IntersectionObserver" in window) {
    const headings = tocLinks
      .map((a) => document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1))))
      .filter(Boolean);
    const linkById = new Map(tocLinks.map((a) => [decodeURIComponent(a.getAttribute("href").slice(1)), a]));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            tocLinks.forEach((l) => l.classList.remove("is-active"));
            linkById.get(entry.target.id)?.classList.add("is-active");
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    headings.forEach((h) => observer.observe(h));
  }

  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    const toggleBackToTop = () => {
      backToTopBtn.classList.toggle("is-visible", window.scrollY > 320);
    };
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  for (const pre of document.querySelectorAll(".article-content pre")) {
    const code = pre.querySelector("code");
    if (!code) continue;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "code-copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.innerText);
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = "Copy";
        }, 1600);
      } catch (_) {}
    });
    pre.append(btn);
  }

  const progressBar = document.getElementById("reading-progress");
  const articleEl = document.querySelector("article");
  if (progressBar && articleEl) {
    const updateProgress = () => {
      const start = articleEl.offsetTop;
      const total = Math.max(1, articleEl.offsetHeight - window.innerHeight * 0.6);
      const ratio = Math.min(1, Math.max(0, (window.scrollY - start) / total));
      progressBar.style.transform = `scaleX(${ratio})`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    updateProgress();
  }
})();
