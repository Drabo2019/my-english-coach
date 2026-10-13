"""Tiny Markdown -> standalone HTML converter for docs/GUIDE-TESTEURS.md (headings, lists,
checkboxes, tables, quotes, code fences, bold/italic/code/links). Usage:
    python md2html.py ../GUIDE-TESTEURS.md guide-testeur.html
Then print to PDF with Chrome: chrome --headless --print-to-pdf=guide-testeur.pdf guide-testeur.html
"""
import html
import re
import sys


def inline(t: str) -> str:
    t = html.escape(t, quote=False)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<![\w*])\*([^*\n]+)\*(?!\w)', r'<em>\1</em>', t)
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', t)
    return t


def convert(md: str) -> str:
    out, lines, i = [], md.split('\n'), 0
    ul = False

    def close_ul():
        nonlocal ul
        if ul:
            out.append('</ul>')
            ul = False

    while i < len(lines):
        ln = lines[i]
        if ln.startswith('```'):
            close_ul()
            buf = []
            i += 1
            while i < len(lines) and not lines[i].startswith('```'):
                buf.append(html.escape(lines[i]))
                i += 1
            out.append('<pre>' + '\n'.join(buf) + '</pre>')
        elif ln.startswith('|'):
            close_ul()
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?', c) for c in cells):
                    rows.append(cells)
                i += 1
            i -= 1
            out.append('<table><thead><tr>' + ''.join(f'<th>{inline(c)}</th>' for c in rows[0]) + '</tr></thead><tbody>')
            for r in rows[1:]:
                out.append('<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in r) + '</tr>')
            out.append('</tbody></table>')
        elif re.match(r'^#{1,4} ', ln):
            close_ul()
            n = len(ln) - len(ln.lstrip('#'))
            out.append(f'<h{n}>{inline(ln[n + 1:])}</h{n}>')
        elif ln.startswith('> '):
            close_ul()
            out.append(f'<blockquote>{inline(ln[2:])}</blockquote>')
        elif re.match(r'^- \[[ x]\] ', ln):
            if not ul:
                out.append('<ul class="check">')
                ul = True
            out.append(f'<li><span class="box"></span>{inline(ln[6:])}</li>')
        elif re.match(r'^(- |\d+\. )', ln):
            if not ul:
                out.append('<ul>')
                ul = True
            item = re.sub(r'^(- |\d+\. )', '', ln)
            out.append(f'<li>{inline(item)}</li>')
        elif ln.strip() == '---':
            close_ul()
            out.append('<hr>')
        elif ln.strip() == '':
            close_ul()
        else:
            close_ul()
            out.append(f'<p>{inline(ln)}</p>')
        i += 1
    close_ul()
    return '\n'.join(out)


CSS = """
:root{--ink:#1b2133;--dim:#5b6478;--accent:#3D4FE0;--soft:#eef0ff;--line:#dfe3ee}
*{box-sizing:border-box}
body{font:16px/1.55 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:var(--ink);max-width:820px;margin:0 auto;padding:28px 20px 60px;background:#fff}
h1{font-size:28px;line-height:1.2;margin:0 0 14px;color:var(--accent)}
h2{font-size:21px;margin:34px 0 10px;padding-bottom:6px;border-bottom:2px solid var(--soft)}
h3{font-size:17px;margin:22px 0 6px}
p{margin:8px 0}
blockquote{margin:12px 0;padding:10px 14px;background:var(--soft);border-left:4px solid var(--accent);border-radius:6px}
code{background:#f3f4f8;padding:1px 5px;border-radius:4px;font-size:.92em}
pre{background:#f3f4f8;padding:12px 14px;border-radius:8px;overflow:auto;font-size:.9em}
ul{padding-left:22px}li{margin:4px 0}
ul.check{list-style:none;padding-left:0}
ul.check li{display:flex;gap:10px;align-items:flex-start}
.box{flex:none;width:16px;height:16px;border:2px solid var(--accent);border-radius:4px;margin-top:4px}
table{width:100%;border-collapse:collapse;margin:12px 0;font-size:.94em}
th,td{border:1px solid var(--line);padding:7px 9px;text-align:left;vertical-align:top}
th{background:var(--soft)}
hr{border:0;border-top:1px solid var(--line);margin:26px 0}
a{color:var(--accent)}
@media print{body{padding:0;max-width:none;font-size:11.5pt}h2{break-after:avoid}table,pre,blockquote{break-inside:avoid}}
"""

if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    md = open(src, encoding='utf-8').read()
    title = re.match(r'# (.+)', md).group(1)
    doc = f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)}</title><style>{CSS}</style></head><body>{convert(md)}</body></html>'
    open(dst, 'w', encoding='utf-8').write(doc)
    print('wrote', dst)
