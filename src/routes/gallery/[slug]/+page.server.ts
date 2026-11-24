//- Server Load Function for Gallery Album SSR and SEO
import type { PageServerLoad } from './$types';
import { sql } from '$lib/server/db';
import { SITE_CONFIG } from '$lib/constants/strings';
import { error } from '@sveltejs/kit';
import type { GalleryAlbum, GalleryImage } from '$lib/stores/data';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const [album] = await sql<GalleryAlbum>`SELECT * FROM gallery_albums WHERE slug = ${params.slug}`;
		if (!album) {
			throw error(404, 'Album not found');
		}

		const images = await sql<GalleryImage>`SELECT * FROM gallery_images WHERE album_id = ${album.id} ORDER BY id`;
		album.images = images;

		const albumCover = album.cover;
		const imageUrl = albumCover
			? albumCover.startsWith('http')
				? albumCover
				: `${SITE_CONFIG.BASE_URL}${albumCover}`
			: `${SITE_CONFIG.BASE_URL}/logo.png`;

		return {
			album,
			meta: {
				title: `${album.title} | AKSFPSA Gallery`,
				description:
					album.description ||
					`${album.title} - Photo gallery from All Kerala Self Financing Private Schools Association (AKSFPSA)`,
				image: imageUrl
			}
		};
	} catch (e) {
		throw error(404, 'Album not found');
	}
};
