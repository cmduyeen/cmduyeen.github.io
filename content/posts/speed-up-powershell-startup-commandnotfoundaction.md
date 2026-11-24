---
title: "How I Sped Up PowerShell 7 Startup with CommandNotFoundAction"
date: 2026-11-24
draft: false
description: "Lazy-loading utility scripts with CommandNotFoundAction in PowerShell 7 cuts profile startup time while keeping custom CLI tools available."
tags: [powershell, terminal, performance, tooling]
---

Every time I opened a new terminal tab, PowerShell 7 hesitated for several hundred milliseconds. Dot-sourcing helper scripts for workspace management and note indexing directly in `$PROFILE` forced the engine to parse hundreds of lines of code I rarely touched in a quick tab. When you open dozens of terminals a day, that small delay adds friction.

## The Fix

Instead of eager loading on boot, defer loading until you type a command. PowerShell provides a built-in hook through `$ExecutionContext.InvokeCommand.CommandNotFoundAction`.

When you type a command that does not exist in the current session, PowerShell fires this script block before raising an error. If the typed name matches a registered command list, the script sources the corresponding file, registers the new function, and hands it back to `$EventArgs.Command`.

Here is the exact block from my `$PROFILE`:

```powershell
# Lazy-load Workspace CLI & Brain2nd CLI only when invoked (0ms on new tab)
$script:_lazyMap = @{
    workspace = [System.Collections.Generic.HashSet[string]]::new([string[]]@(
        'ws','now','proj','tbox','prune','wsverify'
    ), [System.StringComparer]::OrdinalIgnoreCase)
    brain     = [System.Collections.Generic.HashSet[string]]::new([string[]]@(
        'y','brain','day','n','f','bfind','blog'
    ), [System.StringComparer]::OrdinalIgnoreCase)
}

$ExecutionContext.InvokeCommand.CommandNotFoundAction = {
    param($CommandName, $EventArgs)
    if ($script:_lazyMap.ContainsKey('workspace') -and $script:_lazyMap['workspace'].Contains($CommandName)) {
        $script:_lazyMap.Remove('workspace') | Out-Null
        if (Test-Path -LiteralPath 'D:\Workspace\scripts\workspace-cli.ps1') { . 'D:\Workspace\scripts\workspace-cli.ps1' }
    } elseif ($script:_lazyMap.ContainsKey('brain') -and $script:_lazyMap['brain'].Contains($CommandName)) {
        $script:_lazyMap.Remove('brain') | Out-Null
        if (Test-Path -LiteralPath 'D:\Workspace\scripts\brain-cli.ps1') { . 'D:\Workspace\scripts\brain-cli.ps1' }
    } else {
        return
    }
    $cmd = Get-Command $CommandName -ErrorAction SilentlyContinue
    if ($cmd) { $EventArgs.Command = $cmd }
}
```

The mechanics stay simple:

1. Store command names in .NET `HashSet[string]` collections with ordinal case-insensitivity for fast lookup.
2. Group commands by source script (`workspace-cli.ps1` and `brain-cli.ps1`).
3. When you run `ws` or `blog` for the first time, dot-source that script once and remove the group key from `_lazyMap`.
4. Assign `$EventArgs.Command = $cmd`. PowerShell executes the command immediately on that first invocation without throwing an error.

Subsequent calls bypass the hook entirely because the functions are now loaded in the session table.

## What Changed

Dot-sourcing both scripts eagerly added ~130ms of script parsing to every shell startup. On this machine, `workspace-cli.ps1` costs ~35ms and `brain-cli.ps1` costs ~94ms to parse.

Moving them behind `CommandNotFoundAction` dropped that overhead to 0ms when opening a terminal. Total profile execution dropped to ~110ms, spent almost entirely on custom prompt rendering and PSReadLine syntax styling. You pay the parse cost only once, and only in sessions where you actually invoke one of those tools.

## Trade-offs

Tab autocomplete does not recognize lazy-loaded commands until you run one from that group. If you rely on typing `wo<tab>` right after opening a shell, the shell cannot complete what it has not loaded yet.

The first execution incurs the parse hit. Running `now` or `day` for the first time in a tab will take an extra ~90ms while it loads the file.

You also have to maintain the command lists. Whenever you add a new function to your helper scripts, you need to add its name to `_lazyMap` in your profile. For scripts you only use occasionally, the startup speed gain easily outweighs the bookkeeping.
