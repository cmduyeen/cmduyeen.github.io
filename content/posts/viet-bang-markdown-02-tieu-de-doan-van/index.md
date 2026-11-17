---
title: "Viết bằng Markdown, Phần 02 - Cách viết tiêu đề và đoạn văn"
date: "2026-11-17"
author: "Dyn"
slug: "viet-bang-markdown-02-tieu-de-doan-van"
category: "Viết bằng Markdown"
description: "Cách viết tiêu đề, chia đoạn và nhấn mạnh trong Markdown. Dùng một ví dụ ngắn để sắp xếp bài rõ ràng mà không thêm định dạng thừa."
tags: ["markdown", "viet-bang-markdown"]
draft: false
---

*Viết bằng Markdown · Phần 2/6*

Dùng `#`, `##`, `###` để chia cấp tiêu đề và một dòng trống để tách đoạn văn. Một bài dễ đọc bắt đầu từ việc chia rõ ý, trước khi thêm định dạng.

## Mỗi tiêu đề nói rõ một việc

```markdown
# Viết trước khi mở mạng xã hội

## Vấn đề tôi muốn sửa

Tôi thường mở điện thoại trước khi bắt đầu viết.

## Cách tôi thay đổi

Tôi để điện thoại ngoài bàn và viết trong 25 phút.

### Khi bị ngắt quãng

Tôi ghi lại ý đang viết rồi mới chuyển việc.
```

Dấu `#` cần có khoảng trắng trước chữ. Dùng cấp tiêu đề theo bố cục, không chọn cấp chỉ vì muốn chữ to hoặc nhỏ.

Tiêu đề “Tạo tệp đầu tiên” nói rõ việc cần làm hơn “Bắt đầu hành trình”. Đọc riêng các tiêu đề cũng nên hiểu được mạch bài.

Trên blog Dyn, giao diện đã hiển thị tên bài thành tiêu đề cấp một. Nội dung bài vì vậy bắt đầu bằng đoạn mở đầu, sau đó dùng `##`.

## Tách đoạn bằng dòng trống

```markdown
Tôi viết bản nháp trước.

Sau đó tôi đọc lại và bỏ câu thừa.
```

Xuống dòng một lần trong tệp nguồn không đảm bảo tạo đoạn mới ở bản hiển thị. Để chuyển đoạn, thêm một dòng trống. Mỗi đoạn giữ một ý; khi chuyển ý, hãy xuống đoạn.

## Nhấn mạnh vừa đủ

Dùng `**in đậm**` cho ý quan trọng và `*in nghiêng*` khi cần nhấn nhẹ. Đừng in đậm cả đoạn: người đọc sẽ khó nhận ra điểm cần chú ý.

## Thử ngay

Mở ghi chú ở phần 1. Chia thành hai mục rõ nghĩa, mỗi mục giữ một ý. Bỏ một câu không giúp người đọc hiểu hoặc làm được việc.

{{< markdown-practice task="Chia nội dung thành hai mục cấp hai. Tách thành hai đoạn và in đậm một ý quan trọng." hint="Thêm ## trước tên mục. Một dòng trống tạo đoạn mới. Đặt ý cần nhấn giữa hai cặp dấu **." >}}
# Viết ít nhưng rõ

Vấn đề
Tôi có nhiều ý nhưng chưa biết bắt đầu từ đâu.
Cách làm
Tôi chọn một ý rồi viết một ví dụ.
{{< /markdown-practice >}}

Nguồn: [Cú pháp tiêu đề và nhấn mạnh của CommonMark](https://commonmark.org/help/).

---

**Trong series:**

- Phần 01: Markdown là gì và cách tạo tệp đầu tiên.
- Phần 02: Cách viết tiêu đề và đoạn văn — bạn đang đọc.
- Phần 03: Danh sách, trích dẫn và khối mã — sắp đăng.
- Phần 04: Cách chèn liên kết và ảnh — sắp đăng.
- Phần 05: Mẫu bài viết và YAML cho blog — sắp đăng.
- Phần 06: Xem trước và đăng bài lên Hugo — sắp đăng.
