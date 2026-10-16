# Dyn | Notes

Personal blog built with Hugo and the PaperMod theme, deployed to GitHub Pages.

## Writing a post

Create a Markdown post with:

```powershell
hugo new content posts/my-post-title.md
```

Edit the generated file, set `draft: false` when it is ready, then push to `main`. GitHub Actions builds and deploys the site automatically.

## Local preview

Install Hugo Extended, then run:

```powershell
git submodule update --init --recursive
hugo server -D
```

The production site is available at <https://cmduyeen.github.io/> and its RSS feed at <https://cmduyeen.github.io/index.xml>.
