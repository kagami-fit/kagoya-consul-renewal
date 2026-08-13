import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const api = 'https://kagoya-consul.co.jp/wp-json/wp/v2';

const decodeEntities = (value = '') => value
  .replace(/&#8217;|&#x2019;/gi, '’')
  .replace(/&#8216;|&#x2018;/gi, '‘')
  .replace(/&#8220;|&#x201c;/gi, '“')
  .replace(/&#8221;|&#x201d;/gi, '”')
  .replace(/&#038;|&amp;/gi, '&')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

const cleanText = (html = '') => decodeEntities(html)
  .replace(/<br\s*\/?>(\s*)/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const sanitizeContent = (html = '') => {
  let safe = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?(?:script|style|iframe|object|embed|form|noscript)[^>]*>[\s\S]*?<\/?(?:script|style|iframe|object|embed|form|noscript)>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '')
    .replace(/\s(href|src)\s*=\s*javascript:[^\s>]+/gi, '');
  return decodeEntities(safe)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?(?:script|style|iframe|object|embed|form|noscript)[^>]*>[\s\S]*?<\/?(?:script|style|iframe|object|embed|form|noscript)>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '')
    .replace(/\s(href|src)\s*=\s*javascript:[^\s>]+/gi, '')
    .trim();
};

const categoryLabel = (post) => {
  const terms = (post._embedded?.['wp:term'] || []).flatMap((group) => group || []);
  return terms.find((term) => term.taxonomy === 'category')?.name || 'お知らせ';
};

const kindLabel = (title) => {
  if (/セミナー/.test(title)) return 'セミナー';
  if (/成約/.test(title)) return '成約';
  if (/販売/.test(title)) return '販売';
  return 'お知らせ';
};

const postsResponse = await fetch(`${api}/posts?per_page=100&orderby=date&order=desc&_embed=1`);
if (!postsResponse.ok) throw new Error(`WordPress REST API error: ${postsResponse.status}`);
const posts = await postsResponse.json();
const items = posts.map((post) => {
  const title = decodeEntities(post.title?.rendered || '');
  const rawContent = sanitizeContent(post.content?.rendered || '');
  const contentHtml = rawContent || '<p>元サイトでは本文の掲載はありません。</p>';
  const excerpt = cleanText(post.excerpt?.rendered || contentHtml).slice(0, 220);
  const date = post.date?.slice(0, 10) || '';
  return {
    id: post.id,
    slug: `news-${post.id}`,
    sourceSlug: post.slug || '',
    title,
    date,
    category: categoryLabel(post),
    kind: kindLabel(title),
    excerpt: excerpt || '本文は公式サイトに掲載されていません。',
    contentHtml,
    sourceUrl: post.link || '',
    featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''
  };
});

fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(path.join(root, 'data', 'news-items.json'), JSON.stringify({
  source: 'https://kagoya-consul.co.jp/news/',
  fetchedAt: new Date().toISOString(),
  count: items.length,
  items
}, null, 2));
console.log(`migrated ${items.length} news items`);
