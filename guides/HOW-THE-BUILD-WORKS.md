# How the Website Build Works

1. The old `website` folder is deleted.
2. Shared assets are copied from `source/assets/shared`; lesson and article assets are copied from their content folders using `source/data/content-assets.json`; root files come from `source/public`.
3. Individual lesson, article, tool, assignment, and download files are joined into the central learning information used by search and the AI Assistant.
4. Shared navigation and footer components are inserted into every full page.
5. CSS files are combined into a small number of page bundles and minified.
6. JavaScript files are combined in their original safe order and minified.
7. Large non-critical image copies are compressed conservatively. Originals remain untouched in `source`.
8. Automatic checks stop publishing when critical local files or JavaScript are broken.
