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
  for (const btn of document.querySelectorAll("[data-open-search]")) {
    btn.addEventListener("click", openSearch);
  }
  searchClose?.addEventListener("click", () => searchDialog?.close());

  const themeToggle = document.getElementById("theme-toggle");
  const giscusTheme = () =>
    document.documentElement.getAttribute("data-theme") === "light" ? "noborder_light" : "noborder_dark";

  themeToggle?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("dyn-theme", next);
    } catch (_) {}
    const iframe = document.querySelector("iframe.giscus-frame");
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: giscusTheme() } } },
      "https://giscus.app"
    );
  });

  const filterChips = Array.from(document.querySelectorAll("[data-filter-tag]"));
  const archiveItems = Array.from(document.querySelectorAll("#archive-list .archive-post-item"));
  const archiveSeries = Array.from(document.querySelectorAll("#archive-list .archive-series"));
  const archiveVisibleCount = document.getElementById("archive-visible-count");

  if (filterChips.length > 0 && archiveItems.length > 0) {
    filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const tag = chip.dataset.filterTag || "all";
        filterChips.forEach((c) => c.classList.toggle("is-active", c === chip));

        let visible = 0;
        archiveItems.forEach((item) => {
          const itemTags = (item.dataset.tags || "").split(",").filter(Boolean);
          const match = tag === "all" || itemTags.includes(tag);
          item.hidden = !match;
          if (match) visible += 1;
        });

        archiveSeries.forEach((section) => {
          const hasVisible = section.querySelector(".archive-post-item:not([hidden])") !== null;
          section.hidden = !hasVisible;
        });

        if (archiveVisibleCount) {
          archiveVisibleCount.textContent = String(visible);
        }
      });
    });
  }

  const dealFilters = Array.from(document.querySelectorAll("[data-deal-filter]"));
  const dealCards = Array.from(document.querySelectorAll("#deals-grid .deal-card"));
  const freebieSearch = document.getElementById("freebie-search");
  if (dealCards.length > 0 && (dealFilters.length > 0 || freebieSearch)) {
    let activeCat = "all";
    const applyDealFilter = () => {
      const q = (freebieSearch?.value || "").trim().toLowerCase();
      dealCards.forEach((card) => {
        const cats = (card.dataset.dealCategory || "").split(",").map((s) => s.trim()).filter(Boolean);
        const catMatch = activeCat === "all" || cats.includes(activeCat);
        const textMatch = !q || (card.dataset.freebieText || "").includes(q);
        card.hidden = !(catMatch && textMatch);
      });
    };

    dealFilters.forEach((chip) => {
      chip.addEventListener("click", () => {
        activeCat = chip.dataset.dealFilter || "all";
        dealFilters.forEach((c) => c.classList.toggle("is-active", c === chip));
        applyDealFilter();
      });
    });

    freebieSearch?.addEventListener("input", applyDealFilter);
  }

  for (const btn of document.querySelectorAll("[data-copy-code]")) {
    btn.addEventListener("click", async () => {
      const code = btn.dataset.copyCode || "";
      if (!code) return;
      const orig = btn.textContent;
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.textContent = orig;
        }, 1600);
      } catch (_) {}
    });
  }

  const trackBtns = Array.from(document.querySelectorAll("[data-track-target]"));
  const trackPanels = Array.from(document.querySelectorAll("[data-track-panel]"));
  if (trackBtns.length > 0 && trackPanels.length > 0) {
    const activateTrack = (targetId) => {
      trackBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.trackTarget === targetId));
      trackPanels.forEach((p) => {
        p.hidden = p.id !== targetId;
      });
    };

    trackBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.trackTarget;
        if (!targetId) return;
        activateTrack(targetId);
        if (btn.classList.contains("goal-card")) {
          document.getElementById("learn-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  const STORAGE_KEY = "dyn-learn-done";
  const getDoneSet = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return new Set(Array.isArray(raw) ? raw : []);
    } catch (_) {
      return new Set();
    }
  };
  const saveDoneSet = (set) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch (_) {}
  };

  const syncLearnProgress = () => {
    const done = getDoneSet();
    for (const el of document.querySelectorAll("[data-lesson-url]")) {
      const url = el.dataset.lessonUrl;
      if (url && done.has(url)) {
        el.classList.add("is-done");
      } else {
        el.classList.remove("is-done");
      }
    }

    for (const counter of document.querySelectorAll("[data-track-progress]")) {
      const trackId = counter.dataset.trackProgress;
      const items = Array.from(document.querySelectorAll(`[data-lesson-track="${trackId}"]`));
      const completed = items.filter((i) => done.has(i.dataset.lessonUrl)).length;
      counter.textContent = `${completed}/${items.length}`;

      const startBtn = document.querySelector(`[data-track-start="${trackId}"]`);
      if (startBtn && items.length > 0) {
        const nextLesson = items.find((i) => !done.has(i.dataset.lessonUrl));
        if (nextLesson && completed > 0) {
          startBtn.href = nextLesson.getAttribute("href") || startBtn.href;
          startBtn.textContent = "Continue Learning →";
        } else if (completed === items.length && items.length > 0) {
          startBtn.textContent = "Review Track ✓";
        }
      }
    }
  };

  const markBtn = document.getElementById("mark-lesson-done");
  if (markBtn) {
    const url = markBtn.dataset.lessonUrl;
    const renderMarkBtn = () => {
      const isDone = url && getDoneSet().has(url);
      markBtn.classList.toggle("is-done", Boolean(isDone));
      markBtn.textContent = isDone ? "✓ Completed" : "Mark as completed";
    };
    markBtn.addEventListener("click", () => {
      if (!url) return;
      const done = getDoneSet();
      if (done.has(url)) done.delete(url);
      else done.add(url);
      saveDoneSet(done);
      renderMarkBtn();
      syncLearnProgress();
    });
    renderMarkBtn();
  }

  syncLearnProgress();

  const advisorBtns = Array.from(document.querySelectorAll("[data-advisor-goal]"));
  const advisorPanels = Array.from(document.querySelectorAll("[data-advisor-panel]"));
  if (advisorBtns.length > 0 && advisorPanels.length > 0) {
    advisorBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const goal = btn.dataset.advisorGoal;
        advisorBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
        advisorPanels.forEach((p) => {
          p.hidden = p.dataset.advisorPanel !== goal;
        });
      });
    });
  }

  const quickBtns = Array.from(document.querySelectorAll("[data-quick-topic]"));
  const quickPanels = Array.from(document.querySelectorAll("[data-quick-panel]"));
  if (quickBtns.length > 0 && quickPanels.length > 0) {
    quickBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.quickTopic;
        quickBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
        quickPanels.forEach((p) => {
          p.hidden = p.dataset.quickPanel !== id;
        });
      });
    });
  }

  const modeTabs = Array.from(document.querySelectorAll("[data-learn-mode]"));
  const modePanels = Array.from(document.querySelectorAll("[data-learn-mode-panel]"));
  if (modeTabs.length > 0 && modePanels.length > 0) {
    modeTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const mode = tab.dataset.learnMode;
        modeTabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
        });
        modePanels.forEach((p) => {
          p.hidden = p.dataset.learnModePanel !== mode;
        });
      });
    });
  }
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
  const progressBar = document.getElementById("reading-progress");
  const articleEl = document.querySelector("article");

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (backToTopBtn || (progressBar && articleEl)) {
    let ticking = false;
    const syncScrollUI = () => {
      ticking = false;
      if (backToTopBtn) {
        backToTopBtn.classList.toggle("is-visible", window.scrollY > 320);
      }
      if (progressBar && articleEl) {
        const start = articleEl.offsetTop;
        const total = Math.max(1, articleEl.offsetHeight - window.innerHeight * 0.6);
        const ratio = Math.min(1, Math.max(0, (window.scrollY - start) / total));
        progressBar.style.transform = `scaleX(${ratio})`;
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(syncScrollUI);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    syncScrollUI();
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

  const giscusMount = document.getElementById("giscus-mount");
  if (giscusMount) {
    const loadGiscus = () => {
      if (giscusMount.dataset.loaded) return;
      giscusMount.dataset.loaded = "true";
      giscusMount.dataset.giscusTheme = giscusTheme();
      const s = document.createElement("script");
      s.src = "https://giscus.app/client.js";
      s.crossOrigin = "anonymous";
      s.async = true;
      for (const attr of giscusMount.attributes) {
        if (attr.name.startsWith("data-giscus-")) {
          s.setAttribute("data-" + attr.name.slice(12), attr.value);
        }
      }
      s.addEventListener("load", () => {
        giscusMount.querySelector(".comments-status")?.remove();
      });
      giscusMount.append(s);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          loadGiscus();
        }
      }, { rootMargin: "1200px 0px" });
      io.observe(giscusMount);
    }
    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadGiscus, { timeout: 2500 });
    } else {
      setTimeout(loadGiscus, 1500);
    }
  }
})();
