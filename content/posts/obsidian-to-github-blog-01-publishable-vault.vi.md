---
title: "Từ Obsidian đến GitHub Pages, Phần 1: Tạo vault sẵn sàng xuất bản"
date: 2026-10-14T09:00:00+07:00
draft: false
tags: ["obsidian", "markdown", "hugo", "publishing-workflow"]
cover:
  image: "/images/posts/obsidian-vault.svg"
  alt: "Hình minh họa cuốn sổ đại diện cho một vault Obsidian được sắp xếp gọn gàng"
---

Đây là phần đầu trong loạt ba bài hướng dẫn viết bằng Obsidian và xuất bản lên blog Hugo trên GitHub Pages. Mục tiêu là một quy trình nhỏ gọn, dễ hiểu: viết Markdown thuần, chỉ xuất bản những ghi chú bạn chọn, rồi để website và quy trình tự động hóa hồ sơ GitHub lo phần còn lại.

1. **Phần 1:** Thiết lập vault Obsidian để viết nội dung công khai.
2. [Phần 2: Xuất bản Markdown bằng Hugo và GitHub Pages](/vi/posts/obsidian-to-github-blog-02-publish-with-hugo/)
3. [Phần 3: Kiểm tra RSS và đồng bộ hồ sơ GitHub](/vi/posts/obsidian-to-github-blog-03-test-rss-and-profile-sync/)

## Vì sao nên dùng Obsidian để soạn bài blog?

Obsidian lưu ghi chú dưới dạng tệp Markdown thông thường trên máy tính. Bạn có thể viết trong một trình soạn thảo quen thuộc mà không bị khóa vào một định dạng xuất đặc biệt. Hugo chuyển các tệp này thành trang web, còn GitHub Pages lưu trữ trang web miễn phí.

Trong blog này, các tệp nguồn nằm trong thư mục `content/posts/` của kho `cmduyeen.github.io`. Mở thư mục kho lưu trữ bằng Obsidian sẽ biến nó thành một vault, cho phép bạn viết trực tiếp tại nơi Hugo mong đợi các bài đăng.

## Phân định rõ nội dung công khai

Hãy xem `content/posts/` là thư mục công khai. Ghi chú được đặt ở đây và đẩy lên nhánh `main` có thể xuất hiện trên website và trong RSS.

Hãy lưu nhật ký cá nhân, ý tưởng còn dang dở, thông tin đăng nhập và nội dung chưa xuất bản ở một vault riêng hoặc ngoài thư mục blog. Cấu hình ứng dụng trong `.obsidian/` được Git bỏ qua, nhưng điều đó không bảo vệ nội dung bạn viết: hãy kiểm tra các tệp được đưa vào commit trước mỗi lần đẩy lên.

Cấu trúc đơn giản là đủ:

```text
cmduyeen.github.io/
├── content/
│   ├── posts/       # bài viết công khai
│   ├── archives.md
│   └── search.md
├── themes/
└── .obsidian/       # cấu hình cục bộ; được Git bỏ qua
```

Bạn không cần plugin xuất bản Obsidian cho quy trình này. Obsidian dùng để sửa Markdown; GitHub Actions sẽ dựng website sau khi bạn đẩy thay đổi lên.

## Tạo bài viết với front matter của Hugo

Hugo dùng front matter ở đầu tệp để lưu tiêu đề, ngày đăng, trạng thái bản nháp và thẻ:

```yaml
---
title: "Một ghi chú hữu ích"
date: 2026-10-16T21:00:00+07:00
draft: false
tags: ["obsidian", "workflow"]
---
```

Tạo tệp như `content/posts/ghi-chu-huu-ich.md`, rồi viết bài bên dưới dấu `---` kết thúc. Giữ `draft: true` khi bài chưa sẵn sàng; chỉ chuyển thành `false` khi bạn muốn công khai. Dùng các thẻ ngắn gọn để người đọc tìm được những bài liên quan.

Để liên kết các bài đã xuất bản, hãy dùng Markdown thông thường, chẳng hạn `[Phần 2](/vi/posts/obsidian-to-github-blog-02-publish-with-hugo/)`. Cú pháp `[[wikilinks]]` của Obsidian hữu ích trong vault, nhưng Hugo không tự động biến mọi wikilink thành liên kết trên website.

## Kiểm tra lần đầu

Trong Obsidian, tạo ghi chú mới dưới `content/posts/`, thêm front matter rồi lưu. Sau đó xem các thay đổi Git của kho lưu trữ. Ghi chú đó nên là tệp nội dung duy nhất bạn định công khai.

Trong [Phần 2](/vi/posts/obsidian-to-github-blog-02-publish-with-hugo/), chúng ta sẽ đẩy tệp Markdown lên GitHub và theo dõi quá trình Hugo tự động triển khai.
