---
title: "How to Write Headings, Paragraphs, and Emphasis in Markdown (Markdown 101 - Part 02)"
date: "2026-11-17"
author: "Dyn"
slug: "markdown-101-02-headings-and-paragraphs"
category: "Markdown 101"
series: "Markdown 101"
description: "Learn how to structure Markdown headings (H1–H6), separate paragraphs, insert line breaks, and apply bold, italic, or strikethrough emphasis."
tags: ["markdown", "markdown-101"]
draft: false
---

*Markdown 101 · Part 2/10*

Use `#`, `##`, and `###` to organize heading levels and a blank line to separate paragraphs in Markdown. Clear structure helps both readers and search engines scan your article effortlessly.

## Heading Levels from H1 to H6

Markdown supports six heading levels, from `#` (H1) to `######` (H6). In everyday articles, you will mostly use `##` for main sections and `###` for subsections:

```markdown
## The Problem I Wanted to Fix

I used to check my phone before starting to write.

## What Changed

I left my phone in another room and wrote for 25 minutes.

### Handling Interruptions

I jot down the next thought before switching tasks.
```

Always leave a space after `#`, and follow logical hierarchy instead of skipping from `##` to `####` just for smaller text.

On Hugo blogs, the post title automatically renders as the page's single `<h1>`. Start your article body with an opening paragraph followed by `##` headings so you never duplicate `<h1>`.

## Paragraphs vs. Line Breaks

```markdown
This is the first paragraph.

This is the second paragraph, separated by one blank line.
```

Pressing Enter once does not guarantee a new paragraph in rendered HTML. Always insert **one blank line** between paragraphs, keeping each paragraph focused on a single idea (1–3 sentences).

To force a soft line break inside the same paragraph (useful for addresses or poetry), add **two trailing spaces** or a backslash `\` at the end of the line.

## Balanced Text Emphasis

- `**bold**`: highlights key takeaways or important terms.
- `*italic*`: adds subtle emphasis or marks technical terms.
- `***bold and italic***`: combines both when genuinely needed.
- `~~strikethrough~~`: marks deprecated or removed text (supported in GitHub Flavored Markdown and Hugo).

Avoid bolding entire sentences or paragraphs—if everything is bold, nothing stands out.

## Practice Now

Split the sample text into two clear `##` sections, separate paragraphs with blank lines, and bold one key phrase.

{{< markdown-practice task="Split the text into two level-2 headings, separate into two paragraphs, and bold one key idea." hint="Add ## before each section title. Leave one blank line for a new paragraph. Wrap the key phrase in **." >}}
# Write Less, Say More

The Problem
I have many ideas but do not know where to start.
The Fix
I pick one idea and write one concrete example.
{{< /markdown-practice >}}

Source: [CommonMark Headings & Emphasis](https://commonmark.org/help/).

---

**In the Markdown 101 series:**

- [Part 01: What Is Markdown and How to Create Your First .md File](/en/posts/markdown-101-01-getting-started/)
- **Part 02: How to Write Headings, Paragraphs, and Emphasis in Markdown** *(reading)*
- [Part 03: How to Write Lists, Blockquotes, and Code Blocks in Markdown](/en/posts/markdown-101-03-lists-quotes-and-code/)
- [Part 04: How to Add Links and SEO-Friendly Images in Markdown](/en/posts/markdown-101-04-links-and-images/)
- [Part 05: Minimal Markdown Post Template and YAML Front Matter for Blogs](/en/posts/markdown-101-05-templates-and-yaml/)
- [Part 06: How to Preview and Publish Markdown Posts to Hugo on GitHub Pages](/en/posts/markdown-101-06-preview-and-publish-hugo/)
- [Part 07: How to Create Tables and Horizontal Rules in Markdown](/en/posts/markdown-101-07-tables-and-rules/)
- [Part 08: How to Write Checklists, Footnotes, and Escaped Characters in Markdown](/en/posts/markdown-101-08-checklists-footnotes-escape/)
- [Part 09: How to Use Obsidian Callouts and Wikilinks and Export Cleanly to Hugo](/en/posts/markdown-101-09-obsidian-callouts-wikilinks/)
- [Part 10: Capstone Practice - Write a Complete Markdown Article from Scratch](/en/posts/markdown-101-10-capstone-practice/)
