---
title: "Cấu Hình Serein Colorscheme Cho Neovim Bằng Lazy.nvim, TreeSitter & Lualine"
date: "2026-11-14"
author: "Dyn"
category: "Vim & Neovim"
tags: ["neovim", "lua", "neovim-colorscheme", "treesitter", "lazy-nvim", "serein-theme", "giao-dien-lap-trinh"]
description: "Hướng dẫn chi tiết cách cài đặt và cấu hình Serein—bộ colorscheme Neovim viết bằng Lua với tông màu ấm, ít tương phản, hỗ trợ TreeSitter và chẩn đoán LSP."
slug: "cau-hinh-neovim-lua-serein-colorscheme-treesitter"
translationKey: "serein-neovim-guide"
draft: false
---

# Cấu Hình Serein Colorscheme Cho Neovim Bằng Lazy.nvim, TreeSitter & Lualine

Với những lập trình viên đam mê modal editing và làm việc hoàn toàn trên terminal, việc tìm kiếm một bộ màu (colorscheme) vừa mắt thường gặp phải hai vấn đề: hoặc là màu sắc quá nhạt nhòa khó đọc, hoặc là quá chói chang với những khối màu tương phản mạnh làm rối cấu trúc cú pháp.

**[Serein for Neovim](https://github.com/cmduyeen/serein-neovim)** là plugin colorscheme được viết hoàn toàn bằng Lua thuần, xây dựng trên ngôn ngữ thiết kế tối giản của **[Dyn](https://cmduyeen.github.io/)**, giúp cân bằng hoàn hảo giữa nền ấm êm dịu và chữ in rõ nét.

---

## 1. Ưu Điểm Nổi Bật Của Serein Trên Neovim

- **Kiến trúc 100% Lua:** Khởi động gần như tức thì (tốc độ dưới 1ms), không gây độ trễ khi mở file.
- **Hỗ trợ TreeSitter sâu sắc:** Định nghĩa highlight chi tiết cho từng loại token (`@keyword`, `@function`, `@variable.parameter`, `@markup.heading`).
- **Tích hợp sẵn các plugin phổ biến:** Định hình màu sắc cho `telescope.nvim`, `lualine.nvim`, `which-key.nvim`, `bufferline.nvim`, `nvim-cmp` và `render-markdown.nvim`.
- **Chuyển đổi Sáng / Tối linh hoạt:** Cho phép chuyển đổi tức thì giữa **Serein Alabaster** (Sáng) và **Serein Obsidian** (Tối) chỉ bằng một tổ hợp phím mà không cần khởi động lại Neovim.

---

## 2. Cài Đặt Bằng Trình Quản Lý `lazy.nvim`

Nếu bạn đang sử dụng [lazy.nvim](https://github.com/folke/lazy.nvim), hãy tạo một tệp mới trong thư mục cấu hình:

`~/.config/nvim/lua/plugins/colorscheme.lua` (hoặc `serein.lua`):

```lua
return {
  {
    "cmduyeen/serein-neovim",
    name = "serein.nvim",
    lazy = false,
    priority = 1000, -- Đảm bảo load trước các plugin khác
    config = function()
      require("serein").setup({
        variant = "obsidian", -- Chọn "obsidian" (tối) hoặc "alabaster" (sáng)
        transparent = false,  -- Đặt true nếu bạn dùng nền terminal trong suốt
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

## 3. Tích Hợp Với Thanh Trạng Thái `lualine.nvim`

Serein đã bao gồm giao diện đồng bộ cho `lualine.nvim`. Bạn chỉ cần truyền `"serein"` vào trường `theme`:

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

Thanh trạng thái sẽ đổi màu tinh tế theo từng chế độ gõ (Normal, Insert, Visual, Command) bằng các gam màu ngữ nghĩa ấm áp, không làm chói mắt vùng nhìn ngoại vi của bạn.

---

## 4. Phím Tắt Chuyển Đổi Sáng / Tối Trong 1 Giây

Nếu bạn muốn chuyển nhanh từ Dark mode ban đêm sang Light mode khi làm việc ngoài quán cafe ban ngày, hãy thêm phím tắt này vào file `keymaps.lua`:

```lua
-- Chuyển đổi giữa Serein Obsidian và Alabaster bằng <leader>ut
vim.keymap.set("n", "<leader>ut", function()
  require("serein").toggle()
end, { desc = "Toggle Serein Light/Dark Mode" })
```

---

## 5. Kết Nối Vào Hệ Sinh Thái Serein

Hãy kết hợp Neovim với các công cụ đồng bộ trong hệ sinh thái Serein:

- 🖥️ **[Serein for Windows Terminal](https://github.com/cmduyeen/serein-terminal)** — Bảng màu ANSI đồng điệu cho cửa sổ dòng lệnh.
- 📓 **[Serein for Obsidian](https://github.com/cmduyeen/serein-obsidian)** — Không gian lưu trữ ghi chép Markdown tĩnh lặng.
- 💻 **[Serein for VS Code](https://github.com/cmduyeen/serein-vscode)** — Trình soạn thảo đồ họa khi cần làm việc nhóm.
- 🌿 **[Trang chủ Serein Theme](https://github.com/cmduyeen/serein-theme)** — Bản đồ tổng quan toàn bộ hệ thống.

*Tác giả: **[Dyn (cmduyeen)](https://cmduyeen.github.io/)**. Khám phá thêm các chia sẻ về lập trình trên [Blog Dyn](https://cmduyeen.github.io/) hoặc để lại ngôi sao ủng hộ dự án trên [GitHub](https://github.com/cmduyeen/serein-neovim).*
