// - Dynamic XML Sitemap Generator with Live Database Synchronization
import type { RequestHandler } from './$types';
import { SITE_CONFIG } from '$lib/constants/strings';
import { sql } from '$lib/server/db';

interface RouteEntry {
	loc: string;
	changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
	priority: string;
}

const staticRoutes: RouteEntry[] = [
	{ loc: '', changefreq: 'daily', priority: '1.0' },
	{ loc: '/about', changefreq: 'monthly', priority: '0.9' },
	{ loc: '/services', changefreq: 'weekly', priority: '0.9' },
	{ loc: '/circulars', changefreq: 'daily', priority: '0.9' },
	{ loc: '/courses', changefreq: 'weekly', priority: '0.8' },
	{ loc: '/events', changefreq: 'weekly', priority: '0.8' },
	{ loc: '/gallery', changefreq: 'weekly', priority: '0.7' },
	{ loc: '/leadership', changefreq: 'monthly', priority: '0.7' },
	{ loc: '/membership', changefreq: 'monthly', priority: '0.9' },
	{ loc: '/membership/apply', changefreq: 'monthly', priority: '0.8' },
	{ loc: '/contact', changefreq: 'monthly', priority: '0.8' },
	{ loc: '/blog', changefreq: 'daily', priority: '0.8' }
];

const today = new Date().toISOString().split('T')[0];

function generateUrlXml(
	loc: string,
	changefreq: string,
	priority: string,
	lastmodDate?: string
): string {
	const mod = lastmodDate || today;
	return `  <url>
    <loc>${SITE_CONFIG.BASE_URL}${loc}</loc>
    <lastmod>${mod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: RequestHandler = async () => {
	const staticUrls = staticRoutes.map((r) => generateUrlXml(r.loc, r.changefreq, r.priority));

	// - Dynamically load live content from the database
	let coursePaths: string[] = [];
	let blogSlugs: string[] = [];
	let eventSlugs: string[] = [];
	let gallerySlugs: string[] = [];

	try {
		const liveCourses = await sql<{ id: number; link: string }>`
			SELECT id, link FROM courses
		`;
		if (liveCourses && liveCourses.length > 0) {
			coursePaths = liveCourses.map((c) => (c.link && c.link.startsWith('/') ? c.link : `/courses/${c.id}`));
		}

		const livePosts = await sql<{ slug: string; type: string }>`
			SELECT slug, type FROM blog_posts WHERE status = 'published'
		`;
		if (livePosts && livePosts.length > 0) {
			blogSlugs = livePosts.filter((p) => p.type === 'post').map((p) => p.slug);
			eventSlugs = livePosts.filter((p) => p.type === 'event').map((p) => p.slug);
		}

		const liveEvents = await sql<{ slug: string }>`
			SELECT slug FROM events WHERE slug IS NOT NULL AND slug != ''
		`;
		if (liveEvents && liveEvents.length > 0) {
			eventSlugs = Array.from(new Set([...eventSlugs, ...liveEvents.map((e) => e.slug)]));
		}

		const liveGalleries = await sql<{ slug: string }>`
			SELECT slug FROM gallery_albums WHERE slug IS NOT NULL AND slug != ''
		`;
		if (liveGalleries && liveGalleries.length > 0) {
			gallerySlugs = liveGalleries.map((g) => g.slug);
		}
	} catch {
		// - Return static routes if database is temporarily unavailable
	}

	const courseUrls = coursePaths.map((path) => generateUrlXml(path, 'weekly', '0.7'));
	const eventUrls = eventSlugs.map((slug) => generateUrlXml(`/events/${slug}`, 'weekly', '0.7'));
	const galleryUrls = gallerySlugs.map((slug) =>
		generateUrlXml(`/gallery/${slug}`, 'weekly', '0.6')
	);
	const blogUrls = blogSlugs.map((slug) => generateUrlXml(`/blog/${slug}`, 'weekly', '0.7'));

	const allUrls = [...staticUrls, ...courseUrls, ...eventUrls, ...galleryUrls, ...blogUrls];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600'
		}
	});
};
