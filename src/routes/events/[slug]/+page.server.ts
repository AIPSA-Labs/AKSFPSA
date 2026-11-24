//- Server Load Function for Event Details SSR and SEO
import type { PageServerLoad } from './$types';
import { sql } from '$lib/server/db';
import { SITE_CONFIG } from '$lib/constants/strings';
import { error } from '@sveltejs/kit';
import type { BlogPost } from '$lib/stores/data';

export const load: PageServerLoad = async ({ params }) => {
	try {
		let [event] = await sql<BlogPost>`SELECT * FROM blog_posts WHERE slug = ${params.slug} AND type = 'event' AND status = 'published'`;
		if (!event) {
			const [ev] = await sql<{
				id: number;
				slug: string;
				title: string;
				date: string;
				location: string;
				type: string;
				description: string;
			}>`SELECT * FROM events WHERE slug = ${params.slug}`;

			if (ev) {
				event = {
					id: ev.id,
					title: ev.title,
					slug: ev.slug,
					excerpt: ev.description,
					content: ev.description,
					author: SITE_CONFIG.SHORT_NAME,
					date: ev.date,
					status: 'published',
					cover: '',
					tags: [ev.type || 'Event', ev.location || 'Kerala'],
					type: 'event'
				};
			}
		}

		if (!event) {
			throw error(404, 'Event not found');
		}

		const eventCover = event.cover;
		const imageUrl = eventCover
			? eventCover.startsWith('http')
				? eventCover
				: `${SITE_CONFIG.BASE_URL}${eventCover}`
			: `${SITE_CONFIG.BASE_URL}/logo.png`;

		return {
			event,
			meta: {
				title: `${event.title} | AKSFPSA Events`,
				description: event.excerpt || event.title,
				image: imageUrl
			}
		};
	} catch (e) {
		throw error(404, 'Event not found');
	}
};
