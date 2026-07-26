from pathlib import Path
from bs4 import BeautifulSoup
import re, sys
root=Path(__file__).resolve().parent
errors=[]; warnings=[]
html_files=list(root.glob('*.html'))
known={p.name for p in html_files}
for page in html_files:
    soup=BeautifulSoup(page.read_text(encoding='utf-8'),'html.parser')
    for tag,attr in [('a','href'),('img','src'),('script','src'),('link','href')]:
        for node in soup.find_all(tag):
            url=(node.get(attr) or '').split('?')[0].split('#')[0]
            if not url or url.startswith(('http:','https:','mailto:','tel:','data:','javascript:')): continue
            target=(page.parent/url).resolve()
            if not target.exists(): errors.append(f'{page.name}: missing {url}')
    if 'learning-content.min.js' in page.read_text(encoding='utf-8'):
        errors.append(f'{page.name}: still loads stale learning-content.min.js')
content=(root/'js/learning-content.js').read_text(encoding='utf-8')
for url in re.findall(r'url:\s*"([^"]+\.html(?:#[^"]*)?)"',content):
    filename=url.split('#')[0]
    if filename and filename not in known: errors.append(f'Central content points to missing page: {url}')

central_urls=set(re.findall(r'url:\s*"([^"#?]+\.html)',content))
central_urls.update(re.findall(r'"url":"([^"#?]+\.html)',content))
excluded={"404.html","website-health-check.html"}
for filename in sorted(known-excluded):
    if filename not in central_urls and filename != "build-skills-that-make-you-difficult-to-ignore.html":
        # Article URLs in compact JSON are included by the second expression; this is a true coverage warning.
        warnings.append(f'Public page is not explicitly catalogued in central content: {filename}')

sitemap=(root/'sitemap.xml').read_text(encoding='utf-8')
for required in ['build-skills-that-make-you-difficult-to-ignore.html','faith-inspiration.html','technology-insights.html']:
    if required not in sitemap: errors.append(f'Sitemap missing {required}')
for js in ['js/learning-content.js','js/content-pages.js','js/site-search.js','js/assistant-learning-sync.js','js/article.js','js/assistant-loader.js']:
    if not (root/js).exists(): errors.append(f'Missing {js}')
print(f'Checked {len(html_files)} HTML pages.')
if warnings:
    print('\nWarnings:'); [print(' -',w) for w in warnings]
if errors:
    print('\nErrors:'); [print(' -',e) for e in sorted(set(errors))]
    sys.exit(1)
print('PASS: public links, central content references, sitemap entries, and source loading checks are consistent.')
