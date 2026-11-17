---
title: "Viết bằng Markdown, Phần 06 - Xem trước và đăng bài lên Hugo"
date: "2026-11-17"
author: "Dyn"
slug: "viet-bang-markdown-06-xuat-ban-hugo"
category: "Viết bằng Markdown"
description: "Rà bản nháp Markdown, xem trước bằng Hugo và đăng từng bài qua lệnh blog của Dyn. Kiểm tra ngày xuất bản, liên kết và nội dung sau deploy."
tags: ["markdown", "viet-bang-markdown"]
draft: false
---

*Viết bằng Markdown · Phần 6/6*

Để đưa bản Markdown lên blog, hãy rà nội dung, xem trước bằng Hugo rồi mới xuất bản. Các lệnh `blog` dưới đây là công cụ riêng của Dyn, cần môi trường đã cấu hình; chúng không phải lệnh có sẵn của Hugo.

## Đọc lại theo việc người đọc cần làm

Hai câu đầu đã trả lời vấn đề chưa? Ví dụ có đủ thông tin để làm theo không? Bỏ câu dẫn chung chung và tách đoạn đang chứa hai ý.

Kiểm tra tiếp:

- Tiêu đề nói đúng nội dung bên dưới.
- Thuật ngữ được giải thích ở lần đầu xuất hiện.
- Khối mã có đủ hàng đóng.
- Liên kết và ảnh trỏ đến đúng nơi.

## Xem trước trên Hugo

Trong Terminal đã cấu hình công cụ blog, chạy:

```powershell
blog preview
```

Công cụ hiện tại tạo bản xem trước có các bản nháp. Mở bài cần đọc, kiểm tra tiêu đề, dấu tiếng Việt, khối mã và ảnh.

Hugo chuyển Markdown thành HTML. Các tính năng riêng của Obsidian có thể hiển thị khác trên website; dùng liên kết Markdown và khối mã chuẩn giúp bài dễ chuyển hơn.

## Xuất bản từng bài

Trước lúc đăng, điền `Ngày xuất bản` theo ngày thực tế. Nếu để trống, công cụ hiện lấy `Ngày tạo` làm ngày bài viết. Ví dụ đăng phần đầu:

```powershell
blog publish "viet-bang-markdown-01-bat-dau"
```

Kiểm tra bài được chọn rồi xác nhận trong Terminal. Lệnh chuyển bài sang định dạng Hugo, kiểm tra build và có thể commit, push lên GitHub.

Giữ các bài còn lại ở trạng thái Nháp. Chỉ thêm liên kết tới phần tiếp theo sau khi phần đó đã lên web, để tránh dẫn người đọc đến trang chưa tồn tại.

## Kiểm tra sau khi website cập nhật

Mở URL công khai, đọc lại một lượt và thử các liên kết. Việc build thành công chưa bảo đảm ảnh, điều hướng và nội dung đều đúng; xuất bản cũng chưa đồng nghĩa bài đã được công cụ tìm kiếm lập chỉ mục.

## Thử ngay

Chọn một bản nháp, xem trước bằng Hugo và sửa một lượt. Khi bài giải quyết được vấn đề đã hứa ở đầu, bạn có thể chuẩn bị đăng.

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

**Trong series:**

- Phần 01: Markdown là gì và cách tạo tệp đầu tiên.
- Phần 02: Cách viết tiêu đề và đoạn văn.
- Phần 03: Danh sách, trích dẫn và khối mã.
- Phần 04: Cách chèn liên kết và ảnh.
- Phần 05: Mẫu bài viết và YAML cho blog.
- Phần 06: Xem trước và đăng bài lên Hugo — bạn đang đọc.
