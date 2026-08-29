import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const pages = [
  'index.html', 'about.html', 'contact.html', 'corporate-benefits.html', 'faq.html',
  'features.html', 'for-sale.html', 'inheritance-vacant-house.html', 'insights.html',
  'news.html', 'privacy.html', 'properties.html', 'property-detail.html',
  'property-management.html', 'purchase-asset.html', 'sale-consulting.html',
  'service.html', 'services.html', 'team.html',
  'blog/check-before-price-cut.html', 'blog/inherited-property-first-steps.html',
  'blog/rebuild-impossible-property.html'
];

let annotated = 0;
for (const page of pages) {
  const file = path.join(root, page);
  let html = await fs.readFile(file, 'utf8');
  html = html.replace(/\sdata-cms-id=["'][^"']+["']/gi, '');
  const original = html;
  html = replaceMarkerRegion(html, 'MAIN', (main) => annotateMain(main, page));
  if (html === original) html = html.replace(/(<main\b[^>]*>)([\s\S]*?)(<\/main>)/i, (_, open, inner, close) => `${open}${annotateMain(inner, page)}${close}`);
  html = replaceMarkerRegion(html, 'HEADER', (part) => annotateScope(part, 'common', 'common-header'));
  html = replaceMarkerRegion(html, 'FOOTER', (part) => annotateScope(part, 'common', 'common-footer'));
  if (html !== original) await fs.writeFile(file, html, 'utf8');
}
console.log(JSON.stringify({ ok: true, annotated }));

function replaceMarkerRegion(html, marker, transform) {
  const expression = new RegExp(`(<!--\\s*ZOROYA:${marker}\\s*-->)([\\s\\S]*?)(<!--\\s*\\/ZOROYA:${marker}\\s*-->)`, 'i');
  return html.replace(expression, (_, start, inner, end) => `${start}${transform(inner)}${end}`);
}

function annotateMain(main, page) {
  let matched = false;
  let count = 0;
  const output = main.replace(/(<section\b([^>]*)>)([\s\S]*?)(<\/section>)/gi, (_, open, attrs, inner, close) => {
    matched = true;
    count += 1;
    const id = attr(attrs, 'id');
    const classes = attr(attrs, 'class').split(/\s+/).filter(Boolean);
    const scope = id || `${classes[0] || 'section'}-${count}`;
    return `${open}${annotateScope(inner, page, scope)}${close}`;
  });
  return matched ? output : annotateScope(main, page, 'main');
}

function annotateScope(scopeHtml, page, scopeName) {
  let sequence = 0;
  return scopeHtml.replace(/<(h[1-6]|p|li|button|summary|dt|dd|th|td|label|figcaption|small|address|a)\b([^>]*)>([\s\S]*?)<\/\1>/gi, (full, tag, attrs, inner) => {
    if (tag.toLowerCase() === 'a' && /<(h[1-6]|p|li|button|summary|dt|dd|figcaption)\b/i.test(inner)) return full;
    const text = cleanText(inner);
    if (!text || /^[→←↑↓↗＋+\-–—|／/\s]+$/.test(text)) return full;
    sequence += 1;
    const explicitId = attr(attrs, 'id');
    const contentId = `${safeId(page.replace(/\.html$/i, ''))}_${safeId(scopeName)}_${tag.toUpperCase()}_${String(sequence).padStart(3, '0')}${explicitId ? '_' + safeId(explicitId) : ''}`;
    if (/\bdata-cms-id\s*=/.test(attrs)) return full;
    annotated += 1;
    return `<${tag}${attrs} data-cms-id="${contentId}">${inner}</${tag}>`;
  });
}

function attr(attrs, name) {
  const match = attrs.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return match ? match[1] : '';
}

function cleanText(html) {
  return decodeHtml(String(html || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' '))
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&#x([0-9a-f]+);/gi, (_, number) => String.fromCodePoint(parseInt(number, 16)));
}

function safeId(value) {
  return value.normalize('NFKC').replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 48) || 'BLOCK';
}
