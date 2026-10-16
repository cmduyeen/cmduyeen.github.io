# Dyn

Personal blog by Dyn, built with Hugo and the PaperMod theme and deployed to GitHub Pages.
The site is available in English and Vietnamese. Translated posts share the same
filename with a `.vi.md` suffix, such as `my-post.md` and `my-post.vi.md`.

Update the GitHub, Ko-fi, and X links in `[params.socialIcons]` in `hugo.toml`
when the public profiles are ready.

## Writing a post

Open this repository as an Obsidian vault, then create a Markdown note under `content/posts/`. Keep private notes outside that folder; anything in `content/posts/` is intended for publication. Obsidian's local settings are ignored by Git.

Use this front matter at the top of each post:

```yaml
---
title: "Your post title"
date: 2026-10-16T21:00:00+07:00
draft: false
tags: ["your-topic", "another-topic"]
cover:
  image: "/images/posts/your-cover.svg"
  alt: "A short description of the cover image"
---
```

Post covers are stored locally in `static/images/posts/`, so they do not add third-party requests. The home-page list loads them lazily; lightweight SVG covers keep transfer sizes small. Keep the `cover` block to show a thumbnail beside the post.

Save the note and push the repository to `main` with GitHub Desktop or Git. GitHub Actions builds the blog and deploys it to Pages automatically. Hugo Extended is only needed for a local preview:

```powershell
hugo new content posts/my-post-title.md
```

For a local preview, set `draft: true` on unpublished posts and run `hugo server -D`.

## Obsidian publishing series

- [Part 1: Build an Obsidian vault for public writing](https://cmduyeen.github.io/posts/obsidian-to-github-blog-01-publishable-vault/)
- [Part 2: Publish Markdown with Hugo and GitHub Pages](https://cmduyeen.github.io/posts/obsidian-to-github-blog-02-publish-with-hugo/)
- [Part 3: Verify RSS and GitHub profile sync](https://cmduyeen.github.io/posts/obsidian-to-github-blog-03-test-rss-and-profile-sync/)

Vietnamese:

- [Phần 1: Tạo vault sẵn sàng xuất bản](https://cmduyeen.github.io/vi/posts/obsidian-to-github-blog-01-publishable-vault/)
- [Phần 2: Xuất bản Markdown bằng Hugo](https://cmduyeen.github.io/vi/posts/obsidian-to-github-blog-02-publish-with-hugo/)
- [Phần 3: Kiểm tra RSS và đồng bộ hồ sơ](https://cmduyeen.github.io/vi/posts/obsidian-to-github-blog-03-test-rss-and-profile-sync/)

## Local preview

Install Hugo Extended, then run:

```powershell
git submodule update --init --recursive
hugo server -D
```

The production site is available at <https://cmduyeen.github.io/> and its RSS feed at <https://cmduyeen.github.io/index.xml>.
