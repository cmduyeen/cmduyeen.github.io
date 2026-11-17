---
title: "How to Create Tables and Horizontal Rules in Markdown (Markdown 101 - Part 07)"
date: "2026-11-17"
author: "Dyn"
slug: "markdown-101-07-tables-and-rules"
category: "Markdown 101"
series: "Markdown 101"
description: "Learn how to build tables in Markdown using pipes and hyphens, align columns left/center/right, insert line breaks in cells, and add horizontal rules."
tags: ["markdown", "markdown-101"]
draft: false
---

*Markdown 101 · Part 7/10*

Use pipes `|` to separate columns and a row of hyphens `---` beneath the header row to create a Markdown table. To divide major sections, place `---` on its own blank line to draw a horizontal rule.

## Build a Basic Table

Tables are part of GitHub Flavored Markdown (GFM) and work natively in Hugo, Obsidian, and GitHub:

```markdown
| Syntax | Meaning | Example |
| --- | --- | --- |
| `#` | Heading | `# Chapter 1` |
| `-` | List | `- Task 1` |
```

The first row defines column headers. The second row must contain at least three hyphens `---` per column, and every data row should match the header column count.

## Align Columns Left, Center, or Right

Add colons `:` to the separator row to control alignment for an entire column:

```markdown
| Item | Quantity | Price |
| :--- | :---: | ---: |
| Notebook | 2 | $12.00 |
| Pen | 5 | $4.50 |
```

- `:---` aligns left (default).
- `:---:` centers text.
- `---:` aligns right, ideal for numbers and prices.

## Horizontal Rules and Multi-Line Cells

Place `---` (or `***`) on its own line with a blank line above it to render a horizontal divider. Without a blank line above `---`, Markdown parsers treat the preceding line as a level-2 heading.

If you need a line break inside a table cell, use `<br>`—pressing Enter directly will break the table row.

## Practice Now

Add a third row to the table below and insert a horizontal rule `---` beneath it.

{{< markdown-practice task="Add one new row to the table and place a horizontal rule --- below the table." hint="Separate columns with |. Leave a blank line above --- to create a horizontal rule." >}}
| Tool | Purpose |
| :--- | :--- |
| Obsidian | Note-taking and knowledge base |
| Hugo | Static website generator |
{{< /markdown-practice >}}

Source: [GitHub Flavored Markdown Spec: Tables](https://github.github.com/gfm/#tables-extension-).

---

**In the Markdown 101 series:**

- [Part 01: What Is Markdown and How to Create Your First .md File](/en/posts/markdown-101-01-getting-started/)
- [Part 02: How to Write Headings, Paragraphs, and Emphasis in Markdown](/en/posts/markdown-101-02-headings-and-paragraphs/)
- [Part 03: How to Write Lists, Blockquotes, and Code Blocks in Markdown](/en/posts/markdown-101-03-lists-quotes-and-code/)
- [Part 04: How to Add Links and SEO-Friendly Images in Markdown](/en/posts/markdown-101-04-links-and-images/)
- [Part 05: Minimal Markdown Post Template and YAML Front Matter for Blogs](/en/posts/markdown-101-05-templates-and-yaml/)
- [Part 06: How to Preview and Publish Markdown Posts to Hugo on GitHub Pages](/en/posts/markdown-101-06-preview-and-publish-hugo/)
- **Part 07: How to Create Tables and Horizontal Rules in Markdown** *(reading)*
- [Part 08: How to Write Checklists, Footnotes, and Escaped Characters in Markdown](/en/posts/markdown-101-08-checklists-footnotes-escape/)
- [Part 09: How to Use Obsidian Callouts and Wikilinks and Export Cleanly to Hugo](/en/posts/markdown-101-09-obsidian-callouts-wikilinks/)
- [Part 10: Capstone Practice - Write a Complete Markdown Article from Scratch](/en/posts/markdown-101-10-capstone-practice/)
