import fs from 'node:fs';
import path from 'node:path';

// Keep this fallback in sync with the production domain. Vercel builds do not
// necessarily expose NEXT_PUBLIC_APP_URL, and emitting the former .com domain
// made the sitemap unusable for the live .xyz property in Search Console.
const siteUrl = (
  process.env.NEXT_PUBLIC_APP_URL || 'https://www.quizboardly.xyz'
)
  .trim()
  .replace(/\/$/, '');

const keywordSlugs = [
  'jeopardy-game-maker',
  'make-a-jeopardy-game',
  'free-jeopardy-game-maker',
  'how-to-make-a-jeopardy-game',
  'jeopardy-powerpoint',
  'jeopardy-google-slides',
  'ai-jeopardy-game-maker',
  'classroom-review-game-maker',
  'quiz-board-maker',
  'templates',
  'from-pdf',
  'team-quiz',
  'online-jeopardy',
];

const supportingSlugs = ['blog', 'pricing', 'showcases'];

const publicDir = path.join(process.cwd(), 'public');
// Keep the stable Google sitemap endpoint as the single source of truth.
const authoritativeSitemapFilename = 'google-sitemap.xml';
const pageSlugs = ['', ...keywordSlugs, ...supportingSlugs];

const googleSitemapUrls = pageSlugs.map((slug) => {
  const loc = `${siteUrl}/${slug}`.replace(/\/$/, '') || siteUrl;
  return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
});

const lastmod = new Date().toISOString();
const sitemapUrls = pageSlugs.map((slug) => {
  const loc = `${siteUrl}/${slug}`.replace(/\/$/, '') || siteUrl;
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${slug ? '0.8' : '1.0'}</priority>\n  </url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`;
// A separate stable endpoint gives Google a clean sitemap after the previous
// sitemap advertised the retired .com hostname. Avoid volatile lastmod values
// and ignored priority/changefreq fields here, matching Google's core format.
const googleSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${googleSitemapUrls.join('\n')}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nDisallow: /activity/\nDisallow: /settings/\nDisallow: /privacy-policy\nDisallow: /terms-of-service\n\nSitemap: ${siteUrl}/${authoritativeSitemapFilename}\n`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDir, 'google-sitemap.xml'), googleSitemap);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
console.log(`Generated static sitemaps and robots.txt for ${siteUrl}`);
