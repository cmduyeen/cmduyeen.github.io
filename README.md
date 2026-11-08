# Dyn

Blog cá nhân tiếng Việt của Dyn, xây dựng bằng Hugo và triển khai trên GitHub Pages.

## Tính năng

Giao diện tự viết, không dùng theme, JavaScript phía trình duyệt, phông chữ bên ngoài hay dịch vụ bên thứ ba. Trang chủ sắp xếp bài mới nhất, chủ đề và danh sách bài theo tháng; website cung cấp HTML tĩnh, RSS, trang giới thiệu, lưu trữ, trang chủ đề và liên kết nhận cập nhật.

Các kênh liên hệ được cấu hình trong `[params.contact]` của `hugo.toml`. RSS luôn hiển thị; Email, X, Mastodon, Bluesky và kênh khác chỉ hiện sau khi điền thông tin. Form đăng ký email chưa bật vì cần cấu hình dịch vụ newsletter trước.

## Viết bài

Mở kho này dưới dạng vault Obsidian, sau đó tạo ghi chú Markdown trong `content/posts/`. Hãy để ghi chú riêng tư bên ngoài thư mục này: mọi nội dung trong `content/posts/` đều được xem là công khai. Cấu hình Obsidian cục bộ được Git bỏ qua.

Dùng front matter sau ở đầu mỗi bài:

```yaml
---
title: "Tiêu đề bài viết"
date: 2026-10-16T21:00:00+07:00
draft: false
tags: ["chủ-đề", "chủ-đề-khác"]
cover:
  image: "/images/posts/anh-bia.svg"
  alt: "Mô tả ngắn về ảnh bìa"
---
```

Ảnh bìa SVG được lưu cùng repository để RSS và hồ sơ GitHub có thể sử dụng; giao diện blog không tải ảnh bìa trong danh sách bài viết.

Lưu ghi chú rồi đẩy thay đổi lên nhánh `main` bằng GitHub Desktop hoặc Git. GitHub Actions sẽ tự động dựng blog và triển khai lên Pages. Có thể cài Hugo để xem trước cục bộ:

```powershell
hugo new content posts/tieu-de-bai-viet.md
```

Với bản xem trước cục bộ, đặt `draft: true` cho bài chưa xuất bản rồi chạy `hugo server -D`.

## Loạt bài hướng dẫn Obsidian

- [Phần 1: Tạo vault sẵn sàng xuất bản](https://cmduyeen.github.io/posts/obsidian-to-github-blog-01-publishable-vault/)
- [Phần 2: Xuất bản Markdown bằng Hugo](https://cmduyeen.github.io/posts/obsidian-to-github-blog-02-publish-with-hugo/)
- [Phần 3: Kiểm tra RSS và đồng bộ hồ sơ](https://cmduyeen.github.io/posts/obsidian-to-github-blog-03-test-rss-and-profile-sync/)

## Xem trước cục bộ

Cài Hugo, sau đó chạy:

```powershell
hugo server -D
```

Website chính thức tại <https://cmduyeen.github.io/> và nguồn RSS tại <https://cmduyeen.github.io/index.xml>.
