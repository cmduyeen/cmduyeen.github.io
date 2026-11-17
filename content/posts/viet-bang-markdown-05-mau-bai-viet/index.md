---
title: "Mẫu bài viết Markdown và cách viết YAML front matter cho blog (Markdown 101 - Phần 05)"
date: "2026-11-17"
author: "Dyn"
slug: "viet-bang-markdown-05-mau-bai-viet"
category: "Markdown 101"
description: "Cách dùng mẫu bài viết Markdown, viết khối YAML front matter cho Hugo, tối ưu mô tả (description) và đặt slug chuẩn URL không dấu."
tags: ["markdown", "viet-bang-markdown"]
draft: false
---

*Markdown 101 · Phần 5/10*

Một mẫu bài viết Markdown hiệu quả chỉ cần mở đầu trả lời thẳng vấn đề, các mục `##` hướng dẫn từng bước, ví dụ thực hành và khối YAML front matter ở đầu tệp để Hugo dựng trang đúng chuẩn.

## Khung nội dung tối giản cho mỗi bài

```markdown
Nêu vấn đề và câu trả lời cốt lõi trong 1–2 câu đầu.

## Cách làm

1. Bước thứ nhất.
2. Bước thứ hai.

## Ví dụ

Đưa một ví dụ người đọc có thể sao chép và chạy thử.

## Thử ngay

Giao một bài tập nhỏ để áp dụng.
```

Mỗi bài chỉ nên giải quyết một ý định tìm kiếm chính. Khi ví dụ bắt đầu mở rộng sang chủ đề khác, hãy tách thành bài tiếp theo để giữ bài gọn và dễ tra cứu.

## Hiểu khối YAML front matter

Front matter là khối dữ liệu đặt giữa hai dòng `---` ở đầu tệp Markdown. Hugo đọc khối này để lấy tiêu đề, mô tả SEO, ngày đăng, thẻ phân loại và trạng thái nháp (`draft`).

Trong vault Obsidian của Dyn, mẫu bài dùng tên trường tiếng Việt để dễ quản lý; công cụ `blog.py` sẽ tự chuyển chúng sang trường chuẩn của Hugo khi xuất bản:

| Trường trong Obsidian | Trường Hugo tương ứng | Ý nghĩa |
| --- | --- | --- |
| Tên tệp / `title` | `title` | Tiêu đề bài viết (H1) |
| `Mô tả` | `description` | Đoạn tóm tắt cho thẻ meta & mạng xã hội |
| `Slug` | `slug` | Phần đuôi URL cố định của bài |
| `Chuyên mục` | `category` | Nhóm bài / chuyên mục |
| `Chủ đề` / `tags` | `tags` | Thẻ phân loại chủ đề |
| `Ngày xuất bản` | `date` | Ngày hiển thị trên blog |
| `Trạng thái` | `draft` | `Nháp` → `true`, `Đã đăng` → `false` |

```yaml
Trạng thái: Nháp
Ngôn ngữ: vi
Mô tả: "Tạo tệp Markdown đầu tiên và viết tiếng Việt có dấu bằng UTF-8."
Slug: "viet-bang-markdown-01-bat-dau"
```

## Viết Mô tả và đặt Slug đúng chuẩn

- **`Mô tả` (`description`)**: Viết thành câu hoàn chỉnh nêu rõ người đọc làm được gì sau khi đọc bài (khoảng 120–160 ký tự). Không nhồi danh sách từ khóa rời rạc.
- **`Slug`**: Dùng chữ thường không dấu, nối bằng dấu gạch nối (ví dụ `viet-bang-markdown-05-mau-bai-viet`). Giữ nguyên slug sau khi đã đăng để tránh làm hỏng liên kết cũ từ Google hoặc bài viết khác.

## Thử ngay

Trong vault Dyn, sao chép mẫu bài viết từ thư mục `Mẫu/` (hoặc tạo bài mới qua `blog ui`), điền `Mô tả` riêng, đặt `Slug` không dấu và giữ `Trạng thái: Nháp`.

{{< markdown-practice task="Điền mô tả và slug cho một bài bạn muốn viết. Giữ trạng thái Nháp rồi thêm một ví dụ ở phần nội dung." hint="Slug không dấu, dùng gạch nối. Phần YAML chỉ được hiển thị nguyên văn ở đây, không được kiểm tra hoặc đưa vào blog. Khi tạo bài thật, dùng mẫu đầy đủ trong vault." >}}
---
Trạng thái: Nháp
Mô tả: ""
Slug: ""
---

## Cách làm

1. Chọn một vấn đề.
2. Viết một ví dụ.
{{< /markdown-practice >}}

Nguồn: [Hugo: định dạng nội dung và front matter](https://gohugo.io/content-management/formats/). Các thuộc tính tiếng Việt thuộc quy trình riêng của blog Dyn.

---

**Trong series Markdown 101:**

- [Phần 01: Markdown là gì và cách tạo tệp đầu tiên](/posts/viet-bang-markdown-01-bat-dau/)
- [Phần 02: Cách viết tiêu đề và đoạn văn](/posts/viet-bang-markdown-02-tieu-de-doan-van/)
- [Phần 03: Danh sách, trích dẫn và khối mã](/posts/viet-bang-markdown-03-danh-sach-khoi-ma/)
- [Phần 04: Cách chèn liên kết và ảnh](/posts/viet-bang-markdown-04-lien-ket-anh/)
- **Phần 05: Mẫu bài viết và YAML cho blog** *(đang đọc)*
- [Phần 06: Xem trước và đăng bài lên Hugo](/posts/viet-bang-markdown-06-xuat-ban-hugo/)
- Phần 07: Tạo bảng và đường kẻ ngang — sắp đăng.
- Phần 08: Checklist, chú thích chân trang và escape ký tự — sắp đăng.
- Phần 09: Callout và Wikilink trong Obsidian — sắp đăng.
- Phần 10: Bài tập tổng hợp viết bài hoàn chỉnh — sắp đăng.
