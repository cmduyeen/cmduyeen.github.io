---
title: "Từ Obsidian đến GitHub Pages, Phần 2: Xuất bản Markdown bằng Hugo"
date: 2026-10-15T09:00:00+07:00
draft: false
tags: ["obsidian", "markdown", "hugo", "github-pages", "publishing-workflow"]
cover:
  image: "/images/posts/hugo-publishing.svg"
  alt: "Tài liệu Markdown đi qua Hugo để trở thành website đã xuất bản"
---

Trong [Phần 1](/vi/posts/obsidian-to-github-blog-01-publishable-vault/), chúng ta đã thiết lập Obsidian để chỉnh sửa mã nguồn Markdown của blog. Bây giờ hãy xuất bản một bài viết và xem nó được đưa lên website như thế nào.

## Lưu ghi chú trong thư mục nội dung của Hugo

Tạo hoặc chỉnh sửa tệp `.md` trong `content/posts/`. Một bài viết được xuất bản cần front matter gồm tiêu đề, ngày đăng, `draft: false` và các thẻ phù hợp:

```yaml
---
title: "Bài viết Obsidian đầu tiên của tôi"
date: 2026-10-16T21:00:00+07:00
draft: false
tags: ["obsidian", "first-post"]
---
```

Viết nội dung bên dưới front matter bằng Markdown thông thường: tiêu đề, đoạn văn, danh sách, khối mã và liên kết. Xem trước trong Obsidian giúp kiểm tra định dạng Markdown, nhưng không mô phỏng hoàn toàn giao diện PaperMod; hãy kiểm tra trang sau khi triển khai nữa.

## Đẩy bài viết bằng GitHub Desktop

Khi bài viết đã sẵn sàng:

1. Xem lại các tệp thay đổi và xác nhận chỉ có nội dung công khai dự định xuất bản.
2. Nhập thông điệp commit ngắn, chẳng hạn `Add first Obsidian post`.
3. Tạo commit trên nhánh `main` rồi đẩy lên GitHub.

Lần đẩy này kích hoạt quy trình **Build and deploy blog** hiện có. GitHub Actions lấy mã nguồn cùng theme PaperMod, dựng website bằng Hugo Extended rồi triển khai lên GitHub Pages. Bạn không cần chạy Hugo cục bộ chỉ để xuất bản bài.

Kho mã nguồn của blog là [cmduyeen.github.io trên GitHub](https://github.com/cmduyeen/cmduyeen.github.io), còn website đang hoạt động tại [cmduyeen.github.io](https://cmduyeen.github.io/). Nếu thay đổi chưa xuất hiện, hãy kiểm tra lần chạy workflow; đẩy Git thành công chưa đồng nghĩa với việc build và deploy cũng thành công.

## Tránh những sự cố xuất bản thường gặp

- Bài có `draft: true` sẽ bị bỏ qua trong bản dựng production thông thường.
- Tệp nằm ngoài `content/posts/` không tự động trở thành bài viết.
- Ghi chú đã lưu trong Obsidian nhưng chưa commit và đẩy lên sẽ chỉ nằm trên máy của bạn.
- Không cần plugin Obsidian hoặc wikilink; hãy dùng Markdown thông thường để nội dung dễ di chuyển.
- Không đưa bí mật hoặc ghi chú riêng tư vào kho blog công khai.

## Tiếp theo: kiểm tra toàn bộ quy trình

Sau khi triển khai, bài viết sẽ xuất hiện trên trang chủ, trang thẻ và RSS tại [`/index.xml`](https://cmduyeen.github.io/index.xml). Trong [Phần 3](/vi/posts/obsidian-to-github-blog-03-test-rss-and-profile-sync/), chúng ta sẽ dùng các đầu ra đó để kiểm tra việc đồng bộ README hồ sơ.
