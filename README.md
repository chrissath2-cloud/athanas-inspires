# Athanas Inspires Website

## Update lessons, articles, pages, search, and the AI Assistant

The central public-content source is `js/learning-content.js`. It now contains website pages, articles, lessons, assignments, downloads, tools, latest updates, and AI Assistant article knowledge.

When adding an article, update the `articles` array and `latestUpdates` in that file. The website search, article hubs, homepage feature, related article navigation, and AI Assistant read from the same central content.

Run `python website-content-audit.py` before uploading the website.
