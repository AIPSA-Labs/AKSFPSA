import type { RequestHandler } from './$types';
import { SITE_CONFIG } from '$lib/constants/strings';

export const GET: RequestHandler = async () => {
	const body = `# =============================================================================
# Robots.txt for All Kerala Self-Financing Private Schools Association (AKSFPSA)
# Official Website: ${SITE_CONFIG.BASE_URL}
# =============================================================================

User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

# Sitemap Location
Sitemap: ${SITE_CONFIG.BASE_URL}/sitemap.xml
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	});
};
