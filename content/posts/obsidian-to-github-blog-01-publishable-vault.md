---
title: "From Obsidian to GitHub Pages, Part 1: Build a Publishable Vault"
date: 2026-10-14T09:00:00+07:00
draft: false
tags: ["obsidian", "markdown", "hugo", "publishing-workflow"]
---

This is the first post in a three-part series about writing in Obsidian and publishing to a Hugo blog on GitHub Pages. The goal is a small, transparent workflow: write plain Markdown, publish only the notes you choose, and let the existing site and profile automation do the rest.

1. **Part 1:** Set up an Obsidian vault for public writing.
2. [Part 2: Publish Markdown with Hugo and GitHub Pages](/posts/obsidian-to-github-blog-02-publish-with-hugo/)
3. [Part 3: Verify RSS and GitHub profile sync](/posts/obsidian-to-github-blog-03-test-rss-and-profile-sync/)

## Why use Obsidian for blog drafts?

Obsidian stores notes as ordinary Markdown files on your computer. That makes it a comfortable editor without locking the writing into a special export format. Hugo can turn those files into web pages, and GitHub Pages can host the generated site.

For this blog, the source files live in the `content/posts/` directory of the `cmduyeen.github.io` repository. Opening the repository folder as an Obsidian vault lets you write directly where Hugo expects published posts.

## Keep the publishing boundary clear

Treat `content/posts/` as public. A note placed there and pushed to the `main` branch is eligible to appear on the website and in the RSS feed.

Keep personal journals, rough ideas, credentials, and unpublished research in a separate vault or a folder outside the blog repository. The `.obsidian/` application settings are ignored by Git, but that is not a privacy boundary for your writing: check which files you stage before every push.

A simple structure is enough:

```text
cmduyeen.github.io/
├── content/
│   ├── posts/       # public articles
│   ├── archives.md
│   └── search.md
├── themes/
└── .obsidian/       # local settings; ignored by Git
```

You do not need an Obsidian publishing plugin for this workflow. Obsidian edits the Markdown; GitHub Actions handles the site build after you push.

## Start a post with Hugo front matter

Hugo uses front matter at the top of each Markdown file for its title, publication date, draft status, and tags:

```yaml
---
title: "A useful note"
date: 2026-10-16T21:00:00+07:00
draft: false
tags: ["obsidian", "workflow"]
---
```

Create a file such as `content/posts/my-useful-note.md` and write the article below the closing `---`. Keep `draft: true` while a post is not ready; switch it to `false` only when you intend to publish it. Use simple tags to make related posts discoverable on the blog.

Prefer regular Markdown links such as `[Part 2](/posts/obsidian-to-github-blog-02-publish-with-hugo/)` for links between published posts. Obsidian's `[[wikilinks]]` syntax is useful inside a vault, but Hugo does not automatically turn every wikilink into a website link.

## Your first check

In Obsidian, create a new note under `content/posts/`, add the front matter, and save it. Then inspect the repository's Git changes. The note should be the only writing file you intend to publish.

In [Part 2](/posts/obsidian-to-github-blog-02-publish-with-hugo/), we'll push that Markdown file and follow it through the automatic Hugo deployment.
