---
title: "Viết bằng Markdown, Phần 04 - Cách chèn liên kết và ảnh"
date: "2026-11-17"
author: "Dyn"
slug: "viet-bang-markdown-04-lien-ket-anh"
category: "Viết bằng Markdown"
description: "Cách chèn link và ảnh trong Markdown: đặt nhãn rõ nghĩa, viết mô tả ảnh và kiểm tra đường dẫn để tránh lỗi khi đưa bài lên blog."
tags: ["markdown", "viet-bang-markdown"]
draft: false
---

*Viết bằng Markdown · Phần 4/6*

Chèn liên kết bằng `[nhãn](địa-chỉ)` và ảnh bằng `![mô tả](đường-dẫn-ảnh)`. Nhãn liên kết nên nói đích đến; mô tả ảnh nên nói ảnh thể hiện điều gì.

## Đặt tên cho liên kết

```markdown
Đọc [bảng cú pháp Markdown](https://commonmark.org/help/).
```

Nhãn “bảng cú pháp Markdown” rõ nghĩa hơn “bấm vào đây”. Người đọc lướt vẫn hiểu họ sẽ mở tài liệu nào.

Với bài đã đăng trên cùng website, có thể dùng đường dẫn từ gốc:

```markdown
[Tên bài](/posts/slug-cua-bai/)
```

Đây là mẫu đường dẫn, cần thay bằng URL có thật. Đường dẫn website không nhất thiết mở được tệp tương ứng trong Obsidian.

## Thêm ảnh khi ảnh giúp giải thích

```markdown
![Bản xem trước của ghi chú đầu tiên](ghi-chu-dau-tien.png)
```

Đây là ví dụ cú pháp; bạn cần có tệp ảnh thật trước khi dùng. Tránh mô tả chung chung như “ảnh 1”. Không bắt buộc thêm ảnh nếu câu chữ đã giải thích đủ.

Trong quy trình blog Dyn, công cụ xuất bản có thể tìm ảnh tương đối trong thư mục bài hoặc `Tệp đính kèm/`, rồi sao chép vào gói bài Hugo. Đây là hành vi của công cụ riêng, không phải mọi hệ thống Markdown.

## Tránh đường dẫn chỉ chạy trên máy mình

Không dùng đường dẫn ổ đĩa như `D:\Brain2nd\...` cho nội dung công khai. Người đọc website không truy cập được tệp trên máy bạn.

Tên ảnh nên ngắn, không dấu, dùng gạch nối và tránh trùng tên. Xem trước để kiểm tra ảnh và mở từng liên kết trước khi đăng.

## Thử ngay

Thêm một liên kết nguồn vào ghi chú. Nếu cần ảnh, chuẩn bị ảnh thật và mô tả rõ nội dung. Kiểm tra lại ở bản xem trước Hugo.

{{< markdown-practice task="Đổi nhãn liên kết thành tên tài liệu rõ nghĩa. Thay mô tả ảnh bằng nội dung ảnh thể hiện." hint="Giữ URL trong ngoặc tròn. Thay chữ trong ngoặc vuông; ảnh có dấu ! phía trước. Ví dụ dùng favicon có sẵn để không cần tải ảnh lên." >}}
[Bấm vào đây](https://commonmark.org/help/)

![Ảnh 1](/favicon.svg)
{{< /markdown-practice >}}

Nguồn cú pháp: [CommonMark: liên kết và ảnh](https://commonmark.org/help/). Quy trình ảnh được đối chiếu với công cụ xuất bản riêng của blog Dyn.

---

**Trong series:**

- Phần 01: Markdown là gì và cách tạo tệp đầu tiên.
- Phần 02: Cách viết tiêu đề và đoạn văn.
- Phần 03: Danh sách, trích dẫn và khối mã.
- Phần 04: Cách chèn liên kết và ảnh — bạn đang đọc.
- Phần 05: Mẫu bài viết và YAML cho blog — sắp đăng.
- Phần 06: Xem trước và đăng bài lên Hugo — sắp đăng.
