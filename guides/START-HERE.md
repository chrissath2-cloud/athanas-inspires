# Start Here

## The simple rule

Edit files inside **source**, then double-click **UPDATE WEBSITE.bat**. The complete site is recreated inside **website**.

You may double-click `website/index.html` for a quick view. Use `OPEN WEBSITE.bat` for complete testing.

Never keep the only copy of an important image, download, or change inside `website`, because that folder is deleted and rebuilt.

## Main folders

- `source/_includes/layouts/base.html` — the shared page skeleton.
- `source/_includes/components` — shared navigation, footer, and analytics.
- `source/content` — lessons, articles, tools, assignments, downloads, and pages.
- `source/styles` — clearly grouped CSS source files.
- `source/scripts` — clearly grouped JavaScript source files.
- `source/assets/shared` — shared branding, icons, audio, and general website files.
- Content-specific assets live beside their lesson or article source and are mapped by `source/data/content-assets.json`.
- `source/public` — CNAME, robots, sitemap, and other root public files.
- `templates` — safe starting files for new content.
- `guides` — instructions written in ordinary language.
