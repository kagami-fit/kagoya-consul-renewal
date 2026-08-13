import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'src', 'wp-sale');
fs.mkdirSync(outDir, { recursive: true });

const api = 'https://kagoya-consul.co.jp/wp-json/wp/v2';
const posts = await (await fetch(`${api}/sale?per_page=100`)).json();
const items = [];
for (const post of posts) {
  let image = '';
  const mediaLink = post._links?.['wp:featuredmedia']?.[0]?.href;
  if (mediaLink) {
    try {
      const media = await (await fetch(mediaLink)).json();
      image = media.media_details?.sizes?.large?.source_url || media.source_url || '';
      if (image) {
        const ext = image.split('?')[0].split('.').pop() || 'jpg';
        const file = `${post.id}.${ext}`;
        const bytes = Buffer.from(await (await fetch(image)).arrayBuffer());
        fs.writeFileSync(path.join(outDir, file), bytes);
        image = `src/wp-sale/${file}`;
      }
    } catch {}
  }
  items.push({ id: post.id, title: post.title?.rendered || '', date: post.date?.slice(0, 10) || '', slug: post.slug || '', image });
}
fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(path.join(root, 'data', 'sale-items.json'), JSON.stringify({ source: 'https://kagoya-consul.co.jp/sale/', fetchedAt: new Date().toISOString(), count: items.length, items }, null, 2));
console.log(`migrated ${items.length} sale items`);
