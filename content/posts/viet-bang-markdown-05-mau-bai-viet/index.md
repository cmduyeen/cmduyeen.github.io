---
title: "Viết bằng Markdown, Phần 05 - Mẫu bài viết và YAML cho blog"
date: "2026-11-17"
author: "Dyn"
slug: "viet-bang-markdown-05-mau-bai-viet"
category: "Viết bằng Markdown"
description: "Dùng mẫu bài Markdown tối giản và phân biệt nội dung với YAML. Chuẩn bị mô tả, slug và trạng thái đúng quy trình Obsidian sang Hugo."
tags: ["markdown", "viet-bang-markdown"]
draft: false
---

*Viết bằng Markdown · Phần 5/6*

Một mẫu bài Markdown chỉ cần phần mở đầu trả lời vấn đề, cách làm, ví dụ và việc thực hành. Khi viết cho blog, thêm khối thông tin YAML theo đúng quy trình xuất bản bạn đang dùng.

## Giữ một khung nội dung nhỏ

```markdown
Nêu vấn đề và cách xử lý trong hai câu.

## Cách làm

1. Làm bước đầu tiên.
2. Kiểm tra kết quả.

## Ví dụ

Đưa một ví dụ có thể làm theo.

## Thử ngay

Giao một việc nhỏ để áp dụng.
```

Mỗi bài giải quyết một vấn đề. Nếu ví dụ bắt đầu sang chủ đề khác, tách thành bài tiếp theo. Mục nào không cần thì bỏ; mẫu giúp bắt đầu, không buộc mọi bài giống nhau.

## YAML dùng để làm gì?

Front matter là khối thông tin ở đầu tệp, thường nằm giữa hai dòng `---`. Hugo dùng thông tin này cho tiêu đề, ngày và các thuộc tính của trang. YAML là một định dạng có thể dùng cho khối đó.

Vault của Dyn dùng tên thuộc tính tiếng Việt. Đây chỉ là vài trường trích từ mẫu, không phải toàn bộ mẫu:

```yaml
Trạng thái: Nháp
Ngôn ngữ: vi
Mô tả: "Tạo tệp Markdown đầu tiên và viết tiếng Việt."
Slug: "viet-bang-markdown-01-bat-dau"
```

Các khóa tiếng Việt này dành cho công cụ riêng của Dyn. Công cụ chuyển chúng thành front matter Hugo; chép nguyên vào dự án Hugo khác chưa chắc hoạt động.

## Giữ slug ổn định

Slug là phần định danh dùng trong URL bài. Đặt không dấu và dùng gạch nối. Sau khi đăng, tránh đổi slug nếu chưa có phương án chuyển hướng vì liên kết cũ có thể hỏng.

## Thử ngay

Trong vault Dyn, sao chép mẫu bài viết đầy đủ từ thư mục `Mẫu/`. Điền mô tả riêng, chọn slug, giữ trạng thái Nháp rồi viết một ví dụ. Không chỉ sao chép bốn trường minh họa bên trên.

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

**Trong series:**

- Phần 01: Markdown là gì và cách tạo tệp đầu tiên.
- Phần 02: Cách viết tiêu đề và đoạn văn.
- Phần 03: Danh sách, trích dẫn và khối mã.
- Phần 04: Cách chèn liên kết và ảnh.
- Phần 05: Mẫu bài viết và YAML cho blog — bạn đang đọc.
- Phần 06: Xem trước và đăng bài lên Hugo — sắp đăng.
