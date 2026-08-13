import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'src', 'wp-sale');
fs.mkdirSync(outDir, { recursive: true });

const api = 'https://kagoya-consul.co.jp/wp-json/wp/v2';
const clean = (html) => html.replace(/<br\s*\/?>/gi, '／').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#038;/g, '&').replace(/&amp;/g, '&').replace(/\s+/g, ' ').replace(/／{2,}/g, '／').trim();
const detailFields = (html) => {
  const fields = {};
  const re = /<dt[^>]*>([\s\S]*?)<\/dt>[\s\S]*?<dd[^>]*>([\s\S]*?)<\/dd>/gi;
  let m;
  while ((m = re.exec(html))) fields[clean(m[1])] = clean(m[2]);
  return fields;
};
const posts = await (await fetch(`${api}/sale?per_page=100`)).json();
const items = [];
for (const post of posts) {
  const gallery = [];
  try {
    const mediaLink = post._links?.['wp:attachment']?.[0]?.href;
    const attachments = mediaLink ? await (await fetch(`${mediaLink}&per_page=100`)).json() : [];
    for (const [index, media] of attachments.entries()) {
      const imageUrl = media.media_details?.sizes?.large?.source_url || media.media_details?.sizes?.medium_large?.source_url || media.source_url || '';
      if (!imageUrl || gallery.some((entry) => entry.source === imageUrl)) continue;
      const ext = (imageUrl.split('?')[0].split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const file = `${post.id}-${String(index + 1).padStart(2, '0')}.${ext}`;
      const bytes = Buffer.from(await (await fetch(imageUrl)).arrayBuffer());
      fs.writeFileSync(path.join(outDir, file), bytes);
      gallery.push({ source: imageUrl, path: `src/wp-sale/${file}` });
    }
  } catch {}
  if (!gallery.length) {
    const mediaLink = post._links?.['wp:featuredmedia']?.[0]?.href;
    try {
      const media = mediaLink ? await (await fetch(mediaLink)).json() : null;
      const imageUrl = media?.media_details?.sizes?.large?.source_url || media?.source_url || '';
      if (imageUrl) {
        const ext = (imageUrl.split('?')[0].split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
        const file = `${post.id}-01.${ext}`;
        const bytes = Buffer.from(await (await fetch(imageUrl)).arrayBuffer());
        fs.writeFileSync(path.join(outDir, file), bytes);
        gallery.push({ source: imageUrl, path: `src/wp-sale/${file}` });
      }
    } catch {}
  }
  let fields = {};
  try { fields = detailFields(await (await fetch(post.link)).text()); } catch {}
  items.push({ id: post.id, title: post.title?.rendered || '', date: post.date?.slice(0, 10) || '', slug: post.slug || '', image: gallery[0]?.path || '', gallery: gallery.map((entry) => entry.path), link: post.link, fields });
}
fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(path.join(root, 'data', 'sale-items.json'), JSON.stringify({ source: 'https://kagoya-consul.co.jp/sale/', fetchedAt: new Date().toISOString(), count: items.length, items }, null, 2));
console.log(`migrated ${items.length} sale items`);
