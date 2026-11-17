---
title: "Configuring Serein Colorscheme for Neovim with Lazy.nvim, TreeSitter & Lualine"
date: "2026-11-14"
author: "Dyn"
category: "Vim & Neovim"
tags: ["neovim", "lua", "neovim-colorscheme", "treesitter", "lazy-nvim", "serein-theme", "minimalist-editor"]
description: "A comprehensive guide to installing and configuring Serein—a warm, low-contrast Neovim colorscheme written natively in Lua with TreeSitter and LSP highlights."
slug: "neovim-lua-setup-serein-colorscheme-treesitter"
translationKey: "serein-neovim-guide"
draft: false
---


For modal editing enthusiasts and terminal maximalists, terminal colorschemes often suffer from two extremes: either washed-out low-contrast gray-on-black or harsh fluorescent highlights that overwhelm syntax hierarchy.

**[Serein for Neovim](https://github.com/cmduyeen/serein-neovim)** is a native Lua colorscheme designed specifically to solve this. Built upon the unified Serein design system by **[Dyn](https://cmduyeen.github.io/)**, it balances warm, organic background tones with readable foreground typography.

---

## 1. Why Serein for Neovim?

- **Pure Lua Architecture:** Fast initialization with zero runtime overhead.
- **TreeSitter Native:** Fine-grained semantic token highlight groups (`@keyword`, `@function`, `@variable.parameter`, `@markup.heading`).
- **Comprehensive Plugin Support:** Pre-configured highlight groups for `telescope.nvim`, `lualine.nvim`, `which-key.nvim`, `bufferline.nvim`, `nvim-cmp`, and `render-markdown.nvim`.
- **Seamless Light/Dark Toggle:** Instant switching between **Serein Alabaster** (Light) and **Serein Obsidian** (Dark) without restarting Neovim.

---

## 2. Installation with `lazy.nvim`

If you are using the modern [lazy.nvim](https://github.com/folke/lazy.nvim) plugin manager, create a new file in your Lua config directory:

`~/.config/nvim/lua/plugins/colorscheme.lua` (or `serein.lua`):

```lua
return {
  {
    "cmduyeen/serein-neovim",
    name = "serein.nvim",
    lazy = false,
    priority = 1000, -- Load before any other plugins
    config = function()
      require("serein").setup({
        variant = "obsidian", -- Choose "obsidian" (dark) or "alabaster" (light)
        transparent = false,  -- Set to true if you prefer terminal transparency
        integrations = {
          treesitter = true,
          telescope = true,
          cmp = true,
          which_key = true,
          bufferline = true,
        },
      })
      vim.cmd.colorscheme("serein")
    end,
  },
}
```

---

## 3. Pairing Serein with `lualine.nvim`

Serein includes dedicated statusline integration for `lualine.nvim`. Simply pass `"serein"` as your theme:

```lua
return {
  {
    "nvim-lualine/lualine.nvim",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    opts = {
      options = {
        theme = "serein",
        component_separators = { left = "", right = "" },
        section_separators = { left = "", right = "" },
      },
    },
  },
}
```

This pairs your active Vim mode (Normal, Insert, Visual, Command) with subtle semantic accents without high-contrast neon bars distracting your peripheral vision.

---

## 4. Keybinding: Instant Light/Dark Mode Switcher

Want to switch from dark mode at night to light mode when working in a sunlit room? Serein provides a built-in toggle helper:

```lua
-- Toggle between Serein Obsidian and Alabaster with <leader>ut
vim.keymap.set("n", "<leader>ut", function()
  require("serein").toggle()
end, { desc = "Toggle Serein Light/Dark Theme" })
```

---

## 5. Integrating with Writing & Markdown Plugins

If you use Neovim for note-taking and documentation alongside [render-markdown.nvim](https://github.com/MeanderingProgrammer/render-markdown.nvim) or [obsidian.nvim](https://github.com/epwalsh/obsidian.nvim), Serein automatically styles markdown headers, inline code spans, and callout boxes with gentle, readable background tiers.

---

## Build Your Complete Workspace

Combine Neovim with the matching Serein toolset:

- 🖥️ **[Serein for Windows Terminal](https://github.com/cmduyeen/serein-terminal)** — Matching ANSI terminal colors.
- 📓 **[Serein for Obsidian](https://github.com/cmduyeen/serein-obsidian)** — Your companion markdown knowledge base.
- 💻 **[Serein for VS Code](https://github.com/cmduyeen/serein-vscode)** — GUI editor port for multi-window team collaboration.
- 🌿 **[All Serein Theme Ports](https://github.com/cmduyeen/serein-theme)** — The central design repository.

*Crafted by **[Dyn (cmduyeen)](https://cmduyeen.github.io/)**. Read more terminal tips on [Dyn's Blog](https://cmduyeen.github.io/) or star the repo on [GitHub](https://github.com/cmduyeen/serein-neovim).*
