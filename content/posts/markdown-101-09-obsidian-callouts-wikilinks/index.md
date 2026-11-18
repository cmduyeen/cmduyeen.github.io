---
title: "How to Use Obsidian Callouts and Wikilinks and Export Cleanly to Hugo (Markdown 101 - Part 09)"
date: "2026-11-17"
author: "Dyn"
slug: "markdown-101-09-obsidian-callouts-wikilinks"
category: "Markdown 101"
series: "Markdown 101"
description: "Learn how Obsidian Callouts (> [!NOTE]), Wikilinks ([[Note]]), and highlights (==text==) work—and how to keep them clean when publishing to Hugo."
tags: ["markdown", "markdown-101", "obsidian"]
draft: false
---

*Markdown 101 · Part 9/10*

Obsidian extends standard Markdown with Callouts (`> [!NOTE]`), Wikilinks (`Note Title`), and highlights (`==text==`). When writing for a public Hugo blog, it helps to know which syntax converts automatically and which should stay standard Markdown.

## Callout Boxes in Obsidian

Callouts build on standard `>` blockquotes with a bracketed type tag on the first line:

```markdown
> [!NOTE] Quick Tip
> Answer the reader's core question in the opening two sentences.

> [!WARNING] Path Caution
> Never reference local drive paths in public blog posts.
```

Common built-in callout types include `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, and `[!CAUTION]`.

## Wikilinks and Highlights

- **Wikilinks**: link between personal notes using `Note Title` or `Display Label`.
- **Embedded images**: prefix with `!`, such as `!diagram.png`.
- **Highlights**: wrap text in double equals signs `==highlighted phrase==`.

## Publishing From Obsidian to Hugo

These extensions belong to Obsidian rather than core CommonMark:

- In Dyn's `blog.py` publisher, `!image.png` is automatically copied and converted into a Hugo image link, while `Note` brackets are stripped to plain text.
- For public internal links between blog posts, always use standard Markdown links like `[Part 1](/posts/markdown-101-01-getting-started/)` so web browsers resolve the URL properly.
- If your Hugo theme does not style Obsidian callouts or `==highlights==`, stick to standard `>` blockquotes and `**bold**` text for consistent rendering everywhere.

## Practice Now

Replace the Obsidian wikilink below with a standard Markdown link while keeping the blockquote intact.

{{< markdown-practice task="Replace Part 01 with a standard Markdown link pointing to /en/posts/markdown-101-01-getting-started/." hint="Use [Part 01](/posts/markdown-101-01-getting-started/) and keep the leading >." >}}
> Note: Review Part 01 before creating a new post.
{{< /markdown-practice >}}

Source: [Obsidian Help: Callouts & Formatting](https://help.obsidian.md/Editing+and+formatting/Callouts).

---

**In the Markdown 101 series:**

- [Part 01: What Is Markdown and How to Create Your First .md File](/posts/markdown-101-01-getting-started/)
- [Part 02: How to Write Headings, Paragraphs, and Emphasis in Markdown](/posts/markdown-101-02-headings-and-paragraphs/)
- [Part 03: How to Write Lists, Blockquotes, and Code Blocks in Markdown](/posts/markdown-101-03-lists-quotes-and-code/)
- [Part 04: How to Add Links and SEO-Friendly Images in Markdown](/posts/markdown-101-04-links-and-images/)
- [Part 05: Minimal Markdown Post Template and YAML Front Matter for Blogs](/posts/markdown-101-05-templates-and-yaml/)
- [Part 06: How to Preview and Publish Markdown Posts to Hugo on GitHub Pages](/posts/markdown-101-06-preview-and-publish-hugo/)
- [Part 07: How to Create Tables and Horizontal Rules in Markdown](/posts/markdown-101-07-tables-and-rules/)
- [Part 08: How to Write Checklists, Footnotes, and Escaped Characters in Markdown](/posts/markdown-101-08-checklists-footnotes-escape/)
- **Part 09: How to Use Obsidian Callouts and Wikilinks and Export Cleanly to Hugo** *(reading)*
- [Part 10: Capstone Practice - Write a Complete Markdown Article from Scratch](/posts/markdown-101-10-capstone-practice/)
