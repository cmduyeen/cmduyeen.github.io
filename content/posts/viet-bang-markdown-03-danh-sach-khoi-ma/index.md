---
title: "Viết bằng Markdown, Phần 03 - Danh sách, trích dẫn và khối mã"
date: "2026-11-17"
author: "Dyn"
slug: "viet-bang-markdown-03-danh-sach-khoi-ma"
category: "Viết bằng Markdown"
description: "Hướng dẫn viết danh sách dấu đầu dòng, danh sách bước, checklist, trích dẫn và khối mã có tô màu cú pháp trong Markdown."
tags: ["markdown", "viet-bang-markdown"]
draft: false
---

*Viết bằng Markdown · Phần 3/6*

Dùng `-` cho các ý ngang hàng, số thứ tự `1.` cho hướng dẫn từng bước, `>` cho trích dẫn và dấu backtick (`` ` ``) để đánh dấu mã hoặc lệnh Terminal.

## Danh sách ý, danh sách bước và checklist

Các mục ngang hàng dùng dấu `-` (hoặc `*`), các bước theo thứ tự dùng số `1.`, `2.`, `3.`:

```markdown
Đồ cần chuẩn bị:

- Một trình soạn thảo.
- Một tệp Markdown.

Các bước thực hiện:

1. Tạo tệp `bai-viet.md`.
2. Viết nội dung.
   - Kiểm tra dấu tiếng Việt.
3. Xem trước và sửa lỗi.
```

Để tạo mục con lồng bên trong, thụt đầu dòng **2 hoặc 4 dấu cách** trước `-`. Luôn chừa một dòng trống trước khi bắt đầu danh sách để bộ phân tích Markdown nhận diện đúng.

Nếu cần danh sách kiểm tra (task list) trong Obsidian, GitHub hoặc Hugo, dùng `- [ ]` cho việc chưa làm và `- [x]` cho việc đã xong.

## Trích dẫn đúng ngữ cảnh

```markdown
> Viết một ý cho rõ rồi mới chuyển sang ý khác.
```

Dấu `>` tạo khối trích dẫn; nhiều đoạn liên tiếp có thể đặt dấu `>` ở đầu mỗi dòng, kể cả dòng trống ở giữa. Khi dẫn lời hoặc số liệu từ người khác, luôn ghi rõ tên tác giả và đường dẫn nguồn bên dưới.

## Mã ngắn và khối mã nhiều dòng

- **Mã ngắn (inline code)**: bọc tên tệp, lệnh hoặc phím tắt giữa một cặp backtick đơn, ví dụ `` `bai-viet.md` ``.
- **Khối mã (code block)**: mở và đóng bằng ba dấu backtick (```` ``` ````). Ghi thêm tên ngôn ngữ ngay sau dòng mở (`markdown`, `powershell`, `python`, `yaml`) để website tô màu cú pháp chính xác:

````text
```markdown
## Việc hôm nay

- Viết một đoạn.
- Đọc lại một lần.
```
````

Nếu bên trong khối mã có sẵn ba dấu backtick (như ví dụ hướng dẫn Markdown ở trên), hãy dùng **bốn dấu backtick** (````` ```` `````) để bao ngoài. Quên dòng backtick đóng sẽ khiến toàn bộ phần sau của bài biến thành khối mã.

## Thử ngay

Viết một danh sách ba bước kiểm tra bài viết, lồng một ý phụ và đặt ví dụ đó vào khối mã có khai báo ngôn ngữ `markdown`.

{{< markdown-practice task="Chuyển ba dòng đầu thành danh sách có số. Thêm một trích dẫn và đặt một ví dụ Markdown trong khối mã." hint="Dùng 1. 2. 3. cho các bước, > cho trích dẫn. Khối mã mở và đóng bằng ba dấu backtick; thêm markdown ở hàng mở." >}}
Tạo tệp.
Viết bản nháp.
Đọc lại.

> Viết một ý cho rõ.

```markdown
## Ví dụ trong khối mã
```
{{< /markdown-practice >}}

Nguồn: [Cú pháp danh sách, trích dẫn và mã của CommonMark](https://commonmark.org/help/).

---

**Trong series Viết bằng Markdown:**

- [Phần 01: Markdown là gì và cách tạo tệp đầu tiên](/posts/viet-bang-markdown-01-bat-dau/)
- [Phần 02: Cách viết tiêu đề và đoạn văn](/posts/viet-bang-markdown-02-tieu-de-doan-van/)
- **Phần 03: Danh sách, trích dẫn và khối mã** *(đang đọc)*
- [Phần 04: Cách chèn liên kết và ảnh](/posts/viet-bang-markdown-04-lien-ket-anh/)
- [Phần 05: Mẫu bài viết và YAML cho blog](/posts/viet-bang-markdown-05-mau-bai-viet/)
- [Phần 06: Xem trước và đăng bài lên Hugo](/posts/viet-bang-markdown-06-xuat-ban-hugo/)
