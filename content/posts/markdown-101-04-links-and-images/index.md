---
title: "How to Add Links and SEO-Friendly Images in Markdown (Markdown 101 - Part 04)"
date: "2026-11-17"
author: "Dyn"
slug: "markdown-101-04-links-and-images"
category: "Markdown 101"
series: "Markdown 101"
description: "How to insert external links, internal anchor links, and images in Markdown with descriptive anchor text, alt attributes, and clean relative paths."
tags: ["markdown", "markdown-101"]
draft: false
---

*Markdown 101 · Part 4/10*

Add links with `[label](url)` and images with `![alt text](image-path)`. Good link labels describe the destination, and good alt text describes what the image shows for both accessibility and search engines.

## Descriptive Links and Internal Paths

```markdown
Read the [CommonMark syntax reference](https://commonmark.org/help/).
```

“CommonMark syntax reference” tells readers where the link leads—far better than vague labels like “click here”.

Common link patterns for blogs:

- **External link**: full URL `https://...`.
- **Internal post link**: root-relative path, such as `[Part 1: Getting Started](/posts/markdown-101-01-getting-started/)`.
- **Same-page anchor link**: `[Section Name](#section-name)` using lowercase letters and hyphens.
- **Hover title**: `[label](https://... "Short tooltip")`.

## Adding Images With Meaningful Alt Text

```markdown
![Live Markdown preview inside Hugo](hugo-markdown-preview.png)
```

Include images when they clarify a workflow or diagram. The text inside `[]` (`alt` text) appears if the image fails to load and helps screen readers and search engines understand the visual—avoid generic names like `image1` or `screenshot.png`.

In Dyn's Obsidian-to-Hugo workflow, images placed next to the note or in `Tệp đính kèm/` are copied automatically into the Hugo post bundle on publish.

## Avoid Local Drive Paths

Never reference local filesystem paths such as `D:\Brain2nd\...` in public articles—readers on the web cannot access files on your machine. Use short, lowercase, hyphenated filenames (e.g., `markdown-cheat-sheet.png`) and verify every image in Hugo preview before publishing.

## Practice Now

Replace the generic link label and image alt text below with clear, descriptive wording.

{{< markdown-practice task="Change the link label to a clear resource name and replace the image alt text with what the icon represents." hint="Keep the URL inside parentheses. Update the text inside square brackets; images keep the leading !." >}}
[Click here](https://commonmark.org/help/)

![Image 1](/favicon.svg)
{{< /markdown-practice >}}

Source: [CommonMark Links & Images](https://commonmark.org/help/).

---

**In the Markdown 101 series:**

- [Part 01: What Is Markdown and How to Create Your First .md File](/posts/markdown-101-01-getting-started/)
- [Part 02: How to Write Headings, Paragraphs, and Emphasis in Markdown](/posts/markdown-101-02-headings-and-paragraphs/)
- [Part 03: How to Write Lists, Blockquotes, and Code Blocks in Markdown](/posts/markdown-101-03-lists-quotes-and-code/)
- **Part 04: How to Add Links and SEO-Friendly Images in Markdown** *(reading)*
- [Part 05: Minimal Markdown Post Template and YAML Front Matter for Blogs](/posts/markdown-101-05-templates-and-yaml/)
- [Part 06: How to Preview and Publish Markdown Posts to Hugo on GitHub Pages](/posts/markdown-101-06-preview-and-publish-hugo/)
- [Part 07: How to Create Tables and Horizontal Rules in Markdown](/posts/markdown-101-07-tables-and-rules/)
- [Part 08: How to Write Checklists, Footnotes, and Escaped Characters in Markdown](/posts/markdown-101-08-checklists-footnotes-escape/)
- [Part 09: How to Use Obsidian Callouts and Wikilinks and Export Cleanly to Hugo](/posts/markdown-101-09-obsidian-callouts-wikilinks/)
- [Part 10: Capstone Practice - Write a Complete Markdown Article from Scratch](/posts/markdown-101-10-capstone-practice/)
