import type { RequestHandler } from "./$types";

const baseUrl = "https://yourdomain.com";

const staticRoutes = [
	"",
	"/about",
	"/membership",
	"/membership/apply",
	"/courses",
	"/events",
	"/gallery",
	"/leadership",
	"/members",
	"/contact",
	"/circulars"
];

const courses = [
	"school-governance",
	"teacher-certification"
];

const events = [
	"annual-leadership-meet-2026",
	"district-coordinators-meet",
	"teacher-certification-workshop"
];

const galleries = [
	"conference-2026",
	"district-meet-malappuram"
];

function generateUrl(loc: string) {
	return `
		<url>
			<loc>${baseUrl}${loc}</loc>
			<changefreq>monthly</changefreq>
			<priority>0.8</priority>
		</url>
	`;
}

export const GET: RequestHandler = async () => {
	const urls = [
		...staticRoutes.map((route) => generateUrl(route)),
		...courses.map((slug) => generateUrl(`/courses/${slug}`)),
		...events.map((slug) => generateUrl(`/events/${slug}`)),
		...galleries.map((slug) => generateUrl(`/gallery/${slug}`))
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${urls.join("")}
		</urlset>`;

	return new Response(sitemap, {
		headers: {
			"Content-Type": "application/xml"
		}
	});
};
