# Where to Change What

| You want to change | Edit here |
|---|---|
| Complete page skeleton | `source/_includes/layouts/base.html` |
| Navigation menu | `source/_includes/components/navigation.njk` |
| Footer | `source/_includes/components/footer.njk` |
| Main colours, corners, shadows | `source/styles/settings/design-settings.css` |
| A normal page | its `page.njk` inside `source/content/pages` |
| An article page | `source/content/articles/ARTICLE-ID/page.njk` |
| Article directory/search details | the matching `article.json` |
| A lesson | `source/content/lessons/SERIES-ID/lessons/LESSON-ID.json` |
| A tool’s listing details | `source/content/tools/TOOL-ID/tool.json` |
| A tool interface | the matching `page.njk` and `source/scripts/tools` file |
| Shared images, audio, and branding | `source/assets/shared` |
| Lesson/article-specific images and downloads | the matching content folder; public destination is listed in `source/data/content-assets.json` |
| Website build rules | `source/data/build-manifest.json` |

After changing source files, double-click `UPDATE WEBSITE.bat`.
