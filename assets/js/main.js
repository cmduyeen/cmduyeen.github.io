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
  let activeCmdIdx = -1;

  const giscusTheme = () =>
    document.documentElement.getAttribute("data-theme") === "light" ? "noborder_light" : "noborder_dark";

  const toggleTheme = () => {
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
    const sText = document.getElementById("valley-season-text");
    if (sText) {
      const base = sText.textContent?.split("·")[0]?.trim() || "Valley";
      sText.textContent = `${base} · ${next === "dark" ? "Night" : "Day"}`;
    }
  }

  const heroCanvas = document.getElementById("valley-hero-canvas");
  if (heroCanvas) {
    const ctx = heroCanvas.getContext("2d");
    const W = 320;
    const H = 64;
    let t = 0;
    let walkX = 110;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const px = (x, y, w, h, c) => {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x), Math.round(y), w, h);
    };

    const drawGirl = (x, y, step) => {
      // Hair back & wavy brown
      px(x - 4, y - 15, 8, 9, "#5b2333");
      px(x - 5, y - 13, 2, 6, "#431825");
      // Face
      px(x - 2, y - 13, 5, 5, "#fcd5b5");
      px(x + 1, y - 11, 1, 1, "#2b1b17");
      px(x + 2, y - 10, 1, 1, "#f472b6");
      // Pink sweater + flower
      px(x - 3, y - 8, 6, 5, "#db6b8a");
      px(x, y - 6, 1, 1, "#fff8e7");
      // Legs walking
      const legOffset = step === 0 ? 1 : -1;
      px(x - 2 + legOffset, y - 3, 2, 3, "#4a3238");
      px(x + 1 - legOffset, y - 3, 2, 3, "#362328");
    };

    const drawDog = (x, y, coat, ear, step) => {
      const bob = step === 0 ? 0 : -1;
      // Body
      px(x - 5, y - 5 + bob, 9, 4, coat);
      // Tail wag
      px(x - 6, y - 7 + (step === 0 ? 0 : 1), 2, 3, ear);
      // Head
      px(x + 2, y - 8 + bob, 5, 4, coat);
      px(x + 2, y - 7 + bob, 2, 3, ear);
      px(x + 6, y - 7 + bob, 1, 1, "#1f1916");
      // Legs
      px(x - 4 + (step === 0 ? 1 : 0), y - 1, 2, 2, ear);
      px(x + 2 - (step === 0 ? 1 : 0), y - 1, 2, 2, ear);
    };

    const drawFrame = () => {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";

      // Sunset / Night sky bands
      px(0, 0, W, 16, dark ? "#16132b" : "#8b7ec8");
      px(0, 16, W, 16, dark ? "#241d42" : "#d98ca3");
      px(0, 32, W, 14, dark ? "#31244a" : "#f6be8b");

      if (dark) {
        [[24,7],[68,12],[118,6],[172,14],[228,8],[285,11]].forEach(([sx,sy]) => px(sx, sy, 2, 2, "#fef08a"));
        px(286, 7, 6, 6, "#facc15");
        px(288, 7, 4, 4, "#16132b");
      } else {
        const cx = (t * 0.12) % (W + 40);
        [[30,9,22],[140,12,26],[235,8,20]].forEach(([bx,by,bw]) => {
          const x = ((bx + cx) % (W + 40)) - 20;
          px(x, by, bw, 4, "#f9c5bd");
          px(x + 4, by - 3, bw - 8, 3, "#fcd5ce");
        });
      }

      // Distant hills
      px(0, 38, W, 10, dark ? "#263d29" : "#568a46");
      px(30, 35, 75, 4, dark ? "#263d29" : "#679c52");
      px(140, 34, 90, 5, dark ? "#2d4730" : "#568a46");

      // Fence
      px(0, 44, W, 2, dark ? "#5c4332" : "#a86b47");
      for (let fx = 8; fx < W; fx += 18) {
        px(fx, 42, 2, 6, dark ? "#4a3325" : "#8f563b");
      }

      // Apple tree (left) + Pine (far left)
      px(16, 30, 4, 18, "#6d4c41");
      px(8, 16, 20, 16, dark ? "#254d23" : "#4f8f3c");
      px(12, 12, 12, 6, dark ? "#2e612b" : "#7ec850");
      px(13, 21, 2, 2, "#f9a8d4");
      px(21, 18, 2, 2, "#f9a8d4");

      // Apple tree near cottage
      px(236, 32, 3, 15, "#6d4c41");
      px(229, 20, 17, 13, dark ? "#254d23" : "#4f8f3c");
      px(233, 24, 2, 2, "#dc2626");
      px(240, 26, 2, 2, "#dc2626");

      // Cozy Cottage + Chimney Smoke
      px(262, 32, 30, 15, "#e6cfa3");
      px(259, 27, 36, 6, "#9e3c2f");
      px(263, 23, 28, 4, "#b84a39");
      px(282, 19, 4, 6, "#6d4c41");
      px(274, 37, 6, 10, "#6d4c41");
      px(266, 36, 5, 5, "#fef08a");
      px(283, 36, 5, 5, "#fef08a");
      // Smoke puffs
      const sm = Math.floor(t / 14) % 3;
      px(283 + sm, 15 - sm * 2, 3, 2, "rgba(255,248,231,0.75)");
      px(285 + sm, 10 - sm * 2, 2, 2, "rgba(255,248,231,0.45)");

      // Foreground grass & dirt path
      px(0, 47, W, 17, dark ? "#2a4526" : "#6ca644");
      px(0, 51, W, 7, dark ? "#6e5239" : "#d6a868");
      // Tiny meadow flowers
      [[24,59,"#fff8e7"],[72,60,"#f472b6"],[138,59,"#fff8e7"],[204,60,"#f472b6"],[298,59,"#fff8e7"]].forEach(([fx,fy,fc]) => px(fx, fy, 2, 2, fc));

      // Walking Girl + 2 Dogs
      const step = Math.floor(t / 10) % 2;
      drawDog(walkX - 28, 56, "#eab38f", "#b47349", step);
      drawDog(walkX - 14, 56, "#c96f32", "#7c3f1d", (step + 1) % 2);
      drawGirl(walkX + 4, 56, step);

      if (!reduced) {
        t += 1;
        walkX += 0.35;
        if (walkX > W + 36) walkX = -20;
        requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();
  };

  const COMMANDS = [
    {
      label: "Toggle Theme (Dark / Light)",
      tag: "CMD",
      run: toggleTheme,
    },
    {
      label: "Surprise Me (Random Article)",
      tag: "CMD",
      run: () => {
        if (!cachedPosts || cachedPosts.length === 0) return;
        const pick = cachedPosts[Math.floor(Math.random() * cachedPosts.length)];
        if (pick?.url) location.href = pick.url;
      },
    },
    {
      label: "Copy Current Page URL",
      tag: "CMD",
      run: async () => {
        try { await navigator.clipboard.writeText(location.href); } catch (_) {}
      },
    },
    { label: "Go to Articles (Archive)", tag: "NAV", url: "/archives/" },
    { label: "Go to Projects & Tools", tag: "NAV", url: "/tools/" },
    { label: "Go to About", tag: "NAV", url: "/about/" },
  ];

  function updateActiveCmd(items) {
    items.forEach((el, idx) => el.classList.toggle("is-cmd-active", idx === activeCmdIdx));
    items[activeCmdIdx]?.scrollIntoView({ block: "nearest" });
  }

  function renderResults(items, query) {
    if (!searchResults) return;
    searchResults.replaceChildren();
    activeCmdIdx = -1;

    const rawQ = query.trim();
    const q = rawQ.toLowerCase();
    const isCmdMode = q.startsWith(">");
    const cmdQuery = isCmdMode ? q.slice(1).trim() : q;

    const matchedCmds = COMMANDS.filter((c) => !cmdQuery || c.label.toLowerCase().includes(cmdQuery));
    const matchedPosts = isCmdMode
      ? []
      : (q
          ? items.filter((item) => {
              const haystack = `${item.title} ${(item.tags || []).join(" ")} ${item.summary}`.toLowerCase();
              return haystack.includes(q);
            })
          : items.slice(0, 5));

    const showCmds = isCmdMode ? matchedCmds : (q ? [] : COMMANDS.slice(0, 3));

    if (showCmds.length === 0 && matchedPosts.length === 0) {
      const empty = document.createElement("li");
      empty.className = "search-empty";
      empty.textContent = searchDialog.dataset.emptyMsg || "No matching posts or commands.";
      searchResults.append(empty);
      return;
    }

    for (const cmd of showCmds) {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "writing-item cmd-action-item";
      const badge = document.createElement("span");
      badge.className = "cmd-tag";
      badge.textContent = cmd.tag;
      const span = document.createElement("span");
      span.textContent = cmd.label;
      btn.append(badge, span);
      btn.addEventListener("click", () => {
        searchDialog?.close();
        if (cmd.url) location.href = cmd.url;
        else cmd.run?.();
      });
      li.append(btn);
      searchResults.append(li);
    }

    for (const item of matchedPosts) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "writing-item cmd-action-item";
      a.href = item.url;
      const time = document.createElement("time");
      time.textContent = item.date;
      const span = document.createElement("span");
      span.textContent = item.title;
      a.append(time, span);
      li.append(a);
      searchResults.append(li);
    }

    const rendered = Array.from(searchResults.querySelectorAll(".cmd-action-item"));
    if (rendered.length > 0) {
      activeCmdIdx = 0;
      updateActiveCmd(rendered);
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

  const seasonHud = document.getElementById("valley-season-hud");
  seasonHud?.addEventListener("click", toggleTheme);

  const junimoPet = document.getElementById("junimo-pet");
  const junimoBubble = document.getElementById("junimo-bubble");
  if (junimoPet && junimoBubble) {
    const quotes = [
      "Cozy notes, zero bloat!",
      "Press Ctrl+K (or ⌘K) for magic!",
      "Plain-text lasts forever.",
      "Small tools, big leverage.",
      "Have a calm building day!"
    ];
    let bubbleTimer;
    junimoPet.addEventListener("click", () => {
      const pick = quotes[Math.floor(Math.random() * quotes.length)];
      junimoBubble.textContent = pick;
      junimoBubble.hidden = false;
      junimoBubble.classList.remove("is-pop");
      void junimoBubble.offsetWidth;
      junimoBubble.classList.add("is-pop");
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => {
        junimoBubble.hidden = true;
      }, 2800);
    });
  }

  const seasonText = document.getElementById("valley-season-text");
  if (seasonText) {
    const m = new Date().getMonth();
    const season = m >= 2 && m <= 4 ? "Spring" : m >= 5 && m <= 7 ? "Summer" : m >= 8 && m <= 10 ? "Fall" : "Winter";
    const isNight = document.documentElement.getAttribute("data-theme") === "dark";
    seasonText.textContent = `${season} · ${isNight ? "Night" : "Day"}`;
  }

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
  searchInput?.addEventListener("keydown", (e) => {
    const items = Array.from(searchResults?.querySelectorAll(".cmd-action-item") || []);
    if (items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeCmdIdx = (activeCmdIdx + 1) % items.length;
      updateActiveCmd(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeCmdIdx = (activeCmdIdx - 1 + items.length) % items.length;
      updateActiveCmd(items);
    } else if (e.key === "Enter" && activeCmdIdx >= 0) {
      e.preventDefault();
      items[activeCmdIdx]?.click();
    }
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
        const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 120;
        backToTopBtn.classList.toggle("is-visible", window.scrollY > 320 && !nearBottom);
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
