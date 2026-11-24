import type { RequestHandler } from './$types';
import { SITE_CONFIG } from '$lib/constants/strings';

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

const courseSlugs = [
	'school-governance',
	'teacher-certification',
	'financial-planning',
	'digital-infrastructure'
];

const eventSlugs = [
	'annual-leadership-meet-2026',
	'district-coordinators-meet',
	'teacher-certification-workshop'
];

const gallerySlugs = ['conference-2026', 'district-meet-malappuram', 'teacher-certification-2025'];

const blogSlugs = [
	'teacher-certification-program-open',
	'annual-leadership-meet-2026',
	'district-coordinators-meet'
];

const today = new Date().toISOString().split('T')[0];

function generateUrlXml(loc: string, changefreq: string, priority: string): string {
	return `  <url>
    <loc>${SITE_CONFIG.BASE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: RequestHandler = async () => {
	const staticUrls = staticRoutes.map((r) => generateUrlXml(r.loc, r.changefreq, r.priority));
	const courseUrls = courseSlugs.map((slug) => generateUrlXml(`/courses/${slug}`, 'weekly', '0.7'));
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
