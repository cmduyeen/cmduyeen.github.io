---
title: "Minimal Markdown Post Template and YAML Front Matter for Blogs (Markdown 101 - Part 05)"
date: "2026-11-17"
author: "Dyn"
slug: "markdown-101-05-templates-and-yaml"
category: "Markdown 101"
series: "Markdown 101"
description: "Use a minimal Markdown article template and YAML front matter for Hugo blogs: learn key metadata fields, meta descriptions, and stable URL slugs."
tags: ["markdown", "markdown-101", "hugo"]
draft: false
---

*Markdown 101 · Part 5/10*

A reliable Markdown post template needs only a direct opening answer, clear `##` steps, a working example, and a YAML front matter block at the top so Hugo can build the page properly.

## A Minimal Article Skeleton

```markdown
Answer the reader's core question in 1–2 sentences.

## Steps

1. Complete the first step.
2. Verify the output.

## Example

Provide a concrete example readers can copy and test.

## Practice Now

Give one small exercise to apply the concept.
```

Focus each article on one search intent. When an example grows into a separate topic, split it into the next post in your series.

## Understanding YAML Front Matter

Front matter is the metadata block placed between two `---` lines at the very top of a Markdown file. Hugo reads it for the page title, meta description, publish date, taxonomy tags, and draft status.

In Dyn's Obsidian vault, notes use Vietnamese property names that `blog.py` translates into standard Hugo front matter on publish:

| Obsidian Property | Hugo Field | Purpose |
| --- | --- | --- |
| Filename / `title` | `title` | Page title (`H1`) |
| `Mô tả` | `description` | Meta & social preview summary |
| `Slug` | `slug` | Permanent URL segment |
| `Chuyên mục` / `Series` | `category` / `series` | Series & archive grouping |
| `Chủ đề` / `tags` | `tags` | Topic tags |
| `Ngày xuất bản` | `date` | Publication date |
| `Trạng thái` | `draft` | `Nháp` → `true`, `Đã đăng` → `false` |

```yaml
Trạng thái: Nháp
Ngôn ngữ: en
Mô tả: "Create your first UTF-8 Markdown file and learn essential formatting."
Slug: "markdown-101-01-getting-started"
```

## Writing Descriptions and Slugs for SEO

- **Meta `description`**: Write a natural 120–160 character sentence stating what the reader will learn or achieve. Avoid stuffing keywords.
- **`slug`**: Use lowercase ASCII words joined by hyphens (e.g., `markdown-101-05-templates-and-yaml`). Never change a slug after publishing unless you configure a redirect, or existing links will break.

## Practice Now

Fill in a custom `Mô tả` and `Slug` below while keeping `Trạng thái: Nháp`.

{{< markdown-practice task="Add a concise description and a hyphenated lowercase slug. Keep the post in draft status." hint="Slugs should be lowercase ASCII with hyphens. YAML here is displayed as text only for practice." >}}
---
Trạng thái: Nháp
Mô tả: ""
Slug: ""
---

## Steps

1. Pick one specific problem.
2. Write one working example.
{{< /markdown-practice >}}

Source: [Hugo Content Formats & Front Matter](https://gohugo.io/content-management/formats/).

---

**In the Markdown 101 series:**

- [Part 01: What Is Markdown and How to Create Your First .md File](/en/posts/markdown-101-01-getting-started/)
- [Part 02: How to Write Headings, Paragraphs, and Emphasis in Markdown](/en/posts/markdown-101-02-headings-and-paragraphs/)
- [Part 03: How to Write Lists, Blockquotes, and Code Blocks in Markdown](/en/posts/markdown-101-03-lists-quotes-and-code/)
- [Part 04: How to Add Links and SEO-Friendly Images in Markdown](/en/posts/markdown-101-04-links-and-images/)
- **Part 05: Minimal Markdown Post Template and YAML Front Matter for Blogs** *(reading)*
- [Part 06: How to Preview and Publish Markdown Posts to Hugo on GitHub Pages](/en/posts/markdown-101-06-preview-and-publish-hugo/)
- [Part 07: How to Create Tables and Horizontal Rules in Markdown](/en/posts/markdown-101-07-tables-and-rules/)
- [Part 08: How to Write Checklists, Footnotes, and Escaped Characters in Markdown](/en/posts/markdown-101-08-checklists-footnotes-escape/)
- [Part 09: How to Use Obsidian Callouts and Wikilinks and Export Cleanly to Hugo](/en/posts/markdown-101-09-obsidian-callouts-wikilinks/)
- [Part 10: Capstone Practice - Write a Complete Markdown Article from Scratch](/en/posts/markdown-101-10-capstone-practice/)
