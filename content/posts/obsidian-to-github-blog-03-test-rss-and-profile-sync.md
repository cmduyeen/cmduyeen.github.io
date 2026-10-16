---
title: "From Obsidian to GitHub Pages, Part 3: Test RSS and Profile Sync"
date: 2026-10-16T20:30:00+07:00
draft: false
tags: ["obsidian", "hugo", "rss", "github-pages", "github-profile", "publishing-workflow"]
cover:
  image: "/images/posts/rss-profile-sync.svg"
  alt: "An RSS feed connecting a blog article to a GitHub profile"
---

We've written a post in Obsidian and pushed it through Hugo to GitHub Pages. This final part verifies the two public outputs that make the workflow useful: the blog's RSS feed and the blog-post list in the GitHub profile README.

## Check the deployed article and feed

After pushing to `main`, open the **Build and deploy blog** workflow in the blog repository. Wait for both the build and deploy jobs to finish successfully, then visit the site's home page and open the article.

The RSS feed is [`https://cmduyeen.github.io/index.xml`](https://cmduyeen.github.io/index.xml). It should return XML with a `<channel>` and an `<item>` for each published post. If the new article is missing, check that:

- The post is under `content/posts/`.
- Its front matter is valid and `draft` is `false`.
- The Pages deployment for the latest commit succeeded.
- You are checking after the deployment has completed; a cached response can briefly show an older version.

## Understand when the profile updates

The profile repository reads the Hugo RSS feed and updates the **Dyn | Notes** post list in its README. Its workflow runs once daily at **00:17 Vietnam time**, or you can start **Update profile README** manually from the profile repository's Actions tab to test a new post right away.

This keeps the routine automation small: publishing a post triggers one Pages build, while the profile refresh happens on its existing daily schedule. Manually dispatch the profile workflow only when you want to verify the sync immediately; no new plugin, paid service, or extra scheduled job is needed.

## Verify the profile README

After the profile workflow succeeds, open the profile repository's `README.md` and check the **Dyn | Notes** section. The new article should appear as a dated link. The workflow keeps only the five most recent feed entries, so older posts eventually roll off that short list while remaining available on the blog.

If the blog workflow succeeded but the profile workflow failed, inspect its **Update blog posts** step. A feed-fetch error usually means the RSS URL was unavailable at that moment or the Pages deployment had not finished yet. Once the feed is live, rerun the profile workflow.

## The whole path

```text
Obsidian Markdown
    -> commit and push to main
    -> Hugo build and GitHub Pages deployment
    -> public article and RSS feed
    -> daily or manually dispatched profile README update
```

That is the complete test: make a small edit in Obsidian, push it, wait for the blog deployment, then run the profile workflow if you don't want to wait for the daily refresh. The earlier parts are [Part 1: Build a publishable vault](/posts/obsidian-to-github-blog-01-publishable-vault/) and [Part 2: Publish Markdown with Hugo](/posts/obsidian-to-github-blog-02-publish-with-hugo/).
