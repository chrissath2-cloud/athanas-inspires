# Confirmed Implementation Decisions

These decisions came from the 20-question planning process.

1. Editing is mainly done on a laptop with VS Code, often with ChatGPT assisting.
2. The project contains both clean source files and a ready-to-open `website` folder.
3. Navigation, footer, analytics, and other repeated sections are shared components.
4. The first migration preserves the current design as closely as possible.
5. All current public page addresses remain unchanged during this migration.
6. Every lesson, article, and tool has its own source area.
7. Code contains useful comments, while detailed teaching belongs in separate guides.
8. CSS is organised into settings, core, components, pages, tools, assistant, and private areas.
9. Shared design values are controlled from `source/styles/settings/design-settings.css`.
10. Node.js supports one-click building through Windows `.bat` helper files.
11. The old `website` output is deleted and freshly rebuilt; the user keeps an external backup.
12. Assets use a balanced structure: shared assets plus content-specific lesson/article assets.
13. JavaScript is organised by site, pages, tools, assistant, and private features, then bundled safely in original order.
14. Blank templates and step-by-step guides are included for new lessons, articles, and tools.
15. The site can be previewed locally and rebuilt/published automatically through GitHub Actions.
16. Full automatic checks stop critical broken builds and report smaller warnings.
17. The target is the main modern phone and computer browsers, especially Android Chrome and Samsung Internet.
18. CSS, JavaScript, and safe image copies are optimised; editable originals remain readable.
19. `website/index.html` opens directly, and `OPEN WEBSITE.bat` provides complete local-server testing.
20. Only files confirmed to be unnecessary are removed, with cleanup documented.
