---
title: "Viết bằng Markdown, Phần 04 - Cách chèn liên kết và ảnh"
date: "2026-11-17"
author: "Dyn"
slug: "viet-bang-markdown-04-lien-ket-anh"
category: "Markdown 101"
series: "Markdown 101"
description: "Cách chèn liên kết, anchor link và ảnh trong Markdown: đặt nhãn rõ nghĩa, viết alt text chuẩn SEO/accessibility và tránh lỗi đường dẫn trên blog."
tags: ["markdown", "viet-bang-markdown"]
draft: false
---

*Markdown 101 · Phần 4/6*

Chèn liên kết bằng `[nhãn](địa-chỉ)` và chèn ảnh bằng `![mô tả ảnh](đường-dẫn-ảnh)`. Nhãn liên kết cần nói rõ đích đến; mô tả ảnh (alt text) cần diễn tả nội dung ảnh để hỗ trợ trình đọc màn hình và công cụ tìm kiếm.

## Đặt tên liên kết và dùng đường dẫn nội bộ

```markdown
Đọc [bảng cú pháp Markdown](https://commonmark.org/help/).
```

Nhãn “bảng cú pháp Markdown” giúp người đọc lướt biết ngay trang sắp mở, tốt hơn hẳn các nhãn chung chung như “bấm vào đây” hay “xem thêm”.

Các kiểu liên kết thường dùng trên blog:

- **Liên kết ngoài**: dùng địa chỉ đầy đủ `https://...`.
- **Liên kết nội bộ giữa các bài**: dùng đường dẫn từ gốc website, ví dụ `[Phần 1: Markdown là gì?](/posts/viet-bang-markdown-01-bat-dau/)`.
- **Liên kết tới mục trong cùng bài (anchor link)**: dùng `[Tên mục](#ten-muc)` với chữ thường, không dấu và gạch nối.
- **Liên kết có chú thích khi rê chuột**: thêm tiêu đề trong ngoặc kép `[nhãn](https://... "Ghi chú ngắn")`.

## Chèn ảnh và viết mô tả ảnh (alt text)

```markdown
![Giao diện xem trước Markdown trên blog Hugo](xem-truoc-markdown.png)
```

Chỉ thêm ảnh khi ảnh giúp minh họa thao tác hoặc sơ đồ khó diễn đạt bằng chữ. Mô tả trong `[]` (alt text) sẽ hiển thị khi ảnh tải lỗi và được công cụ tìm kiếm dùng để hiểu ngữ cảnh ảnh, nên tránh đặt tên chung chung như `ảnh 1` hay `screenshot.png`.

Trong quy trình blog Dyn, bạn có thể chèn ảnh tương đối nằm cùng thư mục hoặc trong `Tệp đính kèm/` của Obsidian; công cụ xuất bản sẽ tự sao chép ảnh vào gói bài Hugo.

## Tránh đường dẫn chỉ chạy trên máy cá nhân

Không chèn đường dẫn ổ đĩa cục bộ như `D:\Brain2nd\...` vào bài viết công khai vì trình duyệt của người đọc không thể truy cập tệp trên máy bạn.

Đặt tên tệp ảnh ngắn, chữ thường không dấu, nối bằng dấu gạch nối (ví dụ `bang-cu-phap-markdown.png`) và luôn mở bản xem trước Hugo để kiểm tra ảnh hiển thị trước khi xuất bản.

## Thử ngay

Đổi nhãn liên kết và mô tả ảnh trong khung bên dưới cho rõ nghĩa, đúng nội dung hiển thị.

{{< markdown-practice task="Đổi nhãn liên kết thành tên tài liệu rõ nghĩa. Thay mô tả ảnh bằng nội dung ảnh thể hiện." hint="Giữ URL trong ngoặc tròn. Thay chữ trong ngoặc vuông; ảnh có dấu ! phía trước. Ví dụ dùng favicon có sẵn để không cần tải ảnh lên." >}}
[Bấm vào đây](https://commonmark.org/help/)

![Ảnh 1](/favicon.svg)
{{< /markdown-practice >}}

Nguồn cú pháp: [CommonMark: liên kết và ảnh](https://commonmark.org/help/). Quy trình ảnh được đối chiếu với công cụ xuất bản riêng của blog Dyn.

---

**Trong series Markdown 101:**

- [Phần 01: Markdown là gì và cách tạo tệp đầu tiên](/posts/viet-bang-markdown-01-bat-dau/)
- [Phần 02: Cách viết tiêu đề và đoạn văn](/posts/viet-bang-markdown-02-tieu-de-doan-van/)
- [Phần 03: Danh sách, trích dẫn và khối mã](/posts/viet-bang-markdown-03-danh-sach-khoi-ma/)
- **Phần 04: Cách chèn liên kết và ảnh** *(đang đọc)*
- [Phần 05: Mẫu bài viết và YAML cho blog](/posts/viet-bang-markdown-05-mau-bai-viet/)
- [Phần 06: Xem trước và đăng bài lên Hugo](/posts/viet-bang-markdown-06-xuat-ban-hugo/)
