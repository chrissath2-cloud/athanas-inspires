# Build and Verification Report

## Completed migration

- 33 HTML pages generated with all current public addresses preserved.
- Shared navigation and footer are maintained from one source file each.
- Lessons, articles, tools, assignments, and downloads are split into individual source files.
- CSS is grouped into 8 generated public bundles.
- JavaScript is grouped by page purpose while preserving the original script order.
- Shared and content-specific assets are separated in the source structure.
- The private page no longer loads Google Analytics.
- The public password instruction file is not included.
- Development notes and duplicate old generated CSS/JavaScript files are excluded from the public output.

## Verification performed

- All 33 pages were regenerated successfully.
- All local page, image, script, stylesheet, and download targets were checked.
- No duplicate HTML IDs were found.
- All generated JavaScript files passed `node --check` syntax validation.
- All 8 generated CSS bundles parsed without CSS syntax errors.
- Page body text and HTML tag structure were compared with the original package: 33 of 33 matched.
- Head metadata matched after ignoring intentionally replaced analytics/scripts/styles and comments.
- Current filenames, nested tool paths, canonical URLs, sitemap, CNAME, robots file, and downloadable resources were retained.

## Loading improvement

Representative pages now load about 3 local CSS/JavaScript files instead of roughly 19–24 separate files. The total bytes per first page remain close to the original because visual and interactive behaviour was deliberately preserved, but the number of requests and maintenance complexity are substantially reduced.

## Important note

The first migration prioritises visual and functional preservation. Some older compatibility CSS remains inside clearly named source files. It can now be modernised gradually without returning to dated override files.

## 31 July 2026 — Contrast and YouTube repair

- Replaced the unsafe CSS character compressor. It removed meaningful selector spaces and changed descendant selectors, which caused dark text on dark hover backgrounds and hid YouTube reveal sections.
- Production CSS is now combined conservatively without changing selector meaning. Browser/server compression still reduces transfer size.
- Restored the eight learner testimonials to the central generated content data.
- Added a defensive YouTube fallback so missing testimonial data can never prevent lesson sections from being revealed.
- Updated the public asset version to `20260731-contrast-youtube-2` so browsers request the corrected CSS and JavaScript instead of cached broken bundles.
- Verified 33 generated pages, 11 YouTube lesson rows, 8 testimonial records, local links, duplicate IDs, and JavaScript syntax.

