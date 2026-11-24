---
title: "Enshittification & Why I Moved Back to Plain-Text Tools"
date: 2026-11-24
draft: true
description: "Three practical lessons from Cory Doctorow's Enshittification and how owning plain-text files keeps your workflow fast and lock-in free."
tags: [minimalism, markdown, books, productivity]
---

Apps rarely get better over time. They start fast and generous, then slowly fill with pop-ups, telemetry, AI upsells, and proprietary formats that trap your work.

Cory Doctorow gives this decay a precise name in *Enshittification: Why Everything Suddenly Got Worse and What to Do About It* — explaining how platforms inevitably shift value away from users once switching costs get high enough.

{{< book title="Enshittification: Why Everything Suddenly Got Worse and What to Do About It" author="Cory Doctorow" url="" note="A sharp look at platform lock-in and why open, portable formats matter." >}}

## 3 Takeaways Applied to Daily Tools

First, choose files over apps. Store notes and writing in plain `.md` files instead of a proprietary database. Any text editor will still open them 20 years from now.

Second, delete before optimizing. Every plugin, tracker, or Electron wrapper adds maintenance tax. Replacing heavy GUI apps with `yazi`, `micro`, `ripgrep`, and `fzf` keeps navigation and editing instant:

```powershell
# Search notes by content, pick a match, and open it in micro
$file = rg --files-with-matches "plain text" D:\Brain2nd | fzf
if ($file) { micro $file }
```

Third, keep your publishing stack static. A static [Hugo](https://gohugo.io/) site with ~13KB of `main.css`, zero analytics scripts, and plain RSS cannot be throttled by an algorithm or locked behind a paywall.

## Trade-offs

Plain-text workflows are not effortless for everyone. You give up built-in real-time collaboration, rich mobile apps, and automatic cloud sync unless you wire up Git or Syncthing yourself. Terminal tools like `yazi` and `micro` also take a few days of muscle memory if you are used to mouse-driven editors.

## The Practical Rule

Whenever a tool asks for an account, background daemon, or proprietary sync just to edit local text, walk away. Plain text and open standards are the simplest defense against enshittification.
