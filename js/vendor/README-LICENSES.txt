Third-party components used by the Athanas Inspires QR Code Generator
=====================================================================

1. QR encoding core
   Based on QR Code Generator by Kazuhiko Arase, distributed under the MIT License.
   The browser wrapper, styling, poster export, project storage and user interface
   were implemented for Athanas Inspires.

2. JSZip
   Copyright (c) 2009-2016 Stuart Knightley, David Duponchel, Franz Buchinger,
   António Afonso. Distributed under the MIT or GPLv3 license.

Optional browser-loaded helpers
-------------------------------
3. jsQR — Apache License 2.0. Used only for enhanced QR image/camera reading when
   available. Modern browsers may instead use the native BarcodeDetector API.

4. SheetJS Community Edition — Apache License 2.0. Used only for optional Excel
   workbook import. CSV and pasted-list bulk generation work without this helper.
