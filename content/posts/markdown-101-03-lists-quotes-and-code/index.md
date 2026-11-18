---
title: "How to Write Lists, Blockquotes, and Code Blocks in Markdown (Markdown 101 - Part 03)"
date: "2026-11-17"
author: "Dyn"
slug: "markdown-101-03-lists-quotes-and-code"
category: "Markdown 101"
series: "Markdown 101"
description: "Learn how to format bulleted, numbered, and nested lists, blockquotes with attribution, inline code, and syntax-highlighted code blocks in Markdown."
tags: ["markdown", "markdown-101"]
draft: false
---

*Markdown 101 · Part 3/10*

Use `-` for unordered items, `1.` for sequential steps, `>` for blockquotes, and backticks (`` ` ``) for inline code or multi-line code blocks.

## Unordered, Ordered, and Nested Lists

Use `-` (or `*`) for peer items, and `1.`, `2.`, `3.` when order matters:

```markdown
What you need:

- A text editor.
- A Markdown file.

Steps to publish:

1. Create `post.md`.
2. Write the draft.
   - Check spelling and links.
3. Preview and publish.
```

Indent nested sub-items by **2 or 4 spaces**, and always leave a blank line before starting a list. For interactive task lists in Obsidian, GitHub, or Hugo, use `- [ ]` and `- [x]`.

## Blockquotes With Context

```markdown
> Write one idea clearly before moving on to the next.
```

Prefix lines with `>` to create a blockquote. When quoting someone else's work, always include the author's name and a link to the original source below the quote.

## Inline Code and Fenced Code Blocks

- **Inline code**: wrap filenames, commands, or shortcuts in single backticks, such as `` `post.md` ``.
- **Code blocks**: wrap multiple lines in triple backticks (```` ``` ````) and specify the language (`markdown`, `bash`, `python`, `yaml`) right after the opening fence for syntax highlighting:

````text
```markdown
## Today's Note

- Write one paragraph.
- Proofread once.
```
````

If your code block itself contains triple backticks (as in Markdown tutorials), wrap the outer block in **four backticks** (````` ```` `````). Forgetting the closing fence turns the rest of your document into code.

## Practice Now

Convert the first three lines into a numbered list, keep the blockquote, and inspect how the fenced code block renders.

{{< markdown-practice task="Convert the first three lines into a numbered list (1. 2. 3.), keep the blockquote, and add a second line inside the code block." hint="Use 1. 2. 3. for ordered steps, > for blockquotes, and triple backticks with markdown for the code block." >}}
Create the file.
Write the draft.
Proofread.

> Write one idea clearly.

```markdown
## Example inside a code block
```
{{< /markdown-practice >}}

Source: [CommonMark Lists, Quotes & Code](https://commonmark.org/help/).

---

**In the Markdown 101 series:**

- [Part 01: What Is Markdown and How to Create Your First .md File](/posts/markdown-101-01-getting-started/)
- [Part 02: How to Write Headings, Paragraphs, and Emphasis in Markdown](/posts/markdown-101-02-headings-and-paragraphs/)
- **Part 03: How to Write Lists, Blockquotes, and Code Blocks in Markdown** *(reading)*
- [Part 04: How to Add Links and SEO-Friendly Images in Markdown](/posts/markdown-101-04-links-and-images/)
- [Part 05: Minimal Markdown Post Template and YAML Front Matter for Blogs](/posts/markdown-101-05-templates-and-yaml/)
- [Part 06: How to Preview and Publish Markdown Posts to Hugo on GitHub Pages](/posts/markdown-101-06-preview-and-publish-hugo/)
- [Part 07: How to Create Tables and Horizontal Rules in Markdown](/posts/markdown-101-07-tables-and-rules/)
- [Part 08: How to Write Checklists, Footnotes, and Escaped Characters in Markdown](/posts/markdown-101-08-checklists-footnotes-escape/)
- [Part 09: How to Use Obsidian Callouts and Wikilinks and Export Cleanly to Hugo](/posts/markdown-101-09-obsidian-callouts-wikilinks/)
- [Part 10: Capstone Practice - Write a Complete Markdown Article from Scratch](/posts/markdown-101-10-capstone-practice/)
