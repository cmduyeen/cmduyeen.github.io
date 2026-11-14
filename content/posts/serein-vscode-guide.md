---
title: "Hướng Dẫn Cài Đặt Không Gian Lập Trình Ấm Áp Với VS Code & Windows Terminal"
date: "2026-11-14"
author: "Dyn"
category: "Môi Trường Lập Trình"
tags: ["vscode-theme", "windows-terminal", "serein-theme", "lap-trinh", "powershell", "wsl", "toi-uu-giao-dien"]
description: "Hướng dẫn từng bước cài đặt và cấu hình bộ theme tối giản ấm áp Serein cho Visual Studio Code và Windows Terminal để có trải nghiệm gõ code êm mắt nhất."
slug: "huong-dan-cai-dat-serein-vscode-windows-terminal"
translationKey: "serein-vscode-guide"
draft: false
---

# Hướng Dẫn Cài Đặt Không Gian Lập Trình Ấm Áp Với VS Code & Windows Terminal

Trong một ngày làm việc điển hình, lập trình viên chuyển đổi (Alt + Tab) hàng trăm lần giữa trình soạn thảo mã nguồn và cửa sổ dòng lệnh (terminal). Nếu editor của bạn đang dùng theme tím đậm hoặc xanh đậm, còn terminal lại mang màu đen kịt cùng chữ xanh dạ quang chói lóa, đôi mắt sẽ phải liên tục co giãn đồng tử để thích nghi, dẫn đến tình trạng mỏi mắt nhanh chóng.

Trong bài viết này, tôi sẽ hướng dẫn bạn thiết lập đồng bộ giao diện cho **Visual Studio Code** và **Windows Terminal** bằng bộ theme **[Serein](https://github.com/cmduyeen/serein-theme)** do **[Dyn](https://cmduyeen.github.io/)** phát triển, với hai bảng màu dịu mắt: **Alabaster** (Sáng ngà) và **Obsidian** (Than ấm).

---

## Phần 1: Cài Đặt & Tối Ưu Cho Visual Studio Code

[Serein for VS Code](https://github.com/cmduyeen/serein-vscode) loại bỏ hoàn toàn sự rườm rà của các khối màu xung đột, đưa độ tương phản về mức chuẩn WCAG 2.1 AA dễ chịu.

### Bước 1: Cài đặt Theme từ file VSIX
1. Tải tệp `serein-vscode-*.vsix` mới nhất từ trang **[GitHub Releases](https://github.com/cmduyeen/serein-vscode/releases/latest)**.
2. Trong VS Code, nhấn tổ hợp phím `Ctrl + Shift + P` (hoặc `Cmd + Shift + P` trên macOS) để mở Command Palette.
3. Gõ và chọn dòng:
   ```text
   Extensions: Install from VSIX...
   ```
4. Chọn tệp `.vsix` vừa tải về.
5. Nhấn `Ctrl + K, Ctrl + T` để mở danh sách chọn theme và chọn:
   - **Serein Alabaster** (Nếu bạn làm việc ban ngày hoặc phòng nhiều ánh sáng).
   - **Serein Obsidian** (Nếu bạn làm việc ban đêm hoặc thích tông tối dịu mắt).

### Bước 2: Tinh chỉnh cấu hình typography trong `settings.json`
Để giao diện phát huy tối đa vẻ đẹp tối giản, hãy mở tệp `settings.json` trong VS Code và thêm đoạn cấu hình đề xuất sau:

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

> **Tại sao nên tắt bracket pair colorization bảy sắc cầu vồng?**
>
> Việc tô mỗi cặp ngoặc một màu neon sặc sỡ làm mắt bị phân tán liên tục. Serein sử dụng đường viền dẫn hướng (bracket guides) tinh tế để bạn nhận biết cấu trúc lồng nhau mà không cần làm lòe loẹt màn hình.

---

## Phần 2: Cài Đặt Serein Cho Windows Terminal

[Serein for Windows Terminal](https://github.com/cmduyeen/serein-terminal) mang lại tông màu đồng nhất cho PowerShell, Command Prompt, Git Bash và WSL (Ubuntu).

### Cách 1: Sử dụng Script tự động hóa PowerShell (Nhanh nhất)
1. Tải và giải nén tệp `serein-terminal-0.1.0.zip` từ **[trang Releases](https://github.com/cmduyeen/serein-terminal/releases/latest)**.
2. Mở PowerShell 7 trong thư mục vừa giải nén.
3. Chạy lệnh sau để áp dụng Serein Obsidian (Tối) làm cấu hình mặc định:
   ```powershell
   ./install.ps1 -Mode Dark -SetDefault -Launch
   ```
   *(Hoặc truyền `-Mode Light` nếu muốn chọn bản Alabaster sáng).*

### Cách 2: Thêm thủ công vào file JSON của Terminal
Nếu thích cấu hình bằng tay, bạn mở Settings của Windows Terminal (`Ctrl + ,`), bấm vào **Open JSON file** ở góc dưới bên trái, và dán đoạn mã màu sau vào mảng `"schemes"`:

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

## Trải Nghiệm Không Gian Làm Việc Đồng Bộ

Sau khi hoàn tất cả hai ứng dụng:
- Khi gõ `git status`, chạy server hay quan sát logs trên terminal, các màu ngữ nghĩa (xanh lá cho dòng thêm mới, đỏ cho dòng xóa, vàng cho cảnh báo) hoàn toàn trùng khớp với màu sắc trong VS Code.
- Đôi mắt của bạn sẽ không còn cảm giác bị "giật sáng" khi chuyển cửa sổ, giúp bạn duy trì trạng thái tập trung sâu (deep work) lâu hơn.

---

## Đồng Bộ Hóa Toàn Diện Hệ Thống

Bạn có thể tiếp tục mở rộng sự đồng bộ này sang các công cụ làm việc khác:

- 💻 **[Serein for Neovim](https://github.com/cmduyeen/serein-neovim)** — Plugin Lua với TreeSitter cho người yêu thích Vim.
- 📓 **[Serein for Obsidian](https://github.com/cmduyeen/serein-obsidian)** — Giao diện ghi chép tri thức tối giản.
- 🪟 **[Serein for Windows](https://github.com/cmduyeen/serein-windows)** — Giao diện hệ thống và bộ hình nền 4K tông ấm.
- 🌿 **[Trang chủ Serein Theme](https://github.com/cmduyeen/serein-theme)** — Bản đồ tổng quan toàn bộ hệ sinh thái.

*Xem thêm các bài viết về năng suất tại **[Dyn's Notes](https://cmduyeen.github.io/)** hoặc ghé thăm trang cá nhân **[GitHub (@cmduyeen)](https://github.com/cmduyeen)**.*
