---
title: "From Obsidian to GitHub Pages, Part 2: Publish Markdown with Hugo"
date: 2026-10-15T09:00:00+07:00
draft: false
tags: ["obsidian", "markdown", "hugo", "github-pages", "publishing-workflow"]
cover:
  image: "/images/posts/hugo-publishing.svg"
  alt: "A Markdown document moving through Hugo toward a published website"
---

In [Part 1](/posts/obsidian-to-github-blog-01-publishable-vault/), we set up Obsidian to edit the blog's Markdown source. Now we'll publish a post and see how it reaches the live site.

## Save the note in Hugo's content folder

Create or edit a `.md` file in `content/posts/`. A published article needs front matter with a title, date, `draft: false`, and any useful tags:

```yaml
---
title: "My first Obsidian post"
date: 2026-10-16T21:00:00+07:00
draft: false
tags: ["obsidian", "first-post"]
---
```

Write the article below the front matter using standard Markdown headings, paragraphs, lists, code fences, and links. A preview in Obsidian checks the Markdown formatting, but it does not fully reproduce the PaperMod theme; check the deployed page after publishing too.

## Push with GitHub Desktop

When the note is ready:

1. Review the changed files and confirm only intended public content is included.
2. Enter a short commit message, such as `Add first Obsidian blog post`.
3. Commit the changes on `main` and push them to GitHub.

This push triggers the existing **Build and deploy blog** workflow. GitHub Actions checks out the PaperMod theme, builds the site with Hugo Extended, and deploys the generated files to GitHub Pages. You do not need to run Hugo locally just to publish.

The blog's source repository is [cmduyeen.github.io on GitHub](https://github.com/cmduyeen/cmduyeen.github.io), and the live site is [cmduyeen.github.io](https://cmduyeen.github.io/). Check the workflow run if a change does not appear; a successful Git push does not by itself prove that the build and deployment succeeded.

## Avoid common publishing surprises

- A post with `draft: true` is omitted from the normal production build.
- A file outside `content/posts/` is not automatically an article.
- A change saved in Obsidian but not committed and pushed stays only on your computer.
- Obsidian plugins and wikilinks are not required; use ordinary Markdown for portable content.
- Keep secrets and private notes out of the public blog repository.

## Next: test the complete chain

After deployment, the new post should appear on the home page, its tag page, and the RSS feed at [`/index.xml`](https://cmduyeen.github.io/index.xml). In [Part 3](/posts/obsidian-to-github-blog-03-test-rss-and-profile-sync/), we'll use those outputs to test the profile README sync.
