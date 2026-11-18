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

  const canvas = document.getElementById("junimo-canvas");
  const scoreEl = document.getElementById("arcade-score");
  const bestEl = document.getElementById("arcade-best");
  const startBtn = document.getElementById("arcade-start");
  if (canvas && scoreEl && bestEl && startBtn) {
    const ctx = canvas.getContext("2d");
    const BEST_KEY = "dyn-arcade-best";
    let best = 0;
    try { best = parseInt(localStorage.getItem(BEST_KEY) || "0", 10) || 0; } catch (_) {}
    bestEl.textContent = String(best);

    let running = false;
    let rafId = 0;
    let score = 0;
    let lives = 3;
    let playerX = canvas.width / 2;
    let keys = { left: false, right: false };
    let drops = [];
    let spawnTimer = 0;

    const drawPixelJunimo = (x, y) => {
      ctx.fillStyle = "#4f8f3c";
      ctx.fillRect(x - 12, y - 8, 24, 18);
      ctx.fillStyle = "#7ec850";
      ctx.fillRect(x - 9, y - 12, 18, 5);
      ctx.fillStyle = "#4f8f3c";
      ctx.fillRect(x - 2, y - 16, 4, 4);
      ctx.fillStyle = "#1f1916";
      ctx.fillRect(x - 6, y - 4, 3, 4);
      ctx.fillRect(x + 3, y - 4, 3, 4);
    };

    const drawDrop = (d) => {
      if (d.type === "star") {
        ctx.fillStyle = "#eab308";
        ctx.fillRect(d.x - 6, d.y - 6, 12, 12);
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(d.x - 3, d.y - 9, 6, 18);
        ctx.fillRect(d.x - 9, d.y - 3, 18, 6);
      } else if (d.type === "apple") {
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(d.x - 7, d.y - 6, 14, 12);
        ctx.fillStyle = "#4f8f3c";
        ctx.fillRect(d.x - 1, d.y - 10, 4, 4);
      } else {
        ctx.fillStyle = "#78716c";
        ctx.fillRect(d.x - 7, d.y - 7, 14, 14);
        ctx.fillStyle = "#44403c";
        ctx.fillRect(d.x - 4, d.y - 4, 8, 8);
      }
    };

    const drawBackdrop = () => {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      ctx.fillStyle = dark ? "#1f1916" : "#e8f3d6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = dark ? "#362c25" : "#7ec850";
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
      ctx.fillStyle = dark ? "#5c4332" : "#8f563b";
      ctx.fillRect(0, canvas.height - 22, canvas.width, 3);
    };

    const drawIdle = (msg) => {
      drawBackdrop();
      drawPixelJunimo(playerX, canvas.height - 32);
      ctx.fillStyle = document.documentElement.getAttribute("data-theme") === "dark" ? "#f5ebd6" : "#3e2723";
      ctx.font = "bold 14px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(msg, canvas.width / 2, canvas.height / 2 - 6);
    };

    const spawnDrop = () => {
      const r = Math.random();
      const type = r < 0.16 ? "star" : r < 0.42 ? "rock" : "apple";
      drops.push({
        x: 20 + Math.random() * (canvas.width - 40),
        y: -12,
        vy: 1.8 + Math.random() * 1.4 + Math.min(score * 0.03, 1.8),
        type,
      });
    };

    const tick = () => {
      if (!running) return;
      if (keys.left) playerX -= 5.2;
      if (keys.right) playerX += 5.2;
      playerX = Math.max(18, Math.min(canvas.width - 18, playerX));

      spawnTimer += 1;
      if (spawnTimer >= 28) {
        spawnTimer = 0;
        spawnDrop();
      }

      drawBackdrop();
      drawPixelJunimo(playerX, canvas.height - 32);

      // Draw lives top-right
      for (let i = 0; i < lives; i++) {
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(canvas.width - 20 - i * 16, 10, 10, 10);
      }

      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.y += d.vy;
        drawDrop(d);

        if (Math.abs(d.x - playerX) < 18 && Math.abs(d.y - (canvas.height - 32)) < 16) {
          drops.splice(i, 1);
          if (d.type === "rock") {
            lives -= 1;
            if (lives <= 0) {
              running = false;
              startBtn.textContent = "Play Again";
              drawIdle(`Game Over! Score: ${score}`);
              return;
            }
          } else {
            score += d.type === "star" ? 5 : 1;
            scoreEl.textContent = String(score);
            if (score > best) {
              best = score;
              bestEl.textContent = String(best);
              try { localStorage.setItem(BEST_KEY, String(best)); } catch (_) {}
            }
          }
          continue;
        }
        if (d.y > canvas.height + 16) drops.splice(i, 1);
      }

      rafId = requestAnimationFrame(tick);
    };

    const startGame = () => {
      cancelAnimationFrame(rafId);
      score = 0;
      lives = 3;
      drops = [];
      spawnTimer = 0;
      scoreEl.textContent = "0";
      running = true;
      startBtn.textContent = "Restart";
      tick();
    };

    startBtn.addEventListener("click", startGame);

    const movePointer = (clientX) => {
      if (!running) return;
      const rect = canvas.getBoundingClientRect();
      playerX = ((clientX - rect.left) / rect.width) * canvas.width;
    };
    canvas.addEventListener("pointermove", (e) => movePointer(e.clientX));
    canvas.addEventListener("touchmove", (e) => {
      if (e.touches[0]) movePointer(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
      if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
      if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
    });

    drawIdle("Press Play to catch Apples (+1) & Starfruits (+5)!");
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
