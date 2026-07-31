# Add an Article

1. Copy `templates/NEW-ARTICLE` into `source/content/articles` and rename the folder with a short unique ID.
2. Complete `article.json`; this feeds search, listings, and the AI Assistant.
3. Copy the closest existing article `page.njk` into the new folder and replace only article-specific content and metadata.
4. Add the article ID to `source/content/articles/order.json`.
5. Add the new page entry to `source/data/build-manifest.json` only when creating a completely new public page.
6. Add the page to `source/public/sitemap.xml`.
7. Rebuild and check the article, social image, internal links, and article listings.
