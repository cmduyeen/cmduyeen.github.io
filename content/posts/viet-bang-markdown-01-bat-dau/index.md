---
title: "Markdown là gì và cách tạo tệp .md đầu tiên (Markdown 101 - Phần 01)"
date: "2026-11-17"
author: "Dyn"
slug: "viet-bang-markdown-01-bat-dau"
category: "Markdown 101"
description: "Markdown là gì? Hướng dẫn tạo tệp .md đầu tiên bằng UTF-8, viết tiếng Việt có dấu và nắm nhanh bảng cú pháp cơ bản để ghi chú hoặc viết blog."
tags: ["markdown", "viet-bang-markdown", "huong-dan-markdown"]
draft: false
---

*Markdown 101 · Phần 1/10*

Markdown là ngôn ngữ đánh dấu nhẹ dùng các ký hiệu văn bản thuần như `#` cho tiêu đề hoặc `-` cho danh sách để định dạng tài liệu. Bạn chỉ cần một tệp `.md` và trình soạn thảo bất kỳ (Notepad, VS Code, Obsidian) để bắt đầu, không phụ thuộc phần mềm trả phí hay định dạng đóng.

## Vì sao nên viết bằng Markdown?

Tệp Markdown lưu dưới dạng văn bản thuần nên mở được trên mọi hệ điều hành, kể cả sau nhiều năm. Khi không cần định dạng phức tạp như Word, bạn tập trung vào cấu trúc ý thay vì chỉnh phông chữ hay căn lề thủ công.

Nhiều công cụ như Obsidian, GitHub, Notion và các trình tạo trang tĩnh như Hugo đều đọc trực tiếp tệp `.md`.

## Tạo tệp Markdown đầu tiên

Mở trình soạn thảo văn bản, tạo tệp `bai-dau-tien.md` và chọn bảng mã **UTF-8**. Gõ tiếng Việt có dấu bình thường:

```markdown
# Một buổi sáng ít phân tâm

Hôm nay tôi dành 25 phút để viết trước khi mở mạng xã hội.

## Việc cần làm

- Tắt thông báo.
- Mở một tệp trống.
- Viết một ý cho rõ.
```

Trong ví dụ trên, `#` tạo tiêu đề chính, `##` tạo mục con, dòng trống tách đoạn văn và `-` mở từng mục danh sách.

## Bảng tóm tắt cú pháp hay dùng

| Mục đích | Cú pháp Markdown | Kết quả |
| --- | --- | --- |
| Tiêu đề mục | `## Tiêu đề` | Tiêu đề cấp 2 |
| In đậm | `**chữ đậm**` | **chữ đậm** |
| In nghiêng | `*chữ nghiêng*` | *chữ nghiêng* |
| Danh sách | `- Mục một` | Gạch đầu dòng |
| Mã ngắn | `` `lenh` `` | `lenh` |
| Liên kết | `[nhãn](https://...)` | Liên kết bấm được |

## Lỗi thường gặp khi mới bắt đầu

- **Lưu nhầm thành `.md.txt`**: Trên Windows, Notepad đôi khi tự thêm `.txt` phía sau. Khi lưu, chọn *Save as type: All Files* để giữ đúng đuôi `.md`.
- **Lỗi dấu tiếng Việt**: Nếu mở lại thấy ký tự lạ, kiểm tra lại trình soạn thảo đã chọn mã hóa **UTF-8** (không phải ANSI).
- **Quên khoảng trắng sau `#` hoặc `-`**: `#Tiêu đề` không tạo thành tiêu đề; cần viết `# Tiêu đề`.

## Thử ngay

Tạo một tệp `.md`, viết một tiêu đề, hai đoạn ngắn và ba việc cần làm. Đóng rồi mở lại tệp để kiểm tra dấu tiếng Việt.

{{< markdown-practice task="Đổi tiêu đề thành việc bạn muốn viết hôm nay. Thêm một đoạn văn và danh sách ba việc." hint="Dùng # rồi một khoảng trắng cho tiêu đề. Tách đoạn bằng dòng trống; mỗi việc bắt đầu bằng - rồi một khoảng trắng." >}}
# Ghi chú đầu tiên

Hôm nay tôi muốn viết về một điều vừa học được.

- Mở một tệp trống.
- Viết ý chính.
{{< /markdown-practice >}}

Nguồn: [Bảng cú pháp CommonMark](https://commonmark.org/help/).

---

**Trong series Markdown 101:**

- **Phần 01: Markdown là gì và cách tạo tệp đầu tiên** *(đang đọc)*
- [Phần 02: Cách viết tiêu đề và đoạn văn](/posts/viet-bang-markdown-02-tieu-de-doan-van/)
- [Phần 03: Danh sách, trích dẫn và khối mã](/posts/viet-bang-markdown-03-danh-sach-khoi-ma/)
- [Phần 04: Cách chèn liên kết và ảnh](/posts/viet-bang-markdown-04-lien-ket-anh/)
- [Phần 05: Mẫu bài viết và YAML cho blog](/posts/viet-bang-markdown-05-mau-bai-viet/)
- [Phần 06: Xem trước và đăng bài lên Hugo](/posts/viet-bang-markdown-06-xuat-ban-hugo/)
- Phần 07: Tạo bảng và đường kẻ ngang — sắp đăng.
- Phần 08: Checklist, chú thích chân trang và escape ký tự — sắp đăng.
- Phần 09: Callout và Wikilink trong Obsidian — sắp đăng.
- Phần 10: Bài tập tổng hợp viết bài hoàn chỉnh — sắp đăng.
