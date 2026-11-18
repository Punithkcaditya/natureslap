from pathlib import Path
import urllib.request, re, concurrent.futures, subprocess

def download(url):
    return subprocess.check_output(["curl.exe", "-f", "-s", "-L", "-A", "Mozilla/5.0", url], timeout=45)

root = Path(__file__).resolve().parent.parent
out = root / 'public' / 'assets'
out.mkdir(parents=True, exist_ok=True)
base = 'https://demo2.themelexus.com/amihomestay/wp-content/'
html = (root / 'Untitled-1.html').read_text(encoding='utf-8')
html = html.replace('//demo2.themelexus.com', 'https://demo2.themelexus.com').replace('https:https://', 'https://')
urls = set(re.findall(r'https?[^\s<>"\x27\\]+?\.(?:jpg|png|webp|svg)', html))
for name in ['post-5', 'post-35', 'post-1504']:
    css = download(base + 'uploads/elementor/css/' + name + '.css').decode()
    (out / (name + '-reference.css')).write_text(css, encoding='utf-8')
    urls.update(re.findall(r'https?[^\s<>"\x27\\)]+?\.(?:jpg|png|webp|svg)', css))
for font in ['cinzel', 'ubuntu']:
    css = download(base + 'uploads/elementor/google-fonts/css/' + font + '.css').decode()
    fonturls = set(re.findall(r'https?[^\s)"\x27]+', css))
    for url in fonturls:
        if '.woff' in url:
            filename = url.split('/')[-1]
            (out / filename).write_bytes(download(url))
            css = css.replace(url, '/assets/' + filename)
    (out / (font + '.css')).write_text(css, encoding='utf-8')
def fetch(url):
    name=url.split('/')[-1]
    if re.search(r'-\d+x\d+\.', name): return
    try:
        data=download(url)
        (out/name).write_bytes(data)
        return name
    except Exception as e: return f'FAILED {name}: {e}'
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    for result in pool.map(fetch, sorted(urls)):
        if result: print(result)
