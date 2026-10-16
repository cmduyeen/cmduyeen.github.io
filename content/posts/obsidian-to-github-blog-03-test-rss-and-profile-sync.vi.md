---
title: "Từ Obsidian đến GitHub Pages, Phần 3: Kiểm tra RSS và đồng bộ hồ sơ"
date: 2026-10-16T20:30:00+07:00
draft: false
tags: ["obsidian", "hugo", "rss", "github-pages", "github-profile", "publishing-workflow"]
cover:
  image: "/images/posts/rss-profile-sync.svg"
  alt: "Nguồn RSS kết nối bài viết blog với hồ sơ GitHub"
---

Chúng ta đã viết một bài trong Obsidian và đẩy bài qua Hugo lên GitHub Pages. Phần cuối này kiểm tra hai đầu ra công khai giúp quy trình trở nên hữu ích: RSS của blog và danh sách bài viết trên README hồ sơ GitHub.

## Kiểm tra bài viết và nguồn RSS đã triển khai

Sau khi đẩy lên nhánh `main`, mở workflow **Build and deploy blog** trong kho blog. Chờ cả bước build và deploy hoàn tất thành công, sau đó vào trang chủ và mở bài viết.

Nguồn RSS là [`https://cmduyeen.github.io/index.xml`](https://cmduyeen.github.io/index.xml). Trang này cần trả về XML có phần tử `<channel>` và một `<item>` cho mỗi bài đã xuất bản. Nếu chưa thấy bài mới, hãy kiểm tra:

- Bài nằm trong `content/posts/`.
- Front matter hợp lệ và `draft` được đặt thành `false`.
- Trang Pages của commit mới nhất đã triển khai thành công.
- Bạn đang kiểm tra sau khi deploy hoàn tất; bộ nhớ đệm có thể tạm thời hiển thị phiên bản cũ.

## Khi nào hồ sơ GitHub được cập nhật?

Kho hồ sơ đọc RSS Hugo và cập nhật mục **Dyn** trong README bằng ảnh bìa và tiêu đề của các bài mới. Workflow chạy mỗi ngày lúc **00:17 giờ Việt Nam**; bạn cũng có thể chạy **Update profile README** thủ công trong tab Actions của kho hồ sơ để kiểm tra bài mới ngay.

Cách này giữ quy trình thường ngày gọn nhẹ: xuất bản bài chỉ kích hoạt một lần build Pages, còn hồ sơ được làm mới theo lịch hằng ngày vốn có. Chỉ cần chạy workflow hồ sơ thủ công khi bạn muốn kiểm tra đồng bộ ngay thay vì chờ đến lịch; không cần plugin mới, dịch vụ trả phí hay lịch chạy bổ sung.

## Kiểm tra README hồ sơ

Sau khi workflow hồ sơ chạy thành công, mở `README.md` của kho hồ sơ và xem mục **Dyn**. Bài mới sẽ xuất hiện cùng ảnh bìa, tiêu đề và ngày đăng. Workflow chỉ giữ lại năm bài mới nhất trong danh sách ngắn này; các bài cũ hơn vẫn còn trên blog.

Nếu workflow blog thành công nhưng workflow hồ sơ thất bại, hãy xem bước **Update blog posts**. Lỗi lấy nguồn thường có nghĩa RSS tạm thời không truy cập được hoặc Pages chưa triển khai xong. Khi nguồn đã hoạt động, hãy chạy lại workflow hồ sơ.

## Toàn bộ quy trình

```text
Markdown trong Obsidian
    -> commit và đẩy lên main
    -> Hugo dựng trang và GitHub Pages triển khai
    -> bài viết công khai và nguồn RSS
    -> README hồ sơ được cập nhật hằng ngày hoặc chạy thủ công
```

Đó là toàn bộ bài kiểm tra: chỉnh sửa nhỏ trong Obsidian, đẩy thay đổi, chờ blog triển khai, rồi chạy workflow hồ sơ nếu không muốn chờ lịch hằng ngày. Bạn có thể đọc lại [Phần 1: Tạo vault sẵn sàng xuất bản](/vi/posts/obsidian-to-github-blog-01-publishable-vault/) và [Phần 2: Xuất bản Markdown bằng Hugo](/vi/posts/obsidian-to-github-blog-02-publish-with-hugo/).
