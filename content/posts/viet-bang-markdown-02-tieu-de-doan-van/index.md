---
title: "Viết bằng Markdown, Phần 02 - Cách viết tiêu đề và đoạn văn"
date: "2026-11-17"
author: "Dyn"
slug: "viet-bang-markdown-02-tieu-de-doan-van"
category: "Markdown 101"
series: "Markdown 101"
description: "Cách viết tiêu đề H1–H6, tách đoạn văn, ngắt dòng đúng chuẩn và nhấn mạnh chữ trong Markdown để bài viết rõ ràng, dễ đọc trên blog."
tags: ["markdown", "viet-bang-markdown"]
draft: false
---

*Markdown 101 · Phần 2/6*

Dùng `#`, `##`, `###` để chia cấp tiêu đề và một dòng trống để tách đoạn văn trong Markdown. Bố cục rõ giúp cả người đọc lẫn công cụ tìm kiếm nắm nhanh mạch nội dung ngay khi lướt qua.

## Chia cấp tiêu đề từ H1 đến H6

Markdown hỗ trợ 6 cấp tiêu đề tương ứng từ `#` (H1) đến `######` (H6). Trong bài viết thông thường, bạn chủ yếu dùng `##` cho mục lớn và `###` cho ý phụ bên trong:

```markdown
## Vấn đề tôi muốn sửa

Tôi thường mở điện thoại trước khi bắt đầu viết.

## Cách tôi thay đổi

Tôi để điện thoại ngoài bàn và viết trong 25 phút.

### Khi bị ngắt quãng

Tôi ghi lại ý đang viết rồi mới chuyển việc.
```

Dấu `#` luôn cần một khoảng trắng trước chữ. Chọn cấp tiêu đề theo thứ tự cấu trúc (không nhảy cóc từ `##` xuống `####` chỉ vì muốn chữ nhỏ).

Trên blog Hugo, tên bài viết đã tự động hiển thị thành thẻ tiêu đề chính (`H1`). Vì vậy phần thân bài nên bắt đầu bằng đoạn mở đầu, sau đó dùng `##` để tránh lặp hai `H1` trên cùng một trang.

## Tách đoạn văn và ngắt dòng đúng cách

```markdown
Đây là đoạn thứ nhất.

Đây là đoạn thứ hai, cách nhau bởi một dòng trống.
```

Xuống dòng một lần trong tệp nguồn thường bị gộp chung thành một đoạn khi hiển thị. Để tách đoạn mới, thêm **một dòng trống** ở giữa. Mỗi đoạn nên giữ gọn một ý (1–3 câu).

Nếu muốn xuống dòng trong cùng một đoạn (ví dụ viết thơ hoặc địa chỉ), thêm **hai dấu cách** ở cuối dòng trước hoặc dùng dấu `\` ở cuối dòng theo chuẩn CommonMark.

## Nhấn mạnh chữ vừa đủ

- `**in đậm**`: dùng cho từ khóa hoặc ý quan trọng cần nổi bật.
- `*in nghiêng*`: dùng khi nhấn nhẹ, nhắc thuật ngữ hoặc tên tài liệu.
- `***đậm và nghiêng***`: kết hợp cả hai khi thật sự cần thiết.
- `~~gạch ngang~~`: đánh dấu phần đã bỏ hoặc thay đổi (hỗ trợ trên GitHub Flavored Markdown và Hugo).

Tránh in đậm cả đoạn dài vì sẽ làm mất tác dụng định hướng mắt người đọc.

## Thử ngay

Mở tệp ghi chú ở phần 1, chia nội dung thành hai mục `##` rõ nghĩa và kiểm tra xem bạn đã tách đoạn bằng dòng trống chưa.

{{< markdown-practice task="Chia nội dung thành hai mục cấp hai. Tách thành hai đoạn và in đậm một ý quan trọng." hint="Thêm ## trước tên mục. Một dòng trống tạo đoạn mới. Đặt ý cần nhấn giữa hai cặp dấu **." >}}
# Viết ít nhưng rõ

Vấn đề
Tôi có nhiều ý nhưng chưa biết bắt đầu từ đâu.
Cách làm
Tôi chọn một ý rồi viết một ví dụ.
{{< /markdown-practice >}}

Nguồn: [Cú pháp tiêu đề và nhấn mạnh của CommonMark](https://commonmark.org/help/).

---

**Trong series Markdown 101:**

- [Phần 01: Markdown là gì và cách tạo tệp đầu tiên](/posts/viet-bang-markdown-01-bat-dau/)
- **Phần 02: Cách viết tiêu đề và đoạn văn** *(đang đọc)*
- [Phần 03: Danh sách, trích dẫn và khối mã](/posts/viet-bang-markdown-03-danh-sach-khoi-ma/)
- [Phần 04: Cách chèn liên kết và ảnh](/posts/viet-bang-markdown-04-lien-ket-anh/)
- [Phần 05: Mẫu bài viết và YAML cho blog](/posts/viet-bang-markdown-05-mau-bai-viet/)
- [Phần 06: Xem trước và đăng bài lên Hugo](/posts/viet-bang-markdown-06-xuat-ban-hugo/)
