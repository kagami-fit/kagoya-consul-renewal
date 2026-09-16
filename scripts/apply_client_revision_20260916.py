#!/usr/bin/env python3
"""2026-09-16承認の削除・写真差し替え。既存HTMLへの限定的な一括変換。"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PHOTOS = [
    ('gen-domain-care', 'gen-inheritance', '相続する住まいと、引き継ぎに向けた資料'),
    ('gen-domain-consulting', 'gen-consultation', '住宅模型と資料を囲んで不動産について相談する様子'),
    ('gen-domain-purchase', 'gen-purchase', '住まいの購入に向けて間取りと条件を確認する様子'),
    ('gen-domain-rights', 'gen-site-survey', '土地の境界と現地の状況を確認するための測量道具と図面'),
    ('gen-domain-fukuri', 'gen-finance', '資産形成の計画を整理する資料と電卓'),
    ('gen-domain-owner', 'project-rental-management', '植栽や共用部が整えられた賃貸住宅のエントランス'),
    ('gen-domain-new-business', 'gen-investment', '不動産と資金計画を学ぶための模型と資料'),
    ('nbc-junior-workshop-01', 'nbc-junior-workshop-02', 'NBCジュニアの活動で子どもたちをサポートするメンター'),
]


def save(name, transform):
    path = ROOT / name
    before = path.read_text(encoding='utf-8')
    after = transform(before)
    if after != before:
        path.write_text(after, encoding='utf-8')
        print(f'updated: {name}')


def remove_visuals(html):
    return re.sub(r'\s*<!-- SUBPAGE:VISUALS -->.*?<!-- /SUBPAGE:VISUALS -->', '', html, flags=re.S)


for name in ['contact.html', 'news.html', 'services.html', 'service.html']:
    save(name, remove_visuals)

for name in ['services.html', 'service.html']:
    save(name, lambda html: re.sub(r'<section\b[^>]*>(?:(?!</section>).)*不動産を起点に、判断に必要な支援をつなぎます。.*?</section>', '', html, flags=re.S))

# 旧URLも、6つのサービス項目を残した現行レイアウトと同じ構成に揃える。
services = (ROOT / 'services.html').read_text(encoding='utf-8')
service_main = re.search(r'<main\b.*?</main>', services, flags=re.S).group()
def sync_service_alias(html):
    main = service_main.replace('data-cms-id="services_', 'data-cms-id="service_')
    html = re.sub(r'<main\b.*?</main>', lambda _: main, html, flags=re.S)
    if 'assets/css/listing-pages.css' not in html:
        html = html.replace('</head>', '<link rel="stylesheet" href="assets/css/listing-pages.css">\n</head>', 1)
    return html


save('service.html', sync_service_alias)

for name in ['for-sale.html', 'properties.html', 'sold-properties.html']:
    def without_counts(html):
        html = re.sub(r'<div class="page-intro__pull">\d+件</div>', '', html)
        html = re.sub(r'(<nav class="listing-categories".*?</nav>)', lambda m: re.sub(r'\s*<span>\d+</span>', '', m.group()), html, flags=re.S)
        return re.sub(r'WordPress掲載物件\s*\d+件', 'WordPress掲載物件', html)
    save(name, without_counts)

for name in ['news.html', 'news-detail.html']:
    def without_news_images(html):
        html = re.sub(r'\s*const imageFor=item=>\{.*?\n\s*\};', '', html, flags=re.S)
        html = re.sub(r'\s*const image=imageFor\(item\);', '', html)
        html = re.sub(r'<span class="notice-row__media">.*?</span>', '', html, flags=re.S)
        return re.sub(r'<figure class="news-detail__visual">.*?</figure>', '', html, flags=re.S)
    save(name, without_news_images)

for name in ['index.html', 'animation-dynamic.html']:
    def top_photos(html):
        def card(match):
            block = match.group()
            for old, new, alt in PHOTOS:
                if f'src/{old}.' not in block:
                    continue
                block = block.replace(f'src/{old}.', f'src/{new}.')
                block = re.sub(r'(<img\b[^>]*\balt=")[^"]*(")', lambda m: m[1] + alt + m[2], block)
            return block
        return re.sub(r'<(?:a|article) class="domain-card".*?</(?:a|article)>', card, html, flags=re.S)
    save(name, top_photos)

def business_template(text):
    for old, new, alt in PHOTOS:
        text = re.sub(r"heroImage: 'src/" + re.escape(old) + r".jpg',\s*heroAlt: '[^']*'", f"heroImage: 'src/{new}.jpg',\n    heroAlt: '{alt}'", text)
    start = text.index('function detailPage(item) {')
    finish = text.index('\nfunction ', start + 10)
    detail = text[start:finish]
    detail = re.sub(r'function detailPage\(item\) \{.*?(?=  return `\$\{head\()', 'function detailPage(item) {\n', detail, count=1, flags=re.S)
    detail = re.sub(r'  <section class="page-sec biz-detail-intro">.*?(?=  <!-- 末尾の問い合わせ文面)', '', detail, flags=re.S)
    text = text[:start] + detail + text[finish:]
    text = text.replace('詳しい支援内容、確認する項目、進め方は、それぞれの専用ページでご覧いただけます。', '気になる事業の紹介ページから、ご相談へお進みいただけます。')
    text = text.replace("writeFileSync(resolve(root, 'image-layout-comparison.html'), imageComparisonPage(), 'utf8');", "if (process.argv.includes('--with-comparison')) writeFileSync(resolve(root, 'image-layout-comparison.html'), imageComparisonPage(), 'utf8');")
    return text

save('scripts/build_business_pages.mjs', business_template)
