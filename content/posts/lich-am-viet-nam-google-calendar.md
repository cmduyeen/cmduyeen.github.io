---
title: "Cài Lịch Âm Việt Nam chuẩn GMT+7 lên Google Calendar và Apple Calendar không cần app ngoài"
date: "2026-11-17"
author: "Dyn"
category: "Công Cụ & Tự Động Hóa"
tags: ["lich-am-viet-nam", "google-calendar", "apple-calendar", "ics", "automation"]
description: "Hướng dẫn gắn link lịch âm Việt Nam (.ics) chuẩn múi giờ GMT+7 vào Google Calendar, iPhone/Mac và Outlook miễn phí, không quảng cáo, tự động cập nhật."
slug: "cai-lich-am-viet-nam-google-calendar-apple-calendar"
translationKey: "vietnamese-lunar-calendar-guide"
draft: false
---

Nhiều người muốn xem ngày âm lịch trực tiếp trên Google Calendar hoặc iPhone nhưng lại ngại tải thêm ứng dụng bên thứ ba vì quảng cáo và hao pin. Thực tế, bạn không cần cài bất kỳ phần mềm ngoài nào — chỉ cần gắn **1 đường link `.ics`** vào ứng dụng lịch có sẵn trên máy.

## Tại sao cần lịch âm tính theo chuẩn GMT+7?

Phần lớn lịch âm miễn phí trên mạng lấy dữ liệu từ lịch Trung Quốc (múi giờ **UTC+8**). Khi thời điểm Sóc (New Moon) rơi vào khoảng 23:00–23:59 giờ Việt Nam (**UTC+7**), đồng hồ bên Trung Quốc đã bước sang 00:00–00:59 ngày hôm sau. Kết quả là ngày mùng 1, ngày rằm hoặc thậm chí ngày Tết Nguyên Đán có thể bị lệch 1 ngày.

Dự án mã nguồn mở [Lịch Âm Việt Nam](https://github.com/cmduyeen/lich-am-viet-nam) tính toán trực tiếp điểm Sóc và Tiết khí theo chuẩn **UTC+7**, phủ cuốn chiếu năm hiện tại và năm kế tiếp, kèm 27 dịp lễ âm – dương phổ biến tại Việt Nam.

## Link đăng ký lịch (.ics)

Chỉ cần chọn **một** ngôn ngữ bạn muốn hiển thị:

- **Bản Tiếng Việt:**
  ```text
  https://raw.githubusercontent.com/cmduyeen/lich-am-viet-nam/main/output/viet_lunar_latest.ics
  ```
- **Bản Tiếng Anh:**
  ```text
  https://raw.githubusercontent.com/cmduyeen/lich-am-viet-nam/main/output/viet_lunar_en_latest.ics
  ```

## Cách gắn vào Google Calendar trong 4 bước

1. Sao chép đường dẫn `.ics` ở trên.
2. Mở [Google Calendar](https://calendar.google.com/) trên trình duyệt máy tính.
3. Ở cột bên trái, cạnh mục **Lịch khác (Other calendars)**, nhấn dấu **+ → Từ URL (From URL)**.
4. Dán link và nhấn **Thêm lịch (Add calendar)**. Lịch sẽ tự đồng bộ xuống điện thoại Android/iPhone khi dùng chung tài khoản.

## Cách gắn nhanh trên iPhone / iPad (Apple Calendar)

Mở ứng dụng **Lịch** → chạm **Lịch (Calendars)** ở dưới cùng → **Thêm lịch** → **Thêm lịch đã đăng ký (Add Subscription Calendar)** → dán URL `.ics` và nhấn **Đăng ký**.

> Dự án hoàn toàn miễn phí, mã nguồn mở (MIT) và tự động cập nhật hằng năm mà không làm đổi đường dẫn đăng ký. Xem mã nguồn tại [cmduyeen/lich-am-viet-nam](https://github.com/cmduyeen/lich-am-viet-nam).
