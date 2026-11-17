---
title: "Viết bằng Markdown, Phần 01 - Markdown là gì và cách tạo tệp đầu tiên"
date: "2026-11-17"
author: "Dyn"
slug: "viet-bang-markdown-01-bat-dau"
category: "Viết bằng Markdown"
description: "Markdown là gì? Tạo tệp .md đầu tiên, viết tiếng Việt bằng UTF-8 và thử tiêu đề, đoạn văn, danh sách qua một ví dụ ngắn."
tags: ["markdown", "viet-bang-markdown"]
draft: false
---

*Viết bằng Markdown · Phần 1/6*

Markdown là cách định dạng văn bản bằng các ký hiệu đơn giản như `#` cho tiêu đề hoặc `-` cho danh sách. Bạn có thể bắt đầu bằng một tệp `.md`, chưa cần cài plugin hay chọn theme.

## Tạo tệp Markdown đầu tiên

Mở trình soạn thảo văn bản, tạo tệp `bai-dau-tien.md` và lưu bằng UTF-8. Gõ tiếng Việt bình thường:

```markdown
# Một buổi sáng ít phân tâm

Hôm nay tôi dành 25 phút để viết trước khi mở mạng xã hội.

## Việc cần làm

- Tắt thông báo.
- Mở một tệp trống.
- Viết một ý cho rõ.
```

Đây là nội dung minh họa. Dấu `#` đánh dấu tiêu đề cấp một; `##` đánh dấu mục bên trong. Dòng trống tách đoạn văn. Dấu `-` mở một mục danh sách.

## Xem kết quả

Nếu trình soạn thảo có chế độ xem trước Markdown, mở chế độ đó để đối chiếu cú pháp với phần hiển thị. Tiêu đề sẽ có hình thức khác đoạn văn và các dòng bắt đầu bằng `-` trở thành danh sách.

Trong trình soạn thảo văn bản thuần, bạn vẫn thấy các ký hiệu. Nội dung không mất đi. Markdown giữ phần chữ dễ đọc ngay trong tệp nguồn.

## Viết tiếng Việt có cần bỏ dấu không?

Không. Giữ dấu trong nội dung và tiêu đề; lưu tệp bằng UTF-8. Tên không dấu như `bai-dau-tien.md` chỉ là lựa chọn giúp thao tác với đường dẫn thuận tiện hơn.

Nếu lưu bằng trình soạn thảo tự thêm phần mở rộng `.txt`, kiểm tra để tên không thành `bai-dau-tien.md.txt`.

## Thử ngay

Viết một tiêu đề, hai đoạn ngắn và ba việc cần làm. Đóng rồi mở lại tệp để kiểm tra dấu tiếng Việt. Bạn đã có bản Markdown đầu tiên.

{{< markdown-practice task="Đổi tiêu đề thành việc bạn muốn viết hôm nay. Thêm một đoạn văn và danh sách ba việc." hint="Dùng # rồi một khoảng trắng cho tiêu đề. Tách đoạn bằng dòng trống; mỗi việc bắt đầu bằng - rồi một khoảng trắng." >}}
# Ghi chú đầu tiên

Hôm nay tôi muốn viết về một điều vừa học được.

- Mở một tệp trống.
- Viết ý chính.
{{< /markdown-practice >}}

Nguồn: [Bảng cú pháp CommonMark](https://commonmark.org/help/).

---

**Trong series:**

- Phần 01: Markdown là gì và cách tạo tệp đầu tiên — bạn đang đọc.
- Phần 02: Cách viết tiêu đề và đoạn văn — sắp đăng.
- Phần 03: Danh sách, trích dẫn và khối mã — sắp đăng.
- Phần 04: Cách chèn liên kết và ảnh — sắp đăng.
- Phần 05: Mẫu bài viết và YAML cho blog — sắp đăng.
- Phần 06: Xem trước và đăng bài lên Hugo — sắp đăng.
