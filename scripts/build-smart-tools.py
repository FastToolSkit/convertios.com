"""Render the smart tool catalog, four language variants and their discovery links."""
from hashlib import sha256
from html import escape, unescape
from pathlib import Path
import json
import re
from related_tool_cards import ensure_icons, render as related_cards

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "content/smart-tools"
TOOLS = json.loads((DATA / "catalog.json").read_text("utf-8"))
UI = json.loads((DATA / "interface.json").read_text("utf-8"))
GUIDES = json.loads((DATA / "guides.json").read_text("utf-8"))
PREFIX = {"en":"", "es":"es/", "ar":"ar/", "pt-BR":"pt-br/"}
BASE = "https://convertios.com"
LOCAL = {"svg-to-png", "image-metadata-remover"}


def read(rel):
    return (ROOT / rel).read_text("utf-8")


def write(rel, text):
    target = ROOT / rel
    if target.exists() and target.read_text("utf-8") == text:
        return
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text, encoding="utf-8", newline="\n")


def url(lang, slug):
    return f"{BASE}/{PREFIX[lang]}{slug}/"


def alternatives(slug):
    return {**{lang:url(lang,slug) for lang in PREFIX}, "x-default":url("en",slug)}


def options(slug, lang, t):
    controls = []
    def number(key, default, low, high, label=None):
        controls.append(f'<label>{t[label or key]}<input type="number" name="{key}" value="{default}" min="{low}" max="{high}" step="1" required></label>')
    def select(key, values, current):
        choices = "".join(f'<option value="{k}"{" selected" if k == current else ""}>{v}</option>' for k,v in values.items())
        controls.append(f'<label>{t[key]}<select name="{key}">{choices}</select></label>')
    if slug == "heic-to-jpg":
        number("quality",88,50,95)
    elif slug == "mp4-to-gif":
        number("start",0,0,299)
        number("seconds",3,1,8)
        number("width",320,64,640,"edge")
        number("fps",10,2,15)
        number("colors",128,16,256)
    elif slug == "video-compressor":
        select("preset",{key:t[key] for key in ["light","balanced","small"]},"balanced")
    elif slug == "image-to-text":
        select("lang",{"eng":"English","spa":"Español","ara":"العربية","por":"Português"},
               {"en":"eng","es":"spa","ar":"ara","pt-BR":"por"}[lang])
    elif slug == "gif-compressor":
        number("loss",30,0,100)
    elif slug == "svg-to-png":
        number("width",1024,16,4096)
        select("background",{k:t[k] for k in ["transparent","white"]},"transparent")
    if slug == "mp4-to-gif":
        advanced = "".join(controls[2:])
        controls = controls[:2] + [f'<details class="smart-advanced"><summary>{t["advanced"]}</summary><div class="smart-options">{advanced}</div></details>']
    return '\n'.join(controls)


def heading(lang, path):
    for item in TOOLS:
        if item["slug"] == path:
            return item["copy"][lang]["title"]
    match = re.search(r'<h1\b[^>]*>(.*?)</h1>',read(PREFIX[lang]+path+"/index.html"),re.S)
    return unescape(re.sub(r'<[^>]+>','',match[1])).strip()


def tool_information(tool, lang):
    labels = GUIDES["headings"][lang]
    local = tool["slug"] in LOCAL
    values = [
        (labels["browser"], labels["yes"] if local else labels["no"]),
        (labels["upload"], labels["local"] if local else labels["remote"]),
        (labels["third"], labels["none"]),
        (labels["retention"], labels["localret"] if local else labels["remoteret"]),
        (labels["size"], f'{tool["limit"]} MiB'),
        (labels["formats"], f'{tool["formats"]} → {tool["ext"].upper()}'),
    ]
    cells = "".join(
        f'<div><strong>{escape(key)}:</strong><span>{escape(value)}</span></div>'
        for key, value in values
    )
    return (f'<section class="tool-info-block" aria-labelledby="tool-info-heading">'
            f'<h2 id="tool-info-heading">{escape(labels["info"])}</h2>'
            f'<div class="tool-info-grid">{cells}</div></section>')


def rich_guide(tool, lang):
    h = GUIDES["headings"][lang]
    details = GUIDES["tools"][tool["slug"]][lang]
    local = tool["slug"] in LOCAL
    steps = "".join(f'<li>{escape(step)}</li>' for step in h["steps"])
    limit = f'{tool["limit"]} MiB'
    return (
        f'<section class="tool-description page-guide" aria-labelledby="guide-heading">'
        f'<h2 id="guide-heading">{escape(h["why"])}</h2><p>{escape(details["use"])}</p>'
        f'<h2>{escape(h["how"])}</h2><ol>{steps}</ol>'
        f'<h2>{escape(h["limits"])}</h2><p>{escape(details["limits"])}</p>'
        f'<h2>{escape(UI[lang]["help"])}</h2><p>{escape(tool["copy"][lang]["help"])}</p>'
        f'<h2>{escape(h["faq"])}</h2>'
        f'<h3>{escape(details["question"])}</h3><p>{escape(details["answer"])}</p>'
        f'<h3>{escape(h["upload"])}</h3><p>{escape(h["localret"] if local else h["remoteret"])}</p>'
        f'<h3>{escape(h["size"])}</h3><p>{escape(limit)} {escape(UI[lang]["perfile"])}.</p>'
        f'<p class="guide-note">{escape(h["read"])}: '
        f'<a href="/{PREFIX[lang]}blog/{tool["article"]}/">'
        f'{escape(heading(lang,"blog/"+tool["article"]))}</a></p>'
        f'</section>'
    )


def more_tools(tool, lang):
    return related_cards(tool["slug"], lang, GUIDES["related_tools"][tool["slug"]])


def render(tool, lang):
    slug = tool["slug"]
    t, copy = UI[lang], tool["copy"][lang]
    title, desc = escape(copy["title"]), escape(copy["description"])
    canonical = url(lang,slug)
    template = read(PREFIX[lang]+"jpg-to-png/index.html")
    # Reuse the actual localized site shell. Only the language selector changes destination.
    header = re.search(r'<body[^>]*>(.*?)</header>',template,re.S)[1] + "</header>"
    header = re.sub(r'<details class="language-selector".*?</details>',
                    lambda m:m[0].replace('/jpg-to-png/',f'/{slug}/'), header, flags=re.S)
    footer = re.search(r'<footer\b.*?</footer>',template,re.S)[0]
    integrations = re.search(r'<!-- Google tag.*?</script>\s*<script>.*?</script>',template,re.S)
    if not integrations:
        integrations = re.search(r'<script async src="https://www.googletagmanager.com.*?</script>\s*<script>.*?</script>',template,re.S)
    ads = re.search(r'<script[^>]+adsbygoogle\.js[^>]*></script>',template)[0]
    common_links = re.findall(r'<link [^>]*(?:rel="(?:icon|apple-touch-icon)"|href="/(?:style\.min|neon-home|rtl)\.css)[^>]*>',template)
    links = '\n'.join(common_links)
    alts = '\n'.join(f'<link rel="alternate" hreflang="{k}" href="{v}">' for k,v in alternatives(slug).items())
    count = 6 if slug.startswith("heic-to-") else 1
    graph = [{"@type":"WebApplication","name":copy["title"],"url":canonical,"inLanguage":lang,
              "applicationCategory":"UtilitiesApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}},
             {"@type":"BreadcrumbList","itemListElement":[
                 {"@type":"ListItem","position":1,"name":t["tools"],"item":url(lang,"all-tools")},
                 {"@type":"ListItem","position":2,"name":copy["title"],"item":canonical}]}]
    schema = json.dumps({"@context":"https://schema.org","@graph":graph},ensure_ascii=False)
    config = dict(tool=slug,extension=tool["ext"],limit=tool["limit"],maxFiles=count,local=slug in LOCAL,
                  messages={k:v for k,v in t.items() if k.isupper() or k in
                            "up down empty working files download before after edit done partial".split()})
    backend_ui = '' if slug in LOCAL else '<script src="/js/tool-ui.js" defer></script>'
    html = f'''<!DOCTYPE html>
<html lang="{lang}" dir="{'rtl' if lang == 'ar' else 'ltr'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} | Convertios</title>
<meta name="description" content="{desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{canonical}">
{alts}
<meta property="og:type" content="website">
<meta property="og:locale" content="{dict(en='en_US',es='es_ES',ar='ar_JO',**{'pt-BR':'pt_BR'})[lang]}">
<meta property="og:url" content="{canonical}">
<meta property="og:title" content="{title} | Convertios">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{BASE}/convertios-logo.png">
<meta name="twitter:card" content="summary_large_image">
{links}
<link rel="stylesheet" href="/smart-tools.css">
{integrations[0]}
{ads}
<script type="application/ld+json">{schema}</script>
{backend_ui}
<script src="/script.min.js" defer></script>
<script src="/js/smart-tools.js" type="module"></script>
</head>
<body class="neon-site-header">{header}
<main class="smart-page" id="main-content">
<nav class="smart-crumb" aria-label="{t['tools']}"><a href="/{PREFIX[lang]}all-tools/">{t['tools']}</a><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
<section class="smart-panel">
<h1>{title}</h1><p>{desc}</p>
<form id="smart-form"><fieldset>
<label class="smart-drop" id="smart-drop">{t['choose']}
<small>{tool['formats']} · {t['max']} {tool['limit']} MiB {t['perfile']}{' · 6 '+t['files'] if count > 1 else ''}</small>
<input type="file" name="file" accept="{tool['accept']}"{' multiple' if count>1 else ''}></label>
<ol id="queue" aria-label="{t['selection']}"></ol>
<div class="smart-options">{options(slug,lang,t)}</div>
<p>{t['local' if slug in LOCAL else 'server']}</p>
<button type="submit" id="smart-run">{t['run']}</button>
</fieldset></form>
<p id="smart-status" role="status" aria-live="polite"></p><div id="results"></div>
</section>
{tool_information(tool,lang)}
{rich_guide(tool,lang)}
{more_tools(tool,lang)}
</main>
{footer}
<script type="application/json" id="smart-config">{json.dumps(config,ensure_ascii=False)}</script>
</body></html>
'''
    def stamp(m):
        data = (ROOT/m[2][1:]).read_bytes().replace(b'\r\n',b'\n')
        return f'{m[1]}{m[2]}?v={sha256(data).hexdigest()[:8]}"'
    return re.sub(r'((?:src|href)=")(/[\w./-]+\.(?:js|css))(?:\?v=\w+)?"',stamp,html)


def update_hub(lang, hub, groups):
    rel = PREFIX[lang]+hub+"/index.html"
    text = read(rel)
    for anchor, tools in groups.items():
        start, end = f"<!-- smart-tools:{anchor} -->", f"<!-- /smart-tools:{anchor} -->"
        card = re.search(r'<a\b(?=[^>]*class="(tool-card|tool-link)")(?=[^>]*href="/'+PREFIX[lang]+anchor+r'/")[^>]*>.*?</a>',text,re.S)
        if not card:
            raise ValueError((rel,anchor))
        items = []
        for tool in tools:
            copy = tool["copy"][lang]
            tag = "h3" if card[1] == "tool-card" else "h2"
            icon = f'<div class="tool-icon-wrap" aria-hidden="true">{tool["ext"].upper()}</div>' if tag == "h3" else ""
            items.append(f'<a href="/{PREFIX[lang]}{tool["slug"]}/" class="{card[1]}">{icon}<{tag}>{escape(copy["title"])}</{tag}><p>{escape(copy["description"])}</p></a>')
        block = start+'\n'+'\n'.join(items)+'\n'+end
        if start in text:
            text = re.sub(re.escape(start)+r'.*?'+re.escape(end),lambda _:block,text,flags=re.S)
        else:
            text = text[:card.end()]+'\n'+block+text[card.end():]
    write(rel,text)


def main():
    ensure_icons()
    sitemap = []
    for tool in TOOLS:
        for lang in PREFIX:
            write(PREFIX[lang]+tool['slug']+'/index.html',render(tool,lang))
            alts = '\n'.join(f'  <xhtml:link rel="alternate" hreflang="{k}" href="{v}"/>' for k,v in alternatives(tool["slug"]).items())
            sitemap.append(f'<url>\n  <loc>{url(lang,tool["slug"])}</loc>\n{alts}\n</url>')
    anchors = {"pdf-to-word":{"heic-to-pdf","pdf-to-text"}, "video-converter":{"mp4-to-gif","video-compressor"}}
    groups = {anchor:[tool for tool in TOOLS if tool["slug"] in slugs] for anchor,slugs in anchors.items()}
    groups["png-to-jpg"] = [tool for tool in TOOLS if not any(tool["slug"] in v for v in anchors.values())]
    for lang in PREFIX:
        hub_groups = dict(groups)
        if lang == "ar":
            hub_groups["mp3-cutter"] = hub_groups.pop("video-converter")
        update_hub(lang,"all-tools",hub_groups)
        for hub,anchor in [("pdf-tools","pdf-to-word"),("image-tools","png-to-jpg"),("audio-tools","video-converter")]:
            update_hub(lang,hub,{anchor:groups[anchor]})
    text = read("sitemap.xml")
    block = "<!-- smart-tools:start -->\n"+"\n".join(sitemap)+"\n<!-- smart-tools:end -->"
    if "<!-- smart-tools:start -->" in text:
        text = re.sub(r'<!-- smart-tools:start -->.*?<!-- smart-tools:end -->',lambda _:block,text,flags=re.S)
    else:
        text = text.replace("</urlset>", block+"\n</urlset>")
    write("sitemap.xml",text)


if __name__ == "__main__":
    main()
