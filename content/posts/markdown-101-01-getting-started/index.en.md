---
title: "What Is Markdown and How to Create Your First .md File (Markdown 101 - Part 01)"
date: "2026-11-17"
author: "Dyn"
slug: "markdown-101-01-getting-started"
category: "Markdown 101"
series: "Markdown 101"
description: "What is Markdown? Learn how to create your first UTF-8 .md file, understand plain-text formatting, and master the essential syntax table."
tags: ["markdown", "markdown-101"]
draft: false
---

*Markdown 101 · Part 1/10*

Markdown is a lightweight markup language that uses plain-text symbols—such as `#` for headings and `-` for lists—to format documents cleanly. You only need a `.md` file and any text editor (Notepad, VS Code, or Obsidian) to get started, with zero proprietary software or complex menus.

## Why Write in Markdown?

Because Markdown files are pure plain text, they remain readable on every operating system for decades. Without distracting font and layout toolbars, you can focus on structuring your ideas clearly.

Tools like Obsidian, GitHub, Notion, and static site generators such as Hugo all read `.md` files natively.

## Create Your First Markdown File

Open your text editor, create a file named `first-note.md`, and save it with **UTF-8** encoding:

```markdown
# A Quiet Morning Without Distractions

Today I spent 25 minutes writing before opening social media.

## Today's Tasks

- Mute notifications.
- Open a blank file.
- Write one clear idea.
```

Here, `#` creates the main heading, `##` creates a subheading, a blank line separates paragraphs, and `-` starts each bullet item.

## Essential Syntax Cheat Sheet

| Purpose | Markdown Syntax | Rendered Output |
| --- | --- | --- |
| Section heading | `## Heading` | Level-2 heading |
| Bold text | `**bold**` | **bold** |
| Italic text | `*italic*` | *italic* |
| Bullet list | `- Item one` | Bulleted item |
| Inline code | `` `command` `` | `command` |
| Link | `[label](https://...)` | Clickable link |

## Common Beginner Pitfalls

- **Accidentally saving as `.md.txt`**: On Windows, Notepad may append `.txt` automatically. Choose *Save as type: All Files* so the extension stays `.md`.
- **Encoding issues**: Always save as **UTF-8** (not ANSI) so accented characters and symbols display properly.
- **Missing space after `#` or `-`**: `#Heading` is treated as plain text; always add a space (`# Heading`).

## Practice Now

Create a `.md` file with one heading, two short paragraphs, and a three-item list, then preview it in your editor.

{{< markdown-practice task="Change the heading to what you want to write today. Add one paragraph and a three-item list." hint="Use # followed by a space for the heading. Separate paragraphs with a blank line; start each item with - and a space." >}}
# First Note

Today I want to write about one useful thing I just learned.

- Open a blank file.
- Write the main idea.
{{< /markdown-practice >}}

Source: [CommonMark Help](https://commonmark.org/help/).

---

**In the Markdown 101 series:**

- **Part 01: What Is Markdown and How to Create Your First .md File** *(reading)*
- [Part 02: How to Write Headings, Paragraphs, and Emphasis in Markdown](/en/posts/markdown-101-02-headings-and-paragraphs/)
- [Part 03: How to Write Lists, Blockquotes, and Code Blocks in Markdown](/en/posts/markdown-101-03-lists-quotes-and-code/)
- [Part 04: How to Add Links and SEO-Friendly Images in Markdown](/en/posts/markdown-101-04-links-and-images/)
- [Part 05: Minimal Markdown Post Template and YAML Front Matter for Blogs](/en/posts/markdown-101-05-templates-and-yaml/)
- [Part 06: How to Preview and Publish Markdown Posts to Hugo on GitHub Pages](/en/posts/markdown-101-06-preview-and-publish-hugo/)
- [Part 07: How to Create Tables and Horizontal Rules in Markdown](/en/posts/markdown-101-07-tables-and-rules/)
- [Part 08: How to Write Checklists, Footnotes, and Escaped Characters in Markdown](/en/posts/markdown-101-08-checklists-footnotes-escape/)
- [Part 09: How to Use Obsidian Callouts and Wikilinks and Export Cleanly to Hugo](/en/posts/markdown-101-09-obsidian-callouts-wikilinks/)
- [Part 10: Capstone Practice - Write a Complete Markdown Article from Scratch](/en/posts/markdown-101-10-capstone-practice/)
