# NCU Helper

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/khhogbhcofdjjccjhgganhkhokibnfnb.svg)](https://chrome.google.com/webstore/detail/ncu-helper/khhogbhcofdjjccjhgganhkhokibnfnb)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/khhogbhcofdjjccjhgganhkhokibnfnb.svg)](https://chrome.google.com/webstore/detail/ncu-helper/khhogbhcofdjjccjhgganhkhokibnfnb/reviews)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/khhogbhcofdjjccjhgganhkhokibnfnb.svg)](https://chrome.google.com/webstore/detail/ncu-helper/khhogbhcofdjjccjhgganhkhokibnfnb)

Add some features and change the design of NCU web pages in a more modern style.

![Portal](https://i.imgur.com/eUBvdGJ.png)
![LMS 1](https://i.imgur.com/m8mPeDm.png)
![LMS 2](https://i.imgur.com/loFFgbD.png)
![Score Inquiries](https://i.imgur.com/1NIVysp.png)

> All calculation is running in **local** browser.

## Features

1. Beautify LMS (Learning Management System)
2. Beautify NCU Portal Login Page
3. Beautify NCU CIS Score Inquiries web pages and Automatically Calculate GPA (zhTW only)
4. Beautify NCU CIS Graduation Check List
5. Dorm Netflow Upload Stream Monitoring (get info to avoid violating the limit and banned by NCUCC)

### GPA Support

* Overall GPA
* Major GPA
* Last 60 Credits GPA
* Senior/Junior GPA

### Calculating Modes

![GPA Calculation](https://i.imgur.com/QcwunE7.gif)

#### NCU (4.0)

| Score | 100-80 | 79-70 | 69-60 | 59-1 | 0 |
|-------|--------|-------|-------|------|---|
| Grade | A      | B     | C     | F    | F |
| GP    | 4      | 3     | 2     | 1    | 0 |

#### NTU (4.3)

| Score | 100-90 | 89-85 | 84-80 | 79-77 | 76-73 | 72-70 | 69-67 | 66-63 | 62-60 | 59-0 |
|-------|--------|-------|-------|-------|-------|-------|-------|-------|-------|------|
| Grade | A+     | A     | A-    | B+    | B     | B-    | C+    | C     | C-    | F    |
| GP    | 4.3    | 4.0   | 3.7   | 3.3   | 3.0   | 2.7   | 2.3   | 2.0   | 1.7   | 0    |

### Dorm Netflow Monitoring

![Dorm Netflow](https://i.imgur.com/gh9Cxue.gif)

#### Setup the IP Address

Go to settings and set the target NCU dorm IP address.
![Dorm Netflow Setting](https://i.imgur.com/SOSOTUG.png)

The net flow data source is: <https://uncia.cc.ncu.edu.tw/dormnet/index.php?section=netflow>

> The extension will **NOT** automatically upload your IP address which is stored locally in your chrome.

## Installation

Install in Chrome Extension website: <https://goo.gl/YM69cw>

## Motivation

Some layouts of NCU website are rather ugly and dazzling. Also, calculating GPA
by hands is slow and dumb.

## Support

Current only support Google Chrome.

## TODOs

* [ ] Include more webpages in beautified.
* [x] GPA calculator.
* [x] Add switch for each webpage to activate this extension on the `popup.html`.
* [x] Dynamically display dorm IP upload/download stream usage.
* [ ] Unit test (but for Chrome Extension, unit test is rather cumbersome...)
* [ ] Convert JavaScript files into TypeScript
