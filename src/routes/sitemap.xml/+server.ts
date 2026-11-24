//- Dynamic XML Sitemap Generator with Live Database Synchronization
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

const fallbackCourseSlugs = [
	'school-governance',
	'teacher-certification',
	'financial-planning',
	'digital-infrastructure'
];

const fallbackEventSlugs = [
	'annual-leadership-meet-2026',
	'district-coordinators-meet',
	'teacher-certification-workshop'
];

const fallbackGallerySlugs = [
	'conference-2026',
	'district-meet-malappuram',
	'teacher-certification-2025'
];

const fallbackBlogSlugs = [
	'teacher-certification-program-open',
	'annual-leadership-meet-2026',
	'district-coordinators-meet'
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

	//- Dynamically load live blog posts and events from the database
	let blogSlugs = fallbackBlogSlugs;
	let eventSlugs = fallbackEventSlugs;
	let gallerySlugs = fallbackGallerySlugs;

	try {
		const livePosts = await sql<{ slug: string; type: string }>`
			SELECT slug, type FROM blog_posts WHERE status = 'published'
		`;
		if (livePosts && livePosts.length > 0) {
			const blogs = livePosts.filter((p) => p.type === 'post').map((p) => p.slug);
			const events = livePosts.filter((p) => p.type === 'event').map((p) => p.slug);
			if (blogs.length > 0) {
				blogSlugs = Array.from(new Set([...blogs, ...fallbackBlogSlugs]));
			}
			if (events.length > 0) {
				eventSlugs = Array.from(new Set([...events, ...fallbackEventSlugs]));
			}
		}

		const liveGalleries = await sql<{ slug: string }>`
			SELECT slug FROM gallery_albums WHERE slug IS NOT NULL AND slug != ''
		`;
		if (liveGalleries && liveGalleries.length > 0) {
			gallerySlugs = Array.from(
				new Set([...liveGalleries.map((g) => g.slug), ...fallbackGallerySlugs])
			);
		}
	} catch {
		//- Keep fallback slugs if database is temporarily unavailable
	}

	const courseUrls = fallbackCourseSlugs.map((slug) =>
		generateUrlXml(`/courses/${slug}`, 'weekly', '0.7')
	);
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
