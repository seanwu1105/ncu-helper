# NCU Helper

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/khhogbhcofdjjccjhgganhkhokibnfnb.svg)](https://chrome.google.com/webstore/detail/ncu-helper/khhogbhcofdjjccjhgganhkhokibnfnb)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/khhogbhcofdjjccjhgganhkhokibnfnb.svg)](https://chrome.google.com/webstore/detail/ncu-helper/khhogbhcofdjjccjhgganhkhokibnfnb/reviews)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/khhogbhcofdjjccjhgganhkhokibnfnb.svg)](https://chrome.google.com/webstore/detail/ncu-helper/khhogbhcofdjjccjhgganhkhokibnfnb)
[![dependencies Status](https://david-dm.org/GLaDOS1105/ncu-helper/status.svg)](https://david-dm.org/GLaDOS1105/ncu-helper)

Add some features and change the design of NCU web pages in a more modern style.

![wallpaper](https://i.imgur.com/YJOgTIK.png)

## Installing

[![extension](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png)](https://goo.gl/YM69cw)

## Features

> All features are available in **Traditional Chinese** only.

1. Beautify LMS (Learning Management System)
2. Beautify NCU Portal Login Page
3. Beautify NCU CIS Score Inquiries web pages and Automatically Calculate GPA
4. Beautify NCU CIS Graduation Check List
5. Dorm Netflow Upload Stream Monitoring (get info to avoid violating the limit and banned by NCUCC)

### GPA Support

* Overall GPA
* Major GPA
* Last 60 Credits GPA
* Senior/Junior GPA

### Calculating Modes

![GPA Calculation](https://i.imgur.com/QcwunE7.gif)

> All calculation is running in **local** browser.

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

![Dorm Netflow](https://i.imgur.com/nqkrA97.png)

The net flow data source is: <https://uncia.cc.ncu.edu.tw/dormnet/index.php?section=netflow>

> The extension will **NOT** automatically upload your IP address which is stored locally in your chrome.

## Support

Current only support Google Chrome.

## Developing

### Setting up Dev

``` bash
git clone git@github.com:GLaDOS1105/ncu-helper.git
cd ncu-helper
npm install
```

### Compiles with Hot-Reload for Development

``` bash
npm run serve
```

### Compiles and Minifies for Production

``` bash
npm run build
```

### Lints and Fixes Files

``` bash
npm run lint
```

### Tests

> Currently, we do not have unit tests. PR is welcome.
