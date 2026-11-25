// - Server Load Function for Course Details SSR and SEO
import type { PageServerLoad } from './$types';
import { sql } from '$lib/server/db';
import { SITE_CONFIG } from '$lib/constants/strings';
import { error } from '@sveltejs/kit';
import type { Course } from '$lib/stores/data';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const targetLink = `/courses/${params.slug}`;
		const numericId = Number(params.slug);

		let course: Course | undefined;
		if (!isNaN(numericId) && Number.isInteger(numericId)) {
			const [byId] = await sql<Course>`SELECT * FROM courses WHERE id = ${numericId} OR link = ${targetLink}`;
			course = byId;
		} else {
			const [byLink] = await sql<Course>`SELECT * FROM courses WHERE link = ${targetLink}`;
			course = byLink;
		}

		if (!course) {
			throw error(404, 'Course not found');
		}

		const baseUrl = SITE_CONFIG.BASE_URL;
		const canonicalPath = course.link && course.link.startsWith('/') ? course.link : `/courses/${params.slug}`;

		const schema = {
			'@context': 'https://schema.org',
			'@type': 'Course',
			name: course.title,
			description: course.description,
			provider: {
				'@type': 'Organization',
				name: SITE_CONFIG.SITE_NAME,
				url: baseUrl
			},
			hasCourseInstance: {
				'@type': 'CourseInstance',
				courseMode:
					course.mode === 'Online'
						? 'https://schema.org/OnlineOnly'
						: course.mode === 'Offline'
							? 'https://schema.org/OfflineEventAttendanceMode'
							: 'https://schema.org/MixedEventAttendanceMode',
				location: {
					'@type': 'Place',
					name: 'Kerala',
					address: {
						'@type': 'PostalAddress',
						addressRegion: 'Kerala',
						addressCountry: 'IN'
					}
				}
			}
		};

		return {
			course,
			canonicalPath,
			meta: {
				title: `${course.title} | AKSFPSA Courses`,
				description: course.description || course.title
			},
			schema
		};
	} catch (e) {
		if (e && typeof e === 'object' && 'status' in e) {
			throw e;
		}
		throw error(404, 'Course not found');
	}
};
