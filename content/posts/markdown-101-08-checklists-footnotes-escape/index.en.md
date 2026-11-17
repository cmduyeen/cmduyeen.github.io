---
title: "How to Write Checklists, Footnotes, and Escaped Characters in Markdown (Markdown 101 - Part 08)"
date: "2026-11-17"
author: "Dyn"
slug: "markdown-101-08-checklists-footnotes-escape"
category: "Markdown 101"
series: "Markdown 101"
description: "Learn how to write interactive task checklists, numbered footnotes, strikethrough text, and backslash-escaped characters in Markdown."
tags: ["markdown", "markdown-101"]
draft: false
---

*Markdown 101 · Part 8/10*

Use `- [ ]` for task checklists, `[^1]` for footnotes, and a backslash `\` to display literal Markdown symbols like `*`, `#`, or `[` without triggering formatting.

## Task Checklists

Checklists let you track progress directly inside plain-text notes (supported in Obsidian, GitHub, and Hugo):

```markdown
- [x] Finish the first draft
- [ ] Proofread grammar and links
- [ ] Preview in browser
```

Always leave a space between `-` and `[ ]`. Inside the brackets, use a single space for incomplete items or a lowercase `x` for completed items.

## Footnotes for References

When you want to add an explanation or citation without interrupting the main paragraph, use footnotes:

```markdown
Markdown was created in 2004 to stay readable in plain text[^1].

[^1]: Designed by John Gruber with significant input from Aaron Swartz.
```

Place the `[^1]: ...` definition at the bottom of your document; Hugo automatically numbers footnotes and links them back and forth.

## Strikethrough and Escaping Special Characters

- **Strikethrough**: wrap text in double tildes `~~outdated~~` to show removed or revised items.
- **Escaping symbols**: prefix `*`, `#`, `-`, or `\` with a backslash `\` whenever you want the literal character (for example, `\*keep asterisks\*` or `\#not-a-heading`).

## Practice Now

Turn the bullet items below into a checklist (first item checked) and escape the asterisks on the last line.

{{< markdown-practice task="Convert the first two lines into a checklist (- [x] and - [ ]), and place \\ before each * on the last line." hint="Use - [x] for done and - [ ] for pending. Add \\ right before both asterisks." >}}
- Write the outline
- Add concrete examples

*Keep literal asterisks*
{{< /markdown-practice >}}

Source: [GitHub Flavored Markdown Spec](https://github.github.com/gfm/) and [CommonMark Backslash Escapes](https://commonmark.org/help/).

---

**In the Markdown 101 series:**

- [Part 01: What Is Markdown and How to Create Your First .md File](/en/posts/markdown-101-01-getting-started/)
- [Part 02: How to Write Headings, Paragraphs, and Emphasis in Markdown](/en/posts/markdown-101-02-headings-and-paragraphs/)
- [Part 03: How to Write Lists, Blockquotes, and Code Blocks in Markdown](/en/posts/markdown-101-03-lists-quotes-and-code/)
- [Part 04: How to Add Links and SEO-Friendly Images in Markdown](/en/posts/markdown-101-04-links-and-images/)
- [Part 05: Minimal Markdown Post Template and YAML Front Matter for Blogs](/en/posts/markdown-101-05-templates-and-yaml/)
- [Part 06: How to Preview and Publish Markdown Posts to Hugo on GitHub Pages](/en/posts/markdown-101-06-preview-and-publish-hugo/)
- [Part 07: How to Create Tables and Horizontal Rules in Markdown](/en/posts/markdown-101-07-tables-and-rules/)
- **Part 08: How to Write Checklists, Footnotes, and Escaped Characters in Markdown** *(reading)*
- [Part 09: How to Use Obsidian Callouts and Wikilinks and Export Cleanly to Hugo](/en/posts/markdown-101-09-obsidian-callouts-wikilinks/)
- [Part 10: Capstone Practice - Write a Complete Markdown Article from Scratch](/en/posts/markdown-101-10-capstone-practice/)
