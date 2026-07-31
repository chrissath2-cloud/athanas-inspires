# Add a Tool

1. Copy `templates/NEW-TOOL` into `source/content/tools` and rename it using the tool ID.
2. Complete `tool.json` for the Digital Tools directory and search.
3. Create or copy `page.njk` for the interface.
4. Put the tool JavaScript in `source/scripts/tools` and styles in `source/styles/tools`.
5. Add a clear bundle entry and page entry in `source/data/build-manifest.json`.
6. Add the tool ID to `source/content/tools/order.json`.
7. Rebuild and test phone, keyboard, direct opening, and `OPEN WEBSITE.bat`.
