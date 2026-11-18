---
title: "Add a Vietnamese Lunar Calendar (GMT+7) to Google & Apple Calendar Without Extra Apps"
date: "2026-11-17"
author: "Dyn"
category: "Tools & Automation"
tags: ["lich-am-viet-nam", "google-calendar", "apple-calendar", "ics", "automation"]
description: "Subscribe to a free, open-source Vietnamese lunar calendar (.ics) in GMT+7 on Google Calendar, Apple Calendar, and Outlook with zero extra apps."
slug: "vietnamese-lunar-calendar-google-apple-calendar"
translationKey: "vietnamese-lunar-calendar-guide"
draft: false
---

You don't need bloated third-party calendar apps or ad-filled widgets just to check Vietnamese lunar dates. By subscribing to a single `.ics` URL, your built-in calendar app displays lunar dates and major observances automatically.

## Why GMT+7 Matters for Vietnamese Lunar Dates

Many online lunar feeds mirror Chinese lunar tables calculated in **UTC+8**. Whenever an astronomical new moon falls between 23:00 and 23:59 in Vietnam (**UTC+7**), it is already 00:00–00:59 the next civil day in UTC+8—causing off-by-one-day shifts on the 1st lunar day or Lunar New Year.

The open-source [Vietnamese Lunar Calendar](https://github.com/cmduyeen/lich-am-viet-nam) computes new moons and solar terms directly in **UTC+7**, maintaining rolling two-year feeds with 27 traditional and public observances.

## Customize Online (Web Studio)

Want to pick specific lunar days, add **personal lunar birthdays or family anniversaries**, or convert Solar ↔ Lunar dates? Open **[Vietnamese Lunar Calendar Studio](https://cmduyeen.github.io/lich-am-viet-nam/)** (runs 100% in your browser, no Python needed) to export a personalized `.ics` file.

## Subscription URLs (.ics)

Choose **one** language feed to avoid duplicate daily events:

- **English:**
  ```text
  https://raw.githubusercontent.com/cmduyeen/lich-am-viet-nam/main/output/viet_lunar_en_latest.ics
  ```
- **Vietnamese:**
  ```text
  https://raw.githubusercontent.com/cmduyeen/lich-am-viet-nam/main/output/viet_lunar_latest.ics
  ```

## Subscribe in Google Calendar (4 Steps)

1. Copy one `.ics` URL above.
2. Open [Google Calendar](https://calendar.google.com/) in a desktop browser.
3. Next to **Other calendars**, click **+ → From URL**.
4. Paste the URL and click **Add calendar**. It syncs automatically to your mobile app.

## Subscribe on iPhone / iPad (Apple Calendar)

Open **Calendar** → tap **Calendars** → **Add Calendar** → **Add Subscription Calendar** → paste the `.ics` URL and tap **Subscribe**.

> Free, ad-free, and MIT-licensed. Explore the source code at [cmduyeen/lich-am-viet-nam](https://github.com/cmduyeen/lich-am-viet-nam).
