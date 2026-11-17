---
title: "Viết bằng Markdown, Phần 06 - Xem trước và đăng bài lên Hugo"
date: "2026-11-17"
author: "Dyn"
slug: "viet-bang-markdown-06-xuat-ban-hugo"
category: "Markdown 101"
description: "Quy trình rà lỗi bản nháp Markdown, xem trước trên Hugo, xuất bản lên GitHub Pages và kiểm tra hiển thị, liên kết sau khi deploy."
tags: ["markdown", "viet-bang-markdown", "hugo"]
draft: false
---

*Markdown 101 · Phần 6/10*

Để đưa bản nháp Markdown từ Obsidian lên blog Hugo an toàn, hãy rà nội dung theo danh sách kiểm tra, xem trước cục bộ bằng `hugo server` rồi mới xuất bản và đối chiếu trên URL công khai. Các lệnh `blog` bên dưới thuộc bộ công cụ riêng của Dyn.

## Danh sách rà soát bản nháp trước khi đăng

- **Mở đầu đi thẳng vào vấn đề**: 1–2 câu đầu đã trả lời câu hỏi chính của bài chưa?
- **Cấu trúc tiêu đề**: Chỉ có một `H1` (từ tên bài), các mục bên trong dùng `##` và `###` đúng thứ tự.
- **Thuộc tính YAML**: Có `Mô tả` riêng, `Slug` không dấu, `Chuyên mục` và `tags` phù hợp.
- **Cú pháp Markdown**: Khối mã đủ ba dấu backtick đóng, ảnh có mô tả (`alt`), liên kết không trỏ vào đường dẫn máy cá nhân.

## Xem trước trên Hugo trước khi xuất bản

Trong Terminal (hoặc bấm nút **Preview** trong `blog ui`), chạy:

```powershell
blog preview
```

Lệnh này dựng bản xem trước gồm cả các bài đang ở trạng thái Nháp tại `http://127.0.0.1:1313`. Một số cú pháp riêng của Obsidian (như `wikilink`) có thể hiển thị khác trên web; dùng cú pháp Markdown chuẩn giúp bài chuyển đổi sạch hơn.

## Xuất bản lên GitHub Pages

Trước khi đăng, kiểm tra `Ngày xuất bản` trong YAML (nếu để trống, công cụ tự lấy `Ngày tạo`). Chạy lệnh xuất bản theo slug bài viết:

```powershell
blog publish "viet-bang-markdown-01-bat-dau"
```

Công cụ sẽ chuyển tệp Obsidian sang Hugo bundle, chạy `hugo --gc --minify` kiểm tra lỗi build, rồi commit và push lên GitHub. Nếu đăng cả series, hãy giữ các phần chưa xong ở trạng thái Nháp và chỉ gắn liên kết tới những phần đã lên web để tránh lỗi 404.

## Kiểm tra sau khi website cập nhật

1. Mở URL bài viết trên `cmduyeen.github.io`, kiểm tra lại tiêu đề, khối mã, ảnh và bố cục trên màn hình điện thoại.
2. Bấm thử các liên kết nội bộ trong mục lục series và liên kết nguồn.
3. Kiểm tra bài mới đã xuất hiện trong trang [Archive](/archives/) và tệp `/sitemap.xml`.
4. Nếu đã xác minh quyền sở hữu trên Google Search Console, có thể dùng *URL Inspection* để kiểm tra trạng thái thu thập dữ liệu của URL mới.

## Thử ngay

Sửa lại đoạn bản nháp lỗi bên dưới để tiêu đề có khoảng trắng sau `##`, bỏ câu dẫn thừa và chuyển danh sách kiểm tra thành gạch đầu dòng.

{{< markdown-practice task="Sửa bản nháp để tiêu đề hiển thị đúng. Bỏ câu dẫn thừa và chuyển các việc kiểm tra thành danh sách." hint="Tiêu đề cần khoảng trắng sau ##. Thêm - trước mỗi việc; tách đoạn bằng dòng trống. Các lệnh gõ trong ô này chỉ là văn bản, không được thực thi." >}}
##Bài viết sẵn sàng

Trong bài viết hôm nay, chúng ta sẽ cùng khám phá cách bắt đầu viết.
Tạo một tệp .md và viết một ý chính.

Kiểm tra dấu tiếng Việt.
Mở các liên kết.
Xem trước bằng Hugo.
{{< /markdown-practice >}}

Nguồn nền tảng: [Hugo: xử lý nội dung Markdown](https://gohugo.io/content-management/formats/). Các lệnh `blog` được đối chiếu công cụ xuất bản riêng của Dyn.

---

**Trong series Markdown 101:**

- [Phần 01: Markdown là gì và cách tạo tệp đầu tiên](/posts/viet-bang-markdown-01-bat-dau/)
- [Phần 02: Cách viết tiêu đề và đoạn văn](/posts/viet-bang-markdown-02-tieu-de-doan-van/)
- [Phần 03: Danh sách, trích dẫn và khối mã](/posts/viet-bang-markdown-03-danh-sach-khoi-ma/)
- [Phần 04: Cách chèn liên kết và ảnh](/posts/viet-bang-markdown-04-lien-ket-anh/)
- [Phần 05: Mẫu bài viết và YAML cho blog](/posts/viet-bang-markdown-05-mau-bai-viet/)
- **Phần 06: Xem trước và đăng bài lên Hugo** *(đang đọc)*
- Phần 07: Tạo bảng và đường kẻ ngang — sắp đăng.
- Phần 08: Checklist, chú thích chân trang và escape ký tự — sắp đăng.
- Phần 09: Callout và Wikilink trong Obsidian — sắp đăng.
- Phần 10: Bài tập tổng hợp viết bài hoàn chỉnh — sắp đăng.
