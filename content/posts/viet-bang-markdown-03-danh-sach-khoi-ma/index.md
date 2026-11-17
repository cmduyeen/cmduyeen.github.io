---
title: "Viết bằng Markdown, Phần 03 - Danh sách, trích dẫn và khối mã"
date: "2026-11-17"
author: "Dyn"
slug: "viet-bang-markdown-03-danh-sach-khoi-ma"
category: "Viết bằng Markdown"
description: "Viết danh sách, trích dẫn và khối mã Markdown bằng ví dụ sao chép được. Phân biệt các ý ngang hàng với các bước phải làm theo thứ tự."
tags: ["markdown", "viet-bang-markdown"]
draft: false
---

*Viết bằng Markdown · Phần 3/6*

Dùng `-` để liệt kê, số thứ tự để hướng dẫn từng bước, `>` để trích dẫn và backtick để đánh dấu mã. Chọn theo việc người đọc cần làm.

## Danh sách ý và danh sách bước

Các mục ngang hàng dùng dấu `-`:

```markdown
Đồ cần chuẩn bị:

- Một trình soạn thảo.
- Một tệp Markdown.
- Một ý muốn viết.
```

Các bước cần làm theo thứ tự dùng số:

```markdown
1. Tạo tệp `bai-viet.md`.
2. Viết nội dung.
3. Xem trước và sửa lỗi.
```

Để dòng trống trước danh sách. Với hướng dẫn ngắn, danh sách một cấp thường đủ; quá nhiều cấp khiến người đọc khó theo dõi.

## Trích dẫn vẫn cần nguồn

```markdown
> Viết một ý cho rõ rồi mới chuyển sang ý khác.
```

Dấu `>` tạo khối trích dẫn. Câu trên là ví dụ minh họa. Khi dẫn lời người khác, ghi tác giả và liên kết đến nguồn; định dạng trích dẫn không thay thế việc dẫn nguồn.

## Khi nào dùng khối mã?

Dùng backtick đơn cho tên tệp hoặc mã ngắn như `bai-viet.md`. Với nhiều dòng, mở và đóng bằng ba backtick. Thêm tên ngôn ngữ sau hàng mở:

````text
```markdown
## Việc hôm nay

- Viết một đoạn.
- Đọc lại một lần.
```
````

Trong khối mã, các ký hiệu được hiển thị để sao chép, thay vì trở thành tiêu đề hoặc danh sách. Quên hàng backtick đóng có thể khiến phần còn lại của bài bị hiển thị như mã.

## Thử ngay

Viết một danh sách ba bước. Sau đó đặt chính danh sách ấy vào khối mã. Xem trước để phân biệt cú pháp với kết quả.

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

**Trong series:**

- Phần 01: Markdown là gì và cách tạo tệp đầu tiên.
- Phần 02: Cách viết tiêu đề và đoạn văn.
- Phần 03: Danh sách, trích dẫn và khối mã — bạn đang đọc.
- Phần 04: Cách chèn liên kết và ảnh — sắp đăng.
- Phần 05: Mẫu bài viết và YAML cho blog — sắp đăng.
- Phần 06: Xem trước và đăng bài lên Hugo — sắp đăng.
