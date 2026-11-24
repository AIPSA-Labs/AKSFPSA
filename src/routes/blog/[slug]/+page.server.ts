//- Server Load Function for Blog Post SSR and SEO
import type { PageServerLoad } from './$types';
import { sql } from '$lib/server/db';
import { SITE_CONFIG } from '$lib/constants/strings';
import { error } from '@sveltejs/kit';
import type { BlogPost } from '$lib/stores/data';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const [post] = await sql<BlogPost>`SELECT * FROM blog_posts WHERE slug = ${params.slug} AND status = 'published'`;
		if (!post) {
			throw error(404, 'Post not found');
		}

		const postCover = post.cover;
		const imageUrl = postCover
			? postCover.startsWith('http')
				? postCover
				: `${SITE_CONFIG.BASE_URL}${postCover}`
			: `${SITE_CONFIG.BASE_URL}/logo.png`;

		return {
			post,
			meta: {
				title: `${post.title} | AKSFPSA`,
				description: post.excerpt || post.title,
				image: imageUrl
			}
		};
	} catch (e) {
		throw error(404, 'Post not found');
	}
};
