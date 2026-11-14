---
title: "How to Build a Warm Minimalist Dev Setup with VS Code & Windows Terminal"
date: "2026-11-14"
author: "Dyn"
category: "Developer Environment"
tags: ["vscode-theme", "windows-terminal", "serein-theme", "minimalist-setup", "powershell", "wsl", "developer-productivity"]
description: "A complete step-by-step tutorial on styling Visual Studio Code and Windows Terminal with the warm, low-distraction Serein color suite."
slug: "setup-guide-serein-vscode-windows-terminal"
translationKey: "serein-vscode-guide"
draft: false
---

# How to Build a Warm Minimalist Dev Setup with VS Code & Windows Terminal

When transitioning between your code editor and terminal hundreds of times each day, a mismatch in color temperatures can cause noticeable eye strain. If your editor is bathed in a dark purple theme while your terminal defaults to stark pitch-black with neon-cyan text, your eyes are forced to re-adjust with every `Alt + Tab`.

In this tutorial, we will configure **Visual Studio Code** and **Windows Terminal** using **[Serein](https://github.com/cmduyeen/serein-theme)**—a minimalist warm color suite created by **[Dyn](https://cmduyeen.github.io/)** featuring **Alabaster** (Light) and **Obsidian** (Dark) palettes.

---

## Part 1: Installing & Configuring Serein for VS Code

[Serein for VS Code](https://github.com/cmduyeen/serein-vscode) eliminates competing syntax highlights and balances workbench contrast according to WCAG 2.1 AA standards.

### Step 1: Install the Theme
1. Download the latest `serein-vscode-*.vsix` file from the **[GitHub Releases page](https://github.com/cmduyeen/serein-vscode/releases/latest)**.
2. In VS Code, press `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS) to bring up the Command Palette.
3. Type and select:
   ```text
   Extensions: Install from VSIX...
   ```
4. Choose the downloaded `.vsix` file.
5. Press `Ctrl + K, Ctrl + T` to activate the theme picker and choose either:
   - **Serein Alabaster** (Gentle daylight ivory)
   - **Serein Obsidian** (Soothing late-night charcoal)

### Step 2: Recommended VS Code Settings
To get the most out of Serein’s typography and quiet layout, open your `settings.json` and add the following configuration:

```json
{
  "workbench.colorTheme": "Serein Obsidian",
  "editor.fontSize": 14.5,
  "editor.lineHeight": 1.65,
  "editor.letterSpacing": 0.3,
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.renderLineHighlight": "all",
  "editor.bracketPairColorization.enabled": false,
  "editor.guides.bracketPairs": "active",
  "workbench.tree.indent": 14,
  "workbench.layoutControl.enabled": false
}
```

> **Why disable bracket pair rainbow colors?**
>
> Rainbow brackets introduce visual distraction. Serein's subtle active bracket guides indicate code nesting clearly without scattering conflicting neon colors across your screen.

---

## Part 2: Installing Serein on Windows Terminal

[Serein for Windows Terminal](https://github.com/cmduyeen/serein-terminal) coordinates seamlessly with your VS Code setup across PowerShell, Command Prompt, Git Bash, and WSL (Ubuntu/Debian).

### Method 1: The Automated PowerShell Installer (Recommended)
1. Download and extract `serein-terminal-0.1.0.zip` from the **[Releases repository](https://github.com/cmduyeen/serein-terminal/releases/latest)**.
2. Open PowerShell 7 in the extracted directory.
3. Run the installer to apply Serein Obsidian (Dark) as your default profile:
   ```powershell
   ./install.ps1 -Mode Dark -SetDefault -Launch
   ```
   *(Or pass `-Mode Light` to apply Serein Alabaster).*

### Method 2: Manual JSON Configuration
If you prefer adding the schemes manually, open Windows Terminal Settings (`Ctrl + ,`), click **Open JSON file** at the bottom left, and paste the following schemes into your `"schemes"` array:

```json
{
  "name": "Serein Obsidian",
  "background": "#191817",
  "foreground": "#C7C3BA",
  "cursorColor": "#C9848F",
  "selectionBackground": "#2B2926",
  "black": "#191817",
  "red": "#CF8179",
  "green": "#9FAE94",
  "yellow": "#BAA16B",
  "blue": "#98A9BD",
  "purple": "#C9848F",
  "cyan": "#93A8A0",
  "white": "#C7C3BA",
  "brightBlack": "#5C5852",
  "brightRed": "#D9938B",
  "brightGreen": "#B0BEA5",
  "brightYellow": "#C7B17E",
  "brightBlue": "#A9B9CB",
  "brightPurple": "#D698A2",
  "brightCyan": "#A3B7B0",
  "brightWhite": "#EDEAE4"
}
```

---

## Part 3: The Unified Workflow Experience

Once both tools are configured with Serein, your workflow feels uninterrupted:
- Running `git status`, `npm run dev`, or inspecting logs in Windows Terminal reflects the identical semantic colors (green additions, red deletions, warm yellow warnings) as your VS Code editor.
- The warm canvas eliminates sudden pupil constriction, keeping your visual focus sharp throughout long coding stretches.

---

## Complete Your Workspace

Explore the rest of the Serein ecosystem to style your notes, desktop, and terminal editors:

- 💻 **[Serein for Neovim](https://github.com/cmduyeen/serein-neovim)** — Native Lua terminal colorscheme with TreeSitter.
- 📓 **[Serein for Obsidian](https://github.com/cmduyeen/serein-obsidian)** — Distraction-free markdown vault styling.
- 🪟 **[Serein for Windows](https://github.com/cmduyeen/serein-windows)** — System theme and matching 4K wallpapers.
- 🌿 **[The Serein Hub & Full Palette](https://github.com/cmduyeen/serein-theme)** — The central design specification.

*Read more developer tutorials on **[Dyn's Notes](https://cmduyeen.github.io/)** or connect with me on **[GitHub (@cmduyeen)](https://github.com/cmduyeen)**.*
