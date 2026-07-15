"""Rebuild minified CSS and JavaScript after editing source code.
Run on Windows with: py build-minified-assets.py
Requires: pip install rcssmin rjsmin
The central lesson file js/learning-content.js is loaded directly and does not need minification.
"""
from pathlib import Path
try:
    import rcssmin, rjsmin
except ImportError as exc:
    raise SystemExit("Install the minifiers first: py -m pip install rcssmin rjsmin") from exc

for path in Path("css").glob("*.css"):
    if path.name.endswith(".min.css"):
        continue
    path.with_name(path.stem + ".min.css").write_text(
        rcssmin.cssmin(path.read_text(encoding="utf-8")), encoding="utf-8"
    )

for path in Path("js").glob("*.js"):
    if path.name.endswith(".min.js") or path.name == "learning-content.js":
        continue
    path.with_name(path.stem + ".min.js").write_text(
        rjsmin.jsmin(path.read_text(encoding="utf-8")), encoding="utf-8"
    )

print("Minified website assets rebuilt successfully.")
