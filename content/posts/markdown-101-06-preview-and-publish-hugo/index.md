---
title: "How to Preview and Publish Markdown Posts to Hugo on GitHub Pages (Markdown 101 - Part 06)"
date: "2026-11-17"
author: "Dyn"
slug: "markdown-101-06-preview-and-publish-hugo"
category: "Markdown 101"
series: "Markdown 101"
description: "A practical pre-publish checklist for Markdown drafts: preview locally with Hugo, publish safely to GitHub Pages, and verify live SEO signals."
tags: ["markdown", "markdown-101", "hugo"]
draft: false
---

*Markdown 101 · Part 6/10*

Before publishing a Markdown draft from Obsidian to Hugo, review the content against a short checklist, preview the rendered HTML locally with `hugo server`, and verify the live URL after deployment. The `blog` commands below are part of Dyn's custom workflow.

## Pre-Publish Quality Checklist

- **Direct opening**: Do the first 1–2 sentences answer the reader's main question?
- **Heading hierarchy**: Exactly one `H1` (from the post title), with `##` and `###` in logical order.
- **Complete YAML**: Unique `Mô tả`, lowercase hyphenated `Slug`, `Chuyên mục`, and `tags`.
- **Clean Markdown**: Closed code fences, meaningful image `alt` text, and zero local drive paths.

## Preview Locally With Hugo

Run the preview server in your Terminal (or click **Preview** in `blog ui`):

```powershell
blog preview
```

This builds a local preview—including drafts—at `http://127.0.0.1:1313`. Because Obsidian-specific syntax (such as `wikilinks`) renders differently on the web, always use standard Markdown links for public navigation.

## Publish to GitHub Pages

Before publishing, verify `Ngày xuất bản` in YAML (if blank, the converter falls back to `Ngày tạo`), then run:

```powershell
blog publish "markdown-101-01-getting-started"
```

The script converts the Obsidian note into a Hugo bundle, verifies the build with `hugo --gc --minify`, commits, and pushes to GitHub. Keep unfinished parts in draft status and only add links to parts that are already live.

## Post-Deploy Verification

1. Open the live URL on `cmduyeen.github.io` and check layout, code blocks, and images on both desktop and mobile.
2. Click every internal link and reference link.
3. Confirm the post appears in [Archive](/archives/) and `/en/sitemap.xml`.
4. If your domain is verified in Google Search Console, run *URL Inspection* to check indexing status.

## Practice Now

Fix the draft snippet below: add a space after `##`, remove the filler intro, and turn the checklist items into a bulleted list.

{{< markdown-practice task="Fix the heading syntax, remove the filler sentence, and format the last three lines as a bulleted list." hint="Add a space after ##. Prefix each checklist item with - and a space." >}}
##Ready to Publish

In today's article, we will explore how to start writing.
Create a .md file and write one clear idea.

Check spelling.
Test all links.
Preview in Hugo.
{{< /markdown-practice >}}

Source: [Hugo Content Management](https://gohugo.io/content-management/formats/).

---

**In the Markdown 101 series:**

- [Part 01: What Is Markdown and How to Create Your First .md File](/posts/markdown-101-01-getting-started/)
- [Part 02: How to Write Headings, Paragraphs, and Emphasis in Markdown](/posts/markdown-101-02-headings-and-paragraphs/)
- [Part 03: How to Write Lists, Blockquotes, and Code Blocks in Markdown](/posts/markdown-101-03-lists-quotes-and-code/)
- [Part 04: How to Add Links and SEO-Friendly Images in Markdown](/posts/markdown-101-04-links-and-images/)
- [Part 05: Minimal Markdown Post Template and YAML Front Matter for Blogs](/posts/markdown-101-05-templates-and-yaml/)
- **Part 06: How to Preview and Publish Markdown Posts to Hugo on GitHub Pages** *(reading)*
- [Part 07: How to Create Tables and Horizontal Rules in Markdown](/posts/markdown-101-07-tables-and-rules/)
- [Part 08: How to Write Checklists, Footnotes, and Escaped Characters in Markdown](/posts/markdown-101-08-checklists-footnotes-escape/)
- [Part 09: How to Use Obsidian Callouts and Wikilinks and Export Cleanly to Hugo](/posts/markdown-101-09-obsidian-callouts-wikilinks/)
- [Part 10: Capstone Practice - Write a Complete Markdown Article from Scratch](/posts/markdown-101-10-capstone-practice/)
